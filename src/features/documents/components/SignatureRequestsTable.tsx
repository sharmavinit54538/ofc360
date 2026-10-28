/**
 * @file SignatureRequestsTable.tsx
 * @description Searchable, filterable, and paginated data table for Digital Signature Requests
 * featuring signer avatar stacks, countdowns, bulk reminders, and responsive controls.
 */

import React, { useState } from 'react';
import {
  Search,
  Filter,
  RotateCcw,
  Bell,
  Eye,
  FileSignature,
  Download,
  MoreVertical,
  RotateCw,
  Ban,
  Clock,
  CheckSquare,
  Square,
  Users,
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import { Input } from '@/shared/ui/Input';
import { Select } from '@/shared/ui/Select';
import { Tooltip } from '@/shared/ui/Tooltip';
import { Skeleton } from '@/shared/ui/Skeleton';
import { EmptyState } from '@/shared/ui/EmptyState';
import { ErrorDisplay } from '@/shared/ui/ErrorDisplay';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useRBAC } from '@/features/auth/hooks/useRBAC';
import {
  formatDocumentTypeLabel,
  getStatusBadgeConfig,
  formatExpiryCountdown,
  isExpiringSoon,
  isRequestExpired,
  canUserSign,
  canRemindSigner,
  findSignerForUser,
} from '../utils/signatureUtils';
import type {
  SignatureRequest,
  SignatureFilterParams,
  DocumentType,
  SignatureRequestStatus,
} from '../types/signatures.types';

export interface SignatureRequestsTableProps {
  requests: SignatureRequest[];
  total: number;
  page: number;
  limit: number;
  isLoading: boolean;
  isError: boolean;
  filters: SignatureFilterParams;
  onFilterChange: (filters: SignatureFilterParams) => void;
  onPageChange: (newPage: number) => void;
  onRetry: () => void;
  onViewRequest: (request: SignatureRequest) => void;
  onSignRequest: (request: SignatureRequest, signerId: string) => void;
  onRemindSigners: (request: SignatureRequest, signerIds?: string[]) => void;
  onResendRequest: (request: SignatureRequest) => void;
  onCancelRequest: (request: SignatureRequest) => void;
  onDownloadFile: (request: SignatureRequest, type: 'signed' | 'certificate') => void;
  onBulkRemind?: (requestIds: string[]) => void;
}

export const SignatureRequestsTable: React.FC<SignatureRequestsTableProps> = ({
  requests,
  total,
  page,
  limit,
  isLoading,
  isError,
  filters,
  onFilterChange,
  onPageChange,
  onRetry,
  onViewRequest,
  onSignRequest,
  onRemindSigners,
  onResendRequest,
  onCancelRequest,
  onDownloadFile,
  onBulkRemind,
}) => {
  const { user } = useAuth();
  const { hasRole } = useRBAC();
  const isAdmin = hasRole(['SUPER_ADMIN', 'HR_ADMIN']);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [openActionId, setOpenActionId] = useState<string | null>(null);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  const handleSelectAll = () => {
    if (selectedIds.length === requests.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(requests.map((r) => r.id));
    }
  };

  const handleToggleRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleResetFilters = () => {
    onFilterChange({
      scope: isAdmin ? 'all' : 'mine',
      status: 'ALL',
      type: 'ALL',
      search: '',
      createdByMe: false,
      page: 1,
      limit: 10,
    });
  };

  return (
    <div className="space-y-4">
      {/* Filter and Control Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-zinc-800 space-y-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search box */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={filters.search || ''}
              onChange={(e) => onFilterChange({ ...filters, search: e.target.value, page: 1 })}
              placeholder="Search reference, title, signer name, or email..."
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Status Dropdown */}
          <div className="w-full sm:w-44 shrink-0">
            <select
              value={filters.status || 'ALL'}
              onChange={(e) => onFilterChange({ ...filters, status: e.target.value as any, page: 1 })}
              className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="DECLINED">Declined</option>
              <option value="EXPIRED">Expired</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="DRAFT">Draft</option>
            </select>
          </div>

          {/* Document Type Dropdown */}
          <div className="w-full sm:w-48 shrink-0">
            <select
              value={filters.type || 'ALL'}
              onChange={(e) => onFilterChange({ ...filters, type: e.target.value as any, page: 1 })}
              className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">All Document Types</option>
              <option value="OFFER_LETTER">Offer Letter</option>
              <option value="APPOINTMENT_LETTER">Appointment Letter</option>
              <option value="INCREMENT_LETTER">Increment Letter</option>
              <option value="RELIEVING_LETTER">Relieving Letter</option>
              <option value="NDA">NDA Agreement</option>
              <option value="POLICY_ACK">Policy Sign-Off</option>
              <option value="CONTRACT">Contract</option>
              <option value="OTHER">Other Documents</option>
            </select>
          </div>

          {/* Reset button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetFilters}
            className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white shrink-0 rounded-xl"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            <span>Reset</span>
          </Button>
        </div>

        {/* Admin Scope & Checkbox Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-zinc-800/80 text-xs">
          <div className="flex items-center gap-4">
            {isAdmin && (
              <div className="flex items-center gap-2">
                <span className="text-slate-500 dark:text-zinc-400 font-medium">Scope:</span>
                <div className="inline-flex rounded-lg p-0.5 bg-slate-100 dark:bg-zinc-800">
                  <button
                    type="button"
                    onClick={() => onFilterChange({ ...filters, scope: 'all', page: 1 })}
                    className={cn(
                      'px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all',
                      filters.scope !== 'mine'
                        ? 'bg-white dark:bg-[#1f1f1f] text-slate-900 dark:text-white shadow-xs'
                        : 'text-slate-500 dark:text-zinc-400'
                    )}
                  >
                    All Organization
                  </button>
                  <button
                    type="button"
                    onClick={() => onFilterChange({ ...filters, scope: 'mine', page: 1 })}
                    className={cn(
                      'px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all',
                      filters.scope === 'mine'
                        ? 'bg-white dark:bg-[#1f1f1f] text-slate-900 dark:text-white shadow-xs'
                        : 'text-slate-500 dark:text-zinc-400'
                    )}
                  >
                    My Requests
                  </button>
                </div>
              </div>
            )}

            <label className="inline-flex items-center gap-1.5 cursor-pointer text-slate-600 dark:text-zinc-400 select-none">
              <input
                type="checkbox"
                checked={Boolean(filters.createdByMe)}
                onChange={(e) => onFilterChange({ ...filters, createdByMe: e.target.checked, page: 1 })}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span>Created by me only</span>
            </label>
          </div>

          {/* Bulk Selection Notice */}
          {selectedIds.length > 0 && (
            <div className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-950/40 px-3 py-1 rounded-xl border border-indigo-200 dark:border-indigo-900/50">
              <span className="text-[11px] font-semibold text-indigo-700 dark:text-indigo-300">
                {selectedIds.length} request(s) selected
              </span>
              {isAdmin && (
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => onBulkRemind?.(selectedIds)}
                  className="text-[11px] h-7 px-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
                >
                  <Bell className="w-3 h-3 mr-1" />
                  <span>Remind Selected</span>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Table View */}
      {isError ? (
        <ErrorDisplay
          title="Failed to Load Signature Requests"
          message="Could not retrieve signature workflows from the server. Please verify your connection."
          onRetry={onRetry}
        />
      ) : isLoading ? (
        <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-slate-200 dark:border-zinc-800 p-6 space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between gap-4 py-2 border-b border-slate-100 dark:border-zinc-800 last:border-0">
              <Skeleton className="h-4 w-28 rounded" />
              <Skeleton className="h-4 w-48 rounded" />
              <Skeleton className="h-4 w-24 rounded" />
              <Skeleton className="h-4 w-16 rounded" />
            </div>
          ))}
        </div>
      ) : requests.length === 0 ? (
        <EmptyState
          icon={FileSignature}
          title="No Signature Requests Found"
          description="There are no signature requests matching your current filter criteria."
          actionLabel="Reset Filters"
          onAction={handleResetFilters}
        />
      ) : (
        <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-[#141414] border-b border-slate-200 dark:border-zinc-800 text-slate-500 dark:text-zinc-400 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4 w-10">
                    <button
                      type="button"
                      onClick={handleSelectAll}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
                      aria-label="Select all rows"
                    >
                      {selectedIds.length === requests.length && requests.length > 0 ? (
                        <CheckSquare className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  <th className="py-3 px-4">Reference</th>
                  <th className="py-3 px-4 min-w-[220px]">Document & Title</th>
                  <th className="py-3 px-4">Signers</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Sent Date</th>
                  <th className="py-3 px-4">Expires</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/80">
                {requests.map((req) => {
                  const isExpired = isRequestExpired(req);
                  const expiring = isExpiringSoon(req.expiresAt);
                  const statusConfig = getStatusBadgeConfig(isExpired ? 'EXPIRED' : req.status);
                  const isSelected = selectedIds.includes(req.id);
                  const userSigner = findSignerForUser(req, user);
                  const userCanSignThis = userSigner ? canUserSign(req, userSigner, user) : false;

                  return (
                    <tr
                      key={req.id}
                      className={cn(
                        'hover:bg-slate-50/70 dark:hover:bg-zinc-800/40 transition-colors',
                        isSelected && 'bg-indigo-50/40 dark:bg-indigo-950/20'
                      )}
                    >
                      {/* Checkbox */}
                      <td className="py-3.5 px-4">
                        <button
                          type="button"
                          onClick={() => handleToggleRow(req.id)}
                          className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
                          aria-label={`Select request ${req.referenceNo}`}
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </td>

                      {/* Reference Number */}
                      <td className="py-3.5 px-4 font-mono font-semibold text-slate-700 dark:text-zinc-300">
                        {req.referenceNo}
                      </td>

                      {/* Title & Type */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <button
                            type="button"
                            onClick={() => onViewRequest(req)}
                            className="font-semibold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 text-left line-clamp-1 transition-colors"
                          >
                            {req.title}
                          </button>
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-zinc-500">
                            <span>{formatDocumentTypeLabel(req.documentType)}</span>
                            <span>•</span>
                            <span className="truncate max-w-[150px]">{req.fileName}</span>
                          </div>
                        </div>
                      </td>

                      {/* Signers Stack */}
                      <td className="py-3.5 px-4">
                        <Tooltip
                          content={
                            <div className="space-y-1 py-1 max-w-xs text-xs">
                              <span className="font-bold block text-white">Signers:</span>
                              {req.signers.map((s) => (
                                <div key={s.id} className="flex items-center justify-between gap-3 text-[11px]">
                                  <span>{s.name}</span>
                                  <span className="font-semibold">{s.status}</span>
                                </div>
                              ))}
                            </div>
                          }
                          position="top"
                        >
                          <div className="inline-flex items-center gap-2 cursor-help">
                            {/* Avatar stack */}
                            <div className="flex -space-x-1.5 overflow-hidden">
                              {req.signers.slice(0, 3).map((signer) => (
                                <div
                                  key={signer.id}
                                  className={cn(
                                    'inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-[#1a1a1a] flex items-center justify-center text-[10px] font-bold uppercase',
                                    signer.status === 'SIGNED'
                                      ? 'bg-emerald-500 text-white'
                                      : signer.status === 'DECLINED'
                                      ? 'bg-rose-500 text-white'
                                      : 'bg-slate-200 dark:bg-zinc-700 text-slate-700 dark:text-zinc-200'
                                  )}
                                >
                                  {signer.name.charAt(0)}
                                </div>
                              ))}
                            </div>
                            <span className="text-[11px] font-semibold text-slate-600 dark:text-zinc-300">
                              {req.progress.signed}/{req.progress.total}
                            </span>
                          </div>
                        </Tooltip>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <Badge variant={statusConfig.variant} size="sm">
                          {statusConfig.label}
                        </Badge>
                      </td>

                      {/* Sent Date */}
                      <td className="py-3.5 px-4 text-slate-500 dark:text-zinc-400 text-[11px]">
                        {req.sentAt ? new Date(req.sentAt).toLocaleDateString() : 'Draft'}
                      </td>

                      {/* Expiry relative countdown */}
                      <td className="py-3.5 px-4 text-[11px]">
                        <span
                          className={cn(
                            'font-medium',
                            expiring && 'text-rose-600 dark:text-rose-400 font-bold',
                            isExpired && 'text-slate-400 dark:text-zinc-600'
                          )}
                        >
                          {formatExpiryCountdown(req.expiresAt)}
                        </span>
                      </td>

                      {/* Row Action Buttons */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          {/* If current user can sign, show primary Review & Sign button */}
                          {userCanSignThis && userSigner && (
                            <Button
                              size="sm"
                              variant="primary"
                              onClick={() => onSignRequest(req, userSigner.id)}
                              className="text-[11px] h-7 px-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-xs"
                            >
                              <FileSignature className="w-3 h-3 mr-1" />
                              <span>Sign</span>
                            </Button>
                          )}

                          {/* Quick View Button */}
                          <button
                            type="button"
                            onClick={() => onViewRequest(req)}
                            aria-label={`View request ${req.referenceNo}`}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Completed: quick download signed document */}
                          {req.status === 'COMPLETED' && (
                            <button
                              type="button"
                              onClick={() => onDownloadFile(req, 'signed')}
                              title="Download Signed PDF"
                              aria-label={`Download signed PDF for ${req.referenceNo}`}
                              className="p-1.5 rounded-lg text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          )}

                          {/* Admin 3-dot dropdown menu */}
                          {isAdmin && (
                            <div className="relative">
                              <button
                                type="button"
                                onClick={() => setOpenActionId(openActionId === req.id ? null : req.id)}
                                aria-label="More actions"
                                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
                              >
                                <MoreVertical className="w-4 h-4" />
                              </button>

                              {openActionId === req.id && (
                                <>
                                  <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setOpenActionId(null)}
                                  />
                                  <div className="absolute right-0 top-full mt-1 w-44 rounded-xl bg-white dark:bg-[#1f1f1f] border border-slate-200 dark:border-zinc-800 shadow-xl py-1 z-20 text-xs">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setOpenActionId(null);
                                        onViewRequest(req);
                                      }}
                                      className="w-full text-left px-3 py-1.5 hover:bg-slate-50 dark:hover:bg-zinc-800 flex items-center gap-2 text-slate-700 dark:text-zinc-200"
                                    >
                                      <Eye className="w-3.5 h-3.5" />
                                      <span>View Details</span>
                                    </button>

                                    {['PENDING', 'IN_PROGRESS'].includes(req.status) && (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setOpenActionId(null);
                                          onRemindSigners(req);
                                        }}
                                        className="w-full text-left px-3 py-1.5 hover:bg-slate-50 dark:hover:bg-zinc-800 flex items-center gap-2 text-slate-700 dark:text-zinc-200"
                                      >
                                        <Bell className="w-3.5 h-3.5 text-amber-500" />
                                        <span>Send Reminders</span>
                                      </button>
                                    )}

                                    {isExpired && (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setOpenActionId(null);
                                          onResendRequest(req);
                                        }}
                                        className="w-full text-left px-3 py-1.5 hover:bg-slate-50 dark:hover:bg-zinc-800 flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold"
                                      >
                                        <RotateCw className="w-3.5 h-3.5" />
                                        <span>Resend Request</span>
                                      </button>
                                    )}

                                    {['PENDING', 'IN_PROGRESS'].includes(req.status) && (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setOpenActionId(null);
                                          onCancelRequest(req);
                                        }}
                                        className="w-full text-left px-3 py-1.5 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2 text-rose-600 dark:text-rose-400"
                                      >
                                        <Ban className="w-3.5 h-3.5" />
                                        <span>Void / Cancel</span>
                                      </button>
                                    )}

                                    {req.status === 'COMPLETED' && (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setOpenActionId(null);
                                          onDownloadFile(req, 'certificate');
                                        }}
                                        className="w-full text-left px-3 py-1.5 hover:bg-slate-50 dark:hover:bg-zinc-800 flex items-center gap-2 text-slate-700 dark:text-zinc-200"
                                      >
                                        <Download className="w-3.5 h-3.5" />
                                        <span>Certificate of Completion</span>
                                      </button>
                                    )}
                                  </div>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="p-4 border-t border-slate-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-zinc-400">
            <div>
              Showing <span className="font-semibold text-slate-900 dark:text-white">{(page - 1) * limit + 1}</span> to{' '}
              <span className="font-semibold text-slate-900 dark:text-white">{Math.min(page * limit, total)}</span> of{' '}
              <span className="font-semibold text-slate-900 dark:text-white">{total}</span> requests
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => onPageChange(page - 1)}
                className="text-xs rounded-xl"
              >
                Previous
              </Button>
              <span className="px-2 font-medium">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => onPageChange(page + 1)}
                className="text-xs rounded-xl"
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignatureRequestsTable;

