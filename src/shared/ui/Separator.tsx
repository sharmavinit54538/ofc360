import React, { forwardRef, HTMLAttributes } from 'react';
import { cn } from '../lib/utils';

interface SeparatorProps extends HTMLAttributes<HTMLHRElement> {
  orientation?: 'horizontal' | 'vertical';
  decorative?: boolean;
  className?: string;
}

const Separator = forwardRef<HTMLHRElement, SeparatorProps>(
  ({ orientation = 'horizontal', decorative = true, className, ...props }, ref) => {
    return (
      <hr
        ref={ref}
        role={decorative ? 'none' : 'separator'}
        aria-orientation={decorative ? undefined : orientation}
        className={cn(
          'border-0 bg-neutral-200 dark:bg-neutral-700',
          orientation === 'horizontal' ? 'w-full h-px' : 'h-full w-px',
          className
        )}
        {...props}
      />
    );
  }
);
Separator.displayName = 'Separator';

export { Separator };
export type { SeparatorProps };