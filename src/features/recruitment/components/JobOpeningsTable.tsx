import React from 'react';
import { Briefcase, Eye, Workflow, Plus } from 'lucide-react';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { SkeletonTableRow } from '@/shared/ui/Skeleton';
import type { JobOpening, JobOpeningStatus, JobType } from '../types/recruitment.types';

interface JobOpeningsTableProps {
  jobs: JobOpening[];
  isLoading: boolean;
  onCreateJob: () => void;
  onView: (job: JobOpening) => void;
  onChangeStatus: (job: JobOpening) => void;
}

type BadgeVariant = 'brand' | 'success' | 'warning' | 'danger' | 'slate' | 'role';

const STATUS_BADGE: Record<JobOpeningStatus, { variant: BadgeVariant; label: string }> = {
  DRAFT: { variant: 'slate', label: 'Draft' },
  PUBLISHED: { variant: 'success', label: 'Published' },
  ON_HOLD: { variant: 'warning', label: 'On Hold' },
  CLOSED: { variant: 'danger', label: 'Closed' },
};

const JOB_TYPE_BADGE: Record<JobType, { variant: BadgeVariant; label: string }> = {
  FULL_TIME: { variant: 'brand', label: 'Full Time' },
  PART_TIME: { variant: 'slate', label: 'Part Time' },
  CONTRACT: { variant: 'warning', label: 'Contract' },
  INTERN: { variant: 'role', label: 'Intern' },
};

const formatSalary = (range: { min: number; max: number; currency: string }): string => {
  const fmt = (v: number) => (v >= 100000 ? `${(v / 100000).toFixed(1).replace(/\.0$/, '')}L` : `${Math.round(v / 1000)}K`);
  return `${range.currency} ${fmt(range.min)}–${fmt(range.max)}`;
};

export const JobOpeningsTable: React.FC<JobOpeningsTableProps> = ({
  jobs,
  isLoading,
  onCreateJob,
  onView,
  onChangeStatus,
}) => {
  return (
    <div className="overflow-x-auto">
      <div className="px-4 sm:px-6 py-3 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between gap-3 flex-wrap">
        <p className="text-xs text-gray-500 dark:text-zinc-400">
          {jobs.length} job{jobs.length === 1 ? '' : 's'} on this page
        </p>
        <Button
          size="sm"
          leftIcon={<Plus className="w-3.5 h-3.5" />}
          onClick={onCreateJob}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Create Job
        </Button>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-[11px] uppercase tracking-wider text-gray-500 dark:text-zinc-400 border-b border-gray-200 dark:border-zinc-800">
            <th className="text-left px-6 py-3 font-semibold">Job</th>
            <th className="text-left px-4 py-3 font-semibold">Department</th>
            <th className="text-left px-4 py-3 font-semibold">Location</th>
            <th className="text-left px-4 py-3 font-semibold">Type</th>
            <th className="text-left px-4 py-3 font-semibold">Openings / Applicants</th>
            <th className="text-left px-4 py-3 font-semibold">Salary</th>
            <th className="text-left px-4 py-3 font-semibold">Status</th>
            <th className="text-right px-6 py-3 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-zinc-800/80">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => <SkeletonTableRow key={i} columns={8} />)
          ) : jobs.length === 0 ? (
            <tr>
              <td colSpan={8}>
                <div className="py-14 text-center">
                  <div className="mx-auto w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 mb-4">
                    <Briefcase className="w-7 h-7" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-[#ececec]">
                    No job openings found
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-zinc-400 max-w-sm mx-auto">
                    Create a new requisition or adjust your search filters.
                  </p>
                </div>
              </td>
            </tr>
          ) : (
            jobs.map((job) => {
              const statusBadge = STATUS_BADGE[job.status];
              const typeBadge = JOB_TYPE_BADGE[job.jobType];
              return (
                <tr
                  key={job.id}
                  className="hover:bg-gray-50/80 dark:hover:bg-zinc-800/40 transition-colors"
                >
                  <td className="px-6 py-3.5">
                    <p className="font-semibold text-gray-900 dark:text-[#ececec]">{job.title}</p>
                    <p className="font-mono text-[10px] text-gray-500 dark:text-zinc-400 uppercase mt-0.5">
                      {job.jobCode}
                    </p>
                  </td>
                  <td className="px-4 py-3.5 text-gray-700 dark:text-zinc-300">{job.department?.name}</td>
                  <td className="px-4 py-3.5 text-gray-700 dark:text-zinc-300">{job.location}</td>
                  <td className="px-4 py-3.5">
                    <Badge variant={typeBadge.variant} size="sm" className="font-semibold text-[10px]">
                      {typeBadge.label}
                    </Badge>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="font-semibold text-gray-900 dark:text-[#ececec]">
                      {job.openingsCount}
                    </span>
                    <span className="text-gray-500 dark:text-zinc-400"> / {job.applicantsCount}</span>
                  </td>
                  <td className="px-4 py-3.5 text-gray-700 dark:text-zinc-300 whitespace-nowrap">
                    {formatSalary(job.salaryRange)}
                    <span className="block text-[10px] text-gray-400">{job.experienceRequired}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <Badge variant={statusBadge.variant} size="sm" className="font-semibold text-[11px]">
                      {statusBadge.label}
                    </Badge>
                  </td>
                  <td className="px-6 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onView(job)}
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onChangeStatus(job)}
                        title="Change status"
                      >
                        <Workflow className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default JobOpeningsTable;
