import React, { useMemo } from 'react';
import { Share2 } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

export interface SourceDataItem {
  source: string;
  candidateCount: number;
  percentage: number;
  color: string;
}

interface RecruitmentSourcesChartProps {
  sources?: SourceDataItem[];
  totalCandidates?: number;
  isLoading?: boolean;
}

const DEFAULT_SOURCES: SourceDataItem[] = [
  { source: 'LinkedIn', candidateCount: 520, percentage: 41.9, color: '#0a66c2' },
  { source: 'Naukri', candidateCount: 290, percentage: 23.4, color: '#0284c7' },
  { source: 'Company Website', candidateCount: 195, percentage: 15.7, color: '#0d9488' },
  { source: 'Referral', candidateCount: 160, percentage: 12.9, color: '#8b5cf6' },
  { source: 'Other', candidateCount: 75, percentage: 6.1, color: '#f59e0b' },
];

export const RecruitmentSourcesChart: React.FC<RecruitmentSourcesChartProps> = ({
  sources,
  totalCandidates,
}) => {
  const chartData = useMemo(() => (sources && sources.length > 0 ? sources : DEFAULT_SOURCES), [sources]);
  const total = useMemo(
    () => totalCandidates ?? chartData.reduce((acc, curr) => acc + curr.candidateCount, 0),
    [totalCandidates, chartData]
  );

  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-xl p-5 shadow-xs flex flex-col justify-between">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Share2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span>Candidates by Source</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
            Channel acquisition & candidate distribution
          </p>
        </div>
        <span className="text-[11px] font-semibold text-slate-600 dark:text-zinc-400 bg-slate-100 dark:bg-zinc-800 px-2.5 py-1 rounded-full">
          5 Channels
        </span>
      </div>

      {/* Doughnut Chart with center label */}
      <div className="relative h-44 w-full flex items-center justify-center my-1">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={72}
              paddingAngle={3}
              dataKey="candidateCount"
            >
              {chartData.map((entry) => (
                <Cell key={entry.source} fill={entry.color} stroke="#ffffff" strokeWidth={1.5} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: any, name: any) => [`${value} candidates`, name]}
              contentStyle={{
                backgroundColor: '#ffffff',
                borderRadius: '10px',
                border: '1px solid #E2E8F0',
                fontSize: '11px',
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-xl font-bold text-slate-900 dark:text-white">{total.toLocaleString()}</span>
          <span className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">Candidates</span>
        </div>
      </div>

      {/* Legend with percentages and counts */}
      <div className="pt-2 border-t border-slate-100 dark:border-zinc-800/80 space-y-1.5">
        {chartData.map((item) => (
          <div key={item.source} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
              <span className="text-slate-600 dark:text-zinc-300 font-medium truncate max-w-[130px]">
                {item.source}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-800 dark:text-zinc-200">{item.candidateCount}</span>
              <span className="text-[11px] text-slate-400 dark:text-zinc-500 font-medium w-10 text-right">
                {item.percentage.toFixed(1)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

