import React from 'react';
import { DSAHeading } from '../types/dsa';
import ProgressRing from './ProgressRing';
import DSATopicCard from './DSATopicCard';

interface DSAHeadingCardProps {
  heading: DSAHeading;
  isExpanded: boolean;
  expandedSubheadings: Set<string>;
  completedQuestions: Set<string>;
  premiumAccess: boolean;
  isFirstHeading?: boolean;
  onToggleHeading: (id: string) => void;
  onToggleSubheading: (id: string, e: React.MouseEvent) => void;
  onToggleProgress: (questionId: string) => void;
  onShowPremiumModal: () => void;
  onSelectQuestion: (question: any) => void;
}

const DSAHeadingCard: React.FC<DSAHeadingCardProps> = ({
  heading,
  isExpanded,
  expandedSubheadings,
  completedQuestions,
  premiumAccess,
  isFirstHeading = false,
  onToggleHeading,
  onToggleSubheading,
  onToggleProgress,
  onShowPremiumModal,
  onSelectQuestion
}) => {
  const headingQuestions = heading.subheadings.flatMap(s => s.questions);
  const headingTotal = headingQuestions.length;
  const headingCompleted = headingQuestions.filter(q => completedQuestions.has(q.id)).length;

  return (
    <div className="heading-card">
      {/* Level 1: Heading Header */}
      <div 
        className={`heading-header ${isExpanded ? 'expanded' : ''}`} 
        onClick={() => onToggleHeading(heading.id)}
      >
        <div className="heading-title">
          <span className="chevron">▶</span>
          {heading.name}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <span style={{
            fontSize: '0.9rem',
            color: 'var(--gray-700)',
            fontWeight: 600,
            background: 'rgba(255, 255, 255, 0.9)',
            padding: '6px 14px',
            borderRadius: '20px',
            border: '1px solid rgba(226, 232, 240, 0.8)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
          }}>
            {headingCompleted}/{headingTotal} Done
          </span>
          <ProgressRing completed={headingCompleted} total={headingTotal} />
        </div>
      </div>

      {/* Level 1.5: Heading Body */}
      {isExpanded && (
        <div className="heading-body">
          {heading.subheadings.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', color: 'var(--gray-400)' }}>
              No topics yet.
            </div>
          ) : (
            heading.subheadings.map((subheading, index) => (
              <DSATopicCard
                key={subheading.id}
                subheading={subheading}
                isExpanded={expandedSubheadings.has(subheading.id)}
                completedQuestions={completedQuestions}
                premiumAccess={premiumAccess}
                isFreeSubheading={isFirstHeading && index === 0}
                onToggle={onToggleSubheading}
                onToggleProgress={onToggleProgress}
                onShowPremiumModal={onShowPremiumModal}
                onSelectQuestion={onSelectQuestion}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default DSAHeadingCard;

