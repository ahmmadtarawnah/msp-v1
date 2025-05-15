const express = require('express');
const router = express.Router();
const { authenticate } = require('../controllers/authController');
const {
  createPayment,
  getPayments,
  getPaymentById,
  getUserPayments,
  getLawyerPayments
} = require('../controllers/paymentController');

// Create a new payment
router.post('/', authenticate, createPayment);

// Get all payments (admin only)
router.get('/', authenticate, getPayments);

// Get payment by ID
router.get('/:id', authenticate, getPaymentById);

// Get user's payments
router.get('/user/:userId', authenticate, getUserPayments);

// Get lawyer's payments
router.get('/lawyer/:lawyerId', authenticate, getLawyerPayments);

module.exports = router; 