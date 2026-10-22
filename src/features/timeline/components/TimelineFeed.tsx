/**
 * @file TimelineFeed.tsx
 * @description Vertical chronological timeline feed with distinctive event iconography,
 * date grouping (Today, This Month, Earlier), metadata badges, expandable event details,
 * and loading skeletons.
 */

import React, { useState } from 'react';
import {
  UserPlus,
  TrendingUp,
  Briefcase,
  Building2,
  Star,
  Trophy,
  GraduationCap,
  CalendarOff,
  FileText,
  LogOut,
  ChevronDown,
  ChevronUp,
  Paperclip,
  Clock,
  User,
  ArrowRight,
} from 'lucide-react';
import { Badge } from '@/shared/ui/Badge';
import type { TimelineEvent, TimelineEventType } from '../types';
import { TimelineEmptyState } from './TimelineEmptyState';

interface TimelineFeedProps {
  events: TimelineEvent[];
  isLoading: boolean;
  onAddEvent?: () => void;
  isFiltered?: boolean;
  onClearFilters?: () => void;
}

interface GroupedEvents {
  today: TimelineEvent[];
  thisMonth: TimelineEvent[];
  earlier: TimelineEvent[];
}

export const TimelineFeed: React.FC<TimelineFeedProps> = ({
  events,
  isLoading,
  onAddEvent,
  isFiltered = false,
  onClearFilters,
}) => {
  const [expandedEventIds, setExpandedEventIds] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedEventIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const getEventConfig = (type: TimelineEventType) => {
    switch (type) {
      case 'JOINING':
        return {
          icon: UserPlus,
          color: 'text-emerald-600 dark:text-emerald-400',
          bg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800',
          badgeVariant: 'success' as const,
          label: 'Joining',
        };
      case 'PROMOTION':
        return {
          icon: TrendingUp,
          color: 'text-purple-600 dark:text-purple-400',
          bg: 'bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800',
          badgeVariant: 'brand' as const,
          label: 'Promotion',
        };
      case 'ROLE_CHANGE':
        return {
          icon: Briefcase,
          color: 'text-blue-600 dark:text-blue-400',
          bg: 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800',
          badgeVariant: 'brand' as const,
          label: 'Role Change',
        };
      case 'DEPARTMENT_TRANSFER':
        return {
          icon: Building2,
          color: 'text-cyan-600 dark:text-cyan-400',
          bg: 'bg-cyan-50 dark:bg-cyan-950/40 border-cyan-200 dark:border-cyan-800',
          badgeVariant: 'brand' as const,
          label: 'Department Transfer',
        };
      case 'PERFORMANCE_REVIEW':
        return {
          icon: Star,
          color: 'text-amber-600 dark:text-amber-400',
          bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800',
          badgeVariant: 'warning' as const,
          label: 'Performance Review',
        };
      case 'AWARD_RECOGNITION':
        return {
          icon: Trophy,
          color: 'text-yellow-600 dark:text-yellow-400',
          bg: 'bg-yellow-50 dark:bg-yellow-950/40 border-yellow-200 dark:border-yellow-800',
          badgeVariant: 'warning' as const,
          label: 'Award & Recognition',
        };
      case 'TRAINING_CERTIFICATION':
        return {
          icon: GraduationCap,
          color: 'text-teal-600 dark:text-teal-400',
          bg: 'bg-teal-50 dark:bg-teal-950/40 border-teal-200 dark:border-teal-800',
          badgeVariant: 'success' as const,
          label: 'Certification',
        };
      case 'LEAVE_SABBATICAL':
        return {
          icon: CalendarOff,
          color: 'text-slate-600 dark:text-zinc-400',
          bg: 'bg-slate-100 dark:bg-zinc-800 border-slate-200 dark:border-zinc-700',
          badgeVariant: 'slate' as const,
          label: 'Leave / Sabbatical',
        };
      case 'DOCUMENT_UPLOAD':
        return {
          icon: FileText,
          color: 'text-indigo-600 dark:text-indigo-400',
          bg: 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800',
          badgeVariant: 'brand' as const,
          label: 'Document Upload',
        };
      case 'EXIT_INITIATED':
      default:
        return {
          icon: LogOut,
          color: 'text-rose-600 dark:text-rose-400',
          bg: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800',
          badgeVariant: 'danger' as const,
          label: 'Exit Initiated',
        };
    }
  };

  const groupEventsByDate = (items: TimelineEvent[]): GroupedEvents => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const groups: GroupedEvents = {
      today: [],
      thisMonth: [],
      earlier: [],
    };

    items.forEach((item) => {
      try {
        const itemDate = new Date(item.timestamp);
        const itemDateStr = item.timestamp.split('T')[0];

        if (itemDateStr === todayStr) {
          groups.today.push(item);
        } else if (itemDate.getMonth() === currentMonth && itemDate.getFullYear() === currentYear) {
          groups.thisMonth.push(item);
        } else {
          groups.earlier.push(item);
        }
      } catch {
        groups.earlier.push(item);
      }
    });

    return groups;
  };

  const formatTimestamp = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return iso;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex gap-4 animate-pulse">
            <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-zinc-800 shrink-0" />
            <div className="flex-1 p-5 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 space-y-3">
              <div className="flex justify-between items-center">
                <div className="h-4 w-40 bg-gray-200 dark:bg-zinc-800 rounded" />
                <div className="h-4 w-20 bg-gray-200 dark:bg-zinc-800 rounded" />
              </div>
              <div className="h-3 w-3/4 bg-gray-200 dark:bg-zinc-800 rounded" />
              <div className="h-3 w-1/2 bg-gray-200 dark:bg-zinc-800 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!events || events.length === 0) {
    return (
      <TimelineEmptyState
        onAddEvent={onAddEvent}
        isFiltered={isFiltered}
        onClearFilters={onClearFilters}
      />
    );
  }

  const grouped = groupEventsByDate(events);

  const renderEventCard = (event: TimelineEvent) => {
    const config = getEventConfig(event.eventType);
    const Icon = config.icon;
    const isExpanded = Boolean(expandedEventIds[event.id]);

    return (
      <div key={event.id} className="relative flex items-start gap-4 group">
        {/* Event Icon Node */}
        <div
          className={`relative z-10 w-10 h-10 rounded-2xl border ${config.bg} ${config.color} flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-105`}
        >
          <Icon className="w-5 h-5" />
        </div>

        {/* Card Body */}
        <div className="flex-1 p-5 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 pb-2 border-b border-gray-100 dark:border-zinc-800/80">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant={config.badgeVariant} size="sm" className="font-semibold text-[11px]">
                {config.label}
              </Badge>
              <h4 className="font-bold text-gray-900 dark:text-[#ececec] text-sm sm:text-base">
                {event.title}
              </h4>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-zinc-500 font-mono shrink-0">
              <Clock className="w-3.5 h-3.5" />
              <span>{formatTimestamp(event.timestamp)}</span>
            </div>
          </div>

          {/* Employee & Actor Identity */}
          <div className="mt-2.5 flex items-center gap-2 text-xs text-gray-600 dark:text-zinc-400">
            <span className="font-semibold text-gray-900 dark:text-[#ececec] flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
              {event.employeeName}
            </span>
            <span className="text-gray-400">•</span>
            <span className="font-mono text-gray-500">{event.employeeId}</span>
            {event.actorName && (
              <>
                <span className="text-gray-400">•</span>
                <span className="text-gray-500 text-[11px]">Recorded by {event.actorName}</span>
              </>
            )}
          </div>

          {/* Description */}
          <div className="mt-2 text-xs text-gray-600 dark:text-zinc-300 leading-relaxed">
            <p className={!isExpanded && event.description.length > 180 ? 'line-clamp-2' : ''}>
              {event.description}
            </p>
            {event.description.length > 180 && (
              <button
                type="button"
                onClick={() => toggleExpand(event.id)}
                className="mt-1 text-[11px] font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-0.5"
              >
                {isExpanded ? (
                  <>
                    Show less <ChevronUp className="w-3 h-3" />
                  </>
                ) : (
                  <>
                    Read more <ChevronDown className="w-3 h-3" />
                  </>
                )}
              </button>
            )}
          </div>

          {/* Metadata Badges */}
          {event.metadata && (
            <div className="mt-3 flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100 dark:border-zinc-800/80">
              {event.metadata.oldRole && event.metadata.newRole && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-[11px] font-medium border border-indigo-200/50 dark:border-indigo-900/30">
                  <span>{event.metadata.oldRole}</span>
                  <ArrowRight className="w-3 h-3 text-indigo-500" />
                  <span className="font-bold">{event.metadata.newRole}</span>
                </div>
              )}

              {event.metadata.department && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 text-[11px] font-medium border border-cyan-200/50 dark:border-cyan-900/30">
                  <Building2 className="w-3 h-3" />
                  {event.metadata.department}
                </span>
              )}

              {event.metadata.rating && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-[11px] font-bold border border-amber-200/50 dark:border-amber-900/30">
                  <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                  Rating: {event.metadata.rating}
                </span>
              )}

              {event.metadata.awardTitle && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-yellow-50 dark:bg-yellow-950/40 text-yellow-700 dark:text-yellow-300 text-[11px] font-medium border border-yellow-200/50 dark:border-yellow-900/30">
                  <Trophy className="w-3 h-3" />
                  {event.metadata.awardTitle}
                </span>
              )}

              {event.metadata.certificationName && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 text-[11px] font-medium border border-teal-200/50 dark:border-teal-900/30">
                  <GraduationCap className="w-3 h-3" />
                  {event.metadata.certificationName}
                </span>
              )}
            </div>
          )}

          {/* Attachments */}
          {event.attachments && event.attachments.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {event.attachments.map((att, idx) => (
                <a
                  key={idx}
                  href={att.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
                >
                  <Paperclip className="w-3 h-3 text-gray-400" />
                  <span>{att.name}</span>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderSection = (title: string, items: TimelineEvent[]) => {
    if (items.length === 0) return null;

    return (
      <div className="space-y-4">
        <div className="sticky top-0 z-20 bg-gray-50/80 dark:bg-[#121212]/80 backdrop-blur-sm py-1.5">
          <span className="text-xs uppercase font-extrabold tracking-wider text-gray-500 dark:text-zinc-400 bg-white dark:bg-zinc-800 px-3 py-1 rounded-full border border-gray-200 dark:border-zinc-700 shadow-sm">
            {title} ({items.length})
          </span>
        </div>

        <div className="relative pl-6 space-y-6 before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200 dark:before:bg-zinc-800">
          {items.map(renderEventCard)}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {renderSection('Today', grouped.today)}
      {renderSection('This Month', grouped.thisMonth)}
      {renderSection('Earlier Records', grouped.earlier)}
    </div>
  );
};

export default TimelineFeed;
