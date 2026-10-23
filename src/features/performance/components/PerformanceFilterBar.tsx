import React from 'react';
import { Search, RefreshCw, CalendarRange } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { cn } from '@/shared/lib/utils';
import type { PerformanceScope, ReviewCycle, ReviewStatus } from '../types/performance.types';

interface PerformanceFilterBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  scopeFilter: PerformanceScope;
  onScopeChange: (value: PerformanceScope) => void;
  cycleFilter: string;
  onCycleChange: (value: string) => void;
  statusFilter: ReviewStatus | 'ALL';
  onStatusChange: (value: ReviewStatus | 'ALL') => void;
  cycles: ReviewCycle[];
  onResetFilters: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

const SCOPE_OPTIONS: { id: PerformanceScope; label: string }[] = [
  { id: 'MY', label: 'My Reviews' },
  { id: 'TEAM', label: 'My Team' },
  { id: 'ALL', label: 'Organization' },
];

const STATUS_OPTIONS: { id: ReviewStatus | 'ALL'; label: string }[] = [
  { id: 'ALL', label: 'All' },
  { id: 'SELF_REVIEW_PENDING', label: 'Self Pending' },
  { id: 'MANAGER_REVIEW_PENDING', label: 'Manager Review' },
  { id: 'HR_REVIEW_PENDING', label: 'HR Review' },
  { id: 'COMPLETED', label: 'Completed' },
];

export const PerformanceFilterBar: React.FC<PerformanceFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  scopeFilter,
  onScopeChange,
  cycleFilter,
  onCycleChange,
  statusFilter,
  onStatusChange,
  cycles,
  onResetFilters,
  onRefresh,
  isRefreshing,
}) => {
  return (
    <div className="p-4 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 shadow-sm space-y-3">
      {/* Row 1: search + scope + cycle + actions */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-3">
        <div className="relative flex-1 min-w-0">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search reviews by employee or cycle name..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs bg-gray-50 dark:bg-zinc-900/70 border border-gray-200 dark:border-zinc-800 text-gray-900 dark:text-[#ececec] placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>

        <div className="inline-flex p-1 rounded-xl bg-gray-100 dark:bg-zinc-800 border border-gray-200/60 dark:border-zinc-700/60 text-xs font-semibold shrink-0">
          {SCOPE_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => onScopeChange(opt.id)}
              className={cn(
                'px-3 py-1 rounded-lg transition-all',
                scopeFilter === opt.id
                  ? 'bg-white dark:bg-zinc-900 text-gray-900 dark:text-white shadow-2xs'
                  : 'text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="relative shrink-0">
          <CalendarRange className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <select
            value={cycleFilter}
            onChange={(e) => onCycleChange(e.target.value)}
            className="pl-8 pr-3 py-1.5 rounded-xl text-xs border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-900 dark:text-[#ececec] focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
            <option value="ALL">All Cycles</option>
            {cycles.map((cycle) => (
              <option key={cycle.id} value={cycle.id}>
                {cycle.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button variant="ghost" size="sm" onClick={onResetFilters} className="text-xs">
            Reset
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="text-xs"
          >
            <RefreshCw className={cn('w-3.5 h-3.5 mr-1', isRefreshing && 'animate-spin')} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Row 2: status tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {STATUS_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => onStatusChange(opt.id)}
            className={cn(
              'px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all',
              statusFilter === opt.id
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white'
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PerformanceFilterBar;
