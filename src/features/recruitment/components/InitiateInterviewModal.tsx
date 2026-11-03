/**
 * @file InitiateInterviewModal.tsx
 * @description Dialog to configure interview rounds and initiate candidate interview process.
 * Connects to: POST /api/v1/applications/{application_id}/send-interview
 */

import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Trash2,
  CalendarCheck2,
  Loader2,
  Layers,
  Sparkles,
  User,
} from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { useToast } from '@/shared/ui/Toast';
import { interviewSchedulerClient } from '../api/interviewSchedulerApi';

export interface ApplicantOption {
  id: string;
  first_name: string;
  last_name: string;
  job_title?: string;
  department?: string;
}

interface InitiateInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicationId?: string;
  candidateName?: string;
  jobTitle?: string;
  availableApplications?: ApplicantOption[];
  onSuccess?: (interviewId: string) => void;
}

const PRESET_ROUNDS = [
  'Screening Round',
  'Technical Round 1',
  'Technical Round 2',
  'System Design',
  'Managerial Round',
  'HR Round',
  'Cultural Fit',
];

export const InitiateInterviewModal: React.FC<InitiateInterviewModalProps> = ({
  isOpen,
  onClose,
  applicationId: initialAppId,
  candidateName: initialCandidateName,
  jobTitle: initialJobTitle,
  availableApplications = [],
  onSuccess,
}) => {
  const toast = useToast();
  const [selectedAppId, setSelectedAppId] = useState<string>(initialAppId || '');
  const [rounds, setRounds] = useState<string[]>([
    'Technical Round 1',
    'HR Round',
  ]);
  const [customRound, setCustomRound] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (initialAppId) {
      setSelectedAppId(initialAppId);
    } else if (availableApplications.length > 0 && !selectedAppId) {
      setSelectedAppId(availableApplications[0].id);
    }
  }, [initialAppId, availableApplications, selectedAppId]);

  if (!isOpen) return null;

  const currentSelectedApp = availableApplications.find((a) => a.id === selectedAppId);
  const effectiveCandidateName =
    initialCandidateName ||
    (currentSelectedApp ? `${currentSelectedApp.first_name} ${currentSelectedApp.last_name}` : '');
  const effectiveJobTitle =
    initialJobTitle || currentSelectedApp?.job_title || 'Job Opening';

  const handleAddRound = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (rounds.includes(trimmed)) {
      toast.info(`"${trimmed}" is already added.`);
      return;
    }
    setRounds((prev) => [...prev, trimmed]);
    setCustomRound('');
    setErrorMsg(null);
  };

  const handleRemoveRound = (index: number) => {
    if (rounds.length <= 1) {
      setErrorMsg('At least one interview round is required.');
      return;
    }
    setRounds((prev) => prev.filter((_, i) => i !== index));
    setErrorMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppId) {
      setErrorMsg('Please select a candidate to initiate interview rounds.');
      return;
    }
    if (rounds.length === 0) {
      setErrorMsg('Please configure at least one interview round.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      const response = await interviewSchedulerClient.initiateInterview(
        selectedAppId,
        rounds
      );

      toast.success(
        response.message || 'Interview rounds initialized and invitation sent.',
        'Interview Configured'
      );

      if (response.data?.id && onSuccess) {
        onSuccess(response.data.id);
      }
      onClose();
    } catch (err: any) {
      const msg = err?.message || 'Failed to initiate interview rounds.';
      setErrorMsg(msg);
      toast.error(msg, 'Interview Initialization Error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="initiate-interview-title"
    >
      <div className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-2xl overflow-hidden animate-in zoom-in-95">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between bg-gradient-to-r from-teal-500/10 via-sky-500/10 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-md shadow-teal-600/20">
              <CalendarCheck2 className="w-5 h-5" />
            </div>
            <div>
              <h2
                id="initiate-interview-title"
                className="text-base font-bold text-gray-900 dark:text-zinc-100"
              >
                Configure Interview Rounds
              </h2>
              <p className="text-xs text-gray-500 dark:text-zinc-400">
                {effectiveCandidateName ? `${effectiveCandidateName} • ` : ''}
                {effectiveJobTitle}
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

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          {/* Candidate Selection (if not pre-selected or if available) */}
          {!initialAppId && availableApplications.length > 0 && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-zinc-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-teal-600" />
                Select Candidate
              </label>
              <select
                value={selectedAppId}
                onChange={(e) => setSelectedAppId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs font-medium border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="">-- Choose Candidate --</option>
                {availableApplications.map((app) => (
                  <option key={app.id} value={app.id}>
                    {app.first_name} {app.last_name} — {app.job_title || 'Applicant'}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Preset quick-add pills */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-zinc-400 mb-2 block">
              Quick Add Standard Rounds
            </label>
            <div className="flex flex-wrap gap-2">
              {PRESET_ROUNDS.map((name) => {
                const isSelected = rounds.includes(name);
                return (
                  <button
                    key={name}
                    type="button"
                    disabled={isSelected}
                    onClick={() => handleAddRound(name)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-gray-100 dark:bg-zinc-800 text-gray-400 dark:text-zinc-600 cursor-not-allowed border border-dashed border-gray-200 dark:border-zinc-700'
                        : 'bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300 hover:bg-teal-100 dark:hover:bg-teal-900/50 border border-teal-200 dark:border-teal-800'
                    }`}
                  >
                    <Plus className="w-3 h-3" />
                    {name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Configured Round Pipeline */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-zinc-300 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-teal-600" />
                Pipeline Rounds ({rounds.length})
              </label>
              <span className="text-[11px] text-gray-400">Order of execution</span>
            </div>

            <div className="space-y-2">
              {rounds.map((roundName, index) => (
                <div
                  key={`${roundName}-${index}`}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50/70 dark:bg-zinc-800/40"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-300 text-xs font-bold flex items-center justify-center">
                      {index + 1}
                    </span>
                    <span className="text-sm font-semibold text-gray-800 dark:text-zinc-200">
                      {roundName}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveRound(index)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    title="Remove Round"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Add Custom Round Input */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Custom round name (e.g. Case Study Defense)..."
              value={customRound}
              onChange={(e) => setCustomRound(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddRound(customRound);
                }
              }}
              className="flex-1 px-3.5 py-2 rounded-xl text-sm border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleAddRound(customRound)}
              className="px-4 py-2 text-xs font-semibold text-teal-700 dark:text-teal-300 border-teal-300 dark:border-teal-700 hover:bg-teal-50 dark:hover:bg-teal-950/40"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Add
            </Button>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting || rounds.length === 0}
              className="bg-teal-600 hover:bg-teal-700 text-white font-medium shadow-sm"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                  Initializing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-1.5" />
                  Save & Send Invite
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
