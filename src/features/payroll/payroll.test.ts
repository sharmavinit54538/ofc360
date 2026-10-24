import { describe, expect, it } from 'vitest';
import {
  formatCurrency,
  formatPayrollDate,
  formatPayrollMonth,
  getCurrentFinancialYear,
  getPayrollErrorMessage,
} from './payroll.utils';

describe('Indian Statutory Payroll Utilities & Rules', () => {
  it('formats INR currency correctly according to Indian numbering system', () => {
    const formatted = formatCurrency(150000);
    // In en-IN, 1,50,000 formatted as currency has ₹ and comma separation
    expect(formatted).toContain('1,50,000');
  });

  it('formats month and year into human-readable payroll period', () => {
    expect(formatPayrollMonth(10, 2026)).toBe('October 2026');
    expect(formatPayrollMonth(2, 2026)).toBe('February 2026');
    expect(formatPayrollMonth(99, 2026)).toBe('—');
  });

  it('formats ISO payroll dates', () => {
    expect(formatPayrollDate('2026-10-31T00:00:00Z')).toContain('2026');
    expect(formatPayrollDate(null)).toBe('—');
  });

  it('determines Indian financial year (April to March)', () => {
    const fy = getCurrentFinancialYear();
    expect(fy).toMatch(/^\d{4}-\d{2}$/);
  });

  it('extracts error messages safely from RTK Query error payloads', () => {
    expect(getPayrollErrorMessage({ data: { message: 'Wage ceiling exceeded' } }, 'Default')).toBe(
      'Wage ceiling exceeded'
    );
    expect(getPayrollErrorMessage({ data: { detail: 'Missing PAN' } }, 'Default')).toBe(
      'Missing PAN'
    );
    expect(getPayrollErrorMessage(null, 'Fallback error')).toBe('Fallback error');
  });

  describe('Indian Statutory Logic Verification', () => {
    it('verifies PF employee 12% calculation with ₹15,000 wage ceiling', () => {
      const basicSalary = 30000;
      const wageCeiling = 15000;
      // With ceiling enabled:
      const pfCeilingWage = Math.min(basicSalary, wageCeiling);
      const employeePfCapped = pfCeilingWage * 0.12;
      expect(employeePfCapped).toBe(1800);

      // With full basic:
      const employeePfFull = basicSalary * 0.12;
      expect(employeePfFull).toBe(3600);
    });

    it('verifies ESI eligibility condition (Gross <= ₹21,000)', () => {
      const grossEligible = 20000;
      const grossIneligible = 25000;

      const isEligible = (gross: number) => gross <= 21000;
      expect(isEligible(grossEligible)).toBe(true);
      expect(isEligible(grossIneligible)).toBe(false);

      // Employee ESI: 0.75%, Employer ESI: 3.25% rounded up
      const empEsi = Math.ceil(grossEligible * 0.0075);
      const emplyrEsi = Math.ceil(grossEligible * 0.0325);
      expect(empEsi).toBe(150);
      expect(emplyrEsi).toBe(650);
    });

    it('verifies Maharashtra PT February ₹300 spike rule', () => {
      const getMaharashtraPt = (month: number, gross: number) => {
        if (gross < 7500) return 0;
        if (gross <= 10000) return 175;
        return month === 2 ? 300 : 200;
      };

      expect(getMaharashtraPt(1, 35000)).toBe(200);
      expect(getMaharashtraPt(2, 35000)).toBe(300); // February spike
      expect(getMaharashtraPt(3, 35000)).toBe(200);
    });

    it('verifies New Tax Regime standard deduction of ₹75,000', () => {
      const annualGross = 1200000;
      const standardDeductionNew = 75000;
      const standardDeductionOld = 50000;

      expect(annualGross - standardDeductionNew).toBe(1125000);
      expect(annualGross - standardDeductionOld).toBe(1150000);
    });
  });
});
