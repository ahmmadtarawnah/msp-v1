import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

// Reusing the LegalAidLogo component from Home page
const LegalAidLogo = ({
  size = "normal",
  color = "#DECEB0",
  hoverColor = "#ffffff",
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Size variations
  const sizeClasses = {
    small: "h-6 w-6",
    normal: "h-10 w-10",
    large: "h-12 w-12",
  };

  return (
    <div
      className={`${
        sizeClasses[size]
      } relative cursor-pointer transition-all duration-300 transform ${
        isHovered ? "scale-110" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Custom Scales of Justice Logo with Animation */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full transition-all duration-300"
      >
        {/* Top Balance Point */}
        <circle
          cx="12"
          cy="4"
          r="1.5"
          fill={isHovered ? hoverColor : color}
          className={`transition-all duration-300 ${
            isHovered ? "animate-pulse" : ""
          }`}
        />

        {/* Center Bar */}
        <rect
          x="11.5"
          y="4"
          width="1"
          height="10"
          fill={isHovered ? hoverColor : color}
          className={`transition-all duration-300 ${
            isHovered ? "animate-pulse" : ""
          }`}
        />

        {/* Base */}
        <path
          d="M8 20h8l-1-2H9l-1 2z"
          fill={isHovered ? hoverColor : color}
          className="transition-all duration-300"
        />

        {/* Base Stem */}
        <rect
          x="11.5"
          y="14"
          width="1"
          height="4"
          fill={isHovered ? hoverColor : color}
          className="transition-all duration-300"
        />

        {/* Left Scale Dish */}
        <circle
          cx="7"
          cy="10"
          r="2.5"
          fill="transparent"
          stroke={isHovered ? hoverColor : color}
          strokeWidth="1"
          className={`transition-all duration-500 ${
            isHovered ? "transform translate-y-1" : ""
          }`}
        />

        {/* Right Scale Dish */}
        <circle
          cx="17"
          cy="10"
          r="2.5"
          fill="transparent"
          stroke={isHovered ? hoverColor : color}
          strokeWidth="1"
          className={`transition-all duration-500 ${
            isHovered ? "transform -translate-y-1" : ""
          }`}
        />

        {/* Left Arm */}
        <line
          x1="12"
          y1="4"
          x2="7"
          y2="10"
          stroke={isHovered ? hoverColor : color}
          strokeWidth="1"
          className={`transition-all duration-300 ${
            isHovered ? "transform rotate-3" : ""
          }`}
        />

        {/* Right Arm */}
        <line
          x1="12"
          y1="4"
          x2="17"
          y2="10"
          stroke={isHovered ? hoverColor : color}
          strokeWidth="1"
          className={`transition-all duration-300 ${
            isHovered ? "transform -rotate-3" : ""
          }`}
        />

        {/* Small decorative elements */}
        <circle
          cx="7"
          cy="10"
          r="0.5"
          fill={isHovered ? hoverColor : color}
          className={`transition-all duration-300 ${
            isHovered ? "opacity-100" : "opacity-70"
          }`}
        />
        <circle
          cx="17"
          cy="10"
          r="0.5"
          fill={isHovered ? hoverColor : color}
          className={`transition-all duration-300 ${
            isHovered ? "opacity-100" : "opacity-70"
          }`}
        />
      </svg>

      {/* Glow effect on hover */}
      {isHovered && (
        <div className="absolute inset-0 rounded-full bg-[#DECEB0] opacity-20 blur-md -z-10"></div>
      )}
    </div>
  );
};

const Profile = () => {
  const { authData } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!authData?.token) {
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get("http://localhost:5000/api/profile", {
          headers: { Authorization: `Bearer ${authData.token}` },
        });
        setUserData(response.data);
        setFormData({
          name: response.data.name,
          username: response.data.username,
          password: "",
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [authData, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
    // Reset form errors when toggling edit mode
    setFormErrors({});
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }

    if (!formData.username.trim()) {
      errors.username = "Username is required";
    }

    // Only validate password if user is trying to change it
    if (formData.password && formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await axios.put(
        "http://localhost:5000/api/profile",
        formData,
        {
          headers: { Authorization: `Bearer ${authData.token}` },
        }
      );
      setUserData(response.data.user);
      setIsEditing(false);

      // Show success notification
      const notification = document.getElementById("notification");
      if (notification) {
        notification.classList.remove("hidden");
        notification.classList.add("flex");
        setTimeout(() => {
          notification.classList.add("hidden");
          notification.classList.remove("flex");
        }, 3000);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setFormErrors({ submit: "Error updating profile. Please try again." });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-b from-[#2B3B3A] to-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#DECEB0]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#2B3B3A]/95 via-gray-100 to-gray-100 relative overflow-hidden">
      {/* Background design elements */}
      <div className="absolute top-0 left-0 w-full h-64 bg-[#2B3B3A] transform -skew-y-2 origin-top-left z-0"></div>
      <div className="absolute top-0 right-0 w-1/3 h-screen bg-[#DECEB0]/10 z-0"></div>
      <div className="absolute bottom-0 left-0 w-1/4 h-64 bg-[#DECEB0]/10 rounded-tr-full z-0"></div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10 z-0"></div>

      {/* Success Notification - Moved outside the content container and increased z-index */}
      <div
        id="notification"
        className="hidden fixed top-6 right-6 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-md items-center z-[9999] transform transition-all duration-500 ease-in-out"
      >
        <svg
          className="h-6 w-6 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
        <span>Profile updated successfully!</span>
      </div>

      {/* Content container */}
      <div className="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Header Section */}
          <div className="mb-10 text-center">
            <div className="inline-block mb-3">
              <div className="p-4 bg-[#2B3B3A]/30 backdrop-blur-sm rounded-full">
                <LegalAidLogo
                  size="large"
                  color="#DECEB0"
                  hoverColor="#ffffff"
                />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white">Your Profile</h1>
            <div className="w-24 h-1 bg-[#DECEB0] mx-auto mt-4"></div>
          </div>

          {/* Main Content */}
          <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-2xl overflow-hidden border border-[#DECEB0]/30">
            {/* Profile Header */}
            <div className="bg-[#2B3B3A] py-6 px-8 flex justify-between items-center">
              <div className="flex items-center">
                <div className="h-16 w-16 rounded-full bg-[#DECEB0] flex items-center justify-center text-[#2B3B3A] text-2xl font-bold mr-4">
                  {userData?.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-white text-xl font-bold">
                    {userData?.name}
                  </h2>
                  <p className="text-[#DECEB0]">{userData?.username}</p>
                </div>
              </div>
              <button
                onClick={toggleEditMode}
                className={`${
                  isEditing
                    ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                    : "bg-[#DECEB0] hover:bg-white text-[#2B3B3A]"
                } font-bold py-2 px-6 rounded-md transition-all duration-300 transform hover:scale-105 shadow-lg inline-flex items-center justify-center`}
              >
                {isEditing ? "Cancel" : "Edit Profile"}
              </button>
            </div>

            {/* Profile Content */}
            <div className="p-8">
              {isEditing ? (
                // Edit Form
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-[#2B3B3A] font-medium mb-2"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-md border ${
                        formErrors.name ? "border-red-500" : "border-gray-300"
                      } focus:outline-none focus:ring-2 focus:ring-[#DECEB0]`}
                    />
                    {formErrors.name && (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="username"
                      className="block text-[#2B3B3A] font-medium mb-2"
                    >
                      Username
                    </label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-md border ${
                        formErrors.username
                          ? "border-red-500"
                          : "border-gray-300"
                      } focus:outline-none focus:ring-2 focus:ring-[#DECEB0]`}
                    />
                    {formErrors.username && (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors.username}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="block text-[#2B3B3A] font-medium mb-2"
                    >
                      Password{" "}
                      <span className="text-gray-500 text-sm">
                        (Leave empty to keep current password)
                      </span>
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className={`w-full px-4 py-3 rounded-md border ${
                        formErrors.password
                          ? "border-red-500"
                          : "border-gray-300"
                      } focus:outline-none focus:ring-2 focus:ring-[#DECEB0]`}
                    />
                    {formErrors.password && (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors.password}
                      </p>
                    )}
                  </div>

                  {formErrors.submit && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
                      {formErrors.submit}
                    </div>
                  )}

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="bg-[#2B3B3A] text-[#DECEB0] px-8 py-3 rounded-md font-medium hover:bg-[#1a2a29] transition-colors duration-300"
                    >
                      Update Profile
                    </button>
                  </div>
                </form>
              ) : (
                // Profile Info
                <div className="space-y-8">
                  <div className="border-b border-gray-200 pb-6">
                    <h3 className="text-xl font-bold text-[#2B3B3A] mb-4 flex items-center">
                      <div className="w-8 h-8 bg-[#2B3B3A] rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <LegalAidLogo size="small" />
                      </div>
                      Personal Information
                    </h3>

                    <div className="grid md:grid-cols-2 gap-6 pl-11">
                      <div>
                        <h4 className="text-gray-500 text-sm mb-1">
                          Full Name
                        </h4>
                        <p className="text-gray-800 font-medium text-lg">
                          {userData?.name}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-gray-500 text-sm mb-1">Username</h4>
                        <p className="text-gray-800 font-medium text-lg">
                          {userData?.username}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-[#2B3B3A] mb-4 flex items-center">
                      <div className="w-8 h-8 bg-[#2B3B3A] rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <span className="text-[#DECEB0] font-medium">i</span>
                      </div>
                      Account Security
                    </h3>

                    <div className="pl-11">
                      <div className="flex items-start mb-4">
                        <div className="h-6 w-6 rounded-full bg-[#2B3B3A] flex items-center justify-center flex-shrink-0 mt-1">
                          <svg
                            viewBox="0 0 24 24"
                            width="14"
                            height="14"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M5 12l5 5L20 7"
                              stroke="#DECEB0"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                        <p className="ml-3 text-gray-700">
                          Your password is set and secure
                        </p>
                      </div>

                      <p className="text-gray-600">
                        To change your password, click the Edit Profile button
                        and enter a new password in the form.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Footer */}
          <div className="mt-8 text-center">
            <button
              onClick={() => navigate("/")}
              className="inline-block bg-transparent hover:bg-[#2B3B3A] text-white hover:text-[#DECEB0] font-semibold py-2 px-6 rounded-md border-2 border-white hover:border-[#2B3B3A] transition-all duration-300 backdrop-blur-sm"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>

      {/* Add styles to head for grid pattern */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          .bg-grid-pattern {
            background-image: 
              linear-gradient(to right, rgba(222, 206, 176, 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(222, 206, 176, 0.1) 1px, transparent 1px);
            background-size: 40px 40px;
          }
        `,
        }}
      />
    </div>
  );
};

export default Profile;
