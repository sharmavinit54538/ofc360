import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  XCircle,
  FileText,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { useToast } from '@/shared/ui/Toast';
import { useVerifyOnboardingItemMutation } from '../api/onboardingApi';
import type { OnboardingTask } from '../types/onboarding.types';

interface AdminVerificationModalProps {
  task: OnboardingTask | null;
  employeeId?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const AdminVerificationModal: React.FC<AdminVerificationModalProps> = ({
  task,
  employeeId,
  isOpen,
  onClose,
}) => {
  const toast = useToast();
  const [feedback, setFeedback] = useState('');
  const [verifyItem, { isLoading }] = useVerifyOnboardingItemMutation();

  if (!isOpen || !task) return null;

  const handleDecision = async (status: 'VERIFIED' | 'REJECTED') => {
    if (status === 'REJECTED' && !feedback.trim()) {
      toast.warning('Please provide feedback explaining why the document was rejected.', 'Validation');
      return;
    }

    try {
      await verifyItem({
        taskId: task.id,
        employeeId: employeeId || '',
        status,
        feedback: feedback.trim() || undefined,
      }).unwrap();

      toast.success(
        `Task "${task.title}" has been ${status === 'VERIFIED' ? 'approved & verified' : 'rejected'}.`,
        'Verification Updated'
      );
      setFeedback('');
      onClose();
    } catch (err: any) {
      toast.error(
        err?.data?.message || err?.data?.detail || 'Failed to submit verification decision',
        'Action Error'
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in-50">
      <div
        className="w-full max-w-lg bg-white dark:bg-[#171717] rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95"
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-verify-modal"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between bg-gray-50/75 dark:bg-[#1f1f1f]/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3
                id="admin-verify-modal"
                className="text-base font-bold text-gray-900 dark:text-[#ececec]"
              >
                Verify Onboarding Milestone
              </h3>
              <p className="text-xs text-gray-500 dark:text-zinc-400">
                Review submitted documents or employee declarations for compliance.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-4">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
              Task Item
            </span>
            <h4 className="text-sm font-bold text-gray-900 dark:text-white">
              {task.title}
            </h4>
            <p className="text-xs text-gray-600 dark:text-zinc-400">
              {task.description}
            </p>
          </div>

          {/* Submitted Document preview link */}
          {task.documentUrl && (
            <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-[#212121] border border-gray-200/80 dark:border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2 truncate">
                <FileText className="w-4 h-4 text-brand-600 flex-shrink-0" />
                <span className="text-xs font-semibold text-gray-800 dark:text-zinc-200 truncate">
                  {task.documentName || 'Submitted Document'}
                </span>
              </div>
              <a
                href={task.documentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1 font-semibold flex-shrink-0"
              >
                <span>Inspect</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}

          {/* Feedback input */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
              HR Review Notes / Rejection Reason
            </label>
            <textarea
              rows={3}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Add verification notes or specify rejection reasons (e.g. document blurry, expired ID)..."
              className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-[#212121] text-gray-900 dark:text-[#ececec] focus:outline-none focus:ring-2 focus:ring-brand-500/20 resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-[#1f1f1f]/50 flex items-center justify-between">
          <Button variant="ghost" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => handleDecision('REJECTED')}
              disabled={isLoading}
              leftIcon={<XCircle className="w-4 h-4 text-rose-500" />}
            >
              Reject
            </Button>
            <Button
              variant="primary"
              onClick={() => handleDecision('VERIFIED')}
              disabled={isLoading}
              isLoading={isLoading}
              leftIcon={<CheckCircle2 className="w-4 h-4" />}
            >
              Approve & Verify
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
