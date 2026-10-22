/**
 * @file ChatAssistantPage.tsx
 * @description Enterprise AI Chat Assistant Page integrating thread history sidebar,
 * interactive message stream window, auto-scroll, scope switching, and input bar.
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
  useDeleteConversationMutation,
} from '../api/chatAssistantApi';
import type {
  ConversationThread,
  ChatMessage,
  ChatContextScope,
  ChatActionChip,
} from '../types';
import { ChatSidebar } from '../components/ChatSidebar';
import { ChatWindow } from '../components/ChatWindow';
import { ChatInputBar } from '../components/ChatInputBar';

export const ChatAssistantPage: React.FC = () => {
  const toast = useToast();
  const navigate = useNavigate();

  // Selected thread & scope states
  const [activeId, setActiveId] = useState<string | undefined>(undefined);
  const [activeScope, setActiveScope] = useState<ChatContextScope>('GENERAL');

  // Optimistic in-flight message state for instant UI responsiveness
  const [optimisticMessages, setOptimisticMessages] = useState<ChatMessage[]>([]);

  // RTK Query: Thread history
  const {
    data: conversations = [],
    isLoading: isConversationsLoading,
  } = useGetConversationsQuery();

  // Auto-select first conversation if none selected
  useEffect(() => {
    if (!activeId && conversations.length > 0) {
      setActiveId(conversations[0].id);
      if (conversations[0].contextScope) {
        setActiveScope(conversations[0].contextScope);
      }
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
  const [deleteConversation] = useDeleteConversationMutation();

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

  // Handle Delete Conversation
  const handleDeleteConversation = useCallback(
    async (id: string) => {
      try {
        await deleteConversation(id).unwrap();
        toast.info('Conversation removed from history.', 'Thread Deleted');
        if (activeId === id) {
          const remaining = conversations.filter((c) => c.id !== id);
          setActiveId(remaining[0]?.id);
          setOptimisticMessages([]);
        }
      } catch (err: any) {
        toast.error(
          err?.data?.message || 'Failed to delete conversation.',
          'Error'
        );
      }
    },
    [deleteConversation, activeId, conversations, toast]
  );

  // Handle Clear Message History
  const handleClearHistory = useCallback(async () => {
    if (!activeId) return;
    try {
      await clearHistory(activeId).unwrap();
      setOptimisticMessages([]);
      toast.info('Conversation history cleared.', 'Chat Cleared');
    } catch (err: any) {
      toast.error(
        err?.data?.message || 'Failed to clear conversation history.',
        'Error'
      );
    }
  }, [activeId, clearHistory, toast]);

  // Handle Send Message
  const handleSendMessage = useCallback(
    async (prompt: string, scope: ChatContextScope) => {
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
      {/* Thread Navigation Sidebar */}
      <ChatSidebar
        conversations={conversations}
        activeId={activeId}
        onSelectConversation={(id) => {
          setActiveId(id);
          setOptimisticMessages([]);
        }}
        onNewChat={handleNewChat}
        onDeleteConversation={handleDeleteConversation}
        isLoading={isConversationsLoading}
      />

      {/* Main Conversation Area */}
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
          onRetryMessage={(msg) => handleSendMessage(msg.content, msg.contextScope || activeScope)}
        />

        <ChatInputBar
          onSendMessage={handleSendMessage}
          isSending={isSending}
          activeScope={activeScope}
          onScopeChange={setActiveScope}
        />
      </div>
    </div>
  );
};

export default ChatAssistantPage;
