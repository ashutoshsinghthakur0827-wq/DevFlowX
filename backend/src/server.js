
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
  console.error("ERROR: MONGO_URI is missing in .env");
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error("ERROR: JWT_SECRET is missing in .env");
  process.exit(1);
}

// Middleware

// JSON request body
app.use(express.json({ limit: "10mb" }));

// URL encoded request body
app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);

// CORS configuration
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests without an origin
      // Example: Postman or server-to-server requests
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error("CORS: Origin is not allowed")
      );
    },
    credentials: true,
  })
);

// Request logging middleware
app.use((req, res, next) => {
  console.log(
    `${req.method} ${req.originalUrl}`
  );

  next();
});

// Root route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "DevFlow X backend is running",
    service: "Express API",
  });
});

// Health check route
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

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/rag", ragRoutes);

// 404 route
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl,
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error("Global error:", error.message);

  if (error.message.includes("CORS")) {
    return res.status(403).json({
      success: false,
      message: "CORS error: Origin is not allowed",
    });
  }

  res.status(500).json({
    success: false,
    message: "Internal server error",
    error:
      process.env.NODE_ENV === "production"
        ? undefined
        : error.message,
  });
});

// Connect MongoDB and start server
async function startServer() {
  try {
    await mongoose.connect(MONGO_URI);

    console.log("MongoDB connected successfully");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(
        `Server running on port ${PORT}`
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

startServer();
