import { describe, it, expect } from 'vitest';
import {
  evaluateRuleP1,
  evaluateRuleP2,
  evaluateRuleP3,
  evaluateRuleP4,
  evaluateRuleP5,
  evaluateRuleP6,
  evaluateRuleP7,
  evaluateRuleP8,
  evaluateRuleP9,
  runPayrollAudit,
} from '../rules';
import { NormalizedPayrollEmployee } from '../types';
import type { StatutoryConfigItem } from '@/features/payroll/types/payroll.types';

const createMockEmployee = (overrides?: Partial<NormalizedPayrollEmployee>): NormalizedPayrollEmployee => ({
  id: 'emp-1',
  employee_id: 'e100',
  employee_name: 'Test Employee',
  employee_code: 'EMP100',
  department: 'Engineering',
  gross_pay: 50000,
  total_deductions: 5000,
  net_pay: 45000,
  paid_days: 30,
  lop_days: 0,
  bank_account_no: '98765432101',
  pan_no: 'ABCDE1234F',
  status: 'ACTIVE',
  earnings_breakup: {
    basic: 25000,
    hra: 15000,
    special: 10000,
    variable: 0,
    reimbursements: 0,
    gross: 50000,
  },
  deductions_breakup: {
    pf: 1800,
    esi: 0,
    pt: 200,
    lwf: 20,
    tds: 2980,
    variable: 0,
    total: 5000,
  },
  validation_status: 'VALID',
  validation_messages: [],
  ...overrides,
});

describe('Payroll Audit Rules (P1 to P9)', () => {
  it('P1: passes clean arithmetic integrity and flags gross/net discrepancy', () => {
    const cleanEmp = createMockEmployee();
    expect(evaluateRuleP1(cleanEmp)).toHaveLength(0);

    // Mismatched gross
    const badGrossEmp = createMockEmployee({
      gross_pay: 55000, // components sum to 50000
    });
    const grossFindings = evaluateRuleP1(badGrossEmp);
    expect(grossFindings).toHaveLength(2); // gross mismatch + net mismatch (55000 - 5000 != 45000)
    expect(grossFindings[0].rule_id).toBe('P1');
    expect(grossFindings[0].severity).toBe('critical');

    // Mismatched net
    const badNetEmp = createMockEmployee({
      net_pay: 40000, // 50000 - 5000 is 45000
    });
    const netFindings = evaluateRuleP1(badNetEmp);
    expect(netFindings).toHaveLength(1);
    expect(netFindings[0].evidence.discrepancy).toBe(5000);
  });

  it('P2: flags ghost employee when inactive/exited employee receives net pay', () => {
    const activeEmp = createMockEmployee();
    const wfMap = new Map();
    const exitMap = new Map();
    expect(evaluateRuleP2(activeEmp, wfMap, exitMap)).toHaveLength(0);

    // Marked inactive
    const inactiveEmp = createMockEmployee({ status: 'TERMINATED' });
    const findings = evaluateRuleP2(inactiveEmp, wfMap, exitMap);
    expect(findings).toHaveLength(1);
    expect(findings[0].rule_id).toBe('P2');
    expect(findings[0].amount_at_risk).toBe(45000);
  });

  it('P3: detects duplicate bank accounts and PAN numbers across employees', () => {
    const emp1 = createMockEmployee({ id: '1', employee_code: 'E1', bank_account_no: '111122223333' });
    const emp2 = createMockEmployee({ id: '2', employee_code: 'E2', bank_account_no: '111122223333' });
    const emp3 = createMockEmployee({ id: '3', employee_code: 'E3', bank_account_no: '999988887777' });

    const findings = evaluateRuleP3([emp1, emp2, emp3]);
    expect(findings).toHaveLength(2); // both emp1 and emp2 flagged
    expect(findings[0].rule_id).toBe('P3');
    expect(findings[0].evidence.duplicate_field).toBe('bank_account_no');
  });

  it('P4: flags zero paid days with positive pay, and unprorated full salary with excessive LOP', () => {
    const cleanEmp = createMockEmployee();
    expect(evaluateRuleP4(cleanEmp, 30)).toHaveLength(0);

    // Zero paid days but positive pay
    const zeroDaysEmp = createMockEmployee({ paid_days: 0, net_pay: 40000 });
    const f1 = evaluateRuleP4(zeroDaysEmp, 30);
    expect(f1).toHaveLength(1);
    expect(f1[0].rule_id).toBe('P4');

    // 10 LOP days but paid full unreduced gross
    const unproratedEmp = createMockEmployee({
      paid_days: 20,
      lop_days: 10,
      gross_pay: 50000,
      earnings_breakup: { basic: 25000, hra: 15000, special: 10000, variable: 0, gross: 50000 },
    });
    const f2 = evaluateRuleP4(unproratedEmp, 30);
    expect(f2).toHaveLength(1);
    expect(f2[0].evidence.lop_days).toBe(10);
  });

  it('P5: statutory recomputes PF and ESI or falls back gracefully without config', () => {
    const emp = createMockEmployee({
      earnings_breakup: { basic: 10000, hra: 5000, special: 0, variable: 0, gross: 15000 },
      deductions_breakup: { pf: 1200, esi: 113, pt: 200, lwf: 0, tds: 0, variable: 0, total: 1513 },
      gross_pay: 15000,
    });

    // Without statutory config -> Notice status (not evaluable)
    const noticeFindings = evaluateRuleP5(emp, null);
    expect(noticeFindings).toHaveLength(1);
    expect(noticeFindings[0].severity).toBe('notice');

    // With statutory config: 12% of 10,000 is 1,200 (Matches!)
    const mockConfig: StatutoryConfigItem = {
      id: 'stat-1',
      pf_enabled: true,
      employee_pf_rate: 12,
      employer_pf_rate: 12,
      pf_wage_ceiling: 15000,
      pf_on_full_basic: false,
      esi_enabled: true,
      employee_esi_rate: 0.75,
      employer_esi_rate: 3.25,
      esi_wage_ceiling: 21000,
      pt_state: 'KA',
      default_tax_regime: 'NEW',
      lop_basis: '30_DAYS',
      is_active: true,
    };
    expect(evaluateRuleP5(emp, mockConfig)).toHaveLength(0);

    // Bad PF: basic is 10,000 but PF deducted is only 500
    const badPfEmp = createMockEmployee({
      earnings_breakup: { basic: 10000, hra: 5000, special: 0, variable: 0, gross: 15000 },
      deductions_breakup: { pf: 500, esi: 113, pt: 200, lwf: 0, tds: 0, variable: 0, total: 813 },
      gross_pay: 15000,
    });
    const pfFindings = evaluateRuleP5(badPfEmp, mockConfig);
    expect(pfFindings).toHaveLength(1);
    expect(pfFindings[0].rule_id).toBe('P5');
    expect(pfFindings[0].evidence.expected_pf).toBe(1200);
    expect(pfFindings[0].evidence.actual_pf).toBe(500);
  });

  it('P6: detects MoM variance exceeding 15% and ₹10,000 threshold', () => {
    const current = createMockEmployee({ net_pay: 60000 });
    const prev = createMockEmployee({ net_pay: 40000 }); // +50% and +₹20,000 jump

    const findings = evaluateRuleP6(current, prev);
    expect(findings).toHaveLength(1);
    expect(findings[0].rule_id).toBe('P6');
    expect(findings[0].evidence.percentage_change).toBe(50);
  });

  it('P7: flags backend engine validation errors and messages', () => {
    const validEmp = createMockEmployee();
    expect(evaluateRuleP7(validEmp)).toHaveLength(0);

    const invalidEmp = createMockEmployee({
      validation_status: 'INVALID',
      validation_messages: ['TDS calculation mismatch for declared regime'],
    });
    const findings = evaluateRuleP7(invalidEmp);
    expect(findings).toHaveLength(1);
    expect(findings[0].rule_id).toBe('P7');
  });

  it('P8: flags negative net pay and suspicious round numbers', () => {
    const negEmp = createMockEmployee({ net_pay: -2500 });
    const f1 = evaluateRuleP8(negEmp);
    expect(f1).toHaveLength(1);
    expect(f1[0].severity).toBe('critical');

    const roundEmp = createMockEmployee({ net_pay: 70000 });
    const f2 = evaluateRuleP8(roundEmp);
    expect(f2).toHaveLength(1);
    expect(f2[0].severity).toBe('notice');
  });

  it('P9: flags unreconciled reimbursements exceeding 50% of basic pay', () => {
    const normalEmp = createMockEmployee({
      earnings_breakup: { basic: 20000, hra: 10000, special: 0, variable: 0, reimbursements: 5000, gross: 35000 },
    });
    expect(evaluateRuleP9(normalEmp)).toHaveLength(0);

    const spikeEmp = createMockEmployee({
      earnings_breakup: { basic: 20000, hra: 10000, special: 0, variable: 0, reimbursements: 15000, gross: 45000 },
    });
    const findings = evaluateRuleP9(spikeEmp);
    expect(findings).toHaveLength(1);
    expect(findings[0].rule_id).toBe('P9');
    expect(findings[0].amount_at_risk).toBe(5000); // 15000 - 10000
  });

  it('runPayrollAudit: runs full audit suite and aggregates summary metrics', () => {
    const employees = [
      createMockEmployee({ id: '1', employee_code: 'E1', net_pay: 45000 }),
      createMockEmployee({ id: '2', employee_code: 'E2', net_pay: 45000, status: 'TERMINATED' }), // Ghost
      createMockEmployee({ id: '3', employee_code: 'E3', net_pay: -1000 }), // Negative net
    ];

    const result = runPayrollAudit({
      employees,
      runId: 'run-apr-2026',
      runName: 'April 2026 Payroll',
    });

    expect(result.summary.totalEmployeesAudited).toBe(3);
    expect(result.summary.criticalCount).toBeGreaterThanOrEqual(2);
    expect(result.summary.cleanEmployeesCount).toBe(1);
    expect(result.summary.findingsByRule['P2']).toBe(1);
    expect(result.summary.findingsByRule['P8']).toBe(1);
  });
});

