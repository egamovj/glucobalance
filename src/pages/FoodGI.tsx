import React, { useState } from 'react';
import { Search, Info, Apple, Cookie, Waves, Utensils } from 'lucide-react';
import './FoodGI.css';

interface FoodItem {
  name: string;
  gi: number;
  category: string;
}

const FoodGI: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Barchasi');

  const foodData: FoodItem[] = [
    // Mevalar
    { name: 'Olma', gi: 38, category: 'Mevalar' },
    { name: 'Banan', gi: 52, category: 'Mevalar' },
    { name: 'Qovun', gi: 75, category: 'Mevalar' },
    { name: 'Tarvuz', gi: 72, category: 'Mevalar' },
    { name: 'O\'rik', gi: 31, category: 'Mevalar' },
    { name: 'Gilos', gi: 22, category: 'Mevalar' },
    { name: 'Uzum', gi: 53, category: 'Mevalar' },
    
    // Sabzavotlar
    { name: 'Sabzi (pishgan)', gi: 85, category: 'Sabzavotlar' },
    { name: 'Pomidor', gi: 15, category: 'Sabzavotlar' },
    { name: 'Bodring', gi: 15, category: 'Sabzavotlar' },
    { name: 'Kartoshka (qovurilgan)', gi: 95, category: 'Sabzavotlar' },
    { name: 'Kartoshka (pishirilgan)', gi: 70, category: 'Sabzavotlar' },
    { name: 'Baqlajon', gi: 15, category: 'Sabzavotlar' },
    
    // Donli mahsulotlar
    { name: 'Oq non', gi: 70, category: 'Donli' },
    { name: 'Jovdari non (Qora non)', gi: 50, category: 'Donli' },
    { name: 'Guruch (Oq)', gi: 70, category: 'Donli' },
    { name: 'Guruch (Jigarrang)', gi: 50, category: 'Donli' },
    { name: 'Grechka', gi: 54, category: 'Donli' },
    { name: 'Makaron', gi: 45, category: 'Donli' },
    
    // Shirinliklar va ichimliklar
    { name: 'Shakar', gi: 70, category: 'Shirinliklar' },
    { name: 'Asal', gi: 60, category: 'Shirinliklar' },
    { name: 'Muzqaymoq', gi: 60, category: 'Shirinliklar' },
    { name: 'Shokolad (Achchiq)', gi: 20, category: 'Shirinliklar' },
    { name: 'Coca-Cola', gi: 70, category: 'Shirinliklar' }
  ];

  const categories = ['Barchasi', 'Mevalar', 'Sabzavotlar', 'Donli', 'Shirinliklar'];

  const getGiStatus = (gi: number) => {
    if (gi <= 55) return { label: 'Past', color: 'var(--success)' };
    if (gi <= 69) return { label: 'O\'rta', color: 'var(--warning)' };
    return { label: 'Yuqori', color: 'var(--error)' };
  };

  const filteredFood = foodData.filter(food => 
    (activeCategory === 'Barchasi' || food.category === activeCategory) &&
    food.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="food-gi-container">
      <header className="page-header">
        <h1>Glikemik Indeks Katalogi</h1>
        <div className="search-bar glass">
          <Search size={20} color="var(--text-muted)" />
          <input 
            type="text" 
            placeholder="Mahsulotni qidiring..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </header>

      <div className="category-tabs glass">
        {categories.map(cat => (
          <button 
            key={cat}
            className={activeCategory === cat ? 'active' : ''}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="gi-info-card glass">
        <Info size={24} color="var(--primary)" />
        <div className="info-content">
          <h4>Glikemik Indeks nima?</h4>
          <p>GI - mahsulotning qon qandiga ta'sir qilish tezligini ko'rsatadi. Past GI (55 dan kam) mahsulotlar qandni sekin ko'taradi va uzoq vaqt to'qlik hissini beradi.</p>
        </div>
      </div>

      <div className="food-grid">
        {filteredFood.map((food, i) => {
          const status = getGiStatus(food.gi);
          return (
            <div key={i} className="card food-card glass">
              <div className="food-header">
                <span className="food-cat-icon">
                  {food.category === 'Mevalar' && <Apple size={20} />}
                  {food.category === 'Sabzavotlar' && <Utensils size={20} />}
                  {food.category === 'Donli' && <Waves size={20} />}
                  {food.category === 'Shirinliklar' && <Cookie size={20} />}
                </span>
                <span className="food-cat-name">{food.category}</span>
              </div>
              <h4>{food.name}</h4>
              <div className="gi-value-box">
                <span className="gi-label">GI ko'rsatkichi:</span>
                <span className="gi-number" style={{ color: status.color }}>{food.gi}</span>
              </div>
              <span className="gi-badge" style={{ background: `${status.color}15`, color: status.color }}>
                {status.label} GI
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FoodGI;
