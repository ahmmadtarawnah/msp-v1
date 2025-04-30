const User = require("../models/userModel");
const jwt = require('jsonwebtoken');

// Get all users with statistics
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    
    // Calculate statistics
    const stats = {
      totalUsers: users.length,
      totalLawyers: users.filter(user => user.role === "lawyer").length,
      totalAdmins: users.filter(user => user.role === "admin").length,
    };

    res.status(200).json({ users, stats });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error while fetching users" });
  }
};

// Delete a user
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent deleting the last admin
    if (user.role === "admin") {
      const adminCount = await User.countDocuments({ role: "admin" });
      if (adminCount <= 1) {
        return res.status(400).json({ message: "Cannot delete the last admin" });
      }
    }

    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Server error while deleting user" });
  }
};

// Update user role
const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!["user", "lawyer", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent changing the last admin's role
    if (user.role === "admin" && role !== "admin") {
      const adminCount = await User.countDocuments({ role: "admin" });
      if (adminCount <= 1) {
        return res.status(400).json({ message: "Cannot change the last admin's role" });
      }
    }

    user.role = role;
    await user.save();

    // Generate new JWT token with updated role
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1D" }
    );

    res.status(200).json({ 
      message: "User role updated successfully", 
      user,
      token // Send the new token in the response
    });
  } catch (error) {
    console.error("Error updating user role:", error);
    res.status(500).json({ message: "Server error while updating user role" });
  }
};

module.exports = {
  getAllUsers,
  deleteUser,
  updateUserRole,
}; 