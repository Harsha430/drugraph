"""
Build embeddings using local SentenceTransformer on CPU.
Writes embedding + rag_text to each Drug node and creates the vector index.
"""
import math
from tqdm import tqdm

from backend.core.config import settings
from backend.db.neo4j import driver

BATCH_SIZE = 64


def main() -> None:
    # 1. Initialize local model
    print(f"Loading local embedding model: {settings.embedding_model}...")
    from sentence_transformers import SentenceTransformer
    model = SentenceTransformer(settings.embedding_model, device="cpu")

    # 2. Fetch drugs
    print("Fetching drugs from Neo4j...")
    with driver.session(database=settings.neo4j_database) as session:
        drugs = session.run(
            """
            MATCH (d:Drug)
            WHERE d.description IS NOT NULL AND d.description <> ''
            RETURN d.drugbank_id AS id, d.name AS name,
                   coalesce(d.description, '') AS description,
                   coalesce(d.indication, '') AS indication,
                   coalesce(d.mechanism, '') AS mechanism
            """
        ).data()

    print(f"Found {len(drugs)} drugs to embed.")
    if not drugs:
        print("No drugs with descriptions found. Exiting.")
        return

    # 3. Prepare texts
    texts = [
        f"{d['name']}\nDescription: {d['description']}\nIndication: {d['indication']}\nMechanism: {d['mechanism']}"
        for d in drugs
    ]

    # 4. Generate Embeddings (Local CPU)
    import os
    import json
    cache_file = "drug_embeddings_cache.json"
    
    if os.path.exists(cache_file):
        print(f"Loading cached embeddings from {cache_file}...")
        with open(cache_file, "r") as f:
            cache_data = json.load(f)
        all_embeddings = [d["emb"] for d in cache_data]
        texts = [d["text"] for d in cache_data]
        # We assume the drugs list matches or we skip to upload
    else:
        print(f"Generating embeddings for {len(drugs)} drugs on CPU...")
        all_embeddings = model.encode(texts, batch_size=BATCH_SIZE, show_progress_bar=True).tolist()
        
        # Save to cache immediately
        print(f"Saving to cache: {cache_file}")
        cache_data = [
            {"id": d["id"], "text": text, "emb": emb}
            for d, text, emb in zip(drugs, texts, all_embeddings)
        ]
        with open(cache_file, "w") as f:
            json.dump(cache_data, f)

    # 5. Optimized batch write to Neo4j
    print("Writing embeddings to Neo4j in batches...")
    
    upload_data = [
        {"id": d["id"], "text": text, "emb": emb}
        for d, text, emb in zip(drugs, texts, all_embeddings)
    ]

    write_batch_size = 200 # Smaller batches for stability
    for i in range(0, len(upload_data), write_batch_size):
        batch = upload_data[i : i + write_batch_size]
        try:
            with driver.session(database=settings.neo4j_database) as session:
                session.run(
                    """
                    UNWIND $batch AS data
                    MATCH (d:Drug {drugbank_id: data.id})
                    SET d.rag_text = data.text, d.embedding = data.emb
                    """,
                    {"batch": batch}
                )
            print(f"  Uploaded {min(i + write_batch_size, len(upload_data))}/{len(upload_data)}")
        except Exception as e:
            print(f"  Batch failed: {e}. Retrying in 5s...")
            import time
            time.sleep(5)
            # Simple one-time retry
            with driver.session(database=settings.neo4j_database) as session:
                session.run(
                    """
                    UNWIND $batch AS data
                    MATCH (d:Drug {drugbank_id: data.id})
                    SET d.rag_text = data.text, d.embedding = data.emb
                    """,
                    {"batch": batch}
                )

    print("Ensuring vector index exists...")
    with driver.session(database=settings.neo4j_database) as session:
        session.run(
            """
            CREATE VECTOR INDEX drug_embeddings IF NOT EXISTS
            FOR (d:Drug) ON (d.embedding)
            OPTIONS {indexConfig: {
                `vector.dimensions`: 384,
                `vector.similarity_function`: 'cosine'
            }}
            """
        )

    print(f"Done! Successfully embedded {len(drugs)} drugs using local CPU model.")


if __name__ == "__main__":
    main()
