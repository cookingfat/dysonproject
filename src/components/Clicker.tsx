import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';

interface ClickerProps {
  onClick: () => void;
  clickBonus: number;
  isBoosted?: boolean;
}

interface Effect {
  id: number;
  bonus: number;
  x: number;
  y: number;
}

const Clicker: React.FC<ClickerProps> = ({ onClick, clickBonus, isBoosted }) => {
  const [effects, setEffects] = useState<Effect[]>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);

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

  return (
    <div className="w-full flex items-center justify-center py-4">
      <button
        ref={buttonRef}
        onClick={handleClick}
        className={`relative w-48 h-48 bg-cyan-600 rounded-full text-white font-black text-3xl uppercase tracking-wider
                   flex items-center justify-center
                   shadow-lg shadow-cyan-500/30
                   transition-all duration-150 ease-in-out
                   border-4 border-cyan-400
                   hover:bg-cyan-500 hover:shadow-xl hover:shadow-cyan-400/50 hover:scale-105
                   active:scale-95 active:bg-cyan-700
                   ${isBoosted ? 'animate-pulse-gold' : ''}`}
        aria-label={`Mine ${clickBonus} ore`}
      >
        Mine Ore
      </button>
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