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
  const visibleUpgrades = upgrades.filter(u => unlockedUpgrades.has(u.id));

  return (
    <div>
      <h2 className="text-3xl font-bold text-center mb-6 text-cyan-300 uppercase tracking-wider">Upgrades</h2>
      <div className="space-y-3">
        {visibleUpgrades.map(upgrade => (
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
        {visibleUpgrades.length === 0 && (
            <p className="text-center text-gray-400 italic mt-8">More upgrades will unlock as you progress...</p>
        )}
      </div>
    </div>
  );
};

export default UpgradeShop;