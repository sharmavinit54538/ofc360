/**
 * @file DepartmentDistributionChart.tsx
 * @description Departmental headcount allocation, budget utilization, and retention
 * health distribution visualization across company divisions.
 */

import React from 'react';
import { PieChart, Building2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Badge } from '@/shared/ui/Badge';
import type { DepartmentBreakdown, AttritionRiskLevel } from '../types';
import { AnalyticsEmptyState } from './AnalyticsEmptyState';

interface DepartmentDistributionChartProps {
  departments: DepartmentBreakdown[];
  isLoading: boolean;
}

const PALETTE = [
  'bg-brand-500',
  'bg-indigo-500',
  'bg-cyan-500',
  'bg-emerald-500',
  'bg-amber-500',
  'bg-purple-500',
  'bg-rose-500',
  'bg-teal-500',
];

export const DepartmentDistributionChart: React.FC<DepartmentDistributionChartProps> = ({
  departments,
  isLoading,
}) => {
  const getRiskBadge = (risk: AttritionRiskLevel) => {
    switch (risk) {
      case 'CRITICAL':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded border border-rose-200 dark:border-rose-800">
            Critical Risk
          </span>
        );
      case 'HIGH':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800">
            High Risk
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800">
            Moderate
          </span>
        );
      case 'LOW':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
            Low Risk
          </span>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 shadow-sm space-y-4">
        <div className="h-4 w-48 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse" />
        <div className="h-5 w-full bg-gray-200 dark:bg-zinc-800 rounded-full animate-pulse" />
        <div className="space-y-3 pt-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex justify-between items-center animate-pulse">
              <div className="h-4 w-32 bg-gray-200 dark:bg-zinc-800 rounded" />
              <div className="h-4 w-20 bg-gray-200 dark:bg-zinc-800 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!departments || departments.length === 0) {
    return (
      <div className="p-6 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 shadow-sm">
        <h3 className="text-sm font-bold text-gray-900 dark:text-[#ececec] flex items-center gap-2 mb-4">
          <Building2 className="w-4 h-4 text-brand-500" />
          Departmental Headcount & Budget Distribution
        </h3>
        <AnalyticsEmptyState
          title="No Department Metrics Logged"
          description="Departmental breakdown will be rendered once organizational units and active employee headcounts are synced."
        />
      </div>
    );
  }

  const totalHeadcount = departments.reduce((acc, d) => acc + d.employeeCount, 0);

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-[#ececec] flex items-center gap-2">
            <Building2 className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            Department Distribution & Budget Usage
          </h3>
          <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
            Headcount allocation and fiscal budget consumption across units
          </p>
        </div>

        <span className="text-xs font-mono font-semibold text-gray-500 dark:text-zinc-400">
          {departments.length} Units Active
        </span>
      </div>

      {/* Segmented Stacked Distribution Bar */}
      {totalHeadcount > 0 && (
        <div className="space-y-1.5">
          <div className="h-3 w-full rounded-full overflow-hidden flex bg-gray-100 dark:bg-zinc-800 shadow-inner">
            {departments.map((dept, idx) => {
              const widthPercent = (dept.employeeCount / totalHeadcount) * 100;
              const colorClass = PALETTE[idx % PALETTE.length];
              return (
                <div
                  key={dept.departmentId}
                  title={`${dept.departmentName}: ${dept.employeeCount} (${widthPercent.toFixed(1)}%)`}
                  className={`${colorClass} h-full transition-all hover:opacity-85`}
                  style={{ width: `${widthPercent}%` }}
                />
              );
            })}
          </div>
          <div className="flex justify-between text-[10px] text-gray-400 dark:text-zinc-500 font-mono">
            <span>0%</span>
            <span>Total: {totalHeadcount} Staff</span>
            <span>100%</span>
          </div>
        </div>
      )}

      {/* Detailed Department List */}
      <div className="divide-y divide-gray-100 dark:divide-zinc-800/80 pt-2">
        {departments.map((dept, idx) => {
          const colorClass = PALETTE[idx % PALETTE.length];
          const pct = totalHeadcount > 0 ? ((dept.employeeCount / totalHeadcount) * 100).toFixed(1) : '0';

          return (
            <div
              key={dept.departmentId}
              className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:bg-gray-50/50 dark:hover:bg-zinc-900/30 px-2 rounded-xl transition-colors"
            >
              {/* Department Name */}
              <div className="flex items-center gap-2.5 min-w-[180px]">
                <span className={`w-3 h-3 rounded-full ${colorClass} shrink-0`} />
                <div>
                  <span className="font-semibold text-gray-900 dark:text-[#ececec]">
                    {dept.departmentName}
                  </span>
                  <div className="text-[11px] text-gray-400 dark:text-zinc-500">
                    {dept.employeeCount} Members ({pct}%)
                  </div>
                </div>
              </div>

              {/* Budget Utilization Meter */}
              <div className="flex-1 max-w-xs space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-gray-500 dark:text-zinc-400">Budget Spent:</span>
                  <span className="font-semibold text-gray-800 dark:text-zinc-200">
                    {dept.budgetUtilization}%
                  </span>
                </div>
                <div className="h-1.5 w-full bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      dept.budgetUtilization > 90
                        ? 'bg-rose-500'
                        : dept.budgetUtilization > 75
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(dept.budgetUtilization, 100)}%` }}
                  />
                </div>
              </div>

              {/* Attrition Risk Badge */}
              <div className="shrink-0 text-right">
                {getRiskBadge(dept.attritionRisk)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DepartmentDistributionChart;
