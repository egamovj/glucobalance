import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { db } from '../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import {
  MessageCircle, Send, ArrowLeft, User, Stethoscope, Video
} from 'lucide-react';
import './Chat.css';

interface Message {
  id: string;
  roomId: string;
  senderId: string;
  senderName: string;
  text: string;
  type?: 'text' | 'video_call' | 'video_call_ended';
  timestamp: number;
}

interface UnreadCounts {
  [roomId: string]: number;
}

const Chat: React.FC = () => {
  const { roomId } = useParams<{ roomId?: string }>();
  const navigate = useNavigate();
  const { user, profile, chatRooms, fetchChatRooms, sendMessage, markRoomAsRead, getLastReadAt } = useStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMsg, setNewMsg] = useState('');
  const [sending, setSending] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState<UnreadCounts>({});
  const [lastReadTimes, setLastReadTimes] = useState<{ [roomId: string]: number }>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isNavigatingRef = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isDoctor = profile?.role === 'doctor';

  useEffect(() => {
    fetchChatRooms();
  }, [fetchChatRooms]);

  // Load last-read timestamps for all rooms
  useEffect(() => {
    if (!user?.uid || chatRooms.length === 0) return;

    const loadReadTimes = async () => {
      const times: { [roomId: string]: number } = {};
      for (const room of chatRooms) {
        try {
          times[room.id] = await getLastReadAt(room.id);
        } catch {
          times[room.id] = 0;
        }
      }
      setLastReadTimes(times);
    };
    loadReadTimes();
  }, [user?.uid, chatRooms, getLastReadAt]);

  // Subscribe to unread message counts for all rooms (only new messages)
  useEffect(() => {
    if (!user?.uid || chatRooms.length === 0) return;

    const unsubscribes: (() => void)[] = [];

    for (const room of chatRooms) {
      const msgsRef = collection(db, 'chat_messages');
      const q = query(
        msgsRef,
        where('roomId', '==', room.id)
      );

      const unsub = onSnapshot(q, (snapshot) => {
        const lastRead = lastReadTimes[room.id] || 0;
        // Count only messages NOT sent by current user AND newer than last read time
        const unread = snapshot.docs.filter((d) => {
          const data = d.data();
          return data.senderId !== user.uid && (data.timestamp || 0) > lastRead;
        }).length;
        setUnreadCounts((prev) => ({ ...prev, [room.id]: unread }));
      }, (error) => {
        console.error('Unread count listener error:', error);
      });

      unsubscribes.push(unsub);
    }

    return () => {
      unsubscribes.forEach((unsub) => unsub());
    };
  }, [user?.uid, chatRooms, lastReadTimes]);

  // Mark room as read when entering a chat room
  useEffect(() => {
    if (!roomId || !user?.uid) return;
    markRoomAsRead(roomId).then(() => {
      // Update local lastReadTimes so badge clears immediately
      setLastReadTimes((prev) => ({ ...prev, [roomId]: Date.now() }));
      setUnreadCounts((prev) => ({ ...prev, [roomId]: 0 }));
    });
  }, [roomId, user?.uid, markRoomAsRead]);

  // Subscribe to messages for the active room
  useEffect(() => {
    if (!roomId) return;

    const msgsRef = collection(db, 'chat_messages');
    const q = query(
      msgsRef,
      where('roomId', '==', roomId)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const msgs: Message[] = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as Message[];
      msgs.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));

      // Play ringtone for NEW incoming video call messages
      const latestMsg = msgs[msgs.length - 1];
      if (latestMsg && latestMsg.type === 'video_call' && latestMsg.senderId !== user?.uid) {
        const isRecent = Date.now() - (latestMsg.timestamp || 0) < 5000;
        if (isRecent) {
          playRingtone();
        }
      }

      setMessages(msgs);
    }, (error) => {
      console.error('Chat messages listener error:', error);
    });

    return () => {
      unsub();
      stopRingtone();
    };
  }, [roomId, user?.uid]);

  const playRingtone = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/1359/1359-preview.mp3');
      audioRef.current.loop = true;
    }
    audioRef.current.play().catch(e => console.log('Audio play failed:', e));
  };

  const stopRingtone = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!newMsg.trim() || !roomId || sending) return;
    setSending(true);
    try {
      await sendMessage(roomId, newMsg.trim());
      setNewMsg('');
    } catch (err) {
      console.error('Error sending message:', err);
    }
    setSending(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSendVideoCall = async () => {
    if (!roomId || sending || isNavigatingRef.current) return;
    isNavigatingRef.current = true;
    setSending(true);
    stopRingtone();
    try {
      await sendMessage(roomId, "Video aloqa boshlandi. Qo'shilish uchun bosing.", 'video_call');
      navigate(`/video-call/${roomId}`);
    } catch (err) {
      console.error('Error starting video call:', err);
      isNavigatingRef.current = false;
    }
    setSending(false);
  };

  const activeRoom = chatRooms.find((r) => r.id === roomId);

  const formatTime = (ts: number) => {
    if (!ts) return '';
    const d = new Date(ts);
    return d.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });
  };

  // dd.mm.yyyy format
  const formatDate = (ts: number) => {
    if (!ts) return '';
    const d = new Date(ts);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}.${month}.${year}`;
  };

  // Get the date key for grouping (yyyy-mm-dd for comparison)
  const getDateKey = (ts: number) => {
    if (!ts) return '';
    const d = new Date(ts);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  // Group messages by date
  const groupedMessages: { date: string; dateFormatted: string; msgs: Message[] }[] = [];
  let currentDateKey = '';
  for (const msg of messages) {
    const dateKey = getDateKey(msg.timestamp);
    if (dateKey !== currentDateKey) {
      currentDateKey = dateKey;
      groupedMessages.push({
        date: dateKey,
        dateFormatted: formatDate(msg.timestamp),
        msgs: [msg],
      });
    } else {
      groupedMessages[groupedMessages.length - 1].msgs.push(msg);
    }
  }

  // Chat Room List View
  if (!roomId) {
    return (
      <div className="chat-container">
        <div className="chat-header-bar">
          <MessageCircle size={24} color="var(--primary)" />
          <h1>Xabarlar</h1>
        </div>

        <div className="chat-rooms-list">
          {chatRooms.length > 0 ? (
            chatRooms.map((room) => (
              <div
                key={room.id}
                className="chat-room-card glass"
                onClick={() => navigate(`/chat/${room.id}`)}
              >
                <div className="room-avatar">
                  {isDoctor ? (
                    <User size={20} />
                  ) : (
                    <Stethoscope size={20} />
                  )}
                </div>
                <div className="room-info">
                  <h4>{isDoctor ? room.patientName : room.doctorName}</h4>
                  <p className="room-last-msg">
                    {room.lastMessageType === 'video_call' ? "Video aloqa boshlandi..." :
                     (room.lastMessageType === 'video_call_ended' || room.lastMessage?.startsWith('{"startTime"')) ? "Video aloqa yakunlandi" :
                     room.lastMessage || 'Hali xabar yo\'q'}
                  </p>
                </div>
                <div className="room-meta">
                  {room.lastMessageTime && (
                    <span className="room-time">{formatDate(room.lastMessageTime)}</span>
                  )}
                  {unreadCounts[room.id] > 0 && (
                    <span className="room-unread-badge">{unreadCounts[room.id]}</span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="chat-empty">
              <MessageCircle size={48} opacity={0.2} />
              <p>Hali hech qanday suhbat yo'q</p>
              <span>
                {isDoctor
                  ? 'Bemor sahifasidan suhbat boshlang'
                  : 'Shifokor bilan bog\'lanish uchun navbat oling'}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Active Chat View
  return (
    <div className="chat-container active-chat">
      <div className="chat-header-bar active">
        <button className="chat-back-btn" onClick={() => navigate('/chat')}>
          <ArrowLeft size={20} />
        </button>
        <div className="chat-header-info">
          <div className="chat-header-avatar">
            {isDoctor ? <User size={18} /> : <Stethoscope size={18} />}
          </div>
          <div>
            <h3>{isDoctor ? activeRoom?.patientName : activeRoom?.doctorName || 'Suhbat'}</h3>
            <span className="chat-status">Online</span>
          </div>
        </div>
        <div className="chat-header-actions">
          <button 
            className="chat-action-btn video-btn" 
            onClick={handleSendVideoCall}
            title="Video qo'ng'iroq"
          >
            <Video size={20} />
          </button>
        </div>
      </div>

      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="chat-msgs-empty">
            <p>Suhbatni boshlang! 👋</p>
          </div>
        ) : (
          groupedMessages.map((group) => (
            <React.Fragment key={group.date}>
              <div className="chat-date-separator">
                <span>{group.dateFormatted}</span>
              </div>
              {group.msgs.map((msg) => (
                <div
                  key={msg.id}
                  className={`chat-msg ${msg.senderId === user?.uid ? 'sent' : 'received'}`}
                >
                  <div className={`msg-bubble ${msg.type && msg.type !== 'text' ? 'video-call-msg' : ''} ${msg.type === 'video_call_ended' ? 'video-call-summary-bubble' : ''}`}>
                    {msg.type === 'video_call' ? (
                      <div className="video-call-invitation">
                        <div className="video-invitation-content">
                          <Video size={24} />
                          <p>Video aloqa boshlandi</p>
                        </div>
                        <button 
                          className="join-call-btn"
                          onClick={() => {
                            stopRingtone();
                            navigate(`/video-call/${roomId}`);
                          }}
                        >
                          Qo'shilish
                        </button>
                      </div>
                    ) : msg.type === 'video_call_ended' ? (
                      <div className="video-call-summary">
                        <div className="summary-header">
                          <Video size={18} />
                          <span>Video aloqa yakunlandi</span>
                        </div>
                        <div className="summary-details">
                          {(() => {
                            try {
                              const meta = JSON.parse(msg.text);
                              return (
                                <>
                                  <p>Boshlandi: {formatTime(meta.startTime)}</p>
                                  <p>Davomiyligi: {meta.duration} daqiqa</p>
                                </>
                              );
                            } catch {
                              return <p>Video muloqot muvaffaqiyatli yakunlandi</p>;
                            }
                          })()}
                        </div>
                      </div>
                    ) : (
                      <p>{msg.text}</p>
                    )}
                    <span className="msg-time">{formatTime(msg.timestamp)}</span>
                  </div>
                </div>
              ))}
            </React.Fragment>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-bar">
        <input
          type="text"
          placeholder="Xabar yozing..."
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={sending}
        />
        <button
          className="send-btn"
          onClick={handleSend}
          disabled={!newMsg.trim() || sending}
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default Chat;
