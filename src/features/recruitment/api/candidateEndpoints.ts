import { recruitmentApi } from './recruitmentApi';
import { assertUuid, encodePathSegment, RecruitmentSearchParams, unwrapRecruitmentResponse, withSearchParams } from './confirmedEndpointUtils';
import { mapCandidate, normalizeList, toCandidateWritePayload } from '../utils/apiMappers';
import type { ApiList, Candidate, Stage } from '../types';

export interface ApplicationOfferPayload {
  ctc: number;
  joining_date: string;
  offer_expiry_date?: string;
}

export interface CrmNotePayload {
  candidate_id: string;
  note_text: string;
}

export interface ApplicationStagePayload {
  stage: Stage;
}

export interface ApplicationInterviewParams {
  id: string;
  round_names: string;
}

const updateApplicationPath = (id: string, action: 'shortlist' | 'reject' | 'hold'): string => {
  assertUuid(id);
  return `/applications/${encodePathSegment(id)}/${action}`;
};

export const recruitmentCandidatesApi = recruitmentApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminCandidates: builder.query<ApiList<Candidate>, RecruitmentSearchParams | void>({
      query: (params) => withSearchParams('/candidates', params),
      transformResponse: (response: unknown) => normalizeList(response, mapCandidate),
      providesTags: (result) => [
        { type: 'CandidatesList', id: 'LIST' },
        ...(result?.items.map((candidate) => ({ type: 'CandidatesList' as const, id: candidate.id })) ?? []),
      ],
    }),
    getAdminCandidateById: builder.query<Candidate, string>({
      query: (id) => `/candidates/${encodePathSegment(id)}`,
      transformResponse: (response: unknown) => mapCandidate(unwrapRecruitmentResponse(response)),
      providesTags: (_result, _error, id) => [{ type: 'CandidateDetail', id }],
    }),
    createAdminCandidate: builder.mutation<Candidate, Candidate>({
      query: (candidate) => ({ url: '/candidates', method: 'POST', body: toCandidateWritePayload(candidate) }),
      transformResponse: (response: unknown) => mapCandidate(unwrapRecruitmentResponse(response)),
      invalidatesTags: ['CandidatesList', 'RecruitmentStats'],
    }),
    updateAdminCandidate: builder.mutation<Candidate, { id: string; candidate: Candidate }>({
      query: ({ id, candidate }) => {
        assertUuid(id);
        return {
          url: `/candidates/${encodePathSegment(id)}`,
          method: 'PUT',
          body: toCandidateWritePayload(candidate),
        };
      },
      transformResponse: (response: unknown) => mapCandidate(unwrapRecruitmentResponse(response)),
      invalidatesTags: (_result, _error, { id }) => ['CandidatesList', { type: 'CandidateDetail', id }, 'RecruitmentStats'],
    }),
    exportAdminCandidatesCsv: builder.query<Blob, void>({
      query: () => ({ url: '/candidates/export/csv', responseHandler: 'blob' }),
      transformResponse: (response: Blob) => response,
    }),
    importAdminCandidates: builder.mutation<unknown, File>({
      query: (file) => {
        const body = new FormData();
        body.append('file', file);
        return { url: '/candidates/import', method: 'POST', body };
      },
      transformResponse: unwrapRecruitmentResponse,
      invalidatesTags: ['CandidatesList', 'RecruitmentStats'],
    }),
    getApplications: builder.query<ApiList<unknown>, RecruitmentSearchParams | void>({
      query: (params) => withSearchParams('/applications', params),
      transformResponse: (response: unknown) => normalizeList(response, (item) => item),
      providesTags: ['CandidatesList'],
    }),
    getApplicationStats: builder.query<unknown, void>({
      query: () => '/applications/stats',
      transformResponse: unwrapRecruitmentResponse,
      providesTags: ['RecruitmentStats'],
    }),
    updateApplicationStage: builder.mutation<unknown, { applicationId: string; data: ApplicationStagePayload }>({
      query: ({ applicationId, data }) => {
        assertUuid(applicationId);
        return {
          url: `/applications/${encodePathSegment(applicationId)}/stage`,
          method: 'PATCH',
          body: data,
        };
      },
      transformResponse: unwrapRecruitmentResponse,
      invalidatesTags: ['CandidatesList', 'RecruitmentStats'],
    }),
    createApplicationOffer: builder.mutation<unknown, { id: string; data: ApplicationOfferPayload }>({
      query: ({ id, data }) => {
        assertUuid(id);
        return { url: `/applications/${encodePathSegment(id)}/offer`, method: 'POST', body: data };
      },
      transformResponse: unwrapRecruitmentResponse,
      invalidatesTags: ['CandidatesList', 'RecruitmentStats'],
    }),
    sendApplicationInterview: builder.mutation<unknown, ApplicationInterviewParams>({
      query: ({ id, round_names }) => {
        assertUuid(id);
        const params = new URLSearchParams({ round_names });
        return { url: `/applications/${encodePathSegment(id)}/send-interview?${params}`, method: 'POST' };
      },
      transformResponse: unwrapRecruitmentResponse,
      invalidatesTags: ['CandidatesList', 'InterviewsList'],
    }),
    shortlistApplication: builder.mutation<unknown, string>({
      query: (id) => ({ url: updateApplicationPath(id, 'shortlist'), method: 'PATCH' }),
      transformResponse: unwrapRecruitmentResponse,
      invalidatesTags: ['CandidatesList', 'RecruitmentStats'],
    }),
    rejectApplication: builder.mutation<unknown, string>({
      query: (id) => ({ url: updateApplicationPath(id, 'reject'), method: 'PATCH' }),
      transformResponse: unwrapRecruitmentResponse,
      invalidatesTags: ['CandidatesList', 'RecruitmentStats'],
    }),
    holdApplication: builder.mutation<unknown, string>({
      query: (id) => ({ url: updateApplicationPath(id, 'hold'), method: 'PATCH' }),
      transformResponse: unwrapRecruitmentResponse,
      invalidatesTags: ['CandidatesList', 'RecruitmentStats'],
    }),
    bulkMoveApplications: builder.mutation<unknown, unknown>({
      query: (body) => ({ url: '/applications/bulk-move', method: 'POST', body }),
      transformResponse: unwrapRecruitmentResponse,
      invalidatesTags: ['CandidatesList', 'RecruitmentStats'],
    }),
    bulkTagApplications: builder.mutation<unknown, unknown>({
      query: (body) => ({ url: '/applications/bulk-tag', method: 'POST', body }),
      transformResponse: unwrapRecruitmentResponse,
      invalidatesTags: ['CandidatesList'],
    }),
    createCrmNote: builder.mutation<unknown, CrmNotePayload>({
      query: (body) => ({ url: '/crm/notes', method: 'POST', body }),
      transformResponse: unwrapRecruitmentResponse,
      invalidatesTags: ['CandidatesList', 'CandidateDetail'],
    }),
    getCrmNotes: builder.query<unknown, string>({
      query: (candidateId) => `/crm/notes/${encodePathSegment(candidateId)}`,
      transformResponse: unwrapRecruitmentResponse,
      providesTags: (_result, _error, candidateId) => [{ type: 'CandidateDetail', id: candidateId }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAdminCandidatesQuery,
  useGetAdminCandidateByIdQuery,
  useCreateAdminCandidateMutation,
  useUpdateAdminCandidateMutation,
  useExportAdminCandidatesCsvQuery,
  useImportAdminCandidatesMutation,
  useGetApplicationsQuery,
  useGetApplicationStatsQuery,
  useUpdateApplicationStageMutation,
  useCreateApplicationOfferMutation,
  useSendApplicationInterviewMutation,
  useShortlistApplicationMutation,
  useRejectApplicationMutation,
  useHoldApplicationMutation,
  useBulkMoveApplicationsMutation,
  useBulkTagApplicationsMutation,
  useCreateCrmNoteMutation,
  useGetCrmNotesQuery,
} = recruitmentCandidatesApi;
