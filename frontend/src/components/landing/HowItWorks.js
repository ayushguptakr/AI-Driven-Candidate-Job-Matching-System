import React from 'react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const steps = [
  {
    step: '01',
    title: 'Upload Resumes',
    description: 'Candidates upload their resumes in PDF, DOC, or TXT format. Our system extracts and parses the content automatically.',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>
    ),
    gradient: 'from-purple-500 to-violet-500',
  },
  {
    step: '02',
    title: 'AI Analyzes',
    description: 'AI reads each resume and job description, evaluating skills, experience, education, and overall fit with deep understanding.',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    gradient: 'from-violet-500 to-indigo-500',
  },
  {
    step: '03',
    title: 'Get Matches',
    description: 'Receive instant compatibility scores from 0-100% with detailed skill breakdowns and AI reasoning for each candidate-job pair.',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
    gradient: 'from-indigo-500 to-blue-500',
  },
];

const HowItWorks = () => {
  const [ref, isVisible] = useScrollAnimation();

  return (
    <section className="relative py-20 lg:py-24 overflow-hidden" style={{ background: '#030014' }}>
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/8 rounded-full blur-[120px] pointer-events-none" />

      <div ref={ref} className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8">
        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/20 bg-purple-500/5 text-purple-400 text-sm font-medium mb-6">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            Simple 3-Step Process
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-5 tracking-tight">
            How it <span className="gradient-text">works</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            From resume upload to AI-powered matches in under a minute. No complex setup required.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connecting line (desktop) */}
          <div className="hidden md:block absolute top-[72px] left-[16.66%] right-[16.66%] h-[2px]">
            <div className={`h-full bg-gradient-to-r from-purple-500/40 via-violet-500/40 to-indigo-500/40 transition-all duration-1000 ${isVisible ? 'w-full' : 'w-0'}`} style={{ transitionDelay: '600ms' }} />
          </div>

          {steps.map((step, i) => (
            <div
              key={i}
              className={`relative text-center transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: `${300 + i * 200}ms` }}
            >
              {/* Icon circle */}
              <div className="relative inline-flex mb-8">
                <div className={`w-[88px] h-[88px] rounded-2xl bg-gradient-to-br ${step.gradient} p-[1px]`}>
                  <div className="w-full h-full rounded-2xl bg-[#0a0a1a] flex items-center justify-center text-white">
                    {step.icon}
                  </div>
                </div>
                {/* Step number */}
                <div className={`absolute -top-2 -right-2 w-7 h-7 rounded-lg bg-gradient-to-br ${step.gradient} flex items-center justify-center text-white text-xs font-bold shadow-lg`}>
                  {step.step}
                </div>
              </div>

              <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed max-w-xs mx-auto">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
