import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { useNavigate, Routes, Route, Outlet } from "react-router-dom";
import Swal from "sweetalert2";
import LawyerSidebar from "../components/LawyerSidebar";
import Loader from "../shared/Loader";

const LawyerDashboard = () => {
  const { authData } = useAuth();
  const navigate = useNavigate();
  const [lawyerData, setLawyerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [previewUrl, setPreviewUrl] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showEnlargedImage, setShowEnlargedImage] = useState(false);

  useEffect(() => {
    if (!authData || authData.role !== "lawyer") {
      navigate("/");
      return;
    }
    if (authData.userId) {
      fetchLawyerData();
    }
  }, [authData, navigate]);

  const fetchLawyerData = async () => {
    if (!authData?.userId) {
      console.error("No user ID available");
      return;
    }
    try {
      const response = await axios.get(
        `http://localhost:5000/api/lawyer-applications/user/${authData.userId}`,
        {
          headers: {
            Authorization: `Bearer ${authData.token}`,
          },
        }
      );
      setLawyerData(response.data);
      setPreviewUrl(response.data.personalPic ? `http://localhost:5000/uploads/${response.data.personalPic}` : "");
      setLoading(false);
    } catch (error) {
      console.error("Error fetching lawyer data:", error);
      if (error.response?.status === 403) {
        Swal.fire({
          icon: "warning",
          title: "Access Denied",
          text: "You don't have permission to access the lawyer dashboard. Please make sure your application has been approved.",
          confirmButtonColor: "#2B3B3A"
        }).then(() => {
          navigate("/");
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response?.data?.message || "Failed to fetch lawyer data. Please try again later.",
          confirmButtonColor: "#2B3B3A"
        });
      }
      setLoading(false);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append("personalPic", file);

      try {
        const response = await axios.put(
          `http://localhost:5000/api/lawyer-applications/user/${authData.userId}/personal-pic`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${authData.token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        setLawyerData(response.data);
        setPreviewUrl(`http://localhost:5000/uploads/${response.data.personalPic}`);
        setShowModal(false);

        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Profile picture updated successfully!",
        });
      } catch (error) {
        console.error("Error uploading image:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response?.data?.message || "Failed to upload image. Please try again later.",
        });
      }
    }
  };

  const handleImageClick = () => {
    setShowModal(true);
  };

  const handleViewImage = () => {
    setShowEnlargedImage(true);
    setShowModal(false);
  };

  if (loading) {
    return <Loader />;
  }

  if (!lawyerData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#2B3B3A] to-[#1A2A29]">
        <div className="flex">
          <LawyerSidebar />
          <div className="ml-64 flex-1 p-6">
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <h2 className="text-2xl font-bold text-[#2B3B3A] mb-4">No Lawyer Data Found</h2>
              <p className="text-gray-600">Please submit a lawyer application to view your dashboard.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2B3B3A] to-[#1A2A29]">
      <div className="flex">
        <LawyerSidebar />
        <div className="ml-64 flex-1 p-6">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Header Section */}
            <div className="bg-[#2B3B3A] p-6 text-white">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <img
                    src={previewUrl || "https://via.placeholder.com/150"}
                    alt="Profile"
                    className="h-20 w-20 rounded-full object-cover border-4 border-[#DECEB0] cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={handleImageClick}
                  />
                  <input
                    id="profile-pic"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{authData.name}</h1>
                  <p className="text-[#DECEB0]">Bar Number: {lawyerData.barNumber}</p>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Experience & Specialization */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="text-lg font-semibold text-[#2B3B3A] mb-4">Professional Information</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-500">Years of Experience</p>
                        <p className="text-lg font-medium text-[#2B3B3A]">{lawyerData.yearsOfExperience} years</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Specialization</p>
                        <p className="text-lg font-medium text-[#2B3B3A]">{lawyerData.specialization}</p>
                      </div>
                    </div>
                  </div>

                  {/* Rates */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="text-lg font-semibold text-[#2B3B3A] mb-4">Consultation Rates</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <p className="text-sm text-gray-500">Hourly Rate</p>
                        <p className="text-xl font-bold text-[#2B3B3A]">${lawyerData.hourlyRate}</p>
                      </div>
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <p className="text-sm text-gray-500">Half-Hour Rate</p>
                        <p className="text-xl font-bold text-[#2B3B3A]">${lawyerData.halfHourlyRate}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* About */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="text-lg font-semibold text-[#2B3B3A] mb-4">About</h3>
                    <p className="text-gray-700 whitespace-pre-wrap">{lawyerData.about}</p>
                  </div>

                  {/* Certification */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="text-lg font-semibold text-[#2B3B3A] mb-4">Certification</h3>
                    {lawyerData.certificationPic ? (
                      <img
                        src={`http://localhost:5000/uploads/${lawyerData.certificationPic}`}
                        alt="Certification"
                        className="w-full rounded-lg shadow-md cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => setShowEnlargedImage(`http://localhost:5000/uploads/${lawyerData.certificationPic}`)}
                      />
                    ) : (
                      <p className="text-gray-500">No certification image available</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Options Modal */}
      {showModal && (
        <div className="fixed inset-0 backdrop-blur-md bg-white/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-80 shadow-xl">
            <h3 className="text-lg font-semibold text-[#2B3B3A] mb-4">Profile Picture Options</h3>
            <div className="space-y-3">
              <button
                onClick={() => document.getElementById('profile-pic').click()}
                className="w-full bg-[#2B3B3A] text-[#DECEB0] px-4 py-2 rounded-lg hover:bg-[#3a4b4a] transition-colors"
              >
                Change Picture
              </button>
              <button
                onClick={handleViewImage}
                className="w-full bg-[#DECEB0] text-[#2B3B3A] px-4 py-2 rounded-lg hover:bg-[#c5b99d] transition-colors"
              >
                View Picture
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enlarged Image Modal */}
      {showEnlargedImage && (
        <div className="fixed inset-0 backdrop-blur-md bg-white/30 flex items-center justify-center z-50">
          <div className="relative">
            <button
              onClick={() => setShowEnlargedImage(false)}
              className="absolute top-2 right-2 text-[#2B3B3A] hover:text-[#1a2a29]"
            >
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img
              src={typeof showEnlargedImage === 'string' ? showEnlargedImage : previewUrl}
              alt="Enlarged"
              className="max-h-[90vh] max-w-full rounded-lg shadow-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default LawyerDashboard; 