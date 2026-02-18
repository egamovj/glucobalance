import React, { useState } from 'react';
import { Play, Pause, SkipForward, SkipBack, Dumbbell, Music, Wind, Globe } from 'lucide-react';
import './Healthy.css';

const Healthy: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'exercise' | 'music'>('exercise');
  const [isPlaying, setIsPlaying] = useState(false);

  const exercises = [
    { title: 'Diabet uchun tonggi badantarbiya', duration: '15 daqiqa', level: 'Oson', color: '#3b82f6' },
    { title: 'Nafas olish mashqlari (Yoga)', duration: '10 daqiqa', level: 'Oson', color: '#10b981' },
    { title: 'Uyda 20 daqiqalik kardiomashq', duration: '20 daqiqa', level: 'O\'rta', color: '#f59e0b' }
  ];

  const tracks = [
    { title: 'Dengiz to\'lqinlari', artist: 'Tabiat tovushlari' },
    { title: 'Toshkent oqshomi', artist: 'Meditatsiya' },
    { title: 'Yomg\'ir shirillashi', artist: 'Relaks' }
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
        <div className="exercise-list">
          <div className="promo-card-mini">
            <Globe size={40} color="var(--primary)" />
            <div className="promo-info">
              <h4>Jismoniy faollik</h4>
              <p>Haftada kamida 150 daqiqa mashq qiling.</p>
            </div>
          </div>
          
          {exercises.map((ex, i) => (
            <div key={i} className="card exercise-card">
              <div className="ex-icon" style={{ background: `${ex.color}15`, color: ex.color }}>
                <Play size={20} fill={ex.color} />
              </div>
              <div className="ex-info">
                <h4>{ex.title}</h4>
                <span>{ex.duration} • {ex.level}</span>
              </div>
              <div className="ex-status badge">{ex.level}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="music-player">
          <div className="now-playing card glass">
            <div className="album-art">
              <Wind size={48} color="white" />
            </div>
            <h3>{tracks[0].title}</h3>
            <p>{tracks[0].artist}</p>
            
            <div className="player-controls">
              <button className="icon-btn"><SkipBack size={24} /></button>
              <button className="play-btn" onClick={() => setIsPlaying(!isPlaying)}>
                {isPlaying ? <Pause size={32} /> : <Play size={32} />}
              </button>
              <button className="icon-btn"><SkipForward size={24} /></button>
            </div>
            
            <div className="progress-bar">
              <div className="progress" style={{ width: '40%' }}></div>
            </div>
          </div>

          <div className="playlist">
            <h3>Navbatdagi</h3>
            {tracks.map((t, i) => (
              <div key={i} className="playlist-item">
                <Music size={16} color="var(--text-muted)" />
                <div className="track-info">
                  <p>{t.title}</p>
                  <span>{t.artist}</span>
                </div>
                <Play size={14} color="var(--primary)" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Healthy;
