/**
 * @file CandidatePipelinePage.tsx
 * @description Enterprise Candidate & ATS Pipeline Management Page.
 * Conforms directly to verified backend contracts:
 * - /api/v1/candidates (Master Talent Pool)
 * - /api/v1/applications (Candidate Job Applications)
 * - /api/v1/recruitment/resume/upload (AI Resume Screening)
 * Features dual Kanban & Table view modes, live stage progression, AI screening, and CSV export.
 */

import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Users,
  Plus,
  Sparkles,
  Download,
  Filter,
  Search,
  LayoutGrid,
  List,
  ChevronRight,
  Briefcase,
  CheckCircle2,
  Clock,
  Award,
  Layers,
  Archive,
} from 'lucide-react';
import { DashboardShell } from '@/shared/layout/DashboardShell';
import { DashboardSidebar } from '@/features/dashboard/components/DashboardSidebar';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useToast } from '@/shared/ui/Toast';
import { useApplications, candidatesClient } from '../api/candidatesApi';
import { useGetJobOpeningsQuery } from '../api/recruitmentApi';
import type { ApplicationItem, ApplicationWorkflowStage } from '../types/candidate.types';
import { CandidateKanbanBoard } from '../components/CandidateKanbanBoard';
import { CandidatesTableView } from '../components/CandidatesTableView';
import { CandidateDetailsDrawer } from '../components/CandidateDetailsDrawer';
import { AddCandidateModal } from '../components/AddCandidateModal';
import { UploadResumeModal } from '../components/UploadResumeModal';

type ViewMode = 'KANBAN' | 'TABLE';

export const CandidatePipelinePage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { role, activeRole } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // View & Filter States
  const [viewMode, setViewMode] = useState<ViewMode>('KANBAN');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJobId, setSelectedJobId] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isTalentPoolOnly, setIsTalentPoolOnly] = useState(false);

  // Modals & Drawers
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<ApplicationItem | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Fetch verified Job Openings for dropdown filters
  const { data: jobsData } = useGetJobOpeningsQuery({ limit: 100 });
  const jobsList = useMemo(() => jobsData?.items || [], [jobsData]);

  // Fetch real candidate applications
  const appQueryParams = useMemo(() => {
    return {
      job_id: selectedJobId || undefined,
      status: statusFilter || undefined,
      search: searchQuery.trim() || undefined,
      limit: 100,
    };
  }, [selectedJobId, statusFilter, searchQuery]);

  const { data: appsData, isLoading: isAppsLoading, refetch: refetchApps } = useApplications(appQueryParams);
  const applications = useMemo(() => appsData?.items || [], [appsData]);

  // Derive KPI Metrics
  const kpiStats = useMemo(() => {
    const total = applications.length;
    const active = applications.filter((a) => a.status === 'APPLIED' || a.status === 'UNDER_REVIEW').length;
    const shortlisted = applications.filter((a) => a.status === 'SHORTLISTED').length;
    const interviews = applications.filter(
      (a) => a.status === 'INTERVIEW_SCHEDULED' || a.status === 'INTERVIEW_COMPLETED'
    ).length;
    const selectedOrHired = applications.filter(
      (a) => a.status === 'SELECTED' || a.status === 'OFFER_SENT' || a.status === 'OFFER_ACCEPTED'
    ).length;
    const rejected = applications.filter((a) => a.status === 'REJECTED').length;

    return { total, active, shortlisted, interviews, selectedOrHired, rejected };
  }, [applications]);

  // Stage Advancement Handler
  const handleAdvanceStage = useCallback(
    async (app: ApplicationItem, nextStage: ApplicationWorkflowStage) => {
      try {
        await candidatesClient.updateApplicationStage(app.id, nextStage);
        toast.success(
          `${app.first_name || 'Candidate'} transitioned to ${nextStage.replace(/_/g, ' ')}.`,
          'Stage Updated'
        );
      } catch (err: any) {
        toast.error(err?.message || 'Failed to advance candidate stage.', 'Update Error');
      }
    },
    [toast]
  );

  // Quick Action Handlers
  const handleShortlist = useCallback(
    async (app: ApplicationItem) => {
      try {
        await candidatesClient.shortlistApplication(app.id);
        toast.success(`${app.first_name || 'Candidate'} shortlisted.`, 'Candidate Shortlisted');
      } catch (err: any) {
        toast.error(err?.message || 'Failed to shortlist candidate.', 'Error');
      }
    },
    [toast]
  );

  const handleReject = useCallback(
    async (app: ApplicationItem) => {
      try {
        await candidatesClient.rejectApplication(app.id);
        toast.success(`${app.first_name || 'Candidate'} marked as rejected.`, 'Candidate Rejected');
      } catch (err: any) {
        toast.error(err?.message || 'Failed to reject candidate.', 'Error');
      }
    },
    [toast]
  );

  const handleHold = useCallback(
    async (app: ApplicationItem) => {
      try {
        await candidatesClient.holdApplication(app.id);
        toast.success(`${app.first_name || 'Candidate'} placed on hold.`, 'Status Updated');
      } catch (err: any) {
        toast.error(err?.message || 'Failed to put candidate on hold.', 'Error');
      }
    },
    [toast]
  );

  // CSV Export Handler
  const handleExportCsv = useCallback(async () => {
    try {
      toast.info('Generating candidate export file...', 'Exporting CSV');
      const blob = await candidatesClient.exportCandidatesCsv();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `OFC360_Candidates_Export_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Candidates CSV downloaded successfully.', 'Export Complete');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to export candidates.', 'Export Error');
    }
  }, [toast]);

  // Sidebar Role Routing
  const effectiveRole = (activeRole || role || 'HR_ADMIN').toUpperCase();
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
          <span className="text-slate-900 dark:text-white font-semibold">Candidates & ATS</span>
        </nav>

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center border border-teal-500/20 shadow-xs">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                Candidates & Applicant Tracking
              </h1>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                Manage talent pipelines, review AI screening scorecards, and transition candidates across hiring stages.
              </p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* View Mode Toggle */}
            <div className="inline-flex items-center p-1 rounded-xl bg-slate-100 dark:bg-zinc-800 border border-slate-200/80 dark:border-zinc-700">
              <button
                type="button"
                onClick={() => setViewMode('KANBAN')}
                className={`p-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-colors ${
                  viewMode === 'KANBAN'
                    ? 'bg-white dark:bg-zinc-700 text-teal-600 dark:text-teal-400 shadow-xs'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900'
                }`}
                title="Kanban Pipeline View"
              >
                <LayoutGrid className="w-4 h-4" />
                <span className="hidden sm:inline">Pipeline</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('TABLE')}
                className={`p-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-colors ${
                  viewMode === 'TABLE'
                    ? 'bg-white dark:bg-zinc-700 text-teal-600 dark:text-teal-400 shadow-xs'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900'
                }`}
                title="Table View"
              >
                <List className="w-4 h-4" />
                <span className="hidden sm:inline">Table</span>
              </button>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCsv}
              className="gap-2 bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:border-teal-500/50"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export CSV</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsUploadModalOpen(true)}
              className="gap-2 bg-teal-50 dark:bg-teal-950/40 border-teal-200/70 dark:border-teal-800/50 text-teal-700 dark:text-teal-300 hover:bg-teal-100"
            >
              <Sparkles className="w-4 h-4 text-teal-600" />
              <span>AI Resume Screen</span>
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsAddModalOpen(true)}
              className="gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add Candidate</span>
            </Button>
          </div>
        </div>

        {/* KPI Counter Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          <div className="p-3.5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400">Total Applicants</span>
            <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">{kpiStats.total}</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-xs">
            <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">Active Pipeline</span>
            <p className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-1">{kpiStats.active}</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-xs">
            <span className="text-[11px] font-semibold text-teal-600 dark:text-teal-400">Shortlisted</span>
            <p className="text-xl font-bold text-teal-600 dark:text-teal-400 mt-1">{kpiStats.shortlisted}</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-xs">
            <span className="text-[11px] font-semibold text-purple-600 dark:text-purple-400">In Interview</span>
            <p className="text-xl font-bold text-purple-600 dark:text-purple-400 mt-1">{kpiStats.interviews}</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-xs">
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">Selected / Hired</span>
            <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{kpiStats.selectedOrHired}</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-xs">
            <span className="text-[11px] font-semibold text-rose-600 dark:text-rose-400">Rejected</span>
            <p className="text-xl font-bold text-rose-600 dark:text-rose-400 mt-1">{kpiStats.rejected}</p>
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
              placeholder="Search candidate, role, or email..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Job Filter Selector */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 w-full md:w-60"
            >
              <option value="">All Job Openings ({jobsList.length})</option>
              {jobsList.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Main Content: Kanban Board or Table View */}
        {viewMode === 'KANBAN' ? (
          <CandidateKanbanBoard
            applications={applications}
            isLoading={isAppsLoading}
            onSelectApplication={(app) => {
              setSelectedApp(app);
              setIsDetailsOpen(true);
            }}
            onAdvanceStage={handleAdvanceStage}
            onRejectApplication={handleReject}
          />
        ) : (
          <CandidatesTableView
            applications={applications}
            isLoading={isAppsLoading}
            onViewDetails={(app) => {
              setSelectedApp(app);
              setIsDetailsOpen(true);
            }}
            onShortlist={handleShortlist}
            onReject={handleReject}
            onAdvanceStage={handleAdvanceStage}
          />
        )}

        {/* Candidate Details Slide-Over Drawer */}
        <CandidateDetailsDrawer
          isOpen={isDetailsOpen}
          onClose={() => {
            setIsDetailsOpen(false);
            setSelectedApp(null);
          }}
          application={selectedApp}
          onAdvanceStage={handleAdvanceStage}
          onShortlist={handleShortlist}
          onReject={handleReject}
          onHold={handleHold}
        />

        {/* Add Candidate Modal */}
        <AddCandidateModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          jobs={jobsList}
          onSuccess={() => refetchApps()}
        />

        {/* AI Resume Upload & Screening Modal */}
        <UploadResumeModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          jobs={jobsList}
          onUploadSuccess={() => refetchApps()}
        />
      </div>
    </DashboardShell>
  );
};

export default CandidatePipelinePage;
