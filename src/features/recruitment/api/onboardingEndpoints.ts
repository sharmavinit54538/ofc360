import { recruitmentApi } from './recruitmentApi';
import { assertUuid, encodePathSegment, RecruitmentSearchParams, unwrapRecruitmentResponse, withSearchParams } from './confirmedEndpointUtils';
import { normalizeList } from '../utils/apiMappers';
import type { ApiList } from '../types';

export interface AdminEmployeeOnboardingParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  department?: string;
}

export type EmployeeOnboardingStep = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export const recruitmentOnboardingApi = recruitmentApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminEmployeeOnboarding: builder.query<ApiList<unknown>, AdminEmployeeOnboardingParams | void>({
      query: (params) => withSearchParams('/admin/employee-onboarding', params),
      transformResponse: (response: unknown) => normalizeList(response, (item) => item),
    }),
    getAdminEmployeeOnboardingById: builder.query<unknown, string>({
      query: (employeeId) => `/admin/employee-onboarding/${encodePathSegment(employeeId)}`,
      transformResponse: unwrapRecruitmentResponse,
    }),
    verifyAdminEmployeeOnboardingDocument: builder.mutation<unknown, { employeeId: string; documentId: string }>({
      query: ({ employeeId, documentId }) => {
        assertUuid(employeeId);
        assertUuid(documentId);
        return {
          url: `/admin/employee-onboarding/${encodePathSegment(employeeId)}/document/${encodePathSegment(documentId)}/verify`,
          method: 'PUT',
        };
      },
      transformResponse: unwrapRecruitmentResponse,
    }),
    saveEmployeeOnboardingStep: builder.mutation<unknown, { step: EmployeeOnboardingStep; data: unknown }>({
      query: ({ step, data }) => ({
        url: `/employee-onboarding/step/${step}`,
        method: 'PUT',
        body: data,
      }),
      transformResponse: unwrapRecruitmentResponse,
    }),
    uploadEmployeeOnboardingStepEight: builder.mutation<unknown, FormData>({
      query: (body) => ({ url: '/employee-onboarding/step/8/upload', method: 'POST', body }),
      transformResponse: unwrapRecruitmentResponse,
    }),
    deleteEmployeeOnboardingStepEightDocument: builder.mutation<unknown, string>({
      query: (documentId) => {
        assertUuid(documentId);
        return {
          url: `/employee-onboarding/step/8/document/${encodePathSegment(documentId)}`,
          method: 'DELETE',
        };
      },
      transformResponse: unwrapRecruitmentResponse,
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAdminEmployeeOnboardingQuery,
  useGetAdminEmployeeOnboardingByIdQuery,
  useVerifyAdminEmployeeOnboardingDocumentMutation,
  useSaveEmployeeOnboardingStepMutation,
  useUploadEmployeeOnboardingStepEightMutation,
  useDeleteEmployeeOnboardingStepEightDocumentMutation,
} = recruitmentOnboardingApi;
