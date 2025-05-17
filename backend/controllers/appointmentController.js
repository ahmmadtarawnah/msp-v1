const Appointment = require('../models/appointmentModel');
const User = require('../models/userModel');
const LawyerApplication = require('../models/lawyerApplicationModel');
const Payment = require('../models/paymentModel');

// Create a new appointment
const createAppointment = async (req, res) => {
  try {
    const { lawyerId, date, time, duration } = req.body;
    const userId = req.userId;

    // Check if the lawyer exists and is approved
    const lawyerApplication = await LawyerApplication.findOne({
      userId: lawyerId,
      status: 'approved'
    });

    if (!lawyerApplication) {
      return res.status(404).json({ message: 'Lawyer not found or not approved' });
    }

    // Check if the time slot is available
    const existingAppointment = await Appointment.findOne({
      lawyerId,
      date,
      time,
      status: { $in: ['pending', 'confirmed'] }
    });

    if (existingAppointment) {
      return res.status(400).json({ message: 'This time slot is already booked' });
    }

    const appointment = new Appointment({
      userId,
      lawyerId,
      date,
      time,
      duration,
      status: 'pending'
    });

    await appointment.save();

    res.status(201).json(appointment);
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get all appointments (admin only)
const getAppointments = async (req, res) => {
  try {
    if (req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const appointments = await Appointment.find()
      .populate('userId', 'name username')
      .populate('lawyerId', 'name username')
      .sort({ date: 1, time: 1 });

    res.status(200).json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get appointment by ID
const getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findById(id)
      .populate('userId', 'name username')
      .populate('lawyerId', 'name username');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check if the user has permission to view this appointment
    if (
      req.userRole !== 'admin' &&
      appointment.userId._id.toString() !== req.userId &&
      appointment.lawyerId._id.toString() !== req.userId
    ) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.status(200).json(appointment);
  } catch (error) {
    console.error('Error fetching appointment:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update appointment status
const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    console.log('Updating appointment:', { id, status, userId: req.userId, userRole: req.userRole });

    if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const appointment = await Appointment.findById(id)
      .populate('userId', 'name');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    console.log('Found appointment:', {
      appointmentId: appointment._id,
      lawyerId: appointment.lawyerId,
      userId: appointment.userId._id,
      currentStatus: appointment.status
    });

    // Check if the user has permission to update this appointment
    if (
      req.userRole !== 'admin' &&
      appointment.lawyerId.toString() !== req.userId
    ) {
      console.log('Permission denied:', {
        userRole: req.userRole,
        userId: req.userId,
        lawyerId: appointment.lawyerId.toString()
      });
      return res.status(403).json({ message: 'Access denied' });
    }

    // If the appointment is being confirmed, create a payment record
    if (status === 'confirmed' && appointment.status === 'pending') {
      try {
        // Get lawyer's rate information
        const lawyerApplication = await LawyerApplication.findOne({
          userId: appointment.lawyerId,
          status: 'approved'
        });

        if (!lawyerApplication) {
          return res.status(404).json({ message: 'Lawyer application not found' });
        }

        const amount = appointment.duration === 60 
          ? lawyerApplication.hourlyRate 
          : lawyerApplication.halfHourlyRate;

        console.log('Creating payment:', {
          appointmentId: appointment._id,
          amount,
          duration: appointment.duration,
          lawyerId: appointment.lawyerId,
          userId: appointment.userId._id
        });

        const payment = new Payment({
          appointmentId: appointment._id,
          userId: appointment.userId._id,
          lawyerId: appointment.lawyerId,
          amount,
          paymentMethod: 'card',
          status: 'pending' // Set initial status as pending
        });

        await payment.save();
        console.log('Payment created successfully');
      } catch (paymentError) {
        console.error('Error creating payment:', paymentError);
        return res.status(500).json({ message: 'Error creating payment record' });
      }
    }

    appointment.status = status;
    await appointment.save();
    console.log('Appointment updated successfully');

    res.status(200).json(appointment);
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ 
      message: 'Error updating appointment',
      error: error.message 
    });
  }
};

// Get lawyer's appointments
const getLawyerAppointments = async (req, res) => {
  try {
    const { lawyerId } = req.params;

    // Check if the user has permission to view these appointments
    if (req.userRole !== 'admin' && lawyerId !== req.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const appointments = await Appointment.find({ lawyerId })
      .populate('userId', 'name username')
      .sort({ date: 1, time: 1 });

    res.status(200).json(appointments);
  } catch (error) {
    console.error('Error fetching lawyer appointments:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get user's appointments
const getUserAppointments = async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if the user has permission to view these appointments
    if (req.userRole !== 'admin' && userId !== req.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const appointments = await Appointment.find({ userId })
      .populate('lawyerId', 'name username')
      .sort({ date: 1, time: 1 });

    // Get lawyer applications for the appointments
    const lawyerIds = appointments.map(app => app.lawyerId._id);
    const lawyerApplications = await LawyerApplication.find({
      userId: { $in: lawyerIds },
      status: 'approved'
    }).populate('userId', 'name username');

    // Create a map of lawyer applications by userId
    const lawyerMap = lawyerApplications.reduce((map, app) => {
      map[app.userId._id.toString()] = app;
      return map;
    }, {});

    // Add lawyer application data to appointments
    const appointmentsWithLawyerData = appointments.map(appointment => {
      const lawyerApp = lawyerMap[appointment.lawyerId._id.toString()];
      return {
        ...appointment.toObject(),
        lawyerId: {
          ...appointment.lawyerId.toObject(),
          application: lawyerApp ? {
            specialization: lawyerApp.specialization,
            hourlyRate: lawyerApp.hourlyRate,
            halfHourlyRate: lawyerApp.halfHourlyRate
          } : null
        }
      };
    });

    res.status(200).json(appointmentsWithLawyerData);
  } catch (error) {
    console.error('Error fetching user appointments:', error);
    res.status(500).json({ message: error.message });
  }
};

// Start video call
const startVideoCall = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check if the user is authorized to start the call
    if (
      appointment.userId.toString() !== req.userId &&
      appointment.lawyerId.toString() !== req.userId
    ) {
      return res.status(403).json({ message: 'Not authorized to start this call' });
    }

    // Check if the appointment is completed (paid)
    if (appointment.status !== 'completed') {
      return res.status(400).json({ message: 'Appointment must be completed before starting the call' });
    }

    // Update video call status
    appointment.videoCallStatus = 'in_progress';
    appointment.videoCallStartTime = new Date();
    await appointment.save();

    res.status(200).json(appointment);
  } catch (error) {
    console.error('Error starting video call:', error);
    res.status(500).json({ message: 'Error starting video call' });
  }
};

// End video call
const endVideoCall = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check if the user is authorized to end the call
    if (
      appointment.userId.toString() !== req.userId &&
      appointment.lawyerId.toString() !== req.userId
    ) {
      return res.status(403).json({ message: 'Not authorized to end this call' });
    }

    // Update video call status
    appointment.videoCallStatus = 'ended';
    appointment.videoCallEndTime = new Date();
    await appointment.save();

    res.status(200).json(appointment);
  } catch (error) {
    console.error('Error ending video call:', error);
    res.status(500).json({ message: 'Error ending video call' });
  }
};

module.exports = {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  getLawyerAppointments,
  getUserAppointments,
  startVideoCall,
  endVideoCall
}; 