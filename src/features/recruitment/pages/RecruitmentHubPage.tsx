import React, { useEffect, useMemo, useState } from 'react';
import {
  Briefcase,
  RefreshCw,
  Plus,
  Users,
  CalendarPlus,
  LayoutList,
  Workflow,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Video,
  MapPin,
} from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { Badge } from '@/shared/ui/Badge';
import { ErrorDisplay } from '@/shared/ui/ErrorDisplay';
import { SkeletonListItem } from '@/shared/ui/Skeleton';
import { useToast } from '@/shared/ui/Toast';

import { useGetDepartmentsQuery, useGetEmployeesQuery } from '@/features/workforce/api/workforceApi';
import {
  useGetRecruitmentStatsQuery,
  useGetJobOpeningsQuery,
  useGetCandidatesQuery,
  useGetInterviewsQuery,
} from '../api/recruitmentApi';
import type {
  CandidateItem,
  CandidateStage,
  InterviewStatus,
  JobOpening,
  RecruitmentFilterParams,
} from '../types/recruitment.types';

import { RecruitmentKpiCards } from '../components/RecruitmentKpiCards';
import { RecruitmentFilterBar } from '../components/RecruitmentFilterBar';
import { JobOpeningsTable } from '../components/JobOpeningsTable';
import { CandidatePipelineBoard } from '../components/CandidatePipelineBoard';
import { CreateJobModal } from '../components/CreateJobModal';
import { AddCandidateModal } from '../components/AddCandidateModal';
import { ScheduleInterviewModal } from '../components/ScheduleInterviewModal';
import { UpdateCandidateStageModal } from '../components/UpdateCandidateStageModal';
import { UpdateJobStatusModal } from '../components/UpdateJobStatusModal';
import { ViewJobModal } from '../components/ViewJobModal';

const JOBS_PAGE_SIZE = 10;
const CANDIDATES_PAGE_SIZE = 9;

type BadgeVariant = 'brand' | 'success' | 'warning' | 'danger' | 'slate' | 'role';

const INTERVIEW_STATUS_BADGE: Record<InterviewStatus, { variant: BadgeVariant; label: string }> = {
  SCHEDULED: { variant: 'brand', label: 'Scheduled' },
  COMPLETED: { variant: 'success', label: 'Completed' },
  CANCELLED: { variant: 'danger', label: 'Cancelled' },
};

/**
 * RecruitmentHubPage (Super Admin)
 *
 * Hiring command center: job openings, candidate pipeline and interview
 * schedule — all backed by the live recruitment API.
 */
export const RecruitmentHubPage: React.FC = () => {
  const toast = useToast();

  const [activeTab, setActiveTab] = useState<'jobs' | 'candidates' | 'interviews'>('jobs');
  const [isCreateJobOpen, setIsCreateJobOpen] = useState(false);
  const [isAddCandidateOpen, setIsAddCandidateOpen] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [stageTarget, setStageTarget] = useState<CandidateItem | null>(null);
  const [jobStatusTarget, setJobStatusTarget] = useState<JobOpening | null>(null);
  const [jobViewTarget, setJobViewTarget] = useState<JobOpening | null>(null);

  // Shared filter state (RecruitmentFilterBar)
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [jobFilter, setJobFilter] = useState('');
  const [stageFilter, setStageFilter] = useState<CandidateStage | 'ALL'>('ALL');
  const [jobsPage, setJobsPage] = useState(1);
  const [candidatesPage, setCandidatesPage] = useState(1);

  // Interview tab controls
  const [interviewDate, setInterviewDate] = useState('');
  const [interviewStatus, setInterviewStatus] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
      setJobsPage(1);
      setCandidatesPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const jobsParams = useMemo<RecruitmentFilterParams>(() => {
    const params: RecruitmentFilterParams = { page: jobsPage, limit: JOBS_PAGE_SIZE };
    if (departmentFilter) params.departmentId = departmentFilter;
    if (debouncedSearch) params.search = debouncedSearch;
    return params;
  }, [jobsPage, departmentFilter, debouncedSearch]);

  const candidatesParams = useMemo<RecruitmentFilterParams>(() => {
    const params: RecruitmentFilterParams = { page: candidatesPage, limit: CANDIDATES_PAGE_SIZE };
    if (jobFilter) params.jobId = jobFilter;
    if (stageFilter !== 'ALL') params.stage = stageFilter;
    if (debouncedSearch) params.search = debouncedSearch;
    return params;
  }, [candidatesPage, jobFilter, stageFilter, debouncedSearch]);

  const { data: stats, isLoading: statsLoading } = useGetRecruitmentStatsQuery(
    departmentFilter ? { departmentId: departmentFilter } : undefined
  );

  const {
    data: jobsData,
    isLoading: jobsLoading,
    isFetching: jobsFetching,
    isError: jobsError,
    error: jobsErrorDetail,
    refetch: refetchJobs,
  } = useGetJobOpeningsQuery(jobsParams);

  const {
    data: candidatesData,
    isLoading: candidatesLoading,
    isFetching: candidatesFetching,
    isError: candidatesError,
    error: candidatesErrorDetail,
    refetch: refetchCandidates,
  } = useGetCandidatesQuery(candidatesParams);

  const {
    data: interviews = [],
    isLoading: interviewsLoading,
    isError: interviewsError,
    error: interviewsErrorDetail,
    refetch: refetchInterviews,
  } = useGetInterviewsQuery({
    ...(interviewDate ? { date: interviewDate } : {}),
    ...(interviewStatus ? { status: interviewStatus } : {}),
  });

  // Lookup data for dropdowns
  const { data: departments = [] } = useGetDepartmentsQuery();
  const { data: employeesData } = useGetEmployeesQuery({ page: 1, limit: 100 });
  const interviewerPool = employeesData?.items || [];
  const { data: allJobsData } = useGetJobOpeningsQuery({ page: 1, limit: 100 });
  const dropdownJobs = allJobsData?.items || [];

  // Candidate pool for interview scheduling (recent pipeline slice)
  const { data: allCandidatesData } = useGetCandidatesQuery({ page: 1, limit: 100 });
  const pipelineCandidates = allCandidatesData?.items || [];

  const jobs = jobsData?.items || [];
  const jobsTotal = jobsData?.total || 0;
  const jobsTotalPages = Math.max(1, Math.ceil(jobsTotal / JOBS_PAGE_SIZE));

  const candidates = candidatesData?.items || [];
  const candidatesTotal = candidatesData?.total || 0;
  const candidatesTotalPages = Math.max(1, Math.ceil(candidatesTotal / CANDIDATES_PAGE_SIZE));

  const handleResetFilters = () => {
    setSearchQuery('');
    setDepartmentFilter('');
    setJobFilter('');
    setStageFilter('ALL');
    setJobsPage(1);
    setCandidatesPage(1);
  };

  const handleDepartmentChange = (value: string) => {
    setDepartmentFilter(value);
    setJobsPage(1);
  };

  const handleJobChange = (value: string) => {
    setJobFilter(value);
    setCandidatesPage(1);
  };

  const handleStageChange = (value: CandidateStage | 'ALL') => {
    setStageFilter(value);
    setCandidatesPage(1);
  };

  const handleRefresh = () => {
    if (activeTab === 'jobs') refetchJobs();
    else if (activeTab === 'candidates') refetchCandidates();
    else refetchInterviews();
    toast.info('Recruitment data refreshed.', 'Refreshed');
  };

  const isTabRefreshing =
    activeTab === 'jobs' ? jobsFetching : activeTab === 'candidates' ? candidatesFetching : false;

  const tabs = [
    { id: 'jobs' as const, label: 'Job Openings', icon: LayoutList },
    { id: 'candidates' as const, label: 'Candidates Pipeline', icon: Workflow },
    { id: 'interviews' as const, label: 'Interview Schedule', icon: CalendarDays },
  ];

  const stickySelectClass =
    'px-3 py-2 rounded-lg text-sm border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0d0d0d] text-gray-900 dark:text-[#ececec]">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-500/5 dark:bg-blue-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-emerald-500/5 dark:bg-emerald-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-8 max-w-[1500px] mx-auto space-y-6">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-[#ececec] tracking-tight">
                Recruitment Hub
              </h1>
              <p className="text-sm text-gray-500 dark:text-zinc-400">
                Job requisitions, candidate pipeline and interviews — driven by live hiring data.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<RefreshCw className={`w-4 h-4 ${isTabRefreshing ? 'animate-spin' : ''}`} />}
              onClick={handleRefresh}
            >
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Users className="w-4 h-4" />}
              onClick={() => setIsAddCandidateOpen(true)}
            >
              Add Candidate
            </Button>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<CalendarPlus className="w-4 h-4" />}
              onClick={() => setIsScheduleOpen(true)}
            >
              Schedule Interview
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => setIsCreateJobOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25"
            >
              Create Job
            </Button>
          </div>
        </div>

        {/* KPI tiles */}
        <RecruitmentKpiCards stats={stats} isLoading={statsLoading} />

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

        {/* Shared hub filter bar */}
        {activeTab !== 'interviews' && (
          <div className="rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#171717] overflow-hidden shadow-sm">
            <RecruitmentFilterBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              departmentFilter={departmentFilter}
              onDepartmentChange={handleDepartmentChange}
              departments={departments}
              jobFilter={jobFilter}
              onJobChange={handleJobChange}
              jobs={dropdownJobs}
              stageFilter={stageFilter}
              onStageChange={handleStageChange}
              onResetFilters={handleResetFilters}
              onRefresh={handleRefresh}
              isRefreshing={isTabRefreshing}
            />
          </div>
        )}

        {/* Tab content */}
        {activeTab === 'jobs' && (
          <Card className="overflow-hidden border-gray-200 dark:border-zinc-800 shadow-lg shadow-gray-200/50 dark:shadow-none">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-zinc-800">
              <h3 className="text-base font-semibold text-gray-900 dark:text-[#ececec]">Job Openings</h3>
              <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
                {jobsTotal} requisition{jobsTotal === 1 ? '' : 's'} across the organization
              </p>
            </div>

            {jobsError ? (
              <div className="p-6">
                <ErrorDisplay
                  title="Job Openings Unavailable"
                  error={jobsErrorDetail}
                  onRetry={() => refetchJobs()}
                />
              </div>
            ) : (
              <>
                <JobOpeningsTable
                  jobs={jobs}
                  isLoading={jobsLoading}
                  onCreateJob={() => setIsCreateJobOpen(true)}
                  onView={(job) => setJobViewTarget(job)}
                  onChangeStatus={(job) => setJobStatusTarget(job)}
                />
                {jobsTotalPages > 1 && (
                  <PaginationBar
                    page={jobsPage}
                    totalPages={jobsTotalPages}
                    total={jobsTotal}
                    noun="jobs"
                    isFetching={jobsFetching}
                    onPrev={() => setJobsPage((p) => Math.max(1, p - 1))}
                    onNext={() => setJobsPage((p) => Math.min(jobsTotalPages, p + 1))}
                  />
                )}
              </>
            )}
          </Card>
        )}

        {activeTab === 'candidates' && (
          <Card className="overflow-hidden border-gray-200 dark:border-zinc-800 shadow-lg shadow-gray-200/50 dark:shadow-none">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between gap-3 flex-wrap">
              <div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-[#ececec]">
                  Candidates Pipeline
                </h3>
                <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
                  {candidatesTotal} candidate{candidatesTotal === 1 ? '' : 's'} in view
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Users className="w-3.5 h-3.5" />}
                onClick={() => setIsAddCandidateOpen(true)}
              >
                Add Candidate
              </Button>
            </div>

            {candidatesError ? (
              <div className="p-6">
                <ErrorDisplay
                  title="Pipeline Unavailable"
                  error={candidatesErrorDetail}
                  onRetry={() => refetchCandidates()}
                />
              </div>
            ) : (
              <>
                <CandidatePipelineBoard
                  candidates={candidates}
                  isLoading={candidatesLoading}
                  onMoveStage={(candidate) => setStageTarget(candidate)}
                />
                {candidatesTotalPages > 1 && (
                  <PaginationBar
                    page={candidatesPage}
                    totalPages={candidatesTotalPages}
                    total={candidatesTotal}
                    noun="candidates"
                    isFetching={candidatesFetching}
                    onPrev={() => setCandidatesPage((p) => Math.max(1, p - 1))}
                    onNext={() => setCandidatesPage((p) => Math.min(candidatesTotalPages, p + 1))}
                  />
                )}
              </>
            )}
          </Card>
        )}

        {activeTab === 'interviews' && (
          <Card className="overflow-hidden border-gray-200 dark:border-zinc-800 shadow-lg shadow-gray-200/50 dark:shadow-none">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between gap-3 flex-wrap">
              <div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-[#ececec]">
                  Interview Schedule
                </h3>
                <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
                  Upcoming and past conversation rounds
                </p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  aria-label="Filter interviews by date"
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                  className={stickySelectClass}
                />
                <select
                  aria-label="Filter interviews by status"
                  value={interviewStatus}
                  onChange={(e) => setInterviewStatus(e.target.value)}
                  className={stickySelectClass}
                >
                  <option value="">All Statuses</option>
                  <option value="SCHEDULED">Scheduled</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<CalendarPlus className="w-3.5 h-3.5" />}
                  onClick={() => setIsScheduleOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Schedule
                </Button>
              </div>
            </div>

            {interviewsError ? (
              <div className="p-6">
                <ErrorDisplay
                  title="Interview Schedule Unavailable"
                  error={interviewsErrorDetail}
                  onRetry={() => refetchInterviews()}
                />
              </div>
            ) : interviewsLoading ? (
              <div className="p-4 sm:p-6 space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <SkeletonListItem key={i} />
                ))}
              </div>
            ) : interviews.length === 0 ? (
              <div className="py-16 text-center">
                <div className="mx-auto w-14 h-14 rounded-2xl bg-sky-500/10 flex items-center justify-center text-sky-500 mb-4">
                  <CalendarDays className="w-7 h-7" />
                </div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-[#ececec]">
                  No interviews match the current filters
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-zinc-400 max-w-sm mx-auto">
                  Schedule a round from the pipeline or adjust the date and status filters.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-zinc-800/80">
                {interviews.map((interview) => {
                  const statusBadge = INTERVIEW_STATUS_BADGE[interview.status];
                  return (
                    <div
                      key={interview.id}
                      className="px-4 md:px-6 py-4 hover:bg-gray-50/80 dark:hover:bg-zinc-800/40 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-3 flex-wrap">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-semibold text-gray-900 dark:text-[#ececec]">
                              {interview.candidateName}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-zinc-400">
                              • {interview.jobTitle}
                            </span>
                            <Badge variant={statusBadge.variant} size="sm" className="font-semibold text-[10px]">
                              {statusBadge.label}
                            </Badge>
                          </div>
                          <p className="text-[11px] text-gray-500 dark:text-zinc-400 mt-0.5">
                            Round {interview.roundNumber} — {interview.roundName} •{' '}
                            {interview.interviewers.map((i) => i.name).join(', ') || 'Panel TBD'}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <div className="text-right">
                            <p className="text-sm font-semibold text-gray-900 dark:text-[#ececec]">
                              {new Date(interview.interviewDate).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </p>
                            <p className="text-[11px] text-gray-500 dark:text-zinc-400">
                              {interview.startTime} – {interview.endTime}
                            </p>
                          </div>
                          {interview.meetingType === 'ONLINE' ? (
                            <a
                              href={interview.meetingLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Join online meeting"
                              className="p-2 rounded-xl text-sky-600 dark:text-sky-400 bg-sky-500/10 hover:bg-sky-500/20 transition-colors"
                            >
                              <Video className="w-4 h-4" />
                            </a>
                          ) : (
                            <span
                              title="In-person round"
                              className="p-2 rounded-xl text-emerald-600 dark:text-emerald-400 bg-emerald-500/10"
                            >
                              <MapPin className="w-4 h-4" />
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        )}

        <footer className="text-center pt-4">
          <p className="text-gray-400 dark:text-zinc-600 text-sm">
            © 2026 OneForCash. Super Admin Recruitment Control.
          </p>
        </footer>
      </div>

      {/* Modals */}
      <CreateJobModal
        isOpen={isCreateJobOpen}
        onClose={() => setIsCreateJobOpen(false)}
        departments={departments}
        managers={interviewerPool}
      />
      <AddCandidateModal
        isOpen={isAddCandidateOpen}
        onClose={() => setIsAddCandidateOpen(false)}
        jobs={dropdownJobs}
      />
      <ScheduleInterviewModal
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        candidates={pipelineCandidates}
        jobs={dropdownJobs}
        interviewers={interviewerPool}
      />
      <UpdateCandidateStageModal
        isOpen={Boolean(stageTarget)}
        onClose={() => setStageTarget(null)}
        candidate={stageTarget}
      />
      <UpdateJobStatusModal
        isOpen={Boolean(jobStatusTarget)}
        onClose={() => setJobStatusTarget(null)}
        job={jobStatusTarget}
      />
      <ViewJobModal
        isOpen={Boolean(jobViewTarget)}
        onClose={() => setJobViewTarget(null)}
        job={jobViewTarget}
      />
    </div>
  );
};

interface PaginationBarProps {
  page: number;
  totalPages: number;
  total: number;
  noun: string;
  isFetching: boolean;
  onPrev: () => void;
  onNext: () => void;
}

const PaginationBar: React.FC<PaginationBarProps> = ({
  page,
  totalPages,
  total,
  noun,
  isFetching,
  onPrev,
  onNext,
}) => (
  <div className="px-6 py-4 border-t border-gray-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3 bg-gray-50/50 dark:bg-zinc-900/30">
    <p className="text-sm text-gray-500 dark:text-zinc-400">
      Page <span className="font-semibold text-gray-900 dark:text-white">{page}</span> of{' '}
      <span className="font-semibold text-gray-900 dark:text-white">{totalPages}</span> • {total} total {noun}
    </p>
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        leftIcon={<ChevronLeft className="w-4 h-4" />}
        onClick={onPrev}
        disabled={page <= 1 || isFetching}
      >
        Previous
      </Button>
      <Button
        variant="outline"
        size="sm"
        rightIcon={<ChevronRight className="w-4 h-4" />}
        onClick={onNext}
        disabled={page >= totalPages || isFetching}
      >
        Next
      </Button>
    </div>
  </div>
);

export default RecruitmentHubPage;
