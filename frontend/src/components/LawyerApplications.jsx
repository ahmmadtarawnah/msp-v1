import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';
import { Search, ChevronLeft, ChevronRight, User, FileText, X, Check, Eye, Menu } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const LawyerApplications = () => {
  const { authData } = useAuth();
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enlargedImage, setEnlargedImage] = useState(null);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [applicationsPerPage] = useState(10);
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetchApplications();
    // eslint-disable-next-line
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
      setApplications(Array.isArray(response.data) ? response.data : []);
      setLoading(false);
    } catch (error) {
      setApplications([]);
      setLoading(false);
      setError("Failed to fetch applications.");
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
      fetchApplications();
      setSelectedApplication(null);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: `Application ${status} successfully!`,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to update application status. Please try again.",
      });
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Filter applications based on search term
  const filteredApplications = applications.filter(app =>
    app.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const indexOfLastApplication = currentPage * applicationsPerPage;
  const indexOfFirstApplication = indexOfLastApplication - applicationsPerPage;
  const currentApplications = filteredApplications.slice(indexOfFirstApplication, indexOfLastApplication);
  const totalPages = Math.ceil(filteredApplications.length / applicationsPerPage);

  const getStatusBadgeClasses = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-100 text-amber-800 border border-amber-200';
      case 'approved':
        return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  // Helper to close sidebar on mobile after navigation
  const handleNavClick = () => {
    if (window.innerWidth < 768) setIsMobileMenuOpen(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#2B3B3A]"></div>
          <p className="mt-4 text-[#2B3B3A] font-medium">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-2xl md:text-3xl font-bold text-[#2B3B3A]">
              Lawyer Applications
            </h1>
            <div className="w-full sm:w-auto mt-4 sm:mt-0">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by name or email"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B3B3A] focus:border-[#2B3B3A] sm:text-sm transition-all"
                />
              </div>
            </div>
          </div>
          {filteredApplications.length > 0 && (
            <p className="mt-2 text-sm text-gray-500">
              Found {filteredApplications.length} application{filteredApplications.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md shadow-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <X className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredApplications.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
            <User className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No applications found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? 'Try adjusting your search terms.' : 'There are currently no lawyer applications to review.'}
            </p>
          </div>
        )}

        {/* Applications List */}
        {filteredApplications.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Desktop View */}
            <div className="hidden md:block">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applicant
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submitted
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentApplications.map((application) => (
                    <tr key={application._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img
                              className="h-10 w-10 rounded-full object-cover border border-gray-200 shadow-sm"
                              src={application.personalPic ? `http://localhost:5000/uploads/${application.personalPic}` : '/placeholder-user.png'}
                              alt={application.userId?.name || 'Applicant'}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://via.placeholder.com/40?text=User';
                              }}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{application.userId?.name || 'Unknown User'}</div>
                            <div className="text-xs text-gray-500">{application.userId?.email || 'No email provided'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs font-medium rounded-full ${getStatusBadgeClasses(application.status)}`}>
                          {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(application.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-3">
                          <button
                            onClick={() => setSelectedApplication(application)}
                            className="text-indigo-600 hover:text-indigo-900 inline-flex items-center"
                          >
                            <Eye className="mr-1 h-4 w-4" />
                            <span>View</span>
                          </button>
                          {application.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleStatusUpdate(application._id, 'approved')}
                                className="text-emerald-600 hover:text-emerald-900 inline-flex items-center"
                              >
                                <Check className="mr-1 h-4 w-4" />
                                <span>Approve</span>
                              </button>
                              <button
                                onClick={() => handleStatusUpdate(application._id, 'rejected')}
                                className="text-red-600 hover:text-red-900 inline-flex items-center"
                              >
                                <X className="mr-1 h-4 w-4" />
                                <span>Reject</span>
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile View */}
            <div className="md:hidden">
              <ul className="divide-y divide-gray-200">
                {currentApplications.map((application) => (
                  <li key={application._id} className="px-4 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <img
                          className="h-10 w-10 rounded-full object-cover border border-gray-200 shadow-sm"
                          src={application.personalPic ? `http://localhost:5000/uploads/${application.personalPic}` : '/placeholder-user.png'}
                          alt={application.userId?.name || 'Applicant'}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/40?text=User';
                          }}
                        />
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{application.userId?.name || 'Unknown User'}</p>
                          <p className="text-xs text-gray-500">{formatDate(application.createdAt)}</p>
                        </div>
                      </div>
                      <span className={`px-2.5 py-0.5 inline-flex text-xs font-medium rounded-full ${getStatusBadgeClasses(application.status)}`}>
                        {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                      </span>
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                      <p className="text-xs text-gray-500 truncate">{application.userId?.email || 'No email provided'}</p>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedApplication(application)}
                          className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          <Eye className="mr-1 h-3 w-3" />
                          View
                        </button>
                        {application.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleStatusUpdate(application._id, 'approved')}
                              className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                            >
                              <Check className="mr-1 h-3 w-3" />
                              Approve
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(application._id, 'rejected')}
                              className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                              <X className="mr-1 h-3 w-3" />
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{indexOfFirstApplication + 1}</span> to{' '}
                      <span className="font-medium">{Math.min(indexOfLastApplication, filteredApplications.length)}</span> of{' '}
                      <span className="font-medium">{filteredApplications.length}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="sr-only">Previous</span>
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            currentPage === page
                              ? 'z-10 bg-[#2B3B3A] border-[#2B3B3A] text-white'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="sr-only">Next</span>
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Application Details Modal */}
        {selectedApplication && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="sticky top-0 bg-white z-10 border-b border-gray-200 rounded-t-2xl">
                <div className="flex items-center justify-between px-6 py-4">
                  <h3 className="text-xl font-semibold text-[#2B3B3A] flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Application Details
                  </h3>
                  <button
                    onClick={() => setSelectedApplication(null)}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 rounded-full p-1"
                  >
                    <span className="sr-only">Close</span>
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                {/* Applicant Header */}
                <div className="bg-gray-50 rounded-xl p-6 mb-6">
                  <div className="sm:flex sm:items-center sm:justify-between">
                    <div className="flex items-center">
                      <div className="relative">
                        {selectedApplication.personalPic ? (
                          <img
                            src={`http://localhost:5000/uploads/${selectedApplication.personalPic}`}
                            alt="Applicant"
                            className="h-16 w-16 sm:h-20 sm:w-20 rounded-full object-cover border-2 border-[#DECEB0] shadow-md cursor-pointer"
                            onClick={() => setEnlargedImage(`http://localhost:5000/uploads/${selectedApplication.personalPic}`)}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://via.placeholder.com/80?text=User';
                            }}
                          />
                        ) : (
                          <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center border-2 border-[#DECEB0] shadow-md">
                            <User className="h-10 w-10 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="ml-4 sm:ml-6">
                        <h4 className="text-xl font-bold text-[#2B3B3A]">
                          {selectedApplication.userId?.name || 'Unknown User'}
                        </h4>
                        <div className="mt-1 flex flex-col sm:flex-row sm:items-center text-sm text-gray-500 gap-2 sm:gap-4">
                          <p>
                            <span className="font-medium">Email:</span> {selectedApplication.userId?.email || 'Not provided'}
                          </p>
                          <p>
                            <span className="font-medium">Bar Number:</span> {selectedApplication.barNumber || 'Not provided'}
                          </p>
                        </div>
                        <div className="mt-2">
                          <span className={`px-3 py-1 inline-flex text-xs font-medium rounded-full ${getStatusBadgeClasses(selectedApplication.status)}`}>
                            {selectedApplication.status.charAt(0).toUpperCase() + selectedApplication.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 sm:mt-0">
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Applied:</span> {formatDate(selectedApplication.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-6">
                    {/* Experience & Specialization */}
                    <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                      <h4 className="text-lg font-medium text-[#2B3B3A] mb-4">Experience & Specialization</h4>
                      <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                          <span className="text-sm font-medium text-gray-500">Years of Experience</span>
                          <span className="text-base font-semibold text-[#2B3B3A]">{selectedApplication.yearsOfExperience || 'Not provided'}</span>
                        </div>
                        <div className="h-px bg-gray-100"></div>
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                          <span className="text-sm font-medium text-gray-500">Specialization</span>
                          <span className="text-base font-semibold text-[#2B3B3A]">{selectedApplication.specialization || 'Not provided'}</span>
                        </div>
                      </div>
                    </div>
                    {/* Rates */}
                    <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                      <h4 className="text-lg font-medium text-[#2B3B3A] mb-4">Consultation Rates</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                          <p className="text-sm text-gray-500 mb-1">Hourly Rate</p>
                          <p className="text-2xl font-bold text-[#2B3B3A]">
                            ${selectedApplication.hourlyRate?.toFixed(2) || '0.00'}
                          </p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                          <p className="text-sm text-gray-500 mb-1">Half-Hour Rate</p>
                          <p className="text-2xl font-bold text-[#2B3B3A]">
                            ${selectedApplication.halfHourlyRate?.toFixed(2) || '0.00'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Right Column */}
                  <div className="space-y-6">
                    {/* About */}
                    <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                      <h4 className="text-lg font-medium text-[#2B3B3A] mb-4">About</h4>
                      <p className="text-base text-[#2B3B3A] whitespace-pre-wrap">
                        {selectedApplication.about || 'Not provided'}
                      </p>
                    </div>
                    {/* Certification */}
                    <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                      <h4 className="text-lg font-medium text-[#2B3B3A] mb-4">Certification</h4>
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
              </div>
            </div>
            {/* Enlarged Image Modal */}
            {enlargedImage && (
              <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
                <div className="relative">
                  <button
                    onClick={() => setEnlargedImage(null)}
                    className="absolute top-2 right-2 text-white hover:text-gray-300"
                  >
                    <X className="h-8 w-8" />
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
        )}
      </div>
    </div>
  );
};

export default LawyerApplications;
                  