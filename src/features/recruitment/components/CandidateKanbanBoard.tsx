/**
 * @file CandidateKanbanBoard.tsx
 * @description Interactive visual ATS workflow pipeline board.
 * Renders candidate application cards across verified workflow stages with instant stage transitions.
 */

import React from 'react';
import {
  Users,
  Building2,
  MapPin,
  Clock,
  Sparkles,
  ChevronRight,
  MoreVertical,
  CheckCircle2,
  XCircle,
  FileText,
  Mail,
  Phone,
  ArrowRight,
} from 'lucide-react';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import type { ApplicationItem, ApplicationWorkflowStage } from '../types/candidate.types';

interface CandidateKanbanBoardProps {
  applications: ApplicationItem[];
  isLoading: boolean;
  onSelectApplication: (app: ApplicationItem) => void;
  onAdvanceStage: (app: ApplicationItem, nextStage: ApplicationWorkflowStage) => void;
  onRejectApplication: (app: ApplicationItem) => void;
}

interface ColumnConfig {
  id: ApplicationWorkflowStage;
  label: string;
  badgeClass: string;
  dotColor: string;
}

const KANBAN_COLUMNS: ColumnConfig[] = [
  { id: 'APPLIED', label: 'Applied', badgeClass: 'bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300', dotColor: 'bg-slate-400' },
  { id: 'UNDER_REVIEW', label: 'Under Review', badgeClass: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300', dotColor: 'bg-blue-500' },
  { id: 'SHORTLISTED', label: 'Shortlisted', badgeClass: 'bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300', dotColor: 'bg-teal-500' },
  { id: 'INTERVIEW_SCHEDULED', label: 'Interview Scheduled', badgeClass: 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300', dotColor: 'bg-purple-500' },
  { id: 'SELECTED', label: 'Selected', badgeClass: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300', dotColor: 'bg-indigo-500' },
  { id: 'OFFER_SENT', label: 'Offer Sent', badgeClass: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300', dotColor: 'bg-amber-500' },
  { id: 'OFFER_ACCEPTED', label: 'Hired / Accepted', badgeClass: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300', dotColor: 'bg-emerald-500' },
  { id: 'REJECTED', label: 'Rejected', badgeClass: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300', dotColor: 'bg-rose-500' },
];

const NEXT_STAGE_MAP: Record<ApplicationWorkflowStage, ApplicationWorkflowStage | null> = {
  APPLIED: 'UNDER_REVIEW',
  UNDER_REVIEW: 'SHORTLISTED',
  SHORTLISTED: 'INTERVIEW_SCHEDULED',
  INTERVIEW_SCHEDULED: 'SELECTED',
  INTERVIEW_COMPLETED: 'SELECTED',
  SELECTED: 'OFFER_SENT',
  OFFER_SENT: 'OFFER_ACCEPTED',
  OFFER_ACCEPTED: 'EMPLOYEE_CREATED',
  OFFER_REJECTED: null,
  REJECTED: null,
  HOLD: 'SHORTLISTED',
  EMPLOYEE_CREATED: null,
};

export const CandidateKanbanBoard: React.FC<CandidateKanbanBoardProps> = ({
  applications,
  isLoading,
  onSelectApplication,
  onAdvanceStage,
  onRejectApplication,
}) => {
  if (isLoading) {
    return (
      <div className="flex gap-4 overflow-x-auto pb-6">
        {KANBAN_COLUMNS.slice(0, 5).map((col) => (
          <div
            key={col.id}
            className="w-72 flex-shrink-0 bg-slate-50 dark:bg-zinc-900/60 rounded-2xl border border-slate-200/80 dark:border-zinc-800 p-4 space-y-3"
          >
            <div className="h-6 w-32 bg-slate-200 dark:bg-zinc-800 rounded-lg animate-pulse" />
            <div className="h-28 bg-white dark:bg-zinc-900 rounded-xl border border-slate-200/70 dark:border-zinc-800 animate-pulse" />
            <div className="h-28 bg-white dark:bg-zinc-900 rounded-xl border border-slate-200/70 dark:border-zinc-800 animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-6 select-none">
      {KANBAN_COLUMNS.map((col) => {
        const columnApps = applications.filter((app) => app.status === col.id);

        return (
          <div
            key={col.id}
            className="w-76 flex-shrink-0 bg-slate-100/70 dark:bg-zinc-900/50 rounded-2xl border border-slate-200/70 dark:border-zinc-800/80 flex flex-col max-h-[calc(100vh-280px)]"
          >
            {/* Column Header */}
            <div className="p-3.5 border-b border-slate-200/70 dark:border-zinc-800/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${col.dotColor}`} />
                <h3 className="text-xs font-bold text-slate-800 dark:text-zinc-200 uppercase tracking-wider">
                  {col.label}
                </h3>
              </div>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${col.badgeClass}`}>
                {columnApps.length}
              </span>
            </div>

            {/* Column Cards Container */}
            <div className="p-2.5 space-y-3 overflow-y-auto flex-1">
              {columnApps.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400 dark:text-zinc-500 border border-dashed border-slate-200 dark:border-zinc-800/80 rounded-xl">
                  No applicants in {col.label}
                </div>
              ) : (
                columnApps.map((app) => {
                  const nextStage = NEXT_STAGE_MAP[app.status];
                  const fullName = `${app.first_name || ''} ${app.last_name || ''}`.trim() || 'Unnamed Candidate';
                  const initials = fullName
                    .split(' ')
                    .filter(Boolean)
                    .slice(0, 2)
                    .map((n) => n[0].toUpperCase())
                    .join('');

                  return (
                    <div
                      key={app.id}
                      onClick={() => onSelectApplication(app)}
                      className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200/80 dark:border-zinc-800 p-3.5 shadow-xs hover:shadow-md hover:border-teal-500/50 dark:hover:border-teal-500/50 transition-all duration-150 cursor-pointer space-y-2.5 group"
                    >
                      {/* Card Header: Avatar & Name */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 font-bold text-xs flex items-center justify-center shrink-0 border border-teal-200/60 dark:border-teal-800/40">
                            {initials || 'C'}
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-slate-900 dark:text-zinc-100 truncate group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                              {fullName}
                            </h4>
                            <p className="text-[11px] text-slate-500 dark:text-zinc-400 truncate">
                              {app.job?.title || app.current_designation || 'Position Applicant'}
                            </p>
                          </div>
                        </div>

                        {app.experience_years > 0 && (
                          <span className="text-[10px] font-semibold text-slate-600 dark:text-zinc-400 bg-slate-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded shrink-0">
                            {app.experience_years}y exp
                          </span>
                        )}
                      </div>

                      {/* Info Row: Location & Company */}
                      <div className="text-[11px] text-slate-500 dark:text-zinc-400 space-y-1">
                        {app.current_company && (
                          <div className="flex items-center gap-1.5 truncate">
                            <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="truncate">{app.current_company}</span>
                          </div>
                        )}
                        {(app.city || app.country) && (
                          <div className="flex items-center gap-1.5 truncate">
                            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="truncate">{[app.city, app.country].filter(Boolean).join(', ')}</span>
                          </div>
                        )}
                      </div>

                      {/* Card Footer: Quick Actions */}
                      <div className="pt-2 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between gap-1 text-[11px]">
                        <span className="text-[10px] text-slate-400">
                          {new Date(app.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>

                        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                          {nextStage && (
                            <button
                              type="button"
                              onClick={() => onAdvanceStage(app, nextStage)}
                              title={`Advance to ${nextStage.replace(/_/g, ' ')}`}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border border-teal-200/60 dark:border-teal-800/40 hover:bg-teal-600 hover:text-white transition-colors text-[10px] font-semibold"
                            >
                              <span>Next</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          )}
                          {app.status !== 'REJECTED' && (
                            <button
                              type="button"
                              onClick={() => onRejectApplication(app)}
                              title="Reject candidate"
                              className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                            >
                              <XCircle className="w-3.5 h-3.5" />
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

