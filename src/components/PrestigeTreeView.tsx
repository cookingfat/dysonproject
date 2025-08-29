import React from 'react';
import { PRESTIGE_UPGRADES_CONFIG } from '../constants';
import PrestigeUpgradeItem from './PrestigeUpgradeItem';
import { formatNumber } from '../utils';

interface PrestigeTreeViewProps {
    prestigePoints: number;
    prestigeUpgrades: Record<string, number>;
    onBuyPrestigeUpgrade: (id: string) => void;
}

const PrestigeTreeView: React.FC<PrestigeTreeViewProps> = ({ prestigePoints, prestigeUpgrades, onBuyPrestigeUpgrade }) => {
    return (
        <div className="w-full">
            <div className="text-center mb-6">
                <h3 className="text-xl text-purple-300">Available Prestige Points</h3>
                <p className="text-4xl font-bold font-mono text-white" title={prestigePoints.toLocaleString()}>
                    {formatNumber(prestigePoints)} ✨
                </p>
            </div>

            <div className="space-y-3">
                {PRESTIGE_UPGRADES_CONFIG.map(config => {
                    const level = prestigeUpgrades[config.id] || 0;
                    const cost = config.cost(level);
                    return (
                        <PrestigeUpgradeItem 
                            key={config.id}
                            upgrade={config}
                            level={level}
                            onBuy={onBuyPrestigeUpgrade}
                            canAfford={prestigePoints >= cost}
                        />
                    )
                })}
            </div>
        </div>
    );
}

export default PrestigeTreeView;