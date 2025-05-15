const express = require('express');
const router = express.Router();
const { authenticate } = require('../controllers/authController');
const {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  getLawyerAppointments,
  getUserAppointments
} = require('../controllers/appointmentController');

// Create a new appointment
router.post('/', authenticate, createAppointment);

// Get all appointments (admin only)
router.get('/', authenticate, getAppointments);

// Get appointment by ID
router.get('/:id', authenticate, getAppointmentById);

// Update appointment status
router.put('/:id/status', authenticate, updateAppointmentStatus);

// Get lawyer's appointments
router.get('/lawyer/:lawyerId', authenticate, getLawyerAppointments);

// Get user's appointments
router.get('/user/:userId', authenticate, getUserAppointments);

module.exports = router; 