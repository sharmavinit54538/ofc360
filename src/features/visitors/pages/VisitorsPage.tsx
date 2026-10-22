/**
 * @file VisitorsPage.tsx
 * @description Enterprise Visitor Management Dashboard page integrating real-time KPI metrics,
 * visitor log search & status filters, check-in / check-out workflows, host approval toggles,
 * digital visitor badge generation, and RTK Query hooks.
 */

import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  RefreshCw,
  UserPlus,
  RotateCcw,
} from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { ErrorDisplay } from '@/shared/ui/ErrorDisplay';
import { useToast } from '@/shared/ui/Toast';
import {
  useGetVisitorsListQuery,
  useGetVisitorAnalyticsQuery,
  useCheckInVisitorMutation,
  useCheckOutVisitorMutation,
  useUpdateHostApprovalMutation,
} from '../api/visitorsApi';
import type {
  Visitor,
  VisitorStatus,
  HostApprovalStatus,
  VisitorsListFilters,
} from '../types/visitors.types';
import { VisitorStatsCards } from '../components/VisitorStatsCards';
import { VisitorsTable } from '../components/VisitorsTable';
import { RegisterVisitorModal } from '../components/RegisterVisitorModal';
import { VisitorBadgeModal } from '../components/VisitorBadgeModal';

export const VisitorsPage: React.FC = () => {
  const toast = useToast();

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<VisitorStatus | 'ALL'>('ALL');

  // Modal States
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [selectedVisitorForBadge, setSelectedVisitorForBadge] = useState<Visitor | null>(null);
  const [isBadgeModalOpen, setIsBadgeModalOpen] = useState(false);

  // RTK Query Filters Payload
  const queryFilters: VisitorsListFilters = useMemo(
    () => ({
      search: searchQuery.trim() || undefined,
      status: statusFilter,
    }),
    [searchQuery, statusFilter]
  );

  // RTK Query Hooks (Real backend integration, no fake hardcoded mock arrays)
  const {
    data: visitorsData,
    isLoading: isVisitorsLoading,
    isFetching: isVisitorsFetching,
    error: visitorsError,
    refetch: refetchVisitors,
  } = useGetVisitorsListQuery(queryFilters);

  const {
    data: analyticsData,
    isLoading: isAnalyticsLoading,
    refetch: refetchAnalytics,
  } = useGetVisitorAnalyticsQuery();

  // Mutations
  const [checkInVisitor, { isLoading: isCheckingIn }] = useCheckInVisitorMutation();
  const [checkOutVisitor, { isLoading: isCheckingOut }] = useCheckOutVisitorMutation();
  const [updateHostApproval, { isLoading: isUpdatingApproval }] = useUpdateHostApprovalMutation();

  const handleRefresh = () => {
    refetchVisitors();
    refetchAnalytics();
    toast.info('Syncing visitor log and analytics with server...', 'Data Refreshed');
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('ALL');
  };

  const handleCheckIn = async (visitor: Visitor) => {
    try {
      await checkInVisitor({ id: visitor.id }).unwrap();
      toast.success(`${visitor.fullName} checked in successfully. Badge active.`, 'Check-In Confirmed');
    } catch (err: any) {
      toast.error(
        err?.data?.message || err?.data?.detail || 'Failed to complete check-in.',
        'Action Error'
      );
    }
  };

  const handleCheckOut = async (visitor: Visitor) => {
    try {
      await checkOutVisitor({ id: visitor.id }).unwrap();
      toast.info(`${visitor.fullName} checked out. Badge returned.`, 'Check-Out Recorded');
    } catch (err: any) {
      toast.error(
        err?.data?.message || err?.data?.detail || 'Failed to complete check-out.',
        'Action Error'
      );
    }
  };

  const handleHostApproval = async (visitor: Visitor, status: HostApprovalStatus) => {
    try {
      await updateHostApproval({ id: visitor.id, status }).unwrap();
      toast.success(
        `Host visit status for ${visitor.fullName} updated to ${status}.`,
        'Approval Updated'
      );
    } catch (err: any) {
      toast.error(
        err?.data?.message || err?.data?.detail || 'Failed to update host approval status.',
        'Update Error'
      );
    }
  };

  const handleViewBadge = (visitor: Visitor) => {
    setSelectedVisitorForBadge(visitor);
    setIsBadgeModalOpen(true);
  };

  const items = visitorsData?.items || [];
  const analytics = analyticsData || visitorsData?.analytics;
  const isActionLoading = isCheckingIn || isCheckingOut || isUpdatingApproval;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-[#ececec]">
            Visitor Management
          </h1>
          <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">
            Monitor real-time guest arrivals, pre-registration passes, compliance NDAs, and facility security.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleRefresh}
            disabled={isVisitorsFetching}
            className="rounded-xl flex items-center gap-1.5"
            title="Refresh logs from server"
          >
            <RefreshCw className={`w-4 h-4 ${isVisitorsFetching ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsRegisterModalOpen(true)}
            className="rounded-xl flex items-center gap-2 shadow-sm shadow-brand-500/20"
          >
            <UserPlus className="w-4 h-4" />
            Register Visitor
          </Button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <VisitorStatsCards
        analytics={analytics}
        isLoading={isAnalyticsLoading || isVisitorsLoading}
      />

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-1 flex-col sm:flex-row items-center gap-3 w-full">
          {/* Search Box */}
          <div className="relative w-full sm:max-w-md">
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by visitor name, company, or badge ID..."
              className="pl-9 pr-4 rounded-xl text-sm"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
          </div>

          {/* Status Filter Dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-gray-400 hidden sm:block shrink-0" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as VisitorStatus | 'ALL')}
              className="w-full sm:w-44 px-3 py-2 rounded-xl text-sm border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-900 dark:text-[#ececec] focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="CHECKED_IN">Checked-In</option>
              <option value="EXPECTED">Expected</option>
              <option value="CHECKED_OUT">Checked-Out</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>

        {/* Clear Filters Reset */}
        {(searchQuery || statusFilter !== 'ALL') && (
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

      {/* Main Table or Server Error */}
      {visitorsError ? (
        <ErrorDisplay
          title="Unable to load visitor logs"
          error={visitorsError}
          onRetry={refetchVisitors}
        />
      ) : (
        <VisitorsTable
          visitors={items}
          isLoading={isVisitorsLoading}
          onCheckIn={handleCheckIn}
          onCheckOut={handleCheckOut}
          onViewBadge={handleViewBadge}
          onUpdateHostApproval={handleHostApproval}
          onRegisterClick={() => setIsRegisterModalOpen(true)}
          isActionLoading={isActionLoading}
        />
      )}

      {/* Register Visitor Modal */}
      <RegisterVisitorModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
      />

      {/* Printable Digital Badge Modal */}
      <VisitorBadgeModal
        visitor={selectedVisitorForBadge}
        isOpen={isBadgeModalOpen}
        onClose={() => {
          setIsBadgeModalOpen(false);
          setSelectedVisitorForBadge(null);
        }}
      />
    </div>
  );
};

export default VisitorsPage;
