import React, { useState } from 'react';
import { jobAPI } from '../services/api';

const JobForm = ({ onJobCreated }) => {
  const [job, setJob] = useState({
    title: '', company: '', description: '', requirements: '', location: '', salary: '', postedBy: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await jobAPI.create(job);
      setMessage('Job posted successfully! 🎉');
      setJob({ title: '', company: '', description: '', requirements: '', location: '', salary: '', postedBy: '' });
      onJobCreated?.();
    } catch (error) {
      setMessage('Error posting job ❌');
    }
    setLoading(false);
  };

  return (
    <div className="card-custom">
      <div className="card-header-custom">
        <h2 className="section-title" style={{ margin: 0 }}>💼 Post New Job</h2>
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
              <label className="form-label">Job Title</label>
              <input
                className="form-control-custom"
                value={job.title}
                onChange={(e) => setJob({...job, title: e.target.value})}
                placeholder="e.g. Full Stack Developer"
                required
              />
            </div>
            <div className="form-group-custom">
              <label className="form-label">Company</label>
              <input
                className="form-control-custom"
                value={job.company}
                onChange={(e) => setJob({...job, company: e.target.value})}
                placeholder="e.g. Tech Corp"
                required
              />
            </div>
          </div>
          
          <div className="form-group-custom">
            <label className="form-label">Job Description</label>
            <textarea
              className="form-control-custom"
              style={{ height: '92px', resize: 'vertical', paddingTop: '12px', paddingBottom: '12px' }}
              value={job.description}
              onChange={(e) => setJob({...job, description: e.target.value})}
              placeholder="Describe the role and responsibilities..."
              required
            />
          </div>
          
          <div className="form-group-custom">
            <label className="form-label">Requirements & Skills</label>
            <textarea
              className="form-control-custom"
              style={{ height: '92px', resize: 'vertical', paddingTop: '12px', paddingBottom: '12px' }}
              value={job.requirements}
              onChange={(e) => setJob({...job, requirements: e.target.value})}
              placeholder="List required skills, experience, qualifications..."
              required
            />
          </div>
          
          <div className="grid-3">
            <div className="form-group-custom">
              <label className="form-label">Location</label>
              <input
                className="form-control-custom"
                value={job.location}
                onChange={(e) => setJob({...job, location: e.target.value})}
                
                required
              />
            </div>
            <div className="form-group-custom">
              <label className="form-label">Salary Range</label>
              <input
                className="form-control-custom"
                value={job.salary}
                onChange={(e) => setJob({...job, salary: e.target.value})}
              
              />
            </div>
            <div className="form-group-custom">
              <label className="form-label">Posted By</label>
              <input
                className="form-control-custom"
                value={job.postedBy}
                onChange={(e) => setJob({...job, postedBy: e.target.value})}
                required
              />
            </div>
          </div>
          
          <button type="submit" className="btn-primary-custom w-full" disabled={loading}>
            {loading ? '🔄 Posting...' : '🚀 Post Job'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default JobForm;