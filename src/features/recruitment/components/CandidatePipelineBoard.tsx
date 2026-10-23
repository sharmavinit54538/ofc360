import React from 'react';
import { Users, FileText, Workflow, Star } from 'lucide-react';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { SkeletonListItem } from '@/shared/ui/Skeleton';
import type { CandidateItem, CandidateStage } from '../types/recruitment.types';

interface CandidatePipelineBoardProps {
  candidates: CandidateItem[];
  isLoading: boolean;
  onMoveStage: (candidate: CandidateItem) => void;
}

type BadgeVariant = 'brand' | 'success' | 'warning' | 'danger' | 'slate' | 'role';

const STAGE_BADGE: Record<CandidateStage, { variant: BadgeVariant; label: string }> = {
  APPLIED: { variant: 'slate', label: 'Applied' },
  SCREENING: { variant: 'brand', label: 'Screening' },
  INTERVIEW: { variant: 'warning', label: 'Interview' },
  OFFERED: { variant: 'role', label: 'Offered' },
  HIRED: { variant: 'success', label: 'Hired' },
  REJECTED: { variant: 'danger', label: 'Rejected' },
};

const RatingStars: React.FC<{ rating?: number }> = ({ rating }) => {
  if (rating === undefined) return <span className="text-xs text-gray-400">Not rated</span>;
  const rounded = Math.round(rating);
  return (
    <span className="flex items-center gap-0.5" title={`${rating.toFixed(1)} / 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-3 h-3 ${i < rounded ? 'text-amber-400 fill-amber-400' : 'text-gray-300 dark:text-zinc-600'}`}
        />
      ))}
    </span>
  );
};

export const CandidatePipelineBoard: React.FC<CandidatePipelineBoardProps> = ({
  candidates,
  isLoading,
  onMoveStage,
}) => {
  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonListItem key={i} />
        ))}
      </div>
    );
  }

  if (candidates.length === 0) {
    return (
      <div className="py-16 text-center">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 mb-4">
          <Users className="w-7 h-7" />
        </div>
        <h3 className="text-base font-semibold text-gray-900 dark:text-[#ececec]">
          No candidates in this slice of the pipeline
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-zinc-400 max-w-sm mx-auto">
          Add a candidate or relax the stage and job filters.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {candidates.map((candidate) => {
        const stage = STAGE_BADGE[candidate.currentStage];
        return (
          <div
            key={candidate.id}
            className="rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#171717] p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-extrabold shrink-0">
                  {candidate.fullName
                    .split(' ')
                    .filter(Boolean)
                    .slice(0, 2)
                    .map((part) => part.charAt(0).toUpperCase())
                    .join('')}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-gray-900 dark:text-[#ececec] truncate">
                    {candidate.fullName}
                  </p>
                  <p className="text-[11px] text-gray-500 dark:text-zinc-400 truncate">
                    {candidate.appliedJob?.title}
                  </p>
                </div>
              </div>
              <Badge variant={stage.variant} size="sm" className="font-semibold text-[10px] shrink-0">
                {stage.label}
              </Badge>
            </div>

            <div className="mt-3 space-y-1.5 text-xs text-gray-600 dark:text-zinc-400">
              <div className="flex items-center justify-between gap-2">
                <span className="truncate">{candidate.email}</span>
                <RatingStars rating={candidate.overallRating} />
              </div>
              <p>
                {candidate.experienceYears} yrs exp • {candidate.noticePeriodDays}d notice
                {candidate.currentCompany ? ` • ${candidate.currentCompany}` : ''}
              </p>
              <p className="text-[10px] text-gray-400 dark:text-zinc-500">
                Applied {new Date(candidate.appliedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-end gap-1">
              {candidate.resumeUrl ? (
                <a
                  href={candidate.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Preview resume"
                  className="p-1.5 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors"
                >
                  <FileText className="w-4 h-4" />
                </a>
              ) : (
                <span className="p-1.5 text-gray-300 dark:text-zinc-700" title="No resume uploaded">
                  <FileText className="w-4 h-4" />
                </span>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onMoveStage(candidate)}
                title="Move stage"
              >
                <Workflow className="w-4 h-4" />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CandidatePipelineBoard;
