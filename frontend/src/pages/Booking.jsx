import React, { useState } from "react";
import MP4 from "../assets/law2.mp4";
const Booking = () => {
  // State for the selected consultation type
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Updated consultation types
  const consultationTypes = [
    {
      id: "corporate",
      title: "Corporate Law",
      description:
        "Expert advice on business formation, mergers, acquisitions, corporate governance, and regulatory compliance.",
    },
    {
      id: "criminal",
      title: "Criminal Law",
      description:
        "Guidance on criminal charges, defense strategies, plea bargains, and representation in criminal proceedings.",
    },
    {
      id: "family",
      title: "Family Law",
      description:
        "Assistance with divorce, child custody, adoption, spousal support, and other domestic legal matters.",
    },
    {
      id: "intellectual-property",
      title: "Intellectual Property",
      description:
        "Protection for your inventions, creative works, trademarks, and trade secrets through patents, copyrights, and more.",
    },
    {
      id: "real-estate",
      title: "Real Estate",
      description:
        "Legal advice on property transactions, leasing, zoning issues, landlord-tenant disputes, and property rights.",
    },
    {
      id: "tax",
      title: "Tax Law",
      description:
        "Guidance on tax planning, compliance, audits, disputes with tax authorities, and minimizing tax liability.",
    },
    {
      id: "immigration",
      title: "Immigration Law",
      description:
        "Assistance with visas, green cards, citizenship applications, deportation defense, and immigration compliance.",
    },
    {
      id: "personal-injury",
      title: "Personal Injury",
      description:
        "Representation for accidents, medical malpractice, product liability, and seeking fair compensation for injuries.",
    },
    {
      id: "employment",
      title: "Employment Law",
      description:
        "Guidance on workplace issues including discrimination, harassment, wrongful termination, and employment contracts.",
    },
  ];

  const handleConsultationSelect = (id) => {
    setSelectedConsultation(id);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically handle form submission logic
    setFormSubmitted(true);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Updated Hero Section with Video Background */}
      <div className="relative h-96 md:h-[500px] overflow-hidden">
        {/* Video background */}
        <video
          className="absolute w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src={MP4} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Dark overlay for opacity */}
        <div className="absolute inset-0 bg-[#2B3B3A] opacity-65"></div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center items-center text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Expert Legal <span className="text-[#DECEB0]">Consultation</span>
          </h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto mb-8">
            Connect with experienced attorneys who can provide personalized
            guidance for your specific legal concerns.
          </p>
          <div className="flex justify-center space-x-4 mt-2">
            <div className="flex items-center text-sm md:text-base text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-[#DECEB0]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Confidential Consultations</span>
            </div>
            <div className="flex items-center text-sm md:text-base text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-[#DECEB0]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Flexible Scheduling</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {formSubmitted ? (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-[#DECEB0] rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-[#2B3B3A]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-[#2B3B3A] mb-4">
              Consultation Request Submitted!
            </h2>
            <p className="text-gray-600 mb-6">
              Thank you for booking a consultation with us. One of our
              representatives will contact you shortly to confirm your
              appointment.
            </p>
            <button
              onClick={() => setFormSubmitted(false)}
              className="bg-[#2B3B3A] text-[#DECEB0] font-bold py-3 px-8 rounded-md transition-all duration-300 hover:bg-[#1a2a29]"
            >
              Book Another Consultation
            </button>
          </div>
        ) : (
          <>
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold text-[#2B3B3A] mb-2">
                Select Your Consultation Type
              </h2>
              <p className="text-gray-600">
                Choose the type of legal consultation that best fits your needs
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Consultation Types Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {consultationTypes.map((type) => (
                  <div
                    key={type.id}
                    className={`bg-white rounded-lg shadow-md overflow-hidden border-2 transition-all duration-300 cursor-pointer ${
                      selectedConsultation === type.id
                        ? "border-[#DECEB0] transform scale-105"
                        : "border-transparent hover:border-gray-200"
                    }`}
                    onClick={() => handleConsultationSelect(type.id)}
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-bold text-[#2B3B3A]">
                          {type.title}
                        </h3>
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex-shrink-0 ${
                            selectedConsultation === type.id
                              ? "bg-[#DECEB0] border-[#DECEB0]"
                              : "border-gray-300"
                          }`}
                        >
                          {selectedConsultation === type.id && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-[#2B3B3A]"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                        </div>
                      </div>
                      <p className="text-gray-600 mb-4">{type.description}</p>
                      <div className="flex justify-between items-center text-sm font-medium"></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <div className="text-center">
                <button
                  type="submit"
                  disabled={!selectedConsultation}
                  className={`py-3 px-10 rounded-md font-bold text-lg transition-all duration-300 ${
                    selectedConsultation
                      ? "bg-[#DECEB0] hover:bg-[#c7b897] text-[#2B3B3A] shadow-md"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Continue to Scheduling
                </button>
                {!selectedConsultation && (
                  <p className="text-gray-500 mt-2 text-sm">
                    Please select a consultation type to continue
                  </p>
                )}
              </div>
            </form>
          </>
        )}
      </div>

      {/* Additional Information Section */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-[#2B3B3A] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-[#DECEB0]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-[#2B3B3A] mb-2">
                What to Expect
              </h3>
              <p className="text-gray-600">
                Your consultation will be conducted with one of our experienced
                attorneys specialized in your selected area of law.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-[#2B3B3A] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-[#DECEB0]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-[#2B3B3A] mb-2">
                Preparation
              </h3>
              <p className="text-gray-600">
                Bring any relevant documents to your consultation. The more
                information you provide, the better advice we can offer.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-[#2B3B3A] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-[#DECEB0]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-[#2B3B3A] mb-2">Payment</h3>
              <p className="text-gray-600">
                Payment is collected after your consultation is scheduled. We
                accept all major credit cards and electronic payments.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
