/**
 * @file dashboardKpiCards.data.ts
 * @description Structured KPI card data for the 8 core Indian Payroll & HR modules.
 * Includes icons, real-world Indian payroll metrics (INR, ECR, PF, CTC), trends, and status accents.
 */

import {
  LayoutGrid,
  Layers,
  Receipt,
  Wallet,
  Sliders,
  ShieldCheck,
  Building2,
  FileCheck,
  type LucideIcon,
} from 'lucide-react';

export type KpiStatusColor =
  | 'indigo'
  | 'amber'
  | 'emerald'
  | 'purple'
  | 'blue'
  | 'teal'
  | 'cyan'
  | 'rose';

export interface DashboardKpiCardItem {
  id: string;
  title: string;
  icon: LucideIcon;
  primaryMetric: string;
  subtext: string;
  trend?: string;
  statusColor: KpiStatusColor;
  badgeText?: string;
  badgeVariant?: 'success' | 'warning' | 'info' | 'neutral';
}

export const DASHBOARD_KPI_CARDS: DashboardKpiCardItem[] = [
  {
    id: 'overview',
    title: 'Overview',
    icon: LayoutGrid,
    primaryMetric: '₹42.5L Net Payout',
    subtext: '+4.2% vs last month',
    trend: '+4.2%',
    statusColor: 'indigo',
    badgeText: 'Live Cycle',
    badgeVariant: 'info',
  },
  {
    id: 'runs',
    title: 'Payroll Batches & Lifecycle',
    icon: Layers,
    primaryMetric: '3 Active Batches',
    subtext: '2 Pending Approval',
    trend: '2 Pending',
    statusColor: 'amber',
    badgeText: 'Review Needed',
    badgeVariant: 'warning',
  },
  {
    id: 'payslips',
    title: 'Payslips',
    icon: Receipt,
    primaryMetric: '148 Generated',
    subtext: '100% Compliant & Disbursed',
    trend: '100%',
    statusColor: 'emerald',
    badgeText: '100% Disbursed',
    badgeVariant: 'success',
  },
  {
    id: 'structures',
    title: 'Salary Structures (CTC)',
    icon: Wallet,
    primaryMetric: '12 CTC Templates',
    subtext: 'All Grades Mapped',
    trend: 'Active',
    statusColor: 'purple',
    badgeText: 'All Mapped',
    badgeVariant: 'neutral',
  },
  {
    id: 'components',
    title: 'Pay Components Catalog',
    icon: Sliders,
    primaryMetric: '24 Components',
    subtext: '18 Earnings · 6 Deductions',
    trend: 'Configured',
    statusColor: 'blue',
    badgeText: 'Statutory Mapped',
    badgeVariant: 'info',
  },
  {
    id: 'statutory',
    title: 'Statutory Engine',
    icon: ShieldCheck,
    primaryMetric: 'PF, ESIC, PT, LWF',
    subtext: 'FY 2026-27 Compliant',
    trend: 'Verified',
    statusColor: 'teal',
    badgeText: 'Auto-Calculated',
    badgeVariant: 'success',
  },
  {
    id: 'pf-ecr',
    title: 'EPFO PF & ECR Compliance',
    icon: Building2,
    primaryMetric: 'ECR Generated',
    subtext: 'TRRN Paid & Reconciled',
    trend: 'Reconciled',
    statusColor: 'cyan',
    badgeText: 'TRRN Active',
    badgeVariant: 'success',
  },
  {
    id: 'tax',
    title: 'Tax Declarations',
    icon: FileCheck,
    primaryMetric: '85% Verified',
    subtext: 'Q3 Proofs Under Review',
    trend: '15 Pending',
    statusColor: 'rose',
    badgeText: '15 Pending',
    badgeVariant: 'warning',
  },
];

