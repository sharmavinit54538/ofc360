/**
 * @file VisitorsTable.tsx
 * @description Enterprise visitor log data table featuring real-time status badges,
 * host approval quick toggles, check-in / check-out actions, printable badge triggers,
 * loading skeletons, and an empty state.
 */

import React from 'react';
import {
  UserCheck,
  LogOut,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  QrCode,
  FileCheck2,
  AlertTriangle,
  Building2,
  User,
  Plus,
  ShieldCheck,
  ShieldAlert,
} from 'lucide-react';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import type { Visitor, VisitorStatus, HostApprovalStatus } from '../types/visitors.types';

interface VisitorsTableProps {
  visitors: Visitor[];
  isLoading: boolean;
  onCheckIn: (visitor: Visitor) => void;
  onCheckOut: (visitor: Visitor) => void;
  onViewBadge: (visitor: Visitor) => void;
  onUpdateHostApproval: (visitor: Visitor, status: HostApprovalStatus) => void;
  onRegisterClick?: () => void;
  isActionLoading?: boolean;
}

export const VisitorsTable: React.FC<VisitorsTableProps> = ({
  visitors,
  isLoading,
  onCheckIn,
  onCheckOut,
  onViewBadge,
  onUpdateHostApproval,
  onRegisterClick,
  isActionLoading = false,
}) => {
  const getStatusBadge = (status: VisitorStatus, isOverstay?: boolean) => {
    switch (status) {
      case 'CHECKED_IN':
        return (
          <div className="flex flex-col gap-1 items-start">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Checked-In
            </span>
            {isOverstay && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 animate-pulse">
                <AlertTriangle className="w-2.5 h-2.5" />
                Overstayed
              </span>
            )}
          </div>
        );
      case 'CHECKED_OUT':
        return (
          <Badge variant="slate" size="sm" className="font-semibold flex items-center gap-1">
            <LogOut className="w-3 h-3" />
            Checked-Out
          </Badge>
        );
      case 'EXPECTED':
        return (
          <Badge variant="brand" size="sm" className="font-semibold flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            Expected
          </Badge>
        );
      case 'REJECTED':
        return (
          <Badge variant="danger" size="sm" className="font-semibold flex items-center gap-1">
            <XCircle className="w-3 h-3" />
            Rejected
          </Badge>
        );
      case 'CANCELLED':
      default:
        return (
          <Badge variant="slate" size="sm" className="font-semibold">
            Cancelled
          </Badge>
        );
    }
  };

  const getHostApprovalUI = (visitor: Visitor) => {
    switch (visitor.hostApprovalStatus) {
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            Approved
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-rose-600 dark:text-rose-400">
            <ShieldAlert className="w-3.5 h-3.5" />
            Denied
          </span>
        );
      case 'PENDING':
      default:
        return (
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded border border-amber-200/60 dark:border-amber-900/40">
              <Clock className="w-3 h-3" />
              Pending
            </span>
            <button
              type="button"
              disabled={isActionLoading}
              onClick={() => onUpdateHostApproval(visitor, 'APPROVED')}
              title="Quick Approve Host Visit"
              className="p-1 rounded-md text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              disabled={isActionLoading}
              onClick={() => onUpdateHostApproval(visitor, 'REJECTED')}
              title="Quick Reject Host Visit"
              className="p-1 rounded-md text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            >
              <XCircle className="w-4 h-4" />
            </button>
          </div>
        );
    }
  };

  const formatTimestamp = (isoString?: string) => {
    if (!isoString) return '—';
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    } catch {
      return isoString;
    }
  };

  // Skeleton Loading State
  if (isLoading) {
    return (
      <div className="rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#171717] overflow-hidden shadow-sm">
        <div className="p-4 border-b border-gray-200 dark:border-zinc-800 animate-pulse">
          <div className="h-4 w-44 bg-gray-200 dark:bg-zinc-800 rounded" />
        </div>
        <div className="divide-y divide-gray-100 dark:divide-zinc-800/80">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="p-4 flex items-center justify-between gap-4 animate-pulse">
              <div className="flex items-center gap-3 w-1/4">
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-zinc-800 shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-4 w-28 bg-gray-200 dark:bg-zinc-800 rounded" />
                  <div className="h-3 w-20 bg-gray-200 dark:bg-zinc-800 rounded" />
                </div>
              </div>
              <div className="h-4 w-32 bg-gray-200 dark:bg-zinc-800 rounded hidden sm:block" />
              <div className="h-4 w-24 bg-gray-200 dark:bg-zinc-800 rounded hidden md:block" />
              <div className="h-6 w-20 bg-gray-200 dark:bg-zinc-800 rounded-full" />
              <div className="h-8 w-24 bg-gray-200 dark:bg-zinc-800 rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Clean Zero-Mock Empty State
  if (!visitors || visitors.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 dark:border-zinc-800 bg-white dark:bg-[#171717] p-12 text-center shadow-sm">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-brand-50 dark:bg-brand-950/30 flex items-center justify-center text-brand-600 dark:text-brand-400 mb-4 border border-brand-200/50 dark:border-brand-900/30">
          <UserCheck className="w-7 h-7" />
        </div>
        <h3 className="text-base font-semibold text-gray-900 dark:text-[#ececec]">
          No Visitor Records Found
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-zinc-400 max-w-sm mx-auto">
          There are currently no visitor logs matching the selected filters. Pre-register upcoming guests or record a walk-in entry to begin logging.
        </p>
        {onRegisterClick && (
          <div className="mt-5">
            <Button
              variant="primary"
              size="sm"
              onClick={onRegisterClick}
              className="inline-flex items-center gap-2 rounded-xl"
            >
              <Plus className="w-4 h-4" />
              Register Visitor
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#171717] overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50/75 dark:bg-zinc-900/60 border-b border-gray-200 dark:border-zinc-800 text-[11px] uppercase tracking-wider font-semibold text-gray-500 dark:text-zinc-400">
            <tr>
              <th className="py-3.5 px-4">Visitor</th>
              <th className="py-3.5 px-4">Company & Purpose</th>
              <th className="py-3.5 px-4">Host Employee</th>
              <th className="py-3.5 px-4">Timeline</th>
              <th className="py-3.5 px-4">Compliance & Host</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-zinc-800/80 text-gray-700 dark:text-zinc-300">
            {visitors.map((visitor) => (
              <tr
                key={visitor.id}
                className="hover:bg-gray-50/50 dark:hover:bg-zinc-900/30 transition-colors"
              >
                {/* Visitor Identity */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-500/20 to-indigo-500/20 text-brand-600 dark:text-brand-400 font-bold flex items-center justify-center border border-brand-200/40 dark:border-brand-900/30 shrink-0">
                      {visitor.fullName
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()
                        .slice(0, 2) || 'VI'}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-[#ececec] flex items-center gap-2">
                        {visitor.fullName}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-zinc-400 flex items-center gap-2">
                        <span className="font-mono text-[11px] text-brand-600 dark:text-brand-400 font-medium">
                          {visitor.visitorCode || 'VIS-GUEST'}
                        </span>
                        <span>•</span>
                        <span>{visitor.phone}</span>
                      </div>
                    </div>
                  </div>
                </td>

                {/* Company & Purpose */}
                <td className="py-3.5 px-4">
                  <div className="font-medium text-gray-900 dark:text-[#ececec] flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-gray-400 dark:text-zinc-500 shrink-0" />
                    {visitor.company}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-zinc-400 truncate max-w-xs mt-0.5">
                    {visitor.purpose}
                  </div>
                </td>

                {/* Host Contact */}
                <td className="py-3.5 px-4">
                  <div className="font-medium text-gray-900 dark:text-[#ececec] flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-gray-400 dark:text-zinc-500 shrink-0" />
                    {visitor.hostName || visitor.hostEmployeeId}
                  </div>
                  {visitor.hostDepartment && (
                    <div className="text-xs text-gray-500 dark:text-zinc-400">
                      {visitor.hostDepartment}
                    </div>
                  )}
                </td>

                {/* Timing */}
                <td className="py-3.5 px-4">
                  {visitor.status === 'CHECKED_IN' ? (
                    <div className="text-xs">
                      <span className="text-gray-500 dark:text-zinc-400">In: </span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400 font-mono">
                        {formatTimestamp(visitor.checkInTime)}
                      </span>
                    </div>
                  ) : visitor.status === 'CHECKED_OUT' ? (
                    <div className="text-xs space-y-0.5 font-mono">
                      <div className="text-gray-500 dark:text-zinc-400">
                        In: {formatTimestamp(visitor.checkInTime)}
                      </div>
                      <div className="text-zinc-600 dark:text-zinc-300">
                        Out: {formatTimestamp(visitor.checkOutTime)}
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-gray-500 dark:text-zinc-400">
                      {visitor.expectedArrival
                        ? `Expected: ${new Date(visitor.expectedArrival).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}`
                        : 'Arrival Pending'}
                    </div>
                  )}
                </td>

                {/* Compliance & Host Approval */}
                <td className="py-3.5 px-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      {visitor.ndaSigned ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                          <FileCheck2 className="w-3 h-3" />
                          NDA Signed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-600 dark:text-amber-400">
                          <Clock className="w-3 h-3" />
                          NDA Pending
                        </span>
                      )}
                    </div>
                    <div>{getHostApprovalUI(visitor)}</div>
                  </div>
                </td>

                {/* Status */}
                <td className="py-3.5 px-4">
                  {getStatusBadge(visitor.status, visitor.isOverstay)}
                </td>

                {/* Actions */}
                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {/* Check In Action for Expected */}
                    {visitor.status === 'EXPECTED' && (
                      <Button
                        variant="secondary"
                        size="sm"
                        disabled={isActionLoading || visitor.hostApprovalStatus === 'REJECTED'}
                        onClick={() => onCheckIn(visitor)}
                        className="rounded-lg text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 text-xs px-2.5 py-1 flex items-center gap-1"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        Check In
                      </Button>
                    )}

                    {/* Check Out Action for Checked-In */}
                    {visitor.status === 'CHECKED_IN' && (
                      <Button
                        variant="secondary"
                        size="sm"
                        disabled={isActionLoading}
                        onClick={() => onCheckOut(visitor)}
                        className="rounded-lg text-rose-600 hover:text-rose-700 dark:text-rose-400 text-xs px-2.5 py-1 flex items-center gap-1"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Check Out
                      </Button>
                    )}

                    {/* View / Print Digital Badge */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewBadge(visitor)}
                      title="View Digital Visitor Pass"
                      className="rounded-lg text-gray-600 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-[#ececec] text-xs px-2 py-1 flex items-center gap-1"
                    >
                      <QrCode className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                      <span className="hidden sm:inline">Pass</span>
                    </Button>
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

export default VisitorsTable;
