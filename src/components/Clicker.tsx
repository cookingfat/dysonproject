import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ActiveBoost } from '../types';
import Tooltip from './Tooltip';

interface ClickerProps {
  onClick: () => void;
  clickBonus: number;
  activeBoosts: ActiveBoost[];
}

interface Effect {
  id: number;
  bonus: number;
  x: number;
  y: number;
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

const BOOST_ICONS: Record<string, string> = {
    'meteor_shower': '☄️',
    'solar_flare': '☀️',
    'overcharge_power': '⚡️',
    'efficiency_drive': '🛡️',
    'rich_vein': '💎',
};

const BoostIndicator: React.FC<{ boost: ActiveBoost }> = ({ boost }) => {
    const icon = BOOST_ICONS[boost.sourceId] || '⭐';

    const tooltipContent = (
        <div className="text-left">
            <p className="font-bold text-purple-300">{boost.name}</p>
            <p className="text-sm text-gray-300">{boost.description}</p>
            <p className="text-sm font-mono text-center mt-1">
                <CountdownTimer expiresAt={boost.expiresAt} />
            </p>
        </div>
    );
    
    return (
        <Tooltip content={tooltipContent} position="top">
            <div className="w-12 h-12 bg-purple-900/50 rounded-full flex items-center justify-center text-2xl
                          border-2 border-purple-500 animate-throb-purple-fast">
                {icon}
            </div>
        </Tooltip>
    );
}


const Clicker: React.FC<ClickerProps> = ({ onClick, clickBonus, activeBoosts }) => {
  const [effects, setEffects] = useState<Effect[]>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isRichVeinActive = activeBoosts.some(b => b.sourceId === 'rich_vein');

  const handleClick = () => {
    onClick();

    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      
      const newEffect = { id: Date.now(), bonus: clickBonus, x, y };
      setEffects(prev => [...prev, newEffect]);

      setTimeout(() => {
        setEffects(prev => prev.filter(effect => effect.id !== newEffect.id));
      }, 1000); // Must match animation duration
    }
  };
  
  const midPoint = Math.ceil(activeBoosts.length / 2);
  const leftBoosts = activeBoosts.slice(0, midPoint);
  const rightBoosts = activeBoosts.slice(midPoint);

  return (
    <div className="w-full flex items-center justify-center gap-4 py-2" style={{ minHeight: '176px' }}>
      <div className="flex flex-col items-center gap-2 w-12 flex-shrink-0">
          {leftBoosts.map(boost => <BoostIndicator key={boost.id} boost={boost} />)}
      </div>

      <button
        ref={buttonRef}
        onClick={handleClick}
        className={`relative w-40 h-40 bg-cyan-600 rounded-full text-white font-black text-2xl uppercase tracking-wider
                   flex items-center justify-center flex-shrink-0
                   shadow-lg shadow-cyan-500/30
                   transition-all duration-150 ease-in-out
                   border-4 border-cyan-400
                   hover:bg-cyan-500 hover:shadow-xl hover:shadow-cyan-400/50 hover:scale-105
                   active:scale-95 active:bg-cyan-700
                   ${isRichVeinActive ? 'animate-pulse-gold' : ''}`}
        aria-label={`Mine ${clickBonus} ore`}
      >
        Mine Ore
      </button>

      <div className="flex flex-col items-center gap-2 w-12 flex-shrink-0">
          {rightBoosts.map(boost => <BoostIndicator key={boost.id} boost={boost} />)}
      </div>
      
      {createPortal(
        <>
          {effects.map(effect => (
            <span
              key={effect.id}
              className="fixed text-4xl animate-float-up font-mono font-bold pointer-events-none"
              style={{
                color: 'var(--color-positive)',
                top: `${effect.y}px`,
                left: `${effect.x}px`,
                transform: 'translate(-50%, -50%)', // Center on the click point
                zIndex: 1000,
              }}
              aria-hidden="true"
            >
              +{effect.bonus.toFixed(0)}
            </span>
          ))}
        </>,
        document.body
      )}
    </div>
  );
};

export default Clicker;