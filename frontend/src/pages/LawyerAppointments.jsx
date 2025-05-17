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
      console.log('Updating appointment status:', { appointmentId, newStatus });
      
      const response = await axios.put(
        `http://localhost:5000/api/appointments/${appointmentId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${authData.token}`
          }
        }
      );

      console.log('Update response:', response.data);

      Swal.fire({
        icon: "success",
        title: "Success",
        text: `Appointment ${newStatus} successfully!`,
        confirmButtonColor: "#2B3B3A"
      });

      // Refresh appointments
      fetchAppointments();
    } catch (error) {
      console.error("Error updating appointment:", error);
      
      // Get the error message from the response if available
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2B3B3A] to-[#1A2A29]">
      <div className="flex">
        <LawyerSidebar />
        <div className="ml-64 flex-1 p-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-[#2B3B3A] mb-6">Appointments</h2>
            
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#2B3B3A]"></div>
              </div>
            ) : appointments.length === 0 ? (
              <p className="text-gray-600 text-center py-8">No appointments found.</p>
            ) : (
            <div className="space-y-6">
                {appointments.map((appointment) => (
                  <div
                    key={appointment._id}
                    className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-[#2B3B3A]">
                          Consultation with {appointment.userId.name}
                        </h3>
                        <p className="text-gray-600 mt-1">
                          Date: {formatDate(appointment.date)}
                        </p>
                        <p className="text-gray-600">
                          Time: {appointment.time}
                        </p>
                        <p className="text-gray-600">
                          Duration: {appointment.duration} minutes
                        </p>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClasses(appointment.status)}`}>
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </span>
                        {appointment.status === "pending" && (
                          <div className="flex space-x-2 mt-2">
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
                            className="btn btn-success"
                            onClick={() => handleStartVideoCall(appointment._id)}
                          >
                            Start Video Call
                          </button>
                        )}
                        {appointment.status === 'completed' && appointment.videoCallStatus === 'in_progress' && (
                          <button
                            className="btn btn-info"
                            onClick={() => navigate(`/video-call/${appointment._id}`)}
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