import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

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
      navigate(user.role === 'recruiter' ? '/recruiter' : '/candidate');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-secondary)' }}>
      <div className="card-custom" style={{ width: '100%', maxWidth: '400px', padding: '40px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '32px', color: 'var(--text-primary)' }}>📝 Register</h2>
        {error && (
          <div style={{ padding: '12px', background: '#fee2e2', color: 'var(--danger-color)', borderRadius: 'var(--radius)', marginBottom: '20px' }}>
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-group-custom">
            <label className="form-label">Full Name</label>
            <input
              className="form-control-custom"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>
          <div className="form-group-custom">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control-custom"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>
          <div className="form-group-custom">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control-custom"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>
          <div className="form-group-custom">
            <label className="form-label">I am a</label>
            <select
              className="form-control-custom"
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
            >
              <option value="candidate">Candidate</option>
              <option value="recruiter">Recruiter</option>
            </select>
          </div>
          <button type="submit" className="btn-primary-custom w-full" disabled={loading}>
            {loading ? '🔄 Creating account...' : '🚀 Register'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '20px', color: 'var(--text-secondary)' }}>
          Already have an account? <a href="/login" style={{ color: 'var(--primary-color)' }}>Login</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
