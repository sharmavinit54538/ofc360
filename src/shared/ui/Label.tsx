import { forwardRef, type LabelHTMLAttributes } from 'react';
import { cn } from '../lib/utils';

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  className?: string;
}

const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(
          'block text-sm font-medium text-neutral-700 dark:text-neutral-300',
          className
        )}
        {...props}
      >
        {children}
      </label>
    );
  }
);
Label.displayName = 'Label';

export { Label };
export type { LabelProps };