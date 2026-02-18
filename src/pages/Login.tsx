import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { Mail, Lock, LogIn } from 'lucide-react';
import './Login.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err: any) {
      console.error(err.code);
      if (err.code === 'auth/invalid-credential') {
        setError('Email yoki maxfiy so\'z noto\'g\'ri. Agar Google orqali ro\'yxatdan o\'tgan bo\'lsangiz, Google tugmasidan foydalaning.');
      } else if (err.code === 'auth/user-not-found') {
        setError('Foydalanuvchi topilmadi.');
      } else if (err.code === 'auth/wrong-password') {
        setError('Maxfiy so\'z noto\'g\'ri.');
      } else {
        setError('Kirishda xatolik yuz berdi. Qayta urinib ko\'ring.');
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="card auth-card glass">
        <div className="auth-header">
          <div className="logo-icon"><LogIn color="white" /></div>
          <h1>Xush Kelibsiz</h1>
          <p>Glucobalance hisobingizga kiring</p>
        </div>

        <form onSubmit={handleLogin} className="auth-form">
          {error && <div className="error-alert">{error}</div>}
          
          <div className="input-group">
            <label><Mail size={16} /> Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="example@mail.com"
              required 
            />
          </div>

          <div className="input-group">
            <label><Lock size={16} /> Maxfiy so'z</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="••••••••"
              required 
            />
          </div>

          <button type="submit" className="btn-primary w-full">Kirish</button>
        </form>

        <div className="auth-divider">
          <span>yoki</span>
        </div>

        <button onClick={handleGoogleLogin} className="btn-secondary w-full google-btn">
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" width="18" />
          Google orqali kirish
        </button>

        <p className="auth-footer">
          Hisobingiz yo'qmi? <Link to="/register">Ro'yxatdan o'tish</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
