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
  const [localAudioTrack, setLocalAudioTrack] = useState(null);
  const [remoteUsers, setRemoteUsers] = useState([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [showControls, setShowControls] = useState(true);
  const [callTime, setCallTime] = useState(0);

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

    // Auto-hide controls after inactivity
    let timeout;
    const handleMouseMove = () => {
      setShowControls(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setShowControls(false), 3000);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timeout);
    };
  }, [appointmentId, authData.token]);

  // Call timer
  useEffect(() => {
    let interval;
    if (remoteUsers.length > 0) {
      interval = setInterval(() => {
        setCallTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [remoteUsers.length]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const joinChannel = async () => {
    if (isJoining) return;
    setIsJoining(true);
    setError(null);

    try {
      const tokenResponse = await axios.get(
        `http://localhost:5000/api/video/token/${appointmentId}`,
        {
          headers: { Authorization: `Bearer ${authData.token}` }
        }
      );

      const { token, channelName, uid } = tokenResponse.data;

      await agoraClient.join(
        import.meta.env.VITE_AGORA_APP_ID || 'c3cb6505a5c34f5097c62e814c77e694',
        channelName,
        token,
        uid
      );

      // Create and publish local tracks
      const [audioTrack, videoTrack] = await Promise.all([
        AgoraRTC.createMicrophoneAudioTrack(),
        AgoraRTC.createCameraVideoTrack()
      ]);

      setLocalAudioTrack(audioTrack);
      setLocalVideoTrack(videoTrack);
      await agoraClient.publish([audioTrack, videoTrack]);

      // Handle user joined event
      agoraClient.on('user-published', async (user, mediaType) => {
        await agoraClient.subscribe(user, mediaType);
        if (mediaType === 'video') {
          setRemoteUsers(prev => [...prev, user]);
        }
        if (mediaType === 'audio') {
          user.audioTrack?.play();
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

  const toggleMute = () => {
    if (localAudioTrack) {
      localAudioTrack.setEnabled(!isMuted);
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (localVideoTrack) {
      localVideoTrack.setEnabled(!isVideoOff);
      setIsVideoOff(!isVideoOff);
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

  const toggleChat = () => {
    setChatOpen(!chatOpen);
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    // In a real app, you'd send this to your backend
    setMessages([
      ...messages,
      { sender: 'You', text: newMessage, timestamp: new Date() }
    ]);
    setNewMessage('');
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
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-indigo-900 to-gray-900">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-400"></div>
          <p className="text-indigo-200 mt-4 text-lg font-medium">Connecting to secure server...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-indigo-900 to-gray-900">
        <div className="text-white text-center p-8 max-w-md w-full rounded-xl bg-gray-800/80 backdrop-blur-md shadow-2xl border border-indigo-300/20">
          <div className="bg-red-500/20 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-4 text-indigo-300">Connection Error</h2>
          <p className="mb-6 text-gray-300">{error}</p>
          <div className="space-x-4">
            <button
              onClick={() => setError(null)}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-600/30"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const renderMicIcon = () => (
    isMuted ? (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
      </svg>
    ) : (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
      </svg>
    )
  );
  
  const renderVideoIcon = () => (
    isVideoOff ? (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
      </svg>
    ) : (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    )
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-gray-900 flex flex-col relative">
      {/* Call info bar */}
      <div className={`absolute top-0 left-0 right-0 bg-black/40 backdrop-blur-sm z-10 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center">
              <span className="text-white font-bold">{(appointment?.lawyerId?.name || 'Lawyer').charAt(0)}</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {appointment?.lawyerId?.name || 'Lawyer'}
              </h2>
              <div className="flex items-center space-x-2">
                <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></span>
                <p className="text-xs text-gray-300">
                  {remoteUsers.length > 0 ? 'Connected' : 'Waiting to connect...'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="bg-black/30 px-3 py-1 rounded-full flex items-center space-x-2">
              <svg className="w-4 h-4 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm text-white">{formatTime(callTime)}</span>
            </div>
            <div className="hidden md:block text-right">
              <p className="text-xs text-gray-300">
                {new Date(appointment?.date).toLocaleDateString()} at {appointment?.time}
              </p>
              <p className="text-xs text-indigo-300">Secure encrypted call</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main video container */}
      <div 
        id="video-container" 
        className="flex-1 flex relative"
        onMouseMove={() => setShowControls(true)}
      >
        {/* Remote video (large) */}
        <div className={`absolute inset-0 bg-black transition-all duration-500 ease-in-out ${chatOpen ? 'mr-80' : ''}`}>
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
            <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-900 to-black">
              <div className="text-center p-6 rounded-2xl bg-indigo-900/20 backdrop-blur-sm max-w-md">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-indigo-600/30 flex items-center justify-center border-4 border-indigo-500/30">
                  <svg className="w-12 h-12 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-indigo-300 mb-2">Waiting for {appointment?.lawyerId?.name || 'Lawyer'}</h3>
                <p className="text-gray-300 mb-4">Your call is being connected. Please wait a moment...</p>
                <div className="flex justify-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          {/* Local video (picture-in-picture) */}
          <div className="absolute bottom-24 right-6 w-48 md:w-64 aspect-video rounded-xl overflow-hidden shadow-2xl border-2 border-white/20 z-10">
            {localVideoTrack ? (
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
            ) : (
              <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">You</span>
                </div>
              </div>
            )}
            {isVideoOff && (
              <div className="absolute inset-0 bg-gray-900/80 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto rounded-full bg-indigo-600 flex items-center justify-center">
                    <span className="text-white font-bold">You</span>
                  </div>
                  <p className="text-xs text-white mt-2">Camera Off</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Chat sidebar */}
        <div className={`absolute right-0 top-0 bottom-0 w-80 bg-gray-900/80 backdrop-blur-md transform transition-transform duration-500 ease-in-out border-l border-white/10 ${chatOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex flex-col h-full">
            <div className="p-4 border-b border-white/10">
              <h3 className="text-lg font-bold text-white">Chat</h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto bg-indigo-900/50 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <p className="text-gray-400 text-sm">No messages yet</p>
                  <p className="text-gray-500 text-xs mt-2">Start the conversation by sending a message</p>
                </div>
              ) : (
                messages.map((msg, idx) => (
                  <div key={idx} className={`${msg.sender === 'You' ? 'ml-8' : 'mr-8'}`}>
                    <div className={`p-3 rounded-xl shadow-md ${msg.sender === 'You' ? 'bg-indigo-600 ml-auto' : 'bg-gray-700'}`}>
                      <p className="text-white text-sm">{msg.text}</p>
                    </div>
                    <div className="flex items-center mt-1 text-xs text-gray-400">
                      <span className="font-medium">{msg.sender}</span>
                      <span className="mx-1">•</span>
                      <span>{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <form onSubmit={sendMessage} className="p-4 border-t border-white/10">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  className="bg-indigo-600 p-2 rounded-lg text-white hover:bg-indigo-500 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className={`absolute bottom-6 left-1/2 transform -translate-x-1/2 transition-opacity duration-300 z-20 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex flex-col items-center">
          <div className="flex items-center space-x-2 mb-4">
            <div className="px-3 py-1 bg-black/40 backdrop-blur-sm rounded-full text-white text-xs">
              {remoteUsers.length > 0 ? 'Connected' : 'Waiting to connect...'}
            </div>
          </div>
          
          <div className="flex space-x-2 md:space-x-4 bg-black/40 backdrop-blur-md px-4 py-3 rounded-2xl shadow-2xl">
            <button
              onClick={toggleMute}
              className={`p-4 rounded-full ${
                isMuted ? 'bg-red-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'
              } transition-colors flex items-center justify-center`}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {renderMicIcon()}
            </button>
            
            <button
              onClick={toggleVideo}
              className={`p-4 rounded-full ${
                isVideoOff ? 'bg-red-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'
              } transition-colors flex items-center justify-center`}
              title={isVideoOff ? 'Turn on camera' : 'Turn off camera'}
            >
              {renderVideoIcon()}
            </button>
            
            <button
              onClick={toggleChat}
              className={`p-4 rounded-full ${
                chatOpen ? 'bg-indigo-600 text-white' : 'bg-white/10 text-white hover:bg-white/20'
              } transition-colors flex items-center justify-center`}
              title="Chat"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </button>

            <button
              onClick={toggleFullscreen}
              className="p-4 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors flex items-center justify-center"
              title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
              </svg>
            </button>
            
            <button
              onClick={endCall}
              className="p-4 rounded-full bg-red-600 text-white hover:bg-red-500 transition-colors flex items-center justify-center"
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