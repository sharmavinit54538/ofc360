/**
 * @file meetingIntelligenceApi.ts
 * @description Enterprise RTK Query API slice for the AI Meeting Intelligence Module.
 * Connects to OFC360 backend using baseQueryWithReauth.
 */

import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '@/shared/api/baseQuery';
import type {
  MeetingIntelligenceRecord,
  MeetingActionItem,
  MeetingFilterParams,
  MeetingKpiSummary,
  ProcessMeetingAudioPayload,
  ExportMeetingNotesResponse,
} from '@/features/meeting-intelligence/types';

// Helper to normalize backend API envelopes ({ data: ... } or raw payload)
const transformResponse = <T>(response: any): T => {
  if (response && typeof response === 'object' && 'data' in response && response.data !== undefined) {
    return response.data as T;
  }
  return response as T;
};

export const meetingIntelligenceApi = createApi({
  reducerPath: 'meetingIntelligenceApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['MeetingIntelligence'],
  endpoints: (builder) => ({
    /**
     * Retrieve all processed meeting intelligence records matching filter criteria.
     */
    getMeetingIntelligenceList: builder.query<
      MeetingIntelligenceRecord[],
      MeetingFilterParams | void
    >({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters?.search) params.append('search', filters.search);
        if (filters?.startDate) params.append('startDate', filters.startDate);
        if (filters?.endDate) params.append('endDate', filters.endDate);
        if (filters?.participantId) params.append('participantId', filters.participantId);
        if (filters?.status) params.append('status', filters.status);

        const queryString = params.toString();
        return `/ai-hub/meetings${queryString ? `?${queryString}` : ''}`;
      },
      transformResponse: (response: any): MeetingIntelligenceRecord[] => {
        const data = transformResponse<any>(response);
        return Array.isArray(data) ? data : data?.meetings || [];
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'MeetingIntelligence' as const, id })),
              { type: 'MeetingIntelligence', id: 'LIST' },
            ]
          : [{ type: 'MeetingIntelligence', id: 'LIST' }],
    }),

    /**
     * Retrieve complete transcription, summary, and action items for a single meeting.
     */
    getMeetingDetailsById: builder.query<MeetingIntelligenceRecord, string>({
      query: (id) => `/ai-hub/meetings/${id}`,
      transformResponse: (response: any) => transformResponse<MeetingIntelligenceRecord>(response),
      providesTags: (_result, _error, id) => [{ type: 'MeetingIntelligence', id }],
    }),

    /**
     * Retrieve high-level KPI metrics for meetings analyzed, pending actions, and scores.
     */
    getMeetingKpiSummary: builder.query<MeetingKpiSummary, void>({
      query: () => '/ai-hub/meetings/kpis',
      transformResponse: (response: any): MeetingKpiSummary => {
        const data = transformResponse<any>(response);
        return {
          totalMeetings: data?.totalMeetings ?? 0,
          pendingActionItems: data?.pendingActionItems ?? 0,
          avgDurationMinutes: data?.avgDurationMinutes ?? 0,
          participationScore: data?.participationScore ?? 0,
        };
      },
      providesTags: [{ type: 'MeetingIntelligence', id: 'KPIS' }],
    }),

    /**
     * Submit an audio/video recording file or calendar URL for AI transcription and summarization.
     */
    processMeetingAudio: builder.mutation<MeetingIntelligenceRecord, ProcessMeetingAudioPayload>({
      query: (payload) => {
        // If file is provided, use FormData; otherwise send JSON
        if (payload.file) {
          const formData = new FormData();
          formData.append('meetingTitle', payload.meetingTitle);
          formData.append('meetingDate', payload.meetingDate);
          formData.append('file', payload.file);
          if (payload.recordingUrl) formData.append('recordingUrl', payload.recordingUrl);
          if (payload.calendarEventId) formData.append('calendarEventId', payload.calendarEventId);
          if (payload.tags) formData.append('tags', JSON.stringify(payload.tags));
          if (payload.participants) formData.append('participants', JSON.stringify(payload.participants));

          return {
            url: '/ai-hub/meetings/process',
            method: 'POST',
            body: formData,
          };
        }

        return {
          url: '/ai-hub/meetings/process',
          method: 'POST',
          body: payload,
        };
      },
      transformResponse: (response: any) => transformResponse<MeetingIntelligenceRecord>(response),
      invalidatesTags: [
        { type: 'MeetingIntelligence', id: 'LIST' },
        { type: 'MeetingIntelligence', id: 'KPIS' },
      ],
    }),

    /**
     * Update the completion status of an action item extracted from meeting notes.
     */
    updateActionItemStatus: builder.mutation<
      MeetingActionItem,
      { meetingId: string; actionId: string; status: 'PENDING' | 'COMPLETED' }
    >({
      query: ({ meetingId, actionId, status }) => ({
        url: `/ai-hub/meetings/${meetingId}/actions/${actionId}`,
        method: 'PATCH',
        body: { status },
      }),
      transformResponse: (response: any) => transformResponse<MeetingActionItem>(response),
      invalidatesTags: (_result, _error, { meetingId }) => [
        { type: 'MeetingIntelligence', id: meetingId },
        { type: 'MeetingIntelligence', id: 'LIST' },
        { type: 'MeetingIntelligence', id: 'KPIS' },
      ],
    }),

    /**
     * Export meeting summary, key decisions, and action items as PDF or Markdown.
     */
    exportMeetingNotes: builder.mutation<
      ExportMeetingNotesResponse,
      { meetingId: string; format?: 'PDF' | 'MARKDOWN' | 'DOCX' }
    >({
      query: ({ meetingId, format = 'PDF' }) => ({
        url: `/ai-hub/meetings/${meetingId}/export`,
        method: 'POST',
        body: { format },
      }),
      transformResponse: (response: any) => transformResponse<ExportMeetingNotesResponse>(response),
    }),
  }),
});

export const {
  useGetMeetingIntelligenceListQuery,
  useGetMeetingDetailsByIdQuery,
  useGetMeetingKpiSummaryQuery,
  useProcessMeetingAudioMutation,
  useUpdateActionItemStatusMutation,
  useExportMeetingNotesMutation,
} = meetingIntelligenceApi;

export default meetingIntelligenceApi;
