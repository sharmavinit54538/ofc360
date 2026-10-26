/**
 * @file hrDashboardApi.ts
 * @description Enterprise RTK Query API service for HR Admin Dashboard endpoints.
 * Connects to FastAPI backend for real-time dashboard metrics and data.
 */

import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '@/shared/api/baseQuery';
import type {
  EmployeeSummary,
  AttendanceSummary,
  PendingApprovalsSummary,
  PayrollDashboardSummary,
  PayrollRunSummary,
  Announcement,
  CreateAnnouncementPayload,
  UpdateAnnouncementPayload,
  AuditLogEntry,
  UpcomingEvent,
  TimelineEvent,
  DashboardSummaryResponse,
  LeaveRequestSummary,
  ExpenseSummary,
  DocumentVerificationSummary,
  ApproveLeaveRequest,
  RejectLeaveRequest,
} from '../types/hrDashboard.types';

// Helper to transform backend response to frontend types
const transformResponse = <T>(response: any): T => {
  const data = response?.data !== undefined && typeof response.data === 'object' && response.data !== null ? response.data : response;
  return data as T;
};

/**
 * Normalizes backend announcement response envelopes safely to Announcement[].
 * Guarantees an array is always returned; never returns fake or mock data.
 */
export const normalizeAnnouncementsResponse = (response: any): Announcement[] => {
  const unwrapped = response?.data !== undefined ? response.data : response;
  if (Array.isArray(unwrapped)) return unwrapped as Announcement[];
  if (Array.isArray(unwrapped?.announcements)) return unwrapped.announcements as Announcement[];
  if (Array.isArray(unwrapped?.items)) return unwrapped.items as Announcement[];
  return [];
};

export const hrDashboardApi = createApi({
  reducerPath: 'hrDashboardApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    'DashboardSummary',
    'EmployeeSummary',
    'AttendanceSummary',
    'PendingApprovals',
    'PayrollRuns',
    'PayrollSummary',
    'Announcements',
    'AuditLogs',
    'UpcomingEvents',
    'TimelineEvents',
  ],
  endpoints: (builder) => ({
    /**
     * Fetches comprehensive dashboard summary for HR Admin.
     * Single endpoint for all KPI cards and feed data.
     */
    getDashboardSummary: builder.query<DashboardSummaryResponse, void>({
      query: () => '/hr-admin/dashboard/summary',
      transformResponse: (response: any) => transformResponse<DashboardSummaryResponse>(response),
      providesTags: ['DashboardSummary'],
    }),

    /**
     * Fetches employee headcount and status summary.
     */
    getEmployeeSummary: builder.query<EmployeeSummary, void>({
      query: () => '/hr-admin/employees/summary',
      transformResponse: (response: any) => transformResponse<EmployeeSummary>(response),
      providesTags: ['EmployeeSummary'],
    }),

    /**
     * Fetches today's attendance summary.
     */
    getAttendanceSummary: builder.query<AttendanceSummary, { date?: string } | void>({
      query: (params) => ({
        url: '/hr-admin/attendance/summary',
        params: params ? { date: params.date } : undefined,
      }),
      transformResponse: (response: any) => transformResponse<AttendanceSummary>(response),
      providesTags: ['AttendanceSummary'],
    }),

    /**
     * Fetches all pending approvals across leaves, expenses, documents.
     */
    getPendingApprovals: builder.query<PendingApprovalsSummary, void>({
      query: () => '/hr-admin/approvals/pending',
      transformResponse: (response: any) => transformResponse<PendingApprovalsSummary>(response),
      providesTags: ['PendingApprovals'],
    }),

    /**
     * Fetches pending leave requests with filters.
     */
    getPendingLeaves: builder.query<LeaveRequestSummary[], { status?: string; limit?: number }>({
      query: (params) => ({
        url: '/hr-admin/leaves',
        params: { status: params?.status || 'PENDING', limit: params?.limit || 50 },
      }),
      transformResponse: (response: any) => transformResponse<LeaveRequestSummary[]>(response),
      providesTags: ['PendingApprovals'],
    }),

    /**
     * Fetches payroll dashboard summary (active, last, upcoming runs).
     */
    getPayrollDashboard: builder.query<PayrollDashboardSummary, void>({
      query: () => '/hr-admin/payroll/dashboard',
      transformResponse: (response: any) => transformResponse<PayrollDashboardSummary>(response),
      providesTags: ['PayrollSummary'],
    }),

    /**
     * Fetches all payroll runs with pagination.
     */
    getPayrollRuns: builder.query<{ runs: PayrollRunSummary[]; total: number }, { page?: number; limit?: number; status?: string }>({
      query: (params) => ({
        url: '/hr-admin/payroll/runs',
        params: { page: params?.page || 1, limit: params?.limit || 20, status: params?.status },
      }),
      transformResponse: (response: any) => transformResponse<{ runs: PayrollRunSummary[]; total: number }>(response),
      providesTags: ['PayrollRuns'],
    }),

    /**
     * Fetches a single payroll run by ID.
     */
    getPayrollRun: builder.query<PayrollRunSummary, string>({
      query: (id) => `/hr-admin/payroll/runs/${id}`,
      transformResponse: (response: any) => transformResponse<PayrollRunSummary>(response),
      providesTags: ['PayrollRuns'],
    }),

    /**
     * Creates a new payroll run.
     */
    createPayrollRun: builder.mutation<PayrollRunSummary, { periodStart: string; periodEnd: string; payDate: string }>({
      query: (body) => ({
        url: '/hr-admin/payroll/runs',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['PayrollRuns', 'PayrollSummary'],
    }),

    /**
     * Approves a payroll run.
     */
    approvePayrollRun: builder.mutation<PayrollRunSummary, string>({
      query: (id) => ({
        url: `/hr-admin/payroll/runs/${id}/approve`,
        method: 'POST',
      }),
      invalidatesTags: ['PayrollRuns', 'PayrollSummary'],
    }),

    /**
     * Processes a payroll run.
     */
    processPayrollRun: builder.mutation<PayrollRunSummary, string>({
      query: (id) => ({
        url: `/hr-admin/payroll/runs/${id}/process`,
        method: 'POST',
      }),
      invalidatesTags: ['PayrollRuns', 'PayrollSummary'],
    }),

    /**
     * Marks payroll run as paid.
     */
    markPayrollRunPaid: builder.mutation<PayrollRunSummary, string>({
      query: (id) => ({
        url: `/hr-admin/payroll/runs/${id}/mark-paid`,
        method: 'POST',
      }),
      invalidatesTags: ['PayrollRuns', 'PayrollSummary'],
    }),

    /**
     * Fetches recent announcements.
     */
    getAnnouncements: builder.query<Announcement[], { limit?: number; type?: string; audience?: string } | void>({
      query: (params) => ({
        url: '/hr-admin/announcements',
        params: params ? { limit: params.limit || 20, type: params.type, audience: params.audience } : { limit: 20 },
      }),
      transformResponse: (response: any) => normalizeAnnouncementsResponse(response),
      providesTags: ['Announcements'],
    }),

    /**
     * Creates a new announcement.
     */
    createAnnouncement: builder.mutation<Announcement, CreateAnnouncementPayload | Partial<Announcement>>({
      query: (body) => ({
        url: '/hr-admin/announcements',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Announcements', 'DashboardSummary', 'TimelineEvents'],
    }),

    /**
     * Updates an announcement.
     */
    updateAnnouncement: builder.mutation<Announcement, { id: string; data: UpdateAnnouncementPayload | Partial<Announcement> }>({
      query: ({ id, data }) => ({
        url: `/hr-admin/announcements/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Announcements', 'DashboardSummary', 'TimelineEvents'],
    }),

    /**
     * Deletes an announcement.
     */
    deleteAnnouncement: builder.mutation<void, string>({
      query: (id) => ({
        url: `/hr-admin/announcements/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Announcements', 'DashboardSummary', 'TimelineEvents'],
    }),

    /**
     * Fetches audit logs with filters.
     */
    getAuditLogs: builder.query<AuditLogEntry[], { limit?: number; severity?: string; resourceType?: string; startDate?: string; endDate?: string }>({
      query: (params) => ({
        url: '/hr-admin/audit-logs',
        params: { limit: params?.limit || 50, severity: params?.severity, resource_type: params?.resourceType, start_date: params?.startDate, end_date: params?.endDate },
      }),
      transformResponse: (response: any) => transformResponse<AuditLogEntry[]>(response),
      providesTags: ['AuditLogs'],
    }),

    /**
     * Fetches upcoming events (birthdays, anniversaries, etc.).
     */
    getUpcomingEvents: builder.query<UpcomingEvent[], { daysAhead?: number; types?: string[] }>({
      query: (params) => ({
        url: '/hr-admin/events/upcoming',
        params: { days_ahead: params?.daysAhead || 30, types: params?.types?.join(',') },
      }),
      transformResponse: (response: any) => transformResponse<UpcomingEvent[]>(response),
      providesTags: ['UpcomingEvents'],
    }),

    /**
     * Fetches chronological timeline feed for HR Command Center.
     */
    getTimelineFeed: builder.query<TimelineEvent[], { limit?: number; daysBack?: number }>({
      query: (params) => ({
        url: '/hr-admin/timeline',
        params: { limit: params?.limit || 50, days_back: params?.daysBack || 14 },
      }),
      transformResponse: (response: any) => transformResponse<TimelineEvent[]>(response),
      providesTags: ['TimelineEvents'],
    }),

    /**
     * Fetches pending expense reimbursements.
     */
    getPendingExpenses: builder.query<ExpenseSummary[], { limit?: number }>({
      query: (params) => ({
        url: '/hr-admin/expenses/pending',
        params: { limit: params?.limit || 20 },
      }),
      transformResponse: (response: any) => transformResponse<ExpenseSummary[]>(response),
      providesTags: ['PendingApprovals'],
    }),

    /**
     * Fetches pending document verifications.
     */
    getPendingDocuments: builder.query<DocumentVerificationSummary[], { limit?: number }>({
      query: (params) => ({
        url: '/hr-admin/documents/pending',
        params: { limit: params?.limit || 20 },
      }),
      transformResponse: (response: any) => transformResponse<DocumentVerificationSummary[]>(response),
      providesTags: ['PendingApprovals'],
    }),

    /**
     * Approves a pending leave request.
     */
    approveLeave: builder.mutation<LeaveRequestSummary, ApproveLeaveRequest>({
      query: (body) => ({
        url: `/hr-admin/leaves/${body.leaveId}/approve`,
        method: 'POST',
        body: { comment: body.comment },
      }),
      invalidatesTags: ['PendingApprovals', 'DashboardSummary', 'TimelineEvents'],
    }),

    /**
     * Rejects a pending leave request.
     */
    rejectLeave: builder.mutation<LeaveRequestSummary, RejectLeaveRequest>({
      query: (body) => ({
        url: `/hr-admin/leaves/${body.leaveId}/reject`,
        method: 'POST',
        body: { comment: body.comment },
      }),
      invalidatesTags: ['PendingApprovals', 'DashboardSummary', 'TimelineEvents'],
    }),
  }),
});

export const {
  useGetDashboardSummaryQuery,
  useLazyGetDashboardSummaryQuery,
  useGetEmployeeSummaryQuery,
  useLazyGetEmployeeSummaryQuery,
  useGetAttendanceSummaryQuery,
  useLazyGetAttendanceSummaryQuery,
  useGetPendingApprovalsQuery,
  useLazyGetPendingApprovalsQuery,
  useGetPendingLeavesQuery,
  useLazyGetPendingLeavesQuery,
  useGetPayrollDashboardQuery,
  useLazyGetPayrollDashboardQuery,
  useGetPayrollRunsQuery,
  useLazyGetPayrollRunsQuery,
  useGetPayrollRunQuery,
  useLazyGetPayrollRunQuery,
  useCreatePayrollRunMutation,
  useApprovePayrollRunMutation,
  useProcessPayrollRunMutation,
  useMarkPayrollRunPaidMutation,
  useGetAnnouncementsQuery,
  useLazyGetAnnouncementsQuery,
  useCreateAnnouncementMutation,
  useUpdateAnnouncementMutation,
  useDeleteAnnouncementMutation,
  useGetAuditLogsQuery,
  useLazyGetAuditLogsQuery,
  useGetUpcomingEventsQuery,
  useLazyGetUpcomingEventsQuery,
  useGetTimelineFeedQuery,
  useLazyGetTimelineFeedQuery,
  useGetPendingExpensesQuery,
  useLazyGetPendingExpensesQuery,
  useGetPendingDocumentsQuery,
  useLazyGetPendingDocumentsQuery,
  useApproveLeaveMutation,
  useRejectLeaveMutation,
} = hrDashboardApi;