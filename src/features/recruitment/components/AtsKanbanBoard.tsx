/**
 * @file AtsKanbanBoard.tsx
 * @description Multi-column horizontal scrollable Kanban board for OFC360 ATS Pipeline.
 * Renders verified pipeline stages, dynamic candidate cards with job chips, experience tags,
 * and inline triage actions (Move stage, Shortlist, Reject).
 */

import React from 'react';
import {
  Users,
  Building2,
  MapPin,
  Clock,
  Sparkles,
  ChevronDown,
  CheckCircle2,
  XCircle,
  FileText,
  Calendar,
  Briefcase,
  AlertCircle,
} from 'lucide-react';
import { Badge } from '@/shared/ui/Badge';
import type { ApplicationItem, ApplicationStage, KanbanColumnConfig } from '../types/ats.types';

interface AtsKanbanBoardProps {
  applications: ApplicationItem[];
  isLoading: boolean;
  canManageStages: boolean;
  onOpenMoveModal: (app: ApplicationItem) => void;
  onQuickShortlist: (app: ApplicationItem) => void;
  onQuickReject: (app: ApplicationItem) => void;
}

const ATS_COLUMNS: KanbanColumnConfig[] = [
  {
    id: 'APPLIED',
    label: 'Applied',
    headerColor: 'text-slate-700 dark:text-zinc-300',
    badgeColor: 'bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300',
    borderColor: 'border-t-slate-400',
  },
  {
    id: 'UNDER_REVIEW',
    label: 'Screening (Under Review)',
    headerColor: 'text-blue-700 dark:text-blue-400',
    badgeColor: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300',
    borderColor: 'border-t-blue-500',
  },
  {
    id: 'SHORTLISTED',
    label: 'Shortlisted',
    headerColor: 'text-indigo-700 dark:text-indigo-400',
    badgeColor: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300',
    borderColor: 'border-t-indigo-500',
  },
  {
    id: 'INTERVIEW_SCHEDULED',
    label: 'Interview',
    headerColor: 'text-purple-700 dark:text-purple-400',
    badgeColor: 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300',
    borderColor: 'border-t-purple-500',
  },
  {
    id: 'SELECTED',
    label: 'Selected',
    headerColor: 'text-teal-700 dark:text-teal-400',
    badgeColor: 'bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300',
    borderColor: 'border-t-teal-500',
  },
  {
    id: 'OFFER_SENT',
    label: 'Offer Released',
    headerColor: 'text-amber-700 dark:text-amber-400',
    badgeColor: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
    borderColor: 'border-t-amber-500',
  },
  {
    id: 'OFFER_ACCEPTED',
    label: 'Offer Accepted',
    headerColor: 'text-emerald-700 dark:text-emerald-400',
    badgeColor: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
    borderColor: 'border-t-emerald-500',
  },
  {
    id: 'EMPLOYEE_CREATED',
    label: 'Hired (Onboarded)',
    headerColor: 'text-green-700 dark:text-green-400',
    badgeColor: 'bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-300',
    borderColor: 'border-t-green-600',
  },
  {
    id: 'REJECTED',
    label: 'Rejected',
    headerColor: 'text-rose-700 dark:text-rose-400',
    badgeColor: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300',
    borderColor: 'border-t-rose-500',
  },
];

export const AtsKanbanBoard: React.FC<AtsKanbanBoardProps> = ({
  applications,
  isLoading,
  canManageStages,
  onOpenMoveModal,
  onQuickShortlist,
  onQuickReject,
}) => {
  if (isLoading) {
    return (
      <div className="flex gap-4 overflow-x-auto pb-6">
        {ATS_COLUMNS.slice(0, 5).map((col) => (
          <div
            key={col.id}
            className="w-80 flex-shrink-0 bg-slate-50/70 dark:bg-zinc-900/60 rounded-2xl border border-slate-200/80 dark:border-zinc-800 p-4 space-y-3"
          >
            <div className="h-6 w-36 bg-slate-200 dark:bg-zinc-800 rounded-lg animate-pulse" />
            <div className="h-32 bg-white dark:bg-zinc-900 rounded-xl border border-slate-200/70 dark:border-zinc-800 animate-pulse" />
            <div className="h-32 bg-white dark:bg-zinc-900 rounded-xl border border-slate-200/70 dark:border-zinc-800 animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-6 select-none">
      {ATS_COLUMNS.map((col) => {
        // Match applications to column stage (aggregating Interview states under INTERVIEW_SCHEDULED)
        const columnApps = applications.filter((app) => {
          if (col.id === 'INTERVIEW_SCHEDULED') {
            return app.status === 'INTERVIEW_SCHEDULED' || app.status === 'INTERVIEW_COMPLETED';
          }
          return app.status === col.id;
        });

        return (
          <div
            key={col.id}
            className={`w-80 flex-shrink-0 bg-slate-100/70 dark:bg-zinc-900/50 rounded-2xl border border-slate-200/70 dark:border-zinc-800/80 border-t-4 ${col.borderColor} flex flex-col max-h-[calc(100vh-250px)] shadow-xs`}
          >
            {/* Column Header */}
            <div className="p-3.5 border-b border-slate-200/70 dark:border-zinc-800/80 flex items-center justify-between">
              <h3 className={`text-xs font-bold uppercase tracking-wider ${col.headerColor}`}>
                {col.label}
              </h3>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${col.badgeColor}`}>
                {columnApps.length}
              </span>
            </div>

            {/* Column Cards Container */}
            <div className="p-3 space-y-3 overflow-y-auto flex-1">
              {columnApps.length === 0 ? (
                <div className="py-10 text-center text-xs text-slate-400 dark:text-zinc-500 border border-dashed border-slate-200 dark:border-zinc-800/80 rounded-xl bg-white/40 dark:bg-zinc-900/20">
                  No candidates in this stage
                </div>
              ) : (
                columnApps.map((app) => {
                  const candidateName = `${app.first_name || ''} ${app.last_name || ''}`.trim() || 'Candidate';
                  const initials = candidateName
                    .split(' ')
                    .filter(Boolean)
                    .slice(0, 2)
                    .map((n) => n[0].toUpperCase())
                    .join('');

                  return (
                    <div
                      key={app.id}
                      className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200/80 dark:border-zinc-800 p-3.5 shadow-xs hover:shadow-md hover:border-teal-500/50 dark:hover:border-teal-500/50 transition-all duration-150 space-y-2.5 relative group"
                    >
                      {/* Card Header: Initials Avatar, Name & Applied Job Chip */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 font-bold text-xs flex items-center justify-center shrink-0 border border-teal-200/60 dark:border-teal-800/40">
                            {initials || 'C'}
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-slate-900 dark:text-zinc-100 truncate group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                              {candidateName}
                            </h4>
                            <p className="text-[11px] text-slate-400 dark:text-zinc-500 truncate">
                              {app.email}
                            </p>
                          </div>
                        </div>

                        {app.experience_years > 0 && (
                          <span className="text-[10px] font-semibold text-slate-600 dark:text-zinc-400 bg-slate-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded shrink-0">
                            {app.experience_years}y exp
                          </span>
                        )}
                      </div>

                      {/* Job Title Chip */}
                      <div className="pt-0.5">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 text-[11px] font-medium max-w-full truncate border border-slate-200/60 dark:border-zinc-700/60">
                          <Briefcase className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{app.job?.title || 'Open Role'}</span>
                        </span>
                      </div>

                      {/* Current Org & Role */}
                      {(app.current_company || app.current_designation) && (
                        <div className="text-[11px] text-slate-500 dark:text-zinc-400 flex items-center gap-1.5 truncate">
                          <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">
                            {[app.current_designation, app.current_company].filter(Boolean).join(' at ')}
                          </span>
                        </div>
                      )}

                      {/* Card Footer: Date, Move ▾ Button, and Hover Quick Actions */}
                      <div className="pt-2 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between gap-1 text-[11px]">
                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>{new Date(app.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                        </span>

                        <div className="flex items-center gap-1.5">
                          {/* Hover Quick Actions */}
                          {canManageStages && (
                            <div className="hidden group-hover:flex items-center gap-1">
                              {app.status !== 'SHORTLISTED' && (
                                <button
                                  type="button"
                                  onClick={() => onQuickShortlist(app)}
                                  title="Quick Shortlist"
                                  className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 hover:bg-indigo-600 hover:text-white transition-colors"
                                >
                                  Shortlist
                                </button>
                              )}
                              {app.status !== 'REJECTED' && (
                                <button
                                  type="button"
                                  onClick={() => onQuickReject(app)}
                                  title="Quick Reject"
                                  className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 hover:bg-rose-600 hover:text-white transition-colors"
                                >
                                  Reject
                                </button>
                              )}
                            </div>
                          )}

                          {/* Move ▾ Button */}
                          {canManageStages && (
                            <button
                              type="button"
                              onClick={() => onOpenMoveModal(app)}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border border-teal-200/60 dark:border-teal-800/40 hover:bg-teal-600 hover:text-white transition-colors text-[10px] font-semibold"
                            >
                              <span>Move</span>
                              <ChevronDown className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
