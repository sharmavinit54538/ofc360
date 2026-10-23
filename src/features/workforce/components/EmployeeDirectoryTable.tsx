import React from 'react';
import { Users, Eye, Pencil, UserCog } from 'lucide-react';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { SkeletonTableRow } from '@/shared/ui/Skeleton';
import type { EmployeeItem, EmployeeStatus } from '../types/workforce.types';

interface EmployeeDirectoryTableProps {
  employees: EmployeeItem[];
  isLoading: boolean;
  onEdit: (employee: EmployeeItem) => void;
  onStatusChange: (employee: EmployeeItem) => void;
  onView: (employee: EmployeeItem) => void;
}

type BadgeVariant = 'brand' | 'success' | 'warning' | 'danger' | 'slate' | 'role';

const STATUS_BADGE: Record<EmployeeStatus, { variant: BadgeVariant; label: string }> = {
  ACTIVE: { variant: 'success', label: 'Active' },
  PROBATION: { variant: 'warning', label: 'Probation' },
  NOTICE_PERIOD: { variant: 'brand', label: 'Notice' },
  SUSPENDED: { variant: 'danger', label: 'Suspended' },
  INACTIVE: { variant: 'slate', label: 'Inactive' },
};

const EMPLOYMENT_TYPE_LABELS: Record<EmployeeItem['employmentType'], string> = {
  FULL_TIME: 'Full Time',
  PART_TIME: 'Part Time',
  CONTRACT: 'Contract',
  INTERN: 'Intern',
};

const formatJoiningDate = (dateStr: string): string =>
  new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

export const EmployeeDirectoryTable: React.FC<EmployeeDirectoryTableProps> = ({
  employees,
  isLoading,
  onEdit,
  onStatusChange,
  onView,
}) => {
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

      {isLoading ? (
        <div className="p-4 space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonTableRow key={i} columns={3} />
          ))}
        </div>
      ) : employees.length === 0 ? (
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
              {employees.map((emp) => {
                const badge = STATUS_BADGE[emp.status];
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
                      <div className="inline-flex items-center gap-0.5">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onView(emp)}
                          className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 px-2"
                          aria-label={`View ${emp.firstName} ${emp.lastName}`}
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onEdit(emp)}
                          className="text-xs text-gray-600 hover:text-gray-900 dark:text-zinc-300 px-2"
                          aria-label={`Edit ${emp.firstName} ${emp.lastName}`}
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onStatusChange(emp)}
                          className="text-xs text-amber-600 hover:text-amber-700 dark:text-amber-400 px-2"
                          aria-label={`Change status of ${emp.firstName} ${emp.lastName}`}
                        >
                          <UserCog className="w-3.5 h-3.5" />
                        </Button>
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
