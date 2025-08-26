import React from 'react';
import { Upgrade, Resources } from '../types';
import UpgradeItem from './UpgradeItem';

interface UpgradeShopProps {
  upgrades: Upgrade[];
  resources: Resources;
  unlockedUpgrades: Set<string>;
  onBuy: (upgradeId: string) => void;
  onLevelUp: (upgradeId: string) => void;
  calculatedPPS: Record<string, Partial<Resources>>;
  calculatedCPS: Record<string, Partial<Resources>>;
}

const UpgradeShop: React.FC<UpgradeShopProps> = ({ upgrades, resources, onBuy, onLevelUp, unlockedUpgrades, calculatedPPS, calculatedCPS }) => {
  const unlockedList = upgrades.filter(u => unlockedUpgrades.has(u.id));
  const lockedList = upgrades.filter(u => !unlockedUpgrades.has(u.id) && u.unlocksAt);

  return (
    <div>
      <div className="space-y-3">
        <div>
            <h2 className="text-3xl font-bold text-center mb-6 text-cyan-300 uppercase tracking-wider">Available Upgrades</h2>
            {unlockedList.map(upgrade => (
            <UpgradeItem 
                key={upgrade.id}
                upgrade={upgrade}
                resources={resources}
                onBuy={onBuy}
                onLevelUp={onLevelUp}
                allUpgrades={upgrades}
                calculatedPPS={calculatedPPS}
                calculatedCPS={calculatedCPS}
            />
            ))}
            {unlockedList.length === 0 && (
                <p className="text-center text-gray-400 italic mt-8">More upgrades will unlock as you progress...</p>
            )}
        </div>

        {lockedList.length > 0 && (
            <div className="pt-8 mt-8 border-t-2 border-gray-700/50">
                <h2 className="text-3xl font-bold text-center mb-6 text-gray-400 uppercase tracking-wider">Upcoming Upgrades</h2>
                {lockedList.map(upgrade => (
                     <UpgradeItem 
                        key={upgrade.id}
                        upgrade={upgrade}
                        resources={resources}
                        onBuy={onBuy}
                        onLevelUp={onLevelUp}
                        allUpgrades={upgrades}
                        calculatedPPS={calculatedPPS}
                        calculatedCPS={calculatedCPS}
                        isLocked={true}
                    />
                ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default UpgradeShop;
