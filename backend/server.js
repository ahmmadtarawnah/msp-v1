const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
require("dotenv").config();
const db = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const contactRoutes = require("./routes/contactRoutes"); // Add this import for contact routes
const profileRoutes = require("./routes/profileRoutes"); // Add this import for profile routes
const adminRoutes = require("./routes/adminRoutes");
const lawyerApplicationRoutes = require("./routes/lawyerApplicationRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const videoRoutes = require("./routes/videoRoutes");
const blogRoutes = require("./routes/blogRoutes");
const blogCommentRoutes = require('./routes/blogCommentRoutes');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "uploads");
const blogsDir = path.join(uploadsDir, "blogs");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

if (!fs.existsSync(blogsDir)) {
  fs.mkdirSync(blogsDir, { recursive: true });
}

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Database connection
db.connect();

// Routes
app.use("/api/auth", authRoutes); // Auth routes
app.use("/api/admin", adminRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/lawyer-applications", lawyerApplicationRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/video", videoRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/blog-comments", blogCommentRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is 🏃‍➡️ on port ${PORT}`);
});
