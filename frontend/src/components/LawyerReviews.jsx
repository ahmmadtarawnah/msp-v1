import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import Swal from "sweetalert2";
import { Star, Trash2, Activity, MessageCircle, Calendar, MessageSquare } from "lucide-react";

// Rating stars component for reusability
const RatingStars = ({ rating, size = 5 }) => (
  <div className="flex">
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-${size} h-${size} ${
          i < rating ? "text-[#E8D8B0] fill-[#E8D8B0]" : "text-gray-200"
        }`}
      />
    ))}
  </div>
);

// Stats card component
const StatsCard = ({ title, value, icon }) => (
  <div className="bg-white rounded-xl shadow-sm p-6 border border-[#E8D8B0]/20">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-[#4A5B5A]">{title}</p>
        <p className="mt-1 text-3xl font-semibold text-[#3A4B4A]">{value}</p>
      </div>
      <div className="p-3 bg-[#F5F0E6] rounded-lg">
        {icon}
      </div>
    </div>
  </div>
);

// Review card component
const ReviewCard = ({ review, onDelete, onRespond }) => {
  const [showResponseForm, setShowResponseForm] = useState(false);
  const [response, setResponse] = useState(review.response || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitResponse = async () => {
    setIsSubmitting(true);
    try {
      await onRespond(review._id, response);
      setShowResponseForm(false);
    } catch (error) {
      console.error('Error submitting response:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-[#E8D8B0]/20">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <RatingStars rating={review.rating} />
              <span className="ml-2 text-sm text-[#4A5B5A]">
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-[#3A4B4A] mb-2">
              {review.userId?.name || 'Anonymous'}
            </h3>
            <p className="text-[#4A5B5A] mb-4">{review.comment}</p>
          </div>
          <button
            onClick={() => onDelete(review._id)}
            className="text-[#4A5B5A] hover:text-red-500 transition-colors"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>

        {review.response ? (
          <div className="mt-4 pl-4 border-l-4 border-[#E8D8B0]">
            <p className="text-sm font-medium text-[#3A4B4A] mb-1">Your Response</p>
            <p className="text-[#4A5B5A]">{review.response}</p>
          </div>
        ) : (
          <div className="mt-4">
            {!showResponseForm ? (
              <button
                onClick={() => setShowResponseForm(true)}
                className="inline-flex items-center text-sm font-medium text-[#3A4B4A] hover:text-[#4A5B5A] transition-colors"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Respond to Review
              </button>
            ) : (
              <div className="space-y-4">
                <textarea
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  placeholder="Write your response..."
                  className="w-full px-3 py-2 border border-[#E8D8B0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3A4B4A] focus:border-transparent"
                  rows={3}
                />
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowResponseForm(false)}
                    className="px-4 py-2 text-sm font-medium text-[#4A5B5A] hover:text-[#3A4B4A] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitResponse}
                    disabled={isSubmitting || !response.trim()}
                    className="px-4 py-2 text-sm font-medium text-white bg-[#3A4B4A] rounded-lg hover:bg-[#4A5B5A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Response'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Empty state component
const EmptyState = () => (
  <div className="text-center py-12">
    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#F5F0E6] mb-4">
      <MessageCircle className="h-8 w-8 text-[#3A4B4A]" />
    </div>
    <h3 className="text-lg font-medium text-[#3A4B4A] mb-2">No Reviews Yet</h3>
    <p className="text-[#4A5B5A]">You haven't received any reviews from clients yet.</p>
  </div>
);

// Loading spinner component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#3A4B4A] border-t-transparent"></div>
  </div>
);

// Main component
const LawyerReviews = () => {
  const { authData } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: [0, 0, 0, 0, 0],
  });
  const [displayedReviews, setDisplayedReviews] = useState(5);
  const [hasMoreReviews, setHasMoreReviews] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  useEffect(() => {
    setHasMoreReviews(displayedReviews < reviews.length);
  }, [displayedReviews, reviews.length]);

  const loadMoreReviews = () => {
    setDisplayedReviews(prev => prev + 5);
  };

  const fetchReviews = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/reviews/lawyer/${authData.userId}`,
        {
          headers: {
            Authorization: `Bearer ${authData.token}`,
          },
        }
      );

      const fetchedReviews = response.data.reviews || [];
      setReviews(fetchedReviews);

      // Calculate rating statistics
      const totalReviews = fetchedReviews.length;
      const totalRating = fetchedReviews.reduce(
        (sum, review) => sum + review.rating,
        0
      );
      const averageRating = totalReviews > 0 ? totalRating / totalReviews : 0;

      // Calculate rating distribution
      const distribution = [0, 0, 0, 0, 0];
      fetchedReviews.forEach((review) => {
        distribution[review.rating - 1]++;
      });

      setStats({
        averageRating,
        totalReviews,
        ratingDistribution: distribution,
      });

      setLoading(false);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch reviews. Please try again later.",
      });
      setLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    const result = await Swal.fire({
      title: "Delete Review",
      text: "Are you sure you want to remove this review? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#4F46E5",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
      borderRadius: 10,
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/api/reviews/${reviewId}`, {
          headers: {
            Authorization: `Bearer ${authData.token}`,
          },
        });

        // Update reviews state
        setReviews(reviews.filter((review) => review._id !== reviewId));

        // Recalculate stats
        const updatedReviews = reviews.filter(
          (review) => review._id !== reviewId
        );
        const totalReviews = updatedReviews.length;
        const totalRating = updatedReviews.reduce(
          (sum, review) => sum + review.rating,
          0
        );
        const averageRating = totalReviews > 0 ? totalRating / totalReviews : 0;

        const distribution = [0, 0, 0, 0, 0];
        updatedReviews.forEach((review) => {
          distribution[review.rating - 1]++;
        });

        setStats({
          averageRating,
          totalReviews,
          ratingDistribution: distribution,
        });

        Swal.fire({
          icon: "success",
          title: "Deleted",
          text: "The review has been removed successfully.",
          confirmButtonColor: "#4F46E5",
          timer: 3000,
        });
      } catch (error) {
        console.error("Error deleting review:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to delete review. Please try again later.",
          confirmButtonColor: "#4F46E5",
        });
      }
    }
  };

  const handleRespond = async (reviewId, response) => {
    try {
      await axios.post(
        `http://localhost:5000/api/reviews/${reviewId}/response`,
        { response },
        {
          headers: {
            Authorization: `Bearer ${authData.token}`,
          },
        }
      );

      // Update reviews state
      setReviews(reviews.map((review) =>
        review._id === reviewId ? { ...review, response } : review
      ));

      // Recalculate stats
      const updatedReviews = reviews.map((review) =>
        review._id === reviewId ? { ...review, response } : review
      );
      const totalReviews = updatedReviews.length;
      const totalRating = updatedReviews.reduce(
        (sum, review) => sum + review.rating,
        0
      );
      const averageRating = totalReviews > 0 ? totalRating / totalReviews : 0;

      const distribution = [0, 0, 0, 0, 0];
      updatedReviews.forEach((review) => {
        distribution[review.rating - 1]++;
      });

      setStats({
        averageRating,
        totalReviews,
        ratingDistribution: distribution,
      });

      Swal.fire({
        icon: "success",
        title: "Response Submitted",
        text: "Your response has been submitted successfully.",
        confirmButtonColor: "#4F46E5",
        timer: 3000,
      });
    } catch (error) {
      console.error("Error submitting response:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to submit response. Please try again later.",
        confirmButtonColor: "#4F46E5",
      });
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-[#F5F0E6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#3A4B4A]">Client Reviews</h1>
          <p className="mt-2 text-[#4A5B5A]">Manage and respond to your client reviews</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard
            title="Average Rating"
            value={stats.averageRating.toFixed(1)}
            icon={<Star className="h-6 w-6" />}
          />
          <StatsCard
            title="Total Reviews"
            value={stats.totalReviews}
            icon={<MessageCircle className="h-6 w-6" />}
          />
          <StatsCard
            title="Response Rate"
            value={`${(stats.totalReviews > 0 ? (stats.ratingDistribution[4] / stats.totalReviews) * 100 : 0).toFixed(2)}%`}
            icon={<MessageSquare className="h-6 w-6" />}
          />
        </div>

        {/* Rating Distribution */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-[#E8D8B0]/20">
          <h2 className="text-xl font-semibold text-[#3A4B4A] mb-4">Rating Distribution</h2>
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center">
                <span className="w-12 text-sm font-medium text-[#3A4B4A]">{rating} stars</span>
                <div className="flex-1 h-2 mx-4 bg-[#F5F0E6] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#3A4B4A] to-[#4A5B5A]"
                    style={{
                      width: `${(stats.ratingDistribution[5 - rating] / stats.totalReviews) * 100}%`,
                    }}
                  />
                </div>
                <span className="w-12 text-sm text-[#4A5B5A]">{stats.ratingDistribution[5 - rating]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-6">
          {reviews.slice(0, displayedReviews).map((review) => (
            <ReviewCard
              key={review._id}
              review={review}
              onDelete={handleDeleteReview}
              onRespond={handleRespond}
            />
          ))}
        </div>

        {/* Load More Button */}
        {hasMoreReviews && (
          <div className="mt-6 text-center">
            <button
              onClick={loadMoreReviews}
              className="px-6 py-2 bg-[#3A4B4A] text-white rounded-lg hover:bg-[#4A5B5A] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#E8D8B0]"
            >
              Load More Reviews
            </button>
          </div>
        )}

        {/* Empty State */}
        {reviews.length === 0 && !loading && (
          <EmptyState />
        )}

        {/* Loading State */}
        {loading && (
          <LoadingSpinner />
        )}
      </div>
    </div>
  );
};

export default LawyerReviews;
