import React from 'react';
import {
  Play,
  RotateCw,
  Terminal,
  SlidersHorizontal,
  Bot,
  Zap,
  Clock,
  Radio,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import type { AutonomousWorkflow } from '../types/workflow.types';

interface WorkflowCardProps {
  workflow: AutonomousWorkflow;
  onToggleStatus: (id: string) => void;
  onRunNow: (workflow: AutonomousWorkflow) => void;
  onViewLogs: (workflow: AutonomousWorkflow) => void;
  onEdit: (workflow: AutonomousWorkflow) => void;
  isRunning?: boolean;
}

const CATEGORY_STYLES: Record<
  string,
  { label: string; bg: string; text: string; border: string }
> = {
  offboarding: {
    label: 'Offboarding & Exit',
    bg: 'bg-rose-500/10 dark:bg-rose-500/20',
    text: 'text-rose-600 dark:text-rose-400',
    border: 'border-rose-200/60 dark:border-rose-900/40',
  },
  onboarding: {
    label: 'Onboarding & Hire',
    bg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
    text: 'text-emerald-600 dark:text-emerald-400',
    border: 'border-emerald-200/60 dark:border-emerald-900/40',
  },
  attendance: {
    label: 'Attendance & Shifts',
    bg: 'bg-blue-500/10 dark:bg-blue-500/20',
    text: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-200/60 dark:border-blue-900/40',
  },
  payroll: {
    label: 'Payroll & Expenses',
    bg: 'bg-amber-500/10 dark:bg-amber-500/20',
    text: 'text-amber-600 dark:text-amber-400',
    border: 'border-amber-200/60 dark:border-amber-900/40',
  },
  compliance: {
    label: 'Statutory Compliance',
    bg: 'bg-indigo-500/10 dark:bg-indigo-500/20',
    text: 'text-indigo-600 dark:text-indigo-400',
    border: 'border-indigo-200/60 dark:border-indigo-900/40',
  },
  security: {
    label: 'Identity & SecOps',
    bg: 'bg-purple-500/10 dark:bg-purple-500/20',
    text: 'text-purple-600 dark:text-purple-400',
    border: 'border-purple-200/60 dark:border-purple-900/40',
  },
};

export const WorkflowCard: React.FC<WorkflowCardProps> = ({
  workflow,
  onToggleStatus,
  onRunNow,
  onViewLogs,
  onEdit,
  isRunning = false,
}) => {
  const categoryConfig = CATEGORY_STYLES[workflow.category] || CATEGORY_STYLES.compliance;
  const isActive = workflow.status === 'active';

  return (
    <div
      className={cn(
        'group relative flex flex-col justify-between rounded-2xl p-5 md:p-6 transition-all duration-200',
        'bg-white dark:bg-[#1a1a1a] border',
        isActive
          ? 'border-slate-200 dark:border-zinc-800 hover:border-indigo-400 dark:hover:border-indigo-500/50 hover:shadow-lg'
          : 'border-slate-200/60 dark:border-zinc-800/60 opacity-80 bg-slate-50/50 dark:bg-zinc-900/30'
      )}
    >
      <div>
        {/* Top Meta Bar */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                'px-2.5 py-0.5 rounded-lg text-[11px] font-semibold border',
                categoryConfig.bg,
                categoryConfig.text,
                categoryConfig.border
              )}
            >
              {categoryConfig.label}
            </span>

            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[11px] font-medium bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300">
              <Bot className="w-3 h-3 text-indigo-500" />
              <span>
                {workflow.aiModel === 'gemini-1.5-pro'
                  ? 'Gemini 1.5 Pro'
                  : workflow.aiModel === 'gemini-1.5-flash'
                  ? 'Gemini 1.5 Flash'
                  : 'Rules Engine'}
              </span>
            </span>

            {workflow.humanInTheLoop && (
              <span className="px-2 py-0.5 rounded-lg text-[11px] font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                Human-in-the-Loop
              </span>
            )}
          </div>

          {/* Active / Paused Toggle Switch */}
          <button
            type="button"
            onClick={() => onToggleStatus(workflow.id)}
            className={cn(
              'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer',
              isActive
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20'
                : 'bg-slate-200 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-300 dark:hover:bg-zinc-700'
            )}
            title={isActive ? 'Click to pause automation' : 'Click to activate automation'}
          >
            <span
              className={cn(
                'w-2 h-2 rounded-full',
                isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
              )}
            />
            <span>{isActive ? 'Active' : 'Paused'}</span>
          </button>
        </div>

        {/* Title & Description */}
        <div className="mt-3.5 space-y-1.5">
          <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {workflow.name}
          </h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed line-clamp-2">
            {workflow.description}
          </p>
        </div>

        {/* Trigger Specification */}
        <div className="mt-3.5 flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 text-xs">
          <div className="text-indigo-600 dark:text-indigo-400 shrink-0">
            {workflow.triggerType === 'event' ? (
              <Zap className="w-3.5 h-3.5" />
            ) : workflow.triggerType === 'schedule' ? (
              <Clock className="w-3.5 h-3.5" />
            ) : workflow.triggerType === 'anomaly' ? (
              <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
            ) : (
              <Radio className="w-3.5 h-3.5" />
            )}
          </div>
          <span className="font-medium text-slate-700 dark:text-zinc-300 truncate">
            {workflow.triggerDetail}
          </span>
        </div>

        {/* Execution Pipeline Steps visualizer */}
        <div className="mt-4 space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 block">
            Pipeline Sequence ({workflow.steps.length} Steps)
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {workflow.steps.map((step, idx) => (
              <React.Fragment key={step.id}>
                <span
                  className="px-2 py-1 rounded-lg text-[11px] font-medium bg-slate-100 dark:bg-zinc-800/80 text-slate-700 dark:text-zinc-300 border border-slate-200/40 dark:border-zinc-700/40"
                  title={step.description}
                >
                  {step.name}
                </span>
                {idx < workflow.steps.length - 1 && (
                  <ArrowRight className="w-3 h-3 text-slate-300 dark:text-zinc-600 shrink-0" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Footer & Actions */}
      <div className="mt-5 pt-4 border-t border-slate-100 dark:border-zinc-800/80 flex flex-wrap items-center justify-between gap-3">
        {/* Runtime Stats */}
        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-zinc-400">
          <span>
            Runs:{' '}
            <strong className="text-slate-800 dark:text-zinc-200 font-semibold">
              {workflow.executionsCount}
            </strong>
          </span>
          <span>•</span>
          <span>
            Last Run:{' '}
            <strong className="text-slate-800 dark:text-zinc-200 font-semibold">
              {workflow.lastRun || 'Never'}
            </strong>
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewLogs(workflow)}
            className="text-xs gap-1 border-slate-200 dark:border-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-800 px-2.5 py-1.5"
            title="View execution run history"
          >
            <Terminal className="w-3.5 h-3.5 text-slate-500" />
            <span>Logs</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(workflow)}
            className="text-xs gap-1 border-slate-200 dark:border-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-800 px-2.5 py-1.5"
            title="Configure workflow parameters"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
            <span>Configure</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            disabled={!isActive || isRunning}
            onClick={() => onRunNow(workflow)}
            className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white gap-1.5 px-3 py-1.5 shadow-xs"
            title="Trigger test execution now"
          >
            {isRunning ? (
              <>
                <RotateCw className="w-3.5 h-3.5 animate-spin" />
                <span>Running...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Run Now</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

