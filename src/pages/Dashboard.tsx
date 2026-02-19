import React from 'react';
import { useStore } from '../store';
import { Activity, Calculator as CalcIcon, Heart, AlertCircle, ChevronRight, User, Utensils, BookOpen } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const { profile, glucoseLogs } = useStore();
  const lastLog = glucoseLogs[0];

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="user-profile">
          <p>Xush kelibsiz 👋</p>
          <h3>Salom, {profile?.name || 'Foydalanuvchi'}!</h3>
        </div>
      </header>

      <section className="glance-cards">
        <div className="card glance-card primary glass">
          <div className="glance-info">
            <span>Oxirgi qand miqdori</span>
            <h2>{lastLog?.value || '--'} <sub>mmol/l</sub></h2>
            <p>{lastLog ? 'Oxirgi o\'lcham: ' + lastLog.category : 'Hali ma\'lumot kiritilmagan'}</p>
          </div>
        </div>
        
        <div className="glance-sub-cards">
          <div className="card mini-glance-card">
            <div className="icon-box" style={{ background: '#fef2f2' }}><Heart size={24} color="#ef4444" /></div>
            <div className="info">
              <span>Tana massasi indeksi (BMI)</span>
              <p>{profile ? (profile.weight / Math.pow(profile.height / 100, 2)).toFixed(1) : '--'}</p>
            </div>
          </div>
          <div className="card mini-glance-card">
            <div className="icon-box" style={{ background: '#f0fdfa' }}><CalcIcon size={24} color="var(--primary)" /></div>
            <div className="info">
              <span>Insulin dozasi (NAN)</span>
              <p>{profile?.nanInsulin || '1.0'} birlik</p>
            </div>
          </div>
        </div>
      </section>

      <section className="quick-actions">
        <h3>Tezkor xizmatlar</h3>
        <div className="actions-grid">
          <NavLink to="/glucose" className="action-item">
            <div className="action-icon" style={{ background: '#f0fdfa' }}><Activity color="var(--primary)" /></div>
            <span>Qand darajasi</span>
          </NavLink>
          <NavLink to="/calculator" className="action-item">
            <div className="action-icon" style={{ background: '#f0fdf4' }}><CalcIcon color="#10b981" /></div>
            <span>Insulin dozasi</span>
          </NavLink>
          <NavLink to="/symptoms" className="action-item">
            <div className="action-icon" style={{ background: '#fffbeb' }}><AlertCircle color="#f59e0b" /></div>
            <span>Simptomlar</span>
          </NavLink>
          <NavLink to="/food-gi" className="action-item">
            <div className="action-icon" style={{ background: '#fef2f2' }}><Utensils color="#ef4444" /></div>
            <span>GI Katalog</span>
          </NavLink>
          <NavLink to="/academy" className="action-item">
            <div className="action-icon" style={{ background: '#e0f2fe' }}><BookOpen color="#0ea5e9" /></div>
            <span>Akademiya</span>
          </NavLink>
          <NavLink to="/profile" className="action-item">
            <div className="action-icon" style={{ background: '#f8fafc' }}><User color="#64748b" /></div>
            <span>Profil</span>
          </NavLink>
        </div>
      </section>

      <section className="recent-activity">
        <div className="section-header">
          <h3>Oxirgi o'lchovlar</h3>
          <NavLink to="/glucose" className="see-all">Barchasini ko'rish <ChevronRight size={16} /></NavLink>
        </div>
        {glucoseLogs.length === 0 ? (
          <div className="card empty-state-card" style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ color: 'var(--text-muted)' }}>Hali hech qanday o'lchov kiritilmagan.</p>
          </div>
        ) : (
          glucoseLogs.slice(0, 3).map(log => (
            <div key={log.id} className="card activity-item">
              <div className="activity-icon"><Activity size={20} color="var(--primary)" /></div>
              <div className="activity-info">
                <p>Qand miqdori o'lchandi</p>
                <span>{log.category}</span>
              </div>
              <div className="activity-value">{log.value} mmol/l</div>
            </div>
          ))
        )}
      </section>
    </div>
  );
};

export default Dashboard;
