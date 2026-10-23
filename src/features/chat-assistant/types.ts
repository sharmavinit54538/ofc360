/**
 * @file types.ts
 * @description Enterprise TypeScript models and interfaces for the AI Chat Assistant Module,
 * supporting conversational threads, multi-role message exchange, contextual scopes,
 * action chips, suggestions, and backend contract normalization.
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
  conversation_id?: string;
  prompt?: string;
  message?: string;
  query?: string;
  contextScope?: ChatContextScope;
  context?: string;
}

export interface CreateConversationPayload {
  title?: string;
  initialPrompt?: string;
  initialMessage?: string;
  message?: string;
  query?: string;
  contextScope?: ChatContextScope;
  context?: string;
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

export interface ChatSuggestionsResponse {
  suggestedPrompts: string[];
  popularQueries: string[];
  roleBasedPrompts: string[];
}
