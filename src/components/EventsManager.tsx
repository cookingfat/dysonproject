import React, { useState, useEffect } from 'react';
import { Resources, AnyAbility } from '../types';
import { ABILITIES_CONFIG } from '../events';
import Tooltip from './Tooltip';

interface EventsManagerProps {
    cooldowns: Record<string, number>;
    resources: Resources;
    onActivateAbility: (abilityId: string) => void;
    hasResearchLab: boolean;
}

const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
}

const CooldownProgress: React.FC<{ expiresAt: number, cooldown: number }> = ({ expiresAt, cooldown }) => {
    const [remaining, setRemaining] = useState(expiresAt - Date.now());

    useEffect(() => {
        const interval = setInterval(() => {
            const newRemaining = expiresAt - Date.now();
            setRemaining(Math.max(0, newRemaining));
            if (newRemaining <= 0) clearInterval(interval);
        }, 100);
        return () => clearInterval(interval);
    }, [expiresAt]);

    const percentage = (1 - remaining / (cooldown * 1000)) * 100;

    return (
        <div className="w-full h-full flex items-center justify-center">
            <div className="absolute top-0 left-0 bottom-0 bg-cyan-500/50" style={{ width: `${percentage}%`}}></div>
            <span className="relative font-mono">{formatTime(remaining / 1000)}</span>
        </div>
    );
}


const EventsManager: React.FC<EventsManagerProps> = ({ cooldowns, resources, onActivateAbility, hasResearchLab }) => {
    
    const canAfford = (ability: AnyAbility) => {
        return Object.entries(ability.cost).every(([res, amount]) => resources[res as keyof Resources] >= (amount || 0));
    }

    const isOnCooldown = (abilityId: string) => {
        return (cooldowns[abilityId] || 0) > Date.now();
    }

    return (
        <div className="relative w-full mt-2">
            <div className="absolute inset-0 bg-black/40 rounded-md border border-gray-700/50 clip-corner-sm" aria-hidden="true"></div>
            <div className="relative p-2">
                {/* Player Abilities */}
                <div>
                    <h3 className="text-lg text-cyan-300 font-semibold mb-1 text-center uppercase tracking-wider">Abilities</h3>
                    <div className="grid grid-cols-2 gap-2">
                        {ABILITIES_CONFIG.map(ability => {
                            const affordable = canAfford(ability);
                            const coolingDown = isOnCooldown(ability.id);
                            let disabled = !affordable || coolingDown;
                            if (ability.id === 'rapid_research' && !hasResearchLab) {
                                disabled = true;
                            }
                            return (
                                <Tooltip key={ability.id} content={ability.description} position="top">
                                    <button
                                        onClick={() => onActivateAbility(ability.id)}
                                        disabled={disabled}
                                        className={`relative p-2 rounded-md text-sm font-bold transition-all overflow-hidden clip-corner-sm h-10 w-full
                                            ${disabled 
                                                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                                : 'bg-cyan-600 hover:bg-cyan-500 text-white'
                                            }
                                        `}
                                    >
                                        {coolingDown 
                                            ? <CooldownProgress expiresAt={cooldowns[ability.id]} cooldown={ability.cooldown} />
                                            : ability.name
                                        }
                                    </button>
                                </Tooltip>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventsManager;