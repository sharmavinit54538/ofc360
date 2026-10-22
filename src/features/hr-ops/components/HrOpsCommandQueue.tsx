/**
 * @file HrOpsCommandQueue.tsx
 * @description Real-time operational queue for HR Operations Command Center,
 * displaying prioritized action items, clearance tickets, direct module links,
 * resolution toggles, and loading skeletons.
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertOctagon,
  AlertTriangle,
  UserPlus,
  LogOut,
  FileCheck2,
  Calendar,
  Clock,
  ExternalLink,
  CheckCircle2,
  User,
  ShieldCheck,
  Building2,
} from 'lucide-react';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import type { HrOpsActionItem, HrOpsPriority, HrOpsActionType, HrOpsStatus } from '../types';
import { HrOpsEmptyState } from './HrOpsEmptyState';

interface HrOpsCommandQueueProps {
  items: HrOpsActionItem[];
  isLoading: boolean;
  onResolve: (item: HrOpsActionItem) => void;
  onAssign?: (item: HrOpsActionItem) => void;
  isActionLoading?: boolean;
  isFiltered?: boolean;
  onClearFilters?: () => void;
}

export const HrOpsCommandQueue: React.FC<HrOpsCommandQueueProps> = ({
  items,
  isLoading,
  onResolve,
  onAssign,
  isActionLoading = false,
  isFiltered = false,
  onClearFilters,
}) => {
  const navigate = useNavigate();

  const getPriorityBadge = (priority: HrOpsPriority) => {
    switch (priority) {
      case 'CRITICAL':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 animate-pulse">
            <AlertOctagon className="w-3 h-3" />
            Critical
          </span>
        );
      case 'HIGH':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            <AlertTriangle className="w-3 h-3" />
            High
          </span>
        );
      case 'MEDIUM':
        return (
          <Badge variant="brand" size="sm" className="font-semibold text-[11px]">
            Medium
          </Badge>
        );
      case 'LOW':
      default:
        return (
          <Badge variant="slate" size="sm" className="font-medium text-[11px]">
            Low
          </Badge>
        );
    }
  };

  const getTypeIcon = (type: HrOpsActionType) => {
    switch (type) {
      case 'ONBOARDING':
        return <UserPlus className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case 'EXIT':
        return <LogOut className="w-4 h-4 text-rose-600 dark:text-rose-400" />;
      case 'CLEARANCE':
        return <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
      case 'DOCUMENT_VERIFICATION':
        return <FileCheck2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />;
      case 'LEAVE_APPROVAL':
      default:
        return <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
    }
  };

  const getStatusBadge = (status: HrOpsStatus) => {
    switch (status) {
      case 'RESOLVED':
        return (
          <Badge variant="success" size="sm" className="font-semibold flex items-center gap-1 text-[11px]">
            <CheckCircle2 className="w-3 h-3" />
            Resolved
          </Badge>
        );
      case 'IN_PROGRESS':
        return (
          <Badge variant="brand" size="sm" className="font-semibold flex items-center gap-1 text-[11px]">
            <Clock className="w-3 h-3" />
            In Progress
          </Badge>
        );
      case 'PENDING':
      default:
        return (
          <Badge variant="warning" size="sm" className="font-semibold flex items-center gap-1 text-[11px]">
            <Clock className="w-3 h-3" />
            Pending
          </Badge>
        );
    }
  };

  const handleNavigateLink = (item: HrOpsActionItem) => {
    if (item.link) {
      navigate(item.link);
      return;
    }
    // Fallback based on type
    switch (item.type) {
      case 'ONBOARDING':
        navigate('/dashboard/onboarding');
        break;
      case 'EXIT':
      case 'CLEARANCE':
        navigate('/dashboard/exit-management');
        break;
      case 'DOCUMENT_VERIFICATION':
        navigate('/settings/documents');
        break;
      case 'LEAVE_APPROVAL':
        navigate('/settings/leave');
        break;
      default:
        break;
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#171717] overflow-hidden shadow-sm">
        <div className="p-4 border-b border-gray-200 dark:border-zinc-800 animate-pulse">
          <div className="h-4 w-44 bg-gray-200 dark:bg-zinc-800 rounded" />
        </div>
        <div className="divide-y divide-gray-100 dark:divide-zinc-800/80">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="p-4 flex items-center justify-between gap-4 animate-pulse">
              <div className="flex items-center gap-3 w-1/3">
                <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-zinc-800 shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-4 w-32 bg-gray-200 dark:bg-zinc-800 rounded" />
                  <div className="h-3 w-24 bg-gray-200 dark:bg-zinc-800 rounded" />
                </div>
              </div>
              <div className="h-6 w-20 bg-gray-200 dark:bg-zinc-800 rounded-full" />
              <div className="h-4 w-24 bg-gray-200 dark:bg-zinc-800 rounded hidden md:block" />
              <div className="h-8 w-24 bg-gray-200 dark:bg-zinc-800 rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <HrOpsEmptyState
        isFiltered={isFiltered}
        onClearFilters={onClearFilters}
      />
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#171717] overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between bg-gray-50/50 dark:bg-zinc-900/40">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-gray-900 dark:text-[#ececec] text-sm">
            Command Center Queue
          </h3>
          <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 border border-brand-200/50 dark:border-brand-900/30">
            {items.length} Active Items
          </span>
        </div>
      </div>

      <div className="divide-y divide-gray-100 dark:divide-zinc-800/80">
        {items.map((item) => (
          <div
            key={item.id}
            className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50/50 dark:hover:bg-zinc-900/30 transition-colors"
          >
            {/* Left: Task Identity & Category */}
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 border border-gray-200/60 dark:border-zinc-700/60 mt-0.5">
                {getTypeIcon(item.type)}
              </div>

              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  {getPriorityBadge(item.priority)}
                  <h4 className="font-bold text-gray-900 dark:text-[#ececec] text-sm truncate">
                    {item.title}
                  </h4>
                  {getStatusBadge(item.status)}
                </div>

                <p className="text-xs text-gray-600 dark:text-zinc-400 line-clamp-2">
                  {item.description}
                </p>

                {/* Context Sub-bar */}
                <div className="flex items-center gap-3 text-[11px] text-gray-400 dark:text-zinc-500 pt-1 flex-wrap">
                  {item.targetEmployeeName && (
                    <span className="flex items-center gap-1 text-gray-700 dark:text-zinc-300 font-medium">
                      <User className="w-3 h-3 text-brand-500" />
                      {item.targetEmployeeName}
                    </span>
                  )}
                  {item.department && (
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3 h-3" />
                      {item.department}
                    </span>
                  )}
                  <span className="flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3" />
                    Due: {item.dueDate}
                  </span>
                  {item.assigneeName && (
                    <span className="text-gray-500">
                      Assigned to: {item.assigneeName}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
              {/* Mark Resolved Toggle */}
              {item.status !== 'RESOLVED' && (
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={isActionLoading}
                  onClick={() => onResolve(item)}
                  className="rounded-xl text-xs text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Resolve</span>
                </Button>
              )}

              {/* Delegate / Assign */}
              {onAssign && (
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={isActionLoading}
                  onClick={() => onAssign(item)}
                  title="Assign to HR teammate"
                  className="rounded-xl text-xs text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-[#ececec] px-2.5"
                >
                  <User className="w-3.5 h-3.5" />
                </Button>
              )}

              {/* Direct Link to Sub-Module */}
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleNavigateLink(item)}
                className="rounded-xl text-xs flex items-center gap-1.5"
              >
                <span>Open Workflow</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HrOpsCommandQueue;
