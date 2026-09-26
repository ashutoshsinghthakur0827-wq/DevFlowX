const express = require("express");
const axios = require("axios");

const {
    askAI,
    aiHealth,
} = require("../controllers/aiController");

const router = express.Router();


// ============================================================
// FASTAPI CONNECTION TEST
// GET /api/ai/test-fastapi
// ============================================================

router.get(
    "/test-fastapi",
    async (req, res) => {

        try {

            const AI_SERVICE_URL = (
                process.env.AI_SERVICE_URL || ""
            ).replace(/\/$/, "");


            // Check environment variable
            if (!AI_SERVICE_URL) {

                return res.status(500).json({
                    success: false,
                    message: "AI_SERVICE_URL is missing in environment variables"
                });

            }


            // Call FastAPI root endpoint
            const response = await axios.get(
                `${AI_SERVICE_URL}/`,
                {
                    timeout: 15000,
                    headers: {
                        Accept: "application/json"
                    }
                }
            );


            return res.status(200).json({

                success: true,

                message:
                    "Express → FastAPI connection successful",

                fastapi: response.data

            });

        } catch (error) {

            console.error(
                "FastAPI connection test error:",
                error.response?.data || error.message
            );


            return res.status(502).json({

                success: false,

                message:
                    "Unable to connect to FastAPI",

                error:
                    error.response?.data ||
                    error.message

            });

        }

    }
);


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


// ============================================================
// AI CHAT
// POST /api/ai/chat
// ============================================================

router.post(
    "/chat",
    askAI
);


// ============================================================
// EXPORT ROUTER
// ============================================================

module.exports = router;
