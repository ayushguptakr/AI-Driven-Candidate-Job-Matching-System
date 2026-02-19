import React, { useState, useEffect } from 'react';
import JobForm from '../components/JobForm';
import MatchResults from '../components/MatchResults';
import { jobAPI } from '../services/api';

const RecruiterDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isPostJobOpen, setIsPostJobOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalMatches: 0,
    avgMatchScore: 0,
    activeJobs: 0
  });

  const loadJobs = async () => {
    try {
      const response = await jobAPI.getAll();
      setJobs(response.data);
      
      // Calculate statistics
      const totalMatches = response.data.reduce((sum, job) => sum + (job.matchCount || 0), 0);
      const avgScore = response.data.length > 0 
        ? response.data.reduce((sum, job) => sum + (job.avgMatchScore || 0), 0) / response.data.length 
        : 0;
      
      setStats({
        totalJobs: response.data.length,
        totalMatches: totalMatches,
        avgMatchScore: Math.round(avgScore),
        activeJobs: response.data.filter(job => new Date(job.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length
      });
    } catch (error) {
      console.error('Error loading jobs:', error);
    }
  };

  const handleJobCreated = () => {
    loadJobs();
    setSuccessMessage('Job posted successfully! 🎉');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  useEffect(() => {
    loadJobs();
  }, []);

  return (
    <div style={{ backgroundColor: 'var(--bg-secondary)', minHeight: '100vh', paddingTop: 'var(--spacing-lg)' }}>
      <div className="main-container">
        <div className="mb-xl">
          <div className="flex items-center justify-between mb-sm">
            <div>
              <h1 className="page-title">
                <span className="icon-lg" style={{ marginRight: 'var(--spacing-sm)' }}>👔</span>
                Recruiter Dashboard
              </h1>
              <p className="page-subtitle">Post jobs and find the perfect candidates with AI-powered matching</p>
            </div>
            <button 
              onClick={() => setIsPostJobOpen(true)}
              className="btn-primary-custom"
              style={{ height: '48px', fontSize: '16px', fontWeight: '600' }}
            >
              <span style={{ marginRight: '8px' }}>+</span>
              Post New Job
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
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>💼</div>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '4px', fontFamily: 'Fraunces, serif' }}>
                {stats.totalJobs}
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontFamily: 'DM Sans, sans-serif' }}>
                Total Jobs Posted
              </div>
            </div>
            <div className="card-custom" style={{ padding: '24px', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🎯</div>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--accent)', marginBottom: '4px', fontFamily: 'Fraunces, serif' }}>
                {stats.totalMatches}
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontFamily: 'DM Sans, sans-serif' }}>
                Total Matches
              </div>
            </div>
            <div className="card-custom" style={{ padding: '24px', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>⭐</div>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--success)', marginBottom: '4px', fontFamily: 'Fraunces, serif' }}>
                {stats.avgMatchScore}%
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontFamily: 'DM Sans, sans-serif' }}>
                Avg Match Score
              </div>
            </div>
            <div className="card-custom" style={{ padding: '24px', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🔥</div>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--warning)', marginBottom: '4px', fontFamily: 'Fraunces, serif' }}>
                {stats.activeJobs}
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontFamily: 'DM Sans, sans-serif' }}>
                Active (30 days)
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div style={{ marginBottom: 'var(--spacing-md)' }}>
            <input
              type="text"
              placeholder="🔍 Search jobs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-control-custom"
              style={{ maxWidth: '400px' }}
            />
          </div>
        </div>
        
        <div className="grid-dashboard">
          <div>
            <div className="card-custom">
              <div className="card-header-custom flex items-center justify-between">
                <h3 className="section-title" style={{ margin: 0, border: 'none', padding: 0 }}>
                  <span className="icon-md" style={{ marginRight: 'var(--spacing-xs)' }}>💼</span>
                  Posted Jobs
                </h3>
                <span className="badge-custom badge-primary">{jobs.length}</span>
              </div>
              <div className="content-section">
                {jobs.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">💼</div>
                    <h4 style={{ color: 'var(--text-primary)' }}>No jobs posted yet</h4>
                    <p>Click "Post New Job" to get started</p>
                  </div>
                ) : (
                  jobs
                    .filter(job => 
                      searchQuery === '' || 
                      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      job.location.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((job) => (
                    <div
                      key={job._id}
                      className={`list-item ${selectedJob?._id === job._id ? 'active' : ''}`}
                      onClick={() => setSelectedJob(job)}
                    >
                      <div className="w-full">
                        <div className="flex justify-between items-start mb-xs">
                          <div style={{ fontWeight: '600', color: 'var(--primary-color)', fontSize: '0.875rem' }}>
                            {job.title}
                          </div>
                          <span className="badge-custom badge-secondary" style={{ fontSize: '0.625rem' }}>
                            {new Date(job.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                          <span className="icon-sm">🏢</span> {job.company} • <span className="icon-sm">📍</span> {job.location}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--success-color)' }}>
                          {job.salary}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          
          <div>
            {selectedJob ? (
              <>
                <div className="card-custom mb-lg">
                  <div className="card-header-custom">
                    <h3 className="section-title" style={{ margin: 0, border: 'none', padding: 0 }}>
                      Job Details
                    </h3>
                  </div>
                  <div className="card-body-custom">
                    <div className="flex justify-between items-start mb-md">
                      <div>
                        <h2 style={{ color: 'var(--primary-color)', marginBottom: 'var(--spacing-xs)', fontSize: '1.5rem' }}>
                          {selectedJob.title}
                        </h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-sm)', fontSize: '0.875rem' }}>
                          <span className="icon-sm">🏢</span> {selectedJob.company} • 
                          <span className="icon-sm">📍</span> {selectedJob.location} • 
                          <span className="icon-sm">💰</span> {selectedJob.salary}
                        </p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div className="badge-custom badge-secondary mb-xs" style={{ fontSize: '0.625rem' }}>
                          Posted by {selectedJob.postedBy}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {new Date(selectedJob.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="mb-sm">
                      <h4 style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: 'var(--spacing-xs)', color: 'var(--text-primary)' }}>Description:</h4>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: '1.5' }}>{selectedJob.description}</p>
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: 'var(--spacing-xs)', color: 'var(--text-primary)' }}>Requirements:</h4>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: '1.5' }}>{selectedJob.requirements}</p>
                    </div>
                  </div>
                </div>
                <MatchResults jobId={selectedJob._id} jobTitle={selectedJob.title} />
              </>
            ) : (
              <div className="card-custom">
                <div className="card-body-custom text-center" style={{ padding: 'var(--spacing-xl)' }}>
                  <div className="empty-icon">🎯</div>
                  <h3 style={{ marginBottom: 'var(--spacing-sm)', color: 'var(--text-primary)' }}>Select a job to view matches</h3>
                  <p style={{ color: 'var(--text-secondary)' }}>
                    Click on a job from the list to see AI-powered candidate matches and detailed analytics.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Job Form Modal */}
      {isPostJobOpen && (
        <JobForm 
          onJobCreated={handleJobCreated}
          onClose={() => setIsPostJobOpen(false)}
        />
      )}
    </div>
  );
};

export default RecruiterDashboard;