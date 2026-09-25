const API_URL = "https://devflowx-zmlo.onrender.com/api/ai";

export async function askAI(question) {
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
      data.message || "AI request failed"
    );
  }

  return data;
}

export async function checkAIHealth() {
  const response = await fetch(`${API_URL}/health`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "AI health check failed"
    );
  }

  return data;
}
