import { recruitmentApi } from './recruitmentApi';
import { assertUuid, encodePathSegment, unwrapRecruitmentResponse, withSearchParams } from './confirmedEndpointUtils';
import { mapInterview, normalizeList } from '../utils/apiMappers';
import type { ApiList, Interview, Interviewer, InterviewMode, InterviewRecommendation } from '../types';

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

export interface ScheduleInterviewPayload {
  interviewer_id: string;
  scheduled_at: string;
  duration_minutes: number;
  mode: InterviewMode;
  meeting_url?: string;
  office_address?: string;
  timezone?: string;
}

export interface RescheduleInterviewPayload {
  scheduled_at: string;
  duration_minutes?: number;
  reason?: string;
}

export interface InterviewFeedbackPayload {
  feedback: string;
  score: number;
  interviewer_name?: string;
}

export const recruitmentInterviewsApi = recruitmentApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminInterviews: builder.query<ApiList<Interview>, InterviewQueryParams | void>({
      query: (params) =>
        withSearchParams('/interviews', {
          ...params,
          limit: params?.limit ?? 50,
        }),
      transformResponse: (response: unknown) => normalizeList(response, mapInterview),
      providesTags: (result) => [
        { type: 'InterviewsList', id: 'LIST' },
        ...(result?.items.map((interview) => ({ type: 'InterviewsList' as const, id: interview.id })) ?? []),
      ],
    }),

    getInterviewers: builder.query<Interviewer[], void>({
      query: () => '/interviews/interviewers',
      transformResponse: (response: unknown) => {
        const raw = unwrapRecruitmentResponse(response);
        if (Array.isArray(raw)) {
          return raw.map((item: any) => ({
            id: String(item.id || item.employee_id || ''),
            name: String(item.name || `${item.first_name || ''} ${item.last_name || ''}`.trim() || 'Interviewer'),
            email: item.email ? String(item.email) : undefined,
            role: item.role || item.designation ? String(item.role || item.designation) : undefined,
          }));
        }
        return [];
      },
    }),

    scheduleRoundInterview: builder.mutation<
      unknown,
      { interviewId: string; roundId: string; data: ScheduleInterviewPayload }
    >({
      query: ({ interviewId, roundId, data }) => {
        assertUuid(interviewId);
        assertUuid(roundId);
        return {
          url: `/interviews/${encodePathSegment(interviewId)}/rounds/${encodePathSegment(roundId)}/schedule`,
          method: 'POST',
          body: data,
        };
      },
      transformResponse: unwrapRecruitmentResponse,
      invalidatesTags: ['InterviewsList', 'CandidatesList', 'RecruitmentStats'],
    }),

    rescheduleInterviewSchedule: builder.mutation<
      unknown,
      { scheduleId: string; data: RescheduleInterviewPayload }
    >({
      query: ({ scheduleId, data }) => {
        assertUuid(scheduleId);
        return {
          url: `/interviews/schedules/${encodePathSegment(scheduleId)}/reschedule`,
          method: 'PATCH',
          body: data,
        };
      },
      transformResponse: unwrapRecruitmentResponse,
      invalidatesTags: ['InterviewsList', 'CandidatesList'],
    }),

    cancelInterviewSchedule: builder.mutation<unknown, { scheduleId: string; reason: string }>({
      query: ({ scheduleId, reason }) => {
        assertUuid(scheduleId);
        return {
          url: `/interviews/schedules/${encodePathSegment(scheduleId)}/cancel`,
          method: 'POST',
          body: { reason },
        };
      },
      transformResponse: unwrapRecruitmentResponse,
      invalidatesTags: ['InterviewsList', 'CandidatesList'],
    }),

    sendInterviewReminder: builder.mutation<unknown, string>({
      query: (scheduleId) => {
        assertUuid(scheduleId);
        return {
          url: `/interviews/schedules/${encodePathSegment(scheduleId)}/reminder`,
          method: 'POST',
        };
      },
      transformResponse: unwrapRecruitmentResponse,
    }),

    markInterviewScheduleNoShow: builder.mutation<unknown, string>({
      query: (scheduleId) => {
        assertUuid(scheduleId);
        return {
          url: `/interviews/schedules/${encodePathSegment(scheduleId)}/no-show`,
          method: 'PATCH',
        };
      },
      transformResponse: unwrapRecruitmentResponse,
      invalidatesTags: ['InterviewsList', 'CandidatesList'],
    }),

    submitRoundFeedback: builder.mutation<
      unknown,
      { roundId: string; action: 'pass' | 'reject' | 'hold'; data: InterviewFeedbackPayload }
    >({
      query: ({ roundId, action, data }) => {
        assertUuid(roundId);
        return {
          url: `/interviews/rounds/${encodePathSegment(roundId)}/${action}`,
          method: 'PATCH',
          body: data,
        };
      },
      transformResponse: unwrapRecruitmentResponse,
      invalidatesTags: ['InterviewsList', 'CandidatesList', 'RecruitmentStats'],
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
  useGetInterviewersQuery,
  useScheduleRoundInterviewMutation,
  useRescheduleInterviewScheduleMutation,
  useCancelInterviewScheduleMutation,
  useSendInterviewReminderMutation,
  useMarkInterviewScheduleNoShowMutation,
  useSubmitRoundFeedbackMutation,
  useCreateScorecardSubmissionMutation,
  useGetScorecardSubmissionsQuery,
  useGetScorecardTemplatesQuery,
  useCreateScorecardTemplateMutation,
} = recruitmentInterviewsApi;
