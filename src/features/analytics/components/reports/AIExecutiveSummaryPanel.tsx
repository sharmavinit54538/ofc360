/**
 * @file AIExecutiveSummaryPanel.tsx
 * @description Executive AI Analysis & Actionable Insights card powered by Cortex AI.
 * Displays anomalies, risk factors, optimizations, and one-click actions.
 */

import React from 'react';
import { Sparkles, AlertTriangle, TrendingUp, Lightbulb, CheckCircle2, ArrowRight } from 'lucide-react';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { useToast } from '@/shared/ui/Toast';
import type { AIExecutiveInsight } from '../../types';

interface AIExecutiveSummaryPanelProps {
  insights: AIExecutiveInsight[];
  title?: string;
  subtitle?: string;
  className?: string;
}

export const AIExecutiveSummaryPanel: React.FC<AIExecutiveSummaryPanelProps> = ({
  insights,
  title = 'AI Analysis & Actionable Insights',
  subtitle = 'Analyzed via OFC360 Cortex AI • Real-time anomaly detection & optimization engine',
  className = '',
}) => {
  const toast = useToast();

  const getInsightIcon = (type: AIExecutiveInsight['type']) => {
    switch (type) {
      case 'ANOMALY':
        return <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />;
      case 'RISK':
        return <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />;
      case 'OPTIMIZATION':
        return <TrendingUp className="w-4 h-4 text-emerald-500 shrink-0" />;
      case 'RECOMMENDATION':
      default:
        return <Lightbulb className="w-4 h-4 text-indigo-500 shrink-0" />;
    }
  };

  const getImpactBadge = (impact: AIExecutiveInsight['impact']) => {
    switch (impact) {
      case 'HIGH':
        return (
          <Badge variant="outline" size="sm" className="bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800 text-[10px]">
            High Impact
          </Badge>
        );
      case 'MEDIUM':
        return (
          <Badge variant="outline" size="sm" className="bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800 text-[10px]">
            Medium Impact
          </Badge>
        );
      case 'LOW':
      default:
        return (
          <Badge variant="outline" size="sm" className="bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800 text-[10px]">
            Informational
          </Badge>
        );
    }
  };

  const handleAction = (insight: AIExecutiveInsight) => {
    toast.success(
      `Triggered action: "${insight.actionLabel || 'Action'}" for "${insight.title}". Workflow dispatched.`,
      'AI Recommendation Executed'
    );
  };

  if (!insights || insights.length === 0) return null;

  return (
    <div
      className={`rounded-2xl border border-indigo-200/70 dark:border-indigo-900/50 bg-gradient-to-br from-indigo-50/60 via-purple-50/30 to-white dark:from-indigo-950/20 dark:via-purple-950/10 dark:to-[#171717] p-5 shadow-sm relative overflow-hidden ${className}`}
    >
      {/* Background ambient glow */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-4 border-b border-indigo-100 dark:border-zinc-800/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">{title}</h3>
              <Badge variant="outline" size="sm" className="bg-indigo-100/70 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 text-[10px] font-semibold">
                98.4% Confidence
              </Badge>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-zinc-400">{subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-center">
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-3 h-3" />
            Live Sync
          </span>
        </div>
      </div>

      {/* Insight Bullet Points Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
        {insights.map((insight) => (
          <div
            key={insight.id}
            className="flex flex-col justify-between p-3.5 rounded-xl bg-white/80 dark:bg-zinc-900/70 border border-indigo-100/60 dark:border-zinc-800/80 shadow-2xs backdrop-blur-xs hover:border-indigo-300 dark:hover:border-indigo-600 transition-all duration-200"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  {getInsightIcon(insight.type)}
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                    {insight.type}
                  </span>
                </div>
                {getImpactBadge(insight.impact)}
              </div>

              <h4 className="text-xs font-semibold text-slate-900 dark:text-white leading-tight">
                {insight.title}
              </h4>

              <p className="text-[11px] text-slate-600 dark:text-zinc-400 leading-relaxed">
                {insight.description}
              </p>
            </div>

            {insight.actionLabel && (
              <div className="pt-3 mt-2 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between">
                {insight.metricHighlight && (
                  <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                    {insight.metricHighlight}
                  </span>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleAction(insight)}
                  className="text-[11px] h-7 px-2 text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 ml-auto flex items-center gap-1"
                >
                  <span>{insight.actionLabel}</span>
                  <ArrowRight className="w-3 h-3" />
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIExecutiveSummaryPanel;

