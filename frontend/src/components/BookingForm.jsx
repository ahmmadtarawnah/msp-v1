import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import StyledCheckbox from './StyledCheckbox';

const BookingForm = ({ lawyer, selectedRate, onClose }) => {
  const { authData } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    duration: selectedRate === 'hourly' ? 60 : 30,
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDurationChange = (duration) => {
    setFormData(prev => ({
      ...prev,
      duration: parseInt(duration)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!authData?.token) {
      Swal.fire({
        icon: 'warning',
        title: 'Login Required',
        text: 'Please login to book a consultation',
        confirmButtonColor: '#2B3B3A'
      });
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      // Create the appointment
      const appointmentResponse = await axios.post(
        'http://localhost:5000/api/appointments',
        {
          lawyerId: lawyer.userId._id,
          date: formData.date,
          time: formData.time,
          duration: formData.duration
        },
        {
          headers: {
            Authorization: `Bearer ${authData.token}`
          }
        }
      );

      if (appointmentResponse.data) {
        // Show success message and redirect
        Swal.fire({
          icon: 'success',
          title: 'Booking Request Sent',
          text: 'Please wait for the lawyer to accept your consultation request.',
          confirmButtonColor: '#2B3B3A'
        }).then(() => {
          onClose();
          navigate('/lawyer-dashboard');
        });
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
      Swal.fire({
        icon: 'error',
        title: 'Booking Failed',
        text: error.response?.data?.message || 'Failed to book consultation. Please try again.',
        confirmButtonColor: '#2B3B3A'
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    const baseAmount = formData.duration === 60 ? lawyer.hourlyRate : lawyer.halfHourlyRate;
    const tax = baseAmount * 0.05; // 5% tax
    return (baseAmount + tax).toFixed(2);
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#2B3B3A]">Book a Consultation</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Duration Selection */}
          <div>
            <label className="block text-[#2B3B3A] font-medium mb-4">Consultation Duration</label>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <StyledCheckbox
                  id="duration-60"
                  checked={formData.duration === 60}
                  onChange={() => handleDurationChange(60)}
                />
                <div className="text-center mt-2">
                  <p className="font-medium text-[#2B3B3A]">60 Minutes</p>
                  <p className="text-[#4A5B5A]">${lawyer.hourlyRate}</p>
                </div>
              </div>
              <div className="relative">
                <StyledCheckbox
                  id="duration-30"
                  checked={formData.duration === 30}
                  onChange={() => handleDurationChange(30)}
                />
                <div className="text-center mt-2">
                  <p className="font-medium text-[#2B3B3A]">30 Minutes</p>
                  <p className="text-[#4A5B5A]">${lawyer.halfHourlyRate}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Date Selection */}
          <div>
            <label htmlFor="date" className="block text-[#2B3B3A] font-medium mb-2">
              Select Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B3B3A] focus:border-transparent"
              required
            />
          </div>

          {/* Time Selection */}
          <div>
            <label htmlFor="time" className="block text-[#2B3B3A] font-medium mb-2">
              Select Time
            </label>
            <input
              type="time"
              id="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B3B3A] focus:border-transparent"
              required
            />
          </div>

          {/* Total and Submit */}
          <div className="border-t border-gray-200 pt-4">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-[#2B3B3A]">Base Amount:</span>
                <span className="text-[#2B3B3A]">${formData.duration === 60 ? lawyer.hourlyRate : lawyer.halfHourlyRate}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#2B3B3A]">Tax (5%):</span>
                <span className="text-[#2B3B3A]">${((formData.duration === 60 ? lawyer.hourlyRate : lawyer.halfHourlyRate) * 0.05).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                <span className="text-[#2B3B3A] font-medium">Total Amount:</span>
                <span className="text-xl font-bold text-[#2B3B3A]">${calculateTotal()}</span>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2B3B3A] text-white py-3 rounded-lg hover:bg-[#1A2A29] transition-colors disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Book Consultation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingForm; 