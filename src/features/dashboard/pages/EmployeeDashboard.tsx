import React, { useState } from 'react';
import { DashboardShell } from '@/shared/layout/DashboardShell';
import { Clock, Calendar, FileText, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { useToast } from '@/shared/ui/Toast';

import { StatCard } from '@/features/dashboard/components/StatCard';

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
        <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 border border-indigo-500 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${clockedIn ? 'bg-emerald-300 animate-pulse' : 'bg-gray-300'}`} />
              <h3 className="text-base font-bold text-white">
                Status: {clockedIn ? 'Currently Clocked In' : 'Currently Off Duty'}
              </h3>
            </div>
            <p className="text-xs text-indigo-100">
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
          <StatCard
            label="Available PTO"
            value="14 Days"
            subtext="Accrues 1.5 days/month"
            icon={<Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
            valueColor="text-emerald-600 dark:text-emerald-400"
          />
          <StatCard
            label="Medical Leaves"
            value="8 Days"
            subtext="Valid through year end"
            icon={<CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
            valueColor="text-indigo-600 dark:text-indigo-400"
          />
          <StatCard
            label="Latest Payslip"
            value="Oct 2026"
            subtext="Ready for download"
            icon={<FileText className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />}
            valueColor="text-cyan-600 dark:text-cyan-400"
          />
          <StatCard
            label="Allocated Devices"
            value="2 Assets"
            subtext="MacBook Pro M3, YubiKey 5"
            icon={<AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />}
            valueColor="text-amber-600 dark:text-amber-400"
          />
        </div>

        {/* Self Service Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700 transition-colors space-y-2 cursor-pointer group">
            <div className="text-xs font-semibold text-gray-900 dark:text-[#ececec] flex items-center justify-between">
              <span>Apply for Time Off</span>
              <ArrowRight className="w-4 h-4 text-gray-500 dark:text-zinc-500 group-hover:text-indigo-400 transition-colors" />
            </div>
            <p className="text-xs text-gray-600 dark:text-zinc-400">Request vacation, medical leave, or remote work days.</p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700 transition-colors space-y-2 cursor-pointer group">
            <div className="text-xs font-semibold text-gray-900 dark:text-[#ececec] flex items-center justify-between">
              <span>Salary & Tax Documents</span>
              <ArrowRight className="w-4 h-4 text-gray-500 dark:text-zinc-500 group-hover:text-indigo-400 transition-colors" />
            </div>
            <p className="text-xs text-gray-600 dark:text-zinc-400">Access annual tax forms, W2/1099, and monthly payslips.</p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700 transition-colors space-y-2 cursor-pointer group">
            <div className="text-xs font-semibold text-gray-900 dark:text-[#ececec] flex items-center justify-between">
              <span>IT Helpdesk Ticket</span>
              <ArrowRight className="w-4 h-4 text-gray-500 dark:text-zinc-500 group-hover:text-indigo-400 transition-colors" />
            </div>
            <p className="text-xs text-gray-600 dark:text-zinc-400">Submit requests for software licenses or hardware repairs.</p>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
};
