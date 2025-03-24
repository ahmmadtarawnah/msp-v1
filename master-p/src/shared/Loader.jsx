import React, { useState, useEffect } from "react";

const Loader = () => {
  const [isAnimating, setIsAnimating] = useState(true);

  // Color scheme matching the existing design
  const primaryColor = "#2B3B3A";
  const bgColor = "#DECEB0";
  const textColor = "#2B3B3A";

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#DECEB0] z-50">
      <div className="relative h-32 w-32 mb-8">
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
            fill={primaryColor}
            className="animate-pulse"
          />

          {/* Center Bar */}
          <rect
            x="11.5"
            y="4"
            width="1"
            height="10"
            fill={primaryColor}
            className="animate-pulse"
          />

          {/* Base */}
          <path
            d="M8 20h8l-1-2H9l-1 2z"
            fill={primaryColor}
            className="transition-all duration-300"
          />

          {/* Base Stem */}
          <rect
            x="11.5"
            y="14"
            width="1"
            height="4"
            fill={primaryColor}
            className="transition-all duration-300"
          />

          {/* Left Scale Dish - Animated to move up and down */}
          <circle
            cx="7"
            cy="10"
            r="2.5"
            fill="transparent"
            stroke={primaryColor}
            strokeWidth="1"
            className="animate-bounce"
            style={{ animationDuration: "2s" }}
          />

          {/* Right Scale Dish - Animated to move opposite to left dish */}
          <circle
            cx="17"
            cy="10"
            r="2.5"
            fill="transparent"
            stroke={primaryColor}
            strokeWidth="1"
            className="animate-bounce"
            style={{ animationDuration: "2s", animationDelay: "1s" }}
          />

          {/* Left Arm - Rotates slightly with animation */}
          <line
            x1="12"
            y1="4"
            x2="7"
            y2="10"
            stroke={primaryColor}
            strokeWidth="1"
            className="origin-top-right transition-all duration-300"
          />

          {/* Right Arm - Rotates slightly with animation */}
          <line
            x1="12"
            y1="4"
            x2="17"
            y2="10"
            stroke={primaryColor}
            strokeWidth="1"
            className="origin-top-left transition-all duration-300"
          />

          {/* Small decorative elements */}
          <circle
            cx="7"
            cy="10"
            r="0.5"
            fill={primaryColor}
            className="opacity-70"
          />
          <circle
            cx="17"
            cy="10"
            r="0.5"
            fill={primaryColor}
            className="opacity-70"
          />
        </svg>

        {/* Glow effect */}
        <div className="absolute inset-0 rounded-full bg-[#DECEB0] opacity-20 blur-md -z-10"></div>
      </div>

      <h2 className="text-3xl font-bold text-[#2B3B3A] mb-4 tracking-wide">
        LegalAid
      </h2>

      <div className="text-center max-w-md px-4">
        <p className="text-[#2B3B3A] text-lg mb-4">
          We're Here to Help You with Legal Advice...
        </p>

        <div className="flex items-center justify-center space-x-2 mt-2">
          <div className="w-3 h-3 rounded-full bg-[#2B3B3A] animate-bounce"></div>
          <div
            className="w-3 h-3 rounded-full bg-[#2B3B3A] animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></div>
          <div
            className="w-3 h-3 rounded-full bg-[#2B3B3A] animate-bounce"
            style={{ animationDelay: "0.4s" }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
