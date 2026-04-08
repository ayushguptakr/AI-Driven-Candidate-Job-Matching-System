const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '../src/pages/RecruiterDashboard.js');
let content = fs.readFileSync(file, 'utf8');

// Replace lg:static with lg:sticky lg:top-0 h-screen to fix the sidebar
const originalClasses = 'fixed lg:static inset-y-0 left-0 w-64 bg-white/[0.02] border-r border-white/10 z-50 transform transition-transform duration-300 ease-out flex flex-col';
const newClasses = 'fixed lg:sticky lg:top-0 h-screen inset-y-0 left-0 w-64 bg-white/[0.02] border-r border-white/10 z-50 transform transition-transform duration-300 ease-out flex flex-col overflow-hidden';

content = content.replace(originalClasses, newClasses);

fs.writeFileSync(file, content);
console.log('Sidebar fixed effectively.');
