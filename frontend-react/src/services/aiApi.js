import API_URL from "../config/api";

// ==================================================
// AI API BASE URL
// ==================================================

const AI_API_URL = `${API_URL}/ai`;


// ==================================================
// TEST EXPRESS BACKEND
// GET /api/health
// ==================================================

export async function testBackend() {
  try {

    const response = await fetch(
      `${API_URL}/health`,
      {
        method: "GET",
        headers: {
          Accept: "application/json"
        }
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
        data.detail ||
        data.error ||
        `Backend health check failed: ${response.status}`
      );
    }

    return data;

  } catch (error) {

    console.error(
      "Backend health error:",
      error
    );

    throw error;
  }
}


// ==================================================
// TEST EXPRESS → FASTAPI
// GET /api/ai/test-fastapi
// ==================================================

export async function testFastAPI() {
  try {

    const response = await fetch(
      `${AI_API_URL}/test-fastapi`,
      {
        method: "GET",
        headers: {
          Accept: "application/json"
        }
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
        data.detail ||
        data.error ||
        `FastAPI connection failed: ${response.status}`
      );
    }

    return data;

  } catch (error) {

    console.error(
      "FastAPI connection error:",
      error
    );

    throw error;
  }
}


// ==================================================
// CHECK AI HEALTH
// GET /api/ai/health
// ==================================================

export async function checkAIHealth() {
  try {

    const response = await fetch(
      `${AI_API_URL}/health`,
      {
        method: "GET",
        headers: {
          Accept: "application/json"
        }
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
        data.detail ||
        data.error ||
        `AI health check failed: ${response.status}`
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


// ==================================================
// ASK AI
// POST /api/ai/ask
// ==================================================

export async function askAI(
  question,
  history = []
) {

  try {

    const response = await fetch(
      `${AI_API_URL}/ask`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },

        body: JSON.stringify({
          message: question,
          history: history
        })
      }
    );


    const responseText =
      await response.text();


    let data;


    try {

      data = JSON.parse(
        responseText
      );

    } catch {

      throw new Error(
        `Invalid server response. Status: ${response.status}`
      );

    }


    if (!response.ok) {

      throw new Error(
        data.message ||
        data.detail ||
        data.error ||
        `AI request failed: ${response.status}`
      );

    }


    return data;

  } catch (error) {

    console.error(
      "AI request error:",
      error
    );

    throw error;
  }
}


// ==================================================
// CHAT AI
// POST /api/ai/chat
// ==================================================

export async function chatAI(
  message,
  history = []
) {

  try {

    const response = await fetch(
      `${AI_API_URL}/chat`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },

        body: JSON.stringify({
          message: message,
          history: history
        })
      }
    );


    const responseText =
      await response.text();


    let data;


    try {

      data = JSON.parse(
        responseText
      );

    } catch {

      throw new Error(
        `Invalid server response. Status: ${response.status}`
      );

    }


    if (!response.ok) {

      throw new Error(
        data.message ||
        data.detail ||
        data.error ||
        `AI chat failed: ${response.status}`
      );

    }


    return data;

  } catch (error) {

    console.error(
      "AI chat error:",
      error
    );

    throw error;
  }
}
