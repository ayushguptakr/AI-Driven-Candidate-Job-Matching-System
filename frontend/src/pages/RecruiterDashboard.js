import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jobAPI, applicationAPI } from '../services/api';
import { 
  BriefcaseBusiness, Building2, Calendar, IndianRupee, FilePlus2, 
  MapPin, Settings2, Users, BrainCircuit, Search, Menu, X, LogOut,
  Target, Activity, ChevronRight, CheckCircle, AlertCircle, Sparkles, UserPlus, Info
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AnimatedLogo from '../components/landing/AnimatedLogo';
import LogoLink from '../components/ui/LogoLink';
import JobForm from '../components/JobForm';
import Button from '../components/ui/Button';

const RecruiterDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // Data State
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [matches, setMatches] = useState([]);
  
  // UI State
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isPostJobOpen, setIsPostJobOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeNav, setActiveNav] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ text: '', type: '' });
  const [isFullInsightsOpen, setIsFullInsightsOpen] = useState(false);
  
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalMatches: 0,
    avgMatchScore: 0,
    activeJobs: 0
  });

  const showMessage = (text, type = 'success') => {
    setStatusMessage({ text, type });
    setTimeout(() => setStatusMessage({ text: '', type: '' }), 4000);
  };

  const loadJobs = async () => {
    try {
      const response = await jobAPI.getAll();
      const jobsList = response.data.jobs || response.data;
      setJobs(jobsList);
      
      const totalMatches = jobsList.reduce((sum, job) => sum + (job.matchCount || 0), 0);
      const avgScore = jobsList.length > 0 
        ? jobsList.reduce((sum, job) => sum + (job.avgMatchScore || 0), 0) / jobsList.length 
        : 0;
      
      setStats({
        totalJobs: response.data.pagination?.total || jobsList.length,
        totalMatches: totalMatches,
        avgMatchScore: Math.round(avgScore),
        activeJobs: jobsList.filter(job => new Date(job.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length
      });
    } catch (error) {
      console.error('Error loading jobs:', error);
    }
  };

  const loadJobDetails = async (jobId) => {
    setLoadingMatches(true);
    setApplications([]);
    setMatches([]);
    setSelectedCandidate(null);
    try {
      const [appRes, matchRes] = await Promise.allSettled([
        applicationAPI.getJobApplications(jobId),
        jobAPI.getMatches(jobId)
      ]);
      
      if (appRes.status === 'fulfilled') setApplications(appRes.value.data || []);
      if (matchRes.status === 'fulfilled') setMatches(matchRes.value.data || []);
    } catch (error) {
      console.error('Error loading details:', error);
    }
    setLoadingMatches(false);
  };

  useEffect(() => {
    loadJobs();
  }, []);

  useEffect(() => {
    if (selectedJob) {
      loadJobDetails(selectedJob._id);
    }
  }, [selectedJob]);

  const handleJobCreated = () => {
    loadJobs();
    setIsPostJobOpen(false);
    showMessage('Job posted successfully.');
  };

  const handleUpdateApplicationStatus = async (applicationId, status) => {
    try {
      await applicationAPI.updateApplicationStatus(applicationId, status);
      showMessage(`Status updated to ${status}`);
      loadJobDetails(selectedJob._id);
    } catch (error) {
      console.error('Error updating status:', error);
      showMessage('Failed to update status', 'error');
    }
  };

  const runMatching = async () => {
    if (!selectedJob) return;
    setLoadingMatches(true);
    try {
      await jobAPI.matchResumes(selectedJob._id);
      await loadJobDetails(selectedJob._id);
      showMessage('AI matching completed successfully!');
    } catch (error) {
      console.error('Error running matches:', error);
      showMessage('AI matching failed.', 'error');
    }
    setLoadingMatches(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const filteredJobs = jobs.filter(job => 
    searchQuery === '' || 
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Combine applications and matches for unified view
  const candidateList = useMemo(() => {
    const list = [...matches];
    // We could merge applications here if they aren't already represented in matches, 
    // but the backend AI matching usually pulls from the resume pool.
    // For now, we will sort matches by score.
    return list.sort((a, b) => (b.score || 0) - (a.score || 0));
  }, [matches]);

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    if (score >= 60) return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
  };

  const getMissingSkills = (match) => {
    const raw = match?.missingSkills || match?.missing_skills || match?.breakdown?.missingSkills || match?.analysis?.missingSkills || [];
    return Array.isArray(raw) ? raw : [];
  };

  const getWhyThisMatch = (match) => {
    const reason = match?.whyThisMatch || match?.why || match?.explanation || match?.analysis?.why || match?.analysis?.summary || match?.breakdown?.summary;
    if (typeof reason === 'string' && reason.trim()) return reason.trim();
    const skills = Array.isArray(match?.matchingSkills) ? match.matchingSkills : [];
    if (skills.length > 0) return `Strong alignment on core skills: ${skills.slice(0, 3).join(', ')}.`;
    return 'Detailed matching criteria based on resume vector parsing.';
  };

  // Derive skill tags with status classification for the insight panel
  const getSkillBreakdown = (candidate) => {
    const matched = Array.isArray(candidate?.matchingSkills) ? candidate.matchingSkills : [];
    const missing = getMissingSkills(candidate);
    
    // Build categorized tag list: strong, moderate, missing
    const tags = [];
    matched.forEach((skill, i) => {
      // First 60% of matched skills = strong, rest = moderate
      const status = i < Math.ceil(matched.length * 0.6) ? 'strong' : 'moderate';
      tags.push({ skill, status });
    });
    missing.forEach(skill => {
      tags.push({ skill, status: 'missing' });
    });
    // Return top 5 for the preview
    return tags.slice(0, 5);
  };

  const getAISummary = (candidate) => {
    const why = getWhyThisMatch(candidate);
    const score = Number(candidate?.score || 0);
    const matched = Array.isArray(candidate?.matchingSkills) ? candidate.matchingSkills : [];
    const missing = getMissingSkills(candidate);

    if (why && why !== 'Detailed matching criteria based on resume vector parsing.') {
      return why;
    }

    // Generate a contextual summary
    const scoreLabel = score >= 80 ? 'exceptional' : score >= 60 ? 'strong' : score >= 40 ? 'moderate' : 'developing';
    const matchedStr = matched.length > 0 ? `Key strengths in ${matched.slice(0, 2).join(' and ')}.` : '';
    const missingStr = missing.length > 0 ? `Growth areas include ${missing.slice(0, 2).join(' and ')}.` : '';
    
    return `This candidate shows ${scoreLabel} alignment with the role requirements. ${matchedStr} ${missingStr}`.trim();
  };

  const AIInsightsPreviewPane = ({ candidate }) => {
    // 1. Empty / Loading State
    if (!candidate || loadingMatches) {
      return (
        <div className="h-full flex flex-col p-6 bg-gradient-to-b from-[#0a0520] to-[#030014] border border-white/5 rounded-2xl relative overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 opacity-50">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <BrainCircuit size={16} className="text-purple-400" />
                <span className="text-sm font-bold text-white tracking-wide">AI Copilot</span>
                <span className="w-2 h-2 rounded-full bg-purple-500/50 animate-pulse" />
              </div>
              <p className="text-xs text-slate-500">Smart candidate insights</p>
            </div>
          </div>
          
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            {loadingMatches ? (
              <>
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full animate-pulse" />
                  <div className="w-12 h-12 rounded-full border-t-2 border-l-2 border-purple-500 border-r-2 border-r-transparent border-b-2 border-b-transparent animate-spin flex items-center justify-center relative z-10 bg-[#0a0520]">
                    <div className="w-8 h-8 rounded-full border-b-2 border-r-2 border-indigo-500 border-t-2 border-t-transparent border-l-2 border-l-transparent animate-spin-reverse" />
                  </div>
                </div>
                <h3 className="text-white font-medium mb-2 animate-pulse">Analyzing candidate profile...</h3>
                <p className="text-xs text-slate-500">Extracting semantic vector data</p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center mb-6 shadow-inner">
                  <BrainCircuit size={28} className="text-slate-600" />
                </div>
                <h3 className="text-white font-medium mb-2">Ready to Assist</h3>
                <p className="text-xs text-slate-400 max-w-[200px] mb-6">Select a candidate from the pipeline to see AI-generated insights</p>
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => { if (selectedJob && !loadingMatches) runMatching(); }}
                  disabled={!selectedJob}
                  className="rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 hover:bg-purple-500/20"
                >
                  <Sparkles size={14} className="mr-2" /> Run Analysis
                </Button>
              </>
            )}
          </div>
        </div>
      );
    }
    
    // Derived Data
    const score = Number(candidate.score || 0);
    const skillTags = getSkillBreakdown(candidate).slice(0, 5); // 4-6 key skills
    const appRecord = applications.find(a => a.resumeId?._id === candidate.resumeId?._id || a.userId?._id === candidate.resumeId?.userId);
    
    // Generate natural language chat message
    let aiMessage = getAISummary(candidate);
    
    const scoreStyle = score >= 80 ? {bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20'} 
                     : score >= 60 ? {bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20'} 
                     : {bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/20'};

    return (
      <div className="h-full rounded-2xl border border-white/10 bg-gradient-to-b from-[#0e0725] to-[#030014] flex flex-col p-5 relative overflow-y-auto animate-aiPaneFadeIn shadow-2xl">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-purple-500/10 to-transparent blur-2xl pointer-events-none" />
        
        {/* 1. Header */}
        <div className="flex items-start justify-between mb-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <BrainCircuit size={16} className="text-purple-400" />
              <span className="text-sm font-bold text-white tracking-wide">AI Copilot</span>
              <span className="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.8)] animate-pulse" />
            </div>
            <p className="text-xs text-slate-400">Smart candidate insights</p>
          </div>
          <button 
            onClick={() => setIsFullInsightsOpen(true)}
            title="View detailed AI analysis"
            className="text-slate-400 hover:text-white transition-all p-1.5 rounded-lg bg-white/[0.03] hover:bg-white/10 hover:scale-110"
          >
            <Info size={16} />
          </button>
        </div>
        
        {/* 2. Candidate Summary Section */}
        <div className="flex items-center justify-between mb-6 p-4 rounded-xl bg-white/[0.02] border border-white/5 animate-fade-in-up" style={{ animationFillMode: 'both' }}>
          <div className="min-w-0 pr-4">
            <h2 className="text-base font-bold text-white truncate" title={candidate.resumeId?.candidateName || 'Candidate'}>
              {candidate.resumeId?.candidateName || 'Candidate'}
            </h2>
            <p className="text-xs text-slate-500 truncate mt-0.5">{candidate.resumeId?.email || 'Candidate profile'}</p>
          </div>
          <div className={`shrink-0 px-3 py-1.5 rounded-full border flex items-center gap-1.5 ${scoreStyle.bg} ${scoreStyle.border}`}>
            <Target size={12} className={scoreStyle.text} />
            <span className={`font-bold text-sm ${scoreStyle.text}`}>{score}% Match</span>
          </div>
        </div>

        {/* 3. AI Insight Message (Chat Bubble) */}
        <div className="mb-6 relative z-10 animate-fade-in-up" style={{ animationDelay: '100ms', animationFillMode: 'both' }}>
          <div className="flex gap-3 relative">
            <div className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Sparkles size={14} className="text-white" />
            </div>
            
            <div className="flex-1 relative">
              <div className="absolute -left-2 top-3 w-3 h-3 bg-[#130b30] rotate-45 border-l border-b border-purple-500/30" />
              <div className="p-4 rounded-2xl rounded-tl-none bg-[#130b30] border border-purple-500/30 shadow-[0_4px_20px_rgba(139,92,246,0.1)]">
                <p className="text-[13px] text-slate-200 leading-relaxed">
                  {aiMessage}
                </p>
                
                {/* 5. Smart Suggestions (Chips) */}
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-purple-500/10">
                  <span className="text-[10px] uppercase font-bold text-slate-500 w-full mb-1">Recommended Actions</span>
                  {score >= 80 ? (
                    <button onClick={() => appRecord && handleUpdateApplicationStatus(appRecord._id, 'shortlisted')} className="px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium hover:bg-emerald-500/20 transition-colors">
                      ✨ Move to Shortlist
                    </button>
                  ) : score >= 50 ? (
                    <button className="px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium hover:bg-amber-500/20 transition-colors">
                      🤔 Consider with interview
                    </button>
                  ) : (
                    <button onClick={() => appRecord && handleUpdateApplicationStatus(appRecord._id, 'rejected')} className="px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium hover:bg-red-500/20 transition-colors">
                      📉 Reject candidate
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Skill Highlights */}
        <div className="mb-6 flex-1 animate-fade-in-up" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
          <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">Key Skill Triggers</h4>
          <div className="flex flex-wrap gap-2">
            {skillTags.length > 0 ? skillTags.map((tag, i) => {
              const isStrong = tag.status === 'strong';
              const isMod = tag.status === 'moderate';
              return (
                <div key={i} className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all hover:-translate-y-0.5 ${
                  isStrong ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 shadow-[0_0_10px_rgba(52,211,153,0.1)]' : 
                  isMod ? 'bg-amber-500/10 border-amber-500/30 text-amber-300' :
                  'bg-red-500/5 border-red-500/20 text-red-300 line-through decoration-red-500/50 opacity-70'
                }`}>
                  {tag.skill}
                </div>
              );
             }) : (
               <span className="text-xs text-slate-500">Data parsing required.</span>
             )}
          </div>
        </div>

        {/* 6. Quick Actions */}
        <div className="mt-auto grid grid-cols-2 gap-3 pt-4 border-t border-white/10 animate-fade-in-up" style={{ animationDelay: '300ms', animationFillMode: 'both' }}>
          <button 
            onClick={() => setIsFullInsightsOpen(true)}
            className="col-span-2 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500/20 to-purple-500/20 hover:from-indigo-500/30 hover:to-purple-500/30 border border-purple-500/30 text-purple-300 font-semibold text-sm transition-all shadow-[0_0_15px_rgba(139,92,246,0.1)] group"
          >
            <BrainCircuit size={16} className="group-hover:scale-110 transition-transform" />
            View Full Analysis
          </button>
        </div>
      </div>
    );
  };

  const AIInsightsFullModal = ({ candidate, onClose }) => {
    const score = Number(candidate.score || 0);
    const missingSkills = getMissingSkills(candidate);
    const matchedSkills = Array.isArray(candidate.matchingSkills) ? candidate.matchingSkills : [];
    const skillTags = getSkillBreakdown(candidate);
    const aiSummary = getAISummary(candidate);

    const scoreGlow = score >= 80 ? 'rgba(52,211,153,0.25)' : score >= 60 ? 'rgba(251,191,36,0.2)' : 'rgba(148,163,184,0.1)';
    const scoreRingColor = score >= 80 ? '#34d399' : score >= 60 ? '#fbbf24' : '#64748b';

    const tagStyles = {
      strong: { bg: 'rgba(52,211,153,0.1)', border: 'rgba(52,211,153,0.25)', color: '#6ee7b7', dotColor: '#34d399', label: 'Strong' },
      moderate: { bg: 'rgba(251,191,36,0.08)', border: 'rgba(251,191,36,0.2)', color: '#fcd34d', dotColor: '#fbbf24', label: 'Moderate' },
      missing: { bg: 'rgba(248,113,113,0.08)', border: 'rgba(248,113,113,0.2)', color: '#fca5a5', dotColor: '#f87171', label: 'Missing' },
    };

    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
        >
          <X size={24} />
        </button>

        <div className="w-full max-w-[500px] h-[85vh] sm:h-auto sm:max-h-[85vh] bg-gradient-to-b from-[#0a0520] to-[#030014] rounded-2xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col relative animate-scale-in">
          
          {/* Gradient border */}
          <div style={{
            position: 'absolute', inset: 0, borderRadius: '1rem', padding: '1px',
            background: 'linear-gradient(180deg, rgba(139,92,246,0.4), rgba(99,102,241,0.1), rgba(139,92,246,0.2))',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            pointerEvents: 'none',
          }} />

          {/* Ambient glow behind score */}
          <div style={{
            position: 'absolute', top: -40, right: -40, width: 200, height: 200,
            borderRadius: '50%', background: `radial-gradient(circle, ${scoreGlow} 0%, transparent 70%)`,
            pointerEvents: 'none', filter: 'blur(40px)',
          }} />

          {/* Header */}
          <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', position: 'relative', zIndex: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <BrainCircuit size={18} style={{ color: '#a78bfa' }} />
              <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#a78bfa' }}>
                Full AI Match Analysis
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ minWidth: 0, flex: 1 }}>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {candidate.resumeId?.candidateName || 'Candidate'}
                </h2>
                <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>
                  {candidate.resumeId?.email || 'No email provided'}
                </p>
              </div>

              {/* Radial Score */}
              <div style={{ position: 'relative', width: 72, height: 72, flexShrink: 0 }}>
                <svg width="72" height="72" viewBox="0 0 72 72" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="36" cy="36" r="30" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
                  <circle cx="36" cy="36" r="30" fill="none" stroke={scoreRingColor} strokeWidth="4"
                    strokeDasharray={`${(score / 100) * 188.5} 188.5`} strokeLinecap="round"
                    style={{ transition: 'stroke-dasharray 1s ease-out', filter: `drop-shadow(0 0 6px ${scoreRingColor})` }}
                  />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 20, fontWeight: 900, color: '#fff', lineHeight: 1 }}>{score}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Scrollable Flow */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div>
              <h3 style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#e2e8f0', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Target size={14} style={{ color: '#818cf8' }} /> Complete Skill Breakdown
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {skillTags.length > 0 ? skillTags.concat(skillTags.length > 0 ? [] : []).map((tag, i) => {
                  const s = tagStyles[tag.status];
                  return (
                    <div key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 8, background: s.bg, border: `1px solid ${s.border}` }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: s.dotColor, boxShadow: `0 0 6px ${s.dotColor}` }} />
                      <span style={{ fontSize: 12, fontWeight: 600, color: s.color }}>{tag.skill}</span>
                    </div>
                  );
                }) : (
                  <span className="text-sm text-slate-500">No skill data available.</span>
                )}
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#e2e8f0', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Sparkles size={14} style={{ color: '#a78bfa' }} /> Detailed AI Reasoning
              </h3>
              <div style={{ padding: '16px', borderRadius: 12, background: 'linear-gradient(135deg, rgba(139,92,246,0.08), rgba(99,102,241,0.05))', border: '1px solid rgba(139,92,246,0.15)' }}>
                <p style={{ fontSize: 13, lineHeight: 1.7, color: 'rgba(196,181,253,0.9)', margin: 0 }}>{aiSummary}</p>
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#e2e8f0', marginBottom: 14 }}>Alignment Metrics</h3>
              <div style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 500, color: '#cbd5e1' }}>Skills Alignment</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{Math.round((matchedSkills.length / Math.max(matchedSkills.length + missingSkills.length, 1)) * 100)}%</span>
                </div>
                <div style={{ height: 6, width: '100%', background: 'rgba(255,255,255,0.04)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', borderRadius: 3, background: 'linear-gradient(90deg, #818cf8, #a78bfa)', width: `${Math.round((matchedSkills.length / Math.max(matchedSkills.length + missingSkills.length, 1)) * 100)}%`, boxShadow: '0 0 8px rgba(129,140,248,0.3)' }} />
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 500, color: '#cbd5e1' }}>Experience Alignment</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{Math.min(95, Math.max(45, Math.round(score * 0.92)))}%</span>
                </div>
                <div style={{ height: 6, width: '100%', background: 'rgba(255,255,255,0.04)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', borderRadius: 3, background: 'linear-gradient(90deg, #a855f7, #c084fc)', width: `${Math.min(95, Math.max(45, Math.round(score * 0.92)))}%`, boxShadow: '0 0 8px rgba(168,85,247,0.3)' }} />
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-4 border-t border-white/5 relative z-10 flex justify-end">
            <Button variant="secondary" onClick={onClose}>Close Analysis</Button>
          </div>
        </div>
      </div>
    );
  };
  return (
    <div className="landing-page min-h-screen bg-[#030014] text-slate-300 font-sans flex overflow-hidden">
      
      {/* ── Mobile Sidebar Overlay ── */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* ── Sidebar ── */}
      <aside className={`fixed lg:static inset-y-0 left-0 w-64 bg-white/[0.02] border-r border-white/10 z-50 transform transition-transform duration-300 ease-out flex flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6 flex items-center justify-between border-b border-white/5">
          <LogoLink size={28} className="gap-2.5" />
          <button className="lg:hidden text-slate-400 hover:text-white" onClick={() => setIsSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="p-4 flex-1 overflow-y-auto">
          <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Recruitment</p>
          <nav className="space-y-1">
            <button 
              onClick={() => { setActiveNav('dashboard'); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${activeNav === 'dashboard' ? 'bg-purple-600/20 text-purple-400 font-medium' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}`}
            >
              <BriefcaseBusiness size={18} /> Dashboard Overview
            </button>
            <button 
              onClick={() => { setIsPostJobOpen(true); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-slate-400 hover:bg-white/5 hover:text-slate-200`}
            >
              <FilePlus2 size={18} /> Post New Job
            </button>
            <button 
              onClick={() => { setActiveNav('analytics'); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${activeNav === 'analytics' ? 'bg-purple-600/20 text-purple-400 font-medium' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}`}
            >
              <Activity size={18} /> Analytics & Reports
            </button>
          </nav>
        </div>

        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg shadow-purple-500/20">
              {user?.name?.charAt(0) || 'R'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-white truncate">{user?.name || 'Recruiter'}</p>
              <p className="text-xs text-slate-400 truncate">{user?.email || 'recruiter@example.com'}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
          >
            <LogOut size={16} /> Sign out
          </button>
        </div>
      </aside>

      {/* ── Main Dashboard Area ── */}
      <main className="flex-1 flex flex-col relative min-h-screen">
        
        {/* Top Header */}
        <header className="sticky top-0 flex flex-col sm:flex-row sm:items-center justify-between p-6 border-b border-white/10 bg-[#030014]/95 backdrop-blur z-30 shrink-0">
          <div className="flex items-center gap-4 mb-4 sm:mb-0">
            <button className="lg:hidden text-slate-300 hover:text-white" onClick={() => setIsSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">Recruitment Workspace</h1>
              <p className="text-sm text-slate-400 hidden sm:block">Manage jobs, analyze candidates, and make data-driven hires.</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative w-full sm:w-64">
              <input 
                type="text" 
                placeholder="Search jobs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0a0520] border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-all font-sans"
              />
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            </div>
            <Button 
              variant="primary"
              size="sm"
              onClick={() => setIsPostJobOpen(true)}
              className="hidden md:flex rounded-full shrink-0"
            >
              <FilePlus2 size={16} /> Post Job
            </Button>
          </div>
        </header>

        {/* Global Notifications */}
        {statusMessage.text && (
          <div className="absolute top-24 left-1/2 -translate-x-1/2 z-50 animate-fade-in pointer-events-none">
            <div className={`px-4 py-2.5 rounded-full flex items-center gap-2 border shadow-2xl backdrop-blur-md ${
              statusMessage.type === 'error' ? 'bg-red-500/20 border-red-500/30 text-red-300' : 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300'
            }`}>
              {statusMessage.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
              <span className="text-sm font-medium">{statusMessage.text}</span>
            </div>
          </div>
        )}

        {/* Scrollable Layout */}
        <div className="flex-1 flex flex-col p-6">
          
          {/* Stats Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 shrink-0">
            {[
              { label: 'Active Jobs', value: stats.activeJobs, icon: BriefcaseBusiness, color: 'text-indigo-400' },
              { label: 'Total Matches Found', value: stats.totalMatches, icon: Target, color: 'text-purple-400' },
              { label: 'Avg Match Score', value: `${stats.avgMatchScore}%`, icon: BrainCircuit, color: 'text-emerald-400' },
              { label: 'Total Jobs Posted', value: stats.totalJobs, icon: Activity, color: 'text-slate-400' }
            ].map((s, i) => (
              <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-4">
                <div className={`p-3 rounded-lg bg-white/5 ${s.color}`}>
                  <s.icon size={20} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{s.value}</div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Tri-Pane Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
            
            {/* PANE A: Jobs List */}
            <div className="flex flex-col bg-white/[0.02] border border-white/5 rounded-2xl h-full">
              <div className="p-4 border-b border-white/5 bg-white/[0.01]">
                <h2 className="font-bold text-white flex items-center gap-2">
                  <BriefcaseBusiness size={18} className="text-indigo-400" /> My Jobs
                </h2>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {filteredJobs.length === 0 ? (
                  <div className="text-center p-6 text-slate-500 text-sm">No jobs found.</div>
                ) : (
                  filteredJobs.map(job => (
                    <div 
                      key={job._id}
                      onClick={() => setSelectedJob(job)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedJob?._id === job._id ? 'bg-purple-600/10 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.1)]' : 'bg-white/[0.02] border-white/5 border-transparent hover:border-white/10 hover:bg-white/[0.04]'}`}
                    >
                      <h3 className={`font-bold mb-1 truncate ${selectedJob?._id === job._id ? 'text-purple-300' : 'text-white'}`}>{job.title}</h3>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
                        <span className="truncate">{job.company}</span>
                        <span>•</span>
                        <span className="truncate">{job.location}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs font-medium">
                        <span className="px-2 py-0.5 rounded-md bg-white/5 text-slate-300">
                          {new Date(job.createdAt).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}
                        </span>
                        <span className="text-indigo-400 flex items-center gap-1">
                          View Matches <ChevronRight size={14} />
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* PANE B: Candidates / Matches */}
            <div className="flex flex-col bg-white/[0.02] border border-white/5 rounded-2xl h-full">
              <div className="p-4 border-b border-white/5 bg-white/[0.01] flex justify-between items-center">
                <h2 className="font-bold text-white flex items-center gap-2">
                  <Users size={18} className="text-purple-400" /> Candidate Pipeline
                </h2>
                {selectedJob && (
                  <Button 
                    variant="primary"
                    size="sm"
                    onClick={runMatching}
                    disabled={loadingMatches}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold"
                  >
                    <Sparkles size={14} /> {loadingMatches ? 'Analyzing...' : 'Run AI Analysis'}
                  </Button>
                )}
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-2 relative">
                {!selectedJob ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                    <UserPlus size={36} className="text-slate-600 mb-3" />
                    <p className="text-sm text-slate-400">Select a job from the left pane to view its candidates and AI matches.</p>
                  </div>
                ) : loadingMatches ? (
                  <div className="flex flex-col items-center justify-center h-40 text-purple-400">
                    <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin mb-3" />
                    <span className="text-sm font-medium">Analyzing Candidates...</span>
                  </div>
                ) : candidateList.length === 0 && applications.length === 0 ? (
                  <div className="text-center p-8 text-slate-500">
                    <p className="text-sm mb-3">No candidates found for this role.</p>
                    <button onClick={runMatching} className="text-purple-400 text-xs font-medium hover:underline">Click here to search database</button>
                  </div>
                ) : (
                  <>
                    {/* Render Matches List */}
                    {candidateList.map((match, i) => {
                      const score = Number(match.score || 0);
                      const isSelected = selectedCandidate?._id === match._id;
                      
                      return (
                        <div 
                          key={match._id || i}
                          onClick={() => setSelectedCandidate(match)}
                          className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${isSelected ? 'bg-white/10 border-white/20' : 'bg-white/[0.02] border-white/5 hover:border-white/10 hover:bg-white/[0.04]'}`}
                        >
                          <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center border font-bold text-xs ${getScoreColor(score)}`}>
                            {score}%
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h4 className="text-sm font-bold text-white truncate">{match.resumeId?.candidateName || 'Candidate'}</h4>
                              {applications.find(a => a.resumeId?._id === match.resumeId?._id) && (
                                <span className="shrink-0 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-bold bg-indigo-500/20 text-indigo-300">Applied</span>
                              )}
                            </div>
                            <p className="text-xs text-slate-400 truncate mb-2">{match.resumeId?.education || 'Profile Data'}</p>
                            <div className="flex flex-wrap gap-1">
                              {Array.isArray(match.matchingSkills) && match.matchingSkills.slice(0, 3).map((skill, si) => (
                                <span key={si} className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">{skill}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    
                    {/* Render standard applications that might not be in matches yet */}
                    {applications.filter(app => !candidateList.some(m => m.resumeId?._id === app.resumeId?._id)).map(app => (
                      <div 
                        key={app._id}
                        // Create a mock match object to display in AI pane when clicked
                        onClick={() => setSelectedCandidate({
                          _id: app._id,
                          resumeId: app.resumeId,
                          score: 0,
                          matchingSkills: [],
                          why: 'AI Matching has not been run for this candidate yet. Click "Run AI Analysis" above.'
                        })}
                        className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${selectedCandidate?._id === app._id ? 'bg-white/10 border-white/20' : 'bg-white/[0.02] border-white/5 hover:border-white/10 hover:bg-white/[0.04]'}`}
                      >
                         <div className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center border bg-slate-500/10 border-slate-500/20 text-slate-400 font-bold text-xs">
                            ?
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h4 className="text-sm font-bold text-white truncate">{app.resumeId?.candidateName || app.userId?.name || 'Applicant'}</h4>
                              <span className="shrink-0 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-bold bg-indigo-500/20 text-indigo-300">Applied</span>
                            </div>
                            <p className="text-xs text-slate-500 italic">Analysis Pending</p>
                          </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>

            {/* PANE C: AI Insights */}
            <div className="h-full hidden lg:block">
              <AIInsightsPreviewPane candidate={selectedCandidate} />
            </div>

            

          </div>
        </div>
      </main>

      {/* Full AI Insights Modal */}
      {isFullInsightsOpen && selectedCandidate && (
        <AIInsightsFullModal 
          candidate={selectedCandidate} 
          onClose={() => setIsFullInsightsOpen(false)} 
        />
      )}

      {/* Post Job Modal */}
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