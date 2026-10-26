/**
 * @file ChatInputBar.tsx
 * @description Auto-resizing input textarea with Enter-to-send, Shift+Enter for new line,
 * attachment trigger, and prompt submission handling.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import type { ChatContextScope } from '../types';

interface ChatInputBarProps {
  onSendMessage: (prompt: string, scope?: ChatContextScope) => void;
  isSending: boolean;
  activeScope?: ChatContextScope;
  onScopeChange?: (scope: ChatContextScope) => void;
  placeholder?: string;
}

export const ChatInputBar: React.FC<ChatInputBarProps> = ({
  onSendMessage,
  isSending,
  activeScope = 'GENERAL',
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
      <div className="max-w-4xl mx-auto">
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
                disabled={isSending}
                title="Attach file or screenshot"
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300 hover:bg-gray-200/60 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50"
              >
                <Paperclip className="w-4 h-4" />
              </button>
            </div>

            {/* Send Button */}
            <Button
              variant="primary"
              size="sm"
              onClick={handleSubmit}
              disabled={!text.trim() || isSending}
              className="rounded-xl px-3 py-1.5 text-xs flex items-center gap-1.5 shadow-2xs disabled:opacity-40"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        {/* Footer Hint */}
        <p className="mt-1.5 text-center text-[11px] text-gray-400 dark:text-zinc-500">
          Gemini HR AI can assist with company policies, leaves, and salary structures. Verify critical legal details.
        </p>
      </div>
    </div>
  );
};

export default ChatInputBar;
