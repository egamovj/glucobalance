import React, { useMemo } from 'react';
import { useStore } from '../store';
import { Droplet, Plus } from 'lucide-react';
import './WaterTracker.css';

const WaterTracker: React.FC = () => {
  const { waterLogs, profile, addWaterLog } = useStore();
  
  const todayWater = useMemo(() => {
    const today = new Date().toDateString();
    return waterLogs
      .filter(log => new Date(log.timestamp).toDateString() === today)
      .reduce((sum, log) => sum + log.amount, 0);
  }, [waterLogs]);

  const target = profile?.waterGoal || 2000;
  const percentage = Math.min(Math.round((todayWater / target) * 100), 100);

  return (
    <div className="card water-tracker-card glass">
      <div className="section-title">
        <Droplet size={20} color="#0ea5e9" />
        <h3>Suv nazorati</h3>
      </div>

      <div className="water-visual-container">
        <div className="water-fluid" style={{ height: `${percentage}%` }}>
          <div className="water-wave"></div>
        </div>
        <span className="water-percentage">{percentage}%</span>
      </div>

      <div className="water-info">
        <h4>{todayWater} ml</h4>
        <p>Kunlik maqsad: {target} ml</p>
      </div>

      <div className="water-actions">
        <button className="water-btn" onClick={() => addWaterLog(250)}>
          <Plus size={16} /> 250ml
        </button>
        <button className="water-btn" onClick={() => addWaterLog(500)}>
          <Plus size={16} /> 500ml
        </button>
      </div>

      <div className="water-target-info">
        <span>Qoldi: {Math.max(target - todayWater, 0)} ml</span>
        <span>{percentage >= 100 ? '🎉 Maqsad bajarildi!' : '💦 Ichishda davom eting'}</span>
      </div>
    </div>
  );
};

export default WaterTracker;
