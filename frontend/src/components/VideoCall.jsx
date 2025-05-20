import React, { useState, useEffect, useRef } from 'react';
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
  const [eventListenersRegistered, setEventListenersRegistered] = useState(false);

  // Agora client setup
  const agoraClient = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
  const [localVideoTrack, setLocalVideoTrack] = useState(null);
  const [localAudioTrack, setLocalAudioTrack] = useState(null);
  const [remoteUsers, setRemoteUsers] = useState([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [callTime, setCallTime] = useState(0);

  const localVideoRef = useRef(null);
  const [localPos, setLocalPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Drag handlers for local video
  const onLocalMouseDown = (e) => {
    setDragging(true);
    setDragOffset({
      x: e.clientX - localPos.x,
      y: e.clientY - localPos.y
    });
  };
  useEffect(() => {
    const onMouseMove = (e) => {
      if (dragging) {
        setLocalPos({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y
        });
      }
    };
    const onMouseUp = () => setDragging(false);
    if (dragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [dragging, dragOffset]);

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
      // Check camera and microphone permissions first
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          frameRate: { ideal: 30 }
        }, 
        audio: true 
      });
      stream.getTracks().forEach(track => track.stop()); // Stop the test stream

      const tokenResponse = await axios.get(
        `http://localhost:5000/api/video/token/${appointmentId}`,
        {
          headers: { Authorization: `Bearer ${authData.token}` }
        }
      );

      const { token, channelName, uid } = tokenResponse.data;

      // Join the channel with the assigned UID
      await agoraClient.join(
        import.meta.env.VITE_AGORA_APP_ID || 'c3cb6505a5c34f5097c62e814c77e694',
        channelName,
        token,
        uid
      );

      // Create and publish local tracks with error handling
      try {
        const [audioTrack, videoTrack] = await Promise.all([
          AgoraRTC.createMicrophoneAudioTrack().catch(err => {
            console.error('Error creating audio track:', err);
            throw new Error('Failed to access microphone. Please check your permissions.');
          }),
          AgoraRTC.createCameraVideoTrack({
            encoderConfig: {
              width: 640,
              height: 480,
              frameRate: 30,
              bitrateMin: 600,
              bitrateMax: 2000
            }
          }).catch(err => {
            console.error('Error creating video track:', err);
            throw new Error('Failed to access camera. Please check your permissions.');
          })
        ]);

        setLocalAudioTrack(audioTrack);
        setLocalVideoTrack(videoTrack);
        await agoraClient.publish([audioTrack, videoTrack]);

        // Subscribe to already published users (for late joiners)
        agoraClient.remoteUsers.forEach(async (user) => {
          if (user.hasVideo) {
            await agoraClient.subscribe(user, 'video');
            setRemoteUsers(prev => {
              const filtered = prev.filter(u => u.uid !== user.uid);
              return [...filtered, user];
            });
          }
          if (user.hasAudio) {
            await agoraClient.subscribe(user, 'audio');
            user.audioTrack?.play();
          }
        });

        // Register Agora event listeners ONCE
        if (!eventListenersRegistered) {
          // Handle user published (remote user joins)
          agoraClient.on('user-published', async (user, mediaType) => {
            try {
              await agoraClient.subscribe(user, mediaType);
              if (mediaType === 'video') {
                setRemoteUsers(prev => {
                  // Remove any existing user with the same UID
                  const filtered = prev.filter(u => u.uid !== user.uid);
                  return [...filtered, user];
                });
              }
              if (mediaType === 'audio') {
                user.audioTrack?.play();
              }
            } catch (err) {
              console.error('Error subscribing to user:', err);
              setError('Failed to connect to remote user. Please try again.');
            }
          });
          // Handle user unpublished (remote user leaves)
          agoraClient.on('user-unpublished', (user) => {
            setRemoteUsers(prev => prev.filter(u => u.uid !== user.uid));
          });
          setEventListenersRegistered(true);
        }

      } catch (trackError) {
        throw new Error(trackError.message || 'Failed to initialize camera or microphone');
      }

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
      // Cleanup function
      const cleanup = async () => {
        try {
          if (localVideoTrack) {
            await agoraClient.unpublish(localVideoTrack);
            localVideoTrack.close();
          }
          if (localAudioTrack) {
            await agoraClient.unpublish(localAudioTrack);
            localAudioTrack.close();
          }
          await agoraClient.leave();
        } catch (error) {
          console.error('Error cleaning up video call:', error);
        }
      };
      
      cleanup();
    };
  }, [appointment]);

  const toggleMute = () => {
    if (localAudioTrack) {
      localAudioTrack.setEnabled(!isMuted);
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = async () => {
    try {
      if (localVideoTrack) {
        if (isVideoOff) {
          // Re-enable video
          const newVideoTrack = await AgoraRTC.createCameraVideoTrack({
            encoderConfig: {
              width: 640,
              height: 480,
              frameRate: 30,
              bitrateMin: 600,
              bitrateMax: 2000
            }
          });
          
          // Replace the old track with the new one
          await agoraClient.unpublish(localVideoTrack);
          localVideoTrack.close();
          await agoraClient.publish(newVideoTrack);
          setLocalVideoTrack(newVideoTrack);
        } else {
          // Disable video
          localVideoTrack.setEnabled(false);
        }
        setIsVideoOff(!isVideoOff);
      }
    } catch (error) {
      console.error('Error toggling video:', error);
      setError('Failed to toggle video. Please try again.');
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
      await axios.post(`http://localhost:5000/api/appointments/${appointmentId}/end-call`, {}, {
        headers: { Authorization: `Bearer ${authData.token}` }
      });
      navigate(-1);
    } catch (error) {
      console.error('Error ending call:', error);
      setError('Failed to end call properly. Please try again.');
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
      <div className="flex flex-col justify-center items-center h-screen bg-[#2B3B3A] text-white">
        <div className="text-2xl mb-4">Error</div>
        <div className="text-lg mb-8">{error}</div>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-3 bg-[#DECEB0] text-[#2B3B3A] rounded-lg hover:bg-white transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-[#232526] to-[#414345] flex flex-col">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-30 bg-[#1a2327] bg-opacity-95 shadow-md flex items-center justify-between px-8 py-3">
        <div className="flex flex-col">
          <span className="text-lg md:text-xl font-bold text-white tracking-wide">
            Video Call with {appointment?.lawyerId?.name || 'Lawyer'}
          </span>
          <span className="text-xs text-gray-400 mt-1">{formatTime(callTime)}</span>
        </div>
        <button
          onClick={endCall}
          className="ml-4 px-6 py-2 rounded-lg bg-gradient-to-r from-red-600 to-red-500 text-white font-semibold shadow-lg hover:scale-105 transition-transform duration-150"
        >
          End Call
        </button>
      </div>

      {/* Video Container */}
      <div
        id="video-container"
        className="flex-1 relative flex items-center justify-center overflow-hidden pt-20 pb-8"
        onMouseMove={() => setShowControls(true)}
      >
        {/* Remote Video or Waiting State */}
        <div className="absolute inset-0 bg-black flex items-center justify-center transition-all duration-300">
          {remoteUsers.length > 0 ? (
            remoteUsers.map(user => (
              <div key={user.uid} className="w-full h-full">
                {user.videoTrack && (
                  <div
                    ref={el => {
                      if (el) {
                        try {
                          user.videoTrack.play(el);
                        } catch (error) {
                          console.error('Error playing remote video:', error);
                        }
                      }
                    }}
                    className="w-full h-full object-cover rounded-xl shadow-2xl border-4 border-[#232526]"
                  />
                )}
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center w-full h-full">
              <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-[#DECEB0] mb-8"></div>
              <p className="text-white text-lg font-semibold mb-2">Waiting for the other participant to join…</p>
              <p className="text-gray-400 text-sm">Please keep this window open.</p>
            </div>
          )}
        </div>

        {/* Local Video (draggable) */}
        {localVideoTrack && (
          <div
            ref={localVideoRef}
            onMouseDown={onLocalMouseDown}
            style={{
              position: 'absolute',
              bottom: localPos.y || 32,
              right: localPos.x || 32,
              cursor: 'grab',
              zIndex: 20,
              width: '180px',
              height: '135px',
              borderRadius: '1rem',
              boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
              background: '#181a1b',
              border: '3px solid #DECEB0',
              overflow: 'hidden',
              transition: 'box-shadow 0.2s',
            }}
            className="select-none"
          >
            <div
              ref={el => {
                if (el) {
                  try {
                    localVideoTrack.play(el);
                  } catch (error) {
                    console.error('Error playing local video:', error);
                  }
                }
              }}
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
        )}

        {/* Controls Bar */}
        {showControls && (
          <div className="absolute left-1/2 bottom-8 transform -translate-x-1/2 z-30 flex items-center space-x-6 bg-black bg-opacity-60 rounded-full px-8 py-3 shadow-xl transition-all duration-300">
            <button
              onClick={toggleMute}
              className={`p-3 rounded-full focus:outline-none transition-colors duration-150 ${isMuted ? 'bg-red-600' : 'bg-gray-700'} text-white hover:bg-opacity-80`}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                </svg>
              ) : (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              )}
            </button>
            <button
              onClick={toggleVideo}
              className={`p-3 rounded-full focus:outline-none transition-colors duration-150 ${isVideoOff ? 'bg-red-600' : 'bg-gray-700'} text-white hover:bg-opacity-80`}
              title={isVideoOff ? 'Turn on camera' : 'Turn off camera'}
            >
              {isVideoOff ? (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                </svg>
              ) : (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
            </button>
            <button
              onClick={toggleFullscreen}
              className="p-3 rounded-full focus:outline-none bg-gray-700 text-white hover:bg-opacity-80 transition-colors duration-150"
              title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            >
              {isFullscreen ? (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M15 9h4.5M15 9V4.5M15 15v4.5M15 15h4.5M9 15H4.5M9 15v4.5" />
                </svg>
              ) : (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                </svg>
              )}
            </button>
            <button
              onClick={endCall}
              className="p-3 rounded-full focus:outline-none bg-gradient-to-r from-red-600 to-red-500 text-white hover:scale-110 transition-transform duration-150 shadow-lg"
              title="End call"
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoCall;