/**
 * @file ChatInputBar.tsx
 * @description ChatGPT-style clean rounded input bar with auto-resizing textarea
 * and circular ArrowUp send button on bottom-right.
 */

import React, { useState, useRef, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
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
  placeholder = 'Message OFC360 Copilot...',
}) => {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Auto-resize textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        200
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

  const canSubmit = Boolean(text.trim()) && !isSending;

  return (
    <div className="p-3 sm:p-4 bg-transparent">
      <div className="max-w-3xl mx-auto">
        {/* ChatGPT Style Input Container */}
        <div
          className={cn(
            'relative rounded-[28px] border transition-all duration-200',
            'bg-[#f4f4f4] dark:bg-[#212121] border-gray-200/80 dark:border-zinc-800',
            'focus-within:border-gray-300 dark:focus-within:border-zinc-700 focus-within:shadow-md shadow-sm',
            'px-4 pt-3 pb-2.5'
          )}
        >
          {/* Textarea */}
          <textarea
            ref={textareaRef}
            rows={1}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isSending}
            placeholder={placeholder}
            className="w-full bg-transparent text-sm sm:text-base text-gray-900 dark:text-[#ececec] placeholder-gray-500 dark:placeholder-zinc-400 resize-none focus:outline-none max-h-48 leading-relaxed disabled:opacity-50"
          />

          {/* Bottom Action Bar */}
          <div className="flex items-center justify-end mt-1 pt-0.5">
            {/* ChatGPT Circular Send Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canSubmit}
              title={canSubmit ? 'Send message' : 'Type a message to send'}
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center transition-all duration-150 shrink-0',
                canSubmit
                  ? 'bg-black text-white dark:bg-white dark:text-black hover:opacity-90 shadow-xs'
                  : 'bg-gray-200 dark:bg-zinc-700/60 text-gray-400 dark:text-zinc-500 cursor-not-allowed'
              )}
            >
              <ArrowUp className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* ChatGPT Style Disclaimer */}
        <p className="mt-2 text-center text-[11px] text-gray-400 dark:text-zinc-500">
          OFC360 Copilot can make mistakes. Verify important policy and payroll info.
        </p>
      </div>
    </div>
  );
};

export default ChatInputBar;
