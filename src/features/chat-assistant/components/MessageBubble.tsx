/**
 * @file MessageBubble.tsx
 * @description Distinct message bubbles for user and assistant with markdown formatting,
 * copy-to-clipboard, status indicators, and interactive action chips.
 */

import React, { useState } from 'react';
import {
  User,
  Bot,
  Copy,
  Check,
  Clock,
  AlertCircle,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import type { ChatMessage, ChatActionChip } from '../types';

interface MessageBubbleProps {
  message: ChatMessage;
  onActionClick?: (action: ChatActionChip) => void;
  onRetry?: (message: ChatMessage) => void;
}

/**
 * Lightweight, resilient markdown formatter that handles bold, code blocks,
 * inline code, bullet points, headers, and line breaks without external dependencies.
 */
const RenderMarkdown: React.FC<{ content: string }> = ({ content }) => {
  // Split content into code blocks vs regular paragraphs
  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-2 text-sm leading-relaxed">
      {parts.map((part, partIdx) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          // Code block
          const lines = part.slice(3, -3).trim().split('\n');
          const maybeLanguage = lines[0]?.trim();
          const hasLang = /^[a-zA-Z0-9_-]+$/.test(maybeLanguage);
          const codeBody = hasLang ? lines.slice(1).join('\n') : lines.join('\n');

          return (
            <div
              key={partIdx}
              className="my-2.5 rounded-xl bg-gray-900 text-gray-100 overflow-hidden text-xs font-mono border border-gray-800"
            >
              {hasLang && (
                <div className="bg-gray-800/80 px-3 py-1 text-[11px] text-gray-400 font-sans border-b border-gray-700/60 uppercase">
                  {maybeLanguage}
                </div>
              )}
              <pre className="p-3 overflow-x-auto">
                <code>{codeBody}</code>
              </pre>
            </div>
          );
        }

        // Regular text formatting
        const lines = part.split('\n');
        return (
          <div key={partIdx} className="space-y-1">
            {lines.map((line, lineIdx) => {
              const trimmed = line.trim();
              if (!trimmed) {
                return <div key={lineIdx} className="h-1.5" />;
              }

              // Heading: ### Header
              if (trimmed.startsWith('### ')) {
                return (
                  <h4 key={lineIdx} className="font-bold text-sm text-gray-900 dark:text-white mt-2">
                    {formatInline(trimmed.replace(/^###\s+/, ''))}
                  </h4>
                );
              }

              // Bullet points: - or *
              if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                return (
                  <div key={lineIdx} className="flex items-start gap-2 pl-2">
                    <span className="text-brand-500 font-bold mt-0.5">•</span>
                    <span className="flex-1">{formatInline(trimmed.replace(/^[-*]\s+/, ''))}</span>
                  </div>
                );
              }

              // Numbered list: 1. 2.
              const numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
              if (numMatch) {
                return (
                  <div key={lineIdx} className="flex items-start gap-2 pl-2">
                    <span className="font-semibold text-gray-500 dark:text-zinc-400 text-xs mt-0.5">
                      {numMatch[1]}.
                    </span>
                    <span className="flex-1">{formatInline(numMatch[2])}</span>
                  </div>
                );
              }

              return <p key={lineIdx}>{formatInline(line)}</p>;
            })}
          </div>
        );
      })}
    </div>
  );
};

// Formats inline markdown: **bold**, `code`, etc.
const formatInline = (text: string): React.ReactNode => {
  const tokens = text.split(/(\*\*.*?\*\*|`.*?`)/g);

  return tokens.map((token, i) => {
    if (token.startsWith('**') && token.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold text-gray-900 dark:text-white">
          {token.slice(2, -2)}
        </strong>
      );
    }
    if (token.startsWith('`') && token.endsWith('`')) {
      return (
        <code
          key={i}
          className="px-1.5 py-0.5 mx-0.5 rounded-md bg-gray-100 dark:bg-zinc-800 text-brand-600 dark:text-brand-400 font-mono text-xs border border-gray-200/60 dark:border-zinc-700/60"
        >
          {token.slice(1, -1)}
        </code>
      );
    }
    return token;
  });
};

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  onActionClick,
  onRetry,
}) => {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedTime = (() => {
    try {
      return new Date(message.timestamp).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '';
    }
  })();

  return (
    <div
      className={`flex items-start gap-3 w-full my-4 ${
        isUser ? 'flex-row-reverse' : 'flex-row'
      } group`}
    >
      {/* Avatar Icon */}
      <div
        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border shadow-2xs ${
          isUser
            ? 'bg-brand-600 text-white border-brand-700'
            : 'bg-white dark:bg-zinc-900 text-brand-600 dark:text-brand-400 border-gray-200 dark:border-zinc-800'
        }`}
      >
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>

      {/* Bubble Container */}
      <div
        className={`flex flex-col max-w-[85%] sm:max-w-[75%] ${
          isUser ? 'items-end' : 'items-start'
        }`}
      >
        {/* Header (Role & Time) */}
        <div className="flex items-center gap-2 mb-1 px-1">
          <span className="text-[11px] font-semibold text-gray-500 dark:text-zinc-400">
            {isUser ? 'You' : 'OFC360 Assistant'}
          </span>
          {formattedTime && (
            <span className="text-[10px] text-gray-400 dark:text-zinc-500">
              {formattedTime}
            </span>
          )}
          {message.status === 'sending' && (
            <Clock className="w-3 h-3 text-gray-400 animate-spin" />
          )}
          {message.status === 'error' && (
            <span className="flex items-center gap-1 text-[10px] text-rose-500 font-semibold">
              <AlertCircle className="w-3 h-3" />
              Failed
            </span>
          )}
        </div>

        {/* Content Bubble */}
        <div
          className={`relative p-4 rounded-2xl shadow-2xs transition-all ${
            isUser
              ? 'bg-brand-600 text-white rounded-tr-none'
              : 'bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-[#ececec] border border-gray-200 dark:border-zinc-800/80 rounded-tl-none'
          }`}
        >
          {isUser ? (
            <div className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</div>
          ) : (
            <RenderMarkdown content={message.content} />
          )}

          {/* Assistant Action Chips */}
          {isAssistant && message.actions && message.actions.length > 0 && (
            <div className="mt-3.5 pt-3 border-t border-gray-100 dark:border-zinc-800 flex flex-wrap gap-2">
              {message.actions.map((act, actIdx) => (
                <button
                  key={actIdx}
                  type="button"
                  onClick={() => onActionClick?.(act)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-brand-50 hover:bg-brand-100 dark:bg-brand-950/40 dark:hover:bg-brand-900/50 text-brand-700 dark:text-brand-300 border border-brand-200/80 dark:border-brand-800/60 shadow-2xs transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Sparkles className="w-3 h-3 text-brand-500" />
                  {act.label}
                  <ExternalLink className="w-2.5 h-2.5 opacity-60 ml-0.5" />
                </button>
              ))}
            </div>
          )}

          {/* Copy Button */}
          <div
            className={`absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity ${
              isUser ? 'hidden' : 'block'
            }`}
          >
            <button
              type="button"
              onClick={handleCopy}
              title="Copy message text"
              className="p-1 rounded-lg bg-gray-100 dark:bg-zinc-800 text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Retry Trigger on Error */}
        {message.status === 'error' && onRetry && (
          <button
            type="button"
            onClick={() => onRetry(message)}
            className="mt-1 text-xs text-rose-500 hover:text-rose-600 font-medium underline px-1"
          >
            Retry sending message
          </button>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
