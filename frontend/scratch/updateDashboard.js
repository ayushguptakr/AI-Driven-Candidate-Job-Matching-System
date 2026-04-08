const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '../src/pages/RecruiterDashboard.js');
let content = fs.readFileSync(file, 'utf8');

// 1. Add state variable
content = content.replace(
  "const [statusMessage, setStatusMessage] = useState({ text: '', type: '' });",
  "const [statusMessage, setStatusMessage] = useState({ text: '', type: '' });\n  const [isFullInsightsOpen, setIsFullInsightsOpen] = useState(false);"
);

// 2. Identify the AIInsightsPane function bounds
const startIdentifier = "const AIInsightsPane = ({ candidate }) => {";
const endIdentifier = "  return (\n    <div className=\"landing-page min-h-screen";

const startIndex = content.indexOf(startIdentifier);
const endIndex = content.indexOf(endIdentifier);

if (startIndex === -1 || endIndex === -1) {
  console.error("Could not find AIInsightsPane bounds");
  process.exit(1);
}

// 3. Define the new components
const newComponents = `const AIInsightsPreviewPane = ({ candidate }) => {
    if (!candidate) {
      return (
        <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-white/[0.02] border border-white/5 rounded-2xl relative overflow-hidden" style={{ minHeight: 400 }}>
          <BrainCircuit size={40} className="text-slate-600 mb-4" />
          <h3 className="text-white font-bold mb-2">AI Match Insights</h3>
          <p className="text-sm text-slate-400 mb-6">Select a candidate or run AI analysis to view insights</p>
          <Button 
            variant="secondary" 
            size="sm"
            onClick={() => { if (selectedJob && !loadingMatches) runMatching(); }}
            disabled={!selectedJob}
            className="flex items-center gap-2 relative z-10"
          >
            <Sparkles size={14} /> Run AI Analysis
          </Button>
        </div>
      );
    }
    
    // Derived Data
    const score = Number(candidate.score || 0);
    const skillTags = getSkillBreakdown(candidate).slice(0, 4); // Keep to 3-4 key skills
    const aiSummary = getAISummary(candidate);
    
    const scoreColor = score >= 80 ? 'text-emerald-400' : score >= 60 ? 'text-amber-400' : 'text-slate-400';

    return (
      <div className="h-full rounded-2xl border border-white/5 bg-gradient-to-b from-white/[0.04] to-white/[0.01] flex flex-col p-5 relative overflow-hidden animate-aiPaneFadeIn">
        {/* Glow effect matching original empty state subtle styling */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-3xl pointer-events-none rounded-full" />
        
        {/* Header containing Name and Info Icon */}
        <div className="flex items-start justify-between mb-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <BrainCircuit size={14} className="text-purple-400" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">AI Preview</span>
            </div>
            <h2 className="text-lg font-bold text-white truncate max-w-[180px]" title={candidate.resumeId?.candidateName || 'Candidate'}>
              {candidate.resumeId?.candidateName || 'Candidate'}
            </h2>
          </div>
          <button 
            onClick={() => setIsFullInsightsOpen(true)}
            title="View detailed AI analysis"
            className="text-slate-500 hover:text-purple-400 transition-all p-1.5 rounded-lg bg-white/5 hover:bg-purple-500/10 hover:scale-110 hover:shadow-[0_0_12px_rgba(168,85,247,0.4)]"
          >
            <Info size={16} />
          </button>
        </div>
        
        {/* Score & Match */}
        <div className="mb-5 relative z-10">
          <div className="flex items-center gap-2">
            <span className={\`text-3xl font-black leading-none \${scoreColor}\`}>{score}%</span>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Match</span>
          </div>
        </div>

        {/* Skill Tags */}
        <div className="mb-5 space-y-2 flex-1 relative z-10">
          {skillTags.length > 0 ? skillTags.map((tag, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              {tag.status === 'strong' ? <CheckCircle size={14} className="text-emerald-400 shrink-0" /> : 
               tag.status === 'moderate' ? <CheckCircle size={14} className="text-amber-400 shrink-0" /> :
               <AlertCircle size={14} className="text-red-400 shrink-0" />}
              <span className={\`truncate \${tag.status === 'missing' ? 'text-slate-500 decoration-red-500/30' : 'text-slate-200'}\`}>
                {tag.skill}
              </span>
            </div>
          )) : (
             <span className="text-xs text-slate-500">Run analysis for skill matching.</span>
          )}
        </div>

        {/* Summary Snippet */}
        <div className="mb-5 relative z-10">
           <p className="text-[13px] text-slate-400 italic line-clamp-2 leading-relaxed">
             "{aiSummary}"
           </p>
        </div>

        {/* CTA Button */}
        <div className="mt-auto relative z-10">
          <button 
            onClick={() => setIsFullInsightsOpen(true)}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-purple-600/10 hover:bg-purple-600/20 text-purple-400 hover:text-purple-300 font-semibold text-sm border border-purple-500/20 hover:border-purple-500/40 transition-all cursor-pointer group"
          >
            <BrainCircuit size={16} className="group-hover:scale-110 transition-transform" />
            View Full Analysis
          </button>
        </div>
      </div>
    );
  };

  const AIInsightsFullModal = ({ candidate, onClose }) => {
    const score = Number(candidate.score || 0);
    const missingSkills = getMissingSkills(candidate);
    const matchedSkills = Array.isArray(candidate.matchingSkills) ? candidate.matchingSkills : [];
    const skillTags = getSkillBreakdown(candidate);
    const aiSummary = getAISummary(candidate);

    const scoreGlow = score >= 80 ? 'rgba(52,211,153,0.25)' : score >= 60 ? 'rgba(251,191,36,0.2)' : 'rgba(148,163,184,0.1)';
    const scoreRingColor = score >= 80 ? '#34d399' : score >= 60 ? '#fbbf24' : '#64748b';

    const tagStyles = {
      strong: { bg: 'rgba(52,211,153,0.1)', border: 'rgba(52,211,153,0.25)', color: '#6ee7b7', dotColor: '#34d399', label: 'Strong' },
      moderate: { bg: 'rgba(251,191,36,0.08)', border: 'rgba(251,191,36,0.2)', color: '#fcd34d', dotColor: '#fbbf24', label: 'Moderate' },
      missing: { bg: 'rgba(248,113,113,0.08)', border: 'rgba(248,113,113,0.2)', color: '#fca5a5', dotColor: '#f87171', label: 'Missing' },
    };

    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
        >
          <X size={24} />
        </button>

        <div className="w-full max-w-[500px] h-[85vh] sm:h-auto sm:max-h-[85vh] bg-gradient-to-b from-[#0a0520] to-[#030014] rounded-2xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col relative animate-scale-in">
          
          {/* Gradient border */}
          <div style={{
            position: 'absolute', inset: 0, borderRadius: '1rem', padding: '1px',
            background: 'linear-gradient(180deg, rgba(139,92,246,0.4), rgba(99,102,241,0.1), rgba(139,92,246,0.2))',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            pointerEvents: 'none',
          }} />

          {/* Ambient glow behind score */}
          <div style={{
            position: 'absolute', top: -40, right: -40, width: 200, height: 200,
            borderRadius: '50%', background: \`radial-gradient(circle, \${scoreGlow} 0%, transparent 70%)\`,
            pointerEvents: 'none', filter: 'blur(40px)',
          }} />

          {/* Header */}
          <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', position: 'relative', zIndex: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <BrainCircuit size={18} style={{ color: '#a78bfa' }} />
              <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#a78bfa' }}>
                Full AI Match Analysis
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ minWidth: 0, flex: 1 }}>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {candidate.resumeId?.candidateName || 'Candidate'}
                </h2>
                <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>
                  {candidate.resumeId?.email || 'No email provided'}
                </p>
              </div>

              {/* Radial Score */}
              <div style={{ position: 'relative', width: 72, height: 72, flexShrink: 0 }}>
                <svg width="72" height="72" viewBox="0 0 72 72" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="36" cy="36" r="30" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
                  <circle cx="36" cy="36" r="30" fill="none" stroke={scoreRingColor} strokeWidth="4"
                    strokeDasharray={\`\${(score / 100) * 188.5} 188.5\`} strokeLinecap="round"
                    style={{ transition: 'stroke-dasharray 1s ease-out', filter: \`drop-shadow(0 0 6px \${scoreRingColor})\` }}
                  />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 20, fontWeight: 900, color: '#fff', lineHeight: 1 }}>{score}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Scrollable Flow */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div>
              <h3 style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#e2e8f0', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Target size={14} style={{ color: '#818cf8' }} /> Complete Skill Breakdown
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {skillTags.length > 0 ? skillTags.concat(skillTags.length > 0 ? [] : []).map((tag, i) => {
                  const s = tagStyles[tag.status];
                  return (
                    <div key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 8, background: s.bg, border: \`1px solid \${s.border}\` }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: s.dotColor, boxShadow: \`0 0 6px \${s.dotColor}\` }} />
                      <span style={{ fontSize: 12, fontWeight: 600, color: s.color }}>{tag.skill}</span>
                    </div>
                  );
                }) : (
                  <span className="text-sm text-slate-500">No skill data available.</span>
                )}
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#e2e8f0', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Sparkles size={14} style={{ color: '#a78bfa' }} /> Detailed AI Reasoning
              </h3>
              <div style={{ padding: '16px', borderRadius: 12, background: 'linear-gradient(135deg, rgba(139,92,246,0.08), rgba(99,102,241,0.05))', border: '1px solid rgba(139,92,246,0.15)' }}>
                <p style={{ fontSize: 13, lineHeight: 1.7, color: 'rgba(196,181,253,0.9)', margin: 0 }}>{aiSummary}</p>
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#e2e8f0', marginBottom: 14 }}>Alignment Metrics</h3>
              <div style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 500, color: '#cbd5e1' }}>Skills Alignment</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{Math.round((matchedSkills.length / Math.max(matchedSkills.length + missingSkills.length, 1)) * 100)}%</span>
                </div>
                <div style={{ height: 6, width: '100%', background: 'rgba(255,255,255,0.04)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', borderRadius: 3, background: 'linear-gradient(90deg, #818cf8, #a78bfa)', width: \`\${Math.round((matchedSkills.length / Math.max(matchedSkills.length + missingSkills.length, 1)) * 100)}%\`, boxShadow: '0 0 8px rgba(129,140,248,0.3)' }} />
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 500, color: '#cbd5e1' }}>Experience Alignment</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{Math.min(95, Math.max(45, Math.round(score * 0.92)))}%</span>
                </div>
                <div style={{ height: 6, width: '100%', background: 'rgba(255,255,255,0.04)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', borderRadius: 3, background: 'linear-gradient(90deg, #a855f7, #c084fc)', width: \`\${Math.min(95, Math.max(45, Math.round(score * 0.92)))}%\`, boxShadow: '0 0 8px rgba(168,85,247,0.3)' }} />
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-4 border-t border-white/5 relative z-10 flex justify-end">
            <Button variant="secondary" onClick={onClose}>Close Analysis</Button>
          </div>
        </div>
      </div>
    );
  };
`;

content = content.substring(0, startIndex) + newComponents + content.substring(endIndex);

// 4. Update the PANE C rendering to use AIInsightsPreviewPane
content = content.replace(
  /<div className="h-full hidden lg:block">\s*<AIInsightsPane candidate={selectedCandidate} \/>\s*<\/div>/,
  '<div className="h-full hidden lg:block">\n              <AIInsightsPreviewPane candidate={selectedCandidate} />\n            </div>'
);

// Remove mobile fallback (find the exact comment and div)
const mobileFallbackStart = "{/* Mobile Fallback for AI Insights (Modal) */}";
let mfsIndex = content.indexOf(mobileFallbackStart);
if (mfsIndex !== -1) {
  // Find the exact end of the block
  // It ends after the closing `)}` of the condition.
  // Instead of complex parsing, since we know how it looks, we can replace it.
  const regex = /\{\/\* Mobile Fallback for AI Insights \(Modal\) \*\/\}[\s\S]*?\n\s*\)\}/;
  content = content.replace(regex, "");
}

// 5. Add the Full Modal at the end, right before {isPostJobOpen} and JobForm
content = content.replace(
  "{/* Post Job Modal */}",
  `{/* Full AI Insights Modal */}
      {isFullInsightsOpen && selectedCandidate && (
        <AIInsightsFullModal 
          candidate={selectedCandidate} 
          onClose={() => setIsFullInsightsOpen(false)} 
        />
      )}

      {/* Post Job Modal */}`
);

fs.writeFileSync(file, content);
console.log('Recruiter Dashboard updated successfully.');
