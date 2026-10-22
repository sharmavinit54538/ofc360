import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  XCircle,
  User,
  ShieldCheck,
  Paperclip,
  ExternalLink,
  Calendar,
  CreditCard,
} from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import { useToast } from '@/shared/ui/Toast';
import { useUpdateExpenseClaimStatusMutation } from '../api/expensesApi';
import type { ExpenseClaim, ExpenseStatus } from '../types/expenses.types';

interface ExpenseApprovalModalProps {
  claim: ExpenseClaim | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ExpenseApprovalModal: React.FC<ExpenseApprovalModalProps> = ({
  claim,
  isOpen,
  onClose,
}) => {
  const toast = useToast();
  const [comments, setComments] = useState('');
  const [updateStatus, { isLoading }] = useUpdateExpenseClaimStatusMutation();

  if (!isOpen || !claim) return null;

  const handleDecision = async (status: 'APPROVED' | 'PAID' | 'REJECTED') => {
    try {
      await updateStatus({
        id: claim.id,
        status,
        comments: comments.trim() || undefined,
      }).unwrap();

      const actionText =
        status === 'APPROVED' ? 'Approved' : status === 'PAID' ? 'Marked as Paid' : 'Rejected';

      toast.success(
        `Expense claim ${claim.claimNumber || claim.id} has been ${actionText.toLowerCase()}!`,
        `Claim ${actionText}`
      );
      setComments('');
      onClose();
    } catch (err: any) {
      toast.error(
        err?.data?.message || err?.data?.detail || 'Failed to update claim status. Please try again.',
        'Action Failed'
      );
    }
  };

  const formatCurrency = (val?: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: claim.currency || 'USD',
      maximumFractionDigits: 2,
    }).format(val || 0);
  };

  const getStatusBadge = (status: ExpenseStatus) => {
    switch (status) {
      case 'APPROVED':
        return (
          <Badge variant="success" size="sm">
            Approved
          </Badge>
        );
      case 'PAID':
        return (
          <Badge variant="brand" size="sm" className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
            Reimbursed / Paid
          </Badge>
        );
      case 'SUBMITTED':
        return (
          <Badge variant="warning" size="sm">
            Pending Approval
          </Badge>
        );
      case 'REJECTED':
        return (
          <Badge variant="danger" size="sm">
            Rejected
          </Badge>
        );
      case 'DRAFT':
      default:
        return (
          <Badge variant="slate" size="sm">
            Draft
          </Badge>
        );
    }
  };

  const isPending = claim.status === 'SUBMITTED';
  const isApproved = claim.status === 'APPROVED';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in-50">
      <div
        className="w-full max-w-2xl bg-white dark:bg-[#171717] rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95"
        role="dialog"
        aria-modal="true"
        aria-labelledby="approval-modal-title"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between flex-shrink-0 bg-gray-50/50 dark:bg-[#1f1f1f]/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2
                  id="approval-modal-title"
                  className="text-lg font-bold text-gray-900 dark:text-[#ececec]"
                >
                  Review Expense Claim
                </h2>
                {getStatusBadge(claim.status)}
              </div>
              <p className="text-xs text-gray-500 dark:text-zinc-400 font-mono">
                {claim.claimNumber || `EXP-${claim.id}`} &bull; Submitted {new Date(claim.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto flex-1">
          {/* Employee Header Info */}
          <div className="p-4 rounded-2xl bg-gray-50/80 dark:bg-[#212121]/60 border border-gray-200/80 dark:border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-600/10 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold text-sm">
                {claim.employee?.name ? claim.employee.name[0] : <User className="w-5 h-5" />}
              </div>
              <div>
                <div className="text-sm font-bold text-gray-900 dark:text-[#ececec]">
                  {claim.employee?.name || 'Employee'}
                </div>
                <div className="text-xs text-gray-500 dark:text-zinc-400">
                  {claim.employee?.email || 'N/A'} &bull; {claim.employee?.department || 'Finance'}
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[11px] uppercase font-semibold text-gray-500 dark:text-zinc-400 tracking-wider">
                Total Amount
              </span>
              <div className="text-xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(claim.totalAmount)}
              </div>
              {claim.taxAmount > 0 && (
                <div className="text-[11px] text-gray-500 dark:text-zinc-400">
                  Tax: {formatCurrency(claim.taxAmount)}
                </div>
              )}
            </div>
          </div>

          {/* Claim Title & Category */}
          <div className="space-y-1">
            <span className="text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
              Claim Summary
            </span>
            <h4 className="text-base font-bold text-gray-900 dark:text-white">
              {claim.title}
            </h4>
            {claim.description && (
              <p className="text-xs text-gray-600 dark:text-zinc-400">
                {claim.description}
              </p>
            )}
          </div>

          {/* Line Items Breakdown */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
                Itemized Expenses ({claim.items?.length || 0})
              </span>
            </div>

            <div className="rounded-xl border border-gray-200 dark:border-zinc-800 overflow-hidden divide-y divide-gray-100 dark:divide-zinc-800">
              {claim.items && claim.items.length > 0 ? (
                claim.items.map((it, idx) => (
                  <div
                    key={idx}
                    className="p-3 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-gray-50/50 dark:hover:bg-zinc-800/30"
                  >
                    <div className="space-y-0.5">
                      <div className="font-semibold text-gray-900 dark:text-zinc-200 flex items-center gap-2">
                        <span>{it.merchant}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400">
                          {it.category}
                        </span>
                      </div>
                      <div className="text-gray-500 dark:text-zinc-400">
                        {it.description}
                      </div>
                      <div className="text-[11px] text-gray-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{it.date}</span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="font-bold text-gray-900 dark:text-[#ececec]">
                        {formatCurrency(it.amount)}
                      </div>
                      {it.taxAmount > 0 && (
                        <div className="text-[10px] text-gray-400">
                          Tax: {formatCurrency(it.taxAmount)}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-xs text-gray-400">
                  No line items attached.
                </div>
              )}
            </div>
          </div>

          {/* Receipts Section */}
          {claim.receiptUrls && claim.receiptUrls.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
                Receipt Attachments ({claim.receiptUrls.length})
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {claim.receiptUrls.map((url, i) => (
                  <a
                    key={i}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2.5 rounded-xl border border-gray-200 dark:border-zinc-800 hover:border-brand-500 bg-gray-50/50 dark:bg-[#212121] text-xs font-medium text-brand-600 dark:text-brand-400 transition-colors group"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Paperclip className="w-4 h-4 text-gray-400 group-hover:text-brand-600 transition-colors" />
                      <span className="truncate">Receipt Attachment #{i + 1}</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Approver History or Notes */}
          {claim.approverComments && (
            <div className="p-3.5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/30 text-xs">
              <span className="font-semibold text-amber-900 dark:text-amber-300 block mb-0.5">
                Approver Feedback:
              </span>
              <p className="text-amber-800 dark:text-amber-400">
                {claim.approverComments}
              </p>
            </div>
          )}

          {/* Decision Comments Input (For Managers & Finance) */}
          {(isPending || isApproved) && (
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
                Approval / Settlement Notes
              </label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                rows={2}
                placeholder="Add comments or instructions regarding reimbursement approval or payment settlement..."
                className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-[#212121] text-gray-900 dark:text-[#ececec] placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors resize-none"
              />
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="p-4 sm:p-6 border-t border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-[#1f1f1f]/50 flex items-center justify-between flex-shrink-0">
          <Button variant="ghost" onClick={onClose} disabled={isLoading}>
            Close
          </Button>

          <div className="flex items-center gap-2">
            {isPending && (
              <>
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
                  onClick={() => handleDecision('APPROVED')}
                  disabled={isLoading}
                  isLoading={isLoading}
                  leftIcon={<CheckCircle2 className="w-4 h-4" />}
                >
                  Approve Claim
                </Button>
              </>
            )}

            {isApproved && (
              <Button
                variant="primary"
                onClick={() => handleDecision('PAID')}
                disabled={isLoading}
                isLoading={isLoading}
                leftIcon={<CreditCard className="w-4 h-4" />}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Mark as Reimbursed / Paid
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
