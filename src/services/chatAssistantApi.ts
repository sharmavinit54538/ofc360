/**
 * @file chatAssistantApi.ts
 * @description Enterprise RTK Query API slice for the AI Chat Assistant and conversational workflows.
 * Connects to the OFC360 FastAPI backend routes mounted under /api/v1/ai-hub/chat-assistant and /api/v1/ai/chat.
 */

import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '@/shared/api/baseQuery';
import type {
  ConversationThread,
  ChatMessage,
  SendMessagePayload,
  SendMessageResponse,
  CreateConversationPayload,
  ChatSuggestionsResponse,
  MessageRole,
} from '@/features/chat-assistant/types';

// Helper to unwrap backend API envelopes ({ success, message, data, errors })
export const unwrapApiResponse = <T>(response: any): T => {
  if (response && typeof response === 'object' && 'data' in response && response.data !== undefined) {
    return response.data as T;
  }
  return response as T;
};

// Helper to normalize backend conversation history item to ConversationThread
export const normalizeConversationItem = (item: any): ConversationThread => {
  const convId = item.conversationId || item.conversation_id || item.id || '';
  const title = item.title || 'New Conversation';
  const lastMsg = item.lastMessage || item.last_message || '';
  const count = item.messageCount ?? item.message_count ?? 0;
  const created = item.createdAt || item.updatedAt || item.updated_at || new Date().toISOString();
  const updated = item.updatedAt || item.updated_at || created;

  return {
    id: String(convId),
    title,
    lastMessage: lastMsg,
    messageCount: count,
    createdAt: typeof created === 'string' ? created : new Date(created).toISOString(),
    updatedAt: typeof updated === 'string' ? updated : new Date(updated).toISOString(),
    pinned: Boolean(item.pinned),
    contextScope: item.contextScope || item.context || 'GENERAL',
  };
};

// Helper to normalize message items
export const normalizeChatMessage = (msg: any, fallbackConvId: string = ''): ChatMessage => {
  const id = msg.id || msg.messageId || msg.message_id || `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const conversationId = msg.conversationId || msg.conversation_id || fallbackConvId;
  const role: MessageRole =
    msg.role === 'user'
      ? 'user'
      : msg.role === 'system'
      ? 'system'
      : 'assistant';

  const content = msg.content || msg.answer || msg.reply || msg.message || '';
  const timestamp = msg.timestamp || msg.created_at || msg.updated_at || new Date().toISOString();
  const status = msg.status || 'sent';

  const suggestions = msg.followUpQuestions || msg.follow_up_questions || msg.suggestions || [];
  const actions = Array.isArray(msg.actions) && msg.actions.length > 0
    ? msg.actions
    : suggestions.map((q: string) => ({
        label: q,
        actionType: 'SUGGESTION',
        payload: { prompt: q },
      }));

  return {
    id: String(id),
    conversationId: String(conversationId),
    role,
    content,
    timestamp: typeof timestamp === 'string' ? timestamp : new Date(timestamp).toISOString(),
    status,
    actions,
    contextScope: msg.contextScope || msg.context,
  };
};

export const chatAssistantApi = createApi({
  reducerPath: 'chatAssistantApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['ChatAssistant'],
  endpoints: (builder) => ({
    /**
     * Retrieve all conversation threads for the authenticated user.
     * Route: GET /api/v1/ai-hub/chat-assistant/conversations
     */
    getConversations: builder.query<ConversationThread[], void>({
      query: () => '/ai-hub/chat-assistant/conversations',
      transformResponse: (response: any): ConversationThread[] => {
        const data = unwrapApiResponse<any>(response);
        const list = Array.isArray(data)
          ? data
          : data?.history || data?.items || data?.conversations || [];
        return list.map(normalizeConversationItem);
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
     * Route: GET /api/v1/ai-hub/chat-assistant/conversations/{conversationId}
     */
    getConversationMessages: builder.query<ChatMessage[], string>({
      query: (conversationId) => `/ai-hub/chat-assistant/conversations/${conversationId}`,
      transformResponse: (response: any, _meta, conversationId): ChatMessage[] => {
        const data = unwrapApiResponse<any>(response);
        if (!data) return [];

        if (Array.isArray(data)) {
          return data.map((m) => normalizeChatMessage(m, conversationId));
        }

        if (Array.isArray(data.messages)) {
          return data.messages.map((m: any) => normalizeChatMessage(m, conversationId));
        }

        // Backend get_history_detail returns a single ChatAssistantResponse representing the latest assistant turn
        if (data.answer || data.content || data.reply || data.message) {
          const assistantMsg = normalizeChatMessage(
            {
              id: data.messageId || data.message_id || `asst_${conversationId}`,
              conversationId,
              role: data.role || 'assistant',
              content: data.answer || data.content || data.reply || data.message,
              timestamp: data.updated_at || data.created_at || new Date().toISOString(),
              status: 'sent',
              followUpQuestions: data.followUpQuestions || data.follow_up_questions || data.suggestions,
              contextScope: data.contextScope || data.context,
            },
            conversationId
          );
          return [assistantMsg];
        }

        return [];
      },
      providesTags: (_result, _error, conversationId) => [
        { type: 'ChatAssistant', id: `MESSAGES_${conversationId}` },
      ],
    }),

    /**
     * Create a new conversation thread with optional initial prompt.
     * Route: POST /api/v1/ai-hub/chat-assistant/conversations
     */
    createConversation: builder.mutation<ConversationThread, CreateConversationPayload | void>({
      query: (payload) => {
        const title = payload?.title || 'New Conversation';
        const initialText =
          payload?.initialPrompt ||
          payload?.initialMessage ||
          payload?.message ||
          payload?.query ||
          '';

        return {
          url: '/ai-hub/chat-assistant/conversations',
          method: 'POST',
          body: {
            title,
            ...(initialText
              ? {
                  initial_message: initialText,
                  initialMessage: initialText,
                  message: initialText,
                  query: initialText,
                }
              : {}),
            ...(payload?.contextScope
              ? {
                  context: payload.contextScope,
                  department_id: undefined,
                }
              : {}),
          },
        };
      },
      transformResponse: (response: any, _meta, arg): ConversationThread => {
        const data = unwrapApiResponse<any>(response);
        const convId = data?.conversationId || data?.conversation_id || data?.id || `conv_${Date.now()}`;
        return {
          id: String(convId),
          title: data?.title || arg?.title || 'New Conversation',
          lastMessage: data?.answer || data?.message || data?.content || '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          contextScope: arg?.contextScope,
        };
      },
      invalidatesTags: [{ type: 'ChatAssistant', id: 'LIST' }],
    }),

    /**
     * Send a prompt in an existing thread or start a new contextual thread.
     * Route: POST /api/v1/ai-hub/chat-assistant/message
     */
    sendMessage: builder.mutation<SendMessageResponse, SendMessagePayload>({
      query: (payload) => {
        const msgText = payload.message || payload.prompt || payload.query || '';
        const convId = payload.conversationId || payload.conversation_id;

        return {
          url: '/ai-hub/chat-assistant/message',
          method: 'POST',
          body: {
            message: msgText,
            query: msgText,
            ...(convId
              ? {
                  conversationId: convId,
                  conversation_id: convId,
                }
              : {}),
            ...(payload.contextScope
              ? {
                  context: payload.contextScope,
                  role: payload.contextScope,
                }
              : {}),
          },
        };
      },
      transformResponse: (response: any, _meta, arg): SendMessageResponse => {
        const data = unwrapApiResponse<any>(response);
        const convId = data?.conversationId || data?.conversation_id || arg.conversationId || `conv_${Date.now()}`;
        const replyText = data?.answer || data?.reply || data?.content || data?.message || '';
        const promptText = arg.message || arg.prompt || arg.query || '';

        const suggestions = data?.followUpQuestions || data?.follow_up_questions || data?.suggestions || [];
        const actions = suggestions.map((q: string) => ({
          label: q,
          actionType: 'SUGGESTION',
          payload: { prompt: q },
        }));

        return {
          message: {
            id: `user_${Date.now()}`,
            conversationId: convId,
            role: 'user',
            content: promptText,
            timestamp: new Date().toISOString(),
            status: 'sent',
            contextScope: arg.contextScope,
          },
          reply: {
            id: data?.messageId || data?.message_id || `asst_${Date.now()}`,
            conversationId: convId,
            role: 'assistant',
            content: replyText,
            timestamp: new Date().toISOString(),
            status: 'sent',
            actions,
            contextScope: arg.contextScope,
          },
          conversationId: convId,
          title: data?.title,
        };
      },
      invalidatesTags: (_result, _error, arg) => [
        { type: 'ChatAssistant', id: 'LIST' },
        ...(arg.conversationId ? [{ type: 'ChatAssistant' as const, id: `MESSAGES_${arg.conversationId}` }] : []),
      ],
    }),

    /**
     * Clear all message history in a conversation thread without deleting the thread.
     * Route: DELETE /api/v1/ai/chat/history/{conversation_id}
     */
    clearConversationHistory: builder.mutation<{ success: boolean }, string>({
      query: (conversationId) => ({
        url: `/ai/chat/history/${conversationId}`,
        method: 'DELETE',
      }),
      transformResponse: (response: any) => {
        const data = unwrapApiResponse<{ success?: boolean }>(response);
        return { success: data?.success ?? true };
      },
      invalidatesTags: (_result, _error, conversationId) => [
        { type: 'ChatAssistant', id: `MESSAGES_${conversationId}` },
        { type: 'ChatAssistant', id: 'LIST' },
      ],
    }),

    /**
     * Delete an entire conversation thread and its associated memory.
     * Route: DELETE /api/v1/ai-hub/chat-assistant/conversations/{conversationId}
     */
    deleteConversation: builder.mutation<{ success: boolean }, string>({
      query: (conversationId) => ({
        url: `/ai-hub/chat-assistant/conversations/${conversationId}`,
        method: 'DELETE',
      }),
      transformResponse: (response: any) => {
        const data = unwrapApiResponse<{ success?: boolean }>(response);
        return { success: data?.success ?? true };
      },
      invalidatesTags: (_result, _error, conversationId) => [
        { type: 'ChatAssistant', id: conversationId },
        { type: 'ChatAssistant', id: 'LIST' },
      ],
    }),

    /**
     * Retrieve suggested prompts, popular queries, and role-based questions.
     * Route: GET /api/v1/ai/chat/suggestions
     */
    getSuggestions: builder.query<ChatSuggestionsResponse, void>({
      query: () => '/ai/chat/suggestions',
      transformResponse: (response: any): ChatSuggestionsResponse => {
        const data = unwrapApiResponse<any>(response) || {};
        return {
          suggestedPrompts: data.suggested_prompts || data.suggestedPrompts || [],
          popularQueries: data.popular_queries || data.popularQueries || [],
          roleBasedPrompts: data.role_based_prompts || data.roleBasedPrompts || [],
        };
      },
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
  useGetSuggestionsQuery,
} = chatAssistantApi;

export default chatAssistantApi;
