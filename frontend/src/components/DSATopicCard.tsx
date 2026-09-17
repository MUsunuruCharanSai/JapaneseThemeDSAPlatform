import React from 'react';
import { DSASubheading } from '../types/dsa';
import DSAQuestionTable from './DSAQuestionTable';

interface DSATopicCardProps {
  subheading: DSASubheading;
  isExpanded: boolean;
  completedQuestions: Set<string>;
  premiumAccess: boolean;
  isFreeSubheading?: boolean;
  onToggle: (id: string, e: React.MouseEvent) => void;
  onToggleProgress: (questionId: string) => void;
  onShowPremiumModal: () => void;
  onSelectQuestion: (question: any) => void;
}

const DSATopicCard: React.FC<DSATopicCardProps> = ({
  subheading,
  isExpanded,
  completedQuestions,
  premiumAccess,
  isFreeSubheading = false,
  onToggle,
  onToggleProgress,
  onShowPremiumModal,
  onSelectQuestion
}) => {
  return (
    <div className="topic-wrapper">
      {/* Level 2: Topic Header */}
      <div 
        className={`topic-header ${isExpanded ? 'expanded' : ''}`}
        onClick={(e) => onToggle(subheading.id, e)}
      >
        <div className="topic-info">
          <div className="topic-bar"></div>
          <span className="topic-title">{subheading.name}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--gray-500)', fontWeight: 600 }}>
            {subheading.questions.length} Qs
          </span>
          <span className="chevron">▶</span>
        </div>
      </div>
      
      {/* Level 3: Question Table */}
      {isExpanded && (
        <div className="topic-content">
          <DSAQuestionTable
            questions={subheading.questions}
            completedQuestions={completedQuestions}
            premiumAccess={premiumAccess}
            isFreeSubheading={isFreeSubheading}
            onToggleProgress={onToggleProgress}
            onShowPremiumModal={onShowPremiumModal}
            onSelectQuestion={onSelectQuestion}
          />
        </div>
      )}
    </div>
  );
};

export default DSATopicCard;

