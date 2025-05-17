import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import Swal from "sweetalert2";
import LawyerSidebar from "../components/LawyerSidebar";
import { useNavigate } from 'react-router-dom';

const LawyerAppointments = () => {
  const { authData } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/appointments/lawyer/${authData.userId}`,
        {
          headers: {
            Authorization: `Bearer ${authData.token}`
          }
        }
      );
      setAppointments(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch appointments. Please try again later.",
        confirmButtonColor: "#2B3B3A"
      });
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/appointments/${appointmentId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${authData.token}`
          }
        }
      );

      Swal.fire({
        icon: "success",
        title: "Success",
        text: `Appointment ${newStatus} successfully!`,
        confirmButtonColor: "#2B3B3A"
      });

      fetchAppointments();
    } catch (error) {
      console.error("Error updating appointment:", error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message;
      
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `Failed to update appointment: ${errorMessage}`,
        confirmButtonColor: "#2B3B3A"
      });
    }
  };

  const handleStartVideoCall = async (appointmentId) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/appointments/${appointmentId}/start-call`, {}, {
        headers: {
          Authorization: `Bearer ${authData.token}`
        }
      });

      if (response.status === 200) {
        navigate(`/video-call/${appointmentId}`);
      }
    } catch (error) {
      console.error('Error starting video call:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to start video call. Please try again.'
      });
    }
  };

  const getStatusBadgeClasses = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "border-yellow-500";
      case "confirmed":
        return "border-green-500";
      case "completed":
        return "border-blue-500";
      case "cancelled":
        return "border-red-500";
      default:
        return "border-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2B3B3A] to-[#1A2A29]">
      <div className="flex">
        <LawyerSidebar />
        <div className="ml-64 flex-1 p-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#2B3B3A]">Appointments</h2>
              <button
                onClick={fetchAppointments}
                className="px-4 py-2 bg-[#DECEB0] text-[#2B3B3A] rounded-lg hover:bg-white transition-colors"
              >
                Refresh
              </button>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#2B3B3A]"></div>
              </div>
            ) : appointments.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
                  <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-gray-600 text-lg">No appointments found.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {appointments.map((appointment) => (
                  <div
                    key={appointment._id}
                    className={`bg-white border-l-4 ${getStatusColor(appointment.status)} rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-[#2B3B3A]">
                            Consultation with {appointment.userId.name}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClasses(appointment.status)}`}>
                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">
                          <div>
                            <p className="flex items-center space-x-2">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span>{formatDate(appointment.date)}</span>
                            </p>
                            <p className="flex items-center space-x-2 mt-2">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>{appointment.time}</span>
                            </p>
                          </div>
                          <div>
                            <p className="flex items-center space-x-2">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>Duration: {appointment.duration} minutes</span>
                            </p>
                            {appointment.notes && (
                              <p className="flex items-start space-x-2 mt-2">
                                <svg className="w-5 h-5 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span className="flex-1">{appointment.notes}</span>
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2 ml-4">
                        {appointment.status === "pending" && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleStatusUpdate(appointment._id, "confirmed")}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(appointment._id, "cancelled")}
                              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                        {appointment.status === 'completed' && appointment.videoCallStatus === 'not_started' && (
                          <button
                            onClick={() => handleStartVideoCall(appointment._id)}
                            className="px-4 py-2 bg-[#DECEB0] text-[#2B3B3A] rounded-lg hover:bg-white transition-colors"
                          >
                            Start Video Call
                          </button>
                        )}
                        {appointment.status === 'completed' && appointment.videoCallStatus === 'in_progress' && (
                          <button
                            onClick={() => navigate(`/video-call/${appointment._id}`)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Join Video Call
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LawyerAppointments; 