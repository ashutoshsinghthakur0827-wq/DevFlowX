from pathlib import Path

from langchain_chroma import Chroma

from app.rag.embeddings import get_embeddings


CHROMA_DIRECTORY = Path("data/chroma")


def get_vector_store():
    CHROMA_DIRECTORY.mkdir(
        parents=True,
        exist_ok=True
    )

    embeddings = get_embeddings()

    vector_store = Chroma(
        collection_name="devflow_documents",
        embedding_function=embeddings,
        persist_directory=str(CHROMA_DIRECTORY)
    )

    return vector_store