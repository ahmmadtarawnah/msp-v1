const express = require('express');
const router = express.Router();
const { authenticate } = require('../controllers/authController');
const { generateToken } = require('../controllers/videoController');

// Generate video call token
router.get('/token/:appointmentId', authenticate, generateToken);

module.exports = router; 