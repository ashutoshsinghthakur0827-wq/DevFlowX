
import API_URL from "../config/api";

// AI API base URL
const AI_API_URL = `${API_URL}/ai`;

// ==================================================
// ASK AI
// ==================================================

export async function askAI(question, history = []) {
  try {
    const response = await fetch(`${AI_API_URL}/ask`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        message: question,
        history: history,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          data.detail ||
          data.error ||
          "AI request failed"
      );
    }

    return data;
  } catch (error) {
    console.error("AI request error:", error);

    throw error;
  }
}

// ==================================================
// CHECK AI HEALTH
// ==================================================

export async function checkAIHealth() {
  try {
    const response = await fetch(`${AI_API_URL}/health`);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          data.detail ||
          data.error ||
          "AI health check failed"
      );
    }

    return data;
  } catch (error) {
    console.error(
      "AI health check error:",
      error
    );

    throw error;
  }
}
