
const axios = require("axios");

// FastAPI service URL
const AI_SERVICE_URL =
  process.env.AI_SERVICE_URL;

// Ask AI controller
async function askAI(req, res) {
  try {
    const {
      message,
      history = [],
    } = req.body;

    // Validate message
    if (
      !message ||
      typeof message !== "string" ||
      !message.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    // Check FastAPI URL
    if (!AI_SERVICE_URL) {
      return res.status(500).json({
        success: false,
        message:
          "AI_SERVICE_URL is missing in environment variables",
      });
    }

    // Send request to FastAPI
    const response = await axios.post(
      `${AI_SERVICE_URL}/api/ai/chat`,
      {
        message: message.trim(),
        history: Array.isArray(history)
          ? history
          : [],
      },
      {
        timeout: 60000,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Return FastAPI response to React
    return res.status(200).json({
      success: true,
      reply: response.data.reply,
      model: response.data.model,
    });
  } catch (error) {
    console.error(
      "FastAPI AI connection error:",
      error.response?.data ||
        error.message
    );

    // Handle timeout
    if (error.code === "ECONNABORTED") {
      return res.status(504).json({
        success: false,
        message:
          "AI service request timed out",
      });
    }

    // Handle FastAPI error
    if (error.response) {
      return res.status(502).json({
        success: false,
        message:
          "FastAPI returned an error",
        error: error.response.data,
      });
    }

    // Handle connection error
    return res.status(502).json({
      success: false,
      message:
        "Unable to connect to FastAPI AI service",
      error: error.message,
    });
  }
}

// AI health controller
async function aiHealth(req, res) {
  try {
    // Check FastAPI URL
    if (!AI_SERVICE_URL) {
      return res.status(500).json({
        success: false,
        message:
          "AI_SERVICE_URL is missing in environment variables",
      });
    }

    // Request FastAPI health status
    const response = await axios.get(
      `${AI_SERVICE_URL}/api/ai/health`,
      {
        timeout: 15000,
      }
    );

    return res.status(200).json({
      success: true,
      ...response.data,
    });
  } catch (error) {
    console.error(
      "FastAPI health error:",
      error.response?.data ||
        error.message
    );

    return res.status(502).json({
      success: false,
      message:
        "FastAPI AI service is unavailable",
      error:
        error.response?.data ||
        error.message,
    });
  }
}

module.exports = {
  askAI,
  aiHealth,
};
