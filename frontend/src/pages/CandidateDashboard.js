import React, { useState, useEffect } from 'react';
import ResumeUpload from '../components/ResumeUpload';
import { resumeAPI, jobAPI } from '../services/api';

const CandidateDashboard = () => {
  const [resumes, setResumes] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [isUploadResumeOpen, setIsUploadResumeOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isJobDetailOpen, setIsJobDetailOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({
    totalResumes: 0,
    totalJobs: 0,
    recommendedJobs: 0,
    avgMatchScore: 0
  });

  const loadData = async () => {
    try {
      const [resumeResponse, jobResponse] = await Promise.all([
        resumeAPI.getAll(),
        jobAPI.getAll()
      ]);
      setResumes(resumeResponse.data);
      setJobs(jobResponse.data);
      
      // Calculate statistics
      const recommendedJobs = jobResponse.data.length; // Simplified - could be based on match scores
      const avgScore = resumeResponse.data.length > 0 
        ? resumeResponse.data.reduce((sum, resume) => sum + (resume.avgMatchScore || 0), 0) / resumeResponse.data.length 
        : 0;
      
      setStats({
        totalResumes: resumeResponse.data.length,
        totalJobs: jobResponse.data.length,
        recommendedJobs: recommendedJobs,
        avgMatchScore: Math.round(avgScore)
      });
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleResumeUploaded = () => {
    loadData();
    setIsUploadResumeOpen(false);
    setSuccessMessage('Resume uploaded successfully! ✅');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleViewJobDetails = (job) => {
    setSelectedJob(job);
    setIsJobDetailOpen(true);
  };

  const handleApply = async (jobId) => {
    if (resumes.length === 0) {
      setSuccessMessage('Please upload a resume first before applying! 📄');
      setTimeout(() => setSuccessMessage(''), 3000);
      setIsJobDetailOpen(false);
      setIsUploadResumeOpen(true);
      return;
    }

    try {
      // For now, we'll just show a success message
      // In a real app, you'd call an API endpoint to submit the application
      setSuccessMessage(`Application submitted successfully for ${selectedJob?.title}! 🎉`);
      setTimeout(() => setSuccessMessage(''), 5000);
      setIsJobDetailOpen(false);
      setSelectedJob(null);
    } catch (error) {
      setSuccessMessage('Failed to submit application. Please try again.');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div style={{ backgroundColor: 'var(--bg-secondary)', minHeight: '100vh', paddingTop: 'var(--spacing-lg)' }}>
      <div className="main-container">
        <div className="mb-xl">
          <div className="flex items-center justify-between mb-md">
            <div>
              <h1 className="page-title">
                <span className="icon-lg" style={{ marginRight: 'var(--spacing-sm)' }}>👨💼</span>
                Candidate Dashboard
              </h1>
              <p className="page-subtitle">Upload your resume and discover matching job opportunities</p>
            </div>
            <button 
              className="btn-primary-custom"
              onClick={() => setIsUploadResumeOpen(true)}
              style={{ height: '48px', fontSize: '14px', fontWeight: '600' }}
            >
              📄 Upload New Resume
            </button>
          </div>
          
          {successMessage && (
            <div style={{
              padding: '12px 16px',
              borderRadius: 'var(--radius)',
              marginBottom: '20px',
              backgroundColor: '#f0fdf4',
              color: 'var(--success)',
              border: '1px solid #bbf7d0',
              fontFamily: 'DM Sans, sans-serif'
            }}>
              {successMessage}
            </div>
          )}

          {/* Statistics Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 'var(--spacing-md)',
            marginBottom: 'var(--spacing-lg)'
          }}>
            <div className="card-custom" style={{ padding: '24px', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📄</div>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '4px', fontFamily: 'Fraunces, serif' }}>
                {stats.totalResumes}
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontFamily: 'DM Sans, sans-serif' }}>
                Resumes Uploaded
              </div>
            </div>
            <div className="card-custom" style={{ padding: '24px', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>💼</div>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--accent)', marginBottom: '4px', fontFamily: 'Fraunces, serif' }}>
                {stats.totalJobs}
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontFamily: 'DM Sans, sans-serif' }}>
                Available Jobs
              </div>
            </div>
            <div className="card-custom" style={{ padding: '24px', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>⭐</div>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--success)', marginBottom: '4px', fontFamily: 'Fraunces, serif' }}>
                {stats.recommendedJobs}
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontFamily: 'DM Sans, sans-serif' }}>
                Recommended Jobs
              </div>
            </div>
            <div className="card-custom" style={{ padding: '24px', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🎯</div>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--warning)', marginBottom: '4px', fontFamily: 'Fraunces, serif' }}>
                {stats.avgMatchScore}%
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontFamily: 'DM Sans, sans-serif' }}>
                Avg Match Score
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div style={{ marginBottom: 'var(--spacing-md)' }}>
            <input
              type="text"
              placeholder="🔍 Search jobs by title, company, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-control-custom"
              style={{ maxWidth: '500px' }}
            />
          </div>
        </div>
        
        <div className="grid-2 gap-lg">
          <div>
            
            <div className="card-custom">
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
                  jobs
                    .filter(job => 
                      searchQuery === '' || 
                      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      job.description.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((job) => (
                    <div key={job._id} className="list-item" style={{ cursor: 'pointer' }}>
                      <div className="w-full">
                        <div className="flex items-start gap-sm mb-xs">
                          <div style={{ fontWeight: '600', color: 'var(--primary)', fontSize: '0.875rem', flex: 1 }}>
                            {job.title}
                          </div>
                          <span className="badge-custom badge-primary">{job.company}</span>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-xs)' }}>
                          <span className="icon-sm">📍</span> {job.location} • <span className="icon-sm">💰</span> {job.salary}
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
                        <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)', marginBottom: 'var(--spacing-xs)' }}>
                          Posted by {job.postedBy} • {new Date(job.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                        <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewJobDetails(job);
                            }}
                            className="btn-primary-custom"
                            style={{ 
                              fontSize: '0.75rem', 
                              padding: '6px 12px', 
                              height: 'auto',
                              flex: 1
                            }}
                          >
                            📋 View Details
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleApply(job._id);
                            }}
                            style={{
                              background: 'linear-gradient(135deg, var(--success) 0%, #059669 100%)',
                              border: 'none',
                              color: 'white',
                              padding: '6px 12px',
                              borderRadius: 'var(--radius)',
                              fontSize: '0.75rem',
                              fontWeight: '600',
                              cursor: 'pointer',
                              transition: 'var(--transition-fast)',
                              flex: 1,
                              fontFamily: 'DM Sans, sans-serif'
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.transform = 'translateY(-1px)';
                              e.target.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.transform = 'translateY(0)';
                              e.target.style.boxShadow = 'none';
                            }}
                          >
                            ✉️ Apply
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
        
        {isUploadResumeOpen && (
          <ResumeUpload 
            onResumeUploaded={handleResumeUploaded}
            onClose={() => setIsUploadResumeOpen(false)}
          />
        )}

        {/* Job Detail Modal */}
        {isJobDetailOpen && selectedJob && (
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
              backdropFilter: 'blur(4px)'
            }}
            onClick={() => setIsJobDetailOpen(false)}
          >
            <div 
              className="card-custom"
              style={{
                width: '100%',
                maxWidth: '800px',
                maxHeight: '90vh',
                overflowY: 'auto',
                background: 'white',
                animation: 'scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="card-header-custom flex items-center justify-between">
                <h2 className="section-title" style={{ margin: 0, padding: 0, border: 'none' }}>
                  💼 {selectedJob.title}
                </h2>
                <button 
                  onClick={() => setIsJobDetailOpen(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '28px',
                    cursor: 'pointer',
                    color: 'var(--text-secondary)',
                    padding: '4px',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    transition: 'var(--transition-fast)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(239, 68, 68, 0.1)';
                    e.target.style.color = 'var(--danger)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'transparent';
                    e.target.style.color = 'var(--text-secondary)';
                  }}
                >
                  ×
                </button>
              </div>
              <div className="card-body-custom">
                <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: 'var(--spacing-md)' }}>
                    <span className="badge-custom badge-primary">{selectedJob.company}</span>
                    <span className="badge-custom badge-secondary">
                      <span className="icon-sm">📍</span> {selectedJob.location}
                    </span>
                    {selectedJob.salary && (
                      <span className="badge-custom badge-success">
                        <span className="icon-sm">💰</span> {selectedJob.salary}
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: 'var(--spacing-md)' }}>
                    Posted by {selectedJob.postedBy} • {new Date(selectedJob.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>

                <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                  <h3 style={{ 
                    fontSize: '1.125rem', 
                    fontWeight: '700', 
                    marginBottom: 'var(--spacing-sm)',
                    color: 'var(--text-primary)',
                    fontFamily: 'Fraunces, serif'
                  }}>
                    Job Description
                  </h3>
                  <p style={{ 
                    color: 'var(--text-secondary)', 
                    lineHeight: '1.8',
                    fontSize: '0.9375rem',
                    whiteSpace: 'pre-wrap',
                    fontFamily: 'DM Sans, sans-serif'
                  }}>
                    {selectedJob.description}
                  </p>
                </div>

                <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                  <h3 style={{ 
                    fontSize: '1.125rem', 
                    fontWeight: '700', 
                    marginBottom: 'var(--spacing-sm)',
                    color: 'var(--text-primary)',
                    fontFamily: 'Fraunces, serif'
                  }}>
                    Requirements & Skills
                  </h3>
                  <p style={{ 
                    color: 'var(--text-secondary)', 
                    lineHeight: '1.8',
                    fontSize: '0.9375rem',
                    whiteSpace: 'pre-wrap',
                    fontFamily: 'DM Sans, sans-serif'
                  }}>
                    {selectedJob.requirements}
                  </p>
                </div>

                {selectedJob.eligibility && (
                  <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                    <h3 style={{ 
                      fontSize: '1.125rem', 
                      fontWeight: '700', 
                      marginBottom: 'var(--spacing-sm)',
                      color: 'var(--text-primary)',
                      fontFamily: 'Fraunces, serif'
                    }}>
                      Eligibility Criteria
                    </h3>
                    <p style={{ 
                      color: 'var(--text-secondary)', 
                      lineHeight: '1.8',
                      fontSize: '0.9375rem',
                      whiteSpace: 'pre-wrap',
                      fontFamily: 'DM Sans, sans-serif'
                    }}>
                      {selectedJob.eligibility}
                    </p>
                  </div>
                )}

                <div style={{ 
                  display: 'flex', 
                  gap: 'var(--spacing-md)', 
                  marginTop: 'var(--spacing-xl)',
                  paddingTop: 'var(--spacing-lg)',
                  borderTop: '1px solid var(--border-light)'
                }}>
                  <button
                    onClick={() => setIsJobDetailOpen(false)}
                    style={{
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-primary)',
                      padding: '12px 24px',
                      borderRadius: 'var(--radius)',
                      fontWeight: '600',
                      fontSize: '0.9375rem',
                      cursor: 'pointer',
                      transition: 'var(--transition-fast)',
                      flex: 1,
                      fontFamily: 'DM Sans, sans-serif'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'var(--border)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'var(--bg-tertiary)';
                    }}
                  >
                    Close
                  </button>
                  <button
                    onClick={() => handleApply(selectedJob._id)}
                    className="btn-primary-custom"
                    style={{ flex: 2 }}
                  >
                    ✉️ Apply for this Position
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateDashboard;