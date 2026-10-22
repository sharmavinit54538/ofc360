/**
 * @file visitorsApi.ts
 * @description Enterprise RTK Query API slice for Visitor Management,
 * Pre-Registration, On-Premises Check-in / Check-out, Host Approvals, and Real-Time Analytics.
 * Plugs directly into OFC360 backend using baseQueryWithReauth.
 */

import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '@/shared/api/baseQuery';
import type {
  Visitor,
  VisitorAnalytics,
  RegisterVisitorPayload,
  CheckInVisitorPayload,
  CheckOutVisitorPayload,
  UpdateHostApprovalPayload,
  VisitorsListFilters,
  VisitorsListResponse,
} from '@/features/visitors/types/visitors.types';

// Helper to normalize backend API envelopes ({ data: ... } or raw payload)
const transformResponse = <T>(response: any): T => {
  if (response && typeof response === 'object' && 'data' in response && response.data !== undefined) {
    return response.data as T;
  }
  return response as T;
};

export const visitorsApi = createApi({
  reducerPath: 'visitorsApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Visitors', 'VisitorAnalytics'],
  endpoints: (builder) => ({
    /**
     * Retrieve paginated visitor log list with search and status filters.
     */
    getVisitorsList: builder.query<VisitorsListResponse, VisitorsListFilters | void>({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters?.search) params.append('search', filters.search);
        if (filters?.status && filters.status !== 'ALL') params.append('status', filters.status);
        if (filters?.hostApprovalStatus && filters.hostApprovalStatus !== 'ALL') {
          params.append('hostApprovalStatus', filters.hostApprovalStatus);
        }
        if (filters?.date) params.append('date', filters.date);
        if (filters?.page) params.append('page', String(filters.page));
        if (filters?.limit) params.append('limit', String(filters.limit));

        const queryString = params.toString();
        return `/visitors${queryString ? `?${queryString}` : ''}`;
      },
      transformResponse: (response: any): VisitorsListResponse => {
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
          items: data?.items || data?.visitors || [],
          total: data?.total || data?.count || (data?.items ? data.items.length : 0),
          page: data?.page || 1,
          limit: data?.limit || 20,
          analytics: data?.analytics,
        };
      },
      providesTags: (result) =>
        result?.items
          ? [
              ...result.items.map(({ id }) => ({ type: 'Visitors' as const, id })),
              { type: 'Visitors', id: 'LIST' },
            ]
          : [{ type: 'Visitors', id: 'LIST' }],
    }),

    /**
     * Fetch KPI metrics for Visitor Management Overview (On-Premises, Expected, Overstay).
     */
    getVisitorAnalytics: builder.query<VisitorAnalytics, void>({
      query: () => '/visitors/analytics',
      transformResponse: (response: any) => transformResponse<VisitorAnalytics>(response),
      providesTags: [{ type: 'VisitorAnalytics', id: 'METRICS' }],
    }),

    /**
     * Pre-register a scheduled guest or walk-in visitor.
     */
    registerVisitor: builder.mutation<Visitor, RegisterVisitorPayload>({
      query: (payload) => ({
        url: '/visitors',
        method: 'POST',
        body: payload,
      }),
      transformResponse: (response: any) => transformResponse<Visitor>(response),
      invalidatesTags: [
        { type: 'Visitors', id: 'LIST' },
        { type: 'VisitorAnalytics', id: 'METRICS' },
      ],
    }),

    /**
     * Mark an expected or verified visitor as checked-in on premises.
     */
    checkInVisitor: builder.mutation<Visitor, CheckInVisitorPayload>({
      query: ({ id, ...body }) => ({
        url: `/visitors/${encodeURIComponent(id)}/check-in`,
        method: 'PATCH',
        body,
      }),
      transformResponse: (response: any) => transformResponse<Visitor>(response),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Visitors', id },
        { type: 'Visitors', id: 'LIST' },
        { type: 'VisitorAnalytics', id: 'METRICS' },
      ],
    }),

    /**
     * Record visitor departure and badge return.
     */
    checkOutVisitor: builder.mutation<Visitor, CheckOutVisitorPayload>({
      query: ({ id, ...body }) => ({
        url: `/visitors/${encodeURIComponent(id)}/check-out`,
        method: 'PATCH',
        body,
      }),
      transformResponse: (response: any) => transformResponse<Visitor>(response),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Visitors', id },
        { type: 'Visitors', id: 'LIST' },
        { type: 'VisitorAnalytics', id: 'METRICS' },
      ],
    }),

    /**
     * Host employee approves or rejects the visitor request.
     */
    updateHostApproval: builder.mutation<Visitor, UpdateHostApprovalPayload>({
      query: ({ id, ...body }) => ({
        url: `/visitors/${encodeURIComponent(id)}/host-approval`,
        method: 'PATCH',
        body,
      }),
      transformResponse: (response: any) => transformResponse<Visitor>(response),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Visitors', id },
        { type: 'Visitors', id: 'LIST' },
        { type: 'VisitorAnalytics', id: 'METRICS' },
      ],
    }),
  }),
});

export const {
  useGetVisitorsListQuery,
  useGetVisitorAnalyticsQuery,
  useRegisterVisitorMutation,
  useCheckInVisitorMutation,
  useCheckOutVisitorMutation,
  useUpdateHostApprovalMutation,
} = visitorsApi;

export default visitorsApi;
