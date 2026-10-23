import React, { useEffect, useMemo, useState } from 'react';
import {
  Plus,
  LayoutList,
  Network,
  Building2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { ErrorDisplay } from '@/shared/ui/ErrorDisplay';

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
 * WorkforceHubPage (Super Admin)
 *
 * Unified workforce management hub: employee directory, org chart, and
 * department breakdown — all backed by the live workforce API.
 */
export const WorkforceHubPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'directory' | 'orgchart' | 'departments'>('directory');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [statusTarget, setStatusTarget] = useState<EmployeeItem | null>(null);
  const [profileTarget, setProfileTarget] = useState<EmployeeItem | null>(null);
  const [editTarget, setEditTarget] = useState<EmployeeItem | null>(null);

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
    return params;
  }, [page, debouncedSearch, departmentFilter, employmentTypeFilter, statusFilter, locationFilter]);

  const {
    data: stats,
    isLoading: statsLoading,
  } = useGetWorkforceStatsQuery();

  const {
    data: employeesData,
    isLoading: employeesLoading,
    isFetching: employeesFetching,
    isError: employeesError,
    error: employeesErrorDetail,
    refetch: refetchEmployees,
  } = useGetEmployeesQuery(queryParams);

  const { data: departments = [] } = useGetDepartmentsQuery();

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
    <div className="min-h-screen bg-gray-50 dark:bg-[#0d0d0d] text-gray-900 dark:text-[#ececec]">
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-8 max-w-[1500px] mx-auto space-y-6">
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
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Plus className="w-4 h-4" />}
                onClick={() => {
                  setEditTarget(null);
                  setIsAddOpen(true);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25"
              >
                Add Employee
              </Button>
            </div>

            {employeesError ? (
              <div className="p-6">
                <ErrorDisplay
                  title="Directory Unavailable"
                  error={employeesErrorDetail}
                  onRetry={() => refetchEmployees()}
                />
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

                <div className="p-4 sm:p-6">
                  <EmployeeDirectoryTable
                    employees={employees}
                    isLoading={employeesLoading}
                    onEdit={handleEdit}
                    onStatusChange={(emp) => setStatusTarget(emp)}
                    onView={(emp) => setProfileTarget(emp)}
                  />
                </div>

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

        {activeTab === 'departments' && <DepartmentsPanel />}

        <footer className="text-center pt-4">
          <p className="text-gray-400 dark:text-zinc-600 text-sm">
            © 2026 OneForCash. Super Admin Workforce Control.
          </p>
        </footer>
      </div>

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
const DepartmentsPanel: React.FC = () => {
  const {
    data: departments = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useGetDepartmentsQuery();

  if (isError) {
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
