const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '../src/pages/RecruiterDashboard.js');
let content = fs.readFileSync(file, 'utf8');

// 1. Change the main layout wrapper below the header from overflow-hidden to overflow-y-auto
content = content.replace(
  '<div className="flex-1 overflow-hidden p-6">',
  '<div className="flex-1 overflow-y-auto p-6 scroll-smooth">'
);

// 2. Remove the forced height from the Tri-pane grid, and align items to the top so they grow independently
content = content.replace(
  '<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100%-100px)]">',
  '<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start pb-20">'
);

// 3. Remove nested 'h-full' from PANE A and PANE B containers so they naturally wrap their content
content = content.replace( // PANE A
  '<div className="flex flex-col bg-white/[0.02] border border-white/5 rounded-2xl h-full">',
  '<div className="flex flex-col bg-white/[0.02] border border-white/5 rounded-2xl">'
);
content = content.replace( // PANE B
  '<div className="flex flex-col bg-white/[0.02] border border-white/5 rounded-2xl h-full">',
  '<div className="flex flex-col bg-white/[0.02] border border-white/5 rounded-2xl">'
);
// Also in PANE C (AI Copilot wrapper):
content = content.replace(
  '<div className="h-full hidden lg:block">',
  '<div className="hidden lg:block">'
);

// 4. Remove internal overflow-y-auto scrolling in PANE A (Jobs list)
content = content.replace(
  '<div className="flex-1 overflow-y-auto p-3 space-y-2">',
  '<div className="p-3 space-y-2">'
);

// 5. Remove internal overflow-y-auto scrolling in PANE B (Candidates list)
content = content.replace(
  '<div className="flex-1 overflow-y-auto p-3 space-y-2 relative">',
  '<div className="p-3 space-y-2 relative min-h-[300px]">' // keep min-h so the empty states format nicely
);

// 6. Update AIInsightsPreviewPane to remove 'h-full' and 'overflow-y-auto' so it expands fully
// Empty loading state
content = content.replace(
  /className="h-full flex flex-col p-6 /g,
  'className="flex flex-col p-6 '
);
// Populated state: we originally set it.
content = content.replace(
  /className="h-full rounded-2xl border border-white\/10 bg-gradient-[^"]* overflow-y-auto[^"]*"/,
  (match) => {
    return match.replace('h-full', '').replace('overflow-y-auto', '').trim() + '"';
  }
);
// Make sure we catch it if it was still using overflow-hidden
content = content.replace(
  /className="h-full rounded-2xl border border-white\/10 bg-gradient-[^"]* overflow-hidden[^"]*"/,
  (match) => {
    return match.replace('h-full', '').replace('overflow-hidden', '').trim() + '"';
  }
);
content = content.replace(
  /className="h-full flex flex-col p-6 bg-gradient-[^"]* overflow-hidden[^"]*"/,
  (match) => {
    return match.replace('h-full', '').replace('overflow-hidden', '').trim() + '"';
  }
);


fs.writeFileSync(file, content);
console.log('Main scrolling with natural column expansion successfully implemented.');
