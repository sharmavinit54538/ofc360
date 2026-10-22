/**
 * @file types.ts
 * @description Enterprise TypeScript models and interfaces for the AI Chat Assistant Module,
 * supporting conversational threads, multi-role message exchange, contextual scopes,
 * action chips, and prompt recommendations.
 */

export type MessageRole = 'user' | 'assistant' | 'system';

export type MessageStatus = 'sending' | 'sent' | 'error';

export type ChatContextScope = 'GENERAL' | 'LEAVE' | 'PAYROLL' | 'POLICY';

export interface ChatActionChip {
  label: string;
  actionType: string;
  payload?: Record<string, unknown>;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  role: MessageRole;
  content: string;
  timestamp: string;
  status: MessageStatus;
  actions?: ChatActionChip[];
  contextScope?: ChatContextScope;
}

export interface ConversationThread {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  lastMessage?: string;
  pinned?: boolean;
  contextScope?: ChatContextScope;
  messageCount?: number;
}

export interface SendMessagePayload {
  conversationId?: string;
  prompt: string;
  contextScope?: ChatContextScope;
}

export interface CreateConversationPayload {
  title?: string;
  initialPrompt?: string;
  contextScope?: ChatContextScope;
}

export interface SendMessageResponse {
  message: ChatMessage;
  reply: ChatMessage;
  conversationId: string;
  title?: string;
}

export interface ClearConversationHistoryPayload {
  conversationId: string;
}
