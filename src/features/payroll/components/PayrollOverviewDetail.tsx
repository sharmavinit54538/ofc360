/**
 * @file PayrollOverviewDetail.tsx
 * @description Rich Indian Payroll Overview Detail View featuring executive metrics,
 * active cycle approval stepper, department cost breakdown, and month-on-month trend analytics.
 */

import React from 'react';
import {
  BadgeIndianRupee,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  FileText,
  Layers,
  Receipt,
  ShieldCheck,
  TrendingUp,
  Users,
  Wallet,
} from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { PayrollApprovalStepper } from './PayrollApprovalStepper';
import { PayrollAnalyticsCharts } from './PayrollAnalyticsCharts';
import type { PayrollRunItem, PayrollStats } from '../types/payroll.types';

interface PayrollOverviewDetailProps {
  stats?: PayrollStats;
  activeRun: PayrollRunItem | null;
  onNavigate: (tabId: string) => void;
  onInitiatePayroll: () => void;
  onRefreshRuns: () => void;
  onRefreshStats: () => void;
}

const DEPARTMENT_COSTS = [
  {
    name: 'Engineering & Technology',
    headcount: 62,
    grossCost: '₹25,10,000',
    netPayout: '₹22,40,000',
    percentage: 46.5,
    avgPayout: '₹36,129',
    status: 'Processed',
  },
  {
    name: 'Sales & Business Development',
    headcount: 28,
    grossCost: '₹10,20,000',
    netPayout: '₹8,90,000',
    percentage: 18.5,
    avgPayout: '₹31,785',
    status: 'Processed',
  },
  {
    name: 'Product & UX Design',
    headcount: 18,
    grossCost: '₹8,15,000',
    netPayout: '₹7,20,000',
    percentage: 14.9,
    avgPayout: '₹40,000',
    status: 'Processed',
  },
  {
    name: 'Operations & HR Support',
    headcount: 24,
    grossCost: '₹6,60,000',
    netPayout: '₹5,80,000',
    percentage: 12.0,
    avgPayout: '₹24,166',
    status: 'Processed',
  },
  {
    name: 'Finance & Legal Administration',
    headcount: 16,
    grossCost: '₹4,45,000',
    netPayout: '₹3,90,000',
    percentage: 8.1,
    avgPayout: '₹24,375',
    status: 'Processed',
  },
];

const PAYOUT_TRENDS = [
  {
    month: 'October 2026',
    netPayout: '₹42,50,000',
    grossPay: '₹48,20,000',
    deductions: '₹5,70,000',
    headcount: 148,
    status: 'Disbursed',
    variance: '+4.2%',
    paidOn: 'Oct 31, 2026',
  },
  {
    month: 'September 2026',
    netPayout: '₹40,80,000',
    grossPay: '₹46,30,000',
    deductions: '₹5,50,000',
    headcount: 144,
    status: 'Disbursed',
    variance: '+2.1%',
    paidOn: 'Sep 30, 2026',
  },
  {
    month: 'August 2026',
    netPayout: '₹39,95,000',
    grossPay: '₹45,25,000',
    deductions: '₹5,30,000',
    headcount: 142,
    status: 'Disbursed',
    variance: '+3.5%',
    paidOn: 'Aug 31, 2026',
  },
  {
    month: 'July 2026',
    netPayout: '₹38,60,000',
    grossPay: '₹43,70,000',
    deductions: '₹5,10,000',
    headcount: 138,
    status: 'Disbursed',
    variance: '+1.8%',
    paidOn: 'Jul 31, 2026',
  },
];

export const PayrollOverviewDetail: React.FC<PayrollOverviewDetailProps> = ({
  activeRun,
  onNavigate,
  onInitiatePayroll,
  onRefreshRuns,
  onRefreshStats,
}) => {
  return (
    <div className="space-y-6">
      {/* 1. Top 4 Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Gross Pay */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
              Gross Payroll Cost
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
            ₹48,20,000
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+3.8% vs last month</span>
          </div>
        </div>

        {/* Total Deductions */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
              Total Deductions
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <BadgeIndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
            ₹5,70,000
          </div>
          <div className="mt-1 text-xs text-gray-500 dark:text-zinc-400">
            EPF, ESIC, PT & TDS Included
          </div>
        </div>

        {/* Net Payout */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#171717] border border-emerald-500/30 dark:border-emerald-500/20 shadow-sm relative overflow-hidden bg-gradient-to-br from-emerald-50/20 to-transparent">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
              Net Payout Disbursed
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
            ₹42,50,000
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>100% Disbursed to Bank</span>
          </div>
        </div>

        {/* Headcount */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
              Active Headcount
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
            148
          </div>
          <div className="mt-1 text-xs text-gray-500 dark:text-zinc-400">
            144 Full-time · 4 On Notice
          </div>
        </div>
      </div>

      {/* 2. Active Payroll Cycle Stepper */}
      {activeRun ? (
        <div className="p-6 rounded-3xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#171717] shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-100 dark:border-zinc-800">
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Clock className="w-4.5 h-4.5 text-indigo-600 dark:text-indigo-400" />
                Active Payroll Processing Lifecycle
              </h3>
              <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
                Current Batch: {activeRun.month}/{activeRun.year} · State: {activeRun.status}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigate('runs')}
                leftIcon={<Layers className="w-3.5 h-3.5" />}
              >
                All Batches
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigate('payslips')}
                leftIcon={<Receipt className="w-3.5 h-3.5" />}
              >
                Payslips
              </Button>
            </div>
          </div>
          <PayrollApprovalStepper
            run={activeRun}
            onRefresh={() => {
              onRefreshRuns();
              onRefreshStats();
            }}
            onViewPayslips={() => onNavigate('payslips')}
          />
        </div>
      ) : (
        <div className="p-8 rounded-3xl border border-dashed border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#171717] text-center space-y-3">
          <Layers className="w-10 h-10 text-indigo-500 mx-auto" />
          <h4 className="text-base font-bold text-gray-900 dark:text-white">No Active Payroll Batch</h4>
          <p className="text-xs text-gray-500 dark:text-zinc-400 max-w-md mx-auto">
            Initiate a payroll batch for the current cycle to start attendance synchronization and statutory computations.
          </p>
          <Button size="sm" onClick={onInitiatePayroll} leftIcon={<DollarSign className="w-4 h-4" />}>
            Initiate New Payroll
          </Button>
        </div>
      )}

      {/* Visual Analytics & Charts */}
      <PayrollAnalyticsCharts stats={stats} />

      {/* 3. Department-wise Payroll Cost Breakdown & Month-on-Month Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Cost Breakdown (2 cols) */}
        <div className="lg:col-span-2 p-6 rounded-3xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#171717] shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-zinc-800">
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Building2 className="w-4.5 h-4.5 text-indigo-600 dark:text-indigo-400" />
                Department-wise Payroll Cost Breakdown
              </h3>
              <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
                Current month expenditure distribution across 5 core departments
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300">
              5 Departments
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-zinc-800 text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
                  <th className="py-2.5 pr-4">Department</th>
                  <th className="py-2.5 px-4 text-center">Employees</th>
                  <th className="py-2.5 px-4 text-right">Net Payout</th>
                  <th className="py-2.5 px-4 text-right">Avg / Emp</th>
                  <th className="py-2.5 pl-4 text-right">Share</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-zinc-800/60">
                {DEPARTMENT_COSTS.map((dept, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                    <td className="py-3 pr-4">
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {dept.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-zinc-400">
                        Gross: {dept.grossCost}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center font-medium text-gray-700 dark:text-zinc-300">
                      {dept.headcount}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-gray-900 dark:text-white">
                      {dept.netPayout}
                    </td>
                    <td className="py-3 px-4 text-right text-xs text-gray-600 dark:text-zinc-400">
                      {dept.avgPayout}
                    </td>
                    <td className="py-3 pl-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-16 bg-gray-100 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-indigo-600 dark:bg-indigo-400 h-1.5 rounded-full"
                            style={{ width: `${dept.percentage}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-gray-900 dark:text-white w-10 text-right">
                          {dept.percentage}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Month-on-Month Trends (1 col) */}
        <div className="p-6 rounded-3xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#171717] shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-zinc-800">
            <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-4.5 h-4.5 text-indigo-600 dark:text-indigo-400" />
              Monthly Payout Trends
            </h3>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> Stable
            </span>
          </div>

          <div className="space-y-3">
            {PAYOUT_TRENDS.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl border border-gray-100 dark:border-zinc-800/80 bg-gray-50/50 dark:bg-zinc-800/20 space-y-1.5 hover:border-gray-200 dark:hover:border-zinc-700 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    {item.month}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
                    {item.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-600 dark:text-zinc-400">
                  <span>Net Payout: <strong className="text-gray-900 dark:text-white">{item.netPayout}</strong></span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{item.variance}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-zinc-500 pt-1 border-t border-gray-100 dark:border-zinc-800/50">
                  <span>{item.headcount} Employees</span>
                  <span>Paid on {item.paidOn}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Quick Navigation Hub to other modules */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { id: 'runs', label: 'Batches & Lifecycle', icon: Layers, color: 'text-amber-600 bg-amber-50' },
          { id: 'payslips', label: 'Employee Payslips', icon: Receipt, color: 'text-emerald-600 bg-emerald-50' },
          { id: 'structures', label: 'Salary CTC Rules', icon: Wallet, color: 'text-purple-600 bg-purple-50' },
          { id: 'components', label: 'Pay Components', icon: FileText, color: 'text-blue-600 bg-blue-50' },
          { id: 'statutory', label: 'Statutory Engine', icon: ShieldCheck, color: 'text-teal-600 bg-teal-50' },
          { id: 'tax', label: 'Tax Declarations', icon: CheckCircle2, color: 'text-rose-600 bg-rose-50' },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className="p-3.5 rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#171717] hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-sm text-left transition-all group flex flex-col justify-between"
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mb-2">
                <Icon className="w-4.5 h-4.5 text-gray-700 dark:text-zinc-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
              </div>
              <span className="text-xs font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {item.label} →
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

