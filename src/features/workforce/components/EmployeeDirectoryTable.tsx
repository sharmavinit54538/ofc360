import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Users, Eye, Pencil, UserCog, MoreVertical } from 'lucide-react';
import { Badge } from '@/shared/ui/Badge';
import { SkeletonTableRow } from '@/shared/ui/Skeleton';
import type { EmployeeItem } from '../types/workforce.types';

interface EmployeeDirectoryTableProps {
  employees: EmployeeItem[];
  isLoading: boolean;
  onEdit: (employee: EmployeeItem) => void;
  onStatusChange: (employee: EmployeeItem) => void;
  onView: (employee: EmployeeItem) => void;
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
}) => {
  const [menuAnchor, setMenuAnchor] = useState<{
    top: number;
    left: number;
    emp: EmployeeItem;
  } | null>(null);

  const handleToggleMenu = (e: React.MouseEvent<HTMLButtonElement>, emp: EmployeeItem) => {
    e.stopPropagation();
    if (menuAnchor?.emp.id === emp.id) {
      setMenuAnchor(null);
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const dropdownWidth = 184;
    const dropdownHeight = 140;
    const spaceBelow = window.innerHeight - rect.bottom;

    const top =
      spaceBelow < dropdownHeight && rect.top > dropdownHeight
        ? rect.top - dropdownHeight - 4
        : rect.bottom + 4;
    const left = Math.max(8, Math.min(window.innerWidth - dropdownWidth - 8, rect.right - dropdownWidth));

    setMenuAnchor({ top, left, emp });
  };

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#171717] overflow-hidden shadow-sm">
      <div className="p-4 md:p-6 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-[#ececec] flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Employee Directory
          </h2>
          <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
            Live personnel records synced with the workforce service
          </p>
        </div>
        <Badge variant="brand" size="sm" className="font-semibold text-[11px]">
          {employees.length} {employees.length === 1 ? 'Employee' : 'Employees'}
        </Badge>
      </div>

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
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs md:text-sm">
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
                : employees.map((emp) => {
                const badge = STATUS_BADGE[emp.status] ?? {
                  label: emp.status || 'Unknown',
                  variant: 'slate' as BadgeVariant,
                };
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
                    <td className="px-4 py-3.5 text-right">
                      <button
                        type="button"
                        onClick={(e) => handleToggleMenu(e, emp)}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors focus:outline-none focus:ring-1 focus:ring-blue-500"
                        aria-label={`Actions for ${emp.firstName} ${emp.lastName}`}
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* 3-Dots Action Dropdown Menu rendered via createPortal directly into document.body */}
      {menuAnchor && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[9999] pointer-events-auto">
          {/* Transparent Backdrop to close on click outside */}
          <div
            className="fixed inset-0 cursor-default"
            onClick={() => setMenuAnchor(null)}
          />

          {/* Floating Dropdown Card */}
          <div
            style={{
              position: 'fixed',
              top: `${menuAnchor.top}px`,
              left: `${menuAnchor.left}px`,
            }}
            className="w-44 rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#1f1f1f] shadow-2xl py-1.5 animate-in fade-in-50 zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => {
                const emp = menuAnchor.emp;
                setMenuAnchor(null);
                onView(emp);
              }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-gray-700 dark:text-zinc-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors text-left"
            >
              <Eye className="w-4 h-4 text-blue-500 shrink-0" />
              <span>View Profile</span>
            </button>
            <button
              type="button"
              onClick={() => {
                const emp = menuAnchor.emp;
                setMenuAnchor(null);
                onEdit(emp);
              }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-gray-700 dark:text-zinc-200 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors text-left"
            >
              <Pencil className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Edit Employee</span>
            </button>
            <button
              type="button"
              onClick={() => {
                const emp = menuAnchor.emp;
                setMenuAnchor(null);
                onStatusChange(emp);
              }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-gray-700 dark:text-zinc-200 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-colors text-left"
            >
              <UserCog className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Change Status</span>
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default EmployeeDirectoryTable;
