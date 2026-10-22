/**
 * @file chatAssistantApi.ts
 * @description Enterprise RTK Query API slice for the AI Chat Assistant and conversational workflows.
 * Connects to the OFC360 AI Hub backend using baseQueryWithReauth.
 */

import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '@/shared/api/baseQuery';
import type {
  ConversationThread,
  ChatMessage,
  SendMessagePayload,
  SendMessageResponse,
  CreateConversationPayload,
} from '@/features/chat-assistant/types';

// Helper to normalize backend API envelopes ({ data: ... } or raw payload)
const transformResponse = <T>(response: any): T => {
  if (response && typeof response === 'object' && 'data' in response && response.data !== undefined) {
    return response.data as T;
  }
  return response as T;
};

export const chatAssistantApi = createApi({
  reducerPath: 'chatAssistantApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['ChatAssistant'],
  endpoints: (builder) => ({
    /**
     * Retrieve all conversation threads for the authenticated user.
     */
    getConversations: builder.query<ConversationThread[], void>({
      query: () => '/ai-hub/conversations',
      transformResponse: (response: any): ConversationThread[] => {
        const data = transformResponse<any>(response);
        return Array.isArray(data) ? data : data?.conversations || [];
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'ChatAssistant' as const, id })),
              { type: 'ChatAssistant', id: 'LIST' },
            ]
          : [{ type: 'ChatAssistant', id: 'LIST' }],
    }),

    /**
     * Retrieve message history for a specific conversation thread.
     */
    getConversationMessages: builder.query<ChatMessage[], string>({
      query: (conversationId) => `/ai-hub/conversations/${conversationId}/messages`,
      transformResponse: (response: any): ChatMessage[] => {
        const data = transformResponse<any>(response);
        return Array.isArray(data) ? data : data?.messages || [];
      },
      providesTags: (_result, _error, conversationId) => [
        { type: 'ChatAssistant', id: `MESSAGES_${conversationId}` },
      ],
    }),

    /**
     * Create a new conversation thread with optional initial prompt.
     */
    createConversation: builder.mutation<ConversationThread, CreateConversationPayload | void>({
      query: (payload) => ({
        url: '/ai-hub/conversations',
        method: 'POST',
        body: payload || {},
      }),
      transformResponse: (response: any) => transformResponse<ConversationThread>(response),
      invalidatesTags: [{ type: 'ChatAssistant', id: 'LIST' }],
    }),

    /**
     * Send a prompt in an existing thread or start a new contextual thread.
     */
    sendMessage: builder.mutation<SendMessageResponse, SendMessagePayload>({
      query: (payload) => ({
        url: '/ai-hub/chat',
        method: 'POST',
        body: payload,
      }),
      transformResponse: (response: any) => transformResponse<SendMessageResponse>(response),
      invalidatesTags: (_result, _error, arg) => [
        { type: 'ChatAssistant', id: 'LIST' },
        ...(arg.conversationId ? [{ type: 'ChatAssistant' as const, id: `MESSAGES_${arg.conversationId}` }] : []),
      ],
    }),

    /**
     * Clear all message history in a conversation thread without deleting the thread.
     */
    clearConversationHistory: builder.mutation<{ success: boolean }, string>({
      query: (conversationId) => ({
        url: `/ai-hub/conversations/${conversationId}/messages`,
        method: 'DELETE',
      }),
      transformResponse: (response: any) => transformResponse<{ success: boolean }>(response),
      invalidatesTags: (_result, _error, conversationId) => [
        { type: 'ChatAssistant', id: `MESSAGES_${conversationId}` },
        { type: 'ChatAssistant', id: 'LIST' },
      ],
    }),

    /**
     * Delete an entire conversation thread and its associated memory.
     */
    deleteConversation: builder.mutation<{ success: boolean }, string>({
      query: (conversationId) => ({
        url: `/ai-hub/conversations/${conversationId}`,
        method: 'DELETE',
      }),
      transformResponse: (response: any) => transformResponse<{ success: boolean }>(response),
      invalidatesTags: (_result, _error, conversationId) => [
        { type: 'ChatAssistant', id: conversationId },
        { type: 'ChatAssistant', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetConversationsQuery,
  useGetConversationMessagesQuery,
  useCreateConversationMutation,
  useSendMessageMutation,
  useClearConversationHistoryMutation,
  useDeleteConversationMutation,
} = chatAssistantApi;

export default chatAssistantApi;
