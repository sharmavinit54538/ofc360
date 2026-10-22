/**
 * @file AnalyticsKpiGrid.tsx
 * @description High-level executive KPI grid for Analytics Center: Total Headcount,
 * Annualized Turnover Rate, Retention Probability, and Monthly Payroll Burn with trend badges.
 */

import React from 'react';
import {
  Users,
  TrendingDown,
  ShieldCheck,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Sparkles,
} from 'lucide-react';
import type { AnalyticsSummary } from '../types';

interface AnalyticsKpiGridProps {
  summary?: AnalyticsSummary;
  isLoading?: boolean;
}

export const AnalyticsKpiGrid: React.FC<AnalyticsKpiGridProps> = ({ summary, isLoading }) => {
  const formatCurrency = (val?: number, currency = 'USD') => {
    if (val === undefined || val === null) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(val);
  };

  const cards = [
    {
      title: 'Total Workforce Headcount',
      value: summary?.totalHeadcount ? summary.totalHeadcount.toLocaleString() : '0',
      icon: Users,
      color: 'text-indigo-600 dark:text-indigo-400',
      bg: 'bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200/60 dark:border-indigo-900/30',
      trend: summary?.headcountGrowth !== undefined ? `${summary.headcountGrowth >= 0 ? '+' : ''}${summary.headcountGrowth}%` : undefined,
      isPositive: (summary?.headcountGrowth ?? 0) >= 0,
      description: 'Active personnel across all departments',
    },
    {
      title: 'Annualized Turnover Rate',
      value: summary?.attritionRate !== undefined ? `${summary.attritionRate}%` : '0.0%',
      icon: TrendingDown,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200/60 dark:border-amber-900/30',
      trend: summary?.turnoverRiskScore !== undefined ? `Risk Index: ${summary.turnoverRiskScore}/100` : undefined,
      isPositive: (summary?.attritionRate ?? 0) <= 5,
      description: 'Voluntary & involuntary departures',
    },
    {
      title: 'Retention Probability',
      value: summary?.retentionProbability !== undefined
        ? `${summary.retentionProbability}%`
        : `${(100 - (summary?.attritionRate ?? 0)).toFixed(1)}%`,
      icon: ShieldCheck,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200/60 dark:border-emerald-900/30',
      trend: summary?.averageTenure !== undefined ? `Avg. ${summary.averageTenure}y tenure` : undefined,
      isPositive: true,
      description: 'Model-projected 12-month staff stability',
    },
    {
      title: 'Monthly Payroll Burn',
      value: formatCurrency(summary?.totalPayrollBurn, summary?.currency || 'USD'),
      icon: DollarSign,
      color: 'text-cyan-600 dark:text-cyan-400',
      bg: 'bg-cyan-50 dark:bg-cyan-950/30 border-cyan-200/60 dark:border-cyan-900/30',
      trend: summary?.payrollCostVariance !== undefined
        ? `${summary.payrollCostVariance >= 0 ? '+' : ''}${summary.payrollCostVariance}% variance`
        : undefined,
      isPositive: (summary?.payrollCostVariance ?? 0) <= 0,
      description: 'Total compensation & benefits expense',
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
                <div className="h-8 w-20 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse" />
              ) : (
                <div className="text-2xl font-bold tracking-tight text-gray-900 dark:text-[#ececec]">
                  {card.value}
                </div>
              )}

              {card.trend && (
                <span
                  className={`inline-flex items-center gap-0.5 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                    card.isPositive
                      ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800'
                      : 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800'
                  }`}
                >
                  {card.trend.includes('+') && <ArrowUpRight className="w-3 h-3" />}
                  {card.trend.includes('-') && <ArrowDownRight className="w-3 h-3" />}
                  {card.trend}
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

export default AnalyticsKpiGrid;
