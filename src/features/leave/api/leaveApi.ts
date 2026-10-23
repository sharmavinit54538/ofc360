/**
 * @file leaveApi.ts
 * @description Enterprise RTK Query API service for Leave Management: balances,
 * leave applications, approval workflows, cancellations, team calendars, and comp-offs.
 * Plugs directly into OFC360 backend using baseQueryWithReauth.
 */

import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '@/shared/api/baseQuery';
import type {
  LeaveStats,
  LeaveBalance,
  LeaveRequest,
  LeaveRequestListResponse,
  LeaveFilterParams,
  ApplyLeavePayload,
  LeaveApprovalPayload,
  CancelLeavePayload,
  LeaveCalendarResponse,
  CompOffRequest,
  CompOffRequestPayload,
} from '../types/leave.types';

const transformResponse = <T>(response: any): T => {
  if (response && typeof response === 'object' && 'data' in response && response.data !== undefined) {
    return response.data as T;
  }
  return response as T;
};

export const leaveApi = createApi({
  reducerPath: 'leaveApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['LeaveStats', 'LeaveBalances', 'LeaveRequests', 'LeaveCalendar'],
  endpoints: (builder) => ({
    /**
     * Retrieve aggregate leave KPI metrics for the authenticated user / team.
     */
    getLeaveStats: builder.query<LeaveStats, void>({
      query: () => '/leaves/stats',
      transformResponse: (response: any) => transformResponse<LeaveStats>(response),
      providesTags: [{ type: 'LeaveStats', id: 'SUMMARY' }],
    }),

    /**
     * Retrieve per leave-type accrual balance ledger for the authenticated employee.
     */
    getLeaveBalances: builder.query<LeaveBalance[], void>({
      query: () => '/leaves/balances',
      transformResponse: (response: any): LeaveBalance[] => {
        const data = transformResponse<any>(response);
        return Array.isArray(data) ? data : data?.balances || data?.items || [];
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ leaveTypeId }) => ({ type: 'LeaveBalances' as const, id: leaveTypeId })),
              { type: 'LeaveBalances', id: 'LIST' },
            ]
          : [{ type: 'LeaveBalances', id: 'LIST' }],
    }),

    /**
     * Retrieve paginated leave requests with search, status, type, scope, and date filters.
     */
    getLeaveRequests: builder.query<LeaveRequestListResponse, LeaveFilterParams | void>({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters?.search) params.append('search', filters.search);
        if (filters?.status && filters.status !== 'ALL') params.append('status', filters.status);
        if (filters?.leaveTypeId) params.append('leaveTypeId', filters.leaveTypeId);
        if (filters?.scope) params.append('scope', filters.scope);
        if (filters?.startDate) params.append('startDate', filters.startDate);
        if (filters?.endDate) params.append('endDate', filters.endDate);
        if (filters?.page) params.append('page', String(filters.page));
        if (filters?.limit) params.append('limit', String(filters.limit));

        const queryString = params.toString();
        return `/leaves/requests${queryString ? `?${queryString}` : ''}`;
      },
      transformResponse: (response: any): LeaveRequestListResponse => {
        const data = transformResponse<any>(response);
        if (Array.isArray(data)) {
          return { items: data, total: data.length, page: 1, limit: data.length };
        }
        return {
          items: data?.items || data?.requests || [],
          total: data?.total || data?.count || (data?.items ? data.items.length : 0),
          page: data?.page || 1,
          limit: data?.limit || 20,
        };
      },
      providesTags: (result) =>
        result?.items
          ? [
              ...result.items.map(({ id }) => ({ type: 'LeaveRequests' as const, id })),
              { type: 'LeaveRequests', id: 'LIST' },
            ]
          : [{ type: 'LeaveRequests', id: 'LIST' }],
    }),

    /**
     * Fetch a single leave request with complete approval audit trail.
     */
    getLeaveRequestById: builder.query<LeaveRequest, string>({
      query: (id) => `/leaves/requests/${encodeURIComponent(id)}`,
      transformResponse: (response: any) => transformResponse<LeaveRequest>(response),
      providesTags: (_result, _error, id) => [{ type: 'LeaveRequests', id }],
    }),

    /**
     * Submit a new leave application for approval.
     */
    applyLeave: builder.mutation<LeaveRequest, ApplyLeavePayload>({
      query: (payload) => ({
        url: '/leaves/requests',
        method: 'POST',
        body: payload,
      }),
      transformResponse: (response: any) => transformResponse<LeaveRequest>(response),
      invalidatesTags: [
        { type: 'LeaveRequests', id: 'LIST' },
        { type: 'LeaveStats', id: 'SUMMARY' },
        { type: 'LeaveBalances', id: 'LIST' },
      ],
    }),

    /**
     * Approve or reject a pending leave request (manager / HR action).
     */
    updateLeaveStatus: builder.mutation<LeaveRequest, LeaveApprovalPayload>({
      query: ({ id, ...body }) => ({
        url: `/leaves/requests/${encodeURIComponent(id)}/status`,
        method: 'PATCH',
        body,
      }),
      transformResponse: (response: any) => transformResponse<LeaveRequest>(response),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'LeaveRequests', id },
        { type: 'LeaveRequests', id: 'LIST' },
        { type: 'LeaveStats', id: 'SUMMARY' },
        { type: 'LeaveBalances', id: 'LIST' },
        { type: 'LeaveCalendar', id: 'TEAM' },
      ],
    }),

    /**
     * Cancel an own pending / approved leave request.
     */
    cancelLeaveRequest: builder.mutation<LeaveRequest, CancelLeavePayload>({
      query: ({ id, reason }) => ({
        url: `/leaves/requests/${encodeURIComponent(id)}/cancel`,
        method: 'PATCH',
        body: { reason },
      }),
      transformResponse: (response: any) => transformResponse<LeaveRequest>(response),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'LeaveRequests', id },
        { type: 'LeaveRequests', id: 'LIST' },
        { type: 'LeaveStats', id: 'SUMMARY' },
        { type: 'LeaveBalances', id: 'LIST' },
        { type: 'LeaveCalendar', id: 'TEAM' },
      ],
    }),

    /**
     * Retrieve the team leave calendar occupancy for a date window.
     */
    getLeaveCalendar: builder.query<LeaveCalendarResponse, { startDate?: string; endDate?: string } | void>({
      query: (range) => {
        const params = new URLSearchParams();
        if (range?.startDate) params.append('startDate', range.startDate);
        if (range?.endDate) params.append('endDate', range.endDate);
        const queryString = params.toString();
        return `/leaves/calendar${queryString ? `?${queryString}` : ''}`;
      },
      transformResponse: (response: any): LeaveCalendarResponse => {
        const data = transformResponse<any>(response);
        if (Array.isArray(data)) {
          return { items: data, startDate: data[0]?.date || '', endDate: data[data.length - 1]?.date || '' };
        }
        return {
          items: data?.items || data?.calendar || [],
          startDate: data?.startDate || '',
          endDate: data?.endDate || '',
        };
      },
      providesTags: [{ type: 'LeaveCalendar', id: 'TEAM' }],
    }),

    /**
     * Claim a compensatory off credit for extra hours worked on weekends / holidays.
     */
    requestCompOff: builder.mutation<CompOffRequest, CompOffRequestPayload>({
      query: (payload) => ({
        url: '/leaves/comp-off',
        method: 'POST',
        body: payload,
      }),
      transformResponse: (response: any) => transformResponse<CompOffRequest>(response),
      invalidatesTags: [
        { type: 'LeaveRequests', id: 'LIST' },
        { type: 'LeaveStats', id: 'SUMMARY' },
        { type: 'LeaveBalances', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetLeaveStatsQuery,
  useGetLeaveBalancesQuery,
  useGetLeaveRequestsQuery,
  useGetLeaveRequestByIdQuery,
  useApplyLeaveMutation,
  useUpdateLeaveStatusMutation,
  useCancelLeaveRequestMutation,
  useGetLeaveCalendarQuery,
  useRequestCompOffMutation,
} = leaveApi;

export default leaveApi;
