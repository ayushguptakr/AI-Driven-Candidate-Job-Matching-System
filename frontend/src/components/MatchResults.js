import React, { useState, useEffect } from 'react';
import { jobAPI } from '../services/api';

const MatchResults = ({ jobId, jobTitle }) => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadMatches = async () => {
    try {
      const response = await jobAPI.getMatches(jobId);
      setMatches(response.data);
    } catch (error) {
      console.error('Error loading matches:', error);
    }
  };

  const runMatching = async () => {
    setLoading(true);
    try {
      await jobAPI.matchResumes(jobId);
      await loadMatches();
    } catch (error) {
      console.error('Error running matches:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (jobId) loadMatches();
  }, [jobId]);

  const getScoreStyles = (score) => {
    if (score >= 80) return { class: 'score-excellent', color: '#065f46' };
    if (score >= 60) return { class: 'score-good', color: '#92400e' };
    return { class: 'score-neutral', color: '#64748b' };
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good Match';
    return 'Under Review';
  };

  return (
    <div className="card-custom">
      <div className="card-header-custom flex items-center justify-between">
        <h3 className="section-title" style={{ margin: 0, border: 'none', padding: 0 }}>
          <span className="icon-md" style={{ marginRight: 'var(--spacing-xs)' }}>🎯</span>
          Match Results: {jobTitle}
        </h3>
        <button
          onClick={runMatching}
          disabled={loading || !jobId}
          className="btn-primary-custom"
        >
          <span className="icon-sm">{loading ? '🤖' : '🚀'}</span>
          {loading ? 'AI Analyzing...' : 'Run AI Matching'}
        </button>
      </div>
      <div className="card-body-custom">
        {matches.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h4 style={{ marginBottom: 'var(--spacing-sm)', color: 'var(--text-primary)' }}>No matches found yet</h4>
            <p>Click "Run AI Matching" to analyze candidate resumes against this job posting.</p>
          </div>
        ) : (
          <>
            <div className="grid-3 mb-lg">
              <div className="stat-card">
                <div className="stat-number">{matches.length}</div>
                <div className="stat-label">Total Candidates</div>
              </div>
              <div className="stat-card" style={{ borderLeft: '3px solid #059669' }}>
                <div className="stat-number" style={{ color: '#059669' }}>
                  {matches.filter(m => m.score >= 80).length}
                </div>
                <div className="stat-label">Excellent</div>
              </div>
              <div className="stat-card" style={{ borderLeft: '3px solid #d97706' }}>
                <div className="stat-number" style={{ color: '#d97706' }}>
                  {matches.filter(m => m.score >= 60 && m.score < 80).length}
                </div>
                <div className="stat-label">Good Match</div>
              </div>
            </div>
            
            <div style={{ overflowX: 'auto' }}>
              <table className="table-custom">
                <thead>
                  <tr>
                    <th style={{ width: '60px' }}>Rank</th>
                    <th style={{ width: '200px' }}>Candidate</th>
                    <th style={{ width: '180px' }}>Contact</th>
                    <th style={{ width: '140px' }}>Match Score</th>
                    <th>Skills</th>
                    <th style={{ width: '100px' }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {matches.map((match, index) => {
                    const scoreStyles = getScoreStyles(match.score);
                    return (
                      <tr key={match._id}>
                        <td>
                          <span className={`badge-custom ${
                            index === 0 ? 'badge-warning' : 'badge-secondary'
                          }`}>
                            #{index + 1}
                          </span>
                        </td>
                        <td>
                          <div style={{ fontWeight: '600', marginBottom: '4px', color: 'var(--text-primary)' }}>
                            {match.resumeId.candidateName}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {match.resumeId.education}
                          </div>
                        </td>
                        <td>
                          <div style={{ fontSize: '0.75rem', lineHeight: '1.4' }}>
                            <div style={{ color: 'var(--text-primary)' }}>{match.resumeId.email}</div>
                            <div style={{ color: 'var(--text-muted)' }}>{match.resumeId.phone}</div>
                          </div>
                        </td>
                        <td>
                          <div>
                            <span className={`badge-custom ${scoreStyles.class}`} style={{
                              fontSize: '0.875rem',
                              fontWeight: '600',
                              marginBottom: '4px'
                            }}>
                              {match.score}%
                            </span>
                            <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                              {getScoreLabel(match.score)}
                            </div>
                            <div className="progress-bar">
                              <div 
                                className="progress-fill" 
                                style={{
                                  width: `${match.score}%`,
                                  backgroundColor: scoreStyles.color
                                }} 
                              />
                            </div>
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                            {match.matchingSkills.slice(0, 4).map((skill, idx) => (
                              <span key={idx} className="badge-custom badge-primary">
                                {skill}
                              </span>
                            ))}
                            {match.matchingSkills.length > 4 && (
                              <span className="badge-custom badge-neutral">
                                +{match.matchingSkills.length - 4}
                              </span>
                            )}
                          </div>
                        </td>
                        <td>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {new Date(match.resumeId.uploadedAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric'
                            })}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MatchResults;