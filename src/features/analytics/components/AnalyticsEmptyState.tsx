/**
 * @file AnalyticsEmptyState.tsx
 * @description Clean zero-mock empty state component for the Analytics Center.
 */

import React from 'react';
import { BarChart2, RotateCcw } from 'lucide-react';
import { Button } from '@/shared/ui/Button';

interface AnalyticsEmptyStateProps {
  title?: string;
  description?: string;
  isFiltered?: boolean;
  onClearFilters?: () => void;
}

export const AnalyticsEmptyState: React.FC<AnalyticsEmptyStateProps> = ({
  title = 'No Analytics Data Available',
  description = 'No historical trend or workforce data points exist for the selected timeframe. Adjust your date filters or select a different department.',
  isFiltered = false,
  onClearFilters,
}) => {
  return (
    <div className="rounded-2xl border border-dashed border-gray-300 dark:border-zinc-800 bg-white dark:bg-[#171717] p-12 text-center shadow-sm">
      <div className="mx-auto w-14 h-14 rounded-2xl bg-brand-50 dark:bg-brand-950/30 flex items-center justify-center text-brand-600 dark:text-brand-400 mb-4 border border-brand-200/50 dark:border-brand-900/30">
        <BarChart2 className="w-7 h-7" />
      </div>
      <h3 className="text-base font-semibold text-gray-900 dark:text-[#ececec]">
        {title}
      </h3>
      <p className="mt-1 text-sm text-gray-500 dark:text-zinc-400 max-w-sm mx-auto">
        {description}
      </p>

      {isFiltered && onClearFilters && (
        <div className="mt-5">
          <Button
            variant="secondary"
            size="sm"
            onClick={onClearFilters}
            className="rounded-xl text-xs flex items-center gap-1.5 mx-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Filter Options
          </Button>
        </div>
      )}
    </div>
  );
};

export default AnalyticsEmptyState;
