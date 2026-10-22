/**
 * @file ChatInputBar.tsx
 * @description Auto-resizing input textarea with Enter-to-send, Shift+Enter for new line,
 * context scope selector, attachment trigger, and prompt submission handling.
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Paperclip,
  Sparkles,
  Layers,
  Calendar,
  DollarSign,
  FileText,
  HelpCircle,
} from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import type { ChatContextScope } from '../types';

interface ChatInputBarProps {
  onSendMessage: (prompt: string, scope: ChatContextScope) => void;
  isSending: boolean;
  activeScope: ChatContextScope;
  onScopeChange: (scope: ChatContextScope) => void;
  placeholder?: string;
}

const SCOPES: Array<{
  label: string;
  value: ChatContextScope;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { label: 'General', value: 'GENERAL', icon: Layers },
  { label: 'Leave', value: 'LEAVE', icon: Calendar },
  { label: 'Payroll', value: 'PAYROLL', icon: DollarSign },
  { label: 'Policies', value: 'POLICY', icon: FileText },
];

export const ChatInputBar: React.FC<ChatInputBarProps> = ({
  onSendMessage,
  isSending,
  activeScope,
  onScopeChange,
  placeholder = 'Ask a question about HR policies, leave balances, or payroll...',
}) => {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Auto-resize textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        180
      )}px`;
    }
  }, [text]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    const trimmed = text.trim();
    if (!trimmed || isSending) return;
    onSendMessage(trimmed, activeScope);
    setText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  return (
    <div className="p-3 sm:p-4 bg-white dark:bg-[#171717] border-t border-gray-200 dark:border-zinc-800/80">
      <div className="max-w-4xl mx-auto space-y-2.5">
        {/* Scope Selector Badges */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 scrollbar-none">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[11px] font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-brand-500" />
              Focus:
            </span>
            {SCOPES.map((scope) => {
              const Icon = scope.icon;
              const isActive = activeScope === scope.value;
              return (
                <button
                  key={scope.value}
                  type="button"
                  onClick={() => onScopeChange(scope.value)}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-brand-50 dark:bg-brand-950/50 text-brand-700 dark:text-brand-300 border border-brand-300 dark:border-brand-800 shadow-2xs font-semibold'
                      : 'bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 hover:bg-gray-200 dark:hover:bg-zinc-700/60 border border-transparent'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  <span>{scope.label}</span>
                </button>
              );
            })}
          </div>

          <span className="hidden sm:inline-block text-[11px] text-gray-400 dark:text-zinc-500">
            Press <kbd className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-zinc-800 border font-mono text-[10px]">Enter ↵</kbd> to send
          </span>
        </div>

        {/* Input Textarea Container */}
        <div className="relative rounded-2xl border border-gray-200 dark:border-zinc-800 bg-gray-50/60 dark:bg-zinc-900/60 focus-within:bg-white dark:focus-within:bg-[#1a1a1a] focus-within:border-brand-500 dark:focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20 transition-all p-2 shadow-2xs">
          <textarea
            ref={textareaRef}
            rows={1}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isSending}
            placeholder={placeholder}
            className="w-full bg-transparent px-2 pt-1 pb-1 text-sm text-gray-900 dark:text-[#ececec] placeholder-gray-400 dark:placeholder-zinc-500 resize-none focus:outline-none max-h-44 disabled:opacity-50"
          />

          <div className="flex items-center justify-between pt-1 px-1">
            {/* Attachment Button */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                title="Attach Document or Policy Context (PDF, DOCX, TXT)"
                className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-zinc-200 hover:bg-gray-200/60 dark:hover:bg-zinc-800 transition-colors"
              >
                <Paperclip className="w-4 h-4" />
              </button>
            </div>

            {/* Send Button */}
            <Button
              type="button"
              variant="primary"
              size="sm"
              disabled={!text.trim() || isSending}
              onClick={handleSubmit}
              className="rounded-xl px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 shadow-sm shadow-brand-500/25"
            >
              <span>Send</span>
              <Send className={`w-3.5 h-3.5 ${isSending ? 'animate-pulse' : ''}`} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInputBar;
