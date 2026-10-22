/**
 * @file MeetingEmptyState.tsx
 * @description Clean zero-mock empty state component for the Meeting Intelligence Module.
 */

import React from 'react';
import { Video, Plus, RotateCcw } from 'lucide-react';
import { Button } from '@/shared/ui/Button';

interface MeetingEmptyStateProps {
  title?: string;
  description?: string;
  isFiltered?: boolean;
  onClearFilters?: () => void;
  onUploadClick?: () => void;
}

export const MeetingEmptyState: React.FC<MeetingEmptyStateProps> = ({
  title = 'No Meetings Analyzed Yet',
  description = 'Upload an audio or video recording, or link a scheduled calendar event to generate automated AI transcripts, executive summaries, and action item tracking.',
  isFiltered = false,
  onClearFilters,
  onUploadClick,
}) => {
  return (
    <div className="rounded-2xl border border-dashed border-gray-300 dark:border-zinc-800 bg-white dark:bg-[#171717] p-12 text-center shadow-sm">
      <div className="mx-auto w-14 h-14 rounded-2xl bg-brand-50 dark:bg-brand-950/30 flex items-center justify-center text-brand-600 dark:text-brand-400 mb-4 border border-brand-200/50 dark:border-brand-900/30">
        <Video className="w-7 h-7" />
      </div>
      <h3 className="text-base font-semibold text-gray-900 dark:text-[#ececec]">
        {title}
      </h3>
      <p className="mt-1 text-sm text-gray-500 dark:text-zinc-400 max-w-sm mx-auto">
        {description}
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
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

        {onUploadClick && (
          <Button
            variant="primary"
            size="sm"
            onClick={onUploadClick}
            className="rounded-xl text-xs flex items-center gap-1.5 shadow-sm shadow-brand-500/20"
          >
            <Plus className="w-3.5 h-3.5" />
            Upload Meeting Audio
          </Button>
        )}
      </div>
    </div>
  );
};

export default MeetingEmptyState;
