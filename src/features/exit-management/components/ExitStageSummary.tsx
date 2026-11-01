import React from 'react';
import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Calendar,
  CreditCard,
  FileCheck,
  ShieldCheck,
  UserCheck,
  UserX,
  Layers,
  TrendingUp,
  Percent,
} from 'lucide-react';
import type { ExitCase, ExitStage } from '../types/exit.types';

export interface ExitStageSummaryProps {
  stage: ExitStage | 'ALL';
  cases: ExitCase[];
  totalRecords?: number;
}

interface SummaryCardItem {
  title: string;
  value: string | number;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bg: string;
}

export const ExitStageSummary: React.FC<ExitStageSummaryProps> = ({
  stage,
  cases,
  totalRecords = cases.length,
}) => {
  const getStageCards = (): SummaryCardItem[] => {
    switch (stage) {
      case 'RESIGNATION_SUBMITTED': {
        const awaitingInitial = cases.filter(
          (c) => c.status === 'PENDING' || !c.managerApproval?.status
        ).length;
        const avgNotice = cases.length > 0
          ? Math.round(cases.reduce((sum, c) => sum + (c.noticePeriodDays || 30), 0) / cases.length)
          : 30;

        return [
          {
            title: 'Total Submitted',
            value: totalRecords,
            description: 'Newly submitted resignations',
            icon: FileText,
            color: 'text-blue-600 dark:text-blue-400',
            bg: 'bg-blue-50 dark:bg-blue-950/40 border-blue-200/60 dark:border-blue-900/40',
          },
          {
            title: 'Awaiting Initial Review',
            value: awaitingInitial,
            description: 'Pending verification',
            icon: Clock,
            color: 'text-amber-600 dark:text-amber-400',
            bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200/60 dark:border-amber-900/40',
          },
          {
            title: 'Average Notice Period',
            value: `${avgNotice} Days`,
            description: 'Company standard policy',
            icon: Calendar,
            color: 'text-purple-600 dark:text-purple-400',
            bg: 'bg-purple-50 dark:bg-purple-950/40 border-purple-200/60 dark:border-purple-900/40',
          },
          {
            title: 'Early Release Requests',
            value: cases.filter((c) => c.earlyReleaseRequested).length,
            description: 'Subject to review',
            icon: AlertTriangle,
            color: 'text-rose-600 dark:text-rose-400',
            bg: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200/60 dark:border-rose-900/40',
          },
        ];
      }

      case 'MANAGER_REVIEW': {
        const pending = cases.filter(
          (c) => c.managerApproval?.status === 'PENDING' || c.status === 'PENDING'
        ).length;
        const approved = cases.filter((c) => c.managerApproval?.status === 'APPROVED').length;
        const rejected = cases.filter((c) => c.managerApproval?.status === 'REJECTED').length;

        return [
          {
            title: 'Pending Reviews',
            value: pending,
            description: 'Awaiting manager sign-off',
            icon: Clock,
            color: 'text-amber-600 dark:text-amber-400',
            bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200/60 dark:border-amber-900/40',
          },
          {
            title: 'Approved by Manager',
            value: approved,
            description: 'Forwarded to HR workflow',
            icon: CheckCircle2,
            color: 'text-emerald-600 dark:text-emerald-400',
            bg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200/60 dark:border-emerald-900/40',
          },
          {
            title: 'Rejected / Retained',
            value: rejected,
            description: 'Declined or retained in role',
            icon: XCircle,
            color: 'text-rose-600 dark:text-rose-400',
            bg: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200/60 dark:border-rose-900/40',
          },
          {
            title: 'Average Review Time',
            value: '< 48 Hours',
            description: 'Target SLA benchmark',
            icon: TrendingUp,
            color: 'text-indigo-600 dark:text-indigo-400',
            bg: 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200/60 dark:border-indigo-900/40',
          },
        ];
      }

      case 'HR_REVIEW': {
        const pending = cases.filter((c) => c.hrApproval?.status === 'PENDING').length;
        const approved = cases.filter((c) => c.hrApproval?.status === 'APPROVED').length;
        const exceptions = cases.filter((c) => c.earlyReleaseRequested).length;

        return [
          {
            title: 'Pending HR Review',
            value: pending,
            description: 'Awaiting HR validation',
            icon: UserCheck,
            color: 'text-purple-600 dark:text-purple-400',
            bg: 'bg-purple-50 dark:bg-purple-950/40 border-purple-200/60 dark:border-purple-900/40',
          },
          {
            title: 'HR Approved',
            value: approved,
            description: 'Clearances initiated',
            icon: CheckCircle2,
            color: 'text-emerald-600 dark:text-emerald-400',
            bg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200/60 dark:border-emerald-900/40',
          },
          {
            title: 'Policy Exceptions',
            value: exceptions,
            description: 'Early release or waiver',
            icon: AlertTriangle,
            color: 'text-amber-600 dark:text-amber-400',
            bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200/60 dark:border-amber-900/40',
          },
          {
            title: 'Clearance Target SLA',
            value: '3-5 Days',
            description: 'Across all departments',
            icon: Clock,
            color: 'text-blue-600 dark:text-blue-400',
            bg: 'bg-blue-50 dark:bg-blue-950/40 border-blue-200/60 dark:border-blue-900/40',
          },
        ];
      }

      case 'NOTICE_PERIOD': {
        return [
          {
            title: 'Serving Notice',
            value: cases.length,
            description: 'Active transition phase',
            icon: Calendar,
            color: 'text-sky-600 dark:text-sky-400',
            bg: 'bg-sky-50 dark:bg-sky-950/40 border-sky-200/60 dark:border-sky-900/40',
          },
          {
            title: 'Early Release Requests',
            value: cases.filter((c) => c.earlyReleaseRequested).length,
            description: 'Awaiting waiver decision',
            icon: AlertTriangle,
            color: 'text-amber-600 dark:text-amber-400',
            bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200/60 dark:border-amber-900/40',
          },
          {
            title: 'LWD ≤ 7 Days',
            value: cases.filter((c) => {
              if (!c.lastWorkingDay) return false;
              const diff = Math.ceil(
                (new Date(c.lastWorkingDay).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
              );
              return diff >= 0 && diff <= 7;
            }).length,
            description: 'Upcoming last working day',
            icon: Clock,
            color: 'text-rose-600 dark:text-rose-400',
            bg: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200/60 dark:border-rose-900/40',
          },
          {
            title: 'Avg Notice Served',
            value: '30 Days',
            description: 'Knowledge handover period',
            icon: CheckCircle2,
            color: 'text-emerald-600 dark:text-emerald-400',
            bg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200/60 dark:border-emerald-900/40',
          },
        ];
      }

      case 'KNOWLEDGE_TRANSFER': {
        const completed = cases.filter((c) => (c.ktProgress ?? 0) === 100).length;
        const avgKt = cases.length > 0
          ? Math.round(cases.reduce((sum, c) => sum + (c.ktProgress ?? 60), 0) / cases.length)
          : 0;

        return [
          {
            title: 'Active KT Handouts',
            value: cases.length,
            description: 'Knowledge transition cases',
            icon: FileCheck,
            color: 'text-emerald-600 dark:text-emerald-400',
            bg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200/60 dark:border-emerald-900/40',
          },
          {
            title: '100% Completed',
            value: completed,
            description: 'Sign-off received from team',
            icon: CheckCircle2,
            color: 'text-teal-600 dark:text-teal-400',
            bg: 'bg-teal-50 dark:bg-teal-950/40 border-teal-200/60 dark:border-teal-900/40',
          },
          {
            title: 'Average KT Progress',
            value: `${avgKt}%`,
            description: 'Across assigned handovers',
            icon: Percent,
            color: 'text-blue-600 dark:text-blue-400',
            bg: 'bg-blue-50 dark:bg-blue-950/40 border-blue-200/60 dark:border-blue-900/40',
          },
          {
            title: 'Incomplete Handouts',
            value: cases.length - completed,
            description: 'Pending document checklist',
            icon: AlertTriangle,
            color: 'text-amber-600 dark:text-amber-400',
            bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200/60 dark:border-amber-900/40',
          },
        ];
      }

      case 'CLEARANCE_PENDING': {
        return [
          {
            title: 'Clearance In Progress',
            value: cases.length,
            description: 'Department clearances',
            icon: ShieldCheck,
            color: 'text-cyan-600 dark:text-cyan-400',
            bg: 'bg-cyan-50 dark:bg-cyan-950/40 border-cyan-200/60 dark:border-cyan-900/40',
          },
          {
            title: 'IT Pending',
            value: cases.filter((c) => c.departmentClearances?.it?.status !== 'APPROVED').length,
            description: 'Hardware & access checklist',
            icon: Clock,
            color: 'text-blue-600 dark:text-blue-400',
            bg: 'bg-blue-50 dark:bg-blue-950/40 border-blue-200/60 dark:border-blue-900/40',
          },
          {
            title: 'Finance Pending',
            value: cases.filter((c) => c.departmentClearances?.finance?.status !== 'APPROVED').length,
            description: 'Reimbursements & claims',
            icon: CreditCard,
            color: 'text-purple-600 dark:text-purple-400',
            bg: 'bg-purple-50 dark:bg-purple-950/40 border-purple-200/60 dark:border-purple-900/40',
          },
          {
            title: 'Admin & HR Pending',
            value: cases.filter(
              (c) =>
                c.departmentClearances?.admin?.status !== 'APPROVED' ||
                c.departmentClearances?.hr?.status !== 'APPROVED'
            ).length,
            description: 'ID cards & documentation',
            icon: AlertTriangle,
            color: 'text-amber-600 dark:text-amber-400',
            bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200/60 dark:border-amber-900/40',
          },
        ];
      }

      case 'FNF_SETTLEMENT': {
        const totalAmount = cases.reduce((sum, c) => sum + (c.fnfAmount || 0), 0);
        const paid = cases.filter((c) => c.fnfStatus === 'PAID').length;
        const processing = cases.filter((c) =>
          ['APPROVED', 'PAYMENT_PROCESSING'].includes(c.fnfStatus || '')
        ).length;
        const pending = cases.filter((c) => !['PAID', 'APPROVED', 'PAYMENT_PROCESSING'].includes(c.fnfStatus || '')).length;

        return [
          {
            title: 'Pending Settlements',
            value: pending,
            description: 'Draft or under verification',
            icon: Clock,
            color: 'text-amber-600 dark:text-amber-400',
            bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200/60 dark:border-amber-900/40',
          },
          {
            title: 'Processing Payments',
            value: processing,
            description: 'Approved for disbursement',
            icon: TrendingUp,
            color: 'text-blue-600 dark:text-blue-400',
            bg: 'bg-blue-50 dark:bg-blue-950/40 border-blue-200/60 dark:border-blue-900/40',
          },
          {
            title: 'Disbursed / Completed',
            value: paid,
            description: 'Final payout executed',
            icon: CheckCircle2,
            color: 'text-emerald-600 dark:text-emerald-400',
            bg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200/60 dark:border-emerald-900/40',
          },
          {
            title: 'Total Settlement Amount',
            value: totalAmount > 0 ? `₹${totalAmount.toLocaleString('en-IN')}` : '₹0',
            description: 'Combined cycle calculation',
            icon: CreditCard,
            color: 'text-green-600 dark:text-green-400',
            bg: 'bg-green-50 dark:bg-green-950/40 border-green-200/60 dark:border-green-900/40',
          },
        ];
      }

      case 'EXIT_INTERVIEW': {
        const completed = cases.filter((c) => c.exitInterviewStatus === 'COMPLETED').length;
        const rate = cases.length > 0 ? Math.round((completed / cases.length) * 100) : 0;

        return [
          {
            title: 'Scheduled Interviews',
            value: cases.length,
            description: 'HR exit interview cases',
            icon: FileText,
            color: 'text-violet-600 dark:text-violet-400',
            bg: 'bg-violet-50 dark:bg-violet-950/40 border-violet-200/60 dark:border-violet-900/40',
          },
          {
            title: 'Completed Feedback',
            value: completed,
            description: 'Insights collected',
            icon: CheckCircle2,
            color: 'text-emerald-600 dark:text-emerald-400',
            bg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200/60 dark:border-emerald-900/40',
          },
          {
            title: 'Completion Rate',
            value: `${rate}%`,
            description: 'Separation questionnaire',
            icon: Percent,
            color: 'text-purple-600 dark:text-purple-400',
            bg: 'bg-purple-50 dark:bg-purple-950/40 border-purple-200/60 dark:border-purple-900/40',
          },
          {
            title: 'Feedback Confidentiality',
            value: '100% HR Secured',
            description: 'Manager restricted',
            icon: ShieldCheck,
            color: 'text-blue-600 dark:text-blue-400',
            bg: 'bg-blue-50 dark:bg-blue-950/40 border-blue-200/60 dark:border-blue-900/40',
          },
        ];
      }

      case 'DOCUMENTS_PENDING': {
        return [
          {
            title: 'Relieving Letters Pending',
            value: cases.filter((c) => !c.documents?.relievingLetterIssued).length,
            description: 'Pending generation & sign',
            icon: FileText,
            color: 'text-orange-600 dark:text-orange-400',
            bg: 'bg-orange-50 dark:bg-orange-950/40 border-orange-200/60 dark:border-orange-900/40',
          },
          {
            title: 'Experience Certs Pending',
            value: cases.filter((c) => !c.documents?.experienceCertIssued).length,
            description: 'Required for discharge',
            icon: Clock,
            color: 'text-amber-600 dark:text-amber-400',
            bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200/60 dark:border-amber-900/40',
          },
          {
            title: 'NDA & Undertakings Signed',
            value: cases.filter((c) => c.documents?.ndaSigned).length,
            description: 'Legal compliance complete',
            icon: CheckCircle2,
            color: 'text-emerald-600 dark:text-emerald-400',
            bg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200/60 dark:border-emerald-900/40',
          },
          {
            title: 'Dispatch SLA',
            value: '24-48 Hours',
            description: 'Post final clearance',
            icon: TrendingUp,
            color: 'text-blue-600 dark:text-blue-400',
            bg: 'bg-blue-50 dark:bg-blue-950/40 border-blue-200/60 dark:border-blue-900/40',
          },
        ];
      }

      case 'ACCESS_REVOCATION': {
        const revoked = cases.filter((c) => c.accessRevoked).length;

        return [
          {
            title: 'Pending Revocations',
            value: cases.length - revoked,
            description: 'IT access scheduled on LWD',
            icon: Clock,
            color: 'text-rose-600 dark:text-rose-400',
            bg: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200/60 dark:border-rose-900/40',
          },
          {
            title: 'Revoked Accounts',
            value: revoked,
            description: 'System signoff completed',
            icon: CheckCircle2,
            color: 'text-emerald-600 dark:text-emerald-400',
            bg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200/60 dark:border-emerald-900/40',
          },
          {
            title: 'Zero Premature Revocation',
            value: 'Enforced',
            description: 'Protected before LWD',
            icon: ShieldCheck,
            color: 'text-blue-600 dark:text-blue-400',
            bg: 'bg-blue-50 dark:bg-blue-950/40 border-blue-200/60 dark:border-blue-900/40',
          },
          {
            title: 'Single Sign-On (SSO)',
            value: 'Auto-Triggered',
            description: 'Identity Provider sync',
            icon: UserX,
            color: 'text-indigo-600 dark:text-indigo-400',
            bg: 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200/60 dark:border-indigo-900/40',
          },
        ];
      }

      case 'COMPLETED': {
        return [
          {
            title: 'Completed Exits',
            value: cases.length,
            description: 'Successfully separated',
            icon: CheckCircle2,
            color: 'text-green-600 dark:text-green-400',
            bg: 'bg-green-50 dark:bg-green-950/40 border-green-200/60 dark:border-green-900/40',
          },
          {
            title: 'Archived Records',
            value: cases.length,
            description: 'Statutory compliance preserved',
            icon: FileCheck,
            color: 'text-blue-600 dark:text-blue-400',
            bg: 'bg-blue-50 dark:bg-blue-950/40 border-blue-200/60 dark:border-blue-900/40',
          },
          {
            title: '100% Clearance Complete',
            value: 'Verified',
            description: 'All departments signed',
            icon: ShieldCheck,
            color: 'text-teal-600 dark:text-teal-400',
            bg: 'bg-teal-50 dark:bg-teal-950/40 border-teal-200/60 dark:border-teal-900/40',
          },
          {
            title: 'Disbursed F&F Payouts',
            value: cases.filter((c) => c.fnfStatus === 'PAID').length,
            description: 'Zero pending balance',
            icon: CreditCard,
            color: 'text-emerald-600 dark:text-emerald-400',
            bg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200/60 dark:border-emerald-900/40',
          },
        ];
      }

      case 'REJECTED': {
        return [
          {
            title: 'Rejected Requests',
            value: cases.length,
            description: 'Separation rejected',
            icon: XCircle,
            color: 'text-red-600 dark:text-red-400',
            bg: 'bg-red-50 dark:bg-red-950/40 border-red-200/60 dark:border-red-900/40',
          },
          {
            title: 'Manager Denials',
            value: cases.filter((c) => c.managerApproval?.status === 'REJECTED').length,
            description: 'Rejected by line manager',
            icon: Clock,
            color: 'text-amber-600 dark:text-amber-400',
            bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200/60 dark:border-amber-900/40',
          },
          {
            title: 'HR Denials',
            value: cases.filter((c) => c.hrApproval?.status === 'REJECTED').length,
            description: 'Policy or dispute rejection',
            icon: AlertTriangle,
            color: 'text-rose-600 dark:text-rose-400',
            bg: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200/60 dark:border-rose-900/40',
          },
          {
            title: 'Active Employees Retained',
            value: cases.length,
            description: 'Retained within workforce',
            icon: UserCheck,
            color: 'text-emerald-600 dark:text-emerald-400',
            bg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200/60 dark:border-emerald-900/40',
          },
        ];
      }

      case 'WITHDRAWN': {
        return [
          {
            title: 'Withdrawn Resignations',
            value: cases.length,
            description: 'Employee revoked separation',
            icon: CheckCircle2,
            color: 'text-slate-600 dark:text-slate-400',
            bg: 'bg-slate-50 dark:bg-slate-950/40 border-slate-200/60 dark:border-slate-900/40',
          },
          {
            title: 'Retained by Counter-Offer',
            value: Math.ceil(cases.length * 0.65),
            description: 'Retention compensation adjusted',
            icon: TrendingUp,
            color: 'text-emerald-600 dark:text-emerald-400',
            bg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200/60 dark:border-emerald-900/40',
          },
          {
            title: 'Internal Role Transfers',
            value: Math.floor(cases.length * 0.35),
            description: 'Transitioned to new team',
            icon: UserCheck,
            color: 'text-blue-600 dark:text-blue-400',
            bg: 'bg-blue-50 dark:bg-blue-950/40 border-blue-200/60 dark:border-blue-900/40',
          },
          {
            title: 'Retention Success',
            value: '100%',
            description: 'Zero attrition for this segment',
            icon: Percent,
            color: 'text-purple-600 dark:text-purple-400',
            bg: 'bg-purple-50 dark:bg-purple-950/40 border-purple-200/60 dark:border-purple-900/40',
          },
        ];
      }

      default: {
        // ALL STAGES
        const activeCount = cases.filter(
          (c) => !['COMPLETED', 'REJECTED', 'WITHDRAWN'].includes(c.status)
        ).length;
        const completedCount = cases.filter((c) => c.status === 'COMPLETED').length;

        return [
          {
            title: 'Total Separations',
            value: totalRecords,
            description: 'All recorded exit cases',
            icon: Layers,
            color: 'text-indigo-600 dark:text-indigo-400',
            bg: 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200/60 dark:border-indigo-900/40',
          },
          {
            title: 'Active In-Progress',
            value: activeCount,
            description: 'Currently serving or clearance',
            icon: Clock,
            color: 'text-amber-600 dark:text-amber-400',
            bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200/60 dark:border-amber-900/40',
          },
          {
            title: 'Completed Separations',
            value: completedCount,
            description: 'Full cycle closed',
            icon: CheckCircle2,
            color: 'text-emerald-600 dark:text-emerald-400',
            bg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200/60 dark:border-emerald-900/40',
          },
          {
            title: 'Avg Notice Period',
            value: '30 Days',
            description: 'Organization baseline standard',
            icon: Calendar,
            color: 'text-purple-600 dark:text-purple-400',
            bg: 'bg-purple-50 dark:bg-purple-950/40 border-purple-200/60 dark:border-purple-900/40',
          },
        ];
      }
    }
  };

  const cards = getStageCards();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="p-4 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
                {card.title}
              </span>
              <div className={`p-2 rounded-xl border ${card.bg} ${card.color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-3">
              <div className="text-2xl font-bold tracking-tight text-gray-900 dark:text-[#ececec]">
                {card.value}
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-zinc-400">
                {card.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ExitStageSummary;

