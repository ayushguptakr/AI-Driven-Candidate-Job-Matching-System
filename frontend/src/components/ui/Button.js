import React from 'react';
import { Link } from 'react-router-dom';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  to,
  href,
  icon: Icon,
  disabled,
  fullWidth,
  ...props
}) => {
  // Base structural classes
  const baseClasses = 'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 no-underline';
  
  // Sizing
  const sizeClasses = {
    sm: 'text-xs px-4 py-2 rounded-lg',
    md: 'text-sm px-6 py-2.5 rounded-xl',
    lg: 'text-base px-7 py-3 rounded-2xl',
  };

  // Variants (solving the contrast issue explicitly in the 'light' variant)
  const variantClasses = {
    primary: 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-500/25 border border-transparent',
    secondary: 'bg-white/5 hover:bg-white/10 text-white border border-white/10 shadow-sm',
    light: 'bg-white hover:bg-slate-100 text-slate-900 border border-slate-200 shadow-sm',
    danger: 'bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 shadow-sm',
    ghost: 'bg-transparent hover:bg-white/5 text-slate-300 hover:text-white border border-transparent'
  };

  const widthClass = fullWidth ? 'w-full' : '';
  const disabledClass = disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : '';
  const finalClasses = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${widthClass} ${disabledClass} ${className}`;

  // Content rendering
  const Content = (
    <>
      {Icon && <Icon size={size === 'sm' ? 16 : size === 'lg' ? 22 : 18} />}
      {children}
    </>
  );

  if (to) {
    return (
      <Link 
        to={disabled ? '#' : to} 
        className={finalClasses}
        onClick={(e) => disabled && e.preventDefault()}
        {...props}
      >
        {Content}
      </Link>
    );
  }

  if (href) {
    return (
      <a 
        href={disabled ? '#' : href} 
        className={finalClasses} 
        target="_blank" 
        rel="noopener noreferrer" 
        onClick={(e) => disabled && e.preventDefault()}
        {...props}
      >
        {Content}
      </a>
    );
  }

  return (
    <button className={finalClasses} disabled={disabled} {...props}>
      {Content}
    </button>
  );
};

export default Button;
