/**
 * @file onboardingApi.ts
 * @description Enterprise RTK Query API service for Employee Onboarding,
 * Task Checklists, Document Uploads, and HR Verifications.
 * Plugs directly into OFC360 backend using baseQueryWithReauth.
 */

import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '@/shared/api/baseQuery';
import type {
  OnboardingChecklistResponse,
  UpdateTaskStatusPayload,
  VerifyOnboardingItemPayload,
  UploadDocumentResponse,
  NewHireListItem,
} from '../types/onboarding.types';

const transformResponse = <T>(response: any): T => {
  if (response && typeof response === 'object' && 'data' in response && response.data !== undefined) {
    return response.data as T;
  }
  return response as T;
};

export const onboardingApi = createApi({
  reducerPath: 'onboardingChecklistApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['OnboardingChecklist', 'NewHiresList'],
  endpoints: (builder) => ({
    /**
     * Retrieve current employee onboarding checklist with task breakdown and progress.
     */
    getOnboardingChecklist: builder.query<OnboardingChecklistResponse, string | void>({
      query: (employeeId) => {
        return `/onboarding/checklist${employeeId ? `?employeeId=${encodeURIComponent(employeeId)}` : ''}`;
      },
      transformResponse: (response: any) => transformResponse<OnboardingChecklistResponse>(response),
      providesTags: ['OnboardingChecklist'],
    }),

    /**
     * Retrieve company-wide list of new hires undergoing onboarding (for HR Admins).
     */
    getNewHiresList: builder.query<NewHireListItem[], string | void>({
      query: (search) => {
        return `/onboarding/new-hires${search ? `?search=${encodeURIComponent(search)}` : ''}`;
      },
      transformResponse: (response: any): NewHireListItem[] => {
        const data = transformResponse<any>(response);
        if (Array.isArray(data)) return data;
        return data?.items || data?.newHires || [];
      },
      providesTags: ['NewHiresList'],
    }),

    /**
     * Update an onboarding task's status (e.g. In Progress, Completed).
     */
    updateTaskStatus: builder.mutation<void, UpdateTaskStatusPayload>({
      query: ({ taskId, ...body }) => ({
        url: `/onboarding/tasks/${encodeURIComponent(taskId)}/status`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['OnboardingChecklist', 'NewHiresList'],
    }),

    /**
     * Upload an onboarding verification document (ID proof, tax forms, academic certificates).
     */
    uploadOnboardingDocument: builder.mutation<UploadDocumentResponse, FormData>({
      query: (formData) => ({
        url: '/onboarding/documents/upload',
        method: 'POST',
        body: formData,
      }),
      transformResponse: (response: any) => transformResponse<UploadDocumentResponse>(response),
    }),

    /**
     * Link an uploaded document to an onboarding task and submit for HR review.
     */
    submitDocumentTask: builder.mutation<
      void,
      { taskId: string; employeeId?: string; documentUrl: string; documentName: string; documentSize?: number }
    >({
      query: ({ taskId, ...body }) => ({
        url: `/onboarding/tasks/${encodeURIComponent(taskId)}/document`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['OnboardingChecklist', 'NewHiresList'],
    }),

    /**
     * HR Admin verification: Approve or reject a submitted onboarding item with feedback.
     */
    verifyOnboardingItem: builder.mutation<void, VerifyOnboardingItemPayload>({
      query: ({ taskId, ...body }) => ({
        url: `/onboarding/tasks/${encodeURIComponent(taskId)}/verify`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['OnboardingChecklist', 'NewHiresList'],
    }),
  }),
});

export const {
  useGetOnboardingChecklistQuery,
  useGetNewHiresListQuery,
  useUpdateTaskStatusMutation,
  useUploadOnboardingDocumentMutation,
  useSubmitDocumentTaskMutation,
  useVerifyOnboardingItemMutation,
} = onboardingApi;
