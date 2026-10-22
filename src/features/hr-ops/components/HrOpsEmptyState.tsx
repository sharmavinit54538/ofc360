/**
 * @file HrOpsEmptyState.tsx
 * @description Clean zero-mock empty state component for HR Operations Queue.
 */

import React from 'react';
import { CheckCircle2, RotateCcw } from 'lucide-react';
import { Button } from '@/shared/ui/Button';

interface HrOpsEmptyStateProps {
  isFiltered?: boolean;
  onClearFilters?: () => void;
  onRefresh?: () => void;
}

export const HrOpsEmptyState: React.FC<HrOpsEmptyStateProps> = ({
  isFiltered = false,
  onClearFilters,
  onRefresh,
}) => {
  return (
    <div className="rounded-2xl border border-dashed border-gray-300 dark:border-zinc-800 bg-white dark:bg-[#171717] p-12 text-center shadow-sm">
      <div className="mx-auto w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4 border border-emerald-200/50 dark:border-emerald-900/30">
        <CheckCircle2 className="w-7 h-7" />
      </div>
      <h3 className="text-base font-semibold text-gray-900 dark:text-[#ececec]">
        {isFiltered ? 'No Matching Queue Items' : 'All Clear - Operational Queue Empty'}
      </h3>
      <p className="mt-1 text-sm text-gray-500 dark:text-zinc-400 max-w-sm mx-auto">
        {isFiltered
          ? 'No action items match the selected priority or status filters. Try clearing your filters.'
          : 'All pending clearances, employee onboardings, and document verification tasks have been resolved. Nice work!'}
      </p>

      <div className="mt-5 flex items-center justify-center gap-3">
        {isFiltered && onClearFilters && (
          <Button
            variant="secondary"
            size="sm"
            onClick={onClearFilters}
            className="rounded-xl text-xs flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Filters
          </Button>
        )}
        {onRefresh && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onRefresh}
            className="rounded-xl text-xs text-gray-600 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-[#ececec]"
          >
            Check for Updates
          </Button>
        )}
      </div>
    </div>
  );
};

export default HrOpsEmptyState;
