/**
 * @file dashboardCalculators.ts
 * @description Analytical calculators for derived recruitment metrics:
 * CTC breakdown (50% Basic, 25% HRA, Special Allowance), Funnel Drop-off,
 * Time-to-Hire, Offer Acceptance, and Source Efficiency.
 */

import type { Candidate, CtcBreakdown, Interview, Offer, Stage } from '../types';

/**
 * Calculates a complete CTC salary breakdown with the standardized OFC360 compensation model:
 * - Basic Salary: 50% of annual CTC
 * - HRA (House Rent Allowance): 25% of annual CTC
 * - Special Allowance: Remainder (25% minus any deductions)
 * - Monthly Gross: annualCtc / 12
 */
export function calculateCtcBreakdown(
  annualCtc: number,
  joiningBonus = 0,
  performanceBonus = 0,
  esopValue = 0
): CtcBreakdown {
  const safeCtc = Math.max(0, annualCtc);
  const basicSalary = Math.round(safeCtc * 0.5);
  const hra = Math.round(safeCtc * 0.25);
  const specialAllowance = Math.max(0, safeCtc - basicSalary - hra);
  const monthlyGross = Math.round(safeCtc / 12);

  return {
    totalCtc: safeCtc,
    basicSalary,
    hra,
    specialAllowance,
    bonus: Math.max(0, performanceBonus),
    joiningBonus: Math.max(0, joiningBonus),
    esopValue: Math.max(0, esopValue),
    monthlyGross,
  };
}

/**
 * Calculates the average time-to-hire (in days) from candidate application date to hired date.
 */
export function calculateTimeToHireDays(candidates: Candidate[]): number {
  const hired = candidates.filter((c) => c.stage === 'hired');
  if (hired.length === 0) return 0;

  let totalDays = 0;
  let validCount = 0;

  for (const c of hired) {
    const appliedTime = Date.parse(c.appliedAt);
    if (!Number.isNaN(appliedTime)) {
      // Find hired timeline event if available or default to 30 days
      const hiredEvent = c.timeline.find((t) => t.title.toLowerCase().includes('hired'));
      const hiredTime = hiredEvent ? Date.parse(hiredEvent.at) : Date.now();
      const diffDays = Math.max(1, Math.round((hiredTime - appliedTime) / (1000 * 60 * 60 * 24)));
      totalDays += diffDays;
      validCount++;
    }
  }

  return validCount > 0 ? Math.round(totalDays / validCount) : 0;
}

export interface FunnelStageMetric {
  stage: Stage;
  label: string;
  count: number;
  conversionPercent: number; // percentage of original applied
  dropoffPercent: number;    // drop from previous stage
}

const STAGES_ORDER: Stage[] = [
  'applied',
  'screening',
  'assessment',
  'interview',
  'technical',
  'hr',
  'offer',
  'hired',
];

/**
 * Computes drop-off and conversion rates across the hiring pipeline.
 */
export function calculateFunnelDropoff(candidates: Candidate[]): FunnelStageMetric[] {
  const counts: Record<Stage, number> = {
    applied: 0,
    screening: 0,
    assessment: 0,
    interview: 0,
    technical: 0,
    hr: 0,
    offer: 0,
    hired: 0,
    rejected: 0,
  };

  for (const c of candidates) {
    if (counts[c.stage] !== undefined) {
      counts[c.stage]++;
    }
  }

  const totalApplied = candidates.length || 1;
  const metrics: FunnelStageMetric[] = [];
  let prevCount = totalApplied;

  for (const stage of STAGES_ORDER) {
    // In an ATS funnel, candidates who reached later stages also passed through earlier ones
    // Or we count exact stage residency:
    const stageIndex = STAGES_ORDER.indexOf(stage);
    const countAtOrBeyond = candidates.filter((c) => {
      const idx = STAGES_ORDER.indexOf(c.stage);
      return idx >= stageIndex;
    }).length;

    const conversionPercent = Math.round((countAtOrBeyond / totalApplied) * 100);
    const dropoffPercent = prevCount > 0 ? Math.max(0, Math.round(((prevCount - countAtOrBeyond) / prevCount) * 100)) : 0;

    metrics.push({
      stage,
      label: stage.charAt(0).toUpperCase() + stage.slice(1),
      count: countAtOrBeyond,
      conversionPercent,
      dropoffPercent,
    });

    prevCount = countAtOrBeyond;
  }

  return metrics;
}

/**
 * Calculates offer acceptance rate as percentage: accepted / (accepted + declined).
 */
export function calculateOfferAcceptanceRate(offers: Offer[]): { ratePercent: number; accepted: number; total: number } {
  const accepted = offers.filter((o) => o.status === 'accepted').length;
  const declined = offers.filter((o) => o.status === 'declined').length;
  const decided = accepted + declined;

  return {
    ratePercent: decided > 0 ? Math.round((accepted / decided) * 100) : offers.length > 0 ? 100 : 0,
    accepted,
    total: offers.length,
  };
}

/**
 * Computes source efficiency metrics (count of candidates and conversion to offer/hire by channel).
 */
export function calculateSourceEfficiency(candidates: Candidate[]): Array<{ source: string; candidates: number; hired: number; conversionRate: number }> {
  const map: Record<string, { candidates: number; hired: number }> = {};

  for (const c of candidates) {
    const src = c.source || 'DIRECT';
    if (!map[src]) {
      map[src] = { candidates: 0, hired: 0 };
    }
    map[src].candidates++;
    if (c.stage === 'hired' || c.stage === 'offer') {
      map[src].hired++;
    }
  }

  return Object.entries(map).map(([source, stats]) => ({
    source,
    candidates: stats.candidates,
    hired: stats.hired,
    conversionRate: stats.candidates > 0 ? Math.round((stats.hired / stats.candidates) * 100) : 0,
  }));
}

/**
 * Calculates a 0-100 overall pipeline health gauge score based on overdue interviews,
 * offer acceptance rate, and applicant velocity.
 */
export function calculatePipelineHealthScore(candidates: Candidate[], interviews: Interview[]): number {
  if (candidates.length === 0) return 80;

  const overdueCount = interviews.filter((i) => i.isOverdue && i.status === 'SCHEDULED').length;
  const overduePenalty = Math.min(30, overdueCount * 5);

  const activeCandidates = candidates.filter((c) => c.stage !== 'rejected' && c.stage !== 'hired').length;
  const volumeBonus = activeCandidates > 5 ? 10 : 0;

  const rejectedCount = candidates.filter((c) => c.stage === 'rejected').length;
  const rejectRatio = rejectedCount / candidates.length;
  const rejectPenalty = rejectRatio > 0.8 ? 15 : 0;

  const score = Math.max(10, Math.min(100, 85 - overduePenalty + volumeBonus - rejectPenalty));
  return score;
}
