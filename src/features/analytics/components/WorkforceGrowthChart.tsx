/**
 * @file WorkforceGrowthChart.tsx
 * @description Dynamic workforce growth and retention chart visualization displaying
 * periodic headcount progression, new joiners, and employee departures.
 */

import React, { useState } from 'react';
import { TrendingUp, Users, UserPlus, UserMinus, DollarSign } from 'lucide-react';
import type { WorkforceTrend } from '../types';
import { AnalyticsEmptyState } from './AnalyticsEmptyState';

interface WorkforceGrowthChartProps {
  trends: WorkforceTrend[];
  isLoading: boolean;
}

export const WorkforceGrowthChart: React.FC<WorkforceGrowthChartProps> = ({ trends, isLoading }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (isLoading) {
    return (
      <div className="p-6 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 shadow-sm space-y-4">
        <div className="flex justify-between items-center animate-pulse">
          <div className="h-4 w-40 bg-gray-200 dark:bg-zinc-800 rounded" />
          <div className="h-4 w-24 bg-gray-200 dark:bg-zinc-800 rounded" />
        </div>
        <div className="h-64 flex items-end gap-4 pt-8 animate-pulse">
          {[40, 65, 55, 80, 70, 90, 85].map((h, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div
                className="w-full bg-gray-200 dark:bg-zinc-800 rounded-t-xl"
                style={{ height: `${h}%` }}
              />
              <div className="h-3 w-8 bg-gray-200 dark:bg-zinc-800 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!trends || trends.length === 0) {
    return (
      <div className="p-6 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 shadow-sm">
        <h3 className="text-sm font-bold text-gray-900 dark:text-[#ececec] flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-brand-500" />
          Workforce Growth & Turnover Trends
        </h3>
        <AnalyticsEmptyState
          title="No Trend Data Recorded"
          description="Historical workforce trends will populate as headcount data and payroll cycles are processed."
        />
      </div>
    );
  }

  const maxHeadcount = Math.max(...trends.map((t) => t.headcount), 10);

  const formatCurrency = (val?: number) => {
    if (!val) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
    }).format(val);
  };

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 shadow-sm space-y-5">
      {/* Header & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-[#ececec] flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            Workforce Growth & Turnover Trajectory
          </h3>
          <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
            Periodic headcount progression with new joiners and departure volume
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-medium text-gray-600 dark:text-zinc-400">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-gradient-to-t from-brand-600 to-indigo-500" />
            Headcount
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            Joiners
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            Leavers
          </span>
        </div>
      </div>

      {/* Chart Visual Surface */}
      <div className="relative pt-6">
        {/* Tooltip Floating Card */}
        {hoveredIndex !== null && trends[hoveredIndex] && (
          <div className="absolute top-0 right-4 p-3 rounded-xl bg-gray-900/95 dark:bg-zinc-800/95 text-white text-xs shadow-xl backdrop-blur-md pointer-events-none z-30 space-y-1 animate-in fade-in-50">
            <div className="font-bold border-b border-gray-700 pb-1">
              {trends[hoveredIndex].period}
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-gray-300">Total Headcount:</span>
              <span className="font-bold text-brand-300">
                {trends[hoveredIndex].headcount.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4 text-emerald-400">
              <span>New Joiners:</span>
              <span>+{trends[hoveredIndex].joiners}</span>
            </div>
            <div className="flex items-center justify-between gap-4 text-rose-400">
              <span>Departures:</span>
              <span>-{trends[hoveredIndex].leavers}</span>
            </div>
            {trends[hoveredIndex].projectedCost > 0 && (
              <div className="flex items-center justify-between gap-4 text-cyan-300 pt-1 border-t border-gray-700/50">
                <span>Cost Run-rate:</span>
                <span>{formatCurrency(trends[hoveredIndex].projectedCost)}</span>
              </div>
            )}
          </div>
        )}

        {/* Bar & Pillar Grid */}
        <div className="h-64 flex items-end gap-2 sm:gap-4 border-b border-gray-200 dark:border-zinc-800 pb-2">
          {trends.map((item, idx) => {
            const heightPercent = Math.max((item.headcount / maxHeadcount) * 100, 8);
            const isHovered = hoveredIndex === idx;

            return (
              <div
                key={idx}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="flex-1 flex flex-col items-center justify-end h-full group cursor-pointer relative"
              >
                {/* Micro indicators above pillar */}
                <div className="mb-2 flex flex-col items-center gap-0.5 opacity-80 group-hover:opacity-100 transition-opacity">
                  <span className="text-[10px] font-mono font-bold text-gray-700 dark:text-zinc-300">
                    {item.headcount}
                  </span>
                  <div className="flex items-center gap-1 text-[9px] font-mono">
                    {item.joiners > 0 && (
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                        +{item.joiners}
                      </span>
                    )}
                    {item.leavers > 0 && (
                      <span className="text-rose-500 font-bold">
                        -{item.leavers}
                      </span>
                    )}
                  </div>
                </div>

                {/* Pillar Bar */}
                <div
                  className={`w-full rounded-t-xl transition-all duration-300 relative overflow-hidden ${
                    isHovered
                      ? 'bg-gradient-to-t from-brand-700 to-indigo-400 shadow-lg shadow-brand-500/30'
                      : 'bg-gradient-to-t from-brand-600/80 to-indigo-500/70 hover:from-brand-600 hover:to-indigo-500'
                  }`}
                  style={{ height: `${heightPercent}%` }}
                >
                  {/* Subtle Shimmer Overlay on hover */}
                  {isHovered && (
                    <div className="absolute inset-0 bg-white/20 animate-pulse" />
                  )}
                </div>

                {/* Period X-Axis Label */}
                <span className="mt-2 text-[11px] font-semibold text-gray-500 dark:text-zinc-400 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors truncate max-w-[60px]">
                  {item.period}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WorkforceGrowthChart;
