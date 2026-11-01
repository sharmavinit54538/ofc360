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
  UserX,
  CreditCard,
  FileCheck,
  Building,
  Laptop,
} from 'lucide-react';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import type { ExitCase, ExitStage, ClearanceDepartment } from '../types/exit.types';

interface ExitRequestsTableProps {
  cases: ExitCase[];
  isLoading: boolean;
  onViewDetails: (exitCase: ExitCase) => void;
  onReject?: (exitCase: ExitCase) => void;
}

export const ExitRequestsTable: React.FC<ExitRequestsTableProps> = ({
  cases,
  isLoading,
  onViewDetails,
  onReject,
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
      case 'NOTICE_PERIOD':
        return (
          <Badge variant="brand" size="sm" className="font-semibold flex items-center gap-1 bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300">
            <Calendar className="w-3 h-3" />
            Notice Period
          </Badge>
        );
      case 'KNOWLEDGE_TRANSFER':
        return (
          <Badge variant="brand" size="sm" className="font-semibold flex items-center gap-1 bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300">
            <FileCheck className="w-3 h-3" />
            Knowledge Transfer
          </Badge>
        );
      case 'HR_REVIEW':
        return (
          <Badge variant="warning" size="sm" className="font-semibold flex items-center gap-1 bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
            <Clock className="w-3 h-3" />
            HR Review
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
          <Badge variant="neutral" size="sm" className="font-semibold flex items-center gap-1">
            <LogOut className="w-3 h-3" />
            Resignation Submitted
          </Badge>
        );
      case 'EXIT_INTERVIEW':
        return (
          <Badge variant="brand" size="sm" className="font-semibold flex items-center gap-1">
            <User className="w-3 h-3" />
            Exit Interview
          </Badge>
        );
      case 'DOCUMENTS_PENDING':
        return (
          <Badge variant="neutral" size="sm" className="font-semibold flex items-center gap-1">
            <FileCheck className="w-3 h-3" />
            Documents Pending
          </Badge>
        );
      case 'ACCESS_REVOCATION':
        return (
          <Badge variant="error" size="sm" className="font-semibold flex items-center gap-1">
            <Laptop className="w-3 h-3" />
            Access Revocation
          </Badge>
        );
      case 'REJECTED':
        return (
          <Badge variant="error" size="sm" className="font-semibold flex items-center gap-1">
            <XCircle className="w-3 h-3" />
            Rejected
          </Badge>
        );
      case 'WITHDRAWN':
        return (
          <Badge variant="neutral" size="sm" className="font-semibold flex items-center gap-1 text-gray-500">
            <UserX className="w-3 h-3" />
            Withdrawn
          </Badge>
        );
      default:
        return <Badge variant="neutral" size="sm">{stage}</Badge>;
    }
  };

  const getDepartmentIcon = (dept: ClearanceDepartment) => {
    switch (dept) {
      case 'MANAGER':
        return <User className="w-3 h-3" title="Manager" />;
      case 'IT':
        return <Laptop className="w-3 h-3" title="IT" />;
      case 'FINANCE':
        return <CreditCard className="w-3 h-3" title="Finance" />;
      case 'ADMIN':
        return <Building className="w-3 h-3" title="Admin" />;
      case 'HR':
        return <FileCheck className="w-3 h-3" title="HR" />;
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-gray-200 dark:border-zinc-800 bg-gray-50/75 dark:bg-zinc-900/50 text-gray-500 dark:text-zinc-400 font-semibold uppercase tracking-wider">
              <th className="py-3.5 px-4">Case & Employee</th>
              <th className="py-3.5 px-4">Department & Role</th>
              <th className="py-3.5 px-4">Notice & LWD</th>
              <th className="py-3.5 px-4">Workflow Stage</th>
              <th className="py-3.5 px-4">Clearances (5 Depts)</th>
              <th className="py-3.5 px-4">F&F Settlement</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-zinc-800/60">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, idx) => (
                <tr key={idx} className="animate-pulse">
                  <td className="py-4 px-4">
                    <div className="h-4 w-32 bg-gray-200 dark:bg-zinc-800 rounded mb-1.5" />
                    <div className="h-3 w-24 bg-gray-100 dark:bg-zinc-800/60 rounded" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-4 w-28 bg-gray-200 dark:bg-zinc-800 rounded mb-1.5" />
                    <div className="h-3 w-20 bg-gray-100 dark:bg-zinc-800/60 rounded" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-4 w-24 bg-gray-200 dark:bg-zinc-800 rounded mb-1.5" />
                    <div className="h-3 w-16 bg-gray-100 dark:bg-zinc-800/60 rounded" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-6 w-28 bg-gray-200 dark:bg-zinc-800 rounded-full" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-4 w-24 bg-gray-200 dark:bg-zinc-800 rounded" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-4 w-20 bg-gray-200 dark:bg-zinc-800 rounded" />
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="h-7 w-20 bg-gray-200 dark:bg-zinc-800 rounded float-right" />
                  </td>
                </tr>
              ))
            ) : cases.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-gray-500 dark:text-zinc-400">
                  <LogOut className="w-8 h-8 mx-auto text-gray-300 dark:text-zinc-600 mb-2" />
                  <p className="font-medium text-sm">No exit cases found matching criteria</p>
                  <p className="text-xs text-gray-400 dark:text-zinc-500 mt-1">
                    Try adjusting search query or active filter chips
                  </p>
                </td>
              </tr>
            ) : (
              cases.map((exitCase) => {
                const clearedCount = (exitCase.clearances || []).filter((c) => c.status === 'CLEARED').length;
                return (
                  <tr
                    key={exitCase.id}
                    className="hover:bg-gray-50/60 dark:hover:bg-zinc-800/30 transition-colors"
                  >
                    {/* Case ID & Employee */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-gray-900 dark:text-gray-100">
                        {exitCase.employeeName}
                      </div>
                      <div className="text-[11px] font-mono text-gray-500 dark:text-zinc-400 flex items-center gap-1.5 mt-0.5">
                        <span className="bg-gray-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-[10px] font-bold">
                          {exitCase.caseNumber}
                        </span>
                        <span>{exitCase.employeeEmail}</span>
                      </div>
                    </td>

                    {/* Department & Role */}
                    <td className="py-3.5 px-4">
                      <div className="text-gray-900 dark:text-gray-100 font-medium">
                        {exitCase.designation}
                      </div>
                      <div className="text-[11px] text-gray-500 dark:text-zinc-400">
                        {exitCase.department} • Mgr: {exitCase.managerName}
                      </div>
                    </td>

                    {/* Notice & LWD */}
                    <td className="py-3.5 px-4">
                      <div className="text-gray-900 dark:text-gray-100 font-medium flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        <span>
                          {exitCase.expectedLastWorkingDay
                            ? new Date(exitCase.expectedLastWorkingDay).toLocaleDateString()
                            : 'TBD'}
                        </span>
                      </div>
                      <div className="text-[11px] text-gray-500 dark:text-zinc-400 mt-0.5">
                        {exitCase.noticeDays} days notice
                      </div>
                    </td>

                    {/* Stage */}
                    <td className="py-3.5 px-4">
                      {getStageBadge(exitCase.stage)}
                    </td>

                    {/* Department Clearances */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1 mb-1">
                        {(exitCase.clearances || []).map((c) => {
                          let badgeBg = 'bg-gray-100 text-gray-400 border-gray-200 dark:bg-zinc-800 dark:text-zinc-500';
                          if (c.status === 'CLEARED') badgeBg = 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800';
                          else if (c.status === 'ON_HOLD') badgeBg = 'bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800';
                          else if (c.status === 'REJECTED') badgeBg = 'bg-rose-50 text-rose-700 border-rose-300 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800';

                          return (
                            <span
                              key={c.department}
                              className={`p-1 rounded-md border text-[10px] ${badgeBg}`}
                              title={`${c.department}: ${c.status}`}
                            >
                              {getDepartmentIcon(c.department)}
                            </span>
                          );
                        })}
                      </div>
                      <span className="text-[11px] text-gray-500 dark:text-zinc-400 font-medium">
                        {clearedCount}/5 Cleared
                      </span>
                    </td>

                    {/* F&F Settlement */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-gray-900 dark:text-gray-100">
                        ₹{(exitCase.settlement?.netPayable ?? 0).toLocaleString()}
                      </div>
                      <div className="text-[10px] text-gray-500 dark:text-zinc-400 font-medium">
                        Status: {exitCase.fnfStatus}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onViewDetails(exitCase)}
                          className="h-8 text-xs gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Details</span>
                        </Button>

                        {exitCase.stage !== 'COMPLETED' && exitCase.stage !== 'REJECTED' && onReject && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onReject(exitCase)}
                            className="h-8 text-xs text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/50 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                          >
                            Reject
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
