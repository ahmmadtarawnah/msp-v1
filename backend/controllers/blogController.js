const Blog = require("../models/blogModel");

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
  addBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog
}; 