const BlogComment = require('../models/blogCommentModel');
const Blog = require('../models/blogModel');

// Create a new comment
const createComment = async (req, res) => {
  try {
    const { blogId, comment } = req.body;
    const userId = req.userId;

    // Check if the blog exists
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    const newComment = new BlogComment({
      userId,
      blogId,
      comment
    });

    await newComment.save();

    // Populate the user's name immediately
    const populatedComment = await BlogComment.findById(newComment._id)
      .populate({
        path: 'userId',
        select: 'name username',
        model: 'User'
      });

    res.status(201).json(populatedComment);
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get all comments for a specific blog
const getBlogComments = async (req, res) => {
  try {
    const { blogId } = req.params;
    
    const comments = await BlogComment.find({ blogId })
      .populate({
        path: 'userId',
        select: 'name username',
        model: 'User'
      })
      .sort({ createdAt: -1 });

    // Ensure each comment has a name
    const formattedComments = comments.map(comment => ({
      ...comment.toObject(),
      userId: {
        ...comment.userId.toObject(),
        name: comment.userId?.name || 'Anonymous'
      }
    }));

    res.json({
      comments: formattedComments,
      totalComments: comments.length
    });
  } catch (error) {
    console.error('Error fetching blog comments:', error);
    res.status(500).json({ message: error.message });
  }
};

// Delete a comment
const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.userId;

    const comment = await BlogComment.findById(commentId);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if the user is the comment author
    if (comment.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    await BlogComment.findByIdAndDelete(commentId);
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createComment,
  getBlogComments,
  deleteComment
}; 