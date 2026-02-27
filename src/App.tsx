import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { useStore } from './store';

import Layout from './components/Layout';
import Profile from './pages/Profile';
import Glucose from './pages/Glucose';
import Symptoms from './pages/Symptoms';
import Academy from './pages/Academy';
import Healthy from './pages/Healthy';
import Calculator from './pages/Calculator';
import Analytics from './pages/Analytics';
import FoodGI from './pages/FoodGI';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import { ShieldAlert } from 'lucide-react';

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
      }
    });
    return () => unsubscribe();
  }, [setUser, setLoading]);

  return (
    <div data-theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="glucose" element={<Glucose />} />
            <Route path="symptoms" element={<Symptoms />} />
            <Route path="academy" element={<Academy />} />
            <Route path="healthy" element={<Healthy />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="food-gi" element={<FoodGI />} />
            <Route path="calculator" element={<Calculator />} />
            <Route path="profile" element={<Profile />} />
            <Route path="admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="*" element={<Navigate to="/" />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
