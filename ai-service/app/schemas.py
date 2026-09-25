
from pydantic import BaseModel


class AIQuestionRequest(BaseModel):
    question: str


class AIQuestionResponse(BaseModel):
    answer: str


class RAGQuestionRequest(BaseModel):
    question: str


class RAGQuestionResponse(BaseModel):
    answer: str
    sources: list[str]


class IndexResponse(BaseModel):
    message: str
    documents: int = 0
    chunks: int = 0