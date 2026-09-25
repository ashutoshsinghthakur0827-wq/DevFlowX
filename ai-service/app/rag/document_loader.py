from pathlib import Path

from langchain_core.documents import Document
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter


DOCUMENT_DIRECTORY = Path("data/documents")


def load_documents():
    DOCUMENT_DIRECTORY.mkdir(
        parents=True,
        exist_ok=True
    )

    documents = []

    for file_path in DOCUMENT_DIRECTORY.iterdir():
        if file_path.is_dir():
            continue

        if file_path.suffix.lower() == ".pdf":
            loader = PyPDFLoader(str(file_path))
            documents.extend(loader.load())

        elif file_path.suffix.lower() == ".txt":
            text = file_path.read_text(
                encoding="utf-8"
            )

            documents.append(
                Document(
                    page_content=text,
                    metadata={
                        "source": file_path.name
                    }
                )
            )

    return documents


def split_documents(documents):
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=800,
        chunk_overlap=150
    )

    return text_splitter.split_documents(documents)