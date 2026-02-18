import React, { useState } from 'react';
import { useStore } from '../store';
import { Plus, History, TrendingUp, Clock, Calendar as CalIcon } from 'lucide-react';
import { format } from 'date-fns';
import './Glucose.css';

const Glucose: React.FC = () => {
  const { glucoseLogs, addGlucoseLog } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [value, setValue] = useState('');
  const [category, setCategory] = useState('och qoringa'); // Default: Fasting

  const categories = [
    'Ertalab och qoringa',
    'Ovqatdan oldin',
    'Ovqatdan keyin (1 soat)',
    'Ovqatdan keyin (2 soat)',
    'Uxlashdan oldin',
    'Favqulodda'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value) return;

    const log = {
      id: Date.now(),
      value: parseFloat(value),
      category,
      timestamp: new Date().toISOString()
    };

    addGlucoseLog(log);
    setValue('');
    setShowForm(false);
  };

  const getStatus = (val: number) => {
    if (val < 3.9) return { text: 'Gipoglikemiya', color: 'var(--error)' };
    if (val > 10.0) return { text: 'Yuqori', color: 'var(--warning)' };
    return { text: 'Normal', color: 'var(--success)' };
  };

  return (
    <div className="glucose-container">
      <header className="page-header">
        <h1>Glikemik nazorat</h1>
        <button className="btn-fab" onClick={() => setShowForm(!showForm)}>
          <Plus size={24} />
        </button>
      </header>

      {showForm && (
        <form className="card glucose-form glass" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Glyukoza miqdori (mmol/l)</label>
            <input 
              type="number" 
              step="0.1" 
              autoFocus
              value={value} 
              onChange={(e) => setValue(e.target.value)} 
              placeholder="0.0"
              required 
            />
          </div>
          <div className="category-chips">
            {categories.map(cat => (
              <button 
                key={cat}
                type="button"
                className={`chip ${category === cat ? 'active' : ''}`}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
          <button type="submit" className="btn-primary w-full">Saqlash</button>
        </form>
      )}

      <section className="summary-cards">
        <div className="card mini-card">
          <TrendingUp size={20} color="var(--primary)" />
          <span>O'rtacha</span>
          <h3>{glucoseLogs.length > 0 ? (glucoseLogs.reduce((acc, log) => acc + log.value, 0) / glucoseLogs.length).toFixed(1) : '0.0'}</h3>
        </div>
        <div className="card mini-card">
          <Clock size={20} color="var(--primary)" />
          <span>Oxirgi</span>
          <h3>{glucoseLogs[0]?.value || '0.0'}</h3>
        </div>
      </section>

      <section className="history-section">
        <div className="section-title">
          <History size={18} />
          <h3>Tarix</h3>
        </div>
        
        <div className="logs-list">
          {glucoseLogs.length === 0 ? (
            <p className="empty-state">Hali ma'lumotlar kiritilmagan.</p>
          ) : (
            glucoseLogs.map(log => {
              const status = getStatus(log.value);
              return (
                <div key={log.id} className="card log-item">
                  <div className="log-main">
                    <span className="log-value">{log.value} <sub>mmol/l</sub></span>
                    <span className="log-category">{log.category}</span>
                  </div>
                  <div className="log-meta">
                    <div className="log-time">
                      <CalIcon size={12} />
                      <span>{format(new Date(log.timestamp), 'HH:mm, dd-MMM')}</span>
                    </div>
                    <span className="log-status" style={{ color: status.color, background: `${status.color}15` }}>
                      {status.text}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
};

export default Glucose;
