import React from 'react';
import { Progress } from '../ui/progress.jsx';

const ProgressBar = ({
  currentTime,
  duration,
  progressPercentage,
  handleSeek,
  formatTime,
  isCollapsed = false,
}) => {
  const handleProgressClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = (clickX / rect.width) * 100;
    handleSeek(percentage);
  };

  if (isCollapsed) {
    return (
      <div className="space-y-2">
        <Progress
          value={progressPercentage}
          className="w-full h-1 cursor-pointer hover:h-2 transition-all duration-200"
          onClick={handleProgressClick}
        />
        <div className="flex justify-between text-xs text-slate-400">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-between text-slate-400 text-sm">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
      <Progress
        value={progressPercentage}
        className="w-full h-2 cursor-pointer hover:h-3 transition-all duration-200"
        onClick={handleProgressClick}
      />
    </div>
  );
};

export default ProgressBar;
