import React, { useEffect, useState } from "react";
import MP4Video from "../assets/law-video.mp4";
import { Link } from "react-router-dom";

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
// Custom Logo Component with animation





const Home = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const video = document.getElementById("hero-video");
    video.onloadeddata = () => {
      setLoading(false); // Hide loading spinner when video is loaded
    };

    video.play().catch((error) => {
      console.log("Autoplay prevented:", error);
    });
  }, []);

  return (
    <div className="bg-gray-900">
      {/* Hero Section */}
      <div className="relative h-screen w-full overflow-hidden">
        {/* Video Background with opacity applied */}
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
          <div className="max-w-3xl">
            {/* Logo and Tagline - REPLACED WITH CUSTOM LOGO */}

            {/* Main Heading */}
            <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Expert Legal Guidance{" "}
              <span className="text-[#DECEB0]">When You Need It Most</span>
            </h1>

            {/* Subheading */}
            <p className="text-gray-200 text-xl md:text-2xl mb-8 leading-relaxed max-w-2xl">
              Professional legal consultations tailored to your unique
              situation. We navigate complex legal matters so you don't have to.
            </p>

            {/* Features Highlight */}
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="bg-[#2B3B3A] bg-opacity-80 py-2 px-4 rounded-lg border border-[#DECEB0] text-[#DECEB0]">
                Experienced Attorneys
              </div>
              <div className="bg-[#2B3B3A] bg-opacity-80 py-2 px-4 rounded-lg border border-[#DECEB0] text-[#DECEB0]">
                Personalized Advice
              </div>
              <div className="bg-[#2B3B3A] bg-opacity-80 py-2 px-4 rounded-lg border border-[#DECEB0] text-[#DECEB0]">
                Affordable Consultations
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#book"
                className="bg-[#DECEB0] hover:bg-white text-[#2B3B3A] font-bold text-lg py-3 px-8 rounded-md transition-all duration-300 transform hover:scale-105 shadow-lg inline-flex items-center justify-center"
              >
                Book a Consultation
              </a>
              <Link
                to="/become-a-lawyer"
                className="bg-transparent hover:bg-[#2B3B3A] text-[#DECEB0] font-semibold text-lg py-3 px-8 rounded-md border-2 border-[#DECEB0] hover:border-[#2B3B3A] transition-all duration-300 inline-flex items-center justify-center"
              >
                Become a Lawyer
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <section id="about" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-12">
            {/* Left side with circular image */}
            <div className="md:w-1/2 relative">
              <div className="rounded-full overflow-hidden border-8 border-white shadow-xl relative z-10 max-w-xl mx-auto">
                <img
                  src="https://images.pexels.com/photos/4427553/pexels-photo-4427553.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="Attorney consultation"
                  className="w-full h-auto"
                />
              </div>

              {/* Updated with LegalAidLogo */}
              <div className="absolute top-5 left-5 p-3 bg-[#DECEB0] rounded-full shadow-lg">
                <LegalAidLogo
                  size="small"
                  color="#2B3B3A"
                  hoverColor="#000000"
                />
              </div>

              <div className="absolute bottom-8 right-2 w-16 h-16 bg-[#2B3B3A] rounded-full shadow-lg flex items-center justify-center">
                <LegalAidLogo size="small" />
              </div>
            </div>

            {/* Right side with text content */}
            <div className="md:w-1/2 mt-10 md:mt-0">
              <h3 className="text-[#DECEB0] font-medium text-lg mb-1">
                About Us
              </h3>
              <h2 className="text-[#2B3B3A] text-3xl font-bold mb-6">
                We are LegalAid
              </h2>
              <p className="text-gray-700 mb-6 leading-relaxed">
                At LegalAid, we are committed to making legal guidance
                accessible, clear, and effective. Whether you're an individual
                or a business, navigating legal matters can be complex—but you
                don't have to do it alone. Our team of experienced legal
                professionals provides expert advice on contracts, business law,
                personal legal matters, and more. We simplify the legal process,
                ensuring you have the knowledge and confidence to make informed
                decisions.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start">
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
                </div>

                <div className="flex items-start">
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
                </div>

                <div className="flex items-start">
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
                </div>
              </div>

              <a
                href="#start-here"
                className="inline-block bg-[#2B3B3A] text-[#DECEB0] px-8 py-3 rounded-full font-medium hover:bg-[#1a2a29] transition-colors duration-300"
              >
                Start Here
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Service Card 1 - Updated with Logo */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:transform hover:scale-105">
              <div className="p-6">
                <div className="w-12 h-12 bg-[#2B3B3A] rounded-full flex items-center justify-center mb-4">
                  <LegalAidLogo size="small" />
                </div>
                <h3 className="text-xl font-bold text-[#2B3B3A] mb-2">
                  Business Law
                </h3>
                <p className="text-gray-600 mb-4">
                  Comprehensive legal support for businesses of all sizes,
                  including formation, contracts, compliance, and dispute
                  resolution.
                </p>
                <a
                  href="#business-law"
                  className="text-[#2B3B3A] font-medium hover:text-[#DECEB0] transition-colors inline-flex items-center"
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
                </a>
              </div>
            </div>

            {/* Service Card 2 - Updated with Logo */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:transform hover:scale-105">
              <div className="p-6">
                <div className="w-12 h-12 bg-[#2B3B3A] rounded-full flex items-center justify-center mb-4">
                  <LegalAidLogo size="small" />
                </div>
                <h3 className="text-xl font-bold text-[#2B3B3A] mb-2">
                  Family Law
                </h3>
                <p className="text-gray-600 mb-4">
                  Sensitive legal guidance for family matters including divorce,
                  custody, adoption, and estate planning with compassion and
                  expertise.
                </p>
                <a
                  href="#family-law"
                  className="text-[#2B3B3A] font-medium hover:text-[#DECEB0] transition-colors inline-flex items-center"
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
                </a>
              </div>
            </div>

            {/* Service Card 3 - Updated with Logo */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:transform hover:scale-105">
              <div className="p-6">
                <div className="w-12 h-12 bg-[#2B3B3A] rounded-full flex items-center justify-center mb-4">
                  <LegalAidLogo size="small" />
                </div>
                <h3 className="text-xl font-bold text-[#2B3B3A] mb-2">
                  Personal Injury
                </h3>
                <p className="text-gray-600 mb-4">
                  Dedicated representation for victims of accidents and
                  negligence, helping you secure the compensation you deserve.
                </p>
                <a
                  href="#personal-injury"
                  className="text-[#2B3B3A] font-medium hover:text-[#DECEB0] transition-colors inline-flex items-center"
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
                </a>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <a
              href="#all-services"
              className="inline-block bg-[#2B3B3A] text-[#DECEB0] px-8 py-3 rounded-full font-medium hover:bg-[#1a2a29] transition-colors duration-300"
            >
              View All Services
            </a>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 bg-[#2B3B3A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-[#DECEB0] font-medium text-lg mb-1">
              Client Experiences
            </h3>
            <h2 className="text-white text-3xl md:text-4xl font-bold">
              What Our Clients Say
            </h2>
            <div className="w-24 h-1 bg-[#DECEB0] mx-auto mt-4 mb-6"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 - Updated with Logo */}
            <div className="bg-white rounded-lg shadow-lg p-6 relative">
              <div className="absolute -top-5 left-6 w-10 h-10 bg-[#DECEB0] rounded-full flex items-center justify-center">
                <LegalAidLogo
                  size="small"
                  color="#2B3B3A"
                  hoverColor="#000000"
                />
              </div>
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
                "LegalAid provided exceptional support during our business
                incorporation. Their expertise made a complex process
                straightforward, and their advice saved us from several
                potential pitfalls."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                  <img
                    src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                    alt="Client"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-[#2B3B3A]">Michael Johnson</h4>
                  <p className="text-gray-500 text-sm">Small Business Owner</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 - Updated with Logo */}
            <div className="bg-white rounded-lg shadow-lg p-6 relative">
              <div className="absolute -top-5 left-6 w-10 h-10 bg-[#DECEB0] rounded-full flex items-center justify-center">
                <LegalAidLogo
                  size="small"
                  color="#2B3B3A"
                  hoverColor="#000000"
                />
              </div>
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
                "During a difficult divorce, the team at LegalAid was
                compassionate and professional. They guided me through each step
                and helped me secure a fair settlement that protected my
                interests and my children's future."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                  <img
                    src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                    alt="Client"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-[#2B3B3A]">Sarah Thompson</h4>
                  <p className="text-gray-500 text-sm">Family Law Client</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 - Updated with Logo */}
            <div className="bg-white rounded-lg shadow-lg p-6 relative">
              <div className="absolute -top-5 left-6 w-10 h-10 bg-[#DECEB0] rounded-full flex items-center justify-center">
                <LegalAidLogo
                  size="small"
                  color="#2B3B3A"
                  hoverColor="#000000"
                />
              </div>
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
                "After my accident, I was overwhelmed with medical bills and
                insurance claims. The personal injury team at LegalAid fought
                tirelessly for me and secured a settlement that covered all my
                expenses and compensated me for my suffering."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                  <img
                    src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                    alt="Client"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-[#2B3B3A]">David Rodriguez</h4>
                  <p className="text-gray-500 text-sm">
                    Personal Injury Client
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
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
          </div>

          <div className="max-w-3xl mx-auto">
            {/* FAQ Item 1 - Updated with Logo */}
            <div className="mb-6 border-b border-gray-200 pb-6">
              <h3 className="text-xl font-bold text-[#2B3B3A] mb-2 flex items-center">
                <div className="w-8 h-8 bg-[#2B3B3A] rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <LegalAidLogo size="small" />
                </div>
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
            </div>

            {/* FAQ Item 2 */}
            <div className="mb-6 border-b border-gray-200 pb-6">
              <h3 className="text-xl font-bold text-[#2B3B3A] mb-2 flex items-center">
                <div className="w-8 h-8 bg-[#2B3B3A] rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-[#DECEB0] font-medium">Q</span>
                </div>
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
            </div>

            {/* FAQ Item 3 */}
            <div className="mb-6 border-b border-gray-200 pb-6">
              <h3 className="text-xl font-bold text-[#2B3B3A] mb-2 flex items-center">
                <div className="w-8 h-8 bg-[#2B3B3A] rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-[#DECEB0] font-medium">Q</span>
                </div>
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
            </div>

            {/* FAQ Item 4 */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-[#2B3B3A] mb-2 flex items-center">
                <div className="w-8 h-8 bg-[#2B3B3A] rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-[#DECEB0] font-medium">Q</span>
                </div>
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
            </div>
          </div>

          <div className="text-center mt-10">
            <a
              href="#more-faqs"
              className="inline-block bg-[#2B3B3A] text-[#DECEB0] px-8 py-3 rounded-full font-medium hover:bg-[#1a2a29] transition-colors duration-300"
            >
              View More FAQs
            </a>
          </div>
        </div>
      </section>

      {/* Loading Spinner */}
      {loading && (
        <div className="spinner fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"></div>
      )}
    </div>
  );
};
export default Home;