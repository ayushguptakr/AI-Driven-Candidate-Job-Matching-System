import React from 'react';

const InlineDots = ({ label = 'Analyzing' }) => {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
      <span>{label}</span>
      <span className="ai-dots" aria-hidden="true">
        <span className="ai-dot" />
        <span className="ai-dot" />
        <span className="ai-dot" />
      </span>
    </span>
  );
};

export default InlineDots;
