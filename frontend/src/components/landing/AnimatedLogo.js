import React from 'react';

const AnimatedLogo = ({ size = 48, className = '' }) => {
  return (
    <div 
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 100 100"
        width="100%"
        height="100%"
        className="ai-strict-svg transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-[1px] group-hover:drop-shadow-[0_0_12px_rgba(124,58,237,0.7)]"
      >
        <style>
          {`
            .ai-strict-svg {
              transition: all 0.5s ease-out;
              transform-origin: center;
              overflow: visible;
            }

            .group:hover .ai-strict-svg,
            .ai-strict-svg:hover {
              transform: scale(1.05);
            }
            
            .base-node {
              fill: #A78BFA;
              transition: all 0.5s ease;
              transform-origin: center;
              animation: sharpPulse 3s infinite alternate;
            }

            .center-node {
              fill: url(#centerGrad);
              transition: all 0.5s ease;
              transform-origin: center;
              filter: drop-shadow(0 0 3px rgba(124, 58, 237, 0.4));
            }

            /* Alternate pulse timing for left/right nodes */
            .node-l { animation-delay: 0s; transform-origin: 20px 50px; }
            .node-r { animation-delay: 1.5s; transform-origin: 80px 50px; }

            .track-line {
              stroke: url(#lineGrad);
              stroke-width: 1.5;
              opacity: 0.4;
              transition: all 0.5s ease;
            }

            /* Hover Executions */
            .group:hover .track-line,
            .ai-strict-svg:hover .track-line {
              opacity: 0.85;
              stroke-width: 2;
            }

            .group:hover .center-node,
            .ai-strict-svg:hover .center-node {
              transform: scale(1.2);
              filter: drop-shadow(0 0 8px rgba(167, 139, 250, 0.8));
            }

            .group:hover .base-node,
            .ai-strict-svg:hover .base-node {
              transform: scale(1.1);
              fill: #C4B5FD;
            }

            @keyframes sharpPulse {
              0% { transform: scale(0.95); opacity: 0.7; }
              100% { transform: scale(1.05); opacity: 1; }
            }
          `}
        </style>

        <defs>
          <linearGradient id="centerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C4B5FD" />
            <stop offset="50%" stopColor="#A78BFA" />
            <stop offset="100%" stopColor="#7C3AED" />
          </linearGradient>

          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366F1" />
            <stop offset="50%" stopColor="#A78BFA" />
            <stop offset="100%" stopColor="#6366F1" />
          </linearGradient>

          <path id="dataTrack" d="M20 50 L80 50" />
        </defs>

        {/* The Connection Track */}
        <line x1="20" y1="50" x2="80" y2="50" className="track-line" strokeLinecap="round" />

        {/* Center Node Outer Ring (Abstract processing bounds) */}
        <circle cx="50" cy="50" r="14" fill="none" stroke="#7C3AED" strokeWidth="0.8" opacity="0.3" strokeDasharray="3 4">
          <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="20s" repeatCount="indefinite" />
        </circle>
        <circle cx="50" cy="50" r="10" fill="none" stroke="#A78BFA" strokeWidth="0.5" opacity="0.15" />

        {/* Data Transmission Particle */}
        <circle r="2" fill="#FFFFFF" filter="drop-shadow(0 0 2px #fff)">
          <animateMotion dur="3.5s" repeatCount="indefinite" begin="0s">
            <mpath href="#dataTrack" />
          </animateMotion>
          <animate attributeName="opacity" values="0;1;1;1;0" keyTimes="0;0.2;0.5;0.8;1" dur="3.5s" repeatCount="indefinite" begin="0s" />
          {/* Subtle scaling of the packet as it hits the center AI */}
          <animate attributeName="r" values="1.5;3;1.5" keyTimes="0;0.5;1" dur="3.5s" repeatCount="indefinite" begin="0s" />
        </circle>

        {/* Extracted Entity Nodes */}
        {/* Candidate Node (Left) */}
        <circle cx="20" cy="50" r="5" className="base-node node-l" />
        
        {/* Job Node (Right) */}
        <circle cx="80" cy="50" r="5" className="base-node node-r" />

        {/* The AI Match Node (Center) */}
        <circle cx="50" cy="50" r="7" className="center-node" />
        <circle cx="50" cy="50" r="2.5" fill="#FFFFFF" opacity="0.8" />
        
      </svg>
    </div>
  );
};

export default AnimatedLogo;
