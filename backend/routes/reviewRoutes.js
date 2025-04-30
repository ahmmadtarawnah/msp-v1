const express = require('express');
const router = express.Router();
const { authenticate } = require('../controllers/authController');
const { createReview, getLawyerReviews, deleteReview } = require('../controllers/reviewController');

// Create a new review
router.post('/', authenticate, createReview);

// Get reviews for a specific lawyer
router.get('/lawyer/:lawyerId', authenticate, getLawyerReviews);

// Delete a review (only lawyer or review author can delete)
router.delete('/:reviewId', authenticate, deleteReview);

module.exports = router; 