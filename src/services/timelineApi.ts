/**
 * @file timelineApi.ts
 * @description Enterprise RTK Query API slice for Employee Career Timelines,
 * Company-wide Milestone Feeds, Performance Reviews, Role Changes, and Recognition Records.
 * Plugs directly into OFC360 backend using baseQueryWithReauth.
 */

import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '@/shared/api/baseQuery';
import type {
  TimelineEvent,
  TimelineFilterParams,
  TimelineResponse,
  CreateTimelineEventPayload,
} from '@/features/timeline/types';

// Helper to normalize backend API envelopes ({ data: ... } or raw payload)
const transformResponse = <T>(response: any): T => {
  if (response && typeof response === 'object' && 'data' in response && response.data !== undefined) {
    return response.data as T;
  }
  return response as T;
};

export const timelineApi = createApi({
  reducerPath: 'timelineApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Timeline'],
  endpoints: (builder) => ({
    /**
     * Retrieve chronological timeline events for a specific employee.
     */
    getEmployeeTimeline: builder.query<
      TimelineResponse,
      { employeeId: string; filters?: Omit<TimelineFilterParams, 'employeeId'> }
    >({
      query: ({ employeeId, filters }) => {
        const params = new URLSearchParams();
        if (filters?.eventType && filters.eventType !== 'ALL') params.append('eventType', filters.eventType);
        if (filters?.startDate) params.append('startDate', filters.startDate);
        if (filters?.endDate) params.append('endDate', filters.endDate);
        if (filters?.search) params.append('search', filters.search);
        if (filters?.page) params.append('page', String(filters.page));
        if (filters?.limit) params.append('limit', String(filters.limit));

        const queryString = params.toString();
        return `/timeline/employee/${encodeURIComponent(employeeId)}${queryString ? `?${queryString}` : ''}`;
      },
      transformResponse: (response: any): TimelineResponse => {
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
          items: data?.items || data?.events || [],
          total: data?.total || data?.count || (data?.items ? data.items.length : 0),
          page: data?.page || 1,
          limit: data?.limit || 20,
        };
      },
      providesTags: (result) =>
        result?.items
          ? [
              ...result.items.map(({ id }) => ({ type: 'Timeline' as const, id })),
              { type: 'Timeline', id: 'LIST' },
            ]
          : [{ type: 'Timeline', id: 'LIST' }],
    }),

    /**
     * Retrieve company-wide chronological milestone feed across all departments.
     */
    getCompanyWideTimeline: builder.query<TimelineResponse, TimelineFilterParams | void>({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters?.employeeId) params.append('employeeId', filters.employeeId);
        if (filters?.eventType && filters.eventType !== 'ALL') params.append('eventType', filters.eventType);
        if (filters?.startDate) params.append('startDate', filters.startDate);
        if (filters?.endDate) params.append('endDate', filters.endDate);
        if (filters?.search) params.append('search', filters.search);
        if (filters?.page) params.append('page', String(filters.page));
        if (filters?.limit) params.append('limit', String(filters.limit));

        const queryString = params.toString();
        return `/timeline${queryString ? `?${queryString}` : ''}`;
      },
      transformResponse: (response: any): TimelineResponse => {
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
          items: data?.items || data?.events || [],
          total: data?.total || data?.count || (data?.items ? data.items.length : 0),
          page: data?.page || 1,
          limit: data?.limit || 20,
        };
      },
      providesTags: (result) =>
        result?.items
          ? [
              ...result.items.map(({ id }) => ({ type: 'Timeline' as const, id })),
              { type: 'Timeline', id: 'LIST' },
            ]
          : [{ type: 'Timeline', id: 'LIST' }],
    }),

    /**
     * Record a manual career milestone, achievement, or organizational record.
     */
    addTimelineEvent: builder.mutation<TimelineEvent, CreateTimelineEventPayload>({
      query: (payload) => ({
        url: '/timeline',
        method: 'POST',
        body: payload,
      }),
      transformResponse: (response: any) => transformResponse<TimelineEvent>(response),
      invalidatesTags: [{ type: 'Timeline', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetEmployeeTimelineQuery,
  useGetCompanyWideTimelineQuery,
  useAddTimelineEventMutation,
} = timelineApi;

export default timelineApi;
