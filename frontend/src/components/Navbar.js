import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const profileMenuRef = useRef(null);
  const notificationsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowProfileMenu(false);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <nav className="sticky-nav" style={{
      padding: '20px 0',
      boxShadow: 'var(--shadow-md)',
      transition: 'var(--transition)'
    }}>
      <div className="main-container flex items-center justify-between">
        <Link to="/" style={{ textDecoration: 'none' }}>
          <h1 style={{
            color: '#F8FAFC',
            fontSize: '1.5rem',
            fontWeight: '700',
            margin: 0,
            fontFamily: 'Fraunces, serif',
            letterSpacing: '-0.02em',
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
            transition: 'var(--transition-fast)'
          }}>🤖 TalentMatch AI</h1>
        </Link>

        <div className="flex gap-md items-center">
          {user ? (
            <>
              {/* Dashboard Link */}
              <Link 
                to={user.role === 'recruiter' ? '/recruiter' : '/candidate'} 
                style={{
                  color: '#F8FAFC',
                  textDecoration: 'none',
                  padding: '10px 20px',
                  borderRadius: 'var(--radius)',
                  transition: 'var(--transition-fast)',
                  fontFamily: 'DM Sans, sans-serif',
                  fontWeight: '500',
                  background: location.pathname.includes('/recruiter') || location.pathname.includes('/candidate') 
                    ? 'rgba(255, 255, 255, 0.2)' 
                    : 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.25)';
                  e.target.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = location.pathname.includes('/recruiter') || location.pathname.includes('/candidate')
                    ? 'rgba(255, 255, 255, 0.2)'
                    : 'rgba(255, 255, 255, 0.1)';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                Dashboard
              </Link>

              {/* Notifications */}
              <div style={{ position: 'relative' }} ref={notificationsRef}>
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: 'var(--radius)',
                    padding: '10px',
                    cursor: 'pointer',
                    color: '#F8FAFC',
                    fontSize: '1.2rem',
                    position: 'relative',
                    transition: 'var(--transition-fast)',
                    backdropFilter: 'blur(10px)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                  }}
                >
                  🔔
                  {unreadCount > 0 && (
                    <span style={{
                      position: 'absolute',
                      top: '-4px',
                      right: '-4px',
                      background: 'var(--accent)',
                      color: 'white',
                      borderRadius: '50%',
                      width: '18px',
                      height: '18px',
                      fontSize: '0.7rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold'
                    }}>
                      {unreadCount}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 10px)',
                    right: 0,
                    background: 'white',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-lg)',
                    minWidth: '320px',
                    maxHeight: '400px',
                    overflowY: 'auto',
                    zIndex: 1000,
                    border: '1px solid var(--border-light)'
                  }}>
                    <div style={{
                      padding: '16px',
                      borderBottom: '1px solid var(--border-light)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <h3 style={{ margin: 0, fontSize: '1rem', fontFamily: 'Fraunces, serif' }}>Notifications</h3>
                      {unreadCount > 0 && (
                        <span className="badge-custom badge-primary">{unreadCount} new</span>
                      )}
                    </div>
                    <div>
                      {notifications.length === 0 ? (
                        <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                          <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🔕</div>
                          <p style={{ margin: 0 }}>No notifications</p>
                        </div>
                      ) : (
                        notifications.map((notif, idx) => (
                          <div
                            key={idx}
                            style={{
                              padding: '16px',
                              borderBottom: '1px solid var(--border-light)',
                              cursor: 'pointer',
                              background: !notif.read ? 'rgba(13, 148, 136, 0.05)' : 'transparent',
                              transition: 'var(--transition-fast)'
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.background = 'rgba(13, 148, 136, 0.1)';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.background = !notif.read ? 'rgba(13, 148, 136, 0.05)' : 'transparent';
                            }}
                          >
                            <div style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '4px' }}>
                              {notif.title}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                              {notif.message}
                            </div>
                            <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                              {notif.time}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Menu */}
              <div style={{ position: 'relative' }} ref={profileMenuRef}>
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    cursor: 'pointer',
                    color: '#F8FAFC',
                    fontSize: '1.2rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'var(--transition-fast)',
                    backdropFilter: 'blur(10px)',
                    fontWeight: 'bold'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                    e.target.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.transform = 'scale(1)';
                  }}
                >
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </button>

                {showProfileMenu && (
                  <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 10px)',
                    right: 0,
                    background: 'white',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-lg)',
                    minWidth: '200px',
                    zIndex: 1000,
                    border: '1px solid var(--border-light)',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      padding: '16px',
                      borderBottom: '1px solid var(--border-light)',
                      background: 'linear-gradient(135deg, rgba(13, 148, 136, 0.05) 0%, rgba(255, 107, 107, 0.02) 100%)'
                    }}>
                      <div style={{ fontWeight: '600', fontFamily: 'DM Sans, sans-serif', marginBottom: '4px' }}>
                        {user.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        {user.email}
                      </div>
                      <div style={{ marginTop: '8px' }}>
                        <span className="badge-custom badge-primary" style={{ fontSize: '0.625rem' }}>
                          {user.role === 'recruiter' ? '👔 Recruiter' : '👨💼 Candidate'}
                        </span>
                      </div>
                    </div>
                    <div>
                      <Link
                        to="/profile"
                        style={{
                          display: 'block',
                          padding: '12px 16px',
                          color: 'var(--text-primary)',
                          textDecoration: 'none',
                          transition: 'var(--transition-fast)',
                          fontFamily: 'DM Sans, sans-serif',
                          fontSize: '0.875rem'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = 'rgba(13, 148, 136, 0.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'transparent';
                        }}
                        onClick={() => setShowProfileMenu(false)}
                      >
                        👤 Profile Settings
                      </Link>
                      <Link
                        to={user.role === 'recruiter' ? '/recruiter' : '/candidate'}
                        style={{
                          display: 'block',
                          padding: '12px 16px',
                          color: 'var(--text-primary)',
                          textDecoration: 'none',
                          transition: 'var(--transition-fast)',
                          fontFamily: 'DM Sans, sans-serif',
                          fontSize: '0.875rem'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = 'rgba(13, 148, 136, 0.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'transparent';
                        }}
                        onClick={() => setShowProfileMenu(false)}
                      >
                        📊 Dashboard
                      </Link>
                      <div
                        style={{
                          padding: '12px 16px',
                          color: 'var(--danger)',
                          cursor: 'pointer',
                          transition: 'var(--transition-fast)',
                          fontFamily: 'DM Sans, sans-serif',
                          fontSize: '0.875rem',
                          borderTop: '1px solid var(--border-light)',
                          marginTop: '4px'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = 'rgba(239, 68, 68, 0.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'transparent';
                        }}
                        onClick={handleLogout}
                      >
                        🚪 Logout
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" style={{
                color: '#F8FAFC',
                textDecoration: 'none',
                padding: '10px 20px',
                borderRadius: 'var(--radius)',
                fontFamily: 'DM Sans, sans-serif',
                fontWeight: '500',
                transition: 'var(--transition-fast)'
              }}
              onMouseEnter={(e) => {
                e.target.style.color = '#14B8A6';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = '#F8FAFC';
                e.target.style.transform = 'translateY(0)';
              }}>
                Login
              </Link>
              <Link to="/register" style={{
                color: '#F8FAFC',
                background: 'rgba(255, 255, 255, 0.15)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                textDecoration: 'none',
                padding: '10px 20px',
                borderRadius: 'var(--radius)',
                fontFamily: 'DM Sans, sans-serif',
                fontWeight: '600',
                transition: 'var(--transition-fast)',
                backdropFilter: 'blur(10px)'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.25)';
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}>
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
