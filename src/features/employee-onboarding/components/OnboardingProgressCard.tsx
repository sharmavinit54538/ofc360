import React from 'react';
import {
  CheckCircle2,
  Clock,
  Calendar,
  AlertCircle,
  Sparkles,
  User,
  ShieldCheck,
} from 'lucide-react';
import { Badge } from '@/shared/ui/Badge';
import type { OnboardingEmployee, OnboardingProgress } from '../types/onboarding.types';

interface OnboardingProgressCardProps {
  employee?: OnboardingEmployee;
  progress?: OnboardingProgress;
  isLoading?: boolean;
}

export const OnboardingProgressCard: React.FC<OnboardingProgressCardProps> = ({
  employee,
  progress,
  isLoading,
}) => {
  const percentage = progress?.percentage ?? 0;
  const isComplete = percentage >= 100 || progress?.isCompleted;
  const completed = progress?.completedTasks ?? 0;
  const total = progress?.totalTasks ?? 0;
  const pendingVerification = progress?.pendingVerificationTasks ?? 0;

  if (isLoading) {
    return (
      <div className="p-6 rounded-3xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 shadow-sm animate-pulse space-y-4">
        <div className="h-6 w-48 bg-gray-200 dark:bg-zinc-800 rounded" />
        <div className="h-4 w-full bg-gray-200 dark:bg-zinc-800 rounded-full" />
      </div>
    );
  }

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 shadow-sm relative overflow-hidden space-y-5">
      {/* Background ambient gradient glow */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-56 h-56 rounded-full bg-brand-500/5 blur-3xl pointer-events-none" />

      {/* Top row: Employee info & Status Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 p-0.5 shadow-sm shadow-brand-500/10 flex-shrink-0">
            <div className="w-full h-full bg-white dark:bg-[#171717] rounded-[14px] flex items-center justify-center font-bold text-base text-brand-600 dark:text-brand-400">
              {employee?.name ? employee.name[0] : <User className="w-5 h-5" />}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-[#ececec]">
                {employee?.name ? `${employee.name}'s Onboarding Journey` : 'New Hire Onboarding'}
              </h2>
              {isComplete ? (
                <Badge variant="success" size="sm" className="flex items-center gap-1 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Ready to Work
                </Badge>
              ) : (
                <Badge variant="brand" size="sm" className="font-semibold">
                  In Progress
                </Badge>
              )}
            </div>
            <p className="text-xs text-gray-500 dark:text-zinc-400 flex items-center gap-2 mt-0.5">
              <span>{employee?.designation || 'New Team Member'}</span>
              <span>&bull;</span>
              <span>{employee?.department || 'Engineering'}</span>
              {employee?.joiningDate && (
                <>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Joined {new Date(employee.joiningDate).toLocaleDateString()}
                  </span>
                </>
              )}
            </p>
          </div>
        </div>

        {/* Action Metrics Pill */}
        <div className="flex items-center gap-3">
          {pendingVerification > 0 && (
            <div className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-900/40 text-amber-700 dark:text-amber-300 text-xs font-semibold flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{pendingVerification} Pending Verification</span>
            </div>
          )}

          <div className="text-right flex-shrink-0">
            <span className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold block">
              Progress
            </span>
            <div className="text-2xl font-black text-gray-900 dark:text-white">
              {percentage}%
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="w-full bg-gray-100 dark:bg-zinc-800/80 h-3 rounded-full overflow-hidden p-0.5">
          <div
            className={`h-full rounded-full transition-all duration-500 ease-out ${
              isComplete
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                : 'bg-gradient-to-r from-brand-600 to-indigo-500'
            }`}
            style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-zinc-400">
          <span className="font-medium">
            {completed} of {total} milestones completed
          </span>

          {progress?.targetCompletionDate && (
            <span className="flex items-center gap-1 text-[11px]">
              <Clock className="w-3 h-3 text-gray-400" /> Target Completion:{' '}
              {new Date(progress.targetCompletionDate).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>

      {/* Quick Status Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-gray-100 dark:border-zinc-800/80 text-xs">
        <div className="flex items-center gap-2 text-gray-600 dark:text-zinc-400">
          <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
          <span>Legally binding compliance & policy checks</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600 dark:text-zinc-400">
          <Sparkles className="w-4 h-4 text-indigo-500 flex-shrink-0" />
          <span>IT asset setup & account provisioning</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600 dark:text-zinc-400">
          <AlertCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />
          <span>Bank direct deposit & tax documentation</span>
        </div>
      </div>
    </div>
  );
};
