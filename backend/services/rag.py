from backend.core.config import settings
from langchain_neo4j import GraphCypherQAChain, Neo4jGraph, Neo4jVector
from langchain_groq import ChatGroq
from backend.services.embeddings import ONNXEmbeddings

# Local embedding model initialized with the model from settings
def get_embeddings():
    return ONNXEmbeddings()

_vector_store: Neo4jVector | None = None
_qa_chain: GraphCypherQAChain | None = None
_llm: ChatGroq | None = None
_rag_error: str | None = None


def _init_rag() -> None:
    global _vector_store, _qa_chain, _llm, _rag_error
    if _vector_store is not None and _qa_chain is not None and _llm is not None:
        return
    try:
        embeddings = get_embeddings()
        _vector_store = Neo4jVector.from_existing_graph(
            embedding=embeddings,
            url=settings.neo4j_uri,
            username=settings.neo4j_username,
            password=settings.neo4j_password,
            database=settings.neo4j_database,
            index_name=settings.vector_index_name,
            node_label=settings.vector_node_label,
            text_node_properties=[settings.vector_text_property],
            embedding_node_property=settings.vector_embedding_property,
        )
        graph = Neo4jGraph(
            url=settings.neo4j_uri,
            username=settings.neo4j_username,
            password=settings.neo4j_password,
            database=settings.neo4j_database,
        )
        _llm = ChatGroq(
            api_key=settings.groq_api_key,
            model_name=settings.groq_model,
            temperature=0.1,
        )
        _qa_chain = GraphCypherQAChain.from_llm(
            llm=_llm,
            graph=graph,
            verbose=False,
            allow_dangerous_requests=True,
            return_intermediate_steps=True
        )
        _rag_error = None
    except Exception as exc:
        import traceback
        _rag_error = traceback.format_exc()
        _vector_store = None
        _qa_chain = None
        _llm = None


def get_vector_store() -> Neo4jVector:
    _init_rag()
    if _vector_store is None:
        raise RuntimeError(f"RAG unavailable: {_rag_error}")
    return _vector_store


def get_qa_chain() -> GraphCypherQAChain:
    _init_rag()
    if _qa_chain is None:
        raise RuntimeError(f"RAG unavailable: {_rag_error}")
    return _qa_chain


def ask_question_hybrid(question: str) -> dict:
    """
    Perform Hybrid RAG:
    1. Retrieve vector context (semantic).
    2. Retrieve graph answer (structured).
    3. Synthesize final answer using LLM.
    """
    _init_rag()
    if not _llm:
        raise RuntimeError("LLM not initialized")

    # 1. Vector Search
    docs = _vector_store.similarity_search(question, k=5)
    vector_context = "\n\n".join([d.page_content for d in docs])

    # 2. Graph Search
    graph_res = _qa_chain.invoke({"query": question})
    graph_answer = graph_res.get("result", "No specific relationship found in graph.")
    graph_query = graph_res.get("intermediate_steps", [])

    # 3. Synthesis
    synthesis_prompt = f"""
    You are an expert Medical Assistant.
    Answer the user's question using the provided context.
    
    USER QUESTION: {question}
    
    STRUCTURED GRAPH KNOWLEDGE (Interactions/Targets):
    {graph_answer}
    
    SEMANTIC MEDICAL CONTEXT (Drug descriptions/Indications):
    {vector_context}
    
    INSTRUCTIONS:
    - If the info is in the semantic context but not the graph, use the semantic context.
    - If there are drug-drug interactions mentioned in the graph, highlight them.
    - Be professional, accurate, and concise.
    - If you don't know the answer, say you don't know based on available data.
    """
    
    final_answer = _llm.invoke(synthesis_prompt).content
    
    return {
        "answer": final_answer,
        "graph_query": graph_query,
        "retrieved_context": [d.page_content for d in docs]
    }
