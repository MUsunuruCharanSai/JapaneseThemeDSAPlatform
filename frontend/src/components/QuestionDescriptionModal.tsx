import React from 'react';
import { DSAQuestion } from '../types/dsa';

interface QuestionDescriptionModalProps {
  question: DSAQuestion;
  premiumAccess: boolean;
  onClose: () => void;
  onShowPremiumModal: () => void;
}

const QuestionDescriptionModal: React.FC<QuestionDescriptionModalProps> = ({
  question,
  premiumAccess,
  onClose,
  onShowPremiumModal
}) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--gray-900)', margin: 0, marginBottom: '8px' }}>
              {question.name}
            </h2>
            <span className={`badge badge-${question.difficulty.toLowerCase()}`}>
              {question.difficulty}
            </span>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', fontSize: '1.5rem', color: 'var(--gray-400)', cursor: 'pointer' }}
          >
            ×
          </button>
        </div>

        <div className="modal-body">
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--gray-500)', letterSpacing: '0.05em', marginBottom: '12px' }}>
              Problem Description
            </h3>
            <div 
              style={{ lineHeight: '1.7', color: 'var(--gray-700)', fontSize: '1rem' }}
              dangerouslySetInnerHTML={{ __html: question.article.replace(/\n/g, '<br>') }}
            />
          </div>

          <div style={{ background: 'var(--gray-50)', padding: '24px', borderRadius: '12px', border: '1px solid var(--gray-200)' }}>
            <h3 style={{ fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--gray-500)', letterSpacing: '0.05em', marginBottom: '16px' }}>
              Quick Access
            </h3>
            <div style={{ display: 'flex', gap: '12px' }}>
              {question.youtubeLink && (
                premiumAccess ? (
                  <a href={question.youtubeLink} target="_blank" rel="noreferrer" 
                     style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#ef4444', color: 'white', padding: '10px 20px', borderRadius: '8px', fontWeight: '600', fontSize: '0.9rem' }}>
                    <span>▶</span> Watch Solution
                  </a>
                ) : (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      onShowPremiumModal();
                    }}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#ef4444', color: 'white', padding: '10px 20px', borderRadius: '8px', fontWeight: '600', fontSize: '0.9rem', border: 'none', cursor: 'pointer', opacity: 0.7 }}
                  >
                    <span>▶</span> Watch Solution
                  </button>
                )
              )}
              {question.questionLink && (
                premiumAccess ? (
                  <a href={question.questionLink} target="_blank" rel="noreferrer" 
                     style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'white', border: '1px solid #d1d5db', color: '#374151', padding: '10px 20px', borderRadius: '8px', fontWeight: '600', fontSize: '0.9rem' }}>
                    <span>🔗</span> Practice Link
                  </a>
                ) : (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      onShowPremiumModal();
                    }}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'white', border: '1px solid #d1d5db', color: '#374151', padding: '10px 20px', borderRadius: '8px', fontWeight: '600', fontSize: '0.9rem', cursor: 'pointer', opacity: 0.7 }}
                  >
                    <span>🔗</span> Practice Link
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionDescriptionModal;

