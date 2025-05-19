const express = require('express');
const router = express.Router();
const { authenticate } = require('../controllers/authController');
const { createReview, getLawyerReviews, deleteReview, getRandomFiveStarReviews } = require('../controllers/reviewController');

// Create a new review
router.post('/', authenticate, createReview);

// Get reviews for a specific lawyer (removed authentication requirement)
router.get('/lawyer/:lawyerId', getLawyerReviews);

// Get random 5-star reviews
router.get('/random-five-star', getRandomFiveStarReviews);

// Delete a review (only lawyer or review author can delete)
router.delete('/:reviewId', authenticate, deleteReview);

module.exports = router; 