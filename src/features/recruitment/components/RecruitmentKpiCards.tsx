import React from 'react';
import { Briefcase, FileText, Workflow, CalendarDays, BadgeCheck } from 'lucide-react';
import { SkeletonStatCard } from '@/shared/ui/Skeleton';
import type { RecruitmentStats } from '../types/recruitment.types';

interface RecruitmentKpiCardsProps {
  stats?: RecruitmentStats;
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

export const RecruitmentKpiCards: React.FC<RecruitmentKpiCardsProps> = ({ stats, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonStatCard key={i} />
        ))}
      </div>
    );
  }

  const cards: KpiCardConfig[] = [
    {
      id: 'open-positions',
      label: 'Open Positions',
      value: String(stats?.openPositions ?? 0),
      hint: `${stats?.avgTimeToHireDays ?? 0}d avg time to hire`,
      icon: Briefcase,
      iconBg: 'bg-blue-500/10',
      iconColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      id: 'total-candidates',
      label: 'Total Candidates',
      value: String(stats?.totalApplications ?? 0),
      hint: 'Applications received',
      icon: FileText,
      iconBg: 'bg-violet-500/10',
      iconColor: 'text-violet-600 dark:text-violet-400',
    },
    {
      id: 'active-pipeline',
      label: 'Active Pipeline',
      value: String(stats?.activePipelineCandidates ?? 0),
      hint: 'In-progress candidates',
      icon: Workflow,
      iconBg: 'bg-amber-500/10',
      iconColor: 'text-amber-600 dark:text-amber-400',
    },
    {
      id: 'interviews-week',
      label: 'Interviews Scheduled',
      value: String(stats?.interviewsThisWeek ?? 0),
      hint: 'Happening this week',
      icon: CalendarDays,
      iconBg: 'bg-sky-500/10',
      iconColor: 'text-sky-600 dark:text-sky-400',
    },
    {
      id: 'offers-accepted',
      label: 'Offers Accepted',
      value: String(stats?.offersAcceptedThisMonth ?? 0),
      hint: 'This month',
      icon: BadgeCheck,
      iconBg: 'bg-emerald-500/10',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            className="rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#171717] p-4 shadow-sm"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-[11px] uppercase font-semibold text-gray-500 dark:text-zinc-400 tracking-wider truncate">
                {card.label}
              </p>
              <div className={`w-8 h-8 rounded-lg ${card.iconBg} flex items-center justify-center shrink-0`}>
                <Icon className={`w-4 h-4 ${card.iconColor}`} />
              </div>
            </div>
            <p className="mt-2 text-2xl font-extrabold text-gray-900 dark:text-[#ececec]">{card.value}</p>
            <p className="text-[11px] text-gray-500 dark:text-zinc-400 mt-0.5">{card.hint}</p>
          </div>
        );
      })}
    </div>
  );
};

export default RecruitmentKpiCards;
