import React from 'react';
import { Building2, Search } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import type { DepartmentItem } from '@/features/workforce/types/workforce.types';
import type { PayrollScope } from '../types/payroll.types';

interface PayrollFilterBarProps {
  scope: PayrollScope;
  onScopeChange: (value: PayrollScope) => void;
  month: number;
  onMonthChange: (value: number) => void;
  year: number;
  onYearChange: (value: number) => void;
  departmentId: string;
  onDepartmentChange: (value: string) => void;
  departments: DepartmentItem[];
  status: string;
  onStatusChange: (value: string) => void;
  search: string;
  onSearchChange: (value: string) => void;
  onReset?: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

const selectClassName =
  'px-3 py-2 rounded-xl text-xs border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-900 dark:text-[#ececec] focus:outline-none focus:ring-2 focus:ring-indigo-500/30';

const statusOptions = [
  { value: 'ALL', label: 'All statuses' },
  { value: 'DRAFT', label: 'Draft' },
  { value: 'GENERATED', label: 'Generated' },
  { value: 'PAID', label: 'Paid' },
  { value: 'ON_HOLD', label: 'On hold' },
];

export const PayrollFilterBar: React.FC<PayrollFilterBarProps> = ({
  scope,
  onScopeChange,
  month,
  onMonthChange,
  year,
  onYearChange,
  departmentId,
  onDepartmentChange,
  departments,
  status,
  onStatusChange,
  search,
  onSearchChange,
}) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2020 + 2 }, (_, index) => currentYear + 1 - index);
  const months = Array.from({ length: 12 }, (_, index) => ({
    value: index + 1,
    label: new Intl.DateTimeFormat('en-IN', { month: 'long', timeZone: 'UTC' }).format(
      new Date(Date.UTC(2000, index, 1))
    ),
  }));

  return (
    <div className="p-4 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 shadow-sm space-y-4">
      <div className="flex flex-col xl:flex-row xl:items-center gap-3">
        <div className="inline-flex p-1 rounded-xl bg-gray-100 dark:bg-zinc-900 self-start" aria-label="Payslip scope">
          {(['MY', 'ALL'] as PayrollScope[]).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => onScopeChange(option)}
              aria-pressed={scope === option}
              className={cn(
                'px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors',
                scope === option
                  ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white'
              )}
            >
              {option === 'MY' ? 'My Payslips' : 'All Organization'}
            </button>
          ))}
        </div>

        <div className="relative flex-1 min-w-0">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search by employee name or code"
            aria-label="Search payslips"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-gray-50 dark:bg-zinc-900/70 border border-gray-200 dark:border-zinc-800 text-gray-900 dark:text-[#ececec] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            aria-label="Payroll month"
            value={month}
            onChange={(event) => onMonthChange(Number(event.target.value))}
            className={selectClassName}
          >
            {months.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          <select
            aria-label="Payroll year"
            value={year}
            onChange={(event) => onYearChange(Number(event.target.value))}
            className={selectClassName}
          >
            {years.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          <div className="relative">
            <Building2 className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <select
              aria-label="Filter by department"
              value={departmentId}
              onChange={(event) => onDepartmentChange(event.target.value)}
              className={cn(selectClassName, 'pl-8')}
            >
              <option value="">All Departments</option>
              {departments.map((department) => (
                <option key={department.id} value={department.id}>{department.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {statusOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onStatusChange(option.value)}
            aria-pressed={status === option.value}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors',
              status === option.value
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white'
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PayrollFilterBar;
