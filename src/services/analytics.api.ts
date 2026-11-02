/**
 * @file analytics.api.ts
 * @description Enterprise RTK Query API slice for Workforce Analytics, Predictive AI Attrition,
 * Department Headcount & Budget Allocations, and Executive Report Exports for all 8 Core HRMS Modules.
 * Strictly binds 100% to OFC360 backend using baseQueryWithReauth with ZERO MOCK DATA.
 */

import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '@/shared/api/baseQuery';
import type {
  AnalyticsSummary,
  WorkforceTrend,
  DepartmentBreakdown,
  AIAttritionRiskItem,
  AnalyticsFilterParams,
  AnalyticsReportResponse,
  PayrollVarianceReportData,
  LeaveLiabilityReportData,
  PerformanceTalentReportData,
  TravelExpenseAuditReportData,
  AssetInventoryReportData,
  StatutoryComplianceReportData,
  RecruitmentFunnelReportData,
  AttendanceShiftReportData,
} from '@/features/analytics/types';

// Helper to normalize backend API envelopes ({ data: ... } or raw payload)
const transformResponse = <T>(response: any): T => {
  if (response && typeof response === 'object' && 'data' in response && response.data !== undefined) {
    return response.data as T;
  }
  return response as T;
};

const buildQueryString = (filters?: AnalyticsFilterParams | void): string => {
  if (!filters) return '';
  const params = new URLSearchParams();
  if (filters.dateRange) params.append('dateRange', filters.dateRange);
  if (filters.departmentId && filters.departmentId !== 'ALL') params.append('departmentId', filters.departmentId);
  if (filters.location && filters.location !== 'ALL') params.append('location', filters.location);
  if (filters.employmentType && filters.employmentType !== 'ALL') params.append('employmentType', filters.employmentType);
  if (filters.startDate) params.append('startDate', filters.startDate);
  if (filters.endDate) params.append('endDate', filters.endDate);

  const qs = params.toString();
  return qs ? `?${qs}` : '';
};

export const analyticsApi = createApi({
  reducerPath: 'analyticsApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    'Analytics',
    'PayrollReport',
    'LeaveReport',
    'PerformanceReport',
    'TravelExpenseReport',
    'AssetReport',
    'StatutoryReport',
    'RecruitmentReport',
    'AttendanceReport',
  ],
  endpoints: (builder) => ({
    /**
     * Retrieve aggregate KPI metrics for executive workforce overview.
     */
    getAnalyticsSummary: builder.query<AnalyticsSummary, AnalyticsFilterParams | void>({
      query: (filters) => `/analytics/summary${buildQueryString(filters)}`,
      transformResponse: (response: any) => transformResponse<AnalyticsSummary>(response),
      providesTags: [{ type: 'Analytics', id: 'SUMMARY' }],
    }),

    /**
     * Retrieve chronological workforce headcount growth, hire, and separation trends.
     */
    getWorkforceTrends: builder.query<WorkforceTrend[], AnalyticsFilterParams | void>({
      query: (filters) => `/analytics/workforce-trends${buildQueryString(filters)}`,
      transformResponse: (response: any): WorkforceTrend[] => {
        const data = transformResponse<any>(response);
        return Array.isArray(data) ? data : data?.trends || [];
      },
      providesTags: [{ type: 'Analytics', id: 'TRENDS' }],
    }),

    /**
     * Retrieve departmental headcount distribution, attrition rate, and budget usage.
     */
    getDepartmentBreakdown: builder.query<DepartmentBreakdown[], AnalyticsFilterParams | void>({
      query: (filters) => `/analytics/department-breakdown${buildQueryString(filters)}`,
      transformResponse: (response: any): DepartmentBreakdown[] => {
        const data = transformResponse<any>(response);
        return Array.isArray(data) ? data : data?.departments || [];
      },
      providesTags: [{ type: 'Analytics', id: 'DEPARTMENTS' }],
    }),

    /**
     * Retrieve predictive AI attrition risk analysis and recommended mitigation steps.
     */
    getAttritionRiskAnalysis: builder.query<AIAttritionRiskItem[], AnalyticsFilterParams | void>({
      query: (filters) => `/analytics/attrition-risk${buildQueryString(filters)}`,
      transformResponse: (response: any): AIAttritionRiskItem[] => {
        const data = transformResponse<any>(response);
        return Array.isArray(data) ? data : data?.risks || data?.items || [];
      },
      providesTags: [{ type: 'Analytics', id: 'ATTRITION' }],
    }),

    /* -----------------------------------------------------------------------
     * 1. PAYROLL VARIANCE & COMPENSATION REPORT
     * ----------------------------------------------------------------------- */
    getPayrollVarianceReport: builder.query<PayrollVarianceReportData, AnalyticsFilterParams | void>({
      query: (filters) => `/analytics/reports/payroll-variance${buildQueryString(filters)}`,
      transformResponse: (response: any) => transformResponse<PayrollVarianceReportData>(response),
      providesTags: ['PayrollReport'],
    }),

    /* -----------------------------------------------------------------------
     * 2. LEAVE BALANCES & ABSENCE LIABILITY REPORT
     * ----------------------------------------------------------------------- */
    getLeaveLiabilityReport: builder.query<LeaveLiabilityReportData, AnalyticsFilterParams | void>({
      query: (filters) => `/analytics/reports/leave-liability${buildQueryString(filters)}`,
      transformResponse: (response: any) => transformResponse<LeaveLiabilityReportData>(response),
      providesTags: ['LeaveReport'],
    }),

    /* -----------------------------------------------------------------------
     * 3. PERFORMANCE & 9-BOX TALENT GRID REPORT
     * ----------------------------------------------------------------------- */
    getPerformanceTalentReport: builder.query<PerformanceTalentReportData, AnalyticsFilterParams | void>({
      query: (filters) => `/analytics/reports/performance-talent${buildQueryString(filters)}`,
      transformResponse: (response: any) => transformResponse<PerformanceTalentReportData>(response),
      providesTags: ['PerformanceReport'],
    }),

    /* -----------------------------------------------------------------------
     * 4. TRAVEL & EXPENSE SPENDING AUDIT REPORT
     * ----------------------------------------------------------------------- */
    getTravelExpenseReport: builder.query<TravelExpenseAuditReportData, AnalyticsFilterParams | void>({
      query: (filters) => `/analytics/reports/travel-expense${buildQueryString(filters)}`,
      transformResponse: (response: any) => transformResponse<TravelExpenseAuditReportData>(response),
      providesTags: ['TravelExpenseReport'],
    }),

    /* -----------------------------------------------------------------------
     * 5. ASSET INVENTORY & DEPRECIATION REPORT
     * ----------------------------------------------------------------------- */
    getAssetInventoryReport: builder.query<AssetInventoryReportData, AnalyticsFilterParams | void>({
      query: (filters) => `/analytics/reports/asset-inventory${buildQueryString(filters)}`,
      transformResponse: (response: any) => transformResponse<AssetInventoryReportData>(response),
      providesTags: ['AssetReport'],
    }),

    /* -----------------------------------------------------------------------
     * 6. STATUTORY REGISTERS & AUDIT EXPORTS REPORT
     * ----------------------------------------------------------------------- */
    getStatutoryComplianceReport: builder.query<StatutoryComplianceReportData, AnalyticsFilterParams | void>({
      query: (filters) => `/analytics/reports/statutory-compliance${buildQueryString(filters)}`,
      transformResponse: (response: any) => transformResponse<StatutoryComplianceReportData>(response),
      providesTags: ['StatutoryReport'],
    }),

    /* -----------------------------------------------------------------------
     * 7. RECRUITMENT FUNNEL & SOURCING REPORT
     * ----------------------------------------------------------------------- */
    getRecruitmentFunnelReport: builder.query<RecruitmentFunnelReportData, AnalyticsFilterParams | void>({
      query: (filters) => `/analytics/reports/recruitment-funnel${buildQueryString(filters)}`,
      transformResponse: (response: any) => transformResponse<RecruitmentFunnelReportData>(response),
      providesTags: ['RecruitmentReport'],
    }),

    /* -----------------------------------------------------------------------
     * 8. ATTENDANCE & SHIFT UTILIZATION REPORT
     * ----------------------------------------------------------------------- */
    getAttendanceShiftReport: builder.query<AttendanceShiftReportData, AnalyticsFilterParams | void>({
      query: (filters) => `/analytics/reports/attendance-shift${buildQueryString(filters)}`,
      transformResponse: (response: any) => transformResponse<AttendanceShiftReportData>(response),
      providesTags: ['AttendanceReport'],
    }),

    /**
     * Export analytics report as PDF, CSV, or Excel spreadsheet (Blob trigger).
     */
    exportAnalyticsReport: builder.mutation<
      AnalyticsReportResponse,
      { format: 'PDF' | 'CSV' | 'XLSX'; filters?: AnalyticsFilterParams; reportType?: string }
    >({
      query: (payload) => ({
        url: '/analytics/export',
        method: 'POST',
        body: payload,
      }),
      transformResponse: (response: any) => transformResponse<AnalyticsReportResponse>(response),
    }),
  }),
});

export const {
  useGetAnalyticsSummaryQuery,
  useGetWorkforceTrendsQuery,
  useGetDepartmentBreakdownQuery,
  useGetAttritionRiskAnalysisQuery,
  useGetPayrollVarianceReportQuery,
  useGetLeaveLiabilityReportQuery,
  useGetPerformanceTalentReportQuery,
  useGetTravelExpenseReportQuery,
  useGetAssetInventoryReportQuery,
  useGetStatutoryComplianceReportQuery,
  useGetRecruitmentFunnelReportQuery,
  useGetAttendanceShiftReportQuery,
  useExportAnalyticsReportMutation,
} = analyticsApi;

export default analyticsApi;
