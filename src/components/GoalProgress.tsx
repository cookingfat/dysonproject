import React from 'react';

interface GoalProgressProps {
  current: number;
  goal: number;
}

const GoalProgress: React.FC<GoalProgressProps> = ({ current, goal }) => {
  const progressPercentage = Math.min((current / goal) * 100, 100);

  return (
    <div className="w-full bg-black/40 backdrop-blur-sm p-6 rounded-md shadow-lg border border-purple-500/50 clip-corner glow-purple-md">
      <div className="flex justify-between items-baseline mb-2">
        <h2 className="text-xl font-bold text-purple-300 uppercase tracking-wider">Dyson Sphere Progress</h2>
        <p className="font-mono text-xl text-purple-200">
            {current.toLocaleString(undefined, { maximumFractionDigits: 0 })} / {goal.toLocaleString()}
        </p>
      </div>
      <div className="w-full bg-black/50 rounded-full h-4 border border-purple-800/50 overflow-hidden" title={`${progressPercentage.toFixed(2)}% Complete`}>
        <div
          className="bg-purple-500 h-full rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${progressPercentage}%` }}
          aria-valuenow={progressPercentage}
          aria-valuemin={0}
          aria-valuemax={100}
          role="progressbar"
        ></div>
      </div>
    </div>
  );
};

export default GoalProgress;