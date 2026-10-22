/**
 * @file HrOpsQuickActions.tsx
 * @description Quick trigger bar for high-frequency operational HR workflows:
 * Onboard Hire, Initiate Exit, Verify Document, and Broadcast Announcements.
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UserPlus,
  LogOut,
  FileCheck2,
  Bell,
  Box,
  Users,
  ArrowRight,
} from 'lucide-react';

interface HrOpsQuickActionsProps {
  onAnnouncementClick?: () => void;
  onVerifyDocumentClick?: () => void;
}

export const HrOpsQuickActions: React.FC<HrOpsQuickActionsProps> = ({
  onAnnouncementClick,
  onVerifyDocumentClick,
}) => {
  const navigate = useNavigate();

  const actions = [
    {
      title: 'Onboard Hire',
      subtitle: 'Setup employee profile & checklist',
      icon: UserPlus,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50/70 dark:bg-emerald-950/30 hover:border-emerald-300 dark:hover:border-emerald-800',
      onClick: () => navigate('/dashboard/onboarding'),
    },
    {
      title: 'Initiate Exit',
      subtitle: 'Start clearance & asset handover',
      icon: LogOut,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50/70 dark:bg-amber-950/30 hover:border-amber-300 dark:hover:border-amber-800',
      onClick: () => navigate('/dashboard/exit-management'),
    },
    {
      title: 'Visitor Pass',
      subtitle: 'Pre-register corporate guest',
      icon: Users,
      color: 'text-indigo-600 dark:text-indigo-400',
      bg: 'bg-indigo-50/70 dark:bg-indigo-950/30 hover:border-indigo-300 dark:hover:border-indigo-800',
      onClick: () => navigate('/dashboard/visitors'),
    },
    {
      title: 'Issue Asset',
      subtitle: 'Allocate hardware to employee',
      icon: Box,
      color: 'text-cyan-600 dark:text-cyan-400',
      bg: 'bg-cyan-50/70 dark:bg-cyan-950/30 hover:border-cyan-300 dark:hover:border-cyan-800',
      onClick: () => navigate('/dashboard/asset-management'),
    },
    {
      title: 'Verify Documents',
      subtitle: 'Review pending identity uploads',
      icon: FileCheck2,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50/70 dark:bg-blue-950/30 hover:border-blue-300 dark:hover:border-blue-800',
      onClick: onVerifyDocumentClick || (() => navigate('/settings/documents')),
    },
    {
      title: 'Announcement',
      subtitle: 'Broadcast corporate notification',
      icon: Bell,
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-50/70 dark:bg-purple-950/30 hover:border-purple-300 dark:hover:border-purple-800',
      onClick: onAnnouncementClick || (() => navigate('/settings/notifications')),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400">
          Operational Quick Triggers
        </h3>
        <span className="text-xs text-gray-400 dark:text-zinc-500">
          Fast-track high frequency HR actions
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {actions.map((act, idx) => {
          const Icon = act.icon;
          return (
            <button
              key={idx}
              type="button"
              onClick={act.onClick}
              className={`p-3.5 rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#171717] text-left transition-all hover:shadow-md group flex flex-col justify-between ${act.bg}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 ${act.color} shadow-2xs`}>
                  <Icon className="w-4 h-4" />
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-0.5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900 dark:text-[#ececec] truncate">
                  {act.title}
                </h4>
                <p className="text-[10px] text-gray-500 dark:text-zinc-400 line-clamp-1 mt-0.5">
                  {act.subtitle}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default HrOpsQuickActions;
