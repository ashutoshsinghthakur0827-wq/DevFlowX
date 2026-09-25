const axios = require("axios");

const AI_SERVICE_URL =
  process.env.AI_SERVICE_URL || "http://127.0.0.1:8000";

async function askAI(req, res) {
  try {
    const { question } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({
        message: "Question is required"
      });
    }

    const response = await axios.post(
      `${AI_SERVICE_URL}/api/ai/ask`,
      {
        question: question.trim()
      },
      {
        timeout: 30000
      }
    );

    return res.status(200).json(response.data);
  } catch (error) {
    console.error(
      "FastAPI connection error:",
      error.response?.data || error.message
    );

    return res.status(502).json({
      message: "Unable to connect to FastAPI AI service",
      error: error.response?.data || error.message
    });
  }
}

async function aiHealth(req, res) {
  try {
    const response = await axios.get(
      `${AI_SERVICE_URL}/api/ai/health`,
      {
        timeout: 10000
      }
    );

    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(502).json({
      message: "FastAPI AI service is unavailable",
      error: error.message
    });
  }
}

module.exports = {
  askAI,
  aiHealth
};