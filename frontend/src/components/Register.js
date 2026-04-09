import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Link from './ui/Link';
import AnimatedLogo from './landing/AnimatedLogo';
import Button from './ui/Button';

const Register = () => {
  const [formData, setFormData] = useState({ email: '', password: '', name: '', role: 'candidate', companyName: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = await register({
        email: formData.email, 
        password: formData.password, 
        name: formData.name, 
        role: formData.role,
        companyName: formData.role === 'recruiter' ? formData.companyName : undefined
      });
      localStorage.setItem('selectedRole', user.role);
      navigate(user.role === 'recruiter' ? '/recruiter/dashboard' : '/candidate/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Registration failed');
    }
    setLoading(false);
  };

  const update = (key, value) => setFormData({ ...formData, [key]: value });

  return (
    <div className="landing-page" style={{ minHeight: '100vh' }}>
      <div className="min-h-screen flex">
        {/* ── Left: Branding Panel ── */}
        <div className="landing-show-lg lg:w-[45%] xl:w-[48%] relative flex-col justify-center px-12 xl:px-20 overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-[30%] left-[20%] w-[400px] h-[400px] bg-indigo-600/20 rounded-full blur-[120px] animate-glow-pulse" />
            <div className="absolute bottom-[20%] right-[15%] w-[300px] h-[300px] bg-purple-600/15 rounded-full blur-[100px] animate-glow-pulse" style={{ animationDelay: '2.5s' }} />
            <div className="absolute inset-0" style={{
              backgroundImage: 'linear-gradient(rgba(139,92,246,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,.04) 1px, transparent 1px)',
              backgroundSize: '48px 48px'
            }} />
          </div>

          <div className="relative z-10">
            {/* Logo */}
            <Link to="/" variant="unstyled" className="block mb-12 transform hover:scale-[1.02] transition-transform">
              <AnimatedLogo size={80} withText={true} />
            </Link>

            {/* Headline */}
            <h1 className="text-4xl xl:text-5xl font-extrabold text-white leading-[1.12] tracking-tight mb-6">
              Start matching
              <br />
              <span className="gradient-text">talent today</span>
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed mb-12 max-w-md">
              Join thousands of recruiters and candidates using AI-powered matching to find the perfect fit — in minutes, not weeks.
            </p>

            {/* Feature list */}
            <div className="space-y-4">
              {[
                { icon: '⚡', text: 'AI-powered resume analysis in seconds' },
                { icon: '🎯', text: '96% matching accuracy with skill breakdown' },
                { icon: '🔒', text: 'Secure, bias-reduced screening process' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-base">
                    {item.icon}
                  </div>
                  <span className="text-slate-300 text-sm font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right: Register Form ── */}
        <div className="flex-1 flex items-center justify-center px-6 sm:px-8 py-12 relative">
          {/* Subtle gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#030014] via-[#0a0520] to-[#030014] pointer-events-none" />

          <div className={`relative z-10 w-full max-w-[420px] transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            {/* Mobile Logo */}
            <div className="landing-hide-lg flex items-center justify-center mb-10">
              <Link to="/" variant="unstyled" className="block">
                <AnimatedLogo size={70} withText={true} />
              </Link>
            </div>

            {/* Header */}
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 tracking-tight">
                Create your account
              </h2>
              <p className="text-slate-400 text-sm">
                Choose your role and start matching in under a minute.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div
                role="alert"
                className="flex items-start gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm mb-6"
              >
                <svg className="w-5 h-5 shrink-0 mt-0.5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label htmlFor="register-name" className="block text-sm font-medium text-slate-300 mb-2">
                  Full name
                </label>
                <input
                  type="text"
                  id="register-name"
                  value={formData.name}
                  onChange={(e) => update('name', e.target.value)}
                  required
                  placeholder="John Doe"
                  className="w-full px-4 py-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-slate-500 text-sm outline-none transition-all duration-200 focus:border-purple-500/50 focus:bg-white/[0.06] focus:ring-2 focus:ring-purple-500/20"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="register-email" className="block text-sm font-medium text-slate-300 mb-2">
                  Email address
                </label>
                <input
                  type="email"
                  id="register-email"
                  value={formData.email}
                  onChange={(e) => update('email', e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full px-4 py-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-slate-500 text-sm outline-none transition-all duration-200 focus:border-purple-500/50 focus:bg-white/[0.06] focus:ring-2 focus:ring-purple-500/20"
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="register-password" className="block text-sm font-medium text-slate-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="register-password"
                  value={formData.password}
                  onChange={(e) => update('password', e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-slate-500 text-sm outline-none transition-all duration-200 focus:border-purple-500/50 focus:bg-white/[0.06] focus:ring-2 focus:ring-purple-500/20"
                />
              </div>

              {/* Role Selector */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  I am a
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'candidate', label: 'Candidate', icon: '👤', desc: 'Find jobs' },
                    { value: 'recruiter', label: 'Recruiter', icon: '🏢', desc: 'Hire talent' },
                  ].map((role) => (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() => update('role', role.value)}
                      className={`relative p-4 rounded-xl border text-left transition-all duration-200 ${
                        formData.role === role.value
                          ? 'bg-purple-500/10 border-purple-500/30 text-white'
                          : 'bg-white/[0.02] border-white/[0.08] text-slate-400 hover:bg-white/[0.04] hover:border-white/[0.12]'
                      }`}
                    >
                      <div className="text-xl mb-2">{role.icon}</div>
                      <div className="text-sm font-semibold">{role.label}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{role.desc}</div>
                      {formData.role === role.value && (
                        <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Company Name (Recruiter Only) */}
              <div className={`transition-all duration-300 overflow-hidden ${formData.role === 'recruiter' ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0'}`}>
                <label htmlFor="company-name" className="block text-sm font-medium text-slate-300 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  id="company-name"
                  value={formData.companyName}
                  onChange={(e) => update('companyName', e.target.value)}
                  required={formData.role === 'recruiter'}
                  placeholder="Acme Corp"
                  className="w-full px-4 py-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-slate-500 text-sm outline-none transition-all duration-200 focus:border-purple-500/50 focus:bg-white/[0.06] focus:ring-2 focus:ring-purple-500/20"
                />
              </div>

              {/* Submit */}
              <Button type="submit" variant="primary" fullWidth disabled={loading}>
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Creating account…
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Create Account
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                )}
              </Button>
            </form>




            {/* Switch to Login */}
            <p className="text-center mt-8 text-sm text-slate-500">
              Already have an account?{' '}
              <Link to="/login" variant="cta">
                Sign in instead →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
