import React from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { Briefcase, CheckSquare, Clock, Users, Target, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const ManagerDashboard: React.FC = () => {
  return (
    <DashboardShell
      title="Department Team & Delivery Workspace"
      subtitle="Supervise direct reports, sign off on shift timesheets, and review sprint progress."
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs uppercase font-semibold">Direct Reports</span>
              <Users className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-white">14 Engineers</div>
            <div className="text-[11px] text-emerald-400">All clocked in today</div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs uppercase font-semibold">Timesheets Awaiting Approval</span>
              <Clock className="w-4 h-4 text-brand-400" />
            </div>
            <div className="text-2xl font-bold text-amber-400">6 Sheets</div>
            <div className="text-[11px] text-slate-400">Due before Friday 5 PM</div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs uppercase font-semibold">Team Delivery KPI</span>
              <Target className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-white">94.2%</div>
            <div className="text-[11px] text-emerald-400">+3.1% vs last sprint</div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs uppercase font-semibold">Pending Approvals</span>
              <CheckSquare className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-bold text-white">3 Requests</div>
            <div className="text-[11px] text-cyan-300">2 Time-off, 1 Hardware req</div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/70 border border-amber-500/30 backdrop-blur-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-300 font-semibold text-sm">
              <Briefcase className="w-4 h-4 text-amber-400" />
              <span>Team Operational Clearance</span>
            </div>
            <Button size="sm" variant="secondary" rightIcon={<ArrowUpRight className="w-3.5 h-3.5" />}>
              Review Approvals Queue
            </Button>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            The Manager role allows you to authorize attendance modifications, review quarterly milestones, and propose compensation adjustments for your direct departmental team.
          </p>
        </div>
      </div>
    </DashboardShell>
  );
};
