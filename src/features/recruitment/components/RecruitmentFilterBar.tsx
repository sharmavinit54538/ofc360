import React from 'react';
import { Search, RefreshCw, Building2, Briefcase, RotateCcw } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { cn } from '@/shared/lib/utils';
import type { DepartmentItem } from '@/features/workforce/types/workforce.types';
import type { CandidateStage, JobOpening } from '../types/recruitment.types';

interface RecruitmentFilterBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  departmentFilter: string;
  onDepartmentChange: (value: string) => void;
  departments: DepartmentItem[];
  jobFilter: string;
  onJobChange: (value: string) => void;
  jobs: JobOpening[];
  stageFilter: CandidateStage | 'ALL';
  onStageChange: (value: CandidateStage | 'ALL') => void;
  onResetFilters: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

const STAGE_OPTIONS: { id: CandidateStage | 'ALL'; label: string }[] = [
  { id: 'ALL', label: 'All Stages' },
  { id: 'APPLIED', label: 'Applied' },
  { id: 'SCREENING', label: 'Screening' },
  { id: 'INTERVIEW', label: 'Interview' },
  { id: 'OFFERED', label: 'Offered' },
  { id: 'HIRED', label: 'Hired' },
  { id: 'REJECTED', label: 'Rejected' },
];

const selectClass =
  'px-3 py-2 rounded-lg text-sm border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent';

export const RecruitmentFilterBar: React.FC<RecruitmentFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  departmentFilter,
  onDepartmentChange,
  departments,
  jobFilter,
  onJobChange,
  jobs,
  stageFilter,
  onStageChange,
  onResetFilters,
  onRefresh,
  isRefreshing,
}) => {
  return (
    <div className="px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-zinc-800 space-y-3">
      {/* Controls row */}
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search candidates or jobs..."
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            className="w-full pl-9 pr-3 py-2 rounded-lg text-sm border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="relative">
          <Building2 className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <select
            aria-label="Filter by department"
            value={departmentFilter}
            onChange={(e) => onDepartmentChange(e.target.value)}
            className={cn(selectClass, 'pl-8')}
          >
            <option value="">All Departments</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>

        <div className="relative">
          <Briefcase className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <select
            aria-label="Filter by job"
            value={jobFilter}
            onChange={(e) => onJobChange(e.target.value)}
            className={cn(selectClass, 'pl-8')}
          >
            <option value="">All Jobs</option>
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title}
              </option>
            ))}
          </select>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="sm" leftIcon={<RotateCcw className="w-3.5 h-3.5" />} onClick={onResetFilters}>
            Reset
          </Button>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<RefreshCw className={cn('w-3.5 h-3.5', isRefreshing && 'animate-spin')} />}
            onClick={onRefresh}
            disabled={isRefreshing}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Stage pills */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {STAGE_OPTIONS.map((opt) => {
          const active = stageFilter === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onStageChange(opt.id)}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-medium transition-all border',
                active
                  ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/25'
                  : 'bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 text-gray-600 dark:text-zinc-400 hover:border-blue-400 hover:text-blue-600'
              )}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default RecruitmentFilterBar;
