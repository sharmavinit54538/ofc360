import React from 'react';
import { cn } from '../lib/utils';

export interface SliderProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'defaultValue' | 'onChange'> {
  value?: number;
  defaultValue?: number;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onValueChange?: (value: number) => void;
}

export const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  (
    {
      value,
      defaultValue,
      min = 0,
      max = 100,
      step = 1,
      disabled,
      className,
      onChange,
      onValueChange,
      'aria-label': ariaLabel,
      ...props
    },
    ref,
  ) => (
    <input
      {...props}
      ref={ref}
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      defaultValue={defaultValue}
      disabled={disabled}
      aria-label={ariaLabel ?? (props['aria-labelledby'] ? undefined : 'Slider')}
      onChange={(event) => {
        onChange?.(event);
        onValueChange?.(Number(event.target.value));
      }}
      className={cn(
        'h-2 w-full cursor-pointer appearance-none rounded-full bg-neutral-200 accent-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:bg-neutral-800 dark:accent-indigo-500 dark:focus-visible:ring-offset-neutral-950',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
    />
  ),
);
Slider.displayName = 'Slider';
