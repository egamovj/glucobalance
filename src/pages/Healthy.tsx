import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Dumbbell, Music, Wind, Globe, Loader2 } from 'lucide-react';
import { useStore } from '../store';
import './Healthy.css';

const INITIAL_TRACKS = [
  { 
    id: '1', 
    title: 'Sokin Tabiat', 
    artist: 'Nature Recovery', 
    url: 'https://youtu.be/eNUpTV9BGac?si=YHybxsPtc-SfCeRC' 
  },
  { 
    id: '2', 
    title: 'Chuqur Meditatsiya', 
    artist: 'Zen Master', 
    url: 'https://youtu.be/alU08EDp8dY?si=BhFTeKO_OYUPu1Qw' 
  },
  { 
    id: '3', 
    title: 'Relax Piano', 
    artist: 'Soul Harmony', 
    url: 'https://youtu.be/Cl1dyPcZo6s?si=sYNywdv7bXIwvf58' 
  },
  {
    id: '4',
    title: 'Koinot Sadosi',
    artist: 'Astral Flow',
    url: 'https://youtu.be/Q3CZtYHriRY?si=DPkYYyVUdsIiSklZ'
  },
  {
    id: '4',
    title: 'Rain & Birds',
    artist: 'Astral Flow',
    url: 'https://youtu.be/Lbl69TbpIzo?si=gofLyUizdaCkfeyG'
  }
];

const Healthy: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'exercise' | 'music'>('exercise');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const tracks = INITIAL_TRACKS;

  const { exercises, fetchExercises } = useStore();

  useEffect(() => {
    fetchExercises();
  }, [fetchExercises]);


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



  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    const cleanUrl = url.trim();
    
    // YouTube
    if (cleanUrl.includes('youtube.com') || cleanUrl.includes('youtu.be')) {
      const id = getYoutubeId(cleanUrl);
      return id ? `https://www.youtube.com/embed/${id}?autoplay=${isPlaying ? 1 : 0}&controls=1&modestbranding=1&rel=0` : cleanUrl;
    }
    
    // Spotify
    if (cleanUrl.includes('open.spotify.com/track/')) {
      const id = cleanUrl.split('/track/')[1]?.split('?')[0];
      return id ? `https://open.spotify.com/embed/track/${id}` : cleanUrl;
    }
    
    // SoundCloud
    if (cleanUrl.includes('soundcloud.com')) {
      return `https://w.soundcloud.com/player/?url=${encodeURIComponent(cleanUrl)}&color=%230d9488&auto_play=${isPlaying}&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false`;
    }
    
    // Epidemic Sound
    if (cleanUrl.includes('epidemicsound.com/music/tracks/')) {
      const id = cleanUrl.split('/tracks/')[1]?.split('/')[0];
      return id ? `https://player.epidemicsound.com/?track=${id}` : cleanUrl;
    }
    
    return cleanUrl;
  };


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
              {exercises.length > 0 ? (
                exercises.map((ex, i) => (
                  <div key={ex.id || i} className={`card exercise-card ${selectedVideo === ex.videoId ? 'active' : ''}`} onClick={() => setSelectedVideo(ex.videoId)}>
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
                      <div className="ex-status badge" style={{ backgroundColor: ex.color + '20', color: ex.color }}>{ex.level}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-exercises">
                  <Loader2 className="animate-spin" />
                  <p>Mashqlar yuklanmoqda...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="music-player animate-in">
          <div className="meditation-player glass">
            <div className="meditation-art-container">
              <div className={`meditation-art ${isPlaying ? 'pulsing' : ''}`}>
                <Wind size={48} color="white" />
                {isPlaying && (
                  <div className="visualizer-rings">
                    <div className="ring"></div>
                    <div className="ring"></div>
                    <div className="ring"></div>
                  </div>
                )}
              </div>
            </div>

            <div className="now-playing-header">
              <h3>{tracks[currentTrackIndex]?.title}</h3>
              <p>{tracks[currentTrackIndex]?.artist}</p>
            </div>

            <div className="meditation-controls">
              <button className="icon-btn" onClick={handlePrev}>
                <SkipBack size={24} />
              </button>
              <button className="play-btn-main" onClick={() => setIsPlaying(!isPlaying)}>
                {isPlaying ? <Pause size={32} fill="white" /> : <Play size={32} fill="white" />}
              </button>
              <button className="icon-btn" onClick={handleNext}>
                <SkipForward size={24} />
              </button>
            </div>

            {/* Hidden Bridge for YouTube Audio */}
            <div className="hidden-audio-frame">
              <iframe 
                key={currentTrackIndex}
                src={getEmbedUrl(tracks[currentTrackIndex]?.url)}
                title="Meditation Audio"
                allow="autoplay; encrypted-media"
                frameBorder="0"
              />
            </div>
          </div>

          <div className="playlist-section glass">
            <div className="playlist-header">
              <Wind size={18} color="var(--primary)" />
              <h4>Meditatsiya kuylari</h4>
            </div>
            <div className="playlist-scroll">
              {tracks.map((t, i) => (
                <div 
                  key={i} 
                  className={`meditation-track-item ${currentTrackIndex === i ? 'active' : ''}`}
                  onClick={() => handleTrackSelect(i)}
                >
                  <div className="track-icon-wrapper">
                    <Music size={14} />
                  </div>
                  <div className="track-details">
                    <p>{t.title}</p>
                    <span>{t.artist}</span>
                  </div>
                  {currentTrackIndex === i && isPlaying && (
                    <div className="playing-bars">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
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
