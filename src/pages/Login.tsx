import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Mail, Lock, LogIn, Stethoscope, User, UserCircle } from 'lucide-react';
import { useStore } from '../store';
import type { UserProfile } from '../store';
import './Login.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login, setLogin] = useState('');
  const [error, setError] = useState('');
  const [loginMode, setLoginMode] = useState<'patient' | 'doctor'>('patient');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleDoctorLogin = async (userCredential: any, doctorLogin: string) => {
    // Check if this login exists in doctor_profiles
    const doctorRef = doc(db, "doctor_profiles", doctorLogin);
    const doctorDoc = await getDoc(doctorRef);
    if (!doctorDoc.exists()) {
      // Not a registered doctor
      await auth.signOut();
      setError("Login yoki parol noto'g'ri.");
      return false;
    }

    // Set user profile as doctor
    const doctorData = doctorDoc.data();
    const profileData: UserProfile = {
      name: doctorData.name || '',
      email: `${doctorLogin}@glucobalance.app`,
      role: 'doctor',
      birthDate: '',
      gender: 'male',
      weight: 0,
      height: 0,
      type: 'type1',
      targetGlucose: 5.5,
      sensitivity: 2.0,
      nanInsulin: 1.0,
      waterGoal: 2000,
    };

    // Write to Firestore - Profiles collection
    await setDoc(doc(db, "profiles", userCredential.user.uid), profileData, { merge: true });

    // Backfill realUid in doctor_profiles if missing or different
    if (doctorData.realUid !== userCredential.user.uid) {
      await setDoc(doctorRef, { realUid: userCredential.user.uid }, { merge: true });
    }

    // Immediately update local Zustand store so DoctorRoute guard works
    useStore.setState({ profile: profileData });

    return true;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      // For doctor mode, convert login to synthetic email
      const authEmail = loginMode === 'doctor' ? `${login}@glucobalance.app` : email;
      const userCredential = await signInWithEmailAndPassword(auth, authEmail, password);

      if (loginMode === 'doctor') {
        const isDoctor = await handleDoctorLogin(userCredential, login);
        if (!isDoctor) {
          setIsLoading(false);
          return;
        }
        navigate('/doctor');
      } else {
        navigate('/');
      }
    } catch (err: any) {
      console.error(err.code);
      if (loginMode === 'doctor') {
        setError('Login yoki parol noto\'g\'ri.');
      } else if (err.code === 'auth/invalid-credential') {
        setError('Email yoki maxfiy so\'z noto\'g\'ri.');
      } else if (err.code === 'auth/user-not-found') {
        setError('Foydalanuvchi topilmadi.');
      } else if (err.code === 'auth/wrong-password') {
        setError('Maxfiy so\'z noto\'g\'ri.');
      } else {
        setError('Kirishda xatolik yuz berdi. Qayta urinib ko\'ring.');
      }
    }
    setIsLoading(false);
  };


  return (
    <div className="auth-container">
      <div className="card auth-card glass">
        <div className="auth-header">
          <div className="logo-icon">
            {loginMode === 'doctor' ? <Stethoscope color="white" /> : <LogIn color="white" />}
          </div>
          <h1>{loginMode === 'doctor' ? 'Shifokor Kirish' : 'Xush Kelibsiz'}</h1>
          <p>{loginMode === 'doctor' ? 'Shifokor hisobingizga kiring' : 'Glucobalance hisobingizga kiring'}</p>
        </div>

        {/* Role Toggle */}
        <div className="role-toggle">
          <button
            className={`role-btn ${loginMode === 'patient' ? 'active' : ''}`}
            onClick={() => { setLoginMode('patient'); setError(''); }}
            type="button"
          >
            <User size={16} />
            <span>Bemor</span>
          </button>
          <button
            className={`role-btn ${loginMode === 'doctor' ? 'active' : ''}`}
            onClick={() => { setLoginMode('doctor'); setError(''); }}
            type="button"
          >
            <Stethoscope size={16} />
            <span>Shifokor</span>
          </button>
        </div>

        <form onSubmit={handleLogin} className="auth-form">
          {error && <div className="error-alert">{error}</div>}

          {loginMode === 'doctor' ? (
            <div className="input-group">
              <label><UserCircle size={16} /> Login</label>
              <input
                type="text"
                value={login}
                onChange={(e) => setLogin(e.target.value.toLowerCase().replace(/\s/g, ''))}
                placeholder="shifokor_login"
                required
              />
            </div>
          ) : (
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
          )}

          <div className="input-group">
            <label><Lock size={16} /> {loginMode === 'doctor' ? 'Parol' : 'Maxfiy so\'z'}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="btn-primary w-full" disabled={isLoading}>
            {isLoading ? 'Kirish...' : 'Kirish'}
          </button>
        </form>

        {loginMode === 'patient' && (
          <>
            <p className="auth-footer">
              Hisobingiz yo'qmi? <Link to="/register">Ro'yxatdan o'tish</Link>
            </p>
          </>
        )}

        {loginMode === 'doctor' && (
          <p className="auth-footer" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Shifokor sifatida kirish uchun administrator tomonidan berilgan login va paroldan foydalaning.
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
