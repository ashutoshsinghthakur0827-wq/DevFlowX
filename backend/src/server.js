
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// ===============================
// IMPORT ROUTES
// ===============================

const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");
const teamRoutes = require("./routes/teamRoutes");
const aiRoutes = require("./routes/aiRoutes");
const ragRoutes = require("./routes/ragRoutes");

// ===============================
// CREATE EXPRESS APP
// ===============================

const app = express();

const PORT = process.env.PORT || 5000;

// ===============================
// ENVIRONMENT VALIDATION
// ===============================

if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI is missing in .env");
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error("❌ JWT_SECRET is missing in .env");
  process.exit(1);
}

// ===============================
// MIDDLEWARE
// ===============================

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// ===============================
// ROUTE VALIDATION FUNCTION
// ===============================

function validateRouter(routeName, routeHandler) {
  console.log(`${routeName}: ${typeof routeHandler}`);

  if (typeof routeHandler !== "function") {
    throw new TypeError(
      `${routeName} is invalid. Expected an Express router function.`
    );
  }
}

// ===============================
// VALIDATE ALL ROUTES
// ===============================

console.log("========== ROUTE DEBUG ==========");

validateRouter("authRoutes", authRoutes);
validateRouter("projectRoutes", projectRoutes);
validateRouter("taskRoutes", taskRoutes);
validateRouter("teamRoutes", teamRoutes);
validateRouter("aiRoutes", aiRoutes);
validateRouter("ragRoutes", ragRoutes);

console.log("=================================");

// ===============================
// ROOT ROUTE
// ===============================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    status: "healthy",
    message: "Welcome to DevFlow X Backend",
    service: "DevFlow X",
    version: "1.0.0",
  });
});

// ===============================
// HEALTH CHECK ROUTE
// ===============================

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

// ===============================
// API ROUTES
// ===============================

app.use("/api/auth", authRoutes);

app.use("/api/projects", projectRoutes);

app.use("/api/tasks", taskRoutes);

app.use("/api/teams", teamRoutes);

app.use("/api/ai", aiRoutes);

app.use("/api/rag", ragRoutes);

// ===============================
// 404 HANDLER
// ===============================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl,
    method: req.method,
  });
});

// ===============================
// GLOBAL ERROR HANDLER
// ===============================

app.use((error, req, res, next) => {
  console.error("❌ Server error:", error.message);

  const statusCode = error.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: error.message || "Internal server error",
  });
});

// ===============================
// CONNECT TO MONGODB
// ===============================

async function connectDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    throw error;
  }
}

// ===============================
// START SERVER
// ===============================

async function startServer() {
  try {
    await connectDatabase();

    app.listen(PORT, () => {
      console.log("======================================");
      console.log("🚀 DevFlow X Backend Started");
      console.log(`🌐 Server: http://localhost:${PORT}`);
      console.log(`❤️ Health: http://localhost:${PORT}/api/health`);
      console.log("🗄️ Database: MongoDB");
      console.log("======================================");
    });
  } catch (error) {
    console.error("❌ Server startup failed:", error.message);
    process.exit(1);
  }
}

startServer();