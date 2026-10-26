import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      className = '',
      type = 'button',
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

    const variants = {
      primary:
        'bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white shadow-lg shadow-brand-500/25 border border-brand-400/30 focus:ring-brand-500 focus:ring-offset-white dark:focus:ring-offset-[#212121]',
      secondary:
        'bg-gray-900 hover:bg-gray-800 text-white border border-gray-700 focus:ring-gray-400 focus:ring-offset-white dark:bg-gray-100 dark:hover:bg-gray-200 dark:text-gray-900 dark:border-gray-300 dark:focus:ring-offset-[#212121]',
      outline:
        'bg-transparent hover:bg-gray-100 dark:hover:bg-[#2f2f2f] text-gray-900 dark:text-white border border-gray-300 dark:border-zinc-700 hover:border-gray-400 dark:hover:border-zinc-600 focus:ring-brand-500 focus:ring-offset-white dark:focus:ring-offset-[#212121]',
      ghost:
        'bg-transparent hover:bg-gray-100 dark:hover:bg-[#2f2f2f] text-gray-700 dark:text-zinc-300 hover:text-gray-900 dark:hover:text-white focus:ring-gray-400 focus:ring-offset-white dark:focus:ring-offset-[#212121]',
      danger:
        'bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white shadow-lg shadow-rose-500/20 border border-rose-400/30 focus:ring-rose-500 focus:ring-offset-white dark:focus:ring-offset-[#212121]',
      destructive:
        'bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white shadow-lg shadow-rose-500/20 border border-rose-400/30 focus:ring-rose-500 focus:ring-offset-white dark:focus:ring-offset-[#212121]',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-xs gap-1.5',
      md: 'px-4 py-2.5 text-sm gap-2',
      lg: 'px-5 py-3.5 text-base gap-2.5',
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin shrink-0" />
            <span>Processing...</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}
            <span>{children}</span>
            {rightIcon && <span className="shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
