import React from 'react';
import { Research, Resources } from '../types';

interface ResearchItemProps {
  research: Research;
  resources: Resources;
  isCompleted: boolean;
  onBuy: (researchId: string) => void;
}

const RESOURCE_SHORT_NAMES: Record<string, string> = {
    research_points: 'RP',
    dyson_fragments: 'DF',
}

const ResearchItem: React.FC<ResearchItemProps> = ({ research, resources, isCompleted, onBuy }) => {
  const canAfford = resources[research.cost.resource] >= research.cost.amount;
  const isExotic = research.tags?.includes('exotic');

  const costText = `${research.cost.amount.toLocaleString()} ${RESOURCE_SHORT_NAMES[research.cost.resource] || research.cost.resource}`;

  return (
    <div 
      className={`p-4 mb-3 border rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between transition-all duration-200 clip-corner ${
        isCompleted 
          ? isExotic ? 'bg-purple-900/40 border-purple-700/50' : 'bg-cyan-900/40 border-cyan-700/50' 
          : canAfford 
            ? 'bg-gray-800/60 border-cyan-500/40 hover:bg-gray-700/80 hover:border-cyan-500/80 hover:-translate-y-1 cursor-pointer' 
            : 'bg-gray-800/30 border-gray-700/50 text-gray-500'
      }`}
    >
      <div className="flex-1 pr-4 mb-3 sm:mb-0">
        <h3 className={`font-bold text-lg ${isCompleted ? (isExotic ? 'text-purple-300' : 'text-cyan-300') : canAfford ? 'text-cyan-200' : ''}`}>{research.name}</h3>
        <p className={`text-sm mt-1 ${isCompleted ? 'text-gray-400' : canAfford ? 'text-gray-300' : 'text-gray-600'}`}>
          {research.description}
        </p>
      </div>
      <button
        onClick={() => onBuy(research.id)}
        disabled={!canAfford || isCompleted}
        className="text-black w-full sm:w-auto font-bold py-2 px-5 rounded-md transition-all duration-200 clip-corner-sm
                   disabled:bg-gray-600/50 disabled:cursor-not-allowed disabled:text-gray-400
                   bg-cyan-500 hover:bg-cyan-400"
      >
        {isCompleted ? 'Completed' : `Cost: ${costText}`}
      </button>
    </div>
  );
};

export default ResearchItem;
