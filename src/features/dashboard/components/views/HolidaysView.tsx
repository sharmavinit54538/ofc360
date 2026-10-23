/**
 * @file HolidaysView.tsx
 * @description Live view for Company Holidays and Public Observances.
 * Renders the annual official holiday calendar from the attendance service.
 */

import React, { useMemo, useState } from 'react';
import {
  Palmtree,
  Calendar,
  Search,
  CalendarDays,
} from 'lucide-react';
import { Badge } from '@/shared/ui/Badge';
import { SkeletonListItem } from '@/shared/ui/Skeleton';
import { useGetHolidaysQuery } from '@/features/attendance/api/attendanceApi';

const formatHolidayDate = (dateStr: string): string =>
  new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

export const HolidaysView: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState(String(currentYear));

  const { data: holidays, isLoading } = useGetHolidaysQuery({ year: Number(selectedYear) });

  const filteredHolidays = useMemo(() => {
    const items = [...(holidays || [])].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    const query = searchTerm.trim().toLowerCase();
    if (!query) return items;
    return items.filter((holiday) => holiday.name.toLowerCase().includes(query));
  }, [holidays, searchTerm]);

  const optionalCount = (holidays || []).filter((h) => h.isOptional).length;

  // The upcoming holiday marker is always derived from the live API payload
  const upcomingHoliday = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return (holidays || [])
      .filter((h) => new Date(h.date) >= today)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
  }, [holidays]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
              <Palmtree className="w-3 h-3 text-brand-500" />
              Company Calendar
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-[#ececec] mt-1">
            Company Holidays & Observances
          </h1>
          <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">
            Official paid holidays, statutory non-working days, and optional floating leave entitlements.
          </p>
        </div>
      </div>

      {/* Metric Cards — derived from the live holiday payload */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-gray-500 dark:text-zinc-400 tracking-wider">
              Total Holidays ({selectedYear})
            </span>
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
              <Palmtree className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-[#ececec] mt-2">
            {isLoading ? '—' : `${holidays?.length ?? 0} Days`}
          </div>
          <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
            Published office closures for the year
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-gray-500 dark:text-zinc-400 tracking-wider">
              Floating Holidays
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              <CalendarDays className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-[#ececec] mt-2">
            {isLoading ? '—' : `${optionalCount} Days`}
          </div>
          <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
            Employee-choice optional observances
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-gray-500 dark:text-zinc-400 tracking-wider">
              Upcoming Holiday
            </span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg font-bold text-gray-900 dark:text-[#ececec] mt-2 truncate">
            {isLoading ? '—' : upcomingHoliday?.name || 'None scheduled'}
          </div>
          <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
            {upcomingHoliday
              ? `${formatHolidayDate(upcomingHoliday.date)} • ${upcomingHoliday.day}`
              : `No remaining holidays in ${selectedYear}`}
          </p>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search holidays by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs bg-gray-50 dark:bg-zinc-900/70 border border-gray-200 dark:border-zinc-800 text-gray-900 dark:text-[#ececec] placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-3 py-1.5 rounded-xl text-xs border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-900 dark:text-[#ececec] focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
            {[currentYear - 1, currentYear, currentYear + 1].map((y) => (
              <option key={y} value={String(y)}>
                Year {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Live holiday calendar */}
      <div className="rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#171717] overflow-hidden shadow-sm">
        <div className="p-4 md:p-6 border-b border-gray-200 dark:border-zinc-800">
          <h2 className="text-lg font-bold text-gray-900 dark:text-[#ececec] flex items-center gap-2">
            <Palmtree className="w-5 h-5 text-emerald-600" />
            {selectedYear} Holiday Calendar
          </h2>
          <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
            Holidays synchronise with payroll attendance calculations and employee leave calendars
          </p>
        </div>

        {isLoading ? (
          <div className="p-4 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonListItem key={i} />
            ))}
          </div>
        ) : filteredHolidays.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4">
              <Palmtree className="w-7 h-7" />
            </div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-[#ececec]">
              No holidays found for {selectedYear}
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-zinc-400 max-w-sm mx-auto">
              {searchTerm
                ? 'Try a different search term or switch the selected year.'
                : `The organization has not published any observances for ${selectedYear} yet.`}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-zinc-800/80">
            {filteredHolidays.map((holiday) => (
              <div
                key={holiday.id}
                className="px-4 md:px-6 py-3.5 flex items-center gap-4 hover:bg-gray-50/80 dark:hover:bg-zinc-800/40 transition-colors"
              >
                <div className="w-14 shrink-0 text-center rounded-xl bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-200/60 dark:border-emerald-800/50 py-1.5">
                  <div className="text-base font-extrabold text-emerald-700 dark:text-emerald-300 leading-tight">
                    {new Date(holiday.date).getDate()}
                  </div>
                  <div className="text-[10px] font-semibold uppercase text-emerald-600/80 dark:text-emerald-400/80">
                    {new Date(holiday.date).toLocaleDateString('en-IN', { month: 'short' })}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-gray-900 dark:text-[#ececec] truncate">
                    {holiday.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-zinc-400">
                    {holiday.day} • {formatHolidayDate(holiday.date)}
                  </div>
                </div>
                <Badge
                  variant={holiday.isOptional ? 'brand' : 'slate'}
                  size="sm"
                  className="font-semibold text-[11px] shrink-0"
                >
                  {holiday.isOptional ? 'Floating' : 'Gazetted'}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HolidaysView;
