import React, { useState, useEffect } from 'react';
import ResumeUpload from '../components/ResumeUpload';
import { resumeAPI, jobAPI } from '../services/api';

const CandidateDashboard = () => {
  const [resumes, setResumes] = useState([]);
  const [jobs, setJobs] = useState([]);

  const loadData = async () => {
    try {
      const [resumeResponse, jobResponse] = await Promise.all([
        resumeAPI.getAll(),
        jobAPI.getAll()
      ]);
      setResumes(resumeResponse.data);
      setJobs(jobResponse.data);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div style={{ backgroundColor: 'var(--bg-secondary)', minHeight: '100vh', paddingTop: 'var(--spacing-lg)' }}>
      <div className="main-container">
        <div className="mb-xl">
          <h1 className="page-title">
            <span className="icon-lg" style={{ marginRight: 'var(--spacing-sm)' }}>👨💼</span>
            Candidate Dashboard
          </h1>
          <p className="page-subtitle">Upload your resume and discover matching job opportunities</p>
        </div>
        
        <div className="grid-2 gap-lg">
          <div>
            <ResumeUpload onResumeUploaded={loadData} />
            
            <div className="card-custom" style={{ marginTop: 'var(--spacing-lg)' }}>
              <div className="card-header-custom flex items-center justify-between">
                <h3 className="section-title" style={{ margin: 0, border: 'none', padding: 0 }}>
                  <span className="icon-md" style={{ marginRight: 'var(--spacing-xs)' }}>📄</span>
                  Your Resumes
                </h3>
                <span className="badge-custom badge-primary">{resumes.length}</span>
              </div>
              <div className="content-section">
                {resumes.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">📄</div>
                    <h4 style={{ color: 'var(--text-primary)' }}>No resumes uploaded yet</h4>
                    <p>Upload your first resume to get started</p>
                  </div>
                ) : (
                  resumes.map((resume) => (
                    <div key={resume._id} className="list-item">
                      <div className="w-full">
                        <div className="flex justify-between items-start mb-xs">
                          <div style={{ fontWeight: '600', color: 'var(--success-color)', fontSize: '0.875rem' }}>
                            {resume.candidateName}
                          </div>
                          <span className="badge-custom badge-primary" style={{ fontSize: '0.625rem' }}>
                            {new Date(resume.uploadedAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                          <span className="icon-sm">📧</span> {resume.email} • <span className="icon-sm">📞</span> {resume.phone}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--primary-color)', marginBottom: 'var(--spacing-xs)' }}>
                          <span className="icon-sm">📁</span> {resume.fileName}
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                          {resume.skills.slice(0, 4).map((skill, idx) => (
                            <span key={idx} className="badge-custom badge-success">
                              {skill}
                            </span>
                          ))}
                          {resume.skills.length > 4 && (
                            <span className="badge-custom badge-neutral">
                              +{resume.skills.length - 4}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          
          <div>
            <div className="card-custom">
              <div className="card-header-custom flex items-center justify-between">
                <h3 className="section-title" style={{ margin: 0, border: 'none', padding: 0 }}>
                  <span className="icon-md" style={{ marginRight: 'var(--spacing-xs)' }}>🔍</span>
                  Available Jobs
                </h3>
                <span className="badge-custom badge-primary">{jobs.length}</span>
              </div>
              <div className="content-section" style={{ maxHeight: '600px' }}>
                {jobs.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">💼</div>
                    <h4 style={{ color: 'var(--text-primary)' }}>No jobs available</h4>
                    <p>Check back later for new opportunities</p>
                  </div>
                ) : (
                  jobs.map((job) => (
                    <div key={job._id} className="list-item">
                      <div className="w-full">
                        <div className="flex items-start gap-sm mb-xs">
                          <div style={{ fontWeight: '600', color: 'var(--primary-color)', fontSize: '0.875rem', flex: 1 }}>
                            {job.title}
                          </div>
                          <span className="badge-custom badge-primary">{job.company}</span>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-xs)' }}>
                          <span className="icon-sm">📍</span> {job.location} • <span className="icon-sm"> </span> {job.salary}
                        </div>
                        <p style={{ 
                          fontSize: '0.75rem', 
                          lineHeight: '1.4', 
                          marginBottom: 'var(--spacing-xs)',
                          color: 'var(--text-primary)'
                        }}>
                          {job.description.length > 100 ? 
                            `${job.description.substring(0, 100)}...` : 
                            job.description
                          }
                        </p>
                        <div style={{ marginBottom: 'var(--spacing-xs)' }}>
                          <div style={{ fontSize: '0.625rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '2px' }}>
                            KEY REQUIREMENTS:
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-primary)', lineHeight: '1.3' }}>
                            {job.requirements.length > 80 ? 
                              `${job.requirements.substring(0, 80)}...` : 
                              job.requirements
                            }
                          </div>
                        </div>
                        <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)' }}>
                          Posted by {job.postedBy} • {new Date(job.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateDashboard;