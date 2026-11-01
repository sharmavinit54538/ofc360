import React from 'react';
import { cn } from '../lib/utils';

export interface ProgressProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  value?: number | null;
  min?: number;
  max?: number;
  label?: string;
  indicatorClassName?: string;
}

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      value = null,
      min = 0,
      max = 100,
      label,
      className,
      indicatorClassName,
      ...props
    },
    ref,
  ) => {
    const safeMax = max > min ? max : min + 1;
    const clampedValue = value == null ? null : Math.min(safeMax, Math.max(min, value));
    const percentage = clampedValue == null ? 36 : ((clampedValue - min) / (safeMax - min)) * 100;

    return (
      <div
        {...props}
        ref={ref}
        role="progressbar"
        aria-label={label ?? props['aria-label'] ?? 'Progress'}
        aria-valuemin={min}
        aria-valuemax={safeMax}
        aria-valuenow={clampedValue ?? undefined}
        data-state={clampedValue == null ? 'indeterminate' : 'determinate'}
        className={cn('relative h-2 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800', className)}
      >
        <div
          aria-hidden="true"
          className={cn(
            'h-full rounded-full bg-indigo-600 transition-[width] duration-300 dark:bg-indigo-500',
            clampedValue == null && 'animate-pulse',
            indicatorClassName,
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    );
  },
);
Progress.displayName = 'Progress';
