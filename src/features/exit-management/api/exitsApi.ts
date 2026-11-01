/**
 * @file exitsApi.ts
 * @description Enterprise RTK Query API service for Exit Management (14-Stage Workflow).
 * Backed by live /api/v1/exits/* routes, defensive response mappers, and robust tag invalidation.
 */

import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '@/shared/api/baseQuery';
import type {
  ExitCase,
  ExitCaseListResponse,
  ExitFilters,
  ExitAnalyticsMetrics,
  ResignPayload,
  ManagerApprovePayload,
  ManagerRejectPayload,
  HrApprovePayload,
  HrRejectPayload,
  StartNoticePeriodPayload,
  KtCompletePayload,
  AssetReturnPayload,
  ClearanceSignoffPayload,
  FnFUpdatePayload,
  ExitInterviewPayload,
  GenerateDocumentsPayload,
  CompleteExitPayload,
  ExitAssetItem,
  ExitDocumentItem,
  FnFSettlement,
} from '../types/exit.types';
import {
  mapExitCase,
  mapExitCaseListResponse,
  mapExitAnalyticsMetrics,
  mapExitAssets,
  mapExitDocuments,
  mapFnFSettlement,
  unwrapApiResponse,
} from '../mappers/exitMappers';

export const exitsApi = createApi({
  reducerPath: 'exitsApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    'ExitCases',
    'ExitStats',
    'MyExitRequest',
    'ExitAssets',
    'ExitDocuments',
    'ExitFnF',
  ],
  endpoints: (builder) => ({
    /**
     * Retrieve paginated exit cases with search, stage, department, and status filters.
     * Route: GET /api/v1/exits
     */
    getExitCases: builder.query<ExitCaseListResponse, ExitFilters | void>({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters?.search) params.append('search', filters.search);
        if (filters?.stage && filters.stage !== 'ALL') params.append('stage', filters.stage);
        if (filters?.department && filters.department !== 'ALL') params.append('department', filters.department);
        if (filters?.exitStatus && filters.exitStatus !== 'ALL') params.append('status', filters.exitStatus);
        if (filters?.fnfStatus && filters.fnfStatus !== 'ALL') params.append('fnf_status', filters.fnfStatus);
        if (filters?.startDate) params.append('start_date', filters.startDate);
        if (filters?.endDate) params.append('end_date', filters.endDate);
        if (filters?.page) params.append('page', String(filters.page));
        if (filters?.limit) params.append('limit', String(filters.limit));

        const queryString = params.toString();
        return `/exits${queryString ? `?${queryString}` : ''}`;
      },
      transformResponse: (response: unknown): ExitCaseListResponse =>
        mapExitCaseListResponse(response),
      providesTags: (result) =>
        result?.items
          ? [
              ...result.items.map(({ id }) => ({ type: 'ExitCases' as const, id })),
              { type: 'ExitCases', id: 'LIST' },
            ]
          : [{ type: 'ExitCases', id: 'LIST' }],
    }),

    /**
     * Fetch KPI metrics summary for Exit Overview.
     * Route: GET /api/v1/exits/stats
     */
    getExitStats: builder.query<ExitAnalyticsMetrics, void>({
      query: () => '/exits/stats',
      transformResponse: (response: unknown): ExitAnalyticsMetrics =>
        mapExitAnalyticsMetrics(response),
      providesTags: [{ type: 'ExitStats', id: 'METRICS' }],
    }),

    /**
     * Retrieve specific exit case by ID with full details.
     * Route: GET /api/v1/exits/{id}
     */
    getExitCaseById: builder.query<ExitCase, string>({
      query: (id) => `/exits/${encodeURIComponent(id)}`,
      transformResponse: (response: unknown): ExitCase =>
        mapExitCase(unwrapApiResponse(response)),
      providesTags: (_result, _error, id) => [{ type: 'ExitCases', id }],
    }),

    /**
     * Retrieve the currently logged-in employee's active exit request.
     * Route: GET /api/v1/exits/my-request
     */
    getMyExitRequest: builder.query<ExitCase | null, void>({
      query: () => '/exits/my-request',
      transformResponse: (response: unknown): ExitCase | null => {
        const unwrapped = unwrapApiResponse(response);
        if (!unwrapped || (typeof unwrapped === 'object' && Object.keys(unwrapped).length === 0)) {
          return null;
        }
        return mapExitCase(unwrapped);
      },
      providesTags: [{ type: 'MyExitRequest', id: 'CURRENT' }],
    }),

    /**
     * Submit an employee resignation (ESS).
     * Route: POST /api/v1/exits/resign
     */
    submitResignation: builder.mutation<ExitCase, ResignPayload>({
      query: (payload) => ({
        url: '/exits/resign',
        method: 'POST',
        body: {
          reason: payload.reason,
          comments: payload.comments,
          proposed_last_working_day: payload.proposedLastWorkingDay,
          resignation_date: payload.resignationDate,
          notice_period_days: payload.noticePeriodDays,
        },
      }),
      transformResponse: (response: unknown): ExitCase =>
        mapExitCase(unwrapApiResponse(response)),
      invalidatesTags: [
        { type: 'MyExitRequest', id: 'CURRENT' },
        { type: 'ExitCases', id: 'LIST' },
        { type: 'ExitStats', id: 'METRICS' },
      ],
    }),

    /**
     * Withdraw currently active resignation request (ESS).
     * Route: DELETE /api/v1/exits/my-request
     */
    withdrawMyRequest: builder.mutation<{ success: boolean; message?: string }, void>({
      query: () => ({
        url: '/exits/my-request',
        method: 'DELETE',
      }),
      invalidatesTags: [
        { type: 'MyExitRequest', id: 'CURRENT' },
        { type: 'ExitCases', id: 'LIST' },
        { type: 'ExitStats', id: 'METRICS' },
      ],
    }),

    /**
     * Manager approval of resignation request.
     * Route: PATCH /api/v1/exits/{id}/manager-approve
     */
    managerApprove: builder.mutation<ExitCase, ManagerApprovePayload>({
      query: ({ id, comments }) => ({
        url: `/exits/${encodeURIComponent(id)}/manager-approve`,
        method: 'PATCH',
        body: { comments },
      }),
      transformResponse: (response: unknown): ExitCase =>
        mapExitCase(unwrapApiResponse(response)),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'ExitCases', id },
        { type: 'ExitCases', id: 'LIST' },
        { type: 'ExitStats', id: 'METRICS' },
        { type: 'MyExitRequest', id: 'CURRENT' },
      ],
    }),

    /**
     * Manager rejection of resignation request.
     * Route: PATCH /api/v1/exits/{id}/manager-reject
     */
    managerReject: builder.mutation<ExitCase, ManagerRejectPayload>({
      query: ({ id, rejectionReason }) => ({
        url: `/exits/${encodeURIComponent(id)}/manager-reject`,
        method: 'PATCH',
        body: { rejection_reason: rejectionReason },
      }),
      transformResponse: (response: unknown): ExitCase =>
        mapExitCase(unwrapApiResponse(response)),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'ExitCases', id },
        { type: 'ExitCases', id: 'LIST' },
        { type: 'ExitStats', id: 'METRICS' },
        { type: 'MyExitRequest', id: 'CURRENT' },
      ],
    }),

    /**
     * HR approval of exit case.
     * Route: PATCH /api/v1/exits/{id}/approve
     */
    hrApprove: builder.mutation<ExitCase, HrApprovePayload>({
      query: ({ id, comments, lastWorkingDay }) => ({
        url: `/exits/${encodeURIComponent(id)}/approve`,
        method: 'PATCH',
        body: {
          comments,
          last_working_day: lastWorkingDay,
        },
      }),
      transformResponse: (response: unknown): ExitCase =>
        mapExitCase(unwrapApiResponse(response)),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'ExitCases', id },
        { type: 'ExitCases', id: 'LIST' },
        { type: 'ExitStats', id: 'METRICS' },
        { type: 'MyExitRequest', id: 'CURRENT' },
      ],
    }),

    /**
     * HR rejection of exit case.
     * Route: PATCH /api/v1/exits/{id}/reject
     */
    hrReject: builder.mutation<ExitCase, HrRejectPayload>({
      query: ({ id, rejectionReason }) => ({
        url: `/exits/${encodeURIComponent(id)}/reject`,
        method: 'PATCH',
        body: { rejection_reason: rejectionReason },
      }),
      transformResponse: (response: unknown): ExitCase =>
        mapExitCase(unwrapApiResponse(response)),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'ExitCases', id },
        { type: 'ExitCases', id: 'LIST' },
        { type: 'ExitStats', id: 'METRICS' },
        { type: 'MyExitRequest', id: 'CURRENT' },
      ],
    }),

    /**
     * Formally initiate notice period tracking.
     * Route: PATCH /api/v1/exits/{id}/start-notice-period
     */
    startNoticePeriod: builder.mutation<ExitCase, StartNoticePeriodPayload>({
      query: ({ id, lastWorkingDay, remarks }) => ({
        url: `/exits/${encodeURIComponent(id)}/start-notice-period`,
        method: 'PATCH',
        body: {
          last_working_day: lastWorkingDay,
          remarks,
        },
      }),
      transformResponse: (response: unknown): ExitCase =>
        mapExitCase(unwrapApiResponse(response)),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'ExitCases', id },
        { type: 'ExitCases', id: 'LIST' },
        { type: 'ExitStats', id: 'METRICS' },
      ],
    }),

    /**
     * Sign off Knowledge Transfer (KT) completion.
     * Route: PATCH /api/v1/exits/{id}/knowledge-transfer-complete
     */
    completeKnowledgeTransfer: builder.mutation<ExitCase, KtCompletePayload>({
      query: ({ id, remarks }) => ({
        url: `/exits/${encodeURIComponent(id)}/knowledge-transfer-complete`,
        method: 'PATCH',
        body: { remarks },
      }),
      transformResponse: (response: unknown): ExitCase =>
        mapExitCase(unwrapApiResponse(response)),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'ExitCases', id },
        { type: 'ExitCases', id: 'LIST' },
      ],
    }),

    /**
     * Retrieve assigned assets for an exit case.
     * Route: GET /api/v1/exits/{id}/assets
     */
    getExitAssets: builder.query<ExitAssetItem[], string>({
      query: (id) => `/exits/${encodeURIComponent(id)}/assets`,
      transformResponse: (response: unknown): ExitAssetItem[] =>
        mapExitAssets(unwrapApiResponse(response)),
      providesTags: (_result, _error, id) => [{ type: 'ExitAssets', id }],
    }),

    /**
     * Mark an assigned asset as returned or condition verified.
     * Route: PATCH /api/v1/exits/{id}/asset-return
     */
    returnExitAsset: builder.mutation<ExitCase, AssetReturnPayload>({
      query: ({ id, assetId, condition, recoveryAmount, remarks }) => ({
        url: `/exits/${encodeURIComponent(id)}/asset-return`,
        method: 'PATCH',
        body: {
          asset_id: assetId,
          condition,
          recovery_amount: recoveryAmount,
          remarks,
        },
      }),
      transformResponse: (response: unknown): ExitCase =>
        mapExitCase(unwrapApiResponse(response)),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'ExitCases', id },
        { type: 'ExitAssets', id },
      ],
    }),

    /**
     * Submit departmental clearance signoff (Manager, IT, Finance, Admin, HR).
     * Route: PATCH /api/v1/exits/{id}/clearance
     */
    submitClearanceSignoff: builder.mutation<ExitCase, ClearanceSignoffPayload>({
      query: ({ id, department, status, remarks, reason }) => ({
        url: `/exits/${encodeURIComponent(id)}/clearance`,
        method: 'PATCH',
        body: {
          department,
          status,
          remarks,
          reason,
        },
      }),
      transformResponse: (response: unknown): ExitCase =>
        mapExitCase(unwrapApiResponse(response)),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'ExitCases', id },
        { type: 'ExitCases', id: 'LIST' },
        { type: 'ExitStats', id: 'METRICS' },
      ],
    }),

    /**
     * Retrieve Full & Final calculation preview.
     * Route: GET /api/v1/exits/{id}/fnf-preview
     */
    getFnFPreview: builder.query<FnFSettlement, string>({
      query: (id) => `/exits/${encodeURIComponent(id)}/fnf-preview`,
      transformResponse: (response: unknown): FnFSettlement =>
        mapFnFSettlement(unwrapApiResponse(response)),
      providesTags: (_result, _error, id) => [{ type: 'ExitFnF', id }],
    }),

    /**
     * Process or update Full & Final settlement.
     * Route: PATCH /api/v1/exits/{id}/fnf
     */
    updateFnFSettlement: builder.mutation<ExitCase, FnFUpdatePayload>({
      query: ({ id, status, earnings, deductions, holdReason, transactionId, remarks }) => ({
        url: `/exits/${encodeURIComponent(id)}/fnf`,
        method: 'PATCH',
        body: {
          status,
          earnings,
          deductions,
          hold_reason: holdReason,
          transaction_id: transactionId,
          remarks,
        },
      }),
      transformResponse: (response: unknown): ExitCase =>
        mapExitCase(unwrapApiResponse(response)),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'ExitCases', id },
        { type: 'ExitFnF', id },
        { type: 'ExitStats', id: 'METRICS' },
      ],
    }),

    /**
     * Submit exit interview feedback.
     * Route: POST /api/v1/exits/{id}/exit-interview
     */
    submitExitInterview: builder.mutation<ExitCase, ExitInterviewPayload>({
      query: ({ id, ...body }) => ({
        url: `/exits/${encodeURIComponent(id)}/exit-interview`,
        method: 'POST',
        body: {
          reason_for_leaving: body.reasonForLeaving,
          work_environment_rating: body.workEnvironmentRating,
          manager_behaviour_rating: body.managerBehaviourRating,
          salary_benefits_rating: body.salaryBenefitsRating,
          career_growth_rating: body.careerGrowthRating,
          what_should_improve: body.whatShouldImprove,
          would_rejoin: body.wouldRejoin,
          additional_comments: body.additionalComments,
        },
      }),
      transformResponse: (response: unknown): ExitCase =>
        mapExitCase(unwrapApiResponse(response)),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'ExitCases', id },
        { type: 'ExitCases', id: 'LIST' },
      ],
    }),

    /**
     * Retrieve generated exit documents.
     * Route: GET /api/v1/exits/{id}/documents
     */
    getExitDocuments: builder.query<ExitDocumentItem[], string>({
      query: (id) => `/exits/${encodeURIComponent(id)}/documents`,
      transformResponse: (response: unknown): ExitDocumentItem[] =>
        mapExitDocuments(unwrapApiResponse(response)),
      providesTags: (_result, _error, id) => [{ type: 'ExitDocuments', id }],
    }),

    /**
     * Trigger generation of exit documents.
     * Route: POST /api/v1/exits/{id}/generate-documents
     */
    generateExitDocuments: builder.mutation<ExitDocumentItem[], GenerateDocumentsPayload>({
      query: ({ id, documentTypes }) => ({
        url: `/exits/${encodeURIComponent(id)}/generate-documents`,
        method: 'POST',
        body: {
          document_types: documentTypes,
        },
      }),
      transformResponse: (response: unknown): ExitDocumentItem[] =>
        mapExitDocuments(unwrapApiResponse(response)),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'ExitCases', id },
        { type: 'ExitDocuments', id },
      ],
    }),

    /**
     * Mark an exit case as fully completed.
     * Route: PATCH /api/v1/exits/{id}/complete
     */
    completeExit: builder.mutation<ExitCase, CompleteExitPayload>({
      query: ({ id, remarks }) => ({
        url: `/exits/${encodeURIComponent(id)}/complete`,
        method: 'PATCH',
        body: { remarks },
      }),
      transformResponse: (response: unknown): ExitCase =>
        mapExitCase(unwrapApiResponse(response)),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'ExitCases', id },
        { type: 'ExitCases', id: 'LIST' },
        { type: 'ExitStats', id: 'METRICS' },
      ],
    }),
  }),
});

export const {
  useGetExitCasesQuery,
  useGetExitStatsQuery,
  useGetExitCaseByIdQuery,
  useGetMyExitRequestQuery,
  useSubmitResignationMutation,
  useWithdrawMyRequestMutation,
  useManagerApproveMutation,
  useManagerRejectMutation,
  useHrApproveMutation,
  useHrRejectMutation,
  useStartNoticePeriodMutation,
  useCompleteKnowledgeTransferMutation,
  useGetExitAssetsQuery,
  useReturnExitAssetMutation,
  useSubmitClearanceSignoffMutation,
  useGetFnFPreviewQuery,
  useUpdateFnFSettlementMutation,
  useSubmitExitInterviewMutation,
  useGetExitDocumentsQuery,
  useGenerateExitDocumentsMutation,
  useCompleteExitMutation,
} = exitsApi;
