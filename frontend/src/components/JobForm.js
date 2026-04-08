import React, { useMemo, useState } from 'react';
import { jobAPI } from '../services/api';
import { FilePlus2, X, Plus } from 'lucide-react';
import Button from './ui/Button';

const JobForm = ({ onJobCreated, onClose }) => {
  const [job, setJob] = useState({
    title: '', company: '', description: '', requirements: '', eligibility: '', location: '', salary: ''
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
      setJob({ title: '', company: '', description: '', requirements: '', eligibility: '', location: '', salary: '' });
      setRequiredSkills([]);
      setSkillDraft('');
      setExperienceLevel('mid');
      onJobCreated?.();
    } catch (error) {
      setMessage('Error posting job');
    }
    setLoading(false);
  };

  return (
    <>
      {/* Modal Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        style={{ zIndex: 1000 }}
        onClick={onClose}
      >
        {/* Modal Content */}
        <div 
          className="bg-gradient-to-b from-[#0a0520] to-[#030014] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 z-10 bg-[#0a0520]/90 backdrop-blur-md p-6 border-b border-white/5 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <FilePlus2 className="text-purple-400" size={20} />
              Post New Job
            </h2>
            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-white hover:bg-white/5 p-2 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="p-6">
            {message && (
              <div className="p-4 mb-6 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">
                {message}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-1.5 drop-shadow-md">Job Title</label>
                  <input
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-all font-sans"
                    value={job.title}
                    onChange={(e) => setJob({...job, title: e.target.value})}
                    placeholder="e.g. Software Engineer"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-1.5 drop-shadow-md">Company</label>
                  <input
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-all font-sans"
                    value={job.company}
                    onChange={(e) => setJob({...job, company: e.target.value})}
                    placeholder="Your Company Name"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1.5 drop-shadow-md">Job Description</label>
                <textarea
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-all font-sans resize-y min-h-[100px]"
                  value={job.description}
                  onChange={(e) => setJob({...job, description: e.target.value})}
                  placeholder="Describe the role and responsibilities..."
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1.5 drop-shadow-md">Required Skills</label>
                <div className="border border-white/10 rounded-xl p-4 bg-white/[0.02]">
                  <div className="flex gap-3 items-center">
                    <input
                      className="flex-1 bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-all font-sans"
                      value={skillDraft}
                      onChange={(e) => setSkillDraft(e.target.value)}
                      placeholder="Type a skill and press Enter (e.g., React)"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ',') {
                          e.preventDefault();
                          addSkill(skillDraft);
                        }
                      }}
                    />
                    <button
                      type="button"
                      className="px-4 py-2.5 rounded-xl bg-purple-600/20 text-purple-400 hover:bg-purple-600/30 border border-purple-500/30 font-medium transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
                      onClick={() => addSkill(skillDraft)}
                      disabled={!skillDraft.trim()}
                    >
                      <Plus size={16} /> Add
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-4">
                    {normalizedSkills.map((skill) => (
                      <button
                        key={skill}
                        type="button"
                        className="px-3 py-1.5 rounded-lg bg-indigo-500/20 hover:bg-red-500/20 border border-indigo-500/30 hover:border-red-500/30 text-indigo-300 hover:text-red-400 text-sm font-medium transition-colors flex items-center gap-2 group"
                        title="Click to remove"
                        onClick={() => removeSkill(skill)}
                      >
                        {skill} <X size={14} className="opacity-50 group-hover:opacity-100" />
                      </button>
                    ))}
                    {normalizedSkills.length === 0 && (
                      <span className="text-sm text-slate-500 italic">No skills added yet</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-1.5 drop-shadow-md">Experience Level</label>
                  <select
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-all font-sans appearance-none"
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value)}
                  >
                    <option value="junior" className="bg-[#0a0520]">Junior</option>
                    <option value="mid" className="bg-[#0a0520]">Mid</option>
                    <option value="senior" className="bg-[#0a0520]">Senior</option>
                    <option value="lead" className="bg-[#0a0520]">Lead</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1.5 drop-shadow-md">Additional Requirements</label>
                <textarea
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-all font-sans resize-y min-h-[80px]"
                  value={job.requirements}
                  onChange={(e) => setJob({...job, requirements: e.target.value})}
                  placeholder="Optional details: certifications, constraints, tools, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1.5 drop-shadow-md">Eligibility Criteria</label>
                <textarea
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-all font-sans resize-y min-h-[80px]"
                  value={job.eligibility}
                  onChange={(e) => setJob({...job, eligibility: e.target.value})}
                  placeholder="Eligibility requirements (e.g., years of experience, education level...)"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-1.5 drop-shadow-md">Location</label>
                  <input
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-all font-sans"
                    value={job.location}
                    onChange={(e) => setJob({...job, location: e.target.value})}
                    placeholder="e.g. Remote, San Francisco"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-1.5 drop-shadow-md">Salary Range</label>
                  <input
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-all font-sans"
                    value={job.salary}
                    onChange={(e) => setJob({...job, salary: e.target.value})}
                    placeholder="e.g. $100k - $120k / ₹ 7 - 9 LPA"
                  />
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-white/5">
                <Button
                  variant="secondary"
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={loading}
                  className="flex-1 w-full"
                >
                  {loading ? 'Posting…' : 'Analyze & Post Job'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default JobForm;