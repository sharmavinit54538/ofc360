import React, { useState, useMemo } from 'react';
import {
  Clock,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  ArrowRight,
  Filter,
  User,
  Calendar,
  Box,
  FileCheck,
  CreditCard,
} from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { ErrorDisplay } from '@/shared/ui/ErrorDisplay';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { useToast } from '@/shared/ui/Toast';
import {
  useGetExitCasesQuery,
  useGetExitStatsQuery,
} from '../api/exitsApi';
import type { ExitCase, ExitStage, ExitFilters as ExitFiltersType } from '../types/exit.types';
import { ExitStatsCards } from '../components/ExitStatsCards';
import { ExitFilters } from '../components/ExitFilters';
import { ExitRequestsTable } from '../components/ExitRequestsTable';
import { ExitDetailSheet } from '../components/ExitDetailSheet';
import { CreateExitModal } from '../components/CreateExitModal';
import { RejectExitModal } from '../components/RejectExitModal';
import { calculateNoticeDays } from '../mappers/exitMappers';

export const ExitManagementPage: React.FC = () => {
  const toast = useToast();
  const { user } = useAuth();
  const userRole = user?.role || 'EMPLOYEE';

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState<ExitStage | 'ALL'>('ALL');
  const [departmentFilter, setDepartmentFilter] = useState<string>('ALL');

  // Modal & Drawer States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedCaseForSheet, setSelectedCaseForSheet] = useState<ExitCase | null>(null);
  const [isDetailSheetOpen, setIsDetailSheetOpen] = useState(false);
  const [selectedCaseForReject, setSelectedCaseForReject] = useState<ExitCase | null>(null);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  // RTK Query Filters Payload
  const queryFilters: ExitFiltersType = useMemo(
    () => ({
      search: searchQuery.trim() || undefined,
      stage: stageFilter,
      department: departmentFilter,
    }),
    [searchQuery, stageFilter, departmentFilter]
  );

  // Fetch Cases and Analytics from live backend endpoints
  const {
    data: casesData,
    isLoading: isCasesLoading,
    isFetching: isCasesFetching,
    error: casesError,
    refetch: refetchCases,
  } = useGetExitCasesQuery(queryFilters);

  // Unfiltered cases to compute accurate live stage distribution across all 14 stages
  const { data: allCasesData, refetch: refetchAllCases } = useGetExitCasesQuery(
    departmentFilter !== 'ALL' ? { department: departmentFilter } : undefined
  );

  const {
    data: statsData,
    isLoading: isStatsLoading,
    refetch: refetchStats,
  } = useGetExitStatsQuery();

  const handleRefreshAll = () => {
    refetchCases();
    refetchAllCases();
    refetchStats();
    toast.info('Refreshed exit management data from server', 'Syncing Data');
  };

  const handleViewDetails = (exitCase: ExitCase) => {
    setSelectedCaseForSheet(exitCase);
    setIsDetailSheetOpen(true);
  };

  const handleOpenReject = (exitCase: ExitCase) => {
    setSelectedCaseForReject(exitCase);
    setIsRejectModalOpen(true);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setStageFilter('ALL');
    setDepartmentFilter('ALL');
  };

  const items = casesData?.items || [];

  // Overdue / SLA breach highlights: cases with remaining notice days <= 5
  const urgentCases = useMemo(() => {
    return items.filter((c) => {
      if (c.stage === 'COMPLETED' || c.stage === 'REJECTED' || c.stage === 'WITHDRAWN') return false;
      const { remainingDays } = calculateNoticeDays(c.resignationDate, c.expectedLastWorkingDay, c.noticeDays);
      return remainingDays <= 7;
    });
  }, [items]);

  // Role pending action counts
  const rolePendingActions = useMemo(() => {
    if (userRole === 'MANAGER') {
      return items.filter(
        (c) =>
          c.stage === 'RESIGNATION_SUBMITTED' ||
          (c.stage === 'MANAGER_REVIEW' && c.managerApproval.status === 'PENDING') ||
          !c.ktStatus
      );
    }
    if (userRole === 'IT_ADMIN') {
      return items.filter((c) => {
        const itClearance = c.clearances.find((d) => d.department === 'IT');
        const hasUnreturnedAssets = c.assignedAssets.some((a) => a.status !== 'RETURNED');
        return itClearance?.status !== 'CLEARED' || hasUnreturnedAssets;
      });
    }
    if (userRole === 'HR_ADMIN' || userRole === 'SUPER_ADMIN') {
      return items.filter(
        (c) =>
          c.stage === 'HR_REVIEW' ||
          (c.managerApproval.status === 'APPROVED' && c.hrApproval.status === 'PENDING') ||
          c.fnfStatus !== 'PAID'
      );
    }
    return [];
  }, [items, userRole]);

  // Accurate stage distribution counts across all 14 stages
  const stageCounts = useMemo<Record<ExitStage | 'ALL', number>>(() => {
    const counts: Record<ExitStage | 'ALL', number> = {
      ALL: 0,
      RESIGNATION_SUBMITTED: 0,
      MANAGER_REVIEW: 0,
      HR_REVIEW: 0,
      NOTICE_PERIOD: 0,
      KNOWLEDGE_TRANSFER: 0,
      CLEARANCE_PENDING: 0,
      FNF_SETTLEMENT: 0,
      EXIT_INTERVIEW: 0,
      DOCUMENTS_PENDING: 0,
      ACCESS_REVOCATION: 0,
      COMPLETED: 0,
      REJECTED: 0,
      WITHDRAWN: 0,
    };

    const source = allCasesData?.items || casesData?.items || [];
    counts.ALL = allCasesData?.total ?? source.length;

    source.forEach((c) => {
      if (counts[c.stage] !== undefined) {
        counts[c.stage]++;
      }
    });

    if (statsData) {
      if (counts.ALL === 0 && statsData.totalExits) counts.ALL = statsData.totalExits;
      if (counts.MANAGER_REVIEW === 0 && statsData.pendingManagerReviews) counts.MANAGER_REVIEW = statsData.pendingManagerReviews;
      if (counts.HR_REVIEW === 0 && statsData.pendingHrReviews) counts.HR_REVIEW = statsData.pendingHrReviews;
      if (counts.CLEARANCE_PENDING === 0 && statsData.pendingClearances) counts.CLEARANCE_PENDING = statsData.pendingClearances;
      if (counts.FNF_SETTLEMENT === 0 && statsData.pendingFnF) counts.FNF_SETTLEMENT = statsData.pendingFnF;
      if (counts.COMPLETED === 0 && statsData.completedThisMonth) counts.COMPLETED = statsData.completedThisMonth;
    }

    return counts;
  }, [allCasesData, casesData, statsData]);

  return (
    <div className="space-y-6">
      {/* KPI Stats Cards & 14-Stage Separation Pipeline */}
      <ExitStatsCards
        summary={statsData || casesData?.summary}
        stageCounts={stageCounts}
        selectedStage={stageFilter}
        onSelectStage={setStageFilter}
        isLoading={isStatsLoading || isCasesLoading}
      />

      {/* Role Action & SLA Urgent Highlights */}
      {(urgentCases.length > 0 || rolePendingActions.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Urgent / SLA Cases */}
          {urgentCases.length > 0 && (
            <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-300">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>SLA Watch: Separations ≤ 7 Days Remaining</span>
                </div>
                <Badge variant="warning" size="sm">
                  {urgentCases.length} Approaching LWD
                </Badge>
              </div>
              <div className="space-y-1.5 text-xs text-gray-700 dark:text-zinc-300">
                {urgentCases.slice(0, 3).map((uc) => {
                  const { remainingDays } = calculateNoticeDays(uc.resignationDate, uc.expectedLastWorkingDay, uc.noticeDays);
                  return (
                    <div
                      key={uc.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-white/80 dark:bg-zinc-900/80 border border-amber-100 dark:border-amber-900/30"
                    >
                      <span className="font-semibold">{uc.employeeName} ({uc.department})</span>
                      <span className="text-amber-600 dark:text-amber-400 font-bold">
                        {remainingDays} days remaining
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Role Pending Actions */}
          {rolePendingActions.length > 0 && (
            <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-200/60 dark:border-indigo-900/40 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-800 dark:text-indigo-300">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  <span>Pending Actions for Your Role ({userRole.replace('_', ' ')})</span>
                </div>
                <Badge variant="brand" size="sm">
                  {rolePendingActions.length} Pending
                </Badge>
              </div>
              <p className="text-xs text-indigo-900/70 dark:text-indigo-200/70">
                You have {rolePendingActions.length} cases awaiting approval, verification, or clearance sign-off under your authorized responsibilities.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Real-time Filters & Actions */}
      <ExitFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        departmentFilter={departmentFilter}
        onDepartmentChange={setDepartmentFilter}
        onCreateNew={() => setIsCreateModalOpen(true)}
      />

      {/* Error Display if query fails */}
      {casesError ? (
        <ErrorDisplay
          title="Unable to load exit cases"
          error={casesError}
          onRetry={() => {
            refetchCases();
          }}
        />
      ) : (
        /* Requests Table / Pipeline */
        <ExitRequestsTable
          cases={items}
          isLoading={isCasesLoading}
          onViewDetails={handleViewDetails}
          onReject={handleOpenReject}
        />
      )}

      {/* Slide-over Detail Sheet */}
      <ExitDetailSheet
        exitCase={selectedCaseForSheet}
        isOpen={isDetailSheetOpen}
        onClose={() => {
          setIsDetailSheetOpen(false);
          setSelectedCaseForSheet(null);
        }}
      />

      {/* Action Modals */}
      <CreateExitModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <RejectExitModal
        exitCase={selectedCaseForReject}
        isOpen={isRejectModalOpen}
        onClose={() => {
          setIsRejectModalOpen(false);
          setSelectedCaseForReject(null);
        }}
      />
    </div>
  );
};

export default ExitManagementPage;
