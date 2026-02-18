import React, { useState } from 'react';
import { Search, PlayCircle, BookOpen, ChevronRight, HelpCircle } from 'lucide-react';
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

      <section className="featured-card">
        <div className="featured-content">
          <span className="featured-badge">Yangi dars</span>
          <h2>Insulin turlari va ularni qo'llash</h2>
          <p>Glyukoza darajasini to'g'ri boshqarish uchun insulin haqida bilishingiz kerak bo'lgan hamma narsa.</p>
          <button className="btn-primary">Boshlash</button>
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
