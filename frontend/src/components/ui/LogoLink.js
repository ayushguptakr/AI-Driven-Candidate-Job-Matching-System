import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AnimatedLogo from '../landing/AnimatedLogo';

const LogoLink = ({ className = '', size = 46, onClick }) => {
  const { user, loading } = useAuth();

  const getRoute = () => {
    // If the auth context is still figuring out who the user is, default safely to the root or prevent broken state
    if (loading && !user) return '/';
    
    // Auth aware explicit routing map
    if (!user) return '/';
    if (user.role === 'admin') return '/admin/dashboard';
    if (user.role === 'recruiter') return '/recruiter/dashboard';
    if (user.role === 'candidate') return '/candidate/dashboard';
    
    return '/'; // ultimate fallback
  };

  return (
    <Link 
      to={getRoute()} 
      className={`flex items-center gap-2 group transition-all ${className}`}
      onClick={onClick}
      style={{ textDecoration: 'none' }}
    >
      <AnimatedLogo size={size} className="transition-transform duration-300 group-hover:scale-[1.05]" />
      <span className="text-white font-bold text-xl tracking-tight group-hover:text-purple-300 transition-colors drop-shadow-sm">
        TalentMatch AI
      </span>
    </Link>
  );
};

export default LogoLink;
