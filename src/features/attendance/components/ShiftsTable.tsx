import React from 'react';
import { Clock, Plus, Moon, Pencil } from 'lucide-react';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { SkeletonListItem } from '@/shared/ui/Skeleton';
import type { ShiftItem } from '../types/attendance.types';

interface ShiftsTableProps {
  shifts: ShiftItem[];
  isLoading: boolean;
  onCreateShift: () => void;
  onEditShift: (shift: ShiftItem) => void;
}

const computeDuration = (start: string, end: string, isNight: boolean): string => {
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  if (Number.isNaN(sh) || Number.isNaN(eh)) return '—';
  let mins = eh * 60 + em - (sh * 60 + sm);
  if (isNight && mins <= 0) mins += 24 * 60;
  return `${Math.floor(mins / 60)}h ${String(mins % 60).padStart(2, '0')}m`;
};

export const ShiftsTable: React.FC<ShiftsTableProps> = ({
  shifts,
  isLoading,
  onCreateShift,
  onEditShift,
}) => {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#171717] overflow-hidden shadow-sm">
      <div className="p-4 md:p-6 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-[#ececec] flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-600" />
            Configured Shifts
          </h2>
          <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
            Live definitions synced with the attendance engine
          </p>
        </div>
        <Button
          size="sm"
          onClick={onCreateShift}
          className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          <Plus className="w-3.5 h-3.5 mr-1" />
          Add Shift
        </Button>
      </div>

      {isLoading ? (
        <div className="p-4 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonListItem key={i} />
          ))}
        </div>
      ) : shifts.length === 0 ? (
        <div className="p-12 text-center">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4">
            <Clock className="w-7 h-7" />
          </div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-[#ececec]">
            No shifts configured yet
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-zinc-400 max-w-sm mx-auto">
            Create your first operational shift to start assigning rosters and tracking attendance.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs md:text-sm">
            <thead className="bg-gray-50 dark:bg-zinc-800/60 text-gray-600 dark:text-zinc-400 text-xs uppercase tracking-wider font-semibold border-b border-gray-200 dark:border-zinc-800">
              <tr>
                <th className="px-4 py-3">Shift</th>
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3">Timings</th>
                <th className="px-4 py-3">Duration</th>
                <th className="px-4 py-3">Grace</th>
                <th className="px-4 py-3">Min Hours</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-zinc-800/80">
              {shifts.map((shift) => (
                <tr key={shift.id} className="hover:bg-gray-50/80 dark:hover:bg-zinc-800/40 transition-colors">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2 font-semibold text-gray-900 dark:text-[#ececec]">
                      {shift.name}
                      {shift.isNightShift && (
                        <Moon className="w-3.5 h-3.5 text-indigo-500" aria-label="Night shift" />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="font-mono text-xs text-gray-600 dark:text-zinc-400">
                      {shift.code}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-gray-700 dark:text-zinc-300 whitespace-nowrap">
                    {shift.startTime} – {shift.endTime}
                  </td>
                  <td className="px-4 py-3.5 text-gray-700 dark:text-zinc-300">
                    {computeDuration(shift.startTime, shift.endTime, shift.isNightShift)}
                  </td>
                  <td className="px-4 py-3.5 text-gray-700 dark:text-zinc-300">
                    {shift.gracePeriodMinutes} mins
                  </td>
                  <td className="px-4 py-3.5 text-gray-700 dark:text-zinc-300">
                    {shift.halfDayMinimumHours}h / {shift.fullDayMinimumHours}h
                  </td>
                  <td className="px-4 py-3.5">
                    <Badge
                      variant={shift.isActive ? 'success' : 'slate'}
                      size="sm"
                      className="font-semibold text-[11px]"
                    >
                      {shift.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onEditShift(shift)}
                      className="text-xs text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                    >
                      <Pencil className="w-3.5 h-3.5 mr-1" />
                      Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ShiftsTable;
