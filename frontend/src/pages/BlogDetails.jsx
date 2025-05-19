import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import BlogComments from "../components/BlogComments";

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBlogDetails = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/blogs/${id}`);
        setBlog(res.data);
      } catch (err) {
        setError("Failed to load blog details.");
      } finally {
        setLoading(false);
      }
    };
    fetchBlogDetails();
  }, [id]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!blog) return <div className="p-8 text-center">Blog not found</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <div className="relative h-72 bg-[#2B3B3A] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#2B3B3A] to-black opacity-90"></div>
        <div className="absolute inset-0 flex items-center px-8 lg:px-16">
          <div className="z-10 max-w-7xl mx-auto w-full">
            <button
              onClick={() => navigate(-1)}
              className="text-white mb-4 hover:text-[#DECEB0] transition-colors"
            >
              ← Back to Blogs
            </button>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              {blog.title}
            </h1>
            <p className="text-gray-200 text-xl">
              {new Date(blog.datePublished).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Blog Content */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          {/* Featured Images Gallery */}
          {blog.featuredImages && blog.featuredImages.length > 0 && (
            <div className="mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {blog.featuredImages.map((image, index) => (
                  <img
                    key={index}
                    src={`http://localhost:5000${image}`}
                    alt={`Blog image ${index + 1}`}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Blog Content */}
          <div className="prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: blog.content }} />
          </div>
        </div>

        {/* Comments Section */}
        <BlogComments blogId={blog._id} />
      </div>
    </div>
  );
};

export default BlogDetails; 