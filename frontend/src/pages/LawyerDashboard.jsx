import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { useNavigate, Routes, Route, Outlet } from "react-router-dom";
import Swal from "sweetalert2";
import LawyerSidebar from "../components/LawyerSidebar";
import Loader from "../shared/Loader";
import LawyerReviews from "../components/LawyerReviews";
import LawyerStatistics from "../components/LawyerStatistics";

const LawyerDashboard = () => {
  const { authData } = useAuth();
  const navigate = useNavigate();
  const [lawyerData, setLawyerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [previewUrl, setPreviewUrl] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showEnlargedImage, setShowEnlargedImage] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

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
      <div className="min-h-screen bg-[#F5F0E6]">
        <div className="flex">
          <LawyerSidebar />
          <div className="ml-64 flex-1 p-6">
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <h2 className="text-2xl font-bold text-[#3A4B4A] mb-4">No Lawyer Data Found</h2>
              <p className="text-gray-600">Please submit a lawyer application to view your dashboard.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F0E6]">
      <div className="flex">
        {/* Sidebar: hidden on mobile, visible on md+ */}
        <div className="hidden md:block">
          <LawyerSidebar />
        </div>
        {/* Mobile sidebar toggle button */}
        <div className="md:hidden fixed top-4 left-4 z-50">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="p-2 rounded bg-[#3A4B4A] text-[#E8D8B0] shadow-lg focus:outline-none"
            aria-label="Open sidebar"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        {/* Mobile Sidebar Overlay */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-50 flex">
            {/* Overlay background */}
            <div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setMobileSidebarOpen(false)}
            />
            {/* Sidebar drawer */}
            <div className="relative w-64 max-w-full h-full bg-[#3A4B4A] shadow-xl z-50 animate-slideInLeft">
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-[#E8D8B0] text-[#3A4B4A] focus:outline-none"
                aria-label="Close sidebar"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="h-full overflow-y-auto pt-12">
                <LawyerSidebar />
              </div>
            </div>
          </div>
        )}
        {/* Main content: full width on mobile, margin on md+ */}
        <div className="flex-1 w-full md:ml-64 p-2 sm:p-4 md:p-6">
          <Routes>
            <Route path="/" element={<Outlet />} />
            <Route path="reviews" element={<LawyerReviews />} />
            <Route path="statistics" element={<LawyerStatistics />} />
          </Routes>
          {/* Only show the profile section if not on statistics page */}
          {!location.pathname.includes('/reviews') && !location.pathname.includes('/statistics') && (
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Header Section */}
              <div className="bg-[#3A4B4A] p-4 sm:p-6 text-white">
                <div className="flex flex-col sm:flex-row items-center sm:space-x-4 space-y-4 sm:space-y-0">
                  <div className="relative group">
                    <div 
                      className="relative h-20 w-20 rounded-full overflow-hidden cursor-pointer"
                      onClick={handleImageClick}
                      onMouseEnter={() => setIsHovered(true)}
                      onMouseLeave={() => setIsHovered(false)}
                    >
                      <img
                        src={previewUrl || "https://via.placeholder.com/150"}
                        alt="Profile"
                        className="h-full w-full object-cover border-4 border-[#E8D8B0] transition-transform duration-300 group-hover:scale-110"
                      />
                      {isHovered && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <input
                      id="profile-pic"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </div>
                  <div className="text-center sm:text-left">
                    <h1 className="text-2xl font-bold">{authData.name}</h1>
                    <p className="text-[#E8D8B0]">Bar Number: {lawyerData.barNumber}</p>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="p-4 sm:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-6">
                    {/* Experience & Specialization */}
                    <div className="bg-[#F5F0E6] rounded-xl p-4 border border-[#E8D8B0]/20">
                      <h3 className="text-lg font-semibold text-[#3A4B4A] mb-4">Professional Information</h3>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-500">Years of Experience</p>
                          <p className="text-lg font-medium text-[#3A4B4A]">{lawyerData.yearsOfExperience} years</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Specialization</p>
                          <p className="text-lg font-medium text-[#3A4B4A]">{lawyerData.specialization}</p>
                        </div>
                      </div>
                    </div>

                    {/* Rates */}
                    <div className="bg-[#F5F0E6] rounded-xl p-4 border border-[#E8D8B0]/20">
                      <h3 className="text-lg font-semibold text-[#3A4B4A] mb-4">Consultation Rates</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white rounded-lg p-4 shadow-sm">
                          <p className="text-sm text-gray-500">Hourly Rate</p>
                          <p className="text-xl font-bold text-[#3A4B4A]">${lawyerData.hourlyRate}</p>
                        </div>
                        <div className="bg-white rounded-lg p-4 shadow-sm">
                          <p className="text-sm text-gray-500">Half-Hour Rate</p>
                          <p className="text-xl font-bold text-[#3A4B4A]">${lawyerData.halfHourlyRate}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    {/* About */}
                    <div className="bg-[#F5F0E6] rounded-xl p-4 border border-[#E8D8B0]/20">
                      <h3 className="text-lg font-semibold text-[#3A4B4A] mb-4">About</h3>
                      <p className="text-gray-700 whitespace-pre-wrap">{lawyerData.about}</p>
                    </div>

                    {/* Certification */}
                    <div className="bg-[#F5F0E6] rounded-xl p-4 border border-[#E8D8B0]/20">
                      <h3 className="text-lg font-semibold text-[#3A4B4A] mb-4">Certification</h3>
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
          )}
        </div>
      </div>

      {/* Options Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-full mx-2">
            <h2 className="text-xl font-bold text-[#3A4B4A] mb-4">Profile Picture Options</h2>
            <div className="space-y-4">
              <button
                onClick={() => document.getElementById('profile-pic').click()}
                className="w-full bg-[#3A4B4A] text-[#E8D8B0] py-2 px-4 rounded hover:bg-[#4A5B5A] transition-colors flex items-center justify-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Change Picture</span>
              </button>
              <button
                onClick={handleViewImage}
                className="w-full bg-[#E8D8B0] text-[#3A4B4A] py-2 px-4 rounded hover:bg-[#DECEB0] transition-colors flex items-center justify-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span>View Picture</span>
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded hover:bg-gray-300 transition-colors"
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
          <div className="relative max-w-4xl w-full mx-4">
            <button
              onClick={() => setShowEnlargedImage(false)}
              className="absolute top-2 right-2 text-[#3A4B4A] hover:text-[#4A5B5A] bg-white rounded-full p-2 shadow-lg"
            >
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img
              src={typeof showEnlargedImage === 'string' ? showEnlargedImage : previewUrl}
              alt="Enlarged"
              className="w-full h-auto rounded-lg shadow-xl object-contain max-h-[90vh]"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default LawyerDashboard; 