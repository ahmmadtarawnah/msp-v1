import React from 'react';

const StyledButton = ({ onClick, children }) => {
  return (
    <button 
      onClick={onClick}
      className="relative cursor-pointer opacity-90 hover:opacity-100 transition-opacity p-[2px] bg-black rounded-[16px] bg-gradient-to-t from-[#2B3B3A] to-[#1A2A29] active:scale-95"
    >
      <span className="w-full h-full flex items-center gap-2 px-8 py-3 bg-[#2B3B3A] text-[#DECEB0] rounded-[14px] bg-gradient-to-t from-[#2B3B3A] to-[#1A2A29]">
        <svg 
          viewBox="0 0 24 24" 
          className="w-5 h-5" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Scales of Justice Logo */}
          <circle
            cx="12"
            cy="4"
            r="1.5"
            fill="#DECEB0"
            className="transition-all duration-300"
          />
          <rect
            x="11.5"
            y="4"
            width="1"
            height="10"
            fill="#DECEB0"
            className="transition-all duration-300"
          />
          <path
            d="M8 20h8l-1-2H9l-1 2z"
            fill="#DECEB0"
            className="transition-all duration-300"
          />
          <rect
            x="11.5"
            y="14"
            width="1"
            height="4"
            fill="#DECEB0"
            className="transition-all duration-300"
          />
          <circle
            cx="7"
            cy="10"
            r="2.5"
            fill="transparent"
            stroke="#DECEB0"
            strokeWidth="1"
            className="transition-all duration-500"
          />
          <circle
            cx="17"
            cy="10"
            r="2.5"
            fill="transparent"
            stroke="#DECEB0"
            strokeWidth="1"
            className="transition-all duration-500"
          />
          <line
            x1="12"
            y1="4"
            x2="7"
            y2="10"
            stroke="#DECEB0"
            strokeWidth="1"
            className="transition-all duration-300"
          />
          <line
            x1="12"
            y1="4"
            x2="17"
            y2="10"
            stroke="#DECEB0"
            strokeWidth="1"
            className="transition-all duration-300"
          />
        </svg>
        {children}
      </span>
    </button>
  );
};

export default StyledButton; 