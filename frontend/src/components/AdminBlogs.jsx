import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Trash2, MessageCircle } from "lucide-react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const AdminBlogs = () => {
  const { authData } = useAuth();
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/blogs", {
        headers: { Authorization: `Bearer ${authData.token}` },
      });
      setBlogs(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      toast.error("Failed to fetch blogs");
      setLoading(false);
    }
  };

  const handleDeleteBlog = async (blogId) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "This blog and all its comments will be permanently deleted!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#2B3B3A",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
      });

      if (result.isConfirmed) {
        await axios.delete(`http://localhost:5000/api/blogs/${blogId}`, {
          headers: { Authorization: `Bearer ${authData.token}` },
        });
        setBlogs(blogs.filter((blog) => blog._id !== blogId));
        Swal.fire({
          title: "Deleted!",
          text: "The blog has been deleted successfully.",
          icon: "success",
          confirmButtonColor: "#2B3B3A",
        });
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to delete the blog. Please try again.",
        icon: "error",
        confirmButtonColor: "#2B3B3A",
      });
    }
  };

  const handleViewComments = async (blogId) => {
    setSelectedBlog(blogId);
    setShowComments(true);
    setLoadingComments(true);
    try {
      const response = await axios.get(
        `http://localhost:5000/api/blog-comments/blog/${blogId}`
      );
      setComments(response.data.comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast.error("Failed to fetch comments");
    } finally {
      setLoadingComments(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const result = await Swal.fire({
        title: "Delete Comment?",
        text: "This comment will be permanently deleted!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#2B3B3A",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
      });

      if (result.isConfirmed) {
        await axios.delete(`http://localhost:5000/api/blog-comments/${commentId}`, {
          headers: { Authorization: `Bearer ${authData.token}` },
        });
        setComments(comments.filter((comment) => comment._id !== commentId));
        Swal.fire({
          title: "Deleted!",
          text: "The comment has been deleted successfully.",
          icon: "success",
          confirmButtonColor: "#2B3B3A",
        });
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to delete the comment. Please try again.",
        icon: "error",
        confirmButtonColor: "#2B3B3A",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#2B3B3A] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#2B3B3A]">Manage Blogs</h2>
        <button
          onClick={() => navigate("/admin-dashboard/add-blog")}
          className="bg-[#2B3B3A] text-white px-4 py-2 rounded-lg hover:bg-[#1a2726] transition-colors"
        >
          Add New Blog
        </button>
      </div>

      {/* Blog List */}
      <div className="grid gap-6">
        {blogs.map((blog) => (
          <div
            key={blog._id}
            className="bg-white rounded-lg shadow-md p-6 border border-gray-100"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-[#2B3B3A] mb-2">
                  {blog.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {new Date(blog.datePublished).toLocaleDateString()}
                </p>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleViewComments(blog._id)}
                    className="text-[#2B3B3A] hover:text-[#1a2726] transition-colors"
                    title="View Comments"
                  >
                    <MessageCircle className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteBlog(blog._id)}
                    className="text-red-500 hover:text-red-600 transition-colors"
                    title="Delete Blog"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
              {blog.featuredImages && blog.featuredImages.length > 0 && (
                <img
                  src={`http://localhost:5000${blog.featuredImages[0]}`}
                  alt={blog.title}
                  className="w-24 h-24 object-cover rounded-lg"
                />
              )}
            </div>

            {/* Comments Section */}
            {showComments && selectedBlog === blog._id && (
              <div className="mt-6 border-t pt-6">
                <h4 className="text-lg font-semibold text-[#2B3B3A] mb-4">
                  Comments
                </h4>
                {loadingComments ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-4 border-[#2B3B3A] border-t-transparent"></div>
                  </div>
                ) : comments.length > 0 ? (
                  <div className="space-y-4">
                    {comments.map((comment) => (
                      <div
                        key={comment._id}
                        className="bg-gray-50 rounded-lg p-4 flex justify-between items-start"
                      >
                        <div>
                          <p className="font-medium text-[#2B3B3A]">
                            {comment.userId?.name || "Anonymous"}
                          </p>
                          <p className="text-gray-600 mt-1">{comment.comment}</p>
                          <p className="text-sm text-gray-500 mt-2">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDeleteComment(comment._id)}
                          className="text-red-500 hover:text-red-600 transition-colors"
                          title="Delete Comment"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    No comments yet
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminBlogs; 