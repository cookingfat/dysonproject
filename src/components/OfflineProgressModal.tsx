import React from 'react';
import { Resources, ResourceType } from '../types';

interface OfflineProgressModalProps {
  gains: Partial<Resources>;
  onClose: () => void;
}

const RESOURCE_METADATA: Record<ResourceType, { name: string, color: string, icon: string }> = {
    ore: { name: 'Ore', color: 'text-orange-400', icon: '⛏️' },
    energy: { name: 'Energy', color: 'text-yellow-300', icon: '⚡' },
    parts: { name: 'Parts', color: 'text-sky-400', icon: '⚙️' },
    dyson_fragments: { name: 'Dyson Fragments', color: 'text-purple-400', icon: '🌌' },
    research_points: { name: 'Research', color: 'text-cyan-300', icon: '🔬' },
};

const formatNumber = (num: number) => {
    if (num < 1000) return num.toFixed(1);
    if (num < 1e6) return (num / 1e3).toFixed(2) + 'K';
    if (num < 1e9) return (num / 1e6).toFixed(2) + 'M';
    if (num < 1e12) return (num / 1e9).toFixed(2) + 'B';
    return (num / 1e12).toFixed(2) + 'T';
};

const OfflineProgressModal: React.FC<OfflineProgressModalProps> = ({ gains, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#0A0F1E] border-2 border-cyan-500 rounded-lg shadow-2xl p-8 max-w-md w-full text-center clip-corner glow-cyan-lg">
        <h2 className="text-3xl font-bold text-cyan-300 mb-4 uppercase tracking-wider">Welcome Back!</h2>
        <p className="text-gray-300 mb-6">While you were away, your factory produced:</p>
        <div className="space-y-3 text-left bg-black/50 p-4 rounded-md mb-6 clip-corner-sm">
          {(Object.keys(gains) as ResourceType[]).map(key => {
            const meta = RESOURCE_METADATA[key as ResourceType];
            const amount = gains[key as ResourceType]!;
            if (amount < 0.1) return null;
            return (
              <div key={key} className="flex justify-between items-center">
                <span className={`font-semibold ${meta.color} flex items-center gap-2`}>{meta.icon} {meta.name}:</span>
                <span className="font-mono text-white" title={amount.toLocaleString()}>+ {formatNumber(amount)}</span>
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
