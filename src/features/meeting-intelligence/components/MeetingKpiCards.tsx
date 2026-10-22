/**
 * @file MeetingKpiCards.tsx
 * @description High-level KPI cards for Meeting Intelligence: Total Meetings Analyzed,
 * Pending Action Items, Average Meeting Duration, and Collaboration Score.
 */

import React from 'react';
import {
  Video,
  CheckSquare,
  Clock,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';
import type { MeetingKpiSummary } from '../types';

interface MeetingKpiCardsProps {
  kpis?: MeetingKpiSummary;
  isLoading?: boolean;
}

export const MeetingKpiCards: React.FC<MeetingKpiCardsProps> = ({ kpis, isLoading }) => {
  const cards = [
    {
      title: 'Meetings Analyzed',
      value: kpis?.totalMeetings !== undefined ? kpis.totalMeetings.toLocaleString() : '0',
      icon: Video,
      color: 'text-indigo-600 dark:text-indigo-400',
      bg: 'bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200/60 dark:border-indigo-900/30',
      badge: 'All Cycles',
      description: 'Audio & video transcripts processed',
    },
    {
      title: 'Pending Action Items',
      value: kpis?.pendingActionItems !== undefined ? kpis.pendingActionItems.toLocaleString() : '0',
      icon: CheckSquare,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200/60 dark:border-amber-900/30',
      badge: kpis?.pendingActionItems ? `${kpis.pendingActionItems} Active` : 'Clear',
      description: 'Extracted deliverables requiring completion',
    },
    {
      title: 'Avg Duration',
      value: kpis?.avgDurationMinutes !== undefined ? `${kpis.avgDurationMinutes}m` : '0m',
      icon: Clock,
      color: 'text-cyan-600 dark:text-cyan-400',
      bg: 'bg-cyan-50 dark:bg-cyan-950/30 border-cyan-200/60 dark:border-cyan-900/30',
      badge: 'Standard',
      description: 'Average discussion session length',
    },
    {
      title: 'Participation Score',
      value: kpis?.participationScore !== undefined ? `${kpis.participationScore}%` : '0%',
      icon: Sparkles,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200/60 dark:border-emerald-900/30',
      badge: 'High Engagement',
      description: 'Speaker turn balance and engagement index',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 shadow-sm transition-all hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-semibold text-gray-500 dark:text-zinc-400 tracking-wider">
                {card.title}
              </span>
              <div className={`p-2.5 rounded-xl border ${card.bg} ${card.color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-3 flex items-baseline justify-between">
              {isLoading ? (
                <div className="h-8 w-16 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse" />
              ) : (
                <div className="text-2xl font-bold tracking-tight text-gray-900 dark:text-[#ececec]">
                  {card.value}
                </div>
              )}

              <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold px-2 py-0.5 rounded-full border text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-950/40 border-brand-200 dark:border-brand-800">
                <ArrowUpRight className="w-3 h-3" />
                {card.badge}
              </span>
            </div>

            <p className="mt-1.5 text-xs text-gray-500 dark:text-zinc-400">
              {card.description}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default MeetingKpiCards;
