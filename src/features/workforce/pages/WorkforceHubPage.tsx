import React, { useEffect, useMemo, useState, useCallback } from 'react';
import {
  Plus,
  LayoutList,
  Network,
  Building2,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { Badge } from '@/shared/ui/Badge';
import { ErrorDisplay } from '@/shared/ui/ErrorDisplay';
import { useToast } from '@/shared/ui/Toast';
import { useAuth } from '@/features/auth/hooks/useAuth';

import {
  useGetWorkforceStatsQuery,
  useGetEmployeesQuery,
  useGetDepartmentsQuery,
} from '../api/workforceApi';
import type {
  EmployeeItem,
  EmploymentType,
  EmployeeStatus,
  WorkforceFilterParams,
} from '../types/workforce.types';

import { WorkforceKpiCards } from '../components/WorkforceKpiCards';
import { WorkforceFilterBar } from '../components/WorkforceFilterBar';
import { EmployeeDirectoryTable } from '../components/EmployeeDirectoryTable';
import { AddEmployeeModal } from '../components/AddEmployeeModal';
import { UpdateStatusModal } from '../components/UpdateStatusModal';
import { EmployeeProfileModal } from '../components/EmployeeProfileModal';
import { OrgChartTree } from '../components/OrgChartTree';
import { DepartmentBreakdownCard } from '../components/DepartmentBreakdownCard';

const PAGE_SIZE = 10;

/**
 * SuperAdminTenantSelector — Helpful UI banner/selector prompting Super Admin
 * to set or switch an Organization/Company context whenever missing or on demand.
 */
interface SuperAdminTenantSelectorProps {
  currentCompanyId: string;
  onSelectCompany: (companyId: string) => void;
  isBannerOnly?: boolean;
}

export const SuperAdminTenantSelector: React.FC<SuperAdminTenantSelectorProps> = ({
  currentCompanyId,
  onSelectCompany,
  isBannerOnly = false,
}) => {
  const [customId, setCustomId] = useState(currentCompanyId || '');
  const [isEditing, setIsEditing] = useState(!currentCompanyId || !isBannerOnly);

  const presets = [
    { label: 'Demo Organization', id: 'org_ofc360_demo' },
    { label: 'Primary Enterprise', id: 'tenant-enterprise-01' },
    { label: 'Default Tenant', id: 'company_default' },
  ];

  const handleApply = (idToApply: string) => {
    const clean = idToApply.trim();
    if (!clean) return;
    onSelectCompany(clean);
    setIsEditing(false);
  };

  return (
    <div className="p-4 sm:p-5 rounded-2xl border border-amber-300 dark:border-amber-700/60 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent backdrop-blur-sm">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-gray-900 dark:text-[#ececec]">
                Super Admin Multi-Tenant Clearance
              </h4>
              <Badge variant="warning" size="sm">Company Context</Badge>
            </div>
            <p className="text-xs text-gray-600 dark:text-zinc-400 mt-0.5">
              Workforce records require tenant isolation (<code className="text-amber-600 dark:text-amber-400 font-mono">company_id</code>).
              {currentCompanyId ? (
                <> Active context: <span className="font-semibold text-gray-900 dark:text-white font-mono">{currentCompanyId}</span></>
              ) : (
                ' Select or enter an organization identifier to access personnel data.'
              )}
            </p>
          </div>
        </div>

        {isEditing ? (
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            <div className="flex items-center gap-1.5 flex-wrap">
              {presets.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setCustomId(p.id);
                    handleApply(p.id);
                  }}
                  className="px-2.5 py-1 text-xs rounded-lg font-medium bg-white dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 border border-gray-200 dark:border-zinc-700 hover:border-amber-500 transition-colors"
                >
                  {p.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Enter company_id..."
                value={customId}
                onChange={(e) => setCustomId(e.target.value)}
                className="px-3 py-1 text-xs rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500 w-44"
              />
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleApply(customId)}
                disabled={!customId.trim()}
                className="bg-amber-600 hover:bg-amber-700 text-white text-xs px-3 py-1"
              >
                Set Context
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="text-xs border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300 self-start lg:self-auto"
          >
            Switch Organization Context
          </Button>
        )}
      </div>
    </div>
  );
};

/**
 * WorkforceHubPage
 *
 * Unified workforce management hub: employee directory, org chart, and
 * department breakdown — all backed by the live workforce API.
 */
export const WorkforceHubPage: React.FC = () => {
  const { user, role, activeRole } = useAuth();
  const effectiveRole = String(activeRole || role || user?.activeRole || 'HR_ADMIN').toUpperCase();
  const isSuperAdmin = effectiveRole === 'SUPER_ADMIN';

  const [activeTab, setActiveTab] = useState<'directory' | 'orgchart' | 'departments'>('directory');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [statusTarget, setStatusTarget] = useState<EmployeeItem | null>(null);
  const [profileTarget, setProfileTarget] = useState<EmployeeItem | null>(null);
  const [editTarget, setEditTarget] = useState<EmployeeItem | null>(null);

  // Tenant / Company Context for Super Admin
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>(() => {
    try {
      return (
        localStorage.getItem('ofc360_selected_company_id') ||
        localStorage.getItem('ofc360_company_id') ||
        localStorage.getItem('selected_company_id') ||
        localStorage.getItem('company_id') ||
        user?.organizationId ||
        ''
      );
    } catch {
      return user?.organizationId || '';
    }
  });

  // Filters (controlled WorkforceFilterBar)
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [employmentTypeFilter, setEmploymentTypeFilter] = useState<EmploymentType | 'ALL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<EmployeeStatus | 'ALL'>('ALL');
  const [locationFilter, setLocationFilter] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const queryParams = useMemo<WorkforceFilterParams>(() => {
    const params: WorkforceFilterParams = { page, limit: PAGE_SIZE };
    if (debouncedSearch) params.search = debouncedSearch;
    if (departmentFilter) params.departmentId = departmentFilter;
    if (employmentTypeFilter !== 'ALL') params.employmentType = employmentTypeFilter;
    if (statusFilter !== 'ALL') params.status = statusFilter;
    if (locationFilter) params.location = locationFilter;
    if (selectedCompanyId) params.company_id = selectedCompanyId;
    return params;
  }, [page, debouncedSearch, departmentFilter, employmentTypeFilter, statusFilter, locationFilter, selectedCompanyId]);

  const {
    data: stats,
    isLoading: statsLoading,
    refetch: refetchStats,
  } = useGetWorkforceStatsQuery();

  const {
    data: employeesData,
    isLoading: employeesLoading,
    isFetching: employeesFetching,
    isError: employeesError,
    error: employeesErrorDetail,
    refetch: refetchEmployees,
  } = useGetEmployeesQuery(queryParams);

  const {
    data: departments = [],
    refetch: refetchDepartments,
  } = useGetDepartmentsQuery();

  const handleSelectCompany = useCallback((companyId: string) => {
    try {
      localStorage.setItem('ofc360_selected_company_id', companyId);
      localStorage.setItem('ofc360_company_id', companyId);
    } catch {}
    setSelectedCompanyId(companyId);
    setPage(1);
    refetchEmployees();
    refetchDepartments();
    refetchStats();
  }, [refetchEmployees, refetchDepartments, refetchStats]);

  const isMissingCompanyError = useMemo(() => {
    if (!employeesError || !employeesErrorDetail) return false;
    const status = (employeesErrorDetail as any)?.status;
    const rawError = JSON.stringify(employeesErrorDetail).toLowerCase();
    return (
      status === 400 ||
      status === 403 ||
      rawError.includes('company') ||
      rawError.includes('tenant')
    );
  }, [employeesError, employeesErrorDetail]);

  const employees = employeesData?.items || [];
  const total = employeesData?.total || 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const locations = useMemo(
    () =>
      Array.from(
        new Set(
          employees
            .map((e) => e.workLocation)
            .filter((loc): loc is string => Boolean(loc))
        )
      ).sort(),
    [employees]
  );

  const handleResetFilters = () => {
    setSearchQuery('');
    setDepartmentFilter('');
    setEmploymentTypeFilter('ALL');
    setStatusFilter('ALL');
    setLocationFilter('');
    setPage(1);
  };

  const handleDepartmentChange = (value: string) => {
    setDepartmentFilter(value);
    setPage(1);
  };

  const handleEmploymentTypeChange = (value: EmploymentType | 'ALL') => {
    setEmploymentTypeFilter(value);
    setPage(1);
  };

  const handleStatusChange = (value: EmployeeStatus | 'ALL') => {
    setStatusFilter(value);
    setPage(1);
  };

  const handleLocationChange = (value: string) => {
    setLocationFilter(value);
    setPage(1);
  };

  const toast = useToast();

  const handleInvite = (emp: EmployeeItem) => {
    toast.success(
      `Invitation sent to ${emp.email || `${emp.firstName} ${emp.lastName}`}`,
      'Invitation Sent'
    );
  };

  const handleResetPassword = (emp: EmployeeItem) => {
    toast.success(
      `Password reset instructions sent to ${emp.email || `${emp.firstName} ${emp.lastName}`}`,
      'Password Reset Initiated'
    );
  };

  const handleEdit = (emp: EmployeeItem) => {
    setEditTarget(emp);
    setIsAddOpen(true);
  };

  const tabs = [
    { id: 'directory' as const, label: 'Employee Directory', icon: LayoutList },
    { id: 'orgchart' as const, label: 'Org Chart', icon: Network },
    { id: 'departments' as const, label: 'Departments', icon: Building2 },
  ];

  return (
    <div className="w-full space-y-6 text-gray-900 dark:text-[#ececec]">
      {/* Super Admin Organization Context Selector */}
      {isSuperAdmin && (
        <SuperAdminTenantSelector
          currentCompanyId={selectedCompanyId}
          onSelectCompany={handleSelectCompany}
          isBannerOnly
        />
      )}

        {/* KPI tiles */}
        <WorkforceKpiCards stats={stats} isLoading={statsLoading} />

        {/* Tabs */}
        <div className="flex items-center gap-1.5 p-1.5 bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 rounded-2xl w-fit max-w-full overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  active
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                    : 'text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        {activeTab === 'directory' && (
          <Card className="overflow-hidden border-gray-200 dark:border-zinc-800 shadow-lg shadow-gray-200/50 dark:shadow-none">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-[#ececec]">
                  Employee Directory
                </h3>
                <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
                  {total} employee{total === 1 ? '' : 's'} in the organization
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="brand" size="sm" className="font-semibold text-[11px]">
                  {total} {total === 1 ? 'Employee' : 'Employees'}
                </Badge>
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<Plus className="w-4 h-4" />}
                  onClick={() => {
                    setEditTarget(null);
                    setIsAddOpen(true);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/25"
                >
                  Add Employee
                </Button>
              </div>
            </div>

            {employeesError ? (
              <div className="p-6">
                {isSuperAdmin && isMissingCompanyError ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-sm font-semibold">
                      <ShieldAlert className="w-5 h-5 shrink-0" />
                      <span>Company Scope Required for Global Super Administrator</span>
                    </div>
                    <SuperAdminTenantSelector
                      currentCompanyId={selectedCompanyId}
                      onSelectCompany={handleSelectCompany}
                    />
                  </div>
                ) : (
                  <ErrorDisplay
                    title="Directory Unavailable"
                    error={employeesErrorDetail}
                    onRetry={() => refetchEmployees()}
                  />
                )}
              </div>
            ) : (
              <>
                <WorkforceFilterBar
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  departmentFilter={departmentFilter}
                  onDepartmentChange={handleDepartmentChange}
                  departments={departments}
                  employmentTypeFilter={employmentTypeFilter}
                  onEmploymentTypeChange={handleEmploymentTypeChange}
                  statusFilter={statusFilter}
                  onStatusChange={handleStatusChange}
                  locationFilter={locationFilter}
                  onLocationChange={handleLocationChange}
                  locations={locations}
                  onResetFilters={handleResetFilters}
                  onRefresh={() => refetchEmployees()}
                  isRefreshing={employeesFetching}
                />

                <EmployeeDirectoryTable
                  employees={employees}
                  isLoading={employeesLoading}
                  onEdit={handleEdit}
                  onStatusChange={(emp) => setStatusTarget(emp)}
                  onView={(emp) => setProfileTarget(emp)}
                  onInvite={handleInvite}
                  onResetPassword={handleResetPassword}
                />

                {totalPages > 1 && (
                  <div className="px-6 py-4 border-t border-gray-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3 bg-gray-50/50 dark:bg-zinc-900/30">
                    <p className="text-sm text-gray-500 dark:text-zinc-400">
                      Page <span className="font-semibold text-gray-900 dark:text-white">{page}</span> of{' '}
                      <span className="font-semibold text-gray-900 dark:text-white">{totalPages}</span> •{' '}
                      {total} total employees
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        leftIcon={<ChevronLeft className="w-4 h-4" />}
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page <= 1 || employeesFetching}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        rightIcon={<ChevronRight className="w-4 h-4" />}
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page >= totalPages || employeesFetching}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </Card>
        )}

        {activeTab === 'orgchart' && (
          <Card className="p-5 sm:p-6 border-gray-200 dark:border-zinc-800 shadow-lg shadow-gray-200/50 dark:shadow-none">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center">
                <Network className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
                  Organizational Chart
                </h2>
                <p className="text-sm text-gray-500 dark:text-zinc-400">
                  Live reporting structure across the whole company
                </p>
              </div>
            </div>
            <OrgChartTree />
          </Card>
        )}

        {activeTab === 'departments' && (
          <DepartmentsPanel
            isSuperAdmin={isSuperAdmin}
            currentCompanyId={selectedCompanyId}
            onSelectCompany={handleSelectCompany}
          />
        )}

      {/* Modals */}
      <AddEmployeeModal
        isOpen={isAddOpen}
        onClose={() => {
          setIsAddOpen(false);
          setEditTarget(null);
        }}
        employee={editTarget}
      />
      <UpdateStatusModal
        isOpen={Boolean(statusTarget)}
        employee={statusTarget}
        onClose={() => setStatusTarget(null)}
      />
      <EmployeeProfileModal
        isOpen={Boolean(profileTarget)}
        employee={profileTarget}
        onClose={() => setProfileTarget(null)}
      />
    </div>
  );
};

/**
 * DepartmentsPanel — live department breakdown with create-department action.
 */
interface DepartmentsPanelProps {
  isSuperAdmin?: boolean;
  currentCompanyId?: string;
  onSelectCompany?: (companyId: string) => void;
}

const DepartmentsPanel: React.FC<DepartmentsPanelProps> = ({
  isSuperAdmin,
  currentCompanyId = '',
  onSelectCompany,
}) => {
  const {
    data: departments = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useGetDepartmentsQuery();

  if (isError) {
    const status = (error as any)?.status;
    const isCompanyErr = status === 400 || status === 403;

    if (isSuperAdmin && isCompanyErr && onSelectCompany) {
      return (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-sm font-semibold">
            <ShieldAlert className="w-5 h-5 shrink-0" />
            <span>Select an Organization to view and manage departments</span>
          </div>
          <SuperAdminTenantSelector
            currentCompanyId={currentCompanyId}
            onSelectCompany={onSelectCompany}
          />
        </div>
      );
    }

    return (
      <ErrorDisplay
        title="Departments Unavailable"
        error={error}
        onRetry={() => refetch()}
      />
    );
  }

  return <DepartmentBreakdownCard departments={departments} isLoading={isLoading} />;
};

export default WorkforceHubPage;
