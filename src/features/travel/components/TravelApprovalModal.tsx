import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  XCircle,
  Calendar,
  MapPin,
  User,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import { useToast } from '@/shared/ui/Toast';
import { useUpdateTravelRequestStatusMutation } from '../api/travelApi';
import type { TravelRequest } from '../types/travel.types';

interface TravelApprovalModalProps {
  request: TravelRequest | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TravelApprovalModal: React.FC<TravelApprovalModalProps> = ({
  request,
  isOpen,
  onClose,
}) => {
  const toast = useToast();
  const [comments, setComments] = useState('');
  const [updateStatus, { isLoading }] = useUpdateTravelRequestStatusMutation();

  if (!isOpen || !request) return null;

  const handleDecision = async (status: 'APPROVED' | 'REJECTED') => {
    try {
      await updateStatus({
        id: request.id,
        status,
        comments: comments.trim() || undefined,
      }).unwrap();

      toast.success(
        `Travel requisition ${request.tripId || request.id} has been ${status.toLowerCase()}!`,
        `Request ${status === 'APPROVED' ? 'Approved' : 'Rejected'}`
      );
      setComments('');
      onClose();
    } catch (err: any) {
      toast.error(
        err?.data?.message || err?.data?.detail || 'Failed to update approval status. Please try again.',
        'Action Failed'
      );
    }
  };

  const formatCurrency = (val?: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: request.expenses?.currency || 'USD',
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  const isPending = request.status === 'PENDING';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in-50">
      <div
        className="w-full max-w-xl bg-white dark:bg-[#171717] rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95"
        role="dialog"
        aria-modal="true"
        aria-labelledby="approval-modal-title"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between shrink-0 bg-gray-50/50 dark:bg-zinc-900/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 p-0.5 shadow-sm shadow-brand-500/20">
              <div className="w-full h-full bg-white dark:bg-[#171717] rounded-[10px] flex items-center justify-center text-brand-600 dark:text-brand-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="approval-modal-title" className="text-base font-bold text-gray-900 dark:text-[#ececec]">
                  Travel Requisition Review
                </h2>
                <Badge variant={request.status === 'APPROVED' ? 'success' : request.status === 'REJECTED' ? 'danger' : 'warning'} size="sm">
                  {request.status}
                </Badge>
              </div>
              <p className="text-xs text-gray-500 dark:text-zinc-400">
                Trip Ref: <span className="font-mono font-semibold">{request.tripId || request.id}</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-sm">
          {/* Employee & Route Card */}
          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold text-sm">
                  {request.employee?.name ? request.employee.name[0] : <User className="w-4 h-4" />}
                </div>
                <div>
                  <div className="font-bold text-gray-900 dark:text-[#ececec]">{request.employee?.name}</div>
                  <div className="text-xs text-gray-500 dark:text-zinc-400">{request.employee?.email} &bull; {request.employee?.department}</div>
                </div>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 border border-brand-200/60 dark:border-brand-900/40">
                {request.travelType}
              </span>
            </div>

            <div className="pt-2 border-t border-gray-200 dark:border-zinc-800 grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-gray-400 block mb-0.5">Route:</span>
                <span className="font-semibold text-gray-900 dark:text-white flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-brand-500" />
                  {request.origin} &rarr; {request.destination}
                </span>
              </div>
              <div>
                <span className="text-gray-400 block mb-0.5">Duration:</span>
                <span className="font-semibold text-gray-900 dark:text-white flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-brand-500" />
                  {request.startDate} to {request.endDate}
                </span>
              </div>
            </div>
          </div>

          {/* Purpose & Justification */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
              Travel Purpose & Deliverables
            </span>
            <p className="text-xs text-gray-700 dark:text-zinc-300 bg-gray-50 dark:bg-zinc-900/30 p-3 rounded-xl border border-gray-200 dark:border-zinc-800 leading-relaxed">
              {request.purpose}
            </p>
            {request.businessJustification && (
              <p className="text-xs text-gray-500 dark:text-zinc-400 italic mt-1">
                Justification: {request.businessJustification}
              </p>
            )}
          </div>

          {/* Expense Breakdown */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
                Budget & Expense Allocation
              </span>
              <span className="font-bold text-brand-600 dark:text-brand-400 text-sm">
                Total: {formatCurrency(request.estimatedCost)}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-zinc-900/40 border border-gray-200 dark:border-zinc-800">
                <span className="text-gray-400 block text-[10px]">Flights</span>
                <span className="font-bold text-gray-900 dark:text-white">{formatCurrency(request.expenses?.flights)}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-zinc-900/40 border border-gray-200 dark:border-zinc-800">
                <span className="text-gray-400 block text-[10px]">Hotel</span>
                <span className="font-bold text-gray-900 dark:text-white">{formatCurrency(request.expenses?.hotel)}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-zinc-900/40 border border-gray-200 dark:border-zinc-800">
                <span className="text-gray-400 block text-[10px]">Cabs</span>
                <span className="font-bold text-gray-900 dark:text-white">{formatCurrency(request.expenses?.cabs)}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-zinc-900/40 border border-gray-200 dark:border-zinc-800">
                <span className="text-gray-400 block text-[10px]">Per Diem</span>
                <span className="font-bold text-gray-900 dark:text-white">{formatCurrency(request.expenses?.perDiem)}</span>
              </div>
            </div>
          </div>

          {/* Approval Decision Section for Pending */}
          {isPending ? (
            <div className="space-y-2 pt-2 border-t border-gray-200 dark:border-zinc-800">
              <label htmlFor="approval-comments" className="block text-xs font-bold text-gray-700 dark:text-zinc-300">
                Approval Decision Notes / Conditions (Optional)
              </label>
              <textarea
                id="approval-comments"
                rows={2}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Add comments, corporate policy stipulations, or reason for decision..."
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-[#212121] text-gray-900 dark:text-[#ececec] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>
          ) : (
            request.approverComments && (
              <div className="p-3 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/30 text-xs text-amber-800 dark:text-amber-300">
                <span className="font-semibold block mb-0.5">Manager Notes:</span>
                {request.approverComments}
              </div>
            )
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-zinc-800 flex items-center justify-between shrink-0 bg-gray-50/50 dark:bg-zinc-900/40">
          <Button variant="ghost" size="sm" onClick={onClose} disabled={isLoading}>
            Close
          </Button>

          {isPending ? (
            <div className="flex items-center gap-2">
              <Button
                variant="danger"
                size="sm"
                leftIcon={<XCircle className="w-4 h-4" />}
                isLoading={isLoading}
                onClick={() => handleDecision('REJECTED')}
              >
                Reject Request
              </Button>
              <Button
                variant="primary"
                size="sm"
                leftIcon={<CheckCircle2 className="w-4 h-4" />}
                isLoading={isLoading}
                onClick={() => handleDecision('APPROVED')}
              >
                Approve Request
              </Button>
            </div>
          ) : (
            <span className="text-xs text-gray-400">
              Decision recorded {request.approvedAt ? `on ${new Date(request.approvedAt).toLocaleDateString()}` : ''}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
