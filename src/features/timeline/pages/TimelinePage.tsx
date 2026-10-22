/**
 * @file TimelinePage.tsx
 * @description Enterprise Employee Career & Milestone Timeline page orchestrating chronological
 * event feeds, filters, category dropdowns, and manual milestone creation with RTK Query hooks.
 */

import React, { useState, useMemo } from 'react';
import { History, Plus } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { ErrorDisplay } from '@/shared/ui/ErrorDisplay';
import { useToast } from '@/shared/ui/Toast';
import { useGetCompanyWideTimelineQuery } from '../api/timelineApi';
import type { TimelineEventType, TimelineFilterParams } from '../types';
import { TimelineFilterBar } from '../components/TimelineFilterBar';
import { TimelineFeed } from '../components/TimelineFeed';
import { AddTimelineEventModal } from '../components/AddTimelineEventModal';

export const TimelinePage: React.FC = () => {
  const toast = useToast();

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [eventType, setEventType] = useState<TimelineEventType | 'ALL'>('ALL');
  const [startDate, setStartDate] = useState<string | undefined>(undefined);
  const [endDate, setEndDate] = useState<string | undefined>(undefined);

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // RTK Query Filters Payload
  const queryFilters: TimelineFilterParams = useMemo(
    () => ({
      search: searchQuery.trim() || undefined,
      eventType: eventType !== 'ALL' ? eventType : undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    }),
    [searchQuery, eventType, startDate, endDate]
  );

  // RTK Query Hook (Zero mock data, real backend contract)
  const {
    data: timelineData,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetCompanyWideTimelineQuery(queryFilters);

  const handleRefresh = () => {
    refetch();
    toast.info('Syncing chronological events from server...', 'Timeline Refreshed');
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setEventType('ALL');
    setStartDate(undefined);
    setEndDate(undefined);
  };

  const isFiltered = Boolean(searchQuery || eventType !== 'ALL' || startDate || endDate);
  const items = timelineData?.items || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-[#ececec]">
            Employee Career Timeline
          </h1>
          <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">
            Chronological log of staff promotions, department transfers, performance reviews, and company recognitions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            className="rounded-xl flex items-center gap-2 shadow-sm shadow-brand-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Record Milestone</span>
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <TimelineFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        eventType={eventType}
        onEventTypeChange={setEventType}
        startDate={startDate}
        onStartDateChange={setStartDate}
        endDate={endDate}
        onEndDateChange={setEndDate}
        onReset={handleResetFilters}
        onRefresh={handleRefresh}
        isRefreshing={isFetching}
      />

      {/* Main Feed or Server Error */}
      {error ? (
        <ErrorDisplay
          title="Unable to load timeline feed"
          error={error}
          onRetry={refetch}
        />
      ) : (
        <TimelineFeed
          events={items}
          isLoading={isLoading}
          onAddEvent={() => setIsAddModalOpen(true)}
          isFiltered={isFiltered}
          onClearFilters={handleResetFilters}
        />
      )}

      {/* Record Milestone Modal */}
      <AddTimelineEventModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
};

export default TimelinePage;
