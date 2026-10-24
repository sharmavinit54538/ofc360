import React, { forwardRef } from 'react';
import { cn } from '../lib/utils';
import { ChevronDown } from 'lucide-react';

interface AccordionProps {
  type?: 'single' | 'multiple';
  value?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  children: React.ReactNode;
  className?: string;
}

const Accordion = forwardRef<HTMLDivElement, AccordionProps>(
  ({ type = 'multiple', value, onValueChange, children, className, ...props }, ref) => {
    const values = Array.isArray(value) ? value : value ? [value] : [];

    return (
      <div ref={ref} className={cn('space-y-2', className)} {...props}>
        {React.Children.map(children, (child) => {
          if (!React.isValidElement(child)) return child;
          return React.cloneElement(child as React.ReactElement<any>, {
            isOpen: values.includes((child.props as any).value),
            onToggle: (open: boolean, itemValue: string) => {
              if (type === 'single') {
                onValueChange?.(open ? itemValue : '');
              } else {
                const newValues = open
                  ? [...values, itemValue]
                  : values.filter((v) => v !== itemValue);
                onValueChange?.(newValues);
              }
            },
          });
        })}
      </div>
    );
  }
);
Accordion.displayName = 'Accordion';

interface AccordionItemProps {
  value: string;
  isOpen?: boolean;
  onToggle?: (open: boolean, value: string) => void;
  children: React.ReactNode;
  className?: string;
}

const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ value, isOpen = false, onToggle, children, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('border rounded-xl overflow-hidden', className)} {...props}>
        {React.Children.map(children, (child) => {
          if (!React.isValidElement(child)) return child;
          return React.cloneElement(child as React.ReactElement<any>, {
            isOpen,
            onToggle: (open: boolean) => onToggle?.(open, value),
          });
        })}
      </div>
    );
  }
);
AccordionItem.displayName = 'AccordionItem';

interface AccordionTriggerProps {
  isOpen?: boolean;
  onToggle?: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
}

const AccordionTrigger = forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ isOpen = false, onToggle, children, className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        onClick={() => onToggle?.(!isOpen)}
        className={cn(
          'w-full flex items-center justify-between p-4 text-left',
          'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-inset',
          'hover:bg-neutral-50 dark:hover:bg-neutral-800',
          className
        )}
        aria-expanded={isOpen}
        {...props}
      >
        <span>{children}</span>
        <ChevronDown className={cn('w-4 h-4 text-neutral-400 flex-shrink-0 ml-4 transition-transform', isOpen && 'rotate-180')} />
      </button>
    );
  }
);
AccordionTrigger.displayName = 'AccordionTrigger';

interface AccordionContentProps {
  isOpen?: boolean;
  children: React.ReactNode;
  className?: string;
}

const AccordionContent = forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ isOpen = false, children, className, ...props }, ref) => {
    if (!isOpen) return null;
    return (
      <div ref={ref} className={cn('overflow-hidden', className)} {...props}>
        <div style={{ animation: 'accordion-down 200ms ease-out' }}>
          {children}
        </div>
      </div>
    );
  }
);
AccordionContent.displayName = 'AccordionContent';

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
export type { AccordionProps, AccordionItemProps, AccordionTriggerProps, AccordionContentProps };