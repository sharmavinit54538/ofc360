/**
 * @file HrOpsHubPage.tsx
 * @description OFC360 HR Operations Landing Page with compact two-tab navigation:
 * 1. Modules (Cards) - Displays existing operational module cards with seamless navigation.
 * 2. Action Queue - Displays the comprehensive operational command queue interface.
 */

import React, { useMemo } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import {
  LayoutDashboard,
  Box,
  Users,
  Receipt,
  Plane,
  UserCheck,
  LogOut,
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { HrOpsPage } from './HrOpsPage';

export type HrOpsTabType = 'cards' | 'queue';

interface HrOpsModuleCard {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  tags: string[];
  gradient: string;
  iconBg: string;
  iconColor: string;
  badge?: string;
}

const HROPS_MODULES: HrOpsModuleCard[] = [
  {
    id: 'hrops-command',
    title: 'Command Center & Queue',
    description: 'Operational dispatch queue, SLA tracking, priority task triggers, and action workflows.',
    icon: LayoutDashboard,
    path: '#queue',
    tags: ['Task Queue', 'SLA Alerts', 'Quick Triggers'],
    gradient: 'from-blue-500/10 via-indigo-500/5 to-transparent',
    iconBg: 'bg-blue-500/10 dark:bg-blue-500/20',
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
  {
    id: 'asset-management',
    title: 'Asset Management',
    description: 'Company hardware, laptops, peripherals, inventory allocation, and equipment return logistics.',
    icon: Box,
    path: '/dashboard/asset-management',
    tags: ['Equipment', 'Hardware', 'Allocation'],
    gradient: 'from-cyan-500/10 via-sky-500/5 to-transparent',
    iconBg: 'bg-cyan-500/10 dark:bg-cyan-500/20',
    iconColor: 'text-cyan-600 dark:text-cyan-400',
  },
  {
    id: 'visitor-management',
    title: 'Visitor Management',
    description: 'Facility check-ins, security badges, pre-registered guest passes, and employee host alerts.',
    icon: Users,
    path: '/dashboard/visitors',
    tags: ['Check-in', 'Security Badges', 'Guest Access'],
    gradient: 'from-emerald-500/10 via-teal-500/5 to-transparent',
    iconBg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    id: 'expense-claims',
    title: 'Expense Claims',
    description: 'Employee reimbursement submissions, receipt validation, multi-tier approvals, and settlement tracking.',
    icon: Receipt,
    path: '/dashboard/expenses',
    tags: ['Reimbursements', 'Receipts', 'Approvals'],
    gradient: 'from-amber-500/10 via-orange-500/5 to-transparent',
    iconBg: 'bg-amber-500/10 dark:bg-amber-500/20',
    iconColor: 'text-amber-600 dark:text-amber-400',
  },
  {
    id: 'travel-requests',
    title: 'Travel Requests',
    description: 'Corporate travel booking workflows, itineraries, hotel/flight requests, and budget approvals.',
    icon: Plane,
    path: '/dashboard/travel',
    tags: ['Business Travel', 'Bookings', 'Itineraries'],
    gradient: 'from-blue-600/10 via-cyan-500/5 to-transparent',
    iconBg: 'bg-blue-600/10 dark:bg-blue-600/20',
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
  {
    id: 'onboarding-checklist',
    title: 'Onboarding Checklist',
    description: 'Automated new-hire orientation, document collection, training completion, and IT provisioning.',
    icon: UserCheck,
    path: '/dashboard/onboarding-checklist',
    tags: ['New Hires', 'Document Upload', 'Provisioning'],
    gradient: 'from-green-500/10 via-emerald-500/5 to-transparent',
    iconBg: 'bg-green-500/10 dark:bg-green-500/20',
    iconColor: 'text-green-600 dark:text-green-400',
  },
  {
    id: 'exit-management',
    title: 'Exit Management',
    description: 'Offboarding clearances, asset recovery handovers, exit interviews, and documentation sign-offs.',
    icon: LogOut,
    path: '/dashboard/exit-management',
    tags: ['Offboarding', 'Asset Recovery', 'Clearances'],
    gradient: 'from-rose-500/10 via-pink-500/5 to-transparent',
    iconBg: 'bg-rose-500/10 dark:bg-rose-500/20',
    iconColor: 'text-rose-600 dark:text-rose-400',
  },
];

export const HrOpsHubPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  // Resolve current active tab from query param or hash, defaulting to 'cards'
  const activeTab = useMemo<HrOpsTabType>(() => {
    const tabParam = searchParams.get('tab')?.toLowerCase();
    if (tabParam === 'queue' || tabParam === 'action-queue' || location.hash === '#queue') {
      return 'queue';
    }
    return 'cards';
  }, [searchParams, location.hash]);

  const handleTabChange = (tab: HrOpsTabType) => {
    const nextParams = new URLSearchParams(searchParams);
    if (tab === 'queue') {
      nextParams.set('tab', 'queue');
    } else {
      nextParams.delete('tab');
    }
    setSearchParams(nextParams, { replace: true });
  };

  const handleCardClick = (module: HrOpsModuleCard) => {
    if (module.path === '#queue' || module.id === 'hrops-command') {
      handleTabChange('queue');
    } else {
      navigate(module.path);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Compact Horizontal Segmented Navigation Tabs */}
      <div className="flex items-center justify-start">
        <div className="inline-flex items-center p-1 rounded-xl bg-slate-900 dark:bg-[#0f172a] border border-slate-800 shadow-md">
          <button
            type="button"
            onClick={() => handleTabChange('cards')}
            className={cn(
              'px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-150 cursor-pointer',
              activeTab === 'cards'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'bg-transparent text-slate-300 dark:text-zinc-400 hover:text-white'
            )}
            aria-selected={activeTab === 'cards'}
            role="tab"
          >
            Modules (Cards)
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('queue')}
            className={cn(
              'px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-150 cursor-pointer',
              activeTab === 'queue'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'bg-transparent text-slate-300 dark:text-zinc-400 hover:text-white'
            )}
            aria-selected={activeTab === 'queue'}
            role="tab"
          >
            Action Queue
          </button>
        </div>
      </div>

      {/* 2. Tab Content Views */}
      {activeTab === 'queue' ? (
        /* Action Queue Content */
        <HrOpsPage />
      ) : (
        /* Modules (Cards) View: ONLY module cards */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {HROPS_MODULES.map((module) => {
            const Icon = module.icon;

            return (
              <div
                key={module.id}
                onClick={() => handleCardClick(module)}
                className={cn(
                  'group relative flex flex-col justify-between rounded-2xl p-5 cursor-pointer min-h-[145px]',
                  'bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-zinc-800',
                  'hover:border-indigo-400 dark:hover:border-indigo-500/60 hover:shadow-lg hover:-translate-y-0.5',
                  'transition-all duration-200 overflow-hidden'
                )}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleCardClick(module);
                  }
                }}
              >
                {/* Subtle top corner gradient */}
                <div
                  className={cn(
                    'absolute top-0 right-0 w-36 h-36 bg-gradient-to-br opacity-80 pointer-events-none rounded-bl-full transition-opacity group-hover:opacity-100',
                    module.gradient
                  )}
                />

                <div className="relative z-10 space-y-3">
                  {/* Module Icon (top-left) */}
                  <div
                    className={cn(
                      'w-11 h-11 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 duration-200',
                      module.iconBg
                    )}
                  >
                    <Icon className={cn('w-5.5 h-5.5', module.iconColor)} />
                  </div>

                  {/* Module Title */}
                  <div>
                    <h3 className="text-base font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {module.title}
                    </h3>
                  </div>
                </div>

                {/* Bottom Footer */}
                <div className="relative z-10 pt-2 flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                  <span>Open Module</span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">&rarr;</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default HrOpsHubPage;
