import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { matchAPI, applicationAPI } from '../services/api';
import {
  Target, BriefcaseBusiness, MapPin, IndianRupee, Sparkles,
  CheckCircle, XCircle, AlertCircle, RefreshCw, Send, Eye, BrainCircuit
} from 'lucide-react';
import Button from '../components/ui/Button';

const MyMatches = () => {
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applyingTo, setApplyingTo] = useState(null);
  const [toast, setToast] = useState({ text: '', type: '' });

  const showToast = (text, type = 'success') => {
    setToast({ text, type });
    setTimeout(() => setToast({ text: '', type: '' }), 4000);
  };

  const loadMatches = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await matchAPI.getMyMatches();
      setMatches(res.data);
    } catch (err) {
      console.error('Error loading matches:', err);
      setError('Failed to load your matches. Please try again.');
    }
    setLoading(false);
  };

  useEffect(() => { loadMatches(); }, []);

  const handleApply = async (jobId, jobTitle) => {
    setApplyingTo(jobId);
    try {
      await applicationAPI.apply(jobId);
      showToast(`Successfully applied to ${jobTitle}!`);
      // Update local state to reflect applied status
      setMatches(prev => prev.map(m =>
        m.jobId === jobId ? { ...m, hasApplied: true, applicationStatus: 'pending' } : m
      ));
    } catch (err) {
      if (err.response?.status === 409) {
        showToast('You have already applied to this job.', 'warning');
        setMatches(prev => prev.map(m =>
          m.jobId === jobId ? { ...m, hasApplied: true } : m
        ));
      } else {
        showToast('Failed to submit application.', 'error');
      }
    }
    setApplyingTo(null);
  };

  const getStatusBadge = (decision) => {
    if (decision === 'shortlisted') return { label: 'Shortlisted', bg: 'bg-emerald-500/15', border: 'border-emerald-500/30', text: 'text-emerald-400', icon: CheckCircle };
    if (decision === 'rejected') return { label: 'Not Selected', bg: 'bg-red-500/15', border: 'border-red-500/30', text: 'text-red-400', icon: XCircle };
    return { label: 'Matched', bg: 'bg-purple-500/15', border: 'border-purple-500/30', text: 'text-purple-400', icon: Target };
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'from-emerald-500 to-emerald-400';
    if (score >= 60) return 'from-amber-500 to-amber-400';
    return 'from-slate-500 to-slate-400';
  };

  // Skeleton card component
  const SkeletonCard = () => (
    <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 animate-pulse">
      <div className="flex justify-between items-start mb-4">
        <div className="space-y-2 flex-1">
          <div className="h-5 w-48 bg-white/10 rounded-lg" />
          <div className="h-4 w-32 bg-white/5 rounded-lg" />
        </div>
        <div className="h-12 w-12 bg-white/10 rounded-full" />
      </div>
      <div className="flex gap-2 mb-4">
        <div className="h-6 w-16 bg-white/5 rounded-md" />
        <div className="h-6 w-16 bg-white/5 rounded-md" />
        <div className="h-6 w-16 bg-white/5 rounded-md" />
      </div>
      <div className="flex gap-3">
        <div className="h-9 w-24 bg-white/5 rounded-xl" />
        <div className="h-9 w-24 bg-white/5 rounded-xl" />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/15 text-purple-400">
              <Target size={22} />
            </div>
            My Matches
          </h1>
          <p className="text-sm text-slate-400 mt-1 ml-12">AI-discovered opportunities matched to your profile</p>
        </div>
        <Button variant="secondary" size="sm" onClick={loadMatches} disabled={loading} className="rounded-full">
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
        </Button>
      </div>

      {/* Toast */}
      {toast.text && (
        <div className={`p-4 rounded-xl flex items-center gap-3 border animate-fade-in ${
          toast.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
          toast.type === 'warning' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400' :
          'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
        }`}>
          {toast.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
          <p className="text-sm font-medium">{toast.text}</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-16 px-4 rounded-2xl bg-white/[0.02] border border-white/5">
          <AlertCircle size={40} className="text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">Something went wrong</h3>
          <p className="text-slate-400 text-sm mb-6">{error}</p>
          <Button variant="primary" size="sm" onClick={loadMatches}>
            <RefreshCw size={14} /> Try Again
          </Button>
        </div>
      )}

      {/* Loading State */}
      {loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && matches.length === 0 && (
        <div className="text-center py-20 px-4 rounded-2xl bg-white/[0.02] border border-white/5">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-purple-500/10 flex items-center justify-center">
            <BrainCircuit size={36} className="text-purple-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No matches yet</h3>
          <p className="text-slate-400 text-sm max-w-md mx-auto mb-6">
            Once recruiters run AI matching against your resume, your matches will appear here. Make sure your resume is uploaded and complete.
          </p>
          <Button variant="primary" onClick={() => navigate('/candidate/dashboard')}>
            Go to Dashboard
          </Button>
        </div>
      )}

      {/* Matches Grid */}
      {!loading && !error && matches.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {matches.map((match) => {
            const status = getStatusBadge(match.recruiterDecision);
            const StatusIcon = status.icon;
            return (
              <div
                key={match._id}
                className={`group p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-purple-500/5 ${
                  match.recruiterDecision === 'rejected'
                    ? 'bg-white/[0.01] border-white/5 opacity-60 hover:opacity-100'
                    : match.recruiterDecision === 'shortlisted'
                    ? 'bg-emerald-500/[0.03] border-emerald-500/15 hover:border-emerald-500/30'
                    : 'bg-white/[0.02] border-white/5 hover:border-purple-500/20'
                }`}
              >
                {/* Top row: Title + Score */}
                <div className="flex justify-between items-start mb-4">
                  <div className="min-w-0 flex-1 pr-4">
                    <h3 className="text-base font-bold text-white truncate group-hover:text-purple-300 transition-colors">
                      {match.jobTitle}
                    </h3>
                    <p className="text-sm text-slate-400 truncate mt-0.5">{match.companyName}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                      {match.location && (
                        <span className="flex items-center gap-1"><MapPin size={12} /> {match.location}</span>
                      )}
                      {match.salary && (
                        <span className="flex items-center gap-1"><IndianRupee size={12} /> {match.salary}</span>
                      )}
                    </div>
                  </div>

                  {/* Score Ring */}
                  <div className="relative w-14 h-14 shrink-0">
                    <svg width="56" height="56" viewBox="0 0 56 56" style={{ transform: 'rotate(-90deg)' }}>
                      <circle cx="28" cy="28" r="23" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                      <circle cx="28" cy="28" r="23" fill="none"
                        stroke={match.matchScore >= 80 ? '#34d399' : match.matchScore >= 60 ? '#fbbf24' : '#64748b'}
                        strokeWidth="3"
                        strokeDasharray={`${(match.matchScore / 100) * 144.5} 144.5`}
                        strokeLinecap="round"
                        style={{ transition: 'stroke-dasharray 0.8s ease-out' }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-bold text-white">{match.matchScore}%</span>
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex items-center gap-2 mb-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${status.bg} ${status.border} ${status.text}`}>
                    <StatusIcon size={12} /> {status.label}
                  </span>
                  {match.hasApplied && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
                      <Send size={11} /> Applied
                    </span>
                  )}
                </div>

                {/* Skills */}
                {match.skillsMatched.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {match.skillsMatched.slice(0, 5).map((skill, i) => (
                      <span key={i} className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-[11px] text-slate-300 font-medium">
                        {skill}
                      </span>
                    ))}
                    {match.skillsMatched.length > 5 && (
                      <span className="px-2 py-1 rounded-md bg-white/5 text-[11px] text-slate-500">
                        +{match.skillsMatched.length - 5}
                      </span>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t border-white/5">
                  {!match.hasApplied ? (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleApply(match.jobId, match.jobTitle)}
                      disabled={applyingTo === match.jobId}
                      className="flex-1 rounded-xl"
                    >
                      <Send size={14} /> {applyingTo === match.jobId ? 'Applying...' : 'Apply Now'}
                    </Button>
                  ) : (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => navigate('/candidate/applications')}
                      className="flex-1 rounded-xl"
                    >
                      <Eye size={14} /> View Application
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyMatches;
