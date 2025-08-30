import React from 'react';
import { Resources, ResourceType, ActiveBoost } from '../types';
import Tooltip from './Tooltip';
import { formatNumber } from '../utils';

interface ResourceDisplayProps {
  resources: Resources;
  rps: Partial<Resources>; // resources per second
  resourceFlash: Set<ResourceType>;
  activeBoosts: ActiveBoost[];
}

const RESOURCE_METADATA: Record<ResourceType, { name: string, color: string, icon: string }> = {
    ore: { name: 'Ore', color: 'text-orange-400', icon: '⛏️' },
    energy: { name: 'Energy', color: 'text-yellow-300', icon: '⚡' },
    parts: { name: 'Parts', color: 'text-sky-400', icon: '⚙️' },
    research_points: { name: 'Research', color: 'text-cyan-300', icon: '🔬' },
    dyson_fragments: { name: 'Dyson Fragments', color: 'text-purple-400', icon: '🌌' },
    condensed_fragments: { name: 'Cond. Fragments', color: 'text-indigo-400', icon: '💠' },
    stellar_essence: { name: 'Stellar Essence', color: 'text-rose-400', icon: '🌟' },
}

const ResourceDisplay: React.FC<ResourceDisplayProps> = ({ resources, rps, resourceFlash, activeBoosts }) => {
  const displayedResources = (Object.keys(resources) as ResourceType[]).filter(resourceKey => {
      const resourceAmount = resources[resourceKey];
      const resourceRps = rps[resourceKey] || 0;
      const baseResources: ResourceType[] = ['ore'];
      return !(resourceAmount === 0 && resourceRps === 0 && !baseResources.includes(resourceKey));
  });

  return (
    <div className="text-center w-full grid grid-cols-2 gap-3">
        {displayedResources.map(resourceKey => {
            const meta = RESOURCE_METADATA[resourceKey];
            if (!meta) return null;

            const resourceAmount = resources[resourceKey];
            const resourceRps = rps[resourceKey] || 0;
            const rpsColor = resourceRps >= 0 ? 'text-green-400' : 'text-red-400';
            
            const isFlashing = resourceFlash.has(resourceKey);

            let rpsGlowClass = '';
            const applicableBoost = activeBoosts.find(boost => {
                if (boost.target === 'all') return true;
                if (boost.target === 'miner' && resourceKey === 'ore') return true;
                if (boost.target === 'power' && resourceKey === 'energy') return true;
                if (boost.target === 'factory' && ['parts', 'research_points'].includes(resourceKey)) return true;
                return false;
            });

            if (applicableBoost) {
                if (applicableBoost.type === 'production_multiplier') {
                    rpsGlowClass = 'animate-glow-production';
                } else if (applicableBoost.type === 'consumption_multiplier') {
                    rpsGlowClass = 'animate-glow-efficiency';
                }
            }

            return (
                <div key={resourceKey} className={`bg-black/40 p-2 rounded-md clip-corner-sm border border-gray-700/50 ${isFlashing ? 'animate-flash' : ''}`}>
                    <h2 className={`text-base ${meta.color} font-bold truncate flex items-center justify-center gap-2`}>{meta.icon} {meta.name}</h2>
                    <Tooltip content={resourceAmount.toLocaleString()} position="bottom">
                      <p className="text-xl font-bold text-white font-mono">{formatNumber(resourceAmount, { forceDecimals: true })}</p>
                    </Tooltip>
                    <p className={`text-sm ${rpsColor} font-mono ${rpsGlowClass}`}>
                        {resourceRps >= 0 ? '+' : ''}{formatNumber(resourceRps, { forceDecimals: true })}/s
                    </p>
                </div>
            )
        })}
    </div>
  );
};

export default ResourceDisplay;