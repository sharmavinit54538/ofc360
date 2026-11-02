import React from 'react';
import { Zap, CheckCircle2, PlayCircle, Clock, ShieldCheck } from 'lucide-react';
import type { WorkflowKpis } from '../types/workflow.types';

interface WorkflowKpiCardsProps {
  kpis: WorkflowKpis;
}

export const WorkflowKpiCards: React.FC<WorkflowKpiCardsProps> = ({ kpis }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
      {/* 1. Total Workflows */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-zinc-800 shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500 dark:text-zinc-400">Total Workflows</span>
          <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Zap className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2.5">
          <span className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            {kpis.totalWorkflows}
          </span>
          <span className="text-[11px] text-slate-400 dark:text-zinc-500 ml-1.5 font-medium">Configured</span>
        </div>
      </div>

      {/* 2. Active Automations */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-zinc-800 shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500 dark:text-zinc-400">Active Pipelines</span>
          <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <PlayCircle className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2.5 flex items-baseline gap-1.5">
          <span className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            {kpis.activeAutomations}
          </span>
          <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Running 24/7
          </span>
        </div>
      </div>

      {/* 3. Executions Today */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-zinc-800 shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500 dark:text-zinc-400">Executions Today</span>
          <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2.5">
          <span className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            {kpis.executionsToday.toLocaleString()}
          </span>
          <span className="text-[11px] text-slate-400 dark:text-zinc-500 ml-1.5 font-medium">Actions executed</span>
        </div>
      </div>

      {/* 4. Success Rate */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-zinc-800 shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500 dark:text-zinc-400">Success Rate</span>
          <div className="w-8 h-8 rounded-xl bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2.5 flex items-baseline gap-1.5">
          <span className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            {kpis.successRate}%
          </span>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">Zero-downtime</span>
        </div>
      </div>

      {/* 5. Hours Saved */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-zinc-800 shadow-2xs col-span-2 md:col-span-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500 dark:text-zinc-400">Monthly Time Saved</span>
          <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2.5">
          <span className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            ~{kpis.hoursSavedMonthly} hrs
          </span>
          <span className="text-[11px] text-slate-400 dark:text-zinc-500 ml-1.5 font-medium">Manual work saved</span>
        </div>
      </div>
    </div>
  );
};

