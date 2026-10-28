/**
 * @file SignatureRequestDetailSheet.tsx
 * @description Slide-over sheet for inspecting signature request status, signer progress,
 * document preview, immutable audit timeline, and role-based actions.
 */

import React, { useState, useEffect } from 'react';
import {
  X,
  FileText,
  Clock,
  User,
  Bell,
  Download,
  AlertTriangle,
  RotateCw,
  Ban,
  FileSignature,
  Building,
  Globe,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import { Tooltip } from '@/shared/ui/Tooltip';
import { useToast } from '@/shared/ui/Toast';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useRBAC } from '@/features/auth/hooks/useRBAC';
import { useLazyDownloadSignatureFileQuery } from '../api/signaturesApi';
import { SignatureAuditTimeline } from './SignatureAuditTimeline';
import {
  formatDocumentTypeLabel,
  getStatusBadgeConfig,
  getSignerStatusBadgeConfig,
  formatExpiryCountdown,
  isExpiringSoon,
  isRequestExpired,
  canUserSign,
  canRemindSigner,
  findSignerForUser,
} from '../utils/signatureUtils';
import type { SignatureRequest } from '../types/signatures.types';

export interface SignatureRequestDetailSheetProps {
  request: SignatureRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onSignClick?: (request: SignatureRequest, signerId: string) => void;
  onRemindClick?: (request: SignatureRequest, signerIds?: string[]) => void;
  onResendClick?: (request: SignatureRequest) => void;
  onCancelClick?: (request: SignatureRequest) => void;
}

export const SignatureRequestDetailSheet: React.FC<SignatureRequestDetailSheetProps> = ({
  request,
  isOpen,
  onClose,
  onSignClick,
  onRemindClick,
  onResendClick,
  onCancelClick,
}) => {
  const toast = useToast();
  const { user } = useAuth();
  const { hasRole } = useRBAC();
  const [activeTab, setActiveTab] = useState<'signers' | 'preview' | 'audit'>('signers');
  const [triggerDownload] = useLazyDownloadSignatureFileQuery();

  const isAdmin = hasRole(['SUPER_ADMIN', 'HR_ADMIN']);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !request) return null;

  const expired = isRequestExpired(request);
  const expiring = isExpiringSoon(request.expiresAt);
  const statusConfig = getStatusBadgeConfig(expired ? 'EXPIRED' : request.status);
  const userSigner = findSignerForUser(request, user);
  const userEligibleToSign = userSigner ? canUserSign(request, userSigner, user) : false;

  const handleDownload = async (type: 'signed' | 'certificate' | 'original') => {
    try {
      const res = await triggerDownload({ id: request.id, type }).unwrap();
      const url = URL.createObjectURL(res.blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = res.fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success(`Downloaded ${res.fileName}`, 'Download Complete');
    } catch {
      toast.error('Failed to download document file', 'Download Error');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="detail-sheet-title"
    >
      <div className="w-full max-w-2xl h-full bg-white dark:bg-[#1a1a1a] border-l border-slate-200 dark:border-zinc-800 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-250">
        {/* Top Header */}
        <div className="p-6 border-b border-slate-200 dark:border-zinc-800 space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs font-bold text-slate-500 dark:text-zinc-400">
                  {request.referenceNo}
                </span>
                <Badge variant={statusConfig.variant} size="sm">
                  {statusConfig.label}
                </Badge>
                <Badge variant="slate" size="sm">
                  {formatDocumentTypeLabel(request.documentType)}
                </Badge>
                <Badge variant="outline" size="sm">
                  {request.signingOrder}
                </Badge>
              </div>
              <h2
                id="detail-sheet-title"
                className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white truncate"
              >
                {request.title}
              </h2>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close sheet"
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Expiry countdown / alerts */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs text-slate-500 dark:text-zinc-400">
            <div className="flex items-center gap-1.5">
              <Clock className={cn('w-3.5 h-3.5', expiring && 'text-rose-500')} />
              <span className={cn(expiring && 'text-rose-600 dark:text-rose-400 font-semibold')}>
                {formatExpiryCountdown(request.expiresAt)}
              </span>
            </div>
            <div className="text-[11px]">
              Created by <span className="font-medium text-slate-700 dark:text-zinc-300">{request.createdBy.name}</span> on{' '}
              {new Date(request.createdAt).toLocaleDateString()}
            </div>
          </div>

          {/* Decline Reason Banner if present */}
          {request.status === 'DECLINED' && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block">Signature Declined</span>
                <p className="mt-0.5 leading-relaxed">
                  {request.signers.find((s) => s.status === 'DECLINED')?.declineReason ||
                    'A required party declined to sign this document.'}
                </p>
              </div>
            </div>
          )}

          {/* Nav Tabs */}
          <div className="flex border-b border-slate-200 dark:border-zinc-800 -mb-6 pt-2">
            {[
              { id: 'signers', label: `Signers (${request.progress.signed}/${request.progress.total})` },
              { id: 'preview', label: 'Document Preview' },
              { id: 'audit', label: 'Audit Timeline' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  'px-4 py-2 text-xs font-semibold border-b-2 transition-colors',
                  activeTab === tab.id
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                    : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'signers' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400">
                <span className="font-semibold uppercase tracking-wider text-[11px]">
                  Signer Execution Stepper
                </span>
                <span>
                  Order: <strong className="text-slate-700 dark:text-zinc-300">{request.signingOrder}</strong>
                </span>
              </div>

              <div className="space-y-3">
                {request.signers.map((signer, index) => {
                  const signerBadge = getSignerStatusBadgeConfig(signer.status);
                  const remindCheck = canRemindSigner(signer);

                  return (
                    <div
                      key={signer.id}
                      className={cn(
                        'p-4 rounded-2xl border transition-all',
                        signer.status === 'SIGNED'
                          ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40'
                          : signer.status === 'DECLINED'
                          ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/40'
                          : 'bg-white dark:bg-[#1f1f1f] border-slate-200 dark:border-zinc-800'
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 font-bold text-xs flex items-center justify-center shrink-0">
                            {request.signingOrder === 'SEQUENTIAL' ? signer.order : index + 1}
                          </div>

                          <div className="space-y-0.5">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="text-sm font-bold text-slate-900 dark:text-white">
                                {signer.name}
                              </span>
                              <Badge variant={signerBadge.variant} size="sm">
                                {signerBadge.label}
                              </Badge>
                              <Badge variant="outline" size="sm" className="text-[10px]">
                                {signer.role}
                              </Badge>
                            </div>

                            <p className="text-xs text-slate-500 dark:text-zinc-400">
                              {signer.email}
                            </p>

                            <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-400 dark:text-zinc-500">
                              <span className="flex items-center gap-1">
                                {signer.kind === 'EMPLOYEE' ? (
                                  <>
                                    <Building className="w-3 h-3 text-indigo-400" />
                                    <span>Employee ({signer.employeeId || 'ID Verified'})</span>
                                  </>
                                ) : (
                                  <>
                                    <Globe className="w-3 h-3 text-cyan-400" />
                                    <span>External Contact</span>
                                  </>
                                )}
                              </span>

                              {signer.signedAt && (
                                <span>Signed: {new Date(signer.signedAt).toLocaleString()}</span>
                              )}
                              {signer.viewedAt && !signer.signedAt && (
                                <span>Viewed: {new Date(signer.viewedAt).toLocaleString()}</span>
                              )}
                              {signer.lastReminderAt && (
                                <span>Reminded: {new Date(signer.lastReminderAt).toLocaleDateString()}</span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Signer Remind button */}
                        {isAdmin && ['PENDING', 'WAITING'].includes(signer.status) && (
                          <div className="shrink-0">
                            {remindCheck.canRemind ? (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => onRemindClick?.(request, [signer.id])}
                                className="text-xs rounded-xl"
                              >
                                <Bell className="w-3.5 h-3.5 mr-1 text-amber-500" />
                                <span>Remind</span>
                              </Button>
                            ) : (
                              <Tooltip content={remindCheck.reason || 'Reminder throttled'} position="left">
                                <span>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    disabled
                                    className="opacity-50 cursor-not-allowed text-xs rounded-xl"
                                  >
                                    <Bell className="w-3.5 h-3.5 mr-1" />
                                    <span>Remind</span>
                                  </Button>
                                </span>
                              </Tooltip>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'preview' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-zinc-800 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-zinc-400">File Name</span>
                  <span className="font-mono font-semibold text-slate-800 dark:text-zinc-200 truncate max-w-xs">
                    {request.fileName}
                  </span>
                </div>
                {request.fileSize && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-zinc-400">File Size</span>
                    <span className="font-mono text-slate-700 dark:text-zinc-300">
                      {Math.round(request.fileSize / 1024)} KB
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-zinc-400">Page Count</span>
                  <span className="text-slate-700 dark:text-zinc-300">{request.pageCount || 1} Pages</span>
                </div>
              </div>

              {/* Embedded Document Previewer */}
              <div className="h-96 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-slate-100 dark:bg-zinc-900 flex flex-col items-center justify-center p-6 text-center space-y-3">
                <FileText className="w-12 h-12 text-indigo-500" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {request.fileName}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 max-w-md">
                    Standard PDF preview engine. Legally binding electronic signatures will be anchored
                    upon completion.
                  </p>
                </div>
                {request.fileUrl && (
                  <a
                    href={request.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-slate-50 shadow-xs"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open in Full Viewer</span>
                  </a>
                )}
              </div>
            </div>
          )}

          {activeTab === 'audit' && (
            <SignatureAuditTimeline requestId={request.id} sha256={request.sha256} />
          )}
        </div>

        {/* Action Footer */}
        <div className="p-6 border-t border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-[#171717] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {/* Admin cancellation */}
            {isAdmin && ['PENDING', 'IN_PROGRESS'].includes(request.status) && (
              <Button
                variant="danger"
                size="sm"
                onClick={() => onCancelClick?.(request)}
                className="text-xs rounded-xl"
              >
                <Ban className="w-3.5 h-3.5 mr-1" />
                <span>Void / Cancel</span>
              </Button>
            )}

            {/* Admin resend if expired */}
            {isAdmin && expired && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => onResendClick?.(request)}
                className="text-xs rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                <RotateCw className="w-3.5 h-3.5 mr-1" />
                <span>Resend & Extend Expiry</span>
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            {/* If completed: downloads */}
            {request.status === 'COMPLETED' && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownload('certificate')}
                  className="text-xs rounded-xl"
                >
                  <Download className="w-3.5 h-3.5 mr-1" />
                  <span>Certificate</span>
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleDownload('signed')}
                  className="text-xs rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                >
                  <Download className="w-3.5 h-3.5 mr-1" />
                  <span>Signed PDF</span>
                </Button>
              </>
            )}

            {/* User direct Sign Action */}
            {userEligibleToSign && userSigner && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => onSignClick?.(request, userSigner.id)}
                className="text-xs rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20"
              >
                <FileSignature className="w-3.5 h-3.5 mr-1" />
                <span>Review & Sign Document</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignatureRequestDetailSheet;

