import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/blogs");
        setBlogs(res.data);
      } catch (err) {
        setError("Failed to load blogs.");
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <div className="relative h-72 bg-[#2B3B3A] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#2B3B3A] to-black opacity-90"></div>
        <div className="absolute inset-0 flex items-center px-8 lg:px-16">
          <div className="z-10 max-w-7xl mx-auto w-full">
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Our <span className="text-[#DECEB0]">Blog</span>
            </h1>
            <p className="text-gray-200 text-xl max-w-2xl">
              Discover insights, stories, and updates from our team
            </p>
          </div>
        </div>
      </div>

      {/* Blog Grid */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex flex-wrap justify-center gap-8">
          {blogs.length === 0 && <div>No blogs found.</div>}
          {blogs.map((blog) => (
            <StyledWrapper key={blog._id}>
              <div className="card">
                <div className="card2">
                  {blog.featuredImages && blog.featuredImages[0] && (
                    <img
                      src={`http://localhost:5000${blog.featuredImages[0]}`}
                      alt={blog.title}
                      className="w-full h-40 object-cover rounded-t-lg"
                    />
                  )}
                  <div className="p-4">
                    <h2 className="text-lg font-bold text-white mb-2">{blog.title}</h2>
                    <p className="text-gray-300 text-sm">
                      {new Date(blog.datePublished).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </StyledWrapper>
          ))}
        </div>
      </div>
    </div>
  );
};

const StyledWrapper = styled.div`
  .card {
    width: 280px;
    height: 320px;
    background-image: linear-gradient(163deg, #00ff75 0%, #3700ff 100%);
    border-radius: 20px;
    transition: all .3s;
    cursor: pointer;
  }

  .card2 {
    width: 280px;
    height: 320px;
    background-color: #1a1a1a;
    border-radius: 10px;
    transition: all .2s;
    cursor: pointer;
  }

  .card2:hover {
    transform: scale(0.98);
    border-radius: 20px;
  }

  .card:hover {
    box-shadow: 0px 0px 30px 1px rgba(0, 255, 117, 0.30);
  }
`;

export default Blogs; 