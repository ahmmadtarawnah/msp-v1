const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { authenticate, isAdmin } = require("../controllers/authController");
const {
  addBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  createBlogPost,
  getAllBlogPosts
} = require("../controllers/blogController");

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  }
});

// Public routes
router.get("/", getAllBlogPosts);
router.get("/:id", getBlogById);

// Admin routes (protected)
router.post("/", authenticate, isAdmin, createBlogPost);
router.put("/:id", authenticate, isAdmin, updateBlog);
router.delete("/:id", authenticate, isAdmin, deleteBlog);

module.exports = router; 