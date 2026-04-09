import React from 'react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: 'AI-Powered Intelligence',
    description: 'AI deeply analyzes resume content against job requirements for intelligent, context-aware matching.',
    problem: 'Manual resume screening takes hours',
    solution: 'AI analyzes in seconds with 96% accuracy',
    gradient: 'from-purple-500 to-violet-500',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: 'Smart Match Scoring',
    description: 'Get precise 0-100% compatibility scores with detailed skill breakdowns and hiring recommendations.',
    problem: 'Guesswork in candidate evaluation',
    solution: 'Data-driven scores with clear reasoning',
    gradient: 'from-violet-500 to-indigo-500',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>
    ),
    title: 'Resume Parsing',
    description: 'Supports PDF, DOC, DOCX, and TXT formats. Content is automatically extracted and structured for analysis.',
    problem: 'Copy-pasting resume content one by one',
    solution: 'Drag, drop, done — AI reads everything',
    gradient: 'from-indigo-500 to-blue-500',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    title: 'Role-Based Access',
    description: 'Secure JWT authentication with separate portals for recruiters and candidates. Each sees only what they need.',
    problem: 'One-size-fits-all dashboards',
    solution: 'Tailored experience for each role',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: 'Real-Time Results',
    description: 'No batch processing or overnight waits. Get instant AI matching results the moment you click the button.',
    problem: 'Waiting days for recruitment analytics',
    solution: 'Results in under 30 seconds',
    gradient: 'from-cyan-500 to-teal-500',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
    title: 'Application Tracking',
    description: 'Full pipeline management — candidates track their applications, recruiters manage statuses from pending to hired.',
    problem: 'Lost emails and forgotten applications',
    solution: 'Complete visibility for both sides',
    gradient: 'from-teal-500 to-emerald-500',
  },
];

const FeaturesSection = () => {
  const [ref, isVisible] = useScrollAnimation();

  return (
    <section className="relative py-20 lg:py-24" style={{ background: '#030014' }}>
      <div ref={ref} className="w-full max-w-7xl mx-auto px-6 sm:px-8">
        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/20 bg-purple-500/5 text-purple-400 text-sm font-medium mb-6">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
            Features
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-5 tracking-tight">
            Everything you need to <span className="gradient-text">hire smarter</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            A complete toolkit that replaces manual screening with intelligent automation.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <div
              key={i}
              className={`group glass-card rounded-2xl p-6 h-full flex flex-col transition-all duration-500 hover:bg-white/[0.05] hover:border-purple-500/20 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/5 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${200 + i * 100}ms` }}
            >
              {/* Icon */}
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} p-[1px] mb-6`}>
                <div className="w-full h-full rounded-xl bg-[#0a0a1a] flex items-center justify-center text-white group-hover:bg-[#0d0d1f] transition-colors">
                  {feature.icon}
                </div>
              </div>

              <h3 className="text-lg font-bold text-white mb-3 group-hover:text-purple-200 transition-colors">{feature.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4 flex-1">{feature.description}</p>

              {/* Problem → Solution */}
              <div className="space-y-2.5 pt-4 border-t border-white/[0.05]">
                <div className="flex items-start gap-2.5">
                  <span className="mt-0.5 w-4 h-4 rounded-full bg-red-500/15 flex items-center justify-center shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                  </span>
                  <span className="text-xs text-slate-500">{feature.problem}</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="mt-0.5 w-4 h-4 rounded-full bg-green-500/15 flex items-center justify-center shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                  </span>
                  <span className="text-xs text-green-400/80">{feature.solution}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
