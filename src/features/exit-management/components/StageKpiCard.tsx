import React from 'react';
import { cn } from '@/shared/lib/utils';

export interface StageKpiCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  count: number;
  color: 'indigo' | 'blue' | 'amber' | 'purple' | 'sky' | 'emerald' | 'teal' | 'cyan' | 'violet' | 'orange' | 'rose' | 'green' | 'red' | 'slate';
  active?: boolean;
  onClick?: () => void;
  className?: string;
  'aria-pressed'?: boolean;
  description?: string; // Kept optional for backward compatibility; never displayed
}

const THEME_STYLES: Record<
  StageKpiCardProps['color'],
  {
    iconBg: string;
    iconColor: string;
    activeBorder: string;
    activeBg: string;
    countColor: string;
    titleColor: string;
  }
> = {
  indigo: {
    iconBg: 'bg-indigo-50 dark:bg-indigo-950/60',
    iconColor: 'text-indigo-600 dark:text-indigo-400',
    activeBorder: 'border-blue-500 dark:border-blue-400 ring-1 ring-blue-500/20',
    activeBg: 'bg-blue-50/70 dark:bg-blue-950/40',
    countColor: 'text-blue-700 dark:text-blue-300',
    titleColor: 'text-blue-700 dark:text-blue-300',
  },
  blue: {
    iconBg: 'bg-blue-50 dark:bg-blue-950/60',
    iconColor: 'text-blue-600 dark:text-blue-400',
    activeBorder: 'border-blue-500 dark:border-blue-400 ring-1 ring-blue-500/20',
    activeBg: 'bg-blue-50/70 dark:bg-blue-950/40',
    countColor: 'text-blue-700 dark:text-blue-300',
    titleColor: 'text-blue-700 dark:text-blue-300',
  },
  amber: {
    iconBg: 'bg-amber-50 dark:bg-amber-950/60',
    iconColor: 'text-amber-600 dark:text-amber-400',
    activeBorder: 'border-blue-500 dark:border-blue-400 ring-1 ring-blue-500/20',
    activeBg: 'bg-blue-50/70 dark:bg-blue-950/40',
    countColor: 'text-blue-700 dark:text-blue-300',
    titleColor: 'text-blue-700 dark:text-blue-300',
  },
  purple: {
    iconBg: 'bg-purple-50 dark:bg-purple-950/60',
    iconColor: 'text-purple-600 dark:text-purple-400',
    activeBorder: 'border-blue-500 dark:border-blue-400 ring-1 ring-blue-500/20',
    activeBg: 'bg-blue-50/70 dark:bg-blue-950/40',
    countColor: 'text-blue-700 dark:text-blue-300',
    titleColor: 'text-blue-700 dark:text-blue-300',
  },
  sky: {
    iconBg: 'bg-sky-50 dark:bg-sky-950/60',
    iconColor: 'text-sky-600 dark:text-sky-400',
    activeBorder: 'border-blue-500 dark:border-blue-400 ring-1 ring-blue-500/20',
    activeBg: 'bg-blue-50/70 dark:bg-blue-950/40',
    countColor: 'text-blue-700 dark:text-blue-300',
    titleColor: 'text-blue-700 dark:text-blue-300',
  },
  emerald: {
    iconBg: 'bg-emerald-50 dark:bg-emerald-950/60',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    activeBorder: 'border-blue-500 dark:border-blue-400 ring-1 ring-blue-500/20',
    activeBg: 'bg-blue-50/70 dark:bg-blue-950/40',
    countColor: 'text-blue-700 dark:text-blue-300',
    titleColor: 'text-blue-700 dark:text-blue-300',
  },
  teal: {
    iconBg: 'bg-teal-50 dark:bg-teal-950/60',
    iconColor: 'text-teal-600 dark:text-teal-400',
    activeBorder: 'border-blue-500 dark:border-blue-400 ring-1 ring-blue-500/20',
    activeBg: 'bg-blue-50/70 dark:bg-blue-950/40',
    countColor: 'text-blue-700 dark:text-blue-300',
    titleColor: 'text-blue-700 dark:text-blue-300',
  },
  cyan: {
    iconBg: 'bg-cyan-50 dark:bg-cyan-950/60',
    iconColor: 'text-cyan-600 dark:text-cyan-400',
    activeBorder: 'border-blue-500 dark:border-blue-400 ring-1 ring-blue-500/20',
    activeBg: 'bg-blue-50/70 dark:bg-blue-950/40',
    countColor: 'text-blue-700 dark:text-blue-300',
    titleColor: 'text-blue-700 dark:text-blue-300',
  },
  violet: {
    iconBg: 'bg-violet-50 dark:bg-violet-950/60',
    iconColor: 'text-violet-600 dark:text-violet-400',
    activeBorder: 'border-blue-500 dark:border-blue-400 ring-1 ring-blue-500/20',
    activeBg: 'bg-blue-50/70 dark:bg-blue-950/40',
    countColor: 'text-blue-700 dark:text-blue-300',
    titleColor: 'text-blue-700 dark:text-blue-300',
  },
  orange: {
    iconBg: 'bg-orange-50 dark:bg-orange-950/60',
    iconColor: 'text-orange-600 dark:text-orange-400',
    activeBorder: 'border-blue-500 dark:border-blue-400 ring-1 ring-blue-500/20',
    activeBg: 'bg-blue-50/70 dark:bg-blue-950/40',
    countColor: 'text-blue-700 dark:text-blue-300',
    titleColor: 'text-blue-700 dark:text-blue-300',
  },
  rose: {
    iconBg: 'bg-rose-50 dark:bg-rose-950/60',
    iconColor: 'text-rose-600 dark:text-rose-400',
    activeBorder: 'border-blue-500 dark:border-blue-400 ring-1 ring-blue-500/20',
    activeBg: 'bg-blue-50/70 dark:bg-blue-950/40',
    countColor: 'text-blue-700 dark:text-blue-300',
    titleColor: 'text-blue-700 dark:text-blue-300',
  },
  green: {
    iconBg: 'bg-green-50 dark:bg-green-950/60',
    iconColor: 'text-green-600 dark:text-green-400',
    activeBorder: 'border-blue-500 dark:border-blue-400 ring-1 ring-blue-500/20',
    activeBg: 'bg-blue-50/70 dark:bg-blue-950/40',
    countColor: 'text-blue-700 dark:text-blue-300',
    titleColor: 'text-blue-700 dark:text-blue-300',
  },
  red: {
    iconBg: 'bg-red-50 dark:bg-red-950/60',
    iconColor: 'text-red-600 dark:text-red-400',
    activeBorder: 'border-blue-500 dark:border-blue-400 ring-1 ring-blue-500/20',
    activeBg: 'bg-blue-50/70 dark:bg-blue-950/40',
    countColor: 'text-blue-700 dark:text-blue-300',
    titleColor: 'text-blue-700 dark:text-blue-300',
  },
  slate: {
    iconBg: 'bg-slate-50 dark:bg-slate-950/60',
    iconColor: 'text-slate-600 dark:text-slate-400',
    activeBorder: 'border-blue-500 dark:border-blue-400 ring-1 ring-blue-500/20',
    activeBg: 'bg-blue-50/70 dark:bg-blue-950/40',
    countColor: 'text-blue-700 dark:text-blue-300',
    titleColor: 'text-blue-700 dark:text-blue-300',
  },
};

export const StageKpiCard: React.FC<StageKpiCardProps> = ({
  icon: Icon,
  title,
  count,
  color,
  active = false,
  onClick,
  className = '',
  'aria-pressed': ariaPressed,
}) => {
  const theme = THEME_STYLES[color] || THEME_STYLES.indigo;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={ariaPressed ?? active}
      title={title}
      className={cn(
        'group relative flex flex-col justify-between p-3.5 sm:p-4 min-h-[102px] h-[106px] rounded-xl border transition-all duration-200 cursor-pointer select-none outline-none text-left',
        'bg-white dark:bg-[#171717]',
        'hover:shadow-sm hover:-translate-y-0.5',
        'focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950',
        active
          ? cn(theme.activeBorder, theme.activeBg, 'shadow-xs')
          : 'border-gray-200 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700 shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.2)]',
        className
      )}
    >
      {/* Top Row: Small Icon on left (36px–40px), KPI Count on top-right (24px–28px) */}
      <div className="flex items-center justify-between w-full">
        {/* Icon Container: 36px (w-9 h-9) rounded-lg */}
        <div
          className={cn(
            'w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105',
            theme.iconBg
          )}
        >
          <Icon className={cn('w-4.5 h-4.5', theme.iconColor)} />
        </div>

        {/* Count: 24px–28px font-bold */}
        <div
          className={cn(
            'text-2xl font-bold tracking-tight leading-none',
            active ? theme.countColor : 'text-gray-900 dark:text-[#ececec]'
          )}
        >
          {count}
        </div>
      </div>

      {/* Bottom Row: Stage Name (14px–15px, font-semibold, clean alignment, no description) */}
      <div className="mt-auto pt-2 w-full">
        <span
          className={cn(
            'block text-[13.5px] sm:text-sm font-semibold leading-tight line-clamp-1 truncate transition-colors',
            active
              ? theme.titleColor
              : 'text-gray-800 dark:text-zinc-200 group-hover:text-blue-600 dark:group-hover:text-blue-400'
          )}
        >
          {title}
        </span>
      </div>

      {/* Selected Indicator Dot */}
      {active && (
        <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-400" />
      )}
    </button>
  );
};

export default StageKpiCard;
