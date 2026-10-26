/**
 * @file ChatAssistantPage.tsx
 * @description Enterprise AI Chat Assistant Page with full-width interactive message stream window,
 * auto-scroll, prompt actions, and clean input bar.
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/shared/ui/Toast';
import {
  useGetConversationsQuery,
  useGetConversationMessagesQuery,
  useCreateConversationMutation,
  useSendMessageMutation,
  useClearConversationHistoryMutation,
} from '../api/chatAssistantApi';
import type {
  ChatMessage,
  ChatContextScope,
  ChatActionChip,
} from '../types';
import { ChatWindow } from '../components/ChatWindow';
import { ChatInputBar } from '../components/ChatInputBar';

export const ChatAssistantPage: React.FC = () => {
  const toast = useToast();
  const navigate = useNavigate();

  // Selected thread & scope states
  const [activeId, setActiveId] = useState<string | undefined>(undefined);
  const activeScope: ChatContextScope = 'GENERAL';

  // Optimistic in-flight message state for instant UI responsiveness
  const [optimisticMessages, setOptimisticMessages] = useState<ChatMessage[]>([]);

  // RTK Query: Thread history
  const { data: conversations = [] } = useGetConversationsQuery();

  // Auto-select first conversation if none selected
  useEffect(() => {
    if (!activeId && conversations.length > 0) {
      setActiveId(conversations[0].id);
    }
  }, [conversations, activeId]);

  // RTK Query: Messages for active conversation
  const {
    data: remoteMessages = [],
    isLoading: isMessagesLoading,
  } = useGetConversationMessagesQuery(activeId || '', {
    skip: !activeId,
  });

  // Mutations
  const [createConversation] = useCreateConversationMutation();
  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();
  const [clearHistory] = useClearConversationHistoryMutation();

  const activeConversation = useMemo(
    () => conversations.find((c) => c.id === activeId),
    [conversations, activeId]
  );

  // Combined messages: remote messages + any optimistic ones not yet in remote
  const displayedMessages = useMemo(() => {
    const existingIds = new Set(remoteMessages.map((m) => m.id));
    const pending = optimisticMessages.filter((m) => !existingIds.has(m.id));
    return [...remoteMessages, ...pending];
  }, [remoteMessages, optimisticMessages]);

  // Handle New Chat creation
  const handleNewChat = useCallback(async () => {
    try {
      const newThread = await createConversation({
        title: 'New Conversation',
        contextScope: activeScope,
      }).unwrap();
      setActiveId(newThread.id);
      setOptimisticMessages([]);
      toast.success('Started a fresh conversation session.', 'New Chat');
    } catch {
      // Local fallback for offline/development prior to backend deployment
      const tempId = `conv_${Date.now()}`;
      setActiveId(tempId);
      setOptimisticMessages([]);
    }
  }, [createConversation, activeScope, toast]);

  // Handle Clear Conversation History
  const handleClearHistory = useCallback(async () => {
    if (!activeId) return;
    try {
      await clearHistory(activeId).unwrap();
      setOptimisticMessages([]);
      toast.info('Conversation messages cleared.', 'History Cleared');
    } catch {
      setOptimisticMessages([]);
    }
  }, [activeId, clearHistory, toast]);

  // Handle Message Submission
  const handleSendMessage = useCallback(
    async (prompt: string, scope: ChatContextScope = 'GENERAL') => {
      const tempUserId = `user_${Date.now()}`;
      const userMessage: ChatMessage = {
        id: tempUserId,
        conversationId: activeId || 'new',
        role: 'user',
        content: prompt,
        timestamp: new Date().toISOString(),
        status: 'sending',
        contextScope: scope,
      };

      // Push optimistic user message
      setOptimisticMessages((prev) => [...prev, userMessage]);

      try {
        const response = await sendMessage({
          conversationId: activeId,
          prompt,
          contextScope: scope,
        }).unwrap();

        // Update active thread ID if new conversation was initialized
        if (response?.conversationId && response.conversationId !== activeId) {
          setActiveId(response.conversationId);
        }

        // Update optimistic state
        setOptimisticMessages((prev) =>
          prev.map((m) => (m.id === tempUserId ? { ...m, status: 'sent' } : m))
        );
      } catch (err: any) {
        // Mark user message as error
        setOptimisticMessages((prev) =>
          prev.map((m) => (m.id === tempUserId ? { ...m, status: 'error' } : m))
        );
        toast.error(
          err?.data?.message || err?.data?.detail || 'Unable to get response from AI Assistant.',
          'Delivery Error'
        );
      }
    },
    [activeId, sendMessage, toast]
  );

  // Handle Action Chip Clicks
  const handleActionClick = useCallback(
    (action: ChatActionChip) => {
      toast.info(`Triggered: ${action.label}`, 'Action Selected');

      // Smart routing based on actionType
      switch (action.actionType) {
        case 'APPLY_LEAVE':
          navigate('/dashboard/hr-admin#leave');
          break;
        case 'VIEW_PAYSLIP':
          navigate('/dashboard/hr-admin#payroll');
          break;
        case 'VIEW_POLICY':
          navigate('/dashboard/analytics');
          break;
        case 'SUBMIT_TRAVEL':
          navigate('/dashboard/travel');
          break;
        default:
          break;
      }
    },
    [navigate, toast]
  );

  return (
    <div className="h-[calc(100vh-5rem)] min-h-[550px] flex rounded-2xl overflow-hidden border border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#171717] shadow-sm">
      {/* Main Conversation Area - Full Width */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <ChatWindow
          conversation={activeConversation}
          messages={displayedMessages}
          isLoadingMessages={isMessagesLoading}
          isSending={isSending}
          activeScope={activeScope}
          onSelectPrompt={(p, s) => handleSendMessage(p, s || activeScope)}
          onActionClick={handleActionClick}
          onClearHistory={handleClearHistory}
          onNewChat={handleNewChat}
          onRetryMessage={(msg) => handleSendMessage(msg.content, msg.contextScope || activeScope)}
        />

        <ChatInputBar
          onSendMessage={handleSendMessage}
          isSending={isSending}
          activeScope={activeScope}
        />
      </div>
    </div>
  );
};

export default ChatAssistantPage;
