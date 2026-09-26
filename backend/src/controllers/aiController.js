const axios = require("axios");


// ============================================================
// FASTAPI URL
// ============================================================

const AI_SERVICE_URL = (
    process.env.AI_SERVICE_URL || ""
).replace(/\/$/, "");


// ============================================================
// ASK AI
// POST /api/ai/ask
// ============================================================

async function askAI(req, res) {

    try {

        // ----------------------------------------------------
        // GET REQUEST BODY
        // ----------------------------------------------------

        const {
            message,
            question,
            history = [],
        } = req.body || {};


        // ----------------------------------------------------
        // SUPPORT BOTH message AND question
        // ----------------------------------------------------

        const userMessage =
            message || question;


        // ----------------------------------------------------
        // VALIDATE MESSAGE
        // ----------------------------------------------------

        if (
            !userMessage ||
            typeof userMessage !== "string" ||
            !userMessage.trim()
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Message or question is required",
            });
        }


        // ----------------------------------------------------
        // CHECK FASTAPI URL
        // ----------------------------------------------------

        if (!AI_SERVICE_URL) {

            return res.status(500).json({

                success: false,

                message:
                    "AI_SERVICE_URL is missing in environment variables",
            });
        }


        // ----------------------------------------------------
        // VALIDATE HISTORY
        // ----------------------------------------------------

        const validHistory =
            Array.isArray(history)
                ? history
                : [];


        // ----------------------------------------------------
        // FASTAPI ENDPOINT
        // ----------------------------------------------------

        const fastAPIEndpoint =
            `${AI_SERVICE_URL}/api/ai/ask`;


        console.log(
            "Sending AI request:",
            fastAPIEndpoint
        );


        // ----------------------------------------------------
        // SEND REQUEST TO FASTAPI
        // ----------------------------------------------------

        const response =
            await axios.post(

                fastAPIEndpoint,

                {
                    question:
                        userMessage.trim(),

                    history:
                        validHistory,
                },

                {
                    timeout: 120000,

                    headers: {
                        "Content-Type":
                            "application/json",

                        Accept:
                            "application/json",
                    },
                }
            );


        // ----------------------------------------------------
        // CHECK RESPONSE
        // ----------------------------------------------------

        console.log(
            "FastAPI AI response received successfully"
        );


        if (
            !response.data ||
            typeof response.data.reply !== "string"
        ) {

            return res.status(502).json({

                success: false,

                message:
                    "FastAPI returned an invalid AI response",
            });
        }


        // ----------------------------------------------------
        // SEND RESPONSE TO FRONTEND
        // ----------------------------------------------------

        return res.status(200).json({

            success: true,

            reply:
                response.data.reply,

            model:
                response.data.model,
        });


    } catch (error) {

        // ----------------------------------------------------
        // ERROR LOG
        // ----------------------------------------------------

        console.error(
            "FastAPI AI connection error:",

            error.response?.data ||
            error.message
        );


        // ----------------------------------------------------
        // TIMEOUT
        // ----------------------------------------------------

        if (
            error.code === "ECONNABORTED" ||
            error.code === "ETIMEDOUT"
        ) {

            return res.status(504).json({

                success: false,

                message:
                    "AI service request timed out",
            });
        }


        // ----------------------------------------------------
        // FASTAPI ERROR
        // ----------------------------------------------------

        if (error.response) {

            return res.status(502).json({

                success: false,

                message:
                    "FastAPI returned an error",

                statusCode:
                    error.response.status,

                error:
                    error.response.data,
            });
        }


        // ----------------------------------------------------
        // CONNECTION ERROR
        // ----------------------------------------------------

        return res.status(502).json({

            success: false,

            message:
                "Unable to connect to FastAPI AI service",

            error:
                error.message,
        });
    }
}


// ============================================================
// AI HEALTH
// GET /api/ai/health
// ============================================================

async function aiHealth(req, res) {

    try {

        // ----------------------------------------------------
        // CHECK URL
        // ----------------------------------------------------

        if (!AI_SERVICE_URL) {

            return res.status(500).json({

                success: false,

                message:
                    "AI_SERVICE_URL is missing in environment variables",
            });
        }


        // ----------------------------------------------------
        // FASTAPI HEALTH ENDPOINT
        // ----------------------------------------------------

        const healthEndpoint =
            `${AI_SERVICE_URL}/api/ai/health`;


        console.log(
            "Checking FastAPI health:",
            healthEndpoint
        );


        // ----------------------------------------------------
        // REQUEST
        // ----------------------------------------------------

        const response =
            await axios.get(

                healthEndpoint,

                {
                    timeout: 15000,

                    headers: {
                        Accept:
                            "application/json",
                    },
                }
            );


        // ----------------------------------------------------
        // RETURN HEALTH
        // ----------------------------------------------------

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

            statusCode:
                error.response?.status ||
                502,

            error:
                error.response?.data ||
                error.message,
        });
    }
}


// ============================================================
// EXPORT
// ============================================================

module.exports = {
    askAI,
    aiHealth,
};
