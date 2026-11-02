import { describe, it, expect } from 'vitest';
import {
  median,
  mad,
  robustZ,
  topN,
  share,
  momDelta,
} from '../stats';
import { sanitizeCellForCsv } from '../components/ExportButton';
import {
  sanitizeEvidence,
  prepareFindingsForExplain,
} from '../useExplain';
import type { Finding } from '../types';

describe('AI Tools Shared Stats Module', () => {
  it('calculates median correctly for odd and even length arrays', () => {
    expect(median([])).toBe(0);
    expect(median([5])).toBe(5);
    expect(median([1, 3, 2])).toBe(2);
    expect(median([10, 40, 20, 30])).toBe(25);
  });

  it('calculates MAD (Median Absolute Deviation)', () => {
    // Array: [1, 2, 3, 4, 5, 6, 7] -> median = 4
    // Deviations: [3, 2, 1, 0, 1, 2, 3] -> sorted: [0, 1, 1, 2, 2, 3, 3] -> median = 2
    expect(mad([1, 2, 3, 4, 5, 6, 7])).toBe(2);
    expect(mad([])).toBe(0);
  });

  it('calculates robustZ score safely with zero MAD fallback', () => {
    const medVal = 100;
    const madVal = 10;
    // z = (130 - 100) / (1.4826 * 10) = 30 / 14.826 ~= 2.023
    const z = robustZ(130, medVal, madVal);
    expect(z).toBeCloseTo(2.023, 2);

    // Safeguard when mad is 0
    expect(robustZ(100, medVal, 0)).toBe(0);
  });

  it('ranks and returns top N items', () => {
    const items = [
      { id: 'a', score: 10 },
      { id: 'b', score: 50 },
      { id: 'c', score: 30 },
      { id: 'd', score: 90 },
    ];
    const top2 = topN(items, (x) => x.score, 2);
    expect(top2.map((x) => x.id)).toEqual(['d', 'b']);
    expect(topN([], () => 0, 5)).toEqual([]);
  });

  it('calculates percentage share with division by zero guard', () => {
    expect(share(25, 100)).toBe(25);
    expect(share(1, 3)).toBe(33.33);
    expect(share(50, 0)).toBe(0);
  });

  it('computes MoM / Run delta and percentage change', () => {
    expect(momDelta(120, 100)).toEqual({ diff: 20, pct: 20 });
    expect(momDelta(80, 100)).toEqual({ diff: -20, pct: -20 });
    expect(momDelta(50, 0)).toEqual({ diff: 50, pct: 100 });
  });
});

describe('Export CSV Formula Injection Guard', () => {
  it('prefixes single quote if cell starts with dangerous formula characters', () => {
    expect(sanitizeCellForCsv('=SUM(A1:B1)')).toBe("'=SUM(A1:B1)");
    expect(sanitizeCellForCsv('+123456789')).toBe("'+123456789");
    expect(sanitizeCellForCsv('-CMD')).toBe("'-CMD");
    expect(sanitizeCellForCsv('@SUM()')).toBe("'@SUM()");
    expect(sanitizeCellForCsv('Safe text')).toBe('Safe text');
    expect(sanitizeCellForCsv(12345)).toBe(12345);
    expect(sanitizeCellForCsv(null)).toBe('');
  });
});

describe('useExplain PII Sanitization & Guard', () => {
  it('strips sensitive PII keys and values from evidence', () => {
    const evidence = {
      employeeName: 'Rahul Sharma',
      email: 'rahul@example.com',
      panNumber: 'ABCDE1234F',
      bankAccount: '998877665544',
      phoneNumber: '+919876543210',
      grossSalary: 85000,
      lopDays: 2,
      department: 'Engineering',
    };

    const clean = sanitizeEvidence(evidence);

    expect(clean.grossSalary).toBe(85000);
    expect(clean.lopDays).toBe(2);
    expect(clean.department).toBe('Engineering');
    expect((clean as any).employeeName).toBeUndefined();
    expect((clean as any).email).toBeUndefined();
    expect((clean as any).panNumber).toBeUndefined();
    expect((clean as any).bankAccount).toBeUndefined();
    expect((clean as any).phoneNumber).toBeUndefined();
  });

  it('prepareFindingsForExplain orders by severity and limits payload to max 200', () => {
    const findings: Finding[] = [
      {
        id: 'f1',
        ruleId: 'R1',
        severity: 'info',
        subjectRef: 'emp_01',
        title: 'Info notice',
        evidence: { net: 1000 },
        sourceEndpoints: ['/api/v1/test'],
        suggestedAction: 'Review',
      },
      {
        id: 'f2',
        ruleId: 'R2',
        severity: 'critical',
        subjectRef: 'emp_02',
        title: 'Critical breach',
        evidence: { net: 5000 },
        sourceEndpoints: ['/api/v1/test'],
        suggestedAction: 'Hold',
      },
      {
        id: 'f3',
        ruleId: 'R3',
        severity: 'warn',
        subjectRef: 'emp_03',
        title: 'Warning flag',
        evidence: { net: 2000 },
        sourceEndpoints: ['/api/v1/test'],
        suggestedAction: 'Check',
      },
    ];

    const prepared = prepareFindingsForExplain(findings);
    expect(prepared.map((f) => f.id)).toEqual(['f2', 'f3', 'f1']); // critical, warn, info
  });
});

