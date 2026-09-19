import React from 'react';

interface ProgressRingProps {
  completed: number;
  total: number;
}

const ProgressRing: React.FC<ProgressRingProps> = ({ completed, total }) => {
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const percent = total === 0 ? 0 : (completed / total) * 100;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="progress-ring">
      <svg>
        <circle className="ring-bg" cx="20" cy="20" r={radius} />
        <circle 
          className="ring-progress" 
          cx="20" cy="20" r={radius} 
          strokeDasharray={`${circumference} ${circumference}`} 
          strokeDashoffset={offset} 
        />
      </svg>
      <span>{Math.round(percent)}%</span>
    </div>
  );
};

export default ProgressRing;

