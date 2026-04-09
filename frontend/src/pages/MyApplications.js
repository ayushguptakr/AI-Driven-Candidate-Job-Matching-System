import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { applicationAPI } from '../services/api';
import {
  Send, BriefcaseBusiness, MapPin, IndianRupee, Clock,
  CheckCircle, XCircle, AlertCircle, RefreshCw, Eye, FileText,
  Calendar, ArrowUpRight
} from 'lucide-react';
import Button from '../components/ui/Button';

const MyApplications = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({ text: '', type: '' });

  const showToast = (text, type = 'success') => {
    setToast({ text, type });
    setTimeout(() => setToast({ text: '', type: '' }), 4000);
  };

  const loadApplications = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await applicationAPI.getMyApplications();
      setApplications(res.data);
    } catch (err) {
      console.error('Error loading applications:', err);
      setError('Failed to load your applications. Please try again.');
    }
    setLoading(false);
  };

  useEffect(() => { loadApplications(); }, []);

  const getStatusConfig = (status) => {
    switch (status) {
      case 'shortlisted':
        return { label: 'Shortlisted', bg: 'bg-emerald-500/15', border: 'border-emerald-500/30', text: 'text-emerald-400', icon: CheckCircle, dot: 'bg-emerald-400' };
      case 'rejected':
        return { label: 'Rejected', bg: 'bg-red-500/15', border: 'border-red-500/30', text: 'text-red-400', icon: XCircle, dot: 'bg-red-400' };
      case 'reviewed':
        return { label: 'Under Review', bg: 'bg-blue-500/15', border: 'border-blue-500/30', text: 'text-blue-400', icon: Eye, dot: 'bg-blue-400' };
      case 'interview':
        return { label: 'Interview', bg: 'bg-indigo-500/15', border: 'border-indigo-500/30', text: 'text-indigo-400', icon: ArrowUpRight, dot: 'bg-indigo-400' };
      default: // pending
        return { label: 'Applied', bg: 'bg-slate-500/15', border: 'border-slate-500/20', text: 'text-slate-400', icon: Clock, dot: 'bg-slate-400' };
    }
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getTimeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days}d ago`;
    if (days < 30) return `${Math.floor(days / 7)}w ago`;
    return `${Math.floor(days / 30)}mo ago`;
  };

  // Skeleton card
  const SkeletonCard = () => (
    <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 animate-pulse flex items-center gap-4">
      <div className="h-12 w-12 bg-white/10 rounded-xl shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-48 bg-white/10 rounded-lg" />
        <div className="h-3 w-32 bg-white/5 rounded-lg" />
      </div>
      <div className="h-7 w-20 bg-white/5 rounded-lg shrink-0" />
    </div>
  );

  // Stats counts
  const statCounts = {
    total: applications.length,
    shortlisted: applications.filter(a => a.status === 'shortlisted').length,
    pending: applications.filter(a => a.status === 'pending').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/15 text-indigo-400">
              <Send size={22} />
            </div>
            My Applications
          </h1>
          <p className="text-sm text-slate-400 mt-1 ml-12">Track the status of all your job applications</p>
        </div>
        <Button variant="secondary" size="sm" onClick={loadApplications} disabled={loading} className="rounded-full">
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
        </Button>
      </div>

      {/* Quick Stats */}
      {!loading && !error && applications.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Total', value: statCounts.total, color: 'text-white', bg: 'bg-white/5' },
            { label: 'Shortlisted', value: statCounts.shortlisted, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
            { label: 'Pending', value: statCounts.pending, color: 'text-slate-300', bg: 'bg-slate-500/10' },
            { label: 'Rejected', value: statCounts.rejected, color: 'text-red-400', bg: 'bg-red-500/10' },
          ].map((s, i) => (
            <div key={i} className={`p-4 rounded-xl ${s.bg} border border-white/5`}>
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Toast */}
      {toast.text && (
        <div className={`p-4 rounded-xl flex items-center gap-3 border animate-fade-in ${
          toast.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
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
          <Button variant="primary" size="sm" onClick={loadApplications}>
            <RefreshCw size={14} /> Try Again
          </Button>
        </div>
      )}

      {/* Loading State */}
      {loading && !error && (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map(i => <SkeletonCard key={i} />)}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && applications.length === 0 && (
        <div className="text-center py-20 px-4 rounded-2xl bg-white/[0.02] border border-white/5">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
            <FileText size={36} className="text-indigo-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No applications yet</h3>
          <p className="text-slate-400 text-sm max-w-md mx-auto mb-6">
            You haven't applied to any jobs yet. Browse job listings or check your AI matches to find opportunities.
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="secondary" onClick={() => navigate('/candidate/matches')}>
              View Matches
            </Button>
            <Button variant="primary" onClick={() => navigate('/candidate/dashboard')}>
              Browse Jobs
            </Button>
          </div>
        </div>
      )}

      {/* Applications List */}
      {!loading && !error && applications.length > 0 && (
        <div className="space-y-3">
          {applications.map((app) => {
            const job = app.jobId || {};
            const status = getStatusConfig(app.status);
            const StatusIcon = status.icon;

            return (
              <div
                key={app._id}
                className={`group p-5 rounded-2xl border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg ${
                  app.status === 'rejected'
                    ? 'bg-white/[0.01] border-white/5 opacity-60 hover:opacity-100'
                    : app.status === 'shortlisted'
                    ? 'bg-emerald-500/[0.02] border-emerald-500/10 hover:border-emerald-500/25'
                    : 'bg-white/[0.02] border-white/5 hover:border-white/10'
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${status.bg} ${status.text}`}>
                    <BriefcaseBusiness size={20} />
                  </div>

                  {/* Job Info */}
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-bold text-white truncate group-hover:text-purple-300 transition-colors">
                      {job.title || 'Unknown Job'}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-slate-500">
                      {job.company && <span className="font-medium text-slate-400">{job.company?.name || job.company}</span>}
                      {job.location && (
                        <span className="flex items-center gap-1"><MapPin size={11} /> {job.location}</span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar size={11} /> {formatDate(app.appliedAt)}
                      </span>
                      <span className="text-slate-600">({getTimeAgo(app.appliedAt)})</span>
                    </div>
                  </div>

                  {/* Status + Source badges */}
                  <div className="flex items-center gap-2 shrink-0">
                    {app.source === 'ai_match' && (
                      <span className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold bg-purple-500/10 border border-purple-500/20 text-purple-400 uppercase tracking-wider">
                        AI Match
                      </span>
                    )}
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border ${status.bg} ${status.border} ${status.text}`}>
                      <StatusIcon size={13} /> {status.label}
                    </span>
                  </div>
                </div>

                {/* Timeline progress bar */}
                <div className="mt-4 pt-3 border-t border-white/5">
                  <div className="flex items-center gap-1">
                    {['Applied', 'Reviewed', 'Shortlisted'].map((step, i) => {
                      const stepMap = { 'Applied': ['pending', 'reviewed', 'shortlisted', 'rejected'], 'Reviewed': ['reviewed', 'shortlisted'], 'Shortlisted': ['shortlisted'] };
                      const isActive = stepMap[step].includes(app.status);
                      const isRejectedStep = app.status === 'rejected' && step === 'Reviewed';

                      return (
                        <React.Fragment key={step}>
                          <div className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider ${isActive ? 'text-purple-400' : 'text-slate-600'}`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-purple-400 shadow-[0_0_6px_rgba(168,85,247,0.6)]' : isRejectedStep ? 'bg-red-400' : 'bg-slate-700'}`} />
                            {step}
                          </div>
                          {i < 2 && (
                            <div className={`flex-1 h-px ${isActive ? 'bg-purple-500/30' : 'bg-white/5'}`} />
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyApplications;
