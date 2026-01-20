import React, { useState } from 'react';
import { resumeAPI } from '../services/api';

const ResumeUpload = ({ onResumeUploaded }) => {
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
      setMessage('Resume uploaded successfully! 🎉');
      setFormData({ candidateName: '', email: '', phone: '', skills: '', experience: '', education: '' });
      setFile(null);
      document.getElementById('resume-file').value = '';
      onResumeUploaded?.();
    } catch (error) {
      setMessage('Error uploading resume ❌');
    }
    setLoading(false);
  };

  return (
    <div className="card-custom">
      <div className="card-header-custom">
        <h2 className="section-title" style={{ margin: 0 }}>📄 Upload Your Resume</h2>
      </div>
      <div className="card-body-custom">
        {message && (
          <div style={{
            padding: 'var(--spacing-sm)',
            borderRadius: 'var(--radius)',
            marginBottom: 'var(--spacing-md)',
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
                placeholder="Your Email"
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
                placeholder="Your Phone Number"
              />
            </div>
            <div className="form-group-custom">
              <label className="form-label">Education</label>
              <input
                className="form-control-custom"
                value={formData.education}
                onChange={(e) => setFormData({...formData, education: e.target.value})}
                placeholder="Your Education Background"
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
              style={{ height: '72px', resize: 'vertical' }}
              value={formData.experience}
              onChange={(e) => setFormData({...formData, experience: e.target.value})}
              placeholder="Brief summary of your work experience..."
            />
          </div>
          
          <div className="form-group-custom">
            <label className="form-label">Resume File</label>
            <div style={{
              border: '2px dashed var(--border-color)',
              borderRadius: 'var(--radius)',
              padding: 'var(--spacing-lg)',
              textAlign: 'center',
              backgroundColor: 'var(--bg-tertiary)',
              transition: 'border-color 0.2s ease'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-sm)', opacity: 0.6 }}>📄</div>
              <h4 style={{ marginBottom: 'var(--spacing-xs)', color: 'var(--text-primary)' }}>Choose your resume file</h4>
              <p style={{ color: 'var(--text-muted)', marginBottom: 'var(--spacing-sm)' }}>PDF, DOC, DOCX, or TXT files accepted</p>
              <input
                id="resume-file"
                type="file"
                accept=".pdf,.txt,.doc,.docx"
                onChange={(e) => setFile(e.target.files[0])}
                style={{
                  width: '100%',
                  padding: 'var(--spacing-sm)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius)',
                  backgroundColor: 'var(--bg-primary)'
                }}
                required
              />
            </div>
          </div>
          
          <button type="submit" className="btn-primary-custom w-full" disabled={loading}>
            {loading ? '🔄 Uploading...' : '🚀 Upload Resume'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResumeUpload;