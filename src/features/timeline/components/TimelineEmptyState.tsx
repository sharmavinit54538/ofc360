/**
 * @file TimelineEmptyState.tsx
 * @description Clean zero-mock empty state component for employee timeline.
 */

import React from 'react';
import { History, Plus } from 'lucide-react';
import { Button } from '@/shared/ui/Button';

interface TimelineEmptyStateProps {
  onAddEvent?: () => void;
  isFiltered?: boolean;
  onClearFilters?: () => void;
}

export const TimelineEmptyState: React.FC<TimelineEmptyStateProps> = ({
  onAddEvent,
  isFiltered = false,
  onClearFilters,
}) => {
  return (
    <div className="rounded-2xl border border-dashed border-gray-300 dark:border-zinc-800 bg-white dark:bg-[#171717] p-12 text-center shadow-sm">
      <div className="mx-auto w-14 h-14 rounded-2xl bg-brand-50 dark:bg-brand-950/30 flex items-center justify-center text-brand-600 dark:text-brand-400 mb-4 border border-brand-200/50 dark:border-brand-900/30">
        <History className="w-7 h-7" />
      </div>
      <h3 className="text-base font-semibold text-gray-900 dark:text-[#ececec]">
        {isFiltered ? 'No Matching Timeline Events' : 'No Timeline Milestones Found'}
      </h3>
      <p className="mt-1 text-sm text-gray-500 dark:text-zinc-400 max-w-sm mx-auto">
        {isFiltered
          ? 'No career milestones or records match the applied filters. Try adjusting your date range or event category.'
          : 'There are currently no career events, promotions, or reviews logged for this timeframe. Add the first record to start building the historical record.'}
      </p>

      <div className="mt-5 flex items-center justify-center gap-3">
        {isFiltered && onClearFilters && (
          <Button
            variant="secondary"
            size="sm"
            onClick={onClearFilters}
            className="rounded-xl text-xs"
          >
            Clear Filters
          </Button>
        )}
        {onAddEvent && (
          <Button
            variant="primary"
            size="sm"
            onClick={onAddEvent}
            className="inline-flex items-center gap-2 rounded-xl text-xs"
          >
            <Plus className="w-4 h-4" />
            Record Milestone
          </Button>
        )}
      </div>
    </div>
  );
};

export default TimelineEmptyState;
