import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import {
  Stethoscope, Users, Activity, Droplets, AlertCircle,
  Search, ChevronRight, X, MessageCircle, Calendar,
  Heart, Ruler, Weight, TrendingUp, ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './DoctorDashboard.css';

const DoctorDashboard: React.FC = () => {
  const { profile, patients, fetchAllPatients, fetchPatientDetail, getOrCreateChatRoom, user } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [patientDetail, setPatientDetail] = useState<any>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [activeDetailTab, setActiveDetailTab] = useState<'glucose' | 'symptoms' | 'water'>('glucose');
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllPatients();
  }, [fetchAllPatients]);

  const filteredPatients = patients.filter((p: any) =>
    p.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePatientClick = async (patient: any) => {
    setSelectedPatient(patient);
    setLoadingDetail(true);
    setActiveDetailTab('glucose');
    try {
      const detail = await fetchPatientDetail(patient.uid);
      setPatientDetail(detail);
    } catch (err) {
      console.error('Error fetching patient detail:', err);
    }
    setLoadingDetail(false);
  };

  const handleStartChat = async () => {
    if (!selectedPatient || !user || !profile) return;
    try {
      const roomId = await getOrCreateChatRoom(
        selectedPatient.uid,
        selectedPatient.name,
        user.uid,
        profile.name
      );
      navigate(`/chat/${roomId}`);
    } catch (err) {
      console.error('Error creating chat room:', err);
    }
  };

  const closeDetail = () => {
    setSelectedPatient(null);
    setPatientDetail(null);
  };

  const getGlucoseColor = (value: number) => {
    if (value < 3.9) return '#ef4444';
    if (value > 10) return '#ef4444';
    if (value > 7.8) return '#f59e0b';
    return '#10b981';
  };

  return (
    <div className="doctor-dashboard">
      <header className="doctor-header">
        <div className="doctor-header-info">
          <div className="doctor-avatar">
            <Stethoscope size={28} color="white" />
          </div>
          <div>
            <h1>Shifokor Paneli</h1>
            <p>Salom, Dr. {profile?.name || 'Shifokor'}!</p>
          </div>
        </div>
        <div className="doctor-stats">
          <div className="doctor-stat-card glass">
            <Users size={20} color="var(--primary)" />
            <div>
              <span>{patients.length}</span>
              <label>Bemorlar</label>
            </div>
          </div>
        </div>
      </header>

      {/* Patient Detail Modal */}
      {selectedPatient && (
        <div className="patient-detail-overlay" onClick={closeDetail}>
          <div className="patient-detail-modal glass" onClick={(e) => e.stopPropagation()}>
            <div className="detail-header">
              <button className="back-btn" onClick={closeDetail}>
                <ArrowLeft size={20} />
              </button>
              <div className="detail-patient-info">
                <div className="detail-avatar">{selectedPatient.name?.charAt(0)?.toUpperCase()}</div>
                <div>
                  <h2>{selectedPatient.name}</h2>
                  <span className="detail-badge">
                    {selectedPatient.type === 'type1' ? '1-tur Diabet' : '2-tur Diabet'}
                  </span>
                </div>
              </div>
              <div className="detail-actions">
                <button className="action-btn chat-btn" onClick={handleStartChat}>
                  <MessageCircle size={18} />
                  <span>Chat</span>
                </button>
                <button className="action-btn appt-btn" onClick={() => navigate('/appointments')}>
                  <Calendar size={18} />
                  <span>Navbat</span>
                </button>
              </div>
            </div>

            {/* Patient Stats */}
            <div className="detail-stats">
              <div className="detail-stat">
                <Weight size={16} color="var(--primary)" />
                <span>{selectedPatient.weight || '--'} kg</span>
              </div>
              <div className="detail-stat">
                <Ruler size={16} color="var(--secondary)" />
                <span>{selectedPatient.height || '--'} sm</span>
              </div>
              <div className="detail-stat">
                <Heart size={16} color="#ef4444" />
                <span>BMI: {selectedPatient.weight && selectedPatient.height
                  ? (selectedPatient.weight / Math.pow(selectedPatient.height / 100, 2)).toFixed(1)
                  : '--'}</span>
              </div>
              <div className="detail-stat">
                <TrendingUp size={16} color="#f59e0b" />
                <span>Maqsad: {selectedPatient.targetGlucose || '--'} mmol/l</span>
              </div>
            </div>

            {/* Detail Tabs */}
            <div className="detail-tabs">
              <button
                className={`detail-tab ${activeDetailTab === 'glucose' ? 'active' : ''}`}
                onClick={() => setActiveDetailTab('glucose')}
              >
                <Activity size={16} />
                Glyukoza
              </button>
              <button
                className={`detail-tab ${activeDetailTab === 'symptoms' ? 'active' : ''}`}
                onClick={() => setActiveDetailTab('symptoms')}
              >
                <AlertCircle size={16} />
                Simptomlar
              </button>
              <button
                className={`detail-tab ${activeDetailTab === 'water' ? 'active' : ''}`}
                onClick={() => setActiveDetailTab('water')}
              >
                <Droplets size={16} />
                Suv
              </button>
            </div>

            {/* Detail Content */}
            <div className="detail-content">
              {loadingDetail ? (
                <div className="detail-loading">
                  <div className="loader"></div>
                </div>
              ) : (
                <>
                  {activeDetailTab === 'glucose' && (
                    <div className="detail-list">
                      {patientDetail?.glucoseLogs?.length > 0 ? (
                        patientDetail.glucoseLogs.map((log: any, idx: number) => (
                          <div key={idx} className="detail-item glucose-item">
                            <div className="detail-item-icon" style={{ background: getGlucoseColor(log.value) + '15', color: getGlucoseColor(log.value) }}>
                              <Activity size={16} />
                            </div>
                            <div className="detail-item-info">
                              <span className="detail-item-value" style={{ color: getGlucoseColor(log.value) }}>
                                {log.value} mmol/l
                              </span>
                              <span className="detail-item-meta">{log.category} • {log.date || ''}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="detail-empty">
                          <Activity size={32} opacity={0.3} />
                          <p>Glyukoza ma'lumotlari topilmadi</p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeDetailTab === 'symptoms' && (
                    <div className="detail-list">
                      {patientDetail?.symptoms?.length > 0 ? (
                        patientDetail.symptoms.map((s: any, idx: number) => (
                          <div key={idx} className="detail-item">
                            <div className="detail-item-icon" style={{ background: '#fef3c7', color: '#f59e0b' }}>
                              <AlertCircle size={16} />
                            </div>
                            <div className="detail-item-info">
                              <span className="detail-item-value">{s.symptoms?.join(', ') || 'Noma\'lum'}</span>
                              <span className="detail-item-meta">{s.date || ''}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="detail-empty">
                          <AlertCircle size={32} opacity={0.3} />
                          <p>Simptom ma'lumotlari topilmadi</p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeDetailTab === 'water' && (
                    <div className="detail-list">
                      {patientDetail?.waterLogs?.length > 0 ? (
                        patientDetail.waterLogs.map((w: any, idx: number) => (
                          <div key={idx} className="detail-item">
                            <div className="detail-item-icon" style={{ background: '#dbeafe', color: '#3b82f6' }}>
                              <Droplets size={16} />
                            </div>
                            <div className="detail-item-info">
                              <span className="detail-item-value">{w.amount} ml</span>
                              <span className="detail-item-meta">{w.timestamp ? new Date(w.timestamp).toLocaleString('uz-UZ') : ''}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="detail-empty">
                          <Droplets size={32} opacity={0.3} />
                          <p>Suv ma'lumotlari topilmadi</p>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Patient List */}
      <section className="patients-section">
        <div className="patients-header">
          <h2><Users size={22} /> Bemorlar ro'yxati</h2>
          <div className="search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Bemor izlash..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="search-clear" onClick={() => setSearchQuery('')}>
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        <div className="patients-grid">
          {filteredPatients.length > 0 ? (
            filteredPatients.map((patient: any) => (
              <div
                key={patient.uid}
                className="patient-card glass"
                onClick={() => handlePatientClick(patient)}
              >
                <div className="patient-card-main">
                  <div className="patient-avatar">
                    {patient.name?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                  <div className="patient-info">
                    <h4>{patient.name || 'Noma\'lum'}</h4>
                    <div className="patient-meta">
                      <span className="patient-badge">
                        {patient.type === 'type1' ? '1-tur' : '2-tur'}
                      </span>
                      <span className="patient-detail-text">
                        {patient.weight}kg • {patient.height}sm
                      </span>
                    </div>
                  </div>
                </div>
                <ChevronRight size={20} color="var(--text-muted)" />
              </div>
            ))
          ) : (
            <div className="empty-patients">
              <Users size={48} opacity={0.2} />
              <p>{searchQuery ? 'Bemor topilmadi' : 'Bemorlar hali yo\'q'}</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default DoctorDashboard;
