import React from 'react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { Building2, User, Rocket } from 'lucide-react';

const useCases = [
  {
    icon: <Building2 className="text-purple-400 drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]" size={26} />,
    title: 'For Recruiters',
    description: 'Stop drowning in resumes. Post jobs and let AI rank candidates automatically so you focus only on the best fits.',
    benefits: [
      'Post jobs and receive AI-ranked applicants',
      'View match scores with skill breakdowns',
      'Manage pipeline: review → shortlist → hire',
      'Save 70% of screening time',
    ],
    gradient: 'from-purple-600 to-violet-600',
  },
  {
    icon: <User className="text-purple-400 drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]" size={26} />,
    title: 'For Candidates',
    description: 'Upload your resume once and discover the jobs that truly match your skills. No more guessing or spray-and-pray applications.',
    benefits: [
      'Upload resume in PDF, DOC, or TXT',
      'See AI-calculated match scores per job',
      'Apply with one click',
      'Track all applications in real-time',
    ],
    gradient: 'from-violet-600 to-indigo-600',
  },
  {
    icon: <Rocket className="text-purple-400 drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]" size={26} />,
    title: 'For Startups',
    description: 'Scale your hiring without scaling your HR team. AI matching brings enterprise-level recruitment to teams of any size.',
    benefits: [
      'No HR expertise required',
      'Fair, bias-reduced screening',
      'Fast time-to-hire',
      'Affordable AI-powered recruitment',
    ],
    gradient: 'from-indigo-600 to-blue-600',
  },
];

const UseCases = () => {
  const [ref, isVisible] = useScrollAnimation();

  return (
    <section className="relative py-20 lg:py-24" style={{ background: '#030014' }}>
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-violet-600/8 rounded-full blur-[120px] pointer-events-none" />

      <div ref={ref} className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8">
        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/20 bg-purple-500/5 text-purple-400 text-sm font-medium mb-6">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            Use Cases
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4 tracking-tight">
            Built for <span className="gradient-text">every role</span> in hiring
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Whether you're a Fortune 500 recruiter or a first-time job seeker, TalentMatch AI adapts to your needs.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {useCases.map((uc, i) => (
            <div
              key={i}
              className={`group p-6 rounded-xl bg-white/5 border border-white/10 hover:border-purple-500/30 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/10 h-full flex flex-col ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${300 + i * 150}ms` }}
            >
              {/* Icon */}
              <div className="mb-4">{uc.icon}</div>

              <h3 className="text-xl font-bold text-white mb-3">{uc.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-1">{uc.description}</p>

              {/* Benefits */}
              <ul className="space-y-3">
                {uc.benefits.map((benefit, j) => (
                  <li key={j} className="flex items-start gap-3 text-sm text-slate-300">
                    <svg className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UseCases;
