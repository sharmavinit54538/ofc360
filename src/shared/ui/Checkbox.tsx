import React, { useEffect, useRef } from 'react';
import { cn } from '../lib/utils';

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  children?: React.ReactNode;
  indeterminate?: boolean;
  inputClassName?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onCheckedChange?: (checked: boolean) => void;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      children,
      className,
      inputClassName,
      id,
      indeterminate = false,
      onChange,
      onCheckedChange,
      ...props
    },
    forwardedRef,
  ) => {
    const generatedId = React.useId();
    const inputRef = useRef<HTMLInputElement | null>(null);
    const resolvedId = id ?? `checkbox-${generatedId}`;

    useEffect(() => {
      if (inputRef.current) inputRef.current.indeterminate = indeterminate;
    }, [indeterminate]);

    const setRef = (node: HTMLInputElement | null) => {
      inputRef.current = node;
      if (typeof forwardedRef === 'function') forwardedRef(node);
      else if (forwardedRef) forwardedRef.current = node;
    };

    return (
      <label
        htmlFor={resolvedId}
        className={cn(
          'inline-flex min-h-5 items-center gap-2 text-sm text-neutral-800 dark:text-neutral-200',
          props.disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
          className,
        )}
      >
        <input
          {...props}
          ref={setRef}
          id={resolvedId}
          type="checkbox"
          aria-checked={indeterminate ? 'mixed' : props.checked}
          onChange={(event) => {
            onChange?.(event);
            onCheckedChange?.(event.target.checked);
          }}
          className={cn('peer sr-only', inputClassName)}
        />
        <span
          aria-hidden="true"
          className={cn(
            'inline-flex h-4 w-4 shrink-0 items-center justify-center rounded border border-neutral-400 bg-white text-white transition-colors dark:border-neutral-600 dark:bg-neutral-900',
            'peer-checked:border-indigo-600 peer-checked:bg-indigo-600 peer-checked:dark:border-indigo-500 peer-checked:dark:bg-indigo-500',
            'peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-indigo-500 peer-focus-visible:ring-offset-2 dark:peer-focus-visible:ring-offset-neutral-950',
            'peer-disabled:opacity-50',
            indeterminate && 'border-indigo-600 bg-indigo-600 dark:border-indigo-500 dark:bg-indigo-500',
          )}
        >
          {indeterminate ? (
            <span className="h-0.5 w-2.5 rounded bg-white" />
          ) : (
            <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none">
              <path d="m3.5 8 3 3 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </span>
        {children != null && <span>{children}</span>}
      </label>
    );
  },
);
Checkbox.displayName = 'Checkbox';
