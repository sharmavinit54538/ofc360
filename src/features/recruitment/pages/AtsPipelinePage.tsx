/**
 * @file AtsPipelinePage.tsx
 * @description Enterprise ATS Candidate Pipeline Management Page.
 * Connects directly to verified backend /api/v1/applications endpoints with live stages,
 * job opening filters, text search, MoveStageModal, and zero mock data.
 */

import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Users,
  Search,
  Filter,
  ChevronRight,
  Briefcase,
  Workflow,
  Sparkles,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import { DashboardShell } from '@/shared/layout/DashboardShell';
import { DashboardSidebar } from '@/features/dashboard/components/DashboardSidebar';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useToast } from '@/shared/ui/Toast';
import { useApplications, useQuickAction } from '../api/atsApi';
import { useGetJobOpeningsQuery } from '../api/recruitmentApi';
import type { ApplicationItem, ApplicationStage } from '../types/ats.types';
import { AtsKanbanBoard } from '../components/AtsKanbanBoard';
import { MoveStageModal } from '../components/MoveStageModal';

export const AtsPipelinePage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { role, activeRole } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJobId, setSelectedJobId] = useState('');

  // Modal State
  const [selectedAppForMove, setSelectedAppForMove] = useState<ApplicationItem | null>(null);
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);

  // RBAC checks
  const currentRole = (activeRole || role || 'EMPLOYEE').toUpperCase();
  const canManageStages = ['SUPER_ADMIN', 'HR_ADMIN', 'HR_EXECUTIVE'].includes(currentRole);

  // Fetch verified Job Openings for dropdown filter
  const { data: jobsData } = useGetJobOpeningsQuery({ limit: 100 });
  const jobList = useMemo(() => jobsData?.items || [], [jobsData]);

  // Fetch live applications
  const queryParams = useMemo(() => {
    return {
      job_id: selectedJobId || undefined,
      search: searchQuery.trim() || undefined,
      limit: 100,
    };
  }, [selectedJobId, searchQuery]);

  const { data: appsData, isLoading, error, refetch } = useApplications(queryParams);
  const applications = useMemo(() => appsData?.items || [], [appsData]);

  // Quick Action Mutations
  const { shortlist, reject, isPending: isActionPending } = useQuickAction();

  const handleQuickShortlist = useCallback(
    async (app: ApplicationItem) => {
      try {
        await shortlist(app.id);
        const name = `${app.first_name || ''} ${app.last_name || ''}`.trim() || 'Candidate';
        toast.success(`${name} shortlisted.`, 'Status Updated');
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to shortlist candidate.';
        toast.error(msg, 'Quick Action Failed');
      }
    },
    [shortlist, toast]
  );

  const handleQuickReject = useCallback(
    async (app: ApplicationItem) => {
      try {
        await reject(app.id);
        const name = `${app.first_name || ''} ${app.last_name || ''}`.trim() || 'Candidate';
        toast.success(`${name} rejected.`, 'Status Updated');
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to reject candidate.';
        toast.error(msg, 'Quick Action Failed');
      }
    },
    [reject, toast]
  );

  // Sidebar role-based navigation
  const handleTabChange = useCallback(
    (tabId: string) => {
      if (currentRole === 'SUPER_ADMIN') {
        navigate(`/dashboard/super-admin#${tabId}`);
      } else if (currentRole === 'MANAGER') {
        navigate(`/dashboard/manager#${tabId}`);
      } else {
        navigate(`/dashboard/hr-admin#${tabId}`);
      }
    },
    [navigate, currentRole]
  );

  return (
    <DashboardShell
      sidebar={
        <DashboardSidebar
          activeTab="recruitment"
          onTabChange={handleTabChange}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed((p) => !p)}
        />
      }
      sidebarCollapsed={sidebarCollapsed}
      onSidebarToggle={() => setSidebarCollapsed((p) => !p)}
      fullWidth
    >
      <div className="w-full space-y-6">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-zinc-400">
          <Link
            to="/recruitment/dashboard"
            className="hover:text-teal-600 dark:hover:text-teal-400 font-medium transition-colors"
          >
            Recruitment Dashboard
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 dark:text-white font-semibold">ATS Pipeline</span>
        </nav>

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center border border-teal-500/20 shadow-xs">
              <Workflow className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Application Tracking System (ATS) Pipeline
                </h1>
                <Badge variant="brand" size="sm" className="font-semibold text-[10px]">
                  {applications.length} Active Applicants
                </Badge>
              </div>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                Visual candidate progression workflow across screening, interview rounds, offers, and hiring milestones.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isLoading}
              className="gap-2 bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:border-teal-500/50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-teal-600' : ''}`} />
              <span>Refresh Pipeline</span>
            </Button>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-3 shadow-xs">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search applicant name, email..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Job Filter Selector */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 w-full md:w-64"
            >
              <option value="">All Job Openings ({jobList.length})</option>
              {jobList.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <p className="text-xs font-medium text-rose-800 dark:text-rose-300">
                {error.message || 'Failed to load applications from server.'}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => refetch()} className="text-xs">
              Retry
            </Button>
          </div>
        )}

        {/* Kanban Board */}
        <AtsKanbanBoard
          applications={applications}
          isLoading={isLoading}
          canManageStages={canManageStages}
          onOpenMoveModal={(app) => {
            setSelectedAppForMove(app);
            setIsMoveModalOpen(true);
          }}
          onQuickShortlist={handleQuickShortlist}
          onQuickReject={handleQuickReject}
        />

        {/* Move Stage Modal */}
        <MoveStageModal
          isOpen={isMoveModalOpen}
          onClose={() => {
            setIsMoveModalOpen(false);
            setSelectedAppForMove(null);
          }}
          application={selectedAppForMove}
          onSuccess={() => refetch()}
        />
      </div>
    </DashboardShell>
  );
};

export default AtsPipelinePage;
