import React from 'react';
import { Search, RefreshCw, Calendar } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { cn } from '@/shared/lib/utils';
import type { AttendanceScope, AttendanceStatus } from '../types/attendance.types';

interface AttendanceFilterBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: AttendanceStatus | 'ALL';
  onStatusChange: (value: AttendanceStatus | 'ALL') => void;
  scopeFilter: AttendanceScope;
  onScopeChange: (value: AttendanceScope) => void;
  startDate: string;
  onStartDateChange: (value: string) => void;
  endDate: string;
  onEndDateChange: (value: string) => void;
  departmentFilter: string;
  onDepartmentChange: (value: string) => void;
  departments: string[];
  onResetFilters: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

const STATUS_OPTIONS: { id: AttendanceStatus | 'ALL'; label: string }[] = [
  { id: 'ALL', label: 'All' },
  { id: 'PRESENT', label: 'Present' },
  { id: 'ABSENT', label: 'Absent' },
  { id: 'HALF_DAY', label: 'Half Day' },
  { id: 'ON_LEAVE', label: 'On Leave' },
  { id: 'WEEK_OFF', label: 'Week Off' },
  { id: 'HOLIDAY', label: 'Holiday' },
];

const SCOPE_OPTIONS: { id: AttendanceScope; label: string }[] = [
  { id: 'MY', label: 'My Log' },
  { id: 'TEAM', label: 'My Team' },
  { id: 'ALL', label: 'Organization' },
];

export const AttendanceFilterBar: React.FC<AttendanceFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  scopeFilter,
  onScopeChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  departmentFilter,
  onDepartmentChange,
  departments,
  onResetFilters,
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
            placeholder="Search by employee name..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-gray-50 dark:bg-zinc-900/70 border border-gray-200 dark:border-zinc-800 text-gray-900 dark:text-[#ececec] placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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

        {/* Date range + refresh */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-gray-400" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg text-xs border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-900 dark:text-[#ececec] focus:outline-none focus:ring-1 focus:ring-blue-500"
              aria-label="Start date"
            />
            <span className="text-xs text-gray-400">to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => onEndDateChange(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg text-xs border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-900 dark:text-[#ececec] focus:outline-none focus:ring-1 focus:ring-blue-500"
              aria-label="End date"
            />
          </div>

          <select
            value={departmentFilter}
            onChange={(e) => onDepartmentChange(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-xs border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-900 dark:text-[#ececec] focus:outline-none focus:ring-1 focus:ring-blue-500"
            aria-label="Filter by department"
          >
            <option value="">All Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>

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

        {/* Status pills */}
        <div className="flex flex-wrap items-center gap-2">
          {STATUS_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => onStatusChange(option.id)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors',
                statusFilter === option.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 hover:bg-gray-200 dark:hover:bg-zinc-700'
              )}
            >
              {option.label}
            </button>
          ))}
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

export default AttendanceFilterBar;
