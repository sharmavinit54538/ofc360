import { recruitmentApi } from './recruitmentApi';
import { encodePathSegment, unwrapRecruitmentResponse, withSearchParams } from './confirmedEndpointUtils';
import { mapInterview, normalizeList } from '../utils/apiMappers';
import type { ApiList, Interview } from '../types';

export interface InterviewQueryParams {
  status?: string;
  from?: string;
  to?: string;
  job_id?: string;
  candidate_id?: string;
  interviewer_id?: string;
  page?: number;
  limit?: number;
}

export const recruitmentInterviewsApi = recruitmentApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminInterviews: builder.query<ApiList<Interview>, InterviewQueryParams | void>({
      query: (params) => withSearchParams('/interviews', {
        ...params,
        limit: params?.limit ?? 50,
      }),
      transformResponse: (response: unknown) => normalizeList(response, mapInterview),
      providesTags: (result) => [
        { type: 'InterviewsList', id: 'LIST' },
        ...(result?.items.map((interview) => ({ type: 'InterviewsList' as const, id: interview.id })) ?? []),
      ],
    }),
    createScorecardSubmission: builder.mutation<unknown, unknown>({
      query: (body) => ({ url: '/scorecards/submissions', method: 'POST', body }),
      transformResponse: unwrapRecruitmentResponse,
      invalidatesTags: ['InterviewsList'],
    }),
    getScorecardSubmissions: builder.query<unknown, string>({
      query: (roundId) => `/scorecards/submissions/${encodePathSegment(roundId)}`,
      transformResponse: unwrapRecruitmentResponse,
    }),
    getScorecardTemplates: builder.query<unknown, void>({
      query: () => '/scorecards/templates',
      transformResponse: unwrapRecruitmentResponse,
    }),
    createScorecardTemplate: builder.mutation<unknown, unknown>({
      query: (body) => ({ url: '/scorecards/templates', method: 'POST', body }),
      transformResponse: unwrapRecruitmentResponse,
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAdminInterviewsQuery,
  useCreateScorecardSubmissionMutation,
  useGetScorecardSubmissionsQuery,
  useGetScorecardTemplatesQuery,
  useCreateScorecardTemplateMutation,
} = recruitmentInterviewsApi;
