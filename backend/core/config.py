from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    neo4j_uri: str
    neo4j_username: str
    neo4j_password: str
    neo4j_database: str = "neo4j"

    groq_api_key: str = ""
    groq_model: str = "llama-3.1-8b-instant"

    embedding_model: str = "sentence-transformers/all-MiniLM-L6-v2"
    vector_index_name: str = "drug_embeddings"
    vector_node_label: str = "Drug"
    vector_text_property: str = "rag_text"
    vector_embedding_property: str = "embedding"


settings = Settings()
