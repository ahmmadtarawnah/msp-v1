import React, { useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";

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

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setBlogPic(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxFiles: 1,
    maxSize: 5242880 // 5MB
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
      {/* Hero Section */}
      <div className="relative h-48 bg-[#2B3B3A] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#2B3B3A] to-black opacity-90"></div>
        <div className="absolute inset-0 flex items-center px-8">
          <div className="max-w-7xl mx-auto w-full">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-bold text-white mb-2"
            >
              Create New Blog Post
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-gray-300"
            >
              Share your thoughts and ideas with the world
            </motion.p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 -mt-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Blog Picture Dropzone */}
            <div className="bg-gray-50 rounded-xl p-6">
              <label className="block text-lg font-semibold text-[#2B3B3A] mb-4">
                Blog Cover Image
              </label>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
                  isDragActive
                    ? "border-[#DECEB0] bg-[#DECEB0]/10"
                    : "border-gray-300 hover:border-[#2B3B3A]"
                }`}
              >
                <input {...getInputProps()} />
                {previewUrl ? (
                  <div className="relative group">
                    <img
                      src={previewUrl}
                      alt="Blog preview"
                      className="max-h-80 mx-auto rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewUrl("");
                        setBlogPic(null);
                      }}
                      className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <svg
                      className="mx-auto h-16 w-16 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <div className="text-gray-600 text-lg">
                      {isDragActive ? (
                        <p>Drop the image here ...</p>
                      ) : (
                        <p>
                          Drag and drop an image here, or{" "}
                          <span className="text-[#2B3B3A] font-medium">click to select</span>
                        </p>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">PNG, JPG, GIF up to 5MB</p>
                  </div>
                )}
              </div>
            </div>

            {/* Blog Title */}
            <div className="bg-gray-50 rounded-xl p-6">
              <label htmlFor="title" className="block text-lg font-semibold text-[#2B3B3A] mb-4">
                Blog Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2B3B3A] focus:border-transparent transition-all duration-200 text-lg"
                placeholder="Enter a compelling title for your blog post"
              />
            </div>

            {/* Blog Content */}
            <div className="bg-gray-50 rounded-xl p-6">
              <label htmlFor="details" className="block text-lg font-semibold text-[#2B3B3A] mb-4">
                Blog Content
              </label>
              <textarea
                id="details"
                name="details"
                value={formData.details}
                onChange={handleChange}
                required
                rows={12}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2B3B3A] focus:border-transparent transition-all duration-200 text-lg"
                placeholder="Write your blog content here..."
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => navigate("/admin-dashboard")}
                className="px-6 py-3 rounded-lg border-2 border-[#2B3B3A] text-[#2B3B3A] hover:bg-[#2B3B3A] hover:text-white transition-colors font-medium text-lg"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="bg-[#2B3B3A] text-[#DECEB0] px-8 py-3 rounded-lg hover:bg-[#3a4b4a] transition-colors disabled:opacity-50 font-medium text-lg flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Publishing...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Publish Blog Post</span>
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AddBlog; 