import React, { useState } from 'react';
import PrestigeTreeView from './PrestigeTreeView';
import { formatNumber } from '../utils';

interface PrestigeManagerProps {
  prestigePoints: number;
  prestigeUpgrades: Record<string, number>;
  fragmentsReady: number;
  onPrestige: () => void;
  onBuyPrestigeUpgrade: (id: string) => void;
  isUnlocked: boolean;
}

const PrestigeManager: React.FC<PrestigeManagerProps> = (props) => {
  const { prestigePoints, prestigeUpgrades, fragmentsReady, onPrestige, onBuyPrestigeUpgrade, isUnlocked } = props;
  const [isConfirming, setIsConfirming] = useState(false);

  if (!isUnlocked) {
    return null;
  }

  const fragmentsToGain = Math.floor(fragmentsReady);

  const handlePrestigeClick = () => {
    if (fragmentsToGain < 1) return;
    setIsConfirming(true);
  };

  const handleConfirm = () => {
    onPrestige();
    setIsConfirming(false);
  };

  const handleCancel = () => {
    setIsConfirming(false);
  };

  return (
    <div className="w-full text-center">
      <div className="bg-black/40 p-4 rounded-md shadow-lg border border-purple-700/60 mb-6 clip-corner">
        <h3 className="text-2xl font-bold text-purple-300 mb-2 uppercase tracking-wider">Prestige Reset</h3>
        
        {isConfirming ? (
          <div className="bg-purple-900/30 p-4 rounded-lg clip-corner-sm">
            <p className="font-bold text-lg text-white">Confirm Reset</p>
            <p className="text-sm text-gray-300 my-2">
              This will reset your resources, buildings, and research. You will gain <strong className="text-white">{formatNumber(fragmentsToGain)}</strong> prestige points. Your Prestige Tree upgrades will remain. Are you sure?
            </p>
            <div className="flex justify-center gap-4 mt-4">
              <button onClick={handleConfirm} className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-6 rounded-lg transition-colors clip-corner-sm">
                Yes, Reset
              </button>
              <button onClick={handleCancel} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded-lg transition-colors clip-corner-sm">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-lg font-semibold text-white mb-2">
              Ready to gain: <span className="font-bold text-purple-400 font-mono">{formatNumber(fragmentsToGain)}</span> Prestige Points
            </p>
            <p className="text-gray-400 mb-3 text-sm">
                Each point provides a +1% global production bonus (compounded with tree upgrades).
            </p>
            <button
              onClick={handlePrestigeClick}
              disabled={fragmentsToGain < 1}
              className="w-full sm:w-auto bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-8 rounded-lg text-xl transition-all transform hover:scale-105 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:text-gray-400 disabled:scale-100 clip-corner-sm"
            >
              Prestige
            </button>
          </div>
        )}
      </div>

      <div className="mt-4">
        <h3 className="text-2xl font-bold text-purple-300 mb-4 uppercase tracking-wider">Prestige Upgrades</h3>
        <PrestigeTreeView 
          prestigePoints={prestigePoints}
          prestigeUpgrades={prestigeUpgrades}
          onBuyPrestigeUpgrade={onBuyPrestigeUpgrade}
        />
      </div>

    </div>
  );
};

export default PrestigeManager;