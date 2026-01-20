import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import RecruiterDashboard from './pages/RecruiterDashboard';
import CandidateDashboard from './pages/CandidateDashboard';
import './styles/custom.css';

function App() {
  return (
    <Router>
      <nav style={{
        background: 'var(--primary-color)',
        padding: '16px 0',
        boxShadow: 'var(--shadow-md)'
      }}>
        <div className="main-container flex items-center justify-between">
          <h1 style={{
            color: 'white',
            fontSize: '1.5rem',
            fontWeight: '600',
            margin: 0
          }}>🤖 AI Job Matching</h1>
          <div className="flex gap-md">
            <Link to="/recruiter" style={{
              color: 'white',
              textDecoration: 'none',
              padding: '8px 16px',
              borderRadius: 'var(--radius)',
              transition: 'background-color 0.2s'
            }} onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
               onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}>
              👔 Recruiter
            </Link>
            <Link to="/candidate" style={{
              color: 'white',
              textDecoration: 'none',
              padding: '8px 16px',
              borderRadius: 'var(--radius)',
              transition: 'background-color 0.2s'
            }} onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
               onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}>
              👨‍💼 Candidate
            </Link>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={
          <div style={{ background: 'var(--primary-color)', color: 'white', padding: '80px 0' }}>
            <div className="main-container text-center">
              <h1 style={{ fontSize: '3rem', fontWeight: '700', marginBottom: '16px' }}>
                🚀 AI-Driven Job Matching
              </h1>
              <p style={{ fontSize: '1.25rem', marginBottom: '48px', opacity: 0.9 }}>
                Connect talent with opportunity using intelligent AI matching
              </p>
              <div className="grid-2" style={{ maxWidth: '600px', margin: '0 auto' }}>
                <div className="card-custom" style={{ padding: '32px', textAlign: 'center' }}>
                  <div style={{ fontSize: '4rem', marginBottom: '16px' }}>👔</div>
                  <h3 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>For Recruiters</h3>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
                    Post jobs and find perfect candidates
                  </p>
                  <Link to="/recruiter" className="btn-primary-custom w-full" style={{ textDecoration: 'none' }}>
                    Enter Portal
                  </Link>
                </div>
                <div className="card-custom" style={{ padding: '32px', textAlign: 'center' }}>
                  <div style={{ fontSize: '4rem', marginBottom: '16px' }}>👨‍💼</div>
                  <h3 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>For Candidates</h3>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
                    Upload resume and find opportunities
                  </p>
                  <Link to="/candidate" className="btn-primary-custom w-full" style={{ textDecoration: 'none' }}>
                    Enter Portal
                  </Link>
                </div>
              </div>
            </div>
          </div>
        } />
        <Route path="/recruiter" element={<RecruiterDashboard />} />
        <Route path="/candidate" element={<CandidateDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;