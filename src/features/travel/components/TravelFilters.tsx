import React from 'react';
import { Search, Filter, X, RefreshCw, Plus } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import type { TravelStatus, TravelType } from '../types/travel.types';

interface TravelFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: TravelStatus | 'ALL';
  onStatusChange: (status: TravelStatus | 'ALL') => void;
  travelTypeFilter: TravelType | 'ALL';
  onTravelTypeChange: (type: TravelType | 'ALL') => void;
  onResetFilters: () => void;
  onCreateNew?: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const TravelFilters: React.FC<TravelFiltersProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  travelTypeFilter,
  onTravelTypeChange,
  onResetFilters,
  onCreateNew,
  onRefresh,
  isRefreshing = false,
}) => {
  const statusOptions: { value: TravelStatus | 'ALL'; label: string }[] = [
    { value: 'ALL', label: 'All Requests' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'APPROVED', label: 'Approved' },
    { value: 'REJECTED', label: 'Rejected' },
    { value: 'CANCELLED', label: 'Cancelled' },
  ];

  const travelTypeOptions: { value: TravelType | 'ALL'; label: string }[] = [
    { value: 'ALL', label: 'All Types' },
    { value: 'DOMESTIC', label: 'Domestic' },
    { value: 'INTERNATIONAL', label: 'International' },
  ];

  const hasActiveFilters = searchQuery !== '' || statusFilter !== 'ALL' || travelTypeFilter !== 'ALL';

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
            placeholder="Search by Employee, Destination, or Trip ID (e.g. TRV-2026)..."
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

        {/* Travel Type Select */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-zinc-400 font-medium">
            <Filter className="w-3.5 h-3.5" />
            <span>Type:</span>
          </div>
          <select
            value={travelTypeFilter}
            onChange={(e) => onTravelTypeChange(e.target.value as TravelType | 'ALL')}
            className="px-3 py-2 rounded-xl text-xs font-medium border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-[#212121] text-gray-900 dark:text-[#ececec] focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors cursor-pointer"
          >
            {travelTypeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="text-xs text-rose-600 dark:text-rose-400 hover:underline px-2 py-1 font-medium transition-colors"
            >
              Reset
            </button>
          )}

          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="p-2 rounded-xl text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-[#212121] hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50"
              title="Refresh travel data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          )}

          {onCreateNew && (
            <Button
              variant="primary"
              size="sm"
              onClick={onCreateNew}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              New Request
            </Button>
          )}
        </div>
      </div>

      {/* Status Segmented Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1 border-t border-gray-100 dark:border-zinc-800/80">
        {statusOptions.map((opt) => {
          const isActive = statusFilter === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onStatusChange(opt.value)}
              className={`
                px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150
                ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-sm shadow-brand-600/30'
                    : 'text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-[#212121] hover:text-gray-900 dark:hover:text-white'
                }
              `}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
