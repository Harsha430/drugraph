import csv
from pathlib import Path

from neo4j import GraphDatabase

from backend.core.config import settings

BATCH_SIZE = 1000
DATA_DIR = Path("datasets")


def batched(rows, size: int):
    batch = []
    for row in rows:
        batch.append(row)
        if len(batch) >= size:
            yield batch
            batch = []
    if batch:
        yield batch


def create_constraints(session) -> None:
    session.run(
        "CREATE CONSTRAINT drug_id IF NOT EXISTS FOR (d:Drug) REQUIRE d.drugbank_id IS UNIQUE"
    )
    session.run(
        "CREATE CONSTRAINT category_name IF NOT EXISTS FOR (c:Category) REQUIRE c.name IS UNIQUE"
    )
    session.run(
        "CREATE CONSTRAINT target_id IF NOT EXISTS FOR (t:Target) REQUIRE t.id IS UNIQUE"
    )
    session.run("CREATE INDEX drug_name IF NOT EXISTS FOR (d:Drug) ON (d.name)")
    session.run("CREATE INDEX target_name IF NOT EXISTS FOR (t:Target) ON (t.name)")


def load_drugs(session) -> None:
    with (DATA_DIR / "drugs.csv").open(newline="", encoding="utf-8") as fp:
        rows = csv.DictReader(fp)
        for chunk in batched(rows, BATCH_SIZE):
            payload = []
            for r in chunk:
                payload.append(
                    {
                        "drugbank_id": r["drugbank_id"],
                        "name": r["name"],
                        "description": r["description"],
                        "state": r["state"],
                        "indication": r["indication"],
                        "mechanism": r["mechanism"],
                        "half_life": r["half_life"],
                        "groups": r["groups"].split("|") if r["groups"] else [],
                    }
                )
            session.run(
                """
                UNWIND $rows AS row
                MERGE (d:Drug {drugbank_id: row.drugbank_id})
                SET d.name = row.name,
                    d.description = row.description,
                    d.state = row.state,
                    d.indication = row.indication,
                    d.mechanism = row.mechanism,
                    d.half_life = row.half_life,
                    d.groups = row.groups
                """,
                {"rows": payload},
            )


def load_categories(session) -> None:
    with (DATA_DIR / "categories.csv").open(newline="", encoding="utf-8") as fp:
        rows = csv.DictReader(fp)
        for chunk in batched(rows, BATCH_SIZE):
            session.run(
                """
                UNWIND $rows AS row
                MATCH (d:Drug {drugbank_id: row.drugbank_id})
                MERGE (c:Category {name: row.category})
                SET c.mesh_id = row.mesh_id
                MERGE (d)-[:BELONGS_TO]->(c)
                """,
                {"rows": chunk},
            )


def load_targets(session) -> None:
    with (DATA_DIR / "targets.csv").open(newline="", encoding="utf-8") as fp:
        rows = csv.DictReader(fp)
        for chunk in batched(rows, BATCH_SIZE):
            payload = []
            for r in chunk:
                payload.append(
                    {
                        "drugbank_id": r["drugbank_id"],
                        "target_id": r["target_id"],
                        "target_name": r["target_name"],
                        "organism": r["organism"],
                        "actions": r["actions"].split("|") if r["actions"] else [],
                    }
                )
            session.run(
                """
                UNWIND $rows AS row
                MATCH (d:Drug {drugbank_id: row.drugbank_id})
                MERGE (t:Target {id: row.target_id})
                SET t.name = row.target_name,
                    t.organism = row.organism
                MERGE (d)-[r:TARGETS]->(t)
                SET r.actions = row.actions
                """,
                {"rows": payload},
            )


def load_interactions(session) -> None:
    with (DATA_DIR / "interactions.csv").open(newline="", encoding="utf-8") as fp:
        rows = csv.DictReader(fp)
        for i, chunk in enumerate(batched(rows, BATCH_SIZE), start=1):
            session.run(
                """
                UNWIND $rows AS row
                MATCH (a:Drug {drugbank_id: row.drug_a_id})
                MATCH (b:Drug {drugbank_id: row.drug_b_id})
                MERGE (a)-[r:INTERACTS_WITH]->(b)
                SET r.description = row.description
                """,
                {"rows": chunk},
            )
            if i % 100 == 0:
                print(f"Loaded interaction batches: {i}")


def verify(session) -> None:
    checks = [
        ("drugs", "MATCH (d:Drug) RETURN count(d) AS n"),
        ("categories_rel", "MATCH ()-[r:BELONGS_TO]->() RETURN count(r) AS n"),
        ("targets_rel", "MATCH ()-[r:TARGETS]->() RETURN count(r) AS n"),
        ("interactions_rel", "MATCH ()-[r:INTERACTS_WITH]->() RETURN count(r) AS n"),
    ]
    for name, query in checks:
        n = session.run(query).single()["n"]
        print(f"{name}: {n}")


def main() -> None:
    driver = GraphDatabase.driver(
        settings.neo4j_uri, auth=(settings.neo4j_username, settings.neo4j_password)
    )
    with driver.session(database=settings.neo4j_database) as session:
        print("Creating constraints/indexes...")
        create_constraints(session)
        print("Loading drugs...")
        load_drugs(session)
        print("Loading categories...")
        load_categories(session)
        print("Loading targets...")
        load_targets(session)
        print("Loading interactions (this may take a while)...")
        load_interactions(session)
        print("Verifying counts...")
        verify(session)
    print("Done.")


if __name__ == "__main__":
    main()
