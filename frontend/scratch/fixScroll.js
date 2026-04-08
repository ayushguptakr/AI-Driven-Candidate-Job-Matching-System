const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '../src/pages/RecruiterDashboard.js');
let content = fs.readFileSync(file, 'utf8');

// 1. Remove global h-screen & overflow-hidden from main wrapper
content = content.replace(
  '<main className="flex-1 flex flex-col relative h-screen overflow-hidden">',
  '<main className="flex-1 flex flex-col relative min-h-screen">'
);

// Fix header to be sticky so it stays visible if page scrolls
content = content.replace(
  '<header className="flex flex-col sm:flex-row sm:items-center justify-between p-6 border-b border-white/10 bg-white/[0.02] z-30 shrink-0">',
  '<header className="sticky top-0 flex flex-col sm:flex-row sm:items-center justify-between p-6 border-b border-white/10 bg-[#030014]/95 backdrop-blur z-30 shrink-0">'
);

// 2. Remove overflow-hidden from scrollable layout wrapper and make it a clean flex column
content = content.replace(
  '<div className="flex-1 overflow-hidden p-6">',
  '<div className="flex-1 flex flex-col p-6">'
);

// 3. Update the Tri-Pane grid layout. Remove fixed h-[calc...] and let it fill available space
content = content.replace(
  '<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100%-100px)]">',
  '<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 items-start">' // items-start ensures panels don't stretch to infinity unless they need to, but wait! The user said "Has full height". 
);
// Actually, if we use items-stretch, it forces full height on columns. let's use:
content = content.replace(
  '<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 items-start">',
  '<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">'
);

// 4. Update AIInsightsPreviewPane to enable scrolling
// It's the populated state's main container.
content = content.replace(
  'h-full rounded-2xl border border-white/10 bg-gradient-to-b from-[#0e0725] to-[#030014] flex flex-col p-5 relative overflow-hidden animate-aiPaneFadeIn shadow-2xl',
  'h-full rounded-2xl border border-white/10 bg-gradient-to-b from-[#0e0725] to-[#030014] flex flex-col p-5 relative overflow-y-auto animate-aiPaneFadeIn shadow-2xl'
);

// Update PANE A (Jobs)
// It already has a scrollable inner div, but we need to ensure the outer container is scrollable if needed.
// 'className="flex flex-col bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden h-full"'
content = content.replace(
  'className="flex flex-col bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden h-full"',
  'className="flex flex-col bg-white/[0.02] border border-white/5 rounded-2xl h-full"'
);

// PANE B (Candidates)
// 'className="flex flex-col bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden h-full"' (already replaced above if replacing globally)
content = content.replaceAll(
  'className="flex flex-col bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden h-full"',
  'className="flex flex-col bg-white/[0.02] border border-white/5 rounded-2xl h-full"'
);

fs.writeFileSync(file, content);
console.log('Scroll limits removed successfully.');
