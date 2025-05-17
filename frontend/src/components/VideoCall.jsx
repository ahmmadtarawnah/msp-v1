import React, { useState, useEffect, useCallback } from 'react';
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
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [connectionState, setConnectionState] = useState('disconnected');

  // Agora client setup
  const agoraClient = AgoraRTC.createClient({ 
    mode: 'rtc', 
    codec: 'vp8',
    role: 'host'
  });
  const [localVideoTrack, setLocalVideoTrack] = useState(null);
  const [localAudioTrack, setLocalAudioTrack] = useState(null);
  const [remoteUsers, setRemoteUsers] = useState([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [deviceError, setDeviceError] = useState(null);

  // Initialize devices
  const initializeDevices = useCallback(async () => {
    try {
      // Check microphone permissions
      const micPermission = await navigator.permissions.query({ name: 'microphone' });
      if (micPermission.state === 'denied') {
        throw new Error('Microphone permission denied. Please enable it in your browser settings.');
      }

      // Check camera permissions
      const cameraPermission = await navigator.permissions.query({ name: 'camera' });
      if (cameraPermission.state === 'denied') {
        throw new Error('Camera permission denied. Please enable it in your browser settings.');
      }

      // Get available devices
      const devices = await AgoraRTC.getMicrophones();
      if (devices.length === 0) {
        throw new Error('No microphone found. Please connect a microphone and try again.');
      }

      const cameras = await AgoraRTC.getCameras();
      if (cameras.length === 0) {
        throw new Error('No camera found. Please connect a camera and try again.');
      }

      return true;
    } catch (error) {
      setDeviceError(error.message);
      return false;
    }
  }, []);

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
      // Initialize devices first
      const devicesReady = await initializeDevices();
      if (!devicesReady) {
        throw new Error(deviceError);
      }

      const tokenResponse = await axios.get(
        `http://localhost:5000/api/video/token/${appointmentId}`,
        {
          headers: { Authorization: `Bearer ${authData.token}` }
        }
      );

      const { token, channelName, uid } = tokenResponse.data;

      // Set up event handlers before joining
      agoraClient.on('connection-state-change', (curState, prevState) => {
        console.log('Connection state changed:', prevState, 'to', curState);
        setConnectionState(curState);
        
        if (curState === 'DISCONNECTED') {
          handleReconnect();
        }
      });

      agoraClient.on('network-quality', (stats) => {
        console.log('Network quality:', stats);
      });

      // Join the channel with retry logic
      let retryCount = 0;
      const maxRetries = 3;
      
      while (retryCount < maxRetries) {
        try {
          await agoraClient.join(
            import.meta.env.VITE_AGORA_APP_ID || 'c3cb6505a5c34f5097c62e814c77e694',
            channelName,
            token,
            uid
          );
          break;
        } catch (error) {
          retryCount++;
          if (retryCount === maxRetries) throw error;
          await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
        }
      }

      // Create and publish local tracks with retry logic
      const [audioTrack, videoTrack] = await Promise.all([
        AgoraRTC.createMicrophoneAudioTrack({
          encoderConfig: {
            sampleRate: 48000,
            stereo: true,
            bitrate: 128
          }
        }).catch(async (error) => {
          console.error('Error creating audio track:', error);
          // Try with default settings if custom config fails
          return AgoraRTC.createMicrophoneAudioTrack();
        }),
        AgoraRTC.createCameraVideoTrack({
          encoderConfig: {
            width: 1280,
            height: 720,
            frameRate: 30,
            bitrate: 2000
          }
        }).catch(async (error) => {
          console.error('Error creating video track:', error);
          // Try with default settings if custom config fails
          return AgoraRTC.createCameraVideoTrack();
        })
      ]);

      setLocalAudioTrack(audioTrack);
      setLocalVideoTrack(videoTrack);

      // Publish tracks with retry logic
      retryCount = 0;
      while (retryCount < maxRetries) {
        try {
          await agoraClient.publish([audioTrack, videoTrack]);
          break;
        } catch (error) {
          retryCount++;
          if (retryCount === maxRetries) throw error;
          await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
        }
      }

      // Handle user joined event
      agoraClient.on('user-published', async (user, mediaType) => {
        try {
          await agoraClient.subscribe(user, mediaType);
          if (mediaType === 'video') {
            setRemoteUsers(prev => [...prev, user]);
          }
          if (mediaType === 'audio') {
            user.audioTrack?.play();
          }
        } catch (error) {
          console.error('Error subscribing to user:', error);
        }
      });

      // Handle user left event
      agoraClient.on('user-unpublished', (user) => {
        setRemoteUsers(prev => prev.filter(u => u.uid !== user.uid));
      });

    } catch (error) {
      console.error('Error initializing Agora:', error);
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

  const handleReconnect = async () => {
    if (isReconnecting) return;
    setIsReconnecting(true);
    
    try {
      await agoraClient.leave();
      await joinChannel();
    } catch (error) {
      console.error('Reconnection failed:', error);
      setError('Connection lost. Please refresh the page to reconnect.');
    } finally {
      setIsReconnecting(false);
    }
  };

  useEffect(() => {
    if (!appointment) return;

    joinChannel();

    return () => {
      if (localVideoTrack) {
        localVideoTrack.close();
      }
      if (localAudioTrack) {
        localAudioTrack.close();
      }
      agoraClient.leave();
    };
  }, [appointment]);

  const toggleMute = async () => {
    try {
      if (localAudioTrack) {
        await localAudioTrack.setEnabled(!isMuted);
        setIsMuted(!isMuted);
      }
    } catch (error) {
      console.error('Error toggling mute:', error);
      setError('Failed to toggle microphone. Please try again.');
    }
  };

  const toggleVideo = async () => {
    try {
      if (localVideoTrack) {
        await localVideoTrack.setEnabled(!isVideoOff);
        setIsVideoOff(!isVideoOff);
      }
    } catch (error) {
      console.error('Error toggling video:', error);
      setError('Failed to toggle camera. Please try again.');
    }
  };

  const toggleFullscreen = () => {
    const videoContainer = document.getElementById('video-container');
    if (!document.fullscreenElement) {
      videoContainer.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
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
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-[#2B3B3A] to-[#1A2524]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#DECEB0]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-[#2B3B3A] to-[#1A2524]">
        <div className="text-white text-center p-8 rounded-lg bg-[#2B3B3A]/50 backdrop-blur-sm">
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p className="mb-6">{error}</p>
          <div className="space-x-4">
            <button
              onClick={() => {
                setError(null);
                joinChannel();
              }}
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
    <div className="min-h-screen bg-gradient-to-br from-[#2B3B3A] to-[#1A2524] p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white">
            Consultation with {appointment?.lawyerId?.name || 'Lawyer'}
          </h2>
          <p className="text-[#DECEB0]">
            {new Date(appointment?.date).toLocaleDateString()} at {appointment?.time}
          </p>
          {connectionState !== 'CONNECTED' && (
            <p className="text-yellow-400 mt-2">
              {isReconnecting ? 'Reconnecting...' : 'Connection status: ' + connectionState}
            </p>
          )}
        </div>

        {/* Video Container */}
        <div id="video-container" className="relative rounded-2xl overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Local Video */}
            <div className="relative bg-black rounded-2xl overflow-hidden aspect-video">
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
              <div className="absolute top-4 left-4 bg-black/50 px-3 py-1 rounded-full text-white text-sm">
                You {isMuted && '(Muted)'} {isVideoOff && '(Camera Off)'}
              </div>
            </div>

            {/* Remote Video */}
            <div className="relative bg-black rounded-2xl overflow-hidden aspect-video">
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
                <div className="flex items-center justify-center h-full bg-[#1A2524]">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#DECEB0]/10 flex items-center justify-center">
                      <svg className="w-10 h-10 text-[#DECEB0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-[#DECEB0]">Waiting for the other participant to join...</p>
                  </div>
                </div>
              )}
              <div className="absolute top-4 left-4 bg-black/50 px-3 py-1 rounded-full text-white text-sm">
                {appointment?.lawyerId?.name || 'Lawyer'}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-4 bg-black/50 backdrop-blur-sm px-6 py-3 rounded-full">
            <button
              onClick={toggleMute}
              className={`p-3 rounded-full ${
                isMuted ? 'bg-red-500' : 'bg-[#DECEB0]'
              } text-[#2B3B3A] hover:bg-white transition-colors`}
              title={isMuted ? 'Unmute' : 'Mute'}
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
              title={isVideoOff ? 'Turn on camera' : 'Turn off camera'}
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
              onClick={toggleFullscreen}
              className="p-3 rounded-full bg-[#DECEB0] text-[#2B3B3A] hover:bg-white transition-colors"
              title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
              </svg>
            </button>
            <button
              onClick={endCall}
              className="p-3 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
              title="End call"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCall;