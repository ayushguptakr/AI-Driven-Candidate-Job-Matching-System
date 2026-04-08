import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import Button from '../ui/Button';

const CTASection = () => {
  const navigate = useNavigate();
  const [ref, isVisible] = useScrollAnimation();

  return (
    <section className="relative py-20 lg:py-24 overflow-hidden" style={{ background: '#030014' }}>
      <div ref={ref} className="w-full max-w-7xl mx-auto px-6 sm:px-8">
        <div className={`relative rounded-2xl overflow-hidden transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/90 via-violet-600/90 to-indigo-600/90" />
          
          {/* Decorative elements */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-20 -right-20 w-60 h-60 border border-white/10 rounded-full" />
            <div className="absolute -top-10 -right-10 w-40 h-40 border border-white/10 rounded-full" />
            <div className="absolute -bottom-16 -left-16 w-48 h-48 border border-white/10 rounded-full" />
            <div className="absolute top-1/2 left-1/4 w-4 h-4 bg-white/20 rounded-full animate-float" />
            <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-white/15 rounded-full animate-float-delayed" />
            <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-white/25 rounded-full animate-float-slow" />
            {/* Grid overlay */}
            <div className="absolute inset-0 opacity-[0.04]" style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
              backgroundSize: '40px 40px'
            }} />
          </div>

          {/* Content */}
          <div className="relative z-10 text-center py-16 lg:py-20 px-6 sm:px-8 max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-6 tracking-tight leading-tight">
              Ready to transform
              <br />
              your hiring process?
            </h2>
            <p className="text-white/80 text-lg sm:text-xl max-w-2xl mx-auto mb-12 sm:mb-14 leading-relaxed font-medium">
              Join 2,000+ recruiters already using AI to find the perfect candidates. 
              Get started for free — no credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center mt-2">
              <Button
                variant="light"
                size="lg"
                to="/register"
                className="group border-transparent"
              >
                <span className="flex items-center justify-center gap-2">
                  Start Free Today
                  <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </span>
              </Button>
              <Button
                variant="ghost"
                size="lg"
                to="/login"
                className="border-white/30 hover:border-white/50"
              >
                Login to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
