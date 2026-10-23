import React from 'react';
import { Star, CheckCircle2, Clock, Target, AlertOctagon } from 'lucide-react';
import { SkeletonStatCard } from '@/shared/ui/Skeleton';
import type { PerformanceStats } from '../types/performance.types';

interface PerformanceKpiCardsProps {
  stats?: PerformanceStats;
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

export const PerformanceKpiCards: React.FC<PerformanceKpiCardsProps> = ({ stats, isLoading }) => {
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
      id: 'avg-rating',
      label: 'Average Rating',
      value: `${(stats?.averageRating ?? 0).toFixed(1)} / 5`,
      hint: 'Across completed appraisals',
      icon: Star,
      iconBg: 'bg-amber-500/10 dark:bg-amber-500/20',
      iconColor: 'text-amber-600 dark:text-amber-400',
    },
    {
      id: 'reviews-done',
      label: 'Reviews Completed',
      value: String(stats?.completedReviews ?? 0),
      hint: `of ${stats?.totalReviews ?? 0} assigned`,
      icon: CheckCircle2,
      iconBg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      id: 'reviews-pending',
      label: 'Pending Reviews',
      value: String(stats?.pendingReviews ?? 0),
      hint: 'Awaiting self / manager signoff',
      icon: Clock,
      iconBg: 'bg-indigo-500/10 dark:bg-indigo-500/20',
      iconColor: 'text-indigo-600 dark:text-indigo-400',
    },
    {
      id: 'goals-on-track',
      label: 'Goals On Track',
      value: `${Math.round(stats?.goalsOnTrackPercentage ?? 0)}%`,
      hint: 'Objectives at healthy progress',
      icon: Target,
      iconBg: 'bg-cyan-500/10 dark:bg-cyan-500/20',
      iconColor: 'text-cyan-600 dark:text-cyan-400',
    },
    {
      id: 'active-pips',
      label: 'Active PIPs',
      value: String(stats?.activePips ?? 0),
      hint: 'Improvement plans in review',
      icon: AlertOctagon,
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

export default PerformanceKpiCards;
