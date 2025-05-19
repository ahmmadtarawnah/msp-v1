import React, { useEffect, useState } from "react";
import MP4Video from "../assets/law-video.mp4";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";

// Custom Logo Component with animation
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
    <motion.div
      className={`${
        sizeClasses[size]
      } relative cursor-pointer transition-all duration-300 transform ${
        isHovered ? "scale-110" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Custom Scales of Justice Logo with Animation */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full transition-all duration-300"
      >
        {/* Top Balance Point */}
        <motion.circle
          cx="12"
          cy="4"
          r="1.5"
          fill={isHovered ? hoverColor : color}
          animate={{ scale: isHovered ? [1, 1.2, 1] : 1 }}
          transition={{ duration: 0.5, repeat: isHovered ? Infinity : 0 }}
        />

        {/* Center Bar */}
        <motion.rect
          x="11.5"
          y="4"
          width="1"
          height="10"
          fill={isHovered ? hoverColor : color}
          animate={{ scaleY: isHovered ? [1, 1.1, 1] : 1 }}
          transition={{ duration: 0.5, repeat: isHovered ? Infinity : 0 }}
        />

        {/* Base */}
        <motion.path
          d="M8 20h8l-1-2H9l-1 2z"
          fill={isHovered ? hoverColor : color}
          animate={{ scale: isHovered ? [1, 1.05, 1] : 1 }}
          transition={{ duration: 0.5, repeat: isHovered ? Infinity : 0 }}
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
        <motion.circle
          cx="7"
          cy="10"
          r="0.5"
          fill={isHovered ? hoverColor : color}
          animate={{ opacity: isHovered ? [0.7, 1, 0.7] : 0.7 }}
          transition={{ duration: 0.5, repeat: isHovered ? Infinity : 0 }}
        />
        <motion.circle
          cx="17"
          cy="10"
          r="0.5"
          fill={isHovered ? hoverColor : color}
          animate={{ opacity: isHovered ? [0.7, 1, 0.7] : 0.7 }}
          transition={{ duration: 0.5, repeat: isHovered ? Infinity : 0 }}
        />
      </svg>

      {/* Glow effect on hover */}
      {isHovered && (
        <motion.div 
          className="absolute inset-0 rounded-full bg-[#DECEB0] opacity-20 blur-md -z-10"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.2 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.div>
  );
};

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [stats, setStats] = useState({ users: 0, lawyers: 0, appointments: 0 });
  const [topLawyers, setTopLawyers] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/stats");
        setStats(res.data);
      } catch (err) {
        console.error("Failed to load statistics:", err);
      }
    };

    const fetchTopLawyers = async () => {
      try {
        // Get all approved lawyers
        const lawyersRes = await axios.get("http://localhost:5000/api/lawyer-applications/approved");
        const lawyers = lawyersRes.data;

        // Get ratings for each lawyer
        const lawyersWithRatings = await Promise.all(
          lawyers.map(async (lawyer) => {
            try {
              const reviewsRes = await axios.get(`http://localhost:5000/api/reviews/lawyer/${lawyer.userId._id}`);
              const reviews = reviewsRes.data.reviews || [];
              const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
              const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;
              return { ...lawyer, rating: averageRating };
            } catch (error) {
              console.error(`Error fetching reviews for lawyer ${lawyer.userId._id}:`, error);
              return { ...lawyer, rating: 0 };
            }
          })
        );

        // Sort lawyers by rating and get top 6
        const sortedLawyers = lawyersWithRatings
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 6);

        setTopLawyers(sortedLawyers);
      } catch (error) {
        console.error("Error fetching top lawyers:", error);
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/reviews/random-five-star');
        setReviews(response.data.reviews);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchStats();
    fetchTopLawyers();
    fetchReviews();
  }, []);

  useEffect(() => {
    const video = document.getElementById("hero-video");
    video.onloadeddata = () => {
      setLoading(false);
    };

    video.play().catch((error) => {
      console.log("Autoplay prevented:", error);
    });

    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const lawyer = topLawyers.find(lawyer => lawyer._id === "specific_lawyer_id");
  if (lawyer) {
    const personalPicUrl = `http://localhost:5000/uploads/${lawyer.personalPic}`;
    // Use personalPicUrl as needed
  }

  return (
    <div className="bg-gray-900">
      {/* Back to Top Button */}
      {showBackToTop && (
        <motion.button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 bg-gradient-to-r from-[#2B3B3A] to-[#2B3B3A]/80 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="w-12 h-12 flex items-center justify-center">
            <LegalAidLogo size="small" />
          </div>
        </motion.button>
      )}

      {/* Hero Section */}
      <div className="relative h-screen w-full overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 w-full h-full">
          <video
            id="hero-video"
            className="absolute object-cover w-full h-full opacity-60"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          >
            <source src={MP4Video} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Content */}
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
          <motion.div 
            className="max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Main Heading */}
            <motion.h1 
              className="text-white text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Expert Legal Guidance{" "}
              <motion.span 
                className="text-[#DECEB0]"
              >
                at Your Fingertips
              </motion.span>
            </motion.h1>
            <motion.p 
              className="text-gray-300 text-lg md:text-xl mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Connect with experienced lawyers and get the legal support you need, anytime, anywhere.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Link
                to="/Booking"
                className="inline-block bg-[#DECEB0] text-[#2B3B3A] px-8 py-3 rounded-full font-semibold hover:bg-[#2B3B3A] hover:text-[#DECEB0] transition-colors duration-300"
              >
                Book a Session
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Top Rated Lawyers Section */}
      <motion.section 
        id="top-lawyers" 
        className="py-16 bg-[#2B3B3A]"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-[#DECEB0] font-medium text-lg mb-1">
              Our Best Lawyers
            </h3>
            <h2 className="text-white text-3xl md:text-4xl font-bold">
              Top Rated Legal Experts
            </h2>
            <div className="w-24 h-1 bg-[#DECEB0] mx-auto mt-4 mb-6"></div>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Meet our highest-rated legal professionals, recognized for their exceptional service and expertise.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {topLawyers.slice(0, 3).map((lawyer, index) => (
              <motion.div 
                key={lawyer._id}
                className="bg-white rounded-lg shadow-lg overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
              >
                <div className="relative">
                  <img
                    src={lawyer.personalPic ? `http://localhost:5000/uploads/${lawyer.personalPic}` : "https://via.placeholder.com/300x200?text=No+Image"}
                    alt={lawyer.userId.name}
                    className="w-full h-48 object-cover"
                    onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/300x200?text=No+Image"; }}
                  />
                  <div className="absolute top-4 right-4 bg-[#DECEB0] text-[#2B3B3A] px-3 py-1 rounded-full font-semibold">
                    {lawyer.rating.toFixed(1)} ★
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#2B3B3A] mb-2">
                    {lawyer.userId.name}
                  </h3>
                  <p className="text-[#DECEB0] font-medium mb-4">
                    {lawyer.specialization}
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-600">
                      {lawyer.yearsOfExperience} years experience
                    </span>
                    <span className="text-[#2B3B3A] font-semibold">
                      ${lawyer.hourlyRate}/hr
                    </span>
                  </div>
                  <Link
                    to={`/lawyer/${lawyer._id}`}
                    className="block w-full text-center bg-[#2B3B3A] text-[#DECEB0] px-6 py-2 rounded-lg hover:bg-[#1a2a29] transition-colors duration-300"
                  >
                    View Profile
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* About Section */}
      <motion.section 
        id="about" 
        className="py-16 bg-white"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-12">
            {/* Left side with circular image */}
            <motion.div 
              className="md:w-1/2 relative"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <motion.div 
                className="rounded-full overflow-hidden border-8 border-white shadow-xl relative z-10 max-w-xl mx-auto"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src="https://images.pexels.com/photos/4427553/pexels-photo-4427553.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="Attorney consultation"
                  className="w-full h-auto"
                />
              </motion.div>

              <motion.div 
                className="absolute top-5 left-5 p-3 bg-[#DECEB0] rounded-full shadow-lg"
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <LegalAidLogo
                  size="small"
                  color="#2B3B3A"
                  hoverColor="#000000"
                />
              </motion.div>

              <motion.div 
                className="absolute bottom-8 right-2 w-16 h-16 bg-[#2B3B3A] rounded-full shadow-lg flex items-center justify-center"
                whileHover={{ scale: 1.1, rotate: -360 }}
                transition={{ duration: 0.5 }}
              >
                <LegalAidLogo size="small" />
              </motion.div>
            </motion.div>

            {/* Right side with text content */}
            <motion.div 
              className="md:w-1/2 mt-10 md:mt-0"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <motion.h3 
                className="text-[#DECEB0] font-medium text-lg mb-1"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                About Us
              </motion.h3>
              <motion.h2 
                className="text-[#2B3B3A] text-3xl font-bold mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
              >
                We are LegalAid
              </motion.h2>
              <motion.p 
                className="text-gray-700 mb-6 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
              >
                At LegalAid, we are committed to making legal guidance
                accessible, clear, and effective. Whether you're an individual
                or a business, navigating legal matters can be complex—but you
                don't have to do it alone. Our team of experienced legal
                professionals provides expert advice on contracts, business law,
                personal legal matters, and more. We simplify the legal process,
                ensuring you have the knowledge and confidence to make informed
                decisions.
              </motion.p>

              <motion.div 
                className="space-y-4 mb-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                viewport={{ once: true }}
              >
                <motion.div 
                  className="flex items-start"
                  whileHover={{ x: 10 }}
                  transition={{ duration: 0.3 }}
                >
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
                  <p className="ml-3 text-gray-700">
                    Expert attorneys with decades of combined experience
                  </p>
                </motion.div>

                <motion.div 
                  className="flex items-start"
                  whileHover={{ x: 10 }}
                  transition={{ duration: 0.3 }}
                >
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
                  <p className="ml-3 text-gray-700">
                    Personalized solutions tailored to your specific needs
                  </p>
                </motion.div>

                <motion.div 
                  className="flex items-start"
                  whileHover={{ x: 10 }}
                  transition={{ duration: 0.3 }}
                >
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
                  <p className="ml-3 text-gray-700">
                    Transparent pricing with no hidden fees
                  </p>
                </motion.div>
              </motion.div>

              <motion.a
                href="#start-here"
                className="inline-block bg-[#2B3B3A] text-[#DECEB0] px-8 py-3 rounded-full font-medium hover:bg-[#1a2a29] transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Here
              </motion.a>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Services Section */}
      <motion.section 
        id="services" 
        className="py-16 bg-gray-100"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-[#DECEB0] font-medium text-lg mb-1">
              What We Offer
            </h3>
            <h2 className="text-[#2B3B3A] text-3xl md:text-4xl font-bold">
              Our Legal Services
            </h2>
            <div className="w-24 h-1 bg-[#DECEB0] mx-auto mt-4 mb-6"></div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We provide comprehensive legal solutions across various practice
              areas, ensuring our clients receive expert guidance when they need
              it most.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Service Card 1 */}
            <motion.div 
              className="bg-white rounded-lg shadow-md overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
            >
              <div className="p-6">
                <motion.div 
                  className="w-12 h-12 bg-[#2B3B3A] rounded-full flex items-center justify-center mb-4"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <LegalAidLogo size="small" />
                </motion.div>
                <h3 className="text-xl font-bold text-[#2B3B3A] mb-2">
                  Business Law
                </h3>
                <p className="text-gray-600 mb-4">
                  Comprehensive legal support for businesses of all sizes,
                  including formation, contracts, compliance, and dispute
                  resolution.
                </p>
                <motion.a
                  href="#business-law"
                  className="text-[#2B3B3A] font-medium hover:text-[#DECEB0] transition-colors inline-flex items-center"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  Learn More
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </motion.a>
              </div>
            </motion.div>

            {/* Service Card 2 */}
            <motion.div 
              className="bg-white rounded-lg shadow-md overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
            >
              <div className="p-6">
                <motion.div 
                  className="w-12 h-12 bg-[#2B3B3A] rounded-full flex items-center justify-center mb-4"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <LegalAidLogo size="small" />
                </motion.div>
                <h3 className="text-xl font-bold text-[#2B3B3A] mb-2">
                  Family Law
                </h3>
                <p className="text-gray-600 mb-4">
                  Sensitive legal guidance for family matters including divorce,
                  custody, adoption, and estate planning with compassion and
                  expertise.
                </p>
                <motion.a
                  href="#family-law"
                  className="text-[#2B3B3A] font-medium hover:text-[#DECEB0] transition-colors inline-flex items-center"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  Learn More
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </motion.a>
              </div>
            </motion.div>

            {/* Service Card 3 */}
            <motion.div 
              className="bg-white rounded-lg shadow-md overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
            >
              <div className="p-6">
                <motion.div 
                  className="w-12 h-12 bg-[#2B3B3A] rounded-full flex items-center justify-center mb-4"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <LegalAidLogo size="small" />
                </motion.div>
                <h3 className="text-xl font-bold text-[#2B3B3A] mb-2">
                  Personal Injury
                </h3>
                <p className="text-gray-600 mb-4">
                  Dedicated representation for victims of accidents and
                  negligence, helping you secure the compensation you deserve.
                </p>
                <motion.a
                  href="#personal-injury"
                  className="text-[#2B3B3A] font-medium hover:text-[#DECEB0] transition-colors inline-flex items-center"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  Learn More
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </motion.a>
              </div>
            </motion.div>
          </div>

          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/legal-services"
                className="inline-block bg-[#2B3B3A] text-[#DECEB0] px-8 py-3 rounded-full font-medium hover:bg-[#1a2a29] transition-colors duration-300"
              >
                View All Services
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Testimonials Section */}
      <motion.section 
        id="testimonials" 
        className="py-16 bg-[#2B3B3A]"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-[#DECEB0] font-medium text-lg mb-1">
              Client Experiences
            </h3>
            <h2 className="text-white text-3xl md:text-4xl font-bold">
              What Our Clients Say
            </h2>
            <div className="w-24 h-1 bg-[#DECEB0] mx-auto mt-4 mb-6"></div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((review, index) => (
              <motion.div 
                key={review._id}
                className="bg-white rounded-lg shadow-lg p-6 relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
              >
                <motion.div 
                  className="absolute -top-5 left-6 w-10 h-10 bg-[#DECEB0] rounded-full flex items-center justify-center"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <LegalAidLogo
                    size="small"
                    color="#2B3B3A"
                    hoverColor="#000000"
                  />
                </motion.div>
                <div className="mb-4 mt-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-[#DECEB0]"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M10 7l-.94 2H7v4h3l1 2h2V7h-3zm7 0l-.94 2H14v4h3l1 2h2V7h-3z" />
                  </svg>
                </div>
                <p className="text-gray-600 mb-6 italic">
                  {review.comment}
                </p>
                <motion.div 
                  className="flex items-center"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(review.userId.name)}&background=2B3B3A&color=DECEB0`}
                      alt={review.userId.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#2B3B3A]">{review.userId.name}</h4>
                    <p className="text-gray-500 text-sm">{review.lawyerId.specialization} Client</p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* FAQ Section */}
      <motion.section 
        id="faq" 
        className="py-16 bg-white"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-[#DECEB0] font-medium text-lg mb-1">
              Common Questions
            </h3>
            <h2 className="text-[#2B3B3A] text-3xl md:text-4xl font-bold">
              Frequently Asked Questions
            </h2>
            <div className="w-24 h-1 bg-[#DECEB0] mx-auto mt-4 mb-6"></div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We've compiled answers to questions we commonly receive from our
              clients to help you better understand our services.
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            {/* FAQ Item 1 */}
            <motion.div 
              className="mb-6 border-b border-gray-200 pb-6"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              whileHover={{ x: 5 }}
            >
              <h3 className="text-xl font-bold text-[#2B3B3A] mb-2 flex items-center">
                <motion.div 
                  className="w-8 h-8 bg-[#2B3B3A] rounded-full flex items-center justify-center mr-3 flex-shrink-0"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <LegalAidLogo size="small" />
                </motion.div>
                How do I know if I need legal representation?
              </h3>
              <div className="pl-11">
                <p className="text-gray-600">
                  If you're facing a legal issue that could significantly impact
                  your finances, freedom, rights, or property, it's advisable to
                  seek legal representation. During a free initial consultation,
                  our attorneys can assess your situation and advise whether
                  professional legal assistance would benefit your case.
                </p>
              </div>
            </motion.div>

            {/* FAQ Item 2 */}
            <motion.div 
              className="mb-6 border-b border-gray-200 pb-6"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              whileHover={{ x: 5 }}
            >
              <h3 className="text-xl font-bold text-[#2B3B3A] mb-2 flex items-center">
                <motion.div 
                  className="w-8 h-8 bg-[#2B3B3A] rounded-full flex items-center justify-center mr-3 flex-shrink-0"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <span className="text-[#DECEB0] font-medium">Q</span>
                </motion.div>
                What should I bring to my first consultation?
              </h3>
              <div className="pl-11">
                <p className="text-gray-600">
                  For your initial consultation, bring any documents relevant to
                  your case, such as contracts, correspondence, police reports,
                  medical records, or court notices. Also prepare a timeline of
                  events and a list of questions you'd like to ask. This
                  preparation helps us provide the most accurate assessment of
                  your situation.
                </p>
              </div>
            </motion.div>

            {/* FAQ Item 3 */}
            <motion.div 
              className="mb-6 border-b border-gray-200 pb-6"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ x: 5 }}
            >
              <h3 className="text-xl font-bold text-[#2B3B3A] mb-2 flex items-center">
                <motion.div 
                  className="w-8 h-8 bg-[#2B3B3A] rounded-full flex items-center justify-center mr-3 flex-shrink-0"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <span className="text-[#DECEB0] font-medium">Q</span>
                </motion.div>
                How are your legal fees structured?
              </h3>
              <div className="pl-11">
                <p className="text-gray-600">
                  Our fee structures vary depending on the type of case. We
                  offer hourly rates, flat fees for specific services,
                  contingency arrangements for personal injury cases, and
                  retainer agreements for ongoing representation. During your
                  consultation, we'll discuss the most appropriate fee
                  arrangement for your specific situation and provide full
                  transparency about costs.
                </p>
              </div>
            </motion.div>

            {/* FAQ Item 4 */}
            <motion.div 
              className="mb-6"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              viewport={{ once: true }}
              whileHover={{ x: 5 }}
            >
              <h3 className="text-xl font-bold text-[#2B3B3A] mb-2 flex items-center">
                <motion.div 
                  className="w-8 h-8 bg-[#2B3B3A] rounded-full flex items-center justify-center mr-3 flex-shrink-0"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <span className="text-[#DECEB0] font-medium">Q</span>
                </motion.div>
                How long will my case take to resolve?
              </h3>
              <div className="pl-11">
                <p className="text-gray-600">
                  Case timelines vary significantly depending on complexity,
                  court schedules, opposing parties, and the specific legal
                  issues involved. Some matters can be resolved in weeks, while
                  others may take months or even years. We strive to resolve
                  your case as efficiently as possible while still achieving the
                  best outcome, and we'll provide regular updates on progress
                  and expected timelines.
                </p>
              </div>
            </motion.div>
          </div>

          <motion.div 
            className="text-center mt-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            viewport={{ once: true }}
          >
            <motion.a
              href="#more-faqs"
              className="inline-block bg-[#2B3B3A] text-[#DECEB0] px-8 py-3 rounded-full font-medium hover:bg-[#1a2a29] transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View More FAQs
            </motion.a>
          </motion.div>
        </div>
      </motion.section>

      {/* Loading Spinner */}
      {loading && (
        <div className="spinner fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"></div>
      )}
    </div>
  );
};

export default Home;