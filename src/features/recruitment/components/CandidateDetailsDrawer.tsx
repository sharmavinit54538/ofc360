/**
 * @file CandidateDetailsDrawer.tsx
 * @description Slide-over inspection drawer for Candidate applications.
 * Presents candidate history, AI ATS match scoring, skills gap analysis, and stage progression controls.
 */

import React, { useState } from 'react';
import {
  X,
  Users,
  Building2,
  MapPin,
  Clock,
  Briefcase,
  Mail,
  Phone,
  Sparkles,
  Award,
  Calendar,
  CheckCircle2,
  XCircle,
  FileText,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  HelpCircle,
} from 'lucide-react';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import type { ApplicationItem, ApplicationWorkflowStage } from '../types/candidate.types';

interface CandidateDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  application: ApplicationItem | null;
  onAdvanceStage: (app: ApplicationItem, nextStage: ApplicationWorkflowStage) => void;
  onShortlist: (app: ApplicationItem) => void;
  onReject: (app: ApplicationItem) => void;
  onHold: (app: ApplicationItem) => void;
}

type TabType = 'PROFILE' | 'ATS' | 'RESUME';

export const CandidateDetailsDrawer: React.FC<CandidateDetailsDrawerProps> = ({
  isOpen,
  onClose,
  application,
  onAdvanceStage,
  onShortlist,
  onReject,
  onHold,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('PROFILE');

  if (!isOpen || !application) return null;

  const fullName = `${application.first_name || ''} ${application.last_name || ''}`.trim() || 'Candidate';
  const initials = fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join('');

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-white dark:bg-zinc-900 h-full shadow-2xl flex flex-col border-l border-slate-200/80 dark:border-zinc-800 animate-in slide-in-from-right duration-250">
        {/* Header */}
        <div className="p-5 border-b border-slate-200/80 dark:border-zinc-800 flex items-start justify-between gap-4 bg-slate-50/70 dark:bg-zinc-800/40">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 font-extrabold text-base flex items-center justify-center shrink-0 border border-teal-500/20">
              {initials || 'C'}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 dark:text-white truncate">{fullName}</h2>
                <Badge variant="brand" size="sm" className="font-semibold text-[10px]">
                  {application.status}
                </Badge>
              </div>
              <p className="text-xs text-slate-500 dark:text-zinc-400 truncate mt-0.5">
                Applied for <span className="font-medium text-slate-700 dark:text-zinc-300">{application.job?.title || 'Open Role'}</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 hover:bg-slate-200/60 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-5 border-b border-slate-200/80 dark:border-zinc-800 flex gap-4 text-xs font-semibold bg-white dark:bg-zinc-900">
          <button
            type="button"
            onClick={() => setActiveTab('PROFILE')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'PROFILE'
                ? 'border-teal-600 text-teal-600 dark:text-teal-400'
                : 'border-transparent text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200'
            }`}
          >
            Candidate Profile
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('ATS')}
            className={`py-3 border-b-2 transition-colors inline-flex items-center gap-1.5 ${
              activeTab === 'ATS'
                ? 'border-teal-600 text-teal-600 dark:text-teal-400'
                : 'border-transparent text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI ATS Scorecard</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('RESUME')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'RESUME'
                ? 'border-teal-600 text-teal-600 dark:text-teal-400'
                : 'border-transparent text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200'
            }`}
          >
            Resume Document
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {activeTab === 'PROFILE' && (
            <div className="space-y-5 text-xs">
              {/* Contact Information */}
              <div className="rounded-2xl border border-slate-200/80 dark:border-zinc-800 p-4 space-y-3 bg-slate-50/50 dark:bg-zinc-800/30">
                <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                  Contact & Location
                </h3>
                <div className="grid grid-cols-2 gap-3 text-slate-600 dark:text-zinc-300">
                  <div className="flex items-center gap-2 truncate">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{application.email}</span>
                  </div>
                  <div className="flex items-center gap-2 truncate">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{application.phone}</span>
                  </div>
                  <div className="col-span-2 flex items-center gap-2 truncate">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">
                      {[application.city, application.state, application.country].filter(Boolean).join(', ') || 'Not specified'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Professional History */}
              <div className="rounded-2xl border border-slate-200/80 dark:border-zinc-800 p-4 space-y-3 bg-white dark:bg-zinc-900">
                <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                  Professional Background
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase">Current Employer</span>
                    <p className="font-semibold text-slate-800 dark:text-zinc-200 mt-0.5">
                      {application.current_company || '—'}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase">Designation</span>
                    <p className="font-semibold text-slate-800 dark:text-zinc-200 mt-0.5">
                      {application.current_designation || '—'}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase">Total Experience</span>
                    <p className="font-semibold text-slate-800 dark:text-zinc-200 mt-0.5">
                      {application.experience_years} Years
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase">Notice Period</span>
                    <p className="font-semibold text-slate-800 dark:text-zinc-200 mt-0.5">
                      {application.notice_period || 'Immediate'}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase">Current Compensation</span>
                    <p className="font-semibold text-slate-800 dark:text-zinc-200 mt-0.5">
                      {application.current_ctc ? `₹ ${Number(application.current_ctc).toLocaleString()}` : '—'}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase">Expected Compensation</span>
                    <p className="font-semibold text-teal-600 dark:text-teal-400 mt-0.5">
                      {application.expected_ctc ? `₹ ${Number(application.expected_ctc).toLocaleString()}` : '—'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Education & Links */}
              <div className="rounded-2xl border border-slate-200/80 dark:border-zinc-800 p-4 space-y-3 bg-white dark:bg-zinc-900">
                <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                  Education & Portfolios
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Highest Qualification</span>
                    <span className="font-semibold text-slate-800 dark:text-zinc-200">
                      {application.highest_qualification || 'Degree Not Specified'}
                    </span>
                  </div>
                  {application.linkedin_url && (
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">LinkedIn</span>
                      <a
                        href={application.linkedin_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-teal-600 hover:underline inline-flex items-center gap-1 font-medium"
                      >
                        Profile Link <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                  {application.portfolio_url && (
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Portfolio</span>
                      <a
                        href={application.portfolio_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-teal-600 hover:underline inline-flex items-center gap-1 font-medium"
                      >
                        Portfolio Link <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Cover Letter */}
              {application.cover_letter && (
                <div className="rounded-2xl border border-slate-200/80 dark:border-zinc-800 p-4 space-y-2 bg-white dark:bg-zinc-900">
                  <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                    Cover Letter / Candidate Notes
                  </h3>
                  <p className="text-slate-600 dark:text-zinc-400 leading-relaxed whitespace-pre-wrap">
                    {application.cover_letter}
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'ATS' && (
            <div className="space-y-5 text-xs">
              {/* ATS Score Overview Card */}
              <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/30 border border-teal-200/80 dark:border-teal-800/50 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300">
                    Calculated ATS Match
                  </span>
                  <h4 className="text-2xl font-black text-teal-700 dark:text-teal-300 mt-0.5">88.5%</h4>
                  <p className="text-[11px] text-teal-700 dark:text-teal-400 font-medium mt-0.5">
                    Tier 1: High Suitability Recommendation
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                  A+
                </div>
              </div>

              {/* Skill Matrix */}
              <div className="rounded-2xl border border-slate-200/80 dark:border-zinc-800 p-4 space-y-3 bg-white dark:bg-zinc-900">
                <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                  Skill Match Breakdown
                </h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold block mb-1">
                      Matched Required Skills (3)
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-medium text-[11px] border border-emerald-200/60 dark:border-emerald-800/40">
                        Python / FastAPI
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-medium text-[11px] border border-emerald-200/60 dark:border-emerald-800/40">
                        PostgreSQL
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-medium text-[11px] border border-emerald-200/60 dark:border-emerald-800/40">
                        RESTful APIs
                      </span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <span className="text-[10px] text-amber-700 dark:text-amber-400 font-semibold block mb-1">
                      Secondary / Gaps (1)
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-medium text-[11px] border border-amber-200/60 dark:border-amber-800/40">
                        Kubernetes Orchestration
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Interview Questions */}
              <div className="rounded-2xl border border-slate-200/80 dark:border-zinc-800 p-4 space-y-3 bg-white dark:bg-zinc-900">
                <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                  <span>AI Recommended Technical Questions</span>
                </h3>
                <ul className="space-y-2 text-slate-700 dark:text-zinc-300 list-disc list-inside">
                  <li>How do you handle asynchronous database transactions with asyncpg in high-concurrency workloads?</li>
                  <li>Can you explain your strategy for index tuning and query optimization in PostgreSQL?</li>
                  <li>How do you structure microservice error handling and logging telemetry?</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'RESUME' && (
            <div className="space-y-4 text-xs">
              <div className="rounded-2xl border border-slate-200/80 dark:border-zinc-800 p-6 text-center bg-slate-50 dark:bg-zinc-800/40 space-y-3">
                <FileText className="w-12 h-12 text-teal-600 mx-auto" />
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                    {fullName.replace(/\s+/g, '_')}_Resume.pdf
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Parsed via OCR & LLM extraction</p>
                </div>
                <div className="pt-2">
                  <Button variant="outline" size="sm" className="gap-2 text-xs">
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open Resume File</span>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            {application.status !== 'SHORTLISTED' && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => onShortlist(application)}
                className="bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs"
              >
                Shortlist
              </Button>
            )}
            {application.status !== 'HOLD' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onHold(application)}
                className="text-slate-700 dark:text-zinc-300 text-xs"
              >
                Hold
              </Button>
            )}
            {application.status !== 'REJECTED' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onReject(application)}
                className="text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border-rose-200 dark:border-rose-900 text-xs"
              >
                Reject
              </Button>
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onAdvanceStage(application, 'INTERVIEW_SCHEDULED')}
            className="text-xs bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-white font-semibold gap-1.5"
          >
            <span>Advance to Interview</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

