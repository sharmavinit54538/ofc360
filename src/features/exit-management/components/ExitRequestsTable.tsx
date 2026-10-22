import React from 'react';
import {
  LogOut,
  Calendar,
  Clock,
  User,
  CheckCircle2,
  XCircle,
  Eye,
  ShieldAlert,
  ArrowRight,
  UserX,
  Laptop,
  Building,
  CreditCard,
  FileCheck,
} from 'lucide-react';
import { Badge } from '@/shared/ui/Badge';
import type { ExitCase, ExitStage, ClearanceDepartment } from '../types/exit.types';

interface ExitRequestsTableProps {
  cases: ExitCase[];
  isLoading: boolean;
  onViewDetails: (exitCase: ExitCase) => void;
  onAdvanceStage: (exitCase: ExitCase) => void;
  onReject: (exitCase: ExitCase) => void;
  onDeactivate: (exitCase: ExitCase) => void;
  isActionLoading?: boolean;
}

export const ExitRequestsTable: React.FC<ExitRequestsTableProps> = ({
  cases,
  isLoading,
  onViewDetails,
  onAdvanceStage,
  onReject,
  onDeactivate,
  isActionLoading = false,
}) => {
  const getStageBadge = (stage: ExitStage) => {
    switch (stage) {
      case 'COMPLETED':
        return (
          <Badge variant="success" size="sm" className="font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Completed
          </Badge>
        );
      case 'FNF_SETTLEMENT':
        return (
          <Badge variant="brand" size="sm" className="font-semibold flex items-center gap-1 bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border-purple-300 dark:border-purple-800">
            <CreditCard className="w-3 h-3" />
            FnF Settlement
          </Badge>
        );
      case 'CLEARANCE_PENDING':
        return (
          <Badge variant="brand" size="sm" className="font-semibold flex items-center gap-1">
            <ShieldAlert className="w-3 h-3" />
            Clearance Pending
          </Badge>
        );
      case 'MANAGER_REVIEW':
        return (
          <Badge variant="warning" size="sm" className="font-semibold flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Manager Review
          </Badge>
        );
      case 'RESIGNATION_SUBMITTED':
        return (
          <Badge variant="warning" size="sm" className="font-semibold flex items-center gap-1 bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
            <Clock className="w-3 h-3" />
            Submitted
          </Badge>
        );
      case 'REJECTED':
        return (
          <Badge variant="danger" size="sm" className="font-semibold flex items-center gap-1">
            <XCircle className="w-3 h-3" />
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge variant="slate" size="sm" className="font-semibold">
            {stage}
          </Badge>
        );
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const getDaysRemaining = (expectedLWD: string) => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const target = new Date(expectedLWD);
      target.setHours(0, 0, 0, 0);
      const diffTime = target.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays < 0) return `${Math.abs(diffDays)}d past LWD`;
      if (diffDays === 0) return 'Last day today';
      return `${diffDays}d remaining`;
    } catch {
      return '';
    }
  };

  const formatReason = (reason: string) => {
    return reason
      .toLowerCase()
      .split('_')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  };

  const getDepartmentIcon = (dept: ClearanceDepartment) => {
    switch (dept) {
      case 'IT':
        return <Laptop className="w-3 h-3" />;
      case 'HR':
        return <FileCheck className="w-3 h-3" />;
      case 'FINANCE':
        return <CreditCard className="w-3 h-3" />;
      case 'ADMIN':
        return <Building className="w-3 h-3" />;
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#171717] overflow-hidden shadow-sm">
        <div className="p-4 border-b border-gray-200 dark:border-zinc-800 animate-pulse">
          <div className="h-4 w-48 bg-gray-200 dark:bg-zinc-800 rounded" />
        </div>
        <div className="divide-y divide-gray-100 dark:divide-zinc-800/80">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="p-4 flex items-center justify-between gap-4 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-zinc-800" />
                <div className="space-y-1.5">
                  <div className="h-4 w-32 bg-gray-200 dark:bg-zinc-800 rounded" />
                  <div className="h-3 w-24 bg-gray-200 dark:bg-zinc-800 rounded" />
                </div>
              </div>
              <div className="h-4 w-28 bg-gray-200 dark:bg-zinc-800 rounded hidden md:block" />
              <div className="h-4 w-20 bg-gray-200 dark:bg-zinc-800 rounded hidden sm:block" />
              <div className="h-6 w-20 bg-gray-200 dark:bg-zinc-800 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (cases.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 dark:border-zinc-800 bg-white dark:bg-[#171717] p-12 text-center">
        <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-4">
          <LogOut className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-gray-900 dark:text-[#ececec]">
          No Exit Cases Found
        </h3>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400 max-w-sm mx-auto mt-1">
          No employee resignation or offboarding cases match your active filters. You can initiate a new exit case or reset filters.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#171717] overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-zinc-800 bg-gray-50/75 dark:bg-[#1f1f1f]/50 text-[11px] font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider select-none">
              <th className="py-3 px-4">Case # & Employee</th>
              <th className="py-3 px-4">Exit Type & Reason</th>
              <th className="py-3 px-4 hidden md:table-cell">Resignation Date</th>
              <th className="py-3 px-4">Last Working Day</th>
              <th className="py-3 px-4 hidden lg:table-cell">Clearance Sign-offs</th>
              <th className="py-3 px-4">Stage</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-zinc-800/80">
            {cases.map((exitCase) => {
              const daysRemaining = getDaysRemaining(exitCase.expectedLastWorkingDay);
              const isSubmitted = exitCase.stage === 'RESIGNATION_SUBMITTED';
              const isManagerReview = exitCase.stage === 'MANAGER_REVIEW';
              const isClearance = exitCase.stage === 'CLEARANCE_PENDING';
              const isCompleted = exitCase.stage === 'COMPLETED';

              // Clearance stats
              const clearances = exitCase.clearances || [];
              const clearedCount = clearances.filter((c) => c.status === 'CLEARED').length;
              const totalDepts = clearances.length || 4;

              return (
                <tr
                  key={exitCase.id}
                  className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors group"
                >
                  {/* Case # & Employee */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-500 to-indigo-500 p-0.5 shadow-sm shadow-rose-500/10 flex-shrink-0">
                        <div className="w-full h-full bg-white dark:bg-[#171717] rounded-[10px] flex items-center justify-center font-bold text-xs text-rose-600 dark:text-rose-400">
                          {exitCase.employee?.name ? exitCase.employee.name[0] : <User className="w-4 h-4" />}
                        </div>
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-gray-900 dark:text-[#ececec] text-sm truncate">
                          {exitCase.employee?.name || 'Employee'}
                        </div>
                        <div className="text-[11px] text-gray-500 dark:text-zinc-400 flex items-center gap-1.5 truncate">
                          <span className="font-mono text-brand-600 dark:text-brand-400 font-medium">
                            {exitCase.caseNumber || `EXT-${exitCase.id.slice(0, 6)}`}
                          </span>
                          <span>&bull;</span>
                          <span>{exitCase.employee?.department || 'Department'}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Exit Type & Reason */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="space-y-0.5">
                      <div className="font-medium text-gray-900 dark:text-[#ececec] text-xs">
                        {formatReason(exitCase.reason)}
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 font-medium">
                        {exitCase.exitType}
                      </span>
                    </div>
                  </td>

                  {/* Resignation Date */}
                  <td className="py-3.5 px-4 whitespace-nowrap hidden md:table-cell">
                    <div className="flex items-center gap-1.5 text-xs text-gray-700 dark:text-zinc-300">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      <span>{formatDate(exitCase.resignationDate)}</span>
                    </div>
                    <div className="text-[11px] text-gray-400 dark:text-zinc-500">
                      {exitCase.noticePeriodDays} days notice
                    </div>
                  </td>

                  {/* Last Working Day */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="space-y-0.5">
                      <div className="text-xs font-semibold text-gray-900 dark:text-zinc-200">
                        {formatDate(exitCase.expectedLastWorkingDay)}
                      </div>
                      {daysRemaining && (
                        <div className="text-[11px] font-medium text-amber-600 dark:text-amber-400">
                          {daysRemaining}
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Department Clearance Progress */}
                  <td className="py-3.5 px-4 whitespace-nowrap hidden lg:table-cell">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-emerald-500 h-full rounded-full transition-all"
                            style={{ width: `${(clearedCount / totalDepts) * 100}%` }}
                          />
                        </div>
                        <span className="text-[11px] font-medium text-gray-600 dark:text-zinc-400">
                          {clearedCount}/{totalDepts}
                        </span>
                      </div>
                      {/* Department badges */}
                      <div className="flex items-center gap-1">
                        {(['IT', 'HR', 'FINANCE', 'ADMIN'] as ClearanceDepartment[]).map((dept) => {
                          const item = clearances.find((c) => c.department === dept);
                          const isCleared = item?.status === 'CLEARED';
                          const isFlagged = item?.status === 'FLAGGED';

                          return (
                            <span
                              key={dept}
                              title={`${dept}: ${item?.status || 'PENDING'}`}
                              className={`
                                p-1 rounded-md text-[10px] flex items-center justify-center font-bold
                                ${
                                  isCleared
                                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                                    : isFlagged
                                    ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                                    : 'bg-gray-100 text-gray-500 dark:bg-zinc-800 dark:text-zinc-400'
                                }
                              `}
                            >
                              {getDepartmentIcon(dept)}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </td>

                  {/* Stage */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {getStageBadge(exitCase.stage)}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-1">
                      {/* View / Sheet */}
                      <button
                        type="button"
                        onClick={() => onViewDetails(exitCase)}
                        className="p-1.5 rounded-lg text-gray-600 dark:text-zinc-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                        title="View details & clearances sheet"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* Advance Stage (Manager review -> Clearance -> FnF) */}
                      {(isSubmitted || isManagerReview || isClearance) && (
                        <button
                          type="button"
                          onClick={() => onAdvanceStage(exitCase)}
                          disabled={isActionLoading}
                          className="p-1.5 rounded-lg text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors disabled:opacity-50"
                          title="Advance to next workflow stage"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      )}

                      {/* Reject Exit Case */}
                      {(isSubmitted || isManagerReview) && (
                        <button
                          type="button"
                          onClick={() => onReject(exitCase)}
                          disabled={isActionLoading}
                          className="p-1.5 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors disabled:opacity-50"
                          title="Reject resignation"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      )}

                      {/* Deactivate Employee (if completed or final stage and not yet deactivated) */}
                      {(isCompleted || exitCase.stage === 'FNF_SETTLEMENT') && !exitCase.isDeactivated && (
                        <button
                          type="button"
                          onClick={() => onDeactivate(exitCase)}
                          disabled={isActionLoading}
                          className="p-1.5 rounded-lg text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-colors disabled:opacity-50"
                          title="Deactivate employee access & revoke accounts"
                        >
                          <UserX className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
