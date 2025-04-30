import React, { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Star Rating component for reusability
const StarRating = ({
  rating,
  hover,
  setHover,
  onClick,
  interactive = false,
  size = "text-xl",
}) => {
  return (
    <div className="flex">
      {[...Array(5)].map((_, index) => {
        const ratingValue = index + 1;
        return (
          <div key={index} className="cursor-pointer">
            {interactive ? (
              <label>
                <input
                  type="radio"
                  name="rating"
                  value={ratingValue}
                  onClick={() => onClick(ratingValue)}
                  className="hidden"
                />
                <FaStar
                  className={`${size} transition-colors duration-200`}
                  color={
                    ratingValue <= (hover || rating) ? "#DECEB0" : "#e4e5e9"
                  }
                  onMouseEnter={() => setHover(ratingValue)}
                  onMouseLeave={() => setHover(null)}
                />
              </label>
            ) : (
              <FaStar
                className={`${size}`}
                color="#DECEB0"
                style={{ opacity: ratingValue <= rating ? 1 : 0.3 }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

// Review Card Component
const ReviewCard = ({ review }) => {
  return (
    <div className="border-b border-gray-200 pb-4 transition-all duration-300 hover:bg-gray-50 p-4 rounded">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <StarRating rating={review.rating} />
          <span className="ml-3 font-medium text-[#2B3B3A]">
            {review.userId?.name || "Anonymous"}
          </span>
        </div>
        <span className="text-sm text-gray-500">
          {new Date(review.createdAt).toLocaleDateString()}
        </span>
      </div>
      <p className="text-gray-600 mt-2">{review.comment}</p>
    </div>
  );
};

// Review Form Component
const ReviewForm = ({ onSubmitReview, isAuthenticated, navigateToLogin }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(null);
  const [comment, setComment] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error("Please login to submit a review");
      navigateToLogin();
      return;
    }

    if (!rating) {
      toast.error("Please select a rating");
      return;
    }

    if (!comment.trim()) {
      toast.error("Please write a review");
      return;
    }

    onSubmitReview(rating, comment);

    // Reset form
    setRating(0);
    setComment("");
  };

  if (!isAuthenticated) {
    return (
      <div className="mb-8 p-5 bg-[#F5F3EE] border border-[#DECEB0] rounded-lg">
        <p className="text-[#2B3B3A] flex items-center justify-between">
          <span>Please login to submit a review</span>
          <button
            onClick={navigateToLogin}
            className="bg-[#2B3B3A] hover:bg-[#1a2726] text-white px-4 py-2 rounded-md transition-colors duration-200"
          >
            Login
          </button>
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-8 bg-[#F5F3EE] p-6 rounded-lg border border-[#DECEB0]"
    >
      <h3 className="text-lg font-semibold mb-4 text-[#2B3B3A]">
        Write a Review
      </h3>

      <div className="mb-4">
        <label className="block text-[#2B3B3A] text-sm font-medium mb-2">
          Your Rating
        </label>
        <StarRating
          rating={rating}
          hover={hover}
          setHover={setHover}
          onClick={setRating}
          interactive={true}
          size="text-2xl"
        />
      </div>

      <div className="mb-4">
        <label className="block text-[#2B3B3A] text-sm font-medium mb-2">
          Your Review
        </label>
        <textarea
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DECEB0] transition-shadow duration-200"
          rows="4"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience with this lawyer..."
          required
        />
      </div>

      <button
        type="submit"
        className={`${
          !rating || !comment.trim()
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-[#2B3B3A] hover:bg-[#1a2726]"
        } text-white px-6 py-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#DECEB0]`}
        disabled={!rating || !comment.trim()}
      >
        Submit Review
      </button>
    </form>
  );
};

// Loading skeleton component
const LoadingSkeleton = () => (
  <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
    <div className="bg-[#2B3B3A] px-6 py-4">
      <div className="h-6 bg-[#1a2726] rounded w-1/4"></div>
    </div>
    <div className="p-6">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="flex gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-5 w-5 bg-gray-200 rounded"></div>
          ))}
        </div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
        <div className="h-40 bg-gray-200 rounded w-full mb-8"></div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Main Review Component
const ReviewComponent = ({ lawyerId }) => {
  const navigate = useNavigate();
  const { authData } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAuthenticated = !!authData?.token;

  useEffect(() => {
    fetchReviews();
  }, [lawyerId]);

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `http://localhost:5000/api/reviews/lawyer/${lawyerId}`
      );
      setReviews(response.data.reviews || []);
      setAverageRating(response.data.averageRating || 0);
      setTotalReviews(response.data.totalReviews || 0);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast.error("Failed to fetch reviews");
      setReviews([]);
      setAverageRating(0);
      setTotalReviews(0);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitReview = async (rating, comment) => {
    // Get token from localStorage as fallback
    const token = authData?.token || localStorage.getItem("token");

    if (!token) {
      toast.error("Please login to submit a review");
      navigate("/login");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/reviews",
        {
          lawyerId,
          rating,
          comment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Add the new review to the reviews array
      setReviews((prevReviews) => [response.data, ...prevReviews]);

      // Update average rating and total reviews
      const newTotalReviews = totalReviews + 1;
      const newTotalRating = averageRating * totalReviews + rating;
      setAverageRating(newTotalRating / newTotalReviews);
      setTotalReviews(newTotalReviews);

      toast.success("Review submitted successfully!");
    } catch (error) {
      console.error("Review submission error:", error.response?.data || error);
      toast.error(error.response?.data?.message || "Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  const navigateToLogin = () => navigate("/login");

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
      {/* Header Section with Teal Background */}
      <div className="bg-[#2B3B3A] px-6 py-4">
        <h2 className="text-xl font-bold text-[#DECEB0]">Client Reviews</h2>
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Review Summary Section */}
        <div className="mb-6 border-b border-gray-200 pb-4">
          <div className="flex items-center mb-4">
            <StarRating rating={averageRating} size="text-2xl" />
            <span className="ml-3 text-lg text-[#2B3B3A]">
              <span className="font-medium">
                {averageRating?.toFixed(1) || "0.0"}
              </span>
              <span className="mx-1">•</span>
              <span>
                {totalReviews || 0} {totalReviews === 1 ? "review" : "reviews"}
              </span>
            </span>
          </div>
        </div>

        {/* Review Form Section */}
        <ReviewForm
          onSubmitReview={handleSubmitReview}
          isAuthenticated={isAuthenticated}
          navigateToLogin={navigateToLogin}
        />

        {/* Review List Section */}
        <div className="space-y-4">
          {isSubmitting && (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#DECEB0]"></div>
              <p className="mt-2 text-gray-600">Submitting your review...</p>
            </div>
          )}

          {reviews.length > 0 ? (
            <>
              <h3 className="text-lg font-semibold mb-4 text-[#2B3B3A]">
                Client Feedback
              </h3>
              <div className="divide-y divide-gray-100">
                {reviews.map((review) => (
                  <ReviewCard key={review._id} review={review} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-8 bg-[#F5F3EE] rounded-lg border border-[#DECEB0]">
              <p className="text-[#2B3B3A]">
                No reviews yet. Be the first to share your experience!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewComponent;
