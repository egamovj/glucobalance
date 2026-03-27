import React, { useState } from 'react';
import { useStore } from '../store';
import { History, Clock, Calendar as CalIcon, Activity } from 'lucide-react';
import { format } from 'date-fns';
import './Insulin.css';

const Insulin: React.FC = () => {
  const { insulinLogs, addInsulinLog } = useStore();
  const [activeTab, setActiveTab] = useState<'basal' | 'bolus'>('basal');
  const [insulinName, setInsulinName] = useState('');
  
  // Basal state
  const [morningDose, setMorningDose] = useState('');
  const [eveningDose, setEveningDose] = useState('');

  // Bolus state
  const [breakfastDose, setBreakfastDose] = useState('');
  const [lunchDose, setLunchDose] = useState('');
  const [dinnerDose, setDinnerDose] = useState('');
  const [additionalDose, setAdditionalDose] = useState('');

  const handleSubmitBasal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!insulinName || (!morningDose && !eveningDose)) return;

    await addInsulinLog({
      type: 'basal',
      name: insulinName,
      doses: {
        morning: morningDose ? parseFloat(morningDose) : undefined,
        evening: eveningDose ? parseFloat(eveningDose) : undefined,
      }
    });

    setInsulinName('');
    setMorningDose('');
    setEveningDose('');
  };

  const handleSubmitBolus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!insulinName || (!breakfastDose && !lunchDose && !dinnerDose && !additionalDose)) return;

    await addInsulinLog({
      type: 'bolus',
      name: insulinName,
      doses: {
        breakfast: breakfastDose ? parseFloat(breakfastDose) : undefined,
        lunch: lunchDose ? parseFloat(lunchDose) : undefined,
        dinner: dinnerDose ? parseFloat(dinnerDose) : undefined,
        additional: additionalDose ? parseFloat(additionalDose) : undefined,
      }
    });

    setInsulinName('');
    setBreakfastDose('');
    setLunchDose('');
    setDinnerDose('');
    setAdditionalDose('');
  };

  return (
    <div className="insulin-container">
      <header className="page-header">
        <h1>Kunlik insulin</h1>
      </header>

      <div className="insulin-tabs glass">
        <button 
          className={`tab-btn ${activeTab === 'basal' ? 'active' : ''}`}
          onClick={() => setActiveTab('basal')}
        >
          <Clock size={18} />
          Basal (Uzoq ta'sirli)
        </button>
        <button 
          className={`tab-btn ${activeTab === 'bolus' ? 'active' : ''}`}
          onClick={() => setActiveTab('bolus')}
        >
          <Activity size={18} />
          Bolus (Qisqa ta'sirli)
        </button>
      </div>

      <section className="insulin-form-section">
        {activeTab === 'basal' ? (
          <form className="card insulin-form glass" onSubmit={handleSubmitBasal}>
            <h3>Basal insulin kiritish</h3>
            <div className="input-group">
              <label>Insulin nomi (masalan: Lantus, Toujeo)</label>
              <input 
                type="text" 
                value={insulinName} 
                onChange={(e) => setInsulinName(e.target.value)} 
                placeholder="Dori nomi"
                required 
              />
            </div>
            <div className="dose-grid">
              <div className="input-group">
                <label>Ertalabki doza (birlik)</label>
                <input 
                  type="number" 
                  step="0.5"
                  value={morningDose} 
                  onChange={(e) => setMorningDose(e.target.value)} 
                  placeholder="0.0"
                />
              </div>
              <div className="input-group">
                <label>Kechki doza (birlik)</label>
                <input 
                  type="number" 
                  step="0.5"
                  value={eveningDose} 
                  onChange={(e) => setEveningDose(e.target.value)} 
                  placeholder="0.0"
                />
              </div>
            </div>
            <button type="submit" className="btn-primary w-full">Saqlash</button>
          </form>
        ) : (
          <form className="card insulin-form glass" onSubmit={handleSubmitBolus}>
            <h3>Bolus insulin kiritish</h3>
            <div className="input-group">
              <label>Insulin nomi (masalan: Novorapid, Humalog)</label>
              <input 
                type="text" 
                value={insulinName} 
                onChange={(e) => setInsulinName(e.target.value)} 
                placeholder="Dori nomi"
                required 
              />
            </div>
            <div className="dose-grid-bolus">
              <div className="input-group">
                <label>Nonushta</label>
                <input 
                  type="number" 
                  step="0.5"
                  value={breakfastDose} 
                  onChange={(e) => setBreakfastDose(e.target.value)} 
                  placeholder="0"
                />
              </div>
              <div className="input-group">
                <label>Tushlik</label>
                <input 
                  type="number" 
                  step="0.5"
                  value={lunchDose} 
                  onChange={(e) => setLunchDose(e.target.value)} 
                  placeholder="0"
                />
              </div>
              <div className="input-group">
                <label>Kechki ovqat</label>
                <input 
                  type="number" 
                  step="0.5"
                  value={dinnerDose} 
                  onChange={(e) => setDinnerDose(e.target.value)} 
                  placeholder="0"
                />
              </div>
              <div className="input-group">
                <label>Qo'shimcha</label>
                <input 
                  type="number" 
                  step="0.5"
                  value={additionalDose} 
                  onChange={(e) => setAdditionalDose(e.target.value)} 
                  placeholder="0"
                />
              </div>
            </div>
            <button type="submit" className="btn-primary w-full">Saqlash</button>
          </form>
        )}
      </section>

      <section className="history-section">
        <div className="section-title">
          <History size={18} />
          <h3>Tarix</h3>
        </div>
        
        <div className="logs-list">
          {insulinLogs.length === 0 ? (
            <p className="empty-state">Hali insulin dozalari kiritilmagan.</p>
          ) : (
            insulinLogs.map(log => (
              <div key={log.id} className="card log-item">
                <div className="log-main">
                  <div className="log-type-tag" style={{ background: log.type === 'basal' ? 'var(--secondary-soft)' : 'var(--primary-soft)', color: log.type === 'basal' ? 'var(--secondary)' : 'var(--primary)' }}>
                    {log.type === 'basal' ? 'Basal' : 'Bolus'}
                  </div>
                  <span className="log-insulin-name">{log.name}</span>
                </div>
                <div className="log-doses">
                  {log.type === 'basal' ? (
                    <>
                      {log.doses.morning && <span>Ertalab: {log.doses.morning} u</span>}
                      {log.doses.evening && <span>Kechki: {log.doses.evening} u</span>}
                    </>
                  ) : (
                    <>
                      {log.doses.breakfast && <span>Non: {log.doses.breakfast} u</span>}
                      {log.doses.lunch && <span>Tush: {log.doses.lunch} u</span>}
                      {log.doses.dinner && <span>Kech: {log.doses.dinner} u</span>}
                      {log.doses.additional && <span>Qo'sh: {log.doses.additional} u</span>}
                    </>
                  )}
                </div>
                <div className="log-meta">
                  <div className="log-time">
                    <CalIcon size={12} />
                    <span>{format(new Date(log.timestamp), 'HH:mm, dd-MMM')}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default Insulin;
