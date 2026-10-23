/**
 * @file ConnectPage.tsx
 * @description Enterprise 2-Pane Employee Chat & Directory (OFC360 Connect).
 * Left pane toggles between Active Chats & Colleague Directory.
 * Right pane provides live conversation stream, presence badges, typing indicators,
 * reply-to message quoting, cursor pagination, and WebSocket / REST status monitoring.
 */

import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Search,
  MessageSquare,
  Users,
  Send,
  CornerUpLeft,
  X,
  Radio,
  Wifi,
  WifiOff,
  CheckCheck,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { useToast } from '@/shared/ui/Toast';
import {
  useGetColleaguesQuery,
  useCreateOrGetConversationMutation,
  useGetConnectConversationsQuery,
  useGetConnectMessagesQuery,
  useSendConnectMessageMutation,
} from '../api/connectApi';
import { useConnectWebSocket } from '../hooks/useConnectWebSocket';
import type {
  Colleague,
  ConnectMessage,
  PresenceStatus,
} from '../types';

export const ConnectPage: React.FC = () => {
  const toast = useToast();

  // Active view on left pane: 'chats' | 'colleagues'
  const [activeTab, setActiveTab] = useState<'chats' | 'colleagues'>('chats');
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

  // Colleague filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('ALL');
  const [selectedPresence, setSelectedPresence] = useState<string>('ALL');

  // Chat message composer states
  const [inputText, setInputText] = useState('');
  const [replyToMessage, setReplyToMessage] = useState<ConnectMessage | null>(null);
  const [isSending, setIsSending] = useState(false);

  // Pagination cursor
  const [cursorBefore, setCursorBefore] = useState<string | undefined>(undefined);
  const [olderMessages, setOlderMessages] = useState<ConnectMessage[]>([]);

  // WebSocket integration
  const { isSocketLive, sendTyping, typingMap } = useConnectWebSocket({
    activeConversationId: activeConversationId || undefined,
  });

  // Queries
  const {
    data: colleaguesData,
    isLoading: isColleaguesLoading,
    refetch: refetchColleagues,
  } = useGetColleaguesQuery({
    search: searchQuery || undefined,
    department: selectedDept !== 'ALL' ? selectedDept : undefined,
    presence: selectedPresence !== 'ALL' ? selectedPresence : undefined,
  });

  const {
    data: conversations = [],
    isLoading: isConversationsLoading,
    refetch: refetchConversations,
  } = useGetConnectConversationsQuery(undefined, {
    // If WebSocket is not live, poll every 5 seconds as fallback
    pollingInterval: isSocketLive ? 0 : 5000,
  });

  // Auto-select first conversation if none selected
  useEffect(() => {
    if (!activeConversationId && conversations.length > 0) {
      setActiveConversationId(conversations[0].id);
    }
  }, [conversations, activeConversationId]);

  // Messages Query for active conversation
  const {
    data: currentMessages = [],
    isLoading: isMessagesLoading,
    refetch: refetchMessages,
  } = useGetConnectMessagesQuery(
    {
      conversationId: activeConversationId || '',
      limit: 50,
      before: cursorBefore,
    },
    {
      skip: !activeConversationId,
      // If WebSocket is not live, poll every 3 seconds for active conversation
      pollingInterval: isSocketLive ? 0 : 3000,
    }
  );

  // Append older messages if loaded via cursor
  useEffect(() => {
    if (cursorBefore && currentMessages.length > 0) {
      setOlderMessages((prev) => {
        const existingIds = new Set(prev.map((m) => m.id));
        const newOnes = currentMessages.filter((m) => !existingIds.has(m.id));
        return [...newOnes, ...prev];
      });
    }
  }, [currentMessages, cursorBefore]);

  // Clear cursor on conversation switch
  useEffect(() => {
    setCursorBefore(undefined);
    setOlderMessages([]);
    setReplyToMessage(null);
    setInputText('');
  }, [activeConversationId]);

  // Combined messages
  const allMessages = useMemo(() => {
    if (olderMessages.length > 0) {
      const combined = [...olderMessages, ...currentMessages];
      const seen = new Set<string>();
      return combined.filter((m) => {
        if (seen.has(m.id)) return false;
        seen.add(m.id);
        return true;
      });
    }
    return currentMessages;
  }, [olderMessages, currentMessages]);

  // Mutations
  const [createOrGetConversation] = useCreateOrGetConversationMutation();
  const [sendConnectMessage] = useSendConnectMessageMutation();

  // Active conversation object
  const activeConversation = useMemo(
    () => conversations.find((c) => c.id === activeConversationId),
    [conversations, activeConversationId]
  );

  // Other participant in DM
  const otherParticipant = useMemo(() => {
    if (!activeConversation || !activeConversation.participants) return null;
    return activeConversation.participants[0] || null;
  }, [activeConversation]);

  // Scroll to bottom
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!cursorBefore) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [allMessages, cursorBefore]);

  // Handle click on colleague -> Create or Open DM
  const handleSelectColleague = async (colleague: Colleague) => {
    try {
      const conv = await createOrGetConversation({ targetUserId: colleague.id }).unwrap();
      setActiveConversationId(conv.id);
      setActiveTab('chats');
      toast.info(`Opened conversation with ${colleague.name}`, 'OFC Connect');
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to open conversation with colleague.', 'Error');
    }
  };

  // Handle Send Message
  const handleSendMessage = async () => {
    const trimmed = inputText.trim();
    if (!trimmed || !activeConversationId || isSending) return;

    setIsSending(true);
    try {
      await sendConnectMessage({
        conversationId: activeConversationId,
        text: trimmed,
        replyToMessageId: replyToMessage?.id,
      }).unwrap();

      setInputText('');
      setReplyToMessage(null);
      if (otherParticipant?.userId) {
        sendTyping(otherParticipant.userId, false);
      }
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to deliver message.', 'Error');
    } finally {
      setIsSending(false);
    }
  };

  // Handle Input Keydown (Enter to send, Shift+Enter for newline)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Handle typing change
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    if (otherParticipant?.userId) {
      sendTyping(otherParticipant.userId, true);
    }
  };

  // Helper for presence indicator dot
  const renderPresenceDot = (status: PresenceStatus = 'offline') => {
    switch (status) {
      case 'online':
        return <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-xs" title="Online" />;
      case 'away':
        return <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-xs" title="Away" />;
      case 'busy':
      case 'dnd':
        return <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-xs" title="Do Not Disturb" />;
      default:
        return <span className="w-2.5 h-2.5 rounded-full bg-gray-400 dark:bg-zinc-600" title="Offline" />;
    }
  };

  // Check if other participant is currently typing
  const isOtherTyping = Boolean(otherParticipant?.userId && typingMap[otherParticipant.userId]);

  return (
    <div className="h-[calc(100vh-5rem)] min-h-[600px] flex rounded-2xl overflow-hidden border border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#171717] shadow-sm">
      {/* =========================================================================
          LEFT PANE: Conversation List & Colleague Directory
         ========================================================================= */}
      <aside className="w-80 sm:w-96 border-r border-gray-200 dark:border-zinc-800 flex flex-col h-full bg-white dark:bg-[#171717] shrink-0">
        {/* Header with Title and Mode Switcher */}
        <div className="p-4 border-b border-gray-200 dark:border-zinc-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center border border-brand-500/20">
                <Radio className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-gray-900 dark:text-[#ececec]">
                  OFC360 Connect
                </h2>
                <p className="text-[11px] text-gray-500 dark:text-zinc-400">
                  Employee Real-Time Collaboration
                </p>
              </div>
            </div>

            {/* Socket status pill */}
            <div
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${
                isSocketLive
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60'
                  : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/60'
              }`}
              title={isSocketLive ? 'Connected via real-time WebSocket' : 'Polling via REST fallback'}
            >
              {isSocketLive ? (
                <>
                  <Wifi className="w-3 h-3 text-emerald-500" />
                  <span>Live WS</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3 h-3 text-amber-500" />
                  <span>Polling</span>
                </>
              )}
            </div>
          </div>

          {/* Toggle Tabs: Chats vs Colleagues */}
          <div className="grid grid-cols-2 p-1 bg-gray-100 dark:bg-zinc-800/60 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveTab('chats')}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg transition-all ${
                activeTab === 'chats'
                  ? 'bg-white dark:bg-zinc-700 text-gray-900 dark:text-white shadow-xs font-bold'
                  : 'text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Chats ({conversations.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('colleagues')}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg transition-all ${
                activeTab === 'colleagues'
                  ? 'bg-white dark:bg-zinc-700 text-gray-900 dark:text-white shadow-xs font-bold'
                  : 'text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Colleagues</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Active Conversations List */}
        {activeTab === 'chats' && (
          <div className="flex-1 overflow-y-auto divide-y divide-gray-100 dark:divide-zinc-800/60">
            {isConversationsLoading ? (
              <div className="p-8 text-center text-xs text-gray-400">Loading active chats...</div>
            ) : conversations.length === 0 ? (
              <div className="p-8 text-center space-y-3">
                <MessageSquare className="w-8 h-8 text-gray-300 dark:text-zinc-600 mx-auto" />
                <p className="text-xs text-gray-500 dark:text-zinc-400">No active conversations yet.</p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setActiveTab('colleagues')}
                  className="rounded-xl text-xs"
                >
                  Find a Colleague
                </Button>
              </div>
            ) : (
              conversations.map((conv) => {
                const participant = conv.participants[0];
                const isActive = conv.id === activeConversationId;
                return (
                  <button
                    key={conv.id}
                    onClick={() => setActiveConversationId(conv.id)}
                    className={`w-full p-3.5 text-left flex items-start gap-3 transition-colors ${
                      isActive
                        ? 'bg-brand-50/70 dark:bg-brand-950/30 border-l-4 border-brand-500'
                        : 'hover:bg-gray-50 dark:hover:bg-zinc-800/40'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-500 to-indigo-600 text-white font-bold flex items-center justify-center text-xs shadow-2xs">
                        {participant?.avatarUrl ? (
                          <img
                            src={participant.avatarUrl}
                            alt={participant.name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          participant?.name?.substring(0, 2).toUpperCase() || 'DM'
                        )}
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 ring-2 ring-white dark:ring-zinc-900 rounded-full">
                        {renderPresenceDot(participant?.presenceStatus)}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-xs font-bold text-gray-900 dark:text-[#ececec] truncate">
                          {participant?.name || 'Direct Chat'}
                        </span>
                        {conv.lastMessageAt && (
                          <span className="text-[10px] text-gray-400 shrink-0">
                            {new Date(conv.lastMessageAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-zinc-400 truncate">
                        {conv.lastMessagePreview || 'Click to start conversation'}
                      </p>
                    </div>

                    {conv.unreadCount > 0 && (
                      <span className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-500 text-white">
                        {conv.unreadCount}
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        )}

        {/* Tab 2: Colleague Directory */}
        {activeTab === 'colleagues' && (
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            {/* Search and Filters */}
            <div className="p-3 border-b border-gray-200 dark:border-zinc-800/80 space-y-2 bg-gray-50/50 dark:bg-zinc-900/40">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search name, email, role..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-zinc-100 placeholder-gray-400 focus:outline-hidden focus:ring-1 focus:ring-brand-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="flex-1 px-2.5 py-1 text-[11px] rounded-lg bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-zinc-300"
                >
                  <option value="ALL">All Depts</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Product">Product</option>
                  <option value="Design">Design</option>
                  <option value="Human Resources">HR</option>
                  <option value="Finance">Finance</option>
                  <option value="Operations">Operations</option>
                </select>

                <select
                  value={selectedPresence}
                  onChange={(e) => setSelectedPresence(e.target.value)}
                  className="flex-1 px-2.5 py-1 text-[11px] rounded-lg bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-zinc-300"
                >
                  <option value="ALL">All Status</option>
                  <option value="online">Online</option>
                  <option value="away">Away</option>
                  <option value="busy">Busy / DND</option>
                  <option value="offline">Offline</option>
                </select>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => refetchColleagues()}
                  className="px-2 py-1 h-7"
                  title="Refresh Colleague Directory"
                >
                  <RefreshCw className="w-3 h-3 text-gray-500" />
                </Button>
              </div>
            </div>

            {/* Colleagues List */}
            <div className="flex-1 overflow-y-auto divide-y divide-gray-100 dark:divide-zinc-800/60">
              {isColleaguesLoading ? (
                <div className="p-8 text-center text-xs text-gray-400">Loading directory...</div>
              ) : !colleaguesData?.colleagues || colleaguesData.colleagues.length === 0 ? (
                <div className="p-8 text-center text-xs text-gray-400">No colleagues found.</div>
              ) : (
                colleaguesData.colleagues.map((colleague) => (
                  <button
                    key={colleague.id}
                    onClick={() => handleSelectColleague(colleague)}
                    className="w-full p-3 text-left flex items-center justify-between gap-3 hover:bg-gray-50 dark:hover:bg-zinc-800/40 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative shrink-0">
                        <div className="w-9 h-9 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold flex items-center justify-center text-xs border border-indigo-500/20">
                          {colleague.avatarUrl ? (
                            <img
                              src={colleague.avatarUrl}
                              alt={colleague.name}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            colleague.name.substring(0, 2).toUpperCase()
                          )}
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 ring-2 ring-white dark:ring-zinc-900 rounded-full">
                          {renderPresenceDot(colleague.presenceStatus)}
                        </div>
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs font-bold text-gray-900 dark:text-[#ececec] truncate">
                          {colleague.name}
                        </p>
                        <p className="text-[11px] text-gray-500 dark:text-zinc-400 truncate">
                          {colleague.designation || colleague.department || colleague.email}
                        </p>
                      </div>
                    </div>

                    <span className="shrink-0 text-[10px] text-brand-600 dark:text-brand-400 font-semibold px-2 py-1 rounded-md bg-brand-50 dark:bg-brand-950/30">
                      Message
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </aside>

      {/* =========================================================================
          RIGHT PANE: Active Chat Stream & Message Composer
         ========================================================================= */}
      <main className="flex-1 flex flex-col h-full bg-[#fcfcfd] dark:bg-[#121212] overflow-hidden">
        {activeConversation ? (
          <>
            {/* Chat Header Bar */}
            <header className="h-14 px-5 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between bg-white dark:bg-[#171717] shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-brand-500 to-indigo-600 text-white font-bold flex items-center justify-center text-xs shadow-2xs">
                    {otherParticipant?.avatarUrl ? (
                      <img
                        src={otherParticipant.avatarUrl}
                        alt={otherParticipant.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      otherParticipant?.name?.substring(0, 2).toUpperCase() || 'DM'
                    )}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 ring-2 ring-white dark:ring-zinc-900 rounded-full">
                    {renderPresenceDot(otherParticipant?.presenceStatus)}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-[#ececec]">
                    {otherParticipant?.name || 'Direct Conversation'}
                  </h3>
                  <div className="flex items-center gap-2 text-[11px] text-gray-500 dark:text-zinc-400">
                    <span className="capitalize">{otherParticipant?.presenceStatus || 'offline'}</span>
                    <span>•</span>
                    <span>{otherParticipant?.email || 'Tenant Isolated'}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    refetchMessages();
                    refetchConversations();
                  }}
                  className="rounded-xl text-xs flex items-center gap-1.5 h-8"
                  title="Force Sync Conversation"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sync</span>
                </Button>
              </div>
            </header>

            {/* Message Stream */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {/* Load Older Messages Cursor Button */}
              {allMessages.length > 0 && (
                <div className="text-center py-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      if (allMessages.length > 0) {
                        setCursorBefore(allMessages[0].id);
                      }
                    }}
                    className="text-xs text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white rounded-lg h-7 px-3"
                  >
                    Load older messages
                  </Button>
                </div>
              )}

              {isMessagesLoading && allMessages.length === 0 ? (
                <div className="h-48 flex items-center justify-center text-xs text-gray-400">
                  Loading message history...
                </div>
              ) : allMessages.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-center space-y-2 text-gray-400">
                  <MessageSquare className="w-10 h-10 stroke-1 text-gray-300 dark:text-zinc-700" />
                  <p className="text-xs">No messages yet. Say hello to get started!</p>
                </div>
              ) : (
                allMessages.map((msg) => {
                  const isMe = msg.senderId !== otherParticipant?.userId;

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col group ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      {/* Replying quote snippet */}
                      {msg.replyToId && (
                        <div
                          className={`flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-zinc-400 mb-1 px-3 py-1 rounded-md bg-gray-100/70 dark:bg-zinc-800/60 max-w-md ${
                            isMe ? 'mr-1' : 'ml-1'
                          }`}
                        >
                          <CornerUpLeft className="w-3 h-3 shrink-0 text-brand-500" />
                          <span className="truncate">Replying to previous message</span>
                        </div>
                      )}

                      <div className="flex items-end gap-2 max-w-lg sm:max-w-xl">
                        {!isMe && (
                          <div className="w-7 h-7 rounded-full bg-gray-200 dark:bg-zinc-700 text-gray-700 dark:text-zinc-300 text-[10px] font-bold flex items-center justify-center shrink-0 mb-1">
                            {otherParticipant?.name?.substring(0, 1).toUpperCase() || 'U'}
                          </div>
                        )}

                        <div
                          className={`relative rounded-2xl px-4 py-2.5 text-xs sm:text-sm shadow-2xs leading-relaxed transition-all ${
                            isMe
                              ? 'bg-brand-600 text-white rounded-br-xs'
                              : 'bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-[#ececec] border border-gray-200/80 dark:border-zinc-800 rounded-bl-xs'
                          }`}
                        >
                          {/* Message Content */}
                          <p className="whitespace-pre-wrap select-text">{msg.content}</p>

                          {/* Timestamp and Delivery Indicators */}
                          <div
                            className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${
                              isMe ? 'text-brand-100' : 'text-gray-400 dark:text-zinc-500'
                            }`}
                          >
                            <span>
                              {new Date(msg.createdAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                            {isMe && <CheckCheck className="w-3.5 h-3.5 text-brand-200" />}
                          </div>
                        </div>

                        {/* Reply trigger button */}
                        <button
                          onClick={() => setReplyToMessage(msg)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200"
                          title="Reply to this message"
                        >
                          <CornerUpLeft className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}

              {/* Typing indicator banner */}
              {isOtherTyping && (
                <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-zinc-500 italic pl-9 animate-pulse">
                  <span>{otherParticipant?.name || 'Colleague'} is typing...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Message Composer Area */}
            <div className="p-4 border-t border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#171717] shrink-0 space-y-2">
              {/* Reply Quote Banner */}
              {replyToMessage && (
                <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-gray-50 dark:bg-zinc-800/80 border border-gray-200 dark:border-zinc-700 text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <CornerUpLeft className="w-3.5 h-3.5 text-brand-500 shrink-0" />
                    <span className="font-semibold text-gray-700 dark:text-zinc-300">
                      Replying to {replyToMessage.senderName}:
                    </span>
                    <span className="text-gray-500 dark:text-zinc-400 truncate">
                      {replyToMessage.content}
                    </span>
                  </div>
                  <button
                    onClick={() => setReplyToMessage(null)}
                    className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <div className="flex items-end gap-2 bg-gray-50 dark:bg-[#121212] border border-gray-200 dark:border-zinc-800 rounded-2xl p-2 focus-within:ring-2 focus-within:ring-brand-500/20 focus-within:border-brand-500 transition-all">
                <textarea
                  rows={1}
                  value={inputText}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder={`Message ${otherParticipant?.name || 'colleague'}... (Enter to send, Shift+Enter for new line)`}
                  className="flex-1 bg-transparent border-0 resize-none text-xs sm:text-sm text-gray-900 dark:text-[#ececec] placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-hidden py-1 px-2 max-h-32"
                />

                <Button
                  size="sm"
                  variant="primary"
                  onClick={handleSendMessage}
                  disabled={!inputText.trim() || isSending}
                  className="rounded-xl h-8 px-3 shrink-0 flex items-center gap-1.5 shadow-2xs shadow-brand-500/20"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Send</span>
                </Button>
              </div>
            </div>
          </>
        ) : (
          /* Empty State when no conversation selected */
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 flex items-center justify-center border border-brand-200/60 dark:border-brand-900/40 shadow-sm">
              <Radio className="w-8 h-8" />
            </div>
            <div className="max-w-md space-y-1">
              <h3 className="text-base font-bold text-gray-900 dark:text-[#ececec]">
                Welcome to OFC360 Connect
              </h3>
              <p className="text-xs text-gray-500 dark:text-zinc-400">
                Direct employee-to-employee messaging with presence indicators, WebSockets, and directory discovery. Select an active conversation or browse colleagues on the left.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveTab('colleagues')}
              className="rounded-xl text-xs flex items-center gap-2"
            >
              <Users className="w-3.5 h-3.5 text-brand-500" />
              <span>Explore Colleague Directory</span>
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default ConnectPage;
