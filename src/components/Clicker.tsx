import React, { useState } from 'react';

interface ClickerProps {
  onClick: () => void;
  clickBonus: number;
  isBoosted?: boolean;
}

const Clicker: React.FC<ClickerProps> = ({ onClick, clickBonus, isBoosted }) => {
  const [effects, setEffects] = useState<{ id: number, bonus: number }[]>([]);

  const handleClick = () => {
    onClick();

    const newEffect = { id: Date.now(), bonus: clickBonus };
    setEffects(prev => [...prev, newEffect]);

    setTimeout(() => {
      setEffects(prev => prev.filter(effect => effect.id !== newEffect.id));
    }, 1000); // Must match animation duration
  };

  return (
    <div className="w-full flex items-center justify-center py-4">
      <button
        onClick={handleClick}
        className={`relative w-48 h-48 bg-cyan-600 rounded-full text-white font-black text-3xl uppercase tracking-wider
                   flex items-center justify-center
                   shadow-lg shadow-cyan-500/30
                   transition-all duration-150 ease-in-out
                   border-4 border-cyan-400
                   hover:bg-cyan-500 hover:shadow-xl hover:shadow-cyan-400/50 hover:scale-105
                   active:scale-95 active:bg-cyan-700
                   overflow-hidden
                   ${isBoosted ? 'animate-pulse-gold' : ''}`}
        aria-label={`Mine ${clickBonus} ore`}
      >
        Mine Ore
        {effects.map(effect => (
          <span
            key={effect.id}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl animate-float-up font-mono font-bold"
            style={{ color: 'var(--color-positive)'}}
            aria-hidden="true"
          >
            +{effect.bonus.toFixed(0)}
          </span>
        ))}
      </button>
    </div>
  );
};

export default Clicker;
