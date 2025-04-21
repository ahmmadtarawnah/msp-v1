import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

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

const Booking = () => {
  const { authData } = useAuth();
  const navigate = useNavigate();
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSpecialization, setSelectedSpecialization] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("experience_high_to_low");

  useEffect(() => {
    fetchLawyers();
  }, []);

  const fetchLawyers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/lawyer-applications/approved"
      );
      console.log("API Response:", response.data); // Debug log
      if (response.data && Array.isArray(response.data)) {
        setLawyers(response.data);
        console.log("First lawyer data:", response.data[0]); // Debug log
      } else {
        setLawyers([]);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching lawyers:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch lawyers. Please try again later.",
      });
      setLoading(false);
    }
  };

  const specializations = [
    "all",
    "Corporate Law",
    "Criminal Law",
    "Family Law",
    "Intellectual Property",
    "Real Estate",
    "Tax Law",
    "Immigration Law",
    "Personal Injury",
    "Employment Law",
  ];

  const filteredLawyers = lawyers
    .filter((lawyer) => {
      const matchesSpecialization =
        selectedSpecialization === "all" ||
        lawyer.specialization === selectedSpecialization;
      const matchesSearch =
        lawyer.userId?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lawyer.specialization?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSpecialization && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "hourly_rate_low_to_high":
          return a.hourlyRate - b.hourlyRate;
        case "hourly_rate_high_to_low":
          return b.hourlyRate - a.hourlyRate;
        case "half_hourly_rate_low_to_high":
          return a.halfHourlyRate - b.halfHourlyRate;
        case "half_hourly_rate_high_to_low":
          return b.halfHourlyRate - a.halfHourlyRate;
        case "experience_low_to_high":
          return a.yearsOfExperience - b.yearsOfExperience;
        case "experience_high_to_low":
          return b.yearsOfExperience - a.yearsOfExperience;
        default:
          return 0;
      }
    });

  const handleLawyerClick = (lawyer) => {
    console.log("Selected lawyer:", lawyer); // Debug log
    navigate("/lawyer-details", { state: { lawyer } });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2B3B3A]"></div>
            </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-[#2B3B3A] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">Find Your Legal Expert</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Connect with experienced lawyers who specialize in your area of need
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
        <div className="bg-white rounded-lg shadow-xl p-6 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Lawyers
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name or specialization..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#2B3B3A] focus:border-[#2B3B3A]"
                />
                <svg
                  className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Practice Area
              </label>
              <select
                value={selectedSpecialization}
                onChange={(e) => setSelectedSpecialization(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#2B3B3A] focus:border-[#2B3B3A]"
              >
                {specializations.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec === "all" ? "All Practice Areas" : spec}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#2B3B3A] focus:border-[#2B3B3A]"
              >
                <optgroup label="Experience">
                  <option value="experience_high_to_low">Experience (High to Low)</option>
                  <option value="experience_low_to_high">Experience (Low to High)</option>
                </optgroup>
                <optgroup label="Hourly Rate">
                  <option value="hourly_rate_low_to_high">Hourly Rate (Low to High)</option>
                  <option value="hourly_rate_high_to_low">Hourly Rate (High to Low)</option>
                </optgroup>
                <optgroup label="Half-Hour Rate">
                  <option value="half_hourly_rate_low_to_high">Half-Hour Rate (Low to High)</option>
                  <option value="half_hourly_rate_high_to_low">Half-Hour Rate (High to Low)</option>
                </optgroup>
              </select>
            </div>
          </div>
        </div>

        {/* Lawyer Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredLawyers.map((lawyer) => (
            <div
              key={lawyer._id}
              className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300 cursor-pointer"
              onClick={() => handleLawyerClick(lawyer)}
            >
              {/* Lawyer Image */}
              <div className="relative h-64">
                <img
                  src={`http://localhost:5000/uploads/${lawyer.personalPic}`}
                  alt={lawyer.userId?.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/300x200";
                  }}
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                  <h3 className="text-2xl font-bold text-white">
                    {lawyer.userId?.name}
                  </h3>
                  <p className="text-[#DECEB0]">{lawyer.specialization}</p>
                </div>
              </div>

              {/* Lawyer Info */}
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-gray-500">Experience</span>
                  <span className="text-lg font-semibold text-[#2B3B3A]">
                    {lawyer.yearsOfExperience} years
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Rate</span>
                  <span className="text-lg font-semibold text-[#2B3B3A]">
                    ${lawyer.hourlyRate}/hr
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredLawyers.length === 0 && (
          <div className="text-center py-12">
                <svg
              className="w-16 h-16 text-gray-400 mx-auto mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No lawyers found
            </h3>
              <p className="text-gray-600">
              Try adjusting your search criteria or filters
              </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Booking;
