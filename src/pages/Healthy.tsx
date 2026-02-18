import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Dumbbell, Music, Wind, Globe } from 'lucide-react';
import './Healthy.css';

const Healthy: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'exercise' | 'music'>('exercise');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const audioRef = React.useRef<HTMLAudioElement>(null);

  const tracks = [
    { title: 'Sokin tabiat sadosi', artist: 'Meditatsiya', url: 'https://www.chosic.com/wp-content/uploads/2021/07/The-Ambient-Breeze.mp3' },
    { title: 'Tinchlantiruvchi piano', artist: 'Relaks', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
    { title: 'Yomg\'ir shirillashi', artist: 'Tabiat', url: 'https://www.chosic.com/wp-content/uploads/2021/07/Rain-on-Window.mp3' },
    { title: 'Chuqur meditatsiya', artist: 'Zen', url: 'https://www.chosic.com/wp-content/uploads/2021/04/Enchanting-Meditation.mp3' }
  ];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        setIsLoading(true);
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch((error: any) => {
            console.error("Playback error:", error);
            setIsPlaying(false);
            setIsLoading(false);
          });
        }
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const total = audioRef.current.duration;
      if (total) setProgress((current / total) * 100);
      if (current > 0 && isLoading) setIsLoading(false);
    }
  };

  const handleTrackSelect = (index: number) => {
    setCurrentTrackIndex(index);
    setIsPlaying(true);
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
    setIsPlaying(true);
  };

  const exercises = [
    { 
      title: 'Diabet uchun 10 daqiqalik kardiomashq', 
      duration: '10 daqiqa', 
      level: 'Oson', 
      color: '#3b82f6',
      videoId: 'hJbRpHZr_d0', 
      thumbnail: 'https://img.youtube.com/vi/hJbRpHZr_d0/maxresdefault.jpg'
    },
    { 
      title: 'Yoga: Qon shakarini tushirish uchun', 
      duration: '20 daqiqa', 
      level: 'Oson', 
      color: '#10b981',
      videoId: 'o_bC40d4hKs', 
      thumbnail: 'https://img.youtube.com/vi/o_bC40d4hKs/maxresdefault.jpg'
    },
    { 
      title: 'Kuch mashqlari (Gantellar bilan)', 
      duration: '15 daqiqa', 
      level: 'O\'rta', 
      color: '#f59e0b',
      videoId: '30W14G5m_7E', 
      thumbnail: 'https://img.youtube.com/vi/30W14G5m_7E/maxresdefault.jpg'
    },
    { 
      title: 'O\'tirgan holda badantarbiya', 
      duration: '12 daqiqa', 
      level: 'Oson', 
      color: '#8b5cf6',
      videoId: '9n_kXk8Gk-0', 
      thumbnail: 'https://img.youtube.com/vi/9n_kXk8Gk-0/maxresdefault.jpg'
    },
    { 
      title: 'Uyda 1 km piyoda yurish', 
      duration: '15 daqiqa', 
      level: 'Oson', 
      color: '#ec4899',
      videoId: 'enYITYwvPAQ', 
      thumbnail: 'https://img.youtube.com/vi/enYITYwvPAQ/maxresdefault.jpg'
    },
    { 
      title: 'Butun tana uchun intensiv mashq', 
      duration: '25 daqiqa', 
      level: 'Qiyin', 
      color: '#ef4444',
      videoId: 't084x3KZO04', 
      thumbnail: 'https://img.youtube.com/vi/t084x3KZO04/maxresdefault.jpg'
    }
  ];

  return (
    <div className="healthy-container">
      <header className="page-header">
        <h1>Sog'lom hayot</h1>
      </header>

      <div className="tab-switcher glass">
        <button 
          className={activeTab === 'exercise' ? 'active' : ''} 
          onClick={() => setActiveTab('exercise')}
        >
          <Dumbbell size={18} /> Mashqlar
        </button>
        <button 
          className={activeTab === 'music' ? 'active' : ''} 
          onClick={() => setActiveTab('music')}
        >
          <Music size={18} /> Musiqa
        </button>
      </div>

      {activeTab === 'exercise' ? (
        <div className="exercise-section">
          {selectedVideo && (
            <div className="video-player-container glass">
              <div className="video-header">
                <h3>{exercises.find(ex => ex.videoId === selectedVideo)?.title}</h3>
                <button className="close-btn" onClick={() => setSelectedVideo(null)}>×</button>
              </div>
              <div className="iframe-wrapper">
                <iframe 
                  src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`}
                  title="Video Player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}

          <div className="exercise-list">
            <div className="promo-card-mini">
              <Globe size={40} color="var(--primary)" />
              <div className="promo-info">
                <h4>Jismoniy faollik</h4>
                <p>Haftada kamida 150 daqiqa mashq qiling.</p>
              </div>
            </div>
            
            <div className="exercise-grid">
              {exercises.map((ex, i) => (
                <div key={i} className={`card exercise-card ${selectedVideo === ex.videoId ? 'active' : ''}`} onClick={() => setSelectedVideo(ex.videoId)}>
                  <div className="ex-thumbnail">
                    <img src={ex.thumbnail} alt={ex.title} />
                    <div className="play-overlay">
                      <Play size={24} fill="currentColor" />
                    </div>
                  </div>
                  <div className="ex-content">
                    <div className="ex-info">
                      <h4>{ex.title}</h4>
                      <span>{ex.duration} • {ex.level}</span>
                    </div>
                    <div className="ex-status badge">{ex.level}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="music-player">
          <audio 
            ref={audioRef} 
            src={tracks[currentTrackIndex].url} 
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleNext}
            onLoadStart={() => setIsLoading(true)}
            onCanPlay={() => setIsLoading(isPlaying)}
            onWaiting={() => setIsLoading(true)}
            onPlaying={() => setIsLoading(false)}
            crossOrigin="anonymous"
            onError={(e) => {
              console.error("Audio Load Error:", e);
              setIsPlaying(false);
              setIsLoading(false);
            }}
          />
          <div className="now-playing card glass">
            <div className={`album-art ${isPlaying && !isLoading ? 'animate-float' : ''} ${isLoading ? 'loading' : ''}`}>
              {isLoading ? (
                <div className="loader-mini"></div>
              ) : (
                <Wind size={48} color="white" />
              )}
            </div>
            <h3>{tracks[currentTrackIndex].title}</h3>
            <p>{tracks[currentTrackIndex].artist}</p>
            
            <div className="player-controls">
              <button className="icon-btn" onClick={handlePrev} disabled={isLoading}><SkipBack size={24} /></button>
              <button className="play-btn" onClick={() => setIsPlaying(!isPlaying)} disabled={isLoading}>
                {isLoading ? <div className="loader-mini"></div> : (isPlaying ? <Pause size={32} /> : <Play size={32} />)}
              </button>
              <button className="icon-btn" onClick={handleNext} disabled={isLoading}><SkipForward size={24} /></button>
            </div>
            
            <div className="progress-container">
              <div className="progress-bar">
                <div className="progress" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
          </div>

          <div className="playlist card">
            <h3>Navbatdagi kuylar</h3>
            <div className="playlist-items">
              {tracks.map((t, i) => (
                <div 
                  key={i} 
                  className={`playlist-item ${currentTrackIndex === i ? 'active' : ''}`}
                  onClick={() => handleTrackSelect(i)}
                >
                  <Music size={16} color={currentTrackIndex === i ? 'var(--primary)' : 'var(--text-muted)'} />
                  <div className="track-info">
                    <p>{t.title}</p>
                    <span>{t.artist}</span>
                  </div>
                  {currentTrackIndex === i && isPlaying ? (
                    <div className="playing-bars"><span></span><span></span><span></span></div>
                  ) : (
                    <Play size={14} color="var(--primary)" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Healthy;
