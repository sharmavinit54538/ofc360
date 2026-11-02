import { Finding } from '../shared/types';
import { robustZ } from '../shared/stats';
import type { StatutoryConfigItem } from '@/features/payroll/types/payroll.types';
import { DEFAULT_PAYROLL_AUDIT_CONFIG } from './config';
import {
  NormalizedPayrollEmployee,
  PayrollAuditConfig,
  PayrollAuditResult,
  PayrollAuditSummaryData,
} from './types';

export interface AuditContext {
  employees: NormalizedPayrollEmployee[];
  prevEmployees?: NormalizedPayrollEmployee[];
  statutoryConfig?: StatutoryConfigItem | null;
  workforceEmployees?: Array<{ id: string; status?: string; exitDate?: string; officialExitDate?: string }>;
  exitCases?: Array<{ employeeId?: string; status?: string; effectiveDate?: string; exitDate?: string }>;
  daysInMonth?: number;
  config?: Partial<PayrollAuditConfig>;
  runId?: string;
  runName?: string;
}

/**
 * P1: Arithmetic Integrity
 */
export function evaluateRuleP1(emp: NormalizedPayrollEmployee): Finding[] {
  const findings: Finding[] = [];
  const earningsSum =
    (emp.earnings_breakup.basic || 0) +
    (emp.earnings_breakup.hra || 0) +
    (emp.earnings_breakup.special || 0) +
    (emp.earnings_breakup.variable || 0) +
    (emp.earnings_breakup.reimbursements || 0);

  const grossDelta = Math.abs(earningsSum - emp.gross_pay);
  if (grossDelta > 1.0) {
    findings.push({
      id: `P1-GROSS-${emp.id}`,
      rule_id: 'P1',
      severity: 'critical',
      subject_ref: `emp_${emp.employee_code || emp.id.slice(0, 6)}`,
      amount_at_risk: Math.round(grossDelta * 100) / 100,
      evidence: {
        component: 'gross_earnings',
        reported_gross: emp.gross_pay,
        sum_of_earnings: Math.round(earningsSum * 100) / 100,
        discrepancy: Math.round(grossDelta * 100) / 100,
      },
      review_action: 'Recompute gross earnings against contract component sums before finalizing disbursement.',
    });
  }

  const expectedNet = emp.gross_pay - emp.total_deductions;
  const netDelta = Math.abs(expectedNet - emp.net_pay);
  if (netDelta > 1.0) {
    findings.push({
      id: `P1-NET-${emp.id}`,
      rule_id: 'P1',
      severity: 'critical',
      subject_ref: `emp_${emp.employee_code || emp.id.slice(0, 6)}`,
      amount_at_risk: Math.round(netDelta * 100) / 100,
      evidence: {
        component: 'net_pay',
        reported_net: emp.net_pay,
        gross_pay: emp.gross_pay,
        total_deductions: emp.total_deductions,
        expected_net: Math.round(expectedNet * 100) / 100,
        discrepancy: Math.round(netDelta * 100) / 100,
      },
      review_action: 'Verify net formula: Gross Earnings minus Total Deductions should equal Net Pay.',
    });
  }

  return findings;
}

/**
 * P2: Ghost Employees
 */
export function evaluateRuleP2(
  emp: NormalizedPayrollEmployee,
  workforceMap: Map<string, { status?: string; exitDate?: string }>,
  exitMap: Map<string, { status?: string; exitDate?: string }>
): Finding[] {
  const findings: Finding[] = [];
  const wf = workforceMap.get(emp.employee_id) || workforceMap.get(emp.id);
  const exit = exitMap.get(emp.employee_id) || exitMap.get(emp.id);

  const isInactive =
    emp.status?.toUpperCase() === 'INACTIVE' ||
    emp.status?.toUpperCase() === 'TERMINATED' ||
    emp.status?.toUpperCase() === 'EXITED' ||
    wf?.status?.toUpperCase() === 'INACTIVE' ||
    wf?.status?.toUpperCase() === 'TERMINATED' ||
    wf?.status?.toUpperCase() === 'EXITED';

  if (isInactive && emp.net_pay > 0) {
    findings.push({
      id: `P2-GHOST-${emp.id}`,
      rule_id: 'P2',
      severity: 'critical',
      subject_ref: `emp_${emp.employee_code || emp.id.slice(0, 6)}`,
      amount_at_risk: emp.net_pay,
      evidence: {
        employee_status: wf?.status || emp.status || 'UNKNOWN',
        exit_date: wf?.exitDate || exit?.exitDate || 'RECORDED_EXIT',
        net_pay: emp.net_pay,
        paid_days: emp.paid_days,
      },
      review_action: 'Immediate hold on disbursement: Employee is marked inactive or exited in HRIS.',
    });
  }

  return findings;
}

/**
 * P3: Duplicate Bank Account / PAN
 */
export function evaluateRuleP3(employees: NormalizedPayrollEmployee[]): Finding[] {
  const findings: Finding[] = [];
  const bankMap = new Map<string, NormalizedPayrollEmployee[]>();
  const panMap = new Map<string, NormalizedPayrollEmployee[]>();

  for (const emp of employees) {
    if (emp.bank_account_no && emp.bank_account_no.trim().length > 4 && emp.bank_account_no !== 'N/A') {
      const list = bankMap.get(emp.bank_account_no) || [];
      list.push(emp);
      bankMap.set(emp.bank_account_no, list);
    }
    if (emp.pan_no && emp.pan_no.trim().length > 5 && emp.pan_no !== 'N/A') {
      const list = panMap.get(emp.pan_no.toUpperCase()) || [];
      list.push(emp);
      panMap.set(emp.pan_no.toUpperCase(), list);
    }
  }

  for (const [bank, emps] of bankMap.entries()) {
    if (emps.length > 1) {
      for (const emp of emps) {
        const others = emps.filter((e) => e.id !== emp.id).map((e) => `emp_${e.employee_code || e.id.slice(0, 6)}`);
        findings.push({
          id: `P3-BANK-${emp.id}`,
          rule_id: 'P3',
          severity: 'critical',
          subject_ref: `emp_${emp.employee_code || emp.id.slice(0, 6)}`,
          amount_at_risk: emp.net_pay,
          evidence: {
            duplicate_field: 'bank_account_no',
            masked_account: `••••${bank.slice(-4)}`,
            shared_with: others,
          },
          review_action: 'Audit bank disbursement routing: multiple employees share identical bank details.',
        });
      }
    }
  }

  for (const [pan, emps] of panMap.entries()) {
    if (emps.length > 1) {
      for (const emp of emps) {
        const others = emps.filter((e) => e.id !== emp.id).map((e) => `emp_${e.employee_code || e.id.slice(0, 6)}`);
        findings.push({
          id: `P3-PAN-${emp.id}`,
          rule_id: 'P3',
          severity: 'critical',
          subject_ref: `emp_${emp.employee_code || emp.id.slice(0, 6)}`,
          amount_at_risk: emp.net_pay,
          evidence: {
            duplicate_field: 'pan_no',
            masked_pan: `•••••${pan.slice(-4)}`,
            shared_with: others,
          },
          review_action: 'Verify tax identity: identical PAN assigned to multiple payroll records.',
        });
      }
    }
  }

  return findings;
}

/**
 * P4: Proration Anomaly
 */
export function evaluateRuleP4(emp: NormalizedPayrollEmployee, totalDays: number): Finding[] {
  const findings: Finding[] = [];

  // Zero paid days but positive pay
  if (emp.paid_days === 0 && emp.net_pay > 0) {
    findings.push({
      id: `P4-ZERO-DAYS-${emp.id}`,
      rule_id: 'P4',
      severity: 'warn',
      subject_ref: `emp_${emp.employee_code || emp.id.slice(0, 6)}`,
      amount_at_risk: emp.net_pay,
      evidence: {
        paid_days: emp.paid_days,
        lop_days: emp.lop_days,
        net_pay: emp.net_pay,
      },
      review_action: 'Check attendance integration: Employee has 0 paid days but positive payroll disbursement.',
    });
  }

  // Significant LOP but unreduced gross
  if (emp.lop_days > 5 && emp.gross_pay >= (emp.earnings_breakup.gross || 0) && emp.earnings_breakup.gross > 0) {
    const dailyRate = emp.gross_pay / totalDays;
    const estimatedExposure = Math.round(dailyRate * emp.lop_days);
    findings.push({
      id: `P4-UNPRORATED-LOP-${emp.id}`,
      rule_id: 'P4',
      severity: 'warn',
      subject_ref: `emp_${emp.employee_code || emp.id.slice(0, 6)}`,
      amount_at_risk: estimatedExposure,
      evidence: {
        lop_days: emp.lop_days,
        paid_days: emp.paid_days,
        reported_gross: emp.gross_pay,
        standard_gross: emp.earnings_breakup.gross,
        estimated_unprorated_amount: estimatedExposure,
      },
      review_action: 'Verify loss-of-pay deductions: Full monthly pay calculated despite recorded absence days.',
    });
  }

  return findings;
}

/**
 * P5: Statutory Recomputation (PF / ESI / PT)
 */
export function evaluateRuleP5(
  emp: NormalizedPayrollEmployee,
  statutoryConfig?: StatutoryConfigItem | null,
  tolerance = 5
): Finding[] {
  const findings: Finding[] = [];

  if (!statutoryConfig) {
    findings.push({
      id: `P5-NO-CONFIG-${emp.id}`,
      rule_id: 'P5',
      severity: 'notice',
      subject_ref: `emp_${emp.employee_code || emp.id.slice(0, 6)}`,
      amount_at_risk: 0,
      evidence: {
        status: 'STATUTORY_CONFIG_ABSENT',
        note: 'Statutory configuration not provided by backend. Rule P5 marked not evaluable.',
      },
      review_action: 'Configure statutory PF and ESI rates in Settings > Statutory Payroll.',
    });
    return findings;
  }

  // PF Check
  if (statutoryConfig.pf_enabled) {
    const basic = emp.earnings_breakup.basic || 0;
    const ceiling = statutoryConfig.pf_wage_ceiling || 15000;
    const applicableBasic = statutoryConfig.pf_on_full_basic ? basic : Math.min(basic, ceiling);
    const rawRate = statutoryConfig.employee_pf_rate || 12;
    const pfRate = rawRate > 0.5 ? rawRate / 100 : rawRate;
    const expectedPf = Math.round(applicableBasic * pfRate);
    const actualPf = emp.deductions_breakup.pf || 0;
    const pfDelta = Math.abs(expectedPf - actualPf);

    if (pfDelta > tolerance && basic > 0) {
      findings.push({
        id: `P5-PF-${emp.id}`,
        rule_id: 'P5',
        severity: 'critical',
        subject_ref: `emp_${emp.employee_code || emp.id.slice(0, 6)}`,
        amount_at_risk: pfDelta,
        evidence: {
          statutory_scheme: 'EPF',
          basic_salary: basic,
          statutory_ceiling: ceiling,
          expected_pf: expectedPf,
          actual_pf: actualPf,
          discrepancy: pfDelta,
        },
        review_action: 'Align EPF deduction with statutory 12% calculation on eligible basic wages.',
      });
    }
  }

  // ESI Check
  if (statutoryConfig.esi_enabled) {
    const gross = emp.gross_pay || 0;
    const ceiling = statutoryConfig.esi_wage_ceiling || 21000;
    if (gross <= ceiling && gross > 0) {
      const rawRate = statutoryConfig.employee_esi_rate || 0.75;
      const esiRate = rawRate > 0.05 ? rawRate / 100 : rawRate;
      const expectedEsi = Math.ceil(gross * esiRate);
      const actualEsi = emp.deductions_breakup.esi || 0;
      const esiDelta = Math.abs(expectedEsi - actualEsi);

      if (esiDelta > tolerance) {
        findings.push({
          id: `P5-ESI-${emp.id}`,
          rule_id: 'P5',
          severity: 'warn',
          subject_ref: `emp_${emp.employee_code || emp.id.slice(0, 6)}`,
          amount_at_risk: esiDelta,
          evidence: {
            statutory_scheme: 'ESIC',
            gross_earnings: gross,
            statutory_ceiling: ceiling,
            expected_esi: expectedEsi,
            actual_esi: actualEsi,
            discrepancy: esiDelta,
          },
          review_action: 'Verify ESIC deduction matches 0.75% of gross wages for employees under ₹21,000.',
        });
      }
    }
  }

  return findings;
}

/**
 * P6: MoM Variance Outliers & Robust Z
 */
export function evaluateRuleP6(
  emp: NormalizedPayrollEmployee,
  prevEmp?: NormalizedPayrollEmployee,
  zScore?: number,
  config: PayrollAuditConfig = DEFAULT_PAYROLL_AUDIT_CONFIG
): Finding[] {
  const findings: Finding[] = [];

  if (prevEmp && prevEmp.net_pay > 0) {
    const delta = emp.net_pay - prevEmp.net_pay;
    const absDelta = Math.abs(delta);
    const pctDelta = (absDelta / prevEmp.net_pay) * 100;

    if (pctDelta > config.variancePercentThreshold && absDelta > config.varianceAmountThreshold) {
      findings.push({
        id: `P6-MOM-VARIANCE-${emp.id}`,
        rule_id: 'P6',
        severity: 'warn',
        subject_ref: `emp_${emp.employee_code || emp.id.slice(0, 6)}`,
        amount_at_risk: absDelta,
        evidence: {
          previous_net_pay: prevEmp.net_pay,
          current_net_pay: emp.net_pay,
          net_change_inr: delta,
          percentage_change: Math.round(pctDelta * 10) / 10,
        },
        review_action: 'Review salary adjustment or incentive causing large month-over-month net pay variance.',
      });
    }
  }

  if (zScore !== undefined && Math.abs(zScore) >= config.robustZThreshold) {
    findings.push({
      id: `P6-ROBUST-Z-${emp.id}`,
      rule_id: 'P6',
      severity: 'warn',
      subject_ref: `emp_${emp.employee_code || emp.id.slice(0, 6)}`,
      amount_at_risk: 0,
      evidence: {
        robust_z_score: Math.round(zScore * 100) / 100,
        threshold: config.robustZThreshold,
        net_pay: emp.net_pay,
      },
      review_action: 'Statistical outlier: Employee compensation deviates significantly from batch median.',
    });
  }

  return findings;
}

/**
 * P7: Backend Validation Engine Errors
 */
export function evaluateRuleP7(emp: NormalizedPayrollEmployee): Finding[] {
  const findings: Finding[] = [];

  const isInvalid =
    emp.validation_status?.toUpperCase() === 'INVALID' ||
    emp.validation_status?.toUpperCase() === 'ERROR' ||
    emp.validation_status?.toUpperCase() === 'FAILED';

  if (isInvalid || (emp.validation_messages && emp.validation_messages.length > 0)) {
    findings.push({
      id: `P7-BACKEND-VALIDATION-${emp.id}`,
      rule_id: 'P7',
      severity: 'warn',
      subject_ref: `emp_${emp.employee_code || emp.id.slice(0, 6)}`,
      amount_at_risk: emp.net_pay,
      evidence: {
        validation_status: emp.validation_status,
        messages: emp.validation_messages || ['Backend calculation flag raised'],
      },
      review_action: 'Resolve backend engine validation errors before proceeding with bank approval.',
    });
  }

  return findings;
}

/**
 * P8: Suspicious Round Numbers & Sanity Limits
 */
export function evaluateRuleP8(
  emp: NormalizedPayrollEmployee,
  config: PayrollAuditConfig = DEFAULT_PAYROLL_AUDIT_CONFIG
): Finding[] {
  const findings: Finding[] = [];

  // Negative net pay
  if (emp.net_pay < 0) {
    findings.push({
      id: `P8-NEGATIVE-NET-${emp.id}`,
      rule_id: 'P8',
      severity: 'critical',
      subject_ref: `emp_${emp.employee_code || emp.id.slice(0, 6)}`,
      amount_at_risk: Math.abs(emp.net_pay),
      evidence: {
        net_pay: emp.net_pay,
        gross_pay: emp.gross_pay,
        total_deductions: emp.total_deductions,
      },
      review_action: 'Block payroll: Deductions exceed gross earnings resulting in negative net pay.',
    });
  }

  // High round numbers
  if (emp.net_pay >= 50000 && emp.net_pay % config.roundNumberThreshold === 0) {
    findings.push({
      id: `P8-ROUND-NUMBER-${emp.id}`,
      rule_id: 'P8',
      severity: 'notice',
      subject_ref: `emp_${emp.employee_code || emp.id.slice(0, 6)}`,
      amount_at_risk: 0,
      evidence: {
        net_pay: emp.net_pay,
        round_multiple: config.roundNumberThreshold,
      },
      review_action: 'Audit ad-hoc lump sum: Net pay is an exact round integer multiple.',
    });
  }

  return findings;
}

/**
 * P9: Unreconciled Reimbursements & Spikes
 */
export function evaluateRuleP9(
  emp: NormalizedPayrollEmployee,
  config: PayrollAuditConfig = DEFAULT_PAYROLL_AUDIT_CONFIG
): Finding[] {
  const findings: Finding[] = [];
  const reimbursements = emp.earnings_breakup.reimbursements || 0;
  const basic = emp.earnings_breakup.basic || 0;

  if (basic > 0 && reimbursements > config.maxReimbursementShare * basic) {
    const excess = reimbursements - config.maxReimbursementShare * basic;
    findings.push({
      id: `P9-REIMBURSEMENT-SPIKE-${emp.id}`,
      rule_id: 'P9',
      severity: 'notice',
      subject_ref: `emp_${emp.employee_code || emp.id.slice(0, 6)}`,
      amount_at_risk: Math.round(excess),
      evidence: {
        reimbursements,
        basic_salary: basic,
        share_of_basic_pct: Math.round((reimbursements / basic) * 100),
        allowed_share_pct: Math.round(config.maxReimbursementShare * 100),
      },
      review_action: 'Verify expense reimbursement receipts: Non-taxable claims exceed 50% of monthly basic pay.',
    });
  }

  return findings;
}

/**
 * Comprehensive Deterministic Audit Runner
 */
export function runPayrollAudit(context: AuditContext): PayrollAuditResult {
  const config = { ...DEFAULT_PAYROLL_AUDIT_CONFIG, ...(context.config || {}) };
  const employees = context.employees;
  const totalDays = context.daysInMonth || config.defaultDaysInMonth;

  // Build lookup maps
  const workforceMap = new Map<string, { status?: string; exitDate?: string }>();
  if (context.workforceEmployees) {
    for (const wf of context.workforceEmployees) {
      workforceMap.set(wf.id, {
        status: wf.status,
        exitDate: wf.exitDate || wf.officialExitDate,
      });
    }
  }

  const exitMap = new Map<string, { status?: string; exitDate?: string }>();
  if (context.exitCases) {
    for (const ex of context.exitCases) {
      if (ex.employeeId) {
        exitMap.set(ex.employeeId, {
          status: ex.status,
          exitDate: ex.exitDate || ex.effectiveDate,
        });
      }
    }
  }

  const prevMap = new Map<string, NormalizedPayrollEmployee>();
  if (context.prevEmployees) {
    for (const pe of context.prevEmployees) {
      prevMap.set(pe.employee_id, pe);
      prevMap.set(pe.id, pe);
    }
  }

  // Precompute Robust Z-scores across all employees' net_pay
  const netValues = employees.map((e) => e.net_pay);
  const zScores = robustZ(netValues);

  const findings: Finding[] = [];
  const findingsByRule: Record<string, number> = {};
  const findingsByDepartment: Record<string, number> = {};
  const employeeFindingCounts = new Map<string, number>();

  // Evaluate batch-wide Rule P3
  const p3Findings = evaluateRuleP3(employees);
  findings.push(...p3Findings);

  // Evaluate individual rules for each employee
  employees.forEach((emp, index) => {
    const prevEmp = prevMap.get(emp.employee_id) || prevMap.get(emp.id);
    const zScore = zScores[index];

    const empFindings = [
      ...evaluateRuleP1(emp),
      ...evaluateRuleP2(emp, workforceMap, exitMap),
      ...evaluateRuleP4(emp, totalDays),
      ...evaluateRuleP5(emp, context.statutoryConfig, config.statutoryTolerance),
      ...evaluateRuleP6(emp, prevEmp, zScore, config),
      ...evaluateRuleP7(emp),
      ...evaluateRuleP8(emp, config),
      ...evaluateRuleP9(emp, config),
    ];

    findings.push(...empFindings);
  });

  // Calculate summary metrics
  let totalExposure = 0;
  let criticalCount = 0;
  let warnCount = 0;
  let noticeCount = 0;

  for (const finding of findings) {
    if (finding.severity === 'critical') {
      criticalCount++;
      totalExposure += finding.amount_at_risk || 0;
    } else if (finding.severity === 'warn') {
      warnCount++;
      totalExposure += finding.amount_at_risk || 0;
    } else {
      noticeCount++;
    }

    findingsByRule[finding.rule_id] = (findingsByRule[finding.rule_id] || 0) + 1;

    // Attribute to department if findable
    const empMatch = employees.find(
      (e) => `emp_${e.employee_code || e.id.slice(0, 6)}` === finding.subject_ref
    );
    const dept = empMatch?.department || 'Unassigned';
    findingsByDepartment[dept] = (findingsByDepartment[dept] || 0) + 1;

    if (empMatch) {
      employeeFindingCounts.set(empMatch.id, (employeeFindingCounts.get(empMatch.id) || 0) + 1);
    }
  }

  const cleanEmployeesCount = employees.filter((e) => !employeeFindingCounts.has(e.id)).length;

  const summary: PayrollAuditSummaryData = {
    totalExposure: Math.round(totalExposure),
    criticalCount,
    warnCount,
    noticeCount,
    totalEmployeesAudited: employees.length,
    cleanEmployeesCount,
    findingsByRule,
    findingsByDepartment,
  };

  return {
    runId: context.runId || 'current-run',
    runName: context.runName || 'Audit Cycle',
    scannedAt: new Date().toISOString(),
    findings,
    summary,
    employees,
  };
}
