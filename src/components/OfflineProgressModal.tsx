import React from 'react';
import { Resources, ResourceType } from '../types';
import { formatNumber } from '../utils';

interface OfflineProgressModalProps {
  gains: Partial<Resources>;
  onClose: () => void;
}

const RESOURCE_METADATA: Record<ResourceType, { name: string, color: string, icon: string }> = {
    ore: { name: 'Ore', color: 'text-orange-400', icon: '⛏️' },
    energy: { name: 'Energy', color: 'text-yellow-300', icon: '⚡' },
    parts: { name: 'Parts', color: 'text-sky-400', icon: '⚙️' },
    research_points: { name: 'Research', color: 'text-cyan-300', icon: '🔬' },
    dyson_fragments: { name: 'Dyson Fragments', color: 'text-purple-400', icon: '🌌' },
    condensed_fragments: { name: 'Cond. Fragments', color: 'text-indigo-400', icon: '💠' },
    stellar_essence: { name: 'Stellar Essence', color: 'text-rose-400', icon: '🌟' },
};

const OfflineProgressModal: React.FC<OfflineProgressModalProps> = ({ gains, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#0A0F1E] border-2 border-cyan-500 rounded-lg shadow-2xl p-8 max-w-md w-full text-center clip-corner glow-cyan-lg">
        <h2 className="text-3xl font-bold text-cyan-300 mb-4 uppercase tracking-wider">Welcome Back!</h2>
        <p className="text-gray-300 mb-6">While you were away, your factory produced:</p>
        <div className="space-y-3 text-left bg-black/50 p-4 rounded-md mb-6 clip-corner-sm">
          {(Object.keys(gains) as (keyof Resources)[]).map(key => {
            const meta = RESOURCE_METADATA[key];
            if (!meta) return null;
            const amount = gains[key]!;
            if (amount < 0.1) return null;
            return (
              <div key={key} className="flex justify-between items-center">
                <span className={`font-semibold ${meta.color} flex items-center gap-2`}>{meta.icon} {meta.name}:</span>
                <span className="font-mono text-white" title={amount.toLocaleString()}>+ {formatNumber(amount, { forceDecimals: true })}</span>
              </div>
            );
          })}
        </div>
        <button
          onClick={onClose}
          className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-3 px-8 rounded-lg text-xl transition-transform transform hover:scale-105 clip-corner-sm"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default OfflineProgressModal;