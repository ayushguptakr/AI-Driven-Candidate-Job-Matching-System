import React from 'react';
import { useScrollAnimation, useCountUp } from '../../hooks/useScrollAnimation';
import { FileText, Target, Users, Building2 } from 'lucide-react';

const TrustSection = () => {
  const [ref, isVisible] = useScrollAnimation();

  const stats = [
    { value: 50000, suffix: '+', label: 'Resumes Analyzed', icon: <FileText className="text-purple-400 drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]" size={26} /> },
    { value: 96, suffix: '%', label: 'Matching Accuracy', icon: <Target className="text-purple-400 drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]" size={26} /> },
    { value: 2000, suffix: '+', label: 'Recruiters Onboarded', icon: <Users className="text-purple-400 drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]" size={26} /> },
    { value: 500, suffix: '+', label: 'Companies Trust Us', icon: <Building2 className="text-purple-400 drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]" size={26} /> },
  ];

  const logos = [
    'Accenture', 'Deloitte', 'TCS', 'Infosys', 'Wipro', 'HCL'
  ];

  return (
    <section className="relative py-20 lg:py-24" style={{ background: '#030014' }}>
      <div ref={ref} className="w-full max-w-7xl mx-auto px-6 sm:px-8">
        {/* Stats */}
        <div className={`grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {stats.map((stat, i) => (
            <StatCard key={i} stat={stat} isVisible={isVisible} delay={i * 150} />
          ))}
        </div>

        {/* Company logos */}
        <div className={`text-center transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <p className="text-slate-500 text-sm font-medium uppercase tracking-widest mb-8">
            Trusted by leading organizations
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-12">
            {logos.map((name, i) => (
              <div
                key={i}
                className="group flex items-center gap-2 text-slate-600 hover:text-slate-300 transition-all duration-300 cursor-default"
              >
                <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center group-hover:border-purple-500/30 group-hover:bg-purple-500/10 transition-all duration-300">
                  <span className="text-xs font-bold">{name.charAt(0)}</span>
                </div>
                <span className="text-sm font-semibold tracking-wide">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const StatCard = ({ stat, isVisible, delay }) => {
  const count = useCountUp(stat.value, 2200, isVisible);

  return (
    <div
      className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-purple-500/30 transition-all duration-300 group flex flex-col items-center"
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="mb-3">{stat.icon}</div>
      <div className="text-3xl sm:text-4xl font-extrabold text-white mb-1 tracking-tight">
        {count.toLocaleString()}{stat.suffix}
      </div>
      <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
    </div>
  );
};

export default TrustSection;
