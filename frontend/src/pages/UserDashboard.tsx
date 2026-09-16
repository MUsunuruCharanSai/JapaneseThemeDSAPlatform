import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ProfileModal from '../components/ProfileModal';
import DSAViewer from '../components/DSAViewer';
import FocusTimer from '../components/FocusTimer';
import JapaneseBackgroundMusic from '../components/JapaneseBackgroundMusic';

const UserDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const [currentView, setCurrentView] = useState<'profile' | 'dsa'>('profile');
  const [sidebarOpen, setSidebarOpen] = useState(false);


  // Parallax effect on scroll
  useEffect(() => {
    if (currentView !== 'profile') return;

    const handleScroll = () => {
      const parallaxElement = document.querySelector('.background-image-parallax') as HTMLElement;
      if (parallaxElement) {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.3; // Parallax speed (adjust for desired effect)
        parallaxElement.style.transform = `translate3d(0, ${rate}px, 0)`;
      }
    };

    // Throttle scroll events for performance
    let ticking = false;
    const optimizedScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', optimizedScroll, { passive: true });
    return () => window.removeEventListener('scroll', optimizedScroll);
  }, [currentView]);


  const handleLogout = async () => {
    try {
      await logout();
    } catch {}
  };

  const handleProfileClose = () => {
    setShowProfile(false);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleDSASheetClick = () => {
    // Handle DSA Sheet navigation
    setCurrentView('dsa');
    setSidebarOpen(false);
  };

  const handleStartFocusMode = () => {
    setCurrentView('dsa');
    setSidebarOpen(false);
  };

  const handleHomeClick = () => {
    setCurrentView('profile');
    setSidebarOpen(false);
  };

  const handleCodingContestClick = () => {
    navigate('/coding-contest');
    setSidebarOpen(false);
  };

  const handleAboutCreatorClick = () => {
    navigate('/about-creator');
    setSidebarOpen(false);
  };

  return (
    <div className="dashboard">
      {/* Sidebar Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="sidebar-toggle"
        style={{
          position: 'fixed',
          top: '20px',
          left: '20px',
          zIndex: 1002,
          background: 'linear-gradient(135deg, #8b5a3c 0%, #6b4423 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          padding: '12px',
          cursor: 'pointer',
          fontSize: '18px',
          boxShadow: '0 4px 14px rgba(139, 90, 60, 0.35)',
          transition: 'all 0.3s ease'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(139, 90, 60, 0.45)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 14px rgba(139, 90, 60, 0.35)';
        }}
      >
        ☰
      </button>

      {/* Profile Icon */}
      <button
        onClick={() => setShowProfile(true)}
        className="profile-icon"
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 1002,
          width: '48px',
          height: '48px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          border: '3px solid rgba(255, 255, 255, 0.8)',
          borderRadius: '50%',
          cursor: 'pointer',
          fontSize: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 14px rgba(102, 126, 234, 0.35)',
          transition: 'all 0.3s ease'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.5)';
          e.currentTarget.style.borderColor = 'white';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 14px rgba(102, 126, 234, 0.35)';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.8)';
        }}
        title="View Profile"
      >
        👤
      </button>

      {/* Sidebar */}
      <div
        className={`sidebar ${sidebarOpen ? 'open' : ''}`}
        style={{
          position: 'fixed',
          top: '0',
          left: '0',
          width: '280px',
          height: '100vh',
          background: 'linear-gradient(180deg, #f5f1e8 0%, #e8dcc0 50%, #d4c4a8 100%)',
          boxShadow: '2px 0 20px rgba(0, 0, 0, 0.1)',
          zIndex: '1000',
          transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s ease',
          display: 'flex',
          flexDirection: 'column',
          padding: '80px 0 20px 0'
        }}
      >
        {/* Background Overlay for Text Readability */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
            backdropFilter: 'blur(0.3px)',
            zIndex: 0
          }}
        />

        {/* Menu Items */}
        <div style={{ flex: '1', padding: '0 20px', position: 'relative', zIndex: 1 }}>
          <div
            className="sidebar-item"
            onClick={handleHomeClick}
            style={{
              padding: '16px 20px',
              margin: '10px 0',
              borderRadius: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontSize: '16px',
              fontWeight: '500',
              color: currentView === 'profile' ? '#8b5a3c' : '#2d3748',
              transition: 'all 0.3s ease',
              background: currentView === 'profile' ? 'rgba(139, 90, 60, 0.15)' : 'rgba(255, 255, 255, 0.08)',
              border: currentView === 'profile' ? '1px solid rgba(139, 90, 60, 0.3)' : 'none',
              backdropFilter: 'blur(10px)'
            }}
            onMouseOver={(e) => {
              if (currentView !== 'profile') {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                e.currentTarget.style.transform = 'translateX(5px)';
                e.currentTarget.style.border = '1px solid rgba(139, 90, 60, 0.2)';
              }
            }}
            onMouseOut={(e) => {
              if (currentView !== 'profile') {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.transform = 'translateX(0)';
                e.currentTarget.style.border = 'none';
              }
            }}
          >
            🏠 Home
          </div>

          <div
            className="sidebar-item"
            onClick={handleDSASheetClick}
            style={{
              padding: '16px 20px',
              margin: '10px 0',
              borderRadius: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontSize: '16px',
              fontWeight: '500',
              color: currentView === 'dsa' ? '#8b5a3c' : '#2d3748',
              transition: 'all 0.3s ease',
              background: currentView === 'dsa' ? 'rgba(139, 90, 60, 0.15)' : 'rgba(255, 255, 255, 0.08)',
              border: currentView === 'dsa' ? '1px solid rgba(139, 90, 60, 0.3)' : 'none',
              backdropFilter: 'blur(10px)'
            }}
            onMouseOver={(e) => {
              if (currentView !== 'dsa') {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                e.currentTarget.style.transform = 'translateX(5px)';
                e.currentTarget.style.border = '1px solid rgba(139, 90, 60, 0.2)';
              }
            }}
            onMouseOut={(e) => {
              if (currentView !== 'dsa') {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.transform = 'translateX(0)';
                e.currentTarget.style.border = 'none';
              }
            }}
          >
            📋 DSA Sheet
          </div>

          <div
            className="sidebar-item"
            onClick={handleCodingContestClick}
            style={{
              padding: '16px 20px',
              margin: '10px 0',
              borderRadius: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontSize: '16px',
              fontWeight: '500',
              color: '#2d3748',
              transition: 'all 0.3s ease',
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              backdropFilter: 'blur(10px)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
              e.currentTarget.style.transform = 'translateX(5px)';
              e.currentTarget.style.border = '1px solid rgba(139, 90, 60, 0.2)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.transform = 'translateX(0)';
              e.currentTarget.style.border = 'none';
            }}
          >
            🏆 Coding Contest
          </div>

          <div
            className="sidebar-item"
            onClick={handleAboutCreatorClick}
            style={{
              padding: '16px 20px',
              margin: '10px 0',
              borderRadius: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontSize: '16px',
              fontWeight: '500',
              color: '#2d3748',
              transition: 'all 0.3s ease',
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              backdropFilter: 'blur(10px)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                e.currentTarget.style.transform = 'translateX(5px)';
              e.currentTarget.style.border = '1px solid rgba(139, 90, 60, 0.2)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.transform = 'translateX(0)';
              e.currentTarget.style.border = 'none';
            }}
          >
            👨‍💻 About Creator
          </div>
        </div>

        {/* Logout Button at Bottom */}
        <div style={{ padding: '0 20px', position: 'relative', zIndex: 1 }}>
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: '16px 20px',
              background: 'rgba(139, 90, 60, 0.15)',
              color: '#5a4a3a',
              border: '1px solid rgba(139, 90, 60, 0.3)',
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              backdropFilter: 'blur(10px)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(139, 90, 60, 0.25)';
              e.currentTarget.style.borderColor = 'rgba(139, 90, 60, 0.4)';
              e.currentTarget.style.color = '#4a3a2a';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(139, 90, 60, 0.15)';
              e.currentTarget.style.borderColor = 'rgba(139, 90, 60, 0.3)';
              e.currentTarget.style.color = '#5a4a3a';
            }}
          >
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          onClick={toggleSidebar}
          style={{
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100vw',
            height: '100vh',
            background: 'rgba(0, 0, 0, 0.3)',
            zIndex: '999',
            backdropFilter: 'blur(2px)'
          }}
        />
      )}

      {/* Main Content */}
      {currentView === 'profile' ? (
        <div className="profile-background-container" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: '100vh',
          overflow: 'auto',
          zIndex: 0
        }}>
          {/* Full-Screen Background Image with Parallax */}
        <div
            className="background-image-parallax"
          style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: 0,
              willChange: 'transform'
          }}
        >
            <img 
              src="/images/Japan 1.webp" 
              alt="Japanese Temple at Dusk"
              className="background-image"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
                display: 'block'
              }}
            />
            {/* Dark Overlay for Text Readability */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.6) 100%)',
              backdropFilter: 'blur(0.5px)'
            }}></div>
          </div>

          {/* Content Container */}
          <div style={{
            position: 'relative',
            zIndex: 1,
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '80px 20px 40px 20px',
            gap: '48px'
            }}>
            {/* Inspirational Quote Section */}
            <div className="quote-container" style={{
              maxWidth: '900px',
              width: '100%',
              textAlign: 'center',
              padding: '0 20px',
              position: 'relative'
            }}>
              <blockquote className="inspirational-quote" style={{
                fontSize: 'clamp(24px, 4vw, 42px)',
                fontWeight: '300',
                lineHeight: '1.6',
                color: '#ffffff',
                margin: 0,
                fontFamily: '"Inter", "Segoe UI", -apple-system, BlinkMacSystemFont, sans-serif',
                letterSpacing: '-0.02em',
                textShadow: '0 2px 20px rgba(0, 0, 0, 0.5), 0 4px 40px rgba(0, 0, 0, 0.3)',
                position: 'relative',
                zIndex: 2
              }}>
                <span className="quote-text" style={{
                  display: 'block',
                  marginBottom: '24px',
                  opacity: 0,
                  animation: 'fadeInUp 1.2s ease-out 0.3s forwards'
                }}>
                  "Every great developer you know got there by solving problems they were unqualified to solve until they actually did it."
              </span>
                <cite className="quote-author" style={{
                  display: 'block',
                  fontSize: 'clamp(16px, 2vw, 20px)',
                  fontWeight: '400',
                  fontStyle: 'normal',
                  color: 'rgba(255, 255, 255, 0.9)',
                  marginTop: '32px',
                  opacity: 0,
                  animation: 'fadeInUp 1.2s ease-out 0.8s forwards',
                  position: 'relative',
                  paddingTop: '24px'
                }}>
                  <span style={{
                    display: 'inline-block',
                    width: '60px',
                    height: '2px',
                    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent)',
                    position: 'absolute',
                    top: 0,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    animation: 'expandLine 1s ease-out 1.2s forwards'
                  }}></span>
                  – Patrick McKenzie
                </cite>
              </blockquote>
              
              {/* Floating Glow Effect */}
              <div className="quote-glow" style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '120%',
                height: '120%',
                background: 'radial-gradient(circle, rgba(102, 126, 234, 0.15) 0%, transparent 70%)',
                borderRadius: '50%',
                animation: 'floatGlow 6s ease-in-out infinite',
                pointerEvents: 'none',
                zIndex: 1
              }}></div>
          </div>
            {/* Focus Timer - Samurai Era Aesthetic */}
            <FocusTimer onStartDSA={handleStartFocusMode} />
        </div>
        </div>
      ) : (
        <DSAViewer />
      )}

      {/* Profile Modal */}
      {showProfile && (
        <ProfileModal
          user={user}
          onClose={handleProfileClose}
        />
      )}

      {/* Japanese Background Music */}
      <JapaneseBackgroundMusic autoPlay={true} />

      <style>
        {`
          .sidebar-toggle {
            animation: pulse 2s infinite;
            position: relative;
            z-index: 1002;
          }

          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }

          .sidebar {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            position: relative;
            z-index: 1001;
          }

          /* Sidebar responsive adjustments */
          @media (max-width: 768px) {
            .sidebar {
              width: 260px !important;
            }
          }

          @media (max-width: 480px) {
            .sidebar {
              width: 240px !important;
            }
          }

          .sidebar-item {
            user-select: none;
          }

          .profile-background-container {
            position: relative;
          }

          /* Parallax Effect for Background */
          .background-image-parallax {
            transform: translateZ(0);
            backface-visibility: hidden;
            perspective: 1000px;
          }

          .background-image {
            transform: translateZ(0);
            will-change: transform;
          }

          /* Smooth Scroll Parallax */
          @media (prefers-reduced-motion: no-preference) {
            .profile-background-container {
              scroll-behavior: smooth;
            }
            
            .background-image-parallax {
              transition: transform 0.1s ease-out;
            }
          }

          /* Fade In and Slide Up Animation */
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          /* Expand Line Animation */
          @keyframes expandLine {
            from {
              width: 0;
              opacity: 0;
            }
            to {
              width: 60px;
              opacity: 1;
            }
          }

          /* Floating Glow Animation */
          @keyframes floatGlow {
            0%, 100% {
              transform: translate(-50%, -50%) scale(1);
              opacity: 0.3;
            }
            50% {
              transform: translate(-50%, -50%) scale(1.1);
              opacity: 0.5;
            }
          }

          /* Subtle Text Glow Animation */
          @keyframes textGlow {
            0%, 100% {
              text-shadow: 0 2px 20px rgba(0, 0, 0, 0.5), 0 4px 40px rgba(0, 0, 0, 0.3);
            }
            50% {
              text-shadow: 0 2px 20px rgba(0, 0, 0, 0.5), 0 4px 40px rgba(0, 0, 0, 0.3), 0 0 30px rgba(102, 126, 234, 0.2);
            }
          }

          .inspirational-quote {
            animation: textGlow 4s ease-in-out infinite;
          }

          .profile-card {
            transition: all 0.3s ease;
          }

          /* Parallax on Scroll */
          @media (prefers-reduced-motion: no-preference) {
            .profile-background-container {
              overflow-y: auto;
              overflow-x: hidden;
            }
          }

          /* Tablet responsive */
          @media (max-width: 768px) {
            .profile-card {
              max-width: 340px !important;
              padding: 28px 24px !important;
            }

            .quote-container {
              padding: 0 16px !important;
            }

            .inspirational-quote {
              font-size: clamp(20px, 5vw, 32px) !important;
            }

            .quote-author {
              font-size: clamp(14px, 3vw, 18px) !important;
            }

            .profile-card h2 {
              font-size: 20px !important;
            }

            .profile-card p {
              font-size: 13px !important;
            }

            .profile-card button {
              font-size: 13px !important;
              padding: 11px 18px !important;
            }
          }

          /* Mobile responsive */
          @media (max-width: 480px) {
            .profile-card {
              max-width: 320px !important;
              padding: 24px 20px !important;
            }

            .profile-card h2 {
              font-size: 20px !important;
            }

            .profile-card p {
              font-size: 13px !important;
            }

            .quote-container {
              padding: 0 12px !important;
            }

            .inspirational-quote {
              font-size: clamp(18px, 6vw, 28px) !important;
              line-height: 1.5 !important;
            }

            .quote-author {
              font-size: clamp(13px, 4vw, 16px) !important;
              margin-top: 24px !important;
            }

            .profile-card h2 {
              font-size: 18px !important;
            }

            .profile-card p {
              font-size: 12px !important;
              max-width: 240px !important;
            }

            .profile-card button {
              font-size: 14px !important;
              padding: 12px 18px !important;
            }
          }

          /* Extra small mobile */
          @media (max-width: 320px) {
            .profile-card {
              max-width: 280px !important;
              padding: 20px 16px !important;
            }

            .profile-card h2 {
              font-size: 18px !important;
            }

            .profile-card p {
              font-size: 12px !important;
            }

            .quote-container {
              padding: 0 10px !important;
            }

            .inspirational-quote {
              font-size: clamp(16px, 7vw, 24px) !important;
              line-height: 1.4 !important;
            }

            .quote-author {
              font-size: clamp(12px, 5vw, 14px) !important;
              margin-top: 20px !important;
            }
          }

          /* Performance optimizations */
          .background-image-parallax,
          .background-image {
            transform: translateZ(0);
            will-change: transform;
            backface-visibility: hidden;
          }

          /* Reduce motion for accessibility */
          @media (prefers-reduced-motion: reduce) {
            .background-image-parallax {
              transform: none !important;
            }
            
            .quote-text,
            .quote-author,
            .profile-card {
              animation: none !important;
              opacity: 1 !important;
              transform: none !important;
            }

            .quote-glow {
              animation: none !important;
            }

            .inspirational-quote {
              animation: none !important;
            }
            }

            .profile-card h2 {
              font-size: 16px !important;
            }

            .profile-card p {
              font-size: 11px !important;
              max-width: 220px !important;
            }

            .profile-card button {
              font-size: 13px !important;
              padding: 10px 16px !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default UserDashboard;
