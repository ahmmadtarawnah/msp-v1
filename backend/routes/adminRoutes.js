const express = require("express");
const router = express.Router();
const { authenticate, isAdmin } = require("../controllers/authController");
const {
  getAllUsers,
  deleteUser,
  updateUserRole,
} = require("../controllers/adminController");

// Apply authentication and admin role check to all admin routes
router.use(authenticate);
router.use(isAdmin);

// Get all users with statistics
router.get("/users", getAllUsers);

// Delete a user
router.delete("/users/:userId", deleteUser);

// Update user role
router.put("/users/:userId/role", updateUserRole);

module.exports = router; 