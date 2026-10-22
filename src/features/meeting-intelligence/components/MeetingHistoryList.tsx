/**
 * @file MeetingHistoryList.tsx
 * @description List view of processed meeting intelligence records with duration pills,
 * participant avatars, date formatting, and active meeting selection.
 */

import React from 'react';
import {
  Video,
  Clock,
  Calendar,
  Users,
  CheckCircle2,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import type { MeetingIntelligenceRecord } from '../types';

interface MeetingHistoryListProps {
  meetings: MeetingIntelligenceRecord[];
  activeMeetingId?: string;
  onSelectMeeting: (meeting: MeetingIntelligenceRecord) => void;
  isLoading?: boolean;
}

export const MeetingHistoryList: React.FC<MeetingHistoryListProps> = ({
  meetings,
  activeMeetingId,
  onSelectMeeting,
  isLoading = false,
}) => {
  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="p-4 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 shadow-sm animate-pulse space-y-2.5"
          >
            <div className="flex justify-between">
              <div className="h-4 w-44 bg-gray-200 dark:bg-zinc-800 rounded" />
              <div className="h-4 w-16 bg-gray-200 dark:bg-zinc-800 rounded" />
            </div>
            <div className="h-3 w-64 bg-gray-200 dark:bg-zinc-800 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (!meetings || meetings.length === 0) {
    return (
      <div className="p-8 text-center rounded-2xl border border-dashed border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#171717]">
        <Video className="w-8 h-8 text-gray-400 mx-auto mb-2 opacity-50" />
        <p className="text-xs font-semibold text-gray-700 dark:text-zinc-300">
          No Meeting Records Found
        </p>
        <p className="text-[11px] text-gray-400 dark:text-zinc-500 mt-0.5">
          Processed meetings will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {meetings.map((meeting) => {
        const isActive = meeting.id === activeMeetingId;
        const pendingActions = meeting.actionItems?.filter((a) => a.status === 'PENDING').length || 0;

        return (
          <div
            key={meeting.id}
            onClick={() => onSelectMeeting(meeting)}
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
              isActive
                ? 'bg-brand-50/70 dark:bg-brand-950/30 border-brand-300 dark:border-brand-800/80 shadow-sm ring-1 ring-brand-500/20'
                : 'bg-white dark:bg-[#171717] border-gray-200 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700 shadow-2xs'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-gray-900 dark:text-[#ececec] truncate">
                    {meeting.meetingTitle}
                  </span>
                  {meeting.tags?.[0] && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 shrink-0">
                      #{meeting.tags[0]}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-zinc-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatDate(meeting.meetingDate)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {meeting.durationMinutes}m
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    {meeting.participants.length}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {pendingActions > 0 ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                    {pendingActions} Tasks
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    Done
                  </span>
                )}
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-brand-500 transition-colors" />
              </div>
            </div>

            {/* Quick summary line preview */}
            {meeting.aiExecutiveSummary && (
              <p className="mt-2 text-xs text-gray-500 dark:text-zinc-400 line-clamp-2">
                {meeting.aiExecutiveSummary}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default MeetingHistoryList;
