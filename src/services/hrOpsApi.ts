/**
 * @file hrOpsApi.ts
 * @description Enterprise RTK Query API slice for HR Operations Command Center,
 * Action Item Queue, Real-time Metrics, Task Assignments, and Status Updates.
 * Plugs directly into OFC360 backend using baseQueryWithReauth.
 */

import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '@/shared/api/baseQuery';
import type {
  HrOpsMetrics,
  HrOpsActionItem,
  HrOpsFilterParams,
  HrOpsQueueResponse,
  UpdateActionItemStatusPayload,
  AssignActionItemPayload,
} from '@/features/hr-ops/types';

// Helper to normalize backend API envelopes ({ data: ... } or raw payload)
const transformResponse = <T>(response: any): T => {
  if (response && typeof response === 'object' && 'data' in response && response.data !== undefined) {
    return response.data as T;
  }
  return response as T;
};

export const hrOpsApi = createApi({
  reducerPath: 'hrOpsApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['HrOps'],
  endpoints: (builder) => ({
    /**
     * Retrieve aggregate KPI metrics for HR Operations Command Center.
     */
    getHrOpsMetrics: builder.query<HrOpsMetrics, void>({
      query: () => '/hrops/metrics',
      transformResponse: (response: any) => transformResponse<HrOpsMetrics>(response),
      providesTags: [{ type: 'HrOps', id: 'METRICS' }],
    }),

    /**
     * Retrieve paginated HR Operations task and clearance action queue.
     */
    getHrOpsQueue: builder.query<HrOpsQueueResponse, HrOpsFilterParams | void>({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters?.type && filters.type !== 'ALL') params.append('type', filters.type);
        if (filters?.priority && filters.priority !== 'ALL') params.append('priority', filters.priority);
        if (filters?.status && filters.status !== 'ALL') params.append('status', filters.status);
        if (filters?.search) params.append('search', filters.search);
        if (filters?.startDate) params.append('startDate', filters.startDate);
        if (filters?.endDate) params.append('endDate', filters.endDate);
        if (filters?.page) params.append('page', String(filters.page));
        if (filters?.limit) params.append('limit', String(filters.limit));

        const queryString = params.toString();
        return `/hrops/queue${queryString ? `?${queryString}` : ''}`;
      },
      transformResponse: (response: any): HrOpsQueueResponse => {
        const data = transformResponse<any>(response);
        if (Array.isArray(data)) {
          return {
            items: data,
            total: data.length,
            page: 1,
            limit: data.length,
          };
        }
        return {
          items: data?.items || data?.actions || [],
          total: data?.total || data?.count || (data?.items ? data.items.length : 0),
          page: data?.page || 1,
          limit: data?.limit || 20,
          metrics: data?.metrics,
        };
      },
      providesTags: (result) =>
        result?.items
          ? [
              ...result.items.map(({ id }) => ({ type: 'HrOps' as const, id })),
              { type: 'HrOps', id: 'LIST' },
            ]
          : [{ type: 'HrOps', id: 'LIST' }],
    }),

    /**
     * Update the progress or resolution status of an operational action item.
     */
    updateActionItemStatus: builder.mutation<HrOpsActionItem, UpdateActionItemStatusPayload>({
      query: ({ id, ...body }) => ({
        url: `/hrops/queue/${encodeURIComponent(id)}/status`,
        method: 'PATCH',
        body,
      }),
      transformResponse: (response: any) => transformResponse<HrOpsActionItem>(response),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'HrOps', id },
        { type: 'HrOps', id: 'LIST' },
        { type: 'HrOps', id: 'METRICS' },
      ],
    }),

    /**
     * Delegate or assign an operational task to a designated HR team member.
     */
    assignActionItem: builder.mutation<HrOpsActionItem, AssignActionItemPayload>({
      query: ({ id, ...body }) => ({
        url: `/hrops/queue/${encodeURIComponent(id)}/assign`,
        method: 'PATCH',
        body,
      }),
      transformResponse: (response: any) => transformResponse<HrOpsActionItem>(response),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'HrOps', id },
        { type: 'HrOps', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetHrOpsMetricsQuery,
  useGetHrOpsQueueQuery,
  useUpdateActionItemStatusMutation,
  useAssignActionItemMutation,
} = hrOpsApi;

export default hrOpsApi;
