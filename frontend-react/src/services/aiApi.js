import {
  API_URL,
  FASTAPI_URL
} from "../config/api";


// ==================================================
// TEST EXPRESS BACKEND
// GET /api/health
// ==================================================

export async function testBackend() {
  try {
    console.log(
      "Testing Express:",
      `${API_URL}/health`
    );

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
        `Express backend failed: ${response.status}`
      );
    }

    console.log(
      "Express backend response:",
      data
    );

    return data;

  } catch (error) {
    console.error(
      "Express backend error:",
      error
    );

    throw error;
  }
}


// ==================================================
// TEST FASTAPI DIRECTLY
// GET /api/test-fastapi
// ==================================================

export async function testFastAPI() {
  try {
    console.log(
      "Testing FastAPI:",
      `${FASTAPI_URL}/api/test-fastapi`
    );

    const response = await fetch(
      `${FASTAPI_URL}/api/test-fastapi`,
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

    console.log(
      "FastAPI response:",
      data
    );

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
// CHECK FASTAPI AI HEALTH
// GET /api/ai/health
// ==================================================

export async function checkAIHealth() {
  try {
    console.log(
      "Checking AI Health:",
      `${FASTAPI_URL}/api/ai/health`
    );

    const response = await fetch(
      `${FASTAPI_URL}/api/ai/health`,
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

    console.log(
      "AI health response:",
      data
    );

    return data;

  } catch (error) {
    console.error(
      "AI health error:",
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
    console.log(
      "Sending question to FastAPI:",
      question
    );

    const response = await fetch(
      `${FASTAPI_URL}/api/ai/ask`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },

        body: JSON.stringify({
          question: question,
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
        `Invalid FastAPI response. Status: ${response.status}`
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

    console.log(
      "AI response:",
      data
    );

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
    console.log(
      "Sending chat message to FastAPI:",
      message
    );

    const response = await fetch(
      `${FASTAPI_URL}/api/ai/chat`,
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
        `Invalid FastAPI response. Status: ${response.status}`
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

    console.log(
      "Chat AI response:",
      data
    );

    return data;

  } catch (error) {
    console.error(
      "AI chat error:",
      error
    );

    throw error;
  }
}
