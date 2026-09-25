import API_URL from "../config/api";

const AI_API_URL = `${API_URL}/ai`;

export async function askAI(question) {
  try {
    const response = await fetch(`${AI_API_URL}/ask`, {
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
        data.message || data.detail || "AI request failed"
      );
    }

    return data;
  } catch (error) {
    console.error("AI request error:", error);
    throw error;
  }
}

export async function checkAIHealth() {
  try {
    const response = await fetch(`${AI_API_URL}/health`);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || data.detail || "AI health check failed"
      );
    }

    return data;
  } catch (error) {
    console.error("AI health check error:", error);
    throw error;
  }
}
