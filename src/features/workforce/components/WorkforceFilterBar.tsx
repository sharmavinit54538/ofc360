import React from 'react';
import { Search, RefreshCw, Building2, MapPin } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { cn } from '@/shared/lib/utils';
import type { DepartmentItem, EmployeeStatus, EmploymentType } from '../types/workforce.types';

interface WorkforceFilterBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  departmentFilter: string;
  onDepartmentChange: (value: string) => void;
  departments: DepartmentItem[];
  employmentTypeFilter: EmploymentType | 'ALL';
  onEmploymentTypeChange: (value: EmploymentType | 'ALL') => void;
  statusFilter: EmployeeStatus | 'ALL';
  onStatusChange: (value: EmployeeStatus | 'ALL') => void;
  locationFilter: string;
  onLocationChange: (value: string) => void;
  locations: string[];
  onResetFilters: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

const STATUS_OPTIONS: { id: EmployeeStatus | 'ALL'; label: string }[] = [
  { id: 'ALL', label: 'All' },
  { id: 'ACTIVE', label: 'Active' },
  { id: 'PROBATION', label: 'Probation' },
  { id: 'NOTICE_PERIOD', label: 'Notice' },
  { id: 'SUSPENDED', label: 'Suspended' },
  { id: 'INACTIVE', label: 'Inactive' },
];

const EMPLOYMENT_TYPE_OPTIONS: { id: EmploymentType | 'ALL'; label: string }[] = [
  { id: 'ALL', label: 'All Types' },
  { id: 'FULL_TIME', label: 'Full Time' },
  { id: 'PART_TIME', label: 'Part Time' },
  { id: 'CONTRACT', label: 'Contract' },
  { id: 'INTERN', label: 'Intern' },
];

export const WorkforceFilterBar: React.FC<WorkforceFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  departmentFilter,
  onDepartmentChange,
  departments,
  employmentTypeFilter,
  onEmploymentTypeChange,
  statusFilter,
  onStatusChange,
  locationFilter,
  onLocationChange,
  locations,
  onResetFilters,
  onRefresh,
  isRefreshing,
}) => {
  return (
    <div className="p-4 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 shadow-sm space-y-3">
      {/* Row 1: search + department + type + location + actions */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-3">
        <div className="relative flex-1 min-w-0">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search employees by name, code, or email..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs bg-gray-50 dark:bg-zinc-900/70 border border-gray-200 dark:border-zinc-800 text-gray-900 dark:text-[#ececec] placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>

        <div className="relative shrink-0">
          <Building2 className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <select
            value={departmentFilter}
            onChange={(e) => onDepartmentChange(e.target.value)}
            className="pl-8 pr-3 py-1.5 rounded-xl text-xs border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-900 dark:text-[#ececec] focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
            <option value="ALL">All Departments</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>

        <select
          value={employmentTypeFilter}
          onChange={(e) => onEmploymentTypeChange(e.target.value as EmploymentType | 'ALL')}
          className="px-3 py-1.5 rounded-xl text-xs border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-900 dark:text-[#ececec] focus:outline-none focus:ring-1 focus:ring-brand-500 shrink-0"
        >
          {EMPLOYMENT_TYPE_OPTIONS.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.label}
            </option>
          ))}
        </select>

        <div className="relative shrink-0">
          <MapPin className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <select
            value={locationFilter}
            onChange={(e) => onLocationChange(e.target.value)}
            className="pl-8 pr-3 py-1.5 rounded-xl text-xs border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-900 dark:text-[#ececec] focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
            <option value="ALL">All Locations</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button variant="ghost" size="sm" onClick={onResetFilters} className="text-xs">
            Reset
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="text-xs"
          >
            <RefreshCw className={cn('w-3.5 h-3.5 mr-1', isRefreshing && 'animate-spin')} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Row 2: status tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {STATUS_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => onStatusChange(opt.id)}
            className={cn(
              'px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all',
              statusFilter === opt.id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white'
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default WorkforceFilterBar;
