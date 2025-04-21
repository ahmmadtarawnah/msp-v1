import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';

const LawyerApplications = () => {
  const { authData } = useAuth();
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enlargedImage, setEnlargedImage] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/lawyer-applications",
        {
          headers: {
            Authorization: `Bearer ${authData.token}`
          }
        }
      );
      if (response.data && Array.isArray(response.data)) {
        setApplications(response.data);
      } else {
        setApplications([]);
        console.warn("Invalid applications data received:", response.data);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching applications:", error);
      setApplications([]);
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (applicationId, status) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/lawyer-applications/${applicationId}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${authData.token}`
          }
        }
      );

      // Refresh applications list
      fetchApplications();
      setSelectedApplication(null);

      // Show success message
      Swal.fire({
        icon: "success",
        title: "Success",
        text: `Application ${status} successfully!`,
      });
    } catch (error) {
      console.error("Error updating application status:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to update application status. Please try again.",
      });
    }
  };

  const handleDeleteApplication = async (applicationId) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "This will permanently delete the application and, if approved, will revoke the lawyer role from the user.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!'
      });

      if (result.isConfirmed) {
        await axios.delete(
          `http://localhost:5000/api/lawyer-applications/${applicationId}`,
          {
            headers: {
              Authorization: `Bearer ${authData.token}`
            }
          }
        );

        // Refresh applications list
        fetchApplications();
        setSelectedApplication(null);

        Swal.fire(
          'Deleted!',
          'The application has been deleted successfully.',
          'success'
        );
      }
    } catch (error) {
      console.error("Error deleting application:", error);
      Swal.fire(
        'Error!',
        'Failed to delete the application. Please try again.',
        'error'
      );
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("personalPic", file);

      try {
        const response = await axios.put(
          `http://localhost:5000/api/lawyer-applications/${selectedApplication._id}/personal-pic`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${authData.token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        // Update the application in the state
        setApplications(applications.map(app => 
          app._id === selectedApplication._id ? response.data : app
        ));
        setSelectedApplication(response.data);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2B3B3A]"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-md">
      <h2 className="text-2xl font-bold text-[#333] mb-6">Lawyer Applications</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Applicant
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {applications && applications.length > 0 ? (
              applications.map((application) => (
                <tr key={application._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                    {application.userId?.name || 'Unknown User'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      application.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : application.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                      {application.status?.charAt(0).toUpperCase() + application.status?.slice(1) || 'Unknown'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => setSelectedApplication(application)}
                      className="text-[#2B3B3A] hover:text-[#1a2a29]"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleDeleteApplication(application._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                  No applications found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Application Details Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              {/* Header with Close Button */}
              <div className="sticky top-0 bg-white z-10 rounded-t-2xl border-b border-gray-200">
                <div className="flex items-center justify-between px-6 py-4">
                  <h3 className="text-xl font-semibold text-[#2B3B3A]">
                    Application Details
                  </h3>
                  <button
                    onClick={() => setSelectedApplication(null)}
                    className="text-gray-400 hover:text-gray-500 transition-colors duration-200"
                  >
                    <span className="sr-only">Close</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Applicant Info Section */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center space-x-4">
                    {selectedApplication.personalPic ? (
                      <img
                        src={`http://localhost:5000/uploads/${selectedApplication.personalPic}`}
                        alt="Applicant"
                        className="h-16 w-16 rounded-full object-cover border-2 border-[#DECEB0] cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => setEnlargedImage(`http://localhost:5000/uploads/${selectedApplication.personalPic}`)}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/64?text=No+Image';
                        }}
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
                        <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    )}
                    <div>
                      <h4 className="text-lg font-medium text-[#2B3B3A]">
                        {selectedApplication.userId?.name || 'Unknown User'}
                      </h4>
                      <p className="text-sm text-gray-500">
                        Bar Number: {selectedApplication.barNumber || 'Not provided'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-6">
                    <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Experience & Specialization</h4>
                      <div className="space-y-2">
                        <p className="text-sm text-[#2B3B3A]">
                          <span className="font-medium">Years of Experience:</span> {selectedApplication.yearsOfExperience || 'Not provided'}
                        </p>
                        <p className="text-sm text-[#2B3B3A]">
                          <span className="font-medium">Specialization:</span> {selectedApplication.specialization || 'Not provided'}
                        </p>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Rates</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-xs text-gray-500">Hourly Rate</p>
                          <p className="text-lg font-semibold text-[#2B3B3A]">
                            ${selectedApplication.hourlyRate?.toFixed(2) || '0.00'}
                          </p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-xs text-gray-500">Half-Hour Rate</p>
                          <p className="text-lg font-semibold text-[#2B3B3A]">
                            ${selectedApplication.halfHourlyRate?.toFixed(2) || '0.00'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                      <h4 className="text-sm font-medium text-gray-500 mb-2">About</h4>
                      <p className="text-sm text-[#2B3B3A] whitespace-pre-wrap">
                        {selectedApplication.about || 'Not provided'}
                      </p>
                    </div>

                    <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Certification</h4>
                      {selectedApplication.certificationPic ? (
                        <div className="mt-2">
                          <img
                            src={`http://localhost:5000/uploads/${selectedApplication.certificationPic}`}
                            alt="Certification"
                            className="w-full rounded-lg shadow-md cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => setEnlargedImage(`http://localhost:5000/uploads/${selectedApplication.certificationPic}`)}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://via.placeholder.com/300x200?text=No+Image+Available';
                            }}
                          />
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No certification image provided</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer with Action Buttons */}
                {selectedApplication.status === "pending" && (
                  <div className="flex justify-end space-x-4 mt-6 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => handleStatusUpdate(selectedApplication._id, "rejected")}
                      className="px-6 py-2 border border-red-600 rounded-lg shadow-sm text-sm font-medium text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(selectedApplication._id, "approved")}
                      className="px-6 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#2B3B3A] hover:bg-[#1a2a29] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#DECEB0] transition-colors duration-200"
                    >
                      Approve
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enlarged Image Modal */}
      {enlargedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="relative">
            <button
              onClick={() => setEnlargedImage(null)}
              className="absolute top-2 right-2 text-white hover:text-gray-300"
            >
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img
              src={enlargedImage}
              alt="Enlarged"
              className="max-h-[90vh] max-w-full rounded-lg shadow-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default LawyerApplications; 