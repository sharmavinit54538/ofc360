import React from 'react';
import { Users, UserCheck, Clock, UserPlus, TrendingDown } from 'lucide-react';
import { SkeletonStatCard } from '@/shared/ui/Skeleton';
import type { WorkforceStats } from '../types/workforce.types';

interface WorkforceKpiCardsProps {
  stats?: WorkforceStats;
  isLoading: boolean;
}

interface KpiCardConfig {
  id: string;
  label: string;
  value: string;
  hint: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
}

export const WorkforceKpiCards: React.FC<WorkforceKpiCardsProps> = ({ stats, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonStatCard key={i} />
        ))}
      </div>
    );
  }

  const attritionRate = Math.max(0, 100 - (stats?.retentionRate ?? 100));

  const cards: KpiCardConfig[] = [
    {
      id: 'headcount',
      label: 'Total Headcount',
      value: String(stats?.totalHeadcount ?? 0),
      hint: `${stats?.workModeSplit?.office ?? 0} office • ${stats?.workModeSplit?.remote ?? 0} remote`,
      icon: Users,
      iconBg: 'bg-blue-500/10 dark:bg-blue-500/20',
      iconColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      id: 'active',
      label: 'Active Employees',
      value: String(stats?.activeEmployees ?? 0),
      hint: 'Currently on rolls',
      icon: UserCheck,
      iconBg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      id: 'probation',
      label: 'On Probation',
      value: String(stats?.onProbationCount ?? 0),
      hint: 'Awaiting confirmation reviews',
      icon: Clock,
      iconBg: 'bg-amber-500/10 dark:bg-amber-500/20',
      iconColor: 'text-amber-600 dark:text-amber-400',
    },
    {
      id: 'new-joiners',
      label: 'New Joiners',
      value: String(stats?.newJoinersThisMonth ?? 0),
      hint: 'Onboarded this month',
      icon: UserPlus,
      iconBg: 'bg-violet-500/10 dark:bg-violet-500/20',
      iconColor: 'text-violet-600 dark:text-violet-400',
    },
    {
      id: 'attrition',
      label: 'Attrition Rate',
      value: `${attritionRate.toFixed(1)}%`,
      hint: `${stats?.exitedThisMonth ?? 0} exits this month`,
      icon: TrendingDown,
      iconBg: 'bg-rose-500/10 dark:bg-rose-500/20',
      iconColor: 'text-rose-600 dark:text-rose-400',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            className="p-4 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase text-gray-500 dark:text-zinc-400 tracking-wider">
                {card.label}
              </span>
              <div className={`p-2 rounded-xl ${card.iconBg} ${card.iconColor}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl font-bold text-gray-900 dark:text-[#ececec] mt-2">
              {card.value}
            </div>
            <p className="text-[11px] text-gray-500 dark:text-zinc-400 mt-0.5">{card.hint}</p>
          </div>
        );
      })}
    </div>
  );
};

export default WorkforceKpiCards;
