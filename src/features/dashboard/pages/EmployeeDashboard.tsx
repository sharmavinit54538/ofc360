import React, { useState } from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { Clock, Calendar, FileText, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';

export const EmployeeDashboard: React.FC = () => {
  const [clockedIn, setClockedIn] = useState(true);
  const toast = useToast();

  const handleToggleClock = () => {
    if (clockedIn) {
      setClockedIn(false);
      toast.info('Clocked out at ' + new Date().toLocaleTimeString(), 'Shift Ended');
    } else {
      setClockedIn(true);
      toast.success('Clocked in at ' + new Date().toLocaleTimeString(), 'Shift Active');
    }
  };

  return (
    <DashboardShell
      title="Employee Self-Service Portal"
      subtitle="Track your daily work hours, apply for leaves, download payslips, and manage IT assets."
    >
      <div className="space-y-6">
        {/* Attendance Punch In/Out Card */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-brand-950/40 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${clockedIn ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
              <h3 className="text-base font-bold text-white">
                Status: {clockedIn ? 'Currently Clocked In' : 'Currently Off Duty'}
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              Shift: 09:00 AM – 06:00 PM EST &bull; Total recorded today: 6 hrs 24 mins
            </p>
          </div>

          <Button
            variant={clockedIn ? 'danger' : 'primary'}
            size="md"
            onClick={handleToggleClock}
            leftIcon={<Clock className="w-4 h-4" />}
          >
            {clockedIn ? 'Clock Out for Today' : 'Clock In Now'}
          </Button>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs uppercase font-semibold">Available PTO</span>
              <Calendar className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-emerald-400">14 Days</div>
            <div className="text-[11px] text-slate-400">Accrues 1.5 days/month</div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs uppercase font-semibold">Medical Leaves</span>
              <CheckCircle2 className="w-4 h-4 text-brand-400" />
            </div>
            <div className="text-2xl font-bold text-white">8 Days</div>
            <div className="text-[11px] text-slate-400">Valid through year end</div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs uppercase font-semibold">Latest Payslip</span>
              <FileText className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-bold text-white">Oct 2026</div>
            <div className="text-[11px] text-brand-300">Ready for download</div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs uppercase font-semibold">Allocated Devices</span>
              <AlertCircle className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-white">2 Assets</div>
            <div className="text-[11px] text-slate-400">MacBook Pro M3, YubiKey 5</div>
          </div>
        </div>

        {/* Self Service Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors space-y-2 cursor-pointer group">
            <div className="text-xs font-semibold text-white flex items-center justify-between">
              <span>Apply for Time Off</span>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-brand-400 transition-colors" />
            </div>
            <p className="text-xs text-slate-400">Request vacation, medical leave, or remote work days.</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors space-y-2 cursor-pointer group">
            <div className="text-xs font-semibold text-white flex items-center justify-between">
              <span>Salary & Tax Documents</span>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-brand-400 transition-colors" />
            </div>
            <p className="text-xs text-slate-400">Access annual tax forms, W2/1099, and monthly payslips.</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors space-y-2 cursor-pointer group">
            <div className="text-xs font-semibold text-white flex items-center justify-between">
              <span>IT Helpdesk Ticket</span>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-brand-400 transition-colors" />
            </div>
            <p className="text-xs text-slate-400">Submit requests for software licenses or hardware repairs.</p>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
};
