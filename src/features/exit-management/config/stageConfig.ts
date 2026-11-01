import React from 'react';
import {
  Layers,
  FileText,
  Clock,
  UserCheck,
  Calendar,
  FileCode,
  ShieldAlert,
  CreditCard,
  MessageSquare,
  FileCheck,
  UserX,
  CheckCircle2,
  XCircle,
  RotateCcw,
} from 'lucide-react';
import type { ExitStage } from '../types/exit.types';

export interface ExitStageConfig {
  stage: ExitStage | 'ALL';
  slug: string;
  routePath: string;
  title: string;
  shortDescription: string;
  detailedDescription: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bg: string;
  activeBorder: string;
  badgeVariant: 'default' | 'brand' | 'success' | 'warning' | 'error' | 'outline' | 'neutral';
  stageFilter?: ExitStage;
}

export const STAGE_CONFIGS: ExitStageConfig[] = [
  {
    stage: 'ALL',
    slug: 'stages',
    routePath: '/exit-management/stages',
    title: 'All Stages',
    shortDescription: 'Comprehensive overview of all employee separation cases across the organization.',
    detailedDescription: 'Review all active, in-progress, completed, and archived employee separations across every department.',
    icon: Layers,
    color: 'text-indigo-600 dark:text-indigo-400',
    bg: 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200/60 dark:border-indigo-900/40',
    activeBorder: 'border-indigo-500 ring-2 ring-indigo-500/30 bg-indigo-50/60 dark:bg-indigo-950/40',
    badgeVariant: 'brand',
    stageFilter: undefined,
  },
  {
    stage: 'RESIGNATION_SUBMITTED',
    slug: 'resignation-submitted',
    routePath: '/exit-management/resignation-submitted',
    title: 'Resignation Submitted',
    shortDescription: 'Review newly submitted resignations awaiting initial workflow verification.',
    detailedDescription: 'Newly submitted employee resignation notices pending manager acknowledgment and initial workflow routing.',
    icon: FileText,
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-950/40 border-blue-200/60 dark:border-blue-900/40',
    activeBorder: 'border-blue-500 ring-2 ring-blue-500/30 bg-blue-50/60 dark:bg-blue-950/40',
    badgeVariant: 'neutral',
    stageFilter: 'RESIGNATION_SUBMITTED',
  },
  {
    stage: 'MANAGER_REVIEW',
    slug: 'manager-review',
    routePath: '/exit-management/manager-review',
    title: 'Manager Review',
    shortDescription: 'Approve or reject manager review requests and assess transition plans.',
    detailedDescription: 'Reporting manager assessment, discussion scheduling, handover review, and approval or rejection sign-off.',
    icon: Clock,
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200/60 dark:border-amber-900/40',
    activeBorder: 'border-amber-500 ring-2 ring-amber-500/30 bg-amber-50/60 dark:bg-amber-950/40',
    badgeVariant: 'warning',
    stageFilter: 'MANAGER_REVIEW',
  },
  {
    stage: 'HR_REVIEW',
    slug: 'hr-review',
    routePath: '/exit-management/hr-review',
    title: 'HR Review',
    shortDescription: 'HR policy verification, contractual checks, and formal resignation approval.',
    detailedDescription: 'People Operations policy evaluation, notice period validation, contractual obligations check, and HR sign-off.',
    icon: UserCheck,
    color: 'text-purple-600 dark:text-purple-400',
    bg: 'bg-purple-50 dark:bg-purple-950/40 border-purple-200/60 dark:border-purple-900/40',
    activeBorder: 'border-purple-500 ring-2 ring-purple-500/30 bg-purple-50/60 dark:bg-purple-950/40',
    badgeVariant: 'warning',
    stageFilter: 'HR_REVIEW',
  },
  {
    stage: 'NOTICE_PERIOD',
    slug: 'notice-period',
    routePath: '/exit-management/notice-period',
    title: 'Notice Period',
    shortDescription: 'Track notice period progress, served vs remaining calendar days, and last working day.',
    detailedDescription: 'Real-time notice period tracking, calendar countdown, early release requests, and official last working day monitoring.',
    icon: Calendar,
    color: 'text-sky-600 dark:text-sky-400',
    bg: 'bg-sky-50 dark:bg-sky-950/40 border-sky-200/60 dark:border-sky-900/40',
    activeBorder: 'border-sky-500 ring-2 ring-sky-500/30 bg-sky-50/60 dark:bg-sky-950/40',
    badgeVariant: 'brand',
    stageFilter: 'NOTICE_PERIOD',
  },
  {
    stage: 'KNOWLEDGE_TRANSFER',
    slug: 'knowledge-transfer',
    routePath: '/exit-management/knowledge-transfer',
    title: 'Knowledge Transfer',
    shortDescription: 'Track handover tasks, project documentation, code repositories, and KT verification.',
    detailedDescription: 'Handover task execution, repository access handover, client transition, and manager verification sign-off.',
    icon: FileCode,
    color: 'text-teal-600 dark:text-teal-400',
    bg: 'bg-teal-50 dark:bg-teal-950/40 border-teal-200/60 dark:border-teal-900/40',
    activeBorder: 'border-teal-500 ring-2 ring-teal-500/30 bg-teal-50/60 dark:bg-teal-950/40',
    badgeVariant: 'brand',
    stageFilter: 'KNOWLEDGE_TRANSFER',
  },
  {
    stage: 'CLEARANCE_PENDING',
    slug: 'clearance-pending',
    routePath: '/exit-management/clearance-pending',
    title: 'Clearance Pending',
    shortDescription: 'Department-wise clearance tracking across Manager, IT, Finance, Admin, and HR.',
    detailedDescription: 'Cross-functional clearance workflow requiring sign-offs from Manager, IT, Finance, Administration, and HR teams.',
    icon: ShieldAlert,
    color: 'text-cyan-600 dark:text-cyan-400',
    bg: 'bg-cyan-50 dark:bg-cyan-950/40 border-cyan-200/60 dark:border-cyan-900/40',
    activeBorder: 'border-cyan-500 ring-2 ring-cyan-500/30 bg-cyan-50/60 dark:bg-cyan-950/40',
    badgeVariant: 'brand',
    stageFilter: 'CLEARANCE_PENDING',
  },
  {
    stage: 'FNF_SETTLEMENT',
    slug: 'fnf-settlement',
    routePath: '/exit-management/fnf-settlement',
    title: 'FnF Settlement',
    shortDescription: 'Salary dues, leave encashment, gratuity, deductions, and full & final payroll settlement.',
    detailedDescription: 'Full and final payroll calculations: unpaid salary, leave encashment, gratuity, bonuses, deductions, and payment status.',
    icon: CreditCard,
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200/60 dark:border-emerald-900/40',
    activeBorder: 'border-emerald-500 ring-2 ring-emerald-500/30 bg-emerald-50/60 dark:bg-emerald-950/40',
    badgeVariant: 'success',
    stageFilter: 'FNF_SETTLEMENT',
  },
  {
    stage: 'EXIT_INTERVIEW',
    slug: 'exit-interview',
    routePath: '/exit-management/exit-interview',
    title: 'Exit Interview',
    shortDescription: 'Schedule and record confidential exit feedback and reason for departure.',
    detailedDescription: 'Confidential exit interview feedback collection, rating analysis, reason documentation, and attrition insights.',
    icon: MessageSquare,
    color: 'text-violet-600 dark:text-violet-400',
    bg: 'bg-violet-50 dark:bg-violet-950/40 border-violet-200/60 dark:border-violet-900/40',
    activeBorder: 'border-violet-500 ring-2 ring-violet-500/30 bg-violet-50/60 dark:bg-violet-950/40',
    badgeVariant: 'brand',
    stageFilter: 'EXIT_INTERVIEW',
  },
  {
    stage: 'DOCUMENTS_PENDING',
    slug: 'documents-pending',
    routePath: '/exit-management/documents-pending',
    title: 'Documents Pending',
    shortDescription: 'Track pending relieving documents, experience certificates, and exit packages.',
    detailedDescription: 'Generation and issuance of formal relieving letters, experience certificates, and No Dues statements.',
    icon: FileCheck,
    color: 'text-orange-600 dark:text-orange-400',
    bg: 'bg-orange-50 dark:bg-orange-950/40 border-orange-200/60 dark:border-orange-900/40',
    activeBorder: 'border-orange-500 ring-2 ring-orange-500/30 bg-orange-50/60 dark:bg-orange-950/40',
    badgeVariant: 'warning',
    stageFilter: 'DOCUMENTS_PENDING',
  },
  {
    stage: 'ACCESS_REVOCATION',
    slug: 'access-revocation',
    routePath: '/exit-management/access-revocation',
    title: 'Access Revocation',
    shortDescription: 'Track IT account and system access revocation on the employee\'s Last Working Day.',
    detailedDescription: 'IT infrastructure access deactivation: email, SSO, VPN, source code repositories, and physical building access.',
    icon: UserX,
    color: 'text-rose-600 dark:text-rose-400',
    bg: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200/60 dark:border-rose-900/40',
    activeBorder: 'border-rose-500 ring-2 ring-rose-500/30 bg-rose-50/60 dark:bg-rose-950/40',
    badgeVariant: 'error',
    stageFilter: 'ACCESS_REVOCATION',
  },
  {
    stage: 'COMPLETED',
    slug: 'completed',
    routePath: '/exit-management/completed',
    title: 'Completed',
    shortDescription: 'Show successfully completed exits and archived employee records.',
    detailedDescription: 'Permanent record of fully separated employees with completed clearances, issued documents, and settled dues.',
    icon: CheckCircle2,
    color: 'text-green-600 dark:text-green-400',
    bg: 'bg-green-50 dark:bg-green-950/40 border-green-200/60 dark:border-green-900/40',
    activeBorder: 'border-green-500 ring-2 ring-green-500/30 bg-green-50/60 dark:bg-green-950/40',
    badgeVariant: 'success',
    stageFilter: 'COMPLETED',
  },
  {
    stage: 'REJECTED',
    slug: 'rejected',
    routePath: '/exit-management/rejected',
    title: 'Rejected',
    shortDescription: 'Show rejected separation requests and recorded rejection rationale.',
    detailedDescription: 'Resignation requests formally rejected by reporting manager or Human Resources with mandatory business reasons.',
    icon: XCircle,
    color: 'text-red-600 dark:text-red-400',
    bg: 'bg-red-50 dark:bg-red-950/40 border-red-200/60 dark:border-red-900/40',
    activeBorder: 'border-red-500 ring-2 ring-red-500/30 bg-red-50/60 dark:bg-red-950/40',
    badgeVariant: 'error',
    stageFilter: 'REJECTED',
  },
  {
    stage: 'WITHDRAWN',
    slug: 'withdrawn',
    routePath: '/exit-management/withdrawn',
    title: 'Withdrawn',
    shortDescription: 'Show withdrawn resignation requests retracted by employees.',
    detailedDescription: 'Resignation notices retracted by employees prior to final approval, retaining active employment status.',
    icon: RotateCcw,
    color: 'text-slate-600 dark:text-slate-400',
    bg: 'bg-slate-100 dark:bg-zinc-800 border-slate-200 dark:border-zinc-700',
    activeBorder: 'border-slate-500 ring-2 ring-slate-500/30 bg-slate-50/60 dark:bg-zinc-800/60',
    badgeVariant: 'neutral',
    stageFilter: 'WITHDRAWN',
  },
];

const STAGE_BY_SLUG: Record<string, ExitStageConfig> = STAGE_CONFIGS.reduce((acc, config) => {
  acc[config.slug] = config;
  return acc;
}, {} as Record<string, ExitStageConfig>);

const STAGE_BY_ID: Record<string, ExitStageConfig> = STAGE_CONFIGS.reduce((acc, config) => {
  acc[config.stage] = config;
  return acc;
}, {} as Record<string, ExitStageConfig>);

export const getStageConfigBySlug = (slug?: string): ExitStageConfig => {
  if (!slug) return STAGE_CONFIGS[0];
  return STAGE_BY_SLUG[slug.toLowerCase()] || STAGE_CONFIGS[0];
};

export const getStageConfigByStage = (stage: ExitStage | 'ALL'): ExitStageConfig => {
  return STAGE_BY_ID[stage] || STAGE_CONFIGS[0];
};
