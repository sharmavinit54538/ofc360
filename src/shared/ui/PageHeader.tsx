import React from 'react';
import { cn } from '../lib/utils';

export interface PageHeaderProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  title: React.ReactNode;
  description?: React.ReactNode;
  eyebrow?: React.ReactNode;
  actions?: React.ReactNode;
}

export const PageHeader = React.forwardRef<HTMLElement, PageHeaderProps>(
  ({ title, description, eyebrow, actions, className, ...props }, ref) => (
    <header
      {...props}
      ref={ref}
      className={cn(
        'flex flex-col gap-4 border-b border-neutral-200 pb-5 dark:border-neutral-800 sm:flex-row sm:items-end sm:justify-between',
        className,
      )}
    >
      <div className="min-w-0">
        {eyebrow != null && (
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
            {eyebrow}
          </p>
        )}
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-950 dark:text-white sm:text-3xl">
          {title}
        </h1>
        {description != null && (
          <p className="mt-1 max-w-3xl text-sm text-neutral-600 dark:text-neutral-400">
            {description}
          </p>
        )}
      </div>
      {actions != null && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </header>
  ),
);
PageHeader.displayName = 'PageHeader';
