/**
 * @file TimelineFilterBar.tsx
 * @description Real-time filter toolbar for Employee Timeline, supporting full-text search,
 * event category dropdown filtering, custom start/end date ranges, and reset actions.
 */

import React from 'react';
import {
  Search,
  Filter,
  Calendar,
  RotateCcw,
  RefreshCw,
  Plus,
} from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import type { TimelineEventType } from '../types';

interface TimelineFilterBarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  eventType: TimelineEventType | 'ALL';
  onEventTypeChange: (val: TimelineEventType | 'ALL') => void;
  startDate?: string;
  onStartDateChange: (val: string) => void;
  endDate?: string;
  onEndDateChange: (val: string) => void;
  onReset: () => void;
  onAddClick?: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

const EVENT_TYPE_OPTIONS: { label: string; value: TimelineEventType | 'ALL' }[] = [
  { label: 'All Event Categories', value: 'ALL' },
  { label: 'Joining & Onboarding', value: 'JOINING' },
  { label: 'Promotions', value: 'PROMOTION' },
  { label: 'Role Changes', value: 'ROLE_CHANGE' },
  { label: 'Department Transfers', value: 'DEPARTMENT_TRANSFER' },
  { label: 'Performance Reviews', value: 'PERFORMANCE_REVIEW' },
  { label: 'Awards & Recognition', value: 'AWARD_RECOGNITION' },
  { label: 'Training & Certifications', value: 'TRAINING_CERTIFICATION' },
  { label: 'Leaves & Sabbaticals', value: 'LEAVE_SABBATICAL' },
  { label: 'Document Uploads', value: 'DOCUMENT_UPLOAD' },
  { label: 'Exit Initiated', value: 'EXIT_INITIATED' },
];

export const TimelineFilterBar: React.FC<TimelineFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  eventType,
  onEventTypeChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  onReset,
  onAddClick,
  onRefresh,
  isRefreshing = false,
}) => {
  const isFiltered = Boolean(searchQuery || eventType !== 'ALL' || startDate || endDate);

  return (
    <div className="p-4 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 shadow-sm space-y-3">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full lg:max-w-md">
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by employee, milestone, or role..."
            className="pl-9 pr-4 rounded-xl text-sm"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
        </div>

        {/* Right Side Buttons */}
        <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
          {onRefresh && (
            <Button
              variant="secondary"
              size="sm"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="rounded-xl flex items-center gap-1.5"
              title="Refresh timeline from server"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
          )}

          {onAddClick && (
            <Button
              variant="primary"
              size="sm"
              onClick={onAddClick}
              className="rounded-xl flex items-center gap-1.5 shadow-sm shadow-brand-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>Record Milestone</span>
            </Button>
          )}
        </div>
      </div>

      {/* Filter Selectors Bar */}
      <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-gray-100 dark:border-zinc-800/80">
        {/* Event Type Filter */}
        <div className="flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          <select
            value={eventType}
            onChange={(e) => onEventTypeChange(e.target.value as TimelineEventType | 'ALL')}
            className="px-3 py-1.5 rounded-xl text-xs border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-900 dark:text-[#ececec] focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          >
            {EVENT_TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Date Range: Start */}
        <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-zinc-400">
          <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          <span>From:</span>
          <input
            type="date"
            value={startDate || ''}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl text-xs border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-900 dark:text-[#ececec] focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
        </div>

        {/* Date Range: End */}
        <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-zinc-400">
          <span>To:</span>
          <input
            type="date"
            value={endDate || ''}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl text-xs border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-900 dark:text-[#ececec] focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
        </div>

        {/* Reset Filters */}
        {isFiltered && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="text-xs text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-[#ececec] flex items-center gap-1 rounded-xl ml-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </Button>
        )}
      </div>
    </div>
  );
};

export default TimelineFilterBar;
