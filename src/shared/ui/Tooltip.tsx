import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../lib/utils';
import { Portal } from './Portal';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  className?: string;
}

const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  delay = 200,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<number>();

  const updatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const gap = 8;

    let top = 0, left = 0;

    switch (position) {
      case 'top':
        top = triggerRect.top - tooltipRect.height - gap;
        left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
        break;
      case 'bottom':
        top = triggerRect.bottom + gap;
        left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
        break;
      case 'left':
        top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
        left = triggerRect.left - tooltipRect.width - gap;
        break;
      case 'right':
        top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
        left = triggerRect.right + gap;
        break;
    }

    setTooltipPosition({ top, left });
  };

  const handleMouseEnter = () => {
    timeoutRef.current = window.setTimeout(() => {
      setIsOpen(true);
      requestAnimationFrame(updatePosition);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    setIsOpen(false);
  };

  useEffect(() => {
    if (isOpen) {
      updatePosition();
      window.addEventListener('scroll', updatePosition, { passive: true });
      window.addEventListener('resize', updatePosition);
    }
    return () => {
      window.removeEventListener('scroll', updatePosition);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isOpen]);

  const child = React.Children.only(children);
  const childProps = child.props as any;

  return (
    <>
      {React.cloneElement(child, {
        ref: triggerRef,
        onMouseEnter: (...args: any[]) => {
          handleMouseEnter();
          childProps.onMouseEnter?.(...args);
        },
        onMouseLeave: (...args: any[]) => {
          handleMouseLeave();
          childProps.onMouseLeave?.(...args);
        },
        onFocus: (...args: any[]) => {
          handleMouseEnter();
          childProps.onFocus?.(...args);
        },
        onBlur: (...args: any[]) => {
          handleMouseLeave();
          childProps.onBlur?.(...args);
        },
      })}
      {isOpen && (
        <Portal>
          <div
            ref={tooltipRef}
            style={{ top: tooltipPosition.top, left: tooltipPosition.left, position: 'fixed', zIndex: 50 }}
            className={cn(
              'px-3 py-1.5 text-xs font-medium text-white bg-neutral-900 dark:bg-neutral-700 rounded-lg shadow-lg',
              'animate-in fade-in-100 zoom-in-95',
              className
            )}
            role="tooltip"
          >
            {content}
          </div>
        </Portal>
      )}
    </>
  );
};

interface TooltipTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
}

const TooltipTrigger: React.FC<TooltipTriggerProps> = ({ children, asChild }) => {
  if (asChild) {
    return React.Children.only(children) as React.ReactElement;
  }
  return <span>{children}</span>;
};

interface TooltipContentProps {
  children: React.ReactNode;
  className?: string;
  side?: 'top' | 'bottom' | 'left' | 'right';
}

const TooltipContent: React.FC<TooltipContentProps> = ({ children, className, side = 'top' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<number>();

  const updatePosition = () => {
    if (!triggerRef.current || !contentRef.current) return;
    const triggerRect = triggerRef.current.getBoundingClientRect();
    const contentRect = contentRef.current.getBoundingClientRect();
    const gap = 8;
    let top = 0, left = 0;

    switch (side) {
      case 'top':
        top = triggerRect.top - contentRect.height - gap;
        left = triggerRect.left + (triggerRect.width - contentRect.width) / 2;
        break;
      case 'bottom':
        top = triggerRect.bottom + gap;
        left = triggerRect.left + (triggerRect.width - contentRect.width) / 2;
        break;
      case 'left':
        top = triggerRect.top + (triggerRect.height - contentRect.height) / 2;
        left = triggerRect.left - contentRect.width - gap;
        break;
      case 'right':
        top = triggerRect.top + (triggerRect.height - contentRect.height) / 2;
        left = triggerRect.right + gap;
        break;
    }
    setPosition({ top, left });
  };

  return (
    <>
      <span
        ref={triggerRef}
        onMouseEnter={() => { timeoutRef.current = window.setTimeout(() => { setIsOpen(true); requestAnimationFrame(updatePosition); }, 200); }}
        onMouseLeave={() => { if (timeoutRef.current) window.clearTimeout(timeoutRef.current); setIsOpen(false); }}
        onFocus={() => { timeoutRef.current = window.setTimeout(() => { setIsOpen(true); requestAnimationFrame(updatePosition); }, 200); }}
        onBlur={() => { if (timeoutRef.current) window.clearTimeout(timeoutRef.current); setIsOpen(false); }}
      >
        {children}
      </span>
      {isOpen && (
        <Portal>
          <div
            ref={contentRef}
            style={{ top: position.top, left: position.left, position: 'fixed', zIndex: 50 }}
            className={cn(
              'px-3 py-1.5 text-xs font-medium text-white bg-neutral-900 dark:bg-neutral-700 rounded-lg shadow-lg',
              'animate-in fade-in-100 zoom-in-95',
              className
            )}
            role="tooltip"
          >
            {children}
          </div>
        </Portal>
      )}
    </>
  );
};

interface TooltipProviderProps {
  children: React.ReactNode;
}

const TooltipProvider: React.FC<TooltipProviderProps> = ({ children }) => {
  return <>{children}</>;
};

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
export type { TooltipProps, TooltipTriggerProps, TooltipContentProps, TooltipProviderProps };