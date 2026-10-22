/**
 * @file HrOpsKpiCards.tsx
 * @description Top KPI metrics cards for HR Operations Command Center: Pending Actions,
 * Active Onboarding, Exit Clearances, and Compliance Watch with loading skeletons.
 */

import React from 'react';
import {
  ClipboardList,
  UserPlus,
  LogOut,
  ShieldAlert,
  AlertTriangle,
} from 'lucide-react';
import type { HrOpsMetrics } from '../types';

interface HrOpsKpiCardsProps {
  metrics?: HrOpsMetrics;
  isLoading?: boolean;
}

export const HrOpsKpiCards: React.FC<HrOpsKpiCardsProps> = ({ metrics, isLoading }) => {
  const cards = [
    {
      title: 'Pending Actions',
      value: metrics ? (metrics.activeCases || metrics.unresolvedTickets || 0) : 0,
      icon: ClipboardList,
      color: 'text-indigo-600 dark:text-indigo-400',
      bg: 'bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200/60 dark:border-indigo-900/30',
      description: 'Operations items requiring intervention',
      badge: (metrics?.activeCases ?? 0) > 0 ? 'Active Queue' : undefined,
      badgeColor: 'text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/50 border-indigo-200 dark:border-indigo-800',
    },
    {
      title: 'Active Onboarding',
      value: metrics?.pendingOnboarding ?? 0,
      icon: UserPlus,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200/60 dark:border-emerald-900/30',
      description: 'New hires completing documentation',
      badge: (metrics?.pendingOnboarding ?? 0) > 0 ? 'In Progress' : undefined,
      badgeColor: 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800',
    },
    {
      title: 'Exit Clearances',
      value: metrics?.pendingClearances ?? 0,
      icon: LogOut,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200/60 dark:border-amber-900/30',
      description: 'Departures awaiting department sign-off',
      badge: (metrics?.pendingClearances ?? 0) > 0 ? 'Sign-Off Needed' : undefined,
      badgeColor: 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800',
    },
    {
      title: 'Compliance Watch',
      value: metrics?.complianceAlerts ?? 0,
      icon: ShieldAlert,
      color: 'text-rose-600 dark:text-rose-400',
      bg: 'bg-rose-50 dark:bg-rose-950/30 border-rose-200/60 dark:border-rose-900/30',
      description: 'Overdue verifications & policy alerts',
      badge: (metrics?.complianceAlerts ?? 0) > 0 ? 'Attention Required' : undefined,
      badgeColor: 'text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800 animate-pulse',
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
              <div className={`p-2.5 rounded-xl border ${card.bg} ${card.color}`}>
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
                <span
                  className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${card.badgeColor}`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  {card.badge}
                </span>
              )}
            </div>

            <p className="mt-1.5 text-xs text-gray-500 dark:text-zinc-400">
              {card.description}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default HrOpsKpiCards;
