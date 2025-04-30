import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import StyledCheckbox from "../components/StyledCheckbox";
import StyledButton from "../components/StyledButton";
import ReviewComponent from "../components/ReviewComponent";

// Import the LegalAidLogo component from wherever you've defined it
// Alternatively, I'll include a simplified version here:
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

const LawyerDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { lawyer } = location.state || {};
  const [selectedRate, setSelectedRate] = useState("hourly");
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

  if (!lawyer) {
    navigate("/booking");
    return null;
  }

  const handleBook = () => {
    Swal.fire({
      title: "Select Consultation Duration",
      background: "#FFFFFF",
      color: "#2B3B3A",
      iconColor: "#DECEB0",
      confirmButtonColor: "#2B3B3A",
      cancelButtonColor: "#d33",
      showClass: {
        popup: "animate__animated animate__fadeIn animate__faster",
      },
      html: `
        <div class="space-y-4">
          <div class="flex items-center space-x-4">
            <input type="radio" id="hourly" name="rate" value="hourly" checked class="w-4 h-4 text-[#2B3B3A] border-gray-300 focus:ring-[#2B3B3A]">
            <label for="hourly" class="text-lg">
              1 Hour Consultation - $${lawyer.hourlyRate}
            </label>
          </div>
          <div class="flex items-center space-x-4">
            <input type="radio" id="halfHourly" name="rate" value="halfHourly" class="w-4 h-4 text-[#2B3B3A] border-gray-300 focus:ring-[#2B3B3A]">
            <label for="halfHourly" class="text-lg">
              30 Minutes Consultation - $${lawyer.halfHourlyRate}
            </label>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Proceed to Booking",
      cancelButtonText: "Cancel",
      preConfirm: () => {
        const selected = document.querySelector(
          'input[name="rate"]:checked'
        ).value;
        setSelectedRate(selected);
        return selected;
      },
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          icon: "success",
          title: "Booking Initiated",
          text: `You have selected ${
            result.value === "hourly" ? "1 hour" : "30 minutes"
          } consultation with ${lawyer.userId.name}`,
          confirmButtonColor: "#2B3B3A",
          background: "#FFFFFF",
          iconColor: "#DECEB0",
        });
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section with Gradient Overlay */}
      <div className="relative h-72 bg-[#2B3B3A] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#2B3B3A] to-black opacity-90"></div>
        <div className="absolute inset-0 flex items-center px-8 lg:px-16">
          <div className="z-10 max-w-7xl mx-auto w-full">
            <div className="flex items-center space-x-4 mb-4">
              <LegalAidLogo size="large" />
              <span className="text-[#DECEB0] font-medium text-lg">
                LegalAid
              </span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-2">
              Meet Your <span className="text-[#DECEB0]">Attorney</span>
            </h1>
            <p className="text-gray-200 text-xl max-w-2xl">
              Professional legal expertise tailored to your specific needs
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left Side - Lawyer Information */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
              {/* Lawyer Image */}
              <div className="relative h-80 overflow-hidden border-b-4 border-[#DECEB0]">
                <img
                  src={`http://localhost:5000/uploads/${lawyer.personalPic}`}
                  alt={lawyer.userId.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://via.placeholder.com/600x800?text=Attorney+Photo";
                  }}
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#2B3B3A] to-transparent h-24"></div>
                <div className="absolute bottom-4 left-4 p-2 bg-[#DECEB0] rounded-full shadow-lg">
                  <LegalAidLogo
                    size="small"
                    color="#2B3B3A"
                    hoverColor="#000000"
                  />
                </div>
              </div>

              {/* Lawyer Name and Basic Info */}
              <div className="p-6">
                <h1 className="text-3xl font-bold text-[#2B3B3A] mb-2">
                  {lawyer.userId.name}
                </h1>
                <div className="flex items-center space-x-2 text-gray-600 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Bar Number: {lawyer.barNumber}</span>
                </div>

                <div className="border-t border-gray-200 pt-4 mt-4">
                  <h2 className="text-lg font-semibold text-[#2B3B3A] mb-3">
                    Professional Overview
                  </h2>
                  <div className="flex items-start space-x-3 mb-3">
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
                    <p className="text-gray-700">
                      <span className="font-semibold">Experience:</span>{" "}
                      {lawyer.yearsOfExperience} years
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
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
                    <p className="text-gray-700">
                      <span className="font-semibold">Specialization:</span>{" "}
                      {lawyer.specialization}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Consultation Rates Card */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
              <div className="bg-[#2B3B3A] px-6 py-4">
                <h2 className="text-xl font-bold text-[#DECEB0]">
                  Select Consultation Duration
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  <div className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-[#2B3B3A] transition-colors cursor-pointer bg-white"
                       onClick={() => setSelectedRate("hourly")}>
                    <div className="mr-4">
                      <StyledCheckbox
                        id="hourly-rate"
                        checked={selectedRate === "hourly"}
                        onChange={() => setSelectedRate("hourly")}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-[#2B3B3A]">
                        1 Hour Consultation
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Full in-depth legal consultation session
                      </p>
                    </div>
                    <div className="text-2xl font-bold text-[#2B3B3A]">
                      ${lawyer.hourlyRate}
                    </div>
                  </div>

                  <div className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-[#2B3B3A] transition-colors cursor-pointer bg-white"
                       onClick={() => setSelectedRate("halfHourly")}>
                    <div className="mr-4">
                      <StyledCheckbox
                        id="half-hourly-rate"
                        checked={selectedRate === "halfHourly"}
                        onChange={() => setSelectedRate("halfHourly")}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-[#2B3B3A]">
                        30 Minutes Consultation
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Quick legal consultation session
                      </p>
                    </div>
                    <div className="text-2xl font-bold text-[#2B3B3A]">
                      ${lawyer.halfHourlyRate}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Book Button */}
            <div className="flex justify-center mt-8">
              <StyledButton onClick={handleBook}>
                Book Consultation
              </StyledButton>
            </div>
          </div>

          {/* Right Side - About and Additional Info */}
          <div className="lg:w-2/3">
            {/* About Section */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
              <div className="bg-[#2B3B3A] px-6 py-4">
                <h2 className="text-xl font-bold text-[#DECEB0]">
                  About {lawyer.userId.name}
                </h2>
              </div>
              <div className="p-6">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap mb-6">
                  {lawyer.about ||
                    "No information available. This attorney has not provided a detailed biography yet."}
                </p>

                {/* Additional features that could be added here */}
                <div className="bg-gray-50 rounded-lg p-6 mt-6">
                  <h3 className="text-lg font-semibold text-[#2B3B3A] mb-4">
                    Why Choose Me
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
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
                      <p className="text-gray-700">
                        Personalized attention to every case
                      </p>
                    </div>
                    <div className="flex items-start space-x-3">
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
                      <p className="text-gray-700">
                        Clear communication throughout the process
                      </p>
                    </div>
                    <div className="flex items-start space-x-3">
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
                      <p className="text-gray-700">
                        Proven track record of successful cases
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Education & Credentials */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
              <div className="bg-[#2B3B3A] px-6 py-4">
                <h2 className="text-xl font-bold text-[#DECEB0]">
                  Education & Credentials
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  <div className="flex">
                    <div className="flex-shrink-0 mr-4">
                      <div className="h-12 w-12 bg-[#DECEB0] rounded-lg flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-[#2B3B3A]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M12 14l9-5-9-5-9 5 9 5z" />
                          <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
                          />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-[#2B3B3A]">
                        Bar Admission
                      </h3>
                      <p className="text-gray-600">
                        Licensed to practice law - Bar #{lawyer.barNumber}
                      </p>
                    </div>
                  </div>

                  <div className="flex">
                    <div className="flex-shrink-0 mr-4">
                      <div className="h-12 w-12 bg-[#DECEB0] rounded-lg flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-[#2B3B3A]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-[#2B3B3A]">
                        Professional Experience
                      </h3>
                      <p className="text-gray-600">
                        {lawyer.yearsOfExperience} years of specialized legal
                        practice
                      </p>
                    </div>
                  </div>

                  <div className="flex">
                    <div className="flex-shrink-0 mr-4">
                      <div className="h-12 w-12 bg-[#DECEB0] rounded-lg flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-[#2B3B3A]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                          />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-[#2B3B3A]">
                        Area of Specialization
                      </h3>
                      <p className="text-gray-600">{lawyer.specialization}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonials Section */}
            <ReviewComponent lawyerId={lawyer.userId._id} userId={user?._id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LawyerDetails;
