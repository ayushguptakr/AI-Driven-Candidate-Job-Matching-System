import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, updateProfile, changePassword, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Profile form state
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    location: '',
    company: ''
  });

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        bio: user.bio || '',
        location: user.location || '',
        company: user.company || ''
      });
    }
  }, [user]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await updateProfile(profileData);
      await refreshUser();
      setSuccessMessage('Profile updated successfully! ✅');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrorMessage('New passwords do not match');
      setLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      await changePassword(passwordData.currentPassword, passwordData.newPassword);
      setSuccessMessage('Password changed successfully! ✅');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div style={{ backgroundColor: 'var(--bg-secondary)', minHeight: '100vh', paddingTop: 'var(--spacing-lg)', paddingBottom: 'var(--spacing-xl)' }}>
      <div className="main-container">
        <div style={{ marginBottom: 'var(--spacing-xl)' }}>
          <h1 className="page-title">👤 Profile Settings</h1>
          <p className="page-subtitle">Manage your account settings and preferences</p>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: 'var(--spacing-lg)',
          borderBottom: '2px solid var(--border-light)'
        }}>
          <button
            onClick={() => setActiveTab('profile')}
            style={{
              padding: '12px 24px',
              background: activeTab === 'profile' ? 'var(--primary)' : 'transparent',
              color: activeTab === 'profile' ? 'white' : 'var(--text-secondary)',
              border: 'none',
              borderBottom: activeTab === 'profile' ? '2px solid var(--primary)' : '2px solid transparent',
              cursor: 'pointer',
              fontFamily: 'DM Sans, sans-serif',
              fontWeight: '600',
              transition: 'var(--transition-fast)',
              marginBottom: '-2px'
            }}
          >
            Profile Information
          </button>
          <button
            onClick={() => setActiveTab('password')}
            style={{
              padding: '12px 24px',
              background: activeTab === 'password' ? 'var(--primary)' : 'transparent',
              color: activeTab === 'password' ? 'white' : 'var(--text-secondary)',
              border: 'none',
              borderBottom: activeTab === 'password' ? '2px solid var(--primary)' : '2px solid transparent',
              cursor: 'pointer',
              fontFamily: 'DM Sans, sans-serif',
              fontWeight: '600',
              transition: 'var(--transition-fast)',
              marginBottom: '-2px'
            }}
          >
            Change Password
          </button>
        </div>

        {/* Messages */}
        {successMessage && (
          <div style={{
            padding: '16px',
            borderRadius: 'var(--radius)',
            marginBottom: 'var(--spacing-md)',
            backgroundColor: '#f0fdf4',
            color: 'var(--success)',
            border: '1px solid #bbf7d0',
            fontFamily: 'DM Sans, sans-serif'
          }}>
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div style={{
            padding: '16px',
            borderRadius: 'var(--radius)',
            marginBottom: 'var(--spacing-md)',
            backgroundColor: '#fee2e2',
            color: 'var(--danger)',
            border: '1px solid #fecaca',
            fontFamily: 'DM Sans, sans-serif'
          }}>
            {errorMessage}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="card-custom">
            <div className="card-header-custom">
              <h3 className="section-title" style={{ margin: 0, padding: 0 }}>Personal Information</h3>
            </div>
            <div className="card-body-custom">
              <form onSubmit={handleProfileSubmit}>
                <div className="grid-2" style={{ marginBottom: 'var(--spacing-md)' }}>
                  <div className="form-group-custom">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-control-custom"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group-custom">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control-custom"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid-2" style={{ marginBottom: 'var(--spacing-md)' }}>
                  <div className="form-group-custom">
                    <label className="form-label">Phone</label>
                    <input
                      type="tel"
                      className="form-control-custom"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                  <div className="form-group-custom">
                    <label className="form-label">Location</label>
                    <input
                      type="text"
                      className="form-control-custom"
                      value={profileData.location}
                      onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                      placeholder="City, Country"
                    />
                  </div>
                </div>

                {user.role === 'recruiter' && (
                  <div className="form-group-custom" style={{ marginBottom: 'var(--spacing-md)' }}>
                    <label className="form-label">Company</label>
                    <input
                      type="text"
                      className="form-control-custom"
                      value={profileData.company}
                      onChange={(e) => setProfileData({ ...profileData, company: e.target.value })}
                      placeholder="Your company name"
                    />
                  </div>
                )}

                <div className="form-group-custom" style={{ marginBottom: 'var(--spacing-md)' }}>
                  <label className="form-label">Bio</label>
                  <textarea
                    className="form-control-custom"
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    rows="4"
                    placeholder="Tell us about yourself..."
                    style={{ minHeight: '100px', resize: 'vertical' }}
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary-custom"
                  disabled={loading}
                  style={{ minWidth: '150px' }}
                >
                  {loading ? '⏳ Saving...' : '💾 Save Changes'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Password Tab */}
        {activeTab === 'password' && (
          <div className="card-custom">
            <div className="card-header-custom">
              <h3 className="section-title" style={{ margin: 0, padding: 0 }}>Change Password</h3>
            </div>
            <div className="card-body-custom">
              <form onSubmit={handlePasswordSubmit}>
                <div className="form-group-custom">
                  <label className="form-label">Current Password</label>
                  <input
                    type="password"
                    className="form-control-custom"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    required
                  />
                </div>

                <div className="grid-2" style={{ marginBottom: 'var(--spacing-md)' }}>
                  <div className="form-group-custom">
                    <label className="form-label">New Password</label>
                    <input
                      type="password"
                      className="form-control-custom"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      required
                      minLength={6}
                    />
                  </div>
                  <div className="form-group-custom">
                    <label className="form-label">Confirm New Password</label>
                    <input
                      type="password"
                      className="form-control-custom"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      required
                      minLength={6}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-primary-custom"
                  disabled={loading}
                  style={{ minWidth: '150px' }}
                >
                  {loading ? '⏳ Changing...' : '🔒 Change Password'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
