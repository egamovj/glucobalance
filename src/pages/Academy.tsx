import React, { useState } from 'react';
import { Search, PlayCircle, BookOpen, ChevronRight, HelpCircle, Info } from 'lucide-react';
import './Academy.css';

const Academy: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const articles = [
    {
      id: 1,
      title: 'Qandli diabet nima?',
      category: 'Asoslar',
      duration: '5 daqiqa',
      type: 'text'
    },
    {
      id: 2,
      title: '1-tur va 2-tur farqi',
      category: 'Asoslar',
      duration: '8 daqiqa',
      type: 'video'
    },
    {
      id: 3,
      title: 'To\'g\'ri ovqatlanish tamoyillari',
      category: 'Parhez',
      duration: '10 daqiqa',
      type: 'text'
    },
    {
      id: 4,
      title: 'NAN (Non birligi) nima?',
      category: 'Hisoblash',
      duration: '6 daqiqa',
      type: 'video'
    },
    {
      id: 5,
      title: 'Gipoglikemiyada birinchi yordam',
      category: 'Favqulodda',
      duration: '4 daqiqa',
      type: 'text'
    }
  ];

  const filteredArticles = articles.filter(a => 
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    a.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const diagnostics = [
    {
      title: 'Och qoringa qon tahlili',
      description: '8–10 soat ovqat yemay topshiriladi.',
      levels: [
        { range: '3.3 – 5.5 mmol/L', status: 'Me\'yor', color: 'var(--success)' },
        { range: '5.6 – 6.9 mmol/L', status: 'Xavf (prediabet)', color: 'var(--warning)' },
        { range: '7.0+ mmol/L', status: 'Diabet ehtimoli', color: 'var(--error)' }
      ]
    },
    {
      title: 'Ovqatdan 2 soat keyin',
      description: 'Ovqatdan keyin qand miqdori o\'zgarishini tekshirish.',
      levels: [
        { range: '7.8 mmol/L gacha', status: 'Me\'yor', color: 'var(--success)' },
        { range: '11.1+ mmol/L', status: 'Diabet ehtimoli', color: 'var(--error)' }
      ]
    },
    {
      title: 'HbA1c (Glokirlangan gemoglobin)',
      description: 'Oxirgi 3 oylik o\'rtacha qand darajasi.',
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
        {filteredArticles.map(article => (
          <div key={article.id} className="card article-card">
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
        ))}
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
