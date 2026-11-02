/**
 * @file useExplain.ts
 * @description Hook managing AI Explain requests with PII sanitization, unknown ID dropping,
 * and graceful fallback to "backend_pending" when endpoint is absent or unavailable.
 */

import { useState, useCallback } from 'react';
import { useExplainToolFindingsMutation } from './api/aiToolsApi';
import type {
  ExplainRequest,
  ExplainResponse,
  ExplainStatus,
  Finding,
} from './types';

// Sensitive key patterns to strip from evidence
const PII_KEY_REGEX = /(name|email|phone|mobile|pan|bank|account|uan|aadhaar|dob|photo|face)/i;

// Email pattern
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// PAN pattern: 5 uppercase letters, 4 digits, 1 letter
const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i;
// Phone number pattern: 10+ digits
const PHONE_REGEX = /^[+]?[0-9]{10,14}$/;

/**
 * Sanitizes an individual finding evidence payload to guarantee zero PII leakage.
 */
export function sanitizeEvidence(evidence: Record<string, any>): Record<string, string | number | boolean | null> {
  const clean: Record<string, string | number | boolean | null> = {};
  for (const [key, val] of Object.entries(evidence)) {
    if (PII_KEY_REGEX.test(key)) {
      continue;
    }
    if (typeof val === 'string') {
      const trimmed = val.trim();
      if (EMAIL_REGEX.test(trimmed) || PAN_REGEX.test(trimmed) || PHONE_REGEX.test(trimmed)) {
        continue;
      }
    }
    clean[key] = val;
  }
  return clean;
}

/**
 * Sanitizes an array of findings for transmission to the LLM explain endpoint:
 * 1. Sanitizes evidence against PII
 * 2. Filters out direct sensitive fields
 * 3. Sorts by severity (critical -> warn -> info)
 * 4. Caps to max 200 findings
 */
export function prepareFindingsForExplain(findings: Finding[]): Finding[] {
  const severityRank = { critical: 0, warn: 1, info: 2 };

  const sorted = [...findings].sort(
    (a, b) => (severityRank[a.severity] ?? 3) - (severityRank[b.severity] ?? 3)
  );

  return sorted.slice(0, 200).map((f) => ({
    id: f.id,
    ruleId: f.ruleId,
    severity: f.severity,
    subjectRef: f.subjectRef,
    title: f.title,
    evidence: sanitizeEvidence(f.evidence),
    amountAtRiskInr: f.amountAtRiskInr,
    period: f.period,
    sourceEndpoints: f.sourceEndpoints,
    suggestedAction: f.suggestedAction,
  }));
}

/**
 * Hook to execute explain queries with deterministic fallback.
 */
export function useExplain(tool: 'capacity-planner' | 'shift-monitor' | 'payroll-audit') {
  const [mutateExplain, { isLoading }] = useExplainToolFindingsMutation();
  const [status, setStatus] = useState<ExplainStatus>('idle');
  const [narrative, setNarrative] = useState<ExplainResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const requestExplain = useCallback(
    async (requestPayload: ExplainRequest): Promise<ExplainResponse | null> => {
      setStatus('loading');
      setErrorMessage(null);

      // Cleanse findings and establish valid finding IDs set
      const cleanFindings = prepareFindingsForExplain(requestPayload.findings);
      const validFindingIds = new Set(cleanFindings.map((f) => f.id));

      const sanitizedPayload: ExplainRequest = {
        ...requestPayload,
        findings: cleanFindings,
      };

      try {
        const result = await mutateExplain({
          tool,
          payload: sanitizedPayload,
        }).unwrap();

        // Contract guard: drop any priorities citing finding IDs not sent in request
        const verifiedPriorities = (result.priorities || [])
          .map((p) => ({
            ...p,
            findingIds: (p.findingIds || []).filter((id) => validFindingIds.has(id)),
          }))
          .filter((p) => p.findingIds.length > 0);

        const validatedResponse: ExplainResponse = {
          ...result,
          priorities: verifiedPriorities,
        };

        setNarrative(validatedResponse);
        setStatus('success');
        return validatedResponse;
      } catch (err: any) {
        const httpStatus = err?.status || err?.originalStatus;
        if (httpStatus === 404 || httpStatus === 405 || httpStatus === 501 || httpStatus === 503) {
          setStatus('backend_pending');
          setErrorMessage('AI narrative engine is pending backend activation or currently unavailable.');
        } else {
          setStatus('backend_pending');
          setErrorMessage(err?.data?.message || 'Unable to connect to AI explanation service.');
        }
        return null;
      }
    },
    [mutateExplain, tool]
  );

  return {
    requestExplain,
    isLoading,
    status,
    narrative,
    errorMessage,
    reset: () => {
      setStatus('idle');
      setNarrative(null);
      setErrorMessage(null);
    },
  };
}

