/**
 * @file EmployeeDirectoryTable.tsx
 * @description Accessible employee directory table with:
 * 1. Role filter tabs (All Roles, Employees, Managers, IT Admins, Executives)
 * 2. Dedicated System Role column with custom color-coded badges
 * 3. In-row direct Edit and Delete action buttons
 * 4. 3-dots secondary dropdown menu (View Profile, Change Status, Invite, Reset Password)
 * 5. RBAC guards enforcing Super Admin and HR Admin management privileges
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  Eye,
  Pencil,
  Trash2,
  UserCog,
  MoreVertical,
  Mail,
  KeyRound,
  Loader2,
} from 'lucide-react';
import { Badge } from '@/shared/ui/Badge';
import { SkeletonTableRow } from '@/shared/ui/Skeleton';
import { useRBAC } from '@/features/auth/hooks/useRBAC';
import { cn } from '@/shared/lib/utils';
import type { EmployeeItem } from '../types/workforce.types';

export interface EmployeeDirectoryTableProps {
  employees: EmployeeItem[];
  isLoading: boolean;
  onEdit: (employee: EmployeeItem) => void;
  onDelete?: (employee: EmployeeItem) => void;
  onStatusChange: (employee: EmployeeItem) => void;
  onView: (employee: EmployeeItem) => void;
  onInvite?: (employee: EmployeeItem) => void;
  onResetPassword?: (employee: EmployeeItem) => void;
  selectedRole?: string;
  onRoleChange?: (role: string) => void;
  isDeletingId?: string | null;
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

const ROLE_BADGE: Record<string, { bg: string; text: string; border: string; label: string }> = {
  EMPLOYEE: {
    bg: 'bg-blue-50 dark:bg-blue-950/40',
    text: 'text-blue-700 dark:text-blue-300',
    border: 'border-blue-200 dark:border-blue-800',
    label: 'Employee',
  },
  MANAGER: {
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    text: 'text-amber-700 dark:text-amber-300',
    border: 'border-amber-200 dark:border-amber-800',
    label: 'Manager',
  },
  IT_ADMIN: {
    bg: 'bg-cyan-50 dark:bg-cyan-950/40',
    text: 'text-cyan-700 dark:text-cyan-300',
    border: 'border-cyan-200 dark:border-cyan-800',
    label: 'IT Admin',
  },
  EXECUTIVE: {
    bg: 'bg-purple-50 dark:bg-purple-950/40',
    text: 'text-purple-700 dark:text-purple-300',
    border: 'border-purple-200 dark:border-purple-800',
    label: 'Executive',
  },
};

const ROLE_TABS = [
  { id: 'ALL', label: 'All Roles' },
  { id: 'EMPLOYEE', label: 'Employees' },
  { id: 'MANAGER', label: 'Managers' },
  { id: 'IT_ADMIN', label: 'IT Admins' },
  { id: 'EXECUTIVE', label: 'Executives' },
] as const;

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
    return isNaN(d.getTime())
      ? dateStr
      : d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return dateStr;
  }
};

export const EmployeeDirectoryTable: React.FC<EmployeeDirectoryTableProps> = ({
  employees,
  isLoading,
  onEdit,
  onDelete,
  onStatusChange,
  onView,
  onInvite,
  onResetPassword,
  selectedRole,
  onRoleChange,
  isDeletingId,
}) => {
  const { hasAnyRole } = useRBAC();
  const canManage = hasAnyRole(['SUPER_ADMIN', 'HR_ADMIN']);

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [internalRoleFilter, setInternalRoleFilter] = useState('ALL');

  const activeRoleTab = selectedRole || internalRoleFilter;

  const handleRoleTabSelect = (roleId: string) => {
    setInternalRoleFilter(roleId);
    onRoleChange?.(roleId);
  };

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

  // Filter employees if filtering locally
  const displayedEmployees = useMemo(() => {
    if (activeRoleTab === 'ALL') return employees;
    return employees.filter(
      (e) => (e.role || 'EMPLOYEE').toUpperCase() === activeRoleTab
    );
  }, [employees, activeRoleTab]);

  return (
    <div className="w-full">
      {/* Role Filter Tabs Bar */}
      <div className="px-4 sm:px-6 py-2.5 border-b border-gray-100 dark:border-zinc-800 bg-gray-50/60 dark:bg-zinc-900/40 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        <span className="text-xs font-semibold text-gray-500 dark:text-zinc-400 mr-1.5 shrink-0">
          Role Filter:
        </span>
        {ROLE_TABS.map((tab) => {
          const isSelected = activeRoleTab === tab.id;
          const count =
            tab.id === 'ALL'
              ? employees.length
              : employees.filter((e) => (e.role || 'EMPLOYEE').toUpperCase() === tab.id).length;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleRoleTabSelect(tab.id)}
              className={cn(
                'px-2.5 py-1 rounded-xl text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5',
                isSelected
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white dark:bg-zinc-800 text-gray-600 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-700 border border-gray-200 dark:border-zinc-700'
              )}
            >
              <span>{tab.label}</span>
              <span
                className={cn(
                  'text-[10px] px-1.5 py-0.2 rounded-full font-bold',
                  isSelected
                    ? 'bg-blue-700 text-white'
                    : 'bg-gray-100 dark:bg-zinc-700 text-gray-600 dark:text-zinc-300'
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {displayedEmployees.length === 0 && !isLoading ? (
        <div className="p-12 text-center">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
            <Users className="w-7 h-7" />
          </div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-[#ececec]">
            {activeRoleTab === 'ALL'
              ? 'No employees match these filters'
              : `No users found with role "${ROLE_TABS.find((t) => t.id === activeRoleTab)?.label || activeRoleTab}"`}
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-zinc-400 max-w-sm mx-auto">
            Try switching the role filter or clearing search criteria. New joiners appear here automatically once onboarded.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto min-w-0 min-h-[360px] pb-24">
          <table className="w-full min-w-[840px] text-left text-xs md:text-sm">
            <thead className="bg-gray-50 dark:bg-zinc-800/60 text-gray-600 dark:text-zinc-400 text-xs uppercase tracking-wider font-semibold border-b border-gray-200 dark:border-zinc-800">
              <tr>
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3">Employee</th>
                <th className="px-4 py-3">Department & Role</th>
                <th className="px-4 py-3">Access Tier</th>
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
                    <SkeletonTableRow key={i} columns={9} />
                  ))
                : displayedEmployees.map((emp, index) => {
                    const badge = STATUS_BADGE[emp.status] ?? {
                      label: emp.status || 'Unknown',
                      variant: 'slate' as BadgeVariant,
                    };

                    const roleKey = (emp.role || 'EMPLOYEE').toUpperCase();
                    const roleBadge = ROLE_BADGE[roleKey] ?? ROLE_BADGE.EMPLOYEE;

                    const isMenuOpen = openMenuId === emp.id;
                    const isNearBottom =
                      index >= Math.max(displayedEmployees.length - 2, 0) &&
                      displayedEmployees.length > 2;

                    return (
                      <tr
                        key={emp.id}
                        className="hover:bg-gray-50/80 dark:hover:bg-zinc-800/40 transition-colors"
                      >
                        {/* Code */}
                        <td className="px-4 py-3.5">
                          <span className="font-mono text-xs text-gray-600 dark:text-zinc-400">
                            {emp.employeeCode}
                          </span>
                        </td>

                        {/* Employee Avatar + Name + Email */}
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

                        {/* Department & Designation */}
                        <td className="px-4 py-3.5">
                          <div className="font-medium text-gray-700 dark:text-zinc-300 truncate">
                            {emp.department?.name}
                          </div>
                          <div className="text-[11px] text-gray-500 dark:text-zinc-400 truncate">
                            {emp.designation?.title}
                          </div>
                        </td>

                        {/* System Role Badge */}
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <span
                            className={cn(
                              'inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border',
                              roleBadge.bg,
                              roleBadge.text,
                              roleBadge.border
                            )}
                          >
                            {roleBadge.label}
                          </span>
                        </td>

                        {/* Reporting Manager */}
                        <td className="px-4 py-3.5 text-gray-700 dark:text-zinc-300 whitespace-nowrap">
                          {emp.reportingManager?.name || '—'}
                        </td>

                        {/* Employment Type */}
                        <td className="px-4 py-3.5 text-gray-700 dark:text-zinc-300 whitespace-nowrap">
                          {EMPLOYMENT_TYPE_LABELS[emp.employmentType]}
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3.5">
                          <Badge variant={badge.variant} size="sm" className="font-semibold text-[11px]">
                            {badge.label}
                          </Badge>
                        </td>

                        {/* Joined Date */}
                        <td className="px-4 py-3.5 text-gray-700 dark:text-zinc-300 whitespace-nowrap">
                          {formatJoiningDate(emp.joiningDate)}
                        </td>

                        {/* Actions (In-Row Edit/Delete + 3-Dots Dropdown) */}
                        <td className="px-4 py-3.5 text-right relative">
                          <div className="flex items-center justify-end gap-1">
                            {/* Direct In-Row Edit Button */}
                            {canManage && (
                              <button
                                type="button"
                                onClick={() => onEdit(emp)}
                                title={`Edit ${emp.firstName} ${emp.lastName}`}
                                aria-label={`Edit ${emp.firstName} ${emp.lastName}`}
                                className="p-1.5 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {/* Direct In-Row Delete Button */}
                            {canManage && onDelete && (
                              <button
                                type="button"
                                onClick={() => onDelete(emp)}
                                disabled={isDeletingId === emp.id}
                                title={`Delete ${emp.firstName} ${emp.lastName}`}
                                aria-label={`Delete ${emp.firstName} ${emp.lastName}`}
                                className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors disabled:opacity-50"
                              >
                                {isDeletingId === emp.id ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-500" />
                                ) : (
                                  <Trash2 className="w-3.5 h-3.5" />
                                )}
                              </button>
                            )}

                            {/* 3-Dots Dropdown for Secondary Actions */}
                            <div className="relative inline-block text-left" data-dropdown-container>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenMenuId((current) => (current === emp.id ? null : emp.id));
                                }}
                                className={cn(
                                  'p-1.5 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50',
                                  isMenuOpen
                                    ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400'
                                    : 'text-gray-400 hover:text-gray-700 dark:hover:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-800'
                                )}
                                aria-label={`More actions for ${emp.firstName} ${emp.lastName}`}
                                title="More actions"
                              >
                                <MoreVertical className="w-3.5 h-3.5" />
                              </button>

                              {isMenuOpen && (
                                <div
                                  className={cn(
                                    'absolute right-0 w-52 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-[#1f1f1f] shadow-2xl py-1 z-50 divide-y divide-gray-100 dark:divide-zinc-800/80 animate-in fade-in-50 zoom-in-95',
                                    isNearBottom ? 'bottom-full mb-1.5' : 'top-full mt-1.5'
                                  )}
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
                                      <span>Invite / Resend</span>
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

                                  {canManage && onDelete && (
                                    <div className="py-1">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setOpenMenuId(null);
                                          onDelete(emp);
                                        }}
                                        className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors text-left"
                                      >
                                        <Trash2 className="w-4 h-4 text-rose-500 shrink-0" />
                                        <span>Delete Employee</span>
                                      </button>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
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
