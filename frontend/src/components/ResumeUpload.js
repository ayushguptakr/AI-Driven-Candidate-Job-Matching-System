import React, { useState } from 'react';
import { resumeAPI } from '../services/api';

const ResumeUpload = ({ onResumeUploaded, onClose }) => {
  const [formData, setFormData] = useState({
    candidateName: '', email: '', phone: '', skills: '', experience: '', education: ''
  });
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage('Please select a resume file 📄');
      return;
    }

    setLoading(true);
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    data.append('resume', file);

    try {
      await resumeAPI.upload(data);
      setFormData({ candidateName: '', email: '', phone: '', skills: '', experience: '', education: '' });
      setFile(null);
      onResumeUploaded?.();
      onClose?.();
    } catch (error) {
      setMessage('Error uploading resume ❌');
    }
    setLoading(false);
  };

  return (
    <>
      {/* Modal Backdrop */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}
        onClick={onClose}
      >
        {/* Modal Content */}
        <div 
          className="card-custom"
          style={{
            width: '100%',
            maxWidth: '600px',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="card-header-custom flex items-center justify-between">
            <h2 className="section-title" style={{ margin: 0, border: 'none', padding: 0 }}>📄 Upload Your Resume</h2>
            <button 
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#6b7280',
                padding: '4px'
              }}
            >
              ×
            </button>
          </div>
          <div className="card-body-custom">
            {message && (
              <div style={{
                padding: '12px 16px',
                borderRadius: 'var(--radius)',
                marginBottom: '20px',
                backgroundColor: message.includes('Error') ? '#fef2f2' : '#f0fdf4',
                color: message.includes('Error') ? 'var(--danger-color)' : 'var(--success-color)',
                border: `1px solid ${message.includes('Error') ? '#fecaca' : '#bbf7d0'}`
              }}>
                {message}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="grid-2">
                <div className="form-group-custom">
                  <label className="form-label">Full Name</label>
                  <input
                    className="form-control-custom"
                    value={formData.candidateName}
                    onChange={(e) => setFormData({...formData, candidateName: e.target.value})}
                    placeholder="Your Full Name"
                    required
                  />
                </div>
                <div className="form-group-custom">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-control-custom"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="Your email address"
                    required
                  />
                </div>
              </div>
              
              <div className="grid-2">
                <div className="form-group-custom">
                  <label className="form-label">Phone Number</label>
                  <input
                    className="form-control-custom"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="Your Contact Number"
                  />
                </div>
                <div className="form-group-custom">
                  <label className="form-label">Education</label>
                  <input
                    className="form-control-custom"
                    value={formData.education}
                    onChange={(e) => setFormData({...formData, education: e.target.value})}
                    placeholder="Your highest degree or institution"
                  />
                </div>
              </div>
              
              <div className="form-group-custom">
                <label className="form-label">Key Skills</label>
                <input
                  className="form-control-custom"
                  value={formData.skills}
                  onChange={(e) => setFormData({...formData, skills: e.target.value})}
                  placeholder="React, Node.js, Python, SQL (comma-separated)"
                />
              </div>
              
              <div className="form-group-custom">
                <label className="form-label">Experience Summary</label>
                <textarea
                  className="form-control-custom"
                  style={{ height: '72px', resize: 'vertical', paddingTop: '12px', paddingBottom: '12px' }}
                  value={formData.experience}
                  onChange={(e) => setFormData({...formData, experience: e.target.value})}
                  placeholder="Brief summary of your work experience..."
                />
              </div>
              
              <div className="form-group-custom">
                <label className="form-label">Resume File</label>
                <div style={{
                  border: '2px dashed #d1d5db',
                  borderRadius: 'var(--radius)',
                  padding: '24px',
                  textAlign: 'center',
                  backgroundColor: '#f9fafb',
                  transition: 'border-color 0.2s ease'
                }}>
                  <div style={{ fontSize: '3rem', marginBottom: '12px', opacity: 0.6 }}>📄</div>
                  <h4 style={{ marginBottom: '8px', color: 'var(--text-primary)' }}>Choose your resume file</h4>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '16px', fontSize: '14px' }}>PDF, DOC, DOCX, or TXT files accepted</p>
                  <input
                    type="file"
                    accept=".pdf,.txt,.doc,.docx"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="form-control-custom"
                    required
                  />
                </div>
              </div>
              
              <div className="flex gap-sm">
                <button 
                  type="button" 
                  onClick={onClose}
                  style={{
                    background: '#f3f4f6',
                    border: '1px solid #d1d5db',
                    color: '#374151',
                    padding: '12px 24px',
                    borderRadius: 'var(--radius)',
                    fontWeight: '500',
                    fontSize: '14px',
                    height: '48px',
                    cursor: 'pointer',
                    flex: 1
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary-custom" style={{ flex: 2 }} disabled={loading}>
                  {loading ? '🔄 Uploading...' : '🚀 Upload Resume'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResumeUpload;