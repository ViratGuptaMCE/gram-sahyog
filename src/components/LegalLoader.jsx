import React from 'react';

const LegalLoader = ({ message, subMessage, className = "" }) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center animate-fade-in ${className}`}>
      {/* Self-contained Animated SVG */}
      <div className="w-56 h-auto max-w-full mb-6">
        <svg viewBox="0 0 320 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="overflow-visible">
          <defs>
            {/* Soft classical shadow filter */}
            <filter id="legal-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#111827" flood-opacity="0.12" />
            </filter>
          </defs>

          {/* Ambient circular background plate */}
          <circle cx="160" cy="100" r="75" fill="#0B2545" fillOpacity="0.02" />

          {/* Base Architectural Ground Line */}
          <line x1="30" y1="160" x2="290" y2="160" stroke="#0B2545" strokeWidth="0.75" strokeDasharray="3 4" opacity="0.3" />

          {/* ==================== SCALES OF JUSTICE ==================== */}
          <g filter="url(#legal-shadow)">
            {/* Base Pedestal */}
            <path d="M50 155 H110 L105 160 H55 Z" fill="#0B2545" opacity="0.9" />
            <path d="M60 151 H100 L98 155 H62 Z" fill="#111827" opacity="0.8" />
            
            {/* Central Pillar Column */}
            <line x1="80" y1="151" x2="80" y2="65" stroke="#0B2545" strokeWidth="4" strokeLinecap="round" />
            <circle cx="80" cy="61" r="3.5" fill="#0B2545" />
            
            {/* Swaying Crossbar */}
            <g className="scale-beam" style={{ transformOrigin: '80px 68px' }}>
              <line x1="45" y1="68" x2="115" y2="68" stroke="#0B2545" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="80" cy="68" r="2" fill="#111827" />
              
              {/* Left Pan Group */}
              <g className="left-pan-hanger" style={{ transformOrigin: '45px 68px' }}>
                {/* Chains */}
                <line x1="45" y1="68" x2="33" y2="108" stroke="#0B2545" strokeWidth="0.75" opacity="0.75" />
                <line x1="45" y1="68" x2="57" y2="108" stroke="#0B2545" strokeWidth="0.75" opacity="0.75" />
                {/* Pan Hanger Bar */}
                <line x1="33" y1="108" x2="57" y2="108" stroke="#0B2545" strokeWidth="1" />
                {/* Bowl */}
                <path d="M31 108 C31 118, 59 118, 59 108 Z" fill="#111827" opacity="0.85" stroke="#0B2545" strokeWidth="0.5" />
              </g>
              
              {/* Right Pan Group */}
              <g className="right-pan-hanger" style={{ transformOrigin: '115px 68px' }}>
                {/* Chains */}
                <line x1="115" y1="68" x2="103" y2="108" stroke="#0B2545" strokeWidth="0.75" opacity="0.75" />
                <line x1="115" y1="68" x2="127" y2="108" stroke="#0B2545" strokeWidth="0.75" opacity="0.75" />
                {/* Pan Hanger Bar */}
                <line x1="103" y1="108" x2="127" y2="108" stroke="#0B2545" strokeWidth="1" />
                {/* Bowl */}
                <path d="M101 108 C101 118, 129 118, 129 108 Z" fill="#111827" opacity="0.85" stroke="#0B2545" strokeWidth="0.5" />
              </g>
            </g>
          </g>

          {/* ==================== GAVEL & SOUND BLOCK ==================== */}
          <g filter="url(#legal-shadow)">
            {/* Gavel Block */}
            <path d="M145 153 H195 L200 160 H140 Z" fill="#111827" stroke="#0B2545" strokeWidth="1" />
            
            {/* Ripple Wave (triggers on strike impact) */}
            <circle cx="170" cy="153" r="15" fill="none" stroke="#00B4D8" strokeWidth="1.5" className="impact-wave" style={{ transformOrigin: '170px 153px' }} />

            {/* Striking Gavel Group */}
            <g className="gavel-swing" style={{ transformOrigin: '240px 135px' }}>
              {/* Handle */}
              <line x1="240" y1="135" x2="180" y2="135" stroke="#111827" strokeWidth="5.5" strokeLinecap="round" />
              <line x1="225" y1="135" x2="220" y2="135" stroke="#0B2545" strokeWidth="6.5" />
              {/* Hammer Head */}
              <rect x="164" y="117" width="16" height="36" rx="1.5" fill="#111827" stroke="#0B2545" strokeWidth="1.2" />
              {/* Brass/Gold Accent Plates */}
              <rect x="161" y="125" width="3" height="20" rx="1" fill="#00B4D8" />
              <rect x="180" y="125" width="3" height="20" rx="1" fill="#00B4D8" />
            </g>
          </g>

          {/* Embedded Animation Styles */}
          <style>{`
            .scale-beam {
              animation: scaleBeamSway 4.5s ease-in-out infinite;
            }
            .left-pan-hanger {
              animation: leftPanCounter 4.5s ease-in-out infinite;
            }
            .right-pan-hanger {
              animation: rightPanCounter 4.5s ease-in-out infinite;
            }
            .gavel-swing {
              animation: gavelStrikeMotion 2.6s cubic-bezier(0.25, 1, 0.5, 1) infinite;
            }
            .impact-wave {
              animation: waveRipple 2.6s cubic-bezier(0.1, 0.8, 0.3, 1) infinite;
            }

            @keyframes scaleBeamSway {
              0%, 100% { transform: rotate(-5deg); }
              50% { transform: rotate(5deg); }
            }

            @keyframes leftPanCounter {
              0%, 100% { transform: rotate(5deg); }
              50% { transform: rotate(-5deg); }
            }

            @keyframes rightPanCounter {
              0%, 100% { transform: rotate(5deg); }
              50% { transform: rotate(-5deg); }
            }

            @keyframes gavelStrikeMotion {
              0%, 25%, 75%, 100% { transform: rotate(0deg); }
              50% { transform: rotate(-35deg); }
              58% { transform: rotate(2deg); }
              63% { transform: rotate(-4deg); }
              68% { transform: rotate(0deg); }
            }

            @keyframes waveRipple {
              0%, 57% { opacity: 0; transform: scale(0); }
              58% { opacity: 0.8; transform: scale(0.1); }
              75% { opacity: 0; transform: scale(1.4); }
              100% { opacity: 0; transform: scale(1.4); }
            }
          `}</style>
        </svg>
      </div>

      {message && (
        <h3 className="text-sm font-sans font-bold text-[#111827] tracking-wide mb-1.5 uppercase">
          {message}
        </h3>
      )}
      {subMessage && (
        <p className="text-[11px] font-sans font-light text-[#111827]/60 tracking-wider">
          {subMessage}
        </p>
      )}
    </div>
  );
};

export default LegalLoader;
