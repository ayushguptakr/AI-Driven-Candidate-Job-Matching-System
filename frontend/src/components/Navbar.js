import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bell, LayoutDashboard, LogOut, Settings2 } from 'lucide-react';
import LogoLink from './ui/LogoLink';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: "Welcome!", message: "Welcome to TalentMatch AI!", time: "Just now", read: false },
    { id: 2, title: "Profile", message: "Complete your profile to unlock AI matching", time: "1h ago", read: false }
  ]);
  const profileMenuRef = useRef(null);
  const notificationsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowProfileMenu(false);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#0a0520]/80 backdrop-blur-md border-b border-white/10 transition-all font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <LogoLink />

          {/* Navigation Links */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                {/* Dashboard Button */}
                <Link 
                  to={user.role === 'recruiter' ? '/recruiter/dashboard' : '/candidate/dashboard'} 
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
                    location.pathname.includes('/recruiter') || location.pathname.includes('/candidate')
                      ? 'bg-purple-600/20 text-purple-400 border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.15)]'
                      : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  Dashboard
                </Link>

                {/* Notifications Dropdown */}
                <div className="relative" ref={notificationsRef}>
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative flex items-center justify-center p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white transition-all"
                  >
                    <Bell size={18} />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 bg-purple-500 text-white text-[10px] font-bold rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {showNotifications && (
                    <div className="absolute right-0 mt-3 w-80 bg-[#0f082e] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-[1000]">
                      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/[0.02]">
                        <h3 className="font-bold text-white m-0">Notifications</h3>
                        {unreadCount > 0 && (
                          <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-400 text-xs font-semibold">
                            {unreadCount} new
                          </span>
                        )}
                      </div>
                      <div className="max-h-[350px] overflow-y-auto custom-scroll">
                        {notifications.length === 0 ? (
                          <div className="p-8 text-center text-slate-400 flex flex-col items-center">
                            <Bell size={24} className="mb-2 opacity-30" />
                            <p className="text-sm">No new notifications</p>
                          </div>
                        ) : (
                          notifications.map((notif, idx) => (
                            <div
                              key={idx}
                              className={`p-4 border-b border-white/5 cursor-pointer transition-colors hover:bg-white/5 ${
                                !notif.read ? 'bg-purple-500/10' : 'transparent'
                              }`}
                            >
                              <div className="text-sm font-semibold text-white mb-1">
                                {notif.title}
                              </div>
                              <div className="text-xs text-slate-300 mb-2">
                                {notif.message}
                              </div>
                              <div className="text-[10px] uppercase font-bold tracking-wider text-purple-400/80">
                                {notif.time}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile Menu Dropdown */}
                <div className="relative" ref={profileMenuRef}>
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center justify-center w-10 h-10 rounded-full font-bold bg-gradient-to-tr from-purple-600 to-indigo-600 text-white border-2 border-white/20 hover:scale-105 transition-transform shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                  >
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </button>

                  {showProfileMenu && (
                    <div className="absolute right-0 mt-3 w-56 bg-[#0f082e] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-[1000]">
                      <div className="p-4 border-b border-white/10 bg-gradient-to-bl from-purple-500/10 to-transparent">
                        <div className="font-bold text-white text-sm mb-1 truncate">
                          {user.name}
                        </div>
                        <div className="text-xs text-slate-400 truncate mb-3">
                          {user.email}
                        </div>
                        <span className="px-2 py-1 rounded-md bg-purple-500/20 text-purple-400 text-[10px] uppercase tracking-wider font-bold">
                          {user.role === 'recruiter' ? 'Recruiter' : 'Candidate'}
                        </span>
                      </div>
                      <div className="py-2">
                        <Link
                          to="/profile"
                          onClick={() => setShowProfileMenu(false)}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                        >
                          <Settings2 size={16} className="text-slate-400" />
                          Profile Settings
                        </Link>
                        <Link
                          to={user.role === 'recruiter' ? '/recruiter/dashboard' : '/candidate/dashboard'}
                          onClick={() => setShowProfileMenu(false)}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                        >
                          <LayoutDashboard size={16} className="text-slate-400" />
                          Dashboard
                        </Link>
                        <div className="h-px bg-white/5 my-2 mx-4" />
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors text-left"
                        >
                          <LogOut size={16} />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Unauthenticated State */}
                <Link 
                  to="/login" 
                  className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="px-4 py-2 rounded-xl text-sm font-bold bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-colors backdrop-blur-md"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
