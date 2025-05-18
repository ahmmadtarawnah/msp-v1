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
      await axios.post("http://localhost:5000/api/contact", formData);
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
    <div className="min-h-screen bg-[#f5f5fa] flex items-center justify-center px-4 py-12 relative">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex relative z-10">
        {/* Left Side - Contact Information */}
        <div className="w-1/2 bg-[#2B3B3A] text-white p-12 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            {/* Updated geometric pattern */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `
                     radial-gradient(circle at 20% 30%, rgba(222, 206, 176, 0.1) 0%, transparent 50%),
                     radial-gradient(circle at 80% 70%, rgba(222, 206, 176, 0.1) 0%, transparent 40%)
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

          <div className="relative z-10">
            <h2 className="text-4xl font-bold mb-6 text-[#DECEB0] leading-tight">
              Get In <br />
              Touch With Us
            </h2>
            <p className="text-gray-300 mb-8 text-lg">
              We're here to help you navigate your legal journey. Reach out and
              let's discuss your needs.
            </p>

            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <Phone className="text-[#DECEB0] w-7 h-7" />
                <span className="text-xl">+(962) 7 93 93 93 52</span>
              </div>
              <div className="flex items-center space-x-4">
                <Mail className="text-[#DECEB0] w-7 h-7" />
                <span className="text-xl">Aid@LegalAid.com</span>
              </div>
              <div className="flex items-center space-x-4">
                <MapPin className="text-[#DECEB0] w-7 h-7" />
                <span className="text-xl">Jordan, Amman, Daboug</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Contact Form */}
        <div className="w-1/2 p-12 bg-white">
          <h2 className="text-4xl font-bold mb-8 text-[#2B3B3A]">
            Send a Message
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border-b-2 border-gray-300 focus:border-[#DECEB0] outline-none transition-colors duration-300"
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
                className="w-full px-4 py-3 border-b-2 border-gray-300 focus:border-[#DECEB0] outline-none transition-colors duration-300"
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
                className="w-full px-4 py-3 border-b-2 border-gray-300 focus:border-[#DECEB0] outline-none transition-colors duration-300"
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
                className="w-full px-4 py-3 border-b-2 border-gray-300 focus:border-[#DECEB0] outline-none transition-colors duration-300 appearance-none"
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
                rows="4"
                className="w-full px-4 py-3 border-b-2 border-gray-300 focus:border-[#DECEB0] outline-none transition-colors duration-300 resize-none"
                placeholder="Your Message"
              ></textarea>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2B3B3A] text-[#DECEB0] py-4 rounded-full hover:bg-[#1a2a29] transition-colors duration-300 flex items-center justify-center space-x-3 group"
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
  );
};

export default ContactUs;
