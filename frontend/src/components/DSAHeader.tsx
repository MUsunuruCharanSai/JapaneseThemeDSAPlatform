import React from 'react';

interface DSAHeaderProps {
  completedCount: number;
  totalCount: number;
}

const DSAHeader: React.FC<DSAHeaderProps> = ({ completedCount, totalCount }) => {
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <header className="page-header">
      <div className="header-text">
        <h1 className="page-title">Curated DSA Sheet</h1>
        <p className="page-subtitle">Master Data Structures & Algorithms topic by topic</p>
      </div>
      
      <div className="progress-card">
        <div className="progress-header">
          <span>Overall Progress</span>
          <span>{completedCount} / {totalCount}</span>
        </div>
        <div className="progress-bar-bg">
          <div 
            className="progress-bar-fill" 
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>
    </header>
  );
};

export default DSAHeader;

