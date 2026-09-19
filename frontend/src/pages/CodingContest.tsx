import React from 'react';
import { useNavigate } from 'react-router-dom';

const CodingContest: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
      overflowY: 'auto',
      zIndex: 1
    }}>
      <div style={{
        position: 'relative',
        textAlign: 'center',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        padding: '60px 40px',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        maxWidth: '500px',
        width: '100%'
      }}>
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
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
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
          fontSize: '3rem',
          marginBottom: '20px',
          color: '#4a5568'
        }}>
          🏆
        </div>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: '700',
          color: '#2d3748',
          marginBottom: '16px',
          fontFamily: "'Inter', sans-serif"
        }}>
          Coding Contest
        </h1>
        <p style={{
          fontSize: '1.25rem',
          color: '#4a5568',
          lineHeight: '1.6',
          fontWeight: '500'
        }}>
          Will Give you Update about Contest
        </p>
        <div style={{
          marginTop: '30px',
          padding: '20px',
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          borderRadius: '16px',
          color: 'white'
        }}>
          <p style={{
            fontSize: '1rem',
            margin: 0,
            fontWeight: '500'
          }}>
            Stay tuned for exciting coding challenges! 🚀
          </p>
        </div>
      </div>
    </div>
  );
};

export default CodingContest;
