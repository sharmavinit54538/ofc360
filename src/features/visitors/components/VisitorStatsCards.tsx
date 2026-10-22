/**
 * @file VisitorStatsCards.tsx
 * @description KPI metric cards for Visitor Management: Currently On-Premises,
 * Expected Today, Total Today, and Overstay Alerts with loading skeletons.
 */

import React from 'react';
import { UserCheck, CalendarCheck, ShieldCheck, AlertTriangle } from 'lucide-react';
import type { VisitorAnalytics } from '../types/visitors.types';

interface VisitorStatsCardsProps {
  analytics?: VisitorAnalytics;
  isLoading?: boolean;
}

export const VisitorStatsCards: React.FC<VisitorStatsCardsProps> = ({ analytics, isLoading }) => {
  const cards = [
    {
      title: 'Currently On-Premises',
      value: analytics?.currentlyOnPremises ?? 0,
      icon: UserCheck,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200/60 dark:border-emerald-900/30',
      description: 'Active guests verified on facility grounds',
      badge: (analytics?.currentlyOnPremises ?? 0) > 0 ? 'Active Now' : undefined,
      badgeColor: 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800',
    },
    {
      title: 'Expected Today',
      value: analytics?.expectedToday ?? 0,
      icon: CalendarCheck,
      color: 'text-indigo-600 dark:text-indigo-400',
      bg: 'bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200/60 dark:border-indigo-900/30',
      description: 'Pre-registered arrivals scheduled today',
    },
    {
      title: 'Total Today',
      value: analytics?.totalToday ?? 0,
      icon: ShieldCheck,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-950/30 border-blue-200/60 dark:border-blue-900/30',
      description: 'Cumulative visitors processed today',
    },
    {
      title: 'Overstay Alerts',
      value: analytics?.overstayAlerts ?? 0,
      icon: AlertTriangle,
      color: 'text-rose-600 dark:text-rose-400',
      bg: 'bg-rose-50 dark:bg-rose-950/30 border-rose-200/60 dark:border-rose-900/30',
      description: 'Exceeded allocated meeting duration',
      badge: (analytics?.overstayAlerts ?? 0) > 0 ? 'Requires Action' : undefined,
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

export default VisitorStatsCards;
