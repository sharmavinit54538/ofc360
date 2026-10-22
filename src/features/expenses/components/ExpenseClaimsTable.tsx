import React from 'react';
import {
  Receipt,
  CheckCircle2,
  XCircle,
  Eye,
  Trash2,
  Clock,
  User,
  DollarSign,
  Paperclip,
  Utensils,
  Plane,
  Building2,
  Laptop,
  Briefcase,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { Badge } from '@/shared/ui/Badge';
import type { ExpenseClaim, ExpenseStatus, ExpenseCategory } from '../types/expenses.types';

interface ExpenseClaimsTableProps {
  claims: ExpenseClaim[];
  isLoading: boolean;
  onReview: (claim: ExpenseClaim) => void;
  onApproveQuick: (claim: ExpenseClaim) => void;
  onRejectQuick: (claim: ExpenseClaim) => void;
  onDelete: (id: string) => void;
  isActionLoading?: boolean;
}

export const ExpenseClaimsTable: React.FC<ExpenseClaimsTableProps> = ({
  claims,
  isLoading,
  onReview,
  onApproveQuick,
  onRejectQuick,
  onDelete,
  isActionLoading = false,
}) => {
  const getStatusBadge = (status: ExpenseStatus) => {
    switch (status) {
      case 'APPROVED':
        return (
          <Badge variant="success" size="sm" className="font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Approved
          </Badge>
        );
      case 'PAID':
        return (
          <Badge variant="brand" size="sm" className="font-semibold flex items-center gap-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800">
            <DollarSign className="w-3 h-3" />
            Reimbursed
          </Badge>
        );
      case 'SUBMITTED':
        return (
          <Badge variant="warning" size="sm" className="font-semibold flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Pending Approval
          </Badge>
        );
      case 'REJECTED':
        return (
          <Badge variant="danger" size="sm" className="font-semibold flex items-center gap-1">
            <XCircle className="w-3 h-3" />
            Rejected
          </Badge>
        );
      case 'DRAFT':
      default:
        return (
          <Badge variant="slate" size="sm" className="font-semibold">
            Draft
          </Badge>
        );
    }
  };

  const getCategoryIcon = (category: ExpenseCategory) => {
    switch (category) {
      case 'TRAVEL':
        return <Plane className="w-3.5 h-3.5 text-blue-500" />;
      case 'MEALS':
        return <Utensils className="w-3.5 h-3.5 text-amber-500" />;
      case 'LODGING':
        return <Building2 className="w-3.5 h-3.5 text-indigo-500" />;
      case 'SOFTWARE':
      case 'EQUIPMENT':
        return <Laptop className="w-3.5 h-3.5 text-emerald-500" />;
      case 'TRAINING':
        return <GraduationCap className="w-3.5 h-3.5 text-purple-500" />;
      case 'CLIENT_ENTERTAINMENT':
        return <Sparkles className="w-3.5 h-3.5 text-rose-500" />;
      default:
        return <Briefcase className="w-3.5 h-3.5 text-gray-500" />;
    }
  };

  const getCategoryLabel = (category: ExpenseCategory) => {
    switch (category) {
      case 'TRAVEL':
        return 'Travel';
      case 'MEALS':
        return 'Meals';
      case 'LODGING':
        return 'Lodging';
      case 'OFFICE_SUPPLIES':
        return 'Supplies';
      case 'SOFTWARE':
        return 'Software';
      case 'EQUIPMENT':
        return 'Equipment';
      case 'CLIENT_ENTERTAINMENT':
        return 'Client Entert.';
      case 'TRAINING':
        return 'Training';
      default:
        return 'Other';
    }
  };

  const formatCurrency = (amount: number, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#171717] overflow-hidden shadow-sm">
        <div className="p-4 border-b border-gray-200 dark:border-zinc-800 animate-pulse">
          <div className="h-4 w-48 bg-gray-200 dark:bg-zinc-800 rounded" />
        </div>
        <div className="divide-y divide-gray-100 dark:divide-zinc-800/80">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="p-4 flex items-center justify-between gap-4 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-zinc-800" />
                <div className="space-y-1.5">
                  <div className="h-4 w-32 bg-gray-200 dark:bg-zinc-800 rounded" />
                  <div className="h-3 w-24 bg-gray-200 dark:bg-zinc-800 rounded" />
                </div>
              </div>
              <div className="h-4 w-28 bg-gray-200 dark:bg-zinc-800 rounded hidden md:block" />
              <div className="h-4 w-20 bg-gray-200 dark:bg-zinc-800 rounded hidden sm:block" />
              <div className="h-6 w-20 bg-gray-200 dark:bg-zinc-800 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (claims.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 dark:border-zinc-800 bg-white dark:bg-[#171717] p-12 text-center">
        <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-4">
          <Receipt className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-gray-900 dark:text-[#ececec]">
          No Expense Claims Found
        </h3>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400 max-w-sm mx-auto mt-1">
          No employee expense claims match your active search or filters. You can create a new expense claim or adjust your filters.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#171717] overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-zinc-800 bg-gray-50/75 dark:bg-[#1f1f1f]/50 text-[11px] font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider select-none">
              <th className="py-3 px-4">Claim ID & Employee</th>
              <th className="py-3 px-4">Title & Details</th>
              <th className="py-3 px-4 hidden md:table-cell">Category</th>
              <th className="py-3 px-4 hidden lg:table-cell">Date</th>
              <th className="py-3 px-4">Amount & Tax</th>
              <th className="py-3 px-4 hidden sm:table-cell">Receipts</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-zinc-800/80">
            {claims.map((claim) => {
              const isSubmitted = claim.status === 'SUBMITTED';
              const itemsCount = claim.items?.length || 0;
              const receiptsCount = (claim.receiptUrls?.length || 0) + 
                (claim.items?.filter((it) => it.receiptUrl)?.length || 0);

              // Gather primary merchant name
              const primaryMerchant = claim.items?.[0]?.merchant || '';

              return (
                <tr
                  key={claim.id}
                  className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors group"
                >
                  {/* Claim ID & Employee */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 p-0.5 shadow-sm shadow-brand-500/10 flex-shrink-0">
                        <div className="w-full h-full bg-white dark:bg-[#171717] rounded-[10px] flex items-center justify-center font-bold text-xs text-brand-600 dark:text-brand-400">
                          {claim.employee?.name ? claim.employee.name[0] : <User className="w-4 h-4" />}
                        </div>
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-gray-900 dark:text-[#ececec] text-sm truncate">
                          {claim.employee?.name || 'Employee'}
                        </div>
                        <div className="text-[11px] text-gray-500 dark:text-zinc-400 flex items-center gap-1.5 truncate">
                          <span className="font-mono text-brand-600 dark:text-brand-400 font-medium">
                            {claim.claimNumber || `EXP-${claim.id.slice(0, 6)}`}
                          </span>
                          <span>&bull;</span>
                          <span>{claim.employee?.department || 'Finance'}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Title & Items preview */}
                  <td className="py-3.5 px-4 max-w-xs">
                    <div className="space-y-0.5">
                      <div className="font-semibold text-gray-900 dark:text-[#ececec] text-sm truncate">
                        {claim.title}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-zinc-400 flex items-center gap-1 truncate">
                        {primaryMerchant && (
                          <span className="font-medium text-gray-700 dark:text-zinc-300">
                            {primaryMerchant}
                          </span>
                        )}
                        {itemsCount > 1 && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400">
                            +{itemsCount - 1} more item{itemsCount > 2 ? 's' : ''}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3.5 px-4 whitespace-nowrap hidden md:table-cell">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-100 dark:bg-[#212121] border border-gray-200/60 dark:border-zinc-800 text-gray-700 dark:text-zinc-300">
                      {getCategoryIcon(claim.category)}
                      <span>{getCategoryLabel(claim.category)}</span>
                    </div>
                  </td>

                  {/* Date */}
                  <td className="py-3.5 px-4 whitespace-nowrap hidden lg:table-cell">
                    <div className="text-xs text-gray-700 dark:text-zinc-300">
                      {formatDate(claim.createdAt)}
                    </div>
                    {claim.items?.[0]?.date && (
                      <div className="text-[11px] text-gray-400 dark:text-zinc-500">
                        Incurred: {formatDate(claim.items[0].date)}
                      </div>
                    )}
                  </td>

                  {/* Amount & Tax */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="space-y-0.5">
                      <div className="font-bold text-gray-900 dark:text-[#ececec] text-sm">
                        {formatCurrency(claim.totalAmount, claim.currency)}
                      </div>
                      {claim.taxAmount > 0 && (
                        <div className="text-[11px] text-gray-500 dark:text-zinc-400">
                          Incl. {formatCurrency(claim.taxAmount, claim.currency)} tax
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Receipts */}
                  <td className="py-3.5 px-4 whitespace-nowrap hidden sm:table-cell">
                    {receiptsCount > 0 ? (
                      <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/40 border border-brand-200/50 dark:border-brand-900/30">
                        <Paperclip className="w-3.5 h-3.5" />
                        <span>{receiptsCount} {receiptsCount === 1 ? 'file' : 'files'}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400 dark:text-zinc-600 italic">
                        No receipts
                      </span>
                    )}
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {getStatusBadge(claim.status)}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-1">
                      {/* View / Review */}
                      <button
                        type="button"
                        onClick={() => onReview(claim)}
                        className="p-1.5 rounded-lg text-gray-600 dark:text-zinc-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                        title="View / Review details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* Quick Approve (Only if SUBMITTED) */}
                      {isSubmitted && (
                        <button
                          type="button"
                          onClick={() => onApproveQuick(claim)}
                          disabled={isActionLoading}
                          className="p-1.5 rounded-lg text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors disabled:opacity-50"
                          title="Quick Approve"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      )}

                      {/* Quick Reject (Only if SUBMITTED) */}
                      {isSubmitted && (
                        <button
                          type="button"
                          onClick={() => onRejectQuick(claim)}
                          disabled={isActionLoading}
                          className="p-1.5 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors disabled:opacity-50"
                          title="Quick Reject"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      )}

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => onDelete(claim.id)}
                        disabled={isActionLoading}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors disabled:opacity-50"
                        title="Delete Claim"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
