/**
 * @file connectAndChat.test.ts
 * @description Unit tests for OFC360 Connect and AI Chat Assistant integrations:
 * - WebSocket URL derivation across HTTP/HTTPS and token injection
 * - Connect and Chat Assistant response normalizers
 * - Endpoint URL definitions, HTTP methods, and cache tag conventions
 */

import { describe, it, expect } from 'vitest';
import { deriveConnectWebSocketUrl } from '../hooks/useConnectWebSocket';
import {
  normalizeColleague,
  normalizeConversation,
  normalizeMessage,
  connectApi,
} from '../api/connectApi';
import {
  normalizeConversationItem,
  normalizeChatMessage,
  chatAssistantApi,
} from '@/services/chatAssistantApi';

describe('OFC360 Connect: WebSocket URL Derivation', () => {
  it('converts https:// base URL to wss:// and appends /connect/ws', () => {
    const url = deriveConnectWebSocketUrl('https://api.ofc360.com/api/v1');
    expect(url).toBe('wss://api.ofc360.com/api/v1/connect/ws');
  });

  it('converts http:// base URL to ws:// for local development', () => {
    const url = deriveConnectWebSocketUrl('http://localhost:8000/api/v1');
    expect(url).toBe('ws://localhost:8000/api/v1/connect/ws');
  });

  it('strips trailing slashes from base URL gracefully', () => {
    const url = deriveConnectWebSocketUrl('https://api.ofc360.com/api/v1///');
    expect(url).toBe('wss://api.ofc360.com/api/v1/connect/ws');
  });

  it('attaches JWT token as encoded query param when provided', () => {
    const fakeToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test-jwt-token';
    const url = deriveConnectWebSocketUrl('https://api.ofc360.com/api/v1', fakeToken);
    expect(url).toBe(
      `wss://api.ofc360.com/api/v1/connect/ws?token=${encodeURIComponent(fakeToken)}`
    );
  });
});

describe('OFC360 Connect: Response Normalization', () => {
  it('normalizes raw colleague dictionary with snake_case fields into Colleague object', () => {
    const raw = {
      id: 'd8c4c781-a790-48e0-a7d1-e630737a3421',
      name: 'Priya Sharma',
      email: 'priya.sharma@ofc360.com',
      phone: '+91 9876543210',
      role: 'hr_manager',
      department: 'Human Resources',
      designation: 'Senior HR Specialist',
      avatar_url: 'https://images.ofc360.com/avatars/priya.png',
      presence_status: 'online',
      custom_status: 'In an interview',
      last_seen_at: '2026-10-23T10:15:00Z',
    };

    const colleague = normalizeColleague(raw);

    expect(colleague.id).toBe(raw.id);
    expect(colleague.name).toBe('Priya Sharma');
    expect(colleague.avatarUrl).toBe('https://images.ofc360.com/avatars/priya.png');
    expect(colleague.presenceStatus).toBe('online');
    expect(colleague.customStatus).toBe('In an interview');
    expect(colleague.lastSeenAt).toBe('2026-10-23T10:15:00Z');
  });

  it('normalizes raw conversation item with participants', () => {
    const raw = {
      id: 'conv-1234-uuid',
      company_id: 'tenant-999-uuid',
      last_message_preview: 'Hey, did you review the offer letter?',
      last_message_at: '2026-10-23T10:30:00Z',
      unread_count: 2,
      participants: [
        {
          id: 'part-1',
          user_id: 'user-456',
          name: 'Vinit Sharma',
          email: 'vinit@ofc360.com',
          avatar_url: null,
          role: 'employee',
          presence_status: 'online',
          is_muted: false,
        },
      ],
      created_at: '2026-10-23T09:00:00Z',
      updated_at: '2026-10-23T10:30:00Z',
    };

    const conv = normalizeConversation(raw);

    expect(conv.id).toBe('conv-1234-uuid');
    expect(conv.companyId).toBe('tenant-999-uuid');
    expect(conv.lastMessagePreview).toBe('Hey, did you review the offer letter?');
    expect(conv.unreadCount).toBe(2);
    expect(conv.participants).toHaveLength(1);
    expect(conv.participants[0].userId).toBe('user-456');
    expect(conv.participants[0].presenceStatus).toBe('online');
  });

  it('normalizes raw message payload with attachments and reactions', () => {
    const raw = {
      id: 'msg-789-uuid',
      conversation_id: 'conv-1234-uuid',
      sender_id: 'user-456',
      sender_name: 'Vinit Sharma',
      content: 'Here is the quarterly budget plan.',
      attachments: [
        {
          id: 'att-1',
          file_name: 'Budget_Q4.pdf',
          file_url: 'https://files.ofc360.com/Budget_Q4.pdf',
          file_type: 'application/pdf',
          file_size: 1048576,
        },
      ],
      reactions: [{ emoji: '👍', count: 3, users: ['u1', 'u2', 'u3'], has_reacted: true }],
      created_at: '2026-10-23T10:32:00Z',
      updated_at: '2026-10-23T10:32:00Z',
    };

    const msg = normalizeMessage(raw);

    expect(msg.id).toBe('msg-789-uuid');
    expect(msg.conversationId).toBe('conv-1234-uuid');
    expect(msg.content).toBe('Here is the quarterly budget plan.');
    expect(msg.attachments).toHaveLength(1);
    expect(msg.attachments?.[0].fileName).toBe('Budget_Q4.pdf');
    expect(msg.reactions).toHaveLength(1);
    expect(msg.reactions?.[0].hasReacted).toBe(true);
  });
});

describe('AI Chat Assistant: Response Normalization', () => {
  it('normalizes chat history item to ConversationThread', () => {
    const raw = {
      conversation_id: 'conv-ai-123',
      title: 'Leave Policy Query',
      last_message: 'You have 12 days of annual leave remaining.',
      message_count: 4,
      updated_at: '2026-10-23T08:00:00Z',
    };

    const thread = normalizeConversationItem(raw);

    expect(thread.id).toBe('conv-ai-123');
    expect(thread.title).toBe('Leave Policy Query');
    expect(thread.lastMessage).toBe('You have 12 days of annual leave remaining.');
    expect(thread.messageCount).toBe(4);
  });

  it('normalizes assistant reply turn and converts followUpQuestions to action chips', () => {
    const raw = {
      messageId: 'mid-111',
      conversationId: 'conv-ai-123',
      answer: 'Your salary statement for October has been generated.',
      followUpQuestions: ['View detailed payslip', 'Download tax certificate'],
      role: 'assistant',
    };

    const msg = normalizeChatMessage(raw, 'conv-ai-123');

    expect(msg.id).toBe('mid-111');
    expect(msg.role).toBe('assistant');
    expect(msg.content).toBe('Your salary statement for October has been generated.');
    expect(msg.actions).toHaveLength(2);
    expect(msg.actions?.[0].label).toBe('View detailed payslip');
    expect(msg.actions?.[0].actionType).toBe('SUGGESTION');
  });
});

describe('Connect & Chat Assistant RTK Query Endpoints', () => {
  it('connectApi defines required 5 endpoints', () => {
    expect(connectApi.endpoints.getColleagues).toBeDefined();
    expect(connectApi.endpoints.createOrGetConversation).toBeDefined();
    expect(connectApi.endpoints.getConnectConversations).toBeDefined();
    expect(connectApi.endpoints.getConnectMessages).toBeDefined();
    expect(connectApi.endpoints.sendConnectMessage).toBeDefined();
  });

  it('chatAssistantApi defines all remapped backend endpoints', () => {
    expect(chatAssistantApi.endpoints.getConversations).toBeDefined();
    expect(chatAssistantApi.endpoints.getConversationMessages).toBeDefined();
    expect(chatAssistantApi.endpoints.createConversation).toBeDefined();
    expect(chatAssistantApi.endpoints.sendMessage).toBeDefined();
    expect(chatAssistantApi.endpoints.clearConversationHistory).toBeDefined();
    expect(chatAssistantApi.endpoints.deleteConversation).toBeDefined();
    expect(chatAssistantApi.endpoints.getSuggestions).toBeDefined();
  });
});
