const Blog = require("../models/blogModel");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "../uploads/blogs");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
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
}).array("featuredImages", 3); // Allow up to 3 images

const createBlogPost = async (req, res) => {
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      console.error("Multer error:", err);
      return res.status(400).json({ message: err.message });
    } else if (err) {
      console.error("Unknown error:", err);
      return res.status(400).json({ message: err.message });
    }

    try {
      console.log("Request body:", req.body);
      console.log("Request files:", req.files);

      const { title, content } = req.body;

      if (!title || !content) {
        console.error("Missing required fields:", { title, content });
        return res.status(400).json({ message: "Title and content are required" });
      }

      if (!req.files || req.files.length === 0) {
        console.error("No files uploaded");
        return res.status(400).json({ message: "At least one featured image is required" });
      }

      const featuredImages = req.files.map(file => `/uploads/blogs/${file.filename}`);
      console.log("Featured images:", featuredImages);

      const newBlog = new Blog({
        title,
        content,
        featuredImages,
        author: req.userId // This comes from the auth middleware
      });

      console.log("Creating new blog:", newBlog);
      await newBlog.save();
      console.log("Blog saved successfully");
      
      res.status(201).json({ message: "Blog post created successfully", blog: newBlog });
    } catch (error) {
      console.error("Error creating blog post:", error);
      // If there's an error, clean up any uploaded files
      if (req.files) {
        req.files.forEach(file => {
          const filePath = path.join(__dirname, "../uploads/blogs", file.filename);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        });
      }
      res.status(500).json({ 
        message: "Error creating blog post",
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  });
};

const getAllBlogPosts = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate("author", "name")
      .sort({ datePublished: -1 });
    res.status(200).json(blogs);
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    res.status(500).json({ message: "Error fetching blog posts" });
  }
};

// Add a new blog
const addBlog = async (req, res) => {
  try {
    const { title, details } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Blog picture is required" });
    }

    const blog = new Blog({
      title,
      details,
      blogPic: req.file.filename
    });

    await blog.save();
    res.status(201).json(blog);
  } catch (error) {
    console.error("Error adding blog:", error);
    res.status(500).json({ message: "Server error while adding blog" });
  }
};

// Get all blogs
const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({ message: "Server error while fetching blogs" });
  }
};

// Get a single blog by ID
const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.status(200).json(blog);
  } catch (error) {
    console.error("Error fetching blog:", error);
    res.status(500).json({ message: "Server error while fetching blog" });
  }
};

// Update a blog
const updateBlog = async (req, res) => {
  try {
    const { title, details } = req.body;
    const updateData = { title, details };

    if (req.file) {
      updateData.blogPic = req.file.filename;
    }

    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json(blog);
  } catch (error) {
    console.error("Error updating blog:", error);
    res.status(500).json({ message: "Server error while updating blog" });
  }
};

// Delete a blog
const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error("Error deleting blog:", error);
    res.status(500).json({ message: "Server error while deleting blog" });
  }
};

module.exports = {
  createBlogPost,
  getAllBlogPosts,
  addBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog
}; 