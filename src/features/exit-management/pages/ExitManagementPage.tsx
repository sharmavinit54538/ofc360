import React, { useState, useMemo } from 'react';
import { ErrorDisplay } from '@/shared/ui/ErrorDisplay';
import { useToast } from '@/shared/ui/Toast';
import {
  useGetExitCasesQuery,
  useGetExitAnalyticsQuery,
  useUpdateExitStageMutation,
} from '../api/exitsApi';
import type { ExitCase, ExitStage, ExitFilters as ExitFiltersType } from '../types/exit.types';
import { ExitStatsCards } from '../components/ExitStatsCards';
import { ExitFilters } from '../components/ExitFilters';
import { ExitRequestsTable } from '../components/ExitRequestsTable';
import { ExitDetailSheet } from '../components/ExitDetailSheet';
import { CreateExitModal } from '../components/CreateExitModal';
import { RejectExitModal } from '../components/RejectExitModal';
import { DeactivateEmployeeModal } from '../components/DeactivateEmployeeModal';

export const ExitManagementPage: React.FC = () => {
  const toast = useToast();

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
  const [selectedCaseForDeactivate, setSelectedCaseForDeactivate] = useState<ExitCase | null>(null);
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);

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

  const {
    data: analyticsData,
    isLoading: isAnalyticsLoading,
    refetch: refetchAnalytics,
  } = useGetExitAnalyticsQuery();

  // Mutations
  const [updateStage, { isLoading: isUpdatingStage }] = useUpdateExitStageMutation();

  const handleRefreshAll = () => {
    refetchCases();
    refetchAnalytics();
    toast.info('Refreshed exit management data from server', 'Syncing Data');
  };

  const handleViewDetails = (exitCase: ExitCase) => {
    setSelectedCaseForSheet(exitCase);
    setIsDetailSheetOpen(true);
  };

  const handleAdvanceStage = async (exitCase: ExitCase) => {
    let nextStage: ExitStage = 'MANAGER_REVIEW';
    if (exitCase.stage === 'RESIGNATION_SUBMITTED') nextStage = 'MANAGER_REVIEW';
    else if (exitCase.stage === 'MANAGER_REVIEW') nextStage = 'CLEARANCE_PENDING';
    else if (exitCase.stage === 'CLEARANCE_PENDING') nextStage = 'FNF_SETTLEMENT';
    else if (exitCase.stage === 'FNF_SETTLEMENT') nextStage = 'COMPLETED';

    try {
      await updateStage({
        id: exitCase.id,
        stage: nextStage,
      }).unwrap();

      toast.success(
        `Case ${exitCase.caseNumber || exitCase.id} advanced to ${nextStage.replace('_', ' ')}!`,
        'Stage Updated'
      );
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to update workflow stage', 'Action Error');
    }
  };

  const handleOpenReject = (exitCase: ExitCase) => {
    setSelectedCaseForReject(exitCase);
    setIsRejectModalOpen(true);
  };

  const handleOpenDeactivate = (exitCase: ExitCase) => {
    setSelectedCaseForDeactivate(exitCase);
    setIsDeactivateModalOpen(true);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setStageFilter('ALL');
    setDepartmentFilter('ALL');
  };

  const items = casesData?.items || [];

  return (
    <div className="space-y-6">
      {/* KPI Stats Cards */}
      <ExitStatsCards
        summary={analyticsData || casesData?.summary}
        isLoading={isAnalyticsLoading || isCasesLoading}
      />

      {/* Real-time Filters & Actions */}
      <ExitFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        stageFilter={stageFilter}
        onStageChange={setStageFilter}
        departmentFilter={departmentFilter}
        onDepartmentChange={setDepartmentFilter}
        onResetFilters={handleResetFilters}
        onCreateNew={() => setIsCreateModalOpen(true)}
        onRefresh={handleRefreshAll}
        isRefreshing={isCasesFetching}
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
          onAdvanceStage={handleAdvanceStage}
          onReject={handleOpenReject}
          onDeactivate={handleOpenDeactivate}
          isActionLoading={isUpdatingStage}
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

      <DeactivateEmployeeModal
        exitCase={selectedCaseForDeactivate}
        isOpen={isDeactivateModalOpen}
        onClose={() => {
          setIsDeactivateModalOpen(false);
          setSelectedCaseForDeactivate(null);
        }}
      />
    </div>
  );
};

export default ExitManagementPage;
