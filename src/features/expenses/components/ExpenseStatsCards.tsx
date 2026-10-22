import React from 'react';
import { Receipt, Clock, CheckCircle2, AlertCircle, Ban } from 'lucide-react';
import type { ExpensesSummaryMetrics } from '../types/expenses.types';

interface ExpenseStatsCardsProps {
  summary?: ExpensesSummaryMetrics;
  isLoading?: boolean;
}

export const ExpenseStatsCards: React.FC<ExpenseStatsCardsProps> = ({ summary, isLoading }) => {
  const formatCurrency = (amount?: number, currency = 'USD') => {
    if (amount === undefined || amount === null) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const cards = [
    {
      title: 'Total Expense Claims',
      value: formatCurrency(summary?.totalClaimed, summary?.currency || 'USD'),
      icon: Receipt,
      color: 'text-indigo-600 dark:text-indigo-400',
      bg: 'bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200/60 dark:border-indigo-900/30',
      description: 'Total expenditure submitted this cycle',
    },
    {
      title: 'Pending Approvals',
      value: summary?.pendingApproval ?? 0,
      icon: Clock,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200/60 dark:border-amber-900/30',
      description: 'Awaiting manager or finance sign-off',
      badge: (summary?.pendingApproval ?? 0) > 0 ? 'Action Required' : undefined,
    },
    {
      title: 'Total Reimbursed',
      value: formatCurrency(summary?.totalReimbursed, summary?.currency || 'USD'),
      icon: CheckCircle2,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200/60 dark:border-emerald-900/30',
      description: 'Approved & processed payouts',
    },
    {
      title: 'Rejected Claims',
      value: summary?.rejectedClaims ?? 0,
      icon: Ban,
      color: 'text-rose-600 dark:text-rose-400',
      bg: 'bg-rose-50 dark:bg-rose-950/30 border-rose-200/60 dark:border-rose-900/30',
      description: 'Declined due to policy or verification',
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
                <div className="h-8 w-24 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse" />
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

            <p className="mt-1 text-xs text-gray-500 dark:text-zinc-400">
              {card.description}
            </p>
          </div>
        );
      })}
    </div>
  );
};
