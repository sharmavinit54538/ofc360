import React from 'react';
import {
  LogOut,
  Clock,
  ShieldAlert,
  CheckCircle2,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import type { ExitAnalyticsMetrics } from '../types/exit.types';

interface ExitStatsCardsProps {
  summary?: ExitAnalyticsMetrics;
  isLoading?: boolean;
}

export const ExitStatsCards: React.FC<ExitStatsCardsProps> = ({ summary, isLoading }) => {
  const cards = [
    {
      title: 'Active Offboardings',
      value: summary?.totalActiveExits ?? 0,
      icon: LogOut,
      color: 'text-indigo-600 dark:text-indigo-400',
      bg: 'bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200/60 dark:border-indigo-900/30',
      description: 'Total active resignations in progress',
    },
    {
      title: 'Pending Manager Review',
      value: summary?.pendingManagerReviews ?? 0,
      icon: Clock,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200/60 dark:border-amber-900/30',
      description: 'Awaiting manager approval & sign-off',
      badge: (summary?.pendingManagerReviews ?? 0) > 0 ? 'Action Required' : undefined,
    },
    {
      title: 'Clearances In Progress',
      value: summary?.clearancesPending ?? 0,
      icon: ShieldAlert,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-950/30 border-blue-200/60 dark:border-blue-900/30',
      description: 'IT, HR, Finance, or Admin sign-offs pending',
    },
    {
      title: 'FnF Settled / Completed',
      value: summary?.completedThisMonth ?? 0,
      icon: CheckCircle2,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200/60 dark:border-emerald-900/30',
      description: 'Successfully offboarded this cycle',
      extra: summary?.averageNoticeDays ? (
        <span className="flex items-center gap-1 text-[11px] text-gray-400">
          <Calendar className="w-3 h-3" /> Avg {summary.averageNoticeDays}d notice
        </span>
      ) : undefined,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 shadow-sm transition-all hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-semibold text-gray-500 dark:text-zinc-400 tracking-wider">
                {card.title}
              </span>
              <div className={`p-2 rounded-xl border ${card.bg} ${card.color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-3 flex items-baseline justify-between">
              {isLoading ? (
                <div className="h-8 w-16 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse" />
              ) : (
                <div className="text-2xl font-bold tracking-tight text-gray-900 dark:text-[#ececec]">
                  {card.value}
                </div>
              )}

              {card.badge && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full border border-amber-200/60 dark:border-amber-900/40">
                  <AlertCircle className="w-3 h-3" />
                  {card.badge}
                </span>
              )}
            </div>

            <div className="mt-1 flex items-center justify-between">
              <p className="text-xs text-gray-500 dark:text-zinc-400 truncate">
                {card.description}
              </p>
              {card.extra}
            </div>
          </div>
        );
      })}
    </div>
  );
};
