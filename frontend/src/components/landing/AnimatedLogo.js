import React from 'react';

const AnimatedLogo = ({ size = 48, className = '', withText = false }) => {
  const SvgIcon = (
    <div style={{ width: size, height: size }} className="shrink-0 z-10 relative">
      <svg
        viewBox="0 -5 100 100"
        width="100%"
        height="100%"
        className="transition-transform duration-700 hover:scale-[1.03] overflow-visible"
      >
        <style>
          {`
            .ai-glow-pulse {
              animation: pulseGlow 5s ease-in-out infinite alternate;
            }
            .ai-node-pulse {
              animation: nodePulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite alternate;
            }
            @keyframes pulseGlow {
              0% { opacity: 0.4; filter: drop-shadow(0 0 2px rgba(127, 250, 240, 0.15)); }
              100% { opacity: 0.65; filter: drop-shadow(0 0 6px rgba(127, 250, 240, 0.3)); }
            }
            @keyframes nodePulse {
              0% { transform: scale(0.9); fill: #5ea7e8; }
              100% { transform: scale(1.1); fill: #9df5eb; filter: drop-shadow(0 0 3px #9df5eb); }
            }
          `}
        </style>

        <defs>
          <linearGradient id="cloudOuterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4f52e2" />
            <stop offset="100%" stopColor="#6365f1" />
          </linearGradient>

          <radialGradient id="cloudInnerGrad" cx="50%" cy="60%" r="55%">
            <stop offset="0%" stopColor="#7ee0d8" />
            <stop offset="35%" stopColor="#4d89c9" />
            <stop offset="100%" stopColor="#1e2963" />
          </radialGradient>

          {/* Symmetrical 5-lobe brain mask base */}
          <path id="brainLobeTemplate" d="
            M 18 75 
            A 16 16 0 0 1 12 48 
            A 18 18 0 0 1 35 28 
            A 20 20 0 0 1 65 28 
            A 18 18 0 0 1 88 48 
            A 16 16 0 0 1 82 75 
            Z
          " />
        </defs>

        {/* 1. Outer Brain Rim (Reduced Stroke) */}
        <use href="#brainLobeTemplate" fill="url(#cloudOuterGrad)" stroke="url(#cloudOuterGrad)" strokeWidth="4.5" strokeLinejoin="round" />

        {/* 2. Inner Glowing Core scaled to reveal dark gap (Subdued Glowing Accent) */}
        <g transform="scale(0.85)" transform-origin="50 52">
          <use href="#brainLobeTemplate" fill="url(#cloudInnerGrad)" stroke="#030014" strokeWidth="6" strokeLinejoin="round" className="ai-glow-pulse" />
        </g>

        {/* 3. Brain Connections - Organic & Asymmetrical */}
        <g>
          {/* Center Neural Track (Slightly bowed) */}
          <path d="M 51 28 Q 48 48 51 68" stroke="#030014" strokeWidth="3.2" strokeLinecap="round" />
          <circle cx="51" cy="28" r="2.8" stroke="#030014" strokeWidth="2.5" className="ai-node-pulse transform-origin-center" style={{ transformOrigin: '51px 28px' }} />
          <circle cx="51" cy="68" r="2.8" stroke="#030014" strokeWidth="2.5" className="ai-node-pulse transform-origin-center" style={{ transformOrigin: '51px 68px' }} />
          
          {/* Left Neural Curve (Asymmetrical) */}
          <path d="M 38 34 C 48 42, 45 56, 36 62" stroke="#030014" strokeWidth="3.2" fill="none" strokeLinecap="round" />
          <circle cx="38" cy="34" r="2.8" stroke="#030014" strokeWidth="2.5" className="ai-node-pulse transform-origin-center" style={{ transformOrigin: '38px 34px', animationDelay: '0.3s' }} />
          <circle cx="36" cy="62" r="2.8" stroke="#030014" strokeWidth="2.5" className="ai-node-pulse transform-origin-center" style={{ transformOrigin: '36px 62px', animationDelay: '0.8s' }} />
          
          {/* Right Neural Curve (Asymmetrical variant) */}
          <path d="M 64 32 C 54 44, 57 54, 65 60" stroke="#030014" strokeWidth="3.2" fill="none" strokeLinecap="round" />
          <circle cx="64" cy="32" r="2.8" stroke="#030014" strokeWidth="2.5" className="ai-node-pulse transform-origin-center" style={{ transformOrigin: '64px 32px', animationDelay: '0.5s' }} />
          <circle cx="65" cy="60" r="2.8" stroke="#030014" strokeWidth="2.5" className="ai-node-pulse transform-origin-center" style={{ transformOrigin: '65px 60px', animationDelay: '1s' }} />
          
          {/* Far Left Sensory Branch */}
          <path d="M 22 45 Q 18 64 26 66" stroke="#030014" strokeWidth="3.2" fill="none" strokeLinecap="round" />
          <circle cx="26" cy="66" r="2.8" stroke="#030014" strokeWidth="2.5" className="ai-node-pulse transform-origin-center" style={{ transformOrigin: '26px 66px', animationDelay: '1.2s' }} />

          {/* Far Right Sensory Branch */}
          <path d="M 76 48 C 76 56, 80 62, 72 64" stroke="#030014" strokeWidth="3.2" fill="none" strokeLinecap="round" />
          <circle cx="72" cy="64" r="2.8" stroke="#030014" strokeWidth="2.5" className="ai-node-pulse transform-origin-center" style={{ transformOrigin: '72px 64px', animationDelay: '1.4s' }} />
        </g>
      </svg>
    </div>
  );

  if (withText) {
    return (
      <div className={`flex flex-col items-center justify-center ${className}`}>
        {SvgIcon}
        <h2 className="text-white font-bold tracking-widest text-center mt-2 text-2xl sm:text-3xl relative z-10" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
          TALENTMATCH <span className="bg-clip-text text-transparent bg-gradient-to-br from-[#A78BFA] to-[#67E8F9]">AI</span>
        </h2>
        <p className="text-[#67E8F9] font-bold mt-1 text-center text-[10px] sm:text-xs tracking-[0.2em] opacity-80" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
          AI-POWERED RECRUITMENT
        </p>
      </div>
    );
  }

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {SvgIcon}
    </div>
  );
};

export default AnimatedLogo;
