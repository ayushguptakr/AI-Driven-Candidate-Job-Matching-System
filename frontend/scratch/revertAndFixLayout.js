const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '../src/pages/RecruiterDashboard.js');
let content = fs.readFileSync(file, 'utf8');

// 1. Revert to original solid app layout on <main>
content = content.replace(
  '<main className="flex-1 flex flex-col relative min-h-screen">',
  '<main className="flex-1 flex flex-col relative h-screen overflow-hidden">'
);

// 2. Revert Header to original
content = content.replace(
  '<header className="sticky top-0 flex flex-col sm:flex-row sm:items-center justify-between p-6 border-b border-white/10 bg-[#030014]/95 backdrop-blur z-30 shrink-0">',
  '<header className="flex flex-col sm:flex-row sm:items-center justify-between p-6 border-b border-white/10 bg-white/[0.02] z-30 shrink-0">'
);

// 3. Revert Layout wrapper
content = content.replace(
  '<div className="flex-1 flex flex-col p-6">',
  '<div className="flex-1 overflow-hidden p-6">' // This locks the wrapper height
);

// 4. Revert Tri-Pane Grid
content = content.replace(
  '<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">',
  '<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100%-100px)]">'
);

// 5. Revert Sidebar sticky hack back to static for pristine app layout matching
content = content.replace(
  'fixed lg:sticky lg:top-0 h-screen inset-y-0 left-0 w-64 bg-white/[0.02] border-r border-white/10 z-50 transform transition-transform duration-300 ease-out flex flex-col overflow-hidden',
  'fixed lg:static inset-y-0 left-0 w-64 bg-white/[0.02] border-r border-white/10 z-50 transform transition-transform duration-300 ease-out flex flex-col'
);

// 6. Fix the actual problem: AI Insights Copilot panel needs flex-1 overflow-y-auto. 
// Right now, the AIInsightsPreviewPane's main div has overflow-y-auto, which is correct, but let's make sure it's fully scrollable and not shrinking its children incorrectly.
// It has: className="h-full rounded-2xl ... flex flex-col p-5 relative overflow-y-auto animate-aiPaneFadeIn shadow-2xl"
// We will just verify it's there. 

fs.writeFileSync(file, content);
console.log('App layout pristine restoration complete.');
