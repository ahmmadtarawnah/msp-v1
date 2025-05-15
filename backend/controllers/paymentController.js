const Payment = require('../models/paymentModel');
const Appointment = require('../models/appointmentModel');

// Create a new payment
const createPayment = async (req, res) => {
  try {
    const { appointmentId, paymentMethod } = req.body;
    const userId = req.userId;

    // Check if the appointment exists and belongs to the user
    const appointment = await Appointment.findById(appointmentId)
      .populate('lawyerId', 'hourlyRate halfHourlyRate');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointment.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (appointment.status !== 'confirmed') {
      return res.status(400).json({ message: 'Appointment must be confirmed before payment' });
    }

    // Check if payment already exists
    const existingPayment = await Payment.findOne({ appointmentId });
    if (existingPayment) {
      if (existingPayment.status === 'completed') {
        return res.status(400).json({ message: 'Payment already completed' });
      }
      // Update existing payment
      existingPayment.status = 'completed';
      await existingPayment.save();
    } else {
      // Create new payment
      const amount = appointment.duration === 60 
        ? appointment.lawyerId.hourlyRate 
        : appointment.lawyerId.halfHourlyRate;

      const payment = new Payment({
        appointmentId,
        userId,
        lawyerId: appointment.lawyerId._id,
        amount,
        paymentMethod,
        status: 'completed'
      });

      await payment.save();
    }

    // Update appointment status to completed
    appointment.status = 'completed';
    await appointment.save();

    res.status(201).json({ message: 'Payment completed successfully' });
  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get all payments (admin only)
const getPayments = async (req, res) => {
  try {
    if (req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const payments = await Payment.find()
      .populate('userId', 'name username')
      .populate('lawyerId', 'name username')
      .populate('appointmentId')
      .sort({ createdAt: -1 });

    res.status(200).json(payments);
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get payment by ID
const getPaymentById = async (req, res) => {
  try {
    const { id } = req.params;
    const payment = await Payment.findById(id)
      .populate('userId', 'name username')
      .populate('lawyerId', 'name username')
      .populate('appointmentId');

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Check if the user has permission to view this payment
    if (
      req.userRole !== 'admin' &&
      payment.userId._id.toString() !== req.userId &&
      payment.lawyerId._id.toString() !== req.userId
    ) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.status(200).json(payment);
  } catch (error) {
    console.error('Error fetching payment:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get user's payments
const getUserPayments = async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if the user has permission to view these payments
    if (req.userRole !== 'admin' && userId !== req.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const payments = await Payment.find({ userId })
      .populate('lawyerId', 'name username')
      .populate('appointmentId')
      .sort({ createdAt: -1 });

    res.status(200).json(payments);
  } catch (error) {
    console.error('Error fetching user payments:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get lawyer's payments
const getLawyerPayments = async (req, res) => {
  try {
    const { lawyerId } = req.params;

    // Check if the user has permission to view these payments
    if (req.userRole !== 'admin' && lawyerId !== req.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const payments = await Payment.find({ lawyerId })
      .populate('userId', 'name username')
      .populate('appointmentId')
      .sort({ createdAt: -1 });

    res.status(200).json(payments);
  } catch (error) {
    console.error('Error fetching lawyer payments:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createPayment,
  getPayments,
  getPaymentById,
  getUserPayments,
  getLawyerPayments
}; 