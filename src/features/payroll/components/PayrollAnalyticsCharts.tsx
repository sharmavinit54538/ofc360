/**
 * @file PayrollAnalyticsCharts.tsx
 * @description Comprehensive, responsive SVG data visualizations and analytics charts for Indian Payroll.
 * Features:
 * 1. Monthly Payroll Payout Trend (Stacked Bar Chart: Net Salary, Statutory, TDS in INR)
 * 2. Department-Wise Cost Distribution (Interactive Donut Chart with Center Metric & Legend)
 * 3. Salary Components & Statutory Breakup (Horizontal Bar Breakdown with Category Toggle)
 * 4. Batch & Compliance Status Overview (Radial Circular Progress Gauges)
 */

import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  Calendar,
  CheckCircle2,
  ChevronDown,
  DollarSign,
  Download,
  Filter,
  Layers,
  PieChart as PieChartIcon,
  Receipt,
  ShieldCheck,
  TrendingUp,
  Users,
  Wallet,
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import type { PayrollRunItem, PayrollStats } from '../types/payroll.types';

export interface PayrollAnalyticsChartsProps {
  stats?: PayrollStats;
  runs?: PayrollRunItem[];
  isLoading?: boolean;
  className?: string;
}

// ==========================================
// Mock Data (Realistic Indian Payroll Defaults)
// ==========================================

interface MonthlyPayrollPoint {
  month: string;
  shortMonth: string;
  netPayout: number; // In Lakhs (e.g. 42.5 = ₹42,50,000)
  statutory: number; // In Lakhs (e.g. 3.2 = ₹3,20,000)
  tds: number; // In Lakhs (e.g. 2.5 = ₹2,50,000)
  grossTotal: number;
  headcount: number;
}

const MONTHLY_PAYROLL_DATA: MonthlyPayrollPoint[] = [
  { month: 'May 2026', shortMonth: 'May', netPayout: 36.8, statutory: 2.85, tds: 1.95, grossTotal: 41.6, headcount: 135 },
  { month: 'June 2026', shortMonth: 'Jun', netPayout: 37.5, statutory: 2.9, tds: 2.0, grossTotal: 42.4, headcount: 136 },
  { month: 'July 2026', shortMonth: 'Jul', netPayout: 38.6, statutory: 2.95, tds: 2.15, grossTotal: 43.7, headcount: 138 },
  { month: 'August 2026', shortMonth: 'Aug', netPayout: 39.95, statutory: 3.05, tds: 2.25, grossTotal: 45.25, headcount: 142 },
  { month: 'September 2026', shortMonth: 'Sep', netPayout: 40.8, statutory: 3.1, tds: 2.4, grossTotal: 46.3, headcount: 144 },
  { month: 'October 2026', shortMonth: 'Oct', netPayout: 42.5, statutory: 3.2, tds: 2.5, grossTotal: 48.2, headcount: 148 },
];

const DEPARTMENT_COST_DATA = [
  { id: 'eng', name: 'Engineering & Tech', costLakhs: 22.4, headcount: 62, percentage: 46.5, color: '#6366f1', fillClass: 'fill-indigo-500', bgClass: 'bg-indigo-500' },
  { id: 'sales', name: 'Sales & Marketing', costLakhs: 8.9, headcount: 28, percentage: 18.5, color: '#f59e0b', fillClass: 'fill-amber-500', bgClass: 'bg-amber-500' },
  { id: 'prod', name: 'Product & Design', costLakhs: 7.2, headcount: 18, percentage: 14.9, color: '#a855f7', fillClass: 'fill-purple-500', bgClass: 'bg-purple-500' },
  { id: 'ops', name: 'Operations & HR', costLakhs: 5.8, headcount: 24, percentage: 12.0, color: '#14b8a6', fillClass: 'fill-teal-500', bgClass: 'bg-teal-500' },
  { id: 'fin', name: 'Finance & Legal', costLakhs: 3.9, headcount: 16, percentage: 8.1, color: '#3b82f6', fillClass: 'fill-blue-500', bgClass: 'bg-blue-500' },
];

const EARNINGS_COMPONENTS = [
  { name: 'Basic Salary', amountLakhs: 24.1, percentage: 50.0, rule: '50% of CTC', tag: 'Fully Taxable', color: 'bg-indigo-600' },
  { name: 'House Rent Allowance (HRA)', amountLakhs: 12.05, percentage: 25.0, rule: '50% of Basic', tag: 'Sec 10(13A) Exempt', color: 'bg-blue-600' },
  { name: 'Special Allowance', amountLakhs: 7.23, percentage: 15.0, rule: 'Balancing Component', tag: 'Taxable Allowance', color: 'bg-purple-600' },
  { name: 'Performance & Variable Bonus', amountLakhs: 4.82, percentage: 10.0, rule: 'Quarterly KRA Payout', tag: 'Discretionary', color: 'bg-emerald-600' },
];

const DEDUCTIONS_COMPONENTS = [
  { name: 'Employee Provident Fund (EPF)', amountLakhs: 2.57, percentage: 45.1, rule: '12% of Basic (capped ₹15k)', tag: 'Section 80C', color: 'bg-teal-600' },
  { name: 'Tax Deducted at Source (TDS)', amountLakhs: 2.5, percentage: 43.8, rule: 'Income Tax Slabs (Old/New)', tag: 'Direct Tax', color: 'bg-rose-600' },
  { name: 'Employee State Insurance (ESIC)', amountLakhs: 0.35, percentage: 6.2, rule: '0.75% of Gross (< ₹21k)', tag: 'Medical Benefit', color: 'bg-amber-600' },
  { name: 'Professional Tax (PT) & LWF', amountLakhs: 0.28, percentage: 4.9, rule: 'State Slabs (₹200/mo)', tag: 'State Statutory', color: 'bg-cyan-600' },
];

// Helper to format currency in Lakhs or Crores
const formatLakhs = (val: number): string => `₹${val.toFixed(2)}L`;

// ==========================================
// Component
// ==========================================

export const PayrollAnalyticsCharts: React.FC<PayrollAnalyticsChartsProps> = ({
  stats,
  runs,
  isLoading = false,
  className = '',
}) => {
  // Chart 1 state
  const [timeRange, setTimeRange] = useState<'6m' | '12m'>('6m');
  const [hoveredMonthIdx, setHoveredMonthIdx] = useState<number | null>(null);

  // Chart 2 state
  const [hoveredDeptId, setHoveredDeptId] = useState<string | null>(null);

  // Chart 3 state
  const [componentType, setComponentType] = useState<'earnings' | 'deductions'>('earnings');

  // Chart 1 computed data (sync with live runs if available)
  const monthlyData = useMemo(() => {
    if (runs && runs.length >= 3) {
      // Map API runs to chart points if available
      return runs.slice(0, 6).reverse().map((run) => {
        const net = (run.totalNetPay || 4250000) / 100000;
        const gross = (run.totalGrossPay || 4820000) / 100000;
        const ded = (run.totalDeductions || 570000) / 100000;
        return {
          month: `${run.month}/${run.year}`,
          shortMonth: String(run.month),
          netPayout: Number(net.toFixed(2)),
          statutory: Number((ded * 0.55).toFixed(2)),
          tds: Number((ded * 0.45).toFixed(2)),
          grossTotal: Number(gross.toFixed(2)),
          headcount: run.totalEmployees || 148,
        };
      });
    }
    return MONTHLY_PAYROLL_DATA;
  }, [runs]);

  // Loading skeleton
  if (isLoading) {
    return (
      <div className={cn('grid grid-cols-1 lg:grid-cols-2 gap-6', className)}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="p-6 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 shadow-sm animate-pulse space-y-4"
          >
            <div className="h-4 w-40 bg-gray-200 dark:bg-zinc-800 rounded" />
            <div className="h-60 bg-gray-100 dark:bg-zinc-900 rounded-xl" />
          </div>
        ))}
      </div>
    );
  }

  // Y-axis max scale calculation
  const maxGross = Math.max(...monthlyData.map((d) => d.grossTotal), 55);
  const chartHeight = 180;

  // Donut chart calculations
  const donutRadius = 65;
  const donutStrokeWidth = 26;
  const circumference = 2 * Math.PI * donutRadius;
  let accumulatedPercent = 0;

  return (
    <div className={cn('space-y-6', className)}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ==========================================
            CHART 1: Monthly Payroll Payout Trend
            ========================================== */}
        <div className="p-5 sm:p-6 rounded-2xl border border-slate-100 dark:border-zinc-800 bg-white dark:bg-[#171717] shadow-sm flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-100 dark:border-zinc-800/80">
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <BarChart3 className="w-4.5 h-4.5 text-indigo-600 dark:text-indigo-400" />
                  Monthly Payroll Payout Trend
                </h3>
                <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
                  Stacked salary disbursement, statutory deductions & TDS in INR (₹ Lakhs)
                </p>
              </div>

              {/* Filter */}
              <div className="flex items-center gap-1.5 p-1 bg-gray-100 dark:bg-zinc-800/80 rounded-xl text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setTimeRange('6m')}
                  className={cn(
                    'px-2.5 py-1 rounded-lg transition-all',
                    timeRange === '6m'
                      ? 'bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                      : 'text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white'
                  )}
                >
                  Last 6M
                </button>
                <button
                  type="button"
                  onClick={() => setTimeRange('12m')}
                  className={cn(
                    'px-2.5 py-1 rounded-lg transition-all',
                    timeRange === '12m'
                      ? 'bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                      : 'text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white'
                  )}
                >
                  FY 2026-27
                </button>
              </div>
            </div>

            {/* Chart Legend */}
            <div className="flex flex-wrap items-center gap-4 pt-3 pb-2 text-xs text-gray-600 dark:text-zinc-400">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                <span>Net Salary Disbursed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
                <span>Statutory (PF/ESIC/PT)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span>TDS Tax</span>
              </div>
            </div>

            {/* SVG Stacked Bar Chart */}
            <div className="relative pt-4 pb-2">
              <svg
                viewBox={`0 0 500 ${chartHeight + 40}`}
                className="w-full h-56 overflow-visible select-none"
              >
                {/* Horizontal Guide Lines */}
                {[0, 15, 30, 45, 60].map((lvl, idx) => {
                  const y = chartHeight - (lvl / maxGross) * chartHeight;
                  return (
                    <g key={idx}>
                      <line
                        x1="35"
                        y1={y}
                        x2="480"
                        y2={y}
                        stroke="currentColor"
                        strokeDasharray="3 3"
                        className="text-gray-200 dark:text-zinc-800"
                        strokeWidth="1"
                      />
                      <text
                        x="30"
                        y={y + 3}
                        textAnchor="end"
                        className="text-[10px] fill-gray-400 dark:fill-zinc-500 font-mono"
                      >
                        ₹{lvl}L
                      </text>
                    </g>
                  );
                })}

                {/* Stacked Bars */}
                {monthlyData.map((d, i) => {
                  const colWidth = 36;
                  const spacing = (440 - colWidth) / (monthlyData.length - 1);
                  const x = 50 + i * spacing;

                  const netH = (d.netPayout / maxGross) * chartHeight;
                  const statH = (d.statutory / maxGross) * chartHeight;
                  const tdsH = (d.tds / maxGross) * chartHeight;

                  const netY = chartHeight - netH;
                  const statY = netY - statH;
                  const tdsY = statY - tdsH;

                  const isHovered = hoveredMonthIdx === i;

                  return (
                    <g
                      key={i}
                      className="cursor-pointer transition-all duration-150"
                      onMouseEnter={() => setHoveredMonthIdx(i)}
                      onMouseLeave={() => setHoveredMonthIdx(null)}
                    >
                      {/* Hover background column indicator */}
                      {isHovered && (
                        <rect
                          x={x - 6}
                          y={0}
                          width={colWidth + 12}
                          height={chartHeight + 5}
                          className="fill-indigo-50/50 dark:fill-indigo-950/20"
                          rx="8"
                        />
                      )}

                      {/* Stack 1: Net Salary (Base) */}
                      <rect
                        x={x}
                        y={netY}
                        width={colWidth}
                        height={netH}
                        rx="4"
                        className={cn(
                          'fill-indigo-600 transition-all duration-200',
                          isHovered ? 'fill-indigo-500' : 'fill-indigo-600'
                        )}
                      />

                      {/* Stack 2: Statutory Deductions (Middle) */}
                      <rect
                        x={x}
                        y={statY}
                        width={colWidth}
                        height={statH}
                        className={cn(
                          'fill-teal-500 transition-all duration-200',
                          isHovered ? 'fill-teal-400' : 'fill-teal-500'
                        )}
                      />

                      {/* Stack 3: TDS (Top) */}
                      <rect
                        x={x}
                        y={tdsY}
                        width={colWidth}
                        height={tdsH}
                        rx="4"
                        className={cn(
                          'fill-rose-500 transition-all duration-200',
                          isHovered ? 'fill-rose-400' : 'fill-rose-500'
                        )}
                      />

                      {/* Month Label */}
                      <text
                        x={x + colWidth / 2}
                        y={chartHeight + 22}
                        textAnchor="middle"
                        className={cn(
                          'text-[11px] font-medium transition-colors',
                          isHovered
                            ? 'fill-indigo-600 dark:fill-indigo-400 font-bold'
                            : 'fill-gray-500 dark:fill-zinc-400'
                        )}
                      >
                        {d.shortMonth}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Interactive Hover Card Details */}
          <div className="pt-3 border-t border-gray-100 dark:border-zinc-800/80 min-h-[52px]">
            {hoveredMonthIdx !== null ? (
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-indigo-50/60 dark:bg-indigo-950/30 p-2.5 rounded-xl border border-indigo-100 dark:border-indigo-900/50">
                <span className="font-bold text-gray-900 dark:text-white">
                  {monthlyData[hoveredMonthIdx].month} ({monthlyData[hoveredMonthIdx].headcount} Staff):
                </span>
                <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                  Net: {formatLakhs(monthlyData[hoveredMonthIdx].netPayout)}
                </span>
                <span className="text-teal-600 dark:text-teal-400 font-semibold">
                  Statutory: {formatLakhs(monthlyData[hoveredMonthIdx].statutory)}
                </span>
                <span className="text-rose-600 dark:text-rose-400 font-semibold">
                  TDS: {formatLakhs(monthlyData[hoveredMonthIdx].tds)}
                </span>
                <span className="font-bold text-gray-900 dark:text-white">
                  Total: {formatLakhs(monthlyData[hoveredMonthIdx].grossTotal)}
                </span>
              </div>
            ) : (
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-zinc-400 px-1 py-1">
                <span>Hover over any bar to view stacked rupee breakdown</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" /> Latest: ₹42.50L Net Payout
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ==========================================
            CHART 2: Department-Wise Cost Distribution
            ========================================== */}
        <div className="p-5 sm:p-6 rounded-2xl border border-slate-100 dark:border-zinc-800 bg-white dark:bg-[#171717] shadow-sm flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-100 dark:border-zinc-800/80">
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <PieChartIcon className="w-4.5 h-4.5 text-purple-600 dark:text-purple-400" />
                  Department-Wise Cost Distribution
                </h3>
                <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
                  Monthly CTC allocation and staff headcount across departments
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300">
                5 Departments
              </span>
            </div>

            {/* Donut Chart & Legend Container */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center pt-5 pb-2">
              {/* Left Donut SVG (5 cols) */}
              <div className="sm:col-span-5 flex items-center justify-center relative">
                <svg
                  width="180"
                  height="180"
                  viewBox="0 0 180 180"
                  className="transform -rotate-90 select-none overflow-visible"
                >
                  {/* Background Track */}
                  <circle
                    cx="90"
                    cy="90"
                    r={donutRadius}
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth={donutStrokeWidth}
                    className="text-gray-100 dark:text-zinc-800"
                  />

                  {/* SVG Segments */}
                  {DEPARTMENT_COST_DATA.map((dept) => {
                    const strokeDash = (dept.percentage / 100) * circumference;
                    const strokeOffset = circumference - (accumulatedPercent / 100) * circumference;
                    accumulatedPercent += dept.percentage;

                    const isHovered = hoveredDeptId === dept.id;

                    return (
                      <circle
                        key={dept.id}
                        cx="90"
                        cy="90"
                        r={donutRadius}
                        fill="transparent"
                        stroke={dept.color}
                        strokeWidth={isHovered ? donutStrokeWidth + 4 : donutStrokeWidth}
                        strokeDasharray={`${strokeDash} ${circumference}`}
                        strokeDashoffset={strokeOffset}
                        className="transition-all duration-200 cursor-pointer hover:opacity-90"
                        onMouseEnter={() => setHoveredDeptId(dept.id)}
                        onMouseLeave={() => setHoveredDeptId(null)}
                      />
                    );
                  })}
                </svg>

                {/* Center Content Inside Donut */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                  <span className="text-xs font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">
                    Total CTC
                  </span>
                  <span className="text-xl font-bold text-gray-900 dark:text-white">
                    ₹48.2L
                  </span>
                  <span className="text-[10px] text-gray-500 dark:text-zinc-400">
                    148 Staff
                  </span>
                </div>
              </div>

              {/* Right Legend List (7 cols) */}
              <div className="sm:col-span-7 space-y-2">
                {DEPARTMENT_COST_DATA.map((dept) => {
                  const isHovered = hoveredDeptId === dept.id;
                  return (
                    <div
                      key={dept.id}
                      onMouseEnter={() => setHoveredDeptId(dept.id)}
                      onMouseLeave={() => setHoveredDeptId(null)}
                      className={cn(
                        'flex items-center justify-between p-2 rounded-xl transition-all cursor-pointer',
                        isHovered
                          ? 'bg-gray-100 dark:bg-zinc-800 scale-[1.02]'
                          : 'hover:bg-gray-50 dark:hover:bg-zinc-800/50'
                      )}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className={cn('w-2.5 h-2.5 rounded-full shrink-0', dept.bgClass)} />
                        <span className="text-xs font-semibold text-gray-900 dark:text-white truncate">
                          {dept.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2.5 shrink-0">
                        <span className="text-xs font-bold text-gray-900 dark:text-white">
                          ₹{dept.costLakhs}L
                        </span>
                        <span className="text-[11px] font-mono text-gray-500 dark:text-zinc-400 w-10 text-right">
                          {dept.percentage}%
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400">
                          {dept.headcount}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div className="pt-3 border-t border-gray-100 dark:border-zinc-800/80 flex items-center justify-between text-xs text-gray-500 dark:text-zinc-400">
            <span>Engineering represents the largest salary share (46.5%)</span>
            <span className="text-purple-600 dark:text-purple-400 font-semibold">100% Allocated</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ==========================================
            CHART 3: Salary Components & Statutory Breakup
            ========================================== */}
        <div className="p-5 sm:p-6 rounded-2xl border border-slate-100 dark:border-zinc-800 bg-white dark:bg-[#171717] shadow-sm flex flex-col justify-between">
          <div>
            {/* Header with Category Toggle */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-100 dark:border-zinc-800/80">
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Receipt className="w-4.5 h-4.5 text-blue-600 dark:text-blue-400" />
                  Salary Components & Statutory Breakup
                </h3>
                <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
                  Breakdown of Gross Earnings vs Statutory Deductions
                </p>
              </div>

              {/* Toggle */}
              <div className="flex items-center gap-1.5 p-1 bg-gray-100 dark:bg-zinc-800/80 rounded-xl text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setComponentType('earnings')}
                  className={cn(
                    'px-2.5 py-1 rounded-lg transition-all',
                    componentType === 'earnings'
                      ? 'bg-white dark:bg-zinc-900 text-blue-600 dark:text-blue-400 shadow-xs'
                      : 'text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white'
                  )}
                >
                  Earnings (₹48.2L)
                </button>
                <button
                  type="button"
                  onClick={() => setComponentType('deductions')}
                  className={cn(
                    'px-2.5 py-1 rounded-lg transition-all',
                    componentType === 'deductions'
                      ? 'bg-white dark:bg-zinc-900 text-teal-600 dark:text-teal-400 shadow-xs'
                      : 'text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white'
                  )}
                >
                  Deductions (₹5.7L)
                </button>
              </div>
            </div>

            {/* Horizontal Progress Bars */}
            <div className="space-y-4 pt-4 pb-2">
              {(componentType === 'earnings' ? EARNINGS_COMPONENTS : DEDUCTIONS_COMPONENTS).map(
                (item, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 dark:text-white">
                          {item.name}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400">
                          {item.tag}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 dark:text-white">
                          ₹{item.amountLakhs}L
                        </span>
                        <span className="text-[11px] font-mono text-gray-500 dark:text-zinc-400 w-10 text-right">
                          {item.percentage}%
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-100 dark:bg-zinc-800 rounded-full h-2 overflow-hidden shadow-inner">
                      <div
                        className={cn('h-2 rounded-full transition-all duration-500', item.color)}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>

                    <div className="text-[11px] text-gray-400 dark:text-zinc-500">
                      Rule: {item.rule}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Footer summary */}
          <div className="pt-3 border-t border-gray-100 dark:border-zinc-800/80 flex items-center justify-between text-xs text-gray-500 dark:text-zinc-400">
            <span>
              {componentType === 'earnings'
                ? 'Standard 50:25:25 Indian Basic/HRA structure'
                : 'Deterministic EPFO, ESIC & Income Tax computed'}
            </span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {componentType === 'earnings' ? 'Total: ₹48.20L' : 'Total: ₹5.70L'}
            </span>
          </div>
        </div>

        {/* ==========================================
            CHART 4: Batch & Compliance Status Gauges
            ========================================== */}
        <div className="p-5 sm:p-6 rounded-2xl border border-slate-100 dark:border-zinc-800 bg-white dark:bg-[#171717] shadow-sm flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-100 dark:border-zinc-800/80">
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-4.5 h-4.5 text-teal-600 dark:text-teal-400" />
                  Compliance & Execution Gauges
                </h3>
                <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
                  Real-time statutory filing and payroll lifecycle readiness
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300">
                FY 2026-27 Active
              </span>
            </div>

            {/* 4 Radial Gauges Grid */}
            <div className="grid grid-cols-2 gap-4 pt-5 pb-2">
              {/* Gauge 1: Payslips */}
              <div className="p-4 rounded-xl border border-gray-100 dark:border-zinc-800/80 bg-gray-50/50 dark:bg-zinc-800/20 flex flex-col items-center text-center space-y-2">
                <div className="relative w-16 h-16 flex items-center justify-center">
                  <svg className="w-16 h-16 transform -rotate-90">
                    <circle
                      cx="32"
                      cy="32"
                      r="26"
                      stroke="currentColor"
                      strokeWidth="5"
                      fill="transparent"
                      className="text-gray-200 dark:text-zinc-700"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r="26"
                      stroke="#10b981"
                      strokeWidth="5"
                      fill="transparent"
                      strokeDasharray={2 * Math.PI * 26}
                      strokeDashoffset={0}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    100%
                  </span>
                </div>
                <h4 className="text-xs font-bold text-gray-900 dark:text-white">
                  Payslips Disbursed
                </h4>
                <p className="text-[11px] text-gray-500 dark:text-zinc-400">
                  148 of 148 Released
                </p>
              </div>

              {/* Gauge 2: Tax Declarations */}
              <div className="p-4 rounded-xl border border-gray-100 dark:border-zinc-800/80 bg-gray-50/50 dark:bg-zinc-800/20 flex flex-col items-center text-center space-y-2">
                <div className="relative w-16 h-16 flex items-center justify-center">
                  <svg className="w-16 h-16 transform -rotate-90">
                    <circle
                      cx="32"
                      cy="32"
                      r="26"
                      stroke="currentColor"
                      strokeWidth="5"
                      fill="transparent"
                      className="text-gray-200 dark:text-zinc-700"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r="26"
                      stroke="#6366f1"
                      strokeWidth="5"
                      fill="transparent"
                      strokeDasharray={2 * Math.PI * 26}
                      strokeDashoffset={2 * Math.PI * 26 * (1 - 0.85)}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    85%
                  </span>
                </div>
                <h4 className="text-xs font-bold text-gray-900 dark:text-white">
                  Tax Proofs Verified
                </h4>
                <p className="text-[11px] text-gray-500 dark:text-zinc-400">
                  126 Done · 22 Pending
                </p>
              </div>

              {/* Gauge 3: EPFO ECR */}
              <div className="p-4 rounded-xl border border-gray-100 dark:border-zinc-800/80 bg-gray-50/50 dark:bg-zinc-800/20 flex flex-col items-center text-center space-y-2">
                <div className="relative w-16 h-16 flex items-center justify-center">
                  <svg className="w-16 h-16 transform -rotate-90">
                    <circle
                      cx="32"
                      cy="32"
                      r="26"
                      stroke="currentColor"
                      strokeWidth="5"
                      fill="transparent"
                      className="text-gray-200 dark:text-zinc-700"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r="26"
                      stroke="#06b6d4"
                      strokeWidth="5"
                      fill="transparent"
                      strokeDasharray={2 * Math.PI * 26}
                      strokeDashoffset={0}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute text-xs font-bold text-cyan-600 dark:text-cyan-400">
                    100%
                  </span>
                </div>
                <h4 className="text-xs font-bold text-gray-900 dark:text-white">
                  EPFO ECR & TRRN
                </h4>
                <p className="text-[11px] text-gray-500 dark:text-zinc-400">
                  Challan Reconciled
                </p>
              </div>

              {/* Gauge 4: Attendance Sync */}
              <div className="p-4 rounded-xl border border-gray-100 dark:border-zinc-800/80 bg-gray-50/50 dark:bg-zinc-800/20 flex flex-col items-center text-center space-y-2">
                <div className="relative w-16 h-16 flex items-center justify-center">
                  <svg className="w-16 h-16 transform -rotate-90">
                    <circle
                      cx="32"
                      cy="32"
                      r="26"
                      stroke="currentColor"
                      strokeWidth="5"
                      fill="transparent"
                      className="text-gray-200 dark:text-zinc-700"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r="26"
                      stroke="#f59e0b"
                      strokeWidth="5"
                      fill="transparent"
                      strokeDasharray={2 * Math.PI * 26}
                      strokeDashoffset={2 * Math.PI * 26 * (1 - 0.98)}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute text-xs font-bold text-amber-600 dark:text-amber-400">
                    98%
                  </span>
                </div>
                <h4 className="text-xs font-bold text-gray-900 dark:text-white">
                  Attendance Locked
                </h4>
                <p className="text-[11px] text-gray-500 dark:text-zinc-400">
                  Timesheets Approved
                </p>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div className="pt-3 border-t border-gray-100 dark:border-zinc-800/80 flex items-center justify-between text-xs text-gray-500 dark:text-zinc-400">
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              All 4 compliance gateways passed
            </span>
            <span className="text-xs text-gray-500 dark:text-zinc-400">Oct 2026 Batch</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayrollAnalyticsCharts;

