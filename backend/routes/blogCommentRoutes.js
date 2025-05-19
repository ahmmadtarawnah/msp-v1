const express = require('express');
const router = express.Router();
const { authenticate } = require('../controllers/authController');
const { createComment, getBlogComments, deleteComment } = require('../controllers/blogCommentController');

// Create a new comment
router.post('/', authenticate, createComment);

// Get comments for a specific blog
router.get('/blog/:blogId', getBlogComments);

// Delete a comment
router.delete('/:commentId', authenticate, deleteComment);

module.exports = router; 