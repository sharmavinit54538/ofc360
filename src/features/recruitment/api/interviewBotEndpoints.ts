import { recruitmentApi } from './recruitmentApi';
import { apiV2Url, assertUuid, encodePathSegment, unwrapRecruitmentResponse, withSearchParams } from './confirmedEndpointUtils';
import type { AiInterviewBotResult, AiInterviewBotSession } from '../types';

export interface BotInvitePayload {
  application_id: string;
}

export interface BotDecisionPayload {
  action: 'SHORTLIST' | 'REJECT';
  reason?: string;
}

export const interviewBotApi = recruitmentApi.injectEndpoints({
  endpoints: (builder) => ({
    // ADMIN ENDPOINTS
    inviteCandidateToBot: builder.mutation<{ success: boolean; invite_url?: string; token?: string }, BotInvitePayload>({
      query: (body) => ({
        url: apiV2Url('/api/v2/interview-bot/invite'),
        method: 'POST',
        body,
      }),
      transformResponse: unwrapRecruitmentResponse,
      invalidatesTags: ['InterviewsList', 'CandidatesList'],
    }),

    getBotResultsByJob: builder.query<AiInterviewBotResult[], string>({
      query: (jobId) => withSearchParams(apiV2Url('/api/v2/interview-bot/results'), { job_id: jobId }),
      transformResponse: (response: unknown): AiInterviewBotResult[] => {
        const raw = unwrapRecruitmentResponse(response);
        if (Array.isArray(raw)) return raw as AiInterviewBotResult[];
        if (raw && typeof raw === 'object' && 'items' in raw && Array.isArray((raw as any).items)) {
          return (raw as any).items;
        }
        return [];
      },
      providesTags: ['InterviewsList'],
    }),

    submitBotDecision: builder.mutation<unknown, { resultId: string; data: BotDecisionPayload }>({
      query: ({ resultId, data }) => {
        assertUuid(resultId);
        return {
          url: apiV2Url(`/api/v2/interview-bot/results/${encodePathSegment(resultId)}/decision`),
          method: 'POST',
          body: data,
        };
      },
      transformResponse: unwrapRecruitmentResponse,
      invalidatesTags: ['InterviewsList', 'CandidatesList', 'RecruitmentStats'],
    }),

    // PUBLIC UNHOOKED / CANDIDATE DIRECT CALLS (CAN ALSO BE RUN VIA UNSECURED FETCH)
    getPublicBotSession: builder.query<AiInterviewBotSession, string>({
      query: (token) => apiV2Url(`/api/v2/interview-bot/public/${encodePathSegment(token)}`),
      transformResponse: unwrapRecruitmentResponse,
    }),

    startPublicBotSession: builder.mutation<unknown, string>({
      query: (token) => ({
        url: apiV2Url(`/api/v2/interview-bot/public/${encodePathSegment(token)}/start`),
        method: 'POST',
        body: { consent: true },
      }),
      transformResponse: unwrapRecruitmentResponse,
    }),

    submitPublicBotAnswer: builder.mutation<unknown, { token: string; questionId: string; answerText: string }>({
      query: ({ token, questionId, answerText }) => ({
        url: apiV2Url(`/api/v2/interview-bot/public/${encodePathSegment(token)}/answer`),
        method: 'POST',
        body: { question_id: questionId, answer_text: answerText },
      }),
      transformResponse: unwrapRecruitmentResponse,
    }),

    finishPublicBotSession: builder.mutation<unknown, string>({
      query: (token) => ({
        url: apiV2Url(`/api/v2/interview-bot/public/${encodePathSegment(token)}/finish`),
        method: 'POST',
      }),
      transformResponse: unwrapRecruitmentResponse,
    }),

    requestHumanInterviewer: builder.mutation<unknown, { token: string; reason?: string }>({
      query: ({ token, reason }) => ({
        url: apiV2Url(`/api/v2/interview-bot/public/${encodePathSegment(token)}/request-human`),
        method: 'POST',
        body: { reason },
      }),
      transformResponse: unwrapRecruitmentResponse,
    }),
  }),
  overrideExisting: false,
});

export const {
  useInviteCandidateToBotMutation,
  useGetBotResultsByJobQuery,
  useSubmitBotDecisionMutation,
  useGetPublicBotSessionQuery,
  useStartPublicBotSessionMutation,
  useSubmitPublicBotAnswerMutation,
  useFinishPublicBotSessionMutation,
  useRequestHumanInterviewerMutation,
} = interviewBotApi;
