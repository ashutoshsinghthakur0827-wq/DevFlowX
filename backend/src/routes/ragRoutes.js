const express = require("express");

const {
  indexDocuments,
  askRAG
} = require("../controllers/ragController");

const router = express.Router();

router.post("/index", indexDocuments);
router.post("/ask", askRAG);

module.exports = router;