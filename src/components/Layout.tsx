import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { User, Activity, AlertCircle, BookOpen, Heart, Home, Calculator } from 'lucide-react';
import './Layout.css';

const Layout: React.FC = () => {
  return (
    <div className="app-container">
      <aside className="sidebar glass">
        <div className="sidebar-logo">
          <div className="logo-icon"><Activity size={24} color="white" /></div>
          <h2>Glucobalance</h2>
        </div>
        
        <nav className="sidebar-nav">
          <NavLink to="/" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
            <Home size={20} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/glucose" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
            <Activity size={20} />
            <span>Qand nazorati</span>
          </NavLink>
          <NavLink to="/calculator" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
             <Calculator size={20} />
            <span>Kalkulyator</span>
          </NavLink>
          <NavLink to="/symptoms" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
            <AlertCircle size={20} />
            <span>Simptomlar</span>
          </NavLink>
          <div className="nav-divider">Tushunchalar</div>
          <NavLink to="/academy" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
            <BookOpen size={20} />
            <span>Akademiya</span>
          </NavLink>
          <NavLink to="/healthy" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
            <Heart size={20} />
            <span>Sog'lom hayot</span>
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <NavLink to="/profile" className="sidebar-profile-link">
            <User size={20} />
            <span> Mening profilim</span>
          </NavLink>
        </div>
      </aside>

      <div className="content-wrapper">
        <header className="top-header">
           <div className="header-search">
             <input type="text" placeholder="Qidiruv..." />
           </div>
           <div className="header-actions">
             {/* Theme toggle will be here or in App.tsx */}
           </div>
        </header>
        <main className="content-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
