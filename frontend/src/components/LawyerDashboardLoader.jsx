import React from "react";

const LawyerDashboardLoader = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2B3B3A] to-[#1A2A29] flex items-center justify-center">
      <div className="text-center">
        {/* Animated Scales of Justice */}
        <div className="relative h-32 w-32 mx-auto mb-8">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            {/* Top Balance Point */}
            <circle
              cx="12"
              cy="4"
              r="1.5"
              fill="#DECEB0"
              className="animate-pulse"
            />

            {/* Center Bar */}
            <rect
              x="11.5"
              y="4"
              width="1"
              height="10"
              fill="#DECEB0"
              className="animate-pulse"
            />

            {/* Base */}
            <path
              d="M8 20h8l-1-2H9l-1 2z"
              fill="#DECEB0"
              className="transition-all duration-300"
            />

            {/* Base Stem */}
            <rect
              x="11.5"
              y="14"
              width="1"
              height="4"
              fill="#DECEB0"
              className="transition-all duration-300"
            />

            {/* Left Scale Dish */}
            <circle
              cx="7"
              cy="10"
              r="2.5"
              fill="transparent"
              stroke="#DECEB0"
              strokeWidth="1"
              className="animate-bounce"
              style={{ animationDuration: "2s" }}
            />

            {/* Right Scale Dish */}
            <circle
              cx="17"
              cy="10"
              r="2.5"
              fill="transparent"
              stroke="#DECEB0"
              strokeWidth="1"
              className="animate-bounce"
              style={{ animationDuration: "2s", animationDelay: "1s" }}
            />

            {/* Left Arm */}
            <line
              x1="12"
              y1="4"
              x2="7"
              y2="10"
              stroke="#DECEB0"
              strokeWidth="1"
              className="origin-top-right transition-all duration-300"
            />

            {/* Right Arm */}
            <line
              x1="12"
              y1="4"
              x2="17"
              y2="10"
              stroke="#DECEB0"
              strokeWidth="1"
              className="origin-top-left transition-all duration-300"
            />
          </svg>
        </div>

        {/* Loading Text */}
        <h2 className="text-2xl font-bold text-[#DECEB0] mb-4">
          Loading Lawyer Dashboard
        </h2>

        {/* Loading Dots */}
        <div className="flex items-center justify-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-[#DECEB0] animate-bounce"></div>
          <div
            className="w-3 h-3 rounded-full bg-[#DECEB0] animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></div>
          <div
            className="w-3 h-3 rounded-full bg-[#DECEB0] animate-bounce"
            style={{ animationDelay: "0.4s" }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default LawyerDashboardLoader; 