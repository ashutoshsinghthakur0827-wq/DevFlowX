
const express = require("express");

const {
  askAI,
  aiHealth,
} = require("../controllers/aiController");

const router = express.Router();

// Check FastAPI AI service health
router.get("/health", aiHealth);

// Send user message to FastAPI AI service
router.post("/ask", askAI);

module.exports = router;
