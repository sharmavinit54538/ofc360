/**
 * @file DashboardKpiGrid.tsx
 * @description Ultra-clean, minimal 8-card grid launcher for Indian Payroll & HR modules.
 * Focuses purely on icon box and module title with responsive layout and smooth hover interactions.
 */

import React from 'react';
import { cn } from '@/shared/lib/utils';
import {
  DASHBOARD_LAUNCHER_CARDS,
  type DashboardLauncherCardItem,
  type CardThemeColor,
} from './dashboardKpiCards.data';

export interface DashboardKpiGridProps {
  items?: DashboardLauncherCardItem[];
  activeId?: string | null;
  onSelect?: (id: string) => void;
  className?: string;
}

const THEME_STYLES: Record<
  CardThemeColor,
  {
    iconBg: string;
    iconColor: string;
    activeBorder: string;
  }
> = {
  indigo: {
    iconBg: 'bg-indigo-50 dark:bg-indigo-950/60',
    iconColor: 'text-indigo-600 dark:text-indigo-400',
    activeBorder: 'border-indigo-500 dark:border-indigo-400 ring-2 ring-indigo-500/20',
  },
  amber: {
    iconBg: 'bg-amber-50 dark:bg-amber-950/60',
    iconColor: 'text-amber-600 dark:text-amber-400',
    activeBorder: 'border-amber-500 dark:border-amber-400 ring-2 ring-amber-500/20',
  },
  emerald: {
    iconBg: 'bg-emerald-50 dark:bg-emerald-950/60',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    activeBorder: 'border-emerald-500 dark:border-emerald-400 ring-2 ring-emerald-500/20',
  },
  purple: {
    iconBg: 'bg-purple-50 dark:bg-purple-950/60',
    iconColor: 'text-purple-600 dark:text-purple-400',
    activeBorder: 'border-purple-500 dark:border-purple-400 ring-2 ring-purple-500/20',
  },
  blue: {
    iconBg: 'bg-blue-50 dark:bg-blue-950/60',
    iconColor: 'text-blue-600 dark:text-blue-400',
    activeBorder: 'border-blue-500 dark:border-blue-400 ring-2 ring-blue-500/20',
  },
  teal: {
    iconBg: 'bg-teal-50 dark:bg-teal-950/60',
    iconColor: 'text-teal-600 dark:text-teal-400',
    activeBorder: 'border-teal-500 dark:border-teal-400 ring-2 ring-teal-500/20',
  },
  cyan: {
    iconBg: 'bg-cyan-50 dark:bg-cyan-950/60',
    iconColor: 'text-cyan-600 dark:text-cyan-400',
    activeBorder: 'border-cyan-500 dark:border-cyan-400 ring-2 ring-cyan-500/20',
  },
  rose: {
    iconBg: 'bg-rose-50 dark:bg-rose-950/60',
    iconColor: 'text-rose-600 dark:text-rose-400',
    activeBorder: 'border-rose-500 dark:border-rose-400 ring-2 ring-rose-500/20',
  },
};

export const DashboardKpiGrid: React.FC<DashboardKpiGridProps> = ({
  items = DASHBOARD_LAUNCHER_CARDS,
  activeId,
  onSelect,
  className = '',
}) => {
  return (
    <div
      role="region"
      aria-label="Payroll Feature Modules"
      className={cn(
        'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5',
        className
      )}
    >
      {items.map((card) => {
        const Icon = card.icon;
        const isSelected = activeId === card.id;
        const theme = THEME_STYLES[card.theme] || THEME_STYLES.indigo;

        return (
          <div
            key={card.id}
            role="button"
            tabIndex={0}
            aria-selected={isSelected}
            onClick={() => onSelect?.(card.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelect?.(card.id);
              }
            }}
            className={cn(
              'group flex flex-col items-start p-5 rounded-2xl border transition-all duration-200 cursor-pointer select-none outline-none',
              'bg-white dark:bg-[#171717]',
              'hover:shadow-md hover:-translate-y-0.5 hover:border-indigo-400/80 dark:hover:border-indigo-500/80',
              'focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950',
              isSelected
                ? cn(theme.activeBorder, 'shadow-sm bg-slate-50/50 dark:bg-[#1c1c1c]')
                : 'border-gray-200 dark:border-zinc-800 shadow-sm'
            )}
          >
            {/* Colored Rounded Icon Box */}
            <div
              className={cn(
                'w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105',
                theme.iconBg
              )}
            >
              <Icon className={cn('w-6 h-6', theme.iconColor)} />
            </div>

            {/* Bold Module Title */}
            <h3 className="mt-4 text-base font-bold text-gray-900 dark:text-white tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {card.title}
            </h3>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardKpiGrid;
