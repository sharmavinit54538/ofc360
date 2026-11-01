import React from 'react';
import {
  Settings,
  AlertTriangle,
  Info,
  Shield,
  FileCode,
  Workflow,
  BookOpen,
} from 'lucide-react';
import { Badge } from '@/shared/ui/Badge';

export const ExitSettingsPage: React.FC = () => {
  const pendingRoutes = [
    {
      method: 'GET',
      path: '/api/v1/exits/settings',
      purpose: 'Fetch global exit policies, default notice period rules, and clearance requirements',
    },
    {
      method: 'PUT',
      path: '/api/v1/exits/settings',
      purpose: 'Update organizational notice period thresholds, mandatory departments, and SLA timers',
    },
    {
      method: 'GET',
      path: '/api/v1/exits/settings/templates',
      purpose: 'Retrieve Relieving, Experience, and No-Dues letter templates with dynamic placeholders',
    },
    {
      method: 'POST',
      path: '/api/v1/exits/settings/approval-rules',
      purpose: 'Configure multi-level approval hierarchies for Department Heads and Executive sign-offs',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Settings className="w-5 h-5 text-brand-500" />
            <span>Exit Policies, Workflows &amp; Document Settings</span>
          </h2>
          <p className="text-xs text-gray-500 dark:text-zinc-400">
            Configure organizational offboarding policies, clearance matrices, and letterhead templates.
          </p>
        </div>

        <Badge variant="warning" size="sm" className="font-semibold">
          BACKEND ROUTES PENDING
        </Badge>
      </div>

      {/* Main Unavailable Banner */}
      <div className="p-6 rounded-3xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-amber-900 dark:text-amber-200">
              Exit Management Settings Module Currently Unavailable
            </h3>
            <p className="text-xs text-amber-800 dark:text-amber-300 mt-0.5">
              Backend administrative endpoints for managing separation policies, workflow automation rules, and letter templates are not yet exposed by the OFC360 API.
            </p>
          </div>
        </div>

        <p className="text-xs text-amber-900/80 dark:text-amber-200/80">
          In strict compliance with repository ground rules, no client-side mock settings or optimistic switches are enabled here. Once the backend services are published, this screen will provide configuration controls for:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3.5 rounded-xl bg-white/80 dark:bg-zinc-900/80 border border-amber-200/50 dark:border-amber-900/30">
            <div className="flex items-center gap-2 font-bold text-xs text-gray-900 dark:text-gray-100 mb-1">
              <Shield className="w-4 h-4 text-brand-500" />
              <span>Policy Defaults</span>
            </div>
            <p className="text-[11px] text-gray-500 dark:text-zinc-400">
              Notice period days per job level (30d, 60d, 90d), buyout multipliers, and mandatory clearance checklists.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-white/80 dark:bg-zinc-900/80 border border-amber-200/50 dark:border-amber-900/30">
            <div className="flex items-center gap-2 font-bold text-xs text-gray-900 dark:text-gray-100 mb-1">
              <Workflow className="w-4 h-4 text-indigo-500" />
              <span>Approval Chains</span>
            </div>
            <p className="text-[11px] text-gray-500 dark:text-zinc-400">
              Department Head escalation rules, SLA breach warnings, and auto-approval timeouts.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-white/80 dark:bg-zinc-900/80 border border-amber-200/50 dark:border-amber-900/30">
            <div className="flex items-center gap-2 font-bold text-xs text-gray-900 dark:text-gray-100 mb-1">
              <FileCode className="w-4 h-4 text-emerald-500" />
              <span>Letter Templates</span>
            </div>
            <p className="text-[11px] text-gray-500 dark:text-zinc-400">
              Corporate letterhead, digital signature signatories, and standard Relieving &amp; Experience letter clauses.
            </p>
          </div>
        </div>
      </div>

      {/* Required API Contract List */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 shadow-sm space-y-4">
        <h4 className="text-xs font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-gray-400" />
          <span>Required Backend Routes for Settings Implementation</span>
        </h4>

        <div className="space-y-2">
          {pendingRoutes.map((route, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl border border-gray-100 dark:border-zinc-800 bg-gray-50/70 dark:bg-zinc-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
            >
              <div className="flex items-center gap-2 font-mono">
                <span className="px-2 py-0.5 rounded font-bold bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-900/50">
                  {route.method}
                </span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">{route.path}</span>
              </div>
              <span className="text-gray-500 dark:text-zinc-400 text-[11px] sm:max-w-md">
                {route.purpose}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExitSettingsPage;
