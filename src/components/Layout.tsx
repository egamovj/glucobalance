import { useState } from 'react';
import { useNavigate, NavLink, Outlet } from 'react-router-dom';
import { 
  User, Activity, AlertCircle, BookOpen, Heart, Home, 
  Calculator, LogOut, PieChart, Utensils, Menu, X, Shield,
  Stethoscope, MessageCircle, Calendar, Droplets
} from 'lucide-react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { useStore } from '../store';
import './Layout.css';

const Layout: React.FC = () => {
  const navigate = useNavigate();
  const { profile, logout } = useStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isAdmin = profile?.role === 'admin';
  const isDoctor = profile?.role === 'doctor';

  const handleLogout = async () => {
    try {
      await signOut(auth);
      logout();
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

  // Admin sidebar navigation
  const AdminNavItems = () => (
    <>
      <NavLink to="/admin" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
        <Shield size={20} />
        <span>Admin Panel</span>
      </NavLink>
      <NavLink to="/chat" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
        <MessageCircle size={20} />
        <span>Xabarlar</span>
      </NavLink>
      <NavLink to="/appointments" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
        <Calendar size={20} />
        <span>Navbatlar</span>
      </NavLink>
    </>
  );

  // Doctor sidebar navigation
  const DoctorNavItems = () => (
    <>
      <NavLink to="/doctor" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
        <Stethoscope size={20} />
        <span>Shifokor Panel</span>
      </NavLink>
      <NavLink to="/chat" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
        <MessageCircle size={20} />
        <span>Xabarlar</span>
      </NavLink>
      <NavLink to="/appointments" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
        <Calendar size={20} />
        <span>Navbatlar</span>
      </NavLink>
    </>
  );

  // Patient sidebar navigation
  const PatientNavItems = () => (
    <>
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
      <NavLink to="/insulin" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
        <Droplets size={20} />
        <span>Kunlik insulin</span>
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
      <div className="nav-divider">Aloqa</div>
      <NavLink to="/chat" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
        <MessageCircle size={20} />
        <span>Xabarlar</span>
      </NavLink>
      <NavLink to="/appointments" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
        <Calendar size={20} />
        <span>Navbat</span>
      </NavLink>
    </>
  );

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
          {isAdmin ? <AdminNavItems /> : (isDoctor ? <DoctorNavItems /> : <PatientNavItems />)}
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
            {isAdmin ? (
              <>
                <NavLink to="/admin" className="drawer-item" onClick={closeMobileMenu}>
                  <Shield size={20} />
                  <span>Admin Panel</span>
                </NavLink>
              </>
            ) : isDoctor ? (
              <>
                <NavLink to="/doctor" className="drawer-item" onClick={closeMobileMenu}>
                  <Stethoscope size={20} />
                  <span>Shifokor Panel</span>
                </NavLink>
              </>
            ) : (
              <>
                <NavLink to="/" className="drawer-item" onClick={closeMobileMenu}>
                  <Home size={20} />
                  <span>Dashboard</span>
                </NavLink>
                <NavLink to="/calculator" className="drawer-item" onClick={closeMobileMenu}>
                  <Calculator size={20} />
                  <span>Kalkulyator</span>
                </NavLink>
                <NavLink to="/insulin" className="drawer-item" onClick={closeMobileMenu}>
                  <Droplets size={20} />
                  <span>Kunlik insulin</span>
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
                <NavLink to="/healthy" className="drawer-item" onClick={closeMobileMenu}>
                  <Heart size={20} />
                  <span>Sog'lom hayot</span>
                </NavLink>
              </>
            )}
            <NavLink to="/chat" className="drawer-item" onClick={closeMobileMenu}>
              <MessageCircle size={20} />
              <span>Xabarlar</span>
            </NavLink>
            <NavLink to="/appointments" className="drawer-item" onClick={closeMobileMenu}>
              <Calendar size={20} />
              <span>Navbat</span>
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
        {isAdmin ? (
          <>
            <NavLink to="/admin" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`} onClick={closeMobileMenu}>
              <Shield size={24} />
              <span>Panel</span>
            </NavLink>
            <NavLink to="/chat" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`} onClick={closeMobileMenu}>
              <MessageCircle size={24} />
              <span>Chat</span>
            </NavLink>
            <NavLink to="/appointments" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`} onClick={closeMobileMenu}>
              <Calendar size={24} />
              <span>Navbat</span>
            </NavLink>
          </>
        ) : isDoctor ? (
          <>
            <NavLink to="/doctor" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`} onClick={closeMobileMenu}>
              <Stethoscope size={24} />
              <span>Panel</span>
            </NavLink>
            <NavLink to="/chat" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`} onClick={closeMobileMenu}>
              <MessageCircle size={24} />
              <span>Chat</span>
            </NavLink>
            <NavLink to="/appointments" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`} onClick={closeMobileMenu}>
              <Calendar size={24} />
              <span>Navbat</span>
            </NavLink>
          </>
        ) : (
          <>
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
            <NavLink to="/chat" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`} onClick={closeMobileMenu}>
              <MessageCircle size={24} />
              <span>Chat</span>
            </NavLink>
          </>
        )}
        <button className={`mobile-nav-item btn-clear ${isMobileMenuOpen ? 'active' : ''}`} onClick={toggleMobileMenu}>
          <Menu size={24} />
          <span>Menyu</span>
        </button>
      </nav>

      <div className="content-wrapper">
        <main className="content-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
