import React, { useEffect, useState } from 'react';

interface CelebrationAnimationProps {
  isVisible: boolean;
  onComplete?: () => void;
}

const CelebrationAnimation: React.FC<CelebrationAnimationProps> = ({
  isVisible,
  onComplete
}) => {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    color: string;
    size: number;
    speed: number;
    angle: number;
  }>>([]);

  useEffect(() => {
    if (isVisible) {
      // Create confetti particles
      const newParticles = [];
      const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE'];

      for (let i = 0; i < 50; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 8 + 4,
          speed: Math.random() * 3 + 1,
          angle: Math.random() * Math.PI * 2
        });
      }

      setParticles(newParticles);

      // Auto-hide after animation
      const timer = setTimeout(() => {
        setParticles([]);
        onComplete?.();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  if (!isVisible || particles.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 9999,
        overflow: 'hidden'
      }}
    >
      {/* Celebration particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          style={{
            position: 'absolute',
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            animation: `confettiFall ${2 + Math.random() * 2}s ease-out forwards`,
            boxShadow: `0 2px 4px rgba(0,0,0,0.2)`,
            transform: `rotate(${Math.random() * 360}deg)`
          }}
        />
      ))}

      {/* Success message */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          padding: '20px 30px',
          borderRadius: '16px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
          border: '2px solid #4ECDC4',
          animation: 'celebrationMessage 0.5s ease-out',
          zIndex: 10000,
          textAlign: 'center'
        }}
      >
        <div style={{
          fontSize: '2rem',
          marginBottom: '8px',
          animation: 'bounce 1s ease-in-out'
        }}>
          🎉
        </div>
        <div style={{
          fontSize: '1.2rem',
          fontWeight: '700',
          color: '#2d3748',
          marginBottom: '4px'
        }}>
          Great Progress!
        </div>
        <div style={{
          fontSize: '0.9rem',
          color: '#718096',
          fontWeight: '500'
        }}>
          Question completed! 🎯
        </div>
      </div>

      <style>
        {`
          @keyframes confettiFall {
            0% {
              transform: translateY(0) rotate(0deg);
              opacity: 1;
            }
            100% {
              transform: translateY(${window.innerHeight + 100}px) rotate(720deg);
              opacity: 0;
            }
          }

          @keyframes celebrationMessage {
            0% {
              transform: translate(-50%, -50%) scale(0.5);
              opacity: 0;
            }
            50% {
              transform: translate(-50%, -50%) scale(1.1);
              opacity: 1;
            }
            100% {
              transform: translate(-50%, -50%) scale(1);
              opacity: 1;
            }
          }

          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {
              transform: translateY(0);
            }
            40% {
              transform: translateY(-10px);
            }
            60% {
              transform: translateY(-5px);
            }
          }
        `}
      </style>
    </div>
  );
};

export default CelebrationAnimation;
