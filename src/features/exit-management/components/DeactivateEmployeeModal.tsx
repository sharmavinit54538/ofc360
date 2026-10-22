import React, { useState } from 'react';
import { X, UserX, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { useToast } from '@/shared/ui/Toast';
import { useDeactivateEmployeeMutation } from '../api/exitsApi';
import type { ExitCase } from '../types/exit.types';

interface DeactivateEmployeeModalProps {
  exitCase: ExitCase | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DeactivateEmployeeModal: React.FC<DeactivateEmployeeModalProps> = ({
  exitCase,
  isOpen,
  onClose,
}) => {
  const toast = useToast();
  const [notes, setNotes] = useState('');
  const [deactivateEmployee, { isLoading }] = useDeactivateEmployeeMutation();

  if (!isOpen || !exitCase) return null;

  const handleDeactivate = async () => {
    try {
      await deactivateEmployee({
        id: exitCase.id,
        notes: notes.trim() || undefined,
        revokeAccessDate: new Date().toISOString(),
      }).unwrap();

      toast.success(
        `Accounts for ${exitCase.employee?.name || 'Employee'} have been deactivated and access revoked.`,
        'Employee Deactivated'
      );
      setNotes('');
      onClose();
    } catch (err: any) {
      toast.error(
        err?.data?.message || err?.data?.detail || 'Failed to deactivate employee accounts',
        'Deactivation Error'
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in-50">
      <div
        className="w-full max-w-md bg-white dark:bg-[#171717] rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95"
        role="dialog"
        aria-modal="true"
        aria-labelledby="deactivate-modal-title"
      >
        <div className="p-5 sm:p-6 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between bg-amber-50/50 dark:bg-amber-950/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <UserX className="w-5 h-5" />
            </div>
            <div>
              <h3
                id="deactivate-modal-title"
                className="text-base font-bold text-gray-900 dark:text-[#ececec]"
              >
                Deactivate & Revoke Access
              </h3>
              <p className="text-xs text-gray-500 dark:text-zinc-400">
                {exitCase.employee?.name} &bull; {exitCase.employee?.department}
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

        <div className="p-5 sm:p-6 space-y-4">
          <div className="p-3.5 rounded-2xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/40 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-rose-800 dark:text-rose-300 space-y-1">
              <span className="font-bold block">Permanent Account Revocation</span>
              <p>
                This action will immediately disable corporate SSO, suspend Google Workspace/Slack, and revoke OAuth tokens across all OFC360 systems.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
              Deactivation Notes / IT Audit Reference (Optional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Asset handover confirmed, backup completed to archive folder..."
              className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-[#212121] text-gray-900 dark:text-[#ececec] focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="danger"
              onClick={handleDeactivate}
              disabled={isLoading}
              isLoading={isLoading}
              leftIcon={<CheckCircle2 className="w-4 h-4" />}
            >
              Confirm Deactivation
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
