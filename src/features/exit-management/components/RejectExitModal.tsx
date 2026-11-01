import React, { useState } from 'react';
import { X, XCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { useToast } from '@/shared/ui/Toast';
import { useManagerRejectMutation, useHrRejectMutation } from '../api/exitsApi';
import type { ExitCase } from '../types/exit.types';

interface RejectExitModalProps {
  exitCase: ExitCase | null;
  isOpen: boolean;
  onClose: () => void;
  role?: 'MANAGER' | 'HR';
}

export const RejectExitModal: React.FC<RejectExitModalProps> = ({
  exitCase,
  isOpen,
  onClose,
  role = 'MANAGER',
}) => {
  const toast = useToast();
  const [reason, setReason] = useState('');
  const [managerReject, { isLoading: isMgrLoading }] = useManagerRejectMutation();
  const [hrReject, { isLoading: isHrLoading }] = useHrRejectMutation();

  const isLoading = isMgrLoading || isHrLoading;

  if (!isOpen || !exitCase) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim() || reason.trim().length < 10) {
      toast.warning('Please enter a rejection reason (minimum 10 characters required).', 'Validation');
      return;
    }

    try {
      if (role === 'HR') {
        await hrReject({
          id: exitCase.id,
          rejectionReason: reason.trim(),
        }).unwrap();
      } else {
        await managerReject({
          id: exitCase.id,
          rejectionReason: reason.trim(),
        }).unwrap();
      }

      toast.info(
        `Exit request for ${exitCase.employeeName || exitCase.caseNumber} has been rejected.`,
        'Request Rejected'
      );
      setReason('');
      onClose();
    } catch (err: any) {
      toast.error(
        err?.data?.detail || err?.data?.message || 'Failed to reject exit case',
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
            <div className="p-2.5 rounded-2xl bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400">
              <XCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 id="reject-modal-title" className="text-base font-bold text-gray-900 dark:text-[#ececec]">
                Reject Resignation Request
              </h3>
              <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
                Case: {exitCase.caseNumber} • {exitCase.employeeName}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
          <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/30 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800 dark:text-amber-300">
              Rejecting will halt the offboarding workflow and notify the employee with the reason below.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
              Reason for Rejection * (minimum 10 characters)
            </label>
            <textarea
              rows={4}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Provide a clear, detailed reason for rejecting this resignation request..."
              className="w-full p-3 rounded-2xl border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-[#212121] text-xs text-gray-900 dark:text-[#ececec] placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all resize-none"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isLoading}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={isLoading || reason.trim().length < 10}
              className="text-xs bg-rose-600 hover:bg-rose-700 text-white shadow-sm"
            >
              {isLoading ? 'Rejecting...' : 'Confirm Rejection'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
