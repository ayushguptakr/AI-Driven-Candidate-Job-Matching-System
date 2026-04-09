import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { inviteAPI, authAPI } from '../services/api';
import { Sparkles, Building2, User, KeyRound, AlertTriangle, Loader2 } from 'lucide-react';
import Button from '../components/ui/Button';

const InviteSignup = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [inviteDetails, setInviteDetails] = useState(null);
  const [error, setError] = useState('');
  
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const fetchInviteDetails = async () => {
      try {
        const response = await inviteAPI.getDetails(token);
        setInviteDetails(response.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Invalid or expired invite link.');
      } finally {
        setLoading(false);
      }
    };

    fetchInviteDetails();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const response = await authAPI.signupWithInvite({
        token,
        name,
        password
      });

      // Save token and role to localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('selectedRole', response.data.user.role);
      
      // Force page reload so the auth context picks up the new token
      window.location.href = response.data.user.role === 'admin' ? '/admin/dashboard' : '/recruiter/dashboard';
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create account. Please try again.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030014] flex items-center justify-center">
        <Loader2 className="animate-spin text-purple-500" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-[#030014] flex font-sans overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-[20%] w-[600px] h-[600px] bg-purple-600/20 rounded-full mix-blend-screen filter blur-[120px] opacity-50 animate-pulse pointer-events-none" />
      <div className="absolute bottom-0 right-[20%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full mix-blend-screen filter blur-[100px] opacity-30 pointer-events-none" />

      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-8 z-10">
        <div className="w-full max-w-md mx-auto">
          
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center p-[2px]">
                <div className="w-full h-full bg-[#030014] rounded-lg flex items-center justify-center">
                  <Sparkles className="text-white" size={20} />
                </div>
              </div>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                TalentMatch AI
              </span>
            </div>

            {inviteDetails && !error ? (
              <>
                <h2 className="text-3xl font-bold text-white tracking-tight mb-3">
                  You've been invited!
                </h2>
                <p className="text-slate-400">
                  Join <span className="text-purple-400 font-semibold">{inviteDetails.company?.name || 'your company'}</span> as a {inviteDetails.role}.
                </p>
              </>
            ) : (
              <h2 className="text-3xl font-bold text-white tracking-tight">
                Invite Invalid
              </h2>
            )}
          </div>

          <div className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] p-8 rounded-3xl shadow-2xl">
            {error && !inviteDetails ? (
              <div className="text-center">
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="text-red-400" size={32} />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Unexpected Error</h3>
                <p className="text-slate-400 text-sm mb-6">{error}</p>
                <Button 
                  onClick={() => navigate('/')}
                  variant="secondary"
                  fullWidth
                >
                  Go to Homepage
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">
                    {error}
                  </div>
                )}

                {/* Email (Locked) */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Email Address <span className="text-slate-500 font-normal">(provided by admin)</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                    </div>
                    <input
                      type="email"
                      value={inviteDetails.email}
                      disabled
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05] text-slate-400 text-sm cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Company (Locked) */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Workspace
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Building2 className="h-5 w-5 text-slate-500" />
                    </div>
                    <input
                      type="text"
                      value={inviteDetails.company?.name || ''}
                      disabled
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05] text-slate-400 text-sm cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-slate-500" />
                    </div>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="John Doe"
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-slate-500 text-sm outline-none transition-all duration-200 focus:border-purple-500/50 focus:bg-white/[0.06] focus:ring-2 focus:ring-purple-500/20"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <KeyRound className="h-5 w-5 text-slate-500" />
                    </div>
                    <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      placeholder="••••••••"
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-slate-500 text-sm outline-none transition-all duration-200 focus:border-purple-500/50 focus:bg-white/[0.06] focus:ring-2 focus:ring-purple-500/20"
                    />
                  </div>
                </div>

                <Button type="submit" variant="primary" fullWidth disabled={submitting} className="mt-8">
                  {submitting ? (
                    <span className="flex items-center gap-2 justify-center">
                      <Loader2 size={18} className="animate-spin" />
                      Creating Account...
                    </span>
                  ) : (
                    'Accept Invite & Join'
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InviteSignup;
