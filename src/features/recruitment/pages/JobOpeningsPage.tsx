/**
 * @file JobOpeningsPage.tsx
 * @description Enterprise Job Openings Management Page.
 * Connects directly to verified backend /api/v1/jobs and /api/v1/recruitment/jobs endpoints.
 * Features live KPI counters, multi-status filters, role-guarded creation, details viewer,
 * and status transitions.
 */

import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Briefcase,
  Plus,
  ChevronRight,
  Search,
  Building2,
  Users,
  Eye,
  Workflow,
  Sparkles,
  FileCheck2,
  Archive,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import { DashboardShell } from '@/shared/layout/DashboardShell';
import { DashboardSidebar } from '@/features/dashboard/components/DashboardSidebar';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import { useAuth } from '@/features/auth/hooks/useAuth';
import {
  useGetJobOpeningsQuery,
  useGetRecruitmentStatsQuery,
} from '../api/recruitmentApi';
import {
  useGetDepartmentsQuery,
  useGetEmployeesQuery,
} from '@/features/workforce/api/workforceApi';
import type { JobOpening, JobOpeningStatus } from '../types/recruitment.types';
import { CreateJobModal } from '../components/CreateJobModal';
import { ViewJobModal } from '../components/ViewJobModal';
import { UpdateJobStatusModal } from '../components/UpdateJobStatusModal';

type StatusTab = 'ALL' | 'PUBLISHED' | 'DRAFT' | 'CLOSED';

export const JobOpeningsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, role, activeRole } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Filter States
  const [activeTab, setActiveTab] = useState<StatusTab>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('');

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [viewingJob, setViewingJob] = useState<JobOpening | null>(null);
  const [statusJob, setStatusJob] = useState<JobOpening | null>(null);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed((prev) => !prev);
  }, []);

  const effectiveRole = (activeRole || role || 'HR_ADMIN').toUpperCase();
  const canCreateJob =
    effectiveRole === 'SUPER_ADMIN' ||
    effectiveRole === 'HR_ADMIN' ||
    effectiveRole === 'IT_ADMIN';

  // Fetch Jobs from backend API
  const queryParams = useMemo(() => {
    const params: { status?: JobOpeningStatus; search?: string; departmentId?: string; limit: number } = {
      limit: 100,
    };
    if (activeTab !== 'ALL') {
      params.status = activeTab;
    }
    if (searchQuery.trim()) {
      params.search = searchQuery.trim();
    }
    if (selectedDept) {
      params.departmentId = selectedDept;
    }
    return params;
  }, [activeTab, searchQuery, selectedDept]);

  const {
    data: jobsData,
    isLoading: isJobsLoading,
    isError: isJobsError,
    error: jobsError,
    refetch: refetchJobs,
  } = useGetJobOpeningsQuery(queryParams);

  const { data: statsData } = useGetRecruitmentStatsQuery();
  const { data: departmentsData } = useGetDepartmentsQuery();
  const { data: employeesData } = useGetEmployeesQuery({ limit: 100 });

  const departments = useMemo(() => departmentsData || [], [departmentsData]);
  const managers = useMemo(
    () => (employeesData?.items || []).filter((e) => e && (e.role === 'MANAGER' || e.role === 'HR_ADMIN')),
    [employeesData]
  );

  const allJobs = useMemo(() => jobsData?.items || [], [jobsData]);

  // Calculated metrics
  const totalJobsCount = jobsData?.total ?? allJobs.length;
  const publishedCount = useMemo(
    () => allJobs.filter((j) => j.status === 'PUBLISHED').length,
    [allJobs]
  );
  const draftCount = useMemo(
    () => allJobs.filter((j) => j.status === 'DRAFT').length,
    [allJobs]
  );
  const closedCount = useMemo(
    () => allJobs.filter((j) => j.status === 'CLOSED').length,
    [allJobs]
  );
  const totalVacancies = useMemo(
    () => allJobs.reduce((acc, j) => acc + (j.vacancies || 1), 0),
    [allJobs]
  );

  const handleTabChange = useCallback(
    (tabId: string) => {
      if (effectiveRole === 'SUPER_ADMIN') {
        navigate(`/dashboard/super-admin#${tabId}`);
      } else if (effectiveRole === 'MANAGER') {
        navigate(`/dashboard/manager#${tabId}`);
      } else {
        navigate(`/dashboard/hr-admin#${tabId}`);
      }
    },
    [navigate, effectiveRole]
  );

  const formatSalary = (min?: number | null, max?: number | null, currency = 'INR') => {
    if (!min && !max) return 'Negotiable';
    const fmt = (v: number) =>
      v >= 100000 ? `₹${(v / 100000).toFixed(1).replace(/\.0$/, '')}L` : `₹${Math.round(v / 1000)}K`;
    if (min && max) return `${fmt(min)} - ${fmt(max)}`;
    if (min) return `${fmt(min)}+`;
    return `Up to ${fmt(max!)}`;
  };

  const getStatusBadge = (status: JobOpeningStatus) => {
    switch (status) {
      case 'PUBLISHED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Published
          </span>
        );
      case 'DRAFT':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700">
            Draft
          </span>
        );
      case 'CLOSED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
            Closed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            {status}
          </span>
        );
    }
  };

  return (
    <DashboardShell
      sidebar={
        <DashboardSidebar
          activeTab="recruitment"
          onTabChange={handleTabChange}
          collapsed={sidebarCollapsed}
          onToggleCollapse={toggleSidebar}
        />
      }
      sidebarCollapsed={sidebarCollapsed}
      onSidebarToggle={toggleSidebar}
      fullWidth
    >
      <div className="w-full space-y-6">
        {/* Header with Breadcrumbs & Action Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-zinc-800">
          <div>
            <nav className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-zinc-400 mb-1">
              <Link
                to="/recruitment/dashboard"
                className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
              >
                Recruitment
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-semibold text-slate-800 dark:text-zinc-200">
                Job Openings
              </span>
            </nav>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200/70 dark:border-teal-800/40 flex items-center justify-center text-teal-600 dark:text-teal-400">
                <Briefcase className="w-4 h-4" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Job Openings & Talent Postings
                </h1>
                <p className="text-xs text-slate-500 dark:text-zinc-400">
                  Manage live job openings, candidate sourcing channels, applications, and vacancy fulfillment.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => refetchJobs()}
              className="h-10 px-3 rounded-xl text-xs font-semibold"
              title="Refresh Job Openings"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline ml-1.5">Refresh</span>
            </Button>

            {canCreateJob && (
              <Button
                type="button"
                variant="primary"
                onClick={() => setIsCreateModalOpen(true)}
                className="h-10 px-4 rounded-xl font-semibold inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 active:scale-[0.98] text-white shadow-sm shadow-teal-600/20 shrink-0"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Create Job</span>
              </Button>
            )}
          </div>
        </div>

        {/* KPI Counter Cards Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                Total Positions
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                {totalJobsCount}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                {totalVacancies} total vacancies
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                Published & Active
              </p>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                {publishedCount || statsData?.openPositions || 0}
              </p>
              <p className="text-[11px] text-emerald-600/80 dark:text-emerald-400/80 mt-0.5">
                Live on career portals
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <FileCheck2 className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                Draft Postings
              </p>
              <p className="text-2xl font-bold text-slate-700 dark:text-zinc-300 mt-1">
                {draftCount}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                Pending publishing
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                Closed / Filled
              </p>
              <p className="text-2xl font-bold text-slate-700 dark:text-zinc-300 mt-1">
                {closedCount}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                Archived postings
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <Archive className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-zinc-900 p-3 rounded-2xl border border-slate-200/80 dark:border-zinc-800 shadow-xs">
          {/* Status Tabs */}
          <div className="inline-flex items-center p-1 rounded-xl bg-slate-100/80 dark:bg-zinc-800/80 border border-slate-200/70 dark:border-zinc-700 gap-1 overflow-x-auto">
            {(['ALL', 'PUBLISHED', 'DRAFT', 'CLOSED'] as StatusTab[]).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
                  activeTab === tab
                    ? 'bg-white dark:bg-zinc-900 text-teal-700 dark:text-teal-300 shadow-xs'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tab === 'ALL' ? 'All Postings' : tab.charAt(0) + tab.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          {/* Search & Department Selector */}
          <div className="flex items-center gap-2.5 flex-1 sm:justify-end">
            <div className="relative min-w-[200px] flex-1 sm:flex-initial">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search jobs by title or location..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950/60 text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/40"
              />
            </div>

            {departments.length > 0 && (
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                aria-label="Filter by department"
                className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950/60 text-slate-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-teal-500/40"
              >
                <option value="">All Departments</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Error Notice */}
        {isJobsError && (
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <p className="text-xs font-medium text-rose-800 dark:text-rose-300">
                {String((jobsError as any)?.data?.message || 'Failed to load job postings from backend.')}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => refetchJobs()} className="text-xs">
              Retry
            </Button>
          </div>
        )}

        {/* Jobs Data Table */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/80 dark:border-zinc-800 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 dark:bg-zinc-950/40 border-b border-slate-200/80 dark:border-zinc-800 text-[11px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Role & Title</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Vacancies / Applicants</th>
                  <th className="py-3 px-4">Salary Budget</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/80">
                {isJobsLoading ? (
                  Array.from({ length: 6 }).map((_, idx) => (
                    <tr key={`skel-${idx}`} className="animate-pulse">
                      <td className="py-3.5 px-4">
                        <div className="h-4 w-44 bg-slate-200 dark:bg-zinc-800 rounded-md" />
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="h-4 w-24 bg-slate-200 dark:bg-zinc-800 rounded-md" />
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="h-4 w-20 bg-slate-200 dark:bg-zinc-800 rounded-md" />
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="h-4 w-16 bg-slate-200 dark:bg-zinc-800 rounded-md" />
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="h-4 w-16 bg-slate-200 dark:bg-zinc-800 rounded-md" />
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="h-4 w-20 bg-slate-200 dark:bg-zinc-800 rounded-md" />
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="h-5 w-20 bg-slate-200 dark:bg-zinc-800 rounded-full" />
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="h-7 w-20 bg-slate-200 dark:bg-zinc-800 rounded-lg ml-auto" />
                      </td>
                    </tr>
                  ))
                ) : allJobs.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center">
                      <div className="max-w-sm mx-auto flex flex-col items-center justify-center text-center">
                        <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-3">
                          <Briefcase className="w-6 h-6" />
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                          No job postings found
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                          {activeTab !== 'ALL'
                            ? `There are currently no job openings with "${activeTab}" status.`
                            : 'No job openings have been created yet.'}
                        </p>
                        {canCreateJob && (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => setIsCreateModalOpen(true)}
                            className="mt-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold"
                          >
                            + Create First Job
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  allJobs.map((job) => (
                    <tr
                      key={job.id}
                      onClick={() => setViewingJob(job)}
                      className="hover:bg-slate-50/70 dark:hover:bg-zinc-800/40 cursor-pointer transition-colors"
                    >
                      <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                        <div>
                          <span>{job.title}</span>
                          {job.slug && (
                            <p className="text-[10px] font-mono text-slate-400 dark:text-zinc-500 truncate max-w-[200px]">
                              /{job.slug}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-zinc-300">
                        {typeof job.department === 'string'
                          ? job.department
                          : (job.department as any)?.name || 'General'}
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-zinc-300">
                        {job.location || 'Remote'}
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-[11px] font-semibold text-slate-700 dark:text-zinc-300 bg-slate-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md">
                          {job.jobType ? job.jobType.replace('_', ' ') : 'Full Time'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {job.vacancies}
                        </span>{' '}
                        <span className="text-[11px] text-slate-500">open</span>
                        <span className="text-slate-400 mx-1">•</span>
                        <span className="text-[11px] text-slate-600 dark:text-zinc-400">
                          {job.applicantCount ?? 0} applied
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-medium text-slate-700 dark:text-zinc-300">
                        {formatSalary(job.salaryRange?.min, job.salaryRange?.max, job.salaryRange?.currency)}
                      </td>
                      <td className="py-3 px-4">{getStatusBadge(job.status)}</td>
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setViewingJob(job);
                            }}
                            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
                            title="View Job Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {canCreateJob && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setStatusJob(job);
                              }}
                              className="px-2 py-1 rounded-md text-[11px] font-semibold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/50 hover:bg-teal-100 transition-colors inline-flex items-center gap-1"
                              title="Update Status"
                            >
                              <Workflow className="w-3 h-3" />
                              <span>Status</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modals */}
        <CreateJobModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          departments={departments}
          managers={managers}
        />

        <ViewJobModal
          isOpen={Boolean(viewingJob)}
          onClose={() => setViewingJob(null)}
          job={viewingJob}
        />

        <UpdateJobStatusModal
          isOpen={Boolean(statusJob)}
          onClose={() => setStatusJob(null)}
          job={statusJob}
        />
      </div>
    </DashboardShell>
  );
};

export default JobOpeningsPage;
