/**
 * @file ExitManagementPage.tsx
 * @description Enterprise 3-in-1 Exit Management Dashboard integrating:
 * 1. Overview View (All 14 KPI Cards, SLA Watch, Role Actions, Requests Pipeline)
 * 2. Analytics View (All 9 Recharts: Distribution, Trends, Department, Reasons, Notice, FnF, KT, Clearance, Completion Rate)
 * 3. Table View (Full Employee Separation Management Table with sorting, pagination, Excel/CSV export)
 * 
 * Features seamless tab switching without full-page reloads, persistent global filters,
 * startTransition-wrapped stage navigation, and resilient Error Boundary protection.
 */

import React, { useState, useMemo, useTransition } from 'react';
import {
  Clock,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Box,
  FileCheck,
  CreditCard,
  Building,
  User,
  LayoutDashboard,
  BarChart3,
  Table as TableIcon,
  RefreshCw,
  Download,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { ErrorDisplay } from '@/shared/ui/ErrorDisplay';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { useToast } from '@/shared/ui/Toast';
import { ErrorBoundary } from '@/shared/ui/ErrorBoundary';
import {
  useGetExitCasesQuery,
  useGetExitStatsQuery,
} from '../api/exitsApi';
import type { ExitCase, ExitStage, ExitFilters as ExitFiltersType } from '../types/exit.types';
import { ExitDashboardHeader, type ExitDashboardView } from '../components/ExitDashboardHeader';
import { GlobalExitFilters, type GlobalFiltersState } from '../components/GlobalExitFilters';
import { ExitStatsCards } from '../components/ExitStatsCards';
import { ExitAnalyticsCharts } from '../components/ExitAnalyticsCharts';
import { ExitSeparationTable } from '../components/ExitSeparationTable';
import { ExitRequestsTable } from '../components/ExitRequestsTable';
import { ExitDetailSheet } from '../components/ExitDetailSheet';
import { CreateExitModal } from '../components/CreateExitModal';
import { RejectExitModal } from '../components/RejectExitModal';
import { calculateNoticeDays } from '../mappers/exitMappers';
import { STAGE_CONFIGS } from '../config/stageConfig';

export const ExitManagementPage: React.FC = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [, startTransition] = useTransition();
  const { user, activeRole } = useAuth();
  const userRole = activeRole || (user?.roles?.[0] || 'EMPLOYEE');

  // 1. Dashboard View State (Overview | Analytics | Table)
  const [currentView, setCurrentView] = useState<ExitDashboardView>('overview');

  // 2. Global Filter & Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState<ExitStage | 'ALL'>('ALL');
  const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false);

  const [globalFilters, setGlobalFilters] = useState<GlobalFiltersState>({
    dateRange: { preset: 'thisYear' },
    department: 'ALL',
    location: 'ALL',
    employmentType: 'ALL',
    stage: 'ALL',
    exitStatus: 'ALL',
    fnfStatus: 'ALL',
  });

  // 3. Modal & Drawer States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedCaseForSheet, setSelectedCaseForSheet] = useState<ExitCase | null>(null);
  const [isDetailSheetOpen, setIsDetailSheetOpen] = useState(false);
  const [selectedCaseForReject, setSelectedCaseForReject] = useState<ExitCase | null>(null);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // 4. RTK Query Backend Payload
  const queryFilters: ExitFiltersType = useMemo(
    () => ({
      search: searchQuery.trim() || undefined,
      stage: stageFilter !== 'ALL' ? stageFilter : undefined,
      department: globalFilters.department !== 'ALL' ? globalFilters.department : undefined,
    }),
    [searchQuery, stageFilter, globalFilters.department]
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
    globalFilters.department !== 'ALL' ? { department: globalFilters.department } : undefined
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
    setGlobalFilters({
      dateRange: { preset: 'thisYear' },
      department: 'ALL',
      location: 'ALL',
      employmentType: 'ALL',
      stage: 'ALL',
      exitStatus: 'ALL',
      fnfStatus: 'ALL',
    });
    toast.info('Filters have been reset', 'Filters Cleared');
  };

  const rawCases = casesData?.items || [];

  // Helper: Date range filter evaluation
  const isDateWithinPreset = (dateStr?: string): boolean => {
    if (!dateStr) return true;
    const d = new Date(dateStr).getTime();
    if (isNaN(d)) return true;
    const now = new Date();
    const preset = globalFilters.dateRange.preset;

    if (preset === 'today') {
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
      return d >= today;
    }
    if (preset === 'thisWeek') {
      const day = now.getDay();
      const diff = now.getDate() - day + (day === 0 ? -6 : 1);
      const weekStart = new Date(now.getFullYear(), now.getMonth(), diff).getTime();
      return d >= weekStart;
    }
    if (preset === 'thisMonth') {
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
      return d >= monthStart;
    }
    if (preset === 'last3Months') {
      const threeMonths = new Date(now.getFullYear(), now.getMonth() - 3, 1).getTime();
      return d >= threeMonths;
    }
    if (preset === 'last6Months') {
      const sixMonths = new Date(now.getFullYear(), now.getMonth() - 6, 1).getTime();
      return d >= sixMonths;
    }
    if (preset === 'thisYear') {
      const yearStart = new Date(now.getFullYear(), 0, 1).getTime();
      return d >= yearStart;
    }
    if (preset === 'custom') {
      const start = globalFilters.dateRange.startDate ? new Date(globalFilters.dateRange.startDate).getTime() : 0;
      const end = globalFilters.dateRange.endDate ? new Date(globalFilters.dateRange.endDate).getTime() + 86400000 : Infinity;
      return d >= start && d <= end;
    }
    return true;
  };

  // Filtered cases matching global date, location, and employment type filters
  const filteredCases = useMemo(() => {
    return rawCases.filter((c) => {
      // Date range check
      if (!isDateWithinPreset(c.resignationDate || c.expectedLastWorkingDay)) {
        return false;
      }
      // Location check
      if (globalFilters.location !== 'ALL') {
        const cLoc = (c as any).location || 'Remote';
        if (cLoc !== globalFilters.location) return false;
      }
      // Employment type check
      if (globalFilters.employmentType !== 'ALL') {
        const cType = (c as any).employmentType || 'Full-Time';
        if (cType !== globalFilters.employmentType) return false;
      }
      // Local stage check
      if (globalFilters.stage !== 'ALL' && c.stage !== globalFilters.stage) {
        return false;
      }
      // Exit status check
      if (globalFilters.exitStatus !== 'ALL' && c.exitStatus !== globalFilters.exitStatus) {
        return false;
      }
      // FnF status check
      if (globalFilters.fnfStatus !== 'ALL' && c.fnfStatus !== globalFilters.fnfStatus) {
        return false;
      }
      return true;
    });
  }, [rawCases, globalFilters]);

  // Overdue / SLA breach highlights: cases with remaining notice days <= 7
  const urgentCases = useMemo(() => {
    return filteredCases.filter((c) => {
      if (c.stage === 'COMPLETED' || c.stage === 'REJECTED' || c.stage === 'WITHDRAWN') return false;
      const { remainingDays } = calculateNoticeDays(c.resignationDate, c.expectedLastWorkingDay, c.noticeDays);
      return remainingDays <= 7;
    });
  }, [filteredCases]);

  // Role pending action counts
  const rolePendingActions = useMemo(() => {
    if (userRole === 'MANAGER') {
      return filteredCases.filter(
        (c) =>
          c.stage === 'RESIGNATION_SUBMITTED' ||
          (c.stage === 'MANAGER_REVIEW' && c.managerApproval.status === 'PENDING') ||
          !c.ktStatus
      );
    }
    if (userRole === 'IT_ADMIN') {
      return filteredCases.filter((c) => {
        const itClearance = c.clearances.find((d) => d.department === 'IT');
        const hasUnreturnedAssets = c.assignedAssets.some((a) => a.status !== 'RETURNED');
        return itClearance?.status !== 'CLEARED' || hasUnreturnedAssets;
      });
    }
    if (userRole === 'HR_ADMIN' || userRole === 'SUPER_ADMIN') {
      return filteredCases.filter(
        (c) =>
          c.stage === 'HR_REVIEW' ||
          (c.managerApproval.status === 'APPROVED' && c.hrApproval.status === 'PENDING') ||
          c.fnfStatus !== 'PAID'
      );
    }
    return [];
  }, [filteredCases, userRole]);

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

  // Export handlers
  const handleExport = (format: 'excel' | 'csv') => {
    if (isExporting) return;

    setIsExporting(true);

    try {
      const headers = [
        'Employee ID',
        'Employee Name',
        'Email',
        'Department',
        'Designation',
        'Reporting Manager',
        'Resignation Date',
        'Last Working Day',
        'Notice Days',
        'Exit Reason',
        'Stage',
        'Exit Status',
        'F&F Status',
      ];

      const rows = filteredCases.map((c) => [
        `"${c.employeeId}"`,
        `"${c.employeeName}"`,
        `"${c.employeeEmail || ''}"`,
        `"${c.department}"`,
        `"${c.designation}"`,
        `"${c.managerName || ''}"`,
        `"${c.resignationDate || ''}"`,
        `"${c.expectedLastWorkingDay || ''}"`,
        `"${c.noticeDays || ''}"`,
        `"${typeof c.reason === 'string' ? c.reason : ''}"`,
        `"${c.stage}"`,
        `"${c.exitStatus}"`,
        `"${c.fnfStatus}"`,
      ]);

      if (format === 'excel') {
        // For Excel, we create a proper HTML table that Excel can read
        const htmlContent = `
          <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
          <head><meta charset="UTF-8"><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Exit Records</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head>
          <body>
            <table border="1">
              <thead><tr>${headers.map((h) => `<th>${h}</th>`).join('')}</tr></thead>
              <tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody>
            </table>
          </body>
          </html>
        `;
        const blob = new Blob([htmlContent], { type: 'application/vnd.ms-excel;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Exit_Records_Excel_${new Date().toISOString().slice(0, 10)}.xls`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else {
        const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `Exit_Records_CSV_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      toast.success(`Exported ${filteredCases.length} records to ${format.toUpperCase()}`, 'Export Complete');
    } catch (error) {
      toast.error('Failed to export records. Please try again.', 'Export Failed');
    } finally {
      setIsExporting(false);
    }
  };

  // Drilldown handler from analytics chart to table
  const handleAnalyticsDrillDown = (stage: ExitStage) => {
    setStageFilter(stage);
    setCurrentView('table');
    toast.info(`Filtered table to stage: ${stage.replace(/_/g, ' ')}`, 'Chart Drill-down');
  };

  return (
    <ErrorBoundary title="Exit Management Error" message="An error occurred while rendering the Exit Management module.">
      <div className="space-y-6">
        {/* 1. Professional Dashboard Header & View Switcher */}
        <ExitDashboardHeader
          currentView={currentView}
          onViewChange={setCurrentView}
          onRefresh={handleRefreshAll}
          onExport={handleExport}
          onFilterToggle={() => setIsFiltersModalOpen(true)}
          isFiltersOpen={isFiltersModalOpen}
          isLoading={isCasesLoading || isCasesFetching || isStatsLoading}
          isExporting={isExporting}
          totalRecords={filteredCases.length}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onCreateResignation={() => setIsCreateModalOpen(true)}
          activeFilterCount={
            (globalFilters.dateRange.preset !== 'thisYear' ? 1 : 0) +
            (globalFilters.department !== 'ALL' ? 1 : 0) +
            (globalFilters.location !== 'ALL' ? 1 : 0) +
            (globalFilters.employmentType !== 'ALL' ? 1 : 0) +
            (stageFilter !== 'ALL' ? 1 : 0)
          }
        />

        {/* 2. Global Filters Drawer */}
        <GlobalExitFilters
          filters={globalFilters}
          onFiltersChange={setGlobalFilters}
          onReset={handleResetFilters}
          isOpen={isFiltersModalOpen}
          onClose={() => setIsFiltersModalOpen(false)}
          departments={['Engineering', 'Product', 'Design', 'Marketing', 'Sales', 'Human Resources', 'Finance', 'Operations']}
          stages={STAGE_CONFIGS.filter((s) => s.stage !== 'ALL').map((s) => s.stage)}
          exitStatuses={['PENDING', 'IN_PROGRESS', 'COMPLETED', 'REJECTED', 'WITHDRAWN']}
          fnfStatuses={['DRAFT', 'UNDER_REVIEW', 'PENDING_APPROVAL', 'APPROVED', 'PAYMENT_PROCESSING', 'PAID', 'ON_HOLD']}
        />

        {/* 3. Error Display if query fails */}
        {casesError && (
          <ErrorDisplay
            title="Unable to load exit cases from server"
            error={casesError}
            onRetry={handleRefreshAll}
          />
        )}

        {/* 4. Active View Rendering */}

        {/* VIEW 1: OVERVIEW */}
        {currentView === 'overview' && (
          <div className="space-y-6 animate-in fade-in-50 duration-200">
            {/* All 14 KPI Cards */}
            <ExitStatsCards
              summary={statsData || casesData?.summary}
              stageCounts={stageCounts}
              selectedStage={stageFilter}
              onSelectStage={(st) => {
                setStageFilter(st);
                const target = STAGE_CONFIGS.find((s) => s.stage === st);
                if (target) {
                  startTransition(() => {
                    navigate(target.routePath);
                  });
                }
              }}
              isLoading={isStatsLoading || isCasesLoading}
              enableNavigation={true}
            />

            {/* SLA Watch & Role Pending Actions */}
            {(urgentCases.length > 0 || rolePendingActions.length > 0) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Urgent SLA Cases */}
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
                        const { remainingDays } = calculateNoticeDays(
                          uc.resignationDate,
                          uc.expectedLastWorkingDay,
                          uc.noticeDays
                        );
                        return (
                          <div
                            key={uc.id}
                            className="flex items-center justify-between p-2 rounded-lg bg-white/80 dark:bg-zinc-900/80 border border-amber-100 dark:border-amber-900/30"
                          >
                            <span className="font-semibold">
                              {uc.employeeName} ({uc.department})
                            </span>
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

            {/* Overview Separation Pipeline Table Preview */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">Active Separation Requests</h3>
                  <p className="text-xs text-gray-500 dark:text-zinc-400">Recent resignation requests and pipeline tracking</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentView('table')}
                  className="text-xs gap-1"
                >
                  <TableIcon className="w-3.5 h-3.5" />
                  <span>View All in Table</span>
                </Button>
              </div>

              <ExitRequestsTable
                cases={filteredCases.slice(0, 10)}
                isLoading={isCasesLoading}
                onViewDetails={handleViewDetails}
                onReject={handleOpenReject}
              />
            </div>
          </div>
        )}

        {/* VIEW 2: ANALYTICS */}
        {currentView === 'analytics' && (
          <div className="animate-in fade-in-50 duration-200">
            <ExitAnalyticsCharts
              cases={filteredCases}
              isLoading={isCasesLoading || isStatsLoading}
              onDrillDown={handleAnalyticsDrillDown}
            />
          </div>
        )}

        {/* VIEW 3: TABLE */}
        {currentView === 'table' && (
          <div className="animate-in fade-in-50 duration-200">
            <ExitSeparationTable
              cases={filteredCases}
              isLoading={isCasesLoading}
              onViewDetails={handleViewDetails}
              onEditCase={handleViewDetails}
              onExportCsv={() => handleExport('csv')}
              onExportExcel={() => handleExport('excel')}
              selectedStageFilter={stageFilter}
              onStageFilterChange={setStageFilter}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </div>
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
    </ErrorBoundary>
  );
};

export default ExitManagementPage;
