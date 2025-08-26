import React from 'react';
import { ClickableEventConfig } from '../types';
import Tooltip from './Tooltip';

export interface ClickableEventInstance extends ClickableEventConfig {
  instanceId: number;
  x: number;
  y: number;
}

interface ClickableEventProps {
  event: ClickableEventInstance;
  onClick: (event: ClickableEventInstance) => void;
}

const ClickableEvent: React.FC<ClickableEventProps> = ({ event, onClick }) => {
  return (
    <Tooltip content={event.name} position="bottom">
      <button
        onClick={() => onClick(event)}
        className="absolute z-50 w-20 h-20 text-5xl flex items-center justify-center
                  bg-yellow-400/20 rounded-full border-2 border-yellow-300
                  animate-pulse-strong"
        style={{
          left: `${event.x}%`,
          top: `${event.y}%`,
          animationDuration: '1.5s',
        }}
        aria-label={`Activate ${event.name}`}
      >
        💎
      </button>
    </Tooltip>
  );
};

export default ClickableEvent;
