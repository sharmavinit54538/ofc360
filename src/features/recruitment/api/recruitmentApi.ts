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
        return {
          items: data?.items || data?.jobs || [],
          total: data?.total ?? (data?.items || data?.jobs || []).length,
          page: data?.page ?? 1,
          limit: data?.limit ?? 10,
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
        if (Array.isArray(data)) return data;
        return data?.items || data?.interviews || [];
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
  useScheduleInterviewMutation,
} = recruitmentApi;
