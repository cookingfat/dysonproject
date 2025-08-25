import React from 'react';
import { Research, Resources } from '../types';
import { RESEARCH_CONFIG } from '../constants';
import ResearchItem from './ResearchItem';

interface ResearchViewProps {
  resources: Resources;
  completedResearch: Set<string>;
  onBuy: (researchId: string) => void;
}

const ResearchView: React.FC<ResearchViewProps> = ({ resources, completedResearch, onBuy }) => {
    
    const isAvailable = (research: Research) => {
        if (!research.prerequisites) return true;
        return research.prerequisites.every(req => completedResearch.has(req));
    };

    const standardResearch = RESEARCH_CONFIG.filter(r => (!r.tags || !r.tags.includes('exotic')) && (isAvailable(r) || completedResearch.has(r.id)));
    const exoticResearch = RESEARCH_CONFIG.filter(r => r.tags?.includes('exotic') && (isAvailable(r) || completedResearch.has(r.id)));

    const availableStandardCount = standardResearch.filter(r => !completedResearch.has(r.id)).length;
    
    return (
        <div>
            <div className="space-y-4">
                <div>
                    <h3 className="text-2xl font-bold text-center mb-4 text-cyan-300 uppercase tracking-wider">Standard Research</h3>
                    {standardResearch.map(research => (
                        <ResearchItem
                            key={research.id}
                            research={research}
                            resources={resources}
                            isCompleted={completedResearch.has(research.id)}
                            onBuy={onBuy}
                        />
                    ))}
                    {availableStandardCount === 0 && (
                         <p className="text-center text-gray-400 italic mt-8">No new standard research available.</p>
                    )}
                </div>
                
                {exoticResearch.length > 0 && (
                    <div className="pt-4 mt-4 border-t-2 border-purple-700/50">
                         <h3 className="text-2xl font-bold text-center mb-4 text-purple-300 uppercase tracking-wider">Exotic Research</h3>
                         {exoticResearch.map(research => (
                            <ResearchItem
                                key={research.id}
                                research={research}
                                resources={resources}
                                isCompleted={completedResearch.has(research.id)}
                                onBuy={onBuy}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResearchView;
