import React, { useState, useMemo } from 'react';
import { ErrorDisplay } from '@/shared/ui/ErrorDisplay';
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
    data: statsData,
    isLoading: isStatsLoading,
    refetch: refetchStats,
  } = useGetExitStatsQuery();

  const handleRefreshAll = () => {
    refetchCases();
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

  return (
    <div className="space-y-6">
      {/* KPI Stats Cards */}
      <ExitStatsCards
        summary={statsData || casesData?.summary}
        isLoading={isStatsLoading || isCasesLoading}
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
