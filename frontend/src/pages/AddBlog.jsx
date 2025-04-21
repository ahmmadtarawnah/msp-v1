import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const AddBlog = () => {
  const { authData } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    details: "",
  });
  const [blogPic, setBlogPic] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBlogPic(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("details", formData.details);
      if (blogPic) {
        formDataToSend.append("blogPic", blogPic);
      }

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

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Blog added successfully!",
        confirmButtonColor: "#2B3B3A",
      }).then(() => {
        navigate("/admin-dashboard");
      });
    } catch (error) {
      console.error("Error adding blog:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to add blog. Please try again.",
        confirmButtonColor: "#2B3B3A",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2B3B3A] to-[#1A2A29]">
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-[#2B3B3A] mb-6">Add New Blog</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Blog Picture */}
            <div>
              <label className="block text-sm font-medium text-[#2B3B3A] mb-2">
                Blog Picture
              </label>
              <div className="flex items-center space-x-4">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Blog preview"
                    className="h-32 w-32 object-cover rounded-lg"
                  />
                ) : (
                  <div className="h-32 w-32 bg-gray-100 rounded-lg flex items-center justify-center">
                    <svg
                      className="h-12 w-12 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                )}
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="blog-pic"
                  />
                  <label
                    htmlFor="blog-pic"
                    className="cursor-pointer bg-[#2B3B3A] text-[#DECEB0] px-4 py-2 rounded-lg hover:bg-[#3a4b4a] transition-colors"
                  >
                    Choose Image
                  </label>
                </div>
              </div>
            </div>

            {/* Blog Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-[#2B3B3A] mb-2">
                Blog Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2B3B3A] focus:border-transparent"
                placeholder="Enter blog title"
              />
            </div>

            {/* Blog Details */}
            <div>
              <label htmlFor="details" className="block text-sm font-medium text-[#2B3B3A] mb-2">
                Blog Details
              </label>
              <textarea
                id="details"
                name="details"
                value={formData.details}
                onChange={handleChange}
                required
                rows={10}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2B3B3A] focus:border-transparent"
                placeholder="Enter blog details"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="bg-[#2B3B3A] text-[#DECEB0] px-6 py-2 rounded-lg hover:bg-[#3a4b4a] transition-colors disabled:opacity-50"
              >
                {loading ? "Adding..." : "Add Blog"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddBlog; 