import React, { useMemo } from 'react';
import { AlertCircle } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

export interface PriorityItem {
  priority: 'High Priority' | 'Medium Priority' | 'Low Priority';
  count: number;
  percentage: number;
  color: string;
}

interface RecruitmentPriorityChartProps {
  priorities?: PriorityItem[];
  totalPositions?: number;
  isLoading?: boolean;
}

const DEFAULT_PRIORITIES: PriorityItem[] = [
  { priority: 'High Priority', count: 19, percentage: 37.3, color: '#f43f5e' },
  { priority: 'Medium Priority', count: 22, percentage: 43.1, color: '#f59e0b' },
  { priority: 'Low Priority', count: 10, percentage: 19.6, color: '#0d9488' },
];

export const RecruitmentPriorityChart: React.FC<RecruitmentPriorityChartProps> = ({
  priorities,
  totalPositions,
}) => {
  const chartData = useMemo(
    () => (priorities && priorities.length > 0 ? priorities : DEFAULT_PRIORITIES),
    [priorities]
  );

  const total = useMemo(
    () => totalPositions ?? chartData.reduce((acc, curr) => acc + curr.count, 0),
    [totalPositions, chartData]
  );

  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-xl p-5 shadow-xs flex flex-col justify-between">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500" />
            <span>Open Positions by Priority</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
            Hiring urgency & requisition prioritization
          </p>
        </div>
        <span className="text-[11px] font-semibold text-rose-600 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded-full">
          Urgent: {chartData[0]?.count || 0}
        </span>
      </div>

      {/* Doughnut Chart */}
      <div className="relative h-44 w-full flex items-center justify-center my-1">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={70}
              paddingAngle={4}
              dataKey="count"
            >
              {chartData.map((entry) => (
                <Cell key={entry.priority} fill={entry.color} stroke="#ffffff" strokeWidth={1.5} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: any, name: any) => [`${value} positions`, name]}
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
          <span className="text-xl font-bold text-slate-900 dark:text-white">{total}</span>
          <span className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">Positions</span>
        </div>
      </div>

      {/* Legend with counts and percentages */}
      <div className="pt-2 border-t border-slate-100 dark:border-zinc-800/80 space-y-1.5">
        {chartData.map((item) => (
          <div key={item.priority} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
              <span className="text-slate-600 dark:text-zinc-300 font-medium">
                {item.priority}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-800 dark:text-zinc-200">{item.count}</span>
              <span className="text-[11px] text-slate-400 dark:text-zinc-500 font-medium w-12 text-right">
                {item.percentage.toFixed(1)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
