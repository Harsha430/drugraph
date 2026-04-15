from neo4j import GraphDatabase

from backend.core.config import settings


driver = GraphDatabase.driver(
    settings.neo4j_uri, auth=(settings.neo4j_username, settings.neo4j_password)
)


def run_query(query: str, params: dict | None = None) -> list[dict]:
    with driver.session(database=settings.neo4j_database) as session:
        result = session.run(query, params or {})
        return [record.data() for record in result]
