import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  ArrowRight,
  BadgeCheck,
  Bot,
  BrainCircuit,
  BriefcaseBusiness,
  ChartNoAxesCombined,
  CheckCircle2,
  Clock,
  FileUp,
  Sparkles,
  Zap
} from 'lucide-react';

const HomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // If user is logged in, show personalized dashboard
  if (user) {
    return (
      <div style={{
        position: 'relative',
        minHeight: '90vh',
        padding: '80px 0',
        overflow: 'hidden'
      }}>
        {/* Background */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 30%, rgba(13, 148, 136, 0.12) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(255, 107, 107, 0.1) 0%, transparent 50%),
            linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 50%, #E2E8F0 100%)
          `,
          zIndex: 0
        }} />

        <div className="main-container" style={{ position: 'relative', zIndex: 2 }}>
          {/* Welcome Section */}
          <div style={{
            textAlign: 'center',
            marginBottom: 'var(--spacing-2xl)',
            animation: 'fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
          }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 68, height: 68, borderRadius: 20, background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.12), rgba(168, 85, 247, 0.10))', border: '1px solid rgba(99, 102, 241, 0.18)', boxShadow: 'var(--shadow-sm)', marginBottom: 'var(--spacing-md)', animation: 'scaleIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both' }}>
              <Sparkles size={26} color="var(--primary)" />
            </div>
            <h1 className="page-title" style={{
              fontSize: 'clamp(2rem, 6vw, 3.5rem)',
              marginBottom: 'var(--spacing-md)',
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Welcome back, {user.name}!
            </h1>
            <p style={{
              fontSize: 'clamp(1rem, 2vw, 1.25rem)',
              color: 'var(--text-secondary)',
              maxWidth: '600px',
              margin: '0 auto',
              fontFamily: 'DM Sans, sans-serif'
            }}>
              {user.role === 'recruiter' 
                ? 'Ready to find the perfect candidates for your open positions?'
                : 'Ready to discover your next career opportunity?'
              }
            </p>
          </div>

          {/* Quick Actions */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 'var(--spacing-lg)',
            marginBottom: 'var(--spacing-2xl)'
          }}>
            <div className="card-custom" style={{
              padding: 'var(--spacing-xl)',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'var(--transition)',
              animation: 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both'
            }}
            onClick={() => navigate(user.role === 'recruiter' ? '/recruiter/dashboard' : '/candidate/dashboard')}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
            }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 64, height: 64, borderRadius: 20, background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.12), rgba(168, 85, 247, 0.10))', border: '1px solid rgba(99, 102, 241, 0.18)', marginBottom: 'var(--spacing-md)' }}>
                {user.role === 'recruiter' ? <BriefcaseBusiness size={26} color="var(--primary)" /> : <FileUp size={26} color="var(--primary)" />}
              </div>
              <h3 style={{
                fontFamily: 'Fraunces, serif',
                fontSize: '1.5rem',
                marginBottom: 'var(--spacing-sm)',
                color: 'var(--text-primary)'
              }}>
                Go to Dashboard
              </h3>
              <p style={{
                color: 'var(--text-secondary)',
                fontFamily: 'DM Sans, sans-serif',
                marginBottom: 'var(--spacing-md)'
              }}>
                {user.role === 'recruiter'
                  ? 'Manage your job postings and view candidate matches'
                  : 'View your resumes and explore job opportunities'
                }
              </p>
              <div className="btn-primary-custom" style={{ width: '100%' }}>
                Open Dashboard <ArrowRight size={16} />
              </div>
            </div>

            <div className="card-custom" style={{
              padding: 'var(--spacing-xl)',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'var(--transition)',
              animation: 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.4s both'
            }}
            onClick={() => navigate('/profile')}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
            }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 64, height: 64, borderRadius: 20, background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.12), rgba(168, 85, 247, 0.10))', border: '1px solid rgba(99, 102, 241, 0.18)', marginBottom: 'var(--spacing-md)' }}>
                <BadgeCheck size={26} color="var(--primary)" />
              </div>
              <h3 style={{
                fontFamily: 'Fraunces, serif',
                fontSize: '1.5rem',
                marginBottom: 'var(--spacing-sm)',
                color: 'var(--text-primary)'
              }}>
                Profile Settings
              </h3>
              <p style={{
                color: 'var(--text-secondary)',
                fontFamily: 'DM Sans, sans-serif',
                marginBottom: 'var(--spacing-md)'
              }}>
                Update your profile information and preferences
              </p>
              <div style={{
                background: 'var(--bg-tertiary)',
                color: 'var(--text-primary)',
                padding: '12px 24px',
                borderRadius: 'var(--radius)',
                fontWeight: '600',
                fontFamily: 'DM Sans, sans-serif',
                transition: 'var(--transition-fast)'
              }}>
                Manage Profile <ArrowRight size={16} style={{ verticalAlign: 'middle' }} />
              </div>
            </div>
          </div>

          {/* Stats Preview */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: 'var(--spacing-md)',
            marginTop: 'var(--spacing-xl)'
          }}>
            <div style={{
              textAlign: 'center',
              padding: 'var(--spacing-lg)',
              background: 'rgba(79, 70, 229, 0.06)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid rgba(79, 70, 229, 0.12)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
                <BrainCircuit size={22} color="var(--primary)" />
              </div>
              <div style={{ fontSize: '1.125rem', fontWeight: '700', color: 'var(--text-primary)', fontFamily: 'Fraunces, serif' }}>AI-powered</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontFamily: 'DM Sans, sans-serif', marginTop: '4px' }}>
                Powered Matching
              </div>
            </div>
            <div style={{
              textAlign: 'center',
              padding: 'var(--spacing-lg)',
              background: 'rgba(168, 85, 247, 0.06)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid rgba(168, 85, 247, 0.12)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
                <Zap size={22} color="var(--accent)" />
              </div>
              <div style={{ fontSize: '1.125rem', fontWeight: '700', color: 'var(--text-primary)', fontFamily: 'Fraunces, serif' }}>Fast</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontFamily: 'DM Sans, sans-serif', marginTop: '4px' }}>
                Fast Results
              </div>
            </div>
            <div style={{
              textAlign: 'center',
              padding: 'var(--spacing-lg)',
              background: 'rgba(16, 185, 129, 0.05)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid rgba(16, 185, 129, 0.1)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
                <CheckCircle2 size={22} color="var(--success)" />
              </div>
              <div style={{ fontSize: '1.125rem', fontWeight: '700', color: 'var(--text-primary)', fontFamily: 'Fraunces, serif' }}>Accurate</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontFamily: 'DM Sans, sans-serif', marginTop: '4px' }}>
                Accurate Matches
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Non-logged-in users see the premium landing page
  return (
    <div style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
      <section style={{ position: 'relative', padding: '110px 0 72px', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 15% 20%, rgba(79, 70, 229, 0.24) 0%, transparent 55%),
            radial-gradient(circle at 80% 70%, rgba(168, 85, 247, 0.18) 0%, transparent 55%),
            linear-gradient(135deg, #0B1020 0%, #0F172A 55%, #111827 100%)
          `,
          zIndex: 0
        }} />

        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            repeating-linear-gradient(
              45deg,
              transparent,
              transparent 10px,
              rgba(255, 255, 255, 0.02) 10px,
              rgba(255, 255, 255, 0.02) 20px
            )
          `,
          opacity: 0.35,
          zIndex: 1
        }} />

        <div className="main-container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1.1fr 0.9fr',
            gap: '48px',
            alignItems: 'center'
          }}>
            <div style={{ minWidth: 0 }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                padding: '8px 12px',
                borderRadius: 999,
                border: '1px solid rgba(255,255,255,0.12)',
                background: 'rgba(255,255,255,0.06)',
                backdropFilter: 'blur(14px)',
                color: 'rgba(248, 250, 252, 0.92)',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: 13,
                fontWeight: 600,
                marginBottom: 18
              }}>
                <Bot size={16} />
                TalentMatch AI – Recruiter-grade matching
              </div>

              <h1 style={{
                margin: 0,
                fontFamily: 'Fraunces, serif',
                fontWeight: 800,
                fontSize: 'clamp(2.2rem, 5vw, 3.9rem)',
                lineHeight: 1.05,
                letterSpacing: '-0.03em',
                color: '#F8FAFC',
                textShadow: '0 10px 40px rgba(0,0,0,0.35)'
              }}>
                Find high-quality candidates and generate AI-powered job matches in seconds
              </h1>

              <p style={{
                marginTop: 18,
                marginBottom: 26,
                maxWidth: 640,
                fontFamily: 'DM Sans, sans-serif',
                fontSize: 'clamp(1rem, 2vw, 1.125rem)',
                lineHeight: 1.75,
                color: 'rgba(248, 250, 252, 0.85)'
              }}>
                Upload resumes, analyze job compatibility, and get instant match scores with skill insights.
              </p>

              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 18 }}>
                <Link to="/register" className="btn-primary-custom" style={{ textDecoration: 'none' }}>
                  Get Started <ArrowRight size={16} />
                </Link>
                <Link to="/login" style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  height: 52,
                  padding: '0 18px',
                  borderRadius: 'var(--radius)',
                  textDecoration: 'none',
                  color: '#F8FAFC',
                  fontFamily: 'DM Sans, sans-serif',
                  fontWeight: 600,
                  border: '1px solid rgba(255,255,255,0.18)',
                  background: 'rgba(255,255,255,0.06)',
                  backdropFilter: 'blur(14px)'
                }}>
                  Login
                </Link>
              </div>

              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', color: 'rgba(248, 250, 252, 0.78)', fontFamily: 'DM Sans, sans-serif', fontSize: 13 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <CheckCircle2 size={16} color="#34D399" />
                  AI-powered matching
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <Clock size={16} color="#A5B4FC" />
                  Real-time insights
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <BadgeCheck size={16} color="#C084FC" />
                  Skill-based scoring
                </span>
              </div>
            </div>

            {/* AI dashboard preview mockup */}
            <div style={{ minWidth: 0 }}>
              <div className="card-custom" style={{
                background: 'rgba(255, 255, 255, 0.94)',
                border: '1px solid rgba(255,255,255,0.30)',
                boxShadow: '0 22px 80px rgba(0,0,0,0.35)',
                overflow: 'hidden'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 16px',
                  borderBottom: '1px solid rgba(15, 23, 42, 0.06)',
                  background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.08), rgba(168, 85, 247, 0.06))'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 999, background: '#EF4444' }} />
                    <div style={{ width: 10, height: 10, borderRadius: 999, background: '#F59E0B' }} />
                    <div style={{ width: 10, height: 10, borderRadius: 999, background: '#10B981' }} />
                    <div style={{ marginLeft: 8, fontFamily: 'DM Sans, sans-serif', fontWeight: 700, color: 'var(--text-primary)' }}>
                      TalentMatch AI
                    </div>
                  </div>
                  <span className="badge-custom badge-primary" style={{ fontSize: 10 }}>AI MATCHES</span>
                </div>

                <div style={{ padding: 16 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 12, marginBottom: 14 }}>
                    <div className="stat-card" style={{ padding: 14 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)', fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        <BriefcaseBusiness size={14} /> Jobs
                      </div>
                      <div className="stat-number" style={{ marginTop: 4, color: 'var(--primary)' }}>12</div>
                    </div>
                    <div className="stat-card" style={{ padding: 14 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)', fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        <ChartNoAxesCombined size={14} /> Matches
                      </div>
                      <div className="stat-number" style={{ marginTop: 4, color: 'var(--accent)' }}>84</div>
                    </div>
                    <div className="stat-card" style={{ padding: 14 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)', fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        <Zap size={14} /> Top score
                      </div>
                      <div className="stat-number" style={{ marginTop: 4, color: 'var(--success)' }}>92%</div>
                    </div>
                  </div>

                  <div style={{ padding: 14, borderRadius: 16, border: '1px solid rgba(15, 23, 42, 0.08)', background: 'white' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 800, color: 'var(--text-primary)' }}>
                          Senior Frontend Engineer
                        </div>
                        <div style={{ marginTop: 2, fontFamily: 'DM Sans, sans-serif', color: 'var(--text-muted)', fontSize: 12 }}>
                          AI insights updated just now
                        </div>
                      </div>
                      <span className="badge-custom badge-success" style={{ fontSize: 10 }}>LIVE</span>
                    </div>

                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 10 }}>
                      <span className="badge-custom badge-primary" style={{ fontSize: 10 }}>React</span>
                      <span className="badge-custom badge-primary" style={{ fontSize: 10 }}>TypeScript</span>
                      <span className="badge-custom badge-primary" style={{ fontSize: 10 }}>Testing</span>
                      <span className="badge-custom badge-neutral" style={{ fontSize: 10 }}>+3</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 12 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                            <BrainCircuit size={14} /> Match score
                          </span>
                          <span style={{ fontWeight: 800, color: 'var(--text-primary)' }}>87%</span>
                        </div>
                        <div className="progress-bar" style={{ width: '100%' }}>
                          <div className="progress-fill" style={{ width: '87%', backgroundColor: 'var(--primary)' }} />
                        </div>
                      </div>
                    </div>

                    <div style={{ marginTop: 12, padding: 12, borderRadius: 14, background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.06), rgba(168, 85, 247, 0.05))', border: '1px solid rgba(79, 70, 229, 0.10)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'DM Sans, sans-serif', fontWeight: 800, fontSize: 12, color: 'var(--text-primary)' }}>
                        <Sparkles size={14} /> Why this match?
                      </div>
                      <div style={{ marginTop: 6, fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                        Strong React + TypeScript alignment and recent project experience matching role requirements.
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
                    <div style={{ padding: 14, borderRadius: 16, border: '1px solid rgba(15, 23, 42, 0.08)', background: 'white' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'DM Sans, sans-serif', fontWeight: 800, fontSize: 12, color: 'var(--text-primary)' }}>
                        <FileUp size={14} /> Resume intake
                      </div>
                      <div style={{ marginTop: 8, height: 10, borderRadius: 999, background: 'rgba(15, 23, 42, 0.06)', overflow: 'hidden' }}>
                        <div className="shimmer" style={{ height: '100%', width: '75%' }} />
                      </div>
                      <div style={{ marginTop: 8, fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'var(--text-muted)' }}>
                        Parsing skills…
                      </div>
                    </div>
                    <div style={{ padding: 14, borderRadius: 16, border: '1px solid rgba(15, 23, 42, 0.08)', background: 'white' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'DM Sans, sans-serif', fontWeight: 800, fontSize: 12, color: 'var(--text-primary)' }}>
                        <BrainCircuit size={14} /> AI reasoning
                      </div>
                      <div style={{ marginTop: 8, fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                        Skill overlap, experience level, and missing-skill gaps.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 44, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            {[
              { icon: <BrainCircuit size={18} color="var(--primary)" />, title: 'AI-powered matching', desc: 'Instant scoring and skill alignment across candidates and roles.' },
              { icon: <ChartNoAxesCombined size={18} color="var(--accent)" />, title: 'Real-time insights', desc: 'Understand fit, gaps, and trends at a glance.' },
              { icon: <Zap size={18} color="#34D399" />, title: 'Fast, recruiter-first', desc: 'Designed to be efficient, clear, and action-oriented.' }
            ].map((f) => (
              <div key={f.title} style={{
                padding: 16,
                borderRadius: 20,
                border: '1px solid rgba(255,255,255,0.10)',
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(14px)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'rgba(248, 250, 252, 0.92)', fontFamily: 'DM Sans, sans-serif', fontWeight: 800 }}>
                  {f.icon} {f.title}
                </div>
                <div style={{ marginTop: 6, color: 'rgba(248, 250, 252, 0.78)', fontFamily: 'DM Sans, sans-serif', fontSize: 13, lineHeight: 1.6 }}>
                  {f.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{
        padding: 'var(--spacing-2xl) 0',
        background: 'linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 100%)',
        position: 'relative'
      }}>
        <div className="main-container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-2xl)' }}>
            <h2 style={{
              fontFamily: 'Fraunces, serif',
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              fontWeight: '700',
              marginBottom: 'var(--spacing-md)',
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Why Choose TalentMatch AI?
            </h2>
            <p style={{
              fontSize: '1.125rem',
              color: 'var(--text-secondary)',
              maxWidth: '600px',
              margin: '0 auto',
              fontFamily: 'DM Sans, sans-serif'
            }}>
              Powerful features that make hiring and job searching effortless
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 'var(--spacing-lg)',
            marginBottom: 'var(--spacing-xl)'
          }}>
            {[
              { icon: <BrainCircuit size={26} color="var(--primary)" />, title: 'AI-Powered Matching', desc: 'Advanced analysis of skills and experience for high-signal matches.' },
              { icon: <Zap size={26} color="var(--accent)" />, title: 'Lightning Fast', desc: 'Get results in seconds, not days. Instant candidate-job compatibility.' },
              { icon: <CheckCircle2 size={26} color="var(--success)" />, title: 'Accurate Results', desc: 'Clarity-first scoring based on skills and experience alignment.' },
              { icon: <ChartNoAxesCombined size={26} color="var(--primary)" />, title: 'Detailed Analytics', desc: 'See match quality, gaps, and trends with recruiter-friendly insights.' },
              { icon: <BadgeCheck size={26} color="var(--accent)" />, title: 'Secure & Private', desc: 'Your data stays protected with modern security best practices.' },
              { icon: <BriefcaseBusiness size={26} color="var(--primary)" />, title: 'Easy Management', desc: 'Clean workflows for jobs, candidates, and AI results.' }
            ].map((feature, idx) => (
              <div key={idx} className="card-custom" style={{
                padding: 'var(--spacing-lg)',
                textAlign: 'center',
                transition: 'var(--transition)',
                animation: `slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${0.1 * idx}s both`
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
              }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--spacing-sm)' }}>{feature.icon}</div>
                <h3 style={{
                  fontFamily: 'Fraunces, serif',
                  fontSize: '1.25rem',
                  marginBottom: 'var(--spacing-xs)',
                  color: 'var(--text-primary)'
                }}>{feature.title}</h3>
                <p style={{
                  color: 'var(--text-secondary)',
                  fontSize: '0.9375rem',
                  lineHeight: '1.6',
                  fontFamily: 'DM Sans, sans-serif'
                }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: 'var(--spacing-2xl) 0',
        background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
          opacity: 0.5
        }} />
        <div className="main-container" style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <h2 style={{
            fontFamily: 'Fraunces, serif',
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: '700',
            marginBottom: 'var(--spacing-md)',
            color: '#F8FAFC'
          }}>
            Ready to Transform Your Hiring Process?
          </h2>
          <p style={{
            fontSize: '1.125rem',
            color: 'rgba(248, 250, 252, 0.9)',
            marginBottom: 'var(--spacing-xl)',
            maxWidth: '600px',
            margin: '0 auto var(--spacing-xl)',
            fontFamily: 'DM Sans, sans-serif'
          }}>
            Join thousands of recruiters and candidates who trust TalentMatch AI
          </p>
          <div style={{ display: 'flex', gap: 'var(--spacing-md)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn-primary-custom" style={{
              background: 'white',
              color: 'var(--primary)',
              textDecoration: 'none',
              fontSize: '1.125rem',
              padding: '16px 32px'
            }}>
              Get Started <ArrowRight size={16} />
            </Link>
            <Link to="/login" style={{
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              padding: '16px 32px',
              borderRadius: 'var(--radius)',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '1.125rem',
              fontFamily: 'DM Sans, sans-serif',
              transition: 'var(--transition-fast)'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.1)';
            }}>
              Sign In
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
