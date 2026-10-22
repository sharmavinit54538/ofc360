/**
 * @file exitsApi.ts
 * @description Enterprise RTK Query API service for Employee Exit Management,
 * Resignations, Clearances, Exit Interviews, and FnF Settlements.
 * Plugs directly into OFC360 backend using baseQueryWithReauth.
 */

import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '@/shared/api/baseQuery';
import type {
  ExitCase,
  ExitCaseListResponse,
  ExitFilters,
  CreateExitCasePayload,
  UpdateExitStagePayload,
  SubmitClearancePayload,
  SubmitExitInterviewPayload,
  ProcessFnFPayload,
  RejectExitPayload,
  DeactivateEmployeePayload,
  ExitAnalyticsMetrics,
} from '../types/exit.types';

const transformResponse = <T>(response: any): T => {
  if (response && typeof response === 'object' && 'data' in response && response.data !== undefined) {
    return response.data as T;
  }
  return response as T;
};

export const exitsApi = createApi({
  reducerPath: 'exitsApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['ExitCases', 'ExitAnalytics'],
  endpoints: (builder) => ({
    /**
     * Retrieve paginated exit cases with filtering by search, stage, department, date.
     */
    getExitCases: builder.query<ExitCaseListResponse, ExitFilters | void>({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters?.search) params.append('search', filters.search);
        if (filters?.stage && filters.stage !== 'ALL') params.append('stage', filters.stage);
        if (filters?.department && filters.department !== 'ALL') params.append('department', filters.department);
        if (filters?.exitType && filters.exitType !== 'ALL') params.append('exitType', filters.exitType);
        if (filters?.startDate) params.append('startDate', filters.startDate);
        if (filters?.endDate) params.append('endDate', filters.endDate);
        if (filters?.page) params.append('page', String(filters.page));
        if (filters?.limit) params.append('limit', String(filters.limit));

        const queryString = params.toString();
        return `/offboarding/cases${queryString ? `?${queryString}` : ''}`;
      },
      transformResponse: (response: any): ExitCaseListResponse => {
        const data = transformResponse<any>(response);
        if (Array.isArray(data)) {
          return { items: data, total: data.length, page: 1, limit: data.length };
        }
        return {
          items: data.items || data.cases || [],
          total: data.total || data.count || (data.items ? data.items.length : 0),
          page: data.page || 1,
          limit: data.limit || 20,
          summary: data.summary,
        };
      },
      providesTags: (result) =>
        result?.items
          ? [
              ...result.items.map(({ id }) => ({ type: 'ExitCases' as const, id })),
              { type: 'ExitCases', id: 'LIST' },
            ]
          : [{ type: 'ExitCases', id: 'LIST' }],
    }),

    /**
     * Fetch KPI metrics for Exit Overview (Active exits, pending clearances, FnF pending, completed).
     */
    getExitAnalytics: builder.query<ExitAnalyticsMetrics, void>({
      query: () => '/offboarding/analytics',
      transformResponse: (response: any) => transformResponse<ExitAnalyticsMetrics>(response),
      providesTags: [{ type: 'ExitAnalytics', id: 'METRICS' }],
    }),

    /**
     * Retrieve specific exit case with full clearance checklist and interview details.
     */
    getExitCaseById: builder.query<ExitCase, string>({
      query: (id) => `/offboarding/cases/${encodeURIComponent(id)}`,
      transformResponse: (response: any) => transformResponse<ExitCase>(response),
      providesTags: (_result, _error, id) => [{ type: 'ExitCases', id }],
    }),

    /**
     * Initiate a new exit case / submit resignation.
     */
    createExitCase: builder.mutation<ExitCase, CreateExitCasePayload>({
      query: (payload) => ({
        url: '/offboarding/cases',
        method: 'POST',
        body: payload,
      }),
      transformResponse: (response: any) => transformResponse<ExitCase>(response),
      invalidatesTags: [
        { type: 'ExitCases', id: 'LIST' },
        { type: 'ExitAnalytics', id: 'METRICS' },
      ],
    }),

    /**
     * Update exit stage (e.g. advance to Manager Review, Clearance Pending, FnF Settlement, Completed).
     */
    updateExitStage: builder.mutation<ExitCase, UpdateExitStagePayload>({
      query: ({ id, ...body }) => ({
        url: `/offboarding/cases/${encodeURIComponent(id)}/stage`,
        method: 'PATCH',
        body,
      }),
      transformResponse: (response: any) => transformResponse<ExitCase>(response),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'ExitCases', id },
        { type: 'ExitCases', id: 'LIST' },
        { type: 'ExitAnalytics', id: 'METRICS' },
      ],
    }),

    /**
     * Submit departmental clearance sign-off (IT, HR, Finance, Admin).
     */
    submitClearanceSignoff: builder.mutation<ExitCase, SubmitClearancePayload>({
      query: ({ id, ...body }) => ({
        url: `/offboarding/cases/${encodeURIComponent(id)}/clearance`,
        method: 'POST',
        body,
      }),
      transformResponse: (response: any) => transformResponse<ExitCase>(response),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'ExitCases', id },
        { type: 'ExitCases', id: 'LIST' },
      ],
    }),

    /**
     * Submit exit interview answers & ratings.
     */
    submitExitInterview: builder.mutation<ExitCase, SubmitExitInterviewPayload>({
      query: ({ id, ...body }) => ({
        url: `/offboarding/cases/${encodeURIComponent(id)}/interview`,
        method: 'POST',
        body,
      }),
      transformResponse: (response: any) => transformResponse<ExitCase>(response),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'ExitCases', id },
        { type: 'ExitCases', id: 'LIST' },
      ],
    }),

    /**
     * Process Full and Final (FnF) Settlement.
     */
    settleFnF: builder.mutation<ExitCase, ProcessFnFPayload>({
      query: ({ id, ...body }) => ({
        url: `/offboarding/cases/${encodeURIComponent(id)}/settlement`,
        method: 'POST',
        body,
      }),
      transformResponse: (response: any) => transformResponse<ExitCase>(response),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'ExitCases', id },
        { type: 'ExitCases', id: 'LIST' },
        { type: 'ExitAnalytics', id: 'METRICS' },
      ],
    }),

    /**
     * Reject or cancel an exit case.
     */
    rejectExit: builder.mutation<ExitCase, RejectExitPayload>({
      query: ({ id, ...body }) => ({
        url: `/offboarding/cases/${encodeURIComponent(id)}/reject`,
        method: 'POST',
        body,
      }),
      transformResponse: (response: any) => transformResponse<ExitCase>(response),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'ExitCases', id },
        { type: 'ExitCases', id: 'LIST' },
        { type: 'ExitAnalytics', id: 'METRICS' },
      ],
    }),

    /**
     * Revoke employee credentials and deactivate system accounts upon departure.
     */
    deactivateEmployee: builder.mutation<ExitCase, DeactivateEmployeePayload>({
      query: ({ id, ...body }) => ({
        url: `/offboarding/cases/${encodeURIComponent(id)}/deactivate`,
        method: 'POST',
        body,
      }),
      transformResponse: (response: any) => transformResponse<ExitCase>(response),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'ExitCases', id },
        { type: 'ExitCases', id: 'LIST' },
        { type: 'ExitAnalytics', id: 'METRICS' },
      ],
    }),
  }),
});

export const {
  useGetExitCasesQuery,
  useGetExitAnalyticsQuery,
  useGetExitCaseByIdQuery,
  useCreateExitCaseMutation,
  useUpdateExitStageMutation,
  useSubmitClearanceSignoffMutation,
  useSubmitExitInterviewMutation,
  useSettleFnFMutation,
  useRejectExitMutation,
  useDeactivateEmployeeMutation,
} = exitsApi;
