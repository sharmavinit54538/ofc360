import { Finding } from '../shared/types';
import type { StatutoryConfigItem } from '@/features/payroll/types/payroll.types';

export interface NormalizedPayrollEmployee {
  id: string;
  employee_id: string;
  employee_name: string;
  employee_code: string;
  department: string;
  designation?: string;
  gross_pay: number; // in INR (paise converted to rupees)
  total_deductions: number; // in INR
  net_pay: number; // in INR
  paid_days: number;
  lop_days: number;
  bank_account_no?: string;
  pan_no?: string;
  status?: string;
  earnings_breakup: {
    basic: number;
    hra: number;
    special: number;
    variable: number;
    reimbursements?: number;
    gross: number;
  };
  deductions_breakup: {
    pf: number;
    esi: number;
    pt: number;
    lwf: number;
    tds: number;
    variable: number;
    total: number;
  };
  validation_status: string;
  validation_messages?: string[];
}

export interface PayrollAuditConfig {
  variancePercentThreshold: number; // default 15 (%)
  varianceAmountThreshold: number; // default 10,000 (INR)
  robustZThreshold: number; // default 3.0
  roundNumberThreshold: number; // default 10,000 (INR)
  roundNumberMultiples: number[]; // default [5000, 10000, 50000]
  maxReimbursementShare: number; // default 0.5 (50% of basic)
  statutoryTolerance: number; // default 5 (INR)
  defaultDaysInMonth: number; // default 30
}

export interface PayrollAuditSummaryData {
  totalExposure: number;
  criticalCount: number;
  warnCount: number;
  noticeCount: number;
  totalEmployeesAudited: number;
  cleanEmployeesCount: number;
  findingsByRule: Record<string, number>;
  findingsByDepartment: Record<string, number>;
}

export interface PayrollAuditResult {
  runId: string;
  runName: string;
  scannedAt: string;
  findings: Finding[];
  summary: PayrollAuditSummaryData;
  employees: NormalizedPayrollEmployee[];
}

