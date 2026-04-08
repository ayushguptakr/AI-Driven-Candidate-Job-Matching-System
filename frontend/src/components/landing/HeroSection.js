import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';

const HeroSection = () => {
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden" style={{ background: '#030014' }}>
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[15%] left-[10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] animate-glow-pulse" />
        <div className="absolute bottom-[20%] right-[5%] w-[400px] h-[400px] bg-indigo-600/15 rounded-full blur-[100px] animate-glow-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[60%] left-[50%] w-[300px] h-[300px] bg-violet-500/10 rounded-full blur-[80px] animate-glow-pulse" style={{ animationDelay: '4s' }} />
        {/* Grid */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(139,92,246,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,.04) 1px, transparent 1px)',
          backgroundSize: '64px 64px'
        }} />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 py-20 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Content */}
          <div className={`text-center lg:text-left transition-all duration-1000 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-purple-500/25 bg-purple-500/8 mb-8">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-purple-400"></span>
              </span>
              <span className="text-purple-300 text-sm font-medium tracking-wide">AI-Powered Recruitment Platform</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-[1.08] tracking-tight mb-6">
              <span className="text-white">Find </span>
              <span className="gradient-text">high-quality</span>
              <br />
              <span className="text-white">candidates with </span>
              <br className="hidden sm:block" />
              <span className="gradient-text">AI-powered matching</span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-400 max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed">
              Upload resumes, let our AI analyze skills and experience, and get instant compatibility scores. Match the right talent to the right role — faster than ever.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                variant="primary"
                size="lg"
                to="/register"
                className="group"
              >
                <span className="flex items-center justify-center gap-2">
                  Get Started Free
                  <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </span>
              </Button>

              <Button
                variant="ghost"
                size="lg"
                to="/login"
                className="border-white/15 bg-white/[0.03] backdrop-blur-sm"
              >
                Login →
              </Button>
            </div>

            {/* Mini social proof */}
            <div className="mt-10 flex items-center gap-4 justify-center lg:justify-start">
              <div className="flex -space-x-3">
                {['#a855f7','#818cf8','#6366f1','#c084fc'].map((c, i) => (
                  <div key={i} className="w-9 h-9 rounded-full border-2 border-[#030014] flex items-center justify-center text-xs font-bold text-white" style={{ background: c, zIndex: 4 - i }}>
                    {['AK','SR','PJ','ML'][i]}
                  </div>
                ))}
              </div>
              <div className="text-sm text-slate-400">
                <span className="text-white font-semibold">2,000+</span> recruiters trust TalentMatch
              </div>
            </div>
          </div>

          {/* Right: Dashboard Preview */}
          <div className={`hidden lg:block transition-all duration-1000 delay-300 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="relative animate-float max-w-lg ml-auto">
              {/* Dashboard Card */}
              <div className="glass-card-strong rounded-2xl p-6 xl:p-8 shadow-2xl shadow-purple-500/10">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-white font-bold text-lg">Match Dashboard</h3>
                    <p className="text-slate-500 text-sm">3 candidates analyzed</p>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20">
                    <span className="w-2 h-2 rounded-full bg-green-400"></span>
                    <span className="text-green-400 text-xs font-medium">Live</span>
                  </div>
                </div>

                {/* Match Bars */}
                {[
                  { name: 'Sarah Chen', role: 'Full Stack Dev', score: 94, color: 'from-purple-500 to-indigo-500' },
                  { name: 'Marcus J.', role: 'Backend Engineer', score: 87, color: 'from-violet-500 to-purple-500' },
                  { name: 'Elena K.', role: 'React Developer', score: 72, color: 'from-indigo-500 to-blue-500' },
                ].map((candidate, i) => (
                  <div key={i} className="mb-4 last:mb-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${candidate.color} flex items-center justify-center text-white text-xs font-bold`}>
                          {candidate.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">{candidate.name}</p>
                          <p className="text-slate-500 text-xs">{candidate.role}</p>
                        </div>
                      </div>
                      <span className={`text-sm font-bold ${candidate.score >= 90 ? 'text-green-400' : candidate.score >= 75 ? 'text-yellow-400' : 'text-orange-400'}`}>
                        {candidate.score}%
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${candidate.color} transition-all duration-[2000ms] ease-out`}
                        style={{ width: loaded ? `${candidate.score}%` : '0%', transitionDelay: `${800 + i * 400}ms` }}
                      />
                    </div>
                  </div>
                ))}

                {/* Skills Tags */}
                <div className="mt-6 pt-4 border-t border-white/[0.06]">
                  <p className="text-slate-500 text-xs mb-3 font-medium uppercase tracking-wider">Top Matching Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {['React', 'Node.js', 'Python', 'MongoDB', 'TypeScript', 'AWS'].map((skill, i) => (
                      <span key={i} className="px-3 py-1 rounded-lg text-xs font-medium bg-purple-500/10 text-purple-300 border border-purple-500/15">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating notification card — constrained inside container */}
              <div className="absolute -bottom-4 left-4 glass-card rounded-2xl p-4 shadow-xl animate-float-delayed" style={{ animationDelay: '1s' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">New Match!</p>
                    <p className="text-slate-400 text-xs">94% compatibility</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#030014] to-transparent pointer-events-none" />
    </section>
  );
};

export default HeroSection;
