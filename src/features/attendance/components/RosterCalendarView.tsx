import React, { useMemo } from 'react';
import { ScrollText, Calendar } from 'lucide-react';
import { Skeleton } from '@/shared/ui/Skeleton';
import { useGetRostersQuery } from '../api/attendanceApi';
import type { RosterQueryParams } from '../types/attendance.types';

interface RosterCalendarViewProps {
  params: RosterQueryParams;
}

const formatDayHeader = (dateStr: string): string =>
  new Date(dateStr).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });

const SHIFT_COLORS = [
  'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
  'bg-violet-500/10 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-800',
  'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
  'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
  'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
  'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800',
];

export const RosterCalendarView: React.FC<RosterCalendarViewProps> = ({ params }) => {
  const { data: rosters, isLoading } = useGetRostersQuery({
    month: params.month,
    year: params.year,
  });

  // Group roster cells by date, build a stable color map per shift name
  const { days, shiftColorMap } = useMemo(() => {
    const items = (rosters?.items || []).filter(
      (item) =>
        !params.departmentId ||
        item.department === params.departmentId ||
        item.employee?.department === params.departmentId
    );
    const grouped: Record<string, typeof items> = {};
    const colorMap: Record<string, string> = {};
    let colorIdx = 0;

    for (const item of items) {
      if (!grouped[item.date]) grouped[item.date] = [];
      grouped[item.date].push(item);

      const shiftName = item.shift?.name || 'Unassigned';
      if (!colorMap[shiftName]) {
        colorMap[shiftName] = SHIFT_COLORS[colorIdx % SHIFT_COLORS.length];
        colorIdx += 1;
      }
    }

    const sorted = Object.entries(grouped).sort(
      ([a], [b]) => new Date(a).getTime() - new Date(b).getTime()
    );

    return { days: sorted, shiftColorMap: colorMap };
  }, [rosters?.items]);

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#171717] p-5 space-y-3">
        <Skeleton className="h-4 w-48" />
        <div className="flex gap-3 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-44 shrink-0" />
          ))}
        </div>
      </div>
    );
  }

  if (days.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 dark:border-zinc-800 bg-white dark:bg-[#171717] p-12 text-center shadow-sm">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-violet-500/10 dark:bg-violet-500/20 flex items-center justify-center text-violet-600 dark:text-violet-400 mb-4">
          <ScrollText className="w-7 h-7" />
        </div>
        <h3 className="text-base font-semibold text-gray-900 dark:text-[#ececec]">
          No duty rosters published for this period
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-zinc-400 max-w-sm mx-auto">
          Departmental duty allocations and shift rotations appear here once schedules are assigned.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#171717] p-5 shadow-sm space-y-4">
      {/* Legend */}
      <div className="flex flex-wrap items-center gap-3 text-[11px] font-medium text-gray-500 dark:text-zinc-400">
        <span className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" /> Shift Legend:
        </span>
        {Object.entries(shiftColorMap).map(([name, colorClass]) => (
          <span key={name} className={`px-2 py-0.5 rounded-md border ${colorClass}`}>
            {name}
          </span>
        ))}
      </div>

      {/* Calendar strip */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {days.map(([date, items]) => (
          <div
            key={date}
            className="min-w-[190px] shrink-0 rounded-xl bg-gray-50 dark:bg-zinc-900/60 border border-gray-100 dark:border-zinc-800 p-3"
          >
            <div className="text-[11px] font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wide pb-2 border-b border-gray-100 dark:border-zinc-800">
              {formatDayHeader(date)}
              <span className="ml-1.5 text-gray-400 dark:text-zinc-500 normal-case">
                ({items.length})
              </span>
            </div>
            <div className="mt-2 space-y-1.5 max-h-56 overflow-y-auto">
              {items.map((item) => (
                <div
                  key={item.id}
                  className={`px-2 py-1.5 rounded-lg border text-xs ${shiftColorMap[item.shift?.name || 'Unassigned']}`}
                >
                  <div className="font-semibold truncate">{item.employee?.name}</div>
                  <div className="text-[10px] opacity-80 truncate">
                    {item.shift?.name}
                    {item.shift?.timings ? ` • ${item.shift.timings}` : ''}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RosterCalendarView;
