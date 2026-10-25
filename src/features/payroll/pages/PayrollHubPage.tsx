import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  CirclePlus,
  Layers3,
  Play,
  RefreshCw,
  Send,
  Settings2,
  ShieldCheck,
  Building2,
  Sliders,
} from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { ErrorDisplay } from '@/shared/ui/ErrorDisplay';
import { cn } from '@/shared/lib/utils';
import { useGetDepartmentsQuery } from '@/features/workforce/api/workforceApi';
import {
  useGetPayrollRunsQuery,
  useGetPayrollStatsQuery,
  useGetPayslipsQuery,
  useGetSalaryStructuresQuery,
  useGetTaxDeclarationsQuery,
} from '../api/payrollApi';
import type {
  PayrollFilterParams,
  PayrollRunItem,
  PayrollScope,
  SalaryStructureFilterParams,
  UpdatePayrollRunStatusPayload,
} from '../types/payroll.types';
import { getCurrentFinancialYear } from '../payroll.utils';
import { PayrollKpiCards } from '../components/PayrollKpiCards';
import { PayrollFilterBar } from '../components/PayrollFilterBar';
import { PayrollRunsTable } from '../components/PayrollRunsTable';
import { PayslipsTable } from '../components/PayslipsTable';
import { PayslipDetailModal } from '../components/PayslipDetailModal';
import { InitiatePayrollModal } from '../components/InitiatePayrollModal';
import { AddAdjustmentModal } from '../components/AddAdjustmentModal';
import { SalaryStructuresTable } from '../components/SalaryStructuresTable';
import { PayrollRunStatusModal } from '../components/PayrollRunStatusModal';
import { TaxDeclarationsTable } from '../components/TaxDeclarationsTable';
import { SubmitTaxDeclarationModal } from '../components/SubmitTaxDeclarationModal';
import { PayComponentsCatalog } from '../components/PayComponentsCatalog';
import { StatutoryComplianceCenter } from '../components/StatutoryComplianceCenter';
import { PfComplianceCenter } from '../components/PfComplianceCenter';
import { PayrollApprovalStepper } from '../components/PayrollApprovalStepper';
import { DashboardKpiGrid } from '../components/DashboardKpiGrid';
import { PayrollOverviewDetail } from '../components/PayrollOverviewDetail';
import { PayrollDetailHeader } from '../components/PayrollDetailHeader';

const PAGE_SIZE = 10;

type PayrollTab =
  | 'overview'
  | 'runs'
  | 'payslips'
  | 'structures'
  | 'components'
  | 'statutory'
  | 'pf-ecr'
  | 'tax';

interface PaginationControlsProps {
  page: number;
  total: number;
  limit: number;
  isFetching: boolean;
  onPageChange: (page: number) => void;
  resourceLabel: string;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  page,
  total,
  limit,
  isFetching,
  onPageChange,
  resourceLabel,
}) => {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  if (total === 0) return null;

  return (
    <div className="px-5 py-3.5 rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#171717] flex flex-col sm:flex-row items-center justify-between gap-3">
      <p className="text-xs text-gray-500 dark:text-zinc-400">
        Page <span className="font-semibold text-gray-900 dark:text-white">{page}</span> of{' '}
        <span className="font-semibold text-gray-900 dark:text-white">{totalPages}</span> · {total} {resourceLabel}
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page <= 1 || isFetching}
          leftIcon={<ChevronLeft className="w-3.5 h-3.5" />}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page >= totalPages || isFetching}
          rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
        >
          Next
        </Button>
      </div>
    </div>
  );
};


export const PayrollHubPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlTab = searchParams.get('tab') as PayrollTab | null;
  const [activeModuleId, setActiveModuleId] = useState<PayrollTab | null>(urlTab);

  useEffect(() => {
    if (urlTab !== activeModuleId) {
      setActiveModuleId(urlTab);
    }
  }, [urlTab]);

  const handleSelectModule = (id: string) => {
    const tab = id as PayrollTab;
    setActiveModuleId(tab);
    setSearchParams({ tab });
  };

  const handleBackToHub = () => {
    setActiveModuleId(null);
    setSearchParams({});
  };

  const activeTab = activeModuleId;
  const [month, setMonth] = useState(() => new Date().getMonth() + 1);
  const [year, setYear] = useState(() => new Date().getFullYear());
  const [scope, setScope] = useState<PayrollScope>('MY');

  const [payslipSearch, setPayslipSearch] = useState('');
  const [debouncedPayslipSearch, setDebouncedPayslipSearch] = useState('');
  const [payslipStatus, setPayslipStatus] = useState('ALL');
  const [payslipDepartment, setPayslipDepartment] = useState('');
  const [payslipPage, setPayslipPage] = useState(1);

  const [structureSearch, setStructureSearch] = useState('');
  const [debouncedStructureSearch, setDebouncedStructureSearch] = useState('');
  const [structureDepartment, setStructureDepartment] = useState('');
  const [structurePage, setStructurePage] = useState(1);

  const [financialYear, setFinancialYear] = useState(getCurrentFinancialYear);
  const [taxStatus, setTaxStatus] = useState('ALL');

  const [selectedPayslipId, setSelectedPayslipId] = useState<string | null>(null);
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null);
  const [isInitiateOpen, setIsInitiateOpen] = useState(false);
  const [isAdjustmentOpen, setIsAdjustmentOpen] = useState(false);
  const [isTaxDeclarationOpen, setIsTaxDeclarationOpen] = useState(false);
  const [statusTarget, setStatusTarget] = useState<{
    run: PayrollRunItem;
    status: UpdatePayrollRunStatusPayload['status'];
  } | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedPayslipSearch(payslipSearch.trim());
      setPayslipPage(1);
    }, 350);
    return () => window.clearTimeout(timer);
  }, [payslipSearch]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedStructureSearch(structureSearch.trim());
      setStructurePage(1);
    }, 350);
    return () => window.clearTimeout(timer);
  }, [structureSearch]);

  const payslipFilters = useMemo<PayrollFilterParams>(() => ({
    page: payslipPage,
    limit: PAGE_SIZE,
    month,
    year,
    scope,
    departmentId: payslipDepartment || undefined,
    status: payslipStatus,
    search: debouncedPayslipSearch || undefined,
  }), [payslipPage, month, year, scope, payslipDepartment, payslipStatus, debouncedPayslipSearch]);

  const structureFilters = useMemo<SalaryStructureFilterParams>(() => ({
    page: structurePage,
    limit: PAGE_SIZE,
    departmentId: structureDepartment || undefined,
    search: debouncedStructureSearch || undefined,
  }), [structurePage, structureDepartment, debouncedStructureSearch]);

  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
    refetch: refetchStats,
  } = useGetPayrollStatsQuery({ month, year });

  const {
    data: payslipsData,
    isLoading: payslipsLoading,
    isFetching: payslipsFetching,
    error: payslipsError,
    refetch: refetchPayslips,
  } = useGetPayslipsQuery(payslipFilters, {
    skip: activeTab !== 'payslips' && activeTab !== 'overview',
  });

  const {
    data: runs = [],
    isLoading: runsLoading,
    isFetching: runsFetching,
    error: runsError,
    refetch: refetchRuns,
  } = useGetPayrollRunsQuery({ year }, {
    skip: activeTab !== 'runs' && activeTab !== 'overview',
  });

  const {
    data: structuresData,
    isLoading: structuresLoading,
    isFetching: structuresFetching,
    error: structuresError,
    refetch: refetchStructures,
  } = useGetSalaryStructuresQuery(structureFilters, {
    skip: activeTab !== 'structures',
  });

  const {
    data: adjustmentEmployeesData,
    isLoading: adjustmentEmployeesLoading,
  } = useGetSalaryStructuresQuery(
    { page: 1, limit: 100 },
    { skip: !isAdjustmentOpen }
  );

  const {
    data: declarations = [],
    isLoading: declarationsLoading,
    isFetching: declarationsFetching,
    error: declarationsError,
    refetch: refetchDeclarations,
  } = useGetTaxDeclarationsQuery(
    { financialYear, scope, status: taxStatus },
    { skip: activeTab !== 'tax' }
  );

  const { data: departments = [] } = useGetDepartmentsQuery();
  const payslips = payslipsData?.items || [];
  const structures = structuresData?.items || [];
  const currentYear = new Date().getFullYear();
  const runYears = Array.from({ length: currentYear - 2020 + 2 }, (_, index) => currentYear + 1 - index);

  // Active run for Stepper
  const activeRun = useMemo(() => {
    if (selectedRunId) {
      const match = runs.find((r) => r.id === selectedRunId);
      if (match) return match;
    }
    return runs[0] || null;
  }, [runs, selectedRunId]);

  const handleMonthChange = (value: number) => {
    setMonth(value);
    setPayslipPage(1);
  };

  const handleYearChange = (value: number) => {
    setYear(value);
    setPayslipPage(1);
  };

  const handleScopeChange = (value: PayrollScope) => {
    setScope(value);
    setPayslipPage(1);
  };

  const resetPayslipFilters = () => {
    setPayslipSearch('');
    setPayslipStatus('ALL');
    setPayslipDepartment('');
    setScope('MY');
    setMonth(new Date().getMonth() + 1);
    setYear(new Date().getFullYear());
    setPayslipPage(1);
  };

  const renderDetailActions = (module: PayrollTab) => {
    switch (module) {
      case 'overview':
      case 'runs':
        return (
          <Button
            size="sm"
            onClick={() => setIsInitiateOpen(true)}
            leftIcon={<Play className="w-3.5 h-3.5" />}
          >
            Initiate Payroll
          </Button>
        );
      case 'payslips':
        return (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAdjustmentOpen(true)}
              leftIcon={<CirclePlus className="w-3.5 h-3.5" />}
            >
              Add Adjustment
            </Button>
            <Button
              size="sm"
              onClick={() => setIsInitiateOpen(true)}
              leftIcon={<Play className="w-3.5 h-3.5" />}
            >
              Initiate Payroll
            </Button>
          </>
        );
      case 'structures':
      case 'components':
      case 'statutory':
        return (
          <Link to="/settings/payroll">
            <Button variant="outline" size="sm" leftIcon={<Settings2 className="w-3.5 h-3.5" />}>
              Configure Settings
            </Button>
          </Link>
        );
      case 'tax':
        return (
          <Button
            size="sm"
            onClick={() => setIsTaxDeclarationOpen(true)}
            leftIcon={<Send className="w-3.5 h-3.5" />}
          >
            Submit Declaration
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {activeModuleId === null ? (
        /* 1. Hub View: Header, Top 5 KPIs, and Minimal 8-Card Grid */
        <div className="space-y-6">
          <header className="flex flex-wrap items-center justify-end gap-2">
            <Link to="/settings/payroll">
              <Button variant="outline" size="sm" leftIcon={<Settings2 className="w-3.5 h-3.5" />}>
                Payroll Settings
              </Button>
            </Link>
            <Button
              size="sm"
              onClick={() => setIsInitiateOpen(true)}
              leftIcon={<Play className="w-3.5 h-3.5" />}
            >
              Initiate Payroll
            </Button>
          </header>

          {statsError && (
            <ErrorDisplay
              title="Payroll summary unavailable"
              error={statsError}
              onRetry={() => refetchStats()}
              compact
            />
          )}

          <PayrollKpiCards stats={stats} isLoading={statsLoading} />

          <div className="pt-2">
            <DashboardKpiGrid onSelect={handleSelectModule} />
          </div>
        </div>
      ) : (
        /* 2. Detail View: Sticky Header with Back Button + Active Module Content */
        <div className="space-y-6">
          <PayrollDetailHeader
            activeModuleId={activeModuleId}
            onBack={handleBackToHub}
            onSelectModule={handleSelectModule}
            actions={renderDetailActions(activeModuleId)}
          />

          {/* Overview Detail View */}
          {activeModuleId === 'overview' && (
            <PayrollOverviewDetail
              stats={stats}
              activeRun={activeRun}
              onNavigate={handleSelectModule}
              onInitiatePayroll={() => setIsInitiateOpen(true)}
              onRefreshRuns={refetchRuns}
              onRefreshStats={refetchStats}
            />
          )}

      {/* Payroll Runs Tab */}
      {activeTab === 'runs' && (
        <div className="space-y-6">
          {activeRun && (
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                Selected Batch Lifecycle Stepper
              </h3>
              <PayrollApprovalStepper
                run={activeRun}
                onRefresh={() => {
                  refetchRuns();
                  refetchStats();
                }}
                onViewPayslips={() => setActiveTab('payslips')}
              />
            </div>
          )}

          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#171717]">
              <div>
                <p className="text-xs font-semibold text-gray-900 dark:text-white">Payroll batch year</p>
                <p className="text-[11px] text-gray-500 dark:text-zinc-400">
                  Select a run below to review its stage or execute approvals
                </p>
              </div>
              <div className="flex items-center gap-2">
                <select
                  aria-label="Payroll run year"
                  value={year}
                  onChange={(event) => handleYearChange(Number(event.target.value))}
                  className="px-3 py-2 rounded-xl text-xs border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white"
                >
                  {runYears.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => refetchRuns()}
                  disabled={runsFetching}
                  leftIcon={<RefreshCw className={cn('w-3.5 h-3.5', runsFetching && 'animate-spin')} />}
                >
                  Refresh
                </Button>
              </div>
            </div>

            {runsError ? (
              <ErrorDisplay
                title="Unable to load payroll runs"
                error={runsError}
                onRetry={() => refetchRuns()}
              />
            ) : (
              <PayrollRunsTable
                runs={runs}
                isLoading={runsLoading}
                onInitiate={() => setIsInitiateOpen(true)}
                onStatusChange={(run, status) => {
                  setSelectedRunId(run.id);
                  setStatusTarget({ run, status });
                }}
              />
            )}
          </div>
        </div>
      )}

      {/* Payslips Tab */}
      {activeTab === 'payslips' && (
        <div className="space-y-4">
          <PayrollFilterBar
            scope={scope}
            onScopeChange={handleScopeChange}
            month={month}
            onMonthChange={handleMonthChange}
            year={year}
            onYearChange={handleYearChange}
            departmentId={payslipDepartment}
            onDepartmentChange={(value) => {
              setPayslipDepartment(value);
              setPayslipPage(1);
            }}
            departments={departments}
            status={payslipStatus}
            onStatusChange={(value) => {
              setPayslipStatus(value);
              setPayslipPage(1);
            }}
            search={payslipSearch}
            onSearchChange={setPayslipSearch}
            onReset={resetPayslipFilters}
            onRefresh={() => {
              refetchPayslips();
              refetchStats();
            }}
            isRefreshing={payslipsFetching && !payslipsLoading}
          />
          {payslipsError ? (
            <ErrorDisplay
              title="Unable to load payslips"
              error={payslipsError}
              onRetry={() => refetchPayslips()}
            />
          ) : (
            <>
              <PayslipsTable
                payslips={payslips}
                isLoading={payslipsLoading}
                onView={(payslip) => setSelectedPayslipId(payslip.id)}
              />
              <PaginationControls
                page={payslipPage}
                total={payslipsData?.total || 0}
                limit={payslipsData?.limit || PAGE_SIZE}
                isFetching={payslipsFetching}
                onPageChange={setPayslipPage}
                resourceLabel="payslips"
              />
            </>
          )}
        </div>
      )}

      {/* Structures Tab */}
      {activeTab === 'structures' && (
        <div className="space-y-4">
          {structuresError ? (
            <ErrorDisplay
              title="Unable to load salary structures"
              error={structuresError}
              onRetry={() => refetchStructures()}
            />
          ) : (
            <>
              <SalaryStructuresTable
                structures={structures}
                isLoading={structuresLoading}
                departments={departments}
                search={structureSearch}
                onSearchChange={setStructureSearch}
                departmentId={structureDepartment}
                onDepartmentChange={(value) => {
                  setStructureDepartment(value);
                  setStructurePage(1);
                }}
                onRefresh={() => refetchStructures()}
                isRefreshing={structuresFetching && !structuresLoading}
              />
              <PaginationControls
                page={structurePage}
                total={structuresData?.total || 0}
                limit={structuresData?.limit || PAGE_SIZE}
                isFetching={structuresFetching}
                onPageChange={setStructurePage}
                resourceLabel="salary structures"
              />
            </>
          )}
        </div>
      )}

      {/* Components Catalog Tab */}
      {activeTab === 'components' && (
        <PayComponentsCatalog />
      )}

      {/* Statutory Center Tab */}
      {activeTab === 'statutory' && (
        <StatutoryComplianceCenter />
      )}

      {/* EPFO PF & ECR Compliance Tab */}
      {activeTab === 'pf-ecr' && (
        <PfComplianceCenter />
      )}

      {/* Tax Declarations Tab */}
      {activeTab === 'tax' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#171717] flex flex-col xl:flex-row xl:items-end gap-3">
            <div className="space-y-1.5">
              <label htmlFor="tax-financial-year" className="text-xs font-semibold text-gray-900 dark:text-white">
                Financial Year
              </label>
              <input
                id="tax-financial-year"
                value={financialYear}
                onChange={(event) => setFinancialYear(event.target.value)}
                placeholder="YYYY-YY"
                className="w-full xl:w-36 px-3 py-2 rounded-xl text-xs border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="tax-scope" className="text-xs font-semibold text-gray-900 dark:text-white">
                Scope
              </label>
              <select
                id="tax-scope"
                value={scope}
                onChange={(event) => handleScopeChange(event.target.value as PayrollScope)}
                className="w-full xl:w-44 px-3 py-2 rounded-xl text-xs border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white"
              >
                <option value="MY">My Declarations</option>
                <option value="ALL">All Organization</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label htmlFor="tax-status" className="text-xs font-semibold text-gray-900 dark:text-white">
                Verification Status
              </label>
              <select
                id="tax-status"
                value={taxStatus}
                onChange={(event) => setTaxStatus(event.target.value)}
                className="w-full xl:w-44 px-3 py-2 rounded-xl text-xs border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white"
              >
                <option value="ALL">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="VERIFIED">Verified</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
            <div className="flex items-center gap-2 xl:ml-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetchDeclarations()}
                disabled={declarationsFetching}
                leftIcon={<RefreshCw className={cn('w-3.5 h-3.5', declarationsFetching && 'animate-spin')} />}
              >
                Refresh
              </Button>
              <Button
                size="sm"
                onClick={() => setIsTaxDeclarationOpen(true)}
                leftIcon={<Send className="w-3.5 h-3.5" />}
              >
                Submit Declaration
              </Button>
            </div>
          </div>
          {declarationsError ? (
            <ErrorDisplay
              title="Unable to load tax declarations"
              error={declarationsError}
              onRetry={() => refetchDeclarations()}
            />
          ) : (
            <TaxDeclarationsTable
              declarations={declarations}
              isLoading={declarationsLoading}
            />
          )}
        </div>
      )}
        </div>
      )}

      {/* Modals */}
      <PayslipDetailModal
        payslipId={selectedPayslipId}
        onClose={() => setSelectedPayslipId(null)}
      />
      <InitiatePayrollModal
        isOpen={isInitiateOpen}
        onClose={() => setIsInitiateOpen(false)}
        month={month}
        year={year}
        onSuccess={() => setActiveTab('runs')}
      />
      <AddAdjustmentModal
        isOpen={isAdjustmentOpen}
        onClose={() => setIsAdjustmentOpen(false)}
        month={month}
        year={year}
        employees={adjustmentEmployeesData?.items || []}
        employeesLoading={adjustmentEmployeesLoading}
      />
      <PayrollRunStatusModal
        run={statusTarget?.run || null}
        status={statusTarget?.status || 'APPROVED'}
        onClose={() => setStatusTarget(null)}
      />
      <SubmitTaxDeclarationModal
        isOpen={isTaxDeclarationOpen}
        onClose={() => setIsTaxDeclarationOpen(false)}
        financialYear={financialYear}
      />
    </div>
  );
};

export default PayrollHubPage;
