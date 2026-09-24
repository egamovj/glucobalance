import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, signInAnonymously } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Mail, Lock, LogIn, Stethoscope, User, AlertCircle } from 'lucide-react';
import './Login.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginMode, setLoginMode] = useState<'patient' | 'doctor'>('patient');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      if (loginMode === 'doctor') {
        const syntheticEmail = `${email}@glucobalance.app`;
        await signInWithEmailAndPassword(auth, syntheticEmail, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate('/');
    } catch (err: any) {
      console.error('Login error:', err);
      if (loginMode === 'doctor') {
        setError('Login yoki parol noto\'g\'ri.');
      } else if (err.code === 'auth/invalid-credential') {
        setError('Email yoki maxfiy so\'z noto\'g\'ri.');
      } else if (err.code === 'auth/user-not-found') {
        setError('Foydalanuvchi topilmadi.');
      } else if (err.code === 'auth/wrong-password') {
        setError('Maxfiy so\'z noto\'g\'ri.');
      } else {
        setError('Tizimga kirishda xatolik yuz berdi. Iltimos qaytadan urining.');
      }
    }
    setIsLoading(false);
  };

  const handleGuestLogin = async () => {
    setError('');
    setIsLoading(true);
    try {
      const userCredential = await signInAnonymously(auth);
      
      const profDoc = await getDoc(doc(db, "profiles", userCredential.user.uid));
      if (!profDoc.exists()) {
        await setDoc(doc(db, "profiles", userCredential.user.uid), {
          name: 'Mehmon',
          email: 'mehmon@glucobalance.app',
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
      }

      navigate('/');
    } catch (err: any) {
      console.error('Guest login error:', err);
      setError('Mehmon sifatida kirishda xatolik yuz berdi.');
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
          <h1>Sog'lom hayot sari bir qadam</h1>
          <p>
            Sizning qandli diabet nazoratidagi ishonchli yordamchingiz. 
            Ma'lumotlarni tahlil qiling, shifokoringiz bilan bog'laning va sog'lom turmush tarzini boshlang.
          </p>
        </div>
      </div>

      {/* Right Side: Simple Form */}
      <div className="auth-form-side">
        <div className="auth-form-container">
          <div className="form-header">
            <h2>Xush kelibsiz!</h2>
            <p>Iltimos, hisobingizga kiring</p>
          </div>

          <div className="role-selector">
            <button 
              className={`role-option ${loginMode === 'patient' ? 'active' : ''}`}
              onClick={() => setLoginMode('patient')}
            >
              <User size={18} />
              Bemor
            </button>
            <button 
              className={`role-option ${loginMode === 'doctor' ? 'active' : ''}`}
              onClick={() => setLoginMode('doctor')}
            >
              <Stethoscope size={18} />
              Shifokor
            </button>
          </div>

          <form onSubmit={handleLogin} className="auth-form">
            {error && (
              <div className="error-msg">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <div className="input-container">
              <label>{loginMode === 'doctor' ? 'Login' : 'Email'}</label>
              <div className="input-field-wrapper">
                <Mail className="input-icon" size={20} />
                <input 
                  type={loginMode === 'doctor' ? 'text' : 'email'} 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder={loginMode === 'doctor' ? "Doctor login" : "example@mail.com"}
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
                  <LogIn size={20} />
                  Kirish
                </>
              )}
            </button>
          </form>

          {loginMode === 'patient' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <p className="auth-footer" style={{ margin: 0 }}>
                Hisobingiz yo'qmi? <Link to="/register">Ro'yxatdan o'tish</Link>
              </p>
              
              <div style={{ position: 'relative', textAlign: 'center', margin: '8px 0' }}>
                <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, borderTop: '1px solid var(--border-color)', zIndex: 1 }}></div>
                <span style={{ position: 'relative', zIndex: 2, background: 'var(--surface)', padding: '0 12px', color: 'var(--text-muted)', fontSize: '14px' }}>Yoki</span>
              </div>

              <button 
                type="button" 
                onClick={handleGuestLogin}
                disabled={isLoading}
                style={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  gap: '8px',
                  width: '100%',
                  padding: '14px',
                  borderRadius: '16px',
                  border: '1px solid var(--border-color)',
                  background: 'var(--surface-1)',
                  color: 'var(--text-color)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = 'var(--surface-2)'}
                onMouseOut={(e) => e.currentTarget.style.background = 'var(--surface-1)'}
              >
                <User size={20} />
                Mehmon sifatida kirish
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
