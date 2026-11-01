import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ChevronRight,
  Download,
  RefreshCw,
  Search,
  Filter,
  X,
  User,
  Calendar,
  Clock,
  Eye,
  ShieldAlert,
  Building,
  Briefcase,
  MapPin,
  FileSpreadsheet,
} from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useToast } from '@/shared/ui/Toast';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { EmptyState } from '@/shared/ui/EmptyState';
import { ErrorDisplay } from '@/shared/ui/ErrorDisplay';
import {
  useGetExitCasesQuery,
  useGetExitStatsQuery,
} from '../api/exitsApi';
import type { ExitCase, ExitStage } from '../types/exit.types';
import {
  getStageConfigBySlug,
  STAGE_CONFIGS,
  type ExitStageConfig,
} from '../config/stageConfig';
import { ExitStatsCards } from '../components/ExitStatsCards';
import { ExitDetailSheet } from '../components/ExitDetailSheet';
import { calculateNoticeDays } from '../mappers/exitMappers';

export const ExitStagePage: React.FC = () => {
  const { stageSlug } = useParams<{ stageSlug: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();
  const userRole = user?.role || 'EMPLOYEE';

  // Resolve Stage Configuration from URL slug
  const stageConfig: ExitStageConfig = useMemo(
    () => getStageConfigBySlug(stageSlug),
    [stageSlug]
  );

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [designationFilter, setDesignationFilter] = useState('ALL');
  const [locationFilter, setLocationFilter] = useState('ALL');
  const [employmentTypeFilter, setEmploymentTypeFilter] = useState('ALL');

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Drawer / Sheet State
  const [selectedCase, setSelectedCase] = useState<ExitCase | null>(null);
  const [isDetailSheetOpen, setIsDetailSheetOpen] = useState(false);

  // Backend query payload: passes stage filter and department if specified
  const queryParams = useMemo(() => {
    return {
      stage: stageConfig.stageFilter,
      department: departmentFilter !== 'ALL' ? departmentFilter : undefined,
      search: searchQuery.trim() || undefined,
    };
  }, [stageConfig.stageFilter, departmentFilter, searchQuery]);

  // Fetch Live Data
  const {
    data: casesData,
    isLoading: isCasesLoading,
    isFetching: isCasesFetching,
    error: casesError,
    refetch: refetchCases,
  } = useGetExitCasesQuery(queryParams);

  // Stats for 14-stage KPI tracker
  const {
    data: statsData,
    isLoading: isStatsLoading,
    refetch: refetchStats,
  } = useGetExitStatsQuery();

  const handleRefresh = () => {
    refetchCases();
    refetchStats();
    toast.info('Refreshed stage data from backend', 'Syncing Data');
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setDepartmentFilter('ALL');
    setDesignationFilter('ALL');
    setLocationFilter('ALL');
    setEmploymentTypeFilter('ALL');
    setCurrentPage(1);
  };

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    departmentFilter !== 'ALL' ||
    designationFilter !== 'ALL' ||
    locationFilter !== 'ALL' ||
    employmentTypeFilter !== 'ALL';

  const rawCases = casesData?.items || [];

  // Client-side filtering for Designation, Location, and Employment Type
  const filteredCases = useMemo(() => {
    return rawCases.filter((c) => {
      // If we are on a specific stage route, enforce stage match defensively
      if (stageConfig.stageFilter && c.stage !== stageConfig.stageFilter) {
        return false;
      }
      if (designationFilter !== 'ALL' && c.designation !== designationFilter) {
        return false;
      }
      const caseLocation = (c as any).location || 'Remote';
      if (locationFilter !== 'ALL' && caseLocation !== locationFilter) {
        return false;
      }
      const caseType = (c as any).employmentType || 'Full-Time';
      if (employmentTypeFilter !== 'ALL' && caseType !== employmentTypeFilter) {
        return false;
      }
      return true;
    });
  }, [rawCases, stageConfig.stageFilter, designationFilter, locationFilter, employmentTypeFilter]);

  // Derived filter options
  const departmentOptions = [
    { value: 'ALL', label: 'All Departments' },
    { value: 'Engineering', label: 'Engineering' },
    { value: 'Product', label: 'Product' },
    { value: 'Design', label: 'Design' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'Sales', label: 'Sales' },
    { value: 'Human Resources', label: 'Human Resources' },
    { value: 'Finance', label: 'Finance' },
    { value: 'Operations', label: 'Operations' },
  ];

  const designationOptions = useMemo(() => {
    const set = new Set<string>();
    rawCases.forEach((c) => {
      if (c.designation) set.add(c.designation);
    });
    // Add common fallback designations if dataset is sparse
    ['Tech Lead', 'Senior Software Engineer', 'Product Manager', 'UI/UX Designer', 'HR Manager', 'Financial Analyst', 'Operations Specialist'].forEach((d) => set.add(d));
    return ['ALL', ...Array.from(set)];
  }, [rawCases]);

  const locationOptions = ['ALL', 'Remote', 'Mumbai', 'Bangalore', 'Delhi NCR', 'Hyderabad', 'Pune', 'Chennai'];
  const employmentTypeOptions = ['ALL', 'Full-Time', 'Contract', 'Part-Time', 'Intern'];

  // Pagination Calculations
  const totalItems = filteredCases.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const paginatedCases = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredCases.slice(start, start + pageSize);
  }, [filteredCases, currentPage, pageSize]);

  // CSV Export Functionality
  const handleExportCsv = () => {
    if (filteredCases.length === 0) {
      toast.warning('No records to export in the current view', 'Export Empty');
      return;
    }

    const headers = [
      'Employee ID',
      'Case Number',
      'Employee Name',
      'Email',
      'Department',
      'Designation',
      'Manager',
      'Resignation Date',
      'Last Working Day',
      'Notice Days',
      'Current Stage',
      'Exit Status',
      'FnF Status',
    ];

    const rows = filteredCases.map((c) => [
      `"${c.employeeId || ''}"`,
      `"${c.caseNumber || ''}"`,
      `"${c.employeeName || ''}"`,
      `"${c.employeeEmail || ''}"`,
      `"${c.department || ''}"`,
      `"${c.designation || ''}"`,
      `"${c.managerName || ''}"`,
      `"${c.resignationDate ? c.resignationDate.slice(0, 10) : ''}"`,
      `"${c.expectedLastWorkingDay ? c.expectedLastWorkingDay.slice(0, 10) : ''}"`,
      c.noticeDays || 30,
      `"${c.stage}"`,
      `"${c.exitStatus}"`,
      `"${c.fnfStatus}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `exit_cases_${stageConfig.slug}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(`Exported ${filteredCases.length} employee records to CSV`, 'Export Successful');
  };

  // Stage Badge Renderer
  const renderStageBadge = (stage: ExitStage) => {
    const config = STAGE_CONFIGS.find((s) => s.stage === stage);
    return (
      <Badge
        variant={config?.badgeVariant || 'neutral'}
        size="sm"
        className="font-semibold text-xs whitespace-nowrap"
      >
        {config?.title || stage}
      </Badge>
    );
  };

  // RBAC Guard: Confidentiality for Exit Interview (Manager strictly blocked)
  if (stageConfig.stage === 'EXIT_INTERVIEW' && userRole === 'MANAGER') {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-zinc-400">
          <Link to="/dashboard" className="hover:text-brand-600 transition-colors">
            Dashboard
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/dashboard/exit-management" className="hover:text-brand-600 transition-colors">
            Exit Management
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-semibold text-gray-900 dark:text-gray-100">{stageConfig.title}</span>
        </div>

        <div className="p-8 rounded-2xl bg-white dark:bg-[#171717] border border-amber-200 dark:border-amber-900/50 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            Confidential HR Records: Manager Access Restricted
          </h2>
          <p className="text-sm text-gray-500 dark:text-zinc-400 max-w-md mx-auto">
            In compliance with enterprise HR governance, exit interview responses, compensation feedback, and manager ratings are confidential to Human Resources.
          </p>
          <Button
            variant="outline"
            onClick={() => navigate('/dashboard/exit-management')}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Exit Management
          </Button>
        </div>
      </div>
    );
  }

  const StageIcon = stageConfig.icon;

  return (
    <div className="space-y-6">
      {/* 1. Breadcrumb & Back Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs text-gray-500 dark:text-zinc-400"
        >
          <Link to="/dashboard" className="hover:text-brand-600 transition-colors">
            Dashboard
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <Link
            to="/dashboard/exit-management"
            className="hover:text-brand-600 transition-colors font-medium"
          >
            Exit Management
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <span className="font-bold text-gray-900 dark:text-gray-100">
            {stageConfig.title}
          </span>
        </nav>

        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/dashboard/exit-management')}
          className="gap-1.5 text-xs self-start sm:self-auto border-gray-200 dark:border-zinc-800"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Exit Management</span>
        </Button>
      </div>

      {/* 2. Page Header matching selected KPI */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-2xl border ${stageConfig.bg} ${stageConfig.color} flex-shrink-0`}>
            <StageIcon className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                {stageConfig.title}
              </h1>
              <Badge variant="brand" size="sm" className="font-semibold text-xs">
                {isCasesLoading ? 'Loading...' : `${totalItems} Total Records`}
              </Badge>
            </div>
            <p className="text-xs text-gray-500 dark:text-zinc-400 max-w-2xl">
              {stageConfig.shortDescription}
            </p>
          </div>
        </div>

        {/* Refresh & CSV Export Actions */}
        <div className="flex items-center gap-2 self-start md:self-auto flex-shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isCasesFetching}
            className="text-xs gap-1.5"
            title="Refresh live data from server"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isCasesFetching ? 'animate-spin text-brand-500' : ''}`} />
            <span>Refresh</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCsv}
            disabled={filteredCases.length === 0}
            className="text-xs gap-1.5 bg-gray-50 dark:bg-zinc-800 border-gray-300 dark:border-zinc-700"
            title="Export filtered records as CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </Button>
        </div>
      </div>

      {/* 3. Interactive KPI Stage Navigation Switcher */}
      <ExitStatsCards
        summary={statsData || casesData?.summary}
        selectedStage={stageConfig.stage}
        onSelectStage={(stage) => {
          const target = STAGE_CONFIGS.find((s) => s.stage === stage);
          if (target) {
            navigate(target.routePath);
          }
        }}
        isLoading={isStatsLoading}
        enableNavigation={true}
      />

      {/* 4. Search and 4 Filters Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 shadow-sm space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Search Input */}
          <div className="md:col-span-4 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by Employee, Case ID, Email..."
              className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-[#212121] text-gray-900 dark:text-[#ececec] placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Department Filter */}
          <div className="md:col-span-2">
            <select
              value={departmentFilter}
              onChange={(e) => {
                setDepartmentFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-[#212121] text-gray-900 dark:text-[#ececec] focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors cursor-pointer"
            >
              {departmentOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Designation Filter */}
          <div className="md:col-span-2">
            <select
              value={designationFilter}
              onChange={(e) => {
                setDesignationFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-[#212121] text-gray-900 dark:text-[#ececec] focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors cursor-pointer"
            >
              {designationOptions.map((desig) => (
                <option key={desig} value={desig}>
                  {desig === 'ALL' ? 'All Designations' : desig}
                </option>
              ))}
            </select>
          </div>

          {/* Location Filter */}
          <div className="md:col-span-2">
            <select
              value={locationFilter}
              onChange={(e) => {
                setLocationFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-[#212121] text-gray-900 dark:text-[#ececec] focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors cursor-pointer"
            >
              {locationOptions.map((loc) => (
                <option key={loc} value={loc}>
                  {loc === 'ALL' ? 'All Locations' : loc}
                </option>
              ))}
            </select>
          </div>

          {/* Employment Type Filter & Reset */}
          <div className="md:col-span-2 flex items-center gap-2">
            <select
              value={employmentTypeFilter}
              onChange={(e) => {
                setEmploymentTypeFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-[#212121] text-gray-900 dark:text-[#ececec] focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors cursor-pointer"
            >
              {employmentTypeOptions.map((type) => (
                <option key={type} value={type}>
                  {type === 'ALL' ? 'All Types' : type}
                </option>
              ))}
            </select>

            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetFilters}
                className="text-xs p-2 border-dashed border-gray-300 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-800 flex-shrink-0"
                title="Reset all filters"
              >
                <X className="w-3.5 h-3.5" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* 5. Error State */}
      {casesError && (
        <ErrorDisplay
          title="Unable to load employee separation records"
          error={casesError}
          onRetry={refetchCases}
        />
      )}

      {/* 6. Employee Data Table & 4-State UI */}
      {!casesError && (
        <div className="overflow-hidden rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-zinc-800 bg-gray-50/75 dark:bg-zinc-900/50 text-gray-500 dark:text-zinc-400 font-semibold uppercase tracking-wider">
                  <th className="py-3.5 px-4">Employee ID</th>
                  <th className="py-3.5 px-4">Employee Name</th>
                  <th className="py-3.5 px-4">Department</th>
                  <th className="py-3.5 px-4">Designation</th>
                  <th className="py-3.5 px-4">Manager</th>
                  <th className="py-3.5 px-4">Resignation Date</th>
                  <th className="py-3.5 px-4">Last Working Day</th>
                  <th className="py-3.5 px-4">Notice Period</th>
                  <th className="py-3.5 px-4">Current Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-zinc-800/60">
                {isCasesLoading ? (
                  // Loading Skeleton Rows
                  Array.from({ length: 5 }).map((_, idx) => (
                    <tr key={idx} className="animate-pulse">
                      <td className="py-4 px-4">
                        <div className="h-4 w-20 bg-gray-200 dark:bg-zinc-800 rounded" />
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-gray-200 dark:bg-zinc-800" />
                          <div>
                            <div className="h-3.5 w-28 bg-gray-200 dark:bg-zinc-800 rounded mb-1" />
                            <div className="h-2.5 w-20 bg-gray-100 dark:bg-zinc-800/60 rounded" />
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="h-3.5 w-24 bg-gray-200 dark:bg-zinc-800 rounded" />
                      </td>
                      <td className="py-4 px-4">
                        <div className="h-3.5 w-24 bg-gray-200 dark:bg-zinc-800 rounded" />
                      </td>
                      <td className="py-4 px-4">
                        <div className="h-3.5 w-20 bg-gray-200 dark:bg-zinc-800 rounded" />
                      </td>
                      <td className="py-4 px-4">
                        <div className="h-3.5 w-20 bg-gray-200 dark:bg-zinc-800 rounded" />
                      </td>
                      <td className="py-4 px-4">
                        <div className="h-3.5 w-24 bg-gray-200 dark:bg-zinc-800 rounded" />
                      </td>
                      <td className="py-4 px-4">
                        <div className="h-3.5 w-16 bg-gray-200 dark:bg-zinc-800 rounded" />
                      </td>
                      <td className="py-4 px-4">
                        <div className="h-5 w-24 bg-gray-200 dark:bg-zinc-800 rounded-full" />
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="h-7 w-20 bg-gray-200 dark:bg-zinc-800 rounded float-right" />
                      </td>
                    </tr>
                  ))
                ) : paginatedCases.length === 0 ? (
                  // Empty State Row
                  <tr>
                    <td colSpan={10} className="py-12">
                      <EmptyState
                        title={`No separation cases in ${stageConfig.title}`}
                        description={
                          hasActiveFilters
                            ? 'No employee separation records match the active search filters.'
                            : `There are currently no employee cases undergoing ${stageConfig.title}.`
                        }
                        action={
                          hasActiveFilters
                            ? {
                                label: 'Clear Filters',
                                onClick: handleResetFilters,
                              }
                            : undefined
                        }
                      />
                    </td>
                  </tr>
                ) : (
                  // Data Rows
                  paginatedCases.map((exitCase) => {
                    const { remainingDays } = calculateNoticeDays(
                      exitCase.resignationDate,
                      exitCase.expectedLastWorkingDay,
                      exitCase.noticeDays
                    );

                    return (
                      <tr
                        key={exitCase.id}
                        className="hover:bg-gray-50/60 dark:hover:bg-zinc-800/30 transition-colors group"
                      >
                        {/* 1. Employee ID */}
                        <td className="py-3.5 px-4 font-mono font-medium text-gray-700 dark:text-zinc-300">
                          <span className="bg-gray-100 dark:bg-zinc-800 px-2 py-0.5 rounded text-[11px] font-bold">
                            {exitCase.employeeId || exitCase.caseNumber}
                          </span>
                          {exitCase.caseNumber && exitCase.employeeId && (
                            <div className="text-[10px] text-gray-400 dark:text-zinc-500 mt-0.5">
                              {exitCase.caseNumber}
                            </div>
                          )}
                        </td>

                        {/* 2. Employee Name & Avatar */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 font-bold flex items-center justify-center text-xs border border-brand-200 dark:border-brand-900/40 flex-shrink-0">
                              {exitCase.employeeName.charAt(0)}
                            </div>
                            <div className="min-w-0">
                              <div className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                                {exitCase.employeeName}
                              </div>
                              <div className="text-[11px] text-gray-400 dark:text-zinc-500 truncate">
                                {exitCase.employeeEmail}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* 3. Department */}
                        <td className="py-3.5 px-4 text-gray-700 dark:text-zinc-300 font-medium">
                          {exitCase.department}
                        </td>

                        {/* 4. Designation */}
                        <td className="py-3.5 px-4 text-gray-700 dark:text-zinc-300">
                          {exitCase.designation}
                        </td>

                        {/* 5. Manager */}
                        <td className="py-3.5 px-4 text-gray-600 dark:text-zinc-400">
                          {exitCase.managerName || '—'}
                        </td>

                        {/* 6. Resignation Date */}
                        <td className="py-3.5 px-4 text-gray-600 dark:text-zinc-400 whitespace-nowrap">
                          {exitCase.resignationDate
                            ? new Date(exitCase.resignationDate).toLocaleDateString()
                            : '—'}
                        </td>

                        {/* 7. Last Working Day */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900 dark:text-gray-100">
                            {exitCase.expectedLastWorkingDay
                              ? new Date(exitCase.expectedLastWorkingDay).toLocaleDateString()
                              : 'TBD'}
                          </div>
                          {exitCase.stage !== 'COMPLETED' && exitCase.stage !== 'REJECTED' && exitCase.stage !== 'WITHDRAWN' && (
                            <div className="text-[10px] text-amber-600 dark:text-amber-400 font-medium mt-0.5">
                              {remainingDays > 0 ? `${remainingDays}d remaining` : 'LWD today/passed'}
                            </div>
                          )}
                        </td>

                        {/* 8. Notice Period */}
                        <td className="py-3.5 px-4 text-gray-700 dark:text-zinc-300 font-medium">
                          {exitCase.noticeDays} Days
                        </td>

                        {/* 9. Current Status */}
                        <td className="py-3.5 px-4">
                          {renderStageBadge(exitCase.stage)}
                        </td>

                        {/* 10. Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedCase(exitCase);
                              setIsDetailSheetOpen(true);
                            }}
                            className="text-xs gap-1.5 hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-950/40"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View Details</span>
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* 7. Pagination Controls */}
          {!isCasesLoading && totalItems > 0 && (
            <div className="p-4 border-t border-gray-100 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500 dark:text-zinc-400">
              <div className="flex items-center gap-2">
                <span>Rows per page:</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-2 py-1 rounded-lg border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-[#ececec] focus:outline-none"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
                <span className="ml-2">
                  Showing {(currentPage - 1) * pageSize + 1} to{' '}
                  {Math.min(currentPage * pageSize, totalItems)} of {totalItems} employees
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="text-xs px-2.5 py-1"
                >
                  Previous
                </Button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => {
                  // Show max 5 page buttons around current
                  if (
                    totalPages <= 5 ||
                    pg === 1 ||
                    pg === totalPages ||
                    Math.abs(pg - currentPage) <= 1
                  ) {
                    return (
                      <button
                        key={pg}
                        type="button"
                        onClick={() => setCurrentPage(pg)}
                        className={`w-7 h-7 rounded-lg text-xs font-semibold transition-colors ${
                          currentPage === pg
                            ? 'bg-brand-600 text-white'
                            : 'hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-700 dark:text-zinc-300'
                        }`}
                      >
                        {pg}
                      </button>
                    );
                  }
                  if (pg === 2 && currentPage > 3) return <span key={pg}>...</span>;
                  if (pg === totalPages - 1 && currentPage < totalPages - 2)
                    return <span key={pg}>...</span>;
                  return null;
                })}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="text-xs px-2.5 py-1"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Slide-over Detail Sheet */}
      <ExitDetailSheet
        exitCase={selectedCase}
        isOpen={isDetailSheetOpen}
        onClose={() => {
          setIsDetailSheetOpen(false);
          setSelectedCase(null);
        }}
      />
    </div>
  );
};

export default ExitStagePage;
