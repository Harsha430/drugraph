# 🔬 DruGraph Backend - FastAPI + Neo4j + RAG

Python backend powering the DruGraph clinical intelligence platform with **FastAPI**, **Neo4j**, and **LangChain RAG**.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    FastAPI Application                   │
├─────────────────────────────────────────────────────────┤
│  api/main.py          → REST endpoints                  │
│  services/rag.py      → RAG engine (LangChain + Groq)   │
│  db/neo4j.py          → Neo4j driver & queries          │
│  core/config.py       → Environment configuration       │
│  core/schemas.py      → Pydantic request/response       │
└─────────────────────────────────────────────────────────┘
```

---

## 📦 Installation

### 1. Create Virtual Environment

```bash
cd backend

# Create venv
python -m venv venv

# Activate
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

**Dependencies:**
- `fastapi` - Web framework
- `uvicorn[standard]` - ASGI server
- `neo4j` - Graph database driver
- `langchain` - LLM orchestration
- `langchain-groq` - Groq LLM integration
- `langchain-neo4j` - Neo4j vector store
- `sentence-transformers` - Embeddings
- `python-dotenv` - Environment variables
- `pydantic-settings` - Configuration management
- `lxml` - XML parsing
- `requests` - HTTP client
- `tqdm` - Progress bars

### 3. Configure Environment

```bash
# Copy example env file
cp ../.env.example ../.env

# Edit with your credentials
nano ../.env
```

**Required Variables:**
```env
NEO4J_URI=neo4j+s://your-instance.databases.neo4j.io
NEO4J_USERNAME=neo4j
NEO4J_PASSWORD=your-password
NEO4J_DATABASE=neo4j

GROQ_API_KEY=your-groq-api-key
GROQ_MODEL=llama-3.1-8b-instant

EMBEDDING_MODEL=sentence-transformers/all-MiniLM-L6-v2
VECTOR_INDEX_NAME=drug_embeddings
VECTOR_NODE_LABEL=Drug
VECTOR_TEXT_PROPERTY=rag_text
VECTOR_EMBEDDING_PROPERTY=embedding
```

---

## 🚀 Running the Server

### Development Mode (with auto-reload)

```bash
python -m uvicorn api.main:app --reload --host 127.0.0.1 --port 8000
```

### Production Mode

```bash
python -m uvicorn api.main:app --host 0.0.0.0 --port 8000 --workers 4
```

**Server will be available at:**
- API: `http://127.0.0.1:8000`
- Docs: `http://127.0.0.1:8000/docs` (Swagger UI)
- ReDoc: `http://127.0.0.1:8000/redoc`

---

## 📊 Data Pipeline

### Step 1: Parse DrugBank XML

```bash
python -m scripts.parse_drugbank
```

**Input:** `fulldb.xml` (DrugBank full database)  
**Output:** `datasets/*.csv` (drugs, targets, categories, interactions)

**Extracts:**
- Drug metadata (name, description, indication, pharmacology)
- Drug-target relationships
- Drug categories
- Drug-drug interactions

### Step 2: Enrich with RxNav

```bash
python -m scripts.enrich_rxnav
```

**Fetches additional interaction data from RxNav API**  
**Updates:** `datasets/interactions.csv`

### Step 3: Build Embeddings

```bash
python -m scripts.build_embeddings
```

**Generates vector embeddings for semantic search**  
**Output:** `drug_embeddings_cache.json`

**Uses:** `sentence-transformers/all-MiniLM-L6-v2` (384-dim vectors)

### Step 4: Load to Neo4j

```bash
python -m scripts.load_to_neo4j
```

**Creates graph structure:**
```cypher
(:Drug)-[:TARGETS]->(:Target)
(:Drug)-[:BELONGS_TO]->(:Category)
(:Drug)-[:INTERACTS_WITH]->(:Drug)
```

**Creates vector index for similarity search**

---

## 🔌 API Endpoints

### Health Check
```http
GET /health
```
**Response:**
```json
{ "status": "ok" }
```

---

### 🔍 Semantic Search
```http
POST /search
Content-Type: application/json

{
  "query": "diabetes medication",
  "k": 5
}
```

**Response:**
```json
{
  "query": "diabetes medication",
  "results": [
    {
      "id": "DB00331",
      "name": "Metformin",
      "score": 0.87,
      "description": "...",
      "categories": ["Antidiabetic Agents"],
      "status": "approved"
    }
  ]
}
```

---

### 🤖 RAG Assistant
```http
POST /ask
Content-Type: application/json

{
  "question": "What are the side effects of Metformin?"
}
```

**Response:**
```json
{
  "question": "What are the side effects of Metformin?",
  "answer": "Metformin commonly causes gastrointestinal side effects...",
  "graph_query": "MATCH (d:Drug {name: 'Metformin'})...",
  "retrieved_context": ["...", "..."]
}
```

---

### ⚠️ Safety Checker
```http
POST /check
Content-Type: application/json

{
  "drugs": ["Aspirin", "Warfarin", "Ibuprofen"]
}
```

**Response:**
```json
{
  "interactions": [
    {
      "drug_a": "Aspirin",
      "drug_b": "Warfarin",
      "severity": "critical",
      "description": "Increased risk of bleeding..."
    }
  ]
}
```

---

### 🌐 Knowledge Graph
```http
GET /graph?limit=200
```

**Response:**
```json
{
  "nodes": [
    { "id": "DB00001", "label": "Lepirudin", "type": "Drug" }
  ],
  "links": [
    { "source": "DB00001", "target": "T001", "type": "TARGETS" }
  ]
}
```

---

### 💊 Drug Details
```http
GET /drug/DB00331
```

**Response:**
```json
{
  "drugbank_id": "DB00331",
  "name": "Metformin",
  "description": "...",
  "targets": [...],
  "interactions": [...]
}
```

---

### 🔄 Therapeutic Alternatives
```http
GET /alternatives/Aspirin/pain?current_meds=Warfarin,Metformin
```

**Response:**
```json
{
  "source_drug": "Aspirin",
  "condition": "pain",
  "alternatives": [
    {
      "id": "DB00316",
      "name": "Acetaminophen",
      "indication": "Pain relief",
      "conflicts": 0
    }
  ]
}
```

---

## 🗂️ Project Structure

```
backend/
├── api/
│   ├── main.py              # FastAPI app & endpoints
│   └── __init__.py
├── core/
│   ├── config.py            # Settings (from .env)
│   ├── schemas.py           # Pydantic models
│   └── __init__.py
├── db/
│   ├── neo4j.py             # Neo4j driver & queries
│   └── __init__.py
├── services/
│   ├── rag.py               # RAG engine (LangChain)
│   └── __init__.py
├── scripts/
│   ├── parse_drugbank.py    # XML → CSV
│   ├── enrich_rxnav.py      # RxNav API enrichment
│   ├── build_embeddings.py  # Vector generation
│   ├── load_to_neo4j.py     # CSV → Neo4j
│   └── __init__.py
├── cypher/
│   └── neo4j_bulk_import.cypher  # Bulk import queries
├── requirements.txt
└── README.md
```

---

## 🧠 RAG Engine Details

### Hybrid Retrieval Strategy

1. **Vector Search** - Semantic similarity using embeddings
2. **Graph Traversal** - Cypher queries for structured data
3. **LLM Generation** - Groq (llama-3.1-8b-instant)

### Implementation (`services/rag.py`)

```python
def ask_question_hybrid(question: str) -> dict:
    # 1. Vector search for relevant drugs
    docs = vector_store.similarity_search(question, k=5)
    
    # 2. Extract drug names and query graph
    drug_names = extract_drug_names(docs)
    graph_data = query_neo4j(drug_names)
    
    # 3. Combine context and generate answer
    context = docs + graph_data
    answer = llm.generate(question, context)
    
    return {
        "answer": answer,
        "graph_query": cypher_query,
        "retrieved_context": context
    }
```

---

## 🔐 Security

### CORS Configuration

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Environment Variables

- Never commit `.env` file
- Use `.env.example` as template
- Store secrets in environment or secret manager

---

## 🧪 Testing

```bash
# Run tests
python -m pytest tests/

# With coverage
python -m pytest --cov=backend tests/
```

---

## 📈 Performance

### Optimization Tips

1. **Vector Index** - Ensure Neo4j vector index is created
2. **Connection Pooling** - Neo4j driver uses connection pool
3. **Caching** - LangChain caches embeddings
4. **Batch Processing** - Use bulk imports for large datasets

### Monitoring

```bash
# Check Neo4j connection
curl http://127.0.0.1:8000/health

# View API docs
open http://127.0.0.1:8000/docs
```

---

## 🐛 Troubleshooting

### Neo4j Connection Issues
```bash
# Test connection
python -c "from backend.db.neo4j import driver; driver.verify_connectivity()"
```

### Embedding Model Download
```bash
# Pre-download model
python -c "from sentence_transformers import SentenceTransformer; SentenceTransformer('all-MiniLM-L6-v2')"
```

### CORS Errors
- Ensure frontend URL is in `allow_origins`
- Restart backend after config changes

---

## 📚 Additional Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Neo4j Python Driver](https://neo4j.com/docs/python-manual/current/)
- [LangChain Documentation](https://python.langchain.com/)
- [Sentence Transformers](https://www.sbert.net/)

---

**Backend maintained by Harsha** 🚀
