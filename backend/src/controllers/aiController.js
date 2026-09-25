
const axios = require("axios");

// ============================================================
// 1. FASTAPI SERVICE URL
// ============================================================

const AI_SERVICE_URL = (
  process.env.AI_SERVICE_URL || ""
).replace(/\/$/, "");


// ============================================================
// 2. ASK AI CONTROLLER
// ============================================================

async function askAI(req, res) {
  try {
    const {
      message,
      question,
      history = [],
    } = req.body || {};

    // Accept both message and question
    const userMessage = message || question;

    // Validate user message
    if (
      !userMessage ||
      typeof userMessage !== "string" ||
      !userMessage.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Message or question is required",
      });
    }

    // Check FastAPI URL
    if (!AI_SERVICE_URL) {
      return res.status(500).json({
        success: false,
        message: "AI_SERVICE_URL is missing in environment variables",
      });
    }

    // Validate history
    const validHistory = Array.isArray(history)
      ? history
      : [];

    const fastAPIEndpoint =
      `${AI_SERVICE_URL}/api/ai/ask`;

    console.log(
      "Sending AI request:",
      fastAPIEndpoint
    );

    // Send request to FastAPI
    const response = await axios.post(
      fastAPIEndpoint,
      {
        question: userMessage.trim(),
        history: validHistory,
      },
      {
        timeout: 120000,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    console.log(
      "FastAPI AI response received successfully"
    );

    // Validate response
    if (
      !response.data ||
      typeof response.data.reply !== "string"
    ) {
      return res.status(502).json({
        success: false,
        message: "FastAPI returned an invalid AI response",
      });
    }

    // Return response to React frontend
    return res.status(200).json({
      success: true,
      reply: response.data.reply,
      model: response.data.model,
    });

  } catch (error) {
    console.error(
      "FastAPI AI connection error:",
      error.response?.data || error.message
    );

    // Handle timeout
    if (
      error.code === "ECONNABORTED" ||
      error.code === "ETIMEDOUT"
    ) {
      return res.status(504).json({
        success: false,
        message: "AI service request timed out",
      });
    }

    // Handle FastAPI HTTP errors
    if (error.response) {
      return res.status(502).json({
        success: false,
        message: "FastAPI returned an error",
        statusCode: error.response.status,
        error: error.response.data,
      });
    }

    // Handle connection errors
    return res.status(502).json({
      success: false,
      message: "Unable to connect to FastAPI AI service",
      error: error.message,
    });
  }
}


// ============================================================
// 3. AI HEALTH CONTROLLER
// ============================================================

async function aiHealth(req, res) {
  try {
    if (!AI_SERVICE_URL) {
      return res.status(500).json({
        success: false,
        message: "AI_SERVICE_URL is missing in environment variables",
      });
    }

    const healthEndpoint =
      `${AI_SERVICE_URL}/api/ai/health`;

    console.log(
      "Checking FastAPI health:",
      healthEndpoint
    );

    const response = await axios.get(
      healthEndpoint,
      {
        timeout: 15000,
        headers: {
          Accept: "application/json",
        },
      }
    );

    return res.status(200).json({
      success: true,
      ...response.data,
    });

  } catch (error) {
    console.error(
      "FastAPI health error:",
      error.response?.data || error.message
    );

    return res.status(502).json({
      success: false,
      message: "FastAPI AI service is unavailable",
      statusCode: error.response?.status || 502,
      error: error.response?.data || error.message,
    });
  }
}


// ============================================================
// 4. EXPORT CONTROLLERS
// ============================================================

module.exports = {
  askAI,
  aiHealth,
};
