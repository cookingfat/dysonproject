import React from 'react';
import { Resources, ResourceType } from '../types';

interface ResourceDisplayProps {
  resources: Resources;
  rps: Partial<Resources>; // resources per second
}

const RESOURCE_METADATA: Record<ResourceType, { name: string, color: string, icon: string }> = {
    ore: { name: 'Ore', color: 'text-orange-400', icon: '⛏️' },
    energy: { name: 'Energy', color: 'text-yellow-300', icon: '⚡' },
    parts: { name: 'Parts', color: 'text-sky-400', icon: '⚙️' },
    dyson_fragments: { name: 'Dyson Fragments', color: 'text-purple-400', icon: '🌌' },
    research_points: { name: 'Research', color: 'text-cyan-300', icon: '🔬' },
}

const ResourceDisplay: React.FC<ResourceDisplayProps> = ({ resources, rps }) => {
  // Function to format large numbers
  const formatNumber = (num: number) => {
    if (Math.abs(num) < 1000) return num.toFixed(1);
    if (Math.abs(num) < 1000000) return (num / 1000).toFixed(2) + 'K';
    if (Math.abs(num) < 1000000000) return (num / 1000000).toFixed(2) + 'M';
    return (num / 1000000000).toFixed(2) + 'B';
  };
  
  const formatPreciseNumber = (num: number) => {
    return num.toLocaleString(undefined, {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1
    });
  }

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
            const resourceAmount = resources[resourceKey];
            const resourceRps = rps[resourceKey] || 0;
            const rpsColor = resourceRps >= 0 ? 'text-green-400' : 'text-red-400';

            return (
                <div key={resourceKey} className="bg-black/40 p-3 rounded-md clip-corner-sm border border-gray-700/50">
                    <h2 className={`text-lg ${meta.color} font-bold truncate flex items-center justify-center gap-2`}>{meta.icon} {meta.name}</h2>
                    <p className="text-2xl font-bold text-white my-1 font-mono" title={resourceAmount.toLocaleString()}>{formatPreciseNumber(resourceAmount)}</p>
                    <p className={`text-sm ${rpsColor} font-mono`}>
                        {resourceRps >= 0 ? '+' : ''}{formatNumber(resourceRps)}/s
                    </p>
                </div>
            )
        })}
    </div>
  );
};

export default ResourceDisplay;
