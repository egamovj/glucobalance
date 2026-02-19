import { useState } from 'react';
import { useNavigate, NavLink, Outlet } from 'react-router-dom';
import { 
  User, Activity, AlertCircle, BookOpen, Heart, Home, 
  Calculator, LogOut, PieChart, Utensils, Menu, X 
} from 'lucide-react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import './Layout.css';

const Layout: React.FC = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
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

      {/* Mobile Drawer Overlay */}
      <div className={`mobile-drawer-overlay mobile-only ${isMobileMenuOpen ? 'open' : ''}`} onClick={closeMobileMenu}>
        <div className={`mobile-drawer ${isMobileMenuOpen ? 'open' : ''}`} onClick={(e) => e.stopPropagation()}>
          <div className="drawer-header">
            <h3>Menyu</h3>
            <button className="close-btn" onClick={closeMobileMenu}>
              <X size={24} />
            </button>
          </div>
          <div className="drawer-content">
             <NavLink to="/calculator" className="drawer-item" onClick={closeMobileMenu}>
              <Calculator size={20} />
              <span>Kalkulyator</span>
            </NavLink>
            <NavLink to="/symptoms" className="drawer-item" onClick={closeMobileMenu}>
              <AlertCircle size={20} />
              <span>Simptomlar</span>
            </NavLink>
            <NavLink to="/food-gi" className="drawer-item" onClick={closeMobileMenu}>
              <Utensils size={20} />
              <span>GI Katalog</span>
            </NavLink>
            <NavLink to="/academy" className="drawer-item" onClick={closeMobileMenu}>
              <BookOpen size={20} />
              <span>Akademiya</span>
            </NavLink>
            <NavLink to="/profile" className="drawer-item" onClick={closeMobileMenu}>
              <User size={20} />
              <span>Profil</span>
            </NavLink>
            <div className="drawer-divider"></div>
            <button onClick={handleLogout} className="drawer-item logout-item">
              <LogOut size={20} />
              <span>Chiqish</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="mobile-nav mobile-only glass">
        <NavLink to="/" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`} onClick={closeMobileMenu}>
          <Home size={24} />
          <span>Asosiy</span>
        </NavLink>
        <NavLink to="/glucose" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`} onClick={closeMobileMenu}>
          <Activity size={24} />
          <span>Log</span>
        </NavLink>
        <NavLink to="/analytics" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`} onClick={closeMobileMenu}>
          <PieChart size={24} />
          <span>Tahlil</span>
        </NavLink>
        <NavLink to="/healthy" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`} onClick={closeMobileMenu}>
          <Heart size={24} />
          <span>Hayot</span>
        </NavLink>
        <button className={`mobile-nav-item btn-clear ${isMobileMenuOpen ? 'active' : ''}`} onClick={toggleMobileMenu}>
          <Menu size={24} />
          <span>Menyu</span>
        </button>
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
