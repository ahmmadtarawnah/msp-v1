import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Navbar from "../shared/Navbar";
import Footer from "../shared/Footer";

const LegalAidLogo = ({ size = "normal", color = "#DECEB0", hoverColor = "#ffffff" }) => {
  const [isHovered, setIsHovered] = useState(false);

  const sizeClasses = {
    small: "h-6 w-6",
    normal: "h-10 w-10",
    large: "h-12 w-12",
  };

  return (
    <div
      className={`${sizeClasses[size]} relative cursor-pointer transition-all duration-300 transform ${
        isHovered ? "scale-110" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full transition-all duration-300"
      >
        <circle
          cx="12"
          cy="4"
          r="1.5"
          fill={isHovered ? hoverColor : color}
          className={`transition-all duration-300 ${isHovered ? "animate-pulse" : ""}`}
        />
        <rect
          x="11.5"
          y="4"
          width="1"
          height="10"
          fill={isHovered ? hoverColor : color}
          className={`transition-all duration-300 ${isHovered ? "animate-pulse" : ""}`}
        />
        <path
          d="M8 20h8l-1-2H9l-1 2z"
          fill={isHovered ? hoverColor : color}
          className="transition-all duration-300"
        />
        <rect
          x="11.5"
          y="14"
          width="1"
          height="4"
          fill={isHovered ? hoverColor : color}
          className="transition-all duration-300"
        />
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
      {isHovered && (
        <div className="absolute inset-0 rounded-full bg-[#DECEB0] opacity-20 blur-md -z-10"></div>
      )}
    </div>
  );
};

const BecomeAlawyer = () => {
  const { authData, isLoading } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    barNumber: "",
    yearsOfExperience: "",
    specialization: "",
    about: "",
    hourlyRate: "",
    halfHourlyRate: ""
  });
  const [certificationPic, setCertificationPic] = useState(null);
  const [personalPic, setPersonalPic] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLoading && !authData) {
      Swal.fire({
        title: "Authentication Required",
        text: "Please log in to submit a lawyer application",
        icon: "warning",
        confirmButtonColor: "#2B3B3A"
      }).then(() => {
        navigate("/Login");
      });
    }
  }, [authData, isLoading, navigate]);

  const specializations = [
    "Corporate Law",
    "Criminal Law",
    "Family Law",
    "Intellectual Property",
    "Real Estate",
    "Tax Law",
    "Immigration Law",
    "Personal Injury",
    "Employment Law"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (type === "certification") {
        setCertificationPic(file);
      } else {
        setPersonalPic(file);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!authData?.userId) {
        throw new Error("User not authenticated");
      }

      const formDataToSend = new FormData();
      formDataToSend.append("userId", authData.userId);
      formDataToSend.append("barNumber", formData.barNumber);
      formDataToSend.append("yearsOfExperience", formData.yearsOfExperience);
      formDataToSend.append("specialization", formData.specialization);
      formDataToSend.append("about", formData.about);
      formDataToSend.append("hourlyRate", formData.hourlyRate);
      formDataToSend.append("halfHourlyRate", formData.halfHourlyRate);
      
      if (certificationPic) {
        formDataToSend.append("certificationPic", certificationPic);
      }
      
      if (personalPic) {
        formDataToSend.append("personalPic", personalPic);
      }

      const response = await axios.post(
        "http://localhost:5000/api/lawyer-applications/submit",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${authData.token}`
          }
        }
      );

      Swal.fire({
        title: "Success!",
        text: "Your application has been submitted successfully. The admin will review it soon.",
        icon: "success",
        confirmButtonColor: "#2B3B3A"
      }).then(() => {
        if (authData.role === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/");
        }
      });
    } catch (error) {
      console.error("Error submitting application:", error);
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.message || error.message || "Failed to submit application. Please try again.",
        icon: "error",
        confirmButtonColor: "#2B3B3A"
      });
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#2B3B3A] to-[#1A2A29]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#DECEB0]"></div>
      </div>
    );
  }

  if (!authData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2B3B3A] to-[#1A2A29]">
      <Navbar />
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <LegalAidLogo size="large" />
            </div>
            <h2 className="text-4xl font-bold text-[#DECEB0] mb-4">
              Become a Lawyer
            </h2>
            <p className="text-[#DECEB0]/80 text-lg">
              Join our network of legal professionals and make a difference
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-6 py-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Bar Number */}
                <div>
                  <label htmlFor="barNumber" className="block text-sm font-medium text-[#DECEB0] mb-2">
                    Bar Number
                  </label>
                  <input
                    type="text"
                    id="barNumber"
                    name="barNumber"
                    value={formData.barNumber}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-[#DECEB0]/30 text-[#DECEB0] placeholder-[#DECEB0]/50 focus:outline-none focus:ring-2 focus:ring-[#DECEB0] focus:border-transparent transition-all duration-300"
                    placeholder="Enter your bar number"
                  />
                </div>

                {/* Years of Experience */}
                <div>
                  <label htmlFor="yearsOfExperience" className="block text-sm font-medium text-[#DECEB0] mb-2">
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    id="yearsOfExperience"
                    name="yearsOfExperience"
                    value={formData.yearsOfExperience}
                    onChange={handleChange}
                    required
                    min="0"
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-[#DECEB0]/30 text-[#DECEB0] placeholder-[#DECEB0]/50 focus:outline-none focus:ring-2 focus:ring-[#DECEB0] focus:border-transparent transition-all duration-300"
                    placeholder="Enter years of experience"
                  />
                </div>

                {/* Specialization */}
                <div>
                  <label htmlFor="specialization" className="block text-sm font-medium text-[#DECEB0] mb-2">
                    Specialization
                  </label>
                  <select
                    id="specialization"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-[#DECEB0]/30 text-[#DECEB0] placeholder-[#DECEB0]/50 focus:outline-none focus:ring-2 focus:ring-[#DECEB0] focus:border-transparent transition-all duration-300"
                  >
                    <option value="" className="bg-[#2B3B3A]">Select a specialization</option>
                    {specializations.map((spec) => (
                      <option key={spec} value={spec} className="bg-[#2B3B3A]">
                        {spec}
                      </option>
                    ))}
                  </select>
                </div>

                {/* About Section */}
                <div>
                  <label htmlFor="about" className="block text-sm font-medium text-[#DECEB0] mb-2">
                    About Yourself
                  </label>
                  <textarea
                    id="about"
                    name="about"
                    value={formData.about}
                    onChange={handleChange}
                    required
                    minLength={150}
                    maxLength={2000}
                    rows="6"
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-[#DECEB0]/30 text-[#DECEB0] placeholder-[#DECEB0]/50 focus:outline-none focus:ring-2 focus:ring-[#DECEB0] focus:border-transparent transition-all duration-300"
                    placeholder="Tell us about yourself, your experience, and your approach to legal practice (minimum 150 characters)..."
                  />
                  <div className="flex justify-between mt-1">
                    <p className="text-sm text-[#DECEB0]/70">
                      Characters: {formData.about.length}/2000
                    </p>
                    {formData.about.length > 0 && formData.about.length < 150 && (
                      <p className="text-sm text-red-400">
                        Minimum 150 characters required (currently {formData.about.length})
                      </p>
                    )}
                  </div>
                </div>

                {/* Hourly Rates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="hourlyRate" className="block text-sm font-medium text-[#DECEB0] mb-2">
                      Hourly Rate (USD)
                    </label>
                    <input
                      type="number"
                      id="hourlyRate"
                      name="hourlyRate"
                      value={formData.hourlyRate}
                      onChange={handleChange}
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-[#DECEB0]/30 text-[#DECEB0] placeholder-[#DECEB0]/50 focus:outline-none focus:ring-2 focus:ring-[#DECEB0] focus:border-transparent transition-all duration-300"
                      placeholder="Enter your hourly rate"
                    />
                  </div>
                  <div>
                    <label htmlFor="halfHourlyRate" className="block text-sm font-medium text-[#DECEB0] mb-2">
                      Half-Hour Rate (USD)
                    </label>
                    <input
                      type="number"
                      id="halfHourlyRate"
                      name="halfHourlyRate"
                      value={formData.halfHourlyRate}
                      onChange={handleChange}
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-[#DECEB0]/30 text-[#DECEB0] placeholder-[#DECEB0]/50 focus:outline-none focus:ring-2 focus:ring-[#DECEB0] focus:border-transparent transition-all duration-300"
                      placeholder="Enter your half-hour rate"
                    />
                  </div>
                </div>

                {/* Certification Picture */}
                <div>
                  <label htmlFor="certificationPic" className="block text-sm font-medium text-[#DECEB0] mb-2">
                    Certification Picture
                  </label>
                  <input
                    type="file"
                    id="certificationPic"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "certification")}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-[#DECEB0]/30 text-[#DECEB0] placeholder-[#DECEB0]/50 focus:outline-none focus:ring-2 focus:ring-[#DECEB0] focus:border-transparent transition-all duration-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#DECEB0] file:text-[#2B3B3A] hover:file:bg-[#d0c09f]"
                  />
                </div>

                {/* Personal Picture */}
                <div>
                  <label htmlFor="personalPic" className="block text-sm font-medium text-[#DECEB0] mb-2">
                    Personal Picture
                  </label>
                  <input
                    type="file"
                    id="personalPic"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "personal")}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-[#DECEB0]/30 text-[#DECEB0] placeholder-[#DECEB0]/50 focus:outline-none focus:ring-2 focus:ring-[#DECEB0] focus:border-transparent transition-all duration-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#DECEB0] file:text-[#2B3B3A] hover:file:bg-[#d0c09f]"
                  />
                </div>

                {/* Submit Button */}
                <div className="flex justify-center">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto px-8 py-4 border border-transparent rounded-lg text-lg font-bold text-[#2B3B3A] bg-[#DECEB0] hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#DECEB0] disabled:opacity-50 transition-all duration-300 transform hover:scale-105"
                  >
                    {loading ? "Submitting..." : "Submit Application"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BecomeAlawyer; 