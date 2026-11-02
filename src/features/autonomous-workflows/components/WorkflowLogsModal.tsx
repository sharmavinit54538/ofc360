import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle, Clock, RotateCw, Terminal, Search } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import type { WorkflowLog, AutonomousWorkflow } from '../types/workflow.types';

interface WorkflowLogsModalProps {
  isOpen: boolean;
  onClose: () => void;
  logs: WorkflowLog[];
  selectedWorkflow?: AutonomousWorkflow | null;
  onRerun: (workflowId: string) => void;
}

export const WorkflowLogsModal: React.FC<WorkflowLogsModalProps> = ({
  isOpen,
  onClose,
  logs,
  selectedWorkflow,
  onRerun,
}) => {
  const [searchLog, setSearchLog] = useState('');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredLogs = logs.filter((log) => {
    if (selectedWorkflow && log.workflowId !== selectedWorkflow.id) {
      return false;
    }
    if (!searchLog.trim()) return true;
    const q = searchLog.toLowerCase();
    return (
      log.workflowName.toLowerCase().includes(q) ||
      log.trigger.toLowerCase().includes(q) ||
      log.message.toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-slate-200 dark:border-zinc-800 max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {selectedWorkflow
                  ? `Execution History: ${selectedWorkflow.name}`
                  : 'All Autonomous Execution Logs'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Live automated pipeline audit trails and step traces
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search bar inside modal */}
        <div className="p-4 border-b border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/40 shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchLog}
              onChange={(e) => setSearchLog(e.target.value)}
              placeholder="Search logs by trigger, message, or workflow..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Log list */}
        <div className="p-5 overflow-y-auto space-y-3 flex-1">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Terminal className="w-8 h-8 mx-auto mb-2 opacity-60" />
              <p className="text-sm font-medium">No execution records found</p>
              <p className="text-xs text-slate-500 mt-1">Run a workflow to generate real-time execution logs.</p>
            </div>
          ) : (
            filteredLogs.map((log) => {
              const isExpanded = expandedLogId === log.id;

              return (
                <div
                  key={log.id}
                  className="rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50/60 dark:bg-zinc-900/60 p-4 transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5">
                        {log.status === 'success' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        ) : log.status === 'running' ? (
                          <RotateCw className="w-4 h-4 text-indigo-500 animate-spin" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-rose-500" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            {log.workflowName}
                          </span>
                          <span className="text-[10px] text-slate-400 dark:text-zinc-500">
                            {log.timestamp}
                          </span>
                        </div>
                        <p className="text-xs font-medium text-slate-600 dark:text-zinc-300 mt-1">
                          {log.message}
                        </p>
                        <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-500 dark:text-zinc-400 flex-wrap">
                          <span className="px-2 py-0.5 rounded bg-white dark:bg-zinc-800 border border-slate-200/60 dark:border-zinc-700 font-mono text-[10px]">
                            {log.trigger}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1 font-mono">
                            <Clock className="w-3 h-3" />
                            {log.durationMs}ms
                          </span>
                          <span>•</span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                            {log.stepsCompleted}/{log.totalSteps} steps completed
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {log.outputPayload && (
                        <button
                          type="button"
                          onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                          className="px-2 py-1 rounded-lg text-[11px] font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors"
                        >
                          {isExpanded ? 'Hide Payload' : 'View Payload'}
                        </button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRerun(log.workflowId)}
                        className="text-xs px-2 py-1 text-slate-500 hover:text-slate-900 dark:hover:text-white"
                        title="Re-execute workflow"
                      >
                        <RotateCw className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                  {/* Expanded Payload Preview */}
                  {isExpanded && log.outputPayload && (
                    <div className="mt-3 pt-3 border-t border-slate-200 dark:border-zinc-800 font-mono text-[11px] bg-slate-900 text-slate-100 rounded-lg p-3 overflow-x-auto">
                      <pre>{JSON.stringify(log.outputPayload, null, 2)}</pre>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between shrink-0 bg-slate-50/50 dark:bg-zinc-900/40">
          <span className="text-xs text-slate-500 dark:text-zinc-400">
            Showing {filteredLogs.length} execution events
          </span>
          <Button variant="outline" size="sm" onClick={onClose} className="text-xs">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

