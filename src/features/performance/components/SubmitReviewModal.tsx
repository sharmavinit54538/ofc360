import React, { useEffect, useMemo } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, PenSquare, Plus, Trash2, Star } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { Textarea } from '@/shared/ui/Textarea';
import { useToast } from '@/shared/ui/Toast';
import { SkeletonListItem } from '@/shared/ui/Skeleton';
import { cn } from '@/shared/lib/utils';
import { useGetReviewByIdQuery, useSubmitReviewMutation } from '../api/performanceApi';
import { submitReviewSchema, type SubmitReviewFormData } from '../schemas/performance.schemas';
import type { AppraisalReview, ReviewRole, ReviewStatus } from '../types/performance.types';

interface SubmitReviewModalProps {
  review: AppraisalReview | null;
  isOpen: boolean;
  onClose: () => void;
}

const ROLE_BY_STATUS: Partial<Record<ReviewStatus, ReviewRole>> = {
  SELF_REVIEW_PENDING: 'SELF',
  MANAGER_REVIEW_PENDING: 'MANAGER',
  HR_REVIEW_PENDING: 'HR',
};

const NEXT_STATUS: Record<ReviewRole, ReviewStatus> = {
  SELF: 'MANAGER_REVIEW_PENDING',
  MANAGER: 'HR_REVIEW_PENDING',
  HR: 'COMPLETED',
};

const ROLE_LABELS: Record<ReviewRole, string> = {
  SELF: 'Self Review',
  MANAGER: 'Manager Review',
  HR: 'HR Calibration',
};

export const SubmitReviewModal: React.FC<SubmitReviewModalProps> = ({ review, isOpen, onClose }) => {
  const toast = useToast();
  const role: ReviewRole = review ? ROLE_BY_STATUS[review.status] ?? 'SELF' : 'SELF';

  const { data: detail, isLoading: isDetailLoading } = useGetReviewByIdQuery(review?.id ?? '', {
    skip: !isOpen || !review,
  });
  const [submitReview, { isLoading: isSubmitting }] = useSubmitReviewMutation();

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SubmitReviewFormData>({
    resolver: zodResolver(submitReviewSchema),
    defaultValues: {
      role,
      ratings: [],
      overallRating: 3,
      strengths: '',
      areasOfImprovement: '',
      recommendedPromotion: false,
      status: NEXT_STATUS[role],
    },
  });

  const { fields, append, remove, replace } = useFieldArray({ control, name: 'ratings' });

  // Hydrate competency rows from the live review detail when it arrives
  useEffect(() => {
    if (!isOpen || !review) return;
    reset({
      role,
      ratings: [],
      overallRating: 3,
      strengths: detail?.strengths ?? '',
      areasOfImprovement: detail?.areasOfImprovement ?? '',
      recommendedPromotion: false,
      status: NEXT_STATUS[role],
    });
    if (detail?.ratings?.length) {
      replace(
        detail.ratings.map((r) => ({
          competencyId: r.competencyId,
          name: r.name,
          rating: r.rating || 3,
          comments: r.comments || '',
        }))
      );
    }
  }, [isOpen, review, detail, reset, replace, role]);

  // Keep the overall rating derived from competency ratings
  const watchRatings = watch('ratings');
  const computedOverall = useMemo(() => {
    const rated = (watchRatings || []).filter((r) => Number(r.rating) >= 1);
    if (!rated.length) return 0;
    const avg = rated.reduce((sum, r) => sum + Number(r.rating), 0) / rated.length;
    return Math.round(avg * 10) / 10;
  }, [watchRatings]);

  useEffect(() => {
    if (computedOverall >= 1) {
      setValue('overallRating', computedOverall, { shouldValidate: true });
    }
  }, [computedOverall, setValue]);

  if (!isOpen || !review) return null;

  const addCompetencyRow = () => {
    append({
      competencyId: `custom-${Date.now()}-${fields.length}`,
      name: '',
      rating: 3,
      comments: '',
    });
  };

  const onSubmit = async (data: SubmitReviewFormData) => {
    try {
      await submitReview({
        id: review.id,
        data: {
          role,
          ratings: data.ratings.map((r) => ({
            competencyId: r.competencyId,
            name: r.name,
            rating: Number(r.rating),
            comments: r.comments ?? '',
          })),
          overallRating: Number(data.overallRating),
          strengths: data.strengths,
          areasOfImprovement: data.areasOfImprovement,
          recommendedPromotion: data.recommendedPromotion || undefined,
          status: NEXT_STATUS[role],
        },
      }).unwrap();
      toast.success(`${ROLE_LABELS[role]} submitted successfully.`, 'Review Submitted');
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to submit the review.', 'Submission Error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in-50">
      <div
        className="w-full max-w-2xl bg-white dark:bg-[#171717] rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-2xl overflow-hidden animate-in zoom-in-95"
        role="dialog"
        aria-modal="true"
        aria-labelledby="submit-review-headline"
      >
        <div className="px-6 py-4 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between bg-gray-50/50 dark:bg-zinc-900/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <PenSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 id="submit-review-headline" className="text-base font-bold text-gray-900 dark:text-[#ececec]">
                {ROLE_LABELS[role]}
              </h2>
              <p className="text-xs text-gray-500 dark:text-zinc-400">
                {review.employee.name} • {review.cycleName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 text-sm font-bold text-gray-900 dark:text-[#ececec]">
              <Star className="w-4 h-4 text-amber-400" fill="currentColor" />
              {computedOverall > 0 ? computedOverall.toFixed(1) : '—'}
              <span className="text-xs font-medium text-gray-400">overall</span>
            </span>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Competency ratings */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-[#ececec]">
                Competency Ratings
              </h3>
              <Button type="button" variant="ghost" size="sm" onClick={addCompetencyRow} className="text-xs">
                <Plus className="w-3.5 h-3.5 mr-1" />
                Add Competency
              </Button>
            </div>

            {isDetailLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <SkeletonListItem key={i} />
                ))}
              </div>
            ) : fields.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-300 dark:border-zinc-700 p-6 text-center">
                <p className="text-xs text-gray-500 dark:text-zinc-400">
                  No competencies are configured for this review yet. Add one to begin rating.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="rounded-xl border border-gray-200 dark:border-zinc-800 p-3.5 space-y-2.5 bg-gray-50/60 dark:bg-zinc-900/50"
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <Input
                          placeholder="Competency name (e.g. Communication)"
                          error={errors.ratings?.[index]?.name?.message}
                          {...register(`ratings.${index}.name`)}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors shrink-0"
                        aria-label="Remove competency"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => {
                        const current = Number(watch(`ratings.${index}.rating`) ?? 0);
                        return (
                          <button
                            key={star}
                            type="button"
                            onClick={() =>
                              setValue(`ratings.${index}.rating`, star, { shouldValidate: true })
                            }
                            className="p-0.5 transition-transform hover:scale-110"
                            aria-label={`Rate ${star} of 5`}
                          >
                            <Star
                              className={cn(
                                'w-5 h-5',
                                star <= current
                                  ? 'text-amber-400'
                                  : 'text-gray-300 dark:text-zinc-600'
                              )}
                              fill="currentColor"
                            />
                          </button>
                        );
                      })}
                      {errors.ratings?.[index]?.rating && (
                        <span className="ml-2 text-xs text-rose-500">
                          {errors.ratings[index]?.rating?.message}
                        </span>
                      )}
                    </div>

                    <Input
                      placeholder="Comments (optional)"
                      error={errors.ratings?.[index]?.comments?.message}
                      {...register(`ratings.${index}.comments`)}
                    />
                  </div>
                ))}
              </div>
            )}
            {errors.ratings?.root?.message && (
              <p className="text-xs text-rose-500">{errors.ratings.root.message}</p>
            )}
            {typeof errors.ratings?.message === 'string' && (
              <p className="text-xs text-rose-500">{errors.ratings.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="review-strengths" className="text-xs font-semibold text-gray-900 dark:text-[#ececec]">
              Key Strengths
            </label>
            <Textarea
              id="review-strengths"
              placeholder="Describe demonstrated strengths, wins, and standout contributions..."
              rows={3}
              error={Boolean(errors.strengths)}
              {...register('strengths')}
            />
            {errors.strengths?.message && (
              <p className="text-xs text-rose-500">{errors.strengths.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="review-improvements" className="text-xs font-semibold text-gray-900 dark:text-[#ececec]">
              Areas of Improvement
            </label>
            <Textarea
              id="review-improvements"
              placeholder="Describe growth areas, skill gaps, and recommended development actions..."
              rows={3}
              error={Boolean(errors.areasOfImprovement)}
              {...register('areasOfImprovement')}
            />
            {errors.areasOfImprovement?.message && (
              <p className="text-xs text-rose-500">{errors.areasOfImprovement.message}</p>
            )}
          </div>

          <label className="flex items-center gap-2.5 text-xs font-semibold text-gray-900 dark:text-[#ececec] cursor-pointer select-none">
            <input
              type="checkbox"
              {...register('recommendedPromotion')}
              className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            Recommend for promotion consideration
          </label>

          <input type="hidden" {...register('overallRating', { valueAsNumber: true })} />
          {errors.overallRating?.message && (
            <p className="text-xs text-rose-500">{errors.overallRating.message}</p>
          )}

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100 dark:border-zinc-800">
            <Button type="button" variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isSubmitting}
              disabled={isSubmitting || fields.length === 0}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Submit {ROLE_LABELS[role]}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitReviewModal;
