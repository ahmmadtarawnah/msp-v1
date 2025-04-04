const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const registerUser = async (req, res) => {
  const { name, username, password } = req.body;

  try {
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      username,
      password: hashedPassword,
      role: "user",
    });

    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1D", // token expires in 1 day
    });

    res.status(201).json({
      token,
      name: newUser.name,
      email: newUser.username,
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1D", // token expires in 1 day
    });

    res.status(200).json({
      token,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};
const authenticate = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return res.status(403).json({ message: "Access Denied" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid Token" });
    }
    req.userId = decoded.userId;
    next(); // Continue with the next middleware or route handler
  });
};

// Update user profile (name, email, and password)
const updateUserProfile = async (req, res) => {
  const { name, username, password } = req.body;
  const userId = req.userId;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update name and username
    if (name) user.name = name;
    if (username) user.username = username; // Update username

    // Update password if provided
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    await user.save();
    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ message: "Server error while updating profile" });
  }
};


module.exports = { registerUser, loginUser, authenticate, updateUserProfile };
