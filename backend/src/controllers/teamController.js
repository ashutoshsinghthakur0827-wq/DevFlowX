const mongoose = require("mongoose");
const Team = require("../models/Team");

// Delete team
const deleteTeam = async (req, res) => {
  try {
    const { teamId } = req.params;

    // Validate MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(teamId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid team ID",
      });
    }

    // Find team
    const team = await Team.findById(teamId);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found",
      });
    }

    // Delete team
    await Team.findByIdAndDelete(teamId);

    return res.status(200).json({
      success: true,
      message: "Team deleted successfully",
      teamId: teamId,
    });
  } catch (error) {
    console.error("Delete team error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to delete team",
      error: error.message,
    });
  }
};

module.exports = {
  deleteTeam,
};