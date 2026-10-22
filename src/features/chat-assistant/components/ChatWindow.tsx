/**
 * @file ChatWindow.tsx
 * @description Message stream view container with auto-scroll, typing indicator,
 * clean empty state handling, and conversation header controls.
 */

import React, { useRef, useEffect } from 'react';
import {
  Bot,
  Layers,
  Calendar,
  DollarSign,
  FileText,
  RotateCcw,
} from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import type {
  ConversationThread,
  ChatMessage,
  ChatContextScope,
  ChatActionChip,
} from '../types';
import { MessageBubble } from './MessageBubble';
import { ChatEmptyState } from './ChatEmptyState';

interface ChatWindowProps {
  conversation?: ConversationThread;
  messages: ChatMessage[];
  isLoadingMessages?: boolean;
  isSending?: boolean;
  activeScope: ChatContextScope;
  onSelectPrompt?: (prompt: string, scope?: ChatContextScope) => void;
  onActionClick?: (action: ChatActionChip) => void;
  onClearHistory?: () => void;
  onRetryMessage?: (message: ChatMessage) => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  conversation,
  messages,
  isLoadingMessages = false,
  isSending = false,
  activeScope,
  onSelectPrompt,
  onActionClick,
  onClearHistory,
  onRetryMessage,
}) => {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom when messages change or typing state changes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  const getScopeBadge = (scope?: ChatContextScope) => {
    const s = scope || activeScope;
    switch (s) {
      case 'LEAVE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
            <Calendar className="w-3 h-3" />
            Leave Scope
          </span>
        );
      case 'PAYROLL':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <DollarSign className="w-3 h-3" />
            Payroll Scope
          </span>
        );
      case 'POLICY':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            <FileText className="w-3 h-3" />
            Policy Scope
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 border border-gray-200 dark:border-zinc-700">
            <Layers className="w-3 h-3 text-brand-500" />
            General HR Scope
          </span>
        );
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#fcfcfd] dark:bg-[#121212] overflow-hidden">
      {/* Header Bar */}
      <div className="h-14 px-4 sm:px-6 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between bg-white dark:bg-[#171717] shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 flex items-center justify-center border border-brand-200/60 dark:border-brand-900/40 shadow-2xs">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-[#ececec] truncate max-w-xs sm:max-w-md">
              {conversation?.title || 'New Conversation'}
            </h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] text-gray-400 dark:text-zinc-500 font-medium">
                AI Ready
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {getScopeBadge(conversation?.contextScope)}

          {messages.length > 0 && onClearHistory && (
            <Button
              variant="secondary"
              size="sm"
              onClick={onClearHistory}
              title="Clear message history in this thread"
              className="rounded-xl text-xs flex items-center gap-1 px-2.5 py-1 text-gray-500 hover:text-rose-600 dark:text-zinc-400 dark:hover:text-rose-400"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clear Chat</span>
            </Button>
          )}
        </div>
      </div>

      {/* Message Feed Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 scrollbar-thin flex flex-col">
        {isLoadingMessages ? (
          <div className="space-y-4 max-w-3xl mx-auto w-full my-auto p-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={`flex gap-3 animate-pulse ${
                  i % 2 === 1 ? 'flex-row-reverse' : ''
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-gray-200 dark:bg-zinc-800 shrink-0" />
                <div
                  className={`h-16 rounded-2xl bg-gray-200 dark:bg-zinc-800 ${
                    i % 2 === 1 ? 'w-1/2' : 'w-2/3'
                  }`}
                />
              </div>
            ))}
          </div>
        ) : messages.length === 0 ? (
          <ChatEmptyState
            onSelectPrompt={onSelectPrompt}
            activeScope={conversation?.contextScope || activeScope}
          />
        ) : (
          <div className="max-w-3xl mx-auto w-full space-y-2 flex-1">
            {messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                message={msg}
                onActionClick={onActionClick}
                onRetry={onRetryMessage}
              />
            ))}

            {/* Typing Indicator */}
            {isSending && (
              <div className="flex items-start gap-3 my-4 animate-in fade-in duration-200">
                <div className="w-8 h-8 rounded-xl bg-white dark:bg-zinc-900 text-brand-600 dark:text-brand-400 flex items-center justify-center border border-gray-200 dark:border-zinc-800 shadow-2xs">
                  <Bot className="w-4 h-4 animate-pulse" />
                </div>
                <div className="p-3.5 rounded-2xl rounded-tl-none bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-zinc-800/80 shadow-2xs flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-brand-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-brand-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-brand-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                  <span className="text-xs text-gray-400 dark:text-zinc-500 ml-2 font-medium">
                    Assistant thinking...
                  </span>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatWindow;
