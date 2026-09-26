const express = require("express");

const {
    askAI,
    aiHealth,
} = require("../controllers/aiController");


const router = express.Router();


// ============================================================
// AI HEALTH
// GET /api/ai/health
// ============================================================

router.get(
    "/health",
    aiHealth
);


// ============================================================
// AI ASK
// POST /api/ai/ask
// ============================================================

router.post(
    "/ask",
    askAI
);


module.exports = router;
