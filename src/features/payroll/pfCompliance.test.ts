import { describe, expect, it } from 'vitest';

describe('EPFO PF ECR & Challan Statutory Compliance Rules', () => {
  // 1. UAN Validation
  describe('UAN & KYC Validation Rules', () => {
    const UAN_REGEX = /^\d{12}$/;

    it('validates strictly 12-digit numeric UAN format', () => {
      expect(UAN_REGEX.test('101234567890')).toBe(true);
      expect(UAN_REGEX.test('123456789012')).toBe(true);

      // Invalid cases
      expect(UAN_REGEX.test('12345678901')).toBe(false); // 11 digits
      expect(UAN_REGEX.test('1234567890123')).toBe(false); // 13 digits
      expect(UAN_REGEX.test('1012345ABC90')).toBe(false); // alphanumeric
      expect(UAN_REGEX.test(' 101234567890')).toBe(false); // spaces
      expect(UAN_REGEX.test('')).toBe(false); // empty
    });
  });

  // 2. Contribution Breakdown & Wage Ceiling
  describe('EPFO Contribution Split Calculations', () => {
    const PF_STATUTORY_CEILING = 15000;
    const EPS_MAX_MONTHLY_CAP = 1250; // 8.33% of ₹15,000 rounded = ₹1,250
    const EDLI_MAX_MONTHLY_CAP = 75; // 0.5% of ₹15,000 = ₹75
    const EPF_ADMIN_MINIMUM = 500; // Account 2 establishment minimum

    it('computes capped contribution for domestic worker with ceiling enabled', () => {
      const basicWage = 45000;
      const isCeilingApplicable = true;
      const isInternationalWorker = false;
      const age = 32;

      const epfWages = (isCeilingApplicable && !isInternationalWorker)
        ? Math.min(basicWage, PF_STATUTORY_CEILING)
        : basicWage;

      expect(epfWages).toBe(15000);

      // Employee PF: 12%
      const employeePf = Math.round(epfWages * 0.12);
      expect(employeePf).toBe(1800);

      // Employer EPS: 8.33% capped at ₹1,250
      const epsEligible = age < 58;
      const epsWages = epsEligible ? epfWages : 0;
      const employerEps = epsEligible
        ? Math.min(Math.round(epsWages * 0.0833), EPS_MAX_MONTHLY_CAP)
        : 0;
      expect(employerEps).toBe(1250);

      // Employer EPF Difference: 12% - EPS
      const employerEpfDiff = employeePf - employerEps;
      expect(employerEpfDiff).toBe(550);

      // EDLI (Account 21): 0.5% capped at ₹75
      const edli = Math.min(Math.round(epfWages * 0.005), EDLI_MAX_MONTHLY_CAP);
      expect(edli).toBe(75);

      // Total Employer PF (EPF diff + EPS) matches 12%
      expect(employerEps + employerEpfDiff).toBe(employeePf);
    });

    it('uncaps contributions for International Workers regardless of wage ceiling toggle', () => {
      const basicWage = 80000;
      const isInternationalWorker = true;
      const isCeilingApplicable = true; // should be bypassed for IW

      const epfWages = (!isInternationalWorker && isCeilingApplicable)
        ? Math.min(basicWage, PF_STATUTORY_CEILING)
        : basicWage;

      expect(epfWages).toBe(80000);

      // Employee PF on full basic
      const employeePf = Math.round(epfWages * 0.12);
      expect(employeePf).toBe(9600);

      // EPS on full basic (uncapped for IW)
      const employerEps = Math.round(epfWages * 0.0833);
      expect(employerEps).toBe(6664);

      // Employer EPF Diff
      const employerEpfDiff = employeePf - employerEps;
      expect(employerEpfDiff).toBe(2936);
    });

    it('sets EPS to 0 for employees aged 58 and above (all 12% goes to EPF)', () => {
      const basicWage = 15000;
      const age = 60;

      const employeePf = Math.round(basicWage * 0.12); // 1800
      const epsEligible = age < 58;
      const employerEps = epsEligible ? Math.round(basicWage * 0.0833) : 0;
      const employerEpfDiff = employeePf - employerEps;

      expect(employerEps).toBe(0);
      expect(employerEpfDiff).toBe(1800);
    });

    it('enforces Account 2 minimum admin charges rule of ₹500/month', () => {
      const calculatedAdminCharges = 120; // 0.5% of a small wage pool
      const finalAdminCharges = Math.max(calculatedAdminCharges, EPF_ADMIN_MINIMUM);
      expect(finalAdminCharges).toBe(500);
    });
  });

  // 3. EPFO ECR Text File Delimiter & 11 Columns
  describe('EPFO ECR v2.0 Text File Specification', () => {
    const DELIMITER = '#|~|#';

    it('formats exact 11 columns separated by #|~|# delimiter', () => {
      const record = {
        uan: '101234567890',
        memberName: 'RAHUL SHARMA',
        grossWages: 25000,
        epfWages: 15000,
        epsWages: 15000,
        edliWages: 15000,
        eeRemitted: 1800,
        epsRemitted: 1250,
        erDiffRemitted: 550,
        ncpDays: 2,
        refundOfAdvances: 0,
      };

      const columns = [
        record.uan,
        record.memberName,
        record.grossWages,
        record.epfWages,
        record.epsWages,
        record.edliWages,
        record.eeRemitted,
        record.epsRemitted,
        record.erDiffRemitted,
        record.ncpDays,
        record.refundOfAdvances,
      ];

      const ecrLine = columns.join(DELIMITER);

      expect(ecrLine).toContain('#|~|#');
      const parsedParts = ecrLine.split(DELIMITER);
      expect(parsedParts.length).toBe(11);
      expect(parsedParts[0]).toBe('101234567890');
      expect(parsedParts[1]).toBe('RAHUL SHARMA');
      expect(parsedParts[6]).toBe('1800'); // EE Share
      expect(parsedParts[7]).toBe('1250'); // EPS Share
      expect(parsedParts[8]).toBe('550'); // EPF Diff
      expect(parsedParts[9]).toBe('2'); // NCP Days
      expect(parsedParts[10]).toBe('0'); // Refund of Advances
    });
  });

  // 4. Section 7Q Interest & Section 14B Damages
  describe('EPFO Penalties & Statutory Due Date Tracking', () => {
    const calculateSection7Q = (amount: number, overdueDays: number) => {
      if (overdueDays <= 0) return 0;
      // 12% p.a. simple interest
      return Math.round((amount * 0.12 * overdueDays) / 365);
    };

    const calculateSection14B = (amount: number, overdueDays: number) => {
      if (overdueDays <= 0) return 0;
      let rate = 0.05; // 1 to 60 days: 5% p.a.
      if (overdueDays > 180) rate = 0.25; // >180 days: 25% p.a.
      else if (overdueDays > 120) rate = 0.15; // 121 to 180 days: 15% p.a.
      else if (overdueDays > 60) rate = 0.10; // 61 to 120 days: 10% p.a.

      return Math.round((amount * rate * overdueDays) / 365);
    };

    it('calculates Section 7Q interest at 12% p.a. for overdue days', () => {
      const remittance = 100000;
      const overdueDays = 30;
      const interest = calculateSection7Q(remittance, overdueDays);
      // (100000 * 0.12 * 30) / 365 ≈ 986
      expect(interest).toBe(986);
    });

    it('applies graded Section 14B damages according to delay tier', () => {
      const remittance = 100000;

      // Tier 1: 30 days delay -> 5% rate
      const damages30d = calculateSection14B(remittance, 30);
      expect(damages30d).toBe(Math.round((100000 * 0.05 * 30) / 365));

      // Tier 2: 90 days delay -> 10% rate
      const damages90d = calculateSection14B(remittance, 90);
      expect(damages90d).toBe(Math.round((100000 * 0.10 * 90) / 365));

      // Tier 3: 150 days delay -> 15% rate
      const damages150d = calculateSection14B(remittance, 150);
      expect(damages150d).toBe(Math.round((100000 * 0.15 * 150) / 365));

      // Tier 4: 200 days delay -> 25% rate
      const damages200d = calculateSection14B(remittance, 200);
      expect(damages200d).toBe(Math.round((100000 * 0.25 * 200) / 365));
    });
  });
});
