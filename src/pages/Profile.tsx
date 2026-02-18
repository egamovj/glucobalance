import React, { useState } from 'react';
import { useStore } from '../store';
import { User, Activity, Ruler, Weight, Calendar, Heart, Shield } from 'lucide-react';
import './Profile.css';

const Profile: React.FC = () => {
  const { profile, setProfile, user } = useStore();
  const [isEditing, setIsEditing] = useState(!profile);
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
    doctorNotes: ''
  });

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
          <h2>{profile.name}</h2>
          <span className="badge">{profile.type === 'type1' ? '1-tur Diabet' : '2-tur Diabet'}</span>
        </header>

        <section className="stats-grid">
          <div className="card stat-card">
            <Ruler size={20} color="var(--primary)" />
            <div className="stat-info">
              <label>BMI</label>
              <p>{bmi}</p>
            </div>
          </div>
          <div className="card stat-card">
            <Weight size={20} color="var(--primary)" />
            <div className="stat-info">
              <label>Vazn</label>
              <p>{profile.weight} kg</p>
            </div>
          </div>
        </section>

        <div className="card info-list">
          <h3>Tibbiy ko'rsatkichlar</h3>
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

        <button className="btn-primary w-full" onClick={() => setIsEditing(true)}>Tahrirlash</button>
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

      <div className="input-group">
        <label>Diabet turi</label>
        <select name="type" value={formData.type} onChange={handleChange}>
          <option value="type1">1-tur</option>
          <option value="type2">2-tur</option>
        </select>
      </div>

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

      <div className="input-group">
        <label>Shifokor tavsiyalari (ixtiyoriy)</label>
        <textarea name="doctorNotes" value={formData.doctorNotes} onChange={handleChange} rows={3} />
      </div>

      <button type="submit" className="btn-primary">Saqlash</button>
    </form>
  );
};

export default Profile;
