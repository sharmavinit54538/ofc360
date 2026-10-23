/**
 * @file RostersView.tsx
 * @description Live view for Employee Shift Rosters and Monthly Schedules.
 * Renders the published duty roster calendar with month and department navigation.
 */

import React, { useMemo, useState } from 'react';
import {
  ScrollText,
  Users,
  Building2,
  CalendarRange,
} from 'lucide-react';
import { useGetRostersQuery } from '@/features/attendance/api/attendanceApi';
import { RosterCalendarView } from '@/features/attendance/components/RosterCalendarView';

export const RostersView: React.FC = () => {
  const [monthOffset, setMonthOffset] = useState(0);
  const [departmentFilter, setDepartmentFilter] = useState('ALL');

  const { month, year, periodLabel } = useMemo(() => {
    const base = new Date();
    const target = new Date(base.getFullYear(), base.getMonth() + monthOffset, 1);
    return {
      month: target.getMonth() + 1,
      year: target.getFullYear(),
      periodLabel: target.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }),
    };
  }, [monthOffset]);

  const { data: rosters, isLoading } = useGetRostersQuery({ month, year });
  const items = rosters?.items || [];

  // Department choices are always derived from the live roster payload
  const departments = useMemo(() => {
    const set = new Set<string>();
    for (const item of items) {
      const dept = item.department || item.employee.department;
      if (dept) set.add(dept);
    }
    return Array.from(set).sort();
  }, [items]);

  const uniqueEmployeeCount = useMemo(
    () => new Set(items.map((item) => item.employee.id)).size,
    [items]
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
              <ScrollText className="w-3 h-3 text-brand-500" />
              Roster Planning
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-[#ececec] mt-1">
            Workforce Duty Rosters
          </h1>
          <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">
            Monthly department rotation rosters and published shift coverage plans.
          </p>
        </div>
      </div>

      {/* Metric Cards — derived from the live roster payload */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-gray-500 dark:text-zinc-400 tracking-wider">
              Duty Assignments
            </span>
            <div className="p-2 rounded-xl bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 border border-violet-200 dark:border-violet-800">
              <CalendarRange className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-[#ececec] mt-2">
            {isLoading ? '—' : items.length}
          </div>
          <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
            Published cells for {periodLabel}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-gray-500 dark:text-zinc-400 tracking-wider">
              Employees Scheduled
            </span>
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-[#ececec] mt-2">
            {isLoading ? '—' : uniqueEmployeeCount}
          </div>
          <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
            Distinct staff on the {periodLabel} roster
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-gray-500 dark:text-zinc-400 tracking-wider">
              Departments Covered
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-[#ececec] mt-2">
            {isLoading ? '—' : departments.length}
          </div>
          <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
            Units with at least one assigned duty
          </p>
        </div>
      </div>

      {/* Roster Controls Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="inline-flex p-1 rounded-xl bg-gray-100 dark:bg-zinc-800 border border-gray-200/60 dark:border-zinc-700/60 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setMonthOffset((prev) => prev - 1)}
            className={`px-3 py-1 rounded-lg transition-all ${
              monthOffset < 0
                ? 'bg-white dark:bg-zinc-900 text-gray-900 dark:text-white shadow-2xs'
                : 'text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Previous Month
          </button>
          <button
            type="button"
            onClick={() => setMonthOffset(0)}
            className={`px-3 py-1 rounded-lg transition-all ${
              monthOffset === 0
                ? 'bg-white dark:bg-zinc-900 text-gray-900 dark:text-white shadow-2xs'
                : 'text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Current Month
          </button>
          <button
            type="button"
            onClick={() => setMonthOffset((prev) => prev + 1)}
            className={`px-3 py-1 rounded-lg transition-all ${
              monthOffset > 0
                ? 'bg-white dark:bg-zinc-900 text-gray-900 dark:text-white shadow-2xs'
                : 'text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Next Month
          </button>
        </div>

        <select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          className="px-3 py-1.5 rounded-xl text-xs border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-900 dark:text-[#ececec] focus:outline-none focus:ring-1 focus:ring-brand-500"
        >
          <option value="ALL">All Departments</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </div>

      {/* Live roster calendar */}
      <RosterCalendarView
        params={{ month, year, departmentId: departmentFilter !== 'ALL' ? departmentFilter : undefined }}
      />
    </div>
  );
};

export default RostersView;
