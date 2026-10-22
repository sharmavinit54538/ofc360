/**
 * @file analytics.api.ts
 * @description Enterprise RTK Query API slice for Workforce Analytics, Predictive AI Attrition,
 * Department Headcount & Budget Allocations, and Executive Report Exports.
 * Plugs directly into OFC360 backend using baseQueryWithReauth.
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
} from '@/features/analytics/types';

// Helper to normalize backend API envelopes ({ data: ... } or raw payload)
const transformResponse = <T>(response: any): T => {
  if (response && typeof response === 'object' && 'data' in response && response.data !== undefined) {
    return response.data as T;
  }
  return response as T;
};

export const analyticsApi = createApi({
  reducerPath: 'analyticsApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Analytics'],
  endpoints: (builder) => ({
    /**
     * Retrieve aggregate KPI metrics for executive workforce overview.
     */
    getAnalyticsSummary: builder.query<AnalyticsSummary, AnalyticsFilterParams | void>({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters?.dateRange) params.append('dateRange', filters.dateRange);
        if (filters?.departmentId) params.append('departmentId', filters.departmentId);
        if (filters?.location) params.append('location', filters.location);
        if (filters?.startDate) params.append('startDate', filters.startDate);
        if (filters?.endDate) params.append('endDate', filters.endDate);

        const queryString = params.toString();
        return `/analytics/summary${queryString ? `?${queryString}` : ''}`;
      },
      transformResponse: (response: any) => transformResponse<AnalyticsSummary>(response),
      providesTags: [{ type: 'Analytics', id: 'SUMMARY' }],
    }),

    /**
     * Retrieve chronological workforce headcount growth, hire, and separation trends.
     */
    getWorkforceTrends: builder.query<WorkforceTrend[], AnalyticsFilterParams | void>({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters?.dateRange) params.append('dateRange', filters.dateRange);
        if (filters?.departmentId) params.append('departmentId', filters.departmentId);

        const queryString = params.toString();
        return `/analytics/workforce-trends${queryString ? `?${queryString}` : ''}`;
      },
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
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters?.dateRange) params.append('dateRange', filters.dateRange);

        const queryString = params.toString();
        return `/analytics/department-breakdown${queryString ? `?${queryString}` : ''}`;
      },
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
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters?.departmentId) params.append('departmentId', filters.departmentId);
        if (filters?.dateRange) params.append('dateRange', filters.dateRange);

        const queryString = params.toString();
        return `/analytics/attrition-risk${queryString ? `?${queryString}` : ''}`;
      },
      transformResponse: (response: any): AIAttritionRiskItem[] => {
        const data = transformResponse<any>(response);
        return Array.isArray(data) ? data : data?.risks || data?.items || [];
      },
      providesTags: [{ type: 'Analytics', id: 'ATTRITION' }],
    }),

    /**
     * Export analytics report as PDF, CSV, or Excel spreadsheet.
     */
    exportAnalyticsReport: builder.mutation<
      AnalyticsReportResponse,
      { format: 'PDF' | 'CSV' | 'XLSX'; filters?: AnalyticsFilterParams }
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
  useExportAnalyticsReportMutation,
} = analyticsApi;

export default analyticsApi;
