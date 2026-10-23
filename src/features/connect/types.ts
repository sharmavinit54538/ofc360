/**
 * @file types.ts
 * @description Enterprise TypeScript models and interfaces for OFC360 Connect
 * (Employee-to-Employee Chat, directory discovery, presence, real-time messaging, and WebSockets).
 */

export type PresenceStatus = 'online' | 'away' | 'busy' | 'dnd' | 'offline';

export interface Colleague {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: string;
  department?: string | null;
  designation?: string | null;
  avatarUrl?: string | null;
  presenceStatus: PresenceStatus;
  customStatus?: string | null;
  lastSeenAt?: string | null;
}

export interface ColleaguesResponse {
  colleagues: Colleague[];
  total: number;
  page: number;
  limit: number;
}

export interface ConnectParticipant {
  id: string;
  userId: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
  role: string;
  presenceStatus: PresenceStatus;
  isMuted?: boolean;
  lastReadAt?: string | null;
}

export interface ConnectConversation {
  id: string;
  companyId: string;
  participants: ConnectParticipant[];
  lastMessagePreview?: string | null;
  lastMessageAt?: string | null;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface MessageAttachment {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
}

export interface MessageReaction {
  emoji: string;
  count: number;
  users: string[];
  hasReacted?: boolean;
}

export interface ConnectMessage {
  id: string;
  conversationId?: string | null;
  channelId?: string | null;
  senderId: string;
  senderName: string;
  senderAvatar?: string | null;
  content?: string | null;
  voiceUrl?: string | null;
  voiceDuration?: number | null;
  isPinned?: boolean;
  pinnedAt?: string | null;
  pinnedBy?: string | null;
  replyToId?: string | null;
  replyToMessage?: ConnectMessage | null;
  parentMessageId?: string | null;
  threadCount?: number;
  reactions?: MessageReaction[];
  attachments?: MessageAttachment[];
  isDeleted?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GetColleaguesParams {
  search?: string;
  department?: string;
  presence?: PresenceStatus | string;
  page?: number;
  limit?: number;
}

export interface CreateConversationPayload {
  targetUserId: string;
}

export interface GetConnectMessagesParams {
  conversationId: string;
  search?: string;
  before?: string;
  after?: string;
  limit?: number;
}

export interface SendConnectMessagePayload {
  conversationId: string;
  text?: string;
  attachments?: Array<{
    fileName: string;
    fileUrl: string;
    fileType?: string;
    fileSize?: number;
  }>;
  voiceUrl?: string;
  voiceDuration?: number;
  replyToMessageId?: string;
}

export interface WebSocketEvent<T = any> {
  event?: string;
  type?: string;
  data?: T;
  conversation_id?: string;
  message?: any;
  user_id?: string;
  is_typing?: boolean;
  [key: string]: any;
}
