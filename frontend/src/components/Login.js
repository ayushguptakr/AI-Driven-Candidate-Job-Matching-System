import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = await login(email, password);
      localStorage.setItem('selectedRole', user.role);
      navigate(user.role === 'recruiter' ? '/recruiter/dashboard' : '/candidate/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-secondary)' }}>
      <div className="card-custom" style={{ width: '100%', maxWidth: '420px', padding: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h2 style={{ marginBottom: '8px', color: 'var(--text-primary)' }}>Login</h2>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Access your recruiter or candidate dashboard.
          </p>
        </div>
        {error && (
          <div
            role="alert"
            aria-live="polite"
            style={{
              padding: '12px',
              background: '#fee2e2',
              color: 'var(--danger-color)',
              borderRadius: 'var(--radius)',
              marginBottom: '20px',
              fontSize: '0.875rem'
            }}
          >
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-group-custom">
            <label className="form-label" htmlFor="login-email">Email</label>
            <input
              type="email"
              className="form-control-custom"
              id="login-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group-custom">
            <label className="form-label" htmlFor="login-password">Password</label>
            <input
              type="password"
              className="form-control-custom"
              id="login-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-primary-custom w-full" disabled={loading}>
            {loading ? 'Signing in…' : <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}><ArrowRight size={16} /> Login</span>}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '20px', color: 'var(--text-secondary)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--primary-color)', textDecoration: 'none', fontWeight: 500 }}>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
