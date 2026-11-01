import React, { useTransition } from 'react';
import { useNavigate, useInRouterContext } from 'react-router-dom';
import {
  LogOut,
  Clock,
  ShieldAlert,
  CheckCircle2,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import type { ExitAnalyticsMetrics, ExitStage } from '../types/exit.types';
import { STAGE_CONFIGS } from '../config/stageConfig';

export interface StageKpiCardConfig {
  id: ExitStage | 'ALL';
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bg: string;
  activeBorder: string;
  description: string;
  slug: string;
  routePath: string;
}

export const STAGE_KPI_CONFIGS: StageKpiCardConfig[] = STAGE_CONFIGS.map((c) => ({
  id: c.stage,
  label: c.title,
  icon: c.icon,
  color: c.color,
  bg: c.bg,
  activeBorder: c.activeBorder,
  description: c.shortDescription,
  slug: c.slug,
  routePath: c.routePath,
}));

export interface ExitStatsCardsProps {
  summary?: ExitAnalyticsMetrics;
  stageCounts?: Partial<Record<ExitStage | 'ALL', number>>;
  selectedStage?: ExitStage | 'ALL';
  onSelectStage?: (stage: ExitStage | 'ALL') => void;
  isLoading?: boolean;
  enableNavigation?: boolean;
}

export const ExitStatsCards: React.FC<ExitStatsCardsProps> = ({
  summary,
  stageCounts,
  selectedStage = 'ALL',
  onSelectStage,
  isLoading = false,
  enableNavigation = true,
}) => {
  const inRouter = useInRouterContext();
  const navigate = inRouter ? useNavigate() : undefined;
  const [, startTransition] = useTransition();
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
                onClick={() => {
                  onSelectStage?.(stage.id);
                  if (enableNavigation && navigate) {
                    startTransition(() => {
                      navigate(stage.routePath);
                    });
                  }
                }}
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
