import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <div className="relative h-72 bg-[#2B3B3A] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#2B3B3A] to-black opacity-90"></div>
        <div className="absolute inset-0 flex items-center px-8 lg:px-16">
          <div className="z-10 max-w-7xl mx-auto w-full">
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              About <span className="text-[#DECEB0]">LegalAid</span>
            </h1>
            <p className="text-gray-200 text-xl max-w-2xl">
              Bridging the gap between legal expertise and those in need
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column - Mission & Vision */}
          <div className="lg:col-span-2 space-y-8">
            {/* Mission Section */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-[#2B3B3A] px-6 py-4">
                <h2 className="text-xl font-bold text-[#DECEB0]">
                  Our Mission
                </h2>
              </div>
              <div className="p-6">
                <p className="text-gray-700 leading-relaxed">
                  LegalAid is dedicated to making legal services accessible to everyone. 
                  We believe that quality legal representation should not be a privilege 
                  but a fundamental right. Our platform connects individuals with experienced 
                  legal professionals, ensuring that everyone has access to the legal 
                  support they need, when they need it.
                </p>
              </div>
            </div>

            {/* Vision Section */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-[#2B3B3A] px-6 py-4">
                <h2 className="text-xl font-bold text-[#DECEB0]">
                  Our Vision
                </h2>
              </div>
              <div className="p-6">
                <p className="text-gray-700 leading-relaxed">
                  We envision a world where legal services are transparent, affordable, 
                  and accessible to all. Through innovative technology and a commitment 
                  to excellence, we're transforming the way people connect with legal 
                  professionals, making the legal system more approachable and 
                  understandable for everyone.
                </p>
              </div>
            </div>

            {/* Values Section */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-[#2B3B3A] px-6 py-4">
                <h2 className="text-xl font-bold text-[#DECEB0]">
                  Our Core Values
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 bg-[#DECEB0] rounded-lg flex items-center justify-center">
                        <svg className="h-6 w-6 text-[#2B3B3A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-[#2B3B3A]">Integrity</h3>
                      <p className="text-gray-600">We uphold the highest standards of honesty and ethical conduct in all our interactions.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 bg-[#DECEB0] rounded-lg flex items-center justify-center">
                        <svg className="h-6 w-6 text-[#2B3B3A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-[#2B3B3A]">Accessibility</h3>
                      <p className="text-gray-600">We strive to make legal services available to everyone, regardless of their background or circumstances.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 bg-[#DECEB0] rounded-lg flex items-center justify-center">
                        <svg className="h-6 w-6 text-[#2B3B3A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-[#2B3B3A]">Innovation</h3>
                      <p className="text-gray-600">We continuously seek new ways to improve and simplify the legal consultation process.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Quick Facts */}
          <div className="lg:col-span-1 space-y-8">
            {/* Quick Facts */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-[#2B3B3A] px-6 py-4">
                <h2 className="text-xl font-bold text-[#DECEB0]">
                  Quick Facts
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 bg-[#DECEB0] rounded-full flex items-center justify-center">
                      <span className="text-[#2B3B3A] font-bold">1</span>
                    </div>
                    <p className="text-gray-700">Founded in 2024</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 bg-[#DECEB0] rounded-full flex items-center justify-center">
                      <span className="text-[#2B3B3A] font-bold">2</span>
                    </div>
                    <p className="text-gray-700">100+ Verified Lawyers</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 bg-[#DECEB0] rounded-full flex items-center justify-center">
                      <span className="text-[#2B3B3A] font-bold">3</span>
                    </div>
                    <p className="text-gray-700">24/7 Legal Support</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 bg-[#DECEB0] rounded-full flex items-center justify-center">
                      <span className="text-[#2B3B3A] font-bold">4</span>
                    </div>
                    <p className="text-gray-700">Multiple Legal Specializations</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-[#2B3B3A] px-6 py-4">
                <h2 className="text-xl font-bold text-[#DECEB0]">
                  Get Started
                </h2>
              </div>
              <div className="p-6">
                <p className="text-gray-700 mb-4">
                  Ready to find the legal help you need?
                </p>
                <Link
                  to="/booking"
                  className="block w-full bg-[#2B3B3A] text-[#DECEB0] px-6 py-3 rounded-lg text-center font-semibold hover:bg-[#1a2a29] transition-colors"
                >
                  Book a Consultation
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;