/**
 * @file expensesApi.ts
 * @description Enterprise RTK Query API service for Expense Claims, Reimbursement Workflows,
 * Receipt Uploads, and Financial Settlements.
 * Plugs directly into OFC360 backend using baseQueryWithReauth.
 */

import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '@/shared/api/baseQuery';
import type {
  ExpenseClaim,
  ExpenseClaimListResponse,
  ExpenseFilters,
  CreateExpenseClaimPayload,
  UpdateExpenseStatusPayload,
  ExpensesSummaryMetrics,
  ReceiptUploadResponse,
} from '../types/expenses.types';

const transformResponse = <T>(response: any): T => {
  if (response && typeof response === 'object' && 'data' in response && response.data !== undefined) {
    return response.data as T;
  }
  return response as T;
};

export const expensesApi = createApi({
  reducerPath: 'expensesApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['ExpenseClaims', 'ExpensesSummary'],
  endpoints: (builder) => ({
    /**
     * Retrieve paginated expense claims with filtering by search, status, category, date.
     */
    getExpenseClaims: builder.query<ExpenseClaimListResponse, ExpenseFilters | void>({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters?.search) params.append('search', filters.search);
        if (filters?.status && filters.status !== 'ALL') params.append('status', filters.status);
        if (filters?.category && filters.category !== 'ALL') params.append('category', filters.category);
        if (filters?.startDate) params.append('startDate', filters.startDate);
        if (filters?.endDate) params.append('endDate', filters.endDate);
        if (filters?.page) params.append('page', String(filters.page));
        if (filters?.limit) params.append('limit', String(filters.limit));

        const queryString = params.toString();
        return `/expenses/claims${queryString ? `?${queryString}` : ''}`;
      },
      transformResponse: (response: any): ExpenseClaimListResponse => {
        const data = transformResponse<any>(response);
        if (Array.isArray(data)) {
          return { items: data, total: data.length, page: 1, limit: data.length };
        }
        return {
          items: data.items || data.claims || [],
          total: data.total || data.count || (data.items ? data.items.length : 0),
          page: data.page || 1,
          limit: data.limit || 20,
          summary: data.summary,
        };
      },
      providesTags: (result) =>
        result?.items
          ? [
              ...result.items.map(({ id }) => ({ type: 'ExpenseClaims' as const, id })),
              { type: 'ExpenseClaims', id: 'LIST' },
            ]
          : [{ type: 'ExpenseClaims', id: 'LIST' }],
    }),

    /**
     * Fetch KPI metrics for Expense Overview (Total Claimed, Pending, Reimbursed).
     */
    getExpensesSummary: builder.query<ExpensesSummaryMetrics, void>({
      query: () => '/expenses/summary',
      transformResponse: (response: any) => transformResponse<ExpensesSummaryMetrics>(response),
      providesTags: [{ type: 'ExpensesSummary', id: 'METRICS' }],
    }),

    /**
     * Retrieve specific expense claim with full line item details.
     */
    getExpenseClaimById: builder.query<ExpenseClaim, string>({
      query: (id) => `/expenses/claims/${encodeURIComponent(id)}`,
      transformResponse: (response: any) => transformResponse<ExpenseClaim>(response),
      providesTags: (_result, _error, id) => [{ type: 'ExpenseClaims', id }],
    }),

    /**
     * Submit a new expense claim.
     */
    createExpenseClaim: builder.mutation<ExpenseClaim, CreateExpenseClaimPayload>({
      query: (payload) => ({
        url: '/expenses/claims',
        method: 'POST',
        body: payload,
      }),
      transformResponse: (response: any) => transformResponse<ExpenseClaim>(response),
      invalidatesTags: [
        { type: 'ExpenseClaims', id: 'LIST' },
        { type: 'ExpensesSummary', id: 'METRICS' },
      ],
    }),

    /**
     * Update claim status (Approve, Mark as Paid, Reject).
     */
    updateExpenseClaimStatus: builder.mutation<ExpenseClaim, UpdateExpenseStatusPayload>({
      query: ({ id, ...body }) => ({
        url: `/expenses/claims/${encodeURIComponent(id)}/status`,
        method: 'PATCH',
        body,
      }),
      transformResponse: (response: any) => transformResponse<ExpenseClaim>(response),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'ExpenseClaims', id },
        { type: 'ExpenseClaims', id: 'LIST' },
        { type: 'ExpensesSummary', id: 'METRICS' },
      ],
    }),

    /**
     * Upload an expense receipt (PDF, PNG, JPG).
     */
    uploadReceipt: builder.mutation<ReceiptUploadResponse, FormData>({
      query: (formData) => ({
        url: '/expenses/receipts/upload',
        method: 'POST',
        body: formData,
      }),
      transformResponse: (response: any) => transformResponse<ReceiptUploadResponse>(response),
    }),

    /**
     * Delete or withdraw an expense claim.
     */
    deleteExpenseClaim: builder.mutation<{ success: boolean; id: string }, string>({
      query: (id) => ({
        url: `/expenses/claims/${encodeURIComponent(id)}`,
        method: 'DELETE',
      }),
      transformResponse: (response: any, _meta, id) => {
        const data = transformResponse<any>(response);
        return { success: Boolean(data?.success ?? true), id };
      },
      invalidatesTags: (_result, _error, id) => [
        { type: 'ExpenseClaims', id },
        { type: 'ExpenseClaims', id: 'LIST' },
        { type: 'ExpensesSummary', id: 'METRICS' },
      ],
    }),
  }),
});

export const {
  useGetExpenseClaimsQuery,
  useGetExpensesSummaryQuery,
  useGetExpenseClaimByIdQuery,
  useCreateExpenseClaimMutation,
  useUpdateExpenseClaimStatusMutation,
  useUploadReceiptMutation,
  useDeleteExpenseClaimMutation,
} = expensesApi;
