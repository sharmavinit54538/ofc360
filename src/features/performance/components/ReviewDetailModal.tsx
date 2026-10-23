import React from 'react';
import { X, ClipboardList, Star, MessageSquareQuote } from 'lucide-react';
import { Badge } from '@/shared/ui/Badge';
import { SkeletonListItem } from '@/shared/ui/Skeleton';
import { cn } from '@/shared/lib/utils';
import { useGetReviewByIdQuery } from '../api/performanceApi';
import type { AppraisalReview, ReviewStatus } from '../types/performance.types';

interface ReviewDetailModalProps {
  review: AppraisalReview | null;
  isOpen: boolean;
  onClose: () => void;
}

type BadgeVariant = 'brand' | 'success' | 'warning' | 'danger' | 'slate' | 'role';

const STATUS_BADGE: Record<ReviewStatus, { variant: BadgeVariant; label: string }> = {
  SELF_REVIEW_PENDING: { variant: 'warning', label: 'Self Pending' },
  MANAGER_REVIEW_PENDING: { variant: 'brand', label: 'Manager Review' },
  HR_REVIEW_PENDING: { variant: 'role', label: 'HR Review' },
  COMPLETED: { variant: 'success', label: 'Completed' },
};

const RatingStars: React.FC<{ value: number }> = ({ value }) => (
  <span className="inline-flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        className={cn('w-3.5 h-3.5', star <= Math.round(value) ? 'text-amber-400' : 'text-gray-300 dark:text-zinc-600')}
        fill="currentColor"
      />
    ))}
    <span className="ml-1.5 text-xs font-bold text-gray-900 dark:text-[#ececec]">
      {value.toFixed(1)}
    </span>
  </span>
);

export const ReviewDetailModal: React.FC<ReviewDetailModalProps> = ({ review, isOpen, onClose }) => {
  const { data: detail, isLoading } = useGetReviewByIdQuery(review?.id ?? '', {
    skip: !isOpen || !review,
  });

  if (!isOpen || !review) return null;

  const badge = STATUS_BADGE[review.status];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in-50">
      <div
        className="w-full max-w-2xl bg-white dark:bg-[#171717] rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-2xl overflow-hidden animate-in zoom-in-95"
        role="dialog"
        aria-modal="true"
        aria-labelledby="review-detail-headline"
      >
        <div className="px-6 py-4 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between bg-gray-50/50 dark:bg-zinc-900/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <ClipboardList className="w-5 h-5" />
            </div>
            <div>
              <h2 id="review-detail-headline" className="text-base font-bold text-gray-900 dark:text-[#ececec]">
                Appraisal Review Detail
              </h2>
              <p className="text-xs text-gray-500 dark:text-zinc-400">
                {review.employee.name} • {review.cycleName}
              </p>
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
          {/* Rating summary */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Self Rating', value: detail?.selfRating ?? review.selfRating },
              { label: 'Manager Rating', value: detail?.managerRating ?? review.managerRating },
              { label: 'Final Score', value: detail?.finalScore ?? review.finalScore },
            ].map((tile) => (
              <div
                key={tile.label}
                className="rounded-xl bg-gray-50 dark:bg-zinc-900/60 border border-gray-100 dark:border-zinc-800 p-3 text-center"
              >
                <p className="text-[10px] uppercase font-semibold text-gray-500 dark:text-zinc-400 tracking-wider">
                  {tile.label}
                </p>
                <div className="mt-1.5 flex justify-center">
                  {tile.value !== undefined && tile.value !== null ? (
                    <RatingStars value={tile.value} />
                  ) : (
                    <span className="text-sm text-gray-400 dark:text-zinc-500">—</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Competency breakdown */}
          <div className="space-y-2.5">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-[#ececec]">
              Competency Breakdown
            </h3>
            {isLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <SkeletonListItem key={i} />
                ))}
              </div>
            ) : detail?.ratings?.length ? (
              <div className="space-y-2">
                {detail.ratings.map((rating) => (
                  <div
                    key={rating.competencyId}
                    className="rounded-xl border border-gray-200 dark:border-zinc-800 p-3.5 bg-gray-50/60 dark:bg-zinc-900/50"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm font-semibold text-gray-900 dark:text-[#ececec]">
                        {rating.name}
                      </span>
                      <RatingStars value={rating.rating} />
                    </div>
                    {rating.comments && (
                      <p className="mt-1.5 text-xs text-gray-500 dark:text-zinc-400 flex items-start gap-1.5">
                        <MessageSquareQuote className="w-3.5 h-3.5 mt-0.5 shrink-0 text-gray-400" />
                        {rating.comments}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-gray-300 dark:border-zinc-700 p-6 text-center">
                <p className="text-xs text-gray-500 dark:text-zinc-400">
                  Competency-level ratings will appear here once the review is submitted.
                </p>
              </div>
            )}
          </div>

          {/* Narrative sections */}
          {(detail?.strengths || detail?.areasOfImprovement || detail?.managerComments) && (
            <div className="space-y-3">
              {detail?.strengths && (
                <div className="rounded-xl border border-emerald-200/60 dark:border-emerald-800/50 bg-emerald-500/5 p-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                    Key Strengths
                  </h4>
                  <p className="mt-1.5 text-sm text-gray-700 dark:text-zinc-300 leading-relaxed">
                    {detail.strengths}
                  </p>
                </div>
              )}
              {detail?.areasOfImprovement && (
                <div className="rounded-xl border border-amber-200/60 dark:border-amber-800/50 bg-amber-500/5 p-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">
                    Areas of Improvement
                  </h4>
                  <p className="mt-1.5 text-sm text-gray-700 dark:text-zinc-300 leading-relaxed">
                    {detail.areasOfImprovement}
                  </p>
                </div>
              )}
              {detail?.managerComments && (
                <div className="rounded-xl border border-indigo-200/60 dark:border-indigo-800/50 bg-indigo-500/5 p-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
                    Manager Comments
                  </h4>
                  <p className="mt-1.5 text-sm text-gray-700 dark:text-zinc-300 leading-relaxed">
                    {detail.managerComments}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewDetailModal;
