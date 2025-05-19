import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from 'styled-components';

// Custom Logo Component with animation
const LegalAidLogo = ({
  size = "normal",
  color = "#DECEB0",
  hoverColor = "#ffffff",
  className = "",
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
      } ${className}`}
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

const ServiceCard = styled.div`
  .book {
    position: relative;
    border-radius: 10px;
    width: 100%;
    height: 300px;
    background-color: white;
    box-shadow: 1px 1px 12px rgba(0, 0, 0, 0.1);
    transform: preserve-3d;
    perspective: 2000px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #2B3B3A;
    padding: 20px;
    text-align: center;
  }

  .cover {
    top: 0;
    position: absolute;
    background-color: #2B3B3A;
    width: 100%;
    height: 100%;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.5s;
    transform-origin: 0;
    box-shadow: 1px 1px 12px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }

  .book:hover .cover {
    transition: all 0.5s;
    transform: rotatey(-80deg);
  }

  .service-icon {
    margin-bottom: 20px;
  }

  .service-title {
    font-size: 24px;
    font-weight: bold;
    color: #DECEB0;
    margin-bottom: 10px;
  }

  .service-description {
    font-size: 16px;
    color: white;
    line-height: 1.5;
  }

  .content {
    font-size: 16px;
    line-height: 1.5;
    color: #2B3B3A;
  }
`;

const LegalServices = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Add scroll event listener when component mounts
  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const services = [
    {
      title: "Corporate Law",
      description:
        "Expert guidance on business formation, corporate governance, mergers and acquisitions, and compliance with corporate regulations.",
      icon: "business",
    },
    {
      title: "Criminal Law",
      description:
        "Defense representation for criminal cases, including DUI, drug offenses, theft, and other criminal charges.",
      icon: "criminal",
    },
    {
      title: "Family Law",
      description:
        "Comprehensive legal support for divorce, child custody, adoption, and other family-related matters.",
      icon: "family",
    },
    {
      title: "Intellectual Property",
      description:
        "Protection and management of patents, trademarks, copyrights, and trade secrets.",
      icon: "intellectual",
    },
    {
      title: "Real Estate",
      description:
        "Legal assistance with property transactions, leases, zoning issues, and real estate disputes.",
      icon: "realestate",
    },
    {
      title: "Tax Law",
      description:
        "Expert advice on tax planning, compliance, and resolution of tax disputes with authorities.",
      icon: "tax",
    },
    {
      title: "Immigration Law",
      description:
        "Guidance on visas, citizenship, work permits, and other immigration-related matters.",
      icon: "immigration",
    },
    {
      title: "Personal Injury",
      description:
        "Representation for accident victims seeking compensation for injuries and damages.",
      icon: "injury",
    },
    {
      title: "Employment Law",
      description:
        "Legal support for workplace issues, including discrimination, wrongful termination, and labor disputes.",
      icon: "employment",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 bg-[#2B3B3A] p-4 rounded-full shadow-lg hover:bg-[#1a2a29] transition-all duration-300 transform hover:scale-110"
          aria-label="Back to top"
        >
          <LegalAidLogo size="small" color="#DECEB0" hoverColor="#ffffff" />
        </button>
      )}

      {/* Hero Section */}
      <div className="relative h-72 bg-[#2B3B3A] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#2B3B3A] to-black opacity-90"></div>
        <div className="absolute inset-0 flex items-center px-8 lg:px-16">
          <div className="z-10 max-w-7xl mx-auto w-full">
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Legal <span className="text-[#DECEB0]">Services</span>
            </h1>
            <p className="text-gray-200 text-xl max-w-2xl">
              Comprehensive legal solutions from experienced attorneys. We provide expert guidance through every step of your legal journey.
            </p>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {services.map((service, index) => (
            <ServiceCard key={index}>
              <div className="book">
                <div className="content">
                  <h3 className="text-2xl font-bold text-[#2B3B3A] mb-4">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {service.description}
                  </p>
                  <Link
                    to="/booking"
                    className="mt-6 inline-block bg-[#2B3B3A] text-white font-semibold py-2 px-6 rounded-lg hover:bg-[#1a2a29] transition-colors duration-300"
                  >
                    Book Now
                  </Link>
                </div>
                <div className="cover">
                  <div className="service-icon">
                    <LegalAidLogo 
                      size="normal" 
                      color="#DECEB0" 
                      hoverColor="#2B3B3A"
                    />
                  </div>
                  <h3 className="service-title">{service.title}</h3>
                  <p className="service-description">
                    Click to learn more about our {service.title.toLowerCase()} services
                  </p>
                </div>
              </div>
            </ServiceCard>
          ))}
        </div>
      </div>

  
    </div>
  );
};

export default LegalServices;
