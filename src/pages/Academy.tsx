import React, { useState, useEffect } from 'react';
import { Search, PlayCircle, BookOpen, ChevronRight, HelpCircle, Info } from 'lucide-react';
import { useStore } from '../store';
import './Academy.css';

const Academy: React.FC = () => {
  const { lessons, fetchLessons } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<any>(null);

  useEffect(() => {
    fetchLessons();
  }, [fetchLessons]);

  const filteredArticles = lessons.filter(a => 
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    a.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const diagnostics = [
    {
      title: 'Glukozalangan gemoglobin (HbA1c)',
      description: 'Oxirgi 3 oylik o\'rtacha qand miqdori.',
      levels: [
        { range: '6.0% gacha', status: 'Me\'yor', color: 'var(--success)' },
        { range: '6.0 – 6.4%', status: 'Xavf (prediabet)', color: 'var(--warning)' },
        { range: '6.5%+ ', status: 'Diabet', color: 'var(--error)' }
      ]
    },
    {
      title: 'S-Peptid tahlili',
      description: 'Diabet turini (1 yoki 2) aniqlash uchun.',
      customNote: 'Kam bo\'lsa: 1-tur. Ko\'p bo\'lsa: 2-tur.'
    }
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [selectedArticle]);

  const currentIndex = selectedArticle 
    ? lessons.findIndex(a => a.id === selectedArticle.id) 
    : -1;

  const handleNext = () => {
    if (currentIndex < lessons.length - 1) {
      setSelectedArticle(lessons[currentIndex + 1]);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setSelectedArticle(lessons[currentIndex - 1]);
    }
  };

  if (selectedArticle) {
    return (
      <div className="academy-container lesson-page">
        <button className="back-btn" onClick={() => setSelectedArticle(null)}>
          <ChevronRight size={20} style={{ transform: 'rotate(180deg)' }} />
          Barcha darslarga qaytish
        </button>

        <article className="lesson-full-content">
          <header className="lesson-header">
            <span className="article-category">{selectedArticle.category}</span>
            <h1>{selectedArticle.title}</h1>
            <div className="article-meta">
              {selectedArticle.duration} • {selectedArticle.type === 'video' ? 'Video dars' : 'Mutolaa darsi'}
            </div>
          </header>

          {selectedArticle.type === 'video' && (
            <div className="video-placeholder">
              <PlayCircle size={48} color="white" />
              <span>Video tez kunda qo'shiladi</span>
            </div>
          )}

          <div 
            className="article-text-content"
            dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
          />

          <footer className="lesson-footer">
            <div className="lesson-nav">
              <button 
                className="nav-btn prev" 
                onClick={handlePrev} 
                disabled={currentIndex === 0}
              >
                <ChevronRight size={20} style={{ transform: 'rotate(180deg)' }} />
                <span>Oldingi dars</span>
              </button>
              
              <button 
                className="nav-btn next" 
                onClick={handleNext}
                disabled={currentIndex === lessons.length - 1}
              >
                <span>Keyingi dars</span>
                <ChevronRight size={20} />
              </button>
            </div>
            <button 
              className="btn-primary w-full" 
              style={{ marginTop: '24px' }}
              onClick={() => setSelectedArticle(null)}
            >
              Darsni yakunlash
            </button>
          </footer>
        </article>
      </div>
    );
  }

  return (
    <div className="academy-container">
      <header className="page-header">
        <h1>Diabetes Academy</h1>
      </header>

      <div className="search-bar glass">
        <Search size={20} color="var(--text-muted)" />
        <input 
          type="text" 
          placeholder="Mavzuni qidiring..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <section className="diagnostics-section">
        <div className="section-title">
          <HelpCircle size={20} color="var(--primary)" />
          <h3>Diagnostika me'yorlari</h3>
        </div>
        <div className="diag-grid">
          {diagnostics.map((diag, i) => (
            <div key={i} className="card diag-card glass">
              <h4>{diag.title}</h4>
              <p className="diag-desc">{diag.description}</p>
              {diag.levels ? (
                <div className="diag-levels">
                  {diag.levels.map((lvl, j) => (
                    <div key={j} className="diag-level-item">
                      <span className="diag-range">{lvl.range}</span>
                      <span className="diag-status" style={{ color: lvl.color, background: `${lvl.color}15` }}>
                        {lvl.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="diag-custom-note glass">
                  <Info size={16} color="var(--primary)" />
                  <span>{diag.customNote}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <div className="section-title">
        <h3>Barcha darslar</h3>
      </div>

      <div className="articles-list">
        {filteredArticles.length > 0 ? (
          filteredArticles.map(article => (
            <div 
              key={article.id} 
              className="card article-card"
              onClick={() => setSelectedArticle(article)}
              style={{ cursor: 'pointer' }}
            >
              <div className="article-icon">
                {article.type === 'video' ? <PlayCircle size={24} color="var(--primary)" /> : <BookOpen size={24} color="var(--success)" />}
              </div>
              <div className="article-info">
                <span className="article-category">{article.category}</span>
                <h4>{article.title}</h4>
                <span className="article-meta">{article.duration} • {article.type === 'video' ? 'Video' : 'Maqola'}</span>
              </div>
              <ChevronRight size={20} color="var(--text-muted)" />
            </div>
          ))
        ) : (
          <div className="no-results glass-morphism" style={{ padding: '32px', textAlign: 'center', background: 'rgba(255,255,255,0.05)' }}>
            <Info size={40} color="var(--primary)" style={{ marginBottom: '12px', opacity: 0.5 }} />
            <h4>Hozircha darslar mavjud emas</h4>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '8px' }}>
              Yangi darslar yaqin orada administrator tomonidan qo'shiladi.
            </p>
          </div>
        )}
      </div>

      <section className="quiz-promo glass">
        <HelpCircle size={32} color="var(--primary)" />
        <div>
          <h4>Bilimingizni tekshiring!</h4>
          <p>O'tgan darslar bo'yicha qisqa testdan o'ting.</p>
        </div>
        <button className="chip active">Testni boshlash</button>
      </section>
    </div>
  );
};

export default Academy;
