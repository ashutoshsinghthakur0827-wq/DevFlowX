const API_URL = "http://localhost:5000/api/rag";


export async function indexDocuments() {
  const response = await fetch(`${API_URL}/index`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    }
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Document indexing failed"
    );
  }

  return data;
}


export async function askRAG(question) {
  const response = await fetch(`${API_URL}/ask`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      question
    })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "RAG request failed"
    );
  }

  return data;
}