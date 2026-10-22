/**
 * @file ChatEmptyState.tsx
 * @description Clean introductory screen displayed when starting a new session or viewing an empty conversation thread.
 * Features capability badges and interactive starter prompts without fake hardcoded messages.
 */

import React from 'react';
import {
  Sparkles,
  Calendar,
  DollarSign,
  FileText,
  ShieldCheck,
  Bot,
  ArrowRight,
  Zap,
} from 'lucide-react';
import type { ChatContextScope } from '../types';

interface ChatEmptyStateProps {
  onSelectPrompt?: (prompt: string, scope?: ChatContextScope) => void;
  activeScope?: ChatContextScope;
}

interface PromptStarter {
  title: string;
  prompt: string;
  scope: ChatContextScope;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
}

const STARTER_PROMPTS: PromptStarter[] = [
  {
    title: 'Check Leave Balances',
    prompt: 'How many casual and sick leave days do I have left for this calendar year?',
    scope: 'LEAVE',
    icon: Calendar,
    accentColor: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800',
  },
  {
    title: 'Payroll & Reimbursements',
    prompt: 'What are the current tax deduction components on my recent salary statement?',
    scope: 'PAYROLL',
    icon: DollarSign,
    accentColor: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800',
  },
  {
    title: 'Travel Policy Guidelines',
    prompt: 'What is the daily per-diem allowance and approval workflow for domestic travel?',
    scope: 'POLICY',
    icon: FileText,
    accentColor: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800',
  },
  {
    title: 'Employee Onboarding & Benefits',
    prompt: 'How do I enroll my dependents into the company comprehensive health insurance plan?',
    scope: 'GENERAL',
    icon: ShieldCheck,
    accentColor: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800',
  },
];

export const ChatEmptyState: React.FC<ChatEmptyStateProps> = ({
  onSelectPrompt,
  activeScope = 'GENERAL',
}) => {
  const filteredPrompts =
    activeScope === 'GENERAL'
      ? STARTER_PROMPTS
      : STARTER_PROMPTS.filter((p) => p.scope === activeScope);

  const displayPrompts = filteredPrompts.length > 0 ? filteredPrompts : STARTER_PROMPTS;

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-2xl mx-auto my-auto animate-in fade-in duration-300">
      {/* Brand Icon Badge */}
      <div className="relative mb-5">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-purple-600 p-0.5 shadow-xl shadow-brand-500/20">
          <div className="w-full h-full bg-white dark:bg-[#171717] rounded-[22px] flex items-center justify-center text-brand-600 dark:text-brand-400">
            <Bot className="w-8 h-8" />
          </div>
        </div>
        <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-white dark:bg-zinc-900 border border-brand-200 dark:border-brand-800 text-brand-500 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 fill-brand-500/20" />
        </div>
      </div>

      {/* Title & Introduction */}
      <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-[#ececec]">
        OFC360 AI Virtual Assistant
      </h2>
      <p className="mt-2 text-sm text-gray-500 dark:text-zinc-400 max-w-md">
        Your intelligent workforce co-pilot. Inquire about company policies, leave entitlements,
        tax withholdings, or trigger self-service workflows directly.
      </p>

      {/* Capability Badges */}
      <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-zinc-800/80 text-gray-700 dark:text-zinc-300 border border-gray-200 dark:border-zinc-700/60">
          <Zap className="w-3.5 h-3.5 text-brand-500" />
          Real-time Policy Search
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-zinc-800/80 text-gray-700 dark:text-zinc-300 border border-gray-200 dark:border-zinc-700/60">
          <Calendar className="w-3.5 h-3.5 text-indigo-500" />
          Leave Automation
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-zinc-800/80 text-gray-700 dark:text-zinc-300 border border-gray-200 dark:border-zinc-700/60">
          <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
          Payroll Guidance
        </span>
      </div>

      {/* Suggested Prompt Cards */}
      <div className="mt-8 w-full">
        <div className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-zinc-500 mb-3 text-left px-1">
          Suggested Conversation Starters
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
          {displayPrompts.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => onSelectPrompt?.(item.prompt, item.scope)}
                className="group p-3.5 rounded-2xl bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-zinc-800/90 shadow-2xs hover:shadow-md hover:border-brand-300 dark:hover:border-brand-700/50 transition-all text-left flex items-start justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg border text-xs ${item.accentColor}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold text-gray-900 dark:text-[#ececec] group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                      {item.title}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-zinc-400 line-clamp-2 pl-0.5">
                    "{item.prompt}"
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-brand-500 group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ChatEmptyState;
