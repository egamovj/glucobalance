import { useNavigate, NavLink, Outlet } from 'react-router-dom';
import { User, Activity, AlertCircle, BookOpen, Heart, Home, Calculator, LogOut, PieChart, Utensils } from 'lucide-react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import './Layout.css';

const Layout: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="app-container">
      {/* Desktop Sidebar */}
      <aside className="sidebar glass desktop-only">
        <div className="sidebar-logo">
          <div className="logo-icon">
            <img src="/logo.svg" alt="Glucobalance Logo" width="24" height="24" />
          </div>
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
          <NavLink to="/analytics" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
            <PieChart size={20} />
            <span>Tahlil</span>
          </NavLink>
          <NavLink to="/food-gi" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
            <Utensils size={20} />
            <span>GI Katalog</span>
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
            <span>Mening profilim</span>
          </NavLink>
          <button onClick={handleLogout} className="sidebar-logout-btn">
            <LogOut size={20} />
            <span>Chiqish</span>
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="mobile-nav mobile-only glass">
        <NavLink to="/" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}>
          <Home size={24} />
          <span>Asosiy</span>
        </NavLink>
        <NavLink to="/glucose" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}>
          <Activity size={24} />
          <span>Log</span>
        </NavLink>
        <NavLink to="/analytics" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}>
          <PieChart size={24} />
          <span>Tahlil</span>
        </NavLink>
        <NavLink to="/healthy" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}>
          <Heart size={24} />
          <span>Hayot</span>
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}>
          <User size={24} />
          <span>Profil</span>
        </NavLink>
      </nav>

      <div className="content-wrapper">
        <header className="top-header desktop-only">
           <div className="header-search">
             <input type="text" placeholder="Qidiruv..." />
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
