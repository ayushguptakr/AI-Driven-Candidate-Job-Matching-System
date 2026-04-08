const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '../src/pages/RecruiterDashboard.js');
let content = fs.readFileSync(file, 'utf8');

const startIdentifier = "const AIInsightsPreviewPane = ({ candidate }) => {";
const endIdentifier = "const AIInsightsFullModal = ({ candidate, onClose }) => {";

const startIndex = content.indexOf(startIdentifier);
const endIndex = content.indexOf(endIdentifier);

if (startIndex === -1 || endIndex === -1) {
  console.error("Could not find AIInsightsPreviewPane bounds");
  process.exit(1);
}

const newComponent = `const AIInsightsPreviewPane = ({ candidate }) => {
    // 1. Empty / Loading State
    if (!candidate || loadingMatches) {
      return (
        <div className="h-full flex flex-col p-6 bg-gradient-to-b from-[#0a0520] to-[#030014] border border-white/5 rounded-2xl relative overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 opacity-50">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <BrainCircuit size={16} className="text-purple-400" />
                <span className="text-sm font-bold text-white tracking-wide">AI Copilot</span>
                <span className="w-2 h-2 rounded-full bg-purple-500/50 animate-pulse" />
              </div>
              <p className="text-xs text-slate-500">Smart candidate insights</p>
            </div>
          </div>
          
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            {loadingMatches ? (
              <>
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full animate-pulse" />
                  <div className="w-12 h-12 rounded-full border-t-2 border-l-2 border-purple-500 border-r-2 border-r-transparent border-b-2 border-b-transparent animate-spin flex items-center justify-center relative z-10 bg-[#0a0520]">
                    <div className="w-8 h-8 rounded-full border-b-2 border-r-2 border-indigo-500 border-t-2 border-t-transparent border-l-2 border-l-transparent animate-spin-reverse" />
                  </div>
                </div>
                <h3 className="text-white font-medium mb-2 animate-pulse">Analyzing candidate profile...</h3>
                <p className="text-xs text-slate-500">Extracting semantic vector data</p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center mb-6 shadow-inner">
                  <BrainCircuit size={28} className="text-slate-600" />
                </div>
                <h3 className="text-white font-medium mb-2">Ready to Assist</h3>
                <p className="text-xs text-slate-400 max-w-[200px] mb-6">Select a candidate from the pipeline to see AI-generated insights</p>
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => { if (selectedJob && !loadingMatches) runMatching(); }}
                  disabled={!selectedJob}
                  className="rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 hover:bg-purple-500/20"
                >
                  <Sparkles size={14} className="mr-2" /> Run Analysis
                </Button>
              </>
            )}
          </div>
        </div>
      );
    }
    
    // Derived Data
    const score = Number(candidate.score || 0);
    const skillTags = getSkillBreakdown(candidate).slice(0, 5); // 4-6 key skills
    const appRecord = applications.find(a => a.resumeId?._id === candidate.resumeId?._id || a.userId?._id === candidate.resumeId?.userId);
    
    // Generate natural language chat message
    let aiMessage = getAISummary(candidate);
    
    const scoreStyle = score >= 80 ? {bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20'} 
                     : score >= 60 ? {bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20'} 
                     : {bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/20'};

    return (
      <div className="h-full rounded-2xl border border-white/10 bg-gradient-to-b from-[#0e0725] to-[#030014] flex flex-col p-5 relative overflow-hidden animate-aiPaneFadeIn shadow-2xl">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-purple-500/10 to-transparent blur-2xl pointer-events-none" />
        
        {/* 1. Header */}
        <div className="flex items-start justify-between mb-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <BrainCircuit size={16} className="text-purple-400" />
              <span className="text-sm font-bold text-white tracking-wide">AI Copilot</span>
              <span className="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.8)] animate-pulse" />
            </div>
            <p className="text-xs text-slate-400">Smart candidate insights</p>
          </div>
          <button 
            onClick={() => setIsFullInsightsOpen(true)}
            title="View detailed AI analysis"
            className="text-slate-400 hover:text-white transition-all p-1.5 rounded-lg bg-white/[0.03] hover:bg-white/10 hover:scale-110"
          >
            <Info size={16} />
          </button>
        </div>
        
        {/* 2. Candidate Summary Section */}
        <div className="flex items-center justify-between mb-6 p-4 rounded-xl bg-white/[0.02] border border-white/5 animate-fade-in-up" style={{ animationFillMode: 'both' }}>
          <div className="min-w-0 pr-4">
            <h2 className="text-base font-bold text-white truncate" title={candidate.resumeId?.candidateName || 'Candidate'}>
              {candidate.resumeId?.candidateName || 'Candidate'}
            </h2>
            <p className="text-xs text-slate-500 truncate mt-0.5">{candidate.resumeId?.email || 'Candidate profile'}</p>
          </div>
          <div className={\`shrink-0 px-3 py-1.5 rounded-full border flex items-center gap-1.5 \${scoreStyle.bg} \${scoreStyle.border}\`}>
            <Target size={12} className={scoreStyle.text} />
            <span className={\`font-bold text-sm \${scoreStyle.text}\`}>{score}% Match</span>
          </div>
        </div>

        {/* 3. AI Insight Message (Chat Bubble) */}
        <div className="mb-6 relative z-10 animate-fade-in-up" style={{ animationDelay: '100ms', animationFillMode: 'both' }}>
          <div className="flex gap-3 relative">
            <div className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Sparkles size={14} className="text-white" />
            </div>
            
            <div className="flex-1 relative">
              <div className="absolute -left-2 top-3 w-3 h-3 bg-[#130b30] rotate-45 border-l border-b border-purple-500/30" />
              <div className="p-4 rounded-2xl rounded-tl-none bg-[#130b30] border border-purple-500/30 shadow-[0_4px_20px_rgba(139,92,246,0.1)]">
                <p className="text-[13px] text-slate-200 leading-relaxed">
                  {aiMessage}
                </p>
                
                {/* 5. Smart Suggestions (Chips) */}
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-purple-500/10">
                  <span className="text-[10px] uppercase font-bold text-slate-500 w-full mb-1">Recommended Actions</span>
                  {score >= 80 ? (
                    <button onClick={() => appRecord && handleUpdateApplicationStatus(appRecord._id, 'shortlisted')} className="px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium hover:bg-emerald-500/20 transition-colors">
                      ✨ Move to Shortlist
                    </button>
                  ) : score >= 50 ? (
                    <button className="px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium hover:bg-amber-500/20 transition-colors">
                      🤔 Consider with interview
                    </button>
                  ) : (
                    <button onClick={() => appRecord && handleUpdateApplicationStatus(appRecord._id, 'rejected')} className="px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium hover:bg-red-500/20 transition-colors">
                      📉 Reject candidate
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Skill Highlights */}
        <div className="mb-6 flex-1 animate-fade-in-up" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
          <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">Key Skill Triggers</h4>
          <div className="flex flex-wrap gap-2">
            {skillTags.length > 0 ? skillTags.map((tag, i) => {
              const isStrong = tag.status === 'strong';
              const isMod = tag.status === 'moderate';
              return (
                <div key={i} className={\`px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all hover:-translate-y-0.5 \${
                  isStrong ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 shadow-[0_0_10px_rgba(52,211,153,0.1)]' : 
                  isMod ? 'bg-amber-500/10 border-amber-500/30 text-amber-300' :
                  'bg-red-500/5 border-red-500/20 text-red-300 line-through decoration-red-500/50 opacity-70'
                }\`}>
                  {tag.skill}
                </div>
              );
             }) : (
               <span className="text-xs text-slate-500">Data parsing required.</span>
             )}
          </div>
        </div>

        {/* 6. Quick Actions */}
        <div className="mt-auto grid grid-cols-2 gap-3 pt-4 border-t border-white/10 animate-fade-in-up" style={{ animationDelay: '300ms', animationFillMode: 'both' }}>
          <button 
            onClick={() => setIsFullInsightsOpen(true)}
            className="col-span-2 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500/20 to-purple-500/20 hover:from-indigo-500/30 hover:to-purple-500/30 border border-purple-500/30 text-purple-300 font-semibold text-sm transition-all shadow-[0_0_15px_rgba(139,92,246,0.1)] group"
          >
            <BrainCircuit size={16} className="group-hover:scale-110 transition-transform" />
            View Full Analysis
          </button>
        </div>
      </div>
    );
  };

  `;

content = content.substring(0, startIndex) + newComponent + content.substring(endIndex);

fs.writeFileSync(file, content);
console.log('Recruiter Dashboard AI Copilot updated successfully.');
