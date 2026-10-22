import React, { forwardRef, TextareaHTMLAttributes } from 'react';
import { cn } from '../lib/utils';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
  error?: boolean;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          'w-full px-3 py-2 rounded-lg border bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white',
          'placeholder:text-neutral-400 dark:placeholder:text-neutral-500',
          'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
          'disabled:opacity-50 disabled:cursor-not-allowed resize-y min-h-[80px]',
          error ? 'border-rose-500 focus:ring-rose-500' : 'border-neutral-300 dark:border-neutral-600',
          className
        )}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

export { Textarea };
export type { TextareaProps };