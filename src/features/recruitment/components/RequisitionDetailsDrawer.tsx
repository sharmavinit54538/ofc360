/**
 * @file RequisitionDetailsDrawer.tsx
 * @description Slide-over drawer component displaying comprehensive details of a Job Requisition.
 * Includes RBAC-guarded actions for HR Admin and IT Admin to Approve or Reject pending requests.
 */

import React, { useEffect } from 'react';
import {
  X,
  Building2,
  Users,
  Briefcase,
  IndianRupee,
  Clock,
  Calendar,
  CheckCircle2,
  XCircle,
  FileText,
  User,
} from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useToast } from '@/shared/ui/Toast';
import type { JobRequisitionItem } from '../types/requisition.types';
import { useApproveRequisition } from '../api/requisitionsApi';

interface RequisitionDetailsDrawerProps {
  requisition: JobRequisitionItem | null;
  isOpen: boolean;
  onClose: () => void;
  onActionComplete?: () => void;
}

export const RequisitionDetailsDrawer: React.FC<RequisitionDetailsDrawerProps> = ({
  requisition,
  isOpen,
  onClose,
  onActionComplete,
}) => {
  const { role, activeRole } = useAuth();
  const toast = useToast();
  const { mutateAsync: approveRequisition, isPending } = useApproveRequisition();

  const effectiveRole = (activeRole || role || '').toUpperCase();
  const canApprove =
    effectiveRole === 'SUPER_ADMIN' ||
    effectiveRole === 'HR_ADMIN' ||
    effectiveRole === 'IT_ADMIN';

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !requisition) return null;

  const handleAction = async (approve: boolean) => {
    try {
      await approveRequisition({
        requisition_id: requisition.id,
        approve,
      });

      toast.success(
        approve
          ? 'Requisition approved. A draft job opening has been initialized.'
          : 'Requisition has been rejected.',
        approve ? 'Requisition Approved' : 'Requisition Rejected'
      );
      onActionComplete?.();
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Action failed';
      toast.error(msg, 'Approval Error');
    }
  };

  const formatSalary = (min: string | null, max: string | null) => {
    if (!min && !max) return 'Not disclosed';
    const formatNum = (v: string) => {
      const num = parseFloat(v);
      return isNaN(num) ? v : `₹${num.toLocaleString('en-IN')}`;
    };
    if (min && max) return `${formatNum(min)} - ${formatNum(max)} LPA`;
    if (min) return `From ${formatNum(min)} LPA`;
    return `Up to ${formatNum(max!)} LPA`;
  };

  const formatExp = (min: number, max: number | null) => {
    if (max !== null && max !== undefined) {
      return `${min} - ${max} Years`;
    }
    return `${min}+ Years`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Approved
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            Rejected
          </span>
        );
      case 'PENDING':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            Pending Review
          </span>
        );
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-xl h-full bg-white dark:bg-zinc-900 shadow-2xl flex flex-col border-l border-slate-200 dark:border-zinc-800 animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 dark:border-zinc-800 bg-slate-50/70 dark:bg-zinc-950/40 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200/70 dark:border-teal-800/40 flex items-center justify-center text-teal-600 dark:text-teal-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Requisition Details
              </h2>
              <p className="text-xs font-mono text-slate-500 dark:text-zinc-400">
                {requisition.id}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
            aria-label="Close drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Main Title & Status */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-200/70 dark:border-zinc-800 flex items-start justify-between gap-4">
            <div>
              <span className="text-xs font-medium text-slate-500 dark:text-zinc-400">
                Position Title
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                {requisition.title}
              </h3>
            </div>
            <div>{getStatusBadge(requisition.status)}</div>
          </div>

          {/* Core Spec Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3.5 rounded-xl border border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-zinc-400">
                <Building2 className="w-4 h-4 text-teal-600" />
                <span>Department</span>
              </div>
              <p className="mt-1.5 text-sm font-semibold text-slate-900 dark:text-white">
                {requisition.department}
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-zinc-400">
                <Users className="w-4 h-4 text-teal-600" />
                <span>Total Vacancies</span>
              </div>
              <p className="mt-1.5 text-sm font-semibold text-slate-900 dark:text-white">
                {requisition.vacancies} {requisition.vacancies === 1 ? 'Opening' : 'Openings'}
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-zinc-400">
                <Briefcase className="w-4 h-4 text-teal-600" />
                <span>Experience Required</span>
              </div>
              <p className="mt-1.5 text-sm font-semibold text-slate-900 dark:text-white">
                {formatExp(requisition.min_experience, requisition.max_experience)}
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-zinc-400">
                <IndianRupee className="w-4 h-4 text-teal-600" />
                <span>Salary Budget (CTC)</span>
              </div>
              <p className="mt-1.5 text-sm font-semibold text-slate-900 dark:text-white">
                {formatSalary(requisition.min_salary, requisition.max_salary)}
              </p>
            </div>
          </div>

          {/* Description & Justification */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
              Job Description & Justification
            </h4>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-800/40 border border-slate-200/80 dark:border-zinc-800 text-sm text-slate-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">
              {requisition.description || 'No detailed description provided.'}
            </div>
          </div>

          {/* Audit Metadata */}
          <div className="space-y-2 pt-2 border-t border-slate-200/80 dark:border-zinc-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
              Audit & Timeline
            </h4>
            <div className="space-y-2 text-xs text-slate-600 dark:text-zinc-400">
              <div className="flex items-center justify-between py-1">
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" /> Requested By
                </span>
                <span className="font-mono text-slate-900 dark:text-white">
                  {requisition.requested_by}
                </span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> Date Created
                </span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {new Date(requisition.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
              {requisition.approved_by && (
                <div className="flex items-center justify-between py-1">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Approved By
                  </span>
                  <span className="font-mono text-slate-900 dark:text-white">
                    {requisition.approved_by}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sticky Action Footer (HR_ADMIN, SUPER_ADMIN, IT_ADMIN only on PENDING) */}
        {canApprove && requisition.status === 'PENDING' && (
          <div className="p-4 border-t border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shrink-0 flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => handleAction(false)}
              className="text-rose-600 border-rose-200 hover:bg-rose-50 dark:border-rose-900 dark:hover:bg-rose-950/40"
            >
              {isPending ? 'Processing...' : 'Reject Requisition'}
            </Button>
            <Button
              type="button"
              variant="primary"
              disabled={isPending}
              onClick={() => handleAction(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
            >
              {isPending ? 'Processing...' : 'Approve Requisition'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

