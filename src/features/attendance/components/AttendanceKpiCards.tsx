import React from 'react';
import { UserCheck, UserX, Clock, Palmtree, Hourglass, BarChart3 } from 'lucide-react';
import { SkeletonStatCard } from '@/shared/ui/Skeleton';
import type { AttendanceStats } from '../types/attendance.types';

interface AttendanceKpiCardsProps {
  stats?: AttendanceStats;
  isLoading: boolean;
}

const formatNumber = (value?: number): string => {
  if (value === undefined || Number.isNaN(value)) return '0';
  return new Intl.NumberFormat('en-IN').format(value);
};

export const AttendanceKpiCards: React.FC<AttendanceKpiCardsProps> = ({ stats, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonStatCard key={i} />
        ))}
      </div>
    );
  }

  const cards = [
    {
      label: 'Present Today',
      value: formatNumber(stats?.presentToday),
      subtext: `of ${formatNumber(stats?.totalEmployees)} employees`,
      icon: <UserCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
      valueColor: 'text-emerald-600 dark:text-emerald-400',
      iconBg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
    },
    {
      label: 'Absent Today',
      value: formatNumber(stats?.absentToday),
      subtext: 'Uninformed absences',
      icon: <UserX className="w-4 h-4 text-rose-600 dark:text-rose-400" />,
      valueColor: 'text-rose-600 dark:text-rose-400',
      iconBg: 'bg-rose-500/10 dark:bg-rose-500/20',
    },
    {
      label: 'Late Arrivals',
      value: formatNumber(stats?.lateArrivals),
      subtext: 'Beyond grace period',
      icon: <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />,
      valueColor: 'text-amber-600 dark:text-amber-400',
      iconBg: 'bg-amber-500/10 dark:bg-amber-500/20',
    },
    {
      label: 'On Leave',
      value: formatNumber(stats?.onLeaveToday),
      subtext: 'Approved time off',
      icon: <Palmtree className="w-4 h-4 text-blue-600 dark:text-blue-400" />,
      valueColor: 'text-blue-600 dark:text-blue-400',
      iconBg: 'bg-blue-500/10 dark:bg-blue-500/20',
    },
    {
      label: 'Half Day',
      value: formatNumber(stats?.halfDayCount),
      subtext: 'Partial-day shifts',
      icon: <Hourglass className="w-4 h-4 text-violet-600 dark:text-violet-400" />,
      valueColor: 'text-violet-600 dark:text-violet-400',
      iconBg: 'bg-violet-500/10 dark:bg-violet-500/20',
    },
    {
      label: 'Avg Work Hours',
      value: `${stats?.avgWorkHours ?? 0}h`,
      subtext: 'Per employee today',
      icon: <BarChart3 className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />,
      valueColor: 'text-cyan-600 dark:text-cyan-400',
      iconBg: 'bg-cyan-500/10 dark:bg-cyan-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
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

export default AttendanceKpiCards;
