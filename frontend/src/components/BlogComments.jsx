import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MessageCircle, Trash2, Calendar } from "lucide-react";
import { toast } from "react-toastify";

// Comment form component
const CommentForm = ({ onSubmit, isSubmitting }) => {
  const [comment, setComment] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      onSubmit(comment);
      setComment("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 bg-[#F5F3EE] p-6 rounded-lg border border-[#DECEB0]">
      <h3 className="text-lg font-semibold mb-4 text-[#2B3B3A]">
        Write a Comment
      </h3>

      <div className="mb-4">
        <label className="block text-[#2B3B3A] text-sm font-medium mb-2">
          Your Comment
        </label>
        <textarea
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DECEB0] transition-shadow duration-200"
          rows="4"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your thoughts on this blog post..."
          required
        />
      </div>

      <button
        type="submit"
        disabled={!comment.trim() || isSubmitting}
        className={`${
          !comment.trim() || isSubmitting
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-[#2B3B3A] hover:bg-[#1a2726]"
        } text-white px-6 py-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#DECEB0]`}
      >
        {isSubmitting ? "Submitting..." : "Submit Comment"}
      </button>
    </form>
  );
};

// Comment card component
const CommentCard = ({ comment, onDelete }) => {
  const { authData } = useAuth();
  const isAuthor = authData?.userId === comment.userId._id;

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-[#E8D8B0]/20 mb-4">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <span className="text-sm text-[#4A5B5A]">
                {new Date(comment.createdAt).toLocaleDateString()}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-[#3A4B4A] mb-2">
              {comment.userId?.name || 'Anonymous'}
            </h3>
            <p className="text-[#4A5B5A]">{comment.comment}</p>
          </div>
          {isAuthor && (
            <button
              onClick={() => onDelete(comment._id)}
              className="text-[#4A5B5A] hover:text-red-500 transition-colors"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          )}
        </div>
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
    <h3 className="text-lg font-medium text-[#3A4B4A] mb-2">No Comments Yet</h3>
    <p className="text-[#4A5B5A]">Be the first to share your thoughts on this blog post.</p>
  </div>
);

// Loading spinner component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#3A4B4A] border-t-transparent"></div>
  </div>
);

// Main BlogComments component
const BlogComments = ({ blogId }) => {
  const { authData } = useAuth();
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [totalComments, setTotalComments] = useState(0);
  const [displayedComments, setDisplayedComments] = useState(5);

  useEffect(() => {
    fetchComments();
  }, [blogId]);

  const fetchComments = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `http://localhost:5000/api/blog-comments/blog/${blogId}`
      );
      setComments(response.data.comments || []);
      setTotalComments(response.data.totalComments || 0);
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast.error("Failed to fetch comments");
      setComments([]);
      setTotalComments(0);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitComment = async (comment) => {
    if (!authData?.token) {
      toast.error("Please login to submit a comment");
      navigate("/login");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/blog-comments",
        {
          blogId,
          comment,
        },
        {
          headers: {
            Authorization: `Bearer ${authData.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setComments((prevComments) => [response.data, ...prevComments]);
      setTotalComments((prev) => prev + 1);
      toast.success("Comment submitted successfully!");
    } catch (error) {
      console.error("Comment submission error:", error.response?.data || error);
      toast.error(error.response?.data?.message || "Failed to submit comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`http://localhost:5000/api/blog-comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${authData.token}`,
        },
      });

      setComments((prevComments) =>
        prevComments.filter((comment) => comment._id !== commentId)
      );
      setTotalComments((prev) => prev - 1);
      toast.success("Comment deleted successfully!");
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Failed to delete comment");
    }
  };

  const loadMoreComments = () => {
    setDisplayedComments((prev) => prev + 5);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#2B3B3A]">Comments</h2>
        <div className="flex items-center text-[#4A5B5A]">
          <MessageCircle className="h-5 w-5 mr-2" />
          <span>{totalComments} comments</span>
        </div>
      </div>

      {authData?.token && (
        <CommentForm onSubmit={handleSubmitComment} isSubmitting={isSubmitting} />
      )}

      <div className="space-y-4">
        {comments.slice(0, displayedComments).map((comment) => (
          <CommentCard
            key={comment._id}
            comment={comment}
            onDelete={handleDeleteComment}
          />
        ))}
      </div>

      {comments.length > displayedComments && (
        <div className="mt-6 text-center">
          <button
            onClick={loadMoreComments}
            className="px-6 py-2 bg-[#3A4B4A] text-white rounded-lg hover:bg-[#4A5B5A] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#E8D8B0]"
          >
            Load More Comments
          </button>
        </div>
      )}

      {comments.length === 0 && !isLoading && <EmptyState />}
    </div>
  );
};

export default BlogComments; 