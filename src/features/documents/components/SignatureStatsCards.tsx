/**
 * @file SignatureStatsCards.tsx
 * @description KPI metric cards for Digital Signatures Overview with responsive design,
 * dark mode support, and loading skeletons.
 */

import React from 'react';
import {
  FileSignature,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Timer,
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { Skeleton } from '@/shared/ui/Skeleton';
import type { SignatureStats } from '../types/signatures.types';

export interface SignatureStatsCardsProps {
  stats?: SignatureStats;
  isLoading?: boolean;
  onCardClick?: (filterType: string) => void;
  activeFilter?: string;
}

export const SignatureStatsCards: React.FC<SignatureStatsCardsProps> = ({
  stats,
  isLoading = false,
  onCardClick,
  activeFilter,
}) => {
  const cards = [
    {
      id: 'awaiting_me',
      title: 'Awaiting My Signature',
      value: stats?.awaitingMySignature ?? 0,
      icon: FileSignature,
      color: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-500/10 dark:bg-amber-500/20',
      borderColor: 'border-amber-200 dark:border-amber-900/40',
      description: 'Requires your direct action',
    },
    {
      id: 'waiting_others',
      title: 'Waiting on Others',
      value: stats?.waitingOnOthers ?? 0,
      icon: Clock,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-500/10 dark:bg-blue-500/20',
      borderColor: 'border-blue-200 dark:border-blue-900/40',
      description: 'Dispatched to other signers',
    },
    {
      id: 'completed',
      title: 'Completed (Last 30d)',
      value: stats?.completedLast30Days ?? 0,
      icon: CheckCircle2,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-500/10 dark:bg-emerald-500/20',
      borderColor: 'border-emerald-200 dark:border-emerald-900/40',
      description: 'Fully executed & certified',
    },
    {
      id: 'expiring_soon',
      title: 'Expiring Soon (≤3d)',
      value: stats?.expiringSoon ?? 0,
      icon: AlertTriangle,
      color: 'text-rose-600 dark:text-rose-400',
      bgColor: 'bg-rose-500/10 dark:bg-rose-500/20',
      borderColor: 'border-rose-200 dark:border-rose-900/40',
      description: 'Needs urgent reminder',
    },
    {
      id: 'declined_expired',
      title: 'Declined / Expired',
      value: (stats?.declined ?? 0) + (stats?.expired ?? 0),
      icon: XCircle,
      color: 'text-slate-600 dark:text-zinc-400',
      bgColor: 'bg-slate-500/10 dark:bg-zinc-800',
      borderColor: 'border-slate-200 dark:border-zinc-800',
      description: `${stats?.declined ?? 0} declined, ${stats?.expired ?? 0} expired`,
    },
    {
      id: 'turnaround',
      title: 'Avg. Turnaround',
      value: `${stats?.avgTurnaroundHours ?? 0}h`,
      icon: Timer,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-500/10 dark:bg-purple-500/20',
      borderColor: 'border-purple-200 dark:border-purple-900/40',
      description: 'Dispatched to completion',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const isActive = activeFilter === card.id;

        return (
          <div
            key={card.id}
            onClick={() => onCardClick?.(card.id)}
            role={onCardClick ? 'button' : undefined}
            tabIndex={onCardClick ? 0 : undefined}
            onKeyDown={(e) => {
              if (onCardClick && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                onCardClick(card.id);
              }
            }}
            className={cn(
              'p-4 rounded-2xl bg-white dark:bg-[#1a1a1a] border transition-all duration-200 flex flex-col justify-between select-none',
              card.borderColor,
              onCardClick && 'cursor-pointer hover:-translate-y-0.5 hover:shadow-md',
              isActive && 'ring-2 ring-indigo-500 shadow-md'
            )}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-slate-500 dark:text-zinc-400 line-clamp-1">
                {card.title}
              </span>
              <div className={cn('w-8 h-8 rounded-xl flex items-center justify-center shrink-0', card.bgColor)}>
                <Icon className={cn('w-4 h-4', card.color)} />
              </div>
            </div>

            <div className="mt-3">
              {isLoading ? (
                <Skeleton className="h-7 w-16 rounded-md" />
              ) : (
                <span className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white block">
                  {card.value}
                </span>
              )}
              <span className="text-[11px] text-slate-400 dark:text-zinc-500 mt-1 block truncate">
                {card.description}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SignatureStatsCards;

