import React from 'react';
import { Search, RefreshCw, PlusCircle, Award } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { cn } from '@/shared/lib/utils';
import type { LeaveBalance } from '../types/leave.types';
import type { LeaveStatus, LeaveRequestScope } from '../types/leave.types';

interface LeaveFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: LeaveStatus | 'ALL';
  onStatusChange: (value: LeaveStatus | 'ALL') => void;
  scopeFilter: LeaveRequestScope;
  onScopeChange: (value: LeaveRequestScope) => void;
  leaveTypeFilter: string;
  onLeaveTypeChange: (value: string) => void;
  leaveTypes: LeaveBalance[];
  onResetFilters: () => void;
  onApplyLeave: () => void;
  onRequestCompOff: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

const STATUS_OPTIONS: { id: LeaveStatus | 'ALL'; label: string }[] = [
  { id: 'ALL', label: 'All Status' },
  { id: 'PENDING', label: 'Pending' },
  { id: 'APPROVED', label: 'Approved' },
  { id: 'REJECTED', label: 'Rejected' },
  { id: 'CANCELLED', label: 'Cancelled' },
  { id: 'WITHDRAWN', label: 'Withdrawn' },
  { id: 'REVOKED', label: 'Revoked' },
];

const SCOPE_OPTIONS: { id: LeaveRequestScope; label: string }[] = [
  { id: 'MY', label: 'My Requests' },
  { id: 'TEAM', label: 'Team Approvals' },
];

export const LeaveFilters: React.FC<LeaveFiltersProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  scopeFilter,
  onScopeChange,
  leaveTypeFilter,
  onLeaveTypeChange,
  leaveTypes,
  onResetFilters,
  onApplyLeave,
  onRequestCompOff,
  onRefresh,
  isRefreshing,
}) => {
  return (
    <div className="p-4 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 shadow-sm space-y-3">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full lg:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search requests by reason or employee..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-gray-50 dark:bg-zinc-900/70 border border-gray-200 dark:border-zinc-800 text-gray-900 dark:text-[#ececec] placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-medium text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300"
            >
              Clear
            </button>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="gap-1.5 text-xs"
          >
            <RefreshCw className={cn('w-3.5 h-3.5', isRefreshing && 'animate-spin')} />
            <span>Refresh</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onRequestCompOff}
            className="gap-1.5 text-xs"
          >
            <Award className="w-3.5 h-3.5 text-rose-500" />
            <span>Claim Comp-Off</span>
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={onApplyLeave}
            className="gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Apply Leave</span>
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Scope toggle */}
        <div className="inline-flex p-1 rounded-xl bg-gray-100 dark:bg-zinc-800 border border-gray-200/60 dark:border-zinc-700/60 text-xs font-semibold self-start">
          {SCOPE_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => onScopeChange(option.id)}
              className={cn(
                'px-3 py-1 rounded-lg transition-all',
                scopeFilter === option.id
                  ? 'bg-white dark:bg-zinc-900 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Status + Type filters */}
        <div className="flex flex-wrap items-center gap-2">
          {STATUS_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => onStatusChange(option.id)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors',
                statusFilter === option.id
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 hover:bg-gray-200 dark:hover:bg-zinc-700'
              )}
            >
              {option.label}
            </button>
          ))}

          <select
            value={leaveTypeFilter}
            onChange={(e) => onLeaveTypeChange(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-xs border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-900 dark:text-[#ececec] focus:outline-none focus:ring-1 focus:ring-emerald-500"
            aria-label="Filter by leave type"
          >
            <option value="">All Leave Types</option>
            {leaveTypes.map((type) => (
              <option key={type.leaveTypeId} value={type.leaveTypeId}>
                {type.leaveTypeName}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={onResetFilters}
            className="text-[11px] font-medium text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300 underline underline-offset-2"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeaveFilters;
