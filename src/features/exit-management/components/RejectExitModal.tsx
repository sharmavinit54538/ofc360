import React, { useState } from 'react';
import { X, XCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { useToast } from '@/shared/ui/Toast';
import { useRejectExitMutation } from '../api/exitsApi';
import type { ExitCase } from '../types/exit.types';

interface RejectExitModalProps {
  exitCase: ExitCase | null;
  isOpen: boolean;
  onClose: () => void;
}

export const RejectExitModal: React.FC<RejectExitModalProps> = ({
  exitCase,
  isOpen,
  onClose,
}) => {
  const toast = useToast();
  const [reason, setReason] = useState('');
  const [rejectExit, { isLoading }] = useRejectExitMutation();

  if (!isOpen || !exitCase) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim() || reason.trim().length < 5) {
      toast.warning('Please enter a rejection reason (min 5 characters).', 'Validation');
      return;
    }

    try {
      await rejectExit({
        id: exitCase.id,
        rejectionReason: reason.trim(),
      }).unwrap();

      toast.info(
        `Exit request for ${exitCase.employee?.name || exitCase.caseNumber} has been rejected.`,
        'Request Rejected'
      );
      setReason('');
      onClose();
    } catch (err: any) {
      toast.error(
        err?.data?.message || err?.data?.detail || 'Failed to reject exit case',
        'Action Error'
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in-50">
      <div
        className="w-full max-w-md bg-white dark:bg-[#171717] rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95"
        role="dialog"
        aria-modal="true"
        aria-labelledby="reject-modal-title"
      >
        <div className="p-5 sm:p-6 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between bg-rose-50/50 dark:bg-rose-950/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3
                id="reject-modal-title"
                className="text-base font-bold text-gray-900 dark:text-[#ececec]"
              >
                Reject Resignation / Exit
              </h3>
              <p className="text-xs text-gray-500 dark:text-zinc-400">
                {exitCase.caseNumber || 'Exit Case'} &bull; {exitCase.employee?.name}
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

        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
          <p className="text-xs text-gray-600 dark:text-zinc-400">
            Are you sure you want to decline or reject this exit requisition? Please provide a formal reason or counter-offer details for recordkeeping.
          </p>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
              Rejection Reason & Retention Notes *
            </label>
            <textarea
              required
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Counter-offer accepted, project commitments renegotiated, notice period disputed..."
              className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-[#212121] text-gray-900 dark:text-[#ececec] focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="danger"
              disabled={isLoading || reason.trim().length < 5}
              isLoading={isLoading}
              leftIcon={<XCircle className="w-4 h-4" />}
            >
              Confirm Rejection
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
