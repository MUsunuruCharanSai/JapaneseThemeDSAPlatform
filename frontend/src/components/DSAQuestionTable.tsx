import React from 'react';
import { DSAQuestion } from '../types/dsa';

interface DSAQuestionTableProps {
  questions: DSAQuestion[];
  completedQuestions: Set<string>;
  premiumAccess: boolean;
  isFreeSubheading?: boolean;
  onToggleProgress: (questionId: string) => void;
  onShowPremiumModal: () => void;
  onSelectQuestion: (question: DSAQuestion) => void;
}

const DSAQuestionTable: React.FC<DSAQuestionTableProps> = ({
  questions,
  completedQuestions,
  premiumAccess,
  isFreeSubheading = false,
  onToggleProgress,
  onShowPremiumModal,
  onSelectQuestion
}) => {

  const getPreviewText = (html: string) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    const text = tmp.textContent || tmp.innerText || "";
    return text.length > 50 ? text.substring(0, 50) + "..." : text;
  };

  // Helper function to check if a question should show premium modal
  const shouldShowPremiumModal = (questionIndex: number): boolean => {
    // First 3 questions in free subheadings are always free
    if (isFreeSubheading && questionIndex < 3) {
      return false;
    }
    // All other questions require premium access
    return !premiumAccess;
  };

  const handleToggleProgress = (questionId: string, questionIndex: number) => {
    // Check if premium modal should be shown
    if (shouldShowPremiumModal(questionIndex)) {
      onShowPremiumModal();
      return;
    }

    onToggleProgress(questionId);
  };

  if (questions.length === 0) {
    return (
      <div style={{ padding: '16px', color: 'var(--gray-400)', textAlign: 'center', fontSize: '0.9rem' }}>
        No questions.
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="dsa-table">
        <thead>
          <tr>
            <th style={{ width: '5%', textAlign: 'center' }}>Status</th>
            <th style={{ width: '25%' }}>Problem Name</th>
            <th style={{ width: '25%' }}>Description</th>
            <th style={{ width: '10%' }}>Difficulty</th>
            <th style={{ width: '17%' }}>Youtube Resource</th>
            <th style={{ width: '17%' }}>Question Link</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((question, index) => {
            const isDone = completedQuestions.has(question.id);
            const hasFullAccess = !shouldShowPremiumModal(index);
            return (
              <tr key={question.id} className={isDone ? 'completed-row' : ''}>
                <td>
                  <div className="checkbox-wrapper">
                    <input
                      type="checkbox"
                      className="custom-checkbox"
                      checked={isDone}
                      onChange={() => handleToggleProgress(question.id, index)}
                      disabled={!hasFullAccess}
                      style={{
                        opacity: hasFullAccess ? 1 : 0.5,
                        cursor: hasFullAccess ? 'pointer' : 'not-allowed'
                      }}
                    />
                  </div>
                </td>
                <td className="q-name" style={{ fontWeight: 600 }}>{question.name}</td>
                <td 
                  className="col-desc" 
                  onClick={() => onSelectQuestion(question)}
                  title="Click to view full description"
                >
                  <span className="desc-text">{getPreviewText(question.article)}</span>
                  <span className="desc-action">View Description</span>
                </td>
                <td>
                  <span className={`badge badge-${question.difficulty.toLowerCase()}`}>
                    {question.difficulty}
                  </span>
                </td>
                <td>
                  {question.youtubeLink ? (
                    hasFullAccess ? (
                      <a
                        href={question.youtubeLink}
                        target="_blank"
                        rel="noreferrer"
                        className="icon-btn youtube"
                      >
                        ▶ Watch
                      </a>
                    ) : (
                      <button
                        onClick={() => onShowPremiumModal()}
                        className="icon-btn disabled"
                        style={{ cursor: 'pointer' }}
                      >
                        ▶ Watch
                      </button>
                    )
                  ) : (
                    <span className="icon-btn disabled">-</span>
                  )}
                </td>
                <td>
                  {question.questionLink ? (
                    hasFullAccess ? (
                      <a
                        href={question.questionLink}
                        target="_blank"
                        rel="noreferrer"
                        className="icon-btn link"
                      >
                        🔗 Solve
                      </a>
                    ) : (
                      <button
                        onClick={() => onShowPremiumModal()}
                        className="icon-btn disabled"
                        style={{ cursor: 'pointer' }}
                      >
                        🔗 Solve
                      </button>
                    )
                  ) : (
                    <span className="icon-btn disabled">-</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default DSAQuestionTable;

