import React, { useState, useEffect } from 'react';
import JobForm from '../components/JobForm';
import MatchResults from '../components/MatchResults';
import { jobAPI } from '../services/api';
import DashboardShell from '../components/DashboardShell';
import { BrainCircuit, BriefcaseBusiness, Building2, Calendar, DollarSign, FilePlus2, MapPin, Settings2, Users } from 'lucide-react';

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
    setSuccessMessage('Job posted successfully.');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  useEffect(() => {
    loadJobs();
  }, []);

  return (
    <div style={{ paddingTop: 'var(--spacing-lg)' }}>
      <DashboardShell
        title="Recruiter Dashboard"
        subtitle="Post roles, review candidates, and prioritize matches with AI."
        actions={
          <button
            onClick={() => setIsPostJobOpen(true)}
            className="btn-primary-custom"
            style={{ height: '48px', fontSize: '14px', fontWeight: '700' }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
              <FilePlus2 size={16} />
              Post Job
            </span>
          </button>
        }
        navItems={[
          { to: '/recruiter/dashboard', label: 'Dashboard', icon: <BriefcaseBusiness size={18} /> },
          { to: '/recruiter/dashboard', label: 'Post Job', icon: <FilePlus2 size={18} /> },
          { to: '/recruiter/dashboard', label: 'Candidates', icon: <Users size={18} /> },
          { to: '/recruiter/dashboard', label: 'AI Matches', icon: <BrainCircuit size={18} /> },
          { to: '/profile', label: 'Settings', icon: <Settings2 size={18} /> }
        ]}
      >
          
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 24 }}>
            {[
              { label: 'Total Jobs Posted', value: stats.totalJobs, color: 'var(--primary)', icon: <BriefcaseBusiness size={16} /> },
              { label: 'Candidates Applied', value: stats.totalMatches, color: 'var(--accent)', icon: <Users size={16} /> },
              { label: 'Top Matches', value: `${stats.avgMatchScore}%`, color: 'var(--success)', icon: <BrainCircuit size={16} /> },
              { label: 'Active (30 days)', value: stats.activeJobs, color: 'var(--warning)', icon: <Calendar size={16} /> }
            ].map((s) => (
              <div key={s.label} className="stat-card">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div style={{ fontSize: 12, color: '#9CA3AF', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      {s.label}
                    </div>
                    <div className="stat-number" style={{ color: s.color }}>{s.value}</div>
                  </div>
                  <div style={{
                    width: 38,
                    height: 38,
                    borderRadius: 999,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#F3F4F6',
                    border: '1px solid #E5E7EB',
                    color: '#6B7280'
                  }}>
                    {s.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Search Bar */}
          <div style={{ marginBottom: 'var(--spacing-md)' }}>
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-control-custom"
              style={{ maxWidth: '400px' }}
            />
          </div>
        <div className="grid-dashboard">
          <div>
            <div className="card-custom">
              <div className="card-header-custom flex items-center justify-between">
                <h3 className="section-title" style={{ margin: 0, border: 'none', padding: 0 }}>
                  Posted Jobs
                </h3>
                <span className="badge-custom badge-primary">{jobs.length}</span>
              </div>
              <div className="content-section">
                {jobs.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon" aria-hidden="true">
                      <BriefcaseBusiness size={44} color="var(--text-muted)" />
                    </div>
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
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Building2 size={14} color="#9CA3AF" /> {job.company}</span>
                          <span style={{ opacity: 0.35, margin: '0 8px' }}>•</span>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><MapPin size={14} color="#9CA3AF" /> {job.location}</span>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--success-color)' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><RupeeSign size={14} color="#9CA3AF" /> {job.salary}</span>
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
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Building2 size={14} color="#9CA3AF" /> {selectedJob.company}</span>
                          <span style={{ opacity: 0.35, margin: '0 8px' }}>•</span>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><MapPin size={14} color="#9CA3AF" /> {selectedJob.location}</span>
                          <span style={{ opacity: 0.35, margin: '0 8px' }}>•</span>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><DollarSign size={14} color="#9CA3AF" /> {selectedJob.salary}</span>
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
                  <div className="empty-icon" aria-hidden="true">
                    <BrainCircuit size={44} color="var(--text-muted)" />
                  </div>
                  <h3 style={{ marginBottom: 'var(--spacing-sm)', color: 'var(--text-primary)' }}>Select a job to view matches</h3>
                  <p style={{ color: 'var(--text-secondary)' }}>
                    Click on a job from the list to see AI-powered candidate matches and detailed analytics.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </DashboardShell>
      
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