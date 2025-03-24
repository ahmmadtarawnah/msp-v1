import React, { useState, useEffect } from "react";

// Add import for LegalAidLogo component
const LegalAidLogo = ({
  size = "normal",
  color = "#2B3B3A",
  hoverColor = "#1a2a29",
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Size variations
  const sizeClasses = {
    small: "h-6 w-6",
    normal: "h-10 w-10",
    large: "h-12 w-12", // Make the large size even bigger
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

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);
useEffect(() => {
  const navbarHeight = scrolled ? 64 : 80; // 64px for scrolled, 80px for normal
  document.body.style.paddingTop = `${navbarHeight}px`;
}, [scrolled]);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "h-16 shadow-md" : "h-20"
      } bg-[#DECEB0]`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-between items-center h-full">
          {/* Logo and Website Name */}
          <div className="flex items-center">
            <a href="/" className="group flex items-center cursor-pointer">
              <div className="text-[#2B3B3A] mr-2 transition-transform duration-700 ease-in-out transform group-hover:scale-110">
                <LegalAidLogo size="large" />
              </div>
              <h1 className="text-[#2B3B3A] text-2xl font-bold tracking-wide animate-fadeIn">
                LegalAid
              </h1>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="/Booking"
              className="text-[#2B3B3A] hover:text-[#1a2a29] font-medium text-lg relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-[#2B3B3A] after:transition-all after:duration-300 hover:after:w-full"
            >
              Book Session
            </a>
            <a
              href="#blogs"
              className="text-[#2B3B3A] hover:text-[#1a2a29] font-medium text-lg relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-[#2B3B3A] after:transition-all after:duration-300 hover:after:w-full"
            >
              Blogs
            </a>
            <a
              href="#about"
              className="text-[#2B3B3A] hover:text-[#1a2a29] font-medium text-lg relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-[#2B3B3A] after:transition-all after:duration-300 hover:after:w-full"
            >
              About
            </a>
            <a
              href="/Contact"
              className="text-[#2B3B3A] hover:text-[#1a2a29] font-medium text-lg relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-[#2B3B3A] after:transition-all after:duration-300 hover:after:w-full"
            >
              Contact
            </a>
            <a
              href="/Login"
              className="bg-[#2B3B3A] text-[#DECEB0] px-5 py-2 rounded hover:bg-[#1a2a29] transition-colors duration-300 font-medium text-lg transform hover:scale-105 transition-transform"
            >
              Login
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              className="text-[#2B3B3A] focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              <div className="relative w-6 h-5">
                <span
                  className={`absolute h-0.5 w-6 bg-[#2B3B3A] transform transition duration-300 ease-in-out ${
                    mobileMenuOpen
                      ? "rotate-45 translate-y-2.5"
                      : "translate-y-0"
                  }`}
                />
                <span
                  className={`absolute h-0.5 w-6 bg-[#2B3B3A] transform transition duration-300 ease-in-out translate-y-2 ${
                    mobileMenuOpen ? "opacity-0" : "opacity-100"
                  }`}
                />
                <span
                  className={`absolute h-0.5 w-6 bg-[#2B3B3A] transform transition duration-300 ease-in-out ${
                    mobileMenuOpen
                      ? "-rotate-45 translate-y-2.5"
                      : "translate-y-4"
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute top-full left-0 w-full bg-[#DECEB0] shadow-lg transform transition-transform duration-300 origin-top ${
          mobileMenuOpen ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0"
        }`}
      >
        <div className="px-4 pt-2 pb-4 space-y-4">
          <a
            href="#book"
            className="block py-2 text-[#2B3B3A] font-medium text-lg hover:bg-[#d0c09f] px-3 rounded-md transition-colors"
          >
            Book Session
          </a>
          <a
            href="#blogs"
            className="block py-2 text-[#2B3B3A] font-medium text-lg hover:bg-[#d0c09f] px-3 rounded-md transition-colors"
          >
            Blogs
          </a>
          <a
            href="#about"
            className="block py-2 text-[#2B3B3A] font-medium text-lg hover:bg-[#d0c09f] px-3 rounded-md transition-colors"
          >
            About
          </a>
          <a
            href="#contact"
            className="block py-2 text-[#2B3B3A] font-medium text-lg hover:bg-[#d0c09f] px-3 rounded-md transition-colors"
          >
            Contact
          </a>
          <a
            href="#login"
            className="block py-2 px-3 bg-[#2B3B3A] text-[#DECEB0] font-medium text-lg rounded-md hover:bg-[#1a2a29] transition-colors"
          >
            Login
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
