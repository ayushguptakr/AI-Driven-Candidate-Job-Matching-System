import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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
            <div style={{
              fontSize: '4rem',
              marginBottom: 'var(--spacing-md)',
              animation: 'scaleIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both'
            }}>
              👋
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
            onClick={() => navigate(user.role === 'recruiter' ? '/recruiter' : '/candidate')}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
            }}>
              <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>
                {user.role === 'recruiter' ? '👔' : '👨💼'}
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
                Open Dashboard →
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
              <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>👤</div>
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
                Manage Profile →
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
              background: 'rgba(13, 148, 136, 0.05)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid rgba(13, 148, 136, 0.1)'
            }}>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--primary)', fontFamily: 'Fraunces, serif' }}>
                AI
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontFamily: 'DM Sans, sans-serif', marginTop: '4px' }}>
                Powered Matching
              </div>
            </div>
            <div style={{
              textAlign: 'center',
              padding: 'var(--spacing-lg)',
              background: 'rgba(255, 107, 107, 0.05)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid rgba(255, 107, 107, 0.1)'
            }}>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--accent)', fontFamily: 'Fraunces, serif' }}>
                ⚡
              </div>
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
              <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--success)', fontFamily: 'Fraunces, serif' }}>
                🎯
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontFamily: 'DM Sans, sans-serif', marginTop: '4px' }}>
                Accurate Matches
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Non-logged-in users see the engaging landing page
  return (
    <div style={{
      position: 'relative',
      minHeight: '100vh',
      overflow: 'hidden'
    }}>
      {/* Hero Section */}
      <section style={{
        position: 'relative',
        padding: '120px 0 80px',
        minHeight: '90vh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden'
      }}>
        {/* Animated Background */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 15% 20%, rgba(13, 148, 136, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 85% 60%, rgba(255, 107, 107, 0.12) 0%, transparent 50%),
            radial-gradient(circle at 50% 80%, rgba(20, 184, 166, 0.08) 0%, transparent 50%),
            linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%)
          `,
          zIndex: 0
        }} />
        
        {/* Animated geometric pattern */}
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
          opacity: 0.4,
          zIndex: 1,
          animation: 'shimmer 8s linear infinite'
        }} />

        {/* Floating elements */}
        <div style={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          width: '100px',
          height: '100px',
          background: 'rgba(13, 148, 136, 0.1)',
          borderRadius: '50%',
          filter: 'blur(40px)',
          animation: 'float 6s ease-in-out infinite',
          zIndex: 1
        }} />
        <div style={{
          position: 'absolute',
          bottom: '20%',
          right: '10%',
          width: '150px',
          height: '150px',
          background: 'rgba(255, 107, 107, 0.1)',
          borderRadius: '50%',
          filter: 'blur(50px)',
          animation: 'float 8s ease-in-out infinite reverse',
          zIndex: 1
        }} />
        
        <div className="main-container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ textAlign: 'center', maxWidth: '900px', margin: '0 auto' }}>
            <h1 className="page-title" style={{
              fontSize: 'clamp(2.5rem, 8vw, 5rem)',
              fontWeight: '800',
              marginBottom: '32px',
              color: '#F8FAFC',
              textShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
              animation: 'fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
              lineHeight: '1.1'
            }}>
              🚀 AI-Driven Job Matching
            </h1>
            <h2 style={{
              fontSize: 'clamp(1.25rem, 4vw, 2rem)',
              fontWeight: '600',
              marginBottom: '24px',
              color: 'rgba(248, 250, 252, 0.95)',
              fontFamily: 'DM Sans, sans-serif',
              animation: 'fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both'
            }}>
              Connect Talent with Opportunity
            </h2>
            <p style={{
              fontSize: 'clamp(1rem, 2vw, 1.25rem)',
              marginBottom: '48px',
              color: 'rgba(248, 250, 252, 0.9)',
              maxWidth: '700px',
              margin: '0 auto 48px',
              lineHeight: '1.8',
              fontFamily: 'DM Sans, sans-serif',
              animation: 'fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s both'
            }}>
              Our intelligent platform uses AI to analyze resumes and match candidates with the perfect job opportunities. 
              Faster, smarter, and more accurate than traditional hiring methods.
            </p>
            
            <div className="grid-2" style={{
              maxWidth: '700px',
              margin: '0 auto',
              gap: '32px',
              animation: 'fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.6s both'
            }}>
              <div className="card-custom animate-delay-1" style={{
                padding: '40px 32px',
                textAlign: 'center',
                background: 'rgba(255, 255, 255, 0.98)',
                backdropFilter: 'blur(20px)',
                cursor: 'pointer',
                transition: 'var(--transition)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
              }}>
                <div style={{
                  fontSize: '4.5rem',
                  marginBottom: '24px',
                  filter: 'drop-shadow(0 4px 8px rgba(13, 148, 136, 0.2))',
                  animation: 'scaleIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.7s both'
                }}>👔</div>
                <h3 style={{
                  color: 'var(--text-primary)',
                  marginBottom: '12px',
                  fontFamily: 'Fraunces, serif',
                  fontSize: '1.5rem'
                }}>For Recruiters</h3>
                <p style={{
                  color: 'var(--text-secondary)',
                  marginBottom: '32px',
                  fontFamily: 'DM Sans, sans-serif',
                  lineHeight: '1.6'
                }}>
                  Post jobs and find perfect candidates with AI-powered matching
                </p>
                <Link to="/register" className="btn-primary-custom w-full" style={{ textDecoration: 'none', display: 'block' }}>
                  Get Started →
                </Link>
              </div>
              
              <div className="card-custom animate-delay-2" style={{
                padding: '40px 32px',
                textAlign: 'center',
                background: 'rgba(255, 255, 255, 0.98)',
                backdropFilter: 'blur(20px)',
                cursor: 'pointer',
                transition: 'var(--transition)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
              }}>
                <div style={{
                  fontSize: '4.5rem',
                  marginBottom: '24px',
                  filter: 'drop-shadow(0 4px 8px rgba(255, 107, 107, 0.2))',
                  animation: 'scaleIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.8s both'
                }}>👨💼</div>
                <h3 style={{
                  color: 'var(--text-primary)',
                  marginBottom: '12px',
                  fontFamily: 'Fraunces, serif',
                  fontSize: '1.5rem'
                }}>For Candidates</h3>
                <p style={{
                  color: 'var(--text-secondary)',
                  marginBottom: '32px',
                  fontFamily: 'DM Sans, sans-serif',
                  lineHeight: '1.6'
                }}>
                  Upload your resume and discover matching opportunities
                </p>
                <Link to="/register" className="btn-primary-custom w-full" style={{ textDecoration: 'none', display: 'block' }}>
                  Get Started →
                </Link>
              </div>
            </div>
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
              { icon: '🤖', title: 'AI-Powered Matching', desc: 'Advanced algorithms analyze skills and experience for perfect matches' },
              { icon: '⚡', title: 'Lightning Fast', desc: 'Get results in seconds, not days. Instant candidate-job compatibility scores' },
              { icon: '🎯', title: 'Accurate Results', desc: 'Precision matching based on skills, experience, and requirements' },
              { icon: '📊', title: 'Detailed Analytics', desc: 'Comprehensive insights into match quality and candidate fit' },
              { icon: '🔒', title: 'Secure & Private', desc: 'Your data is protected with enterprise-grade security' },
              { icon: '💼', title: 'Easy Management', desc: 'Intuitive dashboard for managing jobs and applications' }
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
                <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-sm)' }}>{feature.icon}</div>
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
              Get Started Free →
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
