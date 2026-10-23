import React, { useState, useMemo } from 'react';
import { Palmtree, CalendarCheck } from 'lucide-react';
import { useToast } from '@/shared/ui/Toast';
import { ErrorDisplay } from '@/shared/ui/ErrorDisplay';
import { SkeletonStatCard } from '@/shared/ui/Skeleton';
import {
  useGetLeaveStatsQuery,
  useGetLeaveBalancesQuery,
  useGetLeaveRequestsQuery,
  useCancelLeaveRequestMutation,
} from '../api/leaveApi';
import type { LeaveRequest, LeaveStatus, LeaveRequestScope, LeaveFilterParams } from '../types/leave.types';
import { LeaveStatsCards } from '../components/LeaveStatsCards';
import { LeaveBalanceCards } from '../components/LeaveBalanceCards';
import { LeaveFilters } from '../components/LeaveFilters';
import { LeaveRequestsTable } from '../components/LeaveRequestsTable';
import { ApplyLeaveModal } from '../components/ApplyLeaveModal';
import { LeaveApprovalModal } from '../components/LeaveApprovalModal';
import { CompOffModal } from '../components/CompOffModal';
import { TeamLeaveCalendar } from '../components/TeamLeaveCalendar';

export const LeaveManagementHubPage: React.FC = () => {
  const toast = useToast();

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<LeaveStatus | 'ALL'>('ALL');
  const [scopeFilter, setScopeFilter] = useState<LeaveRequestScope>('MY');
  const [leaveTypeFilter, setLeaveTypeFilter] = useState('');

  // Modal state
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isCompOffModalOpen, setIsCompOffModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);

  // RTK Query filters payload
  const queryFilters: LeaveFilterParams = useMemo(
    () => ({
      search: searchQuery.trim() || undefined,
      status: statusFilter,
      scope: scopeFilter,
      leaveTypeId: leaveTypeFilter || undefined,
    }),
    [searchQuery, statusFilter, scopeFilter, leaveTypeFilter]
  );

  // Live backend data
  const {
    data: stats,
    isLoading: isStatsLoading,
    error: statsError,
    refetch: refetchStats,
  } = useGetLeaveStatsQuery();

  const {
    data: balances,
    isLoading: isBalancesLoading,
    error: balancesError,
    refetch: refetchBalances,
  } = useGetLeaveBalancesQuery();

  const {
    data: requestsData,
    isLoading: isRequestsLoading,
    isFetching: isRequestsFetching,
    error: requestsError,
    refetch: refetchRequests,
  } = useGetLeaveRequestsQuery(queryFilters);

  // Mutations
  const [cancelLeaveRequest, { isLoading: isCancelling }] = useCancelLeaveRequestMutation();

  const handleRefreshAll = () => {
    refetchStats();
    refetchBalances();
    refetchRequests();
    toast.info('Synced latest leave data from server', 'Refreshing');
  };

  const handleReview = (request: LeaveRequest) => {
    setSelectedRequest(request);
    setIsApprovalModalOpen(true);
  };

  const handleCancel = async (request: LeaveRequest) => {
    if (!window.confirm(`Cancel your ${request.leaveType?.name || 'leave'} request? This cannot be undone.`)) {
      return;
    }
    try {
      await cancelLeaveRequest({ id: request.id }).unwrap();
      toast.success('Leave request cancelled successfully.', 'Request Cancelled');
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to cancel leave request.', 'Action Error');
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('ALL');
    setScopeFilter('MY');
    setLeaveTypeFilter('');
  };

  const requests = requestsData?.items || [];
  const totalAvailableDays = (balances || []).reduce((sum, b) => sum + (b.availableDays || 0), 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Hero Banner — all counters stream from the leave stats service */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 text-white p-6 md:p-8 border border-emerald-500/20 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-8 w-48 h-48 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
              <Palmtree className="w-3.5 h-3.5" />
              <span>Leave & Absence Management Hub</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              Workforce Leave & Time Off Center
            </h1>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
              Track balances, apply for time off, review team approvals, and monitor
              who's out — all synced live with the leave service.
            </p>
          </div>

          {/* Live KPI strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white/5 backdrop-blur-md p-3.5 rounded-xl border border-white/10 shrink-0 min-w-[280px]">
            {isStatsLoading ? (
              <>
                <SkeletonStatCard />
                <SkeletonStatCard />
                <SkeletonStatCard />
                <SkeletonStatCard />
              </>
            ) : (
              <>
                <div className="text-center px-3 py-1.5 border-r border-white/10">
                  <p className="text-xs text-slate-400 font-medium">On Leave Today</p>
                  <p className="text-xl font-bold text-emerald-400">{stats?.onLeaveToday ?? 0}</p>
                </div>
                <div className="text-center px-3 py-1.5 border-r border-white/10">
                  <p className="text-xs text-slate-400 font-medium">Pending</p>
                  <p className="text-xl font-bold text-amber-400">{stats?.pendingRequests ?? 0}</p>
                </div>
                <div className="text-center px-3 py-1.5 border-r border-white/10">
                  <p className="text-xs text-slate-400 font-medium">My Balance</p>
                  <p className="text-xl font-bold text-blue-400">{totalAvailableDays}d</p>
                </div>
                <div className="text-center px-3 py-1.5">
                  <p className="text-xs text-slate-400 font-medium">Holidays Left</p>
                  <p className="text-xl font-bold text-purple-400">{stats?.upcomingHolidays ?? 0}</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Stats error (non-blocking) */}
      {statsError && (
        <ErrorDisplay
          title="Leave stats unavailable"
          error={statsError}
          onRetry={refetchStats}
          compact
        />
      )}

      {/* KPI Stats Cards */}
      <LeaveStatsCards stats={stats} isLoading={isStatsLoading} />

      {/* Balance Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <CalendarCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <h2 className="text-sm font-bold text-gray-900 dark:text-[#ececec]">
            My Leave Balances
          </h2>
        </div>
        {balancesError ? (
          <ErrorDisplay
            title="Unable to load leave balances"
            error={balancesError}
            onRetry={refetchBalances}
          />
        ) : (
          <LeaveBalanceCards balances={balances} isLoading={isBalancesLoading} />
        )}
      </div>

      {/* Team Calendar Strip */}
      <TeamLeaveCalendar />

      {/* Filters & Actions */}
      <LeaveFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        scopeFilter={scopeFilter}
        onScopeChange={setScopeFilter}
        leaveTypeFilter={leaveTypeFilter}
        onLeaveTypeChange={setLeaveTypeFilter}
        leaveTypes={balances || []}
        onResetFilters={handleResetFilters}
        onApplyLeave={() => setIsApplyModalOpen(true)}
        onRequestCompOff={() => setIsCompOffModalOpen(true)}
        onRefresh={handleRefreshAll}
        isRefreshing={isRequestsFetching}
      />

      {/* Requests Table */}
      {requestsError ? (
        <ErrorDisplay
          title="Unable to load leave requests"
          error={requestsError}
          onRetry={refetchRequests}
        />
      ) : (
        <LeaveRequestsTable
          requests={requests}
          isLoading={isRequestsLoading}
          isActionLoading={isCancelling}
          onReview={handleReview}
          onCancel={handleCancel}
          showEmployeeColumn={scopeFilter !== 'MY'}
        />
      )}

      {/* Modals */}
      <ApplyLeaveModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        balances={balances}
      />

      <CompOffModal
        isOpen={isCompOffModalOpen}
        onClose={() => setIsCompOffModalOpen(false)}
      />

      <LeaveApprovalModal
        request={selectedRequest}
        isOpen={isApprovalModalOpen}
        onClose={() => {
          setIsApprovalModalOpen(false);
          setSelectedRequest(null);
        }}
      />
    </div>
  );
};

export default LeaveManagementHubPage;
