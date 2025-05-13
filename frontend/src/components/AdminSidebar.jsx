import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';

const LegalAidLogo = ({
  size = "normal",
  color = "#DECEB0",
  hoverColor = "#DECEB0",
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
          className={`transition-all duration-300 ${
            isHovered ? "animate-pulse" : ""
          }`}
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

      {/* Glow effect on hover */}
      {isHovered && (
        <div className="absolute inset-0 rounded-full bg-[#DECEB0] opacity-20 blur-md -z-10"></div>
      )}
    </div>
  );
};

const AdminSidebar = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      const sidebar = document.getElementById("sidebar");
      const hamburgerBtn = document.getElementById("hamburger-btn");

      if (
        sidebar &&
        hamburgerBtn &&
        !sidebar.contains(event.target) &&
        !hamburgerBtn.contains(event.target) &&
        isMobileMenuOpen
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  // Close sidebar when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const menuItems = [
    {
      title: "Dashboard",
      path: "/admin-dashboard",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
    },
    {
      title: "Lawyer Applications",
      path: "/admin-dashboard/applications",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
    },
    {
      title: "User Management",
      path: "/admin-dashboard/users",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ),
    },
    {
      title: "Add Blog",
      path: "/admin-dashboard/add-blog",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
      ),
    },
  ];

  // Hamburger menu icon that animates to X when open
  const HamburgerIcon = ({ isOpen }) => (
    <div className="relative w-6 h-6">
      <span
        className={`absolute h-0.5 w-6 bg-white transform transition-all duration-300 ease-in-out ${
          isOpen ? "rotate-45 top-3" : "top-1"
        }`}
      ></span>
      <span
        className={`absolute h-0.5 w-6 bg-white transform transition-all duration-300 ease-in-out top-3 ${
          isOpen ? "opacity-0" : "opacity-100"
        }`}
      ></span>
      <span
        className={`absolute h-0.5 w-6 bg-white transform transition-all duration-300 ease-in-out ${
          isOpen ? "-rotate-45 top-3" : "top-5"
        }`}
      ></span>
    </div>
  );

  return (
    <>
      {/* Hamburger Menu Button - Fixed position */}
      <button
        id="hamburger-btn"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-[#2B3B3A] text-white hover:bg-[#1a2a29] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#DECEB0]"
        aria-label="Toggle navigation menu"
      >
        <HamburgerIcon isOpen={isMobileMenuOpen} />
      </button>

      {/* Sidebar */}
      <div
        id="sidebar"
        className={`fixed top-0 left-0 h-screen w-64 bg-[#2B3B3A] text-white transform transition-transform duration-300 ease-in-out z-40
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      >
        {/* Logo and Brand */}
        <div className="flex items-center justify-center h-20 border-b border-[#3a4b4a]">
          <div className="flex items-center space-x-3">
            <LegalAidLogo size="normal" />
            <span className="text-xl font-bold text-[#DECEB0]">LegalAid</span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="mt-6 flex flex-col h-[calc(100vh-5rem)]">
          <div className="flex-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-6 py-3 text-sm font-medium transition-colors duration-200 ${
                  location.pathname === item.path
                    ? "bg-[#1a2a29] text-[#DECEB0] border-l-4 border-[#DECEB0]"
                    : "text-gray-300 hover:bg-[#1a2a29] hover:text-[#DECEB0]"
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.title}
              </Link>
            ))}
          </div>
          {/* Logout Button at the bottom */}
          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="w-full flex items-center justify-center px-6 py-3 text-sm font-medium text-red-500 hover:text-white hover:bg-red-600 transition-colors duration-200 border-t border-[#3a4b4a]"
          >
            Logout
          </button>
        </nav>
      </div>

      {/* Semi-transparent overlay for mobile - only when sidebar is open */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      {/* Content margin adjustment for desktop */}
      <div className="md:ml-64 transition-all duration-300">
        {/* Your page content goes here */}
      </div>
    </>
  );
};

export default AdminSidebar;
