const { RtcTokenBuilder, RtcRole } = require('agora-access-token');
const Appointment = require('../models/appointmentModel');

const generateToken = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const userId = req.userId;

    console.log('Generating token for:', { appointmentId, userId });

    // Find the appointment
    const appointment = await Appointment.findById(appointmentId)
      .populate('userId', 'name')
      .populate('lawyerId', 'name');

    console.log('Found appointment:', appointment);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check if the user is authorized to join the call
    const userIdStr = userId.toString();
    const appointmentUserIdStr = appointment.userId._id.toString();
    const appointmentLawyerIdStr = appointment.lawyerId._id.toString();

    console.log('User IDs:', {
      userIdStr,
      appointmentUserIdStr,
      appointmentLawyerIdStr
    });

    if (userIdStr !== appointmentUserIdStr && userIdStr !== appointmentLawyerIdStr) {
      return res.status(403).json({ message: 'Not authorized to join this call' });
    }

    // Check if the appointment is confirmed and paid
    if (appointment.status !== 'completed') {
      return res.status(400).json({ message: 'Appointment must be confirmed and paid before starting the call' });
    }

    // Generate channel name using appointment ID
    const channelName = `appointment-${appointmentId}`;

    // Set token expiry time (24 hours to allow for longer sessions)
    const expirationTimeInSeconds = 86400;
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

    // Generate a unique UID based on user role
    const isLawyer = userIdStr === appointmentLawyerIdStr;
    const uid = isLawyer ? 1 : 2;

    console.log('Generating token with:', {
      appId: process.env.AGORA_APP_ID || 'c3cb6505a5c34f5097c62e814c77e694',
      appCertificate: process.env.AGORA_APP_CERTIFICATE || '7fc4d26bd95c42668d48c70b65af1cc8',
      channelName,
      uid,
      privilegeExpiredTs
    });

    // Generate token with both PUBLISHER and SUBSCRIBER privileges
    const token = RtcTokenBuilder.buildTokenWithUid(
      process.env.AGORA_APP_ID || 'c3cb6505a5c34f5097c62e814c77e694',
      process.env.AGORA_APP_CERTIFICATE || '7fc4d26bd95c42668d48c70b65af1cc8',
      channelName,
      uid,
      RtcRole.PUBLISHER,
      privilegeExpiredTs
    );

    console.log('Token generated successfully');

    res.json({
      token,
      channelName,
      uid,
      appointment: {
        id: appointment._id,
        date: appointment.date,
        time: appointment.time,
        duration: appointment.duration,
        lawyerName: appointment.lawyerId.name,
        userName: appointment.userId.name
      }
    });
  } catch (error) {
    console.error('Error generating token:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      message: 'Error generating video call token',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

module.exports = {
  generateToken
}; 