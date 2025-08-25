import React from 'react';
import { Upgrade, Resources, ResourceType } from '../types';

interface UpgradeItemProps {
  upgrade: Upgrade;
  resources: Resources;
  onBuy: (upgradeId: string) => void;
  onLevelUp: (upgradeId: string) => void;
  allUpgrades: Upgrade[];
}

const formatNumber = (num: number) => {
  if (num < 1000) return num.toLocaleString(undefined, {maximumFractionDigits: 0});
  if (num < 1000000) return (num / 1000).toFixed(1) + 'K';
  if (num < 1000000000) return (num / 1000000).toFixed(1) + 'M';
  return (num / 1000000000).toFixed(1) + 'B';
};

const ResourceCost: React.FC<{ cost: Partial<Resources> }> = ({ cost }) => {
  const costs = Object.entries(cost)
    .filter(([, amount]) => (amount ?? 0) > 0)
    .map(([res, amount]) => `${formatNumber(amount!)} ${res.charAt(0).toUpperCase() + res.slice(1)}`)
    .join(' & ');
  return <>{costs}</>;
};

const RomanNumerals: { [key: number]: string } = {
    1: 'I', 2: 'II', 3: 'III', 4: 'IV', 5: 'V', 6: 'VI', 7: 'VII', 8: 'VIII', 9: 'IX', 10: 'X'
};

const UpgradeItem: React.FC<UpgradeItemProps> = ({ upgrade, resources, onBuy, onLevelUp, allUpgrades }) => {
  const canAffordBuy = Object.entries(upgrade.cost).every(([res, amount]) => {
    return resources[res as ResourceType] >= amount;
  });

  const levelUpCost: Partial<Resources> = {};
  if (upgrade.owned > 0) {
      const costFactor = 3 * upgrade.level;
      const keyResources: ResourceType[] = ['parts', 'energy', 'ore'];
      keyResources.forEach(res => {
          if (upgrade.baseCost[res] > 0) {
              levelUpCost[res] = (levelUpCost[res] || 0) + upgrade.baseCost[res] * costFactor;
          }
      });
      if (Object.keys(levelUpCost).length === 0) {
        levelUpCost.parts = 50 * upgrade.level;
        levelUpCost.energy = 25 * upgrade.level;
      }
  }
  const canAffordLevelUp = Object.entries(levelUpCost).every(([res, amt]) => resources[res as ResourceType] >= (amt || 0));


  const productionText = Object.entries(upgrade.production)
    .map(([res, amount]) => `▲ +${amount.toFixed(1)} ${res}/s`)
    .join(', ');
    
  const consumptionText = Object.entries(upgrade.consumption)
    .map(([res, amount]) => `▼ -${amount.toFixed(1)} ${res}/s`)
    .join(', ');

  const canAffordAnything = canAffordBuy || canAffordLevelUp;

  return (
    <div 
      className={`p-4 border rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between transition-all duration-200 clip-corner
        ${
          canAffordAnything
            ? 'bg-gray-800/60 border-cyan-500/40 hover:bg-gray-700/80 hover:border-cyan-500/80 hover:-translate-y-1' 
            : 'bg-gray-800/30 border-gray-700/50 text-gray-500'
        }
        ${(canAffordBuy || canAffordLevelUp) && 'can-afford-pulse'}
      `}
    >
      <div className="flex-1 pr-4 mb-3 sm:mb-0">
        <div className="flex items-baseline gap-3">
            <h3 className={`font-bold text-lg ${canAffordAnything ? 'text-cyan-200' : ''}`}>{upgrade.name}</h3>
            <span className={`text-xs font-mono px-2 py-0.5 rounded ${canAffordAnything ? 'bg-cyan-800/50 text-cyan-300' : 'bg-gray-600/50'}`}>
                Mk. {RomanNumerals[upgrade.level] || upgrade.level}
            </span>
            <span className={`text-sm font-mono px-2 py-0.5 rounded ${canAffordAnything ? 'bg-cyan-500/20 text-cyan-300' : 'bg-gray-600/50'}`}>
                Owned: {upgrade.owned}
            </span>
        </div>
        <p className={`text-sm mt-1 ${canAffordAnything ? 'text-gray-300' : 'text-gray-600'}`}>
          {upgrade.description}
        </p>
        {upgrade.synergies && (
            <div className="text-xs mt-2 text-purple-400 font-semibold italic space-y-1">
                {upgrade.synergies.map((syn, index) => {
                    const sourceUpgrade = allUpgrades.find(u => u.id === syn.sourceId);
                    const sourceName = sourceUpgrade ? sourceUpgrade.name : syn.sourceId;
                    let synText = '';

                    if (syn.bonus.type === 'flat' && syn.bonus.per) {
                        synText = `⚡ +${syn.bonus.value} ${syn.targetResource}/s per unit for every ${syn.bonus.per} ${sourceName}s.`;
                    } else if (syn.bonus.type === 'percentage_of_source_output' && syn.bonus.sourceResource) {
                        synText = `⚡ Produces bonus ${syn.targetResource} equal to ${syn.bonus.value * 100}% of ${sourceName} ${syn.bonus.sourceResource} output.`;
                    }
                    
                    return synText ? <p key={index}>{synText}</p> : null;
                })}
            </div>
        )}
        <div className="text-xs mt-2 font-mono">
            {productionText && <span className="text-green-400 mr-3">{productionText}</span>}
            {consumptionText && <span className="text-red-400">{consumptionText}</span>}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
        {upgrade.owned > 0 && (
            <button
                onClick={() => onLevelUp(upgrade.id)}
                disabled={!canAffordLevelUp}
                className="text-black flex-1 font-bold py-2 px-4 rounded-md transition-all duration-200 clip-corner-sm text-sm
                        disabled:bg-gray-600/50 disabled:cursor-not-allowed disabled:text-gray-500
                        bg-purple-500 hover:bg-purple-400"
                >
                Level Up<br/><span className="font-normal text-xs">(<ResourceCost cost={levelUpCost} />)</span>
            </button>
        )}
        <button
            onClick={() => onBuy(upgrade.id)}
            disabled={!canAffordBuy}
            className="text-black flex-1 font-bold py-2 px-4 rounded-md transition-all duration-200 clip-corner-sm text-sm
                    disabled:bg-gray-600/50 disabled:cursor-not-allowed disabled:text-gray-500
                    bg-cyan-500 hover:bg-cyan-400"
            >
            Buy Unit<br/><span className="font-normal text-xs">(<ResourceCost cost={upgrade.cost} />)</span>
        </button>
      </div>

    </div>
  );
};

export default UpgradeItem;
