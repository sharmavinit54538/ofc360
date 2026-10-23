import React from 'react';
import { Palmtree, Clock, CheckCircle2, Users } from 'lucide-react';
import { SkeletonStatCard } from '@/shared/ui/Skeleton';
import type { LeaveStats } from '../types/leave.types';

interface LeaveStatsCardsProps {
  stats?: LeaveStats;
  isLoading: boolean;
}

const formatNumber = (value?: number): string => {
  if (value === undefined || Number.isNaN(value)) return '0';
  return new Intl.NumberFormat('en-IN').format(value);
};

export const LeaveStatsCards: React.FC<LeaveStatsCardsProps> = ({ stats, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <SkeletonStatCard />
        <SkeletonStatCard />
        <SkeletonStatCard />
        <SkeletonStatCard />
      </div>
    );
  }

  const cards = [
    {
      label: 'On Leave Today',
      value: formatNumber(stats?.onLeaveToday),
      subtext: 'Team members away today',
      icon: <Palmtree className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
      valueColor: 'text-emerald-600 dark:text-emerald-400',
      iconBg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
    },
    {
      label: 'Pending Approvals',
      value: formatNumber(stats?.pendingRequests),
      subtext: 'Requests awaiting decision',
      icon: <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />,
      valueColor: 'text-amber-600 dark:text-amber-400',
      iconBg: 'bg-amber-500/10 dark:bg-amber-500/20',
    },
    {
      label: 'Approved This Month',
      value: formatNumber(stats?.approvedThisMonth),
      subtext: 'Requests cleared this cycle',
      icon: <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />,
      valueColor: 'text-blue-600 dark:text-blue-400',
      iconBg: 'bg-blue-500/10 dark:bg-blue-500/20',
    },
    {
      label: 'Team Availability',
      value: `${stats?.teamAvailabilityPercent ?? 0}%`,
      subtext: 'Staff present & available',
      icon: <Users className="w-4 h-4 text-violet-600 dark:text-violet-400" />,
      valueColor: 'text-violet-600 dark:text-violet-400',
      iconBg: 'bg-violet-500/10 dark:bg-violet-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="p-4 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase text-gray-500 dark:text-zinc-400 tracking-wider">
              {card.label}
            </span>
            <div className={`p-2 rounded-xl ${card.iconBg}`}>{card.icon}</div>
          </div>
          <div className={`text-2xl font-bold mt-2 ${card.valueColor}`}>{card.value}</div>
          <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">{card.subtext}</p>
        </div>
      ))}
    </div>
  );
};

export default LeaveStatsCards;
