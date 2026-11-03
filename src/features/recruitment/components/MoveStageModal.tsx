/**
 * @file MoveStageModal.tsx
 * @description Accessible dialog allowing recruiters to transition candidates between workflow stages.
 * Displays candidate context, current stage badge, stage dropdown selector, and error alerts.
 */

import React, { useState, useEffect } from 'react';
import { X, ArrowRight, AlertCircle, CheckCircle2, Workflow } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import { useToast } from '@/shared/ui/Toast';
import { useMoveApplicationStage } from '../api/atsApi';
import type { ApplicationItem, ApplicationStage } from '../types/ats.types';

interface MoveStageModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: ApplicationItem | null;
  onSuccess?: (updated: ApplicationItem) => void;
}

interface StageOption {
  value: ApplicationStage;
  label: string;
  category: 'Screening' | 'Interview' | 'Offer' | 'Archived';
}

const STAGE_OPTIONS: StageOption[] = [
  { value: 'APPLIED', label: 'Applied (Initial Submission)', category: 'Screening' },
  { value: 'UNDER_REVIEW', label: 'Under Review (Screening / Resume Check)', category: 'Screening' },
  { value: 'SHORTLISTED', label: 'Shortlisted for Process', category: 'Screening' },
  { value: 'INTERVIEW_SCHEDULED', label: 'Interview Scheduled', category: 'Interview' },
  { value: 'INTERVIEW_COMPLETED', label: 'Interview Completed', category: 'Interview' },
  { value: 'SELECTED', label: 'Selected by Hiring Panel', category: 'Interview' },
  { value: 'OFFER_SENT', label: 'Offer Letter Released', category: 'Offer' },
  { value: 'OFFER_ACCEPTED', label: 'Offer Accepted', category: 'Offer' },
  { value: 'EMPLOYEE_CREATED', label: 'Hired & Onboarded (Employee Created)', category: 'Offer' },
  { value: 'OFFER_REJECTED', label: 'Offer Declined by Candidate', category: 'Archived' },
  { value: 'HOLD', label: 'Application on Hold', category: 'Archived' },
  { value: 'REJECTED', label: 'Rejected', category: 'Archived' },
];

export const MoveStageModal: React.FC<MoveStageModalProps> = ({
  isOpen,
  onClose,
  application,
  onSuccess,
}) => {
  const toast = useToast();
  const { mutateAsync, isPending, error } = useMoveApplicationStage();
  const [targetStage, setTargetStage] = useState<ApplicationStage>('SHORTLISTED');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (application && isOpen) {
      setTargetStage(application.status);
      setErrorMessage(null);
    }
  }, [application, isOpen]);

  if (!isOpen || !application) return null;

  const candidateFullName = `${application.first_name || ''} ${application.last_name || ''}`.trim() || 'Candidate';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (targetStage === application.status) {
      onClose();
      return;
    }

    setErrorMessage(null);
    try {
      const updated = await mutateAsync({
        id: application.id,
        stage: targetStage,
      });

      toast.success(
        `${candidateFullName} moved to ${targetStage.replace(/_/g, ' ')}.`,
        'Stage Updated'
      );
      if (onSuccess) onSuccess(updated);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update application stage.';
      setErrorMessage(msg);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in-50">
      <div
        className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200/80 dark:border-zinc-800 shadow-2xl overflow-hidden animate-in zoom-in-95 flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="move-stage-title"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200/80 dark:border-zinc-800 flex items-center justify-between bg-slate-50/50 dark:bg-zinc-900/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center border border-teal-500/20">
              <Workflow className="w-5 h-5" />
            </div>
            <div>
              <h2 id="move-stage-title" className="text-base font-bold text-slate-900 dark:text-white">
                Move Candidate Stage
              </h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Transition applicant across hiring pipeline
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Candidate Context Card */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-zinc-800/40 border border-slate-200/70 dark:border-zinc-800 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 dark:text-white text-sm">
                {candidateFullName}
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-zinc-700 text-slate-700 dark:text-zinc-300">
                Current: {application.status}
              </span>
            </div>
            <p className="text-slate-500 dark:text-zinc-400 text-[11px]">
              Applied for: <span className="font-medium text-slate-700 dark:text-zinc-300">{application.job?.title || 'Open Position'}</span>
            </p>
          </div>

          {/* Target Stage Select */}
          <div>
            <label htmlFor="target-stage-select" className="block font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">
              Select Target Stage
            </label>
            <select
              id="target-stage-select"
              value={targetStage}
              onChange={(e) => setTargetStage(e.target.value as ApplicationStage)}
              className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {STAGE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Error Banner */}
          {(errorMessage || error) && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 flex items-center gap-2.5 text-rose-700 dark:text-rose-300">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <p className="text-[11px] leading-tight">
                {errorMessage || error?.message || 'Failed to move candidate.'}
              </p>
            </div>
          )}

          {/* Modal Footer */}
          <div className="pt-3 border-t border-slate-200/80 dark:border-zinc-800 flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              type="submit"
              disabled={isPending || targetStage === application.status}
              className="bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs gap-1.5"
            >
              <span>{isPending ? 'Updating...' : 'Confirm Stage Move'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
