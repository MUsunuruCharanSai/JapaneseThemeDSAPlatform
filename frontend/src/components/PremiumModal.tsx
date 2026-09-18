import React from 'react';

interface PremiumModalProps {
  onClose: () => void;
  onBuyPremium: () => void;
}

const PremiumModal: React.FC<PremiumModalProps> = ({ onClose, onBuyPremium }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--gray-900)', margin: 0, marginBottom: '8px' }}>
              ⭐ Premium Access Required
            </h2>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', fontSize: '1.5rem', color: 'var(--gray-400)', cursor: 'pointer' }}
          >
            ×
          </button>
        </div>

        <div className="modal-body">
          <div style={{ marginBottom: '24px' }}>
            <p style={{ fontSize: '1rem', color: 'var(--gray-700)', lineHeight: '1.6', marginBottom: '16px' }}>
              This feature is available only for Premium users. Upgrade to Premium to unlock:
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ padding: '8px 0', color: 'var(--gray-700)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#10b981', fontSize: '1.2rem' }}>✓</span>
                Track your progress with completion checkboxes
              </li>
              <li style={{ padding: '8px 0', color: 'var(--gray-700)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#10b981', fontSize: '1.2rem' }}>✓</span>
                Access YouTube solution videos
              </li>
              <li style={{ padding: '8px 0', color: 'var(--gray-700)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#10b981', fontSize: '1.2rem' }}>✓</span>
                Direct links to practice problems
              </li>
            </ul>
          </div>

          <div style={{ background: 'var(--gray-50)', padding: '20px', borderRadius: '12px', border: '1px solid var(--gray-200)' }}>
            <p style={{ fontSize: '0.9rem', color: 'var(--gray-600)', margin: 0, marginBottom: '16px', textAlign: 'center' }}>
              Contact an administrator to enable Premium access for your account.
            </p>
            <button
              onClick={onBuyPremium}
              style={{
                width: '100%',
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'scale(1.02)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              💳 Buy Premium
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumModal;

