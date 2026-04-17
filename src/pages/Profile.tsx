import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { User, Activity, Ruler, Weight, Calendar, Heart, Shield, Download, Sun, Moon, Stethoscope } from 'lucide-react';
import './Profile.css';

const Profile: React.FC = () => {
  const { profile, setProfile, user, doctorProfiles, fetchDoctorProfiles } = useStore();
  const isDoctor = profile?.role === 'doctor';
  const [isEditing, setIsEditing] = useState(!profile);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [formData, setFormData] = useState(profile || {
    name: user?.displayName || '',
    birthDate: '',
    gender: 'male',
    weight: 70,
    height: 170,
    type: 'type1',
    targetGlucose: 5.5,
    sensitivity: 2.0,
    nanInsulin: 1.0,
    doctorNotes: '',
    role: 'user',
    doctorId: ''
  });

  const assignedDoctor = doctorProfiles.find(d => d.login === formData.doctorId);

  useEffect(() => {
    const standalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    setIsStandalone(standalone);

    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(ios);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
    if (!isDoctor) {
      fetchDoctorProfiles();
    }
  }, [fetchDoctorProfiles, isDoctor]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  const bmi = (formData.weight / Math.pow(formData.height / 100, 2)).toFixed(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile(formData as any);
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: (name === 'weight' || name === 'height' || name === 'targetGlucose' || name === 'sensitivity' || name === 'nanInsulin') 
        ? parseFloat(value) 
        : value
    }));
  };

  if (!isEditing && profile) {
    return (
      <div className="profile-container">
        <header className="profile-header">
          <div className="avatar">{profile.name.charAt(0).toUpperCase()}</div>
          <div className="header-content">
             <h2>{profile.name}</h2>
             <span className="badge">{profile.type === 'type1' ? '1-tur Diabet' : '2-tur Diabet'}</span>
          </div>
        </header>

        <section className="stats-grid">
          <div className="card stat-card">
            <div className="stat-header">
              <Ruler size={20} color="var(--primary)" />
              <label>BMI</label>
            </div>
            <p>{bmi}</p>
          </div>
          <div className="card stat-card">
            <div className="stat-header">
               <Weight size={20} color="var(--primary)" />
               <label>Vazn</label>
            </div>
            <p>{profile.weight} kg</p>
          </div>
        </section>

        {!isDoctor && (
        <div className="card info-list">
          <div className="section-title">
             <Activity size={20} color="var(--primary)" />
             <h3>Tibbiy ko'rsatkichlar</h3>
          </div>
          
          <div className="info-item">
            <Activity size={18} />
            <div>
              <p>Maqsadli glyukoza</p>
              <span>{profile.targetGlucose} mmol/l</span>
            </div>
          </div>
          <div className="info-item">
            <Heart size={18} />
            <div>
              <p>1 NAN uchun insulin</p>
              <span>{profile.nanInsulin} birlik</span>
            </div>
          </div>
          <div className="info-item">
            <Shield size={18} />
            <div>
              <p>Sezuvchanlik koeffitsienti</p>
              <span>{profile.sensitivity}</span>
            </div>
          </div>
        </div>
        )}

        <div className="card info-list">
          <div className="section-title">
             <Shield size={20} color="var(--primary)" />
             <h3>Ilova sozlamalari</h3>
          </div>
          
          <div className="settings-item">
             <div className="settings-label">
                <Sun size={18} />
                <span>Mavzu (Yorug'/Qorong'u)</span>
             </div>
             <button className={`theme-switch ${useStore.getState().theme}`} onClick={useStore.getState().toggleTheme}>
                <div className="switch-handle">
                   {useStore.getState().theme === 'light' ? <Sun size={14} /> : <Moon size={14} />}
                </div>
             </button>
          </div>
        </div>

        {!isDoctor && (
          <div className="card info-list" style={{ marginTop: '16px' }}>
            <div className="section-title">
              <Stethoscope size={20} color="var(--primary)" />
              <h3>Mening shifokorim</h3>
            </div>
            <div className="info-item">
              <User size={18} />
              <div>
                <p>Shifokor</p>
                <span>{assignedDoctor ? `Dr. ${assignedDoctor.name}` : 'Tanlanmagan'}</span>
              </div>
            </div>
          </div>
        )}

        {!isStandalone && (
          <div className="card install-card glass">
            <div className="install-content">
              <Download size={24} color="var(--primary)" />
              <div>
                <h4>Ilovani o'rnatish</h4>
                <p>
                  {isIOS 
                    ? "Glucobalance-ni asosiy ekranga qo'shish uchun 'Ulashish' tugmasini bosing va 'Asosiy ekranga qo'shish'-ni tanlang."
                    : "Glucobalance-ni asosiy ekranga qo'shing va tezkor foydalaning."}
                </p>
              </div>
            </div>
            {deferredPrompt ? (
              <button className="btn-primary" onClick={handleInstallClick}>O'rnatish</button>
            ) : !isIOS && (
              <div className="install-hint">Brauzer sozlamalaridan o'rnating</div>
            )}
          </div>
        )}

        <button className="btn-primary w-full" style={{ marginTop: '20px' }} onClick={() => setIsEditing(true)}>Tahrirlash</button>
      </div>
    );
  }

  return (
    <form className="profile-form" onSubmit={handleSubmit}>
      <h2>Profil ma'lumotlari</h2>
      
      <div className="input-group">
        <label><User size={16} /> F.I.Sh</label>
        <input name="name" value={formData.name} onChange={handleChange} required placeholder="Masalan: Azizbek Karimov" />
      </div>

      <div className="input-row">
        <div className="input-group">
          <label><Calendar size={16} /> Tug'ilgan sana</label>
          <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} required />
        </div>
        <div className="input-group">
          <label>Jins</label>
          <select name="gender" value={formData.gender} onChange={handleChange}>
            <option value="male">Erkak</option>
            <option value="female">Ayol</option>
          </select>
        </div>
      </div>

      <div className="input-row">
        <div className="input-group">
          <label><Weight size={16} /> Vazn (kg)</label>
          <input type="number" name="weight" value={formData.weight} onChange={handleChange} required />
        </div>
        <div className="input-group">
          <label><Ruler size={16} /> Bo'y (sm)</label>
          <input type="number" name="height" value={formData.height} onChange={handleChange} required />
        </div>
      </div>

      {!isDoctor && (
      <div className="input-group">
        <label><Stethoscope size={16} /> Shifokorni tanlang</label>
        <select name="doctorId" value={formData.doctorId || ''} onChange={handleChange} required={!isDoctor}>
          <option value="">Shifokorni tanlang...</option>
          {doctorProfiles.map((d) => (
            <option key={d.login} value={d.login}>
              Dr. {d.name} ({d.specialization})
            </option>
          ))}
        </select>
      </div>
      )}

      {!isDoctor && (
      <div className="input-group">
        <label>Diabet turi</label>
        <select name="type" value={formData.type} onChange={handleChange}>
          <option value="type1">1-tur</option>
          <option value="type2">2-tur</option>
        </select>
      </div>
      )}

      {!isDoctor && (
      <div className="card form-section-card">
        <h3>Tibbiy sozlamalar</h3>
        <div className="input-group">
          <label>Maqsadli glyukoza (mmol/l)</label>
          <input type="number" step="0.1" name="targetGlucose" value={formData.targetGlucose} onChange={handleChange} required />
        </div>
        <div className="input-group">
          <label>1 NAN uchun insulin miqdori</label>
          <input type="number" step="0.1" name="nanInsulin" value={formData.nanInsulin} onChange={handleChange} required />
        </div>
        <div className="input-group">
          <label>Sezuvchanlik koeffitsienti</label>
          <input type="number" step="0.1" name="sensitivity" value={formData.sensitivity} onChange={handleChange} required />
        </div>
      </div>
      )}

      {!isDoctor && (
      <div className="input-group">
        <label>Shifokor tavsiyalari (ixtiyoriy)</label>
        <textarea name="doctorNotes" value={formData.doctorNotes} onChange={handleChange} rows={3} />
      </div>
      )}

      <button type="submit" className="btn-primary">Saqlash</button>
    </form>
  );
};

export default Profile;
