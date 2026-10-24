import React, { forwardRef } from 'react';
import { cn } from '../lib/utils';

interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  className?: string;
  onCheckedChange?: (checked: boolean) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, checked, disabled, id, onCheckedChange, onChange, ...props }, ref) => {
    const generatedId = React.useId();
    const checkboxId = id || generatedId;

    return (
      <label className="inline-flex items-center cursor-pointer">
        <input
          ref={ref}
          type="checkbox"
          id={checkboxId}
          checked={checked}
          disabled={disabled}
          onChange={(e) => {
            onChange?.(e);
            onCheckedChange?.(e.target.checked);
          }}
          className={cn(
            'sr-only peer',
            'checked:bg-indigo-600 checked:border-indigo-600',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2'
          )}
          {...props}
        />
        <span
          className={cn(
            'relative inline-block w-11 h-6 rounded-full border-2 transition-colors',
            'bg-neutral-200 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600',
            'peer-checked:bg-indigo-600 peer-checked:border-indigo-600',
            'peer-focus:ring-2 peer-focus:ring-indigo-500 peer-focus:ring-offset-2 dark:peer-focus:ring-offset-neutral-900',
            'disabled:opacity-50',
            className
          )}
          aria-hidden="true"
        >
          <span
            className={cn(
              'absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform',
              'peer-checked:translate-x-full',
              'disabled:opacity-50'
            )}
          />
        </span>
      </label>
    );
  }
);
Switch.displayName = 'Switch';

export { Switch };
export type { SwitchProps };