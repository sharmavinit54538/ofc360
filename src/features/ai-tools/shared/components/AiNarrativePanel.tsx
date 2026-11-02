import React from 'react';
import {
  Sparkles,
  AlertTriangle,
  HelpCircle,
  Clock,
  RotateCw,
  Cpu,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import type { ExplainResponse, ExplainStatus } from '../types';

interface AiNarrativePanelProps {
  status: ExplainStatus;
  narrative: ExplainResponse | null;
  errorMessage?: string | null;
  onRefreshExplain?: () => void;
  onSelectFinding?: (findingId: string) => void;
  ruleBasedFallbackSummary?: string;
}

export const AiNarrativePanel: React.FC<AiNarrativePanelProps> = ({
  status,
  narrative,
  errorMessage,
  onRefreshExplain,
  onSelectFinding,
  ruleBasedFallbackSummary,
}) => {
  if (status === 'loading') {
    return (
      <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50/50 to-purple-50/30 dark:from-indigo-950/20 dark:to-purple-950/10 border border-indigo-200/60 dark:border-indigo-900/40 space-y-3 animate-pulse">
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
          <RotateCw className="w-4 h-4 animate-spin" />
          <span className="text-xs font-semibold">Orchestrating Gemini AI Advisory Narrative...</span>
        </div>
        <div className="h-4 w-3/4 bg-indigo-200/50 dark:bg-indigo-900/50 rounded" />
        <div className="h-4 w-1/2 bg-indigo-200/50 dark:bg-indigo-900/50 rounded" />
      </div>
    );
  }

  // Backend Pending or Unavailable
  if (status === 'backend_pending' || status === 'error' || !narrative) {
    return (
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#171717] border border-slate-200 dark:border-zinc-800 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-300 dark:border-zinc-700">
              AI Narrative: Backend Pending / Offline
            </span>
            <span className="text-xs text-slate-500 dark:text-zinc-400">
              Deterministic rule engine active
            </span>
          </div>
          {onRefreshExplain && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefreshExplain}
              className="text-xs gap-1.5 py-1 px-2.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>Retry AI Narrative</span>
            </Button>
          )}
        </div>

        {ruleBasedFallbackSummary && (
          <div className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed bg-white dark:bg-zinc-900/70 p-3 rounded-xl border border-slate-200/60 dark:border-zinc-800">
            <span className="font-semibold text-slate-800 dark:text-zinc-100 block mb-1">
              Rule-based summary:
            </span>
            {ruleBasedFallbackSummary}
          </div>
        )}

        {errorMessage && (
          <p className="text-[11px] text-slate-400 dark:text-zinc-500 italic">
            Endpoint notice: {errorMessage}
          </p>
        )}
      </div>
    );
  }

  // Live Live Narrative Display
  return (
    <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50/70 via-purple-50/40 to-white dark:from-indigo-950/30 dark:via-purple-950/20 dark:to-[#171717] border border-indigo-200/70 dark:border-indigo-900/50 shadow-sm space-y-4">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-indigo-100 dark:border-indigo-900/40 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-600 text-white shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-sm font-bold text-slate-900 dark:text-white">
            AI Advisory Narrative
          </span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
            Advisory Only
          </span>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-zinc-400">
          <span className="flex items-center gap-1 font-mono">
            <Cpu className="w-3 h-3 text-indigo-500" />
            {narrative.modelUsed}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {narrative.generatedAt.slice(11, 16)} IST
          </span>
        </div>
      </div>

      {/* Summary Paragraph */}
      <p className="text-xs md:text-sm text-slate-700 dark:text-zinc-200 leading-relaxed font-medium">
        {narrative.summary}
      </p>

      {/* Action Priorities */}
      {narrative.priorities && narrative.priorities.length > 0 && (
        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 block">
            Recommended Action Priorities
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {narrative.priorities.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-white dark:bg-zinc-900/80 border border-slate-200/80 dark:border-zinc-800 space-y-1.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {item.action}
                  </span>
                  <div className="flex items-center gap-1">
                    {item.findingIds.map((id) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => onSelectFinding?.(id)}
                        className="px-1.5 py-0.5 rounded font-mono text-[10px] font-semibold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 transition-colors"
                        title={`Jump to finding ${id}`}
                      >
                        #{id.slice(-6)}
                      </button>
                    ))}
                  </div>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-zinc-400 leading-relaxed">
                  {item.rationale}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Risks & Questions for HR */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
        {narrative.risks && narrative.risks.length > 0 && (
          <div className="p-3 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/30 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-rose-700 dark:text-rose-400">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Key Operational Risks</span>
            </div>
            <ul className="text-[11px] text-slate-600 dark:text-zinc-300 space-y-1 list-disc list-inside">
              {narrative.risks.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
        )}

        {narrative.questionsForHr && narrative.questionsForHr.length > 0 && (
          <div className="p-3 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200/60 dark:border-purple-900/30 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-purple-700 dark:text-purple-400">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Inquiry Questions for HR &amp; Ops</span>
            </div>
            <ul className="text-[11px] text-slate-600 dark:text-zinc-300 space-y-1 list-disc list-inside">
              {narrative.questionsForHr.map((q, i) => (
                <li key={i}>{q}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

