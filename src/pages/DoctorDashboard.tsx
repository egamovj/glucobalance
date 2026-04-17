import React, { useState, useEffect, useCallback } from 'react';
import { useStore } from '../store';
import type { DailyPatientReport } from '../store';
import {
  Stethoscope, Users, Activity, Droplets, AlertCircle,
  Search, ChevronRight, X, MessageCircle, Calendar,
  Heart, Ruler, Weight, TrendingUp, ArrowLeft,
  ChevronLeft, Eye, EyeOff,
  RefreshCw, FileText, UserX, CheckCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import './DoctorDashboard.css';

const DoctorDashboard: React.FC = () => {
  const {
    profile, patients, fetchAllPatients, fetchPatientDetail,
    getOrCreateChatRoom, user, dailyReports, dailyReportsLoading,
    fetchDailyReports, symptomDefinitions, fetchSymptomDefinitions
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [patientDetail, setPatientDetail] = useState<any>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [activeDetailTab, setActiveDetailTab] = useState<'glucose' | 'symptoms' | 'water' | 'insulin'>('glucose');
  const [selectedDate, setSelectedDate] = useState(() => format(new Date(), 'yyyy-MM-dd'));
  const [showNotReported, setShowNotReported] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllPatients();
    fetchSymptomDefinitions();
  }, [fetchAllPatients, fetchSymptomDefinitions]);

  // Fetch daily reports when date changes or patients load
  useEffect(() => {
    if (patients.length > 0) {
      fetchDailyReports(selectedDate);
    }
  }, [selectedDate, patients, fetchDailyReports]);

  const filteredPatients = patients.filter((p: any) =>
    (p.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDailyReports = dailyReports.filter((r) =>
    (r.patient.name || '').toLowerCase().includes(searchQuery.toLowerCase())
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

  const handleStartChat = async (patientOverride?: any) => {
    const targetPatient = patientOverride || selectedPatient;
    if (!targetPatient || !user || !profile) return;
    try {
      const roomId = await getOrCreateChatRoom(
        targetPatient.uid,
        targetPatient.name,
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

  const getGlucoseStatus = (value: number) => {
    if (value < 3.9) return 'Past';
    if (value > 10) return 'Juda yuqori';
    if (value > 7.8) return 'Yuqori';
    return 'Normal';
  };

  const changeDate = (offset: number) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + offset);
    // Don't allow future dates
    if (d > new Date()) return;
    setSelectedDate(format(d, 'yyyy-MM-dd'));
  };

  const getSymptomLabel = (id: string) => {
    const def = symptomDefinitions.find(d => d.id === id);
    return def ? def.label : id;
  };

  const isToday = selectedDate === format(new Date(), 'yyyy-MM-dd');

  const handleRefresh = useCallback(() => {
    fetchDailyReports(selectedDate);
  }, [selectedDate, fetchDailyReports]);

  // Compute summary stats
  const reportedPatients = filteredDailyReports.filter((r) => r.hasData);
  const notReportedPatients = filteredDailyReports.filter((r) => !r.hasData);
  const allGlucoseValues = reportedPatients.flatMap((r) => r.glucoseLogs.map((l: any) => l.value));
  const avgGlucose = allGlucoseValues.length > 0
    ? (allGlucoseValues.reduce((a: number, b: number) => a + b, 0) / allGlucoseValues.length).toFixed(1)
    : '--';
  const alertCount = allGlucoseValues.filter((v: number) => v < 3.9 || v > 10).length;

  const formatDisplayDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    return d.toLocaleDateString('uz-UZ', options);
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
      </header>

      {/* ===== Daily Reports Section ===== */}
      <section className="daily-reports-section" id="daily-reports">
        <div className="daily-reports-header">
          <div className="date-nav">
            <button className="date-nav-btn" onClick={() => changeDate(-1)} title="Oldingi kun">
              <ChevronLeft size={20} />
            </button>
            <div className="date-display">
              <Calendar size={18} />
              <input
                type="date"
                value={selectedDate}
                max={format(new Date(), 'yyyy-MM-dd')}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="date-input"
              />
              <span className="date-label">
                {isToday ? "Bugun" : formatDisplayDate(selectedDate)}
              </span>
            </div>
            <button
              className="date-nav-btn"
              onClick={() => changeDate(1)}
              disabled={isToday}
              title="Keyingi kun"
            >
              <ChevronRight size={20} />
            </button>
          </div>
          <button className="refresh-btn" onClick={handleRefresh} disabled={dailyReportsLoading}>
            <RefreshCw size={16} className={dailyReportsLoading ? 'spin' : ''} />
            Yangilash
          </button>
        </div>

        {/* Summary Statistics */}
        <div className="report-summary-grid">
          <div className="summary-card glass" id="stat-total-patients">
            <div className="summary-icon" style={{ background: '#f0fdfa', color: '#0d9488' }}>
              <Users size={20} />
            </div>
            <div className="summary-info">
              <span className="summary-value">{patients.length}</span>
              <span className="summary-label">Jami bemorlar</span>
            </div>
          </div>
          <div className="summary-card glass" id="stat-reported">
            <div className="summary-icon" style={{ background: '#f0fdf4', color: '#10b981' }}>
              <CheckCircle size={20} />
            </div>
            <div className="summary-info">
              <span className="summary-value">{reportedPatients.length}</span>
              <span className="summary-label">Ma'lumot yuborgan</span>
            </div>
          </div>
          <div className="summary-card glass" id="stat-avg-glucose">
            <div className="summary-icon" style={{ background: '#eff6ff', color: '#3b82f6' }}>
              <Activity size={20} />
            </div>
            <div className="summary-info">
              <span className="summary-value">{avgGlucose}</span>
              <span className="summary-label">O'rtacha glyukoza</span>
            </div>
          </div>
          <div className="summary-card glass" id="stat-alerts">
            <div className="summary-icon" style={{ background: alertCount > 0 ? '#fef2f2' : '#f0fdf4', color: alertCount > 0 ? '#ef4444' : '#10b981' }}>
              <AlertCircle size={20} />
            </div>
            <div className="summary-info">
              <span className="summary-value" style={{ color: alertCount > 0 ? '#ef4444' : undefined }}>{alertCount}</span>
              <span className="summary-label">Ogohlantirish</span>
            </div>
          </div>
        </div>

        {/* Daily Report Cards */}
        {dailyReportsLoading ? (
          <div className="reports-loading">
            <div className="loader"></div>
            <p>Ma'lumotlar yuklanmoqda...</p>
          </div>
        ) : (
          <>
            {reportedPatients.length > 0 ? (
              <div className="report-cards-grid">
                {reportedPatients.map((report: DailyPatientReport) => {
                  const { patient, glucoseLogs, symptoms, waterLogs, insulinLogs } = report;
                  const totalWater = waterLogs.reduce((sum: number, w: any) => sum + (w.amount || 0), 0);

                  return (
                    <div
                      key={patient.uid}
                      className="report-card glass"
                      id={`report-${patient.uid}`}
                    >
                      {/* Card Header */}
                      <div className="report-card-header" onClick={() => handlePatientClick(patient)}>
                        <div className="report-patient-info">
                          <div className="report-avatar">{patient.name?.charAt(0)?.toUpperCase() || '?'}</div>
                          <div>
                            <h4>{patient.name || "Noma'lum"}</h4>
                            <span className="report-type-badge">
                              {patient.type === 'type1' ? '1-tur' : '2-tur'} Diabet
                            </span>
                          </div>
                        </div>
                        <div className="report-card-actions">
                          <button
                            className="report-action-btn chat"
                            onClick={(e) => { e.stopPropagation(); handleStartChat(patient); }}
                            title="Chat"
                          >
                            <MessageCircle size={16} />
                          </button>
                          <ChevronRight size={18} className="report-chevron" />
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="report-card-body">
                        {/* Glucose Section */}
                        {glucoseLogs.length > 0 && (
                          <div className="report-section">
                            <div className="report-section-title">
                              <Activity size={14} />
                              <span>Glyukoza</span>
                              <span className="section-count">{glucoseLogs.length} ta o'lchov</span>
                            </div>
                            <div className="glucose-values-row">
                              {glucoseLogs.slice(0, 5).map((log: any, idx: number) => (
                                <div key={idx} className="glucose-pill" style={{
                                  background: getGlucoseColor(log.value) + '15',
                                  color: getGlucoseColor(log.value),
                                  borderColor: getGlucoseColor(log.value) + '30'
                                }}>
                                  <span className="glucose-pill-value">{log.value}</span>
                                  <span className="glucose-pill-status">{getGlucoseStatus(log.value)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Symptoms Section */}
                        {symptoms.length > 0 && (
                          <div className="report-section">
                            <div className="report-section-title">
                              <AlertCircle size={14} />
                              <span>Simptomlar</span>
                            </div>
                            <div className="symptom-tags-row">
                              {symptoms.flatMap((s: any) =>
                                (s.symptomLabels || s.symptoms || []).map((label: string, idx: number) => (
                                  <span key={`${s.id}-${idx}`} className="report-symptom-tag">
                                    {label}
                                  </span>
                                ))
                              )}
                            </div>
                          </div>
                        )}

                        {/* Water & Insulin Row */}
                        <div className="report-metrics-row">
                          {waterLogs.length > 0 && (
                            <div className="report-metric">
                              <Droplets size={14} color="#3b82f6" />
                              <span className="metric-value">{totalWater} ml</span>
                              <span className="metric-label">Suv</span>
                            </div>
                          )}
                          {insulinLogs.length > 0 && (
                            <div className="report-metric">
                              <Activity size={14} color="#8b5cf6" />
                              <span className="metric-value">{insulinLogs.length} ta</span>
                              <span className="metric-label">Insulin dozasi</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Card Footer */}
                      <div className="report-card-footer">
                        <button className="view-detail-btn" onClick={() => handlePatientClick(patient)}>
                          <FileText size={14} />
                          Batafsil ko'rish
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="no-reports-message glass">
                <FileText size={40} opacity={0.3} />
                <p>Bu sana uchun hech qanday ma'lumot topilmadi</p>
                <span>Bemorlar hali ma'lumot yubormagan</span>
              </div>
            )}

            {/* Not Reported Section */}
            {notReportedPatients.length > 0 && (
              <div className="not-reported-section">
                <button
                  className="not-reported-toggle"
                  onClick={() => setShowNotReported(!showNotReported)}
                >
                  <div className="not-reported-toggle-info">
                    {showNotReported ? <EyeOff size={16} /> : <Eye size={16} />}
                    <UserX size={16} />
                    <span>Ma'lumot yubormaganlar</span>
                    <span className="not-reported-count">{notReportedPatients.length}</span>
                  </div>
                  <ChevronRight size={16} className={`toggle-chevron ${showNotReported || searchQuery ? 'rotated' : ''}`} />
                </button>

                {(showNotReported || searchQuery) && (
                  <div className="not-reported-list">
                    {notReportedPatients.map((report: DailyPatientReport) => (
                      <div key={report.patient.uid} className="not-reported-item">
                        <div className="not-reported-patient">
                          <div className="not-reported-avatar">
                            {report.patient.name?.charAt(0)?.toUpperCase() || '?'}
                          </div>
                          <div>
                            <span className="not-reported-name">{report.patient.name}</span>
                            <span className="not-reported-type">
                              {report.patient.type === 'type1' ? '1-tur' : '2-tur'}
                            </span>
                          </div>
                        </div>
                        <div className="not-reported-actions">
                          <button
                            className="report-action-btn chat small"
                            onClick={() => handleStartChat(report.patient)}
                            title="Eslatma yuborish"
                          >
                            <MessageCircle size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </section>

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
                <button className="action-btn chat-btn" onClick={() => handleStartChat()}>
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
              <button
                className={`detail-tab ${activeDetailTab === 'insulin' ? 'active' : ''}`}
                onClick={() => setActiveDetailTab('insulin')}
              >
                <Activity size={16} />
                Insulin
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
                              <span className="detail-item-value">
                                {s.symptoms?.map((id: string) => getSymptomLabel(id)).join(', ') || 'Noma\'lum'}
                              </span>
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

                  {activeDetailTab === 'insulin' && (
                    <div className="detail-list">
                      {patientDetail?.insulinLogs?.length > 0 ? (
                        patientDetail.insulinLogs.map((log: any, idx: number) => (
                          <div key={idx} className="detail-item insulin-item">
                            <div className="detail-item-icon" style={{ background: log.type === 'basal' ? '#f5f3ff' : '#e0f2fe', color: log.type === 'basal' ? '#8b5cf6' : '#0ea5e9' }}>
                              <Activity size={16} />
                            </div>
                            <div className="detail-item-info">
                              <span className="detail-item-value">{log.name} ({log.type})</span>
                              <div className="detail-item-meta">
                                {log.type === 'basal' ? (
                                  <>Ert: {log.doses.morning || 0}u, Kech: {log.doses.evening || 0}u</>
                                ) : (
                                  <>Non: {log.doses.breakfast || 0}u, Tush: {log.doses.lunch || 0}u, Kech: {log.doses.dinner || 0}u, Qo'sh: {log.doses.additional || 0}u</>
                                )}
                              </div>
                              <span className="detail-item-meta" style={{ display: 'block', fontSize: '10px' }}>
                                {log.timestamp ? new Date(log.timestamp).toLocaleString('uz-UZ') : ''}
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="detail-empty">
                          <Activity size={32} opacity={0.3} />
                          <p>Insulin ma'lumotlari topilmadi</p>
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
