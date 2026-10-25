/**
 * @file DashboardKpiGrid.tsx
 * @description Rich "Feature & Module Launcher Card" layout for Indian Payroll & HR modules.
 * Renders an executive 3-column responsive grid with pastel gradient wash, pulsating badges,
 * capability tags, and animated action footers.
 */

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import {
  DASHBOARD_LAUNCHER_CARDS,
  type DashboardLauncherCardItem,
  type CardThemeColor,
} from './dashboardKpiCards.data';

export interface DashboardKpiGridProps {
  items?: DashboardLauncherCardItem[];
  activeId?: string;
  onSelect?: (id: string) => void;
  className?: string;
}

interface ThemeTokens {
  iconBg: string;
  iconColor: string;
  badgeBg: string;
  badgeText: string;
  pulseDot: string;
  washBg: string;
  activeRing: string;
}

const THEME_STYLES: Record<CardThemeColor, ThemeTokens> = {
  indigo: {
    iconBg: 'bg-indigo-50 dark:bg-indigo-950/50',
    iconColor: 'text-indigo-600 dark:text-indigo-400',
    badgeBg: 'bg-indigo-50/80 dark:bg-indigo-950/60 border border-indigo-200/50 dark:border-indigo-800/50',
    badgeText: 'text-indigo-700 dark:text-indigo-300',
    pulseDot: 'bg-indigo-500 dark:bg-indigo-400',
    washBg: 'bg-gradient-to-br from-indigo-100/60 via-indigo-50/20 to-transparent dark:from-indigo-900/25 dark:via-indigo-950/10',
    activeRing: 'ring-2 ring-indigo-500 border-indigo-200 dark:border-indigo-800',
  },
  amber: {
    iconBg: 'bg-amber-50 dark:bg-amber-950/50',
    iconColor: 'text-amber-600 dark:text-amber-400',
    badgeBg: 'bg-amber-50/80 dark:bg-amber-950/60 border border-amber-200/50 dark:border-amber-800/50',
    badgeText: 'text-amber-700 dark:text-amber-300',
    pulseDot: 'bg-amber-500 dark:bg-amber-400',
    washBg: 'bg-gradient-to-br from-amber-100/60 via-amber-50/20 to-transparent dark:from-amber-900/25 dark:via-amber-950/10',
    activeRing: 'ring-2 ring-amber-500 border-amber-200 dark:border-amber-800',
  },
  emerald: {
    iconBg: 'bg-emerald-50 dark:bg-emerald-950/50',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    badgeBg: 'bg-emerald-50/80 dark:bg-emerald-950/60 border border-emerald-200/50 dark:border-emerald-800/50',
    badgeText: 'text-emerald-700 dark:text-emerald-300',
    pulseDot: 'bg-emerald-500 dark:bg-emerald-400',
    washBg: 'bg-gradient-to-br from-emerald-100/60 via-emerald-50/20 to-transparent dark:from-emerald-900/25 dark:via-emerald-950/10',
    activeRing: 'ring-2 ring-emerald-500 border-emerald-200 dark:border-emerald-800',
  },
  purple: {
    iconBg: 'bg-purple-50 dark:bg-purple-950/50',
    iconColor: 'text-purple-600 dark:text-purple-400',
    badgeBg: 'bg-purple-50/80 dark:bg-purple-950/60 border border-purple-200/50 dark:border-purple-800/50',
    badgeText: 'text-purple-700 dark:text-purple-300',
    pulseDot: 'bg-purple-500 dark:bg-purple-400',
    washBg: 'bg-gradient-to-br from-purple-100/60 via-purple-50/20 to-transparent dark:from-purple-900/25 dark:via-purple-950/10',
    activeRing: 'ring-2 ring-purple-500 border-purple-200 dark:border-purple-800',
  },
  blue: {
    iconBg: 'bg-blue-50 dark:bg-blue-950/50',
    iconColor: 'text-blue-600 dark:text-blue-400',
    badgeBg: 'bg-blue-50/80 dark:bg-blue-950/60 border border-blue-200/50 dark:border-blue-800/50',
    badgeText: 'text-blue-700 dark:text-blue-300',
    pulseDot: 'bg-blue-500 dark:bg-blue-400',
    washBg: 'bg-gradient-to-br from-blue-100/60 via-blue-50/20 to-transparent dark:from-blue-900/25 dark:via-blue-950/10',
    activeRing: 'ring-2 ring-blue-500 border-blue-200 dark:border-blue-800',
  },
  teal: {
    iconBg: 'bg-teal-50 dark:bg-teal-950/50',
    iconColor: 'text-teal-600 dark:text-teal-400',
    badgeBg: 'bg-teal-50/80 dark:bg-teal-950/60 border border-teal-200/50 dark:border-teal-800/50',
    badgeText: 'text-teal-700 dark:text-teal-300',
    pulseDot: 'bg-teal-500 dark:bg-teal-400',
    washBg: 'bg-gradient-to-br from-teal-100/60 via-teal-50/20 to-transparent dark:from-teal-900/25 dark:via-teal-950/10',
    activeRing: 'ring-2 ring-teal-500 border-teal-200 dark:border-teal-800',
  },
  cyan: {
    iconBg: 'bg-cyan-50 dark:bg-cyan-950/50',
    iconColor: 'text-cyan-600 dark:text-cyan-400',
    badgeBg: 'bg-cyan-50/80 dark:bg-cyan-950/60 border border-cyan-200/50 dark:border-cyan-800/50',
    badgeText: 'text-cyan-700 dark:text-cyan-300',
    pulseDot: 'bg-cyan-500 dark:bg-cyan-400',
    washBg: 'bg-gradient-to-br from-cyan-100/60 via-cyan-50/20 to-transparent dark:from-cyan-900/25 dark:via-cyan-950/10',
    activeRing: 'ring-2 ring-cyan-500 border-cyan-200 dark:border-cyan-800',
  },
  rose: {
    iconBg: 'bg-rose-50 dark:bg-rose-950/50',
    iconColor: 'text-rose-600 dark:text-rose-400',
    badgeBg: 'bg-rose-50/80 dark:bg-rose-950/60 border border-rose-200/50 dark:border-rose-800/50',
    badgeText: 'text-rose-700 dark:text-rose-300',
    pulseDot: 'bg-rose-500 dark:bg-rose-400',
    washBg: 'bg-gradient-to-br from-rose-100/60 via-rose-50/20 to-transparent dark:from-rose-900/25 dark:via-rose-950/10',
    activeRing: 'ring-2 ring-rose-500 border-rose-200 dark:border-rose-800',
  },
};

export const DashboardKpiGrid: React.FC<DashboardKpiGridProps> = ({
  items = DASHBOARD_LAUNCHER_CARDS,
  activeId = 'overview',
  onSelect,
  className = '',
}) => {
  return (
    <div
      role="region"
      aria-label="Payroll Feature & Module Launchers"
      className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6', className)}
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
              'group relative flex flex-col justify-between p-6 rounded-2xl border transition-all duration-200 cursor-pointer overflow-hidden select-none outline-none',
              'bg-white dark:bg-[#171717]',
              'hover:shadow-md hover:-translate-y-1',
              'focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950',
              isSelected
                ? cn(theme.activeRing, 'shadow-md bg-slate-50/40 dark:bg-[#1b1b1b]')
                : 'border-slate-100 dark:border-zinc-800 shadow-sm hover:border-slate-200 dark:hover:border-zinc-700'
            )}
          >
            {/* Top-Right Soft Radial / Linear Pastel Gradient Wash */}
            <div
              className={cn(
                'absolute -top-10 -right-10 w-44 h-44 rounded-full pointer-events-none transition-opacity duration-300 blur-xl',
                theme.washBg,
                isSelected ? 'opacity-90' : 'opacity-60 group-hover:opacity-100'
              )}
              aria-hidden="true"
            />

            {/* Top Content Area */}
            <div className="relative z-10">
              {/* Header Row: Left Icon Box + Right Pulse Badge */}
              <div className="flex items-center justify-between gap-3">
                <div
                  className={cn(
                    'w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105',
                    theme.iconBg
                  )}
                >
                  <Icon className={cn('w-5 h-5', theme.iconColor)} />
                </div>

                <div
                  className={cn(
                    'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide uppercase',
                    theme.badgeBg,
                    theme.badgeText
                  )}
                >
                  <span className={cn('w-1.5 h-1.5 rounded-full animate-pulse', theme.pulseDot)} />
                  {card.badge}
                </div>
              </div>

              {/* Title */}
              <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {card.title}
              </h3>

              {/* 2-line Description */}
              <p className="mt-1.5 text-sm text-slate-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                {card.description}
              </p>

              {/* Feature/KPI Pills Row */}
              <div className="flex flex-wrap gap-1.5 mt-4">
                {card.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 transition-colors group-hover:bg-slate-200/70 dark:group-hover:bg-zinc-750"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Action Footer */}
            <div className="relative z-10 border-t border-slate-100 dark:border-zinc-800/80 pt-3 mt-5 flex items-center justify-between">
              <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors">
                {card.footerCta}
              </span>

              <div className="w-7 h-7 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 transition-all duration-200 group-hover:translate-x-1 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/60">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardKpiGrid;
