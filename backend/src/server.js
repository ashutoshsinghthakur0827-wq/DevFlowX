
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

// ==================================================
// LOAD ENVIRONMENT VARIABLES
// ==================================================

dotenv.config();

// ==================================================
// IMPORT ROUTES
// ==================================================

const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");
const teamRoutes = require("./routes/teamRoutes");
const aiRoutes = require("./routes/aiRoutes");
const ragRoutes = require("./routes/ragRoutes");

// ==================================================
// CREATE EXPRESS APPLICATION
// ==================================================

const app = express();

// ==================================================
// ENVIRONMENT VARIABLES
// ==================================================

const PORT = Number(process.env.PORT) || 5000;
const MONGO_URI = process.env.MONGO_URI;
const CLIENT_URL = process.env.CLIENT_URL;

// ==================================================
// VALIDATE ENVIRONMENT VARIABLES
// ==================================================

if (!MONGO_URI) {
  console.error(
    "ERROR: MONGO_URI is missing in environment variables"
  );

  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error(
    "ERROR: JWT_SECRET is missing in environment variables"
  );

  process.exit(1);
}

// ==================================================
// CORS CONFIGURATION
// ==================================================

const allowedOrigins = [
  // Local development
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:3000",

  // Deployed Vercel frontend
  "https://dev-flow-7nbl3z6xl-hack-tech.vercel.app",

  // Other frontend URLs
  "https://dev-flow-x.vercel.app",
  "https://devflowx-frontend.onrender.com",

  // Environment variable
  CLIENT_URL,
].filter(Boolean);

// Remove duplicate origins
const uniqueOrigins = [
  ...new Set(allowedOrigins),
];

console.log("Allowed CORS origins:");
console.log(uniqueOrigins);

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests without Origin headers.
    // Example: Postman and server-to-server requests.
    if (!origin) {
      return callback(null, true);
    }

    if (uniqueOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.log("Blocked CORS origin:", origin);

    return callback(
      new Error("CORS: Origin is not allowed")
    );
  },

  credentials: true,

  methods: [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
    "OPTIONS",
  ],

  allowedHeaders: [
    "Content-Type",
    "Authorization",
  ],

  optionsSuccessStatus: 204,
};

// ==================================================
// MIDDLEWARE
// ==================================================

// CORS must be registered before API routes.
app.use(cors(corsOptions));

// Handle browser preflight requests.
app.options(/.*/, cors(corsOptions));

// Parse JSON request body.
app.use(
  express.json({
    limit: "10mb",
  })
);

// Parse URL-encoded request body.
app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);

// ==================================================
// REQUEST LOGGING
// ==================================================

app.use((req, res, next) => {
  console.log(
    `${new Date().toISOString()} ${req.method} ${req.originalUrl}`
  );

  next();
});

// ==================================================
// ROOT ROUTE
// ==================================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "DevFlow X backend is running",
    service: "Express API",
    environment:
      process.env.NODE_ENV || "development",
  });
});

// ==================================================
// GENERAL HEALTH CHECK
// ==================================================

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "DevFlow X backend is running",

    database:
      mongoose.connection.readyState === 1
        ? "connected"
        : "disconnected",

    timestamp: new Date().toISOString(),
  });
});

// ==================================================
// API ROUTES
// ==================================================

// Authentication routes
app.use("/api/auth", authRoutes);

// Project routes
app.use("/api/projects", projectRoutes);

// Task routes
app.use("/api/tasks", taskRoutes);

// Team routes
app.use("/api/teams", teamRoutes);

// AI routes
// GET  /api/ai/health
// POST /api/ai/ask
app.use("/api/ai", aiRoutes);

// RAG routes
app.use("/api/rag", ragRoutes);

// ==================================================
// 404 ROUTE
// ==================================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl,
  });
});

// ==================================================
// GLOBAL ERROR HANDLER
// ==================================================

app.use((error, req, res, next) => {
  console.error(
    "Global error:",
    error.message
  );

  // Handle CORS errors
  if (
    error.message &&
    error.message.startsWith("CORS:")
  ) {
    return res.status(403).json({
      success: false,
      message: "CORS error: Origin is not allowed",
    });
  }

  // Handle general errors
  return res.status(500).json({
    success: false,
    message: "Internal server error",

    ...(process.env.NODE_ENV !== "production" && {
      error: error.message,
    }),
  });
});

// ==================================================
// CONNECT MONGODB AND START SERVER
// ==================================================

async function startServer() {
  try {
    await mongoose.connect(MONGO_URI);

    console.log(
      "MongoDB connected successfully"
    );

    app.listen(PORT, "0.0.0.0", () => {
      console.log(
        `Server running on port ${PORT}`
      );

      console.log(
        `Environment: ${
          process.env.NODE_ENV || "development"
        }`
      );

      console.log(
        `AI service configured: ${
          Boolean(process.env.AI_SERVICE_URL)
        }`
      );

      console.log(
        `Client URL: ${
          CLIENT_URL || "Not configured"
        }`
      );
    });
  } catch (error) {
    console.error(
      "MongoDB connection failed:",
      error.message
    );

    process.exit(1);
  }
}

// ==================================================
// START APPLICATION
// ==================================================

startServer();
