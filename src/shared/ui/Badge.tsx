import React from 'react';
import { UserRole } from '@/features/auth/types/auth.types';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'brand' | 'success' | 'warning' | 'danger' | 'slate' | 'role';
  role?: UserRole;
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'brand',
  role,
  size = 'md',
  className = '',
}) => {
  let colorStyles = 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-900/30';

  if (role) {
    switch (role) {
      case 'SUPER_ADMIN':
        colorStyles = 'bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-900/30';
        break;
      case 'HR_ADMIN':
        colorStyles = 'bg-pink-50 dark:bg-pink-950/30 text-pink-600 dark:text-pink-400 border-pink-200 dark:border-pink-900/30';
        break;
      case 'MANAGER':
        colorStyles = 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/30';
        break;
      case 'EMPLOYEE':
        colorStyles = 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/30';
        break;
      case 'IT_ADMIN':
        colorStyles = 'bg-cyan-50 dark:bg-cyan-950/30 text-cyan-600 dark:text-cyan-400 border-cyan-200 dark:border-cyan-900/30';
        break;
    }
  } else {
    switch (variant) {
      case 'success':
        colorStyles = 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/30';
        break;
      case 'warning':
        colorStyles = 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/30';
        break;
      case 'danger':
        colorStyles = 'bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/30';
        break;
      case 'slate':
        colorStyles = 'bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 border-gray-200 dark:border-zinc-700';
        break;
      case 'brand':
      default:
        colorStyles = 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-900/30';
        break;
    }
  }

  const sizeStyles = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1 font-semibold tracking-wide uppercase rounded-full border ${colorStyles} ${sizeStyles} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {children}
    </span>
  );
};
