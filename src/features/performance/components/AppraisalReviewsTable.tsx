import React from 'react';
import { ClipboardList, Eye, PenSquare, Star } from 'lucide-react';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { SkeletonTableRow } from '@/shared/ui/Skeleton';
import type { AppraisalReview } from '../types/performance.types';

interface AppraisalReviewsTableProps {
  reviews: AppraisalReview[];
  isLoading: boolean;
  showEmployeeColumn: boolean;
  onStartReview: (review: AppraisalReview) => void;
  onViewDetails: (review: AppraisalReview) => void;
}

type BadgeVariant = 'brand' | 'success' | 'warning' | 'danger' | 'slate' | 'role';

const STATUS_BADGE: Record<string, { variant: BadgeVariant; label: string }> = {
  SELF_REVIEW_PENDING: { variant: 'warning', label: 'Self Pending' },
  MANAGER_REVIEW_PENDING: { variant: 'brand', label: 'Manager Review' },
  HR_REVIEW_PENDING: { variant: 'role', label: 'HR Review' },
  COMPLETED: { variant: 'success', label: 'Completed' },
  PENDING: { variant: 'warning', label: 'Pending' },
  IN_PROGRESS: { variant: 'brand', label: 'In Progress' },
};

const formatDueDate = (dateStr?: string | null): string => {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return dateStr;
  }
};

const RatingCell: React.FC<{ value?: number }> = ({ value }) => {
  if (value === undefined || value === null || Number.isNaN(value) || value <= 0) {
    return <span className="text-gray-400 dark:text-zinc-500">—</span>;
  }
  return (
    <span className="inline-flex items-center gap-1 font-semibold text-gray-900 dark:text-[#ececec]">
      <Star className="w-3.5 h-3.5 text-amber-400" fill="currentColor" />
      {value.toFixed(1)}
    </span>
  );
};

export const AppraisalReviewsTable: React.FC<AppraisalReviewsTableProps> = ({
  reviews,
  isLoading,
  showEmployeeColumn,
  onStartReview,
  onViewDetails,
}) => {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#171717] overflow-hidden shadow-sm">
      <div className="p-4 md:p-6 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-[#ececec] flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-indigo-600" />
            Appraisal Reviews
          </h2>
          <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
            Live review assignments synced with the performance engine
          </p>
        </div>
        <Badge variant="brand" size="sm" className="font-semibold text-[11px]">
          {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
        </Badge>
      </div>

      {reviews.length === 0 && !isLoading ? (
        <div className="p-12 text-center">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4">
            <ClipboardList className="w-7 h-7" />
          </div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-[#ececec]">
            No appraisal reviews found
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-zinc-400 max-w-sm mx-auto">
            Adjust your filters or scope. New review assignments appear here as cycles open.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs md:text-sm">
            <thead className="bg-gray-50 dark:bg-zinc-800/60 text-gray-600 dark:text-zinc-400 text-xs uppercase tracking-wider font-semibold border-b border-gray-200 dark:border-zinc-800">
              <tr>
                {showEmployeeColumn && <th className="px-4 py-3">Employee</th>}
                <th className="px-4 py-3">Review Cycle</th>
                <th className="px-4 py-3">Self</th>
                <th className="px-4 py-3">Manager</th>
                <th className="px-4 py-3">Final</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Due Date</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-zinc-800/80">
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <SkeletonTableRow key={i} columns={showEmployeeColumn ? 8 : 7} />
                  ))
                : reviews.map((review) => {
                    const badge = STATUS_BADGE[review.status] || {
                      variant: review.status === 'COMPLETED' ? 'success' : 'brand',
                      label: review.status ? review.status.replace(/_/g, ' ') : 'Pending',
                    };
                    const isActionable = review.status !== 'COMPLETED';
                    const empName = review.employee?.name || review.employeeName || 'Employee';
                    const empAvatar = review.employee?.avatarUrl || review.avatarUrl;
                    const empMeta = [
                      review.employee?.designation || review.designation,
                      review.employee?.department || review.department,
                    ]
                      .filter(Boolean)
                      .join(' • ') || 'Employee';
                    const cycle = review.cycleName || review.reviewCycle || 'Annual 2026';

                    return (
                      <tr key={review.id} className="hover:bg-gray-50/80 dark:hover:bg-zinc-800/40 transition-colors">
                        {showEmployeeColumn && (
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-bold shrink-0">
                                {empAvatar ? (
                                  <img
                                    src={empAvatar}
                                    alt={empName}
                                    className="w-8 h-8 rounded-full object-cover"
                                  />
                                ) : (
                                  empName.charAt(0).toUpperCase()
                                )}
                              </div>
                              <div className="min-w-0">
                                <div className="font-semibold text-gray-900 dark:text-[#ececec] truncate">
                                  {empName}
                                </div>
                                <div className="text-[11px] text-gray-500 dark:text-zinc-400 truncate">
                                  {empMeta}
                                </div>
                              </div>
                            </div>
                          </td>
                        )}
                        <td className="px-4 py-3.5 font-medium text-gray-700 dark:text-zinc-300 whitespace-nowrap">
                          {cycle}
                        </td>
                        <td className="px-4 py-3.5">
                          <RatingCell value={review.selfRating} />
                        </td>
                        <td className="px-4 py-3.5">
                          <RatingCell value={review.managerRating ?? review.overallRating ?? review.rating} />
                        </td>
                        <td className="px-4 py-3.5">
                          <RatingCell value={review.finalScore ?? review.overallRating ?? review.rating} />
                        </td>
                        <td className="px-4 py-3.5">
                          <Badge variant={badge.variant} size="sm" className="font-semibold text-[11px]">
                            {badge.label}
                          </Badge>
                        </td>
                        <td className="px-4 py-3.5 text-gray-700 dark:text-zinc-300 whitespace-nowrap">
                          {formatDueDate(review.dueDate)}
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            {isActionable && (
                              <Button
                                size="sm"
                                variant="primary"
                                onClick={() => onStartReview(review)}
                                className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white"
                              >
                                <PenSquare className="w-3.5 h-3.5 mr-1" />
                                Start Review
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => onViewDetails(review)}
                              className="text-xs text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                            >
                              <Eye className="w-3.5 h-3.5 mr-1" />
                              View Details
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

export default AppraisalReviewsTable;
