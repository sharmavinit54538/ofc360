/**
 * @file DashboardKpiGrid.tsx
 * @description Executive KPI Card Grid component for Indian Payroll & HR module navigation.
 * Renders 8 modules as interactive cards with live metrics, icons, badges, and active state highlights.
 */

import React from 'react';
import { cn } from '@/shared/lib/utils';
import {
  DASHBOARD_KPI_CARDS,
  type DashboardKpiCardItem,
  type KpiStatusColor,
} from './dashboardKpiCards.data';

export interface DashboardKpiGridProps {
  items?: DashboardKpiCardItem[];
  activeId?: string;
  onSelect?: (id: string) => void;
  className?: string;
}

// Color styles mapping for active states, icon containers, and badges
const COLOR_CONFIG: Record<
  KpiStatusColor,
  {
    iconBg: string;
    iconColor: string;
    activeBorder: string;
    activeBg: string;
    activeRing: string;
    badgeBg: string;
    badgeText: string;
  }
> = {
  indigo: {
    iconBg: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400',
    iconColor: 'text-indigo-600 dark:text-indigo-400',
    activeBorder: 'border-indigo-500 dark:border-indigo-400',
    activeBg: 'bg-indigo-50/50 dark:bg-indigo-950/20',
    activeRing: 'ring-1 ring-indigo-500/30 dark:ring-indigo-400/20',
    badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200/60 dark:bg-indigo-950/50 dark:text-indigo-300 dark:border-indigo-800/60',
    badgeText: 'text-indigo-700 dark:text-indigo-300',
  },
  amber: {
    iconBg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400',
    iconColor: 'text-amber-600 dark:text-amber-400',
    activeBorder: 'border-amber-500 dark:border-amber-400',
    activeBg: 'bg-amber-50/50 dark:bg-amber-950/20',
    activeRing: 'ring-1 ring-amber-500/30 dark:ring-amber-400/20',
    badgeBg: 'bg-amber-50 text-amber-700 border-amber-200/60 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800/60',
    badgeText: 'text-amber-700 dark:text-amber-300',
  },
  emerald: {
    iconBg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    activeBorder: 'border-emerald-500 dark:border-emerald-400',
    activeBg: 'bg-emerald-50/50 dark:bg-emerald-950/20',
    activeRing: 'ring-1 ring-emerald-500/30 dark:ring-emerald-400/20',
    badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200/60 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800/60',
    badgeText: 'text-emerald-700 dark:text-emerald-300',
  },
  purple: {
    iconBg: 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400',
    iconColor: 'text-purple-600 dark:text-purple-400',
    activeBorder: 'border-purple-500 dark:border-purple-400',
    activeBg: 'bg-purple-50/50 dark:bg-purple-950/20',
    activeRing: 'ring-1 ring-purple-500/30 dark:ring-purple-400/20',
    badgeBg: 'bg-purple-50 text-purple-700 border-purple-200/60 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800/60',
    badgeText: 'text-purple-700 dark:text-purple-300',
  },
  blue: {
    iconBg: 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400',
    iconColor: 'text-blue-600 dark:text-blue-400',
    activeBorder: 'border-blue-500 dark:border-blue-400',
    activeBg: 'bg-blue-50/50 dark:bg-blue-950/20',
    activeRing: 'ring-1 ring-blue-500/30 dark:ring-blue-400/20',
    badgeBg: 'bg-blue-50 text-blue-700 border-blue-200/60 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800/60',
    badgeText: 'text-blue-700 dark:text-blue-300',
  },
  teal: {
    iconBg: 'bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400',
    iconColor: 'text-teal-600 dark:text-teal-400',
    activeBorder: 'border-teal-500 dark:border-teal-400',
    activeBg: 'bg-teal-50/50 dark:bg-teal-950/20',
    activeRing: 'ring-1 ring-teal-500/30 dark:ring-teal-400/20',
    badgeBg: 'bg-teal-50 text-teal-700 border-teal-200/60 dark:bg-teal-950/50 dark:text-teal-300 dark:border-teal-800/60',
    badgeText: 'text-teal-700 dark:text-teal-300',
  },
  cyan: {
    iconBg: 'bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400',
    iconColor: 'text-cyan-600 dark:text-cyan-400',
    activeBorder: 'border-cyan-500 dark:border-cyan-400',
    activeBg: 'bg-cyan-50/50 dark:bg-cyan-950/20',
    activeRing: 'ring-1 ring-cyan-500/30 dark:ring-cyan-400/20',
    badgeBg: 'bg-cyan-50 text-cyan-700 border-cyan-200/60 dark:bg-cyan-950/50 dark:text-cyan-300 dark:border-cyan-800/60',
    badgeText: 'text-cyan-700 dark:text-cyan-300',
  },
  rose: {
    iconBg: 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400',
    iconColor: 'text-rose-600 dark:text-rose-400',
    activeBorder: 'border-rose-500 dark:border-rose-400',
    activeBg: 'bg-rose-50/50 dark:bg-rose-950/20',
    activeRing: 'ring-1 ring-rose-500/30 dark:ring-rose-400/20',
    badgeBg: 'bg-rose-50 text-rose-700 border-rose-200/60 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800/60',
    badgeText: 'text-rose-700 dark:text-rose-300',
  },
};

export const DashboardKpiGrid: React.FC<DashboardKpiGridProps> = ({
  items = DASHBOARD_KPI_CARDS,
  activeId = 'overview',
  onSelect,
  className = '',
}) => {
  return (
    <div
      role="tablist"
      aria-label="Payroll modules"
      className={cn('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4', className)}
    >
      {items.map((card) => {
        const Icon = card.icon;
        const isSelected = activeId === card.id;
        const colors = COLOR_CONFIG[card.statusColor] || COLOR_CONFIG.indigo;

        return (
          <button
            key={card.id}
            type="button"
            role="tab"
            aria-selected={isSelected}
            tabIndex={0}
            onClick={() => onSelect?.(card.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelect?.(card.id);
              }
            }}
            className={cn(
              'group relative flex flex-col text-left p-4 sm:p-4.5 rounded-2xl border transition-all duration-200 select-none outline-none',
              'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 dark:focus-visible:ring-offset-zinc-950',
              isSelected
                ? cn(
                    'bg-white dark:bg-[#1a1a1a] shadow-md shadow-gray-200/50 dark:shadow-black/40',
                    colors.activeBorder,
                    colors.activeBg,
                    colors.activeRing
                  )
                : 'bg-white dark:bg-[#171717] border-gray-200 dark:border-zinc-800/80 shadow-sm hover:border-gray-300 dark:hover:border-zinc-700 hover:shadow hover:-translate-y-0.5'
            )}
          >
            {/* Top row: Icon and Badge */}
            <div className="flex items-center justify-between gap-2">
              <div
                className={cn(
                  'w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105',
                  colors.iconBg
                )}
              >
                <Icon className={cn('w-4.5 h-4.5', colors.iconColor)} />
              </div>

              {card.badgeText && (
                <span
                  className={cn(
                    'inline-flex items-center px-2 py-0.5 text-[10px] font-semibold tracking-wide rounded-full border',
                    colors.badgeBg
                  )}
                >
                  {card.badgeText}
                </span>
              )}
            </div>

            {/* Title */}
            <h3 className="mt-3 text-xs font-medium text-gray-500 dark:text-zinc-400 group-hover:text-gray-700 dark:group-hover:text-zinc-200 truncate">
              {card.title}
            </h3>

            {/* Primary KPI Metric */}
            <div className="mt-1 text-lg sm:text-xl font-bold tracking-tight text-gray-900 dark:text-white truncate">
              {card.primaryMetric}
            </div>

            {/* Subtext / Trend */}
            <div className="mt-1.5 flex items-center justify-between text-[11px] text-gray-500 dark:text-zinc-400">
              <span className="truncate">{card.subtext}</span>
            </div>

            {/* Active Pill Indicator bar at bottom */}
            {isSelected && (
              <span
                className={cn(
                  'absolute bottom-0 left-4 right-4 h-0.5 rounded-full',
                  card.statusColor === 'indigo' && 'bg-indigo-600 dark:bg-indigo-400',
                  card.statusColor === 'amber' && 'bg-amber-600 dark:bg-amber-400',
                  card.statusColor === 'emerald' && 'bg-emerald-600 dark:bg-emerald-400',
                  card.statusColor === 'purple' && 'bg-purple-600 dark:bg-purple-400',
                  card.statusColor === 'blue' && 'bg-blue-600 dark:bg-blue-400',
                  card.statusColor === 'teal' && 'bg-teal-600 dark:bg-teal-400',
                  card.statusColor === 'cyan' && 'bg-cyan-600 dark:bg-cyan-400',
                  card.statusColor === 'rose' && 'bg-rose-600 dark:bg-rose-400'
                )}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};

