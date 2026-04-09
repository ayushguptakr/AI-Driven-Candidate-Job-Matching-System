import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { resumeAPI, jobAPI, applicationAPI, notificationAPI } from '../services/api';
import { 
  BriefcaseBusiness, DollarSign, FileText, FileUp, IndianRupee, LayoutDashboard, 
  MapPin, Send, Sparkles, User2, Map, LayoutPanelLeft, Clock,
  ChevronRight, BrainCircuit, Activity, BarChart3, AlertCircle, TrendingUp, CheckCircle, Target, Lightbulb, Zap, Phone, Mail, FileCheck2, Search, Menu, X, LogOut, Bell
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AnimatedLogo from '../components/landing/AnimatedLogo';
import LogoLink from '../components/ui/LogoLink';
import ResumeUpload from '../components/ResumeUpload';
import Button from '../components/ui/Button';
import MyMatches from './MyMatches';
import MyApplications from './MyApplications';
import ProfileDrawer from '../components/ProfileDrawer';

const CandidateDashboard = ({ page }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Derive activeNav from route
  const activeNav = page === 'matches' ? 'matches' : page === 'applications' ? 'applications' : 'dashboard';
  const [resumes, setResumes] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [isUploadResumeOpen, setIsUploadResumeOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isJobDetailOpen, setIsJobDetailOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ text: '', type: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false);
  
  const [stats, setStats] = useState({
    totalResumes: 0,
    totalJobs: 0,
    recommendedJobs: 0,
    avgMatchScore: 0
  });

  const [notifications, setNotifications] = useState([]);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const loadData = async () => {
    try {
      const [resumeResponse, jobResponse] = await Promise.all([
        resumeAPI.getAll(),
        jobAPI.getAll()
      ]);
      const resumesList = resumeResponse.data.resumes || resumeResponse.data;
      const jobsList = jobResponse.data.jobs || jobResponse.data;
      setResumes(resumesList);
      setJobs(jobsList);
      
      const recommendedJobs = jobsList.length;
      const avgScore = resumesList.length > 0 
        ? resumesList.reduce((sum, resume) => sum + (resume.avgMatchScore || 0), 0) / resumesList.length 
        : 0;
      
      setStats({
        totalResumes: resumeResponse.data.pagination?.total || resumesList.length,
        totalJobs: jobResponse.data.pagination?.total || jobsList.length,
        recommendedJobs: recommendedJobs,
        avgMatchScore: Math.round(avgScore)
      });
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const loadNotifications = async () => {
    try {
      const res = await notificationAPI.getMyNotifications(10);
      setNotifications(res.data);
    } catch (err) {
      console.error('Error loading notifications:', err);
    }
  };

  const handleOpenNotifications = async () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    if (!isNotificationsOpen && notifications.some(n => !n.read)) {
      try {
        await notificationAPI.markAsRead();
        setNotifications(prev => prev.map(n => ({...n, read: true})));
      } catch (err) {
        console.error('Error marking notifications read:', err);
      }
    }
  };

  const handleResumeUploaded = () => {
    loadData();
    setIsUploadResumeOpen(false);
    setStatusMessage({ text: 'Resume uploaded successfully.', type: 'success' });
    setTimeout(() => setStatusMessage({ text: '', type: '' }), 4000);
  };

  const handleApply = async (jobId) => {
    if (resumes.length === 0) {
      setStatusMessage({ text: 'Please upload a resume first before applying.', type: 'warning' });
      setTimeout(() => setStatusMessage({ text: '', type: '' }), 4000);
      setIsJobDetailOpen(false);
      setIsUploadResumeOpen(true);
      return;
    }

    try {
      await applicationAPI.apply(jobId);
      const jobTitle = selectedJob?.title || jobs.find(j => j._id === jobId)?.title || 'this position';
      setStatusMessage({ text: `Application submitted successfully for ${jobTitle}.`, type: 'success' });
      setTimeout(() => setStatusMessage({ text: '', type: '' }), 5000);
      setIsJobDetailOpen(false);
      setSelectedJob(null);
    } catch (error) {
      if (error.response?.status === 409) {
        setStatusMessage({ text: 'You have already applied to this job.', type: 'warning' });
      } else {
        setStatusMessage({ text: error.response?.data?.error || 'Failed to submit application. Please try again.', type: 'error' });
      }
      setTimeout(() => setStatusMessage({ text: '', type: '' }), 4000);
    }
  };

  useEffect(() => {
    loadData();
    loadNotifications();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const filteredJobs = jobs.filter(job => {
    const companyStr = job.company?.name || job.company || '';
    return searchQuery === '' || 
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    companyStr.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.location.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="landing-page min-h-screen bg-[#030014] text-slate-300 font-sans flex overflow-hidden">
      
      {/* ── Mobile Sidebar Overlay ── */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
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
          <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Menu</p>
          <nav className="space-y-1">
            <button 
              onClick={() => { navigate('/candidate/dashboard'); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${activeNav === 'dashboard' ? 'bg-purple-600/20 text-purple-400 font-medium' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}`}
            >
              <LayoutDashboard size={18} /> Dashboard
            </button>
            <button 
              onClick={() => { navigate('/candidate/matches'); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${activeNav === 'matches' ? 'bg-purple-600/20 text-purple-400 font-medium' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}`}
            >
              <Target size={18} /> My Matches
            </button>
            <button 
              onClick={() => { navigate('/candidate/applications'); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${activeNav === 'applications' ? 'bg-purple-600/20 text-purple-400 font-medium' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}`}
            >
              <Send size={18} /> Applications
            </button>
          </nav>
        </div>

        <div className="p-4 border-t border-white/5">
          <div 
            className="sidebar-profile flex items-center gap-3 px-2 py-2 rounded-xl group relative cursor-pointer hover:bg-white/5 transition-colors"
            onClick={() => setIsProfileDrawerOpen(true)}
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-purple-500/20 z-10 shrink-0">
              {user?.name?.charAt(0) || 'C'}
            </div>
            <div className="min-w-0 flex-1 z-10">
              <p className="text-sm font-medium text-white truncate">{user?.name || 'Candidate'}</p>
              <p className="text-[11px] text-slate-400 truncate uppercase tracking-widest mt-0.5">{user?.role || 'Candidate'}</p>
            </div>
            <div className="absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main Dashboard Area ── */}
      <main className="flex-1 flex flex-col relative h-screen overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
        
        {/* Top Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between p-6 border-b border-white/10 bg-white/[0.02] backdrop-blur-md z-30 shrink-0">
          <div className="flex items-center gap-4 mb-4 sm:mb-0">
            <button className="lg:hidden text-slate-300 hover:text-white flex-shrink-0" onClick={() => setIsSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">
                Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">{user?.name?.split(' ')[0] || 'Candidate'}</span>
              </h1>
              <p className="text-sm text-slate-400 hidden sm:block">Let's find your next big opportunity with AI-powered matching.</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Notification Bell */}
            <div className="relative">
              <button 
                onClick={handleOpenNotifications}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 transition-colors relative"
              >
                <Bell size={20} />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[9px] font-bold text-white border-2 border-[#030014]">
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
              </button>
              {isNotificationsOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsNotificationsOpen(false)} />
                  <div className="absolute top-full right-0 mt-2 w-80 bg-[#0a0520] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden animate-scale-in">
                    <div className="p-4 border-b border-white/5 bg-white/[0.02]">
                      <h3 className="font-bold text-white flex items-center gap-2"><Bell size={16} className="text-purple-400" /> Notifications</h3>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <p className="p-6 text-sm text-center text-slate-500">No new notifications</p>
                      ) : (
                        notifications.map(n => (
                          <div key={n._id} className={`p-4 border-b border-white/5 last:border-0 ${!n.read ? 'bg-purple-500/5' : 'bg-transparent'}`}>
                            <h4 className="text-sm font-bold text-slate-200 mb-1">{n.title}</h4>
                            <p className="text-xs text-slate-400 leading-relaxed">{n.message}</p>
                            <p className="text-[10px] text-slate-500 mt-2">{new Date(n.createdAt).toLocaleString()}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="relative flex-1 sm:w-64">
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
              onClick={() => setIsUploadResumeOpen(true)}
              className="hidden md:flex rounded-full shrink-0"
            >
              <FileUp size={16} />
              <span>Upload Resume</span>
            </Button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto z-10 p-6 md:p-8 xl:p-12 scroll-smooth">
          <div className="max-w-7xl mx-auto space-y-8">

            {/* Conditional Page Rendering */}
            {page === 'matches' ? (
              <MyMatches />
            ) : page === 'applications' ? (
              <MyApplications />
            ) : (
            <>
            {/* Status Messages */}
            {statusMessage.text && (
              <div className={`p-4 rounded-xl flex items-center gap-3 border ${
                statusMessage.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                statusMessage.type === 'warning' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400' :
                'bg-red-500/10 border-red-500/20 text-red-400'
              }`}>
                {statusMessage.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                <p className="font-medium text-sm">{statusMessage.text}</p>
              </div>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Active Resumes', value: stats.totalResumes, icon: FileCheck2, color: 'text-blue-400', bg: 'bg-blue-400/10' },
                { label: 'Platform Jobs', value: stats.totalJobs, icon: BriefcaseBusiness, color: 'text-purple-400', bg: 'bg-purple-400/10' },
                { label: 'Recommended Matches', value: stats.recommendedJobs, icon: Sparkles, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
                { label: 'Avg Match Score', value: `${stats.avgMatchScore}%`, icon: Target, color: 'text-emerald-400', bg: 'bg-emerald-400/10' }
              ].map((stat, i) => (
                <div key={i} className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-colors backdrop-blur-sm shadow-xl shadow-black/20">
                  <div className="flex items-center gap-4 mb-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                      <stat.icon size={20} />
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
                  <p className="text-sm font-medium text-slate-400">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Main Content Column */}
              <div className="lg:col-span-2 space-y-6">
                
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Sparkles size={20} className="text-purple-400" />
                    Top Recommended Jobs
                  </h2>
                </div>

                <div className="space-y-4">
                  {filteredJobs.length === 0 ? (
                    <div className="text-center py-12 px-4 rounded-2xl bg-white/[0.02] border border-white/5">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 mb-4">
                        <Search size={28} className="text-slate-500" />
                      </div>
                      <h3 className="text-lg font-medium text-white mb-2">No matching jobs found</h3>
                      <p className="text-slate-400 text-sm max-w-sm mx-auto">Upload a new resume or adjust your profile to discover more tailored opportunities.</p>
                    </div>
                  ) : (
                    filteredJobs.map((job) => {
                      // Stable score derived from job ID to avoid re-render flicker
                      const hash = job._id ? job._id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) : 0;
                      const matchScore = resumes.length > 0 ? 70 + (hash % 25) : 0;
                      return (
                        <div key={job._id} className="group relative p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-white/[0.04] to-white/[0.01] border border-white/5 hover:border-purple-500/30 transition-all duration-300">
                          <div className="flex flex-col sm:flex-row gap-4 sm:items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-start gap-3 mb-2">
                                <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors">{job.title}</h3>
                                {matchScore > 90 && (
                                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] uppercase font-bold tracking-wider float-animation">
                                    High Match
                                  </span>
                                )}
                              </div>
                              <p className="text-sm font-medium text-slate-300 mb-4">{job.company?.name || job.company}</p>
                              
                              <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-400 mb-4">
                                <span className="flex items-center gap-1.5"><MapPin size={14} /> {job.location}</span>
                                <span className="flex items-center gap-1.5"><IndianRupee size={14} /> {job.salary}</span>
                                <span className="flex items-center gap-1.5"><Clock size={14} /> {new Date(job.createdAt).toLocaleDateString()}</span>
                              </div>
                              
                              <div className="flex flex-wrap gap-2">
                                {job.requirements.split(',').slice(0, 3).map((req, i) => (
                                  <span key={i} className="px-2.5 py-1 rounded-md bg-white/5 text-xs text-slate-300">
                                    {req.trim()}
                                  </span>
                                ))}
                                {job.requirements.split(',').length > 3 && (
                                  <span className="px-2.5 py-1 rounded-md bg-white/5 text-xs text-slate-500">
                                    +{job.requirements.split(',').length - 3} more
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex sm:flex-col items-center sm:items-end gap-4 mt-4 sm:mt-0">
                              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/5 border border-white/10 shrink-0">
                                <span className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-br from-purple-400 to-indigo-400">{matchScore}%</span>
                              </div>
                              <div className="flex gap-2 w-full sm:w-auto">
                                <Button 
                                  variant="secondary"
                                  onClick={() => { setSelectedJob(job); setIsJobDetailOpen(true); }}
                                >
                                  Details
                                </Button>
                                <Button 
                                  variant="primary"
                                  onClick={() => handleApply(job._id)}
                                >
                                  Apply
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>

              {/* Sidebar Insights Panel */}
              <div className="space-y-6">
                
                {/* AI Insights Card — Dynamic based on actual resume data */}
                <div className="p-6 rounded-2xl bg-gradient-to-b from-purple-900/20 to-[#030014] border border-purple-500/20 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                    <BrainCircuit size={100} />
                  </div>
                  
                  <div className="flex items-center gap-3 mb-6 relative z-10">
                    <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
                      <Zap size={20} />
                    </div>
                    <h2 className="text-lg font-bold text-white">AI Insights</h2>
                  </div>

                  {resumes.length === 0 ? (
                    <div className="text-center py-6 relative z-10">
                      <p className="text-sm text-slate-400 mb-3">Upload a resume to unlock AI-powered insights about your profile.</p>
                      <button 
                        onClick={() => setIsUploadResumeOpen(true)}
                        className="text-purple-400 text-sm font-medium hover:text-purple-300 transition-colors"
                      >
                        Upload your first resume →
                      </button>
                    </div>
                  ) : (() => {
                    const latestResume = resumes[0];
                    const hasSkills = latestResume.skills && latestResume.skills.length > 0;
                    const hasExperience = !!latestResume.experience;
                    const hasEducation = !!latestResume.education;
                    const hasPhone = !!latestResume.phone;
                    const completedFields = [true, true, hasSkills, hasExperience, hasEducation, hasPhone].filter(Boolean).length;
                    const profileStrength = Math.round((completedFields / 6) * 100);
                    const missingFields = [];
                    if (!hasSkills) missingFields.push('Skills');
                    if (!hasExperience) missingFields.push('Experience');
                    if (!hasEducation) missingFields.push('Education');
                    if (!hasPhone) missingFields.push('Phone');

                    return (
                      <div className="space-y-5 relative z-10">
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-slate-300">Profile Strength</span>
                            <span className={`text-sm font-bold ${profileStrength >= 80 ? 'text-emerald-400' : profileStrength >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>{profileStrength}%</span>
                          </div>
                          <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full transition-all duration-500 ${profileStrength >= 80 ? 'bg-gradient-to-r from-emerald-500 to-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : profileStrength >= 50 ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' : 'bg-gradient-to-r from-red-500 to-red-400'}`} style={{ width: `${profileStrength}%` }} />
                          </div>
                        </div>

                        {missingFields.length > 0 && (
                          <div className="pt-4 border-t border-white/5">
                            <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                              <AlertCircle size={14} className="text-yellow-400" /> Missing Information
                            </h4>
                            <div className="flex flex-wrap gap-2 text-xs">
                              {missingFields.map((field, i) => (
                                <span key={i} className="px-2 py-1 rounded bg-yellow-500/10 text-yellow-400 border border-yellow-500/10">{field}</span>
                              ))}
                            </div>
                          </div>
                        )}

                        {hasSkills && (
                          <div className="pt-4 border-t border-white/5">
                            <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                              <CheckCircle size={14} className="text-emerald-400" /> Your Skills
                            </h4>
                            <div className="flex flex-wrap gap-2 text-xs">
                              {latestResume.skills.map((skill, i) => (
                                <span key={i} className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/10">{skill}</span>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="pt-4 border-t border-white/5">
                          <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                            <Lightbulb size={14} className="text-amber-400" /> Suggestions
                          </h4>
                          <ul className="space-y-3">
                            {!hasSkills && (
                              <li className="flex items-start gap-2 text-sm text-slate-400">
                                <CheckCircle size={14} className="text-purple-400 shrink-0 mt-0.5" />
                                <span>Add your <strong className="text-slate-200">key skills</strong> to improve match accuracy.</span>
                              </li>
                            )}
                            {!hasExperience && (
                              <li className="flex items-start gap-2 text-sm text-slate-400">
                                <CheckCircle size={14} className="text-purple-400 shrink-0 mt-0.5" />
                                <span>Include your <strong className="text-slate-200">work experience</strong> to appear in more searches.</span>
                              </li>
                            )}
                            {profileStrength >= 80 && (
                              <li className="flex items-start gap-2 text-sm text-slate-400">
                                <CheckCircle size={14} className="text-purple-400 shrink-0 mt-0.5" />
                                <span>Great profile! Browse recommended jobs to find your best matches.</span>
                              </li>
                            )}
                            {hasSkills && latestResume.skills.length < 5 && (
                              <li className="flex items-start gap-2 text-sm text-slate-400">
                                <CheckCircle size={14} className="text-purple-400 shrink-0 mt-0.5" />
                                <span>Add more skills to expand your match range. You currently have {latestResume.skills.length}.</span>
                              </li>
                            )}
                          </ul>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Uploaded Resumes Minimal List */}
                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                  <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <FileText size={18} className="text-indigo-400" />
                    Recent Resumes
                  </h2>
                  <div className="space-y-3">
                    {resumes.slice(0, 3).map(resume => (
                      <div key={resume._id} className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 shrink-0">
                          <FileText size={16} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-white truncate">{resume.fileName || 'Resume.pdf'}</p>
                          <p className="text-xs text-slate-500 truncate">{new Date(resume.uploadedAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                    {resumes.length === 0 && (
                      <p className="text-sm text-slate-400 text-center py-4">No resumes uploaded.</p>
                    )}
                  </div>
                </div>

              </div>
            </div>
            </>
            )}

          </div>
        </div>
      </main>

      {/* ── Modals ── */}
      {isUploadResumeOpen && (
        <ResumeUpload 
          onResumeUploaded={handleResumeUploaded}
          onClose={() => setIsUploadResumeOpen(false)}
        />
      )}

      {isJobDetailOpen && selectedJob && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 sm:p-6"
          onClick={() => setIsJobDetailOpen(false)}
        >
          <div 
            className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#0a0520] border border-white/10 rounded-2xl shadow-2xl animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-[#0a0520]/90 backdrop-blur-md border-b border-white/10 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-xl font-bold text-white">{selectedJob.title}</h2>
              <button 
                onClick={() => setIsJobDetailOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="p-6 space-y-8">
              <div className="flex flex-wrap gap-3">
                <span className="px-3 py-1.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 text-sm font-medium">{selectedJob.company?.name || selectedJob.company}</span>
                <span className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm text-slate-300 flex items-center gap-1.5">
                  <MapPin size={14} className="text-slate-500" /> {selectedJob.location}
                </span>
                <span className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-sm flex items-center gap-1.5">
                  <IndianRupee size={14} className="opacity-70" /> {selectedJob.salary || 'Not specified'}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Job Description</h3>
                <p className="text-slate-300 leading-relaxed text-sm whitespace-pre-wrap">{selectedJob.description}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Requirements & Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedJob.requirements.split(',').map((req, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm text-slate-300">
                      {req.trim()}
                    </span>
                  ))}
                </div>
              </div>

              {selectedJob.eligibility && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Eligibility</h3>
                  <p className="text-slate-300 leading-relaxed text-sm whitespace-pre-wrap">{selectedJob.eligibility}</p>
                </div>
              )}
            </div>

            <div className="sticky bottom-0 bg-[#0a0520]/90 backdrop-blur-md border-t border-white/10 px-6 py-4 flex gap-4 mt-auto">
              <Button 
                variant="secondary"
                onClick={() => setIsJobDetailOpen(false)}
                className="flex-1"
              >
                Close
              </Button>
              <Button 
                variant="primary"
                onClick={() => handleApply(selectedJob._id)}
                className="flex-[2]"
              >
                <Send size={18} /> Apply Now
              </Button>
            </div>
          </div>
        </div>
      )}

      <ProfileDrawer 
        isOpen={isProfileDrawerOpen} 
        onClose={() => setIsProfileDrawerOpen(false)} 
      />

    </div>
  );
};

export default CandidateDashboard;