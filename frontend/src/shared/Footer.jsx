import React, { useState } from "react";
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [isHovered, setIsHovered] = useState(false);

  // Size variations for the logo
  const sizeClasses = {
    small: "h-6 w-6",
    normal: "h-10 w-10",
    large: "h-12 w-12", // Make the large size even bigger
  };

  return (
    <footer className="bg-[#2B3B3A] text-[#DECEB0] pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top section with columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-4">
              <div
                className={`${
                  sizeClasses["normal"]
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
                    fill={isHovered ? "#DECEB0" : "#DECEB0"}
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
                    fill={isHovered ? "#DECEB0" : "#DECEB0"}
                    className={`transition-all duration-300 ${
                      isHovered ? "animate-pulse" : ""
                    }`}
                  />

                  {/* Base */}
                  <path
                    d="M8 20h8l-1-2H9l-1 2z"
                    fill={isHovered ? "#DECEB0" : "#DECEB0"}
                    className="transition-all duration-300"
                  />

                  {/* Base Stem */}
                  <rect
                    x="11.5"
                    y="14"
                    width="1"
                    height="4"
                    fill={isHovered ? "#DECEB0" : "#DECEB0"}
                    className="transition-all duration-300"
                  />

                  {/* Left Scale Dish */}
                  <circle
                    cx="7"
                    cy="10"
                    r="2.5"
                    fill="transparent"
                    stroke={isHovered ? "#DECEB0" : "#DECEB0"}
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
                    stroke={isHovered ? "#DECEB0" : "#DECEB0"}
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
                    stroke={isHovered ? "#DECEB0" : "#DECEB0"}
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
                    stroke={isHovered ? "#DECEB0" : "#DECEB0"}
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
                    fill={isHovered ? "#DECEB0" : "#DECEB0"}
                    className={`transition-all duration-300 ${
                      isHovered ? "opacity-100" : "opacity-70"
                    }`}
                  />
                  <circle
                    cx="17"
                    cy="10"
                    r="0.5"
                    fill={isHovered ? "#DECEB0" : "#DECEB0"}
                    className={`transition-all duration-300 ${
                      isHovered ? "opacity-100" : "opacity-70"
                    }`}
                  />
                </svg>
              </div>

              <h2 className="text-xl font-bold">LegalAid</h2>
            </div>
            <p className="mb-4 text-sm leading-relaxed">
              Providing accessible legal assistance and resources to empower
              individuals and communities in navigating the legal system.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-[#DECEB0] hover:text-white transition-colors duration-300"
              >
                <FaFacebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-[#DECEB0] hover:text-white transition-colors duration-300"
              >
                <FaTwitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-[#DECEB0] hover:text-white transition-colors duration-300"
              >
                <FaLinkedin className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-[#DECEB0] hover:text-white transition-colors duration-300"
              >
                <FaInstagram className="h-5 w-5" />
              </a>
            </div>
          </div>
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-[#DECEB0] pb-2">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#services"
                  className="text-[#DECEB0] hover:text-white transition-colors duration-300 flex items-center"
                >
                  <span className="mr-2">›</span>Our Services
                </a>
              </li>
              <li>
                <a
                  href="#book"
                  className="text-[#DECEB0] hover:text-white transition-colors duration-300 flex items-center"
                >
                  <span className="mr-2">›</span>Book a Session
                </a>
              </li>
              <li>
                <a
                  href="#blogs"
                  className="text-[#DECEB0] hover:text-white transition-colors duration-300 flex items-center"
                >
                  <span className="mr-2">›</span>Legal Resources
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  className="text-[#DECEB0] hover:text-white transition-colors duration-300 flex items-center"
                >
                  <span className="mr-2">›</span>About Us
                </a>
              </li>
              <li>
                <a
                  href="#careers"
                  className="text-[#DECEB0] hover:text-white transition-colors duration-300 flex items-center"
                >
                  <span className="mr-2">›</span>Careers
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-[#DECEB0] pb-2">
              Contact Information
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <FaMapMarkerAlt className="h-5 w-5 mr-3 mt-1 flex-shrink-0" />
                <span>
                  zarqa, new zarqa
                  <br />
                  Jordan
                </span>
              </li>
              <li className="flex items-center">
                <FaPhone className="h-5 w-5 mr-3 flex-shrink-0" />
                <span>+962793939352</span>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="h-5 w-5 mr-3 flex-shrink-0" />
                <span>LegalAid@legal.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-[#DECEB0] pb-2">
              Newsletter
            </h3>
            <p className="mb-4 text-sm">
              Stay updated with legal news and our services.
            </p>
            <form className="space-y-2">
              <div>
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full px-3 py-2 bg-[#1a2a29] border border-[#DECEB0] text-[#DECEB0] rounded focus:outline-none focus:border-white"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#DECEB0] text-[#2B3B3A] px-4 py-2 rounded font-medium hover:bg-white transition-colors duration-300"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#DECEB0] opacity-30 mb-6"></div>

        {/* Bottom section */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm">
          <div className="mb-4 md:mb-0">
            <p>&copy; {currentYear} LegalAid. All rights reserved.</p>
          </div>
          <div className="flex space-x-6">
            <a
              href="#terms"
              className="text-[#DECEB0] hover:text-white transition-colors duration-300"
            >
              Terms of Service
            </a>
            <a
              href="#privacy"
              className="text-[#DECEB0] hover:text-white transition-colors duration-300"
            >
              Privacy Policy
            </a>
            <a
              href="#cookies"
              className="text-[#DECEB0] hover:text-white transition-colors duration-300"
            >
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
