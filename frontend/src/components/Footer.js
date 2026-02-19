import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Footer = () => {
  const { user } = useAuth();
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{
      background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
      color: '#F8FAFC',
      padding: '64px 0 32px',
      marginTop: 'auto',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      <div className="main-container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '48px',
          marginBottom: '48px'
        }}>
          {/* Brand Section */}
          <div>
            <h3 style={{
              fontFamily: 'Fraunces, serif',
              fontSize: '1.5rem',
              marginBottom: '16px',
              color: '#F8FAFC'
            }}>
              🤖 TalentMatch AI
            </h3>
            <p style={{
              color: 'rgba(248, 250, 252, 0.7)',
              lineHeight: '1.6',
              marginBottom: '24px',
              fontFamily: 'DM Sans, sans-serif'
            }}>
              AI-powered job matching platform connecting talented candidates with the right opportunities.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#F8FAFC',
                textDecoration: 'none',
                transition: 'var(--transition-fast)',
                fontSize: '1.2rem'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(13, 148, 136, 0.3)';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                e.target.style.transform = 'translateY(0)';
              }}>
                🐦
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#F8FAFC',
                textDecoration: 'none',
                transition: 'var(--transition-fast)',
                fontSize: '1.2rem'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(13, 148, 136, 0.3)';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                e.target.style.transform = 'translateY(0)';
              }}>
                💼
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#F8FAFC',
                textDecoration: 'none',
                transition: 'var(--transition-fast)',
                fontSize: '1.2rem'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(13, 148, 136, 0.3)';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                e.target.style.transform = 'translateY(0)';
              }}>
                🔗
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{
              fontFamily: 'Fraunces, serif',
              fontSize: '1.125rem',
              marginBottom: '20px',
              color: '#F8FAFC'
            }}>
              Quick Links
            </h4>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              fontFamily: 'DM Sans, sans-serif'
            }}>
              <li style={{ marginBottom: '12px' }}>
                <Link to="/" style={{
                  color: 'rgba(248, 250, 252, 0.7)',
                  textDecoration: 'none',
                  transition: 'var(--transition-fast)',
                  display: 'inline-block',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = '#14B8A6';
                  e.target.style.transform = 'translateX(4px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = 'rgba(248, 250, 252, 0.7)';
                  e.target.style.transform = 'translateX(0)';
                }}>
                  Home
                </Link>
              </li>
              {!user && (
                <>
                  <li style={{ marginBottom: '12px' }}>
                    <Link to="/login" style={{
                      color: 'rgba(248, 250, 252, 0.7)',
                      textDecoration: 'none',
                      transition: 'var(--transition-fast)',
                      display: 'inline-block',
                      position: 'relative'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = '#14B8A6';
                      e.target.style.transform = 'translateX(4px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = 'rgba(248, 250, 252, 0.7)';
                      e.target.style.transform = 'translateX(0)';
                    }}>
                      Login
                    </Link>
                  </li>
                  <li style={{ marginBottom: '12px' }}>
                    <Link to="/register" style={{
                      color: 'rgba(248, 250, 252, 0.7)',
                      textDecoration: 'none',
                      transition: 'var(--transition-fast)',
                      display: 'inline-block',
                      position: 'relative'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = '#14B8A6';
                      e.target.style.transform = 'translateX(4px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = 'rgba(248, 250, 252, 0.7)';
                      e.target.style.transform = 'translateX(0)';
                    }}>
                      Register
                    </Link>
                  </li>
                </>
              )}
              {user && (
                <li style={{ marginBottom: '12px' }}>
                  <Link to={user.role === 'recruiter' ? '/recruiter' : '/candidate'} style={{
                    color: 'rgba(248, 250, 252, 0.7)',
                    textDecoration: 'none',
                    transition: 'var(--transition-fast)',
                    display: 'inline-block',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = '#14B8A6';
                    e.target.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = 'rgba(248, 250, 252, 0.7)';
                    e.target.style.transform = 'translateX(0)';
                  }}>
                    Dashboard
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 style={{
              fontFamily: 'Fraunces, serif',
              fontSize: '1.125rem',
              marginBottom: '20px',
              color: '#F8FAFC'
            }}>
              Resources
            </h4>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              fontFamily: 'DM Sans, sans-serif'
            }}>
              <li style={{ marginBottom: '12px' }}>
                <a href="#about" style={{
                  color: 'rgba(248, 250, 252, 0.7)',
                  textDecoration: 'none',
                  transition: 'var(--transition-fast)',
                  display: 'inline-block',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = '#14B8A6';
                  e.target.style.transform = 'translateX(4px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = 'rgba(248, 250, 252, 0.7)';
                  e.target.style.transform = 'translateX(0)';
                }}>
                  About Us
                </a>
              </li>
              <li style={{ marginBottom: '12px' }}>
                <a href="#features" style={{
                  color: 'rgba(248, 250, 252, 0.7)',
                  textDecoration: 'none',
                  transition: 'var(--transition-fast)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = '#14B8A6';
                  e.target.style.paddingLeft = '4px';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = 'rgba(248, 250, 252, 0.7)';
                  e.target.style.paddingLeft = '0';
                }}>
                  Features
                </a>
              </li>
              <li style={{ marginBottom: '12px' }}>
                <a href="#help" style={{
                  color: 'rgba(248, 250, 252, 0.7)',
                  textDecoration: 'none',
                  transition: 'var(--transition-fast)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = '#14B8A6';
                  e.target.style.paddingLeft = '4px';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = 'rgba(248, 250, 252, 0.7)';
                  e.target.style.paddingLeft = '0';
                }}>
                  Help Center
                </a>
              </li>
              <li style={{ marginBottom: '12px' }}>
                <a href="#contact" style={{
                  color: 'rgba(248, 250, 252, 0.7)',
                  textDecoration: 'none',
                  transition: 'var(--transition-fast)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = '#14B8A6';
                  e.target.style.paddingLeft = '4px';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = 'rgba(248, 250, 252, 0.7)';
                  e.target.style.paddingLeft = '0';
                }}>
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 style={{
              fontFamily: 'Fraunces, serif',
              fontSize: '1.125rem',
              marginBottom: '20px',
              color: '#F8FAFC'
            }}>
              Legal
            </h4>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              fontFamily: 'DM Sans, sans-serif'
            }}>
              <li style={{ marginBottom: '12px' }}>
                <a href="#privacy" style={{
                  color: 'rgba(248, 250, 252, 0.7)',
                  textDecoration: 'none',
                  transition: 'var(--transition-fast)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = '#14B8A6';
                  e.target.style.paddingLeft = '4px';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = 'rgba(248, 250, 252, 0.7)';
                  e.target.style.paddingLeft = '0';
                }}>
                  Privacy Policy
                </a>
              </li>
              <li style={{ marginBottom: '12px' }}>
                <a href="#terms" style={{
                  color: 'rgba(248, 250, 252, 0.7)',
                  textDecoration: 'none',
                  transition: 'var(--transition-fast)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = '#14B8A6';
                  e.target.style.paddingLeft = '4px';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = 'rgba(248, 250, 252, 0.7)';
                  e.target.style.paddingLeft = '0';
                }}>
                  Terms of Service
                </a>
              </li>
              <li style={{ marginBottom: '12px' }}>
                <a href="#cookies" style={{
                  color: 'rgba(248, 250, 252, 0.7)',
                  textDecoration: 'none',
                  transition: 'var(--transition-fast)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = '#14B8A6';
                  e.target.style.paddingLeft = '4px';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = 'rgba(248, 250, 252, 0.7)';
                  e.target.style.paddingLeft = '0';
                }}>
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          paddingTop: '32px',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <p style={{
            margin: 0,
            color: 'rgba(248, 250, 252, 0.6)',
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '0.875rem'
          }}>
            © {currentYear} TalentMatch AI. All rights reserved.
          </p>
          <p style={{
            margin: 0,
            color: 'rgba(248, 250, 252, 0.6)',
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '0.875rem'
          }}>
            Made with ❤️ for better hiring
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
