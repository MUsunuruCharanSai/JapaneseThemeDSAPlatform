import React from 'react';
import { useTimer } from '../contexts/TimerContext';

interface FocusTimerProps {
  onStartDSA: () => void;
}

const FocusTimer: React.FC<FocusTimerProps> = ({ onStartDSA }) => {
  const { elapsedTime, formatTime } = useTimer();


  return (
    <div
      className="focus-timer-card"
      style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(25px)',
        padding: '35px 28px',
        borderRadius: '20px',
        boxShadow: '0 16px 32px rgba(0, 0, 0, 0.12), 0 6px 12px rgba(139, 90, 60, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
        textAlign: 'center',
        width: '100%',
        maxWidth: '360px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid rgba(139, 90, 60, 0.15)',
        opacity: 0,
        animation: 'cardFadeIn 1.2s ease-out 1.2s forwards',
        transform: 'translateY(40px) scale(0.95)',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
      }}
    >
      {/* Elegant gradient background overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, rgba(139, 90, 60, 0.03) 0%, rgba(107, 68, 35, 0.02) 50%, rgba(139, 90, 60, 0.03) 100%)',
        zIndex: 0,
        borderRadius: '24px'
      }}></div>

      {/* Focus Mode Text */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        marginBottom: '30px',
        textAlign: 'center',
        animation: 'textSlideIn 0.8s ease-out 1.8s forwards',
        opacity: 0,
        transform: 'translateY(-20px)'
      }}>
        <        h2 style={{
          fontSize: '1.8rem',
          fontWeight: '200',
          color: '#2d3748',
          margin: '0 0 10px 0',
          letterSpacing: '0.08em',
          textShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          fontFamily: "'Inter', serif",
          lineHeight: '1.2'
        }}>
          集中モード
        </h2>
        <p style={{
          fontSize: '1rem',
          fontWeight: '400',
          color: '#8b5a3c',
          margin: 0,
          letterSpacing: '0.03em',
          textShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          opacity: 0.9
        }}>
          Focus Mode On
        </p>
      </div>

      {/* Circular Timer Display */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        marginBottom: '35px',
        animation: 'timerScaleIn 1s ease-out 2.2s forwards',
        opacity: 0,
        transform: 'scale(0.8)'
      }}>
        {/* Outer ring */}
        <div style={{
          width: '180px',
          height: '180px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(248, 250, 252, 0.8))',
          border: '3px solid rgba(139, 90, 60, 0.2)',
          boxShadow: '0 8px 24px rgba(139, 90, 60, 0.12), inset 0 2px 8px rgba(255, 255, 255, 0.6), inset 0 -2px 8px rgba(139, 90, 60, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          backdropFilter: 'blur(10px)'
        }}>
          {/* Inner content */}
          <div style={{
            textAlign: 'center',
            position: 'relative',
            zIndex: 1
          }}>
            <div style={{
              fontSize: '2.6rem',
              fontWeight: '200',
              color: '#1a202c',
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              letterSpacing: '0.05em',
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              marginBottom: '8px',
              lineHeight: '1'
            }}>
              {formatTime(elapsedTime)}
            </div>
            <div style={{
              fontSize: '1rem',
              color: '#8b5a3c',
              fontWeight: '500',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              opacity: 0.8,
              fontFamily: 'inherit'
            }}>
              Session Time
            </div>
          </div>

          {/* Animated progress ring */}
          <div style={{
            position: 'absolute',
            top: '-3px',
            left: '-3px',
            width: '186px',
            height: '186px',
            borderRadius: '50%',
            background: 'transparent'
          }}>
            <svg
              width="186"
              height="186"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                transform: 'rotate(-90deg)'
              }}
            >
              <circle
                cx="93"
                cy="93"
                r="88"
                stroke="rgba(139, 90, 60, 0.15)"
                strokeWidth="3"
                fill="none"
              />
              <circle
                cx="93"
                cy="93"
                r="88"
                stroke="url(#timerGradient)"
                strokeWidth="3"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 88}`}
                strokeDashoffset={`${2 * Math.PI * 88 * (1 - (elapsedTime % 60) / 60)}`}
                style={{
                  transition: 'stroke-dashoffset 1s ease-out',
                  filter: 'drop-shadow(0 0 6px rgba(139, 90, 60, 0.3))'
                }}
              />
              <defs>
                <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgba(139, 90, 60, 0.6)" />
                  <stop offset="50%" stopColor="rgba(107, 68, 35, 0.8)" />
                  <stop offset="100%" stopColor="rgba(139, 90, 60, 0.6)" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Floating particles effect */}
          <div style={{
            position: 'absolute',
            top: '20%',
            left: '20%',
            width: '4px',
            height: '4px',
            background: 'rgba(139, 90, 60, 0.4)',
            borderRadius: '50%',
            animation: 'particleFloat1 8s ease-in-out infinite'
          }}></div>
          <div style={{
            position: 'absolute',
            top: '70%',
            right: '25%',
            width: '3px',
            height: '3px',
            background: 'rgba(139, 90, 60, 0.3)',
            borderRadius: '50%',
            animation: 'particleFloat2 10s ease-in-out infinite'
          }}></div>
          <div style={{
            position: 'absolute',
            bottom: '25%',
            left: '15%',
            width: '2px',
            height: '2px',
            background: 'rgba(139, 90, 60, 0.5)',
            borderRadius: '50%',
            animation: 'particleFloat3 12s ease-in-out infinite'
          }}></div>
        </div>
      </div>

      {/* Let's Start Button */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        width: '100%',
        animation: 'buttonSlideUp 0.8s ease-out 2.8s forwards',
        opacity: 0,
        transform: 'translateY(20px)'
      }}>
        <button
          onClick={onStartDSA}
          style={{
            width: '100%',
            padding: '16px 24px',
            background: 'linear-gradient(135deg, #8b5a3c 0%, #6b4423 100%)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '16px',
            cursor: 'pointer',
            fontSize: '1.2rem',
            fontWeight: '600',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            boxShadow: '0 6px 20px rgba(139, 90, 60, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
            position: 'relative',
            overflow: 'hidden',
            fontFamily: 'inherit',
            letterSpacing: '0.02em',
            textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(10px)'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
            e.currentTarget.style.boxShadow = '0 12px 28px rgba(139, 90, 60, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(139, 90, 60, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
          }}
        >
          <span style={{
            position: 'relative',
            zIndex: 1,
            fontSize: '1.4rem',
            animation: 'swordGlow 2s ease-in-out infinite'
          }}>
            ⚔️
          </span>
          <span style={{
            position: 'relative',
            zIndex: 1
          }}>
            Let's Start
          </span>
          <div style={{
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.25), transparent)',
            transition: 'left 0.8s ease',
            zIndex: 0
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.left = '100%';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.left = '-100%';
          }}
          ></div>
        </button>
      </div>

      <style>
        {`
          @keyframes cardFadeIn {
            from {
              opacity: 0;
              transform: translateY(40px) scale(0.95);
              filter: blur(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
              filter: blur(0);
            }
          }

          @keyframes textSlideIn {
            from {
              opacity: 0;
              transform: translateY(-20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes timerScaleIn {
            from {
              opacity: 0;
              transform: scale(0.8) rotate(-5deg);
            }
            to {
              opacity: 1;
              transform: scale(1) rotate(0deg);
            }
          }

          @keyframes buttonSlideUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes progressRing {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }

          @keyframes particleFloat1 {
            0%, 100% {
              transform: translateY(0) translateX(0);
              opacity: 0.4;
            }
            25% {
              transform: translateY(-15px) translateX(10px);
              opacity: 0.8;
            }
            50% {
              transform: translateY(-8px) translateX(-5px);
              opacity: 0.6;
            }
            75% {
              transform: translateY(-20px) translateX(8px);
              opacity: 0.9;
            }
          }

          @keyframes particleFloat2 {
            0%, 100% {
              transform: translateY(0) translateX(0);
              opacity: 0.3;
            }
            33% {
              transform: translateY(-12px) translateX(-8px);
              opacity: 0.7;
            }
            66% {
              transform: translateY(-6px) translateX(12px);
              opacity: 0.5;
            }
          }

          @keyframes particleFloat3 {
            0%, 100% {
              transform: translateY(0) translateX(0);
              opacity: 0.5;
            }
            50% {
              transform: translateY(-18px) translateX(6px);
              opacity: 1;
            }
          }

          @keyframes swordGlow {
            0%, 100% {
              filter: drop-shadow(0 0 4px rgba(139, 90, 60, 0.3));
              transform: scale(1);
            }
            50% {
              filter: drop-shadow(0 0 8px rgba(139, 90, 60, 0.6));
              transform: scale(1.1);
            }
          }
        `}
      </style>
    </div>
  );
};

export default FocusTimer;
