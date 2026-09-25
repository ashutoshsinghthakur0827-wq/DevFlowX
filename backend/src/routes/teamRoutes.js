const express = require("express");

const router = express.Router();

const {
  deleteTeam,
} = require("../controllers/teamController");

// Delete team
router.delete("/:teamId", deleteTeam);

// Export router
module.exports = router;