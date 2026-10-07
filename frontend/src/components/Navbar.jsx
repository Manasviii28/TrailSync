import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Activity,
  Compass,
  History,
  Target,
  Trophy,
  Users,
  MessageSquare,
  User as UserIcon,
  LogOut,
  Menu,
  X,
  PlayCircle,
} from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const authNavItems = [
    { label: 'Dashboard', path: '/dashboard', icon: Compass },
    { label: 'Track Activity', path: '/track', icon: PlayCircle },
    { label: 'History', path: '/history', icon: History },
    { label: 'Goals', path: '/goals', icon: Target },
    { label: 'Challenges', path: '/challenges', icon: Trophy },
    { label: 'Friends', path: '/friends', icon: Users },
    { label: 'Messages', path: '/messages', icon: MessageSquare },
    { label: 'Profile', path: '/profile', icon: UserIcon },
  ];

  return (
    <nav style={{ backgroundColor: '#0f172a', borderBottom: '1px solid #334155', sticky: 'top', zIndex: 50 }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0.85rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Brand Logo */}
        <Link to={user ? '/dashboard' : '/'} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ background: 'linear-gradient(135deg, #10b981, #06b6d4)', padding: '0.5rem', borderRadius: '8px', display: 'flex', alignItems: 'center' }}>
            <Activity color="#0f172a" size={24} strokeWidth={2.5} />
          </div>
          <div>
            <span style={{ fontSize: '1.25rem', fontWeight: '800', color: '#f8fafc', letterSpacing: '-0.5px' }}>
              Trail<span style={{ color: '#10b981' }}>Sync</span>
            </span>
          </div>
        </Link>

        {/* Desktop Nav Items */}
        <div className="desktop-menu" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {user ? (
            <>
              {authNavItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.5rem 0.75rem',
                      borderRadius: '6px',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: active ? '#10b981' : '#94a3b8',
                      backgroundColor: active ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              <button
                onClick={handleLogout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#ef4444',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  border: 'none',
                  marginLeft: '0.5rem',
                }}
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                Login
              </Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{ background: 'none', border: 'none', color: '#f8fafc', display: 'none' }}
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div style={{ backgroundColor: '#1e293b', padding: '1rem', borderTop: '1px solid #334155' }}>
          {user ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {authNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.75rem 1rem',
                      borderRadius: '8px',
                      color: isActive(item.path) ? '#10b981' : '#f8fafc',
                      backgroundColor: isActive(item.path) ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                    }}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  color: '#ef4444',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  border: 'none',
                  marginTop: '0.5rem',
                  width: '100%',
                  textAlign: 'left',
                }}
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn btn-secondary">
                Login
              </Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="btn btn-primary">
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 960px) {
          .desktop-menu { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </nav>
  );
};
