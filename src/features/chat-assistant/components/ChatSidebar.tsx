/**
 * @file ChatSidebar.tsx
 * @description Thread history navigation, search filter, new chat trigger,
 * and conversation lifecycle controls with responsive empty states.
 */

import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  MessageSquare,
  Trash2,
  Pin,
  Bot,
  Calendar,
  DollarSign,
  FileText,
} from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import type { ConversationThread, ChatContextScope } from '../types';

interface ChatSidebarProps {
  conversations: ConversationThread[];
  activeId?: string;
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
  onDeleteConversation: (id: string) => void;
  isLoading?: boolean;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  conversations,
  activeId,
  onSelectConversation,
  onNewChat,
  onDeleteConversation,
  isLoading = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations;
    const q = searchQuery.toLowerCase();
    return conversations.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        (c.lastMessage && c.lastMessage.toLowerCase().includes(q))
    );
  }, [conversations, searchQuery]);

  const getScopeIcon = (scope?: ChatContextScope) => {
    switch (scope) {
      case 'LEAVE':
        return <Calendar className="w-3 h-3 text-indigo-500" />;
      case 'PAYROLL':
        return <DollarSign className="w-3 h-3 text-emerald-500" />;
      case 'POLICY':
        return <FileText className="w-3 h-3 text-amber-500" />;
      default:
        return <MessageSquare className="w-3 h-3 text-brand-500" />;
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } catch {
      return '';
    }
  };

  return (
    <aside className="w-72 sm:w-80 border-r border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#171717] flex flex-col h-full shrink-0">
      {/* Top Header: New Chat Action */}
      <div className="p-3.5 border-b border-gray-200 dark:border-zinc-800/80 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 flex items-center justify-center border border-brand-200/50 dark:border-brand-900/30">
              <Bot className="w-4 h-4" />
            </div>
            <span className="text-sm font-bold text-gray-900 dark:text-[#ececec]">
              Chat Assistant
            </span>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={onNewChat}
            className="rounded-xl text-xs flex items-center gap-1.5 px-3 py-1.5 shadow-2xs shadow-brand-500/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Chat</span>
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-xl text-xs bg-gray-50 dark:bg-zinc-900/70 border border-gray-200 dark:border-zinc-800 text-gray-900 dark:text-[#ececec] placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>
      </div>

      {/* Conversation Thread List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin">
        {isLoading ? (
          <div className="space-y-2 p-2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-gray-100 dark:bg-zinc-800/60 animate-pulse space-y-2"
              >
                <div className="h-3.5 w-3/4 bg-gray-200 dark:bg-zinc-700 rounded" />
                <div className="h-2.5 w-1/2 bg-gray-200 dark:bg-zinc-700 rounded" />
              </div>
            ))}
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="p-6 text-center text-xs text-gray-400 dark:text-zinc-500 my-auto">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p className="font-semibold text-gray-600 dark:text-zinc-400">No conversations</p>
            <p className="mt-1 text-[11px]">
              {searchQuery
                ? 'No threads matched your search query.'
                : 'Click "New Chat" to begin a session.'}
            </p>
          </div>
        ) : (
          filteredConversations.map((conv) => {
            const isActive = conv.id === activeId;
            return (
              <div
                key={conv.id}
                onClick={() => onSelectConversation(conv.id)}
                className={`group relative p-2.5 rounded-xl text-left cursor-pointer transition-all border ${
                  isActive
                    ? 'bg-brand-50 dark:bg-brand-950/30 border-brand-200 dark:border-brand-900/40 text-brand-950 dark:text-brand-100 shadow-2xs'
                    : 'bg-transparent hover:bg-gray-50 dark:hover:bg-zinc-800/50 border-transparent text-gray-700 dark:text-zinc-300'
                }`}
              >
                <div className="flex items-center justify-between gap-1.5">
                  <div className="flex items-center gap-2 overflow-hidden flex-1">
                    {getScopeIcon(conv.contextScope)}
                    <span className="text-xs font-semibold truncate">
                      {conv.title || 'Untitled Conversation'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {conv.pinned && <Pin className="w-3 h-3 text-amber-500" />}
                    <span className="text-[10px] text-gray-400 dark:text-zinc-500">
                      {formatDate(conv.updatedAt || conv.createdAt)}
                    </span>

                    {/* Delete Trigger */}
                    <button
                      type="button"
                      title="Delete thread"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteConversation(conv.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-rose-500 transition-opacity"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {conv.lastMessage && (
                  <p className="mt-1 text-[11px] text-gray-400 dark:text-zinc-500 line-clamp-1 pl-5">
                    {conv.lastMessage}
                  </p>
                )}
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
};

export default ChatSidebar;
