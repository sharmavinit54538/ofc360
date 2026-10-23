/**
 * @file attendanceApi.ts
 * @description Enterprise RTK Query API service for Attendance Management: punch
 * in/out, KPI stats, daily records, regularization workflows, shifts, rosters,
 * and holiday calendars. Plugs directly into OFC360 backend using baseQueryWithReauth.
 */

import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '@/shared/api/baseQuery';
import type {
  TodayPunchStatus,
  PunchInPayload,
  PunchOutPayload,
  AttendanceStats,
  AttendanceRecordListResponse,
  AttendanceFilterParams,
  RegularizationRequest,
  RegularizationListResponse,
  ApplyRegularizationPayload,
  ReviewRegularizationPayload,
  ShiftItem,
  ShiftFormPayload,
  RosterListResponse,
  RosterQueryParams,
  RosterAssignmentPayload,
  HolidayItem,
} from '../types/attendance.types';

const transformResponse = <T>(response: any): T => {
  if (response && typeof response === 'object' && 'data' in response && response.data !== undefined) {
    return response.data as T;
  }
  return response as T;
};

export const attendanceApi = createApi({
  reducerPath: 'attendanceApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    'AttendanceStats',
    'AttendanceRecords',
    'TodayStatus',
    'Shifts',
    'Rosters',
    'Holidays',
    'Regularizations',
  ],
  endpoints: (builder) => ({
    /**
     * Retrieve the authenticated employee's real-time punch status for today.
     */
    getTodayStatus: builder.query<TodayPunchStatus, void>({
      query: () => '/attendance/today-status',
      transformResponse: (response: any) => transformResponse<TodayPunchStatus>(response),
      providesTags: ['TodayStatus'],
    }),

    /**
     * Record an office / work-from-home / field punch-in with optional geo metadata.
     */
    punchIn: builder.mutation<TodayPunchStatus, PunchInPayload>({
      query: (payload) => ({
        url: '/attendance/punch-in',
        method: 'POST',
        body: payload,
      }),
      transformResponse: (response: any) => transformResponse<TodayPunchStatus>(response),
      invalidatesTags: ['TodayStatus', 'AttendanceStats', 'AttendanceRecords'],
    }),

    /**
     * Record the end-of-day punch-out with optional work notes.
     */
    punchOut: builder.mutation<TodayPunchStatus, PunchOutPayload>({
      query: (payload) => ({
        url: '/attendance/punch-out',
        method: 'POST',
        body: payload,
      }),
      transformResponse: (response: any) => transformResponse<TodayPunchStatus>(response),
      invalidatesTags: ['TodayStatus', 'AttendanceStats', 'AttendanceRecords'],
    }),

    /**
     * Retrieve aggregate attendance KPI metrics for the organization / team.
     */
    getAttendanceStats: builder.query<AttendanceStats, void>({
      query: () => '/attendance/stats',
      transformResponse: (response: any) => transformResponse<AttendanceStats>(response),
      providesTags: ['AttendanceStats'],
    }),

    /**
     * Retrieve paginated daily attendance records with scope, status, date, and search filters.
     */
    getAttendanceRecords: builder.query<AttendanceRecordListResponse, AttendanceFilterParams | void>({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters?.search) params.append('search', filters.search);
        if (filters?.status && filters.status !== 'ALL') params.append('status', filters.status);
        if (filters?.scope) params.append('scope', filters.scope);
        if (filters?.departmentId) params.append('departmentId', filters.departmentId);
        if (filters?.startDate) params.append('startDate', filters.startDate);
        if (filters?.endDate) params.append('endDate', filters.endDate);
        if (filters?.page) params.append('page', String(filters.page));
        if (filters?.limit) params.append('limit', String(filters.limit));

        const queryString = params.toString();
        return `/attendance/records${queryString ? `?${queryString}` : ''}`;
      },
      transformResponse: (response: any): AttendanceRecordListResponse => {
        const data = transformResponse<any>(response);
        if (Array.isArray(data)) {
          return { items: data, total: data.length, page: 1, limit: data.length };
        }
        return {
          items: data?.items || data?.records || [],
          total: data?.total || data?.count || (data?.items ? data.items.length : 0),
          page: data?.page || 1,
          limit: data?.limit || 20,
        };
      },
      providesTags: (result) =>
        result?.items
          ? [
              ...result.items.map(({ id }) => ({ type: 'AttendanceRecords' as const, id })),
              { type: 'AttendanceRecords', id: 'LIST' },
            ]
          : [{ type: 'AttendanceRecords', id: 'LIST' }],
    }),

    /**
     * Retrieve regularization applications (own for employees, pending for managers).
     */
    getRegularizationRequests: builder.query<RegularizationListResponse, { status?: string; scope?: string } | void>({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters?.status && filters.status !== 'ALL') params.append('status', filters.status);
        if (filters?.scope) params.append('scope', filters.scope);
        const queryString = params.toString();
        return `/attendance/regularization${queryString ? `?${queryString}` : ''}`;
      },
      transformResponse: (response: any): RegularizationListResponse => {
        const data = transformResponse<any>(response);
        if (Array.isArray(data)) {
          return { items: data, total: data.length };
        }
        return {
          items: data?.items || data?.requests || [],
          total: data?.total || data?.count || (data?.items ? data.items.length : 0),
        };
      },
      providesTags: ['Regularizations'],
    }),

    /**
     * Submit a missed-punch / on-duty regularization application.
     */
    applyRegularization: builder.mutation<RegularizationRequest, ApplyRegularizationPayload>({
      query: (payload) => ({
        url: '/attendance/regularization',
        method: 'POST',
        body: payload,
      }),
      transformResponse: (response: any) => transformResponse<RegularizationRequest>(response),
      invalidatesTags: ['Regularizations', 'AttendanceStats', 'AttendanceRecords'],
    }),

    /**
     * Approve or reject a pending regularization application (manager / HR action).
     */
    reviewRegularization: builder.mutation<RegularizationRequest, ReviewRegularizationPayload>({
      query: ({ id, ...body }) => ({
        url: `/attendance/regularization/${encodeURIComponent(id)}`,
        method: 'PATCH',
        body,
      }),
      transformResponse: (response: any) => transformResponse<RegularizationRequest>(response),
      invalidatesTags: ['Regularizations', 'AttendanceStats', 'AttendanceRecords'],
    }),

    /**
     * Retrieve all configured operational shifts.
     */
    getShifts: builder.query<ShiftItem[], void>({
      query: () => '/attendance/shifts',
      transformResponse: (response: any): ShiftItem[] => {
        const data = transformResponse<any>(response);
        return Array.isArray(data) ? data : data?.shifts || data?.items || [];
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Shifts' as const, id })),
              { type: 'Shifts', id: 'LIST' },
            ]
          : [{ type: 'Shifts', id: 'LIST' }],
    }),

    /**
     * Create a new operational shift definition.
     */
    createShift: builder.mutation<ShiftItem, ShiftFormPayload>({
      query: (payload) => ({
        url: '/attendance/shifts',
        method: 'POST',
        body: payload,
      }),
      transformResponse: (response: any) => transformResponse<ShiftItem>(response),
      invalidatesTags: ['Shifts'],
    }),

    /**
     * Update an existing shift definition.
     */
    updateShift: builder.mutation<ShiftItem, { id: string; data: ShiftFormPayload }>({
      query: ({ id, data }) => ({
        url: `/attendance/shifts/${encodeURIComponent(id)}`,
        method: 'PUT',
        body: data,
      }),
      transformResponse: (response: any) => transformResponse<ShiftItem>(response),
      invalidatesTags: ['Shifts'],
    }),

    /**
     * Retrieve published monthly duty rosters for a department.
     */
    getRosters: builder.query<RosterListResponse, RosterQueryParams | void>({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters?.month) params.append('month', String(filters.month));
        if (filters?.year) params.append('year', String(filters.year));
        if (filters?.departmentId) params.append('departmentId', filters.departmentId);
        const queryString = params.toString();
        return `/attendance/rosters${queryString ? `?${queryString}` : ''}`;
      },
      transformResponse: (response: any): RosterListResponse => {
        const data = transformResponse<any>(response);
        if (Array.isArray(data)) {
          return { items: data, month: 0, year: 0 };
        }
        return {
          items: data?.items || data?.rosters || [],
          month: data?.month || 0,
          year: data?.year || 0,
        };
      },
      providesTags: ['Rosters'],
    }),

    /**
     * Bulk-assign a shift to employees across a date range.
     */
    assignRoster: builder.mutation<{ assigned: number }, RosterAssignmentPayload>({
      query: (payload) => ({
        url: '/attendance/rosters/assign',
        method: 'POST',
        body: payload,
      }),
      transformResponse: (response: any) => transformResponse<{ assigned: number }>(response),
      invalidatesTags: ['Rosters'],
    }),

    /**
     * Retrieve the official company holiday calendar for a year.
     */
    getHolidays: builder.query<HolidayItem[], { year?: number } | void>({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters?.year) params.append('year', String(filters.year));
        const queryString = params.toString();
        return `/attendance/holidays${queryString ? `?${queryString}` : ''}`;
      },
      transformResponse: (response: any): HolidayItem[] => {
        const data = transformResponse<any>(response);
        return Array.isArray(data) ? data : data?.holidays || data?.items || [];
      },
      providesTags: ['Holidays'],
    }),
  }),
});

export const {
  useGetTodayStatusQuery,
  usePunchInMutation,
  usePunchOutMutation,
  useGetAttendanceStatsQuery,
  useGetAttendanceRecordsQuery,
  useGetRegularizationRequestsQuery,
  useApplyRegularizationMutation,
  useReviewRegularizationMutation,
  useGetShiftsQuery,
  useCreateShiftMutation,
  useUpdateShiftMutation,
  useGetRostersQuery,
  useAssignRosterMutation,
  useGetHolidaysQuery,
} = attendanceApi;

export default attendanceApi;
