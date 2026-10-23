import React from 'react';
import { CalendarCheck } from 'lucide-react';
import { SkeletonCard } from '@/shared/ui/Skeleton';
import { cn } from '@/shared/lib/utils';
import type { LeaveBalance } from '../types/leave.types';

interface LeaveBalanceCardsProps {
  balances?: LeaveBalance[];
  isLoading: boolean;
}

const formatDays = (value: number): string => {
  const rounded = Math.round(value * 10) / 10;
  return `${rounded} ${rounded === 1 ? 'day' : 'days'}`;
};

export const LeaveBalanceCards: React.FC<LeaveBalanceCardsProps> = ({ balances, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  if (!balances || balances.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 dark:border-zinc-800 bg-white dark:bg-[#171717] p-10 text-center shadow-sm">
        <div className="mx-auto w-12 h-12 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-3">
          <CalendarCheck className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-[#ececec]">
          No leave balances assigned yet
        </h3>
        <p className="mt-1 text-xs text-gray-500 dark:text-zinc-400 max-w-sm mx-auto">
          Leave quotas appear here automatically once HR publishes your annual leave policy allocation.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {balances.map((balance) => {
        const consumed = balance.usedDays + balance.pendingDays;
        const usagePercent =
          balance.totalQuota > 0
            ? Math.min(100, Math.round((consumed / balance.totalQuota) * 100))
            : 0;

        return (
          <div
            key={balance.leaveTypeId}
            className="p-5 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 shadow-sm space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: balance.color || '#10B981' }}
                />
                <span className="text-sm font-semibold text-gray-900 dark:text-[#ececec]">
                  {balance.leaveTypeName}
                </span>
              </div>
              {balance.code && (
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-500">
                  {balance.code}
                </span>
              )}
            </div>

            <div className="flex items-end justify-between">
              <div>
                <span className="text-2xl font-bold text-gray-900 dark:text-[#ececec]">
                  {formatDays(balance.availableDays)}
                </span>
                <span className="text-xs text-gray-500 dark:text-zinc-400 ml-1.5">available</span>
              </div>
              <span className="text-[11px] text-gray-400 dark:text-zinc-500">
                of {formatDays(balance.totalQuota)} quota
              </span>
            </div>

            {/* Usage progress bar */}
            <div className="h-1.5 w-full rounded-full bg-gray-100 dark:bg-zinc-800 overflow-hidden">
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-500',
                  usagePercent >= 90
                    ? 'bg-rose-500'
                    : usagePercent >= 70
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                )}
                style={{ width: `${usagePercent}%` }}
              />
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1 text-center">
              <div>
                <div className="text-xs font-bold text-gray-900 dark:text-[#ececec]">
                  {formatDays(balance.usedDays)}
                </div>
                <div className="text-[10px] text-gray-400 dark:text-zinc-500 uppercase tracking-wide">Used</div>
              </div>
              <div>
                <div className="text-xs font-bold text-amber-600 dark:text-amber-400">
                  {formatDays(balance.pendingDays)}
                </div>
                <div className="text-[10px] text-gray-400 dark:text-zinc-500 uppercase tracking-wide">Pending</div>
              </div>
              <div>
                <div className="text-xs font-bold text-gray-900 dark:text-[#ececec]">
                  {formatDays(balance.carriedForwardDays)}
                </div>
                <div className="text-[10px] text-gray-400 dark:text-zinc-500 uppercase tracking-wide">Carried</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default LeaveBalanceCards;
