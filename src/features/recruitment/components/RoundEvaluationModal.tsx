/**
 * @file RoundEvaluationModal.tsx
 * @description Dialog for submitting candidate scorecard, interviewer evaluation, and round decision.
 * Connects to:
 * - PATCH /api/v1/interviews/rounds/{round_id}/pass
 * - PATCH /api/v1/interviews/rounds/{round_id}/reject
 * - PATCH /api/v1/interviews/rounds/{round_id}/hold
 */

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  X,
  Star,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  User,
  Award,
  FileText,
} from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { useToast } from '@/shared/ui/Toast';
import { useAuth } from '@/features/auth/hooks/useAuth';
import {
  roundEvaluationSchema,
  type RoundEvaluationFormData,
} from '../schemas/interviewScheduler.schema';
import { interviewSchedulerClient } from '../api/interviewSchedulerApi';
import type { InterviewEvaluationDecision } from '../types/interviewScheduler.types';

interface RoundEvaluationModalProps {
  isOpen: boolean;
  onClose: () => void;
  roundId: string;
  roundName: string;
  candidateName?: string;
  jobTitle?: string;
  onSuccess?: (decision: InterviewEvaluationDecision) => void;
}

const SCORE_PRESETS = [
  { label: '1/5 Poor', value: '1/5' },
  { label: '2/5 Below Avg', value: '2/5' },
  { label: '3/5 Average', value: '3/5' },
  { label: '4/5 Strong', value: '4/5' },
  { label: '4.5/5 Excellent', value: '4.5/5' },
  { label: '5/5 Outstanding', value: '5/5' },
];

export const RoundEvaluationModal: React.FC<RoundEvaluationModalProps> = ({
  isOpen,
  onClose,
  roundId,
  roundName,
  candidateName,
  jobTitle,
  onSuccess,
}) => {
  const toast = useToast();
  const { user } = useAuth();
  const [activeDecision, setActiveDecision] = useState<InterviewEvaluationDecision | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const defaultInterviewerName = user?.name || user?.email?.split('@')[0] || '';

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RoundEvaluationFormData>({
    resolver: zodResolver(roundEvaluationSchema),
    defaultValues: {
      interviewer_name: defaultInterviewerName,
      score: '4/5',
      feedback: '',
    },
  });

  const selectedScore = watch('score');

  if (!isOpen) return null;

  const handleDecisionSubmit = async (
    decision: InterviewEvaluationDecision,
    data: RoundEvaluationFormData
  ) => {
    setActiveDecision(decision);
    setSubmitError(null);
    try {
      await interviewSchedulerClient.submitRoundDecision(roundId, decision, {
        interviewer_name: data.interviewer_name,
        score: data.score,
        feedback: data.feedback,
      });

      const decisionLabels: Record<InterviewEvaluationDecision, string> = {
        pass: 'passed and advanced to next round',
        reject: 'marked as rejected',
        hold: 'placed on evaluation hold',
      };

      toast.success(
        `Round evaluation submitted. Candidate ${decisionLabels[decision]}.`,
        'Evaluation Recorded'
      );

      if (onSuccess) onSuccess(decision);
      onClose();
    } catch (err: any) {
      const msg = err?.message || 'Failed to submit round evaluation decision.';
      setSubmitError(msg);
      toast.error(msg, 'Evaluation Error');
    } finally {
      setActiveDecision(null);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="evaluation-modal-title"
    >
      <div className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-2xl overflow-hidden animate-in zoom-in-95">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between bg-gradient-to-r from-teal-500/10 via-sky-500/10 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-md shadow-teal-600/20">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2
                id="evaluation-modal-title"
                className="text-base font-bold text-gray-900 dark:text-zinc-100"
              >
                Round Evaluation & Scorecard
              </h2>
              <p className="text-xs text-gray-500 dark:text-zinc-400">
                {candidateName ? `${candidateName} • ` : ''}
                <span className="font-semibold text-teal-600 dark:text-teal-400">
                  {roundName}
                </span>
                {jobTitle ? ` (${jobTitle})` : ''}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5">
          {submitError && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-medium">
              {submitError}
            </div>
          )}

          {/* Interviewer Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-800 dark:text-zinc-200 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-teal-600" />
              Interviewer Name
            </label>
            <input
              type="text"
              placeholder="e.g. Siddharth Verma"
              {...register('interviewer_name')}
              className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            {errors.interviewer_name && (
              <p className="text-xs text-rose-500 font-medium">
                {errors.interviewer_name.message}
              </p>
            )}
          </div>

          {/* Rating / Score Presets & Custom */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-gray-800 dark:text-zinc-200 flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                Scorecard Rating
              </label>
              <span className="text-[11px] text-gray-400 font-medium">
                Current: <span className="font-bold text-teal-600">{selectedScore || 'None'}</span>
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {SCORE_PRESETS.map((preset) => {
                const isActive = selectedScore === preset.value;
                return (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => setValue('score', preset.value, { shouldValidate: true })}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all text-center ${
                      isActive
                        ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                        : 'bg-white dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 border-gray-200 dark:border-zinc-700 hover:border-amber-400 hover:bg-amber-50/40'
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>

            <input
              type="text"
              placeholder="Custom score (e.g. 4.2/5 or 85/100)"
              {...register('score')}
              className="w-full mt-1 px-3.5 py-2 rounded-xl text-xs border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            {errors.score && (
              <p className="text-xs text-rose-500 font-medium">
                {errors.score.message}
              </p>
            )}
          </div>

          {/* Detailed Feedback */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-800 dark:text-zinc-200 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-teal-600" />
              Detailed Feedback Notes
            </label>
            <textarea
              rows={4}
              placeholder="Detailed candidate evaluation: technical competence, problem-solving depth, architecture considerations, communication skills, and hiring recommendation..."
              {...register('feedback')}
              className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            {errors.feedback && (
              <p className="text-xs text-rose-500 font-medium">
                {errors.feedback.message}
              </p>
            )}
          </div>

          {/* Decision Buttons (Pass / Reject / Hold) */}
          <div className="pt-3 border-t border-gray-100 dark:border-zinc-800">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-zinc-400 mb-2.5">
              Submit Round Outcome
            </p>
            <div className="grid grid-cols-3 gap-2.5">
              {/* Green: Pass Round */}
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmit((data) => handleDecisionSubmit('pass', data))}
                className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all disabled:opacity-50"
              >
                {activeDecision === 'pass' ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-4 h-4" />
                )}
                Pass Round
              </button>

              {/* Amber: Hold */}
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmit((data) => handleDecisionSubmit('hold', data))}
                className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-sm transition-all disabled:opacity-50"
              >
                {activeDecision === 'hold' ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Clock className="w-4 h-4" />
                )}
                Put on Hold
              </button>

              {/* Red: Reject */}
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmit((data) => handleDecisionSubmit('reject', data))}
                className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-sm transition-all disabled:opacity-50"
              >
                {activeDecision === 'reject' ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <XCircle className="w-4 h-4" />
                )}
                Reject
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

