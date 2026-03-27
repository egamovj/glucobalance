import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { db } from '../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { ArrowLeft, Loader2 } from 'lucide-react';
import './VideoCall.css';

declare global {
  interface Window {
    JitsiMeetExternalAPI: any;
  }
}

const VideoCall: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { user, profile, sendMessage } = useStore();
  const jitsiContainerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const apiRef = useRef<any>(null);
  const joinTimeRef = useRef(Date.now());

  useEffect(() => {
    if (!roomId || !user || !profile) return;

    // Load Jitsi script it not already present
    const loadJitsiScript = () => {
      return new Promise((resolve) => {
        if (window.JitsiMeetExternalAPI) {
          resolve(true);
          return;
        }
        const script = document.createElement('script');
        script.src = 'https://meet.jit.si/external_api.js';
        script.async = true;
        script.onload = () => resolve(true);
        document.body.appendChild(script);
      });
    };

    const initJitsi = async () => {
      await loadJitsiScript();

      if (jitsiContainerRef.current && !apiRef.current) {
        const domain = 'meet.jit.si';
        const sanitizedRoomId = roomId.replace(/[^a-zA-Z0-9_-]/g, '_');
        const roomName = `Glucobalance_Medical_${sanitizedRoomId}`;

        const options = {
          roomName: roomName,
          width: '100%',
          height: '100%',
          parentNode: jitsiContainerRef.current,
          userInfo: {
            displayName: profile.name || (profile.role === 'doctor' ? 'Shifokor' : 'Bemor'),
          },
          configOverwrite: {
            startWithAudioMuted: false,
            disableThirdPartyRequests: true,
            prejoinPageEnabled: false,
            enableWelcomePage: false,
            disableInviteFunctions: true,
            enableClosePage: false,
            hideConferenceTimer: false,
            // Hiding promotional and distracting elements
            disableSelfView: false,
            displayInviteUrl: false,
            doNotStoreRoom: true,
            giphy: { enabled: false },
          },
          interfaceConfigOverwrite: {
            SHOW_JITSI_WATERMARK: false,
            SHOW_WATERMARK_FOR_GUESTS: false,
            SHOW_BRAND_WATERMARK: false,
            SHOW_PROMOTIONAL_CLOSE_PAGE: false,
            GENERATE_ROOMNAMES_ON_WELCOME_PAGE: false,
            DISPLAY_WELCOME_PAGE_CONTENT: false,
            APP_NAME: 'GlucoBalance',
            NATIVE_APP_BANNER: { enabled: false },
            MOBILE_APP_BANNER: { enabled: false },
            AUTHENTICATION_ENABLE: false,
            TOOLBAR_BUTTONS: [
              'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
              'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
              'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
              'videoquality', 'filmstrip', 'invite', 'feedback', 'stats', 'shortcuts',
              'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone',
              'security'
            ].filter(btn => ['microphone', 'camera', 'hangup', 'tileview', 'chat', 'settings'].includes(btn))
          },
        };

        const api = new window.JitsiMeetExternalAPI(domain, options);
        apiRef.current = api;

        api.addEventListeners({
          readyToClose: handleManualExit,
          videoConferenceTerminated: handleManualExit,
          participantJoined: () => setLoading(false),
        });

        // Fallback for loader
        setTimeout(() => setLoading(false), 5000);
      }
    };

    initJitsi();

    return () => {
      if (apiRef.current) {
        apiRef.current.dispose();
        apiRef.current = null;
      }
    };
  }, [roomId, user, profile, navigate]);

  // Listen for call termination signaling from Firestore
  useEffect(() => {
    if (!roomId) return;
    const q = query(
      collection(db, 'chat_messages'),
      where('roomId', '==', roomId),
      where('type', '==', 'video_call_ended')
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(d => ({ timestamp: d.data().timestamp }));
      const hasPostJoinEnd = docs.some(d => d.timestamp > joinTimeRef.current);
      if (hasPostJoinEnd) {
        if (apiRef.current) apiRef.current.dispose();
        navigate(`/chat/${roomId}`);
      }
    });

    return () => unsub();
  }, [roomId, navigate]);

  const handleManualExit = async () => {
    if (profile?.role === 'doctor' && roomId) {
      try {
        const durationMs = Date.now() - joinTimeRef.current;
        const durationMinutes = Math.max(1, Math.round(durationMs / 60000));
        const callMetadata = {
          startTime: joinTimeRef.current,
          duration: durationMinutes,
          endedAt: Date.now()
        };
        await sendMessage(roomId, JSON.stringify(callMetadata), 'video_call_ended');
      } catch (err) {
        console.error('Error sending termination message:', err);
      }
    }
    if (apiRef.current) apiRef.current.dispose();
    if (roomId) navigate(`/chat/${roomId}`);
  };

  return (
    <div className="video-call-page">
      <div className="video-call-header glass">
        <button className="back-btn" onClick={handleManualExit}>
          <ArrowLeft size={20} />
          <span>Suhbatni yakunlash</span>
        </button>
        <div className="call-info">
          <h3>Video muloqot</h3>
          <span className="status-badge">Himoyalangan aloqa</span>
        </div>
      </div>

      <div className="video-container-wrapper">
        {loading && (
          <div className="video-loader">
            <Loader2 className="animate-spin" size={48} color="var(--primary)" />
            <p>Video muloqot tayyorlanmoqda...</p>
          </div>
        )}
        <div ref={jitsiContainerRef} className="jitsi-container" />
      </div>
    </div>
  );
};

export default VideoCall;
