import React from 'react';
import { Target, Plus, TrendingUp } from 'lucide-react';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { SkeletonListItem } from '@/shared/ui/Skeleton';
import { cn } from '@/shared/lib/utils';
import type { GoalItem } from '../types/performance.types';

interface GoalsProgressListProps {
  goals: GoalItem[];
  isLoading: boolean;
  onCreateGoal: () => void;
  onUpdateProgress: (goal: GoalItem) => void;
}

type BadgeVariant = 'brand' | 'success' | 'warning' | 'danger' | 'slate' | 'role';

const STATUS_BADGE: Record<string, { variant: BadgeVariant; label: string }> = {
  NOT_STARTED: { variant: 'slate', label: 'Not Started' },
  IN_PROGRESS: { variant: 'brand', label: 'In Progress' },
  COMPLETED: { variant: 'success', label: 'Completed' },
  AT_RISK: { variant: 'danger', label: 'At Risk' },
};

const PRIORITY_BADGE: Record<string, { variant: BadgeVariant; label: string }> = {
  LOW: { variant: 'slate', label: 'Low' },
  MEDIUM: { variant: 'warning', label: 'Medium' },
  HIGH: { variant: 'danger', label: 'High' },
};

const CATEGORY_LABELS: Record<string, string> = {
  ORGANIZATIONAL: 'Organizational',
  DEPARTMENTAL: 'Departmental',
  INDIVIDUAL: 'Individual',
  TECHNICAL: 'Technical',
  PROFESSIONAL: 'Professional',
};

const formatTargetDate = (dateStr?: string | null): string => {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return dateStr;
  }
};

const formatMetricProgress = (goal: GoalItem): string => {
  const current = goal.currentValue ?? goal.progress ?? 0;
  const target = goal.targetValue ?? 100;
  if (goal.metricType === 'BOOLEAN') {
    return current >= target ? 'Milestone achieved' : 'Milestone pending';
  }
  if (goal.metricType === 'PERCENTAGE' || !goal.metricType) {
    return `${Math.round(current)}% of ${target}%`;
  }
  return `${current} of ${target}`;
};

const clampProgress = (value?: number): number => Math.min(100, Math.max(0, Number(value ?? 0)));

export const GoalsProgressList: React.FC<GoalsProgressListProps> = ({
  goals,
  isLoading,
  onCreateGoal,
  onUpdateProgress,
}) => {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#171717] overflow-hidden shadow-sm">
      <div className="p-4 md:p-6 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-[#ececec] flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-600" />
            Goals & OKRs
          </h2>
          <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
            Live objective progress synced with the performance engine
          </p>
        </div>
        <Button
          size="sm"
          onClick={onCreateGoal}
          className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          <Plus className="w-3.5 h-3.5 mr-1" />
          Add Goal
        </Button>
      </div>

      {isLoading ? (
        <div className="p-4 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonListItem key={i} />
          ))}
        </div>
      ) : goals.length === 0 ? (
        <div className="p-12 text-center">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4">
            <Target className="w-7 h-7" />
          </div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-[#ececec]">
            No goals found in this scope
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-zinc-400 max-w-sm mx-auto">
            Create your first objective to start tracking measurable outcomes.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100 dark:divide-zinc-800/80">
          {goals.map((goal) => {
            const statusBadge = STATUS_BADGE[goal.status] || {
              variant: goal.status === 'COMPLETED' ? 'success' : 'brand',
              label: goal.status ? goal.status.replace(/_/g, ' ') : 'In Progress',
            };
            const priorityBadge = PRIORITY_BADGE[goal.priority] || {
              variant: 'warning',
              label: goal.priority || 'Medium',
            };
            const categoryLabel = CATEGORY_LABELS[goal.category] || goal.category || 'General';
            const progress = clampProgress(goal.progressPercentage ?? goal.progress);
            const ownerName = goal.assignee?.name || goal.employeeName || 'Employee';
            const dueDateStr = formatTargetDate(goal.targetDate || goal.dueDate);

            return (
              <div key={goal.id} className="px-4 md:px-6 py-4 hover:bg-gray-50/80 dark:hover:bg-zinc-800/40 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-gray-900 dark:text-[#ececec]">
                        {goal.title}
                      </span>
                      <Badge variant="slate" size="sm" className="text-[10px] font-semibold">
                        {categoryLabel}
                      </Badge>
                      <Badge variant={priorityBadge.variant} size="sm" className="text-[10px] font-semibold">
                        {priorityBadge.label}
                      </Badge>
                      <Badge variant={statusBadge.variant} size="sm" className="text-[10px] font-semibold">
                        {statusBadge.label}
                      </Badge>
                    </div>
                    {goal.description && (
                      <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1 line-clamp-1">
                        {goal.description}
                      </p>
                    )}

                    <div className="mt-2.5 flex items-center gap-3">
                      <div className="flex-1 max-w-md h-2 rounded-full bg-gray-100 dark:bg-zinc-800 overflow-hidden">
                        <div
                          className={cn(
                            'h-full rounded-full transition-all duration-300',
                            goal.status === 'AT_RISK'
                              ? 'bg-rose-500'
                              : goal.status === 'COMPLETED'
                              ? 'bg-emerald-500'
                              : 'bg-indigo-500'
                          )}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-gray-700 dark:text-zinc-300 whitespace-nowrap">
                        {Math.round(progress)}%
                      </span>
                    </div>

                    <p className="mt-1.5 text-[11px] text-gray-500 dark:text-zinc-400 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {formatMetricProgress(goal)} • Owner: {ownerName} • Due {dueDateStr}
                    </p>
                  </div>

                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => onUpdateProgress(goal)}
                    disabled={goal.status === 'COMPLETED'}
                    className="text-xs shrink-0"
                  >
                    Update Progress
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default GoalsProgressList;
