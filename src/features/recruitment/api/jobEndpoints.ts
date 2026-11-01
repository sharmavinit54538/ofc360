import { recruitmentApi } from './recruitmentApi';
import { mapJob, normalizeList, toJobWritePayload } from '../utils/apiMappers';
import type { ApiList, Job } from '../types';
import {
  assertUuid,
  encodePathSegment,
  RecruitmentSearchParams,
  unwrapRecruitmentResponse,
  withSearchParams,
} from './confirmedEndpointUtils';

export interface JobPublishPayload {
  platform: string;
  salary_visible: boolean;
  remote_option: boolean;
  employment_type: string;
  skills: string[];
  category: string;
  application_method: string;
  expiry_date?: string;
}

export const recruitmentJobsApi = recruitmentApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminJobs: builder.query<ApiList<Job>, RecruitmentSearchParams | void>({
      query: (params) => withSearchParams('/jobs', params),
      transformResponse: (response: unknown) => normalizeList(response, mapJob),
      providesTags: (result) => [
        { type: 'JobsList', id: 'LIST' },
        ...(result?.items.map((job) => ({ type: 'JobsList' as const, id: job.id })) ?? []),
      ],
    }),
    getAdminJobById: builder.query<Job, string>({
      query: (id) => `/jobs/${encodePathSegment(id)}`,
      transformResponse: (response: unknown) => mapJob(unwrapRecruitmentResponse(response)),
      providesTags: (_result, _error, id) => [{ type: 'JobDetail', id }],
    }),
    createAdminJob: builder.mutation<Job, Job>({
      query: (job) => ({ url: '/jobs', method: 'POST', body: toJobWritePayload(job) }),
      transformResponse: (response: unknown) => mapJob(unwrapRecruitmentResponse(response)),
      invalidatesTags: ['JobsList', 'RecruitmentStats'],
    }),
    updateAdminJob: builder.mutation<Job, { id: string; job: Job }>({
      query: ({ id, job }) => {
        assertUuid(id);
        return { url: `/jobs/${encodePathSegment(id)}`, method: 'PUT', body: toJobWritePayload(job) };
      },
      transformResponse: (response: unknown) => mapJob(unwrapRecruitmentResponse(response)),
      invalidatesTags: (_result, _error, { id }) => ['JobsList', { type: 'JobDetail', id }, 'RecruitmentStats'],
    }),
    deleteAdminJob: builder.mutation<unknown, string>({
      query: (id) => {
        assertUuid(id);
        return { url: `/jobs/${encodePathSegment(id)}`, method: 'DELETE' };
      },
      transformResponse: unwrapRecruitmentResponse,
      invalidatesTags: ['JobsList', 'RecruitmentStats'],
    }),
    closeAdminJob: builder.mutation<unknown, string>({
      query: (id) => {
        assertUuid(id);
        return { url: `/jobs/${encodePathSegment(id)}/close`, method: 'POST' };
      },
      transformResponse: unwrapRecruitmentResponse,
      invalidatesTags: ['JobsList', 'RecruitmentStats'],
    }),
    duplicateAdminJob: builder.mutation<unknown, string>({
      query: (id) => {
        assertUuid(id);
        return { url: `/jobs/${encodePathSegment(id)}/duplicate`, method: 'POST' };
      },
      transformResponse: unwrapRecruitmentResponse,
      invalidatesTags: ['JobsList', 'RecruitmentStats'],
    }),
    saveAdminJobDraft: builder.mutation<unknown, string>({
      query: (id) => {
        assertUuid(id);
        return { url: `/jobs/${encodePathSegment(id)}/draft`, method: 'POST' };
      },
      transformResponse: unwrapRecruitmentResponse,
      invalidatesTags: ['JobsList', 'RecruitmentStats'],
    }),
    getAdminJobPublication: builder.query<unknown, string>({
      query: (id) => `/jobs/${encodePathSegment(id)}/publish`,
      transformResponse: unwrapRecruitmentResponse,
    }),
    publishAdminJob: builder.mutation<unknown, { id: string; data: JobPublishPayload }>({
      query: ({ id, data }) => {
        assertUuid(id);
        return { url: `/jobs/${encodePathSegment(id)}/publish`, method: 'POST', body: data };
      },
      transformResponse: unwrapRecruitmentResponse,
      invalidatesTags: ['JobsList', 'RecruitmentStats'],
    }),
    getAdminJobSourcingLink: builder.query<unknown, string>({
      query: (id) => `/jobs/${encodePathSegment(id)}/sourcing-link`,
      transformResponse: unwrapRecruitmentResponse,
    }),
    getAdminJobQr: builder.query<unknown, string>({
      query: (id) => `/jobs/${encodePathSegment(id)}/qr`,
      transformResponse: unwrapRecruitmentResponse,
    }),
    exportAdminJobApplicants: builder.query<Blob, string>({
      query: (id) => ({ url: `/jobs/${encodePathSegment(id)}/applicants/export`, responseHandler: 'blob' }),
      transformResponse: (response: Blob) => response,
    }),
    generateJobDescription: builder.mutation<unknown, unknown>({
      query: (body) => ({ url: '/recruitment/jobs/generate-description', method: 'POST', body }),
      transformResponse: unwrapRecruitmentResponse,
    }),
    modifyJobDescription: builder.mutation<unknown, unknown>({
      query: (body) => ({ url: '/recruitment/jobs/modify-description', method: 'POST', body }),
      transformResponse: unwrapRecruitmentResponse,
    }),
    autoFillAdminJob: builder.mutation<unknown, unknown>({
      query: (body) => ({ url: '/jobs/ai-autofill', method: 'POST', body }),
      transformResponse: unwrapRecruitmentResponse,
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAdminJobsQuery,
  useGetAdminJobByIdQuery,
  useCreateAdminJobMutation,
  useUpdateAdminJobMutation,
  useDeleteAdminJobMutation,
  useCloseAdminJobMutation,
  useDuplicateAdminJobMutation,
  useSaveAdminJobDraftMutation,
  useGetAdminJobPublicationQuery,
  usePublishAdminJobMutation,
  useGetAdminJobSourcingLinkQuery,
  useGetAdminJobQrQuery,
  useExportAdminJobApplicantsQuery,
  useGenerateJobDescriptionMutation,
  useModifyJobDescriptionMutation,
  useAutoFillAdminJobMutation,
} = recruitmentJobsApi;
