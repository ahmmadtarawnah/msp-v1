import React, { useState, useEffect } from 'react';
import AgoraRTC from 'agora-rtc-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const VideoCall = () => {
  const { appointmentId } = useParams();
  const { authData } = useAuth();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isJoining, setIsJoining] = useState(false);

  // Agora client setup
  const agoraClient = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
  const [localVideoTrack, setLocalVideoTrack] = useState(null);
  const [remoteUsers, setRemoteUsers] = useState([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/appointments/${appointmentId}`,
          {
            headers: { Authorization: `Bearer ${authData.token}` }
          }
        );
        setAppointment(response.data);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch appointment details');
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [appointmentId, authData.token]);

  const joinChannel = async () => {
    if (isJoining) return;
    setIsJoining(true);
    setError(null);

    try {
      // Get token from your backend
      const tokenResponse = await axios.get(
        `http://localhost:5000/api/video/token/${appointmentId}`,
        {
          headers: { Authorization: `Bearer ${authData.token}` }
        }
      );

      const { token, channelName, uid } = tokenResponse.data;

      console.log('Joining channel with:', {
        channelName,
        uid
      });

      // Join the channel
      await agoraClient.join(
        import.meta.env.VITE_AGORA_APP_ID || 'c3cb6505a5c34f5097c62e814c77e694',
        channelName,
        token,
        uid
      );

      // Create and publish local video track
      const videoTrack = await AgoraRTC.createCameraVideoTrack();
      setLocalVideoTrack(videoTrack);
      await agoraClient.publish([videoTrack]);

      // Handle user joined event
      agoraClient.on('user-published', async (user, mediaType) => {
        await agoraClient.subscribe(user, mediaType);
        if (mediaType === 'video') {
          setRemoteUsers(prev => [...prev, user]);
        }
      });

      // Handle user left event
      agoraClient.on('user-unpublished', (user) => {
        setRemoteUsers(prev => prev.filter(u => u.uid !== user.uid));
      });

    } catch (error) {
      console.error('Error initializing Agora:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      setError(
        error.response?.data?.message || 
        error.response?.data?.error || 
        error.message || 
        'Failed to initialize video call'
      );
    } finally {
      setIsJoining(false);
    }
  };

  useEffect(() => {
    if (!appointment) return;

    joinChannel();

    // Cleanup
    return () => {
      if (localVideoTrack) {
        localVideoTrack.close();
      }
      agoraClient.leave();
    };
  }, [appointment]);

  const toggleMute = () => {
    if (localVideoTrack) {
      localVideoTrack.setEnabled(!isMuted);
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (localVideoTrack) {
      localVideoTrack.setEnabled(!isVideoOff);
      setIsVideoOff(!isVideoOff);
    }
  };

  const endCall = async () => {
    try {
      await axios.post(
        `http://localhost:5000/api/appointments/${appointmentId}/end-call`,
        {},
        {
          headers: { Authorization: `Bearer ${authData.token}` }
        }
      );
      navigate(-1);
    } catch (error) {
      console.error('Error ending call:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#2B3B3A]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#DECEB0]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#2B3B3A]">
        <div className="text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p>{error}</p>
          <div className="mt-4 space-x-4">
            <button
              onClick={() => setError(null)}
              className="px-6 py-2 bg-[#DECEB0] text-[#2B3B3A] rounded-lg hover:bg-white transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#2B3B3A] p-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Local Video */}
          <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
            {localVideoTrack && (
              <div className="w-full h-full">
                <video
                  ref={(el) => {
                    if (el) {
                      localVideoTrack.play(el);
                    }
                  }}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
              <button
                onClick={toggleMute}
                className={`p-3 rounded-full ${
                  isMuted ? 'bg-red-500' : 'bg-[#DECEB0]'
                } text-[#2B3B3A] hover:bg-white transition-colors`}
              >
                {isMuted ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                )}
              </button>
              <button
                onClick={toggleVideo}
                className={`p-3 rounded-full ${
                  isVideoOff ? 'bg-red-500' : 'bg-[#DECEB0]'
                } text-[#2B3B3A] hover:bg-white transition-colors`}
              >
                {isVideoOff ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
              </button>
              <button
                onClick={endCall}
                className="p-3 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Remote Video */}
          <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
            {remoteUsers.length > 0 ? (
              <div className="w-full h-full">
                <video
                  ref={(el) => {
                    if (el && remoteUsers[0].videoTrack) {
                      remoteUsers[0].videoTrack.play(el);
                    }
                  }}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-white text-center">
                  <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <p>Waiting for the other participant to join...</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Call Info */}
        <div className="mt-4 text-center text-white">
          <h2 className="text-xl font-bold">
            Consultation with {appointment?.lawyerId?.name || 'Lawyer'}
          </h2>
          <p className="text-[#DECEB0]">
            {new Date(appointment?.date).toLocaleDateString()} at {appointment?.time}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VideoCall; 