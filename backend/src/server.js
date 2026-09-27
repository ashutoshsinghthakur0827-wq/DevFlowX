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

    // --------------------------------------------------------
    // LOCAL DEVELOPMENT
    // --------------------------------------------------------

    "http://localhost:5173",
    "http://127.0.0.1:5173",

    "http://localhost:3000",
    "http://127.0.0.1:3000",


    // --------------------------------------------------------
    // CURRENT VERCEL FRONTEND
    // --------------------------------------------------------

    "https://dev-flow-kbu9odobi-hack-tech.vercel.app",


    // --------------------------------------------------------
    // PREVIOUS VERCEL DEPLOYMENTS
    // --------------------------------------------------------

    "https://dev-flow-dwve5i1kz-hack-tech.vercel.app",

    "https://dev-flow-7nbl3z6xl-hack-tech.vercel.app",

    "https://dev-flow-x.vercel.app",


    // --------------------------------------------------------
    // OTHER FRONTEND DEPLOYMENT
    // --------------------------------------------------------

    "https://devflowx-frontend.onrender.com"
];


// ============================================================
// CLIENT URL FROM ENVIRONMENT
// ============================================================

if (process.env.CLIENT_URL) {

    allowedOrigins.push(
        process.env.CLIENT_URL
    );
}


// ============================================================
// REMOVE DUPLICATES
// ============================================================

const uniqueOrigins = [
    ...new Set(
        allowedOrigins.filter(Boolean)
    )
];


// ============================================================
// PRINT CORS ORIGINS
// ============================================================

console.log(
    "=========================================="
);

console.log(
    "Allowed CORS Origins:"
);

uniqueOrigins.forEach(
    (origin) => {

        console.log(
            " -",
            origin
        );
    }
);

console.log(
    "=========================================="
);


// ============================================================
// CORS MIDDLEWARE
// ============================================================

app.use(
    cors({

        origin: function (
            origin,
            callback
        ) {

            // ------------------------------------------------
            // Allow requests without Origin
            // ------------------------------------------------

            if (!origin) {

                return callback(
                    null,
                    true
                );
            }


            // ------------------------------------------------
            // Check allowed origins
            // ------------------------------------------------

            if (
                uniqueOrigins.includes(
                    origin
                )
            ) {

                return callback(
                    null,
                    true
                );
            }


            // ------------------------------------------------
            // Block unknown origin
            // ------------------------------------------------

            console.log(
                "Blocked CORS origin:",
                origin
            );

            return callback(
                new Error(
                    "Not allowed by CORS"
                )
            );
        },


        // ----------------------------------------------------
        // Credentials
        // ----------------------------------------------------

        credentials: true,


        // ----------------------------------------------------
        // HTTP Methods
        // ----------------------------------------------------

        methods: [
            "GET",
            "POST",
            "PUT",
            "PATCH",
            "DELETE",
            "OPTIONS"
        ],


        // ----------------------------------------------------
        // Headers
        // ----------------------------------------------------

        allowedHeaders: [
            "Content-Type",
            "Authorization"
        ]
    })
);


// ============================================================
// IMPORTANT
// ============================================================
//
// DO NOT ADD:
//
// app.options("*", cors());
//
// Express 5 + path-to-regexp can throw:
//
// PathError: Missing parameter name at index 1: *
//
// The cors middleware above already handles CORS
// preflight requests.
// ============================================================


// ============================================================
// BODY PARSER
// ============================================================

app.use(
    express.json({
        limit: "10mb"
    })
);


app.use(
    express.urlencoded({
        extended: true,
        limit: "10mb"
    })
);


// ============================================================
// REQUEST LOGGER
// ============================================================

app.use(
    (req, res, next) => {

        console.log(
            `[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`
        );

        next();
    }
);


// ============================================================
// ROOT ROUTE
// ============================================================

app.get(
    "/",
    (req, res) => {

        res.status(200).json({

            success: true,

            message:
                "DevFlow X backend is running",

            service:
                "Express API",

            status:
                "online",

            environment:
                process.env.NODE_ENV ||
                "development"
        });
    }
);


// ============================================================
// HEALTH ROUTE
// ============================================================

app.get(
    "/api/health",
    (req, res) => {

        res.status(200).json({

            success: true,

            message:
                "Express backend is healthy",

            service:
                "Express API",

            status:
                "online"
        });
    }
);


// ============================================================
// AUTH ROUTES
// ============================================================

app.use(
    "/api/auth",
    authRoutes
);


// ============================================================
// PROJECT ROUTES
// ============================================================

app.use(
    "/api/projects",
    projectRoutes
);


// ============================================================
// TASK ROUTES
// ============================================================

app.use(
    "/api/tasks",
    taskRoutes
);


// ============================================================
// TEAM ROUTES
// ============================================================

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

    // --------------------------------------------------------
    // Check MongoDB URI
    // --------------------------------------------------------

    if (!process.env.MONGO_URI) {

        console.log(
            "MONGO_URI is not configured."
        );

        console.log(
            "Server will continue without MongoDB."
        );

        return;
    }


    // --------------------------------------------------------
    // Connect MongoDB
    // --------------------------------------------------------

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

        // Do not crash the entire server
        // because of database connection failure.

    }
}


// ============================================================
// 404 HANDLER
// ============================================================

app.use(
    (req, res) => {

        res.status(404).json({

            success: false,

            message:
                "Route not found",

            path:
                req.originalUrl
        });
    }
);


// ============================================================
// ERROR HANDLER
// ============================================================

app.use(
    (
        error,
        req,
        res,
        next
    ) => {

        console.error(
            "Server error:",
            error
        );


        // ----------------------------------------------------
        // CORS error
        // ----------------------------------------------------

        if (
            error.message ===
            "Not allowed by CORS"
        ) {

            return res.status(403).json({

                success: false,

                message:
                    "CORS policy blocked this origin",

                origin:
                    req.headers.origin ||
                    null
            });
        }


        // ----------------------------------------------------
        // General error
        // ----------------------------------------------------

        res.status(
            error.status ||
            500
        ).json({

            success: false,

            message:
                error.message ||
                "Internal server error"
        });
    }
);


// ============================================================
// START SERVER
// ============================================================

async function startServer() {

    // --------------------------------------------------------
    // Database
    // --------------------------------------------------------

    await connectDatabase();


    // --------------------------------------------------------
    // Start Express
    // --------------------------------------------------------

    app.listen(
        PORT,
        "0.0.0.0",
        () => {

            console.log(
                "=========================================="
            );

            console.log(
                `DevFlow X backend running on port ${PORT}`
            );

            console.log(
                "Environment:",
                process.env.NODE_ENV ||
                "development"
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

            console.log(
                "=========================================="
            );
        }
    );
}


// ============================================================
// START APPLICATION
// ============================================================

startServer();
