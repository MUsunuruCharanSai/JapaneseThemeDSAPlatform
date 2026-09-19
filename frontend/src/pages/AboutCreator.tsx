import React from 'react';
import { useNavigate } from 'react-router-dom';

const AboutCreator: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
      overflowY: 'auto',
      zIndex: 1
    }}>
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          background: 'rgba(255, 255, 255, 0.9)',
          border: '1px solid rgba(0, 0, 0, 0.1)',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          fontSize: '18px',
          color: '#4a5568',
          transition: 'all 0.2s ease',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          zIndex: 10
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 1)';
          e.currentTarget.style.transform = 'scale(1.05)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        ←
      </button>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: '40px'
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '20px',
          animation: 'fadeInDown 0.8s ease-out'
        }}>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: '700',
            color: 'white',
            marginBottom: '16px',
            fontFamily: "'Inter', sans-serif",
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
          }}>
            Meet Our Creator
          </h1>
          <p style={{
            fontSize: '1.2rem',
            color: 'rgba(255, 255, 255, 0.9)',
            fontWeight: '400',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            The person behind コードアリーナ who brings creativity and technical excellence together.
          </p>
        </div>

        {/* Profile Cards Container */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '40px',
          maxWidth: '1200px',
          width: '100%',
          padding: '0 20px'
        }}>
          {/* First Profile - M Charan Sai */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            padding: '40px 30px',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            maxWidth: '400px',
            width: '100%',
            textAlign: 'center',
            transition: 'all 0.3s ease',
            animation: 'fadeInUp 0.8s ease-out 0.2s both',
            cursor: 'pointer'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px)';
            e.currentTarget.style.boxShadow = '0 35px 70px rgba(0, 0, 0, 0.2)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.15)';
          }}
          >
            <div style={{
              width: '150px',
              height: '150px',
              borderRadius: '20px',
              overflow: 'hidden',
              margin: '0 auto 24px',
              border: '4px solid rgba(102, 126, 234, 0.3)',
              boxShadow: '0 8px 25px rgba(102, 126, 234, 0.2)'
            }}>
              <img
                src="/images/Charan Sai.jpg"
                alt="M Charan Sai"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  objectPosition: 'center',
                  display: 'block'
                }}
              />
            </div>
            <h2 style={{
              fontSize: '1.8rem',
              fontWeight: '700',
              color: '#2d3748',
              marginBottom: '8px',
              fontFamily: "'Inter', sans-serif"
            }}>
              M Charan Sai
            </h2>
            <p style={{
              fontSize: '1rem',
              color: '#4a5568',
              fontWeight: '500',
              marginBottom: '16px',
              lineHeight: '1.5'
            }}>
              UI/UX Designer & Full Stack Developer
            </p>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '12px'
            }}>
              <span style={{
                padding: '6px 16px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: '600'
              }}>
                🎨 Design
              </span>
              <span style={{
                padding: '6px 16px',
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                color: 'white',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: '600'
              }}>
                💻 Code
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

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

        @media (max-width: 768px) {
          .profile-container {
            flex-direction: column;
            gap: 30px;
          }
        }
      `}</style>
    </div>
  );
};

export default AboutCreator;
