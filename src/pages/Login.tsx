import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
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
            <p className="auth-footer">
              Hisobingiz yo'qmi? <Link to="/register">Ro'yxatdan o'tish</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
