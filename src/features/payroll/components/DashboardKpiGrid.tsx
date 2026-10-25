/**
 * @file DashboardKpiGrid.tsx
 * @description 8-Module KPI Card Grid for Indian Payroll & HR modules.
 * 1. Overview
 * 2. Payroll Batches & Lifecycle
 * 3. Payslips
 * 4. Salary Structures (CTC)
 * 5. Pay Components Catalog
 * 6. Statutory Engine
 * 7. EPFO PF & ECR Compliance
 * 8. Tax Declarations
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
    badgeBg: string;
  }
> = {
  indigo: {
    iconBg: 'bg-indigo-50 dark:bg-indigo-950/60',
    iconColor: 'text-indigo-600 dark:text-indigo-400',
    activeBorder: 'border-indigo-600 dark:border-indigo-500 ring-2 ring-indigo-500/25 bg-indigo-50/20 dark:bg-indigo-950/20',
    badgeBg: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300',
  },
  amber: {
    iconBg: 'bg-amber-50 dark:bg-amber-950/60',
    iconColor: 'text-amber-600 dark:text-amber-400',
    activeBorder: 'border-amber-500 dark:border-amber-400 ring-2 ring-amber-500/25 bg-amber-50/20 dark:bg-amber-950/20',
    badgeBg: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300',
  },
  emerald: {
    iconBg: 'bg-emerald-50 dark:bg-emerald-950/60',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    activeBorder: 'border-emerald-500 dark:border-emerald-400 ring-2 ring-emerald-500/25 bg-emerald-50/20 dark:bg-emerald-950/20',
    badgeBg: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300',
  },
  purple: {
    iconBg: 'bg-purple-50 dark:bg-purple-950/60',
    iconColor: 'text-purple-600 dark:text-purple-400',
    activeBorder: 'border-purple-500 dark:border-purple-400 ring-2 ring-purple-500/25 bg-purple-50/20 dark:bg-purple-950/20',
    badgeBg: 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300',
  },
  blue: {
    iconBg: 'bg-blue-50 dark:bg-blue-950/60',
    iconColor: 'text-blue-600 dark:text-blue-400',
    activeBorder: 'border-blue-500 dark:border-blue-400 ring-2 ring-blue-500/25 bg-blue-50/20 dark:bg-blue-950/20',
    badgeBg: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300',
  },
  teal: {
    iconBg: 'bg-teal-50 dark:bg-teal-950/60',
    iconColor: 'text-teal-600 dark:text-teal-400',
    activeBorder: 'border-teal-500 dark:border-teal-400 ring-2 ring-teal-500/25 bg-teal-50/20 dark:bg-teal-950/20',
    badgeBg: 'bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300',
  },
  cyan: {
    iconBg: 'bg-cyan-50 dark:bg-cyan-950/60',
    iconColor: 'text-cyan-600 dark:text-cyan-400',
    activeBorder: 'border-cyan-500 dark:border-cyan-400 ring-2 ring-cyan-500/25 bg-cyan-50/20 dark:bg-cyan-950/20',
    badgeBg: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300',
  },
  rose: {
    iconBg: 'bg-rose-50 dark:bg-rose-950/60',
    iconColor: 'text-rose-600 dark:text-rose-400',
    activeBorder: 'border-rose-500 dark:border-rose-400 ring-2 ring-rose-500/25 bg-rose-50/20 dark:bg-rose-950/20',
    badgeBg: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300',
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
        'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4',
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
              'group relative flex flex-col justify-between p-4 rounded-2xl border transition-all duration-200 cursor-pointer select-none outline-none',
              'bg-white dark:bg-[#171717]',
              'hover:shadow-md hover:-translate-y-0.5',
              'focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950',
              isSelected
                ? cn(theme.activeBorder, 'shadow-md')
                : 'border-gray-200 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700 shadow-sm'
            )}
          >
            {/* Colored Rounded Icon Box */}
            <div
              className={cn(
                'w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105',
                theme.iconBg
              )}
            >
              <Icon className={cn('w-5 h-5', theme.iconColor)} />
            </div>

            {/* Module Title */}
            <h3
              className={cn(
                'mt-3.5 text-sm font-bold tracking-tight transition-colors line-clamp-1',
                isSelected
                  ? 'text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400'
              )}
            >
              {card.title}
            </h3>

            {/* Active Bottom Indicator */}
            {isSelected && (
              <div className="absolute -bottom-px left-6 right-6 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full" />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default DashboardKpiGrid;
