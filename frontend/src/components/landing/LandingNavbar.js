import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Link from '../ui/Link';
import AnimatedLogo from './AnimatedLogo';
import Button from '../ui/Button';

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'FAQ', href: '#faq' },
];

const LandingNavbar = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on resize
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMobileOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleAnchorClick = (e, href) => {
    e.preventDefault();
    setMobileOpen(false);
    const id = href.replace('#', '');
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#030014]/80 backdrop-blur-xl border-b border-white/[0.06] shadow-lg shadow-black/20'
            : 'bg-transparent'
        }`}
      >
        <div className="w-full max-w-7xl mx-auto px-6 sm:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* ── Logo ── */}
            <Link to="/" variant="unstyled" className="flex items-center gap-2.5 group">
              <AnimatedLogo size={32} />
              <span className="text-white font-bold text-lg tracking-tight group-hover:text-purple-200 transition-colors">
                TalentMatch AI
              </span>
            </Link>

            {/* ── Desktop Nav Links ── */}
            <div className="landing-desktop-only items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  variant="navbar"
                  onClick={(e) => handleAnchorClick(e, link.href)}
                  className="px-4 py-2 rounded-lg hover:bg-white/[0.05]"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* ── Desktop CTA Buttons ── */}
            <div className="landing-desktop-only items-center gap-3">
              <Button variant="ghost" to="/login">
                Login
              </Button>
              <Button variant="primary" to="/register">
                Get Started
              </Button>
            </div>

            {/* ── Mobile Hamburger ── */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="landing-mobile-only relative w-10 h-10 items-center justify-center rounded-xl bg-white/[0.05] border border-white/[0.08] text-white hover:bg-white/[0.1] transition-all"
              aria-label="Toggle menu"
            >
              <div className="w-5 flex flex-col gap-[5px]">
                <span className={`block h-[2px] bg-current rounded-full transition-all duration-300 origin-center ${mobileOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
                <span className={`block h-[2px] bg-current rounded-full transition-all duration-300 ${mobileOpen ? 'opacity-0 scale-0' : ''}`} />
                <span className={`block h-[2px] bg-current rounded-full transition-all duration-300 origin-center ${mobileOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile Menu Overlay ── */}
      <div
        className={`fixed inset-0 z-40 landing-mobile-overlay transition-all duration-300 ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />

        {/* Menu Panel */}
        <div
          className={`absolute top-0 right-0 w-[280px] h-full bg-[#0a0a1f]/95 backdrop-blur-xl border-l border-white/[0.06] transition-transform duration-300 ease-out ${
            mobileOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex flex-col h-full pt-24 px-6 pb-8">
            {/* Nav Links */}
            <div className="flex flex-col gap-1 mb-8">
              {navLinks.map((link, i) => (
                <Link
                  key={link.label}
                  href={link.href}
                  variant="navbar"
                  onClick={(e) => handleAnchorClick(e, link.href)}
                  className="px-4 py-3 rounded-xl hover:bg-white/[0.05]"
                  style={{ transitionDelay: mobileOpen ? `${50 + i * 40}ms` : '0ms' }}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Divider */}
            <div className="h-[1px] bg-gradient-to-r from-transparent via-purple-500/20 to-transparent mb-8" />

            {/* CTA Buttons */}
            <div className="flex flex-col gap-3 mt-auto">
              <Button
                variant="ghost"
                fullWidth
                onClick={() => { navigate('/login'); setMobileOpen(false); }}
                className="border border-white/10"
              >
                Login
              </Button>
              <Button
                variant="primary"
                fullWidth
                onClick={() => { navigate('/register'); setMobileOpen(false); }}
              >
                Get Started Free
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer so content isn't hidden behind the fixed navbar */}
      <div className="h-16 sm:h-20" />
    </>
  );
};

export default LandingNavbar;
