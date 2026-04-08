import React from 'react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const testimonials = [
  {
    quote: "TalentMatch AI cut our screening time by 80%. We went from spending 3 days reviewing resumes to finding top candidates in under an hour. The AI matching scores are remarkably accurate.",
    name: 'Priya Sharma',
    role: 'Head of Talent Acquisition',
    company: 'TechScale India',
    initials: 'PS',
    gradient: 'from-purple-500 to-violet-500',
    rating: 5,
  },
  {
    quote: "As a job seeker, I uploaded my resume and instantly saw which positions matched my skills best. I applied to my top match and got the interview within a week. Game-changing platform.",
    name: 'Rahul Mehta',
    role: 'Software Engineer',
    company: 'Hired via TalentMatch',
    initials: 'RM',
    gradient: 'from-violet-500 to-indigo-500',
    rating: 5,
  },
  {
    quote: "We're a 15-person startup without a dedicated HR team. TalentMatch AI basically became our AI recruiter. The match scoring helped us make confident hiring decisions fast.",
    name: 'Ananya Reddy',
    role: 'Co-Founder & CEO',
    company: 'NexaLabs',
    initials: 'AR',
    gradient: 'from-indigo-500 to-blue-500',
    rating: 5,
  },
];

const Testimonials = () => {
  const [ref, isVisible] = useScrollAnimation();

  return (
    <section className="relative py-20 lg:py-24" style={{ background: '#030014' }}>
      <div className="absolute top-1/2 right-0 w-[400px] h-[500px] bg-purple-600/8 rounded-full blur-[120px] pointer-events-none" />

      <div ref={ref} className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8">
        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/20 bg-purple-500/5 text-purple-400 text-sm font-medium mb-6">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
            Testimonials
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4 tracking-tight">
            Loved by <span className="gradient-text">recruiters & candidates</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Don't just take our word for it. Here's what real users have to say.
          </p>
        </div>

        {/* Testimonial Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className={`group glass-card rounded-2xl p-6 h-full flex flex-col transition-all duration-500 hover:bg-white/[0.04] hover:border-purple-500/20 hover:-translate-y-1 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${300 + i * 150}ms` }}
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array(t.rating).fill(0).map((_, j) => (
                  <svg key={j} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Quote */}
              <p className="text-slate-300 text-sm leading-relaxed mb-6 flex-1 italic">"{t.quote}"</p>

              {/* Author */}
              <div className="flex items-center gap-4 pt-4 border-t border-white/[0.05]">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${t.gradient} flex items-center justify-center text-white text-sm font-bold shrink-0`}>
                  {t.initials}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{t.name}</p>
                  <p className="text-slate-500 text-xs">{t.role} at {t.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
