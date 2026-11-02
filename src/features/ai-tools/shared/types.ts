/**
 * @file types.ts
 * @description Canonical contract and types for OFC360 AI Hub tools.
 */

export type Severity = 'info' | 'warn' | 'critical';

export type FindingStatus = 'OPEN' | 'ACKNOWLEDGED' | 'DISMISSED' | 'ESCALATED';

export interface Finding {
  id: string; // stable identifier or hash of ruleId+subjectRef+period
  ruleId: string; // e.g. "PAY-P1-ARITHMETIC", "SFT-R1-CHRONIC-LATE"
  severity: Severity;
  subjectRef: string; // pseudonymous ref (e.g. "emp_7f3a") or department ID
  title: string;
  evidence: Record<string, string | number | boolean | null>;
  amountAtRiskInr?: number;
  period?: string; // "2026-10" or ISO date
  sourceEndpoints: string[];
  suggestedAction: string;
}

export interface FindingWithStatus extends Finding {
  status: FindingStatus;
  dismissedReason?: string;
  updatedAt?: string;
}

export interface ExplainRequest {
  period: { from: string; to: string };
  scope: { departmentId?: string };
  metrics: Record<string, number>;
  findings: Finding[]; // <= 200, pseudonymized, highest severity first
  assumptions: Record<string, number | string>;
}

export interface ExplainPriority {
  findingIds: string[];
  action: string;
  rationale: string;
}

export interface ExplainResponse {
  summary: string;
  priorities: ExplainPriority[];
  risks: string[];
  questionsForHr: string[];
  confidence: 'low' | 'medium' | 'high';
  modelUsed: string;
  generatedAt: string;
}

export type ExplainStatus = 'idle' | 'loading' | 'success' | 'backend_pending' | 'error';

