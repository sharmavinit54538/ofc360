import React, { useState, useMemo, useCallback } from 'react';
import { CalendarCheck, ShieldAlert } from 'lucide-react';
import { useToast } from '@/shared/ui/Toast';
import { ErrorDisplay } from '@/shared/ui/ErrorDisplay';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { SuperAdminTenantSelector } from '@/features/workforce/pages/WorkforceHubPage';
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
  const { role, activeRole } = useAuth();
  const effectiveRole = (activeRole || role || 'EMPLOYEE').toUpperCase();
  const isSuperAdmin = effectiveRole === 'SUPER_ADMIN';

  const [selectedCompanyId, setSelectedCompanyId] = useState<string>(() => {
    try {
      return (
        localStorage.getItem('ofc360_selected_company_id') ||
        localStorage.getItem('ofc360_company_id') ||
        ''
      );
    } catch {
      return '';
    }
  });

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

  const handleSelectCompany = useCallback(
    (companyId: string) => {
      try {
        localStorage.setItem('ofc360_selected_company_id', companyId);
        localStorage.setItem('ofc360_company_id', companyId);
      } catch {}
      setSelectedCompanyId(companyId);
      refetchStats();
      refetchBalances();
      refetchRequests();
    },
    [refetchStats, refetchBalances, refetchRequests]
  );

  const isMissingCompanyError = useMemo(() => {
    if (!requestsError) return false;
    const status = (requestsError as any)?.status;
    const rawError = JSON.stringify(requestsError).toLowerCase();
    return (
      status === 400 ||
      status === 403 ||
      rawError.includes('company') ||
      rawError.includes('tenant')
    );
  }, [requestsError]);

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

  return (
    <div className="space-y-6 pb-12">
      {/* Super Admin Organization Context Selector */}
      {isSuperAdmin && (
        <SuperAdminTenantSelector
          currentCompanyId={selectedCompanyId}
          onSelectCompany={handleSelectCompany}
          isBannerOnly
        />
      )}

      {/* Stats error (non-blocking) */}
      {statsError && !isMissingCompanyError && (
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
        {balancesError && !isMissingCompanyError ? (
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
        isSuperAdmin && isMissingCompanyError ? (
          <div className="space-y-4 p-6 rounded-2xl bg-amber-500/10 border border-amber-300 dark:border-amber-700/60">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-semibold text-sm">
              <ShieldAlert className="w-5 h-5 shrink-0" />
              <span>Select an Organization context to view and review leave requests</span>
            </div>
            <SuperAdminTenantSelector
              currentCompanyId={selectedCompanyId}
              onSelectCompany={handleSelectCompany}
            />
          </div>
        ) : (
          <ErrorDisplay
            title="Unable to load leave requests"
            error={requestsError}
            onRetry={refetchRequests}
          />
        )
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
