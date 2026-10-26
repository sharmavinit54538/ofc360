/**
 * @file WorkforceKpiCards.tsx
 * @description Interactive KPI & Quick Action cards for Workforce Management:
 * 1. Employee (Total employees count & directory link)
 * 2. Manager (Managers count & directory filter)
 * 3. IT Admin (IT Admins count & directory filter)
 * 4. Executive (Executives count & directory filter)
 * 5. Department (Departments count & departments tab link)
 * 6. Org Chart (Organizational chart tree toggle & link)
 *
 * Implements clean modern rounded white cards with pastel circular icon containers,
 * hover elevation, active state ring indicators, responsive flexbox layout, and
 * zero-layout-shift Skeleton fallbacks.
 */

import React from 'react';
import {
  Users,
  Briefcase,
  Laptop,
  Award,
  Building2,
  Network,
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import type { WorkforceStats } from '../types/workforce.types';

export type WorkforceKpiCardId =
  | 'employee'
  | 'manager'
  | 'it_admin'
  | 'executive'
  | 'department'
  | 'orgchart';

export interface WorkforceKpiCardsProps {
  stats?: WorkforceStats;
  departmentsCount?: number;
  totalEmployees?: number;
  activeCard?: WorkforceKpiCardId | string | null;
  onCardClick?: (cardId: WorkforceKpiCardId) => void;
  isLoading?: boolean;
}

interface KpiCardConfig {
  id: WorkforceKpiCardId;
  label: string;
  value: string;
  hint: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
  activeRing: string;
  hoverBorder: string;
}

export const WorkforceKpiCards: React.FC<WorkforceKpiCardsProps> = ({
  stats,
  departmentsCount = 0,
  totalEmployees,
  activeCard,
  onCardClick,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" aria-busy="true">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 shadow-sm flex items-center justify-between gap-4 animate-pulse"
          >
            <div className="space-y-2 flex-1 min-w-0 pr-3">
              <div className="h-3 w-20 bg-gray-200 dark:bg-zinc-800 rounded" />
              <div className="h-7 w-16 bg-gray-300 dark:bg-zinc-700 rounded-md" />
              <div className="h-2.5 w-36 bg-gray-100 dark:bg-zinc-800 rounded" />
            </div>
            <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-zinc-800 shrink-0" />
          </div>
        ))}
      </div>
    );
  }

  const effectiveTotal = totalEmployees ?? stats?.totalHeadcount ?? 0;
  const effectiveDepts = departmentsCount || stats?.departmentsCount || 0;
  const managersCount = stats?.managersCount ?? 0;
  const itAdminsCount = stats?.itAdminsCount ?? 0;
  const executivesCount = stats?.executivesCount ?? 0;

  const cards: KpiCardConfig[] = [
    {
      id: 'employee',
      label: 'Employee',
      value: String(effectiveTotal),
      hint: 'Active company personnel',
      icon: Users,
      iconBg: 'bg-blue-500/10 dark:bg-blue-500/20',
      iconColor: 'text-blue-600 dark:text-blue-400',
      activeRing: 'border-blue-500 ring-2 ring-blue-500/25 bg-blue-50/20 dark:bg-blue-950/20 shadow-md',
      hoverBorder: 'hover:border-blue-400 dark:hover:border-blue-500/60',
    },
    {
      id: 'manager',
      label: 'Manager',
      value: String(managersCount),
      hint: 'Team leads & reporting heads',
      icon: Briefcase,
      iconBg: 'bg-amber-500/10 dark:bg-amber-500/20',
      iconColor: 'text-amber-600 dark:text-amber-400',
      activeRing: 'border-amber-500 ring-2 ring-amber-500/25 bg-amber-50/20 dark:bg-amber-950/20 shadow-md',
      hoverBorder: 'hover:border-amber-400 dark:hover:border-amber-500/60',
    },
    {
      id: 'it_admin',
      label: 'IT Admin',
      value: String(itAdminsCount),
      hint: 'Systems & security operations',
      icon: Laptop,
      iconBg: 'bg-cyan-500/10 dark:bg-cyan-500/20',
      iconColor: 'text-cyan-600 dark:text-cyan-400',
      activeRing: 'border-cyan-500 ring-2 ring-cyan-500/25 bg-cyan-50/20 dark:bg-cyan-950/20 shadow-md',
      hoverBorder: 'hover:border-cyan-400 dark:hover:border-cyan-500/60',
    },
    {
      id: 'executive',
      label: 'Executive',
      value: String(executivesCount),
      hint: 'Directors, VPs & C-Suite',
      icon: Award,
      iconBg: 'bg-purple-500/10 dark:bg-purple-500/20',
      iconColor: 'text-purple-600 dark:text-purple-400',
      activeRing: 'border-purple-500 ring-2 ring-purple-500/25 bg-purple-50/20 dark:bg-purple-950/20 shadow-md',
      hoverBorder: 'hover:border-purple-400 dark:hover:border-purple-500/60',
    },
    {
      id: 'department',
      label: 'Department',
      value: String(effectiveDepts),
      hint: 'Operational business units',
      icon: Building2,
      iconBg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      activeRing: 'border-emerald-500 ring-2 ring-emerald-500/25 bg-emerald-50/20 dark:bg-emerald-950/20 shadow-md',
      hoverBorder: 'hover:border-emerald-400 dark:hover:border-emerald-500/60',
    },
    {
      id: 'orgchart',
      label: 'Org Chart',
      value: 'Hierarchy',
      hint: 'Interactive reporting tree',
      icon: Network,
      iconBg: 'bg-rose-500/10 dark:bg-rose-500/20',
      iconColor: 'text-rose-600 dark:text-rose-400',
      activeRing: 'border-rose-500 ring-2 ring-rose-500/25 bg-rose-50/20 dark:bg-rose-950/20 shadow-md',
      hoverBorder: 'hover:border-rose-400 dark:hover:border-rose-500/60',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const isActive = activeCard === card.id;

        return (
          <div
            key={card.id}
            onClick={() => onCardClick?.(card.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onCardClick?.(card.id);
              }
            }}
            className={cn(
              'p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#171717] border shadow-sm',
              'hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group flex items-center justify-between gap-4',
              isActive
                ? card.activeRing
                : cn('border-gray-200 dark:border-zinc-800', card.hoverBorder)
            )}
          >
            {/* Left side: Label, Bold Count, Subtitle hint */}
            <div className="space-y-1 min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400 truncate">
                  {card.label}
                </h4>
                {isActive && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                    Viewing
                  </span>
                )}
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-[#ececec] tracking-tight">
                {card.value}
              </div>
              <p className="text-[11px] text-gray-500 dark:text-zinc-400 truncate">
                {card.hint}
              </p>
            </div>

            {/* Right side: Icon with soft/pastel circular background */}
            <div
              className={cn(
                'w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105 shadow-2xs',
                card.iconBg,
                card.iconColor
              )}
            >
              <Icon className="w-5 h-5" />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default WorkforceKpiCards;
