const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { generateRoadmap } = require("../controllers/roadmap");
const { User } = require("../models/user");

// Route to generate a personalized roadmap
// POST /api/roadmap/generate
router.post("/generate", auth, generateRoadmap);

// Route to get the stored roadmap
// GET /api/roadmap
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    
    if (!user.roadmap) {
      return res.status(404).json({
        success: false,
        message: "No roadmap found for this user. Please generate a roadmap first."
      });
    }
    
    return res.status(200).json({
      success: true,
      roadmap: user.roadmap
    });
  } catch (error) {
    console.error("Error fetching roadmap:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch roadmap. Please try again later."
    });
  }
});

module.exports = router;
