import React from 'react';
import { ACHIEVEMENTS_CONFIG } from '../achievements';

interface AchievementsViewProps {
  unlockedAchievements: Set<string>;
}

const AchievementsView: React.FC<AchievementsViewProps> = ({ unlockedAchievements }) => {
  const unlockedCount = unlockedAchievements.size;
  const totalCount = ACHIEVEMENTS_CONFIG.length;

  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-cyan-300 uppercase tracking-wider">Achievements</h2>
        <p className="text-gray-400 font-semibold font-mono">{unlockedCount} / {totalCount} Unlocked</p>
      </div>
      <div className="space-y-3">
        {ACHIEVEMENTS_CONFIG.map(ach => {
          const isUnlocked = unlockedAchievements.has(ach.id);
          return (
            <div
              key={ach.id}
              className={`p-4 border rounded-lg transition-all clip-corner ${
                isUnlocked
                  ? 'bg-cyan-900/40 border-cyan-700/60 shadow-md shadow-cyan-500/10'
                  : 'bg-gray-800/30 border-gray-700/50 text-gray-500'
              }`}
            >
              <h3 className={`font-bold text-lg ${isUnlocked ? 'text-cyan-300' : 'text-gray-400'}`}>
                {ach.name}
              </h3>
              <p className={`text-sm mt-1 ${isUnlocked ? 'text-gray-300' : 'text-gray-600'}`}>
                {ach.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AchievementsView;
