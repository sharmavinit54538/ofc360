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
  let colorStyles = 'bg-brand-500/10 text-brand-300 border-brand-500/20';

  if (role) {
    switch (role) {
      case 'SUPER_ADMIN':
        colorStyles = 'bg-purple-500/15 text-purple-300 border-purple-500/30';
        break;
      case 'HR_ADMIN':
        colorStyles = 'bg-pink-500/15 text-pink-300 border-pink-500/30';
        break;
      case 'MANAGER':
        colorStyles = 'bg-amber-500/15 text-amber-300 border-amber-500/30';
        break;
      case 'EMPLOYEE':
        colorStyles = 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
        break;
      case 'IT_ADMIN':
        colorStyles = 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30';
        break;
    }
  } else {
    switch (variant) {
      case 'success':
        colorStyles = 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20';
        break;
      case 'warning':
        colorStyles = 'bg-amber-500/10 text-amber-300 border-amber-500/20';
        break;
      case 'danger':
        colorStyles = 'bg-rose-500/10 text-rose-300 border-rose-500/20';
        break;
      case 'slate':
        colorStyles = 'bg-slate-800 text-slate-300 border-slate-700';
        break;
      case 'brand':
      default:
        colorStyles = 'bg-brand-500/10 text-brand-300 border-brand-500/20';
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
