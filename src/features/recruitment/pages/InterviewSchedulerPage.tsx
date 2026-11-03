/**
 * @file InterviewSchedulerPage.tsx
 * @description Enterprise-grade Interview Scheduler & Evaluation Hub.
 * Wrapped in OFC360 DashboardShell & Sidebar with zero mock data policy,
 * live stage synchronization, multi-round progress tracking, and instant slot booking.
 */

import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  CalendarDays,
  Calendar,
  Clock,
  Video,
  MapPin,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Search,
  Filter,
  Plus,
  RefreshCw,
  Award,
  Layers,
  ChevronRight,
  ExternalLink,
  Users,
  Briefcase,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { DashboardShell } from '@/shared/layout/DashboardShell';
import { DashboardSidebar } from '@/features/dashboard/components/DashboardSidebar';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useToast } from '@/shared/ui/Toast';
import { useInterviewsList } from '../api/interviewSchedulerApi';
import { useApplications } from '../api/atsApi';
import type {
  InterviewDetail,
  InterviewRoundItem,
} from '../types/interviewScheduler.types';
import type { ApplicationItem } from '../types/ats.types';
import { InterviewProgressStepper } from '../components/InterviewProgressStepper';
import { ScheduleInterviewSlotModal } from '../components/ScheduleInterviewSlotModal';
import { RoundEvaluationModal } from '../components/RoundEvaluationModal';
import { InitiateInterviewModal } from '../components/InitiateInterviewModal';

type TabType = 'ALL' | 'SCHEDULED' | 'AWAITING' | 'NEEDS_EVALUATION' | 'COMPLETED';

export const InterviewSchedulerPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { user, role, activeRole } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Filter States
  const [activeTab, setActiveTab] = useState<TabType>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [modeFilter, setModeFilter] = useState<'ALL' | 'ONLINE' | 'OFFLINE'>('ALL');

  // Modals
  const [schedulingInterview, setSchedulingInterview] = useState<{
    interview: InterviewDetail;
    round: InterviewRoundItem;
  } | null>(null);

  const [evaluatingRound, setEvaluatingRound] = useState<{
    interview: InterviewDetail;
    round: InterviewRoundItem;
  } | null>(null);

  const [isInitiateModalOpen, setIsInitiateModalOpen] = useState(false);
  const [selectedCandidateForInitiate, setSelectedCandidateForInitiate] = useState<ApplicationItem | null>(null);

  const currentRole = (activeRole || role || 'HR_ADMIN').toUpperCase();

  // 1. Fetch scheduled interviews from API
  const {
    interviews,
    isLoading: isInterviewsLoading,
    error: interviewsError,
    refetch: refetchInterviews,
  } = useInterviewsList();

  // 2. Fetch live applicant pipeline to detect candidates in INTERVIEW / SHORTLISTED stage
  const {
    data: appsData,
    isLoading: isAppsLoading,
    refetch: refetchApps,
  } = useApplications({ limit: 100 });

  const applications = useMemo(() => appsData?.items || [], [appsData]);

  // Candidates who are shortlisted or in interview stage but haven't been booked yet
  const awaitingCandidates = useMemo(() => {
    const scheduledAppIds = new Set(interviews.map((i) => i.application_id));

    return applications.filter((app) => {
      const isInterviewStage =
        app.status === 'INTERVIEW_SCHEDULED' ||
        app.status === 'SHORTLISTED' ||
        app.status === 'INTERVIEW_COMPLETED';
      return isInterviewStage && !scheduledAppIds.has(app.id);
    });
  }, [applications, interviews]);

  // Options for Initiate modal dropdown
  const availableApplicantOptions = useMemo(() => {
    return applications
      .filter((app) => app.status !== 'REJECTED' && app.status !== 'HIRED')
      .map((app) => ({
        id: app.id,
        first_name: app.first_name,
        last_name: app.last_name,
        job_title: app.applied_job?.title || app.job_title || 'Applicant',
        department: app.department || 'General',
      }));
  }, [applications]);

  // Refresh handler
  const handleRefreshAll = useCallback(async () => {
    await Promise.allSettled([refetchInterviews(), refetchApps()]);
    toast.success('Interview pipeline data refreshed.', 'Updated');
  }, [refetchInterviews, refetchApps, toast]);

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

  // Derived Metrics
  const metrics = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const totalPipeline = interviews.length + awaitingCandidates.length;

    let scheduledToday = 0;
    let upcomingWeek = 0;
    let needsEvaluation = 0;
    let completed = 0;

    interviews.forEach((item) => {
      if (item.interview_date === todayStr) {
        scheduledToday++;
      }
      if (item.status === 'COMPLETED' || item.rounds?.every((r) => r.status === 'PASSED')) {
        completed++;
      }
      const cur = item.rounds?.[item.current_round_index || 0];
      if (cur && cur.status === 'PENDING' && item.interview_date) {
        needsEvaluation++;
      }
      if (item.interview_date && item.interview_date > todayStr) {
        upcomingWeek++;
      }
    });

    return {
      totalPipeline,
      scheduledCount: interviews.length,
      scheduledToday,
      upcomingWeek,
      awaitingCount: awaitingCandidates.length,
      needsEvaluation,
      completed,
    };
  }, [interviews, awaitingCandidates]);

  // Filtered interviews list
  const filteredInterviews = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];

    return interviews.filter((item) => {
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const candMatch = item.candidate_name?.toLowerCase().includes(term);
        const jobMatch = item.job_title?.toLowerCase().includes(term);
        const deptMatch = item.department?.toLowerCase().includes(term);
        if (!candMatch && !jobMatch && !deptMatch) return false;
      }

      if (modeFilter !== 'ALL' && item.mode !== modeFilter) {
        return false;
      }

      if (activeTab === 'AWAITING') {
        return false;
      }
      if (activeTab === 'NEEDS_EVALUATION') {
        const cur = item.rounds?.[item.current_round_index || 0];
        return cur && cur.status !== 'PASSED' && cur.status !== 'REJECTED';
      }
      if (activeTab === 'COMPLETED') {
        return item.status === 'COMPLETED' || item.rounds?.every((r) => r.status === 'PASSED');
      }

      return true;
    });
  }, [interviews, searchTerm, modeFilter, activeTab]);

  // Filtered awaiting candidates list
  const filteredAwaitingCandidates = useMemo(() => {
    if (activeTab === 'SCHEDULED' || activeTab === 'COMPLETED' || activeTab === 'NEEDS_EVALUATION') {
      return [];
    }

    return awaitingCandidates.filter((cand) => {
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const name = `${cand.first_name} ${cand.last_name}`.toLowerCase();
        const job = (cand.applied_job?.title || cand.job_title || '').toLowerCase();
        if (!name.includes(term) && !job.includes(term)) return false;
      }
      return true;
    });
  }, [awaitingCandidates, activeTab, searchTerm]);

  const isLoading = isInterviewsLoading || isAppsLoading;

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
          <Link
            to="/recruitment/candidates"
            className="hover:text-teal-600 dark:hover:text-teal-400 font-medium transition-colors"
          >
            ATS Pipeline
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 dark:text-white font-semibold">
            Interview Scheduler & Evaluation Hub
          </span>
        </nav>

        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center border border-teal-500/20 shadow-xs">
              <CalendarDays className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Interview Scheduler & Evaluation Hub
                </h1>
                <Badge variant="brand" size="sm" className="font-semibold text-[10px]">
                  {metrics.totalPipeline} Total in Pipeline
                </Badge>
              </div>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                Configure rounds, enforce 7-day interview slots, and submit scorecard evaluations.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRefreshAll}
              disabled={isLoading}
              className="gap-2 bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:border-teal-500/50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-teal-600' : ''}`} />
              <span>Refresh</span>
            </Button>

            <Button
              type="button"
              size="sm"
              onClick={() => {
                setSelectedCandidateForInitiate(null);
                setIsInitiateModalOpen(true);
              }}
              className="gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs shadow-sm shadow-teal-600/20"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Schedule New Interview</span>
            </Button>
          </div>
        </div>

        {/* Five Compact KPI Cards Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {/* Card 1: Total Pipeline */}
          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-xs transition-all hover:border-slate-300">
            <p className="text-xs font-semibold text-slate-500 dark:text-zinc-400">Total Interviews</p>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-black text-slate-900 dark:text-white">
                {metrics.totalPipeline}
              </span>
              <span className="p-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400">
                <Layers className="w-4 h-4" />
              </span>
            </div>
          </div>

          {/* Card 2: Scheduled Today */}
          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-xs transition-all hover:border-sky-300">
            <p className="text-xs font-semibold text-sky-600 dark:text-sky-400">Scheduled Today</p>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-black text-sky-700 dark:text-sky-300">
                {metrics.scheduledToday}
              </span>
              <span className="p-1.5 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400">
                <Calendar className="w-4 h-4" />
              </span>
            </div>
          </div>

          {/* Card 3: Upcoming 7 Days */}
          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-xs transition-all hover:border-indigo-300">
            <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">Upcoming (7 Days)</p>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-black text-indigo-700 dark:text-indigo-300">
                {metrics.upcomingWeek}
              </span>
              <span className="p-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
                <Clock className="w-4 h-4" />
              </span>
            </div>
          </div>

          {/* Card 4: Awaiting Slot Booking */}
          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-xs transition-all hover:border-amber-300">
            <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">Awaiting Booking</p>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-black text-amber-700 dark:text-amber-300">
                {metrics.awaitingCount}
              </span>
              <span className="p-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
                <Sparkles className="w-4 h-4" />
              </span>
            </div>
          </div>

          {/* Card 5: Needs Evaluation */}
          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-xs col-span-2 sm:col-span-1 transition-all hover:border-emerald-300">
            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Passed / Completed</p>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-black text-emerald-700 dark:text-emerald-300">
                {metrics.completed}
              </span>
              <span className="p-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
              </span>
            </div>
          </div>
        </div>

        {/* Filter and Tab Toolbar */}
        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-xs space-y-3.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: 'ALL', label: `All (${metrics.totalPipeline})` },
                { id: 'SCHEDULED', label: `Scheduled (${metrics.scheduledCount})` },
                { id: 'AWAITING', label: `Awaiting Booking (${metrics.awaitingCount})` },
                { id: 'NEEDS_EVALUATION', label: `Needs Evaluation (${metrics.needsEvaluation})` },
                { id: 'COMPLETED', label: `Completed (${metrics.completed})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === tab.id
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Mode toggle */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Mode:</span>
              <div className="flex items-center rounded-xl bg-slate-100 dark:bg-zinc-800 p-0.5">
                {(['ALL', 'ONLINE', 'OFFLINE'] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setModeFilter(m)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                      modeFilter === m
                        ? 'bg-white dark:bg-zinc-900 text-teal-700 dark:text-teal-300 shadow-xs'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {m === 'ALL' ? 'All' : m === 'ONLINE' ? 'Online' : 'In-person'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by candidate name, role, interviewer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl text-xs border border-slate-200 dark:border-zinc-700 bg-slate-50/70 dark:bg-zinc-800/60 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        {/* SECTION: Awaiting Slot Booking (Candidates ready to be scheduled) */}
        {filteredAwaitingCandidates.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  Candidates Awaiting Interview Slot ({filteredAwaitingCandidates.length})
                </h2>
              </div>
              <span className="text-xs text-slate-400 font-medium">Shortlisted for interviews</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {filteredAwaitingCandidates.map((cand) => (
                <div
                  key={cand.id}
                  className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-xs hover:border-teal-400 dark:hover:border-teal-600 transition-all space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-700 dark:text-teal-300 font-bold text-sm flex items-center justify-center">
                        {cand.first_name?.[0] || 'C'}
                        {cand.last_name?.[0] || ''}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                          {cand.first_name} {cand.last_name}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-zinc-400">
                          {cand.applied_job?.title || cand.job_title || 'Applicant'}
                        </p>
                      </div>
                    </div>

                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                      {cand.status === 'SHORTLISTED' ? 'Shortlisted' : 'Interview Stage'}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-500 dark:text-zinc-400 flex items-center justify-between pt-2 border-t border-slate-100 dark:border-zinc-800">
                    <span className="truncate max-w-[180px]">{cand.email}</span>
                    <span className="text-slate-400">{cand.department || 'Engineering'}</span>
                  </div>

                  <Button
                    type="button"
                    size="sm"
                    onClick={() => {
                      setSelectedCandidateForInitiate(cand);
                      setIsInitiateModalOpen(true);
                    }}
                    className="w-full text-xs bg-teal-600 hover:bg-teal-700 text-white font-semibold flex items-center justify-center gap-1.5"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    Configure Rounds & Book Slot
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION: Scheduled Interviews Stream */}
        <div className="space-y-4">
          {activeTab !== 'AWAITING' && filteredInterviews.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Active Interview Pipelines ({filteredInterviews.length})
              </h2>
            </div>
          )}

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 animate-pulse space-y-4"
                >
                  <div className="h-5 bg-slate-200 dark:bg-zinc-800 rounded w-1/4" />
                  <div className="h-24 bg-slate-100 dark:bg-zinc-800/60 rounded-2xl" />
                </div>
              ))}
            </div>
          ) : filteredInterviews.length > 0 ? (
            filteredInterviews.map((interview) => (
              <InterviewProgressStepper
                key={interview.id}
                interview={interview}
                onScheduleSlot={(round) =>
                  setSchedulingInterview({
                    interview,
                    round,
                  })
                }
                onEvaluateRound={(round) =>
                  setEvaluatingRound({
                    interview,
                    round,
                  })
                }
              />
            ))
          ) : filteredAwaitingCandidates.length === 0 ? (
            <div className="p-12 rounded-3xl bg-white dark:bg-zinc-900 border border-dashed border-slate-300 dark:border-zinc-800 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 mx-auto flex items-center justify-center">
                <CalendarDays className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                No active interviews found
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-sm mx-auto">
                {searchTerm || activeTab !== 'ALL' || modeFilter !== 'ALL'
                  ? 'No interviews match your filter criteria. Try resetting filters.'
                  : 'Get started by scheduling an interview for any candidate in your ATS pipeline.'}
              </p>

              <div className="pt-2">
                <Button
                  type="button"
                  size="sm"
                  onClick={() => {
                    setSelectedCandidateForInitiate(null);
                    setIsInitiateModalOpen(true);
                  }}
                  className="text-xs bg-teal-600 hover:bg-teal-700 text-white font-semibold inline-flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Schedule Candidate for Interview
                </Button>
              </div>
            </div>
          ) : null}
        </div>

        {/* Schedule Slot Modal */}
        {schedulingInterview && (
          <ScheduleInterviewSlotModal
            isOpen={Boolean(schedulingInterview)}
            onClose={() => setSchedulingInterview(null)}
            interviewId={schedulingInterview.interview.id}
            roundName={schedulingInterview.round.round_name}
            candidateName={schedulingInterview.interview.candidate_name || undefined}
            jobTitle={schedulingInterview.interview.job_title || undefined}
            onSuccess={() => {
              handleRefreshAll();
            }}
          />
        )}

        {/* Round Evaluation Scorecard Modal */}
        {evaluatingRound && (
          <RoundEvaluationModal
            isOpen={Boolean(evaluatingRound)}
            onClose={() => setEvaluatingRound(null)}
            roundId={evaluatingRound.round.id}
            roundName={evaluatingRound.round.round_name}
            candidateName={evaluatingRound.interview.candidate_name || undefined}
            jobTitle={evaluatingRound.interview.job_title || undefined}
            onSuccess={() => {
              handleRefreshAll();
            }}
          />
        )}

        {/* Initiate Interview Rounds Modal */}
        {isInitiateModalOpen && (
          <InitiateInterviewModal
            isOpen={isInitiateModalOpen}
            onClose={() => {
              setIsInitiateModalOpen(false);
              setSelectedCandidateForInitiate(null);
            }}
            applicationId={selectedCandidateForInitiate?.id}
            candidateName={
              selectedCandidateForInitiate
                ? `${selectedCandidateForInitiate.first_name} ${selectedCandidateForInitiate.last_name}`
                : undefined
            }
            jobTitle={
              selectedCandidateForInitiate?.applied_job?.title ||
              selectedCandidateForInitiate?.job_title
            }
            availableApplications={availableApplicantOptions}
            onSuccess={() => {
              handleRefreshAll();
            }}
          />
        )}
      </div>
    </DashboardShell>
  );
};

export default InterviewSchedulerPage;
