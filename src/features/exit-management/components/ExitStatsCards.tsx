import React from 'react';
import {
  LogOut,
  Clock,
  ShieldAlert,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Layers,
  FileText,
  UserCheck,
  FileCode,
  CreditCard,
  MessageSquare,
  FileCheck,
  UserX,
  XCircle,
  RotateCcw,
} from 'lucide-react';
import type { ExitAnalyticsMetrics, ExitStage } from '../types/exit.types';

export interface StageKpiCardConfig {
  id: ExitStage | 'ALL';
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bg: string;
  activeBorder: string;
  description: string;
}

export const STAGE_KPI_CONFIGS: StageKpiCardConfig[] = [
  {
    id: 'ALL',
    label: 'All Stages',
    icon: Layers,
    color: 'text-indigo-600 dark:text-indigo-400',
    bg: 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200/60 dark:border-indigo-900/40',
    activeBorder: 'border-indigo-500 ring-2 ring-indigo-500/30 bg-indigo-50/60 dark:bg-indigo-950/40',
    description: 'All separations',
  },
  {
    id: 'RESIGNATION_SUBMITTED',
    label: 'Resignation Submitted',
    icon: FileText,
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-950/40 border-blue-200/60 dark:border-blue-900/40',
    activeBorder: 'border-blue-500 ring-2 ring-blue-500/30 bg-blue-50/60 dark:bg-blue-950/40',
    description: 'Newly submitted',
  },
  {
    id: 'MANAGER_REVIEW',
    label: 'Manager Review',
    icon: Clock,
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200/60 dark:border-amber-900/40',
    activeBorder: 'border-amber-500 ring-2 ring-amber-500/30 bg-amber-50/60 dark:bg-amber-950/40',
    description: 'Awaiting manager',
  },
  {
    id: 'HR_REVIEW',
    label: 'HR Review',
    icon: UserCheck,
    color: 'text-purple-600 dark:text-purple-400',
    bg: 'bg-purple-50 dark:bg-purple-950/40 border-purple-200/60 dark:border-purple-900/40',
    activeBorder: 'border-purple-500 ring-2 ring-purple-500/30 bg-purple-50/60 dark:bg-purple-950/40',
    description: 'HR policy review',
  },
  {
    id: 'NOTICE_PERIOD',
    label: 'Notice Period',
    icon: Calendar,
    color: 'text-sky-600 dark:text-sky-400',
    bg: 'bg-sky-50 dark:bg-sky-950/40 border-sky-200/60 dark:border-sky-900/40',
    activeBorder: 'border-sky-500 ring-2 ring-sky-500/30 bg-sky-50/60 dark:bg-sky-950/40',
    description: 'Serving notice',
  },
  {
    id: 'KNOWLEDGE_TRANSFER',
    label: 'Knowledge Transfer',
    icon: FileCode,
    color: 'text-teal-600 dark:text-teal-400',
    bg: 'bg-teal-50 dark:bg-teal-950/40 border-teal-200/60 dark:border-teal-900/40',
    activeBorder: 'border-teal-500 ring-2 ring-teal-500/30 bg-teal-50/60 dark:bg-teal-950/40',
    description: 'Handover & docs',
  },
  {
    id: 'CLEARANCE_PENDING',
    label: 'Clearance Pending',
    icon: ShieldAlert,
    color: 'text-cyan-600 dark:text-cyan-400',
    bg: 'bg-cyan-50 dark:bg-cyan-950/40 border-cyan-200/60 dark:border-cyan-900/40',
    activeBorder: 'border-cyan-500 ring-2 ring-cyan-500/30 bg-cyan-50/60 dark:bg-cyan-950/40',
    description: '5 depts sign-off',
  },
  {
    id: 'FNF_SETTLEMENT',
    label: 'FnF Settlement',
    icon: CreditCard,
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200/60 dark:border-emerald-900/40',
    activeBorder: 'border-emerald-500 ring-2 ring-emerald-500/30 bg-emerald-50/60 dark:bg-emerald-950/40',
    description: 'Payroll settlement',
  },
  {
    id: 'EXIT_INTERVIEW',
    label: 'Exit Interview',
    icon: MessageSquare,
    color: 'text-violet-600 dark:text-violet-400',
    bg: 'bg-violet-50 dark:bg-violet-950/40 border-violet-200/60 dark:border-violet-900/40',
    activeBorder: 'border-violet-500 ring-2 ring-violet-500/30 bg-violet-50/60 dark:bg-violet-950/40',
    description: 'Exit feedback',
  },
  {
    id: 'DOCUMENTS_PENDING',
    label: 'Documents Pending',
    icon: FileCheck,
    color: 'text-orange-600 dark:text-orange-400',
    bg: 'bg-orange-50 dark:bg-orange-950/40 border-orange-200/60 dark:border-orange-900/40',
    activeBorder: 'border-orange-500 ring-2 ring-orange-500/30 bg-orange-50/60 dark:bg-orange-950/40',
    description: 'Relieving package',
  },
  {
    id: 'ACCESS_REVOCATION',
    label: 'Access Revocation',
    icon: UserX,
    color: 'text-rose-600 dark:text-rose-400',
    bg: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200/60 dark:border-rose-900/40',
    activeBorder: 'border-rose-500 ring-2 ring-rose-500/30 bg-rose-50/60 dark:bg-rose-950/40',
    description: 'IT access revocation',
  },
  {
    id: 'COMPLETED',
    label: 'Completed',
    icon: CheckCircle2,
    color: 'text-green-600 dark:text-green-400',
    bg: 'bg-green-50 dark:bg-green-950/40 border-green-200/60 dark:border-green-900/40',
    activeBorder: 'border-green-500 ring-2 ring-green-500/30 bg-green-50/60 dark:bg-green-950/40',
    description: 'Successfully exited',
  },
  {
    id: 'REJECTED',
    label: 'Rejected',
    icon: XCircle,
    color: 'text-red-600 dark:text-red-400',
    bg: 'bg-red-50 dark:bg-red-950/40 border-red-200/60 dark:border-red-900/40',
    activeBorder: 'border-red-500 ring-2 ring-red-500/30 bg-red-50/60 dark:bg-red-950/40',
    description: 'Separation rejected',
  },
  {
    id: 'WITHDRAWN',
    label: 'Withdrawn',
    icon: RotateCcw,
    color: 'text-slate-600 dark:text-slate-400',
    bg: 'bg-slate-100 dark:bg-zinc-800 border-slate-200 dark:border-zinc-700',
    activeBorder: 'border-slate-500 ring-2 ring-slate-500/30 bg-slate-50/60 dark:bg-zinc-800/60',
    description: 'Request retracted',
  },
];

export interface ExitStatsCardsProps {
  summary?: ExitAnalyticsMetrics;
  stageCounts?: Partial<Record<ExitStage | 'ALL', number>>;
  selectedStage?: ExitStage | 'ALL';
  onSelectStage?: (stage: ExitStage | 'ALL') => void;
  isLoading?: boolean;
}

export const ExitStatsCards: React.FC<ExitStatsCardsProps> = ({
  summary,
  stageCounts,
  selectedStage = 'ALL',
  onSelectStage,
  isLoading = false,
}) => {
  const activeCount = summary?.activeExits ?? (summary as any)?.totalActiveExits ?? 0;
  const pendingMgrCount = summary?.pendingManagerReviews ?? 0;
  const pendingClearancesCount =
    summary?.pendingClearances ?? (summary as any)?.clearancesPending ?? 0;
  const completedCount = summary?.completedThisMonth ?? 0;
  const avgNotice = summary?.averageNoticeDays ?? 30;

  // Top Executive Summary Metrics (Preserved for high-level oversight)
  const executiveCards = [
    {
      title: 'Active Exits',
      value: activeCount,
      icon: LogOut,
      color: 'text-indigo-600 dark:text-indigo-400',
      bg: 'bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200/60 dark:border-indigo-900/30',
      description: 'Total active resignations in progress',
    },
    {
      title: 'Pending Manager Review',
      value: pendingMgrCount,
      icon: Clock,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200/60 dark:border-amber-900/30',
      description: 'Awaiting manager approval & sign-off',
      badge: pendingMgrCount > 0 ? 'Action Required' : undefined,
    },
    {
      title: 'Clearances In Progress',
      value: pendingClearancesCount,
      icon: ShieldAlert,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-950/30 border-blue-200/60 dark:border-blue-900/30',
      description: 'Manager, IT, Finance, Admin, or HR signoffs',
    },
    {
      title: 'Completed Exits',
      value: completedCount,
      icon: CheckCircle2,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200/60 dark:border-emerald-900/30',
      description: 'Successfully exited this cycle',
      extra: avgNotice ? (
        <span className="flex items-center gap-1 text-[11px] text-gray-400">
          <Calendar className="w-3 h-3" /> Avg {avgNotice}d notice
        </span>
      ) : undefined,
    },
  ];

  const getStageCount = (stageId: ExitStage | 'ALL'): number => {
    if (stageCounts && stageCounts[stageId] !== undefined) {
      return stageCounts[stageId]!;
    }
    if (stageId === 'ALL') {
      return summary?.totalExits ?? 0;
    }
    if (stageId === 'MANAGER_REVIEW') {
      return summary?.pendingManagerReviews ?? 0;
    }
    if (stageId === 'HR_REVIEW') {
      return summary?.pendingHrReviews ?? 0;
    }
    if (stageId === 'CLEARANCE_PENDING') {
      return summary?.pendingClearances ?? 0;
    }
    if (stageId === 'FNF_SETTLEMENT') {
      return summary?.pendingFnF ?? 0;
    }
    if (stageId === 'COMPLETED') {
      return summary?.completedThisMonth ?? 0;
    }
    return 0;
  };

  return (
    <div className="space-y-5">
      {/* 1. Top Executive Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {executiveCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-semibold text-gray-500 dark:text-zinc-400 tracking-wider">
                  {card.title}
                </span>
                <div className={`p-2 rounded-xl border ${card.bg} ${card.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="mt-3 flex items-baseline justify-between">
                {isLoading ? (
                  <div className="h-8 w-16 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse" />
                ) : (
                  <div className="text-2xl font-bold tracking-tight text-gray-900 dark:text-[#ececec]">
                    {card.value}
                  </div>
                )}

                {card.badge && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full border border-amber-200/60 dark:border-amber-900/40">
                    <AlertCircle className="w-3 h-3" />
                    {card.badge}
                  </span>
                )}
              </div>

              <div className="mt-1 flex items-center justify-between">
                <p className="text-xs text-gray-500 dark:text-zinc-400 truncate">
                  {card.description}
                </p>
                {card.extra}
              </div>
            </div>
          );
        })}
      </div>

      {/* 2. 14-Stage Separation Workflow KPI Cards */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 shadow-sm">
        {/* 14 Stage KPI Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {STAGE_KPI_CONFIGS.map((stage) => {
            const Icon = stage.icon;
            const count = getStageCount(stage.id);
            const isSelected = selectedStage === stage.id;

            return (
              <button
                key={stage.id}
                type="button"
                onClick={() => onSelectStage?.(stage.id)}
                aria-selected={isSelected}
                className={`p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between group cursor-pointer ${
                  isSelected
                    ? stage.activeBorder
                    : 'bg-gray-50/60 dark:bg-zinc-900/40 border-gray-200/80 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700 hover:bg-white dark:hover:bg-zinc-800/50 hover:shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1.5">
                  <div className={`p-1.5 rounded-lg border ${stage.bg} ${stage.color}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span
                    className={`text-base font-bold tracking-tight ${
                      isSelected
                        ? 'text-brand-600 dark:text-brand-400'
                        : 'text-gray-900 dark:text-[#ececec]'
                    }`}
                  >
                    {isLoading ? '-' : count}
                  </span>
                </div>

                <div className="w-full">
                  <div
                    className={`text-xs font-semibold truncate transition-colors ${
                      isSelected
                        ? 'text-brand-700 dark:text-brand-300'
                        : 'text-gray-800 dark:text-zinc-200 group-hover:text-brand-600 dark:group-hover:text-brand-400'
                    }`}
                    title={stage.label}
                  >
                    {stage.label}
                  </div>
                  <div className="text-[10px] text-gray-400 dark:text-zinc-500 truncate mt-0.5">
                    {stage.description}
                  </div>
                </div>

                {isSelected && (
                  <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-brand-500" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ExitStatsCards;
