import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../lib/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-2xl border bg-white dark:bg-neutral-900 shadow-sm',
          className
        )}
        {...props}
      />
    );
  }
);
Card.displayName = 'Card';

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('px-6 py-4 border-b border-neutral-200 dark:border-neutral-800', className)}
        {...props}
      />
    );
  }
);
CardHeader.displayName = 'CardHeader';

interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  className?: string;
}

const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, ...props }, ref) => {
    return (
      <h3
        ref={ref}
        className={cn('text-lg font-semibold text-neutral-900 dark:text-white', className)}
        {...props}
      />
    );
  }
);
CardTitle.displayName = 'CardTitle';

interface CardDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
  className?: string;
}

const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn('text-sm text-neutral-500 dark:text-neutral-400 mt-1', className)}
        {...props}
      />
    );
  }
);
CardDescription.displayName = 'CardDescription';

interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('px-6 py-4', className)}
        {...props}
      />
    );
  }
);
CardContent.displayName = 'CardContent';

interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 rounded-b-2xl', className)}
        {...props}
      />
    );
  }
);
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
export type { CardProps, CardHeaderProps, CardTitleProps, CardDescriptionProps, CardContentProps, CardFooterProps };