const express = require("express");
const {
  registerUser,
  loginUser,
  authenticate,
} = require("../controllers/authController");

const router = express.Router();

// Register route (updated to lowercase)
router.post("/signup", registerUser);

// Login route (updated to lowercase)
router.post("/login", loginUser);

module.exports = router;
