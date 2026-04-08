import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';

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
    company: '',
    role: 'candidate'
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
        company: user.company || '',
        role: user.role || 'candidate'
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
      setSuccessMessage('Profile updated successfully.');
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
      setSuccessMessage('Password changed successfully.');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[#030014] text-slate-300 font-sans py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">Profile Settings</h1>
          <p className="text-sm text-slate-400">Manage your account settings and preferences</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-white/10">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-6 py-3 font-semibold text-sm transition-colors border-b-2 ${
              activeTab === 'profile' 
                ? 'text-purple-400 border-purple-500 bg-purple-500/10' 
                : 'text-slate-400 border-transparent hover:text-white hover:bg-white/5'
            }`}
          >
            Profile Information
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`px-6 py-3 font-semibold text-sm transition-colors border-b-2 ${
              activeTab === 'password' 
                ? 'text-purple-400 border-purple-500 bg-purple-500/10' 
                : 'text-slate-400 border-transparent hover:text-white hover:bg-white/5'
            }`}
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

                {profileData.role === 'recruiter' && (
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

                <div className="form-group-custom" style={{ marginBottom: 'var(--spacing-md)' }}>
                  <label className="form-label">Role</label>
                  <input
                    type="text"
                    className="form-control-custom"
                    value={profileData.role === 'recruiter' ? "Recruiter" : "Candidate"}
                    disabled
                    style={{ opacity: 0.6, cursor: 'not-allowed' }}
                  />
                  <small style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>
                    Role is set at registration and cannot be changed.
                  </small>
                </div>

                <button
                  type="submit"
                  className="btn-primary-custom"
                  disabled={loading}
                  style={{ minWidth: '150px' }}
                >
                  {loading ? 'Saving…' : 'Save Changes'}
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
                  {loading ? 'Changing…' : 'Change Password'}
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
