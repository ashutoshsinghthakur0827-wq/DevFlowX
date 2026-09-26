const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();


// ============================================================
// IMPORT ROUTES
// ============================================================

const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");
const teamRoutes = require("./routes/teamRoutes");

const aiRoutes = require("./routes/aiRoutes");


// ============================================================
// APP
// ============================================================

const app = express();


// ============================================================
// PORT
// ============================================================

const PORT = process.env.PORT || 5000;


// ============================================================
// CORS
// ============================================================

const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:3000",

    "https://dev-flow-7nbl3z6xl-hack-tech.vercel.app",
    "https://dev-flow-x.vercel.app",
    "https://devflowx-frontend.onrender.com",
];


if (process.env.CLIENT_URL) {
    allowedOrigins.push(
        process.env.CLIENT_URL
    );
}


app.use(
    cors({
        origin: function (origin, callback) {

            if (!origin) {
                return callback(null, true);
            }

            if (
                allowedOrigins.includes(origin)
            ) {
                return callback(null, true);
            }

            console.log(
                "Blocked CORS origin:",
                origin
            );

            return callback(
                new Error("Not allowed by CORS")
            );
        },

        credentials: true,
    })
);


// ============================================================
// BODY PARSER
// ============================================================

app.use(
    express.json({
        limit: "10mb",
    })
);

app.use(
    express.urlencoded({
        extended: true,
        limit: "10mb",
    })
);


// ============================================================
// REQUEST LOGGER
// ============================================================

app.use(
    (req, res, next) => {

        console.log(
            `${req.method} ${req.originalUrl}`
        );

        next();
    }
);


// ============================================================
// ROOT
// ============================================================

app.get(
    "/",
    (req, res) => {

        res.json({
            success: true,
            message: "DevFlow X backend is running",
            service: "Express API",
            environment:
                process.env.NODE_ENV || "development",
        });
    }
);


// ============================================================
// HEALTH
// ============================================================

app.get(
    "/api/health",
    (req, res) => {

        res.json({
            success: true,
            message: "Express backend is healthy",
        });
    }
);


// ============================================================
// API ROUTES
// ============================================================

app.use(
    "/api/auth",
    authRoutes
);

app.use(
    "/api/projects",
    projectRoutes
);

app.use(
    "/api/tasks",
    taskRoutes
);

app.use(
    "/api/teams",
    teamRoutes
);


// ============================================================
// AI ROUTES
// ============================================================

app.use(
    "/api/ai",
    aiRoutes
);


// ============================================================
// DATABASE
// ============================================================

async function connectDatabase() {

    if (!process.env.MONGO_URI) {

        console.log(
            "MONGO_URI is not configured."
        );

        return;
    }

    try {

        await mongoose.connect(
            process.env.MONGO_URI
        );

        console.log(
            "MongoDB connected successfully"
        );

    } catch (error) {

        console.error(
            "MongoDB connection error:",
            error.message
        );
    }
}


// ============================================================
// 404
// ============================================================

app.use(
    (req, res) => {

        res.status(404).json({

            success: false,

            message: "Route not found",

            path: req.originalUrl,
        });
    }
);


// ============================================================
// ERROR HANDLER
// ============================================================

app.use(
    (error, req, res, next) => {

        console.error(
            "Server error:",
            error
        );

        res.status(
            error.status || 500
        ).json({

            success: false,

            message:
                error.message ||
                "Internal server error",
        });
    }
);


// ============================================================
// START SERVER
// ============================================================

async function startServer() {

    await connectDatabase();

    app.listen(
        PORT,
        "0.0.0.0",
        () => {

            console.log(
                `DevFlow X backend running on port ${PORT}`
            );

            console.log(
                "AI service configured:",
                Boolean(
                    process.env.AI_SERVICE_URL
                )
            );

            console.log(
                "AI service URL:",
                process.env.AI_SERVICE_URL ||
                "NOT CONFIGURED"
            );
        }
    );
}


startServer();
