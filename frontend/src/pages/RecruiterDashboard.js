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

  const AIInsightsPane = ({ candidate }) => {
    if (!candidate) {
      return (
        <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-white/[0.02] border border-white/5 rounded-2xl">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 text-slate-500">
            <BrainCircuit size={32} />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">AI Insights Pending</h3>
          <p className="text-sm text-slate-400 max-w-[250px]">Select a candidate from the middle pane to view their detailed AI match breakdown.</p>
        </div>
      );
    }
    
    // Find application status if exists
    const appRecord = applications.find(a => a.resumeId?._id === candidate.resumeId?._id || a.userId?._id === candidate.resumeId?.userId);
    
    const score = Number(candidate.score || 0);
    const missingSkills = getMissingSkills(candidate);
    const matchedSkills = Array.isArray(candidate.matchingSkills) ? candidate.matchingSkills : [];
    
    const skillsMatchedCount = matchedSkills.length;
    const skillsTotal = Math.max(skillsMatchedCount + missingSkills.length, 1);
    const skillsPct = Math.round((skillsMatchedCount / skillsTotal) * 100);
    const expPct = Math.min(95, Math.max(45, Math.round(score * 0.92)));

    return (
      <div className="h-full flex flex-col bg-gradient-to-b from-[#0a0520] to-[#030014] border border-white/10 rounded-2xl overflow-hidden relative">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <BrainCircuit size={140} />
        </div>
        
        {/* Header */}
        <div className="p-6 border-b border-white/5 relative z-10">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-bold text-white mb-1">{candidate.resumeId?.candidateName || 'Candidate'}</h2>
              <p className="text-sm text-slate-400 flex items-center gap-2">
                {candidate.resumeId?.email || 'No email provided'}
              </p>
            </div>
            <div className={`px-4 py-2 rounded-xl border flex flex-col items-center ${getScoreColor(score)}`}>
              <span className="text-xl font-black">{score}%</span>
              <span className="text-[10px] uppercase font-bold tracking-wider opacity-80">Match</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Status:</span>
              {appRecord ? (
                <select 
                  value={appRecord.status}
                  onChange={(e) => handleUpdateApplicationStatus(appRecord._id, e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-lg text-sm text-white px-3 py-1 outline-none focus:border-purple-500"
                >
                  <option value="pending" className="bg-[#0a0520]">Pending</option>
                  <option value="reviewed" className="bg-[#0a0520]">Reviewed</option>
                  <option value="shortlisted" className="bg-[#0a0520]">Shortlisted</option>
                  <option value="rejected" className="bg-[#0a0520]">Rejected</option>
                </select>
              ) : (
                <span className="px-3 py-1 rounded-lg bg-white/5 text-slate-400 text-sm">Not Applied</span>
              )}
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 relative z-10">
          
          {/* Why this match */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3 uppercase tracking-wider flex items-center gap-2">
              <Sparkles size={16} className="text-purple-400" /> AI Verdict
            </h3>
            <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-100 text-sm leading-relaxed">
              {getWhyThisMatch(candidate)}
            </div>
          </div>

          {/* Breakdown Bars */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Detailed Breakdown</h3>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-slate-300">Skills Alignment</span>
                <span className="text-sm font-bold text-white">{skillsPct}%</span>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${skillsPct}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-slate-300">Experience Alignment</span>
                <span className="text-sm font-bold text-white">{expPct}%</span>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: `${expPct}%` }} />
              </div>
            </div>
          </div>

          {/* Skills Lists */}
          <div className="grid grid-cols-1 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <CheckCircle size={16} className="text-emerald-400" /> Matched Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {matchedSkills.length > 0 ? matchedSkills.map((skill, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-xs text-slate-300">
                    {skill}
                  </span>
                )) : (
                  <span className="text-sm text-slate-500">No specific matched skills extracted.</span>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <AlertCircle size={16} className="text-amber-400" /> Missing Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {missingSkills.length > 0 ? missingSkills.map((skill, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-md bg-red-500/10 border border-red-500/20 text-xs text-red-400">
                    {skill}
                  </span>
                )) : (
                  <span className="text-sm text-slate-500">No missing skills detected.</span>
                )}
              </div>
            </div>
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
          <Link to="/" className="flex items-center gap-2.5 no-underline">
            <AnimatedLogo size={28} />
            <span className="text-white font-bold text-lg tracking-tight">TalentMatch AI</span>
          </Link>
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
      <main className="flex-1 flex flex-col relative h-screen overflow-hidden">
        
        {/* Top Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between p-6 border-b border-white/10 bg-white/[0.02] z-30 shrink-0">
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
        <div className="flex-1 overflow-hidden p-6">
          
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100%-100px)]">
            
            {/* PANE A: Jobs List */}
            <div className="flex flex-col bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden h-full">
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
            <div className="flex flex-col bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden h-full">
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
              <AIInsightsPane candidate={selectedCandidate} />
            </div>

            {/* Mobile Fallback for AI Insights (Modal) */}
            {selectedCandidate && (
              <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 lg:hidden flex flex-col pt-16 pb-6 px-4">
                <button 
                  onClick={() => setSelectedCandidate(null)}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white"
                >
                  <X size={20} />
                </button>
                <div className="flex-1 bg-[#0a0520] rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
                  <AIInsightsPane candidate={selectedCandidate} />
                </div>
              </div>
            )}

          </div>
        </div>
      </main>

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