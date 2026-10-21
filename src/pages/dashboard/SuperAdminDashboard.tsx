import React from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { Shield, Server, Users, Activity, Lock, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { RoleGuard } from '@/components/auth/RoleGuard';

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
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs uppercase font-semibold">Total Tenants</span>
              <Server className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-white">128</div>
            <div className="text-[11px] text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>100% compliant & isolated</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs uppercase font-semibold">Active User Base</span>
              <Users className="w-4 h-4 text-brand-400" />
            </div>
            <div className="text-2xl font-bold text-white">45,820</div>
            <div className="text-[11px] text-brand-300">+1,420 joined this month</div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs uppercase font-semibold">Security Posture</span>
              <Shield className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-emerald-400">A+ SOC2</div>
            <div className="text-[11px] text-slate-400">Zero vulnerability alerts</div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs uppercase font-semibold">API Gateway Throughput</span>
              <Activity className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-bold text-white">1.8M / hr</div>
            <div className="text-[11px] text-slate-400">Avg latency 18ms</div>
          </div>
        </div>

        {/* Super Admin Privileged Panel */}
        <div className="p-6 rounded-2xl bg-slate-900/70 border border-purple-500/30 backdrop-blur-sm space-y-4">
          <div className="flex items-center gap-2.5 text-purple-300 font-semibold text-sm">
            <Lock className="w-4 h-4 text-purple-400" />
            <span>Privileged Super Admin RBAC Operations</span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            As a Super Admin, your account ({user?.email}) possesses overarching clearance to configure tenant isolation policies, cryptographic keys, and master audit streams.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
              <div className="text-xs font-semibold text-white">Role Delegation Matrix</div>
              <p className="text-[11px] text-slate-400">Assign & revoke roles for any user across organizations.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
              <div className="text-xs font-semibold text-white">Master Encryption Keys</div>
              <p className="text-[11px] text-slate-400">Rotate AES-256 tenant envelope keys and database secrets.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
              <div className="text-xs font-semibold text-white">Zero-Trust Audit Stream</div>
              <p className="text-[11px] text-slate-400">Inspect real-time authentication logs and anomaly detections.</p>
            </div>
          </div>
        </div>

        {/* Component-level RoleGuard demonstration */}
        <RoleGuard
          allowedRoles={['SUPER_ADMIN']}
          fallback={<div className="text-xs text-rose-400">Access Restricted</div>}
        >
          <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/20 text-xs text-purple-200 flex items-center justify-between">
            <span>Verified: Protected by Component-level &lt;RoleGuard allowedRoles={['SUPER_ADMIN']} /&gt;</span>
            <span className="font-mono text-[10px] bg-purple-900/60 px-2 py-0.5 rounded">CLEARED</span>
          </div>
        </RoleGuard>
      </div>
    </DashboardShell>
  );
};
