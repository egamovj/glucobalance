import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { db } from '../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { ArrowLeft, Loader2 } from 'lucide-react';
import './VideoCall.css';

// Declare JitsiMeetExternalAPI on window
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
    let api: any = null;

    const initJitsi = () => {
      if (jitsiContainerRef.current && !apiRef.current) {
        const domain = 'meet.jit.si';
        const options = {
          roomName: `Glucobalance_Medical_${roomId?.replace(/[^a-zA-Z0-9]/g, '_')}`,
          width: '100%',
          height: '100%',
          parentNode: jitsiContainerRef.current,
          userInfo: {
            displayName: profile?.name || 'Foydalanuvchi',
            email: user?.email || '',
          },
          configOverwrite: {
            prejoinConfig: { enabled: false }, // Disables prejoin page
            startWithAudioMuted: false,
            disableModeratorIndicator: true,
            startScreenSharing: false,
            enableEmailInStats: false,
          },
          interfaceConfigOverwrite: {
            SHOW_JITSI_WATERMARK: false,
            SHOW_WATERMARK_FOR_GUESTS: false,
            DISABLE_VIDEO_BACKGROUND: true,
          },
        };
        api = new window.JitsiMeetExternalAPI(domain, options);
        apiRef.current = api;

        api.addEventListeners({
          readyToClose: () => handleManualExit(),
          videoConferenceTerminated: () => handleManualExit(),
        });

        setLoading(false);
      }
    };

    if (window.JitsiMeetExternalAPI) {
      initJitsi();
    } else {
      const existingScript = document.querySelector('script[src="https://meet.jit.si/external_api.js"]');
      if (existingScript) {
        existingScript.addEventListener('load', initJitsi);
      } else {
        const script = document.createElement('script');
        script.src = 'https://meet.jit.si/external_api.js';
        script.async = true;
        script.onload = initJitsi;
        document.body.appendChild(script);
      }
    }

    return () => {
      if (apiRef.current) {
        apiRef.current.dispose();
        apiRef.current = null;
      }
    };
  }, [roomId, navigate, user, profile]);

  // Listen for call termination from others
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
          <h3>Video aloqa</h3>
          <span className="status-badge">Himoyalangan</span>
        </div>
      </div>

      <div className="video-container-wrapper">
        {loading && (
          <div className="video-loader">
            <Loader2 className="animate-spin" size={48} color="var(--primary)" />
            <p>Video aloqa yuklanmoqda...</p>
          </div>
        )}
        <div ref={jitsiContainerRef} className="jitsi-container" />
      </div>
    </div>
  );
};

export default VideoCall;
