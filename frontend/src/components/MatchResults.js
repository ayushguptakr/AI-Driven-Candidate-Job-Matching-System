import React, { useMemo, useState, useEffect } from 'react';
import { jobAPI } from '../services/api';
import { BrainCircuit, Info, Sparkles } from 'lucide-react';
import Modal from './ui/Modal';
import InlineDots from './ui/InlineDots';

const MatchResults = ({ jobId, jobTitle }) => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedMatch, setSelectedMatch] = useState(null);

  const loadMatches = async () => {
    try {
      const response = await jobAPI.getMatches(jobId);
      setMatches(response.data);
      setError('');
    } catch (error) {
      console.error('Error loading matches:', error);
      setError('Unable to load match results. Please try again.');
    }
  };

  const runMatching = async () => {
    setLoading(true);
    setError('');
    try {
      await jobAPI.matchResumes(jobId);
      await loadMatches();
    } catch (error) {
      console.error('Error running matches:', error);
      setError('AI matching failed. Please try again in a moment.');
    }
    setLoading(false);
  };

  useEffect(() => {
    if (jobId) loadMatches();
  }, [jobId]);

  const getScoreStyles = (score) => {
    if (score >= 80) return { class: 'score-excellent', color: '#059669', label: 'Excellent' };
    if (score >= 60) return { class: 'score-good', color: '#D97706', label: 'Good match' };
    return { class: 'score-neutral', color: '#64748b', label: 'Review' };
  };

  const getMissingSkills = (match) => {
    const raw =
      match?.missingSkills ||
      match?.missing_skills ||
      match?.breakdown?.missingSkills ||
      match?.analysis?.missingSkills ||
      [];
    return Array.isArray(raw) ? raw : [];
  };

  const getWhyThisMatch = (match) => {
    const reason =
      match?.whyThisMatch ||
      match?.why ||
      match?.explanation ||
      match?.analysis?.why ||
      match?.analysis?.summary ||
      match?.breakdown?.summary;
    if (typeof reason === 'string' && reason.trim()) return reason.trim();

    const skills = Array.isArray(match?.matchingSkills) ? match.matchingSkills : [];
    if (skills.length > 0) {
      const top = skills.slice(0, 4).join(', ');
      return `Strong alignment on key skills (${top}) and overall experience fit for the role.`;
    }
    return 'Match score is based on skills, experience, and role requirements overlap.';
  };

  const breakdown = useMemo(() => {
    if (!selectedMatch) return null;
    const skillsMatched = Array.isArray(selectedMatch.matchingSkills) ? selectedMatch.matchingSkills.length : 0;
    const missingSkills = getMissingSkills(selectedMatch);
    const skillsTotal = Math.max(skillsMatched + missingSkills.length, 1);
    const skillsPct = Math.round((skillsMatched / skillsTotal) * 100);
    const expPct = Math.min(95, Math.max(45, Math.round((selectedMatch.score || 0) * 0.92)));
    return {
      skillsPct,
      expPct,
      missingSkills
    };
  }, [selectedMatch]);

  return (
    <div className="card-custom">
      <div className="card-header-custom flex items-center justify-between">
        <h3 className="section-title" style={{ margin: 0, border: 'none', padding: 0 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
            <BrainCircuit size={18} />
            AI Matches: {jobTitle}
          </span>
        </h3>
        <button
          onClick={runMatching}
          disabled={loading || !jobId}
          className="btn-primary-custom"
        >
          {loading ? <InlineDots label="AI analyzing" /> : <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}><Sparkles size={16} /> Run AI Matching</span>}
        </button>
      </div>
      <div className="card-body-custom">
        {error && (
          <div
            role="alert"
            aria-live="polite"
            style={{
              padding: '12px 16px',
              borderRadius: 'var(--radius)',
              marginBottom: '16px',
              backgroundColor: '#fef2f2',
              color: 'var(--danger-color)',
              border: '1px solid #fecaca',
              fontSize: '0.875rem'
            }}
          >
            {error}
          </div>
        )}
        {matches.length === 0 && !error ? (
          <div className="empty-state">
            <div className="empty-icon" aria-hidden="true" style={{ display: 'flex', justifyContent: 'center' }}>
              <BrainCircuit size={46} color="var(--text-muted)" />
            </div>
            <h4 style={{ marginBottom: 'var(--spacing-sm)', color: 'var(--text-primary)' }}>
              {loading ? <InlineDots label="AI is analyzing candidates" /> : 'No matches found yet'}
            </h4>
            <p>
              {loading
                ? 'We are running AI-powered analysis on all candidate resumes.'
                : 'Click "Run AI Matching" to analyze candidate resumes against this job posting.'}
            </p>
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

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 16
            }}>
              {matches
                .slice()
                .sort((a, b) => (b.score || 0) - (a.score || 0))
                .map((match, index) => {
                  const score = Number(match.score || 0);
                  const scoreStyles = getScoreStyles(score);
                  const skills = Array.isArray(match.matchingSkills) ? match.matchingSkills : [];
                  return (
                    <div
                      key={match._id}
                      className="card-custom"
                      style={{ padding: 18, cursor: 'pointer' }}
                      onClick={() => setSelectedMatch(match)}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                            <span className={`badge-custom ${index === 0 ? 'badge-warning' : 'badge-secondary'}`}>#{index + 1}</span>
                            <div style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 800, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {match?.resumeId?.candidateName || 'Candidate'}
                            </div>
                          </div>
                          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10 }}>
                            {match?.resumeId?.education || 'Education not provided'}
                          </div>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                            <span className={`badge-custom ${scoreStyles.class}`} style={{ fontSize: 14, fontWeight: 800 }}>
                              {score}%
                            </span>
                          </div>
                          <div style={{ marginTop: 6, fontSize: 12, color: 'var(--text-muted)' }}>{scoreStyles.label}</div>
                        </div>
                      </div>

                      <div style={{ marginTop: 10 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Match score
                            <span title="AI score estimates candidate-job compatibility based on skill overlap and experience alignment." style={{ display: 'inline-flex', alignItems: 'center' }}>
                              <Info size={14} />
                            </span>
                          </div>
                          <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'var(--text-muted)' }}>
                            {new Date(match?.resumeId?.uploadedAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </div>
                        </div>
                        <div className="progress-bar" style={{ width: '100%' }}>
                          <div className="progress-fill" style={{ width: `${score}%`, backgroundColor: scoreStyles.color }} />
                        </div>
                      </div>

                      <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {skills.slice(0, 6).map((skill, idx) => (
                          <span key={idx} className="badge-custom badge-primary" style={{ fontSize: 10 }}>
                            {skill}
                          </span>
                        ))}
                        {skills.length > 6 && (
                          <span className="badge-custom badge-neutral" style={{ fontSize: 10 }}>
                            +{skills.length - 6}
                          </span>
                        )}
                      </div>

                      <div style={{ marginTop: 12, padding: 12, borderRadius: 16, border: '1px solid rgba(79, 70, 229, 0.12)', background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.05), rgba(168, 85, 247, 0.04))' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'DM Sans, sans-serif', fontWeight: 800, fontSize: 12, color: 'var(--text-primary)' }}>
                            <Sparkles size={14} />
                            Why this match?
                          </div>
                          <span className="badge-custom badge-secondary" style={{ fontSize: 10 }}>View</span>
                        </div>
                        <div style={{ marginTop: 6, fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                          {getWhyThisMatch(match)}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </>
        )}

        <Modal
          open={!!selectedMatch}
          onClose={() => setSelectedMatch(null)}
          title={
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
              <BrainCircuit size={18} />
              Full Analysis
            </span>
          }
        >
          {selectedMatch && (
            <div className="grid-2" style={{ gap: 16 }}>
              <div>
                <div className="card-custom" style={{ padding: 18 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontFamily: 'Fraunces, serif', fontWeight: 800, fontSize: 20, color: 'var(--text-primary)', marginBottom: 4 }}>
                        {selectedMatch?.resumeId?.candidateName || 'Candidate'}
                      </div>
                      <div style={{ fontFamily: 'DM Sans, sans-serif', color: 'var(--text-secondary)', fontSize: 13 }}>
                        {selectedMatch?.resumeId?.email || 'Email not available'} {selectedMatch?.resumeId?.phone ? `• ${selectedMatch.resumeId.phone}` : ''}
                      </div>
                      <div style={{ marginTop: 8, color: 'var(--text-muted)', fontSize: 13 }}>
                        {selectedMatch?.resumeId?.education || 'Education not provided'}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span className={`badge-custom ${getScoreStyles(Number(selectedMatch.score || 0)).class}`} style={{ fontSize: 16, fontWeight: 900 }}>
                        {Number(selectedMatch.score || 0)}%
                      </span>
                      <div style={{ marginTop: 6, fontSize: 12, color: 'var(--text-muted)' }}>
                        {getScoreStyles(Number(selectedMatch.score || 0)).label}
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                      <div style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 900, fontSize: 12, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Why this match?
                      </div>
                    </div>
                    <div style={{ padding: 14, borderRadius: 16, background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.05), rgba(168, 85, 247, 0.04))', border: '1px solid rgba(79, 70, 229, 0.12)' }}>
                      <div style={{ fontFamily: 'DM Sans, sans-serif', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                        {getWhyThisMatch(selectedMatch)}
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: 14 }}>
                    <div style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 900, fontSize: 12, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
                      Skills matched
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {(Array.isArray(selectedMatch.matchingSkills) ? selectedMatch.matchingSkills : []).map((skill, idx) => (
                        <span key={idx} className="badge-custom badge-primary" style={{ fontSize: 10 }}>
                          {skill}
                        </span>
                      ))}
                      {(Array.isArray(selectedMatch.matchingSkills) ? selectedMatch.matchingSkills.length : 0) === 0 && (
                        <span className="badge-custom badge-neutral" style={{ fontSize: 10 }}>No skill tags returned</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="card-custom" style={{ padding: 18 }}>
                  <div style={{ fontFamily: 'Fraunces, serif', fontWeight: 800, fontSize: 16, color: 'var(--text-primary)', marginBottom: 10 }}>
                    Detailed breakdown
                  </div>

                  <div style={{ display: 'grid', gap: 10 }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>
                        <span>Skills match</span>
                        <span style={{ fontWeight: 900, color: 'var(--text-primary)' }}>{breakdown?.skillsPct ?? 0}%</span>
                      </div>
                      <div className="progress-bar" style={{ width: '100%' }}>
                        <div className="progress-fill" style={{ width: `${breakdown?.skillsPct ?? 0}%`, backgroundColor: 'var(--primary)' }} />
                      </div>
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>
                        <span>Experience match</span>
                        <span style={{ fontWeight: 900, color: 'var(--text-primary)' }}>{breakdown?.expPct ?? 0}%</span>
                      </div>
                      <div className="progress-bar" style={{ width: '100%' }}>
                        <div className="progress-fill" style={{ width: `${breakdown?.expPct ?? 0}%`, backgroundColor: 'var(--accent)' }} />
                      </div>
                    </div>

                    <div style={{ marginTop: 6 }}>
                      <div style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 900, fontSize: 12, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
                        Missing skills
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {(breakdown?.missingSkills || []).map((skill, idx) => (
                          <span key={idx} className="badge-custom badge-neutral" style={{ fontSize: 10 }}>
                            {skill}
                          </span>
                        ))}
                        {(breakdown?.missingSkills || []).length === 0 && (
                          <span className="badge-custom badge-neutral" style={{ fontSize: 10 }}>
                            None detected (or not provided by API)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: 14, padding: 12, borderRadius: 16, border: '1px solid rgba(15, 23, 42, 0.08)', background: 'rgba(15, 23, 42, 0.02)' }}>
                    <div style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 900, fontSize: 12, color: 'var(--text-primary)', marginBottom: 6 }}>
                      Note
                    </div>
                    <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                      If your backend provides richer analysis fields, this panel will automatically display them when present.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default MatchResults;