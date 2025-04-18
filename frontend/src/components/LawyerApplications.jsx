import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useAuth } from '../context/AuthContext';

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
      Swal.fire({
        title: "Error!",
        text: "Failed to fetch applications. Please try again.",
        icon: "error",
        confirmButtonColor: "#2B3B3A"
      });
    }
  };

  const handleStatusUpdate = async (applicationId, status) => {
    try {
      await axios.put(
        `http://localhost:5000/api/lawyer-applications/${applicationId}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${authData.token}`
          }
        }
      );

      // If the application is approved, update the user's role to lawyer
      if (status === "approved") {
        const application = applications.find(app => app._id === applicationId);
        if (application) {
          await axios.put(
            `http://localhost:5000/api/admin/users/${application.userId._id}/role`,
            { role: "lawyer" },
            {
              headers: {
                Authorization: `Bearer ${authData.token}`
              }
            }
          );
        }
      }

      Swal.fire({
        title: "Success!",
        text: `Application has been ${status} successfully.`,
        icon: "success",
        confirmButtonColor: "#2B3B3A"
      });

      // Refresh applications list
      fetchApplications();
      setSelectedApplication(null);
    } catch (error) {
      console.error("Error updating application status:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to update application status. Please try again.",
        icon: "error",
        confirmButtonColor: "#2B3B3A"
      });
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => setSelectedApplication(application)}
                      className="text-[#2B3B3A] hover:text-[#1a2a29]"
                    >
                      View Details
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
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex justify-between items-start sticky top-0 bg-white z-10">
                <h3 className="text-lg font-medium text-[#2B3B3A]">
                  Application Details
                </h3>
                <button
                  onClick={() => setSelectedApplication(null)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mt-4 space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Applicant</h4>
                  <p className="mt-1 text-sm text-[#2B3B3A]">
                    {selectedApplication.userId?.name || 'Unknown User'}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500">Bar Number</h4>
                  <p className="mt-1 text-sm text-[#2B3B3A]">
                    {selectedApplication.barNumber || 'Not provided'}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500">Years of Experience</h4>
                  <p className="mt-1 text-sm text-[#2B3B3A]">
                    {selectedApplication.yearsOfExperience || 'Not provided'}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500">Specialization</h4>
                  <p className="mt-1 text-sm text-[#2B3B3A]">
                    {selectedApplication.specialization || 'Not provided'}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500">Certification</h4>
                  {selectedApplication.certificationPic ? (
                    <div className="mt-2">
                      <img
                        src={`http://localhost:5000/uploads/${selectedApplication.certificationPic}`}
                        alt="Certification"
                        className="max-w-xs rounded-lg shadow-md cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => setEnlargedImage(`http://localhost:5000/uploads/${selectedApplication.certificationPic}`)}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/300x200?text=No+Image+Available';
                        }}
                      />
                    </div>
                  ) : (
                    <p className="mt-1 text-sm text-gray-500">No certification image provided</p>
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500">Personal Picture</h4>
                  {selectedApplication.personalPic ? (
                    <div className="mt-2">
                      <img
                        src={`http://localhost:5000/uploads/${selectedApplication.personalPic}`}
                        alt="Personal"
                        className="max-w-xs rounded-lg shadow-md cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => setEnlargedImage(`http://localhost:5000/uploads/${selectedApplication.personalPic}`)}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/300x200?text=No+Image+Available';
                        }}
                      />
                    </div>
                  ) : (
                    <p className="mt-1 text-sm text-gray-500">No personal picture provided</p>
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500">Submitted On</h4>
                  <p className="mt-1 text-sm text-[#2B3B3A]">
                    {selectedApplication.createdAt ? formatDate(selectedApplication.createdAt) : 'Unknown date'}
                  </p>
                </div>

                {selectedApplication.status === "pending" && (
                  <div className="flex justify-end space-x-4 mt-6">
                    <button
                      onClick={() => handleStatusUpdate(selectedApplication._id, "rejected")}
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(selectedApplication._id, "approved")}
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#2B3B3A] hover:bg-[#1a2a29] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#DECEB0]"
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