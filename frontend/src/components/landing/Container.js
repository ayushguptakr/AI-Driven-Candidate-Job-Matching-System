import React from 'react';

const Container = ({ children, className = '', narrow = false }) => {
  return (
    <div className={`w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 ${narrow ? 'max-w-3xl' : ''} ${className}`}>
      {children}
    </div>
  );
};

export default Container;
