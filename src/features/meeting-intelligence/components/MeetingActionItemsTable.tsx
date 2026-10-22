/**
 * @file MeetingActionItemsTable.tsx
 * @description Interactive action items checklist extracted from meeting intelligence,
 * supporting status toggle, assignee identification, priority badges, and due dates.
 */

import React from 'react';
import {
  CheckCircle2,
  Circle,
  Clock,
  User,
  AlertTriangle,
  CheckSquare,
} from 'lucide-react';
import type { MeetingActionItem, ActionItemPriority, ActionItemStatus } from '../types';

interface MeetingActionItemsTableProps {
  actionItems: MeetingActionItem[];
  meetingId: string;
  onToggleStatus: (actionId: string, currentStatus: ActionItemStatus) => void;
  isUpdating?: boolean;
}

export const MeetingActionItemsTable: React.FC<MeetingActionItemsTableProps> = ({
  actionItems,
  onToggleStatus,
  isUpdating = false,
}) => {
  const getPriorityBadge = (priority: ActionItemPriority) => {
    switch (priority) {
      case 'HIGH':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
            <AlertTriangle className="w-2.5 h-2.5" />
            High
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            Medium
          </span>
        );
      case 'LOW':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 border border-gray-200 dark:border-zinc-700">
            Low
          </span>
        );
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString([], { month: 'short', day: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  if (!actionItems || actionItems.length === 0) {
    return (
      <div className="p-8 text-center border border-dashed border-gray-200 dark:border-zinc-800 rounded-2xl bg-gray-50/50 dark:bg-zinc-900/30">
        <CheckSquare className="w-8 h-8 text-gray-400 mx-auto mb-2 opacity-50" />
        <p className="text-xs font-semibold text-gray-700 dark:text-zinc-300">
          No Action Items Extracted
        </p>
        <p className="text-[11px] text-gray-400 dark:text-zinc-500 mt-0.5">
          Action items detected in meeting dialogue will appear here automatically.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100 dark:divide-zinc-800/80 rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#171717] overflow-hidden shadow-2xs">
      {actionItems.map((item) => {
        const isCompleted = item.status === 'COMPLETED';
        return (
          <div
            key={item.id}
            className={`p-3.5 sm:p-4 flex items-start gap-3 transition-colors ${
              isCompleted
                ? 'bg-gray-50/40 dark:bg-zinc-900/20 opacity-75'
                : 'hover:bg-gray-50/70 dark:hover:bg-zinc-800/40'
            }`}
          >
            {/* Toggle Status Checkbox */}
            <button
              type="button"
              disabled={isUpdating}
              onClick={() => onToggleStatus(item.id, item.status)}
              className="mt-0.5 text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors shrink-0 disabled:opacity-50"
            >
              {isCompleted ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-500/20" />
              ) : (
                <Circle className="w-5 h-5" />
              )}
            </button>

            {/* Task Details */}
            <div className="flex-1 min-w-0 space-y-1">
              <p
                className={`text-sm font-medium ${
                  isCompleted
                    ? 'line-through text-gray-400 dark:text-zinc-500'
                    : 'text-gray-900 dark:text-[#ececec]'
                }`}
              >
                {item.task}
              </p>

              <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-zinc-400">
                <div className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-gray-400" />
                  <span className="font-semibold text-gray-700 dark:text-zinc-300">
                    {item.assigneeName}
                  </span>
                </div>

                {item.dueDate && (
                  <div className="flex items-center gap-1 text-[11px] text-gray-400 dark:text-zinc-500">
                    <Clock className="w-3 h-3" />
                    <span>Due {formatDate(item.dueDate)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Priority Tag */}
            <div className="shrink-0">{getPriorityBadge(item.priority)}</div>
          </div>
        );
      })}
    </div>
  );
};

export default MeetingActionItemsTable;
