/**
 * @file payrollApi.ts
 * @description RTK Query service for payroll runs, payslips, compensation
 * structures, adjustments, and tax declarations.
 */

import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '@/shared/api/baseQuery';
import type {
  InitiatePayrollPayload,
  PayrollAdjustmentPayload,
  PayrollFilterParams,
  PayrollRunItem,
  PayrollStats,
  PayslipItem,
  PayslipListResponse,
  SalaryStructureFilterParams,
  SalaryStructureItem,
  SalaryStructureListResponse,
  TaxDeclarationItem,
  TaxDeclarationPayload,
  TaxDeclarationQueryParams,
  UpdatePayrollRunStatusPayload,
  UpdateSalaryStructurePayload,
} from '../types/payroll.types';

const transformResponse = <T>(response: any): T => {
  if (response && typeof response === 'object' && 'data' in response && response.data !== undefined) {
    return response.data as T;
  }
  return response as T;
};

const withQuery = (path: string, params: URLSearchParams): string => {
  const queryString = params.toString();
  return `${path}${queryString ? `?${queryString}` : ''}`;
};

export const payrollApi = createApi({
  reducerPath: 'payrollApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    'PayrollStats',
    'PayrollRuns',
    'Payslips',
    'SalaryStructures',
    'TaxDeclarations',
    'StatutorySummary',
  ],
  endpoints: (builder) => ({
    getPayrollStats: builder.query<PayrollStats, { month: number; year: number }>({
      query: ({ month, year }) =>
        withQuery(
          '/payroll/stats',
          new URLSearchParams({ month: String(month), year: String(year) })
        ),
      transformResponse: (response: any) => transformResponse<PayrollStats>(response),
      providesTags: ['PayrollStats'],
    }),

    getPayrollRuns: builder.query<PayrollRunItem[], { year: number }>({
      query: ({ year }) =>
        withQuery('/payroll/runs', new URLSearchParams({ year: String(year) })),
      transformResponse: (response: any): PayrollRunItem[] => {
        const data = transformResponse<any>(response);
        return Array.isArray(data) ? data : data?.items || data?.runs || [];
      },
      providesTags: ['PayrollRuns'],
    }),

    initiatePayrollRun: builder.mutation<PayrollRunItem, InitiatePayrollPayload>({
      query: (payload) => ({
        url: '/payroll/runs',
        method: 'POST',
        body: payload,
      }),
      transformResponse: (response: any) => transformResponse<PayrollRunItem>(response),
      invalidatesTags: ['PayrollRuns', 'PayrollStats', 'Payslips'],
    }),

    updatePayrollRunStatus: builder.mutation<
      PayrollRunItem,
      { id: string; data: UpdatePayrollRunStatusPayload }
    >({
      query: ({ id, data }) => ({
        url: `/payroll/runs/${encodeURIComponent(id)}/status`,
        method: 'PATCH',
        body: data,
      }),
      transformResponse: (response: any) => transformResponse<PayrollRunItem>(response),
      invalidatesTags: ['PayrollRuns', 'PayrollStats', 'Payslips'],
    }),

    getPayslips: builder.query<PayslipListResponse, PayrollFilterParams>({
      query: (filters) => {
        const params = new URLSearchParams({
          page: String(filters.page),
          limit: String(filters.limit),
          month: String(filters.month),
          year: String(filters.year),
          scope: filters.scope,
        });
        if (filters.departmentId) params.append('departmentId', filters.departmentId);
        if (filters.status && filters.status !== 'ALL') params.append('status', filters.status);
        if (filters.search) params.append('search', filters.search);
        return withQuery('/payroll/payslips', params);
      },
      transformResponse: (response: any): PayslipListResponse => {
        const data = transformResponse<any>(response);
        if (Array.isArray(data)) {
          return { items: data, total: data.length, page: 1, limit: data.length };
        }
        const items = data?.items || data?.payslips || [];
        return {
          items,
          total: data?.total ?? data?.count ?? items.length,
          page: data?.page ?? 1,
          limit: data?.limit ?? 20,
        };
      },
      providesTags: ['Payslips'],
    }),

    getPayslipById: builder.query<PayslipItem, string>({
      query: (id) => `/payroll/payslips/${encodeURIComponent(id)}`,
      transformResponse: (response: any) => transformResponse<PayslipItem>(response),
      providesTags: ['Payslips'],
    }),

    getSalaryStructures: builder.query<SalaryStructureListResponse, SalaryStructureFilterParams>({
      query: (filters) => {
        const params = new URLSearchParams({
          page: String(filters.page),
          limit: String(filters.limit),
        });
        if (filters.departmentId) params.append('departmentId', filters.departmentId);
        if (filters.search) params.append('search', filters.search);
        return withQuery('/payroll/structures', params);
      },
      transformResponse: (response: any): SalaryStructureListResponse => {
        const data = transformResponse<any>(response);
        if (Array.isArray(data)) {
          return { items: data, total: data.length, page: 1, limit: data.length };
        }
        const items = data?.items || data?.structures || [];
        return {
          items,
          total: data?.total ?? data?.count ?? items.length,
          page: data?.page ?? 1,
          limit: data?.limit ?? 20,
        };
      },
      providesTags: ['SalaryStructures'],
    }),

    updateSalaryStructure: builder.mutation<
      SalaryStructureItem,
      { employeeId: string; data: UpdateSalaryStructurePayload }
    >({
      query: ({ employeeId, data }) => ({
        url: `/payroll/structures/${encodeURIComponent(employeeId)}`,
        method: 'PUT',
        body: data,
      }),
      transformResponse: (response: any) => transformResponse<SalaryStructureItem>(response),
      invalidatesTags: ['SalaryStructures', 'PayrollStats'],
    }),

    addPayrollAdjustment: builder.mutation<void, PayrollAdjustmentPayload>({
      query: (payload) => ({
        url: '/payroll/adjustments',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['Payslips', 'PayrollRuns', 'PayrollStats'],
    }),

    getTaxDeclarations: builder.query<TaxDeclarationItem[], TaxDeclarationQueryParams>({
      query: (filters) => {
        const params = new URLSearchParams({
          financialYear: filters.financialYear,
          scope: filters.scope,
        });
        if (filters.status && filters.status !== 'ALL') params.append('status', filters.status);
        return withQuery('/payroll/tax-declarations', params);
      },
      transformResponse: (response: any): TaxDeclarationItem[] => {
        const data = transformResponse<any>(response);
        return Array.isArray(data) ? data : data?.items || data?.declarations || [];
      },
      providesTags: ['TaxDeclarations'],
    }),

    submitTaxDeclaration: builder.mutation<TaxDeclarationItem, TaxDeclarationPayload>({
      query: (payload) => ({
        url: '/payroll/tax-declarations',
        method: 'POST',
        body: payload,
      }),
      transformResponse: (response: any) => transformResponse<TaxDeclarationItem>(response),
      invalidatesTags: ['TaxDeclarations'],
    }),
  }),
});

export const {
  useGetPayrollStatsQuery,
  useGetPayrollRunsQuery,
  useInitiatePayrollRunMutation,
  useUpdatePayrollRunStatusMutation,
  useGetPayslipsQuery,
  useGetPayslipByIdQuery,
  useGetSalaryStructuresQuery,
  useUpdateSalaryStructureMutation,
  useAddPayrollAdjustmentMutation,
  useGetTaxDeclarationsQuery,
  useSubmitTaxDeclarationMutation,
} = payrollApi;

export default payrollApi;
