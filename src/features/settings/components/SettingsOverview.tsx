import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Search,
  Sparkles,
  HelpCircle,
  ExternalLink,
  Building2,
  CalendarDays,
  ShieldCheck,
  Bell,
} from 'lucide-react';
import { useAppSelector } from '@/app/hooks';
import { cn } from '@/shared/lib/utils';
import { Skeleton } from '@/shared/ui/Skeleton';
import type { SettingCategory } from '@/features/settings/types/settings.types';
import {
  useGetCompanySettingsQuery,
  useGetLeaveSettingsQuery,
  useGetRolesPermissionsQuery,
  useGetNotificationsSettingsQuery,
} from '../api/settingsApi';
import { SETTINGS_SECTIONS } from './SettingsLayout';

interface SettingsCardMeta {
  tags: string[];
  gradient: string;
  iconBg: string;
  iconColor: string;
  badge?: string;
}

const SETTINGS_META: Record<SettingCategory, SettingsCardMeta> = {
  company: {
    tags: ['Organization', 'Branding', 'Timezone', 'Currency'],
    gradient: 'from-blue-500/10 via-indigo-500/5 to-transparent',
    iconBg: 'bg-blue-500/10 dark:bg-blue-500/20',
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
  employees: {
    tags: ['ID Formats', 'Role Defaults', 'Visibility Rules'],
    gradient: 'from-violet-500/10 via-purple-500/5 to-transparent',
    iconBg: 'bg-violet-500/10 dark:bg-violet-500/20',
    iconColor: 'text-violet-600 dark:text-violet-400',
  },
  attendance: {
    tags: ['Shift Timings', 'Grace Periods', 'Geofencing', 'IP Rules'],
    gradient: 'from-emerald-500/10 via-teal-500/5 to-transparent',
    iconBg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
  },
  leave: {
    tags: ['Leave Types', 'Accruals', 'Carry-Forward', 'Workflows'],
    gradient: 'from-amber-500/10 via-orange-500/5 to-transparent',
    iconBg: 'bg-amber-500/10 dark:bg-amber-500/20',
    iconColor: 'text-amber-600 dark:text-amber-400',
  },
  payroll: {
    tags: ['Salary Components', 'Statutory Rules', 'Pay Cycles'],
    gradient: 'from-green-500/10 via-emerald-500/5 to-transparent',
    iconBg: 'bg-green-500/10 dark:bg-green-500/20',
    iconColor: 'text-green-600 dark:text-green-400',
  },
  documents: {
    tags: ['Letter Templates', 'Digital Signatures', 'Storage'],
    gradient: 'from-cyan-500/10 via-sky-500/5 to-transparent',
    iconBg: 'bg-cyan-500/10 dark:bg-cyan-500/20',
    iconColor: 'text-cyan-600 dark:text-cyan-400',
  },
  assets: {
    tags: ['Categories', 'Tag Prefixes', 'Allocation Rules'],
    gradient: 'from-indigo-500/10 via-blue-500/5 to-transparent',
    iconBg: 'bg-indigo-500/10 dark:bg-indigo-500/20',
    iconColor: 'text-indigo-600 dark:text-indigo-400',
  },
  notifications: {
    tags: ['Email & SMS', 'In-App Alerts', 'Event Toggles'],
    gradient: 'from-rose-500/10 via-pink-500/5 to-transparent',
    iconBg: 'bg-rose-500/10 dark:bg-rose-500/20',
    iconColor: 'text-rose-600 dark:text-rose-400',
  },
  profile: {
    tags: ['Password', '2FA', 'Passkeys', 'Active Sessions'],
    gradient: 'from-purple-500/10 via-fuchsia-500/5 to-transparent',
    iconBg: 'bg-purple-500/10 dark:bg-purple-500/20',
    iconColor: 'text-purple-600 dark:text-purple-400',
  },
};

export const SettingsOverview: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const user = useAppSelector((state) => state.auth.user);
  const userPermissions = useMemo(() => user?.permissions || [], [user?.permissions]);

  // Live configuration status across settings domains
  const { data: companySettings, isLoading: companyLoading } = useGetCompanySettingsQuery();
  const { data: leaveSettings, isLoading: leaveLoading } = useGetLeaveSettingsQuery();
  const { data: roles, isLoading: rolesLoading } = useGetRolesPermissionsQuery();
  const { data: notificationsSettings, isLoading: notificationsLoading } = useGetNotificationsSettingsQuery();

  const statusTiles = useMemo(() => {
    const enabledChannels = (notificationsSettings?.channels || []).filter((c) => c.enabled).length;
    const totalChannels = notificationsSettings?.channels?.length ?? 0;
    return [
      {
        id: 'organization',
        label: 'Organization',
        value: companySettings?.details?.displayName || 'Not configured',
        hint: companySettings?.timezone
          ? `${companySettings.timezone} • ${companySettings.currency}`
          : 'Timezone & currency pending',
        icon: Building2,
        isLoading: companyLoading,
      },
      {
        id: 'leave-policies',
        label: 'Leave Policies',
        value: `${leaveSettings?.leaveTypes?.length ?? 0}`,
        hint: 'Configured leave types',
        icon: CalendarDays,
        isLoading: leaveLoading,
      },
      {
        id: 'roles',
        label: 'RBAC Roles',
        value: `${roles?.length ?? 0}`,
        hint: 'Roles synced from RBAC service',
        icon: ShieldCheck,
        isLoading: rolesLoading,
      },
      {
        id: 'channels',
        label: 'Notification Channels',
        value: `${enabledChannels}/${totalChannels}`,
        hint: 'Channels enabled',
        icon: Bell,
        isLoading: notificationsLoading,
      },
    ];
  }, [companySettings, leaveSettings, roles, notificationsSettings, companyLoading, leaveLoading, rolesLoading, notificationsLoading]);

  // Filter sections by permissions and search query
  const visibleSections = useMemo(() => {
    return SETTINGS_SECTIONS.filter((section) => {
      // Permission check
      if (section.requiredPermissions.length > 0) {
        const hasAccess = section.requiredPermissions.some((perm) =>
          userPermissions.includes(perm as any)
        );
        if (!hasAccess) return false;
      }

      // Search query check
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const meta = SETTINGS_META[section.id];
      return (
        section.label.toLowerCase().includes(q) ||
        section.description.toLowerCase().includes(q) ||
        meta?.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    });
  }, [userPermissions, searchQuery]);

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-6 md:p-8 shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.15),transparent_50%)]" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur border border-white/10 text-xs font-medium text-indigo-200">
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
              <span>Organization & System Control Center</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Settings & Configuration
            </h1>
            <p className="text-sm md:text-base text-slate-300">
              Configure your organization profile, workforce rules, attendance policies, payroll parameters, and security settings.
            </p>
          </div>

          {/* Quick Search */}
          <div className="relative w-full md:w-80 shrink-0">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search settings (e.g. shifts, 2FA, salary)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/10 border border-white/15 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white/15 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Live Configuration Status */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statusTiles.map((tile) => {
          const Icon = tile.icon;
          return (
            <div
              key={tile.id}
              className="p-4 rounded-2xl bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-zinc-800 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase text-slate-500 dark:text-zinc-400 tracking-wider">
                  {tile.label}
                </span>
                <div className="p-1.5 rounded-lg bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>
              {tile.isLoading ? (
                <div className="mt-2 space-y-1.5">
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              ) : (
                <>
                  <div className="text-lg font-bold text-slate-900 dark:text-white mt-1.5 truncate">
                    {tile.value}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5 truncate">{tile.hint}</p>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Grid of Setting Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {visibleSections.map((section) => {
          const Icon = section.icon;
          const meta = SETTINGS_META[section.id];

          return (
            <div
              key={section.id}
              onClick={() => navigate(`/settings/${section.id}`)}
              className={cn(
                'group relative flex flex-col justify-between rounded-2xl p-6 cursor-pointer',
                'bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-zinc-800',
                'hover:border-indigo-400 dark:hover:border-indigo-500/60 hover:shadow-xl hover:-translate-y-0.5',
                'transition-all duration-200 overflow-hidden'
              )}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  navigate(`/settings/${section.id}`);
                }
              }}
            >
              {/* Subtle top corner gradient */}
              <div
                className={cn(
                  'absolute top-0 right-0 w-44 h-44 bg-gradient-to-br opacity-80 pointer-events-none rounded-bl-full transition-opacity group-hover:opacity-100',
                  meta?.gradient
                )}
              />

              <div className="relative z-10 space-y-4">
                {/* Icon & Action Arrow */}
                <div className="flex items-center justify-between">
                  <div
                    className={cn(
                      'w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 duration-200',
                      meta?.iconBg
                    )}
                  >
                    <Icon className={cn('w-6 h-6', meta?.iconColor)} />
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-slate-400 dark:text-zinc-500 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-200">
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 duration-200" />
                  </div>
                </div>

                {/* Section Title & Description */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {section.label}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1.5 line-clamp-2 leading-relaxed">
                    {section.description}
                  </p>
                </div>

                {/* Feature Tags / Pills */}
                {meta?.tags && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {meta.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-block px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-zinc-800/80 text-slate-600 dark:text-zinc-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom Card Footer */}
              <div className="relative z-10 pt-4 mt-4 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                <span>Configure {section.label}</span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity">Open &rarr;</span>
              </div>
            </div>
          );
        })}
      </div>

      {visibleSections.length === 0 && (
        <div className="text-center py-16 bg-white dark:bg-[#1a1a1a] rounded-2xl border border-slate-200 dark:border-zinc-800">
          <Search className="w-10 h-10 text-slate-400 dark:text-zinc-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            No settings match &ldquo;{searchQuery}&rdquo;
          </h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
            Try searching for another keyword like &quot;shift&quot;, &quot;salary&quot;, &quot;leave&quot;, or &quot;2FA&quot;.
          </p>
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="mt-4 px-4 py-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-medium hover:bg-indigo-100 transition-colors"
          >
            Clear Search Filter
          </button>
        </div>
      )}

      {/* Need Help / Documentation Card */}
      <div className="p-5 rounded-2xl bg-slate-100 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white dark:bg-zinc-800 flex items-center justify-center text-slate-600 dark:text-zinc-300 shadow-sm shrink-0">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
              Need help configuring settings?
            </h4>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Read comprehensive documentation for enterprise configuration, API integrations, and policies.
            </p>
          </div>
        </div>
        <a
          href="/docs/settings"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 text-xs font-semibold border border-slate-200 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-700/80 transition-all shrink-0 shadow-sm"
        >
          <span>View documentation</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};

export default SettingsOverview;
