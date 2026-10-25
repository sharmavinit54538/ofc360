/**
 * @file payrollApi.ts
 * @description RTK Query service for Indian Statutory Payroll Engine,
 * pay components catalog, statutory simulation, run lifecycles, and approvals.
 */

import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '@/shared/api/baseQuery';
import type {
  EvaluateFormulaPayload,
  EvaluateFormulaResult,
  InitiatePayrollPayload,
  PayComponentCreatePayload,
  PayComponentItem,
  PayComponentUpdatePayload,
  PaymentBatchItem,
  PayrollAdjustmentPayload,
  PayrollFilterParams,
  PayrollRunEmployeeItem,
  PayrollRunItem,
  PayrollStats,
  PayslipItem,
  PayslipListResponse,
  SalaryStructureFilterParams,
  SalaryStructureItem,
  SalaryStructureListResponse,
  StatutoryConfigItem,
  StatutorySimulationPayload,
  StatutorySimulationResult,
  TaxDeclarationItem,
  TaxDeclarationPayload,
  TaxDeclarationQueryParams,
  UpdatePayrollRunStatusPayload,
  UpdateSalaryStructurePayload,
  UpdateStatutoryConfigPayload,
  ChallanRecordPayload,
  EmployeePfUpdatePayload,
  PfEcrResponse,
  StatutoryFilingCalendarItem,
  UanValidationItem,
  UanValidationSummary,
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
    'PayComponents',
    'StatutoryConfig',
    'PaymentBatches',
    'RunEmployees',
    'PfCompliance',
    'FilingCalendar',
    'UanValidation',
  ],
  endpoints: (builder) => ({
    // ─────────────────────────────────────────────────────────────────────────
    // 1. Overview & Statistics
    // ─────────────────────────────────────────────────────────────────────────

    getPayrollStats: builder.query<PayrollStats, { month: number; year: number }>({
      query: ({ month, year }) =>
        withQuery(
          '/payroll/stats',
          new URLSearchParams({ month: String(month), year: String(year) })
        ),
      transformResponse: (response: any) => transformResponse<PayrollStats>(response),
      providesTags: ['PayrollStats'],
    }),

    // ─────────────────────────────────────────────────────────────────────────
    // 2. Pay Components Catalog
    // ─────────────────────────────────────────────────────────────────────────

    getPayComponents: builder.query<PayComponentItem[], void>({
      query: () => '/payroll/pay-components',
      transformResponse: (response: any): PayComponentItem[] => {
        const data = transformResponse<any>(response);
        return Array.isArray(data) ? data : data?.items || [];
      },
      providesTags: ['PayComponents'],
    }),

    createPayComponent: builder.mutation<PayComponentItem, PayComponentCreatePayload>({
      query: (payload) => ({
        url: '/payroll/pay-components',
        method: 'POST',
        body: payload,
      }),
      transformResponse: (response: any) => transformResponse<PayComponentItem>(response),
      invalidatesTags: ['PayComponents'],
    }),

    updatePayComponent: builder.mutation<
      PayComponentItem,
      { id: string; data: PayComponentUpdatePayload }
    >({
      query: ({ id, data }) => ({
        url: `/payroll/pay-components/${encodeURIComponent(id)}`,
        method: 'PUT',
        body: data,
      }),
      transformResponse: (response: any) => transformResponse<PayComponentItem>(response),
      invalidatesTags: ['PayComponents'],
    }),

    deletePayComponent: builder.mutation<void, string>({
      query: (id) => ({
        url: `/payroll/pay-components/${encodeURIComponent(id)}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['PayComponents'],
    }),

    seedDefaultPayComponents: builder.mutation<PayComponentItem[], void>({
      query: () => ({
        url: '/payroll/pay-components/seed-defaults',
        method: 'POST',
      }),
      transformResponse: (response: any): PayComponentItem[] => {
        const data = transformResponse<any>(response);
        return Array.isArray(data) ? data : data?.items || [];
      },
      invalidatesTags: ['PayComponents'],
    }),

    evaluateFormula: builder.mutation<EvaluateFormulaResult, EvaluateFormulaPayload>({
      query: (payload) => ({
        url: '/payroll/pay-components/evaluate-formula',
        method: 'POST',
        body: payload,
      }),
      transformResponse: (response: any) => transformResponse<EvaluateFormulaResult>(response),
    }),

    // ─────────────────────────────────────────────────────────────────────────
    // 3. Indian Statutory Engine & Configuration
    // ─────────────────────────────────────────────────────────────────────────

    getStatutoryConfig: builder.query<StatutoryConfigItem, void>({
      query: () => '/payroll/statutory/config',
      transformResponse: (response: any) => transformResponse<StatutoryConfigItem>(response),
      providesTags: ['StatutoryConfig'],
    }),

    updateStatutoryConfig: builder.mutation<StatutoryConfigItem, UpdateStatutoryConfigPayload>({
      query: (payload) => ({
        url: '/payroll/statutory/config',
        method: 'PUT',
        body: payload,
      }),
      transformResponse: (response: any) => transformResponse<StatutoryConfigItem>(response),
      invalidatesTags: ['StatutoryConfig', 'PayrollStats'],
    }),

    simulateStatutory: builder.mutation<StatutorySimulationResult, StatutorySimulationPayload>({
      query: (payload) => ({
        url: '/payroll/statutory/simulate',
        method: 'POST',
        body: payload,
      }),
      transformResponse: (response: any) => transformResponse<StatutorySimulationResult>(response),
    }),

    // ─────────────────────────────────────────────────────────────────────────
    // 4. Payroll Runs & Multi-Stage Lifecycle
    // ─────────────────────────────────────────────────────────────────────────

    getPayrollRuns: builder.query<PayrollRunItem[], { year?: number }>({
      query: ({ year } = {}) => {
        const params = new URLSearchParams();
        if (year) params.append('year', String(year));
        return withQuery('/payroll/runs', params);
      },
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

    executePayrollRunCalculation: builder.mutation<PayrollRunItem, string>({
      query: (runId) => ({
        url: `/payroll/runs/${encodeURIComponent(runId)}/calculate`,
        method: 'POST',
      }),
      transformResponse: (response: any) => transformResponse<PayrollRunItem>(response),
      invalidatesTags: ['PayrollRuns', 'PayrollStats', 'Payslips', 'RunEmployees'],
    }),

    approvePayrollRun: builder.mutation<PayrollRunItem, { id: string; comments?: string }>({
      query: ({ id, comments }) => ({
        url: `/payroll/runs/${encodeURIComponent(id)}/approve`,
        method: 'POST',
        body: { comments },
      }),
      transformResponse: (response: any) => transformResponse<PayrollRunItem>(response),
      invalidatesTags: ['PayrollRuns', 'PayrollStats', 'Payslips'],
    }),

    finalizePayrollRun: builder.mutation<
      PayrollRunItem,
      { id: string; notes?: string; lock?: boolean }
    >({
      query: ({ id, notes, lock = true }) => ({
        url: `/payroll/runs/${encodeURIComponent(id)}/finalize`,
        method: 'POST',
        body: { notes, lock },
      }),
      transformResponse: (response: any) => transformResponse<PayrollRunItem>(response),
      invalidatesTags: ['PayrollRuns', 'PayrollStats', 'Payslips', 'PaymentBatches'],
    }),

    rejectPayrollRun: builder.mutation<
      PayrollRunItem,
      { id: string; reason: string; comments?: string }
    >({
      query: ({ id, reason, comments }) => ({
        url: `/payroll/runs/${encodeURIComponent(id)}/reject`,
        method: 'POST',
        body: { reason, comments },
      }),
      transformResponse: (response: any) => transformResponse<PayrollRunItem>(response),
      invalidatesTags: ['PayrollRuns', 'PayrollStats'],
    }),

    sendBackPayrollRun: builder.mutation<
      PayrollRunItem,
      { id: string; reason?: string; comments?: string }
    >({
      query: ({ id, reason, comments }) => ({
        url: `/payroll/runs/${encodeURIComponent(id)}/send-back`,
        method: 'POST',
        body: { reason, comments },
      }),
      transformResponse: (response: any) => transformResponse<PayrollRunItem>(response),
      invalidatesTags: ['PayrollRuns', 'PayrollStats'],
    }),

    revalidatePayrollRun: builder.mutation<any, string>({
      query: (id) => ({
        url: `/payroll/runs/${encodeURIComponent(id)}/revalidate`,
        method: 'POST',
      }),
      transformResponse: (response: any) => transformResponse<any>(response),
      invalidatesTags: ['PayrollRuns'],
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

    getPayrollRunEmployees: builder.query<
      { items: PayrollRunEmployeeItem[]; total: number; page: number; limit: number },
      { runId: string; page?: number; limit?: number; search?: string }
    >({
      query: ({ runId, page = 1, limit = 50, search }) => {
        const params = new URLSearchParams({ page: String(page), limit: String(limit) });
        if (search) params.append('search', search);
        return withQuery(`/payroll/runs/${encodeURIComponent(runId)}/employees`, params);
      },
      transformResponse: (response: any) =>
        transformResponse<{ items: PayrollRunEmployeeItem[]; total: number; page: number; limit: number }>(response),
      providesTags: ['RunEmployees'],
    }),

    // ─────────────────────────────────────────────────────────────────────────
    // 5. Payslips
    // ─────────────────────────────────────────────────────────────────────────

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

    // ─────────────────────────────────────────────────────────────────────────
    // 6. Salary Structures & Compensation Mapping
    // ─────────────────────────────────────────────────────────────────────────

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

    // ─────────────────────────────────────────────────────────────────────────
    // 7. Variable Inputs & Adjustments
    // ─────────────────────────────────────────────────────────────────────────

    addPayrollAdjustment: builder.mutation<void, PayrollAdjustmentPayload>({
      query: (payload) => ({
        url: '/payroll/adjustments',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['Payslips', 'PayrollRuns', 'PayrollStats'],
    }),

    // ─────────────────────────────────────────────────────────────────────────
    // 8. Tax Declarations (80C, 80D, HRA)
    // ─────────────────────────────────────────────────────────────────────────

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

    // ─────────────────────────────────────────────────────────────────────────
    // 9. Payment Batches & Bank Advices
    // ─────────────────────────────────────────────────────────────────────────

    getPaymentBatches: builder.query<PaymentBatchItem[], { runId?: string }>({
      query: ({ runId } = {}) => {
        const params = new URLSearchParams();
        if (runId) params.append('runId', runId);
        return withQuery('/payroll/payment-batches', params);
      },
      transformResponse: (response: any): PaymentBatchItem[] => {
        const data = transformResponse<any>(response);
        return Array.isArray(data) ? data : data?.items || [];
      },
      providesTags: ['PaymentBatches'],
    }),

    // ─────────────────────────────────────────────────────────────────────────
    // 10. EPFO PF ECR & Compliance Module
    // ─────────────────────────────────────────────────────────────────────────

    getPfEcr: builder.query<PfEcrResponse, { periodId: string; format?: string; download?: boolean }>({
      query: ({ periodId, format = 'json', download = false }) =>
        withQuery(
          '/payroll/statutory/pf-ecr',
          new URLSearchParams({
            period_id: periodId,
            format,
            download: String(download),
          })
        ),
      transformResponse: (response: any) => transformResponse<PfEcrResponse>(response),
      providesTags: ['PfCompliance'],
    }),

    getPfSummary: builder.query<PfEcrResponse, { periodId: string }>({
      query: ({ periodId }) =>
        withQuery(
          '/payroll/statutory/pf-summary',
          new URLSearchParams({
            period_id: periodId,
          })
        ),
      transformResponse: (response: any) => transformResponse<PfEcrResponse>(response),
      providesTags: ['PfCompliance'],
    }),

    getStatutoryFilingCalendar: builder.query<StatutoryFilingCalendarItem[], { year?: number }>({
      query: ({ year } = {}) => {
        const params = new URLSearchParams();
        if (year) params.append('year', String(year));
        return withQuery('/payroll/statutory/filing-calendar', params);
      },
      transformResponse: (response: any): StatutoryFilingCalendarItem[] => {
        const data = transformResponse<any>(response);
        return Array.isArray(data) ? data : data?.items || [];
      },
      providesTags: ['FilingCalendar'],
    }),

    recordChallan: builder.mutation<any, ChallanRecordPayload>({
      query: (payload) => ({
        url: '/payroll/statutory/challan/record',
        method: 'POST',
        body: payload,
      }),
      transformResponse: (response: any) => transformResponse<any>(response),
      invalidatesTags: ['FilingCalendar', 'PfCompliance'],
    }),

    uploadChallanReceipt: builder.mutation<any, { periodId: string; fileType: 'CHALLAN' | 'RECEIPT'; file: File }>({
      query: ({ periodId, fileType, file }) => {
        const formData = new FormData();
        formData.append('period_id', periodId);
        formData.append('file_type', fileType);
        formData.append('file', file);
        return {
          url: '/payroll/statutory/challan/upload',
          method: 'POST',
          body: formData,
        };
      },
      transformResponse: (response: any) => transformResponse<any>(response),
      invalidatesTags: ['FilingCalendar', 'PfCompliance'],
    }),

    getUanValidationAudit: builder.query<UanValidationSummary, void>({
      query: () => '/payroll/statutory/uan-validation',
      transformResponse: (response: any) => transformResponse<UanValidationSummary>(response),
      providesTags: ['UanValidation'],
    }),

    updateEmployeePfSettings: builder.mutation<any, { employeeId: string; data: EmployeePfUpdatePayload }>({
      query: ({ employeeId, data }) => ({
        url: `/payroll/statutory/employee-pf/${employeeId}`,
        method: 'PATCH',
        body: data,
      }),
      transformResponse: (response: any) => transformResponse<any>(response),
      invalidatesTags: ['UanValidation', 'PfCompliance'],
    }),
  }),
});

export const {
  useGetPayrollStatsQuery,
  useGetPayComponentsQuery,
  useCreatePayComponentMutation,
  useUpdatePayComponentMutation,
  useDeletePayComponentMutation,
  useSeedDefaultPayComponentsMutation,
  useEvaluateFormulaMutation,
  useGetStatutoryConfigQuery,
  useUpdateStatutoryConfigMutation,
  useSimulateStatutoryMutation,
  useGetPayrollRunsQuery,
  useInitiatePayrollRunMutation,
  useExecutePayrollRunCalculationMutation,
  useApprovePayrollRunMutation,
  useFinalizePayrollRunMutation,
  useRejectPayrollRunMutation,
  useSendBackPayrollRunMutation,
  useRevalidatePayrollRunMutation,
  useUpdatePayrollRunStatusMutation,
  useGetPayrollRunEmployeesQuery,
  useGetPayslipsQuery,
  useGetPayslipByIdQuery,
  useGetSalaryStructuresQuery,
  useUpdateSalaryStructureMutation,
  useAddPayrollAdjustmentMutation,
  useGetTaxDeclarationsQuery,
  useSubmitTaxDeclarationMutation,
  useGetPaymentBatchesQuery,
  useGetPfEcrQuery,
  useLazyGetPfEcrQuery,
  useGetPfSummaryQuery,
  useGetStatutoryFilingCalendarQuery,
  useRecordChallanMutation,
  useUploadChallanReceiptMutation,
  useGetUanValidationAuditQuery,
  useUpdateEmployeePfSettingsMutation,
} = payrollApi;

export default payrollApi;
