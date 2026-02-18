import React, { useState } from 'react';
import { useStore } from '../store';
import { CheckCircle2, AlertCircle, History, Calendar as CalIcon, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import './Symptoms.css';

const Symptoms: React.FC = () => {
  const { symptoms, addSymptom } = useStore();
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);

  const symptomList = [
    { id: 'dizzy', label: 'Bosh aylanishi' },
    { id: 'weak', label: 'Holsizlik' },
    { id: 'thirsty', label: 'Ko\'p chanqash' },
    { id: 'urination', label: 'Tez-tez siydik ajralishi' },
    { id: 'numb', label: 'Qo\'l-oyoq uvishishi' },
    { id: 'vision', label: 'Ko\'rish xiralashishi' },
    { id: 'heart', label: 'Yurak urish tezlashishi' }
  ];

  const toggleSymptom = (id: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    if (selectedSymptoms.length === 0) return;
    
    const entry = {
      id: Date.now(),
      symptoms: selectedSymptoms,
      timestamp: new Date().toISOString()
    };

    addSymptom(entry);
    setSelectedSymptoms([]);
    // Success feedback is handled by the updated history list
  };

  return (
    <div className="symptoms-container">
      <header className="page-header">
        <h1>Simptomlar</h1>
      </header>

      <section className="card symptom-selector">
        <h3>Bugun o'zingizni qanday his qilyapsiz?</h3>
        <p className="subtitle">Belgilari borlarini tanlang:</p>
        
        <div className="symptom-grid">
          {symptomList.map(s => (
            <button 
              key={s.id}
              className={`symptom-btn ${selectedSymptoms.includes(s.id) ? 'active' : ''}`}
              onClick={() => toggleSymptom(s.id)}
            >
              {s.label}
              {selectedSymptoms.includes(s.id) ? <CheckCircle2 size={18} /> : <div className="circle-placeholder" />}
            </button>
          ))}
        </div>

        <button 
          className="btn-primary save-btn" 
          disabled={selectedSymptoms.length === 0}
          onClick={handleSave}
        >
          Saqlash
        </button>
      </section>

      <section className="history-section">
        <div className="section-title">
          <History size={18} />
          <h3>Oxirgi yozuvlar</h3>
        </div>

        <div className="symptom-history">
          {symptoms.length === 0 ? (
            <p className="empty-state">Hali ma'lumotlar yo'q.</p>
          ) : (
            symptoms.map(log => (
              <div key={log.id} className="card symptom-log-item">
                <div className="log-header">
                  <div className="log-time">
                    <CalIcon size={14} />
                    <span>{format(new Date(log.timestamp), 'dd-MMMM, HH:mm')}</span>
                  </div>
                  <span className="count-badge">{log.symptoms.length} ta belgi</span>
                </div>
                <div className="symptom-tags">
                  {log.symptoms.map((sId: string) => (
                    <span key={sId} className="symptom-tag">
                      {symptomList.find(s => s.id === sId)?.label}
                    </span>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="card promo-card glass">
        <AlertCircle size={32} color="var(--primary)" />
        <div className="promo-content">
          <h4>Tahlil va Xulosa</h4>
          <p>Haftalik simptomlar va glyukoza bog'liqligini ko'ring.</p>
          <button className="text-btn">Batafsil <ArrowRight size={16} /></button>
        </div>
      </section>
    </div>
  );
};

export default Symptoms;
