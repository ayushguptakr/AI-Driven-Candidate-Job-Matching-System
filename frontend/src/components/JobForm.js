import React, { useMemo, useState } from 'react';
import { jobAPI } from '../services/api';

const JobForm = ({ onJobCreated, onClose }) => {
  const [job, setJob] = useState({
    title: '', company: '', description: '', requirements: '', eligibility: '', location: '', salary: '', postedBy: ''
  });
  const [requiredSkills, setRequiredSkills] = useState([]);
  const [skillDraft, setSkillDraft] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('mid');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const normalizedSkills = useMemo(() => {
    const set = new Set(requiredSkills.map((s) => String(s).trim()).filter(Boolean));
    return Array.from(set);
  }, [requiredSkills]);

  const addSkill = (raw) => {
    const cleaned = String(raw || '').trim();
    if (!cleaned) return;
    setRequiredSkills((prev) => [...prev, cleaned]);
    setSkillDraft('');
  };

  const removeSkill = (skill) => {
    setRequiredSkills((prev) => prev.filter((s) => s !== skill));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const requirementsParts = [
        job.requirements?.trim(),
        normalizedSkills.length ? `Required skills: ${normalizedSkills.join(', ')}` : null
      ].filter(Boolean);

      const eligibilityParts = [
        job.eligibility?.trim(),
        experienceLevel ? `Experience level: ${experienceLevel}` : null
      ].filter(Boolean);

      await jobAPI.create({
        ...job,
        requirements: requirementsParts.join('\n\n'),
        eligibility: eligibilityParts.join('\n')
      });
      setJob({ title: '', company: '', description: '', requirements: '', eligibility: '', location: '', salary: '', postedBy: '' });
      setRequiredSkills([]);
      setSkillDraft('');
      setExperienceLevel('mid');
      onJobCreated?.();
      onClose?.();
    } catch (error) {
      setMessage('Error posting job');
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
            <h2 className="section-title" style={{ margin: 0, border: 'none', padding: 0 }}>Post New Job</h2>
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
                backgroundColor: '#fef2f2',
                color: 'var(--danger-color)',
                border: '1px solid #fecaca'
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
                    placeholder="e.g. Software Engineer"
                    required
                  />
                </div>
                <div className="form-group-custom">
                  <label className="form-label">Company</label>
                  <input
                    className="form-control-custom"
                    value={job.company}
                    onChange={(e) => setJob({...job, company: e.target.value})}
                    placeholder="Your Company Name"
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
                <label className="form-label">Required Skills</label>
                <div style={{
                  border: '2px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  padding: '12px',
                  background: 'var(--bg-primary)'
                }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <input
                      className="form-control-custom"
                      style={{ height: 44 }}
                      value={skillDraft}
                      onChange={(e) => setSkillDraft(e.target.value)}
                      placeholder="Type a skill and press Enter (e.g., React)"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addSkill(skillDraft);
                        }
                        if (e.key === ',' ) {
                          e.preventDefault();
                          addSkill(skillDraft);
                        }
                      }}
                    />
                    <button
                      type="button"
                      className="btn-primary-custom"
                      style={{ height: 44, padding: '0 14px' }}
                      onClick={() => addSkill(skillDraft)}
                      disabled={!skillDraft.trim()}
                    >
                      Add
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
                    {normalizedSkills.map((skill) => (
                      <button
                        key={skill}
                        type="button"
                        className="badge-custom badge-primary"
                        style={{ cursor: 'pointer' }}
                        title="Click to remove"
                        onClick={() => removeSkill(skill)}
                      >
                        {skill} ×
                      </button>
                    ))}
                    {normalizedSkills.length === 0 && (
                      <span className="badge-custom badge-neutral" style={{ fontSize: 11 }}>
                        No skills added yet
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group-custom">
                  <label className="form-label">Experience Level</label>
                  <select
                    className="form-control-custom"
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value)}
                  >
                    <option value="junior">Junior</option>
                    <option value="mid">Mid</option>
                    <option value="senior">Senior</option>
                    <option value="lead">Lead</option>
                  </select>
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

              <div className="form-group-custom">
                <label className="form-label">Additional Requirements</label>
                <textarea
                  className="form-control-custom"
                  style={{ height: '92px', resize: 'vertical', paddingTop: '12px', paddingBottom: '12px' }}
                  value={job.requirements}
                  onChange={(e) => setJob({...job, requirements: e.target.value})}
                  placeholder="Optional details: certifications, constraints, tools, etc."
                />
              </div>

              <div className="form-group-custom">
                <label className="form-label">Eligibility Criteria</label>
                <textarea
                  className="form-control-custom"
                  style={{ height: '92px', resize: 'vertical', paddingTop: '12px', paddingBottom: '12px' }}
                  value={job.eligibility}
                  onChange={(e) => setJob({...job, eligibility: e.target.value})}
                  placeholder="Eligibility requirements (e.g., years of experience, education level, certifications...)"
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
                <div className="form-group-custom" />
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
                  {loading ? 'Posting…' : 'Analyze & Post Job'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default JobForm;