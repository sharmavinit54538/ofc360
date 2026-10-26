import React, { useState, useEffect } from 'react';
import { Users, Eye, Pencil, UserCog, MoreVertical, Mail, KeyRound } from 'lucide-react';
import { Badge } from '@/shared/ui/Badge';
import { SkeletonTableRow } from '@/shared/ui/Skeleton';
import type { EmployeeItem } from '../types/workforce.types';

interface EmployeeDirectoryTableProps {
  employees: EmployeeItem[];
  isLoading: boolean;
  onEdit: (employee: EmployeeItem) => void;
  onStatusChange: (employee: EmployeeItem) => void;
  onView: (employee: EmployeeItem) => void;
  onInvite?: (employee: EmployeeItem) => void;
  onResetPassword?: (employee: EmployeeItem) => void;
}

type BadgeVariant = 'brand' | 'success' | 'warning' | 'danger' | 'slate' | 'role';

const STATUS_BADGE: Record<string, { variant: BadgeVariant; label: string }> = {
  ACTIVE: { variant: 'success', label: 'Active' },
  INVITED: { variant: 'brand', label: 'Invited' },
  PENDING: { variant: 'brand', label: 'Pending' },
  ONBOARDING: { variant: 'brand', label: 'Onboarding' },
  PROBATION: { variant: 'warning', label: 'Probation' },
  ON_LEAVE: { variant: 'warning', label: 'On Leave' },
  NOTICE_PERIOD: { variant: 'brand', label: 'Notice' },
  SUSPENDED: { variant: 'danger', label: 'Suspended' },
  DEACTIVATED: { variant: 'slate', label: 'Deactivated' },
  TERMINATED: { variant: 'danger', label: 'Terminated' },
  INACTIVE: { variant: 'slate', label: 'Inactive' },
};

const EMPLOYMENT_TYPE_LABELS: Record<EmployeeItem['employmentType'], string> = {
  FULL_TIME: 'Full Time',
  PART_TIME: 'Part Time',
  CONTRACT: 'Contract',
  INTERN: 'Intern',
};

const formatJoiningDate = (dateStr: string): string => {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return dateStr;
  }
};

export const EmployeeDirectoryTable: React.FC<EmployeeDirectoryTableProps> = ({
  employees,
  isLoading,
  onEdit,
  onStatusChange,
  onView,
  onInvite,
  onResetPassword,
}) => {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Close the open dropdown when clicking anywhere outside of it
  useEffect(() => {
    if (!openMenuId) return;
    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target || !target.closest('[data-dropdown-container]')) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleDocumentClick);
    return () => {
      document.removeEventListener('mousedown', handleDocumentClick);
    };
  }, [openMenuId]);

  return (
    <div className="w-full">

      {employees.length === 0 && !isLoading ? (
        <div className="p-12 text-center">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
            <Users className="w-7 h-7" />
          </div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-[#ececec]">
            No employees match these filters
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-zinc-400 max-w-sm mx-auto">
            Try widening your search or clearing a filter. New joiners appear here automatically
            once onboarded.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto min-w-0 min-h-[360px] pb-24">
          <table className="w-full min-w-[760px] text-left text-xs md:text-sm">
            <thead className="bg-gray-50 dark:bg-zinc-800/60 text-gray-600 dark:text-zinc-400 text-xs uppercase tracking-wider font-semibold border-b border-gray-200 dark:border-zinc-800">
              <tr>
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3">Employee</th>
                <th className="px-4 py-3">Department & Role</th>
                <th className="px-4 py-3">Manager</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Joined</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-zinc-800/80">
              {isLoading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <SkeletonTableRow key={i} columns={8} />
                  ))
                : employees.map((emp, index) => {
                const badge = STATUS_BADGE[emp.status] ?? {
                  label: emp.status || 'Unknown',
                  variant: 'slate' as BadgeVariant,
                };
                const isMenuOpen = openMenuId === emp.id;
                const isNearBottom = index >= Math.max(employees.length - 2, 0) && employees.length > 2;

                return (
                  <tr key={emp.id} className="hover:bg-gray-50/80 dark:hover:bg-zinc-800/40 transition-colors">
                    <td className="px-4 py-3.5">
                      <span className="font-mono text-xs text-gray-600 dark:text-zinc-400">
                        {emp.employeeCode}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-bold shrink-0 overflow-hidden">
                          {emp.avatarUrl ? (
                            <img
                              src={emp.avatarUrl}
                              alt={`${emp.firstName} ${emp.lastName}`}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          ) : (
                            `${emp.firstName.charAt(0)}${emp.lastName.charAt(0)}`.toUpperCase()
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-gray-900 dark:text-[#ececec] truncate">
                            {emp.firstName} {emp.lastName}
                          </div>
                          <div className="text-[11px] text-gray-500 dark:text-zinc-400 truncate">
                            {emp.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-medium text-gray-700 dark:text-zinc-300 truncate">
                        {emp.department?.name}
                      </div>
                      <div className="text-[11px] text-gray-500 dark:text-zinc-400 truncate">
                        {emp.designation?.title}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-gray-700 dark:text-zinc-300 whitespace-nowrap">
                      {emp.reportingManager?.name || '—'}
                    </td>
                    <td className="px-4 py-3.5 text-gray-700 dark:text-zinc-300 whitespace-nowrap">
                      {EMPLOYMENT_TYPE_LABELS[emp.employmentType]}
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge variant={badge.variant} size="sm" className="font-semibold text-[11px]">
                        {badge.label}
                      </Badge>
                    </td>
                    <td className="px-4 py-3.5 text-gray-700 dark:text-zinc-300 whitespace-nowrap">
                      {formatJoiningDate(emp.joiningDate)}
                    </td>
                    <td className="px-4 py-3.5 text-right relative">
                      <div className="relative inline-block text-left" data-dropdown-container>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId((current) => (current === emp.id ? null : emp.id));
                          }}
                          className={`p-1.5 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
                            isMenuOpen
                              ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400'
                              : 'text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800'
                          }`}
                          aria-label={`Actions for ${emp.firstName} ${emp.lastName}`}
                          title="Actions"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {/* 3-Dots Action Dropdown Menu */}
                        {isMenuOpen && (
                          <div
                            className={`absolute right-0 ${
                              isNearBottom ? 'bottom-full mb-1.5' : 'top-full mt-1.5'
                            } w-52 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-[#1f1f1f] shadow-2xl py-1 z-50 divide-y divide-gray-100 dark:divide-zinc-800/80 animate-in fade-in-50 zoom-in-95`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="py-1">
                              <button
                                type="button"
                                onClick={() => {
                                  setOpenMenuId(null);
                                  onView(emp);
                                }}
                                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-gray-700 dark:text-zinc-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors text-left"
                              >
                                <Eye className="w-4 h-4 text-blue-500 shrink-0" />
                                <span>View Profile</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setOpenMenuId(null);
                                  onEdit(emp);
                                }}
                                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-gray-700 dark:text-zinc-200 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors text-left"
                              >
                                <Pencil className="w-4 h-4 text-emerald-500 shrink-0" />
                                <span>Edit Employee</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setOpenMenuId(null);
                                  onStatusChange(emp);
                                }}
                                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-gray-700 dark:text-zinc-200 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-colors text-left"
                              >
                                <UserCog className="w-4 h-4 text-amber-500 shrink-0" />
                                <span>Change Status</span>
                              </button>
                            </div>

                            <div className="py-1">
                              <button
                                type="button"
                                onClick={() => {
                                  setOpenMenuId(null);
                                  onInvite?.(emp);
                                }}
                                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-gray-700 dark:text-zinc-200 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors text-left"
                              >
                                <Mail className="w-4 h-4 text-indigo-500 shrink-0" />
                                <span>Invite / Resend Invitation</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setOpenMenuId(null);
                                  onResetPassword?.(emp);
                                }}
                                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-gray-700 dark:text-zinc-200 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors text-left"
                              >
                                <KeyRound className="w-4 h-4 text-rose-500 shrink-0" />
                                <span>Reset Password</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EmployeeDirectoryTable;
