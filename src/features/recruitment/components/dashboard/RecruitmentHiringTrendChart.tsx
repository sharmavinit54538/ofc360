import React, { useState, useMemo } from 'react';
import { TrendingUp } from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

interface TrendDataPoint {
  month: string;
  applications: number;
  interviews: number;
  hires: number;
}

interface RecruitmentHiringTrendChartProps {
  data?: TrendDataPoint[];
  isLoading?: boolean;
}

const DEFAULT_TREND: TrendDataPoint[] = [
  { month: 'Jun', applications: 180, interviews: 45, hires: 8 },
  { month: 'Jul', applications: 220, interviews: 58, hires: 12 },
  { month: 'Aug', applications: 290, interviews: 72, hires: 15 },
  { month: 'Sep', applications: 340, interviews: 86, hires: 19 },
  { month: 'Oct', applications: 410, interviews: 110, hires: 24 },
  { month: 'Nov', applications: 480, interviews: 135, hires: 32 },
];

export const RecruitmentHiringTrendChart: React.FC<RecruitmentHiringTrendChartProps> = ({
  data,
}) => {
  const [metricFilter, setMetricFilter] = useState<'all' | 'applications' | 'interviews' | 'hires'>('all');
  const chartData = useMemo(() => (data && data.length > 0 ? data : DEFAULT_TREND), [data]);

  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-xl p-5 shadow-xs flex flex-col justify-between">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-zinc-800">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span>Hiring Trend</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
            Application, interview & hiring volume over time
          </p>
        </div>

        {/* Filter Toggles */}
        <div className="inline-flex items-center p-0.5 rounded-lg bg-slate-100 dark:bg-zinc-800 border border-slate-200/60 dark:border-zinc-700 text-xs">
          {(['all', 'applications', 'interviews', 'hires'] as const).map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setMetricFilter(filter)}
              className={`px-2.5 py-1 rounded-md capitalize font-medium text-[11px] transition-all ${
                metricFilter === filter
                  ? 'bg-white dark:bg-zinc-900 text-teal-600 dark:text-teal-400 shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="h-64 w-full pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorApplications" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0d9488" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#0d9488" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorInterviews" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorHires" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.6} />
            <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
            <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                fontSize: '12px',
              }}
            />
            {(metricFilter === 'all' || metricFilter === 'applications') && (
              <Area
                type="monotone"
                dataKey="applications"
                stroke="#0d9488"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorApplications)"
                name="Applications"
              />
            )}
            {(metricFilter === 'all' || metricFilter === 'interviews') && (
              <Area
                type="monotone"
                dataKey="interviews"
                stroke="#8b5cf6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorInterviews)"
                name="Interviews"
              />
            )}
            {(metricFilter === 'all' || metricFilter === 'hires') && (
              <Area
                type="monotone"
                dataKey="hires"
                stroke="#10b981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorHires)"
                name="Hires"
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="pt-3 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-zinc-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-600 inline-block" />
            <span>Applications</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block" />
            <span>Interviews</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
            <span>Hires</span>
          </span>
        </div>
        <span className="font-semibold text-teal-600 dark:text-teal-400">Last 6 Months</span>
      </div>
    </div>
  );
};
