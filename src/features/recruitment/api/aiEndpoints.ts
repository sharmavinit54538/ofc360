import { recruitmentApi } from './recruitmentApi';
import { assertUuid, apiV2Url, encodePathSegment, unwrapRecruitmentResponse, withSearchParams } from './confirmedEndpointUtils';

export interface ScreeningRunPayload {
  application_ids?: string[];
  model?: string;
  force?: boolean;
}

export interface ScreeningDecisionPayload {
  action: 'SHORTLIST' | 'REJECT' | 'KEEP_REVIEW';
  reason?: string;
}

export const recruitmentAiApi = recruitmentApi.injectEndpoints({
  endpoints: (builder) => ({
    runJobScreening: builder.mutation<unknown, { jobId: string; data?: ScreeningRunPayload }>({
      query: ({ jobId, data }) => {
        assertUuid(jobId);
        return { url: apiV2Url(`/api/v2/screening/jobs/${encodePathSegment(jobId)}/run`), method: 'POST', body: data };
      },
      transformResponse: unwrapRecruitmentResponse,
      invalidatesTags: ['CandidatesList', 'RecruitmentStats'],
    }),
    getJobScreeningResults: builder.query<unknown, string>({
      query: (jobId) => apiV2Url(`/api/v2/screening/jobs/${encodePathSegment(jobId)}/results`),
      transformResponse: unwrapRecruitmentResponse,
      providesTags: ['CandidatesList'],
    }),
    submitScreeningDecision: builder.mutation<unknown, { screeningId: string; data: ScreeningDecisionPayload }>({
      query: ({ screeningId, data }) => {
        assertUuid(screeningId);
        return {
          url: apiV2Url(`/api/v2/screening/results/${encodePathSegment(screeningId)}/decision`),
          method: 'POST',
          body: data,
        };
      },
      transformResponse: unwrapRecruitmentResponse,
      invalidatesTags: ['CandidatesList', 'RecruitmentStats'],
    }),
    getApplicationScreeningHistory: builder.query<unknown, string>({
      query: (applicationId) => apiV2Url(`/api/v2/screening/history/${encodePathSegment(applicationId)}`),
      transformResponse: unwrapRecruitmentResponse,
    }),
    getTopCandidatesByJob: builder.query<unknown, string>({
      query: (jobId) => apiV2Url(`/api/v2/ranking/top/${encodePathSegment(jobId)}`),
      transformResponse: unwrapRecruitmentResponse,
    }),
    getAiJobRanking: builder.query<unknown, string>({
      query: (jobId) => `/ai/job-ranking/${encodePathSegment(jobId)}`,
      transformResponse: unwrapRecruitmentResponse,
    }),
    getAiCandidateRecommendation: builder.query<unknown, string>({
      query: (candidateId) => `/ai/recruiter/candidate/${encodePathSegment(candidateId)}/recommendation`,
      transformResponse: unwrapRecruitmentResponse,
    }),
    getAiCandidateScore: builder.query<unknown, string>({
      query: (candidateId) => `/ai/recruiter/candidate/${encodePathSegment(candidateId)}/score`,
      transformResponse: unwrapRecruitmentResponse,
    }),
    getAiInterviewQuestions: builder.mutation<unknown, unknown>({
      query: (body) => ({ url: '/ai/recruiter/interview/questions', method: 'POST', body }),
      transformResponse: unwrapRecruitmentResponse,
    }),
    getRecruiterDashboard: builder.query<unknown, void>({
      query: () => '/ai/recruiter/dashboard',
      transformResponse: unwrapRecruitmentResponse,
      providesTags: ['RecruitmentStats'],
    }),
    getRecruiterFunnel: builder.query<unknown, void>({
      query: () => '/ai/recruiter/funnel',
      transformResponse: unwrapRecruitmentResponse,
      providesTags: ['RecruitmentStats'],
    }),
    getRecruiterMatchDistribution: builder.query<unknown, void>({
      query: () => '/ai/recruiter/match-distribution',
      transformResponse: unwrapRecruitmentResponse,
      providesTags: ['RecruitmentStats'],
    }),
    getRecruiterAnalytics: builder.query<unknown, void>({
      query: () => '/ai/recruiter/analytics',
      transformResponse: unwrapRecruitmentResponse,
      providesTags: ['RecruitmentStats'],
    }),
    getInterviewSuccessAnalytics: builder.query<unknown, void>({
      query: () => apiV2Url('/api/v2/analytics/interview-success'),
      transformResponse: unwrapRecruitmentResponse,
    }),
    getOfferAcceptanceAnalytics: builder.query<unknown, void>({
      query: () => apiV2Url('/api/v2/analytics/offer-acceptance-rate'),
      transformResponse: unwrapRecruitmentResponse,
    }),
    exportRecruitmentAnalytics: builder.query<Blob, void>({
      query: () => ({ url: '/analytics/export', responseHandler: 'blob' }),
      transformResponse: (response: Blob) => response,
    }),
    exportRecruitmentReports: builder.query<Blob, void>({
      query: () => ({ url: '/reports/export', responseHandler: 'blob' }),
      transformResponse: (response: Blob) => response,
    }),
  }),
  overrideExisting: false,
});

export const {
  useRunJobScreeningMutation,
  useGetJobScreeningResultsQuery,
  useSubmitScreeningDecisionMutation,
  useGetApplicationScreeningHistoryQuery,
  useGetTopCandidatesByJobQuery,
  useGetAiJobRankingQuery,
  useGetAiCandidateRecommendationQuery,
  useGetAiCandidateScoreQuery,
  useGetAiInterviewQuestionsMutation,
  useGetRecruiterDashboardQuery,
  useGetRecruiterFunnelQuery,
  useGetRecruiterMatchDistributionQuery,
  useGetRecruiterAnalyticsQuery,
  useGetInterviewSuccessAnalyticsQuery,
  useGetOfferAcceptanceAnalyticsQuery,
  useExportRecruitmentAnalyticsQuery,
  useExportRecruitmentReportsQuery,
} = recruitmentAiApi;
