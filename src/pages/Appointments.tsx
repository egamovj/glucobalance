import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import type { Appointment } from '../store';
import { db } from '../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import {
  Calendar, Clock, User, Stethoscope, CheckCircle,
  XCircle, Plus
} from 'lucide-react';
import './Appointments.css';

const Appointments: React.FC = () => {
  const {
    user, profile, appointments,
    createAppointment, updateAppointmentStatus,
    doctorProfiles, fetchDoctorProfiles
  } = useStore();
  const isDoctor = profile?.role === 'doctor';
  const [showBooking, setShowBooking] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const [bookingData, setBookingData] = useState({
    doctorLogin: '',
    date: '',
    time: '',
    reason: '',
  });

  // Real-time listener for appointments
  useEffect(() => {
    if (!user) return;
    if (!isDoctor) {
      fetchDoctorProfiles();
    }

    const ref = collection(db, "appointments");
    const field = isDoctor ? "doctorId" : "patientId";
    // For doctors, extract login from synthetic email (login@glucobalance.app -> login)
    const doctorLogin = user.email?.replace('@glucobalance.app', '') || '';
    const value = isDoctor ? doctorLogin : user.uid;
    // No orderBy — sort client-side to avoid needing composite indexes
    const q = query(ref, where(field, "==", value));

    const unsub = onSnapshot(q, (snapshot) => {
      const appts = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as Appointment[];
      // Sort by createdAt descending client-side
      appts.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      useStore.setState({ appointments: appts });
    }, (error) => {
      console.error("Appointments listener error:", error);
    });

    return () => unsub();
  }, [user, isDoctor, fetchDoctorProfiles]);

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) return;

    const selectedDoctor = doctorProfiles.find((d) => d.login === bookingData.doctorLogin);
    if (!selectedDoctor) return;

    try {
      await createAppointment({
        patientId: user.uid,
        patientName: profile.name,
        doctorId: bookingData.doctorLogin,
        doctorName: selectedDoctor.name,
        date: bookingData.date,
        time: bookingData.time,
        reason: bookingData.reason,
      });
      setShowBooking(false);
      setBookingData({ doctorLogin: '', date: '', time: '', reason: '' });
      alert("Navbat muvaffaqiyatli yaratildi!");
    } catch (err) {
      console.error('Error creating appointment:', err);
      alert("Xatolik yuz berdi");
    }
  };

  const handleStatus = async (id: string, status: 'confirmed' | 'completed' | 'cancelled') => {
    try {
      await updateAppointmentStatus(id, status);
    } catch (err) {
      console.error('Error updating appointment:', err);
    }
  };

  const filteredAppointments = appointments.filter((a) => {
    if (filterStatus === 'all') return true;
    return a.status === filterStatus;
  });

  const getStatusBadge = (status: string) => {
    const map: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
      pending: { label: 'Kutilmoqda', color: '#f59e0b', bg: '#fef3c7', icon: <Clock size={14} /> },
      confirmed: { label: 'Tasdiqlangan', color: '#10b981', bg: '#d1fae5', icon: <CheckCircle size={14} /> },
      completed: { label: 'Bajarilgan', color: '#6366f1', bg: '#e0e7ff', icon: <CheckCircle size={14} /> },
      cancelled: { label: 'Bekor qilingan', color: '#ef4444', bg: '#fef2f2', icon: <XCircle size={14} /> },
    };
    const s = map[status] || map.pending;
    return (
      <span className="appt-status" style={{ color: s.color, background: s.bg }}>
        {s.icon} {s.label}
      </span>
    );
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <div className="appointments-container">
      <header className="appt-header">
        <div className="appt-header-title">
          <Calendar size={24} color="var(--primary)" />
          <h1>{isDoctor ? 'Navbatlar boshqaruvi' : 'Onlayn navbat'}</h1>
        </div>
        {!isDoctor && (
          <button className="btn-primary" onClick={() => setShowBooking(!showBooking)}>
            <Plus size={18} />
            Navbat olish
          </button>
        )}
      </header>

      {/* Booking Form (Patient only) */}
      {!isDoctor && showBooking && (
        <div className="card booking-card glass animate-in">
          <h3><Calendar size={18} /> Yangi navbat</h3>
          <form onSubmit={handleBook} className="booking-form">
            <div className="input-group">
              <label>Shifokor tanlash</label>
              <select
                value={bookingData.doctorLogin}
                onChange={(e) => setBookingData({ ...bookingData, doctorLogin: e.target.value })}
                required
              >
                <option value="">Shifokorni tanlang...</option>
                {doctorProfiles.map((d) => (
                  <option key={d.login} value={d.login}>
                    Dr. {d.name} — {d.specialization}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-row-2">
              <div className="input-group">
                <label><Calendar size={14} /> Sana</label>
                <input
                  type="date"
                  value={bookingData.date}
                  min={getMinDate()}
                  onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                  required
                />
              </div>
              <div className="input-group">
                <label><Clock size={14} /> Vaqt</label>
                <input
                  type="time"
                  value={bookingData.time}
                  onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="input-group">
              <label>Sabab (ixtiyoriy)</label>
              <textarea
                value={bookingData.reason}
                onChange={(e) => setBookingData({ ...bookingData, reason: e.target.value })}
                placeholder="Navbat olish sababingiz..."
                rows={2}
              />
            </div>
            <div className="form-actions-2">
              <button type="submit" className="btn-primary">Navbat olish</button>
              <button type="button" className="btn-secondary" onClick={() => setShowBooking(false)}>
                Bekor qilish
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter */}
      <div className="appt-filter">
        <div className="filter-group">
          {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((st) => (
            <button
              key={st}
              className={`filter-btn ${filterStatus === st ? 'active' : ''}`}
              onClick={() => setFilterStatus(st)}
            >
              {st === 'all' ? 'Barchasi' :
               st === 'pending' ? 'Kutilmoqda' :
               st === 'confirmed' ? 'Tasdiqlangan' :
               st === 'completed' ? 'Bajarilgan' : 'Bekor qilingan'}
            </button>
          ))}
        </div>
      </div>

      {/* Appointments List */}
      <div className="appt-list">
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map((appt) => (
            <div key={appt.id} className="card appt-card glass">
              <div className="appt-card-top">
                <div className="appt-person">
                  <div className="appt-avatar">
                    {isDoctor ? <User size={18} /> : <Stethoscope size={18} />}
                  </div>
                  <div>
                    <h4>{isDoctor ? appt.patientName : `Dr. ${appt.doctorName}`}</h4>
                    {appt.reason && <p className="appt-reason">{appt.reason}</p>}
                  </div>
                </div>
                {getStatusBadge(appt.status)}
              </div>

              <div className="appt-card-details">
                <div className="appt-detail">
                  <Calendar size={14} />
                  <span>{appt.date}</span>
                </div>
                <div className="appt-detail">
                  <Clock size={14} />
                  <span>{appt.time}</span>
                </div>
              </div>

              {/* Doctor Actions */}
              {isDoctor && appt.status === 'pending' && (
                <div className="appt-actions">
                  <button
                    className="appt-action-btn confirm"
                    onClick={() => handleStatus(appt.id, 'confirmed')}
                  >
                    <CheckCircle size={16} /> Tasdiqlash
                  </button>
                  <button
                    className="appt-action-btn cancel"
                    onClick={() => handleStatus(appt.id, 'cancelled')}
                  >
                    <XCircle size={16} /> Bekor qilish
                  </button>
                </div>
              )}

              {isDoctor && appt.status === 'confirmed' && (
                <div className="appt-actions">
                  <button
                    className="appt-action-btn complete"
                    onClick={() => handleStatus(appt.id, 'completed')}
                  >
                    <CheckCircle size={16} /> Yakunlash
                  </button>
                </div>
              )}

              {/* Patient Actions */}
              {!isDoctor && appt.status === 'pending' && (
                <div className="appt-actions">
                  <button
                    className="appt-action-btn cancel"
                    onClick={() => handleStatus(appt.id, 'cancelled')}
                  >
                    <XCircle size={16} /> Bekor qilish
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="appt-empty">
            <Calendar size={48} opacity={0.2} />
            <p>Navbatlar topilmadi</p>
            {!isDoctor && <span>Yangi navbat olish uchun yuqoridagi tugmani bosing</span>}
          </div>
        )}
      </div>
    </div>
  );
};

export default Appointments;
