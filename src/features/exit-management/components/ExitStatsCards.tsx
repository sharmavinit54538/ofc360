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
import { StageKpiCard } from './StageKpiCard';

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

const STAGE_THEME_COLOR: Record<ExitStage | 'ALL', StageKpiCardProps['color']> = {
  ALL: 'indigo',
  RESIGNATION_SUBMITTED: 'blue',
  MANAGER_REVIEW: 'amber',
  HR_REVIEW: 'purple',
  NOTICE_PERIOD: 'sky',
  KNOWLEDGE_TRANSFER: 'emerald',
  CLEARANCE_PENDING: 'cyan',
  FNF_SETTLEMENT: 'green',
  EXIT_INTERVIEW: 'violet',
  DOCUMENTS_PENDING: 'orange',
  ACCESS_REVOCATION: 'rose',
  COMPLETED: 'green',
  REJECTED: 'red',
  WITHDRAWN: 'slate',
};

import type { StageKpiCardProps } from './StageKpiCard';

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

  const handleStageClick = (stageId: ExitStage | 'ALL', routePath: string) => {
    onSelectStage?.(stageId);
    if (enableNavigation && navigate) {
      startTransition(() => {
        navigate(routePath);
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* 1. Top Executive Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {executiveCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="p-4 rounded-xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.2)] transition-all hover:shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-semibold text-gray-500 dark:text-zinc-400 tracking-wider">
                  {card.title}
                </span>
                <div className={`p-2 rounded-xl border ${card.bg} ${card.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="mt-2.5 flex items-baseline justify-between">
                {isLoading ? (
                  <div className="h-7 w-14 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse" />
                ) : (
                  <div className="text-xl font-bold tracking-tight text-gray-900 dark:text-[#ececec]">
                    {card.value}
                  </div>
                )}

                {card.badge && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded-full border border-amber-200/60 dark:border-amber-900/40">
                    <AlertCircle className="w-2.5 h-2.5" />
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

      {/* 2. 14-Stage Separation Workflow KPI Cards - Compact Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3">
        {STAGE_KPI_CONFIGS.map((stage) => {
          const Icon = stage.icon;
          const count = getStageCount(stage.id);
          const isSelected = selectedStage === stage.id;
          const themeColor = STAGE_THEME_COLOR[stage.id];

          return (
            <StageKpiCard
              key={stage.id}
              icon={Icon}
              title={stage.label}
              count={isLoading ? 0 : count}
              color={themeColor}
              active={isSelected}
              onClick={() => handleStageClick(stage.id, stage.routePath)}
              aria-pressed={isSelected}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ExitStatsCards;