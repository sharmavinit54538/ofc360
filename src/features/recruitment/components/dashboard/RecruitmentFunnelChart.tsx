import React from 'react';
import { Filter } from 'lucide-react';

export interface FunnelStageItem {
  stage: string;
  count: number;
  conversionPercent: number;
  color: string;
  badgeBg: string;
}

interface RecruitmentFunnelChartProps {
  stages?: FunnelStageItem[];
  isLoading?: boolean;
}

const DEFAULT_STAGES: FunnelStageItem[] = [
  { stage: 'Applications', count: 1240, conversionPercent: 100, color: 'bg-indigo-500', badgeBg: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40' },
  { stage: 'Screened', count: 860, conversionPercent: 69.4, color: 'bg-blue-500', badgeBg: 'text-blue-600 bg-blue-50 dark:bg-blue-950/40' },
  { stage: 'Shortlisted', count: 420, conversionPercent: 33.8, color: 'bg-teal-500', badgeBg: 'text-teal-600 bg-teal-50 dark:bg-teal-950/40' },
  { stage: 'Interviewed', count: 210, conversionPercent: 16.9, color: 'bg-amber-500', badgeBg: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40' },
  { stage: 'Offered', count: 68, conversionPercent: 5.5, color: 'bg-emerald-500', badgeBg: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40' },
  { stage: 'Hired', count: 48, conversionPercent: 3.9, color: 'bg-green-600', badgeBg: 'text-green-600 bg-green-50 dark:bg-green-950/40' },
];

export const RecruitmentFunnelChart: React.FC<RecruitmentFunnelChartProps> = ({
  stages,
  isLoading = false,
}) => {
  const currentStages = stages && stages.length > 0 ? stages : DEFAULT_STAGES;
  const maxCount = currentStages[0]?.count || 1;

  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-xl p-5 shadow-xs flex flex-col justify-between">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Filter className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span>Hiring Funnel</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
            Stage conversion & candidate drop-off velocity
          </p>
        </div>
        <span className="text-[11px] font-semibold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/50 px-2.5 py-1 rounded-full">
          6 Stages Active
        </span>
      </div>

      <div className="space-y-3.5 my-auto pt-3">
        {currentStages.map((item, idx) => {
          // Calculate tapered width relative to the maximum stage (Applications)
          const barWidthPercent = Math.max(14, Math.round((item.count / maxCount) * 100));

          return (
            <div key={item.stage} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 font-medium text-slate-700 dark:text-zinc-200">
                  <span className="w-4 text-slate-400 text-[10px] font-bold">#{idx + 1}</span>
                  <span>{item.stage}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 dark:text-white">
                    {isLoading ? '...' : item.count.toLocaleString()}
                  </span>
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${item.badgeBg}`}>
                    {item.conversionPercent}%
                  </span>
                </div>
              </div>

              {/* Funnel tapered bar */}
              <div className="w-full bg-slate-100 dark:bg-zinc-800/80 h-3 rounded-full overflow-hidden flex items-center">
                <div
                  className={`h-full ${item.color} rounded-full transition-all duration-500`}
                  style={{ width: `${barWidthPercent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-3 mt-2 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-zinc-400">
        <span>Overall Hire Rate:</span>
        <span className="font-bold text-emerald-600 dark:text-emerald-400">
          {((currentStages[currentStages.length - 1]?.count / maxCount) * 100).toFixed(1)}% Conversion
        </span>
      </div>
    </div>
  );
};
