import React, { useState, useEffect, useRef } from 'react';
import { X, User, Phone, Mail, Building2, Save, LogOut, Trash2, Camera, ShieldAlert, AlertTriangle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authAPI, companyAPI } from '../services/api';
import Button from './ui/Button';
import { useNavigate } from 'react-router-dom';

const ProfileDrawer = ({ isOpen, onClose }) => {
  const { user, logout, fetchUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    companyName: '',
  });

  const [isDirty, setIsDirty] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ text: '', type: '' });
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  // Editing state for smart inline edits
  const [editingField, setEditingField] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (user && isOpen) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        companyName: user.companyId?.name || user.company || '',
      });
      setIsDirty(false);
      setStatusMessage({ text: '', type: '' });
      setIsDeleteMode(false);
      setDeleteConfirmText('');
    }
  }, [user, isOpen]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    if (editingField && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingField]);

  if (!isOpen || !user) return null;

  const showMessage = (text, type = 'success') => {
    setStatusMessage({ text, type });
    setTimeout(() => setStatusMessage({ text: '', type: '' }), 4000);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const handleSave = async () => {
    if (!isDirty) return;
    setLoading(true);
    setStatusMessage({ text: '', type: '' });

    try {
      // Create user profile updates payload
      const userPayload = {
        name: formData.name,
        phone: formData.phone,
      };

      // Always update user
      await authAPI.updateProfile(userPayload);

      // If recruiter and company name changed, update company
      if (user.role === 'recruiter' && formData.companyName !== user.companyId?.name) {
        if (user.companyId?.createdBy === user.id) {
          await companyAPI.update({ name: formData.companyName });
        } else {
          showMessage("Only the workspace creator can change the company name.", "error");
          setLoading(false);
          return; // Early return to avoid wiping the error message
        }
      }

      await fetchUser(); // Reload context
      showMessage('Profile updated successfully!', 'success');
      setIsDirty(false);
      setEditingField(null);
    } catch (err) {
      showMessage(err.response?.data?.error || 'Failed to update profile.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    onClose();
  };

  const handleDeleteAccount = () => {
    if (deleteConfirmText !== 'DELETE') {
      showMessage('Please type DELETE to confirm.', 'error');
      return;
    }
    showMessage('Account deletion has been disabled in this demo.', 'error');
    setIsDeleteMode(false);
    setDeleteConfirmText('');
  };

  // Avatar generation
  const initials = formData.name ? formData.name.substring(0, 2).toUpperCase() : 'U';

  return (
    <>
      {/* Background Dim Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div 
        className={`fixed inset-y-0 right-0 w-full max-w-[380px] bg-[#0A0520]/95 backdrop-blur-xl border-l border-white/10 z-50 sm:shadow-2xl sm:shadow-purple-900/20 transform transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col`}
        style={{ transform: isOpen ? 'translateX(0)' : 'translateX(100%)' }}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 shrink-0">
          <h2 className="text-lg font-bold text-white tracking-wide">Personal Details</h2>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/5 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          
          {/* Global Messages */}
          {statusMessage.text && (
            <div className={`p-4 rounded-xl text-sm font-medium flex items-start gap-3 border ${
              statusMessage.type === 'error' 
                ? 'bg-red-500/10 border-red-500/20 text-red-400' 
                : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
            }`}>
              {statusMessage.type === 'error' ? <AlertTriangle size={18} className="shrink-0 mt-0.5" /> : <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5"></div>}
              {statusMessage.text}
            </div>
          )}

          {/* Avatar Section */}
          <div className="flex items-center gap-5">
            <div className="relative group">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg border-2 border-[#0A0520]">
                {initials}
              </div>
              <button 
                className="absolute inset-0 rounded-full bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border border-white/20"
                onClick={() => showMessage('Avatar upload requires a backend storage service like AWS S3 or Cloudinary.', 'error')}
              >
                <Camera size={18} className="text-white mb-1" />
                <span className="text-[10px] text-white font-medium">Upload</span>
              </button>
            </div>
            <div>
              <div className="inline-flex px-2.5 py-1 rounded-md bg-purple-500/20 border border-purple-500/30 text-purple-300 text-[11px] font-bold tracking-wider uppercase mb-1">
                {user.role}
              </div>
              <p className="text-sm text-slate-400 break-all">{user.email}</p>
            </div>
          </div>

          <hr className="border-white/5" />

          {/* Editable Fields Wrapper Component */}
          <div className="space-y-6">
            
            {/* Full Name */}
            <div className={`p-3 -mx-3 rounded-xl border border-transparent transition-colors ${editingField === 'name' ? 'bg-white/[0.04] border-white/10' : 'hover:bg-white/[0.02]'}`}>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-2">
                <User size={14} /> Full Name
              </label>
              {editingField === 'name' ? (
                <input
                  ref={inputRef}
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  onBlur={() => setEditingField(null)}
                  onKeyDown={(e) => e.key === 'Enter' && setEditingField(null)}
                  className="w-full bg-transparent text-white font-medium text-[15px] outline-none py-1 border-b border-purple-500/50"
                />
              ) : (
                <div 
                  onClick={() => setEditingField('name')} 
                  className="text-white font-medium text-[15px] py-1 cursor-text flex items-center justify-between group"
                >
                  <span>{formData.name || 'Set your name...'}</span>
                  <span className="text-[10px] text-slate-500 opacity-0 group-hover:opacity-100 uppercase font-bold tracking-widest transition-opacity">Edit</span>
                </div>
              )}
            </div>

            {/* Phone */}
            <div className={`p-3 -mx-3 rounded-xl border border-transparent transition-colors ${editingField === 'phone' ? 'bg-white/[0.04] border-white/10' : 'hover:bg-white/[0.02]'}`}>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-2">
                <Phone size={14} /> Phone Number
              </label>
              {editingField === 'phone' ? (
                <input
                  ref={inputRef}
                  type="text"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  onBlur={() => setEditingField(null)}
                  onKeyDown={(e) => e.key === 'Enter' && setEditingField(null)}
                  className="w-full bg-transparent text-white font-medium text-[15px] outline-none py-1 border-b border-purple-500/50"
                  placeholder="+1 (555) 000-0000"
                />
              ) : (
                <div 
                  onClick={() => setEditingField('phone')} 
                  className="text-white font-medium text-[15px] py-1 cursor-text flex items-center justify-between group"
                >
                  <span className={!formData.phone ? "text-slate-500 italic" : ""}>{formData.phone || 'Add phone number...'}</span>
                  <span className="text-[10px] text-slate-500 opacity-0 group-hover:opacity-100 uppercase font-bold tracking-widest transition-opacity">Edit</span>
                </div>
              )}
            </div>

            {/* Recruiter specific fields */}
            {user.role === 'recruiter' && (
              <div className={`p-3 -mx-3 rounded-xl border border-transparent transition-colors ${editingField === 'company' ? 'bg-white/[0.04] border-white/10' : 'hover:bg-white/[0.02]'}`}>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-2">
                  <Building2 size={14} /> Workspace / Company
                </label>
                {editingField === 'company' ? (
                  <input
                    ref={inputRef}
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => handleChange('companyName', e.target.value)}
                    onBlur={() => setEditingField(null)}
                    onKeyDown={(e) => e.key === 'Enter' && setEditingField(null)}
                    className="w-full bg-transparent text-white font-medium text-[15px] outline-none py-1 border-b border-purple-500/50"
                    disabled={user.companyId?.createdBy !== user.id}
                  />
                ) : (
                  <div 
                    onClick={() => {
                      if (user.companyId?.createdBy === user.id) {
                        setEditingField('company');
                      } else {
                        showMessage('Only the workspace creator can edit this field.', 'error');
                      }
                    }} 
                    className={`text-white font-medium text-[15px] py-1 flex items-center justify-between group ${user.companyId?.createdBy === user.id ? 'cursor-text' : 'cursor-not-allowed opacity-70'}`}
                  >
                    <span>{formData.companyName}</span>
                    {user.companyId?.createdBy === user.id && (
                      <span className="text-[10px] text-slate-500 opacity-0 group-hover:opacity-100 uppercase font-bold tracking-widest transition-opacity">Edit</span>
                    )}
                  </div>
                )}
                {user.companyId?.createdBy !== user.id && (
                  <p className="text-xs text-slate-500 mt-2 flex items-center gap-1.5"><ShieldAlert size={12}/> Locked. Managed by administrator.</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-white/10 bg-black/20 shrink-0 space-y-4">
          <Button 
            onClick={handleSave} 
            variant={isDirty ? "primary" : "secondary"} 
            fullWidth 
            disabled={!isDirty || loading}
            className={`transition-all ${!isDirty && 'opacity-50'}`}
          >
            {loading ? <Loader2 size={18} className="animate-spin mx-auto" /> : (
              <span className="flex items-center justify-center gap-2">
                <Save size={18} /> Save Changes
              </span>
            )}
          </Button>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={handleLogout}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 transition-all text-sm font-semibold"
            >
              <LogOut size={16} /> Sign out
            </button>
            <button 
              onClick={() => setIsDeleteMode(true)}
              className="px-4 py-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all tooltip-trigger"
              title="Delete Account"
            >
              <Trash2 size={16} />
            </button>
          </div>

          {/* Danger Zone Expansion */}
          {isDeleteMode && (
            <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 mt-4 animate-fade-in">
              <h4 className="text-sm font-bold text-red-400 mb-1">Delete Account</h4>
              <p className="text-xs text-slate-400 mb-3 leading-relaxed">This action is permanent and cannot be undone. Type <strong>DELETE</strong> below to confirm.</p>
              <input 
                type="text" 
                placeholder="DELETE"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                className="w-full bg-black/40 border border-red-500/30 rounded-lg px-3 py-2 text-sm text-red-300 outline-none focus:border-red-500 mb-3 uppercase"
              />
              <div className="flex gap-2">
                <button 
                  onClick={() => { setIsDeleteMode(false); setDeleteConfirmText(''); }}
                  className="flex-1 py-2 text-xs font-semibold text-slate-300 hover:bg-white/5 rounded-lg"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDeleteAccount}
                  disabled={deleteConfirmText !== 'DELETE'}
                  className="flex-1 py-2 text-xs font-bold bg-red-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Confirm
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProfileDrawer;
