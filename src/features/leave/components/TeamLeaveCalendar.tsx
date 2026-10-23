import React, { useMemo } from 'react';
import { Users, Palmtree } from 'lucide-react';
import { Skeleton } from '@/shared/ui/Skeleton';
import { cn } from '@/shared/lib/utils';
import { useGetLeaveCalendarQuery } from '../api/leaveApi';

const formatDay = (dateStr: string): string =>
  new Date(dateStr).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });

export const TeamLeaveCalendar: React.FC = () => {
  // Fetch who's out over the next 14 days
  const range = useMemo(() => {
    const start = new Date();
    const end = new Date();
    end.setDate(end.getDate() + 14);
    return {
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0],
    };
  }, []);

  const { data: calendar, isLoading } = useGetLeaveCalendarQuery(range);

  // Group occupancy records by date for a compact strip view
  const days = useMemo(() => {
    const items = calendar?.items || [];
    const grouped: Record<string, typeof items> = {};
    for (const item of items) {
      if (!grouped[item.date]) grouped[item.date] = [];
      grouped[item.date].push(item);
    }
    return Object.entries(grouped)
      .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
      .slice(0, 14);
  }, [calendar?.items]);

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#171717] p-5 space-y-3">
        <Skeleton className="h-4 w-40" />
        <div className="flex gap-3 overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-32 shrink-0" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#171717] p-5 shadow-sm space-y-3">
      <div className="flex items-center gap-2">
        <Users className="w-4 h-4 text-violet-600 dark:text-violet-400" />
        <h2 className="text-sm font-bold text-gray-900 dark:text-[#ececec]">
          Who's Out — Next 14 Days
        </h2>
      </div>

      {days.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 dark:border-zinc-800 p-6 text-center">
          <Palmtree className="w-6 h-6 text-gray-300 dark:text-zinc-600 mx-auto mb-2" />
          <p className="text-xs text-gray-500 dark:text-zinc-400">
            No approved team leaves in the upcoming two weeks. Full strength ahead.
          </p>
        </div>
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {days.map(([date, items]) => (
            <div
              key={date}
              className="min-w-[150px] shrink-0 p-3 rounded-xl bg-gray-50 dark:bg-zinc-900/60 border border-gray-100 dark:border-zinc-800"
            >
              <div className="text-[11px] font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wide">
                {formatDay(date)}
              </div>
              <div className="mt-2 space-y-1.5">
                {items.slice(0, 3).map((item, idx) => (
                  <div key={`${item.employee?.id}-${idx}`} className="flex items-center gap-1.5">
                    <span
                      className={cn(
                        'w-1.5 h-1.5 rounded-full shrink-0',
                        item.status === 'PENDING' ? 'bg-amber-500' : 'bg-emerald-500'
                      )}
                      style={item.status === 'APPROVED' ? { backgroundColor: item.leaveType?.color || '#10B981' } : undefined}
                    />
                    <span className="text-xs text-gray-700 dark:text-zinc-300 truncate">
                      {item.employee?.name}
                    </span>
                  </div>
                ))}
                {items.length > 3 && (
                  <div className="text-[10px] text-gray-400 dark:text-zinc-500">
                    +{items.length - 3} more
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeamLeaveCalendar;
