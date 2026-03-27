import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { useStore } from './store';

import Layout from './components/Layout';
import { ShieldAlert } from 'lucide-react';

// Lazy load pages for code splitting
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Glucose = lazy(() => import('./pages/Glucose'));
const Symptoms = lazy(() => import('./pages/Symptoms'));
const Insulin = lazy(() => import('./pages/Insulin'));
const Academy = lazy(() => import('./pages/Academy'));
const Healthy = lazy(() => import('./pages/Healthy'));
const Analytics = lazy(() => import('./pages/Analytics'));
const FoodGI = lazy(() => import('./pages/FoodGI'));
const Calculator = lazy(() => import('./pages/Calculator'));
const Profile = lazy(() => import('./pages/Profile'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const DoctorDashboard = lazy(() => import('./pages/DoctorDashboard'));
const Chat = lazy(() => import('./pages/Chat'));
const Appointments = lazy(() => import('./pages/Appointments'));
const VideoCall = lazy(() => import('./pages/VideoCall'));

const PageLoader = () => (
  <div className="loading-screen" style={{ background: 'transparent', height: '100%' }}>
    <div className="loader"></div>
  </div>
);

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useStore();
  
  if (loading) return (
    <div className="loading-screen">
      <div className="loader"></div>
    </div>
  );
  
  if (!user) return <Navigate to="/login" />;
  return <>{children}</>;
};

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { profile, loading } = useStore();
  
  if (loading) return (
    <div className="loading-screen">
      <div className="loader"></div>
    </div>
  );
  
  if (profile?.role !== 'admin') {
    return (
      <div className="access-denied glass-morphism" style={{ padding: '40px', textAlign: 'center' }}>
        <ShieldAlert size={48} color="var(--error)" style={{ marginBottom: '16px' }} />
        <h2>Kirish cheklangan</h2>
        <p style={{ color: 'var(--text-muted)', marginTop: '12px' }}>Ushbu sahifa faqat administratorlar uchun.</p>
        <button className="btn-primary" style={{ marginTop: '24px' }} onClick={() => window.location.href = '/'}>Bosh sahifaga qaytish</button>
      </div>
    );
  }
  
  return <>{children}</>;
};

const DoctorRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { profile, loading } = useStore();
  
  if (loading) return (
    <div className="loading-screen">
      <div className="loader"></div>
    </div>
  );
  
  if (profile?.role !== 'doctor') {
    return (
      <div className="access-denied glass-morphism" style={{ padding: '40px', textAlign: 'center' }}>
        <ShieldAlert size={48} color="var(--error)" style={{ marginBottom: '16px' }} />
        <h2>Kirish cheklangan</h2>
        <p style={{ color: 'var(--text-muted)', marginTop: '12px' }}>Ushbu sahifa faqat shifokorlar uchun.</p>
        <button className="btn-primary" style={{ marginTop: '24px' }} onClick={() => window.location.href = '/'}>Bosh sahifaga qaytish</button>
      </div>
    );
  }
  
  return <>{children}</>;
};

function App() {
  const theme = useStore((state) => state.theme);
  const { setUser, setLoading } = useStore();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      setLoading(false);
      if (user) {
        await useStore.getState().syncFromFirestore(user.uid);
        
        // Auto-create profile for users who logged in via Google but have no profile yet
        const currentProfile = useStore.getState().profile;
        if (!currentProfile) {
          const { doc, setDoc, getDoc } = await import('firebase/firestore');
          const { db } = await import('./firebase');
          const profRef = doc(db, "profiles", user.uid);
          const profSnap = await getDoc(profRef);
          if (!profSnap.exists()) {
            const defaultProfile = {
              name: user.displayName || '',
              email: user.email || '',
              role: 'user' as const,
              birthDate: '',
              gender: 'male' as const,
              weight: 0,
              height: 0,
              type: 'type1' as const,
              targetGlucose: 5.5,
              sensitivity: 2.0,
              nanInsulin: 1.0,
              waterGoal: 2000,
            };
            await setDoc(profRef, defaultProfile);
            useStore.setState({ profile: defaultProfile });
          }
        }
      }
    });
    return () => unsubscribe();
  }, [setUser, setLoading]);

  return (
    <div data-theme={theme}>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route index element={<Dashboard />} />
              <Route path="glucose" element={<Glucose />} />
              <Route path="symptoms" element={<Symptoms />} />
              <Route path="insulin" element={<ProtectedRoute><Insulin /></ProtectedRoute>} />
              <Route path="academy" element={<Academy />} />
              <Route path="healthy" element={<Healthy />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="food-gi" element={<FoodGI />} />
              <Route path="calculator" element={<Calculator />} />
              <Route path="profile" element={<Profile />} />
              <Route path="chat" element={<Chat />} />
              <Route path="chat/:roomId" element={<Chat />} />
              <Route path="video-call/:roomId" element={<VideoCall />} />
              <Route path="appointments" element={<Appointments />} />
              <Route path="admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              <Route path="doctor" element={<DoctorRoute><DoctorDashboard /></DoctorRoute>} />
              <Route path="*" element={<Navigate to="/" />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </div>
  );
}

export default App;
