
const express = require("express");

const {
  askAI,
  aiHealth
} = require("../controllers/aiController");


const router = express.Router();


router.get("/health", aiHealth);

router.post("/ask", askAI);


module.exports = router;