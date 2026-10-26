import React, { useEffect } from 'react';
import {
  X,
  Building2,
  User,
  MapPin,
  Users,
  DollarSign,
  Hash,
  Phone,
  Pencil,
} from 'lucide-react';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { useRBAC } from '@/features/auth/hooks/useRBAC';
import type { DepartmentItem, DepartmentStatus } from '../types/workforce.types';

export interface DepartmentDetailModalProps {
  department: DepartmentItem | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (department: DepartmentItem) => void;
  managerName?: string;
  staffCount?: number;
}

type BadgeVariant = 'brand' | 'success' | 'warning' | 'danger' | 'slate';

const getStatusBadgeVariant = (status?: DepartmentStatus, isActive?: boolean): BadgeVariant => {
  if (!status && isActive !== undefined) return isActive ? 'success' : 'slate';
  switch (status) {
    case 'ACTIVE':
      return 'success';
    case 'HIRING':
      return 'brand';
    case 'GROWING':
      return 'warning';
    case 'INACTIVE':
    default:
      return 'slate';
  }
};

type IconType = React.ComponentType<{ className?: string }>;

const DetailRow: React.FC<{ icon: IconType; label: string; value?: React.ReactNode }> = ({
  icon: Icon,
  label,
  value,
}) => (
  <div className="flex items-start gap-3">
    <div className="p-2 rounded-xl bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-zinc-400 shrink-0">
      <Icon className="w-3.5 h-3.5" />
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-[10px] uppercase font-semibold text-gray-500 dark:text-zinc-400 tracking-wider">
        {label}
      </p>
      <div className="text-sm font-medium text-gray-900 dark:text-[#ececec] truncate mt-0.5">
        {value || '—'}
      </div>
    </div>
  </div>
);

export const DepartmentDetailModal: React.FC<DepartmentDetailModalProps> = ({
  department,
  isOpen,
  onClose,
  onEdit,
  managerName = 'Not assigned',
  staffCount,
}) => {
  const { hasAnyRole } = useRBAC();
  const canManage = hasAnyRole(['SUPER_ADMIN', 'HR_ADMIN', 'IT_ADMIN']);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !department) return null;

  const deptName = department.department_name || department.departmentName || department.name || 'Department';
  const deptCode = department.department_code || department.departmentCode || department.code || '—';
  const status = department.status || (department.isActive ? 'ACTIVE' : 'INACTIVE');
  const count = staffCount ?? department.headcount ?? department.totalEmployees ?? department.employeeCount ?? 0;
  const capacity = department.employee_capacity ?? department.employeeCapacity ?? 100;
  const utilization = capacity > 0 ? Math.min(100, Math.round((count / capacity) * 100)) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in-50">
      <div
        className="w-full max-w-lg bg-white dark:bg-[#171717] rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-2xl overflow-hidden animate-in zoom-in-95"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dept-detail-headline"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between bg-gray-50/50 dark:bg-zinc-900/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 id="dept-detail-headline" className="text-base font-bold text-gray-900 dark:text-[#ececec]">
                Department Details
              </h2>
              <p className="font-mono text-xs text-gray-500 dark:text-zinc-400 font-medium">{deptCode}</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <Badge variant={getStatusBadgeVariant(department.status, department.isActive)} size="sm" className="font-semibold text-[11px]">
              {status}
            </Badge>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body content */}
        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Main Identity Banner */}
          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-zinc-900/50 border border-gray-100 dark:border-zinc-800/80">
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              {deptName}
            </h3>
            {department.description && (
              <p className="mt-1 text-xs text-gray-600 dark:text-zinc-400 leading-relaxed">
                {department.description}
              </p>
            )}
          </div>

          {/* Grid of Key Properties */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <DetailRow icon={User} label="Assigned Manager" value={managerName} />
            <DetailRow icon={MapPin} label="Location" value={department.location || '—'} />
            <DetailRow
              icon={Users}
              label="Staff / Capacity"
              value={
                <div>
                  <div className="flex items-center justify-between text-xs">
                    <span>{count} / {capacity} staff</span>
                    <span className="text-gray-500">{utilization}% cap</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-gray-200 dark:bg-zinc-700 overflow-hidden mt-1.5">
                    <div className="h-full rounded-full bg-emerald-500" style={{ width: `${utilization}%` }} />
                  </div>
                </div>
              }
            />
            <DetailRow
              icon={DollarSign}
              label="Budget"
              value={department.budget !== undefined && department.budget > 0 ? `₹${department.budget.toLocaleString('en-IN')}` : '—'}
            />
            {department.cost_center && (
              <DetailRow icon={Hash} label="Cost Center" value={department.cost_center} />
            )}
            {department.extension_number && (
              <DetailRow icon={Phone} label="Extension" value={department.extension_number} />
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/30 flex items-center justify-end gap-2.5">
          <Button variant="outline" size="sm" onClick={onClose} className="rounded-xl text-xs">
            Close
          </Button>
          {canManage && onEdit && (
            <Button
              size="sm"
              onClick={() => {
                onClose();
                onEdit(department);
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs flex items-center gap-1.5"
            >
              <Pencil className="w-3.5 h-3.5" />
              <span>Edit Department</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DepartmentDetailModal;

