import React from 'react';
import {
  Plane,
  Calendar,
  CheckCircle2,
  XCircle,
  Eye,
  Trash2,
  ArrowRight,
  Clock,
  User,
} from 'lucide-react';
import { Badge } from '@/shared/ui/Badge';
import type { TravelRequest, TravelStatus } from '../types/travel.types';

interface TravelRequestsTableProps {
  requests: TravelRequest[];
  isLoading: boolean;
  onReview: (request: TravelRequest) => void;
  onApproveQuick: (request: TravelRequest) => void;
  onRejectQuick: (request: TravelRequest) => void;
  onDelete: (id: string) => void;
  isActionLoading?: boolean;
}

export const TravelRequestsTable: React.FC<TravelRequestsTableProps> = ({
  requests,
  isLoading,
  onReview,
  onApproveQuick,
  onRejectQuick,
  onDelete,
  isActionLoading = false,
}) => {
  const getStatusBadge = (status: TravelStatus) => {
    switch (status) {
      case 'APPROVED':
        return (
          <Badge variant="success" size="sm" className="font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Approved
          </Badge>
        );
      case 'PENDING':
        return (
          <Badge variant="warning" size="sm" className="font-semibold flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Pending Review
          </Badge>
        );
      case 'REJECTED':
        return (
          <Badge variant="danger" size="sm" className="font-semibold flex items-center gap-1">
            <XCircle className="w-3 h-3" />
            Rejected
          </Badge>
        );
      case 'CANCELLED':
      default:
        return (
          <Badge variant="slate" size="sm" className="font-semibold">
            Cancelled
          </Badge>
        );
    }
  };

  const formatCurrency = (amount: number, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDateRange = (start: string, end: string) => {
    try {
      const s = new Date(start);
      const e = new Date(end);
      const diffTime = Math.abs(e.getTime() - s.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return {
        formatted: `${s.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${e.toLocaleDateString(
          'en-US',
          { month: 'short', day: 'numeric', year: 'numeric' }
        )}`,
        days: `${diffDays} ${diffDays === 1 ? 'day' : 'days'}`,
      };
    } catch {
      return { formatted: `${start} – ${end}`, days: '' };
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

  if (requests.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 dark:border-zinc-800 bg-white dark:bg-[#171717] p-12 text-center">
        <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-4">
          <Plane className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-gray-900 dark:text-[#ececec]">
          No Travel Requests Found
        </h3>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400 max-w-sm mx-auto mt-1">
          No employee travel requisitions match your active search or filters. You can submit a new travel request or adjust filters.
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
              <th className="py-3 px-4">Trip ID & Employee</th>
              <th className="py-3 px-4">Route / Destination</th>
              <th className="py-3 px-4 hidden md:table-cell">Dates & Duration</th>
              <th className="py-3 px-4 hidden lg:table-cell">Purpose</th>
              <th className="py-3 px-4">Est. Cost</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-zinc-800/80">
            {requests.map((req) => {
              const { formatted, days } = formatDateRange(req.startDate, req.endDate);
              const isPending = req.status === 'PENDING';

              return (
                <tr
                  key={req.id}
                  className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors group"
                >
                  {/* Trip ID & Employee Info */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 p-0.5 shadow-sm shadow-brand-500/10 flex-shrink-0">
                        <div className="w-full h-full bg-white dark:bg-[#171717] rounded-[10px] flex items-center justify-center font-bold text-xs text-brand-600 dark:text-brand-400">
                          {req.employee?.name ? req.employee.name[0] : <User className="w-4 h-4" />}
                        </div>
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-gray-900 dark:text-[#ececec] text-sm truncate">
                          {req.employee?.name || 'Employee'}
                        </div>
                        <div className="text-[11px] text-gray-500 dark:text-zinc-400 flex items-center gap-1.5 truncate">
                          <span className="font-mono text-brand-600 dark:text-brand-400 font-medium">
                            {req.tripId || `TRV-${req.id.slice(0, 6)}`}
                          </span>
                          <span>&bull;</span>
                          <span>{req.employee?.department || 'Department'}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Route & Travel Type */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 font-medium text-gray-900 dark:text-[#ececec] text-sm">
                        <span className="truncate max-w-[100px]">{req.origin}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                        <span className="truncate max-w-[120px] font-semibold text-brand-600 dark:text-brand-400">
                          {req.destination}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400">
                          {req.travelType}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Dates & Duration */}
                  <td className="py-3.5 px-4 whitespace-nowrap hidden md:table-cell">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 text-xs text-gray-800 dark:text-zinc-200">
                        <Calendar className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                        <span>{formatted}</span>
                      </div>
                      {days && (
                        <div className="text-[11px] text-gray-500 dark:text-zinc-400">
                          {days}
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Purpose */}
                  <td className="py-3.5 px-4 hidden lg:table-cell max-w-xs">
                    <p className="text-xs text-gray-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                      {req.purpose}
                    </p>
                  </td>

                  {/* Estimated Cost */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="font-bold text-gray-900 dark:text-[#ececec] text-sm">
                      {formatCurrency(req.estimatedCost, req.expenses?.currency || 'USD')}
                    </div>
                    <div className="text-[10px] text-gray-400 dark:text-zinc-500">
                      Flights + Hotel + Cabs
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {getStatusBadge(req.status)}
                  </td>

                  {/* Action Buttons */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Review / Inspect Details */}
                      <button
                        type="button"
                        onClick={() => onReview(req)}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                        title="View Trip Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* Quick Approval / Rejection for Pending */}
                      {isPending && (
                        <>
                          <button
                            type="button"
                            disabled={isActionLoading}
                            onClick={() => onApproveQuick(req)}
                            className="p-1.5 rounded-lg text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors disabled:opacity-50"
                            title="Approve Request"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            disabled={isActionLoading}
                            onClick={() => onRejectQuick(req)}
                            className="p-1.5 rounded-lg text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors disabled:opacity-50"
                            title="Reject Request"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}

                      {/* Delete / Cancel Option */}
                      <button
                        type="button"
                        disabled={isActionLoading}
                        onClick={() => onDelete(req.id)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50 opacity-0 group-hover:opacity-100"
                        title="Delete Requisition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
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
