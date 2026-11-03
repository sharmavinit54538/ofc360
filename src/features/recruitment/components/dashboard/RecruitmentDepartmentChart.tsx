import React, { useMemo } from 'react';
import { Building2 } from 'lucide-react';

export interface DepartmentMetricItem {
  department: string;
  openPositions: number;
  hiredCount: number;
  totalApplications: number;
}

interface RecruitmentDepartmentChartProps {
  departments?: DepartmentMetricItem[];
  isLoading?: boolean;
}

const DEFAULT_DEPARTMENTS: DepartmentMetricItem[] = [
  { department: 'Engineering', openPositions: 18, hiredCount: 14, totalApplications: 450 },
  { department: 'Product & Design', openPositions: 8, hiredCount: 6, totalApplications: 210 },
  { department: 'Sales & Marketing', openPositions: 12, hiredCount: 9, totalApplications: 310 },
  { department: 'Operations & Logistics', openPositions: 6, hiredCount: 5, totalApplications: 140 },
  { department: 'HR & People', openPositions: 4, hiredCount: 3, totalApplications: 95 },
  { department: 'Finance & Legal', openPositions: 3, hiredCount: 2, totalApplications: 65 },
];

export const RecruitmentDepartmentChart: React.FC<RecruitmentDepartmentChartProps> = ({
  departments,
}) => {
  const deptList = useMemo(
    () => (departments && departments.length > 0 ? departments : DEFAULT_DEPARTMENTS),
    [departments]
  );

  const maxPositions = useMemo(
    () => Math.max(...deptList.map((d) => d.openPositions + d.hiredCount), 1),
    [deptList]
  );

  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-xl p-5 shadow-xs flex flex-col justify-between">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Building2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span>Recruitment by Department</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
            Active open positions and successful hires by division
          </p>
        </div>
        <span className="text-[11px] font-semibold text-slate-600 dark:text-zinc-400 bg-slate-100 dark:bg-zinc-800 px-2.5 py-1 rounded-full">
          {deptList.length} Depts
        </span>
      </div>

      <div className="space-y-3.5 my-auto pt-3">
        {deptList.map((dept) => {
          const totalReqs = dept.openPositions + dept.hiredCount;
          const openPercent = Math.round((dept.openPositions / maxPositions) * 100);
          const hiredPercent = Math.round((dept.hiredCount / maxPositions) * 100);

          return (
            <div key={dept.department} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800 dark:text-zinc-200 truncate max-w-[180px]">
                  {dept.department}
                </span>
                <div className="flex items-center gap-2 text-[11px]">
                  <span className="text-teal-600 dark:text-teal-400 font-bold">
                    {dept.openPositions} open
                  </span>
                  <span className="text-slate-300 dark:text-zinc-700">|</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                    {dept.hiredCount} hired
                  </span>
                </div>
              </div>

              {/* Stacked / Dual Bar */}
              <div className="w-full bg-slate-100 dark:bg-zinc-800 h-2.5 rounded-full overflow-hidden flex items-center">
                <div
                  className="h-full bg-teal-500 rounded-l-full transition-all duration-500"
                  style={{ width: `${openPercent}%` }}
                  title={`${dept.openPositions} Open Positions`}
                />
                <div
                  className="h-full bg-emerald-500 rounded-r-full transition-all duration-500"
                  style={{ width: `${hiredPercent}%` }}
                  title={`${dept.hiredCount} Hired`}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-3 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-zinc-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-500 inline-block" />
            <span>Open Positions</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
            <span>Hired</span>
          </span>
        </div>
        <span className="font-medium text-slate-400">Monthly Targets</span>
      </div>
    </div>
  );
};

