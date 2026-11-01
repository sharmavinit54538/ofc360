import React, { forwardRef, useId, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';

type AccordionValue = string | string[];

export interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: 'single' | 'multiple';
  value?: AccordionValue;
  defaultValue?: AccordionValue;
  collapsible?: boolean;
  onValueChange?: (value: AccordionValue) => void;
}

interface AccordionItemCloneProps {
  value: string;
  isOpen?: boolean;
  disabled?: boolean;
  onToggle?: (open: boolean, itemValue: string) => void;
}

export const Accordion = forwardRef<HTMLDivElement, AccordionProps>(
  (
    {
      type = 'multiple',
      value: controlledValue,
      defaultValue,
      collapsible = false,
      onValueChange,
      children,
      className,
      ...props
    },
    ref,
  ) => {
    const [uncontrolledValue, setUncontrolledValue] = useState<AccordionValue>(
      defaultValue ?? (type === 'multiple' ? [] : ''),
    );
    const isControlled = controlledValue !== undefined;
    const activeValue = isControlled ? controlledValue : uncontrolledValue;
    const values = Array.isArray(activeValue) ? activeValue : activeValue ? [activeValue] : [];

    const handleToggle = (open: boolean, itemValue: string) => {
      let nextValue: AccordionValue;
      if (type === 'single') {
        const isOpen = values.includes(itemValue);
        if (open) nextValue = itemValue;
        else if (isOpen && collapsible) nextValue = '';
        else return;
      } else {
        nextValue = open
          ? [...values, itemValue]
          : values.filter((valueItem) => valueItem !== itemValue);
      }

      if (!isControlled) setUncontrolledValue(nextValue);
      onValueChange?.(nextValue);
    };

    return (
      <div ref={ref} className={cn('space-y-2', className)} data-orientation="vertical" {...props}>
        {React.Children.map(children, (child) => {
          if (!React.isValidElement(child)) return child;
          const item = child as React.ReactElement<AccordionItemCloneProps>;
          return React.cloneElement(item, {
            isOpen: values.includes(item.props.value),
            onToggle: handleToggle,
          });
        })}
      </div>
    );
  },
);
Accordion.displayName = 'Accordion';

export interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  isOpen?: boolean;
  disabled?: boolean;
  onToggle?: (open: boolean, value: string) => void;
}

interface AccordionPartCloneProps {
  isOpen?: boolean;
  disabled?: boolean;
  onToggle?: (open: boolean) => void;
  triggerId?: string;
  contentId?: string;
}

export const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ value, isOpen = false, disabled = false, onToggle, children, className, ...props }, ref) => {
    const itemId = useId();
    const triggerId = `accordion-trigger-${itemId}`;
    const contentId = `accordion-content-${itemId}`;

    return (
      <div
        ref={ref}
        className={cn('border rounded-xl overflow-hidden', className)}
        data-state={isOpen ? 'open' : 'closed'}
        data-disabled={disabled ? '' : undefined}
        {...props}
      >
        {React.Children.map(children, (child) => {
          if (!React.isValidElement(child)) return child;
          const part = child as React.ReactElement<AccordionPartCloneProps>;
          return React.cloneElement(part, {
            isOpen,
            disabled,
            triggerId,
            contentId,
            onToggle: (open: boolean) => onToggle?.(open, value),
          });
        })}
      </div>
    );
  },
);
AccordionItem.displayName = 'AccordionItem';

export interface AccordionTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isOpen?: boolean;
  triggerId?: string;
  contentId?: string;
  onToggle?: (open: boolean) => void;
}

export const AccordionTrigger = forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  (
    {
      isOpen = false,
      disabled,
      onToggle,
      onClick,
      triggerId,
      contentId,
      children,
      className,
      type = 'button',
      ...props
    },
    ref,
  ) => (
    <button
      {...props}
      ref={ref}
      id={triggerId}
      type={type}
      disabled={disabled}
      aria-expanded={isOpen}
      aria-controls={contentId}
      data-state={isOpen ? 'open' : 'closed'}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented && !disabled) onToggle?.(!isOpen);
      }}
      className={cn(
        'w-full flex items-center justify-between p-4 text-left',
        'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-inset',
        'hover:bg-neutral-50 dark:hover:bg-neutral-800',
        className,
      )}
    >
      <span>{children}</span>
      <ChevronDown className={cn('w-4 h-4 text-neutral-400 flex-shrink-0 ml-4 transition-transform', isOpen && 'rotate-180')} aria-hidden="true" />
    </button>
  ),
);
AccordionTrigger.displayName = 'AccordionTrigger';

export interface AccordionContentProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen?: boolean;
  triggerId?: string;
  contentId?: string;
}

export const AccordionContent = forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ isOpen = false, children, className, triggerId, contentId, ...props }, ref) => {
    if (!isOpen) return null;
    return (
      <div
        {...props}
        ref={ref}
        id={contentId}
        role="region"
        aria-labelledby={triggerId}
        data-state="open"
        className={cn('overflow-hidden', className)}
      >
        <div style={{ animation: 'accordion-down 200ms ease-out' }}>{children}</div>
      </div>
    );
  },
);
AccordionContent.displayName = 'AccordionContent';
