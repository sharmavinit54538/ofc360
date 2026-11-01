import React from 'react';
import { Search, Filter, X, RefreshCw, UserMinus } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import type { ExitStage } from '../types/exit.types';

interface ExitFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  stageFilter: ExitStage | 'ALL';
  onStageChange: (stage: ExitStage | 'ALL') => void;
  departmentFilter: string;
  onDepartmentChange: (dept: string) => void;
  onResetFilters: () => void;
  onCreateNew?: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const ExitFilters: React.FC<ExitFiltersProps> = ({
  searchQuery,
  onSearchChange,
  stageFilter,
  onStageChange,
  departmentFilter,
  onDepartmentChange,
  onResetFilters,
  onCreateNew,
  onRefresh,
  isRefreshing = false,
}) => {
  const stageOptions: { value: ExitStage | 'ALL'; label: string }[] = [
    { value: 'ALL', label: 'All Stages' },
    { value: 'RESIGNATION_SUBMITTED', label: 'Resignation Submitted' },
    { value: 'MANAGER_REVIEW', label: 'Manager Review' },
    { value: 'HR_REVIEW', label: 'HR Review' },
    { value: 'NOTICE_PERIOD', label: 'Notice Period' },
    { value: 'KNOWLEDGE_TRANSFER', label: 'Knowledge Transfer' },
    { value: 'CLEARANCE_PENDING', label: 'Clearance Pending' },
    { value: 'FNF_SETTLEMENT', label: 'FnF Settlement' },
    { value: 'EXIT_INTERVIEW', label: 'Exit Interview' },
    { value: 'DOCUMENTS_PENDING', label: 'Documents Pending' },
    { value: 'ACCESS_REVOCATION', label: 'Access Revocation' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'REJECTED', label: 'Rejected' },
    { value: 'WITHDRAWN', label: 'Withdrawn' },
  ];

  const departmentOptions = [
    { value: 'ALL', label: 'All Departments' },
    { value: 'Engineering', label: 'Engineering' },
    { value: 'Product', label: 'Product' },
    { value: 'Design', label: 'Design' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'Sales', label: 'Sales' },
    { value: 'Human Resources', label: 'Human Resources' },
    { value: 'Finance', label: 'Finance' },
    { value: 'Operations', label: 'Operations' },
  ];

  const hasActiveFilters = searchQuery !== '' || stageFilter !== 'ALL' || departmentFilter !== 'ALL';

  return (
    <div className="space-y-3 p-4 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 min-w-0">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by Employee, Case ID (e.g. EXIT-2026), or Department..."
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-[#212121] text-gray-900 dark:text-[#ececec] placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Department Filter & Action Buttons */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-zinc-400 font-medium">
            <Filter className="w-3.5 h-3.5" />
            <span>Dept:</span>
          </div>
          <select
            value={departmentFilter}
            onChange={(e) => onDepartmentChange(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs font-medium border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-[#212121] text-gray-900 dark:text-[#ececec] focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors cursor-pointer"
          >
            {departmentOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={onResetFilters}
              className="text-xs gap-1.5 border-dashed border-gray-300 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-800"
            >
              <X className="w-3 h-3" />
              Reset
            </Button>
          )}

          {onRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="text-xs gap-1.5"
              title="Sync latest exit cases from backend"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-brand-500' : ''}`} />
              <span className="hidden sm:inline">Sync</span>
            </Button>
          )}

          {onCreateNew && (
            <Button
              variant="primary"
              size="sm"
              onClick={onCreateNew}
              className="text-xs gap-1.5 bg-brand-600 hover:bg-brand-700 text-white shadow-sm"
            >
              <UserMinus className="w-3.5 h-3.5" />
              <span>Initiate Exit</span>
            </Button>
          )}
        </div>
      </div>

      {/* Stage Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar">
        <span className="text-[11px] font-medium text-gray-400 dark:text-zinc-500 uppercase tracking-wider mr-1">
          Stage:
        </span>
        {stageOptions.map((opt) => {
          const isActive = stageFilter === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onStageChange(opt.value)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/30 font-semibold shadow-xs'
                  : 'text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 border border-transparent'
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
