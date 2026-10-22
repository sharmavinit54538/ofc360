import React from 'react';
import { DashboardShell } from '@/shared/layout/DashboardShell';
import { Shield, Server, Users, Activity, Lock, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { RoleGuard } from '@/features/auth/components/RoleGuard';

export const SuperAdminDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <DashboardShell
      title="Super Administrator Command Center"
      subtitle="Highest-tier system clearance — Global Multi-Tenant & Security Administration."
    >
      <div className="space-y-6">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 space-y-2">
            <div className="flex items-center justify-between text-gray-600 dark:text-zinc-400">
              <span className="text-xs uppercase font-semibold">Total Tenants</span>
              <Server className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-[#ececec]">128</div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>100% compliant & isolated</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 space-y-2">
            <div className="flex items-center justify-between text-gray-600 dark:text-zinc-400">
              <span className="text-xs uppercase font-semibold">Active User Base</span>
              <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-[#ececec]">45,820</div>
            <div className="text-[11px] text-indigo-600 dark:text-indigo-400">+1,420 joined this month</div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 space-y-2">
            <div className="flex items-center justify-between text-gray-600 dark:text-zinc-400">
              <span className="text-xs uppercase font-semibold">Security Posture</span>
              <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">A+ SOC2</div>
            <div className="text-[11px] text-gray-600 dark:text-zinc-400">Zero vulnerability alerts</div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 space-y-2">
            <div className="flex items-center justify-between text-gray-600 dark:text-zinc-400">
              <span className="text-xs uppercase font-semibold">API Gateway Throughput</span>
              <Activity className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-[#ececec]">1.8M / hr</div>
            <div className="text-[11px] text-gray-600 dark:text-zinc-400">Avg latency 18ms</div>
          </div>
        </div>

        {/* Super Admin Privileged Panel */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#171717] border border-purple-200 dark:border-purple-900/30 space-y-4">
          <div className="flex items-center gap-2.5 text-purple-600 dark:text-purple-400 font-semibold text-sm">
            <Lock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span>Privileged Super Admin RBAC Operations</span>
          </div>

          <p className="text-xs text-gray-600 dark:text-zinc-400 leading-relaxed">
            As a Super Admin, your account ({user?.email}) possesses overarching clearance to configure tenant isolation policies, cryptographic keys, and master audit streams.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            <div className="p-4 rounded-xl bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 space-y-1">
              <div className="text-xs font-semibold text-gray-900 dark:text-[#ececec]">Role Delegation Matrix</div>
              <p className="text-[11px] text-gray-600 dark:text-zinc-400">Assign & revoke roles for any user across organizations.</p>
            </div>
            <div className="p-4 rounded-xl bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 space-y-1">
              <div className="text-xs font-semibold text-gray-900 dark:text-[#ececec]">Master Encryption Keys</div>
              <p className="text-[11px] text-gray-600 dark:text-zinc-400">Rotate AES-256 tenant envelope keys and database secrets.</p>
            </div>
            <div className="p-4 rounded-xl bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 space-y-1">
              <div className="text-xs font-semibold text-gray-900 dark:text-[#ececec]">Zero-Trust Audit Stream</div>
              <p className="text-[11px] text-gray-600 dark:text-zinc-400">Inspect real-time authentication logs and anomaly detections.</p>
            </div>
          </div>
        </div>

        {/* Component-level RoleGuard demonstration */}
        <RoleGuard
          allowedRoles={['SUPER_ADMIN']}
          fallback={<div className="text-xs text-rose-600 dark:text-rose-400">Access Restricted</div>}
        >
          <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/30 text-xs text-purple-700 dark:text-purple-300 flex items-center justify-between">
            <span>Verified: Protected by Component-level RoleGuard (SUPER_ADMIN)</span>
            <span className="font-mono text-[10px] bg-purple-100 dark:bg-purple-900/60 px-2 py-0.5 rounded">CLEARED</span>
          </div>
        </RoleGuard>
      </div>
    </DashboardShell>
  );
};
