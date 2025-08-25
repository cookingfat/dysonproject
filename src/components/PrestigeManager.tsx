import React, { useState } from 'react';

interface PrestigeManagerProps {
  prestigePoints: number;
  prestigeBonusPerPoint: number;
  fragmentsReady: number;
  onPrestige: () => void;
  isUnlocked: boolean;
}

const PrestigeManager: React.FC<PrestigeManagerProps> = ({ prestigePoints, prestigeBonusPerPoint, fragmentsReady, onPrestige, isUnlocked }) => {
  const [isConfirming, setIsConfirming] = useState(false);

  if (!isUnlocked) {
    return null;
  }

  const fragmentsToGain = Math.floor(fragmentsReady);
  const currentBonus = (prestigePoints * prestigeBonusPerPoint).toFixed(1);
  const bonusAfterPrestige = ((prestigePoints + fragmentsToGain) * prestigeBonusPerPoint).toFixed(1);

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
    <div className="w-full bg-black/40 backdrop-blur-sm p-6 rounded-md shadow-lg border border-purple-700/60 text-center clip-corner">
      <h3 className="text-2xl font-bold text-purple-300 mb-2 uppercase tracking-wider">Prestige</h3>
       <p className="text-gray-300 mb-2">
        Current production bonus: <strong className="text-white font-mono">{currentBonus}%</strong>
      </p>
      
      {isConfirming ? (
        <div className="bg-purple-900/30 p-4 rounded-lg clip-corner-sm">
          <p className="font-bold text-lg text-white">Confirm Reset</p>
          <p className="text-sm text-gray-300 my-2">
            This will reset your resources, upgrades, and research. You will gain <strong className="text-white">{fragmentsToGain}</strong> prestige points, for a new total bonus of <strong className="text-white">{bonusAfterPrestige}%</strong>. Are you sure?
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
            Ready to gain: <span className="font-bold text-purple-400 font-mono">{fragmentsToGain}</span> Prestige Points
          </p>
          <p className="text-gray-400 mb-4 text-sm">
            New total bonus after prestige: <strong className="text-white font-mono">{bonusAfterPrestige}%</strong>
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
  );
};

export default PrestigeManager;