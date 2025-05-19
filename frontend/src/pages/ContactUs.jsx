import React, { useState } from "react";
import axios from "axios";
import { Mail, Phone, MapPin, Send, Loader2 } from "lucide-react";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/contact-us", formData);
      setSubmitted(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Error submitting contact form:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8] relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 30%, rgba(222, 206, 176, 0.2) 0%, transparent 50%),
              radial-gradient(circle at 80% 70%, rgba(222, 206, 176, 0.2) 0%, transparent 40%)
            `,
          }}
        ></div>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              repeating-linear-gradient(135deg, rgba(222, 206, 176, 0.1) 0px, rgba(222, 206, 176, 0.1) 1px, transparent 1px, transparent 15px),
              repeating-linear-gradient(45deg, rgba(222, 206, 176, 0.05) 0px, rgba(222, 206, 176, 0.05) 1px, transparent 1px, transparent 15px)
            `,
          }}
        ></div>
      </div>

      {/* Hero Section */}
      <div className="relative h-72 bg-[#2B3B3A] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#2B3B3A] to-black opacity-90"></div>
        <div className="absolute inset-0 flex items-center px-8 lg:px-16">
          <div className="z-10 max-w-7xl mx-auto w-full">
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Contact <span className="text-[#DECEB0]">LegalAid</span>
            </h1>
            <p className="text-gray-200 text-xl max-w-2xl">
              We're here to help you navigate your legal journey. Reach out and let's discuss your needs.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-12 lg:py-16">
        {/* Page Title */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-[#2B3B3A] mb-4">Get In Touch With Us</h1>
          <p className="text-gray-700 text-lg max-w-2xl mx-auto">
            We're here to help you navigate your legal journey. Reach out and let's discuss your needs.
          </p>
        </div>

        {/* Contact Layout */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Left Side - Contact Info */}
          <div className="bg-[#DECEB0] p-8 md:p-12 rounded-xl border border-[#DECEB0]/40 shadow-xl">
            <h2 className="text-3xl font-bold mb-10 text-[#2B3B3A]">Contact Information</h2>
            
            <div className="space-y-8 mb-12">
              <div className="flex items-start space-x-6">
                <div className="bg-[#DECEB0]/20 p-4 rounded-full">
                  <Phone className="text-[#2B3B3A] w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-1 text-[#2B3B3A]">Phone Number</h3>
                  <p className="text-lg text-gray-700">+(962) 7 93 93 93 52</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-6">
                <div className="bg-[#DECEB0]/20 p-4 rounded-full">
                  <Mail className="text-[#2B3B3A] w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-1 text-[#2B3B3A]">Email Address</h3>
                  <p className="text-lg text-gray-700">Aid@LegalAid.com</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-6">
                <div className="bg-[#DECEB0]/20 p-4 rounded-full">
                  <MapPin className="text-[#2B3B3A] w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-1 text-[#2B3B3A]">Office Location</h3>
                  <p className="text-lg text-gray-700">Jordan, Amman, Daboug</p>
                </div>
              </div>
            </div>
            
            {/* Office Hours */}
            <div>
              <h3 className="text-2xl font-semibold mb-4 text-[#2B3B3A]">Office Hours</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-700">sunday - Thursday</span>
                  <span className="text-[#2B3B3A] font-medium">9:00 AM - 5:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Saturday</span>
                  <span className="text-[#2B3B3A] font-medium">10:00 AM - 2:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Friday</span>
                  <span className="text-[#2B3B3A] font-medium">Closed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Contact Form */}
          <div className="bg-white p-8 md:p-12 rounded-xl shadow-xl">
            <h2 className="text-3xl font-bold mb-8 text-[#2B3B3A]">Send a Message</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-b-2 border-gray-300 focus:border-[#DECEB0] outline-none transition-colors duration-300 text-[#2B3B3A]"
                  placeholder="Full Name"
                />
              </div>
    
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-b-2 border-gray-300 focus:border-[#DECEB0] outline-none transition-colors duration-300 text-[#2B3B3A]"
                  placeholder="Email Address"
                />
              </div>
    
              <div className="relative">
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-b-2 border-gray-300 focus:border-[#DECEB0] outline-none transition-colors duration-300 text-[#2B3B3A]"
                  placeholder="Phone Number"
                />
              </div>
    
              <div className="relative">
                <select
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-b-2 border-gray-300 focus:border-[#DECEB0] outline-none transition-colors duration-300 appearance-none bg-white text-[#2B3B3A]"
                >
                  <option value="">Select a subject</option>
                  <option value="consultation">Consultation</option>
                  <option value="appointment">Appointment</option>
                  <option value="question">Question</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
    
              <div className="relative">
                <textarea
                  id="message"
                  name="message"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  className="w-full px-4 py-3 border-b-2 border-gray-300 focus:border-[#DECEB0] outline-none transition-colors duration-300 resize-none text-[#2B3B3A]"
                  placeholder="Your Message"
                ></textarea>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#2B3B3A] text-[#DECEB0] py-4 rounded-full hover:bg-[#DECEB0] hover:text-[#2B3B3A] transition-colors duration-300 flex items-center justify-center space-x-3 group"
              >
                {loading ? (
                  <Loader2 className="animate-spin h-6 w-6" />
                ) : (
                  <>
                    <Send className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>

            {submitted && (
              <div className="mt-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg text-center">
                Thank you! Your message has been submitted.
              </div>
            )}
          </div>
        </div>
      </div>

     
    </div>
  );
};

export default ContactUs;