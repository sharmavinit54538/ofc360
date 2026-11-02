import React, { useState, useMemo } from 'react';
import { Search, Filter, AlertCircle, CheckCircle2 } from 'lucide-react';
import { FindingCard } from './FindingCard';
import type { FindingWithStatus, FindingStatus, Severity } from '../types';

interface FindingsTableProps {
  findings: FindingWithStatus[];
  onStatusChange: (id: string, nextStatus: FindingStatus, reason?: string) => void;
  highlightedFindingId?: string | null;
  emptyMessage?: string;
}

export const FindingsTable: React.FC<FindingsTableProps> = ({
  findings,
  onStatusChange,
  highlightedFindingId,
  emptyMessage = 'No audit findings detected for the selected period.',
}) => {
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredFindings = useMemo(() => {
    return findings.filter((f) => {
      if (severityFilter !== 'all' && f.severity !== severityFilter) {
        return false;
      }
      if (statusFilter !== 'all' && f.status !== statusFilter) {
        return false;
      }
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        f.title.toLowerCase().includes(q) ||
        f.ruleId.toLowerCase().includes(q) ||
        f.subjectRef.toLowerCase().includes(q) ||
        f.suggestedAction.toLowerCase().includes(q)
      );
    });
  }, [findings, severityFilter, statusFilter, search]);

  const criticalCount = useMemo(
    () => findings.filter((f) => f.severity === 'critical' && f.status !== 'DISMISSED').length,
    [findings]
  );

  return (
    <div className="space-y-4">
      {/* Search & Filter Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter findings by rule, employee, title..."
            className="w-full pl-9 pr-4 py-1.5 text-xs rounded-xl bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-xl bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 focus:outline-none cursor-pointer"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical Only</option>
            <option value="warn">Warnings Only</option>
            <option value="info">Notices Only</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-xl bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 focus:outline-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="OPEN">Open Only</option>
            <option value="ACKNOWLEDGED">Acknowledged</option>
            <option value="ESCALATED">Escalated</option>
            <option value="DISMISSED">Dismissed</option>
          </select>

          <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 ml-1">
            {filteredFindings.length} of {findings.length} findings ({criticalCount} critical)
          </span>
        </div>
      </div>

      {/* Findings List */}
      {filteredFindings.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-zinc-800 space-y-2">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto opacity-80" />
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            Clean Compliance Signal
          </h4>
          <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-sm mx-auto">
            {emptyMessage}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredFindings.map((finding) => (
            <FindingCard
              key={finding.id}
              finding={finding}
              onStatusChange={onStatusChange}
              isHighlighted={highlightedFindingId === finding.id}
            />
          ))}
        </div>
      )}
    </div>
  );
};

