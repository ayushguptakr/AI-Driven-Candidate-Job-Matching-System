import React, { useState } from 'react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { Building2, User } from 'lucide-react';

const recruiterData = {
  jobs: [
    { title: 'Senior React Developer', applicants: 24, topMatch: 96 },
    { title: 'Data Scientist', applicants: 18, topMatch: 89 },
    { title: 'DevOps Engineer', applicants: 12, topMatch: 78 },
  ],
  candidates: [
    { name: 'Sarah Chen', score: 96, skills: ['React', 'TypeScript', 'Node.js'], status: 'Shortlisted' },
    { name: 'Marcus Johnson', score: 89, skills: ['Python', 'ML', 'SQL'], status: 'Reviewed' },
    { name: 'Elena Kowalski', score: 78, skills: ['React', 'CSS', 'GraphQL'], status: 'New' },
  ]
};

const candidateData = {
  profile: { name: 'John Smith', role: 'Full Stack Developer', matchCount: 8 },
  matches: [
    { company: 'Tech Innovations', role: 'Senior Developer', score: 94, salary: '₹12L - ₹18L' },
    { company: 'Analytics Pro', role: 'Full Stack Engineer', score: 87, salary: '₹10L - ₹15L' },
    { company: 'Design Studio', role: 'React Developer', score: 72, salary: '₹8L - ₹14L' },
  ]
};

const ProductShowcase = () => {
  const [activeTab, setActiveTab] = useState('recruiter');
  const [ref, isVisible] = useScrollAnimation();

  return (
    <section className="relative py-20 lg:py-24 overflow-hidden" style={{ background: '#030014' }}>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none" />

      <div ref={ref} className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8">
        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/20 bg-purple-500/5 text-purple-400 text-sm font-medium mb-6">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" /></svg>
            Product Preview
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-5 tracking-tight">
            Powerful <span className="gradient-text">dashboards</span> for everyone
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Whether you're hiring or job hunting — the AI does the heavy lifting.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className={`flex justify-center mb-12 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex p-1.5 rounded-2xl bg-white/[0.04] border border-white/[0.08]">
            {['recruiter', 'candidate'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  activeTab === tab
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/25'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  {tab === 'recruiter' ? <Building2 size={18} /> : <User size={18} />}
                  <span>{tab === 'recruiter' ? 'Recruiter View' : 'Candidate View'}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Dashboard Preview */}
        <div className={`transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="glass-card-strong rounded-2xl p-6 lg:p-8 max-w-4xl mx-auto">
            {activeTab === 'recruiter' ? <RecruiterView /> : <CandidateView />}
          </div>
        </div>
      </div>
    </section>
  );
};

const RecruiterView = () => (
  <div className="space-y-8">
    {/* Top bar */}
    <div className="flex items-center justify-between flex-wrap gap-4">
      <div>
        <h3 className="text-white font-bold text-xl">Recruiter Dashboard</h3>
        <p className="text-slate-500 text-sm">3 active job postings</p>
      </div>
      <button className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-purple-500/25">
        + Post New Job
      </button>
    </div>

    {/* Jobs list */}
    <div className="grid md:grid-cols-3 gap-4">
      {recruiterData.jobs.map((job, i) => (
        <div key={i} className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-purple-500/30 transition-all duration-300 group">
          <h4 className="text-white font-semibold text-sm mb-3 group-hover:text-purple-300 transition-colors">{job.title}</h4>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">{job.applicants} applicants</span>
            <span className="text-green-400 font-bold">Top: {job.topMatch}%</span>
          </div>
        </div>
      ))}
    </div>

    {/* Candidate matches table */}
    <div>
      <h4 className="text-white font-semibold mb-4">Top Candidates — Senior React Developer</h4>
      <div className="space-y-3">
        {recruiterData.candidates.map((c, i) => (
          <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-purple-500/20 transition-all">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
              {c.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium">{c.name}</p>
              <div className="flex gap-2 mt-1 flex-wrap">
                {c.skills.map((s, j) => (
                  <span key={j} className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-purple-500/10 text-purple-300 border border-purple-500/15">{s}</span>
                ))}
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className={`text-lg font-bold ${c.score >= 90 ? 'text-green-400' : c.score >= 80 ? 'text-yellow-400' : 'text-orange-400'}`}>{c.score}%</div>
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md ${
                c.status === 'Shortlisted' ? 'bg-green-500/15 text-green-400' :
                c.status === 'Reviewed' ? 'bg-yellow-500/15 text-yellow-400' :
                'bg-blue-500/15 text-blue-400'
              }`}>{c.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const CandidateView = () => (
  <div className="space-y-8">
    {/* Profile header */}
    <div className="flex items-center gap-5">
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
        J
      </div>
      <div>
        <h3 className="text-white font-bold text-xl">{candidateData.profile.name}</h3>
        <p className="text-slate-400 text-sm">{candidateData.profile.role} · {candidateData.profile.matchCount} new matches</p>
      </div>
    </div>

    {/* Job matches */}
    <div>
      <h4 className="text-white font-semibold mb-4">Your Top Job Matches</h4>
      <div className="space-y-4">
        {candidateData.matches.map((job, i) => (
          <div key={i} className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-purple-500/25 transition-all duration-300">
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
              <div>
                <h5 className="text-white font-semibold">{job.role}</h5>
                <p className="text-slate-500 text-sm">{job.company} · {job.salary}</p>
              </div>
              <div className={`text-2xl font-bold ${job.score >= 90 ? 'text-green-400' : job.score >= 80 ? 'text-yellow-400' : 'text-orange-400'}`}>
                {job.score}%
              </div>
            </div>
            <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-[1500ms] ease-out ${
                  job.score >= 90 ? 'bg-gradient-to-r from-green-500 to-emerald-400' :
                  job.score >= 80 ? 'bg-gradient-to-r from-yellow-500 to-amber-400' :
                  'bg-gradient-to-r from-orange-500 to-yellow-500'
                }`}
                style={{ width: `${job.score}%` }}
              />
            </div>
            <div className="mt-3 flex justify-end">
              <button className="px-4 py-1.5 text-sm font-medium text-purple-300 border border-purple-500/20 rounded-lg hover:bg-purple-500/10 transition-all">
                Apply Now →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default ProductShowcase;
