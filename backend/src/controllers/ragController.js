const axios = require("axios");

const AI_SERVICE_URL =
  process.env.AI_SERVICE_URL || "http://127.0.0.1:8000";


async function indexDocuments(req, res) {
  try {
    const response = await axios.post(
      `${AI_SERVICE_URL}/api/rag/index`,
      {},
      {
        timeout: 120000
      }
    );

    return res.status(200).json(response.data);
  } catch (error) {
    console.error(
      "RAG indexing error:",
      error.response?.data || error.message
    );

    return res.status(502).json({
      message: "Unable to index documents",
      error: error.response?.data || error.message
    });
  }
}


async function askRAG(req, res) {
  try {
    const { question } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({
        message: "Question is required"
      });
    }

    const response = await axios.post(
      `${AI_SERVICE_URL}/api/rag/ask`,
      {
        question: question.trim()
      },
      {
        timeout: 120000
      }
    );

    return res.status(200).json(response.data);
  } catch (error) {
    console.error(
      "RAG question error:",
      error.response?.data || error.message
    );

    return res.status(502).json({
      message: "Unable to process RAG question",
      error: error.response?.data || error.message
    });
  }
}


module.exports = {
  indexDocuments,
  askRAG
};