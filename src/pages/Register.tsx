import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { User, Mail, Lock, UserPlus } from 'lucide-react';
import './Login.css';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="card auth-card glass">
        <div className="auth-header">
          <div className="logo-icon"><UserPlus color="white" /></div>
          <h1>Ro'yxatdan o'tish</h1>
          <p>Yangi hisob yarating</p>
        </div>

        <form onSubmit={handleRegister} className="auth-form">
          {error && <div className="error-alert">{error}</div>}
          
          <div className="input-group">
            <label><User size={16} /> F.I.Sh</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Azizbek Karimov"
              required 
            />
          </div>

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

          <button type="submit" className="btn-primary w-full">Ro'yxatdan o'tish</button>
        </form>

        <p className="auth-footer">
          Hisobingiz bormi? <Link to="/login">Kirish</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
