import React, { useState, useEffect } from 'react';
import { Resources, ActiveBoost, AnyAbility } from '../types';
import { ABILITIES_CONFIG } from '../events';
import Tooltip from './Tooltip';

interface EventsManagerProps {
    activeBoosts: ActiveBoost[];
    cooldowns: Record<string, number>;
    resources: Resources;
    onActivateAbility: (abilityId: string) => void;
}

const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
}

const CountdownTimer: React.FC<{ expiresAt: number }> = ({ expiresAt }) => {
    const [remaining, setRemaining] = useState(expiresAt - Date.now());

    useEffect(() => {
        const interval = setInterval(() => {
            const newRemaining = expiresAt - Date.now();
            if (newRemaining <= 0) {
                setRemaining(0);
                clearInterval(interval);
            } else {
                setRemaining(newRemaining);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [expiresAt]);

    return <span className="font-mono">{formatTime(remaining / 1000)}</span>;
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


const EventsManager: React.FC<EventsManagerProps> = ({ activeBoosts, cooldowns, resources, onActivateAbility }) => {
    
    const canAfford = (ability: AnyAbility) => {
        return Object.entries(ability.cost).every(([res, amount]) => resources[res as keyof Resources] >= (amount || 0));
    }

    const isOnCooldown = (abilityId: string) => {
        return (cooldowns[abilityId] || 0) > Date.now();
    }

    return (
        <div className="w-full bg-black/40 p-3 rounded-md mt-4 border border-gray-700/50 clip-corner-sm">
            {/* Player Abilities */}
            <div className="mb-3">
                <h3 className="text-lg text-cyan-300 font-semibold mb-2 text-center uppercase tracking-wider">Abilities</h3>
                <div className="grid grid-cols-2 gap-2">
                    {ABILITIES_CONFIG.map(ability => {
                        const affordable = canAfford(ability);
                        const coolingDown = isOnCooldown(ability.id);
                        const disabled = !affordable || coolingDown;
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

            {/* Active Boosts */}
            {activeBoosts.length > 0 && (
                 <div className="border-t border-gray-600/50 pt-3">
                    <h3 className="text-lg text-purple-300 font-semibold mb-2 text-center uppercase tracking-wider">Active Boosts</h3>
                    <div className="space-y-2">
                        {activeBoosts.map(boost => (
                            <div key={boost.id} className="bg-purple-900/50 p-2 rounded-md text-sm clip-corner-sm">
                                <div className="flex justify-between items-center font-bold text-purple-200">
                                    <span>{boost.name}</span>
                                    <span><CountdownTimer expiresAt={boost.expiresAt} /></span>
                                </div>
                            </div>
                        ))}
                    </div>
                 </div>
            )}
        </div>
    );
};

export default EventsManager;
