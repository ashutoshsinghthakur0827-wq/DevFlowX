import API_URL from "../config/api";

const RAG_API_URL = `${API_URL}/rag`;

export async function indexDocuments() {
  try {
    const response = await fetch(`${RAG_API_URL}/index`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || data.detail || "Document indexing failed"
      );
    }

    return data;
  } catch (error) {
    console.error("Document indexing error:", error);
    throw error;
  }
}

export async function askRAG(question) {
  try {
    const response = await fetch(`${RAG_API_URL}/ask`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || data.detail || "RAG request failed"
      );
    }

    return data;
  } catch (error) {
    console.error("RAG request error:", error);
    throw error;
  }
}
