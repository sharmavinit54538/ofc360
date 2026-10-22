import React, { useState } from 'react';
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  Clock,
  XCircle,
  ExternalLink,
  Loader2,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { Badge } from '@/shared/ui/Badge';
import { useToast } from '@/shared/ui/Toast';
import {
  useUploadOnboardingDocumentMutation,
  useSubmitDocumentTaskMutation,
} from '../api/onboardingApi';
import type { OnboardingTask } from '../types/onboarding.types';

interface DocumentUploadCardProps {
  task: OnboardingTask;
  employeeId?: string;
  isAdmin?: boolean;
  onAdminVerify?: (task: OnboardingTask) => void;
}

export const DocumentUploadCard: React.FC<DocumentUploadCardProps> = ({
  task,
  employeeId,
  isAdmin = false,
  onAdminVerify,
}) => {
  const toast = useToast();
  const [uploadDocument, { isLoading: isUploading }] = useUploadOnboardingDocumentMutation();
  const [submitDocumentTask, { isLoading: isSubmitting }] = useSubmitDocumentTaskMutation();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('taskId', task.id);
    if (employeeId) formData.append('employeeId', employeeId);

    try {
      const res = await uploadDocument(formData).unwrap();
      await submitDocumentTask({
        taskId: task.id,
        employeeId,
        documentUrl: res.url,
        documentName: file.name,
        documentSize: file.size,
      }).unwrap();

      toast.success(
        `${file.name} uploaded and submitted for HR review!`,
        'Document Submitted'
      );
    } catch (err: any) {
      toast.error(
        err?.data?.message || err?.data?.detail || 'Failed to upload document. Please try again.',
        'Upload Error'
      );
    } finally {
      e.target.value = '';
    }
  };

  const getStatusBadge = () => {
    switch (task.status) {
      case 'VERIFIED':
        return (
          <Badge variant="success" size="sm" className="flex items-center gap-1 font-semibold">
            <CheckCircle2 className="w-3 h-3" /> Verified by HR
          </Badge>
        );
      case 'SUBMITTED':
        return (
          <Badge variant="warning" size="sm" className="flex items-center gap-1 font-semibold">
            <Clock className="w-3 h-3" /> Awaiting Verification
          </Badge>
        );
      case 'REJECTED':
        return (
          <Badge variant="danger" size="sm" className="flex items-center gap-1 font-semibold">
            <XCircle className="w-3 h-3" /> Action Required / Rejected
          </Badge>
        );
      case 'IN_PROGRESS':
        return (
          <Badge variant="brand" size="sm">
            In Progress
          </Badge>
        );
      default:
        return (
          <Badge variant="slate" size="sm">
            Pending Upload
          </Badge>
        );
    }
  };

  const isCompleted = task.status === 'VERIFIED';
  const isSubmitted = task.status === 'SUBMITTED';
  const isRejected = task.status === 'REJECTED';

  return (
    <div
      className="p-5 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 shadow-sm transition-all hover:shadow-md space-y-3.5"
    >
      {/* Title & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-start gap-3">
          <div
            className={`p-2.5 rounded-xl flex-shrink-0 mt-0.5 ${
              isCompleted
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                : isRejected
                ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400'
                : 'bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400'
            }`}
          >
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                {task.title}
              </h3>
              {task.isRequired && (
                <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wider">
                  *Required
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5 leading-relaxed">
              {task.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0 self-start sm:self-auto">
          {getStatusBadge()}
        </div>
      </div>

      {/* Rejection Alert if present */}
      {isRejected && task.adminFeedback && (
        <div className="p-3 rounded-xl bg-rose-50/80 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-900/40 flex items-start gap-2.5 text-xs text-rose-700 dark:text-rose-300">
          <AlertTriangle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block">HR Feedback / Reason:</span>
            <p className="mt-0.5">{task.adminFeedback}</p>
          </div>
        </div>
      )}

      {/* Uploaded File Link & Details */}
      {task.documentUrl && (
        <div className="p-3 rounded-xl bg-gray-50/80 dark:bg-[#212121]/60 border border-gray-200/80 dark:border-zinc-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5 truncate">
            <FileText className="w-4 h-4 text-brand-600 flex-shrink-0" />
            <span className="font-semibold text-gray-800 dark:text-zinc-200 truncate">
              {task.documentName || 'Uploaded Verification File'}
            </span>
            {task.documentSize && (
              <span className="text-[10px] text-gray-400 flex-shrink-0">
                ({(task.documentSize / 1024).toFixed(0)} KB)
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <a
              href={task.documentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1 font-semibold text-xs"
            >
              <span>View Document</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            {/* Admin Verification Action */}
            {isAdmin && isSubmitted && onAdminVerify && (
              <button
                type="button"
                onClick={() => onAdminVerify(task)}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-brand-600 text-white hover:bg-brand-700 transition-colors"
              >
                Verify Item
              </button>
            )}
          </div>
        </div>
      )}

      {/* File Upload Trigger (if not verified, or if rejected) */}
      {!isCompleted && (
        <div className="pt-1">
          <input
            type="file"
            id={`upload-${task.id}`}
            accept="image/png,image/jpeg,application/pdf"
            onChange={handleFileSelect}
            className="hidden"
            disabled={isUploading || isSubmitting}
          />
          <label
            htmlFor={`upload-${task.id}`}
            className={`
              w-full py-2.5 px-4 rounded-xl border border-dashed text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all duration-150
              ${
                isRejected
                  ? 'border-rose-300 dark:border-rose-800 hover:bg-rose-50/50 text-rose-600 dark:text-rose-400'
                  : 'border-gray-300 dark:border-zinc-700 hover:border-brand-500 hover:bg-brand-50/30 dark:hover:bg-brand-950/20 text-gray-700 dark:text-zinc-300'
              }
            `}
          >
            {isUploading || isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-brand-600" />
                <span>Uploading document to secure vault...</span>
              </>
            ) : task.documentUrl ? (
              <>
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Re-upload New File (PDF, PNG, JPG)</span>
              </>
            ) : (
              <>
                <UploadCloud className="w-4 h-4 text-brand-600" />
                <span>Upload Document (PDF, PNG, JPG up to 10MB)</span>
              </>
            )}
          </label>
        </div>
      )}
    </div>
  );
};
