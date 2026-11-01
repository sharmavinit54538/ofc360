import { recruitmentApi } from './recruitmentApi';
import { mapOffer, normalizeList } from '../utils/apiMappers';
import { assertUuid, apiV2Url, encodePathSegment, unwrapRecruitmentResponse, withSearchParams } from './confirmedEndpointUtils';
import type { ApiList, Offer } from '../types';

export interface RequisitionCreatePayload {
  title: string;
  department: string;
  headcount: number;
  planned_quarter: string;
  priority: string;
  budget_min: number;
  budget_max: number;
  currency: string;
  skills: string[];
  experience_level: string;
  justification: string;
}

export interface VendorCreatePayload {
  name: string;
  contact_name: string;
  email: string;
  phone: string;
  commission_rate: number;
  status: string;
}

export interface ReferralCreatePayload {
  candidate_id: string;
  employee_id: string;
  job_id: string | null;
  reward_amount: number;
}

export interface AutomationRuleCreatePayload {
  name: string;
  description: string;
  trigger_event: string;
  action: string;
  enabled: boolean;
}

export const recruitmentOperationsApi = recruitmentApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminOffers: builder.query<ApiList<Offer>, void>({
      query: () => '/offers',
      transformResponse: (response: unknown) => normalizeList(response, mapOffer),
      providesTags: ['RecruitmentStats'],
    }),
    acceptAdminOffer: builder.mutation<unknown, string>({
      query: (id) => {
        assertUuid(id);
        return { url: `/offers/${encodePathSegment(id)}/accept`, method: 'PATCH' };
      },
      transformResponse: unwrapRecruitmentResponse,
      invalidatesTags: ['RecruitmentStats', 'CandidatesList'],
    }),
    rejectAdminOffer: builder.mutation<unknown, string>({
      query: (id) => {
        assertUuid(id);
        return { url: `/offers/${encodePathSegment(id)}/reject`, method: 'PATCH' };
      },
      transformResponse: unwrapRecruitmentResponse,
      invalidatesTags: ['RecruitmentStats', 'CandidatesList'],
    }),
    generateOfferLetter: builder.mutation<unknown, unknown>({
      query: (body) => ({ url: apiV2Url('/api/v2/offer-letters/generate'), method: 'POST', body }),
      transformResponse: unwrapRecruitmentResponse,
    }),
    downloadOfferLetter: builder.query<Blob, string>({
      query: (filename) => ({
        url: apiV2Url(`/api/v2/offer-letters/download/${encodePathSegment(filename)}`),
        responseHandler: 'blob',
      }),
      transformResponse: (response: Blob) => response,
    }),

    getRequisitions: builder.query<ApiList<unknown>, void>({
      query: () => '/requisitions',
      transformResponse: (response: unknown) => normalizeList(response, (item) => item),
    }),
    getRequisitionById: builder.query<unknown, string>({
      query: (id) => `/requisitions/${encodePathSegment(id)}`,
      transformResponse: unwrapRecruitmentResponse,
    }),
    createRequisition: builder.mutation<unknown, RequisitionCreatePayload>({
      query: (body) => ({ url: '/requisitions', method: 'POST', body }),
      transformResponse: unwrapRecruitmentResponse,
    }),
    approveRequisition: builder.mutation<unknown, string>({
      query: (id) => {
        assertUuid(id);
        return { url: `/requisitions/${encodePathSegment(id)}/approve`, method: 'POST' };
      },
      transformResponse: unwrapRecruitmentResponse,
    }),

    getVendors: builder.query<ApiList<unknown>, void>({
      query: () => '/vendors?limit=100',
      transformResponse: (response: unknown) => normalizeList(response, (item) => item),
    }),
    createVendor: builder.mutation<unknown, VendorCreatePayload>({
      query: (body) => ({ url: '/vendors', method: 'POST', body }),
      transformResponse: unwrapRecruitmentResponse,
    }),
    updateVendor: builder.mutation<unknown, { id: string; data: unknown }>({
      query: ({ id, data }) => {
        assertUuid(id);
        return { url: `/vendors/${encodePathSegment(id)}`, method: 'PUT', body: data };
      },
      transformResponse: unwrapRecruitmentResponse,
    }),
    deleteVendor: builder.mutation<unknown, string>({
      query: (id) => {
        assertUuid(id);
        return { url: `/vendors/${encodePathSegment(id)}`, method: 'DELETE' };
      },
      transformResponse: unwrapRecruitmentResponse,
    }),

    getReferrals: builder.query<ApiList<unknown>, void>({
      query: () => '/referrals?limit=100',
      transformResponse: (response: unknown) => normalizeList(response, (item) => item),
    }),
    createReferral: builder.mutation<unknown, ReferralCreatePayload>({
      query: (body) => ({ url: '/referrals', method: 'POST', body }),
      transformResponse: unwrapRecruitmentResponse,
    }),
    updateReferralStatus: builder.mutation<unknown, { id: string; data: unknown }>({
      query: ({ id, data }) => {
        assertUuid(id);
        return { url: `/referrals/${encodePathSegment(id)}/status`, method: 'PUT', body: data };
      },
      transformResponse: unwrapRecruitmentResponse,
    }),
    getReferralEmployees: builder.query<ApiList<unknown>, void>({
      query: () => '/employees?limit=200',
      transformResponse: (response: unknown) => normalizeList(response, (item) => item),
    }),
    getReferralDepartments: builder.query<ApiList<unknown>, void>({
      query: () => '/departments?limit=100',
      transformResponse: (response: unknown) => normalizeList(response, (item) => item),
    }),

    getAutomationRules: builder.query<ApiList<unknown>, void>({
      query: () => '/automations/rules',
      transformResponse: (response: unknown) => normalizeList(response, (item) => item),
    }),
    createAutomationRule: builder.mutation<unknown, AutomationRuleCreatePayload>({
      query: (body) => ({ url: '/automations/rules', method: 'POST', body }),
      transformResponse: unwrapRecruitmentResponse,
    }),
    toggleAutomationRule: builder.mutation<unknown, string>({
      query: (id) => {
        assertUuid(id);
        return { url: `/global-notifications/automation-rules/${encodePathSegment(id)}/toggle`, method: 'POST' };
      },
      transformResponse: unwrapRecruitmentResponse,
    }),
    testAutomationRule: builder.mutation<unknown, string>({
      query: (id) => {
        assertUuid(id);
        return { url: `/global-notifications/automation-rules/${encodePathSegment(id)}/test`, method: 'POST' };
      },
      transformResponse: unwrapRecruitmentResponse,
    }),

    getRecruitmentNotifications: builder.query<ApiList<unknown>, void>({
      query: () => '/recruitment/notifications',
      transformResponse: (response: unknown) => normalizeList(response, (item) => item),
    }),
    markRecruitmentNotificationRead: builder.mutation<unknown, string>({
      query: (id) => {
        assertUuid(id);
        return { url: `/recruitment/notifications/${encodePathSegment(id)}/read`, method: 'PUT' };
      },
      transformResponse: unwrapRecruitmentResponse,
    }),

    getDocumentTemplates: builder.query<ApiList<unknown>, void>({
      query: () => '/document-templates',
      transformResponse: (response: unknown) => normalizeList(response, (item) => item),
    }),
    createDocumentTemplate: builder.mutation<unknown, unknown>({
      query: (body) => ({ url: '/document-templates', method: 'POST', body }),
      transformResponse: unwrapRecruitmentResponse,
    }),
    generateDocumentTemplate: builder.mutation<unknown, string>({
      query: (id) => {
        assertUuid(id);
        return { url: `/document-templates/${encodePathSegment(id)}/generate`, method: 'POST' };
      },
      transformResponse: unwrapRecruitmentResponse,
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAdminOffersQuery,
  useAcceptAdminOfferMutation,
  useRejectAdminOfferMutation,
  useGenerateOfferLetterMutation,
  useDownloadOfferLetterQuery,
  useGetRequisitionsQuery,
  useGetRequisitionByIdQuery,
  useCreateRequisitionMutation,
  useApproveRequisitionMutation,
  useGetVendorsQuery,
  useCreateVendorMutation,
  useUpdateVendorMutation,
  useDeleteVendorMutation,
  useGetReferralsQuery,
  useCreateReferralMutation,
  useUpdateReferralStatusMutation,
  useGetReferralEmployeesQuery,
  useGetReferralDepartmentsQuery,
  useGetAutomationRulesQuery,
  useCreateAutomationRuleMutation,
  useToggleAutomationRuleMutation,
  useTestAutomationRuleMutation,
  useGetRecruitmentNotificationsQuery,
  useMarkRecruitmentNotificationReadMutation,
  useGetDocumentTemplatesQuery,
  useCreateDocumentTemplateMutation,
  useGenerateDocumentTemplateMutation,
} = recruitmentOperationsApi;
