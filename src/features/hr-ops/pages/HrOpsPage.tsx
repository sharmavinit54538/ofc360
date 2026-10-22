/**
 * @file HrOpsPage.tsx
 * @description Enterprise HR Operations Command Center orchestrating real-time KPI metrics,
 * operational quick triggers, prioritized task queues, status updates, and RTK Query hooks.
 */

import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  RefreshCw,
  RotateCcw,
  SlidersHorizontal,
} from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { ErrorDisplay } from '@/shared/ui/ErrorDisplay';
import { useToast } from '@/shared/ui/Toast';
import {
  useGetHrOpsMetricsQuery,
  useGetHrOpsQueueQuery,
  useUpdateActionItemStatusMutation,
  useAssignActionItemMutation,
} from '../api/hrOpsApi';
import type {
  HrOpsActionItem,
  HrOpsActionType,
  HrOpsPriority,
  HrOpsStatus,
  HrOpsFilterParams,
} from '../types';
import { HrOpsKpiCards } from '../components/HrOpsKpiCards';
import { HrOpsQuickActions } from '../components/HrOpsQuickActions';
import { HrOpsCommandQueue } from '../components/HrOpsCommandQueue';

export const HrOpsPage: React.FC = () => {
  const toast = useToast();

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<HrOpsActionType | 'ALL'>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<HrOpsPriority | 'ALL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<HrOpsStatus | 'ALL'>('ALL');

  // Query Filters Payload
  const queryFilters: HrOpsFilterParams = useMemo(
    () => ({
      search: searchQuery.trim() || undefined,
      type: typeFilter !== 'ALL' ? typeFilter : undefined,
      priority: priorityFilter !== 'ALL' ? priorityFilter : undefined,
      status: statusFilter !== 'ALL' ? statusFilter : undefined,
    }),
    [searchQuery, typeFilter, priorityFilter, statusFilter]
  );

  // RTK Query Hooks (Zero mock data, production contracts)
  const {
    data: queueData,
    isLoading: isQueueLoading,
    isFetching: isQueueFetching,
    error: queueError,
    refetch: refetchQueue,
  } = useGetHrOpsQueueQuery(queryFilters);

  const {
    data: metricsData,
    isLoading: isMetricsLoading,
    refetch: refetchMetrics,
  } = useGetHrOpsMetricsQuery();

  // Mutations
  const [updateStatus, { isLoading: isUpdatingStatus }] = useUpdateActionItemStatusMutation();
  const [assignItem, { isLoading: isAssigning }] = useAssignActionItemMutation();

  const handleRefresh = () => {
    refetchQueue();
    refetchMetrics();
    toast.info('Syncing command queue and operational metrics...', 'Data Refreshed');
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setTypeFilter('ALL');
    setPriorityFilter('ALL');
    setStatusFilter('ALL');
  };

  const handleResolve = async (item: HrOpsActionItem) => {
    try {
      await updateStatus({
        id: item.id,
        status: 'RESOLVED',
        resolutionNotes: 'Marked resolved from HR Ops Command Center',
      }).unwrap();
      toast.success(`Action "${item.title}" marked as resolved!`, 'Task Resolved');
    } catch (err: any) {
      toast.error(
        err?.data?.message || err?.data?.detail || 'Failed to update action status.',
        'Update Error'
      );
    }
  };

  const handleAssign = async (item: HrOpsActionItem) => {
    const assigneeName = window.prompt(`Assign task "${item.title}" to teammate:`);
    if (!assigneeName || !assigneeName.trim()) return;

    try {
      await assignItem({
        id: item.id,
        assigneeId: `usr_${Date.now()}`,
        assigneeName: assigneeName.trim(),
      }).unwrap();
      toast.success(`Task reassigned to ${assigneeName.trim()}`, 'Task Delegated');
    } catch (err: any) {
      toast.error(
        err?.data?.message || err?.data?.detail || 'Failed to assign action item.',
        'Assignment Error'
      );
    }
  };

  const isFiltered = Boolean(
    searchQuery || typeFilter !== 'ALL' || priorityFilter !== 'ALL' || statusFilter !== 'ALL'
  );
  const items = queueData?.items || [];
  const metrics = metricsData || queueData?.metrics;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-[#ececec]">
            HR Operations Command Center
          </h1>
          <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">
            Real-time operations dispatch, high-priority clearances, onboarding verification, and task routing.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleRefresh}
            disabled={isQueueFetching}
            className="rounded-xl flex items-center gap-1.5"
            title="Refresh operational queue from server"
          >
            <RefreshCw className={`w-4 h-4 ${isQueueFetching ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh Queue</span>
          </Button>
        </div>
      </div>

      {/* Top Metrics Cards */}
      <HrOpsKpiCards
        metrics={metrics}
        isLoading={isMetricsLoading || isQueueLoading}
      />

      {/* Operational Quick Actions */}
      <HrOpsQuickActions
        onAnnouncementClick={() => toast.info('Announcement broadcast portal accessible under Settings / Notifications.')}
        onVerifyDocumentClick={() => toast.info('Identity verification portal accessible under Settings / Documents.')}
      />

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative w-full md:max-w-md">
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter queue by employee, action title, or department..."
              className="pl-9 pr-4 rounded-xl text-sm"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
          </div>

          {/* Clear Filters Reset */}
          {isFiltered && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetFilters}
              className="text-xs text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-[#ececec] flex items-center gap-1 rounded-xl self-end md:self-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Filters
            </Button>
          )}
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-gray-100 dark:border-zinc-800/80">
          {/* Action Type Filter */}
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as HrOpsActionType | 'ALL')}
              className="px-3 py-1.5 rounded-xl text-xs border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-900 dark:text-[#ececec] focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            >
              <option value="ALL">All Categories</option>
              <option value="ONBOARDING">Onboarding</option>
              <option value="EXIT">Staff Exit</option>
              <option value="CLEARANCE">Clearance</option>
              <option value="DOCUMENT_VERIFICATION">Document Verification</option>
              <option value="LEAVE_APPROVAL">Leave Approval</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div className="flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as HrOpsPriority | 'ALL')}
              className="px-3 py-1.5 rounded-xl text-xs border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-900 dark:text-[#ececec] focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            >
              <option value="ALL">All Priorities</option>
              <option value="CRITICAL">Critical Only</option>
              <option value="HIGH">High Priority</option>
              <option value="MEDIUM">Medium Priority</option>
              <option value="LOW">Low Priority</option>
            </select>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as HrOpsStatus | 'ALL')}
            className="px-3 py-1.5 rounded-xl text-xs border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-900 dark:text-[#ececec] focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
          </select>
        </div>
      </div>

      {/* Main Command Queue or Server Error */}
      {queueError ? (
        <ErrorDisplay
          title="Unable to load HR operations queue"
          error={queueError}
          onRetry={refetchQueue}
        />
      ) : (
        <HrOpsCommandQueue
          items={items}
          isLoading={isQueueLoading}
          onResolve={handleResolve}
          onAssign={handleAssign}
          isActionLoading={isUpdatingStatus || isAssigning}
          isFiltered={isFiltered}
          onClearFilters={handleResetFilters}
        />
      )}
    </div>
  );
};

export default HrOpsPage;
