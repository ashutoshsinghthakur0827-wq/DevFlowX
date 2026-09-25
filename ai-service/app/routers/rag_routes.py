
from fastapi import APIRouter, HTTPException

from app.schemas import (
    RAGQuestionRequest,
    RAGQuestionResponse,
    IndexResponse,
)

from app.rag.rag_service import (
    index_documents,
    ask_rag,
)


router = APIRouter(
    prefix="/api/rag",
    tags=["RAG"],
)


@router.post("/index", response_model=IndexResponse)
def index_rag_documents():
    """
    Index documents from the data/documents folder.
    """

    try:
        result = index_documents()

        return {
            "message": "Documents indexed successfully",
            "documents": result.get("documents", 0),
            "chunks": result.get("chunks", 0),
        }

    except Exception as error:
        print("Indexing error:", error)

        raise HTTPException(
            status_code=500,
            detail=str(error),
        )


@router.post("/ask", response_model=RAGQuestionResponse)
def ask_rag_question(request: RAGQuestionRequest):
    """
    Ask a question using the RAG pipeline.
    """

    try:
        result = ask_rag(request.question)

        return {
            "answer": result.get("answer", ""),
            "sources": result.get("sources", []),
        }

    except Exception as error:
        print("RAG question error:", error)

        raise HTTPException(
            status_code=500,
            detail=str(error),
        )