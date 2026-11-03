/**
 * @file recruitmentApi.ts
 * @description Enterprise RTK Query API service for Recruitment: hiring
 * stats, job openings, candidate pipeline management and interview
 * scheduling. Plugs directly into the OFC360 backend using
 * baseQueryWithReauth.
 */

import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '@/shared/api/baseQuery';
import type {
  RecruitmentStats,
  RecruitmentStatsQueryParams,
  JobOpening,
  JobListResponse,
  CreateJobPayload,
  UpdateJobStatusPayload,
  CandidateItem,
  CandidateListResponse,
  AddCandidatePayload,
  UpdateCandidateStagePayload,
  InterviewSchedule,
  ScheduleInterviewPayload,
  RecruitmentFilterParams,
  InterviewFilterParams,
} from '../types/recruitment.types';

const transformResponse = <T>(response: any): T => {
  if (response && typeof response === 'object' && 'data' in response && response.data !== undefined) {
    return response.data as T;
  }
  return response as T;
};

const normalizeJobItem = (item: any): JobOpening => {
  const deptName =
    typeof item.department === 'object' && item.department !== null
      ? item.department.name || ''
      : typeof item.department === 'string'
      ? item.department
      : item.departmentName || '';
  const deptId =
    typeof item.department === 'object' && item.department !== null
      ? item.department.id || ''
      : item.departmentId || '';
  const minSal = Number(item.minSalary ?? item.min_salary ?? item.salaryRange?.min ?? 0);
  const maxSal = Number(item.maxSalary ?? item.max_salary ?? item.salaryRange?.max ?? 0);
  const curr = String(item.currency || item.salaryRange?.currency || 'INR');
  const rawStatus = String(item.status || 'OPEN').toUpperCase();
  const status = rawStatus === 'PUBLISHED' ? 'OPEN' : (rawStatus as any);

  return {
    id: String(item.id || ''),
    jobCode: String(item.jobCode || item.job_code || item.slug || `JOB-${String(item.id || '').slice(0, 6)}`),
    title: String(item.title || ''),
    department: { id: deptId, name: deptName },
    location: String(item.location || 'Remote'),
    jobType: (item.jobType || item.employment_type || 'FULL_TIME') as any,
    openingsCount: Number(item.openingsCount ?? item.vacancies ?? 1),
    applicantsCount: Number(item.applicantsCount ?? item.application_count ?? item.applicants_count ?? 0),
    experienceRequired: String(
      item.experienceRequired ?? item.experience_required ?? `${item.min_experience || 0}-${item.max_experience || 0} years`
    ),
    salaryRange: { min: minSal, max: maxSal, currency: curr },
    status,
    hiringManager: {
      id: String(item.hiringManagerId || item.hiring_manager?.id || ''),
      name: String(item.hiringManagerName || item.hiring_manager?.name || 'Hiring Manager'),
    },
    targetDate: String(item.targetDate || item.application_deadline || item.targetCloseDate || ''),
  };
};

const normalizeInterviewItem = (item: any): InterviewSchedule => {
  return {
    id: String(item.id || ''),
    candidateId: String(item.candidateId || item.candidate_id || item.application_id || ''),
    candidateName: String(
      item.candidateName ||
      item.candidate_name ||
      (item.candidate ? `${item.candidate.first_name || ''} ${item.candidate.last_name || ''}`.trim() : '') ||
      'Candidate'
    ),
    jobTitle: String(item.jobTitle || item.job_title || item.job?.title || 'Open Position'),
    roundName: String(item.roundName || item.round_name || item.rounds?.[0]?.round_name || 'Interview Round'),
    roundNumber: Number(item.roundNumber ?? item.round_number ?? item.current_round_index ?? 1),
    interviewDate: String(item.interviewDate || item.interview_date || item.rounds?.[0]?.schedules?.[0]?.interview_date || ''),
    startTime: String(item.startTime || item.start_time || item.rounds?.[0]?.schedules?.[0]?.interview_time || ''),
    endTime: String(item.endTime || item.end_time || ''),
    interviewers: Array.isArray(item.interviewers)
      ? item.interviewers
      : Array.isArray(item.interviewerIds)
      ? item.interviewerIds.map((id: string) => ({ id, name: 'Interviewer' }))
      : [],
    meetingType: (item.meetingType || item.meeting_type || item.rounds?.[0]?.schedules?.[0]?.mode || 'ONLINE') as any,
    meetingLink: item.meetingLink || item.meeting_link || item.meeting_url || item.rounds?.[0]?.schedules?.[0]?.meeting_url,
    status: (item.status || 'SCHEDULED') as any,
  };
};

export const recruitmentApi = createApi({
  reducerPath: 'recruitmentApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    'RecruitmentStats',
    'JobsList',
    'JobDetail',
    'CandidatesList',
    'CandidateDetail',
    'InterviewsList',
  ],
  endpoints: (builder) => ({
    /**
     * Aggregate recruitment KPI metrics, optionally scoped to a department.
     */
    getRecruitmentStats: builder.query<RecruitmentStats, RecruitmentStatsQueryParams | void>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params?.departmentId) searchParams.append('departmentId', params.departmentId);
        const queryString = searchParams.toString();
        return `/recruitment/stats${queryString ? `?${queryString}` : ''}`;
      },
      transformResponse: (response: any) => transformResponse<RecruitmentStats>(response),
      providesTags: ['RecruitmentStats'],
    }),

    /**
     * Paginated job openings with status/department/type/search filters.
     */
    getJobOpenings: builder.query<JobListResponse, RecruitmentFilterParams | void>({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters?.search) params.append('search', filters.search);
        if (filters?.departmentId) params.append('departmentId', filters.departmentId);
        if (filters?.status) params.append('status', filters.status);
        if (filters?.page) params.append('page', String(filters.page));
        if (filters?.limit) params.append('limit', String(filters.limit));
        const queryString = params.toString();
        return `/recruitment/jobs${queryString ? `?${queryString}` : ''}`;
      },
      transformResponse: (response: any): JobListResponse => {
        const data = transformResponse<any>(response);
        const rawList = Array.isArray(data)
          ? data
          : Array.isArray(data?.items)
          ? data.items
          : Array.isArray(data?.jobs)
          ? data.jobs
          : [];
        return {
          items: rawList.map(normalizeJobItem),
          total: Number(data?.total ?? rawList.length),
          page: Number(data?.page ?? 1),
          limit: Number(data?.limit ?? (rawList.length || 10)),
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.items.map((job) => ({ type: 'JobsList' as const, id: job.id })),
              { type: 'JobsList', id: 'LIST' },
            ]
          : [{ type: 'JobsList', id: 'LIST' }],
    }),

    /**
     * A single job opening by id.
     */
    getJobById: builder.query<JobOpening, string>({
      query: (id) => `/recruitment/jobs/${id}`,
      transformResponse: (response: any) => transformResponse<JobOpening>(response),
      providesTags: (_result, _error, id) => [{ type: 'JobDetail', id }],
    }),

    /**
     * Publish a new job requisition.
     */
    createJob: builder.mutation<JobOpening, CreateJobPayload>({
      query: (payload) => ({
        url: '/recruitment/jobs',
        method: 'POST',
        body: payload,
      }),
      transformResponse: (response: any) => transformResponse<JobOpening>(response),
      invalidatesTags: ['JobsList', 'RecruitmentStats'],
    }),

    /**
     * Change the lifecycle status of a job opening.
     */
    updateJobStatus: builder.mutation<JobOpening, { id: string; data: UpdateJobStatusPayload }>({
      query: ({ id, data }) => ({
        url: `/recruitment/jobs/${id}/status`,
        method: 'PATCH',
        body: data,
      }),
      transformResponse: (response: any) => transformResponse<JobOpening>(response),
      invalidatesTags: ['JobsList', 'JobDetail', 'RecruitmentStats'],
    }),

    /**
     * Paginated candidate pipeline with job/stage/search filters.
     */
    getCandidates: builder.query<CandidateListResponse, RecruitmentFilterParams | void>({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters?.search) params.append('search', filters.search);
        if (filters?.jobId) params.append('jobId', filters.jobId);
        if (filters?.stage) params.append('stage', filters.stage);
        if (filters?.page) params.append('page', String(filters.page));
        if (filters?.limit) params.append('limit', String(filters.limit));
        const queryString = params.toString();
        return `/recruitment/candidates${queryString ? `?${queryString}` : ''}`;
      },
      transformResponse: (response: any): CandidateListResponse => {
        const data = transformResponse<any>(response);
        return {
          items: data?.items || data?.candidates || [],
          total: data?.total ?? (data?.items || data?.candidates || []).length,
          page: data?.page ?? 1,
          limit: data?.limit ?? 10,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.items.map((c) => ({ type: 'CandidatesList' as const, id: c.id })),
              { type: 'CandidatesList', id: 'LIST' },
            ]
          : [{ type: 'CandidatesList', id: 'LIST' }],
    }),

    /**
     * A single candidate by id.
     */
    getCandidateById: builder.query<CandidateItem, string>({
      query: (id) => `/recruitment/candidates/${id}`,
      transformResponse: (response: any) => transformResponse<CandidateItem>(response),
      providesTags: (_result, _error, id) => [{ type: 'CandidateDetail', id }],
    }),

    /**
     * Add a new candidate to the pipeline.
     */
    addCandidate: builder.mutation<CandidateItem, AddCandidatePayload>({
      query: (payload) => ({
        url: '/recruitment/candidates',
        method: 'POST',
        body: payload,
      }),
      transformResponse: (response: any) => transformResponse<CandidateItem>(response),
      invalidatesTags: ['CandidatesList', 'RecruitmentStats', 'JobsList'],
    }),

    /**
     * Move a candidate between pipeline stages (APPLIED → … → HIRED/REJECTED).
     */
    updateCandidateStage: builder.mutation<
      CandidateItem,
      { id: string; data: UpdateCandidateStagePayload }
    >({
      query: ({ id, data }) => ({
        url: `/recruitment/candidates/${id}/stage`,
        method: 'PATCH',
        body: data,
      }),
      transformResponse: (response: any) => transformResponse<CandidateItem>(response),
      invalidatesTags: ['CandidatesList', 'CandidateDetail', 'RecruitmentStats'],
    }),

    /**
     * Interview schedules, optionally filtered by date and status.
     */
    getInterviews: builder.query<InterviewSchedule[], InterviewFilterParams | void>({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters?.date) params.append('date', filters.date);
        if (filters?.status) params.append('status', filters.status);
        const queryString = params.toString();
        return `/recruitment/interviews${queryString ? `?${queryString}` : ''}`;
      },
      transformResponse: (response: any): InterviewSchedule[] => {
        const data = transformResponse<any>(response);
        const rawList = Array.isArray(data)
          ? data
          : Array.isArray(data?.items)
          ? data.items
          : Array.isArray(data?.interviews)
          ? data.interviews
          : [];
        return rawList.map(normalizeInterviewItem);
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map((i) => ({ type: 'InterviewsList' as const, id: i.id })),
              { type: 'InterviewsList', id: 'LIST' },
            ]
          : [{ type: 'InterviewsList', id: 'LIST' }],
    }),

    /**
     * Complete structured recruitment analytics (funnel, channels, conversion rates, departments).
     */
    getRecruitmentAnalytics: builder.query<any, void>({
      query: () => '/recruitment/analytics',
      transformResponse: (response: any) => transformResponse<any>(response),
      providesTags: ['RecruitmentStats'],
    }),

    /**
     * Recent recruitment activities and notifications feed.
     */
    getRecruitmentNotifications: builder.query<any[], void>({
      query: () => '/recruitment/notifications',
      transformResponse: (response: any) => {
        const data = transformResponse<any>(response);
        if (Array.isArray(data)) return data;
        return data?.items || [];
      },
      providesTags: ['RecruitmentStats'],
    }),

    /**
     * Schedule a new interview round for a candidate.
     */
    scheduleInterview: builder.mutation<InterviewSchedule, ScheduleInterviewPayload>({
      query: (payload) => ({
        url: '/recruitment/interviews',
        method: 'POST',
        body: payload,
      }),
      transformResponse: (response: any) => transformResponse<InterviewSchedule>(response),
      invalidatesTags: ['InterviewsList', 'CandidatesList', 'RecruitmentStats'],
    }),
  }),
});

export const {
  useGetRecruitmentStatsQuery,
  useGetJobOpeningsQuery,
  useGetJobByIdQuery,
  useCreateJobMutation,
  useUpdateJobStatusMutation,
  useGetCandidatesQuery,
  useGetCandidateByIdQuery,
  useAddCandidateMutation,
  useUpdateCandidateStageMutation,
  useGetInterviewsQuery,
  useGetRecruitmentAnalyticsQuery,
  useGetRecruitmentNotificationsQuery,
  useScheduleInterviewMutation,
} = recruitmentApi;
