import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/Login';
import Register from './components/Register';
import RecruiterDashboard from './pages/RecruiterDashboard';
import CandidateDashboard from './pages/CandidateDashboard';
import './styles/custom.css';

function Navigation() {
  const { user, logout } = useAuth();

  return (
    <nav className="sticky-nav" style={{
      padding: '16px 0',
      boxShadow: 'var(--shadow-md)',
      transition: 'var(--transition)'
    }}>
      <div className="main-container flex items-center justify-between">
        <Link to="/" style={{ textDecoration: 'none' }}>
          <h1 style={{
            color: 'white',
            fontSize: '1.5rem',
            fontWeight: '600',
            margin: 0
          }}>🤖 TalentMatch AI</h1>
        </Link>
        <div className="flex gap-md items-center">
          {user ? (
            <>
              <span style={{ color: 'white' }}>👋 {user.name}</span>
              <Link to={user.role === 'recruiter' ? '/recruiter' : '/candidate'} style={{
                color: 'white',
                textDecoration: 'none',
                padding: '8px 16px',
                borderRadius: 'var(--radius)',
                transition: 'background-color 0.2s'
              }}>
                Dashboard
              </Link>
              <button onClick={logout} style={{
                color: 'white',
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.3)',
                padding: '8px 16px',
                borderRadius: 'var(--radius)',
                cursor: 'pointer'
              }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{
                color: 'white',
                textDecoration: 'none',
                padding: '8px 16px',
                borderRadius: 'var(--radius)'
              }}>
                Login
              </Link>
              <Link to="/register" style={{
                color: 'white',
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.3)',
                textDecoration: 'none',
                padding: '8px 16px',
                borderRadius: 'var(--radius)'
              }}>
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navigation />
        <Routes>
          <Route path="/" element={
            <div style={{ background: 'var(--primary-color)', color: 'white', padding: '80px 0' }}>
              <div className="main-container text-center">
                <h1 style={{ fontSize: '3rem', fontWeight: '700', marginBottom: '16px' }}>
                  🚀 AI-Driven Job Matching
                </h1>
                <p style={{ fontSize: '1.25rem', marginBottom: '48px', opacity: 0.9 }}>
                  <h3>AI-Powered Job Matching Made Simple</h3>
                  Connect recruiters with the right talent and help candidates find jobs that match their skills.<br/>
                  Our platform uses intelligent resume and job analysis to deliver faster, smarter, and more accurate hiring decisions.
                </p>
                <div className="grid-2" style={{ maxWidth: '600px', margin: '0 auto' }}>
                  <div className="card-custom" style={{ padding: '32px', textAlign: 'center' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '16px' }}>👔</div>
                    <h3 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>For Recruiters</h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
                      Post jobs and find perfect candidates
                    </p>
                    <Link to="/login" className="btn-primary-custom w-full" style={{ textDecoration: 'none' }}>
                      Get Started
                    </Link>
                  </div>
                  <div className="card-custom" style={{ padding: '32px', textAlign: 'center' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '16px' }}>👨💼</div>
                    <h3 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>For Candidates</h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
                      Upload resume and find opportunities
                    </p>
                    <Link to="/login" className="btn-primary-custom w-full" style={{ textDecoration: 'none' }}>
                      Get Started
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/recruiter" element={
            <ProtectedRoute allowedRoles={['recruiter']}>
              <RecruiterDashboard />
            </ProtectedRoute>
          } />
          <Route path="/candidate" element={
            <ProtectedRoute allowedRoles={['candidate']}>
              <CandidateDashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
