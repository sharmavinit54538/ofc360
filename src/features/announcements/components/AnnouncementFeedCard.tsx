/**
 * @file AnnouncementFeedCard.tsx
 * @description Accessible announcement card component with RBAC-guarded actions:
 * Edit (PUT), Publish (PATCH), Archive (PATCH), and Delete (DELETE).
 */

import React from 'react';
import {
  Pin,
  Trash2,
  Edit2,
  Send,
  Archive,
  Calendar,
  Building2,
  MapPin,
  Users,
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { useRBAC } from '@/features/auth/hooks/useRBAC';
import type {
  AnnouncementResponse,
  AnnouncementPriority,
  AnnouncementStatus,
} from '../types/announcements.types';

export interface AnnouncementFeedCardProps {
  announcement: AnnouncementResponse;
  onEdit?: (announcement: AnnouncementResponse) => void;
  onDelete?: (id: string, title: string) => void;
  onPublish?: (id: string) => void;
  onArchive?: (id: string) => void;
  isActionLoading?: boolean;
}

export const getPriorityBadgeClass = (priority?: AnnouncementPriority) => {
  switch (priority) {
    case 'URGENT':
      return 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900';
    case 'HIGH':
      return 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900';
    case 'LOW':
      return 'bg-slate-50 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 border-slate-200 dark:border-zinc-700';
    case 'MEDIUM':
    default:
      return 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900';
  }
};

export const getStatusBadgeClass = (status?: AnnouncementStatus) => {
  switch (status) {
    case 'PUBLISHED':
      return 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900';
    case 'ARCHIVED':
      return 'bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-zinc-400 border-gray-200 dark:border-zinc-700';
    case 'DRAFT':
    default:
      return 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900';
  }
};

export const AnnouncementFeedCard: React.FC<AnnouncementFeedCardProps> = ({
  announcement,
  onEdit,
  onDelete,
  onPublish,
  onArchive,
  isActionLoading = false,
}) => {
  const { hasAnyRole } = useRBAC();
  const canManage = hasAnyRole(['SUPER_ADMIN', 'HR_ADMIN', 'IT_ADMIN']);

  const formatPublishDate = (dateStr?: string) => {
    if (!dateStr) return 'Recently';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return 'Recently';
    }
  };

  return (
    <div
      className={cn(
        'p-4 sm:p-5 rounded-2xl border transition-all duration-200 bg-white dark:bg-[#1a1a1a] space-y-3 shadow-2xs hover:shadow-xs',
        announcement.is_pinned
          ? 'border-rose-200 dark:border-rose-900/60 bg-rose-50/20 dark:bg-rose-950/10'
          : 'border-gray-200 dark:border-zinc-800'
      )}
    >
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Priority Badge */}
          <span
            className={cn(
              'text-[10px] font-semibold px-2 py-0.5 rounded-full border',
              getPriorityBadgeClass(announcement.priority)
            )}
          >
            {announcement.priority || 'MEDIUM'}
          </span>

          {/* Status Badge */}
          <span
            className={cn(
              'text-[10px] font-semibold px-2 py-0.5 rounded-full border',
              getStatusBadgeClass(announcement.status)
            )}
          >
            {announcement.status || 'DRAFT'}
          </span>

          {/* Category Pill */}
          {announcement.category && (
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 border border-gray-200 dark:border-zinc-700">
              {announcement.category}
            </span>
          )}

          {/* Pinned Badge */}
          {announcement.is_pinned && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 flex items-center gap-1">
              <Pin className="w-3 h-3 rotate-45" />
              <span>Pinned</span>
            </span>
          )}
        </div>

        {/* Date and Management Action Buttons */}
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
          <span className="text-[11px] text-gray-400 dark:text-zinc-500 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{formatPublishDate(announcement.publish_date || announcement.created_at)}</span>
          </span>

          {canManage && (
            <div className="flex items-center gap-1 border-l border-gray-100 dark:border-zinc-800 pl-2">
              {/* Publish Button (if DRAFT) */}
              {announcement.status === 'DRAFT' && onPublish && (
                <button
                  type="button"
                  onClick={() => onPublish(announcement.id)}
                  disabled={isActionLoading}
                  title="Publish now"
                  aria-label="Publish announcement"
                  className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Archive Button (if PUBLISHED) */}
              {announcement.status === 'PUBLISHED' && onArchive && (
                <button
                  type="button"
                  onClick={() => onArchive(announcement.id)}
                  disabled={isActionLoading}
                  title="Archive announcement"
                  aria-label="Archive announcement"
                  className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-colors disabled:opacity-50"
                >
                  <Archive className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Edit Button */}
              {onEdit && (
                <button
                  type="button"
                  onClick={() => onEdit(announcement)}
                  disabled={isActionLoading}
                  title="Edit announcement"
                  aria-label="Edit announcement"
                  className="p-1.5 rounded-lg text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors disabled:opacity-50"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Delete Button */}
              {onDelete && (
                <button
                  type="button"
                  onClick={() => onDelete(announcement.id, announcement.title)}
                  disabled={isActionLoading}
                  title="Delete announcement"
                  aria-label={`Delete announcement ${announcement.title}`}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors disabled:opacity-50"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Title */}
      <h4 className="text-sm font-bold text-gray-900 dark:text-white">
        {announcement.title}
      </h4>

      {/* Description / Body */}
      <p className="text-xs sm:text-sm text-gray-600 dark:text-zinc-300 leading-relaxed whitespace-pre-line">
        {announcement.description}
      </p>

      {/* Metadata Footer */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-100 dark:border-zinc-800/60 text-[11px] text-gray-400 dark:text-zinc-500">
        <div className="flex items-center gap-3">
          {announcement.department && (
            <span className="flex items-center gap-1">
              <Building2 className="w-3 h-3" />
              <span>{announcement.department}</span>
            </span>
          )}
          {announcement.branch && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span>{announcement.branch}</span>
            </span>
          )}
          {announcement.visibility && announcement.visibility !== 'ALL_EMPLOYEES' && (
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span>{announcement.visibility}</span>
            </span>
          )}
        </div>

        <div>
          {announcement.author_name ? (
            <span>Published by <strong className="font-semibold text-gray-600 dark:text-zinc-300">{announcement.author_name}</strong></span>
          ) : (
            <span>Official Broadcast</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnnouncementFeedCard;

