import React from 'react';
import Tooltip from './Tooltip';

interface GoalProgressProps {
  current: number;
  goal: number;
}

const GoalProgress: React.FC<GoalProgressProps> = ({ current, goal }) => {
  const progressPercentage = Math.min((current / goal) * 100, 100);

  return (
    <div className="w-full bg-black/40 backdrop-blur-sm p-4 rounded-md shadow-lg border border-purple-500/50 clip-corner glow-purple-md">
      <div className="flex justify-between items-baseline mb-1">
        <h2 className="text-xl font-bold text-purple-300 uppercase tracking-wider">Dyson Sphere Progress</h2>
        <p className="font-mono text-xl text-purple-200">
            {current.toLocaleString(undefined, { maximumFractionDigits: 0 })} / {goal.toLocaleString()}
        </p>
      </div>
      <Tooltip content={`${progressPercentage.toFixed(2)}% Complete`} position="bottom">
        <div className="w-full bg-black/50 rounded-full h-4 border border-purple-800/50 overflow-hidden">
          <div
            className="bg-purple-500 h-full rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${progressPercentage}%` }}
            aria-valuenow={progressPercentage}
            aria-valuemin={0}
            aria-valuemax={100}
            role="progressbar"
          ></div>
        </div>
      </Tooltip>
    </div>
  );
};

export default GoalProgress;