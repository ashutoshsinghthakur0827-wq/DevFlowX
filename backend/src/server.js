
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");
const teamRoutes = require("./routes/teamRoutes");
const aiRoutes = require("./routes/aiRoutes");
const ragRoutes = require("./routes/ragRoutes");

// Create Express application
const app = express();

// Environment variables
const PORT = Number(process.env.PORT) || 5000;
const MONGO_URI = process.env.MONGO_URI;
const CLIENT_URL = process.env.CLIENT_URL;

// Validate required environment variables
if (!MONGO_URI) {
  console.error("ERROR: MONGO_URI is missing in environment variables");
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error("ERROR: JWT_SECRET is missing in environment variables");
  process.exit(1);
}

// ==================================================
// MIDDLEWARE
// ==================================================

// JSON request body
app.use(
  express.json({
    limit: "10mb",
  })
);

// URL encoded request body
app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);

// ==================================================
// CORS CONFIGURATION
// ==================================================

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://dev-flow-x.vercel.app",
  "https://devflowx-frontend.onrender.com",
  CLIENT_URL,
].filter(Boolean);

// Remove duplicate origins
const uniqueOrigins = [...new Set(allowedOrigins)];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests without an Origin header.
    // Example: Postman or server-to-server requests.
    if (!origin) {
      return callback(null, true);
    }

    if (uniqueOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.log("Blocked CORS origin:", origin);

    return callback(
      new Error(`CORS: Origin ${origin} is not allowed`)
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

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle browser preflight requests
app.options(/.*/, cors(corsOptions));

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
    environment: process.env.NODE_ENV || "development",
  });
});

// ==================================================
// HEALTH CHECK ROUTE
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

app.use("/api/auth", authRoutes);

app.use("/api/projects", projectRoutes);

app.use("/api/tasks", taskRoutes);

app.use("/api/teams", teamRoutes);

app.use("/api/ai", aiRoutes);

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
  console.error("Global error:", error.message);

  // CORS error
  if (error.message.startsWith("CORS:")) {
    return res.status(403).json({
      success: false,
      message: "CORS error: Origin is not allowed",
    });
  }

  // General server error
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

    console.log("MongoDB connected successfully");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (error) {
    console.error(
      "MongoDB connection failed:",
      error.message
    );

    process.exit(1);
  }
}

// Start application
startServer();
