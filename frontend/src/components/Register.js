import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({ email: '', password: '', name: '', role: 'candidate' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = await register(formData.email, formData.password, formData.name, formData.role);
      localStorage.setItem('selectedRole', user.role);
      navigate(user.role === 'recruiter' ? '/recruiter/dashboard' : '/candidate/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-secondary)' }}>
      <div className="card-custom" style={{ width: '100%', maxWidth: '420px', padding: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h2 style={{ marginBottom: '8px', color: 'var(--text-primary)' }}>Create your account</h2>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Choose whether you are a recruiter or a candidate.
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
            <label className="form-label" htmlFor="register-name">Full Name</label>
            <input
              id="register-name"
              className="form-control-custom"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>
          <div className="form-group-custom">
            <label className="form-label" htmlFor="register-email">Email</label>
            <input
              type="email"
              className="form-control-custom"
              id="register-email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>
          <div className="form-group-custom">
            <label className="form-label" htmlFor="register-password">Password</label>
            <input
              type="password"
              className="form-control-custom"
              id="register-password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>
          <div className="form-group-custom">
            <label className="form-label" htmlFor="register-role">I am a</label>
            <select
              className="form-control-custom"
              id="register-role"
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
            >
              <option value="candidate">Candidate</option>
              <option value="recruiter">Recruiter</option>
            </select>
          </div>
          <button type="submit" className="btn-primary-custom w-full" disabled={loading}>
            {loading ? 'Creating account…' : <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}><ArrowRight size={16} /> Register</span>}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '20px', color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary-color)', textDecoration: 'none', fontWeight: 500 }}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
