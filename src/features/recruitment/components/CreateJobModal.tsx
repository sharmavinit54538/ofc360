/**
 * @file CreateJobModal.tsx
 * @description Dialog modal wrapping the modern CreateJobPostingForm with One-Click AI Auto-fill.
 * Adheres strictly to Linear/Stripe design standards and connects to backend /api/v1/jobs.
 */

import React from 'react';
import { X, Briefcase, Sparkles } from 'lucide-react';
import type { DepartmentItem, EmployeeItem } from '@/features/workforce/types/workforce.types';
import { CreateJobPostingForm } from './CreateJobPostingForm';

export interface CreateJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  departments?: DepartmentItem[];
  managers?: EmployeeItem[];
  onSuccess?: () => void;
}

export const CreateJobModal: React.FC<CreateJobModalProps> = ({
  isOpen,
  onClose,
  departments = [],
  managers = [],
  onSuccess,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in-50">
      <div
        className="w-full max-w-4xl bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200/80 dark:border-zinc-800 shadow-2xl overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[92vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-job-modal-title"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200/80 dark:border-zinc-800 flex items-center justify-between bg-slate-50/50 dark:bg-zinc-900/40 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center border border-teal-500/20">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="create-job-modal-title" className="text-base font-bold text-slate-900 dark:text-white">
                  Create Job Posting
                </h2>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-teal-50 to-emerald-50 text-teal-700 dark:from-teal-950/60 dark:to-emerald-950/60 dark:text-teal-300 border border-teal-200/60 dark:border-teal-800/40">
                  <Sparkles className="w-3 h-3 text-teal-600 dark:text-teal-400" />
                  <span>AI Powered</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Draft, auto-generate with AI, or publish a live opening to candidates & job boards
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Scroll Area */}
        <div className="p-6 overflow-y-auto flex-1">
          <CreateJobPostingForm
            departments={departments}
            managers={managers}
            onSuccess={() => {
              if (onSuccess) onSuccess();
              onClose();
            }}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateJobModal;
