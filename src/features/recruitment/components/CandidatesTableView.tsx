/**
 * @file CandidatesTableView.tsx
 * @description Comprehensive Data Table view for Candidates & ATS Applications.
 * Displays candidate details, live ATS match scores, stages, and quick triage actions.
 */

import React from 'react';
import {
  Users,
  Building2,
  MapPin,
  Clock,
  Sparkles,
  Eye,
  CheckCircle2,
  XCircle,
  MoreVertical,
  Mail,
  Phone,
  FileText,
  Bookmark,
} from 'lucide-react';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import type { ApplicationItem, ApplicationWorkflowStage } from '../types/candidate.types';

interface CandidatesTableViewProps {
  applications: ApplicationItem[];
  isLoading: boolean;
  onViewDetails: (app: ApplicationItem) => void;
  onShortlist: (app: ApplicationItem) => void;
  onReject: (app: ApplicationItem) => void;
  onAdvanceStage: (app: ApplicationItem, nextStage: ApplicationWorkflowStage) => void;
}

const STAGE_CONFIG: Record<
  ApplicationWorkflowStage,
  { label: string; variant: 'brand' | 'success' | 'warning' | 'danger' | 'slate' | 'role' }
> = {
  APPLIED: { label: 'Applied', variant: 'slate' },
  UNDER_REVIEW: { label: 'Under Review', variant: 'brand' },
  SHORTLISTED: { label: 'Shortlisted', variant: 'success' },
  INTERVIEW_SCHEDULED: { label: 'Interview Scheduled', variant: 'warning' },
  INTERVIEW_COMPLETED: { label: 'Interview Done', variant: 'role' },
  SELECTED: { label: 'Selected', variant: 'brand' },
  REJECTED: { label: 'Rejected', variant: 'danger' },
  HOLD: { label: 'On Hold', variant: 'slate' },
  OFFER_SENT: { label: 'Offer Sent', variant: 'warning' },
  OFFER_ACCEPTED: { label: 'Hired', variant: 'success' },
  OFFER_REJECTED: { label: 'Offer Declined', variant: 'danger' },
  EMPLOYEE_CREATED: { label: 'Onboarded', variant: 'success' },
};

export const CandidatesTableView: React.FC<CandidatesTableViewProps> = ({
  applications,
  isLoading,
  onViewDetails,
  onShortlist,
  onReject,
  onAdvanceStage,
}) => {
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/80 dark:border-zinc-800 p-6 space-y-4">
        {Array.from({ length: 5 }).map((_, idx) => (
          <div key={idx} className="h-16 rounded-xl bg-slate-100 dark:bg-zinc-800 animate-pulse" />
        ))}
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/80 dark:border-zinc-800 py-16 px-4 text-center">
        <div className="w-14 h-14 rounded-2xl bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 mx-auto flex items-center justify-center mb-3">
          <Users className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white">No candidates found</h3>
        <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-sm mx-auto mt-1">
          No applicants match your current query or filter criteria. Add a candidate manually or relax filters.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/80 dark:border-zinc-800 overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-50 dark:bg-zinc-800/60 border-b border-slate-200/80 dark:border-zinc-800 text-[11px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
              <th className="py-3 px-4">Candidate</th>
              <th className="py-3 px-4">Applied Role</th>
              <th className="py-3 px-4">Experience & Org</th>
              <th className="py-3 px-4">Location</th>
              <th className="py-3 px-4">Applied Date</th>
              <th className="py-3 px-4">Stage</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/80">
            {applications.map((app) => {
              const fullName = `${app.first_name || ''} ${app.last_name || ''}`.trim() || 'Candidate';
              const initials = fullName
                .split(' ')
                .filter(Boolean)
                .slice(0, 2)
                .map((n) => n[0].toUpperCase())
                .join('');
              const stage = STAGE_CONFIG[app.status] || { label: app.status, variant: 'slate' };

              return (
                <tr
                  key={app.id}
                  onClick={() => onViewDetails(app)}
                  className="hover:bg-slate-50/80 dark:hover:bg-zinc-800/40 transition-colors cursor-pointer group"
                >
                  {/* Candidate Name & Contact */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 font-bold text-xs flex items-center justify-center shrink-0 border border-teal-200/60 dark:border-teal-800/40">
                        {initials || 'C'}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 dark:text-zinc-100 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors truncate">
                          {fullName}
                        </p>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 dark:text-zinc-500">
                          <span className="truncate">{app.email}</span>
                          {app.phone && <span>• {app.phone}</span>}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Applied Role */}
                  <td className="py-3.5 px-4">
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-800 dark:text-zinc-200 truncate">
                        {app.job?.title || 'Open Position'}
                      </p>
                      <p className="text-[11px] text-slate-400 dark:text-zinc-500 truncate">
                        {app.job?.department || 'General Application'}
                      </p>
                    </div>
                  </td>

                  {/* Experience & Org */}
                  <td className="py-3.5 px-4">
                    <div className="min-w-0">
                      <p className="font-medium text-slate-800 dark:text-zinc-200 truncate">
                        {app.current_company || 'Not Specified'}
                      </p>
                      <p className="text-[11px] text-slate-400 dark:text-zinc-500">
                        {app.experience_years > 0 ? `${app.experience_years} years exp` : 'Fresher / Entry'}
                      </p>
                    </div>
                  </td>

                  {/* Location */}
                  <td className="py-3.5 px-4 text-slate-600 dark:text-zinc-300">
                    <div className="flex items-center gap-1.5 truncate">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{[app.city, app.state, app.country].filter(Boolean).join(', ') || '—'}</span>
                    </div>
                  </td>

                  {/* Applied Date */}
                  <td className="py-3.5 px-4 text-slate-500 dark:text-zinc-400">
                    {new Date(app.created_at).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </td>

                  {/* Stage */}
                  <td className="py-3.5 px-4">
                    <Badge variant={stage.variant} size="sm" className="font-semibold text-[10px]">
                      {stage.label}
                    </Badge>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="inline-flex items-center gap-1.5">
                      {app.status === 'APPLIED' || app.status === 'UNDER_REVIEW' ? (
                        <button
                          type="button"
                          onClick={() => onShortlist(app)}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border border-teal-200/70 dark:border-teal-800/40 hover:bg-teal-600 hover:text-white transition-colors"
                        >
                          Shortlist
                        </button>
                      ) : null}

                      {app.status !== 'REJECTED' && (
                        <button
                          type="button"
                          onClick={() => onReject(app)}
                          title="Reject"
                          className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => onViewDetails(app)}
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
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

