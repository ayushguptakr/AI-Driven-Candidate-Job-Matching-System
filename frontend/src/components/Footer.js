import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles } from 'lucide-react';

const Footer = () => {
  const { user } = useAuth();
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{
      background: 'linear-gradient(135deg, #0B1020 0%, #0F172A 55%, #111827 100%)',
      color: '#F8FAFC',
      padding: '22px 0',
      marginTop: 'auto',
      borderTop: '1px solid rgba(255, 255, 255, 0.08)'
    }}>
      <div className="main-container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        flexWrap: 'wrap'
      }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
          <span style={{ display: 'inline-flex', width: 30, height: 30, borderRadius: 10, alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.14)' }}>
            <Sparkles size={16} />
          </span>
          <div style={{ fontFamily: 'DM Sans, sans-serif' }}>
            <div style={{ fontWeight: 800, letterSpacing: '-0.01em' }}>TalentMatch AI</div>
            <div style={{ fontSize: 12, color: 'rgba(248, 250, 252, 0.65)' }}>
              © {currentYear}
            </div>
          </div>
        </div>

        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          fontFamily: 'DM Sans, sans-serif',
          fontSize: 13
        }}>
          <a href="#about" style={{ color: 'rgba(248, 250, 252, 0.75)', textDecoration: 'none' }}>About</a>
          <a href="#contact" style={{ color: 'rgba(248, 250, 252, 0.75)', textDecoration: 'none' }}>Contact</a>
          <a href="#privacy" style={{ color: 'rgba(248, 250, 252, 0.75)', textDecoration: 'none' }}>Privacy</a>
          {user && (
            <Link
              to={user.role === 'recruiter' ? '/recruiter/dashboard' : '/candidate/dashboard'}
              style={{ color: 'rgba(248, 250, 252, 0.85)', textDecoration: 'none', fontWeight: 700 }}
            >
              Dashboard
            </Link>
          )}
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
