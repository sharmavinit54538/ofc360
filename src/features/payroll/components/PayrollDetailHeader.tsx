/**
 * @file PayrollDetailHeader.tsx
 * @description Sticky top navigation bar for drill-down Payroll module detail views.
 * Features back navigation pill, active module metadata, quick-switch module pill bar, and contextual actions.
 */

import React from 'react';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import {
  DASHBOARD_LAUNCHER_CARDS,
  type DashboardLauncherCardItem,
} from './dashboardKpiCards.data';

export interface PayrollDetailHeaderProps {
  activeModuleId: string;
  onBack: () => void;
  onSelectModule: (id: string) => void;
  actions?: React.ReactNode;
}

export const PayrollDetailHeader: React.FC<PayrollDetailHeaderProps> = ({
  activeModuleId,
  onBack,
  onSelectModule,
  actions,
}) => {
  const currentCard: DashboardLauncherCardItem =
    DASHBOARD_LAUNCHER_CARDS.find((c) => c.id === activeModuleId) ||
    DASHBOARD_LAUNCHER_CARDS[0];

  const Icon = currentCard.icon;

  return (
    <div className="sticky top-0 z-30 bg-white/95 dark:bg-[#121212]/95 backdrop-blur-md border-b border-gray-200/80 dark:border-zinc-800/80 pb-3 pt-1 -mt-2 mb-6">
      {/* Top Row: Back button, Module Title, Badge & Primary Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3">
        {/* Left: Back button + Active Module Info */}
        <div className="flex items-center flex-wrap gap-3">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-200 transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Payroll</span>
          </button>

          <span className="hidden sm:inline-block w-px h-5 bg-gray-200 dark:bg-zinc-800" />

          {/* Module Icon & Title */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <Icon className="w-4 h-4" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white tracking-tight">
              {currentCard.title}
            </h2>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60 uppercase tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {currentCard.badge}
            </span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 ml-auto">
          {actions}
        </div>
      </div>

      {/* Bottom Row: Quick-switch Compact Module Pill Bar */}
      <nav
        aria-label="Quick jump to another payroll module"
        className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1"
      >
        {DASHBOARD_LAUNCHER_CARDS.map((card) => {
          const CardIcon = card.icon;
          const isActive = card.id === activeModuleId;

          return (
            <button
              key={card.id}
              type="button"
              onClick={() => onSelectModule(card.id)}
              className={cn(
                'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer',
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                  : 'bg-gray-100/80 hover:bg-gray-200/80 dark:bg-zinc-800/60 dark:hover:bg-zinc-800 text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white'
              )}
            >
              <CardIcon className="w-3.5 h-3.5 shrink-0" />
              <span>{card.title}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

