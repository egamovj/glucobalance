import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import { useStore } from './store';

import Profile from './pages/Profile';
import Glucose from './pages/Glucose';
import Symptoms from './pages/Symptoms';
import Academy from './pages/Academy';
import Healthy from './pages/Healthy';
import Calculator from './pages/Calculator';
import Dashboard from './pages/Dashboard';
import { Sun, Moon } from 'lucide-react';


function App() {
  const theme = useStore((state) => state.theme);

  const toggleTheme = useStore((state) => state.toggleTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <BrowserRouter>
      <div className="theme-toggle-fixed">
        <button onClick={toggleTheme} className="btn-icon">
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </div>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="glucose" element={<Glucose />} />
          <Route path="symptoms" element={<Symptoms />} />
          <Route path="academy" element={<Academy />} />
          <Route path="healthy" element={<Healthy />} />
          <Route path="calculator" element={<Calculator />} />
          <Route path="profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
