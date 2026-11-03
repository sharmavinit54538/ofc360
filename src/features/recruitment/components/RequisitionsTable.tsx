/**
 * @file RequisitionsTable.tsx
 * @description Enterprise data table for listing, filtering, and acting on Job Requisitions.
 * Supports status tabs, search filtering, animated skeletons, empty states, and drawer inspection.
 */

import React, { useState, useMemo } from 'react';
import {
  Search,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  ChevronLeft,
  ChevronRight,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useToast } from '@/shared/ui/Toast';
import type {
  JobRequisitionItem,
  RequisitionStatusFilter,
} from '../types/requisition.types';
import { useRequisitions, useApproveRequisition } from '../api/requisitionsApi';
import { RequisitionDetailsDrawer } from './RequisitionDetailsDrawer';

interface RequisitionsTableProps {
  onRaiseRequisitionClick?: () => void;
  canCreate?: boolean;
}

const STATUS_TABS: Array<{ id: RequisitionStatusFilter; label: string }> = [
  { id: 'ALL', label: 'All Requests' },
  { id: 'PENDING', label: 'Pending Review' },
  { id: 'APPROVED', label: 'Approved' },
  { id: 'REJECTED', label: 'Rejected' },
];

export const RequisitionsTable: React.FC<RequisitionsTableProps> = ({
  onRaiseRequisitionClick,
  canCreate = false,
}) => {
  const { role, activeRole } = useAuth();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState<RequisitionStatusFilter>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const limit = 15;

  const [selectedRequisition, setSelectedRequisition] = useState<JobRequisitionItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const effectiveRole = (activeRole || role || '').toUpperCase();
  const canApprove =
    effectiveRole === 'SUPER_ADMIN' ||
    effectiveRole === 'HR_ADMIN' ||
    effectiveRole === 'IT_ADMIN';

  const { data, isLoading, isError, error, refetch } = useRequisitions({
    status: activeTab,
    page,
    limit,
  });

  const { mutateAsync: approveRequisition, isPending: isActionPending } = useApproveRequisition();

  // Local search filter over returned paginated items
  const filteredItems = useMemo(() => {
    const list = data?.items || [];
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase().trim();
    return list.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.department.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q)
    );
  }, [data?.items, searchQuery]);

  const handleRowClick = (item: JobRequisitionItem) => {
    setSelectedRequisition(item);
    setIsDrawerOpen(true);
  };

  const handleQuickAction = async (
    e: React.MouseEvent,
    item: JobRequisitionItem,
    approve: boolean
  ) => {
    e.stopPropagation();
    try {
      await approveRequisition({
        requisition_id: item.id,
        approve,
      });
      toast.success(
        approve
          ? `Requisition for "${item.title}" approved.`
          : `Requisition for "${item.title}" rejected.`,
        approve ? 'Approved' : 'Rejected'
      );
      refetch();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Action failed';
      toast.error(msg, 'Approval Error');
    }
  };

  const formatSalary = (min: string | null, max: string | null) => {
    if (!min && !max) return '—';
    const fmt = (v: string) => {
      const n = parseFloat(v);
      return isNaN(n) ? v : `₹${(n / 100000).toFixed(1)}L`;
    };
    if (min && max) return `${fmt(min)} - ${fmt(max)}`;
    if (min) return `${fmt(min)}+`;
    return `Up to ${fmt(max!)}`;
  };

  const formatExp = (min: number, max: number | null) => {
    if (max !== null && max !== undefined) {
      return `${min} - ${max} yrs`;
    }
    return `${min}+ yrs`;
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Approved
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
            <XCircle className="w-3 h-3 text-rose-600" />
            Rejected
          </span>
        );
      case 'PENDING':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            <Clock className="w-3 h-3 text-amber-600" />
            Pending Review
          </span>
        );
    }
  };

  const totalPages = data?.pages || Math.max(1, Math.ceil((data?.total || 0) / limit));

  return (
    <div className="space-y-4">
      {/* Search & Status Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-zinc-900 p-3 rounded-2xl border border-slate-200/80 dark:border-zinc-800 shadow-xs">
        {/* Status Tabs */}
        <div className="inline-flex items-center p-1 rounded-xl bg-slate-100/80 dark:bg-zinc-800/80 border border-slate-200/70 dark:border-zinc-700 gap-1 overflow-x-auto">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveTab(tab.id);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-zinc-900 text-teal-700 dark:text-teal-300 shadow-xs'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title or department..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950/60 text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/40"
          />
        </div>
      </div>

      {/* Error Notice */}
      {isError && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <p className="text-xs font-medium text-rose-800 dark:text-rose-300">
              {error || 'Failed to load job requisitions.'}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => refetch()} className="text-xs">
            Retry
          </Button>
        </div>
      )}

      {/* Main Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/80 dark:border-zinc-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 dark:bg-zinc-950/40 border-b border-slate-200/80 dark:border-zinc-800 text-[11px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Job Title</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Vacancies</th>
                <th className="py-3 px-4">Experience</th>
                <th className="py-3 px-4">Salary Budget</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Submitted</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/80">
              {isLoading ? (
                // Pulsing skeleton loading state
                Array.from({ length: 6 }).map((_, idx) => (
                  <tr key={`skel-${idx}`} className="animate-pulse">
                    <td className="py-3.5 px-4">
                      <div className="h-4 w-40 bg-slate-200 dark:bg-zinc-800 rounded-md" />
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="h-4 w-24 bg-slate-200 dark:bg-zinc-800 rounded-md" />
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="h-4 w-12 bg-slate-200 dark:bg-zinc-800 rounded-md" />
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="h-4 w-16 bg-slate-200 dark:bg-zinc-800 rounded-md" />
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="h-4 w-20 bg-slate-200 dark:bg-zinc-800 rounded-md" />
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="h-5 w-20 bg-slate-200 dark:bg-zinc-800 rounded-full" />
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="h-4 w-20 bg-slate-200 dark:bg-zinc-800 rounded-md" />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="h-7 w-16 bg-slate-200 dark:bg-zinc-800 rounded-lg ml-auto" />
                    </td>
                  </tr>
                ))
              ) : filteredItems.length === 0 ? (
                // Empty State
                <tr>
                  <td colSpan={8} className="py-12 text-center">
                    <div className="max-w-sm mx-auto flex flex-col items-center justify-center text-center">
                      <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-3">
                        <FileText className="w-6 h-6" />
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        No requisitions found
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                        {activeTab !== 'ALL'
                          ? `There are currently no requisitions with "${activeTab}" status.`
                          : 'No job requisitions have been submitted yet.'}
                      </p>
                      {canCreate && onRaiseRequisitionClick && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={onRaiseRequisitionClick}
                          className="mt-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold"
                        >
                          + Raise New Requisition
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                // Populated Table Rows
                filteredItems.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => handleRowClick(item)}
                    className="hover:bg-slate-50/70 dark:hover:bg-zinc-800/40 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                      {item.title}
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-zinc-300">
                      {item.department}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {item.vacancies}
                      </span>{' '}
                      <span className="text-[11px] text-slate-500">
                        {item.vacancies === 1 ? 'pos' : 'positions'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-zinc-300">
                      {formatExp(item.min_experience, item.max_experience)}
                    </td>
                    <td className="py-3 px-4 font-mono font-medium text-slate-700 dark:text-zinc-300">
                      {formatSalary(item.min_salary, item.max_salary)}
                    </td>
                    <td className="py-3 px-4">{renderStatusBadge(item.status)}</td>
                    <td className="py-3 px-4 text-slate-500 dark:text-zinc-400">
                      {new Date(item.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        {canApprove && item.status === 'PENDING' ? (
                          <>
                            <button
                              type="button"
                              onClick={(e) => handleQuickAction(e, item, true)}
                              disabled={isActionPending}
                              title="Approve Requisition"
                              className="px-2 py-1 rounded-md text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              onClick={(e) => handleQuickAction(e, item, false)}
                              disabled={isActionPending}
                              title="Reject Requisition"
                              className="px-2 py-1 rounded-md text-[11px] font-semibold bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 hover:bg-rose-100 transition-colors"
                            >
                              Reject
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRowClick(item);
                            }}
                            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="py-3 px-4 border-t border-slate-200/80 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-950/30 flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400">
          <span>
            Showing <strong className="text-slate-800 dark:text-zinc-200">{filteredItems.length}</strong> of{' '}
            <strong className="text-slate-800 dark:text-zinc-200">{data?.total ?? 0}</strong> requisitions
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1 || isLoading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-semibold text-slate-700 dark:text-zinc-300">
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              disabled={page >= totalPages || isLoading}
              onClick={() => setPage((p) => p + 1)}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Details Slide-Over Drawer */}
      <RequisitionDetailsDrawer
        requisition={selectedRequisition}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onActionComplete={() => refetch()}
      />
    </div>
  );
};

