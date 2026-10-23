/**
 * @file payroll.types.ts
 * @description API contracts for payroll processing, payslips, compensation,
 * adjustments, and employee tax declarations.
 */

export type PayrollScope = 'MY' | 'ALL';
export type TaxRegime = 'NEW_REGIME' | 'OLD_REGIME';
export type PayrollRunStatus = 'DRAFT' | 'PROCESSING' | 'APPROVED' | 'PAID' | 'REJECTED';
export type PayslipStatus = 'DRAFT' | 'GENERATED' | 'PAID' | 'ON_HOLD';
export type TaxDeclarationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';

export interface PayrollStats {
  month: number;
  year: number;
  totalGrossPayroll: number;
  totalNetPayable: number;
  totalDeductions: number;
  statutoryBreakdown: {
    pfTotal: number;
    esiTotal: number;
    ptTotal: number;
    tdsTotal: number;
  };
  employeesProcessed: number;
  onHoldCount: number;
  currentRunStatus: 'NOT_STARTED' | 'DRAFT' | 'PROCESSING' | 'APPROVED' | 'PAID';
  payDate: string;
}

export interface PayrollRunItem {
  id: string;
  month: number;
  year: number;
  totalEmployees: number;
  grossAmount: number;
  totalDeductions: number;
  netPayable: number;
  status: PayrollRunStatus;
  initiatedBy: string;
  disbursedAt?: string | null;
  transactionReference?: string | null;
}

export interface InitiatePayrollPayload {
  month: number;
  year: number;
  includeApprovedExpenses: boolean;
  syncAttendanceLop: boolean;
  notes?: string;
}

export interface UpdatePayrollRunStatusPayload {
  status: 'APPROVED' | 'PAID' | 'REJECTED';
  transactionReference?: string;
  remarks?: string;
}

export interface PayslipItem {
  id: string;
  month: number;
  year: number;
  employee: {
    id: string;
    employeeCode: string;
    name: string;
    department: string;
    designation: string;
    panNumber?: string;
    bankAccountMasked?: string;
  };
  attendanceSummary: {
    totalWorkingDays: number;
    paidDays: number;
    lopDays: number;
  };
  earnings: {
    basic: number;
    hra: number;
    specialAllowance: number;
    bonus: number;
    reimbursements: number;
    grossEarnings: number;
  };
  deductions: {
    pfEmployee: number;
    esi: number;
    professionalTax: number;
    tds: number;
    lopDeduction: number;
    totalDeductions: number;
  };
  netPay: number;
  currency: string;
  status: PayslipStatus;
  paidAt?: string | null;
}

export interface SalaryStructureItem {
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  department: string;
  annualCtc: number;
  monthlyGross: number;
  basic: number;
  hra: number;
  specialAllowance: number;
  pfEmployer: number;
  taxRegime: TaxRegime;
  effectiveFrom: string;
}

export interface PayrollAdjustmentPayload {
  employeeId: string;
  month: number;
  year: number;
  type: 'BONUS' | 'ARREAR' | 'INCENTIVE' | 'DEDUCTION' | 'RECOVERY';
  amount: number;
  isTaxable: boolean;
  reason: string;
}

export interface TaxDeclarationItem {
  id: string;
  employeeId: string;
  employeeName: string;
  financialYear: string;
  regime: TaxRegime;
  section80C: number;
  section80D: number;
  hraRentAnnual: number;
  status: TaxDeclarationStatus;
}

export interface PayrollFilterParams {
  page: number;
  limit: number;
  month: number;
  year: number;
  departmentId?: string;
  status?: string;
  scope: PayrollScope;
  search?: string;
}

export interface PayslipListResponse {
  items: PayslipItem[];
  total: number;
  page: number;
  limit: number;
}

export interface SalaryStructureFilterParams {
  page: number;
  limit: number;
  departmentId?: string;
  search?: string;
}

export interface SalaryStructureListResponse {
  items: SalaryStructureItem[];
  total: number;
  page: number;
  limit: number;
}

export interface UpdateSalaryStructurePayload {
  annualCtc: number;
  basic: number;
  hra: number;
  specialAllowance: number;
  taxRegime: TaxRegime;
  effectiveFrom: string;
}

export interface TaxDeclarationQueryParams {
  financialYear: string;
  scope: PayrollScope;
  status?: string;
}

export interface TaxDeclarationPayload {
  financialYear: string;
  regime: TaxRegime;
  section80C: number;
  section80D: number;
  hraRentAnnual: number;
}
