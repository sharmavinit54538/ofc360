import React, { forwardRef, useId, useState, useRef, useEffect } from 'react';
import { cn } from '../lib/utils';
import { ChevronDown, Check } from 'lucide-react';
import { Portal } from './Portal';

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  options?: SelectOption[];
  placeholder?: string;
  error?: boolean;
  className?: string;
  children?: React.ReactNode;
  onValueChange?: (value: string) => void;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ options, placeholder, error, className, children, onValueChange, onChange, ...props }, ref) => {
    return (
      <select
        ref={ref}
        onChange={(e) => {
          onChange?.(e);
          onValueChange?.(e.target.value);
        }}
        className={cn(
          'w-full px-3 py-2 rounded-lg border bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white',
          'placeholder:text-neutral-400 dark:placeholder:text-neutral-500',
          'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          error && 'border-rose-500 focus:ring-rose-500',
          className
        )}
        {...props}
      >
        {placeholder && <option value="" disabled>{placeholder}</option>}
        {options?.map((opt) => (
          <option key={opt.value} value={opt.value} disabled={opt.disabled}>
            {opt.label}
          </option>
        ))}
        {children}
      </select>
    );
  }
);
Select.displayName = 'Select';

interface SelectTriggerProps {
  value?: string;
  placeholder?: string;
  error?: boolean;
  disabled?: boolean;
  className?: string;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

const SelectTrigger = forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ value, placeholder, error, disabled, className, onOpenChange, children, ...props }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const triggerRef = useRef<HTMLButtonElement | null>(null);
    const contentRef = useRef<HTMLDivElement | null>(null);
    const id = useId();

    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (triggerRef.current && !triggerRef.current.contains(e.target as Node) &&
            contentRef.current && !contentRef.current.contains(e.target as Node)) {
          setIsOpen(false);
          onOpenChange?.(false);
        }
      };

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
      }
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onOpenChange]);

    return (
      <div className="relative">
        <button
          ref={(el) => {
            triggerRef.current = el;
            if (typeof ref === 'function') {
              ref(el);
            } else if (ref) {
              (ref as React.MutableRefObject<HTMLButtonElement | null>).current = el;
            }
          }}
          type="button"
          onClick={() => { if (!disabled) { setIsOpen(!isOpen); onOpenChange?.(!isOpen); } }}
          disabled={disabled}
          className={cn(
            'w-full flex items-center justify-between px-3 py-2 rounded-lg border bg-white dark:bg-neutral-900 text-left',
            'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error ? 'border-rose-500' : 'border-neutral-300 dark:border-neutral-600',
            'hover:border-indigo-500 dark:hover:border-indigo-500',
            className
          )}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls={`${id}-content`}
          {...props}
        >
          <span className={cn('truncate', value ? 'text-neutral-900 dark:text-white' : 'text-neutral-400 dark:text-neutral-500')}>
            {value || children || placeholder}
          </span>
          <ChevronDown className={cn('w-4 h-4 text-neutral-400 flex-shrink-0 ml-2 transition-transform', isOpen && 'rotate-180')} />
        </button>
        {isOpen && (
          <Portal>
            <div
              ref={contentRef}
              id={`${id}-content`}
              className="fixed z-50 w-full max-h-60 overflow-y-auto rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-lg mt-1"
              role="listbox"
            >
              {children}
            </div>
          </Portal>
        )}
      </div>
    );
  }
);
SelectTrigger.displayName = 'SelectTrigger';

interface SelectContentProps {
  children: React.ReactNode;
  className?: string;
}

const SelectContent = ({ children, className }: SelectContentProps) => {
  return <div className={cn('py-1', className)}>{children}</div>;
};

interface SelectItemProps {
  value: string;
  label?: string;
  children?: React.ReactNode;
  disabled?: boolean;
  selected?: boolean;
  onSelect?: (value: string) => void;
  className?: string;
}

const SelectItem = forwardRef<HTMLDivElement, SelectItemProps>(
  ({ value, label, children, disabled, selected, onSelect, className, ...props }, ref) => {
    const handleClick = () => {
      if (!disabled) onSelect?.(value);
    };

    return (
      <div
        ref={ref}
        role="option"
        aria-selected={selected}
        aria-disabled={disabled}
        onClick={handleClick}
        className={cn(
          'px-3 py-2 cursor-pointer transition-colors',
          'hover:bg-neutral-100 dark:hover:bg-neutral-800',
          selected && 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400',
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
        {...props}
      >
        <span className="flex items-center">
          {selected && <Check className="w-4 h-4 mr-2 flex-shrink-0" />}
          {children || label}
        </span>
      </div>
    );
  }
);
SelectItem.displayName = 'SelectItem';

interface SelectValueProps {
  placeholder?: string;
  className?: string;
}

const SelectValue = ({ placeholder, className }: SelectValueProps) => {
  return <span className={cn('text-neutral-400 dark:text-neutral-500', className)}>{placeholder}</span>;
};

export { Select, SelectTrigger, SelectContent, SelectItem, SelectValue };
export type { SelectProps, SelectTriggerProps, SelectContentProps, SelectItemProps, SelectValueProps };