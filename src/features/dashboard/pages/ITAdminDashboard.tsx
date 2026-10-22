import React from 'react';
import { DashboardShell } from '@/shared/layout/DashboardShell';
import { Server, Laptop, ShieldAlert, Cpu, Key, RefreshCw } from 'lucide-react';
import { Button } from '@/shared/ui/Button';

export const ITAdminDashboard: React.FC = () => {
  return (
    <DashboardShell
      title="IT Infrastructure, Asset & Security Console"
      subtitle="Oversee company hardware provisioning, SSO integrations, endpoint compliance, and firewalls."
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 space-y-2">
            <div className="flex items-center justify-between text-gray-600 dark:text-zinc-400">
              <span className="text-xs uppercase font-semibold">Provisioned Assets</span>
              <Laptop className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-[#ececec]">524 Laptops</div>
            <div className="text-[11px] text-cyan-600 dark:text-cyan-400">98% MDM enrolled</div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 space-y-2">
            <div className="flex items-center justify-between text-gray-600 dark:text-zinc-400">
              <span className="text-xs uppercase font-semibold">Security Incidents</span>
              <ShieldAlert className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">0 Critical</div>
            <div className="text-[11px] text-gray-600 dark:text-zinc-400">3 minor login blocks</div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 space-y-2">
            <div className="flex items-center justify-between text-gray-600 dark:text-zinc-400">
              <span className="text-xs uppercase font-semibold">SSO Directory Sync</span>
              <Key className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-[#ececec]">Google Workspace</div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400">Synced 4 mins ago</div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 space-y-2">
            <div className="flex items-center justify-between text-gray-600 dark:text-zinc-400">
              <span className="text-xs uppercase font-semibold">Cloud Infrastructure</span>
              <Cpu className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-[#ececec]">Healthy</div>
            <div className="text-[11px] text-gray-600 dark:text-zinc-400">Kubernetes Cluster v1.30</div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-[#171717] border border-cyan-200 dark:border-cyan-900/30 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-semibold text-sm">
              <Server className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span>IT Systems & Hardware Dispatch</span>
            </div>
            <Button size="sm" variant="outline" leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>
              Force Directory Resync
            </Button>
          </div>
          <p className="text-xs text-gray-600 dark:text-zinc-400 leading-relaxed">
            The IT Admin role permits configuring SAML / OAuth 2.0 Identity Providers, rotating zero-trust certificates, managing asset registries, and revoking lost devices.
          </p>
        </div>
      </div>
    </DashboardShell>
  );
};
