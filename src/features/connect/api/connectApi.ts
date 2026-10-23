/**
 * @file connectApi.ts
 * @description Enterprise RTK Query slice for OFC360 Connect (Employee Chat & Directory).
 * Connects to FastAPI backend routes mounted under /api/v1/connect.
 */

import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '@/shared/api/baseQuery';
import type {
  Colleague,
  ColleaguesResponse,
  ConnectConversation,
  ConnectMessage,
  ConnectParticipant,
  GetColleaguesParams,
  GetConnectMessagesParams,
  SendConnectMessagePayload,
  CreateConversationPayload,
  PresenceStatus,
  MessageAttachment,
  MessageReaction,
} from '../types';

// Helper to unwrap backend response envelopes ({ success, message, data, errors })
export const unwrapConnectResponse = <T>(response: any): T => {
  if (response && typeof response === 'object' && 'data' in response && response.data !== undefined) {
    return response.data as T;
  }
  return response as T;
};

// Normalizer for Colleague item
export const normalizeColleague = (item: any): Colleague => ({
  id: String(item.id),
  name: item.name || '',
  email: item.email || '',
  phone: (item.phone !== undefined && item.phone !== null) ? item.phone : null,
  role: item.role || 'employee',
  department: (item.department !== undefined && item.department !== null) ? item.department : null,
  designation: (item.designation !== undefined && item.designation !== null) ? item.designation : null,
  avatarUrl: item.avatarUrl || item.avatar_url || null,
  presenceStatus: (item.presenceStatus || item.presence_status || 'offline') as PresenceStatus,
  customStatus: item.customStatus || item.custom_status || null,
  lastSeenAt: item.lastSeenAt || item.last_seen_at || null,
});

// Normalizer for Participant item
export const normalizeParticipant = (p: any): ConnectParticipant => ({
  id: String(p.id || p.userId || p.user_id),
  userId: String(p.userId || p.user_id),
  name: p.name || '',
  email: p.email || '',
  avatarUrl: p.avatarUrl || p.avatar_url || null,
  role: p.role || 'employee',
  presenceStatus: (p.presenceStatus || p.presence_status || 'offline') as PresenceStatus,
  isMuted: Boolean((p.isMuted !== undefined && p.isMuted !== null) ? p.isMuted : p.is_muted),
  lastReadAt: p.lastReadAt || p.last_read_at || null,
});

// Normalizer for Conversation item
export const normalizeConversation = (item: any): ConnectConversation => ({
  id: String(item.id),
  companyId: String(item.companyId || item.company_id || ''),
  participants: Array.isArray(item.participants)
    ? item.participants.map(normalizeParticipant)
    : [],
  lastMessagePreview: item.lastMessagePreview || item.last_message_preview || null,
  lastMessageAt: item.lastMessageAt || item.last_message_at || null,
  unreadCount: (item.unreadCount !== undefined && item.unreadCount !== null)
    ? item.unreadCount
    : ((item.unread_count !== undefined && item.unread_count !== null) ? item.unread_count : 0),
  createdAt: item.createdAt || item.created_at || new Date().toISOString(),
  updatedAt: item.updatedAt || item.updated_at || new Date().toISOString(),
});

// Normalizer for Attachment item
export const normalizeAttachment = (a: any): MessageAttachment => ({
  id: String(a.id || Math.random().toString(36).substring(2, 9)),
  fileName: a.fileName || a.file_name || 'attachment',
  fileUrl: a.fileUrl || a.file_url || '',
  fileType: a.fileType || a.file_type || 'application/octet-stream',
  fileSize: (a.fileSize !== undefined && a.fileSize !== null)
    ? a.fileSize
    : ((a.file_size !== undefined && a.file_size !== null) ? a.file_size : 0),
});

// Normalizer for Reaction item
export const normalizeReaction = (r: any): MessageReaction => ({
  emoji: r.emoji,
  count: (r.count !== undefined && r.count !== null) ? r.count : 0,
  users: Array.isArray(r.users) ? r.users.map(String) : [],
  hasReacted: Boolean((r.hasReacted !== undefined && r.hasReacted !== null) ? r.hasReacted : r.has_reacted),
});

// Normalizer for Connect Message
export const normalizeMessage = (m: any): ConnectMessage => ({
  id: String(m.id),
  conversationId: (m.conversationId || m.conversation_id) ? String(m.conversationId || m.conversation_id) : null,
  channelId: (m.channelId || m.channel_id) ? String(m.channelId || m.channel_id) : null,
  senderId: String(m.senderId || m.sender_id || ''),
  senderName: m.senderName || m.sender_name || 'Unknown',
  senderAvatar: m.senderAvatar || m.sender_avatar || null,
  content: m.content || m.text || '',
  voiceUrl: m.voiceUrl || m.voice_url || null,
  voiceDuration: (m.voiceDuration !== undefined && m.voiceDuration !== null)
    ? m.voiceDuration
    : ((m.voice_duration !== undefined && m.voice_duration !== null) ? m.voice_duration : null),
  isPinned: Boolean((m.isPinned !== undefined && m.isPinned !== null) ? m.isPinned : m.is_pinned),
  pinnedAt: m.pinnedAt || m.pinned_at || null,
  pinnedBy: (m.pinnedBy || m.pinned_by) ? String(m.pinnedBy || m.pinned_by) : null,
  replyToId: (m.replyToId || m.reply_to_id) ? String(m.replyToId || m.reply_to_id) : null,
  parentMessageId: (m.parentMessageId || m.parent_message_id) ? String(m.parentMessageId || m.parent_message_id) : null,
  threadCount: (m.threadCount !== undefined && m.threadCount !== null)
    ? m.threadCount
    : ((m.thread_count !== undefined && m.thread_count !== null) ? m.thread_count : 0),
  reactions: Array.isArray(m.reactions) ? m.reactions.map(normalizeReaction) : [],
  attachments: Array.isArray(m.attachments) ? m.attachments.map(normalizeAttachment) : [],
  isDeleted: Boolean((m.isDeleted !== undefined && m.isDeleted !== null) ? m.isDeleted : m.is_deleted),
  createdAt: m.createdAt || m.created_at || new Date().toISOString(),
  updatedAt: m.updatedAt || m.updated_at || new Date().toISOString(),
});

export const connectApi = createApi({
  reducerPath: 'connectApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['ConnectColleagues', 'ConnectConversations', 'ConnectMessages'],
  endpoints: (builder) => ({
    /**
     * User Discovery - List Colleagues
     * Route: GET /api/v1/connect/colleagues?search=&department=&presence=&page=&limit=
     */
    getColleagues: builder.query<ColleaguesResponse, GetColleaguesParams | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.search) queryParams.append('search', params.search);
        if (params?.department) queryParams.append('department', params.department);
        if (params?.presence) queryParams.append('presence', params.presence);
        if (params?.page) queryParams.append('page', String(params.page));
        if (params?.limit) queryParams.append('limit', String(params.limit));

        const queryStr = queryParams.toString();
        return `/connect/colleagues${queryStr ? `?${queryStr}` : ''}`;
      },
      transformResponse: (response: any): ColleaguesResponse => {
        const data = unwrapConnectResponse<any>(response);
        const list = Array.isArray(data)
          ? data
          : data?.colleagues || [];
        return {
          colleagues: list.map(normalizeColleague),
          total: (data?.total !== undefined && data?.total !== null) ? data.total : list.length,
          page: (data?.page !== undefined && data?.page !== null) ? data.page : 1,
          limit: (data?.limit !== undefined && data?.limit !== null) ? data.limit : list.length,
        };
      },
      providesTags: ['ConnectColleagues'],
    }),

    /**
     * Create or Retrieve Direct Conversation (Idempotent)
     * Route: POST /api/v1/connect/conversations
     */
    createOrGetConversation: builder.mutation<ConnectConversation, CreateConversationPayload>({
      query: (payload) => ({
        url: '/connect/conversations',
        method: 'POST',
        body: {
          targetUserId: payload.targetUserId,
          target_user_id: payload.targetUserId,
        },
      }),
      transformResponse: (response: any): ConnectConversation => {
        const data = unwrapConnectResponse<any>(response);
        return normalizeConversation(data);
      },
      invalidatesTags: ['ConnectConversations'],
    }),

    /**
     * Get Conversations
     * Route: GET /api/v1/connect/conversations
     */
    getConnectConversations: builder.query<ConnectConversation[], void>({
      query: () => '/connect/conversations',
      transformResponse: (response: any): ConnectConversation[] => {
        const data = unwrapConnectResponse<any>(response);
        const list = Array.isArray(data) ? data : data?.conversations || [];
        return list.map(normalizeConversation);
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'ConnectConversations' as const, id })),
              { type: 'ConnectConversations', id: 'LIST' },
            ]
          : [{ type: 'ConnectConversations', id: 'LIST' }],
    }),

    /**
     * Get Conversation Messages with Cursor Pagination
     * Route: GET /api/v1/connect/conversations/{conversationId}/messages?limit=50&before=<uuid>
     */
    getConnectMessages: builder.query<ConnectMessage[], GetConnectMessagesParams>({
      query: ({ conversationId, limit = 50, before, after, search }) => {
        const queryParams = new URLSearchParams();
        queryParams.append('limit', String(limit));
        if (before) queryParams.append('before', before);
        if (after) queryParams.append('after', after);
        if (search) queryParams.append('search', search);

        return `/connect/conversations/${conversationId}/messages?${queryParams.toString()}`;
      },
      transformResponse: (response: any): ConnectMessage[] => {
        const data = unwrapConnectResponse<any>(response);
        const list = Array.isArray(data) ? data : data?.messages || [];
        return list.map(normalizeMessage);
      },
      providesTags: (_result, _error, { conversationId }) => [
        { type: 'ConnectMessages', id: conversationId },
      ],
    }),

    /**
     * Send Conversation Message
     * Route: POST /api/v1/connect/conversations/{conversationId}/messages
     */
    sendConnectMessage: builder.mutation<ConnectMessage, SendConnectMessagePayload>({
      query: ({ conversationId, text, attachments, voiceUrl, voiceDuration, replyToMessageId }) => ({
        url: `/connect/conversations/${conversationId}/messages`,
        method: 'POST',
        body: {
          text: text || '',
          content: text || '',
          attachments: attachments || [],
          voiceUrl: (voiceUrl !== undefined && voiceUrl !== null) ? voiceUrl : null,
          voiceDuration: (voiceDuration !== undefined && voiceDuration !== null) ? voiceDuration : null,
          replyToMessageId: (replyToMessageId !== undefined && replyToMessageId !== null) ? replyToMessageId : null,
        },
      }),
      transformResponse: (response: any): ConnectMessage => {
        const data = unwrapConnectResponse<any>(response);
        return normalizeMessage(data);
      },
      invalidatesTags: (_result, _error, { conversationId }) => [
        { type: 'ConnectMessages', id: conversationId },
        { type: 'ConnectConversations', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetColleaguesQuery,
  useCreateOrGetConversationMutation,
  useGetConnectConversationsQuery,
  useGetConnectMessagesQuery,
  useSendConnectMessageMutation,
} = connectApi;

export default connectApi;
