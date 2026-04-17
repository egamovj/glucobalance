import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { User, Mail, Lock, UserPlus, AlertCircle } from 'lucide-react';
import './Login.css';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });

      // Create Firestore profile so doctor can see this patient
      await setDoc(doc(db, "profiles", userCredential.user.uid), {
        name,
        email,
        role: 'user',
        birthDate: '',
        gender: 'male',
        weight: 0,
        height: 0,
        type: 'type1',
        targetGlucose: 5.5,
        sensitivity: 2.0,
        nanInsulin: 1.0,
        waterGoal: 2000,
      });

      navigate('/');
    } catch (err: any) {
      console.error('Registration error:', err);
      if (err.code === 'auth/email-already-in-use') {
        setError('Bu email manzili allaqachon ro\'yxatdan o\'tgan.');
      } else if (err.code === 'auth/weak-password') {
        setError('Maxfiy so\'z juda kuchsiz (kamida 6 ta belgi).');
      } else {
        setError(err.message);
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="auth-page">
      {/* Left Side: Visual Banner */}
      <div className="auth-banner">
        <div className="banner-content">
          <div className="banner-logo">
            <div className="logo-icon">
              <img src="/logo.svg" alt="Glucobalance" width="32" />
            </div>
            <h2>Glucobalance</h2>
          </div>
          <h1>Bizga qo'shiling</h1>
          <p>
            O'z sog'lig'ingizni nazoratga oling. Ro'yxatdan o'tib, qandli diabetni samarali boshqarish uchun barcha kerakli vositalarga ega bo'ling.
          </p>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="auth-form-side">
        <div className="auth-form-container">
          <div className="form-header">
            <h2>Ro'yxatdan o'tish</h2>
            <p>Yangi hisob yarating va boshlang</p>
          </div>

          <form onSubmit={handleRegister} className="auth-form">
            {error && (
              <div className="error-msg">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <div className="input-container">
              <label>F.I.Sh</label>
              <div className="input-field-wrapper">
                <User className="input-icon" size={20} />
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="Azizbek Karimov"
                  required 
                />
              </div>
            </div>

            <div className="input-container">
              <label>Email</label>
              <div className="input-field-wrapper">
                <Mail className="input-icon" size={20} />
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="example@mail.com"
                  required 
                />
              </div>
            </div>

            <div className="input-container">
              <label>Maxfiy so'z</label>
              <div className="input-field-wrapper">
                <Lock className="input-icon" size={20} />
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="••••••••"
                  required 
                />
              </div>
            </div>

            <button type="submit" className="btn-primary w-full" disabled={isLoading}>
              {isLoading ? (
                <div className="loader" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></div>
              ) : (
                <>
                  <UserPlus size={20} />
                  Ro'yxatdan o'tish
                </>
              )}
            </button>
          </form>

          <p className="auth-footer">
            Hisobingiz bormi? <Link to="/login">Kirish</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
