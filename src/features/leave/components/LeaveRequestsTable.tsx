import React from 'react';
import {
  Palmtree,
  CheckCircle2,
  XCircle,
  Ban,
  CalendarDays,
  User,
} from 'lucide-react';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { SkeletonListItem } from '@/shared/ui/Skeleton';
import { cn } from '@/shared/lib/utils';
import type { LeaveRequest, LeaveStatus } from '../types/leave.types';

interface LeaveRequestsTableProps {
  requests: LeaveRequest[];
  isLoading: boolean;
  isActionLoading: boolean;
  onReview: (request: LeaveRequest) => void;
  onCancel: (request: LeaveRequest) => void;
  showEmployeeColumn: boolean;
}

const formatDateRange = (start: string, end: string): string => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
  if (start === end || startDate.getTime() === endDate.getTime()) {
    return startDate.toLocaleDateString('en-IN', { ...opts, year: 'numeric' });
  }
  return `${startDate.toLocaleDateString('en-IN', opts)} – ${endDate.toLocaleDateString('en-IN', { ...opts, year: 'numeric' })}`;
};

const StatusBadge: React.FC<{ status: LeaveStatus }> = ({ status }) => {
  switch (status) {
    case 'APPROVED':
      return (
        <Badge variant="success" size="sm" className="font-semibold flex items-center gap-1 text-[11px]">
          <CheckCircle2 className="w-3 h-3" /> Approved
        </Badge>
      );
    case 'REJECTED':
      return (
        <Badge variant="danger" size="sm" className="font-semibold flex items-center gap-1 text-[11px]">
          <XCircle className="w-3 h-3" /> Rejected
        </Badge>
      );
    case 'CANCELLED':
      return (
        <Badge variant="slate" size="sm" className="font-semibold flex items-center gap-1 text-[11px]">
          <Ban className="w-3 h-3" /> Cancelled
        </Badge>
      );
    case 'PENDING':
    default:
      return (
        <Badge variant="warning" size="sm" className="font-semibold flex items-center gap-1 text-[11px]">
          <CalendarDays className="w-3 h-3" /> Pending
        </Badge>
      );
  }
};

export const LeaveRequestsTable: React.FC<LeaveRequestsTableProps> = ({
  requests,
  isLoading,
  isActionLoading,
  onReview,
  onCancel,
  showEmployeeColumn,
}) => {
  if (isLoading) {
    return (
      <div className="rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#171717] p-4 space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonListItem key={i} />
        ))}
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 dark:border-zinc-800 bg-white dark:bg-[#171717] p-12 text-center shadow-sm">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4">
          <Palmtree className="w-7 h-7" />
        </div>
        <h3 className="text-base font-semibold text-gray-900 dark:text-[#ececec]">
          No leave requests found
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-zinc-400 max-w-sm mx-auto">
          Try widening the filters, or submit a fresh leave application using the Apply Leave button.
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
              {showEmployeeColumn && <th className="px-4 py-3">Employee</th>}
              <th className="px-4 py-3">Leave Type</th>
              <th className="px-4 py-3">Dates</th>
              <th className="px-4 py-3">Days</th>
              <th className="px-4 py-3">Reason</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-zinc-800/80">
            {requests.map((request) => (
              <tr
                key={request.id}
                className="hover:bg-gray-50/80 dark:hover:bg-zinc-800/40 transition-colors"
              >
                {showEmployeeColumn && (
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
                        {request.employee?.avatarUrl ? (
                          <img
                            src={request.employee.avatarUrl}
                            alt={request.employee.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <User className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-[#ececec]">
                          {request.employee?.name}
                        </div>
                        <div className="text-[11px] text-gray-500 dark:text-zinc-400">
                          {request.employee?.department || request.employee?.email}
                        </div>
                      </div>
                    </div>
                  </td>
                )}
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: request.leaveType?.color || '#10B981' }}
                    />
                    <span className="font-medium text-gray-800 dark:text-zinc-200">
                      {request.leaveType?.name || 'Leave'}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3.5 text-gray-600 dark:text-zinc-400 whitespace-nowrap">
                  {formatDateRange(request.startDate, request.endDate)}
                </td>
                <td className="px-4 py-3.5 font-semibold text-gray-900 dark:text-[#ececec]">
                  {request.totalDays}
                  <span className="text-[11px] font-normal text-gray-400 dark:text-zinc-500 ml-1">
                    {request.totalDays === 1 ? 'day' : 'days'}
                  </span>
                </td>
                <td className="px-4 py-3.5 max-w-[220px]">
                  <p className="text-gray-600 dark:text-zinc-400 truncate" title={request.reason}>
                    {request.reason}
                  </p>
                </td>
                <td className="px-4 py-3.5">
                  <StatusBadge status={request.status} />
                </td>
                <td className="px-4 py-3.5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {request.status === 'PENDING' && showEmployeeColumn && (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={isActionLoading}
                        onClick={() => onReview(request)}
                        className="text-xs"
                      >
                        Review
                      </Button>
                    )}
                    {request.status === 'PENDING' && !showEmployeeColumn && (
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={isActionLoading}
                        onClick={() => onCancel(request)}
                        className={cn('text-xs text-rose-600 hover:text-rose-700 dark:text-rose-400')}
                      >
                        Cancel
                      </Button>
                    )}
                    {request.status !== 'PENDING' && (
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={isActionLoading}
                        onClick={() => onReview(request)}
                        className="text-xs text-gray-500 hover:text-gray-700 dark:text-zinc-400"
                      >
                        Details
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaveRequestsTable;
