import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "@/api/apiInstance";
import { getTokens } from "@/api/tokens";

export interface ReportFilterParams {
  startDate?: string;
  endDate?: string;
  departmentId?: string;
  search?: string;
  page?: number;
  pageSize?: number;
  reportType?: string;
}

export interface DepartmentReportItem {
  id: string;
  name: string;
  employeeCount: number;
}

export interface AttendanceReportItem {
  date: string;
  present: number;
  absent: number;
  late: number;
  leave: number;
}

export interface HeadcountTrendItem {
  month: string;
  count: number;
}

export interface ReportsDashboardResponse {
  totalEmployees: number;
  activeDepartments: number;
  headcountTrend: HeadcountTrendItem[];
  departmentDistribution: DepartmentReportItem[];
  attendanceTrend: AttendanceReportItem[];
}

export interface ExportReportParams {
  reportType: string;
  format: "pdf" | "csv" | "excel";
  startDate?: string;
  endDate?: string;
}

export const reportsApi = createApi({
  reducerPath: "reportsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      const tokens = getTokens();
      if (tokens?.accessToken) {
        headers.set("Authorization", `Bearer ${tokens.accessToken}`);
      }
      return headers;
    },
  }),
  tagTypes: [
    "ReportsDashboard",
    "AttendanceReports",
    "PayrollReports",
    "DepartmentReports",
    "RecruitmentReports",
    "LeaveReports",
    "PerformanceReports",
  ],
  endpoints: (builder) => ({
    getDashboardReports: builder.query<ReportsDashboardResponse, ReportFilterParams | void>({
      query: (params) => ({
        url: "/ai-insights/charts",
        params: params ? { ...params } : undefined,
      }),
      transformResponse: (response: any) => {
        const data = response?.data || response || {};
        return {
          totalEmployees: data.totalEmployees || 0,
          activeDepartments: data.activeDepartments || 0,
          headcountTrend: Array.isArray(data.headcountTrend) ? data.headcountTrend : [],
          departmentDistribution: Array.isArray(data.departmentDistribution) ? data.departmentDistribution : [],
          attendanceTrend: Array.isArray(data.attendanceTrend) ? data.attendanceTrend : [],
        };
      },
      providesTags: ["ReportsDashboard"],
    }),

    getAttendanceReports: builder.query<AttendanceReportItem[], ReportFilterParams | void>({
      query: (params) => ({
        url: "/attendance/analytics",
        params: params ? { ...params } : undefined,
      }),
      transformResponse: (response: any) => {
        const list = response?.data || response || [];
        return Array.isArray(list) ? list : [];
      },
      providesTags: ["AttendanceReports"],
    }),

    getPayrollReports: builder.query<any, ReportFilterParams | void>({
      query: (params) => ({
        url: "/payroll/copilot/history",
        params: params ? { ...params } : undefined,
      }),
      transformResponse: (response: any) => {
        return response?.data || response || null;
      },
      providesTags: ["PayrollReports"],
    }),

    getDepartmentReports: builder.query<DepartmentReportItem[], ReportFilterParams | void>({
      query: (params) => ({
        url: "/departments",
        params: params ? { ...params } : undefined,
      }),
      transformResponse: (response: any) => {
        const list = Array.isArray(response)
          ? response
          : response?.data || response?.departments || [];
        return Array.isArray(list)
          ? list.map((d: any) => ({
              id: d.id || d._id || String(d.departmentId),
              name: d.name || d.departmentName || "Unassigned",
              employeeCount: d.employeeCount || d.employeesCount || 0,
            }))
          : [];
      },
      providesTags: ["DepartmentReports"],
    }),

    getRecruitmentReports: builder.query<any, ReportFilterParams | void>({
      query: (params) => ({
        url: "/ats/jobs",
        params: params ? { ...params } : undefined,
      }),
      transformResponse: (response: any) => {
        const list = response?.data || response || [];
        return Array.isArray(list) ? list : [];
      },
      providesTags: ["RecruitmentReports"],
    }),

    getLeaveReports: builder.query<any, ReportFilterParams | void>({
      query: (params) => ({
        url: "/leaves/analytics",
        params: params ? { ...params } : undefined,
      }),
      transformResponse: (response: any) => {
        return response?.data || response || null;
      },
      providesTags: ["LeaveReports"],
    }),

    getPerformanceReports: builder.query<any, ReportFilterParams | void>({
      query: (params) => ({
        url: "/performance/appraisals",
        params: params ? { ...params } : undefined,
      }),
      transformResponse: (response: any) => {
        const list = response?.data || response || [];
        return Array.isArray(list) ? list : [];
      },
      providesTags: ["PerformanceReports"],
    }),

    exportReports: builder.mutation<{ success: boolean; downloadUrl?: string }, ExportReportParams>({
      query: (body) => ({
        url: "/reports/export",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useGetDashboardReportsQuery,
  useGetAttendanceReportsQuery,
  useGetPayrollReportsQuery,
  useGetDepartmentReportsQuery,
  useGetRecruitmentReportsQuery,
  useGetLeaveReportsQuery,
  useGetPerformanceReportsQuery,
  useExportReportsMutation,
} = reportsApi;
