import React, { useState, useRef, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

const Tooltip: React.FC<TooltipProps> = ({ content, children, position = 'top', className }) => {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback(() => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const ARROW_MARGIN = 8;

    let top = 0, left = 0;

    switch (position) {
      case 'bottom':
        top = triggerRect.bottom + ARROW_MARGIN;
        left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
        break;
      case 'left':
        top = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
        left = triggerRect.left - tooltipRect.width - ARROW_MARGIN;
        break;
      case 'right':
        top = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
        left = triggerRect.right + ARROW_MARGIN;
        break;
      case 'top':
      default:
        top = triggerRect.top - tooltipRect.height - ARROW_MARGIN;
        left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
        break;
    }
    
    const viewportMargin = 8;
    if (left < viewportMargin) left = viewportMargin;
    if (left + tooltipRect.width > window.innerWidth - viewportMargin) {
      left = window.innerWidth - tooltipRect.width - viewportMargin;
    }
    if (top < viewportMargin) top = viewportMargin;
    if (top + tooltipRect.height > window.innerHeight - viewportMargin) {
      top = window.innerHeight - tooltipRect.height - viewportMargin;
    }
    
    setCoords({ top, left });
  }, [position]);

  useEffect(() => {
    if (visible) {
      // Defer position update to next frame to allow tooltip to render and have dimensions.
      requestAnimationFrame(updatePosition);
    }
  }, [visible, updatePosition, content]);

  const showTooltip = () => setVisible(true);
  const hideTooltip = () => setVisible(false);

  if (!content) return children;

  const getArrowPositionClasses = () => {
     switch (position) {
      case 'bottom': return 'left-1/2 -translate-x-1/2 -top-1';
      case 'left': return 'top-1/2 -translate-y-1/2 -right-1';
      case 'right': return 'top-1/2 -translate-y-1/2 -left-1';
      case 'top':
      default:
        return 'left-1/2 -translate-x-1/2 -bottom-1';
    }
  };

  return (
    <div
      ref={triggerRef}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
      className={className}
    >
      {children}
      {visible && createPortal(
        <div
          ref={tooltipRef}
          role="tooltip"
          className="custom-tooltip !fixed !opacity-100"
          style={{ top: `${coords.top}px`, left: `${coords.left}px`, zIndex: 9999 }}
        >
          {content}
          <div className={`custom-tooltip-arrow ${getArrowPositionClasses()}`} />
        </div>,
        document.body
      )}
    </div>
  );
};

export default Tooltip;