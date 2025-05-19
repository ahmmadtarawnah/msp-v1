import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";

// Enhanced LegalAid Logo with subtle animations
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
      {/* Custom Scales of Justice Logo */}
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
          className={`transition-all duration-300 ${
            isHovered ? "animate-pulse" : ""
          }`}
        />
        <rect
          x="11.5"
          y="4"
          width="1"
          height="10"
          fill={isHovered ? hoverColor : color}
          className="transition-all duration-300"
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
          className="transition-all duration-300"
        />
        <line
          x1="12"
          y1="4"
          x2="17"
          y2="10"
          stroke={isHovered ? hoverColor : color}
          strokeWidth="1"
          className="transition-all duration-300"
        />
        <circle
          cx="7"
          cy="10"
          r="0.5"
          fill={isHovered ? hoverColor : color}
          className="transition-all duration-300"
        />
        <circle
          cx="17"
          cy="10"
          r="0.5"
          fill={isHovered ? hoverColor : color}
          className="transition-all duration-300"
        />
      </svg>

      {/* Subtle glow effect on hover */}
      {isHovered && (
        <div className="absolute inset-0 rounded-full bg-[#DECEB0] opacity-20 blur-md -z-10"></div>
      )}
    </div>
  );
};

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { authData, logout } = useAuth();
  const navigate = useNavigate();

  // Track scroll position for navbar styling
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

  // Close mobile menu when navigating or resizing to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [mobileMenuOpen]);

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out and redirected to the home page.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2B3B3A",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, log me out!",
      cancelButtonText: "No, cancel!",
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        navigate("/");
      }
    });
  };

  // Navigation links configuration for DRY code
  const navLinks = [
    { path: "/", label: "Home", showFor: ["all"] },
    { path: "/Booking", label: "Book Session", showFor: ["all"] },
    { path: "/Blogs", label: "Blogs", showFor: ["all"] },
    { path: "/about", label: "About", showFor: ["all"] },
    { path: "/Contact", label: "Contact", showFor: ["all"] },
    {
      path: "/lawyer-dashboard",
      label: "Lawyer Dashboard",
      showFor: ["lawyer"],
    },
    { path: "/admin-dashboard", label: "Admin Dashboard", showFor: ["admin"] },
    { path: "/become-a-lawyer", label: "Become a Lawyer", showFor: ["user"] },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#DECEB0]/95 backdrop-blur-sm h-16 shadow-lg"
          : "bg-[#DECEB0] h-20"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-between items-center h-full">
          {/* Logo and Brand Name */}
          <Link to="/" className="group flex items-center space-x-2">
            <div className="transition-transform duration-500 transform group-hover:scale-110">
              <LegalAidLogo size="normal" />
            </div>
            <span className="text-[#2B3B3A] font-bold text-2xl tracking-tight">
              Legal<span className="font-extrabold">Aid</span>
            </span>
          </Link>

          {/* Desktop Navigation - New horizontal pill design */}
          <div className="hidden md:flex items-center">
            <div className="bg-[#2B3B3A]/10 rounded-full p-1 mr-4">
              <div className="flex space-x-1">
                {navLinks.map((link) => {
                  // Only show links that are for everyone or match the user's role
                  if (
                    link.showFor.includes("all") ||
                    (authData && link.showFor.includes(authData.role))
                  ) {
                    return (
                      <Link
                        key={link.path}
                        to={link.path}
                        className="px-4 py-2 text-[#2B3B3A] font-medium rounded-full hover:bg-[#2B3B3A]/20 transition-colors"
                      >
                        {link.label}
                      </Link>
                    );
                  }
                  return null;
                })}
              </div>
            </div>

            {/* Authentication Buttons */}
            <div className="flex items-center space-x-2">
              {!authData ? (
                <Link
                  to="/Login"
                  className="bg-[#2B3B3A] text-[#DECEB0] px-5 py-2.5 rounded-full hover:bg-[#1a2a29] transition-colors duration-300 font-medium flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Login
                </Link>
              ) : (
                <div className="flex items-center space-x-2">
                  {authData && authData.role !== "lawyer" && (
                    <Link
                      to="/Profile"
                      className="bg-[#2B3B3A]/10 text-[#2B3B3A] px-4 py-2.5 rounded-full hover:bg-[#2B3B3A]/20 transition-colors duration-300 font-medium flex items-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      Profile
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="bg-[#2B3B3A] text-[#DECEB0] px-4 py-2.5 rounded-full hover:bg-[#1a2a29] transition-colors duration-300 font-medium flex items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button - Fancy hamburger animation */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              className="p-2 rounded-full bg-[#2B3B3A]/10 text-[#2B3B3A] focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
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

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 md:hidden z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu - Slide-in drawer style */}
      <div
        className={`fixed md:hidden top-[${
          scrolled ? "64px" : "80px"
        }] right-0 h-[calc(100vh-80px)] w-4/5 max-w-sm bg-[#DECEB0] shadow-xl transform transition-transform duration-300 ease-in-out z-50 ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Mobile menu content */}
        <div className="h-full overflow-y-auto flex flex-col pt-6 pb-20">
          <div className="px-6 space-y-4 flex-1">
            {/* User profile summary if logged in */}
            {authData && (
              <div className="mb-6 bg-[#2B3B3A]/10 rounded-xl p-4">
                <div className="flex items-center mb-3">
                  <div className="bg-[#2B3B3A] text-[#DECEB0] rounded-full p-3 mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-[#2B3B3A]">
                      Logged in as
                    </span>
                    <span className="block text-lg font-bold text-[#2B3B3A]">
                      {authData.role}
                    </span>
                  </div>
                </div>
                {authData.role !== "lawyer" && (
                  <Link
                    to="/Profile"
                    className="flex items-center justify-center w-full bg-[#2B3B3A]/20 rounded-lg py-2 text-[#2B3B3A] hover:bg-[#2B3B3A]/30"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    View Profile
                  </Link>
                )}
              </div>
            )}

            {/* Navigation Links */}
            <div className="space-y-1">
              {navLinks.map((link) => {
                // Only show links that are for everyone or match the user's role
                if (
                  link.showFor.includes("all") ||
                  (authData && link.showFor.includes(authData.role))
                ) {
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      className="flex items-center py-3 px-4 rounded-lg text-[#2B3B3A] font-medium hover:bg-[#2B3B3A]/10 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  );
                }
                return null;
              })}
            </div>
          </div>

          {/* Fixed bottom auth controls */}
          <div className="mt-auto border-t border-[#2B3B3A]/10 px-6 py-4">
            {!authData ? (
              <Link
                to="/Login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center w-full bg-[#2B3B3A] text-[#DECEB0] py-3 px-6 rounded-lg font-medium hover:bg-[#1a2a29] transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
                Login
              </Link>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="flex items-center justify-center w-full bg-[#2B3B3A] text-[#DECEB0] py-3 px-6 rounded-lg font-medium hover:bg-[#1a2a29] transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
