import React from 'react';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

const Tooltip: React.FC<TooltipProps> = ({ content, children, position = 'top', className }) => {
  const getPositionClasses = () => {
    switch (position) {
      case 'bottom': return 'top-full left-1/2 -translate-x-1/2 mt-2';
      case 'left': return 'right-full top-1/2 -translate-y-1/2 mr-2';
      case 'right': return 'left-full top-1/2 -translate-y-1/2 ml-2';
      case 'top':
      default:
        return 'bottom-full left-1/2 -translate-x-1/2 mb-2';
    }
  };

  const getArrowPositionClasses = () => {
     switch (position) {
      case 'bottom': return 'left-1/2 -translate-x-1/2 -top-1';
      case 'left': return 'top-1/2 -translate-y-1/2 -right-1';
      case 'right': return 'top-1/2 -translate-y-1/2 -left-1';
      case 'top':
      default:
        return 'left-1/2 -translate-x-1/2 -bottom-1';
    }
  }
  
  if (!content) return children;

  return (
    <div className={`relative group ${className || ''}`}>
      {children}
      <div
        role="tooltip"
        className={`
          custom-tooltip
          ${getPositionClasses()}
        `}
      >
        {content}
        <div className={`custom-tooltip-arrow ${getArrowPositionClasses()}`} />
      </div>
    </div>
  );
};

export default Tooltip;
