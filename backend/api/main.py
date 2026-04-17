from fastapi import FastAPI, HTTPException
import uuid
from fastapi.middleware.cors import CORSMiddleware

from backend.core.schemas import AskRequest, CheckRequest, SearchRequest
from backend.db.neo4j import run_query
from backend.services.rag import get_qa_chain, get_vector_store, _init_rag

app = FastAPI(title="Drug KG RAG API", version="1.0.0")

import os

# Configure Allowed Origins - Use environment variable for production
origins_env = os.getenv("ALLOWED_ORIGINS", "")
if origins_env:
    allowed_origins = [o.strip() for o in origins_env.split(",") if o.strip()]
else:
    allowed_origins = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000"
    ]

print(f"INFO: Configured CORS origins: {allowed_origins}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup():
    _init_rag()  # warm up on start, errors are captured internally


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}


@app.post("/search")
def search(payload: SearchRequest) -> dict:
    try:
        vector_store = get_vector_store()
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))
    
    docs = vector_store.similarity_search_with_score(payload.query, k=payload.k)
    out = []
    for i, (doc, score) in enumerate(docs):
        # Fetch extra metadata if possible
        drug_id = doc.metadata.get("drugbank_id", "")
        drug_name = doc.metadata.get("name", "Unknown Compound")
        
        # Globally unique fallback id for search results
        fallback_id = f"{drug_name.lower().replace(' ', '-')}-{uuid.uuid4().hex[:8]}"
        
        # Basic drug search result
        drug_res = {
            "id": drug_id or fallback_id,
            "name": drug_name,
            "score": float(score),
            "description": doc.page_content,
            "categories": doc.metadata.get("categories", []),
            "status": doc.metadata.get("status", "approved")
        }
        out.append(drug_res)
    return {"query": payload.query, "results": out}


@app.get("/graph")
def get_graph_data(limit: int = 200) -> dict:
    """Returns nodes and links for force-directed graph."""
    query = """
    MATCH (d:Drug)
    WHERE d.embedding IS NOT NULL
    WITH d LIMIT $limit
    OPTIONAL MATCH (d)-[r:TARGETS|INTERACTS_WITH|BELONGS_TO]->(target)
    RETURN d, r, target, labels(d) as d_labels, labels(target) as t_labels, type(r) as r_type
    """
    rows = run_query(query, {"limit": limit})
    
    nodes = {}
    links = []
    
    def add_node(n, labels, label_attr="name"):
        nid = n.get("drugbank_id") or n.get("id")
        if not nid:
            # Stable fallback: derive from name + first label so it's consistent
            name = n.get(label_attr) or n.get("name", "")
            label = labels[0] if labels else "Unknown"
            nid = f"{label}::{name}" if name else None
        if not nid or nid in nodes: return nid
        nodes[nid] = {
            "id": nid,
            "label": n.get(label_attr) or n.get("name", "Unknown"),
            "type": labels[0] if labels else 'Drug'
        }
        return nid

    for row in rows:
        d_node = row["d"]
        r_rel = row["r"]
        t_node = row["target"]
        d_labels = row["d_labels"]
        t_labels = row["t_labels"]
        r_type = row["r_type"]
        
        sid = add_node(d_node, d_labels)
        if r_rel and t_node and sid:
            tid = add_node(t_node, t_labels, label_attr="name")
            if tid:
                links.append({
                    "source": sid,
                    "target": tid,
                    "type": r_type
                })
            
    return {"nodes": list(nodes.values()), "links": links}


@app.get("/drug/{drug_id}")
def get_drug(drug_id: str) -> dict:
    rows = run_query(
        """
        MATCH (d:Drug {drugbank_id: $drug_id})
        OPTIONAL MATCH (d)-[tr:TARGETS]->(t:Target)
        OPTIONAL MATCH (d)-[ir:INTERACTS_WITH]->(i:Drug)
        WITH d, 
             collect(DISTINCT {id: t.id, name: t.name, organism: t.organism, actions: tr.actions}) as targets,
             collect(DISTINCT {drugbank_id: i.drugbank_id, name: i.name, description: ir.description}) as interactions
        RETURN d {.*, targets: targets, interactions: interactions} as drug_data
        """,
        {"drug_id": drug_id},
    )
    if not rows:
        raise HTTPException(status_code=404, detail="Drug not found")
    return rows[0]["drug_data"]


@app.get("/interactions/{drug_name}")
def interactions_by_name(drug_name: str) -> dict:
    rows = run_query(
        """
        MATCH (d:Drug)
        WHERE toLower(d.name) = toLower($drug_name)
        OPTIONAL MATCH (d)-[r:INTERACTS_WITH]->(o:Drug)
        RETURN d.name AS drug_name,
               collect({
                   other_drugbank_id: o.drugbank_id,
                   other_name: o.name,
                   description: r.description
               }) AS interactions
        """,
        {"drug_name": drug_name},
    )
    if not rows:
        raise HTTPException(status_code=404, detail="Drug not found")
    return rows[0]


@app.post("/check")
def check_drug_list(payload: CheckRequest) -> dict:
    if len(payload.drugs) < 2:
        return {"interactions": []}

    import re

    def canonical(name: str) -> str:
        """Strip clinical stereo-/positional prefixes: (R)-, (S)-, N-, l-, etc."""
        cleaned = re.sub(r'^\s*\([RSrspm±+\-]+\)-\s*', '', name.strip())
        cleaned = re.sub(r'^\s*[lLdDNn]-\s*', '', cleaned)
        return cleaned.strip()

    # Merge original + canonical names for broader matching
    all_names = list({n.strip() for n in payload.drugs} |
                     {canonical(n) for n in payload.drugs})

    # Correct Cypher: match all pairs within the name list, then traverse edges directly
    cypher = """
    MATCH (a:Drug) WHERE toLower(a.name) IN [x IN $drugs | toLower(x)]
    MATCH (b:Drug) WHERE toLower(b.name) IN [x IN $drugs | toLower(x)]
      AND elementId(a) < elementId(b)
    MATCH (a)-[r:INTERACTS_WITH]-(b)
    RETURN a.name AS drug_a, b.name AS drug_b, r.description AS description
    """

    rows = run_query(cypher, {"drugs": all_names})

    ranked = []
    seen = set()
    for item in rows:
        key = tuple(sorted([item.get("drug_a", ""), item.get("drug_b", "")]))
        if key in seen:
            continue
        seen.add(key)
        desc = (item.get("description") or "").lower()
        severity = "minor"
        if any(k in desc for k in ["contraindicated", "fatal", "life-threatening"]):
            severity = "critical"
        elif any(k in desc for k in ["major", "severe"]):
            severity = "major"
        elif any(k in desc for k in ["moderate", "monitor"]):
            severity = "moderate"
        ranked.append({**item, "severity": severity})
    return {"interactions": ranked}


@app.get("/alternatives/{drug}/{condition}")
def alternatives(drug: str, condition: str, current_meds: str = "") -> dict:
    meds = [m.strip() for m in current_meds.split(",") if m.strip()]
    rows = run_query(
        """
        MATCH (src:Drug) WHERE toLower(src.name) = toLower($drug)
        MATCH (src)-[:BELONGS_TO]->(c:Category)<-[:BELONGS_TO]-(cand:Drug)
        WHERE cand <> src
        AND (
          toLower(cand.indication) CONTAINS toLower($condition)
          OR toLower(cand.description) CONTAINS toLower($condition)
        )
        WITH src, cand
        OPTIONAL MATCH (cand)-[r:INTERACTS_WITH]-(m:Drug)
        WHERE toLower(m.name) IN [x IN $meds | toLower(x)]
        WITH cand, count(r) AS conflicts
        RETURN cand.drugbank_id AS id, cand.name AS name,
               cand.indication AS indication, conflicts
        ORDER BY conflicts ASC, name ASC
        LIMIT 25
        """,
        {"drug": drug, "condition": condition, "meds": meds},
    )
    return {"source_drug": drug, "condition": condition, "alternatives": rows}


@app.post("/ask")
def ask(payload: AskRequest) -> dict:
    try:
        from backend.services.rag import ask_question_hybrid
        result = ask_question_hybrid(payload.question)
        return {
            "question": payload.question,
            "answer": result["answer"],
            "graph_query": result["graph_query"],
            "retrieved_context": result["retrieved_context"],
        }
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        import traceback
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))
