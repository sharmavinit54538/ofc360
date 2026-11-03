/**
 * @file InterviewProgressStepper.tsx
 * @description Visual multi-step progress stepper and scorecard tracker for interview rounds.
 * Displays completed/passed rounds, current active round, upcoming stages,
 * scheduled time countdown, meeting links with Copy/Join actions, and offline venue info.
 */

import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  XCircle,
  Video,
  MapPin,
  Calendar,
  Copy,
  ExternalLink,
  ChevronRight,
  Award,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { useToast } from '@/shared/ui/Toast';
import type {
  InterviewDetail,
  InterviewRoundItem,
} from '../types/interviewScheduler.types';

interface InterviewProgressStepperProps {
  interview: InterviewDetail;
  onScheduleSlot?: (round: InterviewRoundItem) => void;
  onEvaluateRound?: (round: InterviewRoundItem) => void;
  className?: string;
}

export const InterviewProgressStepper: React.FC<InterviewProgressStepperProps> = ({
  interview,
  onScheduleSlot,
  onEvaluateRound,
  className = '',
}) => {
  const toast = useToast();
  const [copiedLink, setCopiedLink] = useState(false);

  const rounds = interview.rounds || [];
  const currentRoundIndex = interview.current_round_index ?? 0;
  const currentRound = rounds[currentRoundIndex] || rounds[0];

  const handleCopyMeetingLink = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    toast.success('Meeting link copied to clipboard.', 'Link Copied');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div
      className={`rounded-3xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 p-5 shadow-sm space-y-5 ${className}`}
    >
      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-100 dark:border-zinc-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse" />
            <h3 className="text-sm font-bold text-gray-900 dark:text-zinc-100">
              Interview Evaluation Pipeline
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
              Round {Math.min(currentRoundIndex + 1, rounds.length)} of {rounds.length}
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
            {interview.candidate_name ? `${interview.candidate_name} • ` : ''}
            {interview.job_title || 'Software Engineering'}
          </p>
        </div>

        {/* Global Schedule badge if booked */}
        {interview.interview_date && interview.interview_time && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800 text-sky-800 dark:text-sky-300 text-xs font-semibold">
            <Calendar className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            <span>
              {interview.interview_date} at {interview.interview_time.slice(0, 5)}
            </span>
            <span className="px-1.5 py-0.2 rounded text-[10px] bg-sky-200 dark:bg-sky-800 font-bold uppercase">
              {interview.mode || 'ONLINE'}
            </span>
          </div>
        )}
      </div>

      {/* Visual Multi-step Horizontal Rounds Stepper */}
      <div className="relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {rounds.map((round, idx) => {
            const isCompleted = round.status === 'PASSED' || round.status === 'COMPLETED';
            const isRejected = round.status === 'REJECTED';
            const isHold = round.status === 'HOLD';
            const isActive = idx === currentRoundIndex && !isCompleted && !isRejected;
            const isUpcoming = idx > currentRoundIndex && !isCompleted;

            return (
              <div
                key={round.id || `${round.round_name}-${idx}`}
                className={`relative rounded-2xl border p-4 transition-all ${
                  isActive
                    ? 'border-teal-500 bg-teal-50/30 dark:bg-teal-950/20 shadow-md ring-1 ring-teal-500/20'
                    : isCompleted
                    ? 'border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/20 dark:bg-emerald-950/10'
                    : isRejected
                    ? 'border-rose-200 dark:border-rose-900/40 bg-rose-50/20 dark:bg-rose-950/10'
                    : isHold
                    ? 'border-amber-200 dark:border-amber-900/40 bg-amber-50/20 dark:bg-amber-950/10'
                    : 'border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/30 opacity-75'
                }`}
              >
                {/* Round Badge Header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center ${
                        isCompleted
                          ? 'bg-emerald-500 text-white'
                          : isRejected
                          ? 'bg-rose-500 text-white'
                          : isHold
                          ? 'bg-amber-500 text-white'
                          : isActive
                          ? 'bg-teal-600 text-white animate-pulse'
                          : 'bg-gray-200 dark:bg-zinc-700 text-gray-700 dark:text-zinc-300'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <span className="text-xs font-bold text-gray-900 dark:text-zinc-100">
                      {round.round_name}
                    </span>
                  </div>

                  {/* Status Indicator Chip */}
                  {isCompleted && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                      <CheckCircle2 className="w-3 h-3" />
                      Passed
                    </span>
                  )}
                  {isRejected && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300">
                      <XCircle className="w-3 h-3" />
                      Rejected
                    </span>
                  )}
                  {isHold && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                      <Clock className="w-3 h-3" />
                      Hold
                    </span>
                  )}
                  {isActive && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300">
                      <Sparkles className="w-3 h-3" />
                      Active
                    </span>
                  )}
                  {isUpcoming && (
                    <span className="text-[10px] font-semibold text-gray-400 dark:text-zinc-500">
                      Pending
                    </span>
                  )}
                </div>

                {/* Score & Feedback if evaluated */}
                {round.score && (
                  <div className="mt-2 text-xs flex items-center gap-2">
                    <span className="text-gray-500 dark:text-zinc-400">Score:</span>
                    <span className="font-bold text-amber-600 dark:text-amber-400">
                      {round.score}
                    </span>
                    {round.interviewer_name && (
                      <span className="text-[11px] text-gray-400 truncate">
                        by {round.interviewer_name}
                      </span>
                    )}
                  </div>
                )}

                {round.feedback && (
                  <p className="mt-1 text-[11px] text-gray-600 dark:text-zinc-300 italic line-clamp-2 bg-white/60 dark:bg-zinc-900/60 p-2 rounded-lg border border-gray-100 dark:border-zinc-800">
                    &ldquo;{round.feedback}&rdquo;
                  </p>
                )}

                {/* Active Round Interactive Actions */}
                {isActive && (
                  <div className="mt-3 pt-2.5 border-t border-teal-100 dark:border-teal-900/40 flex items-center gap-2">
                    {onScheduleSlot && (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => onScheduleSlot(round)}
                        className="flex-1 text-xs py-1.5 h-auto text-teal-700 dark:text-teal-300 border-teal-300 dark:border-teal-700 hover:bg-teal-50 dark:hover:bg-teal-950/40"
                      >
                        <Calendar className="w-3 h-3 mr-1" />
                        Schedule Slot
                      </Button>
                    )}
                    {onEvaluateRound && (
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => onEvaluateRound(round)}
                        className="flex-1 text-xs py-1.5 h-auto bg-teal-600 hover:bg-teal-700 text-white"
                      >
                        <Award className="w-3 h-3 mr-1" />
                        Evaluate
                      </Button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Meeting / Office Address Callout Box */}
      {interview.mode === 'ONLINE' && interview.meeting_url && (
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 flex items-center justify-center">
              <Video className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900 dark:text-zinc-100">
                Online Interview Room Link
              </p>
              <p className="text-xs text-teal-700 dark:text-teal-400 font-mono underline truncate max-w-xs sm:max-w-md">
                {interview.meeting_url}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleCopyMeetingLink(interview.meeting_url!)}
              className="text-xs h-8 px-3 text-gray-700 dark:text-zinc-200"
            >
              <Copy className="w-3 h-3 mr-1.5" />
              {copiedLink ? 'Copied!' : 'Copy Link'}
            </Button>
            <a
              href={interview.meeting_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white transition-all shadow-sm"
            >
              <ExternalLink className="w-3 h-3" />
              Join Call
            </a>
          </div>
        </div>
      )}

      {interview.mode === 'OFFLINE' && interview.office_address && (
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700/80 flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0 mt-0.5">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-900 dark:text-zinc-100">
              In-person Interview Location
            </p>
            <p className="text-xs text-gray-600 dark:text-zinc-300 mt-0.5">
              {interview.office_address}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

