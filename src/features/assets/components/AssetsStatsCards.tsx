/**
 * @file AssetsStatsCards.tsx
 * @description Enterprise KPI metrics cards for Asset Management: Total Assets,
 * Allocated in Use, Available in Stock, and Under Repair / Maintenance with loading skeletons.
 */

import React from 'react';
import { Box, UserCheck, Layers, Wrench, AlertTriangle } from 'lucide-react';
import type { AssetStats } from '../types';

interface AssetsStatsCardsProps {
  stats?: AssetStats;
  isLoading?: boolean;
}

export const AssetsStatsCards: React.FC<AssetsStatsCardsProps> = ({ stats, isLoading }) => {
  const cards = [
    {
      title: 'Total Assets',
      value: stats?.totalAssets ?? 0,
      icon: Box,
      color: 'text-indigo-600 dark:text-indigo-400',
      bg: 'bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200/60 dark:border-indigo-900/30',
      description: 'Registered company hardware & equipment',
    },
    {
      title: 'Allocated / In Use',
      value: stats?.allocated ?? 0,
      icon: UserCheck,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200/60 dark:border-emerald-900/30',
      description: 'Active devices deployed to employees',
      badge: (stats?.allocated ?? 0) > 0 ? 'Deployed' : undefined,
      badgeColor: 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800',
    },
    {
      title: 'Available In Stock',
      value: stats?.available ?? 0,
      icon: Layers,
      color: 'text-cyan-600 dark:text-cyan-400',
      bg: 'bg-cyan-50 dark:bg-cyan-950/30 border-cyan-200/60 dark:border-cyan-900/30',
      description: 'Ready for assignment to staff',
    },
    {
      title: 'Under Repair',
      value: stats?.underMaintenance ?? 0,
      icon: Wrench,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200/60 dark:border-amber-900/30',
      description: 'Equipment currently in maintenance queue',
      badge: (stats?.underMaintenance ?? 0) > 0 ? 'In Service' : undefined,
      badgeColor: 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800',
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

export default AssetsStatsCards;
