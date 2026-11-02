import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Check,
  X,
  ChevronDown,
  Info,
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { SeverityBadge } from './SeverityBadge';
import type { FindingWithStatus, FindingStatus } from '../types';

interface FindingCardProps {
  finding: FindingWithStatus;
  onStatusChange: (id: string, nextStatus: FindingStatus, reason?: string) => void;
  className?: string;
  isHighlighted?: boolean;
}

export const FindingCard: React.FC<FindingCardProps> = ({
  finding,
  onStatusChange,
  className,
  isHighlighted = false,
}) => {
  const [isDismissing, setIsDismissing] = useState(false);
  const [dismissReason, setDismissReason] = useState('');

  const formatInr = (val?: number) => {
    if (val === undefined || val === null) return null;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleConfirmDismiss = () => {
    if (!dismissReason.trim()) return;
    onStatusChange(finding.id, 'DISMISSED', dismissReason.trim());
    setIsDismissing(false);
    setDismissReason('');
  };

  return (
    <div
      id={`finding-${finding.id}`}
      className={cn(
        'p-4 rounded-xl border transition-all duration-200 space-y-3 bg-white dark:bg-[#1a1a1a]',
        isHighlighted
          ? 'border-indigo-500 shadow-md ring-2 ring-indigo-500/20'
          : 'border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700',
        finding.status === 'DISMISSED' && 'opacity-60 bg-slate-50/50 dark:bg-zinc-900/40',
        className
      )}
    >
      {/* Top Header: Rule ID + Severity + Status selector */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <SeverityBadge severity={finding.severity} />
          <span className="font-mono text-[11px] font-bold text-slate-500 dark:text-zinc-400">
            {finding.ruleId}
          </span>
          <span className="text-[11px] font-semibold text-slate-700 dark:text-zinc-300 px-2 py-0.5 rounded bg-slate-100 dark:bg-zinc-800">
            {finding.subjectRef}
          </span>
        </div>

        {/* Status Dropdown */}
        <div className="flex items-center gap-2">
          {finding.amountAtRiskInr !== undefined && finding.amountAtRiskInr > 0 && (
            <span className="font-mono text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-2.5 py-0.5 rounded-lg border border-rose-200 dark:border-rose-900/50">
              {formatInr(finding.amountAtRiskInr)} at risk
            </span>
          )}

          <select
            value={finding.status}
            onChange={(e) => {
              const val = e.target.value as FindingStatus;
              if (val === 'DISMISSED') {
                setIsDismissing(true);
              } else {
                onStatusChange(finding.id, val);
              }
            }}
            className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 focus:outline-none cursor-pointer"
          >
            <option value="OPEN">Open Signal</option>
            <option value="ACKNOWLEDGED">Acknowledged</option>
            <option value="ESCALATED">Escalated</option>
            <option value="DISMISSED">Dismissed</option>
          </select>
        </div>
      </div>

      {/* Title */}
      <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
        {finding.title}
      </h4>

      {/* Evidence Pill Grid */}
      <div className="flex flex-wrap gap-1.5 pt-0.5">
        {Object.entries(finding.evidence).map(([key, val]) => (
          <span
            key={key}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono bg-slate-100 dark:bg-zinc-800/80 text-slate-600 dark:text-zinc-300 border border-slate-200/50 dark:border-zinc-700/50"
          >
            <span className="text-slate-400 dark:text-zinc-500">{key}:</span>
            <span className="font-semibold">{String(val)}</span>
          </span>
        ))}
      </div>

      {/* Suggested Action Bar */}
      <div className="pt-2 border-t border-slate-100 dark:border-zinc-800/80 flex items-start gap-2 text-xs text-indigo-700 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/20 p-2.5 rounded-xl">
        <ArrowRight className="w-3.5 h-3.5 mt-0.5 shrink-0" />
        <span className="leading-relaxed">
          <strong>Review Guidance:</strong> {finding.suggestedAction}
        </span>
      </div>

      {/* Dismissal Reason Form */}
      {isDismissing && (
        <div className="pt-2 space-y-2 animate-in fade-in">
          <input
            type="text"
            required
            value={dismissReason}
            onChange={(e) => setDismissReason(e.target.value)}
            placeholder="Provide dismissal rationale for governance audit trail..."
            className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setIsDismissing(false);
                setDismissReason('');
              }}
              className="text-xs px-2.5 py-1 text-slate-500 hover:text-slate-800 dark:hover:text-white"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmDismiss}
              disabled={!dismissReason.trim()}
              className="text-xs px-3 py-1 rounded-lg bg-slate-800 text-white dark:bg-zinc-200 dark:text-slate-900 disabled:opacity-40 font-semibold"
            >
              Confirm Dismissal
            </button>
          </div>
        </div>
      )}

      {finding.status === 'DISMISSED' && finding.dismissedReason && (
        <p className="text-[11px] text-slate-400 italic">
          Dismissed Reason: {finding.dismissedReason}
        </p>
      )}
    </div>
  );
};

