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

  const inputClasses = "w-full bg-[#0a0520] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-all font-sans";
  const labelClasses = "text-sm font-semibold text-slate-300 drop-shadow-md";
  const buttonClasses = "px-6 py-3 rounded-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed min-w-[150px] shadow-lg shadow-purple-500/20";

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
          <div className="mb-8 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 font-medium">
            {errorMessage}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden mb-8">
            <div className="p-6 border-b border-white/5 bg-white/[0.01]">
              <h3 className="text-lg font-bold text-white m-0">Personal Information</h3>
            </div>
            <div className="p-6">
              <form onSubmit={handleProfileSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="flex flex-col gap-2">
                    <label className={labelClasses}>Full Name</label>
                    <input
                      type="text"
                      className={inputClasses}
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className={labelClasses}>Email</label>
                    <input
                      type="email"
                      className={inputClasses}
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="flex flex-col gap-2">
                    <label className={labelClasses}>Phone</label>
                    <input
                      type="tel"
                      className={inputClasses}
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className={labelClasses}>Location</label>
                    <input
                      type="text"
                      className={inputClasses}
                      value={profileData.location}
                      onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                      placeholder="City, Country"
                    />
                  </div>
                </div>

                {profileData.role === 'recruiter' && (
                  <div className="flex flex-col gap-2 mb-6">
                    <label className={labelClasses}>Company</label>
                    <input
                      type="text"
                      className={inputClasses}
                      value={profileData.company}
                      onChange={(e) => setProfileData({ ...profileData, company: e.target.value })}
                      placeholder="Your company name"
                    />
                  </div>
                )}

                <div className="flex flex-col gap-2 mb-6">
                  <label className={labelClasses}>Bio</label>
                  <textarea
                    className={inputClasses}
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    rows="4"
                    placeholder="Tell us about yourself..."
                    style={{ minHeight: '100px', resize: 'vertical' }}
                  />
                </div>

                <div className="flex flex-col gap-2 mb-8">
                  <label className={labelClasses}>Role</label>
                  <input
                    type="text"
                    className={`${inputClasses} opacity-60 cursor-not-allowed`}
                    value={profileData.role === 'recruiter' ? "Recruiter" : "Candidate"}
                    disabled
                  />
                  <small className="text-slate-500 text-xs mt-1">
                    Role is set at registration and cannot be changed.
                  </small>
                </div>

                <button
                  type="submit"
                  className={buttonClasses}
                  disabled={loading}
                >
                  {loading ? 'Saving…' : 'Save Changes'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Password Tab */}
        {activeTab === 'password' && (
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden mb-8">
            <div className="p-6 border-b border-white/5 bg-white/[0.01]">
              <h3 className="text-lg font-bold text-white m-0">Change Password</h3>
            </div>
            <div className="p-6">
              <form onSubmit={handlePasswordSubmit}>
                <div className="flex flex-col gap-2 mb-6">
                  <label className={labelClasses}>Current Password</label>
                  <input
                    type="password"
                    className={inputClasses}
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="flex flex-col gap-2">
                    <label className={labelClasses}>New Password</label>
                    <input
                      type="password"
                      className={inputClasses}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      required
                      minLength={6}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className={labelClasses}>Confirm New Password</label>
                    <input
                      type="password"
                      className={inputClasses}
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      required
                      minLength={6}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className={buttonClasses}
                  disabled={loading}
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
