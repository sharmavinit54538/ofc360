import React from 'react';
import { Target, CheckCircle2, AlertCircle } from 'lucide-react';

interface RecruitmentTargetProgressProps {
  currentHires?: number;
  targetHires?: number;
  periodLabel?: string;
}

export const RecruitmentTargetProgress: React.FC<RecruitmentTargetProgressProps> = ({
  currentHires = 38,
  targetHires = 50,
  periodLabel = 'Q4 Hiring Goal',
}) => {
  const percent = Math.min(100, Math.round((currentHires / Math.max(1, targetHires)) * 100));
  const remaining = Math.max(0, targetHires - currentHires);
  const isOnTrack = percent >= 70;

  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-xl p-5 shadow-xs flex flex-col justify-between">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Target className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span>Hiring Target Progress</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
            Quarterly organizational staffing milestones
          </p>
        </div>
        <span
          className={`text-[11px] font-semibold px-2.5 py-1 rounded-full inline-flex items-center gap-1 ${
            isOnTrack
              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
              : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
          }`}
        >
          {isOnTrack ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
          {isOnTrack ? 'On Track' : 'Needs Attention'}
        </span>
      </div>

      <div className="space-y-3.5 my-auto py-3">
        {/* Main Stats Row */}
        <div className="flex items-baseline justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                {currentHires}
              </span>
              <span className="text-slate-400 font-bold text-lg">/ {targetHires}</span>
              <span className="text-xs text-slate-500 ml-1 font-medium">Hires Completed</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">{periodLabel}</p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-teal-600 dark:text-teal-400">{percent}%</span>
            <p className="text-[11px] text-slate-400">Achieved</p>
          </div>
        </div>

        {/* Progress Bar with Gradient and Milestone Ticks */}
        <div className="space-y-1.5">
          <div className="relative w-full bg-slate-100 dark:bg-zinc-800 h-3.5 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-600 rounded-full transition-all duration-700 shadow-xs"
              style={{ width: `${percent}%` }}
            />
          </div>

          <div className="flex justify-between text-[10px] text-slate-400 font-medium px-1">
            <span>0 Hires</span>
            <span>25 (50%)</span>
            <span>{targetHires} Hires Target</span>
          </div>
        </div>
      </div>

      {/* Footer Details */}
      <div className="pt-3 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between text-xs">
        <span className="text-slate-600 dark:text-zinc-400">
          Remaining to Quota:{' '}
          <strong className="text-slate-900 dark:text-white">{remaining} hires</strong>
        </span>
        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
          {Math.round(percent)}% Goal Attainment
        </span>
      </div>
    </div>
  );
};
