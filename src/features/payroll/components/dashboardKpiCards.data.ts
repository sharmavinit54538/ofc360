/**
 * @file dashboardKpiCards.data.ts
 * @description Rich Feature & Module Launcher Card data definitions for Indian Payroll & HR modules.
 * Includes module titles, descriptions, Lucide icons, pastel themes, capability tags, and CTA actions.
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

export type CardThemeColor =
  | 'indigo'
  | 'amber'
  | 'emerald'
  | 'purple'
  | 'blue'
  | 'teal'
  | 'cyan'
  | 'rose';

export interface DashboardLauncherCardItem {
  id: string;
  title: string;
  icon: LucideIcon;
  badge: string;
  theme: CardThemeColor;
  description: string;
  tags: string[];
  footerCta: string;
  // Compatibility fields with previous KPI metrics
  primaryMetric?: string;
  subtext?: string;
  statusColor?: CardThemeColor;
}

export type DashboardKpiCardItem = DashboardLauncherCardItem;

export const DASHBOARD_LAUNCHER_CARDS: DashboardLauncherCardItem[] = [
  {
    id: 'overview',
    title: 'Overview',
    icon: LayoutGrid,
    badge: 'LIVE CYCLE',
    theme: 'indigo',
    description:
      'Consolidated payroll analytics, ₹42.5L net payout tracking, headcount cost trends, and variance insights.',
    tags: ['₹42.5L Payout', '+4.2% vs Last Month', 'Cost Analytics'],
    footerCta: 'Open Payroll Overview',
    primaryMetric: '₹42.5L Net Payout',
    subtext: '+4.2% vs last month',
    statusColor: 'indigo',
  },
  {
    id: 'runs',
    title: 'Payroll Batches & Lifecycle',
    icon: Layers,
    badge: '3 ACTIVE',
    theme: 'amber',
    description:
      'End-to-end salary processing, attendance lock, arrear adjustments, and multi-stage batch approvals.',
    tags: ['3 Active Batches', '2 Pending Approval', 'Attendance Sync'],
    footerCta: 'Manage Payroll Batches',
    primaryMetric: '3 Active Batches',
    subtext: '2 Pending Approval',
    statusColor: 'amber',
  },
  {
    id: 'payslips',
    title: 'Payslips',
    icon: Receipt,
    badge: '100% DISBURSED',
    theme: 'emerald',
    description:
      'Automated PDF payslip generation, bulk email/portal release, and tax breakdown visibility for employees.',
    tags: ['148 Generated', 'Bulk Release', 'PDF & Portal'],
    footerCta: 'View & Release Payslips',
    primaryMetric: '148 Generated',
    subtext: '100% Compliant & Disbursed',
    statusColor: 'emerald',
  },
  {
    id: 'structures',
    title: 'Salary Structures (CTC)',
    icon: Wallet,
    badge: 'ALL MAPPED',
    theme: 'purple',
    description:
      'Grade-wise CTC templates, flexible benefit plans, basic-to-allowance ratios, and automated proration rules.',
    tags: ['12 CTC Templates', 'All Grades Mapped', 'Auto-Proration'],
    footerCta: 'Configure CTC Structures',
    primaryMetric: '12 CTC Templates',
    subtext: 'All Grades Mapped',
    statusColor: 'purple',
  },
  {
    id: 'components',
    title: 'Pay Components Catalog',
    icon: Sliders,
    badge: 'STATUTORY MAPPED',
    theme: 'blue',
    description:
      'Centralized catalog of fixed earnings, variable bonuses, reimbursements, and pre/post-tax deductions.',
    tags: ['24 Components', '18 Earnings', '6 Deductions'],
    footerCta: 'Explore Pay Catalog',
    primaryMetric: '24 Components',
    subtext: '18 Earnings · 6 Deductions',
    statusColor: 'blue',
  },
  {
    id: 'statutory',
    title: 'Statutory Engine',
    icon: ShieldCheck,
    badge: 'AUTO-CALCULATED',
    theme: 'teal',
    description:
      'Real-time statutory computation engine for EPF, ESIC, state-wise Professional Tax (PT), and LWF slabs.',
    tags: ['PF & ESIC', 'State PT Slabs', 'FY 2026-27 Ready'],
    footerCta: 'Inspect Statutory Rules',
    primaryMetric: 'PF, ESIC, PT, LWF',
    subtext: 'FY 2026-27 Compliant',
    statusColor: 'teal',
  },
  {
    id: 'pf-ecr',
    title: 'EPFO PF & ECR Compliance',
    icon: Building2,
    badge: 'TRRN ACTIVE',
    theme: 'cyan',
    description:
      'Automated ECR text file generation, UAN validation, challan reconciliation, and TRRN payment tracking.',
    tags: ['ECR Generated', 'TRRN Reconciled', 'UAN Validation'],
    footerCta: 'Launch ECR Compliance',
    primaryMetric: 'ECR Generated',
    subtext: 'TRRN Paid & Reconciled',
    statusColor: 'cyan',
  },
  {
    id: 'tax',
    title: 'Tax Declarations',
    icon: FileCheck,
    badge: '15 PENDING',
    theme: 'rose',
    description:
      'Old vs New Tax Regime comparison, Section 80C/HRA investment proof verification, and TDS projection.',
    tags: ['85% Verified', 'Q3 Proof Review', 'Old vs New Regime'],
    footerCta: 'Review Tax Proofs',
    primaryMetric: '85% Verified',
    subtext: 'Q3 Proofs Under Review',
    statusColor: 'rose',
  },
];

export const DASHBOARD_KPI_CARDS = DASHBOARD_LAUNCHER_CARDS;
