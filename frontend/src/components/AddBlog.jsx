import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Loader2 } from "lucide-react";

const AddBlog = () => {
  const { authData } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });
  const [featuredImages, setFeaturedImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 3);
    setFeaturedImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!authData?.token) {
      setError("You must be logged in to create a blog post");
      setLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("content", formData.content);
      featuredImages.forEach((image) => {
        formDataToSend.append("featuredImages", image);
      });

      console.log("Sending request with token:", authData.token);
      const response = await axios.post(
        "http://localhost:5000/api/blogs",
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${authData.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Response:", response.data);
      setSuccess("Blog post published successfully!");
      setFormData({ title: "", content: "" });
      setFeaturedImages([]);
    } catch (error) {
      console.error("Error details:", error.response?.data || error.message);
      setError(error.response?.data?.message || "Error publishing blog post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Add New Blog Post</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            Content
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            required
            rows="10"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="featuredImages" className="block text-sm font-medium text-gray-700">
            Featured Images (up to 3)
          </label>
          <input
            type="file"
            id="featuredImages"
            name="featuredImages"
            onChange={handleImageChange}
            accept="image/*"
            multiple
            required
            className="mt-1 block w-full"
          />
          <p className="mt-1 text-sm text-gray-500">
            You can select up to 3 images. Each image should be less than 5MB.
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
              Publishing...
            </>
          ) : (
            "Publish Blog Post"
          )}
        </button>
      </form>
    </div>
  );
};

export default AddBlog; 