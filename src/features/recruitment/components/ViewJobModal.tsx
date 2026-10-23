import React from 'react';
import { X, Briefcase, MapPin, Users, CalendarDays, Building2, Wallet } from 'lucide-react';
import { Badge } from '@/shared/ui/Badge';
import { SkeletonListItem } from '@/shared/ui/Skeleton';
import { useGetJobByIdQuery } from '../api/recruitmentApi';
import type { JobOpening, JobOpeningStatus } from '../types/recruitment.types';

interface ViewJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: JobOpening | null;
}

type BadgeVariant = 'brand' | 'success' | 'warning' | 'danger' | 'slate' | 'role';

const STATUS_BADGE: Record<JobOpeningStatus, { variant: BadgeVariant; label: string }> = {
  DRAFT: { variant: 'slate', label: 'Draft' },
  PUBLISHED: { variant: 'success', label: 'Published' },
  ON_HOLD: { variant: 'warning', label: 'On Hold' },
  CLOSED: { variant: 'danger', label: 'Closed' },
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

export const ViewJobModal: React.FC<ViewJobModalProps> = ({ isOpen, onClose, job }) => {
  const { data: detail, isLoading } = useGetJobByIdQuery(job?.id ?? '', {
    skip: !isOpen || !job,
  });

  if (!isOpen || !job) return null;

  const info = detail || job;
  const badge = STATUS_BADGE[info.status];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in-50">
      <div
        className="w-full max-w-lg bg-white dark:bg-[#171717] rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-2xl overflow-hidden animate-in zoom-in-95"
        role="dialog"
        aria-modal="true"
        aria-labelledby="view-job-headline"
      >
        <div className="px-6 py-4 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between bg-gray-50/50 dark:bg-zinc-900/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h2 id="view-job-headline" className="text-base font-bold text-gray-900 dark:text-[#ececec]">
                {info.title}
              </h2>
              <p className="font-mono text-xs text-gray-500 dark:text-zinc-400">{info.jobCode}</p>
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
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <SkeletonListItem key={i} />
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <DetailRow icon={Building2} label="Department" value={info.department?.name} />
                <DetailRow icon={MapPin} label="Location" value={info.location} />
                <DetailRow
                  icon={Users}
                  label="Openings / Applicants"
                  value={`${info.openingsCount} opening(s) • ${info.applicantsCount} applicant(s)`}
                />
                <DetailRow
                  icon={Wallet}
                  label="Salary Range"
                  value={`${info.salaryRange.currency} ${info.salaryRange.min.toLocaleString()} – ${info.salaryRange.max.toLocaleString()}`}
                />
                <DetailRow icon={Briefcase} label="Experience" value={info.experienceRequired} />
                <DetailRow
                  icon={CalendarDays}
                  label="Target Close Date"
                  value={new Date(info.targetDate).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                />
                <DetailRow icon={Users} label="Hiring Manager" value={info.hiringManager?.name} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewJobModal;
