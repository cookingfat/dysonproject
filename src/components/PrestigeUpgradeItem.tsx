import React from 'react';
import { PrestigeUpgrade } from '../types';
import { formatNumber } from '../utils';

interface PrestigeUpgradeItemProps {
    upgrade: PrestigeUpgrade;
    level: number;
    onBuy: (id: string) => void;
    canAfford: boolean;
}

const PrestigeUpgradeItem: React.FC<PrestigeUpgradeItemProps> = ({ upgrade, level, onBuy, canAfford }) => {
    const isMaxLevel = level >= upgrade.maxLevel;
    const value = upgrade.value(level);
    const cost = upgrade.cost(level);

    return (
        <div className={`p-4 border rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between transition-all duration-200 clip-corner ${
            isMaxLevel 
              ? 'bg-purple-900/40 border-purple-700/50' 
              : canAfford 
                ? 'bg-gray-800/60 border-purple-500/40 hover:bg-gray-700/80 hover:border-purple-500/80' 
                : 'bg-gray-800/30 border-gray-700/50 text-gray-500'
        }`}>
            <div className="flex-1 pr-4 mb-3 sm:mb-0">
                <div className="flex items-baseline gap-3">
                    <h3 className={`font-bold text-lg ${isMaxLevel ? 'text-purple-300' : canAfford ? 'text-purple-200' : ''}`}>{upgrade.name}</h3>
                    <span className={`text-sm font-mono px-2 py-0.5 rounded ${isMaxLevel || canAfford ? 'bg-purple-500/20 text-purple-300' : 'bg-gray-600/50'}`}>
                        {level} / {upgrade.maxLevel}
                    </span>
                </div>
                <p className={`text-sm mt-1 ${isMaxLevel ? 'text-gray-400' : canAfford ? 'text-gray-300' : 'text-gray-600'}`}>
                    {upgrade.description(level, value)}
                </p>
            </div>
            <button
                onClick={() => onBuy(upgrade.id)}
                disabled={!canAfford || isMaxLevel}
                className="text-black w-full sm:w-auto font-bold py-2 px-5 rounded-md transition-all duration-200 clip-corner-sm min-w-[140px]
                    disabled:bg-gray-600/50 disabled:cursor-not-allowed disabled:text-gray-400
                    bg-purple-500 hover:bg-purple-400"
            >
                {isMaxLevel ? 'Max Level' : `Cost: ${formatNumber(cost)} ✨`}
            </button>
        </div>
    );
};

export default PrestigeUpgradeItem;