
from pathlib import Path
from typing import Any

from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma
from langchain_core.documents import Document
from langchain_community.document_loaders import (
    PyPDFLoader,
    TextLoader,
)

import os


# --------------------------------------------------
# Load environment variables
# --------------------------------------------------

load_dotenv()


# --------------------------------------------------
# Project paths
# --------------------------------------------------

BASE_DIR = Path(__file__).resolve().parents[2]

DOCUMENTS_DIR = BASE_DIR / "data" / "documents"

CHROMA_DIR = BASE_DIR / "data" / "chroma"


# Create folders if they do not exist
DOCUMENTS_DIR.mkdir(parents=True, exist_ok=True)

CHROMA_DIR.mkdir(parents=True, exist_ok=True)


# --------------------------------------------------
# Configuration
# --------------------------------------------------

COLLECTION_NAME = "devflow_documents"

EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2"

GROQ_MODEL = os.getenv(
    "GROQ_MODEL",
    "llama-3.3-70b-versatile",
)


# --------------------------------------------------
# Get HuggingFace embeddings
# --------------------------------------------------

def get_embeddings():
    """
    Create the HuggingFace embedding model.

    The embedding model converts text into vectors.
    """

    embeddings = HuggingFaceEmbeddings(
        model_name=EMBEDDING_MODEL,
        model_kwargs={
            "device": "cpu"
        },
        encode_kwargs={
            "normalize_embeddings": True
        },
    )

    return embeddings


# --------------------------------------------------
# Get Chroma vector store
# --------------------------------------------------

def get_vector_store():
    """
    Create or load the ChromaDB vector store.
    """

    embeddings = get_embeddings()

    vector_store = Chroma(
        collection_name=COLLECTION_NAME,
        embedding_function=embeddings,
        persist_directory=str(CHROMA_DIR),
    )

    return vector_store


# --------------------------------------------------
# Load documents
# --------------------------------------------------

def load_documents() -> list[Document]:
    """
    Load PDF and TXT files from the documents folder.
    """

    documents = []

    if not DOCUMENTS_DIR.exists():
        print("Documents folder does not exist.")

        return documents

    for file_path in DOCUMENTS_DIR.iterdir():

        if not file_path.is_file():
            continue

        file_suffix = file_path.suffix.lower()

        try:

            if file_suffix == ".pdf":

                loader = PyPDFLoader(
                    str(file_path)
                )

                loaded_documents = loader.load()

                documents.extend(loaded_documents)

            elif file_suffix == ".txt":

                loader = TextLoader(
                    str(file_path),
                    encoding="utf-8",
                )

                loaded_documents = loader.load()

                documents.extend(loaded_documents)

            else:

                print(
                    f"Skipped unsupported file: {file_path.name}"
                )

        except Exception as error:

            print(
                f"Error loading {file_path.name}: {error}"
            )

    print(
        f"Loaded {len(documents)} document pages/files."
    )

    return documents


# --------------------------------------------------
# Split documents into chunks
# --------------------------------------------------

def split_documents(
    documents: list[Document],
) -> list[Document]:
    """
    Split documents into smaller chunks.
    """

    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=800,
        chunk_overlap=150,
        separators=[
            "\n\n",
            "\n",
            ". ",
            " ",
            "",
        ],
    )

    chunks = text_splitter.split_documents(
        documents
    )

    print(
        f"Created {len(chunks)} document chunks."
    )

    return chunks


# --------------------------------------------------
# Index documents in ChromaDB
# --------------------------------------------------

def index_documents() -> dict[str, Any]:
    """
    Load, split, and store documents in ChromaDB.
    """

    documents = load_documents()

    if not documents:

        return {
            "documents": 0,
            "chunks": 0,
            "message": (
                "No supported documents found."
            ),
        }

    chunks = split_documents(documents)

    if not chunks:

        return {
            "documents": len(documents),
            "chunks": 0,
            "message": (
                "Documents were loaded, "
                "but no chunks were created."
            ),
        }

    vector_store = get_vector_store()

    # Add chunks to ChromaDB
    vector_store.add_documents(
        documents=chunks
    )

    print(
        "Documents indexed successfully "
        "in ChromaDB."
    )

    return {
        "documents": len(documents),
        "chunks": len(chunks),
        "message": (
            "Documents indexed successfully."
        ),
    }


# --------------------------------------------------
# Get Groq LLM
# --------------------------------------------------

def get_llm():
    """
    Create the Groq language model.
    """

    groq_api_key = os.getenv(
        "GROQ_API_KEY"
    )

    if not groq_api_key:

        raise ValueError(
            "GROQ_API_KEY is missing. "
            "Add it to the .env file."
        )

    llm = ChatGroq(
        api_key=groq_api_key,
        model=GROQ_MODEL,
        temperature=0,
        max_tokens=700,
    )

    return llm


# --------------------------------------------------
# Create context from documents
# --------------------------------------------------

def create_context(
    documents: list[Document],
) -> str:
    """
    Combine retrieved document chunks into context.
    """

    context_parts = []

    for index, document in enumerate(documents):

        content = document.page_content.strip()

        if not content:
            continue

        context_parts.append(
            f"Document Part {index + 1}:\n{content}"
        )

    context = "\n\n".join(
        context_parts
    )

    return context


# --------------------------------------------------
# Extract sources
# --------------------------------------------------

def extract_sources(
    documents: list[Document],
) -> list[str]:
    """
    Extract unique source filenames from metadata.
    """

    sources = []

    for document in documents:

        source = document.metadata.get(
            "source",
            "Unknown source",
        )

        source_name = Path(
            str(source)
        ).name

        if source_name not in sources:

            sources.append(source_name)

    return sources


# --------------------------------------------------
# Ask RAG
# --------------------------------------------------

def ask_rag(
    question: str,
) -> dict[str, Any]:
    """
    Retrieve relevant chunks and ask Groq
    to generate an answer using the context.
    """

    question = question.strip()

    if not question:

        raise ValueError(
            "Question cannot be empty."
        )

    vector_store = get_vector_store()

    # Check whether ChromaDB has documents
    collection = vector_store._collection

    collection_count = collection.count()

    if collection_count == 0:

        raise ValueError(
            "No documents are indexed. "
            "Run /api/rag/index first."
        )

    # Search relevant document chunks
    retrieved_documents = (
        vector_store.similarity_search(
            question,
            k=4,
        )
    )

    if not retrieved_documents:

        return {
            "answer": (
                "I could not find relevant "
                "information in the documents."
            ),
            "sources": [],
        }

    context = create_context(
        retrieved_documents
    )

    sources = extract_sources(
        retrieved_documents
    )

    prompt = f"""
You are the DevFlow X AI assistant.

Answer the user's question using only
the provided document context.

Rules:
1. Use only the information in the context.
2. Do not invent facts.
3. If the answer is not available,
   clearly say that it is not available
   in the provided documents.
4. Explain the answer in simple language.
5. Keep the response clear and useful.

Document Context:
-----------------
{context}
-----------------

User Question:
{question}

Answer:
"""

    llm = get_llm()

    response = llm.invoke(prompt)

    answer = response.content

    if isinstance(answer, list):

        answer = "\n".join(
            str(item)
            for item in answer
        )

    return {
        "answer": str(answer),
        "sources": sources,
    }