import React from 'react';
import {
  CalendarDays,
  User,
  CheckCircle2,
  XCircle,
  Palmtree,
  Hourglass,
  Sun,
  PartyPopper,
  FileEdit,
} from 'lucide-react';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { SkeletonListItem } from '@/shared/ui/Skeleton';
import type { AttendanceRecord, AttendanceStatus, WorkMode } from '../types/attendance.types';

interface AttendanceRecordsTableProps {
  records: AttendanceRecord[];
  isLoading: boolean;
  onRegularize: (record: AttendanceRecord) => void;
  showEmployeeColumn: boolean;
}

const formatTime = (iso?: string): string => {
  if (!iso) return '—';
  return new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
};

const formatDate = (dateStr: string): string =>
  new Date(dateStr).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });

const formatHours = (hours: number): string => {
  if (!hours || hours <= 0) return '—';
  const whole = Math.floor(hours);
  const mins = Math.round((hours - whole) * 60);
  return `${whole}h ${String(mins).padStart(2, '0')}m`;
};

const StatusBadge: React.FC<{ status: AttendanceStatus; isLate: boolean }> = ({ status, isLate }) => {
  switch (status) {
    case 'PRESENT':
      return (
        <span className="inline-flex items-center gap-1.5">
          <Badge variant="success" size="sm" className="font-semibold flex items-center gap-1 text-[11px]">
            <CheckCircle2 className="w-3 h-3" /> Present
          </Badge>
          {isLate && (
            <Badge variant="warning" size="sm" className="font-semibold text-[11px]">
              Late
            </Badge>
          )}
        </span>
      );
    case 'ABSENT':
      return (
        <Badge variant="danger" size="sm" className="font-semibold flex items-center gap-1 text-[11px]">
          <XCircle className="w-3 h-3" /> Absent
        </Badge>
      );
    case 'HALF_DAY':
      return (
        <Badge variant="warning" size="sm" className="font-semibold flex items-center gap-1 text-[11px]">
          <Hourglass className="w-3 h-3" /> Half Day
        </Badge>
      );
    case 'ON_LEAVE':
      return (
        <Badge variant="brand" size="sm" className="font-semibold flex items-center gap-1 text-[11px]">
          <Palmtree className="w-3 h-3" /> On Leave
        </Badge>
      );
    case 'WEEK_OFF':
      return (
        <Badge variant="slate" size="sm" className="font-semibold flex items-center gap-1 text-[11px]">
          <Sun className="w-3 h-3" /> Week Off
        </Badge>
      );
    case 'HOLIDAY':
      return (
        <Badge variant="slate" size="sm" className="font-semibold flex items-center gap-1 text-[11px]">
          <PartyPopper className="w-3 h-3" /> Holiday
        </Badge>
      );
    default:
      return null;
  }
};

const WORK_MODE_LABELS: Record<string, string> = {
  OFFICE: 'Office',
  WFM: 'WFH',
  FIELD: 'Field',
  REMOTE: 'Remote',
  HYBRID: 'Hybrid',
};

export const AttendanceRecordsTable: React.FC<AttendanceRecordsTableProps> = ({
  records,
  isLoading,
  onRegularize,
  showEmployeeColumn,
}) => {
  if (isLoading) {
    return (
      <div className="rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#171717] p-4 space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonListItem key={i} />
        ))}
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 dark:border-zinc-800 bg-white dark:bg-[#171717] p-12 text-center shadow-sm">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
          <CalendarDays className="w-7 h-7" />
        </div>
        <h3 className="text-base font-semibold text-gray-900 dark:text-[#ececec]">
          No attendance records found
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-zinc-400 max-w-sm mx-auto">
          Try widening the date range or clearing filters to see logged punches and shift statuses.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#171717] overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs md:text-sm">
          <thead className="bg-gray-50 dark:bg-zinc-800/60 text-gray-600 dark:text-zinc-400 text-xs uppercase tracking-wider font-semibold border-b border-gray-200 dark:border-zinc-800">
            <tr>
              <th className="px-4 py-3">Date</th>
              {showEmployeeColumn && <th className="px-4 py-3">Employee</th>}
              <th className="px-4 py-3">Shift</th>
              <th className="px-4 py-3">Punch In</th>
              <th className="px-4 py-3">Punch Out</th>
              <th className="px-4 py-3">Total Hours</th>
              <th className="px-4 py-3">Mode</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-zinc-800/80">
            {records.map((record) => (
              <tr key={record.id} className="hover:bg-gray-50/80 dark:hover:bg-zinc-800/40 transition-colors">
                <td className="px-4 py-3.5 font-medium text-gray-800 dark:text-zinc-200 whitespace-nowrap">
                  {formatDate(record.date)}
                </td>
                {showEmployeeColumn && (
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs">
                        {record.employee?.avatarUrl ? (
                          <img
                            src={record.employee.avatarUrl}
                            alt={record.employee.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <User className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-[#ececec]">
                          {record.employee?.name}
                        </div>
                        <div className="text-[11px] text-gray-500 dark:text-zinc-400">
                          {record.employee?.department || record.employee?.designation}
                        </div>
                      </div>
                    </div>
                  </td>
                )}
                <td className="px-4 py-3.5 text-gray-600 dark:text-zinc-400 whitespace-nowrap">
                  <div className="font-medium text-gray-800 dark:text-zinc-200">{record.shift?.name || '—'}</div>
                  {record.shift?.timings && (
                    <div className="text-[11px] text-gray-400 dark:text-zinc-500">{record.shift.timings}</div>
                  )}
                </td>
                <td className="px-4 py-3.5 text-gray-700 dark:text-zinc-300">{formatTime(record.punchIn)}</td>
                <td className="px-4 py-3.5 text-gray-700 dark:text-zinc-300">{formatTime(record.punchOut)}</td>
                <td className="px-4 py-3.5 font-semibold text-gray-900 dark:text-[#ececec]">
                  {formatHours(record.totalHours)}
                </td>
                <td className="px-4 py-3.5 text-gray-600 dark:text-zinc-400">
                  {WORK_MODE_LABELS[record.workMode] || record.workMode}
                </td>
                <td className="px-4 py-3.5">
                  <StatusBadge status={record.status} isLate={record.isLate} />
                </td>
                <td className="px-4 py-3.5 text-right">
                  {!record.isRegularized && (record.status === 'ABSENT' || !record.punchIn || !record.punchOut) && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onRegularize(record)}
                      className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400"
                    >
                      <FileEdit className="w-3.5 h-3.5 mr-1" />
                      Regularize
                    </Button>
                  )}
                  {record.isRegularized && (
                    <span className="text-[11px] text-gray-400 dark:text-zinc-500">Regularized</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceRecordsTable;
