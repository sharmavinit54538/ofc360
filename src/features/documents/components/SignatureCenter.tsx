/**
 * @file SignatureCenter.tsx
 * @description Central workspace for Digital Signatures & E-Signs module.
 * Hosts Overview, Requests, To Sign, and Templates & Settings tabs, with
 * live stats, attention queues, audit feeds, and modal orchestrations.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Plus,
  FileSignature,
  Clock,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Settings,
  ExternalLink,
  ShieldAlert,
  Send,
  FileText,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import { useToast } from '@/shared/ui/Toast';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useRBAC } from '@/features/auth/hooks/useRBAC';
import { useGetDocumentsSettingsQuery } from '@/features/settings/api/settingsApi';
import {
  useGetSignatureStatsQuery,
  useGetSignatureRequestsQuery,
  useRemindSignersMutation,
  useResendRequestMutation,
  useCancelSignatureRequestMutation,
  useLazyDownloadSignatureFileQuery,
  extractApiErrorMessage,
} from '../api/signaturesApi';
import { SignatureStatsCards } from './SignatureStatsCards';
import { SignatureRequestsTable } from './SignatureRequestsTable';
import { SignatureRequestDetailSheet } from './SignatureRequestDetailSheet';
import {
  formatDocumentTypeLabel,
  getStatusBadgeConfig,
  formatExpiryCountdown,
  isExpiringSoon,
  isRequestExpired,
  canUserSign,
  findSignerForUser,
} from '../utils/signatureUtils';
import type {
  SignatureRequest,
  SignatureFilterParams,
  DocumentType,
} from '../types/signatures.types';

export interface SignatureCenterProps {
  onBackToVault: () => void;
  initialDocumentId?: string;
  autoOpenWizard?: boolean;
}

export const SignatureCenter: React.FC<SignatureCenterProps> = ({
  onBackToVault,
  initialDocumentId,
  autoOpenWizard = false,
}) => {
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();
  const { hasRole } = useRBAC();

  const isAdmin = hasRole(['SUPER_ADMIN', 'HR_ADMIN']);
  const canCreate = hasRole(['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER']);

  // Settings & Configuration
  const { data: docSettings } = useGetDocumentsSettingsQuery();
  const digitalSignatureConfig = docSettings?.digitalSignature;
  const isModuleEnabled = digitalSignatureConfig?.enabled ?? true;

  // Active Tab
  const [activeTab, setActiveTab] = useState<'overview' | 'requests' | 'to_sign' | 'settings'>('overview');

  // Filters State
  const [filters, setFilters] = useState<SignatureFilterParams>({
    scope: isAdmin ? 'all' : 'mine',
    status: 'ALL',
    type: 'ALL',
    search: '',
    createdByMe: false,
    page: 1,
    limit: 10,
  });

  // Queries
  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = useGetSignatureStatsQuery();
  const {
    data: requestsData,
    isLoading: requestsLoading,
    isError: requestsError,
    refetch: refetchRequests,
  } = useGetSignatureRequestsQuery(filters);

  // Mutations
  const [remindSignersMutation] = useRemindSignersMutation();
  const [resendRequestMutation] = useResendRequestMutation();
  const [cancelRequestMutation] = useCancelSignatureRequestMutation();
  const [triggerDownload] = useLazyDownloadSignatureFileQuery();

  // Modal Dialogs State
  const [selectedRequest, setSelectedRequest] = useState<SignatureRequest | null>(null);
  const [isDetailSheetOpen, setIsDetailSheetOpen] = useState(false);
  const [isWizardOpen, setIsWizardOpen] = useState(autoOpenWizard);
  const [wizardPrefillType, setWizardPrefillType] = useState<DocumentType | undefined>(undefined);
  const [wizardSourceDocId, setWizardSourceDocId] = useState<string | undefined>(initialDocumentId);

  // Sign Modal state
  const [signModalState, setSignModalState] = useState<{
    isOpen: boolean;
    request: SignatureRequest | null;
    signerId: string;
  }>({ isOpen: false, request: null, signerId: '' });

  // Cancel dialog state
  const [cancelDialogState, setCancelDialogState] = useState<{
    isOpen: boolean;
    request: SignatureRequest | null;
  }>({ isOpen: false, request: null });
  const [cancelReason, setCancelReason] = useState('');

  // Resend dialog state
  const [resendDialogState, setResendDialogState] = useState<{
    isOpen: boolean;
    request: SignatureRequest | null;
  }>({ isOpen: false, request: null });

  const allRequests = requestsData?.items || [];

  // Filter items needing attention: Expiring soon (≤3d), Declined, or Expired
  const attentionItems = allRequests.filter((r) => {
    if (r.status === 'DECLINED') return true;
    if (isRequestExpired(r)) return true;
    return isExpiringSoon(r.expiresAt) && ['PENDING', 'IN_PROGRESS'].includes(r.status);
  });

  // Filter items waiting for current user's signature
  const toSignItems = allRequests.filter((r) => {
    const signer = findSignerForUser(r, user);
    return signer ? canUserSign(r, signer, user) : false;
  });

  // Action Handlers
  const handleOpenDetail = (request: SignatureRequest) => {
    setSelectedRequest(request);
    setIsDetailSheetOpen(true);
  };

  const handleOpenSignModal = (request: SignatureRequest, signerId: string) => {
    setSignModalState({ isOpen: true, request, signerId });
  };

  const handleRemind = async (request: SignatureRequest, signerIds?: string[]) => {
    try {
      await remindSignersMutation({ id: request.id, payload: { signerIds } }).unwrap();
      toast.success('Reminder notification sent successfully', 'Reminders Dispatched');
      refetchRequests();
    } catch (err) {
      toast.error(extractApiErrorMessage(err, 'Failed to send reminders'), 'Error');
    }
  };

  const handleBulkRemind = async (requestIds: string[]) => {
    try {
      for (const id of requestIds) {
        await remindSignersMutation({ id }).unwrap();
      }
      toast.success(`Sent reminders for ${requestIds.length} request(s)`, 'Bulk Reminders Dispatched');
      refetchRequests();
    } catch (err) {
      toast.error(extractApiErrorMessage(err, 'Bulk remind failed'), 'Error');
    }
  };

  const handleResend = (request: SignatureRequest) => {
    setResendDialogState({ isOpen: true, request });
  };

  const confirmResend = async () => {
    if (!resendDialogState.request) return;
    try {
      await resendRequestMutation({
        id: resendDialogState.request.id,
        payload: { extendDays: 7 },
      }).unwrap();
      toast.success('Signature request resent and extended by 7 days', 'Request Resent');
      setResendDialogState({ isOpen: false, request: null });
      refetchRequests();
      refetchStats();
      if (selectedRequest?.id === resendDialogState.request.id) {
        setIsDetailSheetOpen(false);
      }
    } catch (err) {
      toast.error(extractApiErrorMessage(err, 'Failed to resend request'), 'Error');
    }
  };

  const handleCancel = (request: SignatureRequest) => {
    setCancelReason('');
    setCancelDialogState({ isOpen: true, request });
  };

  const confirmCancel = async () => {
    if (!cancelDialogState.request) return;
    if (cancelReason.trim().length < 5) {
      toast.error('Please enter a cancellation reason of at least 5 characters.', 'Reason Required');
      return;
    }
    try {
      await cancelRequestMutation({
        id: cancelDialogState.request.id,
        payload: { reason: cancelReason },
      }).unwrap();
      toast.success('Signature request cancelled and voided', 'Request Cancelled');
      setCancelDialogState({ isOpen: false, request: null });
      refetchRequests();
      refetchStats();
      if (selectedRequest?.id === cancelDialogState.request.id) {
        setIsDetailSheetOpen(false);
      }
    } catch (err) {
      toast.error(extractApiErrorMessage(err, 'Failed to cancel request'), 'Error');
    }
  };

  const handleDownload = async (request: SignatureRequest, type: 'signed' | 'certificate') => {
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
      toast.error('Failed to download file', 'Error');
    }
  };

  const handleLaunchWizard = (documentType?: DocumentType, sourceDocId?: string) => {
    setWizardPrefillType(documentType);
    setWizardSourceDocId(sourceDocId);
    setIsWizardOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Breadcrumb Back Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-zinc-800 shadow-xs">
        <button
          type="button"
          onClick={onBackToVault}
          className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Documents & Policies Vault</span>
        </button>

        <div className="flex items-center gap-2">
          <Badge variant="slate" size="sm">
            Provider: {digitalSignatureConfig?.provider?.toUpperCase() || 'INTERNAL'}
          </Badge>
          <Badge variant={isModuleEnabled ? 'success' : 'warning'} size="sm">
            {isModuleEnabled ? 'E-Sign Active' : 'Signatures Disabled'}
          </Badge>
          {canCreate && (
            <Button
              variant="primary"
              size="sm"
              disabled={!isModuleEnabled}
              onClick={() => handleLaunchWizard()}
              className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>New Signature Request</span>
            </Button>
          )}
        </div>
      </div>

      {/* Disabled module warning banner if disabled in settings */}
      {!isModuleEnabled && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start justify-between gap-4 text-xs text-amber-800 dark:text-amber-200">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block text-sm">Digital Signatures Are Disabled</span>
              <p className="mt-0.5 text-slate-600 dark:text-zinc-400 leading-relaxed">
                The digital signature workflow is turned off in organization settings. Document generation
                and downloads remain accessible, but new signature dispatches are paused.
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate('/settings/documents')}
            className="text-xs shrink-0 rounded-xl bg-white dark:bg-zinc-800"
          >
            <Settings className="w-3.5 h-3.5 mr-1" />
            <span>Configure in Settings</span>
          </Button>
        </div>
      )}

      {/* Main Module Tabs Header */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-zinc-800 overflow-x-auto no-scrollbar">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'requests', label: `Requests (${requestsData?.total ?? 0})` },
          { id: 'to_sign', label: `To Sign (${toSignItems.length})`, badge: toSignItems.length > 0 },
          { id: 'settings', label: 'Templates & Settings' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              'px-4 py-2.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 shrink-0',
              activeTab === tab.id
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white'
            )}
          >
            <span>{tab.label}</span>
            {tab.badge && (
              <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0 animate-pulse" />
            )}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* KPI Statistics Grid */}
          <SignatureStatsCards
            stats={stats}
            isLoading={statsLoading}
            activeFilter={filters.status}
            onCardClick={(filterId) => {
              if (filterId === 'awaiting_me') {
                setActiveTab('to_sign');
              } else {
                setActiveTab('requests');
                if (filterId === 'completed') setFilters({ ...filters, status: 'COMPLETED' });
                else if (filterId === 'declined_expired') setFilters({ ...filters, status: 'DECLINED' });
              }
            }}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Needs Attention Queue */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-zinc-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Needs Attention ({attentionItems.length})
                  </h3>
                </div>
                <span className="text-[11px] text-slate-400 dark:text-zinc-500">
                  Expiring soon or contested
                </span>
              </div>

              {attentionItems.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400 dark:text-zinc-500">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
                  <span>No signature requests currently need urgent intervention.</span>
                </div>
              ) : (
                <div className="space-y-3">
                  {attentionItems.slice(0, 4).map((item) => {
                    const isExpired = isRequestExpired(item);
                    return (
                      <div
                        key={item.id}
                        className="p-3 rounded-xl bg-slate-50 dark:bg-[#141414] border border-slate-100 dark:border-zinc-800/80 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="space-y-0.5 min-w-0">
                          <button
                            type="button"
                            onClick={() => handleOpenDetail(item)}
                            className="font-semibold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 truncate block text-left"
                          >
                            {item.title}
                          </button>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-zinc-400">
                            <span className="font-mono text-slate-400">{item.referenceNo}</span>
                            <span>•</span>
                            <span className={cn('font-medium', isExpired ? 'text-slate-400' : 'text-rose-600 dark:text-rose-400')}>
                              {formatExpiryCountdown(item.expiresAt)}
                            </span>
                          </div>
                        </div>

                        <div className="shrink-0 flex items-center gap-1.5">
                          {isExpired ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleResend(item)}
                              className="text-[11px] h-7 px-2.5 rounded-lg text-indigo-600 dark:text-indigo-400"
                            >
                              <RotateCcw className="w-3 h-3 mr-1" />
                              <span>Resend</span>
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRemind(item)}
                              className="text-[11px] h-7 px-2.5 rounded-lg text-amber-600 dark:text-amber-400"
                            >
                              <Bell className="w-3 h-3 mr-1" />
                              <span>Remind</span>
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Quick Flow Launch Shortcuts */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-zinc-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Quick-Start Workflows
                  </h3>
                </div>
                <span className="text-[11px] text-slate-400 dark:text-zinc-500">
                  Pre-configured letter templates
                </span>
              </div>

              <div className="space-y-2.5">
                {[
                  {
                    type: 'OFFER_LETTER' as DocumentType,
                    title: 'Send Offer Letter for E-Sign',
                    desc: 'Executive or engineering candidate offer agreement package.',
                  },
                  {
                    type: 'NDA' as DocumentType,
                    title: 'Execute Mutual Non-Disclosure Agreement',
                    desc: 'Bilateral confidentiality deed for external vendors or partners.',
                  },
                  {
                    type: 'POLICY_ACK' as DocumentType,
                    title: 'Employee Policy & Handbook Sign-Off',
                    desc: 'Annual IT security or company conduct compliance verification.',
                  },
                ].map((flow) => (
                  <div
                    key={flow.type}
                    onClick={() => canCreate && isModuleEnabled && handleLaunchWizard(flow.type)}
                    className={cn(
                      'p-3.5 rounded-xl border border-slate-100 dark:border-zinc-800/80 bg-slate-50/50 dark:bg-[#141414] transition-all flex items-center justify-between gap-3',
                      canCreate && isModuleEnabled
                        ? 'cursor-pointer hover:border-indigo-300 dark:hover:border-indigo-600 hover:-translate-y-0.5'
                        : 'opacity-60 cursor-not-allowed'
                    )}
                  >
                    <div className="space-y-0.5 min-w-0">
                      <span className="text-xs font-bold text-slate-900 dark:text-white block truncate">
                        {flow.title}
                      </span>
                      <p className="text-[11px] text-slate-500 dark:text-zinc-400 truncate">
                        {flow.desc}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={!canCreate || !isModuleEnabled}
                      className="text-xs text-indigo-600 dark:text-indigo-400 shrink-0"
                    >
                      <span>Start</span>
                      <Send className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: REQUESTS TABLE */}
      {activeTab === 'requests' && (
        <SignatureRequestsTable
          requests={allRequests}
          total={requestsData?.total ?? 0}
          page={filters.page || 1}
          limit={filters.limit || 10}
          isLoading={requestsLoading}
          isError={requestsError}
          filters={filters}
          onFilterChange={setFilters}
          onPageChange={(page) => setFilters({ ...filters, page })}
          onRetry={refetchRequests}
          onViewRequest={handleOpenDetail}
          onSignRequest={handleOpenSignModal}
          onRemindSigners={handleRemind}
          onResendRequest={handleResend}
          onCancelRequest={handleCancel}
          onDownloadFile={handleDownload}
          onBulkRemind={handleBulkRemind}
        />
      )}

      {/* TAB 3: TO SIGN (PENDING USER'S ACTION) */}
      {activeTab === 'to_sign' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-zinc-800 flex items-center justify-between text-xs text-slate-600 dark:text-zinc-400">
            <span>
              Documents awaiting your electronic signature ({toSignItems.length})
            </span>
            <span className="text-[11px] text-slate-400">
              Only items where it is currently your turn in sequence are shown.
            </span>
          </div>

          {toSignItems.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-[#1a1a1a] rounded-2xl border border-slate-200 dark:border-zinc-800 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                You&apos;re All Caught Up!
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-sm mx-auto">
                There are no pending documents waiting for your signature at this moment.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {toSignItems.map((item) => {
                const userSigner = findSignerForUser(item, user);
                const expiring = isExpiringSoon(item.expiresAt);

                return (
                  <div
                    key={item.id}
                    className="p-5 rounded-2xl bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-zinc-800 flex flex-col justify-between space-y-4 hover:border-indigo-400 dark:hover:border-indigo-600 shadow-xs transition-all"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-xs text-slate-400 font-semibold">
                          {item.referenceNo}
                        </span>
                        <Badge variant="warning" size="sm">
                          Action Required
                        </Badge>
                      </div>

                      <h4 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1">
                        {item.title}
                      </h4>

                      <p className="text-xs text-slate-500 dark:text-zinc-400 line-clamp-2">
                        {item.message || 'Please review this official document and execute your electronic signature.'}
                      </p>

                      <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-zinc-500 pt-2 border-t border-slate-100 dark:border-zinc-800">
                        <Clock className={cn('w-3.5 h-3.5', expiring && 'text-rose-500')} />
                        <span className={cn(expiring && 'text-rose-600 dark:text-rose-400 font-semibold')}>
                          Expires {formatExpiryCountdown(item.expiresAt)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 pt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenDetail(item)}
                        className="text-xs rounded-xl"
                      >
                        <span>Preview Document</span>
                      </Button>

                      {userSigner && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleOpenSignModal(item, userSigner.id)}
                          className="text-xs rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm flex items-center gap-1.5"
                        >
                          <FileSignature className="w-3.5 h-3.5" />
                          <span>Review & Sign</span>
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: TEMPLATES & SETTINGS */}
      {activeTab === 'settings' && (
        <div className="space-y-6 max-w-4xl">
          <div className="p-6 rounded-2xl bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-zinc-800 space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Digital Signatures & E-Sign Configuration
                </h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                  System-wide e-signing rules, default expiration intervals, automated reminder cadence, and external signature providers.
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/settings/documents')}
                className="text-xs shrink-0 rounded-xl"
              >
                <Settings className="w-3.5 h-3.5 mr-1" />
                <span>Edit in Settings</span>
                <ExternalLink className="w-3 h-3 ml-1 text-slate-400" />
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-zinc-800 space-y-1">
                <span className="text-slate-400 dark:text-zinc-500 block text-[11px]">Provider Adapter</span>
                <span className="font-bold text-slate-900 dark:text-white capitalize text-sm">
                  {digitalSignatureConfig?.provider || 'Internal HTML5 Signature Pad'}
                </span>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 pt-1">
                  Legally binding electronic signature pursuant to Information Technology Act, 2000.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-zinc-800 space-y-1">
                <span className="text-slate-400 dark:text-zinc-500 block text-[11px]">Default Validity Duration</span>
                <span className="font-bold text-slate-900 dark:text-white text-sm">
                  {digitalSignatureConfig?.expiryDays || 14} Days
                </span>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 pt-1">
                  Dispatched signature requests automatically lapse after this duration.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-zinc-800 space-y-1">
                <span className="text-slate-400 dark:text-zinc-500 block text-[11px]">Automated Reminder Cadence</span>
                <span className="font-bold text-slate-900 dark:text-white text-sm">
                  Day {digitalSignatureConfig?.reminderDays?.join(', Day ') || '3, Day 7'}
                </span>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 pt-1">
                  Automated email notices dispatched to signers who have not yet executed.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-zinc-800 space-y-1">
                <span className="text-slate-400 dark:text-zinc-500 block text-[11px]">Auto-Send on Document Generation</span>
                <span className="font-bold text-slate-900 dark:text-white text-sm">
                  {digitalSignatureConfig?.autoSendOnGenerate ? 'Enabled' : 'Disabled'}
                </span>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 pt-1">
                  {digitalSignatureConfig?.autoSendOnGenerate
                    ? 'AI Document Generator automatically pre-fills this signature wizard.'
                    : 'Manual signature dispatch required after generation.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Slide-Over Request Detail Sheet */}
      <SignatureRequestDetailSheet
        request={selectedRequest}
        isOpen={isDetailSheetOpen}
        onClose={() => {
          setIsDetailSheetOpen(false);
          setSelectedRequest(null);
        }}
        onSignClick={(req, sId) => {
          setIsDetailSheetOpen(false);
          handleOpenSignModal(req, sId);
        }}
        onRemindClick={handleRemind}
        onResendClick={handleResend}
        onCancelClick={handleCancel}
      />

      {/* Resend Confirmation Modal */}
      {resendDialogState.isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-slate-200 dark:border-zinc-800 max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Resend Signature Request
            </h3>
            <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
              This will re-activate the signature request, reset its status to PENDING, extend the validity
              expiration by 7 days, and dispatch fresh notifications to pending signers.
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-zinc-800">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setResendDialogState({ isOpen: false, request: null })}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={confirmResend}
                className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Confirm Resend
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {cancelDialogState.isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-slate-200 dark:border-zinc-800 max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2">
              <Ban className="w-5 h-5" />
              <span>Void & Cancel Request</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
              Cancelling is irreversible. Remaining signers will no longer be permitted to sign, and this action
              will be permanently recorded in the immutable audit log.
            </p>
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-zinc-300 block">
                Mandatory Reason for Cancellation:
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="e.g. Terms renegotiated, candidate withdrew, or erroneous attachment..."
                rows={3}
                className="w-full p-2.5 rounded-xl text-xs bg-slate-50 dark:bg-[#141414] border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-zinc-800">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCancelDialogState({ isOpen: false, request: null })}
                className="text-xs"
              >
                Close
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={confirmCancel}
                className="text-xs"
              >
                Confirm Cancellation
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignatureCenter;

