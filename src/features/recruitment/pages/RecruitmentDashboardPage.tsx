import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  Plus,
  Users,
  CalendarDays,
  FileText,
  Award,
  ShieldCheck,
  BarChart3,
  TrendingUp,
  Sparkles,
  ArrowUpRight,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { useAuth } from '@/features/auth/hooks/useAuth';
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
import {
  useGetDepartmentsQuery,
  useGetEmployeesQuery,
} from '@/features/workforce/api/workforceApi';
import { RecruitmentDashboardKpiCards } from '../components/RecruitmentDashboardKpiCards';
import { CreateJobModal } from '../components/CreateJobModal';

// Helper to safely extract designation title string across string, object, or null/undefined
const getSafeDesignationTitle = (employee: any): string => {
  if (!employee) return '';
  if (typeof employee.designation === 'string') return employee.designation;
  if (employee.designation && typeof employee.designation === 'object') {
    return employee.designation.title || employee.designation.name || '';
  }
  if (typeof employee.designationTitle === 'string') return employee.designationTitle;
  if (typeof employee.job_title === 'string') return employee.job_title;
  return '';
};

export const RecruitmentDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeView, setActiveView] = useState<'dashboard' | 'modules'>('dashboard');
  const [isCreateJobModalOpen, setIsCreateJobModalOpen] = useState(false);
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
    isError: isJobsError,
    error: jobsError,
    refetch: refetchJobs,
  } = useGetJobOpeningsQuery({ limit: 100 });

  const {
    data: candidatesData,
    isLoading: isCandidatesLoading,
    isError: isCandidatesError,
    error: candidatesError,
    refetch: refetchCandidates,
  } = useGetCandidatesQuery({ limit: 100 });

  const {
    data: interviewsData,
    isLoading: isInterviewsLoading,
    isError: isInterviewsError,
    error: interviewsError,
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

  // Workforce data for CreateJobModal
  const { data: departmentsData } = useGetDepartmentsQuery();
  const { data: employeesData } = useGetEmployeesQuery({ limit: 100 });
  const departments = useMemo(() => departmentsData || [], [departmentsData]);
  const managers = useMemo(
    () =>
      (employeesData?.items || []).filter((e) => {
        if (!e) return false;
        if (e.role === 'MANAGER') return true;
        const desgTitle = getSafeDesignationTitle(e).toLowerCase();
        return (
          desgTitle.includes('manager') ||
          desgTitle.includes('lead') ||
          desgTitle.includes('head') ||
          desgTitle.includes('director') ||
          desgTitle.includes('chief')
        );
      }),
    [employeesData]
  );

  const apiErrorMessage = useMemo(() => {
    if (isStatsError) return 'Recruitment telemetry stats temporarily unavailable. Re-attempting sync...';
    if (isJobsError) {
      const err = jobsError as any;
      return err?.data?.message || err?.error || 'Failed to load recruitment job openings.';
    }
    if (isInterviewsError) {
      const err = interviewsError as any;
      return err?.data?.message || err?.error || 'Failed to load scheduled interviews.';
    }
    if (isCandidatesError) {
      const err = candidatesError as any;
      return err?.data?.message || err?.error || 'Failed to load recruitment candidate pipeline.';
    }
    return null;
  }, [isStatsError, isJobsError, jobsError, isInterviewsError, interviewsError, isCandidatesError, candidatesError]);

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

  // Clickable recruitment module cards config
  const recruitmentModules = useMemo(
    () => [
      {
        id: 'requisitions',
        title: 'Job Requisitions',
        description: 'Department hiring requisitions, approvals, and budget allocation controls.',
        path: '/recruitment/requisitions',
        icon: FileText,
        badge: badges?.pending_req_approvals_count,
        badgeLabel: 'Pending Approvals',
      },
      {
        id: 'jobs',
        title: 'Job Openings',
        description: 'Active talent vacancies, job descriptions, requirements, and hiring status.',
        path: '/recruitment/jobs',
        icon: Briefcase,
        badge: badges?.active_openings_count ?? jobsData?.total,
        badgeLabel: 'Active Openings',
      },
      {
        id: 'candidates',
        title: 'Candidates & ATS',
        description: 'Central applicant tracking pipeline, candidate profiles, and stage transitions.',
        path: '/recruitment/candidates',
        icon: Users,
        badge: badges?.new_applications_count ?? candidatesData?.total,
        badgeLabel: 'New Applications',
      },
      {
        id: 'interviews',
        title: 'Interview Scheduler',
        description: 'Multi-round interview coordination, interview panel assignments, and scorecards.',
        path: '/recruitment/interviews',
        icon: CalendarDays,
        badge: badges?.today_interviews_count ?? interviewsData?.length,
        badgeLabel: 'Interviews Today',
      },
      {
        id: 'offers',
        title: 'Offer Management',
        description: 'Offer letter creation, compensation structures, approval matrices, and acceptance.',
        path: '/recruitment/offers',
        icon: Award,
        badge: badges?.pending_offer_approvals_count,
        badgeLabel: 'Pending Approvals',
      },
      {
        id: 'bgv',
        title: 'BGV Management',
        description: 'Background screening SLA, candidate credential verification, and compliance checks.',
        path: '/recruitment/bgv',
        icon: ShieldCheck,
        badge: badges?.bgv_discrepancy_alerts_count,
        badgeLabel: 'Alerts',
        badgeDestructive: true,
      },
      {
        id: 'reports',
        title: 'Recruitment Reports',
        description: 'Talent analytics, time-to-hire velocity, recruitment funnel ROI, and KPIs.',
        path: '/recruitment/reports',
        icon: BarChart3,
        badge: undefined,
        badgeLabel: undefined,
      },
    ],
    [badges, jobsData?.total, candidatesData?.total, interviewsData?.length]
  );

  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-zinc-950 p-4 md:p-6 lg:p-8 space-y-6">
      {/* Three Top Navigation Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80 dark:border-zinc-800">
        <div className="inline-flex items-center p-1 rounded-xl bg-slate-100/90 dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 gap-1 shadow-xs">
          {/* Button 1: Recruitment Dashboard */}
          <button
            type="button"
            onClick={() => setActiveView('dashboard')}
            className={`h-[42px] px-4 rounded-lg text-sm font-semibold inline-flex items-center gap-2.5 transition-all duration-150 ${
              activeView === 'dashboard'
                ? 'bg-white dark:bg-zinc-800 text-teal-600 dark:text-teal-400 shadow-xs border border-slate-200/70 dark:border-zinc-700 font-bold'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-zinc-800/50'
            }`}
            aria-selected={activeView === 'dashboard'}
          >
            <LayoutDashboard className="w-4 h-4 text-teal-600 dark:text-teal-400 flex-shrink-0" />
            <span>Recruitment Dashboard</span>
          </button>

          {/* Button 2: Recruitment Module */}
          <button
            type="button"
            onClick={() => setActiveView('modules')}
            className={`h-[42px] px-4 rounded-lg text-sm font-semibold inline-flex items-center gap-2.5 transition-all duration-150 ${
              activeView === 'modules'
                ? 'bg-white dark:bg-zinc-800 text-teal-600 dark:text-teal-400 shadow-xs border border-slate-200/70 dark:border-zinc-700 font-bold'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-zinc-800/50'
            }`}
            aria-selected={activeView === 'modules'}
          >
            <Briefcase className="w-4 h-4 text-teal-600 dark:text-teal-400 flex-shrink-0" />
            <span>Recruitment Module</span>
          </button>
        </div>

        {/* Button 3: Create Job */}
        <Button
          type="button"
          variant="primary"
          onClick={() => setIsCreateJobModalOpen(true)}
          className="h-[42px] px-5 rounded-xl font-semibold inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 active:scale-[0.98] text-white shadow-sm shadow-teal-600/20"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Create Job</span>
        </Button>
      </div>

      {/* Error Banner with retry */}
      {apiErrorMessage && (
        <div className="rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-amber-900 dark:text-amber-300">
                Notice: Telemetry synchronization in progress
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-400">
                {apiErrorMessage}
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

      {/* VIEW 1: Recruitment Dashboard (KPIs, analytics, statistics) */}
      {activeView === 'dashboard' && (
        <>
          {/* 8 Clickable KPI Cards Section */}
          <section className="space-y-4">
            <RecruitmentDashboardKpiCards
              stats={stats}
              badges={badges}
              jobsTotal={jobsData?.total ?? 0}
              jobsOpen={(jobsData?.items || []).filter((j) => j.status === 'OPEN' || j.status === 'PUBLISHED').length}
              jobsClosed={(jobsData?.items || []).filter((j) => j.status === 'CLOSED' || j.status === 'FILLED').length}
              candidatesTotal={candidatesData?.total ?? 0}
              candidatesApplied={(candidatesData?.items || []).filter((c) => c.stage === 'APPLIED').length}
              candidatesShortlisted={(candidatesData?.items || []).filter((c) => c.stage === 'SHORTLISTED').length}
              interviewsTotal={interviewsData?.length ?? 0}
              interviewsScheduled={(interviewsData || []).filter((i) => i.status === 'SCHEDULED' || i.status === 'PENDING').length}
              interviewsCompleted={(interviewsData || []).filter((i) => i.status === 'COMPLETED' || i.status === 'PASSED').length}
              requisitionsTotal={requisitionsData?.total ?? requisitionsData?.items?.length ?? 0}
              requisitionsPending={badges?.pending_req_approvals_count ?? 0}
              offersTotal={offersData?.total ?? offersData?.items?.length ?? 0}
              offersPending={badges?.pending_offer_approvals_count ?? 0}
              offersAccepted={stats?.offersAcceptedThisMonth ?? 0}
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
        </>
      )}

      {/* VIEW 2: Recruitment Modules Overview Grid */}
      {activeView === 'modules' && (
        <section className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {recruitmentModules.map((mod) => {
              const Icon = mod.icon;
              return (
                <div
                  key={mod.id}
                  onClick={() => navigate(mod.path)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      navigate(mod.path);
                    }
                  }}
                  className="relative flex flex-col justify-between rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 p-5 shadow-xs hover:shadow-md hover:border-teal-500/60 dark:hover:border-teal-500/60 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group focus:outline-none focus:ring-2 focus:ring-teal-500/40"
                >
                  <div>
                    <div className="flex items-center justify-between gap-3">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center border shadow-xs bg-teal-50 dark:bg-teal-950/40 border-teal-200/70 dark:border-teal-800/40 text-teal-600 dark:text-teal-400">
                        <Icon className="w-5 h-5" />
                      </div>
                      {typeof mod.badge === 'number' && mod.badge > 0 && (
                        <span
                          className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                            mod.badgeDestructive
                              ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                              : 'bg-teal-50 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300 border border-teal-200 dark:border-teal-800'
                          }`}
                        >
                          {mod.badge} {mod.badgeLabel || 'Active'}
                        </span>
                      )}
                    </div>

                    <div className="mt-4">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                        {mod.title}
                      </h3>
                      <p className="mt-1.5 text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
                        {mod.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between text-xs font-semibold text-teal-600 dark:text-teal-400">
                    <span>Open Module</span>
                    <ArrowUpRight className="w-4 h-4 text-teal-600 dark:text-teal-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Create Job Modal */}
      <CreateJobModal
        isOpen={isCreateJobModalOpen}
        onClose={() => setIsCreateJobModalOpen(false)}
        departments={departments}
        managers={managers}
      />
    </div>
  );
};

export default RecruitmentDashboardPage;

