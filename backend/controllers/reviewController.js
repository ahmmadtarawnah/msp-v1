const Review = require('../models/reviewModel');
const User = require('../models/userModel');
const LawyerApplication = require('../models/lawyerApplicationModel');

// Create a new review
const createReview = async (req, res) => {
  try {
    const { lawyerId, rating, comment } = req.body;
    const userId = req.userId;

    // Check if the lawyer exists and is approved
    const lawyerApplication = await LawyerApplication.findOne({ 
      userId: lawyerId,
      status: 'approved'
    });
    
    if (!lawyerApplication) {
      return res.status(404).json({ message: 'Lawyer not found or not approved' });
    }

    const review = new Review({
      userId,
      lawyerId,
      rating,
      comment
    });

    await review.save();

    // Populate the user's name immediately
    const populatedReview = await Review.findById(review._id)
      .populate({
        path: 'userId',
        select: 'name username',
        model: 'User'
      });

    res.status(201).json(populatedReview);
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get all reviews for a specific lawyer
const getLawyerReviews = async (req, res) => {
  try {
    const { lawyerId } = req.params;
    
    const reviews = await Review.find({ lawyerId })
      .populate({
        path: 'userId',
        select: 'name username',
        model: 'User'
      })
      .sort({ createdAt: -1 });

    // Calculate average rating
    const totalReviews = reviews.length;
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalReviews > 0 ? totalRating / totalReviews : 0;

    // Ensure each review has a name
    const formattedReviews = reviews.map(review => ({
      ...review.toObject(),
      userId: {
        ...review.userId.toObject(),
        name: review.userId?.name || 'Anonymous'
      }
    }));

    res.json({
      reviews: formattedReviews,
      averageRating,
      totalReviews
    });
  } catch (error) {
    console.error('Error fetching lawyer reviews:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update a review
exports.updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user._id;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if the user is the author of the review
    if (review.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this review' });
    }

    review.rating = rating;
    review.comment = comment;
    await review.save();

    res.json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a review
const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.userId;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if the user is the lawyer or the review author
    const user = await User.findById(userId);
    if (user.role !== 'lawyer' && review.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    await Review.findByIdAndDelete(reviewId);
    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ message: 'Server error while deleting review' });
  }
};

// Get random 5-star reviews
const getRandomFiveStarReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ rating: 5 })
      .populate({
        path: 'userId',
        select: 'name username',
        model: 'User'
      })
      .populate({
        path: 'lawyerId',
        select: 'name specialization',
        model: 'User'
      })
      .sort({ createdAt: -1 });

    // Shuffle the reviews array
    const shuffledReviews = reviews.sort(() => 0.5 - Math.random());
    
    // Get 3 random reviews
    const randomReviews = shuffledReviews.slice(0, 3);

    res.json({
      reviews: randomReviews
    });
  } catch (error) {
    console.error('Error fetching random 5-star reviews:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createReview,
  getLawyerReviews,
  deleteReview,
  getRandomFiveStarReviews
}; 