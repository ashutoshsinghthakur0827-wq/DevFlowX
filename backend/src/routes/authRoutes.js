
const express = require("express");

const router = express.Router();

// Import authentication controllers
const {
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser,
} = require("../controllers/authController");

// Import authentication middleware
const { protect } = require("../middleware/authMiddleware");

// ===============================
// DEBUG CONTROLLERS
// ===============================

console.log("========== AUTH ROUTE DEBUG ==========");

console.log("registerUser:", typeof registerUser);
console.log("loginUser:", typeof loginUser);
console.log("getCurrentUser:", typeof getCurrentUser);
console.log("logoutUser:", typeof logoutUser);
console.log("protect:", typeof protect);

console.log("======================================");

// ===============================
// AUTHENTICATION ROUTES
// ===============================

// Register new user
router.post("/register", registerUser);

// Login user
router.post("/login", loginUser);

// Get currently logged-in user
router.get("/me", protect, getCurrentUser);

// Logout user
router.post("/logout", protect, logoutUser);

// Export router
module.exports = router;