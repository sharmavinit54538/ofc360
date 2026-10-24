/**
 * @file payroll.types.ts
 * @description Production TypeScript contracts for Indian Statutory Payroll Engine,
 * pay components, lifecycle runs, multi-stage approval stepper, payslips, and tax declarations.
 */

export type PayrollScope = 'MY' | 'ALL';
export type TaxRegime = 'NEW_REGIME' | 'OLD_REGIME' | 'NEW' | 'OLD';

export type PayrollRunStatus =
  | 'DRAFT'
  | 'PROCESSING'
  | 'PROCESSED'
  | 'APPROVED'
  | 'FINALIZED'
  | 'PAID'
  | 'REJECTED'
  | 'CANCELLED';

export type PayslipStatus = 'DRAFT' | 'GENERATED' | 'PAID' | 'ON_HOLD' | 'PENDING';
export type TaxDeclarationStatus = 'PENDING' | 'VERIFIED' | 'APPROVED' | 'REJECTED';

export type PayComponentType = 'earning' | 'deduction' | 'employer_contribution';
export type CalculationMethod =
  | 'flat'
  | 'percentage_of_basic'
  | 'percentage_of_ctc'
  | 'formula';

export interface PayComponentItem {
  id: string;
  company_id?: string | null;
  code: string;
  name: string;
  type: PayComponentType;
  taxable: boolean;
  statutory: boolean;
  calculation_method: CalculationMethod;
  default_percentage?: number | null;
  formula_expr?: string | null;
  description?: string | null;
  effective_date: string;
  is_active: boolean;
  created_at?: string | null;
}

export interface PayComponentCreatePayload {
  code: string;
  name: string;
  type: PayComponentType;
  taxable: boolean;
  statutory: boolean;
  calculation_method: CalculationMethod;
  default_percentage?: number | null;
  formula_expr?: string | null;
  description?: string | null;
  effective_date?: string;
}

export interface PayComponentUpdatePayload {
  name?: string;
  type?: PayComponentType;
  taxable?: boolean;
  statutory?: boolean;
  calculation_method?: CalculationMethod;
  default_percentage?: number | null;
  formula_expr?: string | null;
  description?: string | null;
  is_active?: boolean;
}

export interface EvaluateFormulaPayload {
  formula: string;
  sample_context?: Record<string, number>;
}

export interface EvaluateFormulaResult {
  formula: string;
  computed_value: number;
  context: Record<string, number>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Indian Statutory Types & Simulation Contracts
// ─────────────────────────────────────────────────────────────────────────────

export interface StatutoryConfigItem {
  id: string;
  company_id?: string | null;
  company_name?: string;
  pf_enabled: boolean;
  employee_pf_rate: number;
  employer_pf_rate: number;
  pf_wage_ceiling: number;
  pf_on_full_basic: boolean;
  esi_enabled: boolean;
  employee_esi_rate: number;
  employer_esi_rate: number;
  esi_wage_ceiling: number;
  pt_state: string;
  default_tax_regime: string;
  lop_basis: string;
  is_active: boolean;
}

export interface UpdateStatutoryConfigPayload {
  pfEnabled?: boolean;
  employeePfRate?: number;
  employerPfRate?: number;
  pfWageCeiling?: number;
  pfOnFullBasic?: boolean;
  esiEnabled?: boolean;
  employeeEsiRate?: number;
  employerEsiRate?: number;
  esiWageCeiling?: number;
  ptState?: string;
  defaultTaxRegime?: string;
}

export interface StatutorySimulationPayload {
  basicMonthlyPaise: number;
  hraMonthlyPaise?: number;
  specialAllowanceMonthlyPaise?: number;
  otherEarningsPaise?: number;
  paidDays?: number;
  totalDays?: number;
  state?: string;
  month?: number;
  taxRegime?: string;
  pfOnFullBasic?: boolean;
  declarations?: {
    section_80c?: number;
    section_80d?: number;
    section_80ccd1b_nps?: number;
    home_loan_interest_24b?: number;
    hra_claimed?: number;
    other_deductions?: number;
  };
}

export interface StatutorySimulationResult {
  inputs: {
    basic_monthly_paise: number;
    hra_monthly_paise: number;
    special_allowance_monthly_paise: number;
    paid_days: number;
    total_days: number;
    day_ratio: number;
    state: string;
    month: number;
    tax_regime: string;
    pf_on_full_basic: boolean;
  };
  earnings: {
    earned_basic_paise: number;
    earned_hra_paise: number;
    earned_special_paise: number;
    other_earnings_paise: number;
    earned_gross_paise: number;
    earned_gross_inr: number;
  };
  deductions: {
    employee_pf: {
      pf_wage_paise: number;
      employee_pf_paise: number;
      employer_epf_paise: number;
      employer_eps_paise: number;
      employer_edli_paise: number;
      employer_admin_paise: number;
      total_employer_pf_paise: number;
      total_pf_liability_paise: number;
      wage_ceiling_applied: boolean;
    };
    employee_esi: {
      is_applicable: boolean;
      gross_paise: number;
      employee_esi_paise: number;
      employer_esi_paise: number;
      total_esi_liability_paise: number;
      reason?: string;
    };
    professional_tax: {
      state: string;
      gross_paise: number;
      pt_paise: number;
      pt_inr: number;
      month: number;
    };
    labour_welfare_fund: {
      employee_lwf_paise: number;
      employer_lwf_paise: number;
      is_applicable: boolean;
      state: string;
      month: number;
    };
    tds: {
      tax_regime: string;
      annual_gross_paise: number;
      standard_deduction_paise: number;
      total_exemptions_paise: number;
      taxable_income_paise: number;
      tax_before_cess_paise: number;
      rebate_87a_paise: number;
      cess_paise: number;
      annual_tax_paise: number;
      remaining_months: number;
      monthly_tds_paise: number;
    };
    total_deductions_paise: number;
    total_deductions_inr: number;
  };
  employer_contributions: {
    employer_pf_paise: number;
    employer_eps_paise: number;
    employer_epf_paise: number;
    employer_edli_paise: number;
    employer_admin_paise: number;
    employer_esi_paise: number;
    employer_lwf_paise: number;
    gratuity_provision_paise: number;
  };
  take_home: {
    net_pay_paise: number;
    net_pay_inr: number;
  };
  employer_cost: {
    employer_ctc_monthly_paise: number;
    employer_ctc_monthly_inr: number;
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Payroll Run & Multi-Stage Approval Contracts
// ─────────────────────────────────────────────────────────────────────────────

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
  currentRunStatus: PayrollRunStatus | 'NOT_STARTED';
  payDate: string;
}

export interface PayrollRunItem {
  id: string;
  run_number?: string;
  month: number;
  year: number;
  period_month?: number;
  period_year?: number;
  totalEmployees: number;
  total_employees?: number;
  grossAmount: number;
  total_gross?: number;
  total_gross_paise?: number;
  totalDeductions: number;
  total_deductions?: number;
  total_deductions_paise?: number;
  netPayable: number;
  total_net?: number;
  total_net_paise?: number;
  status: PayrollRunStatus;
  validation_status?: 'PENDING' | 'VALID' | 'WARNING' | 'ERROR';
  is_locked?: boolean;
  initiatedBy?: string;
  run_by?: string | null;
  approved_by?: string | null;
  approved_at?: string | null;
  finalized_by?: string | null;
  finalized_at?: string | null;
  disbursedAt?: string | null;
  comments?: string | null;
  notes?: string | null;
  rejection_reason?: string | null;
  transactionReference?: string | null;
  created_at?: string;
}

export interface PayrollRunEmployeeItem {
  id: string;
  run_id: string;
  employee_id: string;
  employee_name?: string;
  employee_code?: string;
  department?: string;
  designation?: string;
  gross_earnings_paise: number;
  total_deductions_paise: number;
  net_pay_paise: number;
  paid_days: number;
  lop_days: number;
  status: string;
  validation_status: string;
  validation_messages?: string[];
  earnings_breakup?: {
    basic?: number;
    hra?: number;
    special?: number;
    variable?: number;
    gross?: number;
  };
  deductions_breakup?: {
    pf?: number;
    esi?: number;
    pt?: number;
    lwf?: number;
    tds?: number;
    variable?: number;
    total_deductions?: number;
    employer_pf?: number;
    employer_esi?: number;
    employer_lwf?: number;
    gratuity_provision?: number;
    employer_ctc_monthly?: number;
  };
}

export interface InitiatePayrollPayload {
  period_id?: string;
  month: number;
  year: number;
  includeApprovedExpenses?: boolean;
  syncAttendanceLop?: boolean;
  notes?: string;
}

export interface UpdatePayrollRunStatusPayload {
  status: 'APPROVED' | 'PAID' | 'REJECTED' | 'FINALIZED' | 'PROCESSING';
  transactionReference?: string;
  remarks?: string;
  notes?: string;
  reason?: string;
  lock?: boolean;
}

export interface PayslipItem {
  id: string;
  payslipNumber?: string;
  payslip_number?: string;
  month: number;
  year: number;
  period_month?: number;
  period_year?: number;
  employee: {
    id: string;
    employeeCode: string;
    name: string;
    department: string;
    designation: string;
    panNumber?: string;
    bankAccountMasked?: string;
    uan?: string;
    pfNumber?: string;
    esiNumber?: string;
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
    lwf?: number;
    lopDeduction: number;
    totalDeductions: number;
  };
  employerContributions?: {
    pfEmployer: number;
    esiEmployer: number;
    lwfEmployer: number;
    gratuity: number;
  };
  netPay: number;
  currency: string;
  status: PayslipStatus;
  payment_status?: string;
  paidAt?: string | null;
  taxRegime?: string;
}

export interface SalaryStructureItem {
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  department: string;
  annualCtc: number;
  annualCtcPaise?: number;
  monthlyGross: number;
  basic: number;
  basicMonthlyPaise?: number;
  hra: number;
  hraMonthlyPaise?: number;
  specialAllowance: number;
  specialAllowanceMonthlyPaise?: number;
  pfEmployer: number;
  taxRegime: TaxRegime;
  effectiveFrom: string;
  remarks?: string;
}

export interface UpdateSalaryStructurePayload {
  annualCtc: number;
  basicMonthly?: number;
  hraMonthly?: number;
  specialAllowanceMonthly?: number;
  taxRegime?: TaxRegime;
  effectiveFrom?: string;
  remarks?: string;
}

export interface PayrollAdjustmentPayload {
  employeeId: string;
  month: number;
  year: number;
  type: 'BONUS' | 'ARREAR' | 'INCENTIVE' | 'DEDUCTION' | 'RECOVERY' | 'overtime' | 'bonus' | 'reimbursement' | 'advance_recovery';
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
  section80CCD1B?: number;
  homeLoanInterest24B?: number;
  hraRentAnnual: number;
  otherDeductions?: number;
  status: TaxDeclarationStatus;
}

export interface TaxDeclarationPayload {
  employeeId: string;
  financialYear: string;
  regime: TaxRegime;
  section80C: number;
  section80D: number;
  section80CCD1B?: number;
  homeLoanInterest24B?: number;
  hraRentAnnual: number;
  otherDeductions?: number;
}

export interface PaymentBatchItem {
  id: string;
  run_id?: string;
  batch_number: string;
  status: 'PENDING' | 'SUBMITTED' | 'PROCESSED' | 'FAILED' | 'RECONCILED';
  total_amount_paise: number;
  total_amount_inr?: number;
  total_records: number;
  payment_mode: 'NEFT' | 'RTGS' | 'ACH' | 'IMPS';
  created_at?: string;
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

export interface TaxDeclarationQueryParams {
  financialYear: string;
  scope: PayrollScope;
  status?: string;
}
