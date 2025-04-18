import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const BecomeAlawyer = () => {
  const { authData, isLoading } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    barNumber: "",
    yearsOfExperience: "",
    specialization: "",
  });
  const [certificationPic, setCertificationPic] = useState(null);
  const [personalPic, setPersonalPic] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLoading && !authData) {
      Swal.fire({
        title: "Authentication Required",
        text: "Please log in to submit a lawyer application",
        icon: "warning",
        confirmButtonColor: "#2B3B3A"
      }).then(() => {
        navigate("/Login");
      });
    }
  }, [authData, isLoading, navigate]);

  const specializations = [
    "Corporate Law",
    "Criminal Law",
    "Family Law",
    "Intellectual Property",
    "Real Estate",
    "Tax Law",
    "Immigration Law",
    "Personal Injury",
    "Employment Law"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (type === "certification") {
        setCertificationPic(file);
      } else {
        setPersonalPic(file);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!authData?.userId) {
        throw new Error("User not authenticated");
      }

      const formDataToSend = new FormData();
      formDataToSend.append("userId", authData.userId);
      formDataToSend.append("barNumber", formData.barNumber);
      formDataToSend.append("yearsOfExperience", formData.yearsOfExperience);
      formDataToSend.append("specialization", formData.specialization);
      
      if (certificationPic) {
        formDataToSend.append("certificationPic", certificationPic);
      }
      
      if (personalPic) {
        formDataToSend.append("personalPic", personalPic);
      }

      const response = await axios.post(
        "http://localhost:5000/api/lawyer-applications/submit",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${authData.token}`
          }
        }
      );

      Swal.fire({
        title: "Success!",
        text: "Your application has been submitted successfully. The admin will review it soon.",
        icon: "success",
        confirmButtonColor: "#2B3B3A"
      }).then(() => {
        // Redirect to admin dashboard if the user is an admin
        if (authData.role === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/");
        }
      });
    } catch (error) {
      console.error("Error submitting application:", error);
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.message || error.message || "Failed to submit application. Please try again.",
        icon: "error",
        confirmButtonColor: "#2B3B3A"
      });
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2B3B3A]"></div>
      </div>
    );
  }

  if (!authData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="px-6 py-8">
            <h2 className="text-3xl font-bold text-center text-[#2B3B3A] mb-8">
              Become a Lawyer
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Bar Number */}
              <div>
                <label htmlFor="barNumber" className="block text-sm font-medium text-gray-700">
                  Bar Number
                </label>
                <input
                  type="text"
                  id="barNumber"
                  name="barNumber"
                  value={formData.barNumber}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#DECEB0] focus:ring-[#DECEB0] sm:text-sm"
                />
              </div>

              {/* Years of Experience */}
              <div>
                <label htmlFor="yearsOfExperience" className="block text-sm font-medium text-gray-700">
                  Years of Experience
                </label>
                <input
                  type="number"
                  id="yearsOfExperience"
                  name="yearsOfExperience"
                  value={formData.yearsOfExperience}
                  onChange={handleChange}
                  required
                  min="0"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#DECEB0] focus:ring-[#DECEB0] sm:text-sm"
                />
              </div>

              {/* Specialization */}
              <div>
                <label htmlFor="specialization" className="block text-sm font-medium text-gray-700">
                  Specialization
                </label>
                <select
                  id="specialization"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#DECEB0] focus:ring-[#DECEB0] sm:text-sm"
                >
                  <option value="">Select a specialization</option>
                  {specializations.map((spec) => (
                    <option key={spec} value={spec}>
                      {spec}
                    </option>
                  ))}
                </select>
              </div>

              {/* Certification Picture */}
              <div>
                <label htmlFor="certificationPic" className="block text-sm font-medium text-gray-700">
                  Certification Picture
                </label>
                <input
                  type="file"
                  id="certificationPic"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "certification")}
                  required
                  className="mt-1 block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-[#DECEB0] file:text-[#2B3B3A]
                    hover:file:bg-[#d0c09f]"
                />
              </div>

              {/* Personal Picture */}
              <div>
                <label htmlFor="personalPic" className="block text-sm font-medium text-gray-700">
                  Personal Picture
                </label>
                <input
                  type="file"
                  id="personalPic"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "personal")}
                  required
                  className="mt-1 block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-[#DECEB0] file:text-[#2B3B3A]
                    hover:file:bg-[#d0c09f]"
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-[#2B3B3A] hover:bg-[#1a2a29] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#DECEB0] disabled:opacity-50"
                >
                  {loading ? "Submitting..." : "Submit Application"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BecomeAlawyer; 