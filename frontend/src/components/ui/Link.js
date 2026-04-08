import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

const AppLink = ({
  children,
  to,
  href,
  variant = 'default',
  className = '',
  ...props
}) => {
  // Base classes that apply universally
  // We enforce no-underline by default to fix browser inconsistency
  const baseClasses = 'transition-all duration-200 no-underline';

  // Specific visual styles based on use-case
  const variants = {
    navbar: 'text-sm font-medium text-slate-300 hover:text-white',
    footer: 'text-sm text-slate-400 hover:text-white',
    cta: 'text-purple-400 font-semibold hover:text-purple-300 hover:drop-shadow-[0_0_8px_rgba(192,132,252,0.4)]',
    default: 'text-purple-400 hover:text-purple-300 hover:underline',
    ghost: 'text-slate-400 hover:text-white', // e.g. for "Back to Home"
    unstyled: '' // For structural links like Logos
  };

  const variantClass = variants[variant] !== undefined ? variants[variant] : variants.default;
  const finalClasses = `${baseClasses} ${variantClass} ${className}`;

  if (to) {
    return (
      <RouterLink to={to} className={finalClasses} {...props}>
        {children}
      </RouterLink>
    );
  }

  return (
    <a href={href} className={finalClasses} {...props} target={href?.startsWith('http') ? '_blank' : undefined} rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}>
      {children}
    </a>
  );
};

export default AppLink;
