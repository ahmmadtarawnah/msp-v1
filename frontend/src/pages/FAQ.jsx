import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

// Custom Logo Component with animation
const LegalAidLogo = ({
  size = "normal",
  color = "#DECEB0",
  hoverColor = "#ffffff",
}) => {
  const [isHovered, setIsHovered] = React.useState(false);

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
      </svg>
    </motion.div>
  );
};

const FAQ = () => {
  const faqs = [
    {
      question: "How do I know if I need legal representation?",
      answer: "If you're facing a legal issue that could significantly impact your finances, freedom, rights, or property, it's advisable to seek legal representation. During a free initial consultation, our attorneys can assess your situation and advise whether professional legal assistance would benefit your case."
    },
    {
      question: "What should I bring to my first consultation?",
      answer: "For your initial consultation, bring any documents relevant to your case, such as contracts, correspondence, police reports, medical records, or court notices. Also prepare a timeline of events and a list of questions you'd like to ask. This preparation helps us provide the most accurate assessment of your situation."
    },
    {
      question: "How are your legal fees structured?",
      answer: "Our fee structures vary depending on the type of case. We offer hourly rates, flat fees for specific services, contingency arrangements for personal injury cases, and retainer agreements for ongoing representation. During your consultation, we'll discuss the most appropriate fee arrangement for your specific situation and provide full transparency about costs."
    },
    {
      question: "How long will my case take to resolve?",
      answer: "Case timelines vary significantly depending on complexity, court schedules, opposing parties, and the specific legal issues involved. Some matters can be resolved in weeks, while others may take months or even years. We strive to resolve your case as efficiently as possible while still achieving the best outcome, and we'll provide regular updates on progress and expected timelines."
    },
    {
      question: "What areas of law do you specialize in?",
      answer: "We specialize in various areas of law including family law, criminal defense, personal injury, corporate law, real estate, immigration, and more. Our team of experienced attorneys has expertise across multiple practice areas to provide comprehensive legal solutions."
    },
    {
      question: "Do you offer payment plans?",
      answer: "Yes, we understand that legal services can be a significant investment. We offer flexible payment plans and various fee arrangements to accommodate different financial situations. During your consultation, we'll discuss payment options that work best for you."
    },
    {
      question: "What is your success rate?",
      answer: "While we can't guarantee specific outcomes, we have a strong track record of successful case resolutions. Our success is measured not just by wins, but by achieving the best possible outcomes for our clients while maintaining the highest ethical standards."
    },
    {
      question: "How do I schedule a consultation?",
      answer: "You can schedule a consultation through our website's booking system, by calling our office, or by sending us an email. We offer both in-person and virtual consultations to accommodate your needs and location."
    },
    {
      question: "What happens during the initial consultation?",
      answer: "During the initial consultation, we'll discuss your legal issue in detail, review any relevant documents, explain the legal process, and outline potential strategies. This is also an opportunity for you to ask questions and determine if we're the right fit for your needs."
    },
    {
      question: "Do you handle cases outside your local area?",
      answer: "Yes, we handle cases across multiple jurisdictions. While we're primarily based in our local area, we have the capability to represent clients in various locations and can coordinate with local counsel when necessary."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-72 bg-[#2B3B3A] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#2B3B3A] to-black opacity-90"></div>
        <div className="absolute inset-0 flex items-center px-8 lg:px-16">
          <div className="z-10 max-w-7xl mx-auto w-full">
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Frequently Asked <span className="text-[#DECEB0]">Questions</span>
            </h1>
            <p className="text-gray-200 text-xl max-w-2xl">
              Find answers to common questions about our legal services and processes
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <motion.div 
              key={index}
              className="mb-8 border-b border-gray-200 pb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-bold text-[#2B3B3A] mb-4 flex items-center">
                <motion.div 
                  className="w-8 h-8 bg-[#2B3B3A] rounded-full flex items-center justify-center mr-3 flex-shrink-0"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <LegalAidLogo size="small" />
                </motion.div>
                {faq.question}
              </h3>
              <div className="pl-11">
                <p className="text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contact Section */}
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl font-bold text-[#2B3B3A] mb-4">
            Still have questions?
          </h2>
          <p className="text-gray-600 mb-8">
            Contact us directly and we'll be happy to help
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/contact"
              className="inline-block bg-[#2B3B3A] text-[#DECEB0] px-8 py-3 rounded-full font-medium hover:bg-[#1a2a29] transition-colors duration-300"
            >
              Contact Us
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default FAQ; 