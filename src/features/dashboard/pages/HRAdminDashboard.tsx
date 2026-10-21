import React from 'react';
import { DashboardShell } from '@/shared/layout/DashboardShell';
import { Users, DollarSign, Calendar, Award, UserPlus, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/shared/ui/Button';

export const HRAdminDashboard: React.FC = () => {
  return (
    <DashboardShell
      title="HR Administration & Workforce Operations"
      subtitle="Manage employee lifecycles, payroll runs, statutory compliance, and leave queues."
    >
      <div className="space-y-6">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs uppercase font-semibold">Active Staff</span>
              <Users className="w-4 h-4 text-pink-400" />
            </div>
            <div className="text-2xl font-bold text-white">412 Staff</div>
            <div className="text-[11px] text-pink-300">12 onboarded this week</div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs uppercase font-semibold">Payroll Cycle</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-emerald-400">$842,500</div>
            <div className="text-[11px] text-slate-400">Approved for Oct 30 disbursal</div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs uppercase font-semibold">Pending Leave Requests</span>
              <Calendar className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-amber-400">18 Pending</div>
            <div className="text-[11px] text-slate-400">Requires HR endorsement</div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs uppercase font-semibold">Performance Review</span>
              <Award className="w-4 h-4 text-brand-400" />
            </div>
            <div className="text-2xl font-bold text-white">Q3 Cycle</div>
            <div className="text-[11px] text-brand-300">89% completion rate</div>
          </div>
        </div>

        {/* HR Action Center */}
        <div className="p-6 rounded-2xl bg-slate-900/70 border border-pink-500/30 backdrop-blur-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-white">Workforce Quick Dispatch</h3>
              <p className="text-xs text-slate-400">Execute essential HR operations with pre-configured access rights.</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" leftIcon={<FileSpreadsheet className="w-3.5 h-3.5" />}>
                Export Payroll Ledger
              </Button>
              <Button size="sm" variant="primary" leftIcon={<UserPlus className="w-3.5 h-3.5" />}>
                Initiate Onboarding
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
              <div className="text-xs font-semibold text-pink-300 mb-1">Leave Approval Routing</div>
              <p className="text-[11px] text-slate-400">HR Admin role can approve/reject paid time off and medical leaves.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
              <div className="text-xs font-semibold text-pink-300 mb-1">Statutory Benefits & Tax Deductions</div>
              <p className="text-[11px] text-slate-400">Configure corporate 401(k), health insurance, and tax tiers.</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
};
