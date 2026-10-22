/**
 * @file MeetingSummaryView.tsx
 * @description Segmented view for AI Executive Summary, Key Decisions,
 * sentiment tone distribution, and transcript preview.
 */

import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle,
  BarChart3,
  FileText,
  Download,
  Calendar,
  Clock,
  Users,
  Video,
  Smile,
  Meh,
  Frown,
} from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import type { MeetingIntelligenceRecord } from '../types';

interface MeetingSummaryViewProps {
  meeting?: MeetingIntelligenceRecord;
  isLoading?: boolean;
  onExport?: (meetingId: string, format: 'PDF' | 'MARKDOWN') => void;
  isExporting?: boolean;
}

export const MeetingSummaryView: React.FC<MeetingSummaryViewProps> = ({
  meeting,
  isLoading = false,
  onExport,
  isExporting = false,
}) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'decisions' | 'sentiment' | 'transcript'>(
    'summary'
  );

  if (isLoading) {
    return (
      <div className="p-6 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 shadow-sm space-y-4 animate-pulse">
        <div className="h-6 w-1/3 bg-gray-200 dark:bg-zinc-800 rounded" />
        <div className="h-4 w-1/2 bg-gray-200 dark:bg-zinc-800 rounded" />
        <div className="space-y-2 pt-4">
          <div className="h-4 w-full bg-gray-200 dark:bg-zinc-800 rounded" />
          <div className="h-4 w-5/6 bg-gray-200 dark:bg-zinc-800 rounded" />
          <div className="h-4 w-3/4 bg-gray-200 dark:bg-zinc-800 rounded" />
        </div>
      </div>
    );
  }

  if (!meeting) {
    return null;
  }

  const sentiment = meeting.sentimentAnalysis || {
    positiveScore: 65,
    neutralScore: 25,
    negativeScore: 10,
    overallTone: 'Constructive & Collaborative',
  };

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#171717] shadow-sm overflow-hidden">
      {/* Meeting Header */}
      <div className="p-5 sm:p-6 border-b border-gray-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gray-50/50 dark:bg-zinc-900/40">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
              <Sparkles className="w-3 h-3 text-brand-500" />
              AI Intelligence
            </span>
            {meeting.tags?.map((t, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded text-[11px] font-medium bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400"
              >
                #{t}
              </span>
            ))}
          </div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-[#ececec]">
            {meeting.meetingTitle}
          </h2>
          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-zinc-400 pt-0.5">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(meeting.meetingDate).toLocaleDateString([], {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {meeting.durationMinutes} mins
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              {meeting.participants.length} Participants
            </span>
          </div>
        </div>

        {/* Export Notes Actions */}
        {onExport && (
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="secondary"
              size="sm"
              disabled={isExporting}
              onClick={() => onExport(meeting.id, 'PDF')}
              className="rounded-xl text-xs flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Summary (PDF)</span>
            </Button>
          </div>
        )}
      </div>

      {/* Segmented Navigation Tabs */}
      <div className="px-5 border-b border-gray-200 dark:border-zinc-800 flex items-center gap-4 overflow-x-auto scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab('summary')}
          className={`py-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === 'summary'
              ? 'border-brand-600 text-brand-600 dark:text-brand-400'
              : 'border-transparent text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Executive Summary</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('decisions')}
          className={`py-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === 'decisions'
              ? 'border-brand-600 text-brand-600 dark:text-brand-400'
              : 'border-transparent text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-white'
          }`}
        >
          <CheckCircle className="w-3.5 h-3.5" />
          <span>Key Decisions ({meeting.keyDecisions?.length || 0})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('sentiment')}
          className={`py-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === 'sentiment'
              ? 'border-brand-600 text-brand-600 dark:text-brand-400'
              : 'border-transparent text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-white'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Sentiment & Dynamics</span>
        </button>

        {meeting.transcriptSnippet && (
          <button
            type="button"
            onClick={() => setActiveTab('transcript')}
            className={`py-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'transcript'
                ? 'border-brand-600 text-brand-600 dark:text-brand-400'
                : 'border-transparent text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Transcript Snippet</span>
          </button>
        )}
      </div>

      {/* Tab Panels */}
      <div className="p-5 sm:p-6">
        {/* Executive Summary */}
        {activeTab === 'summary' && (
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-500">
              AI Generated Synthesis
            </h4>
            <div className="prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-zinc-300 leading-relaxed whitespace-pre-line text-sm">
              {meeting.aiExecutiveSummary || 'No executive summary generated.'}
            </div>
          </div>
        )}

        {/* Key Decisions */}
        {activeTab === 'decisions' && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-500">
              Approved Strategic Consensus
            </h4>
            {meeting.keyDecisions && meeting.keyDecisions.length > 0 ? (
              <div className="space-y-2.5">
                {meeting.keyDecisions.map((dec, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-gray-50 dark:bg-zinc-900/60 border border-gray-200/80 dark:border-zinc-800 flex items-start gap-3"
                  >
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-sm font-medium text-gray-900 dark:text-[#ececec]">
                      {dec}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-500 dark:text-zinc-400">
                No formal decisions flagged during this meeting.
              </p>
            )}
          </div>
        )}

        {/* Sentiment Analysis */}
        {activeTab === 'sentiment' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-500">
                  Meeting Sentiment Analysis
                </h4>
                <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
                  Natural Language Processing (NLP) tonal distribution across conversational turns
                </p>
              </div>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                <Smile className="w-3.5 h-3.5 text-emerald-500" />
                {sentiment.overallTone}
              </span>
            </div>

            {/* Segmented Sentiment Bar */}
            <div className="space-y-2">
              <div className="h-4 w-full rounded-full overflow-hidden flex bg-gray-100 dark:bg-zinc-800 shadow-inner">
                <div
                  className="bg-emerald-500 h-full transition-all"
                  style={{ width: `${sentiment.positiveScore}%` }}
                  title={`Positive: ${sentiment.positiveScore}%`}
                />
                <div
                  className="bg-blue-400 h-full transition-all"
                  style={{ width: `${sentiment.neutralScore}%` }}
                  title={`Neutral: ${sentiment.neutralScore}%`}
                />
                <div
                  className="bg-rose-400 h-full transition-all"
                  style={{ width: `${sentiment.negativeScore}%` }}
                  title={`Critical/Negative: ${sentiment.negativeScore}%`}
                />
              </div>

              {/* Sentiment Legend */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
                <div className="p-2.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-900/30">
                  <div className="flex items-center justify-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                    <Smile className="w-3.5 h-3.5" />
                    <span>{sentiment.positiveScore}%</span>
                  </div>
                  <span className="text-[11px] text-gray-500 dark:text-zinc-400">Positive / Agreeable</span>
                </div>

                <div className="p-2.5 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-900/30">
                  <div className="flex items-center justify-center gap-1 text-blue-600 dark:text-blue-400 font-bold">
                    <Meh className="w-3.5 h-3.5" />
                    <span>{sentiment.neutralScore}%</span>
                  </div>
                  <span className="text-[11px] text-gray-500 dark:text-zinc-400">Neutral Fact-Sharing</span>
                </div>

                <div className="p-2.5 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/50 dark:border-rose-900/30">
                  <div className="flex items-center justify-center gap-1 text-rose-600 dark:text-rose-400 font-bold">
                    <Frown className="w-3.5 h-3.5" />
                    <span>{sentiment.negativeScore}%</span>
                  </div>
                  <span className="text-[11px] text-gray-500 dark:text-zinc-400">Critical / Disagreement</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Transcript Snippet */}
        {activeTab === 'transcript' && meeting.transcriptSnippet && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-500">
              Raw Audio Transcription Excerpt
            </h4>
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 font-mono text-xs text-gray-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap max-h-72 overflow-y-auto">
              {meeting.transcriptSnippet}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MeetingSummaryView;
