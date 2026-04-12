import React from 'react';

const AnimatedLogo = ({ size = 48, className = '', withText = false }) => {
  // Unique ID prefix to avoid SVG gradient conflicts when multiple instances render
  const id = 'tm';

  const SvgIcon = (
    <div style={{ width: size, height: size }} className="shrink-0 relative">
      <svg
        viewBox="0 0 100 100"
        width="100%"
        height="100%"
        className="transition-all duration-500 group-hover:scale-105 group-hover:-translate-y-px"
        style={{ overflow: 'visible' }}
      >
        <defs>
          <linearGradient id={`${id}-grad`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A78BFA" />
            <stop offset="100%" stopColor="#7C3AED" />
          </linearGradient>
          <linearGradient id={`${id}-line`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#A78BFA" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.6" />
          </linearGradient>
          <filter id={`${id}-glow`}>
            <feGaussianBlur stdDeviation="2.5" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          {/* Data flow path */}
          <path id={`${id}-track`} d="M22 50 L78 50" />
        </defs>

        {/* Outer hexagonal boundary — ultra-faint, rotating slowly */}
        <polygon
          points="50,16 76,30 76,62 50,76 24,62 24,30"
          fill="none"
          stroke={`url(#${id}-grad)`}
          strokeWidth="1.2"
          opacity="0.5"
          strokeLinejoin="round"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 50 46"
            to="360 50 46"
            dur="12s"
            repeatCount="indefinite"
          />
        </polygon>

        {/* Connection track */}
        <line
          x1="22" y1="50" x2="78" y2="50"
          stroke={`url(#${id}-line)`}
          strokeWidth="1"
          opacity="0.35"
          strokeLinecap="round"
          className="transition-opacity duration-500 group-hover:opacity-70"
        />

        {/* Data particle */}
        <circle r="1.5" fill="#fff" opacity="0">
          <animateMotion dur="3.5s" repeatCount="indefinite">
            <mpath href={`#${id}-track`} />
          </animateMotion>
          <animate attributeName="opacity" values="0;0.9;0.9;0" keyTimes="0;0.15;0.85;1" dur="3.5s" repeatCount="indefinite" />
          <animate attributeName="r" values="1;2;1" dur="3.5s" repeatCount="indefinite" />
        </circle>

        {/* Left node */}
        <circle cx="22" cy="50" r="4.5" fill={`url(#${id}-grad)`} opacity="0.7" className="transition-all duration-500 group-hover:opacity-100">
          <animate attributeName="r" values="4.5;5;4.5" dur="4s" repeatCount="indefinite" />
        </circle>

        {/* Right node */}
        <circle cx="78" cy="50" r="4.5" fill={`url(#${id}-grad)`} opacity="0.7" className="transition-all duration-500 group-hover:opacity-100">
          <animate attributeName="r" values="4.5;5;4.5" dur="4s" begin="2s" repeatCount="indefinite" />
        </circle>

        {/* Center core — glow layer */}
        <circle cx="50" cy="50" r="10" fill="#7C3AED" opacity="0.08" filter={`url(#${id}-glow)`}>
          <animate attributeName="r" values="9;12;9" dur="5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.06;0.12;0.06" dur="5s" repeatCount="indefinite" />
        </circle>

        {/* Center core — solid */}
        <circle cx="50" cy="50" r="7" fill={`url(#${id}-grad)`} filter={`url(#${id}-glow)`} className="transition-all duration-500 group-hover:drop-shadow-[0_0_8px_rgba(167,139,250,0.6)]">
          <animate attributeName="r" values="7;7.5;7" dur="4s" repeatCount="indefinite" />
        </circle>

        {/* Center highlight dot */}
        <circle cx="50" cy="50" r="2.5" fill="#fff" opacity="0.85" />
      </svg>
    </div>
  );

  if (withText) {
    return (
      <div className={`flex flex-col items-center justify-center ${className}`}>
        {SvgIcon}
        <h2
          className="text-white font-bold tracking-widest text-center mt-2 text-2xl sm:text-3xl relative z-10"
          style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
        >
          TALENTMATCH{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-br from-[#A78BFA] to-[#67E8F9]">
            AI
          </span>
        </h2>
        <p
          className="text-[#67E8F9] font-bold mt-1 text-center text-[10px] sm:text-xs tracking-[0.2em] opacity-80"
          style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
        >
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
