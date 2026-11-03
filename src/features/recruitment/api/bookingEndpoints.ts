import { recruitmentApi } from './recruitmentApi';
import { encodePathSegment, unwrapRecruitmentResponse } from './confirmedEndpointUtils';
import type { CandidateBookingInfo } from '../types';

export interface BookSlotPayload {
  slot_id?: string;
  start_time: string;
  timezone?: string;
}

export const candidateBookingEndpoints = recruitmentApi.injectEndpoints({
  endpoints: (builder) => ({
    getBookingSlotInfo: builder.query<CandidateBookingInfo, string>({
      query: (token) => `/interviews/book/${encodePathSegment(token)}`,
      transformResponse: (response: unknown) => unwrapRecruitmentResponse(response) as CandidateBookingInfo,
    }),

    bookInterviewSlot: builder.mutation<
      { status: string; booked_slot: any; message?: string },
      { token: string; data: BookSlotPayload }
    >({
      query: ({ token, data }) => ({
        url: `/interviews/book/${encodePathSegment(token)}`,
        method: 'POST',
        body: data,
      }),
      transformResponse: unwrapRecruitmentResponse,
      invalidatesTags: ['InterviewsList'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetBookingSlotInfoQuery,
  useBookInterviewSlotMutation,
} = candidateBookingEndpoints;
