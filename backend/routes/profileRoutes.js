const express = require("express");
const { authenticate } = require("../controllers/authController");
const User = require("../models/userModel");
const { updateUserProfile } = require("../controllers/authController");

const router = express.Router();

// Get user profile
router.get("/", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password"); // Exclude password
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      _id: user._id,
      name: user.name,
      username: user.username,
      role: user.role
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Server error fetching profile" });
  }
});

router.put("/", authenticate, updateUserProfile);

module.exports = router;
