import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

// Reusing the LegalAidLogo component from Home page
const LegalAidLogo = ({
  size = "normal",
  color = "#DECEB0",
  hoverColor = "#ffffff",
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Size variations
  const sizeClasses = {
    small: "h-6 w-6",
    normal: "h-10 w-10",
    large: "h-12 w-12",
  };

  return (
    <div
      className={`${
        sizeClasses[size]
      } relative cursor-pointer transition-all duration-300 transform ${
        isHovered ? "scale-110" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Custom Scales of Justice Logo with Animation */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full transition-all duration-300"
      >
        {/* Top Balance Point */}
        <circle
          cx="12"
          cy="4"
          r="1.5"
          fill={isHovered ? hoverColor : color}
          className={`transition-all duration-300 ${
            isHovered ? "animate-pulse" : ""
          }`}
        />

        {/* Center Bar */}
        <rect
          x="11.5"
          y="4"
          width="1"
          height="10"
          fill={isHovered ? hoverColor : color}
          className={`transition-all duration-300 ${
            isHovered ? "animate-pulse" : ""
          }`}
        />

        {/* Base */}
        <path
          d="M8 20h8l-1-2H9l-1 2z"
          fill={isHovered ? hoverColor : color}
          className="transition-all duration-300"
        />

        {/* Base Stem */}
        <rect
          x="11.5"
          y="14"
          width="1"
          height="4"
          fill={isHovered ? hoverColor : color}
          className="transition-all duration-300"
        />

        {/* Left Scale Dish */}
        <circle
          cx="7"
          cy="10"
          r="2.5"
          fill="transparent"
          stroke={isHovered ? hoverColor : color}
          strokeWidth="1"
          className={`transition-all duration-500 ${
            isHovered ? "transform translate-y-1" : ""
          }`}
        />

        {/* Right Scale Dish */}
        <circle
          cx="17"
          cy="10"
          r="2.5"
          fill="transparent"
          stroke={isHovered ? hoverColor : color}
          strokeWidth="1"
          className={`transition-all duration-500 ${
            isHovered ? "transform -translate-y-1" : ""
          }`}
        />

        {/* Left Arm */}
        <line
          x1="12"
          y1="4"
          x2="7"
          y2="10"
          stroke={isHovered ? hoverColor : color}
          strokeWidth="1"
          className={`transition-all duration-300 ${
            isHovered ? "transform rotate-3" : ""
          }`}
        />

        {/* Right Arm */}
        <line
          x1="12"
          y1="4"
          x2="17"
          y2="10"
          stroke={isHovered ? hoverColor : color}
          strokeWidth="1"
          className={`transition-all duration-300 ${
            isHovered ? "transform -rotate-3" : ""
          }`}
        />

        {/* Small decorative elements */}
        <circle
          cx="7"
          cy="10"
          r="0.5"
          fill={isHovered ? hoverColor : color}
          className={`transition-all duration-300 ${
            isHovered ? "opacity-100" : "opacity-70"
          }`}
        />
        <circle
          cx="17"
          cy="10"
          r="0.5"
          fill={isHovered ? hoverColor : color}
          className={`transition-all duration-300 ${
            isHovered ? "opacity-100" : "opacity-70"
          }`}
        />
      </svg>

      {/* Glow effect on hover */}
      {isHovered && (
        <div className="absolute inset-0 rounded-full bg-[#DECEB0] opacity-20 blur-md -z-10"></div>
      )}
    </div>
  );
};

const Profile = () => {
  const { authData } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [appointments, setAppointments] = useState([]);
  const [displayedAppointments, setDisplayedAppointments] = useState(5);
  const navigate = useNavigate();

  const fetchAppointments = async () => {
    try {
      const appointmentsResponse = await axios.get(
        `http://localhost:5000/api/appointments/user/${authData.userId}`,
        {
          headers: { Authorization: `Bearer ${authData.token}` },
        }
      );
      setAppointments(appointmentsResponse.data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch appointments. Please try again.',
        confirmButtonColor: '#2B3B3A'
      });
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      if (!authData?.token) {
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get("http://localhost:5000/api/profile", {
          headers: { Authorization: `Bearer ${authData.token}` },
        });
        setUserData(response.data);
        setFormData({
          name: response.data.name,
          username: response.data.username,
          password: "",
        });

        // Fetch appointments
        await fetchAppointments();
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [authData, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
    // Reset form errors when toggling edit mode
    setFormErrors({});
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }

    if (!formData.username.trim()) {
      errors.username = "Username is required";
    }

    // Only validate password if user is trying to change it
    if (formData.password && formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await axios.put(
        "http://localhost:5000/api/profile",
        formData,
        {
          headers: { Authorization: `Bearer ${authData.token}` },
        }
      );
      setUserData(response.data.user);
      setIsEditing(false);

      // Show success notification
      const notification = document.getElementById("notification");
      if (notification) {
        notification.classList.remove("hidden");
        notification.classList.add("flex");
        setTimeout(() => {
          notification.classList.add("hidden");
          notification.classList.remove("flex");
        }, 3000);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setFormErrors({ submit: "Error updating profile. Please try again." });
    }
  };

  const handlePayment = async (appointmentId) => {
    try {
      // Find the appointment to get the rate
      const appointment = appointments.find(apt => apt._id === appointmentId);
      const baseAmount = appointment.duration === 60 
        ? appointment.lawyerId.application.hourlyRate 
        : appointment.lawyerId.application.halfHourlyRate;
      const tax = baseAmount * 0.05; // 5% tax
      const totalAmount = baseAmount + tax;

      // Show payment form
      const { value: formValues } = await Swal.fire({
        title: '<div class="text-2xl font-bold text-[#2B3B3A]">Complete Payment</div>',
        html: `
          <div class="space-y-6 p-4">
            <div class="bg-[#2B3B3A]/5 p-4 rounded-lg">
              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-gray-600">Base Amount</span>
                  <span class="text-[#2B3B3A]">$${baseAmount.toFixed(2)}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-gray-600">Tax (5%)</span>
                  <span class="text-[#2B3B3A]">$${tax.toFixed(2)}</span>
                </div>
                <div class="flex items-center justify-between pt-2 border-t border-gray-200">
                  <span class="text-gray-600 font-medium">Total Amount</span>
                  <span class="text-2xl font-bold text-[#2B3B3A]">$${totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                <div class="relative">
                  <input id="cardNumber" class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#DECEB0] focus:border-transparent" placeholder="1234 5678 9012 3456" maxlength="19">
                  <div class="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
                <input id="cardName" class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#DECEB0] focus:border-transparent" placeholder="John Doe">
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                  <input id="expiryDate" class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#DECEB0] focus:border-transparent" placeholder="MM/YY" maxlength="5">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                  <div class="relative">
                    <input id="cvv" class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#DECEB0] focus:border-transparent" placeholder="123" maxlength="3">
                    <div class="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div class="flex items-center space-x-2 text-sm text-gray-500">
                <svg class="w-5 h-5 text-[#DECEB0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>Your payment information is secure and encrypted</span>
              </div>
            </div>
          </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Pay Now',
        confirmButtonColor: '#2B3B3A',
        cancelButtonText: 'Cancel',
        customClass: {
          popup: 'rounded-xl',
          confirmButton: 'px-8 py-3 text-lg font-medium',
          cancelButton: 'px-8 py-3 text-lg font-medium'
        },
        preConfirm: () => {
          return {
            cardNumber: document.getElementById('cardNumber').value,
            cardName: document.getElementById('cardName').value,
            expiryDate: document.getElementById('expiryDate').value,
            cvv: document.getElementById('cvv').value
          }
        }
      });

      if (formValues) {
        // Process payment
        const response = await axios.post(
          'http://localhost:5000/api/payments',
          {
            appointmentId,
            paymentMethod: 'card',
            cardDetails: formValues,
            amount: totalAmount
          },
          {
            headers: {
              Authorization: `Bearer ${authData.token}`
            }
          }
        );

        if (response.data) {
          await Swal.fire({
            icon: 'success',
            title: '<div class="text-2xl font-bold text-[#2B3B3A]">Payment Successful!</div>',
            html: `
              <div class="space-y-4">
                <div class="flex justify-center">
                  <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <svg class="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <p class="text-gray-600">Your consultation has been confirmed!</p>
                <p class="text-sm text-gray-500">A confirmation email has been sent to your registered email address.</p>
              </div>
            `,
            confirmButtonColor: '#2B3B3A',
            customClass: {
              popup: 'rounded-xl',
              confirmButton: 'px-8 py-3 text-lg font-medium'
            }
          });
          // Refresh appointments
          fetchAppointments();
        }
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      await Swal.fire({
        icon: 'error',
        title: '<div class="text-2xl font-bold text-[#2B3B3A]">Payment Failed</div>',
        html: `
          <div class="space-y-4">
            <div class="flex justify-center">
              <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
            <p class="text-gray-600">${error.response?.data?.message || 'Failed to process payment. Please try again.'}</p>
          </div>
        `,
        confirmButtonColor: '#2B3B3A',
        customClass: {
          popup: 'rounded-xl',
          confirmButton: 'px-8 py-3 text-lg font-medium'
        }
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-b from-[#2B3B3A] to-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#DECEB0]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#2B3B3A]/95 via-gray-100 to-gray-100 relative overflow-hidden">
      {/* Background design elements */}
      <div className="absolute top-0 left-0 w-full h-64 bg-[#2B3B3A] transform -skew-y-2 origin-top-left z-0"></div>
      <div className="absolute top-0 right-0 w-1/3 h-screen bg-[#DECEB0]/10 z-0"></div>
      <div className="absolute bottom-0 left-0 w-1/4 h-64 bg-[#DECEB0]/10 rounded-tr-full z-0"></div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10 z-0"></div>

      {/* Success Notification - Moved outside the content container and increased z-index */}
      <div
        id="notification"
        className="hidden fixed top-6 right-6 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-md items-center z-[9999] transform transition-all duration-500 ease-in-out"
      >
        <svg
          className="h-6 w-6 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
        <span>Profile updated successfully!</span>
      </div>

      {/* Content container */}
      <div className="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Header Section */}
          <div className="mb-10 text-center">
            <div className="inline-block mb-3">
              <div className="p-4 bg-[#2B3B3A]/30 backdrop-blur-sm rounded-full">
                <LegalAidLogo
                  size="large"
                  color="#DECEB0"
                  hoverColor="#ffffff"
                />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white">Your Profile</h1>
            <div className="w-24 h-1 bg-[#DECEB0] mx-auto mt-4"></div>
          </div>

          {/* Main Content */}
          <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-2xl overflow-hidden border border-[#DECEB0]/30">
            {/* Profile Header */}
            <div className="bg-[#2B3B3A] py-6 px-8 flex justify-between items-center">
              <div className="flex items-center">
                <div className="h-16 w-16 rounded-full bg-[#DECEB0] flex items-center justify-center text-[#2B3B3A] text-2xl font-bold mr-4">
                  {userData?.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-white text-xl font-bold">
                    {userData?.name}
                  </h2>
                  <p className="text-[#DECEB0]">{userData?.username}</p>
                </div>
              </div>
              <button
                onClick={toggleEditMode}
                className={`${
                  isEditing
                    ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                    : "bg-[#DECEB0] hover:bg-white text-[#2B3B3A]"
                } font-bold py-2 px-6 rounded-md transition-all duration-300 transform hover:scale-105 shadow-lg inline-flex items-center justify-center`}
              >
                {isEditing ? "Cancel" : "Edit Profile"}
              </button>
            </div>

            {/* Profile Content */}
            <div className="p-8">
              {isEditing ? (
                // Edit Form
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-[#2B3B3A] font-medium mb-2"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-md border ${
                        formErrors.name ? "border-red-500" : "border-gray-300"
                      } focus:outline-none focus:ring-2 focus:ring-[#DECEB0]`}
                    />
                    {formErrors.name && (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="username"
                      className="block text-[#2B3B3A] font-medium mb-2"
                    >
                      Username
                    </label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-md border ${
                        formErrors.username
                          ? "border-red-500"
                          : "border-gray-300"
                      } focus:outline-none focus:ring-2 focus:ring-[#DECEB0]`}
                    />
                    {formErrors.username && (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors.username}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="block text-[#2B3B3A] font-medium mb-2"
                    >
                      Password{" "}
                      <span className="text-gray-500 text-sm">
                        (Leave empty to keep current password)
                      </span>
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className={`w-full px-4 py-3 rounded-md border ${
                        formErrors.password
                          ? "border-red-500"
                          : "border-gray-300"
                      } focus:outline-none focus:ring-2 focus:ring-[#DECEB0]`}
                    />
                    {formErrors.password && (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors.password}
                      </p>
                    )}
                  </div>

                  {formErrors.submit && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
                      {formErrors.submit}
                    </div>
                  )}

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="bg-[#2B3B3A] text-[#DECEB0] px-8 py-3 rounded-md font-medium hover:bg-[#1a2a29] transition-colors duration-300"
                    >
                      Update Profile
                    </button>
                  </div>
                </form>
              ) : (
                // Profile Info
                <div className="space-y-8">
                  <div className="border-b border-gray-200 pb-6">
                    <h3 className="text-xl font-bold text-[#2B3B3A] mb-4 flex items-center">
                      <div className="w-8 h-8 bg-[#2B3B3A] rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <LegalAidLogo size="small" />
                      </div>
                      Personal Information
                    </h3>

                    <div className="grid md:grid-cols-2 gap-6 pl-11">
                      <div>
                        <h4 className="text-gray-500 text-sm mb-1">
                          Full Name
                        </h4>
                        <p className="text-gray-800 font-medium text-lg">
                          {userData?.name}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-gray-500 text-sm mb-1">Username</h4>
                        <p className="text-gray-800 font-medium text-lg">
                          {userData?.username}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-[#2B3B3A] mb-4 flex items-center">
                      <div className="w-8 h-8 bg-[#2B3B3A] rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <span className="text-[#DECEB0] font-medium">i</span>
                      </div>
                      Account Security
                    </h3>

                    <div className="pl-11">
                      <div className="flex items-start mb-4">
                        <div className="h-6 w-6 rounded-full bg-[#2B3B3A] flex items-center justify-center flex-shrink-0 mt-1">
                          <svg
                            viewBox="0 0 24 24"
                            width="14"
                            height="14"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M5 12l5 5L20 7"
                              stroke="#DECEB0"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                        <p className="ml-3 text-gray-700">
                          Your password is set and secure
                        </p>
                      </div>

                      <p className="text-gray-600">
                        To change your password, click the Edit Profile button
                        and enter a new password in the form.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Appointments Section */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-[#2B3B3A] mb-6">Your Appointments</h2>
              {appointments.length > 0 ? (
                <div className="space-y-4">
                  {appointments.slice(0, displayedAppointments).map((appointment) => (
                    <div key={appointment._id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-[#2B3B3A]">
                            Consultation with {appointment.lawyerId?.name || 'Lawyer'}
                          </h3>
                          <p className="text-gray-600">
                            Date: {new Date(appointment.date).toLocaleDateString()}
                          </p>
                          <p className="text-gray-600">
                            Time: {appointment.time}
                          </p>
                          <p className="text-gray-600">
                            Duration: {appointment.duration} minutes
                          </p>
                          {appointment.lawyerId?.application && (
                            <p className="text-gray-600">
                              Rate: ${appointment.duration === 60 
                                ? appointment.lawyerId.application.hourlyRate 
                                : appointment.lawyerId.application.halfHourlyRate}
                            </p>
                          )}
                          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClasses(appointment.status)}`}>
                            {appointment.status}
                          </span>
                        </div>
                        <div className="appointment-actions">
                          {appointment.status === 'confirmed' && (
                            <button
                              className="btn btn-primary"
                              onClick={() => handlePayment(appointment._id)}
                            >
                              Complete Payment
                            </button>
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
                  {/* Load More Appointments Button */}
                  {displayedAppointments < appointments.length && (
                    <div className="flex justify-center mt-4">
                      <button
                        className="bg-[#2B3B3A] text-[#DECEB0] px-6 py-2 rounded-md font-medium hover:bg-[#1a2a29] transition-colors duration-300"
                        onClick={() => setDisplayedAppointments(prev => prev + 5)}
                      >
                        Load More Appointments
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-600">No appointments found.</p>
              )}
            </div>
          </div>

          {/* Action Footer */}
          <div className="mt-8 text-center">
            <button
              onClick={() => navigate("/")}
              className="inline-block bg-transparent hover:bg-[#2B3B3A] text-white hover:text-[#DECEB0] font-semibold py-2 px-6 rounded-md border-2 border-white hover:border-[#2B3B3A] transition-all duration-300 backdrop-blur-sm"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>

      {/* Add styles to head for grid pattern */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          .bg-grid-pattern {
            background-image: 
              linear-gradient(to right, rgba(222, 206, 176, 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(222, 206, 176, 0.1) 1px, transparent 1px);
            background-size: 40px 40px;
          }
        `,
        }}
      />
    </div>
  );
};

export default Profile;
