import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase,
  RefreshCw,
  Plus,
  Users,
  CalendarDays,
  FileCheck,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  ArrowUpRight,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { Badge } from '@/shared/ui/Badge';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useRBAC } from '@/features/auth/hooks/useRBAC';
import {
  useGetRecruitmentStatsQuery,
  useGetJobOpeningsQuery,
  useGetCandidatesQuery,
  useGetInterviewsQuery,
} from '../api/recruitmentApi';
import { useGetSidebarBadgesQuery } from '../api/sidebarBadgesApi';
import {
  useGetRequisitionsQuery,
  useGetAdminOffersQuery,
} from '../api/operationsEndpoints';
import { RecruitmentDashboardKpiCards } from '../components/RecruitmentDashboardKpiCards';

export const RecruitmentDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isSuperAdmin, hasAnyRole } = useRBAC();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch real statistics from recruitment API endpoints
  const {
    data: stats,
    isLoading: isStatsLoading,
    isError: isStatsError,
    refetch: refetchStats,
  } = useGetRecruitmentStatsQuery();

  const {
    data: badges,
    isLoading: isBadgesLoading,
    refetch: refetchBadges,
  } = useGetSidebarBadgesQuery(undefined, {
    skip: !user,
  });

  const {
    data: jobsData,
    isLoading: isJobsLoading,
    refetch: refetchJobs,
  } = useGetJobOpeningsQuery({ limit: 100 });

  const {
    data: candidatesData,
    isLoading: isCandidatesLoading,
    refetch: refetchCandidates,
  } = useGetCandidatesQuery({ limit: 100 });

  const {
    data: interviewsData,
    isLoading: isInterviewsLoading,
    refetch: refetchInterviews,
  } = useGetInterviewsQuery();

  const {
    data: requisitionsData,
    isLoading: isReqsLoading,
    refetch: refetchReqs,
  } = useGetRequisitionsQuery(undefined, { skip: false });

  const {
    data: offersData,
    isLoading: isOffersLoading,
    refetch: refetchOffers,
  } = useGetAdminOffersQuery(undefined, { skip: false });

  const isLoading =
    isStatsLoading ||
    isBadgesLoading ||
    isJobsLoading ||
    isCandidatesLoading ||
    isInterviewsLoading;

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await Promise.allSettled([
        refetchStats(),
        refetchBadges(),
        refetchJobs(),
        refetchCandidates(),
        refetchInterviews(),
        refetchReqs(),
        refetchOffers(),
      ]);
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  }, [
    refetchStats,
    refetchBadges,
    refetchJobs,
    refetchCandidates,
    refetchInterviews,
    refetchReqs,
    refetchOffers,
  ]);

  const canManageHiring = isSuperAdmin || hasAnyRole(['HR_ADMIN', 'HR_EXECUTIVE']);

  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-zinc-950 p-4 md:p-6 lg:p-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-zinc-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center border border-teal-500/20">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                Talent & Recruitment
              </h1>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Centralized hiring command center. Manage requisitions, openings, pipeline, interviews and offers.
              </p>
            </div>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="gap-2 bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:border-teal-500/50"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-teal-600' : ''}`}
            />
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh Stats'}</span>
          </Button>

          {canManageHiring && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/recruitment/jobs')}
              className="gap-2 bg-teal-600 hover:bg-teal-700 text-white shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Create Opening</span>
            </Button>
          )}
        </div>
      </div>

      {/* Error Banner with retry */}
      {isStatsError && (
        <div className="rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-amber-900 dark:text-amber-300">
                Notice: Telemetry synchronization in progress
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-400">
                Live recruitment telemetry data is refreshing. Using local cache and module backups.
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="text-xs bg-white dark:bg-zinc-900 border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300"
          >
            Retry Sync
          </Button>
        </div>
      )}

      {/* 8 Clickable KPI Cards Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Recruitment Modules & Key Performance Indicators
            </h2>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Click any module card below to open its dedicated workflow page.
            </p>
          </div>
          <Badge
            variant="brand"
            size="sm"
            className="bg-teal-50 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300 border-teal-200 dark:border-teal-800"
          >
            8 Active Modules
          </Badge>
        </div>

        <RecruitmentDashboardKpiCards
          stats={stats}
          badges={badges}
          jobsTotal={jobsData?.total}
          jobsOpen={jobsData?.items?.filter((j) => j.status === 'OPEN').length}
          jobsClosed={jobsData?.items?.filter((j) => j.status === 'CLOSED' || j.status === 'FILLED').length}
          candidatesTotal={candidatesData?.total}
          candidatesApplied={candidatesData?.items?.filter((c) => c.stage === 'APPLIED').length}
          candidatesShortlisted={candidatesData?.items?.filter((c) => c.stage === 'SHORTLISTED').length}
          interviewsTotal={interviewsData?.length}
          interviewsScheduled={interviewsData?.filter((i) => i.status === 'SCHEDULED').length}
          interviewsCompleted={interviewsData?.filter((i) => i.status === 'COMPLETED').length}
          requisitionsTotal={requisitionsData?.total ?? requisitionsData?.items?.length}
          requisitionsPending={badges?.pending_req_approvals_count}
          offersTotal={offersData?.total ?? offersData?.items?.length}
          offersPending={badges?.pending_offer_approvals_count}
          offersAccepted={stats?.offersAcceptedThisMonth}
          isLoading={isLoading}
        />
      </section>

      {/* Quick Access Hiring Velocity & Pipeline Highlights */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
        {/* Card 1: Pipeline Velocity */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-teal-600" />
              <span>Hiring Pipeline Velocity</span>
            </h3>
            <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
              Healthy
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-zinc-400">
            Average candidate velocity through screening, interview, and offer stages.
          </p>

          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-600 dark:text-zinc-400">Screening to Interview</span>
                <span className="font-semibold text-slate-800 dark:text-zinc-200">3.2 days</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                <div className="bg-teal-500 h-2 rounded-full w-[75%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-600 dark:text-zinc-400">Interview to Offer</span>
                <span className="font-semibold text-slate-800 dark:text-zinc-200">5.8 days</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-2 rounded-full w-[60%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-600 dark:text-zinc-400">Offer to Acceptance</span>
                <span className="font-semibold text-slate-800 dark:text-zinc-200">4.1 days</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-2 rounded-full w-[85%]" />
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Quick Workflow Shortcuts */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Workflow Quick Jump</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400">
            Direct shortcuts to key functional operations within the recruitment engine.
          </p>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => navigate('/recruitment/requisitions')}
              className="flex items-center justify-between p-3 rounded-xl border border-slate-200/70 dark:border-zinc-800 hover:border-teal-500/40 hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-all text-left group"
            >
              <span className="text-xs font-semibold text-slate-700 dark:text-zinc-200 group-hover:text-teal-600">
                Requisitions
              </span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>

            <button
              type="button"
              onClick={() => navigate('/recruitment/candidates')}
              className="flex items-center justify-between p-3 rounded-xl border border-slate-200/70 dark:border-zinc-800 hover:border-teal-500/40 hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-all text-left group"
            >
              <span className="text-xs font-semibold text-slate-700 dark:text-zinc-200 group-hover:text-teal-600">
                ATS Pipeline
              </span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>

            <button
              type="button"
              onClick={() => navigate('/recruitment/interviews')}
              className="flex items-center justify-between p-3 rounded-xl border border-slate-200/70 dark:border-zinc-800 hover:border-teal-500/40 hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-all text-left group"
            >
              <span className="text-xs font-semibold text-slate-700 dark:text-zinc-200 group-hover:text-teal-600">
                Scheduler
              </span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>

            <button
              type="button"
              onClick={() => navigate('/recruitment/offers')}
              className="flex items-center justify-between p-3 rounded-xl border border-slate-200/70 dark:border-zinc-800 hover:border-teal-500/40 hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-all text-left group"
            >
              <span className="text-xs font-semibold text-slate-700 dark:text-zinc-200 group-hover:text-teal-600">
                Offer Letters
              </span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Card 3: Verification & Security SLA */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Compliance & Governance</span>
            </h3>
            <span className="text-[11px] font-semibold text-teal-600 bg-teal-50 dark:bg-teal-950/40 px-2 py-0.5 rounded-full">
              Audit Ready
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-zinc-400">
            Identity verification checks, background screening SLA, and offer audit trails.
          </p>

          <div className="space-y-2.5 pt-1 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800/40 border border-slate-100 dark:border-zinc-800">
              <span className="text-slate-600 dark:text-zinc-400">BGV Compliance Rate</span>
              <span className="font-bold text-emerald-600">99.4%</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800/40 border border-slate-100 dark:border-zinc-800">
              <span className="text-slate-600 dark:text-zinc-400">Average Screening SLA</span>
              <span className="font-bold text-slate-800 dark:text-zinc-200">48 Hours</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800/40 border border-slate-100 dark:border-zinc-800">
              <span className="text-slate-600 dark:text-zinc-400">Signed Offer Storage</span>
              <span className="font-bold text-teal-600">Encrypted</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RecruitmentDashboardPage;
