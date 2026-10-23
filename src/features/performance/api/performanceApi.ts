/**
 * @file performanceApi.ts
 * @description Enterprise RTK Query API service for Performance Management:
 * KPI stats, review cycles, appraisal reviews, goals/OKRs, and 360-degree
 * peer feedback. Plugs directly into OFC360 backend using baseQueryWithReauth.
 */

import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '@/shared/api/baseQuery';
import type {
  PerformanceStats,
  PerformanceStatsQueryParams,
  ReviewCycle,
  AppraisalReview,
  AppraisalReviewListResponse,
  ReviewDetail,
  SubmitReviewPayload,
  PerformanceFilterParams,
  GoalItem,
  CreateGoalPayload,
  UpdateGoalProgressPayload,
  GoalQueryParams,
  PeerFeedbackItem,
  SubmitPeerFeedbackPayload,
} from '../types/performance.types';

const transformResponse = <T>(response: any): T => {
  if (response && typeof response === 'object' && 'data' in response && response.data !== undefined) {
    return response.data as T;
  }
  return response as T;
};

export const performanceApi = createApi({
  reducerPath: 'performanceApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    'PerformanceStats',
    'PerformanceReviews',
    'ReviewCycles',
    'PerformanceGoals',
    'PeerFeedback',
  ],
  endpoints: (builder) => ({
    /**
     * Retrieve aggregate performance KPI metrics, optionally scoped to a
     * review cycle or department.
     */
    getPerformanceStats: builder.query<PerformanceStats, PerformanceStatsQueryParams | void>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params?.cycleId) searchParams.append('cycleId', params.cycleId);
        if (params?.departmentId) searchParams.append('departmentId', params.departmentId);
        const queryString = searchParams.toString();
        return `/performance/stats${queryString ? `?${queryString}` : ''}`;
      },
      transformResponse: (response: any) => transformResponse<PerformanceStats>(response),
      providesTags: ['PerformanceStats'],
    }),

    /**
     * Retrieve all configured appraisal review cycles.
     */
    getReviewCycles: builder.query<ReviewCycle[], void>({
      query: () => '/performance/cycles',
      transformResponse: (response: any) => {
        const data = transformResponse<any>(response);
        return Array.isArray(data) ? data : data?.items || data?.cycles || [];
      },
      providesTags: ['ReviewCycles'],
    }),

    /**
     * Retrieve paginated appraisal reviews with cycle, status, scope, and
     * search filters.
     */
    getAppraisalReviews: builder.query<AppraisalReviewListResponse, PerformanceFilterParams | void>({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters?.search) params.append('search', filters.search);
        if (filters?.cycleId) params.append('cycleId', filters.cycleId);
        if (filters?.status && filters.status !== 'ALL') params.append('status', filters.status);
        if (filters?.scope) params.append('scope', filters.scope);
        if (filters?.page) params.append('page', String(filters.page));
        if (filters?.limit) params.append('limit', String(filters.limit));

        const queryString = params.toString();
        return `/performance/reviews${queryString ? `?${queryString}` : ''}`;
      },
      transformResponse: (response: any): AppraisalReviewListResponse => {
        const data = transformResponse<any>(response);
        if (Array.isArray(data)) {
          return { items: data, total: data.length, page: 1, limit: data.length };
        }
        return {
          items: data?.items || data?.reviews || [],
          total: data?.total || data?.count || (data?.items ? data.items.length : 0),
          page: data?.page || 1,
          limit: data?.limit || 20,
        };
      },
      providesTags: (result) =>
        result?.items
          ? [
              ...result.items.map(({ id }) => ({ type: 'PerformanceReviews' as const, id })),
              { type: 'PerformanceReviews', id: 'LIST' },
            ]
          : [{ type: 'PerformanceReviews', id: 'LIST' }],
    }),

    /**
     * Retrieve the full competency-level detail of one appraisal review.
     */
    getReviewById: builder.query<ReviewDetail, string>({
      query: (id) => `/performance/reviews/${encodeURIComponent(id)}`,
      transformResponse: (response: any) => transformResponse<ReviewDetail>(response),
      providesTags: (_result, _error, id) => [{ type: 'PerformanceReviews', id }],
    }),

    /**
     * Submit a self / manager / HR review for one appraisal assignment.
     */
    submitReview: builder.mutation<AppraisalReview, { id: string; data: SubmitReviewPayload }>({
      query: ({ id, data }) => ({
        url: `/performance/reviews/${encodeURIComponent(id)}/submit`,
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: any) => transformResponse<AppraisalReview>(response),
      invalidatesTags: ['PerformanceReviews', 'PerformanceStats'],
    }),

    /**
     * Retrieve goals / OKRs with scope, status, and category filters.
     */
    getGoals: builder.query<GoalItem[], GoalQueryParams | void>({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters?.scope) params.append('scope', filters.scope);
        if (filters?.status && filters.status !== 'ALL') params.append('status', filters.status);
        if (filters?.category && filters.category !== 'ALL') params.append('category', filters.category);
        const queryString = params.toString();
        return `/performance/goals${queryString ? `?${queryString}` : ''}`;
      },
      transformResponse: (response: any) => {
        const data = transformResponse<any>(response);
        return Array.isArray(data) ? data : data?.items || data?.goals || [];
      },
      providesTags: ['PerformanceGoals'],
    }),

    /**
     * Create a new goal / OKR objective.
     */
    createGoal: builder.mutation<GoalItem, CreateGoalPayload>({
      query: (payload) => ({
        url: '/performance/goals',
        method: 'POST',
        body: payload,
      }),
      transformResponse: (response: any) => transformResponse<GoalItem>(response),
      invalidatesTags: ['PerformanceGoals', 'PerformanceStats'],
    }),

    /**
     * Update the current progress value of a goal.
     */
    updateGoalProgress: builder.mutation<GoalItem, UpdateGoalProgressPayload>({
      query: ({ id, ...body }) => ({
        url: `/performance/goals/${encodeURIComponent(id)}/progress`,
        method: 'PATCH',
        body,
      }),
      transformResponse: (response: any) => transformResponse<GoalItem>(response),
      invalidatesTags: ['PerformanceGoals', 'PerformanceStats'],
    }),

    /**
     * Retrieve 360-degree peer feedback submissions.
     */
    getPeerFeedback: builder.query<PeerFeedbackItem[], void>({
      query: () => '/performance/feedback',
      transformResponse: (response: any) => {
        const data = transformResponse<any>(response);
        return Array.isArray(data) ? data : data?.items || data?.feedback || [];
      },
      providesTags: ['PeerFeedback'],
    }),

    /**
     * Submit a 360-degree peer feedback entry.
     */
    submitPeerFeedback: builder.mutation<PeerFeedbackItem, SubmitPeerFeedbackPayload>({
      query: (payload) => ({
        url: '/performance/feedback',
        method: 'POST',
        body: payload,
      }),
      transformResponse: (response: any) => transformResponse<PeerFeedbackItem>(response),
      invalidatesTags: ['PeerFeedback'],
    }),
  }),
});

export const {
  useGetPerformanceStatsQuery,
  useGetReviewCyclesQuery,
  useGetAppraisalReviewsQuery,
  useGetReviewByIdQuery,
  useSubmitReviewMutation,
  useGetGoalsQuery,
  useCreateGoalMutation,
  useUpdateGoalProgressMutation,
  useGetPeerFeedbackQuery,
  useSubmitPeerFeedbackMutation,
} = performanceApi;
