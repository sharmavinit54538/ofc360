import React from 'react';
import { X, User, Mail, Phone, MapPin, CalendarDays, Briefcase, Building2 } from 'lucide-react';
import { Badge } from '@/shared/ui/Badge';
import { SkeletonListItem } from '@/shared/ui/Skeleton';
import { useGetEmployeeByIdQuery } from '../api/workforceApi';
import type { EmployeeItem, EmployeeStatus } from '../types/workforce.types';

interface EmployeeProfileModalProps {
  employee: EmployeeItem | null;
  isOpen: boolean;
  onClose: () => void;
}

type BadgeVariant = 'brand' | 'success' | 'warning' | 'danger' | 'slate' | 'role';

const STATUS_BADGE: Record<EmployeeStatus, { variant: BadgeVariant; label: string }> = {
  ACTIVE: { variant: 'success', label: 'Active' },
  PROBATION: { variant: 'warning', label: 'Probation' },
  NOTICE_PERIOD: { variant: 'brand', label: 'Notice' },
  SUSPENDED: { variant: 'danger', label: 'Suspended' },
  INACTIVE: { variant: 'slate', label: 'Inactive' },
};

const formatDate = (dateStr?: string): string => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

type IconType = React.ComponentType<{ className?: string }>;

const DetailRow: React.FC<{ icon: IconType; label: string; value?: string | null }> = ({
  icon: Icon,
  label,
  value,
}) => (
  <div className="flex items-start gap-3">
    <div className="p-2 rounded-lg bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-zinc-400 shrink-0">
      <Icon className="w-3.5 h-3.5" />
    </div>
    <div className="min-w-0">
      <p className="text-[10px] uppercase font-semibold text-gray-500 dark:text-zinc-400 tracking-wider">
        {label}
      </p>
      <p className="text-sm font-medium text-gray-900 dark:text-[#ececec] truncate">{value || '—'}</p>
    </div>
  </div>
);

export const EmployeeProfileModal: React.FC<EmployeeProfileModalProps> = ({ employee, isOpen, onClose }) => {
  const { data: detail, isLoading } = useGetEmployeeByIdQuery(employee?.id ?? '', {
    skip: !isOpen || !employee,
  });

  if (!isOpen || !employee) return null;

  const info = detail || employee;
  const badge = STATUS_BADGE[info.status];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in-50">
      <div
        className="w-full max-w-lg bg-white dark:bg-[#171717] rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-2xl overflow-hidden animate-in zoom-in-95"
        role="dialog"
        aria-modal="true"
        aria-labelledby="employee-profile-headline"
      >
        <div className="px-6 py-4 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between bg-gray-50/50 dark:bg-zinc-900/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 id="employee-profile-headline" className="text-base font-bold text-gray-900 dark:text-[#ececec]">
                Employee Profile
              </h2>
              <p className="text-xs text-gray-500 dark:text-zinc-400">{info.employeeCode}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant={badge.variant} size="sm" className="font-semibold text-[11px]">
              {badge.label}
            </Badge>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Identity header */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center text-lg font-extrabold shrink-0 overflow-hidden">
              {info.avatarUrl ? (
                <img
                  src={info.avatarUrl}
                  alt={`${info.firstName} ${info.lastName}`}
                  className="w-14 h-14 rounded-2xl object-cover"
                />
              ) : (
                `${info.firstName.charAt(0)}${info.lastName.charAt(0)}`.toUpperCase()
              )}
            </div>
            <div className="min-w-0">
              <h3 className="text-lg font-bold text-gray-900 dark:text-[#ececec] truncate">
                {info.firstName} {info.lastName}
              </h3>
              <p className="text-sm text-gray-500 dark:text-zinc-400 truncate">
                {info.designation?.title} • {info.department?.name}
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <SkeletonListItem key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <DetailRow icon={Mail} label="Work Email" value={info.email} />
              <DetailRow icon={Phone} label="Phone" value={info.phone} />
              <DetailRow icon={Building2} label="Department" value={info.department?.name} />
              <DetailRow icon={Briefcase} label="Designation" value={info.designation?.title} />
              <DetailRow icon={User} label="Reporting Manager" value={info.reportingManager?.name} />
              <DetailRow icon={MapPin} label="Work Location" value={info.workLocation} />
              <DetailRow icon={CalendarDays} label="Joining Date" value={formatDate(info.joiningDate)} />
              <DetailRow icon={User} label="Gender" value={info.gender} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfileModal;
