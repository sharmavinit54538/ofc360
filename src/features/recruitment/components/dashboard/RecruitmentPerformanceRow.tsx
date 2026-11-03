import React from 'react';
import { Clock, DollarSign, Award, ShieldCheck, TrendingDown, TrendingUp } from 'lucide-react';

interface RecruitmentPerformanceRowProps {
  avgTimeToHireDays?: number;
  costPerHire?: number;
  offerAcceptanceRate?: number;
  slaAchievementRate?: number;
  isLoading?: boolean;
}

export const RecruitmentPerformanceRow: React.FC<RecruitmentPerformanceRowProps> = ({
  avgTimeToHireDays = 22.4,
  costPerHire = 38500,
  offerAcceptanceRate = 85.2,
  slaAchievementRate = 92.4,
}) => {
  // SVG circular progress calculation
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const acceptanceOffset = circumference - (offerAcceptanceRate / 100) * circumference;
  const slaOffset = circumference - (slaAchievementRate / 100) * circumference;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Time to Hire */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-xl p-4 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400">Time to Hire</span>
          <div className="w-7 h-7 rounded-lg bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 flex items-center justify-center">
            <Clock className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="flex items-baseline justify-between mb-2">
          <div>
            <span className="text-2xl font-bold text-slate-900 dark:text-white">
              {Math.round(avgTimeToHireDays)}
            </span>
            <span className="text-xs text-slate-500 ml-1 font-medium">days</span>
          </div>
          <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded">
            <TrendingDown className="w-2.5 h-2.5" />
            -3.2d
          </span>
        </div>

        {/* Small trend sparkline */}
        <div className="pt-2 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between">
          <svg className="w-24 h-6 text-teal-500 stroke-current" fill="none" viewBox="0 0 100 24">
            <path
              d="M0 18 Q 20 20, 35 14 T 70 8 T 100 4"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-[11px] text-slate-400 dark:text-zinc-500">Benchmark: 28d</span>
        </div>
      </div>

      {/* 2. Cost per Hire */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-xl p-4 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400">Cost per Hire</span>
          <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <DollarSign className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="flex items-baseline justify-between mb-2">
          <div>
            <span className="text-2xl font-bold text-slate-900 dark:text-white">
              ₹{(costPerHire / 1000).toFixed(1)}k
            </span>
            <span className="text-xs text-slate-500 ml-1 font-medium">/ hire</span>
          </div>
          <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded">
            <TrendingDown className="w-2.5 h-2.5" />
            -5.8%
          </span>
        </div>

        {/* Sparkline */}
        <div className="pt-2 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between">
          <svg className="w-24 h-6 text-indigo-500 stroke-current" fill="none" viewBox="0 0 100 24">
            <path
              d="M0 20 Q 25 22, 45 16 T 75 10 T 100 6"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-[11px] text-slate-400 dark:text-zinc-500">Budget: ₹45k</span>
        </div>
      </div>

      {/* 3. Offer Acceptance Rate */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-xl p-4 shadow-xs flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400">Offer Acceptance Rate</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">
              {offerAcceptanceRate.toFixed(1)}%
            </span>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
            <TrendingUp className="w-3 h-3" />
            <span>+4.2% vs target</span>
          </div>
        </div>

        {/* Circular progress indicator */}
        <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
          <svg className="w-14 h-14 -rotate-90 transform" viewBox="0 0 60 60">
            <circle
              cx="30"
              cy="30"
              r={radius}
              className="text-slate-100 dark:text-zinc-800 stroke-current"
              strokeWidth="5"
              fill="transparent"
            />
            <circle
              cx="30"
              cy="30"
              r={radius}
              className="text-teal-600 dark:text-teal-400 stroke-current transition-all duration-700"
              strokeWidth="5"
              strokeDasharray={circumference}
              strokeDashoffset={acceptanceOffset}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>
          <Award className="w-4 h-4 text-teal-600 dark:text-teal-400 absolute" />
        </div>
      </div>

      {/* 4. Recruitment SLA */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-xl p-4 shadow-xs flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400">Recruitment SLA</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">
              {slaAchievementRate.toFixed(1)}%
            </span>
          </div>
          <div className="text-[11px] font-medium text-slate-500 dark:text-zinc-400">
            Closed within 30-day SLA
          </div>
        </div>

        {/* Circular progress indicator */}
        <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
          <svg className="w-14 h-14 -rotate-90 transform" viewBox="0 0 60 60">
            <circle
              cx="30"
              cy="30"
              r={radius}
              className="text-slate-100 dark:text-zinc-800 stroke-current"
              strokeWidth="5"
              fill="transparent"
            />
            <circle
              cx="30"
              cy="30"
              r={radius}
              className="text-emerald-600 dark:text-emerald-400 stroke-current transition-all duration-700"
              strokeWidth="5"
              strokeDasharray={circumference}
              strokeDashoffset={slaOffset}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 absolute" />
        </div>
      </div>
    </div>
  );
};

