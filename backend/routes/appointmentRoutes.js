const express = require('express');
const router = express.Router();
const { authenticate } = require('../controllers/authController');
const {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  getLawyerAppointments,
  getUserAppointments,
  startVideoCall,
  endVideoCall
} = require('../controllers/appointmentController');

// Create a new appointment
router.post('/', authenticate, createAppointment);

// Get all appointments (admin only)
router.get('/', authenticate, getAppointments);

// Get lawyer's appointments
router.get('/lawyer/:lawyerId', authenticate, getLawyerAppointments);

// Get user's appointments
router.get('/user/:userId', authenticate, getUserAppointments);

// Get appointment by ID
router.get('/:id', authenticate, getAppointmentById);

// Update appointment status
router.put('/:id/status', authenticate, updateAppointmentStatus);

// Video call routes
router.post('/:id/start-call', authenticate, startVideoCall);
router.post('/:id/end-call', authenticate, endVideoCall);

module.exports = router; 