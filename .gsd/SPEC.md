# Specification: 4 Production AI Hub Tools (OFC360 Frontend)

Status: FINALIZED
Date: 2026-11-02
Author: Senior Frontend Engineer
Target Module: AI Hub Tools (`src/features/ai-tools/`)

---

## 1. Executive Summary

This specification establishes production implementations for the four unbacked AI Hub cards in `src/features/ai-hub/pages/AIHubPage.tsx`:
1. **Payroll Audit Scanner** (`payroll-insights`) -> `/ai/payroll-audit` & `/dashboard/ai-hub/payroll-audit`
2. **Shift AI Monitor** (`attendance-monitor`) -> `/ai/shift-monitor` & `/dashboard/ai-hub/shift-monitor`
3. **Capacity Planner** (`workforce-planning`) -> `/ai/capacity-planner` & `/dashboard/ai-hub/capacity-planner`
4. **Resume & Talent Matcher** (`ai-recruiter`) -> `/ai/talent-matcher` & `/dashboard/ai-hub/talent-matcher`

### Non-Negotiable Architecture Principles:
1. **Facts from code, words from AI**: Every metric, flag, currency amount (INR), and anomaly is deterministically derived from live API datasets using unit-tested rule engines (`engine.ts` / `rules.ts`). The LLM generates narrative explanations, priority ranking, and exploratory questions, never computing numbers.
2. **No fake AI**: When backend AI explain endpoints (`/api/v1/ai-hub/{tool}/explain`) return 404/405/501/503 or fail, the tools display full deterministic findings alongside an honest "AI narrative: Backend pending / unavailable" chip. No canned text is ever passed off as live AI.
3. **Human-in-the-loop**: Purely advisory and non-destructive. Never mutates payroll runs, rejects candidates, changes rosters, or disciplines employees automatically. Actions follow standard governance approvals.
4. **Explainable & Auditable**: Every finding displays evidence (rule ID, thresholds, inputs, source endpoints, and suggested review action).
5. **Privacy First**: Payloads dispatched to AI explain endpoints are pseudonymized (`emp_XXXX` or department ref). PII (names, PAN, bank details, UAN, phone, email, biometric coordinates) is strictly scrubbed.
6. **Visible Assumptions & Statutory Grounding**: Thresholds live in central `config.ts` per tool and render in an interactive Assumptions Drawer. Statutory thresholds (PF, ESI, PT, TDS) are fetched dynamically via `getStatutoryConfig` — never hardcoded.

---

## 2. Baseline Verification Evidence

- **Test Baseline**: `npm run test` (`vitest run`) reports 31 test files, 306 passing tests, 5 pre-existing failures in `src/features/documents/__tests__/SignatureCenter.test.tsx` and `signatureUtils.test.ts`. Zero new test failures permitted.
- **Typecheck Baseline**: `npm run typecheck` (`tsc -b`) reports pre-existing unused variable warnings in unrelated files (`src/features/settings`, `src/features/analytics`, `src/features/workforce`). Zero new typecheck errors permitted.
- **Dependency Guard**: No new npm packages installed; utilizes existing Recharts, Papaparse, Lucide-React, and `@/shared/ui` primitives.
- **Build Baseline**: `npx vite build` verified green (`built in 21.43s`, 0 errors).

---

## 3. Verified API Gap Table

| Tool | Required Data / Capability | Existing Endpoint / Slice | Gap Status & UI Treatment |
|---|---|---|---|
| **Shared** | AI Narrative & Prioritization | `POST /api/v1/ai-hub/{tool}/explain` | Backend Pending; gracefully shows deterministic findings + status chip |
| **Shared** | Persistent Finding Status | `PATCH /api/v1/ai-hub/{tool}/findings/{id}` | Backend Pending; status changes stored in session/local state and exported |
| **Payroll Audit** | Salary structures & components | `GET /payroll/salary-structures` | Backend verified (`payrollApi`); components mapped in hook |
| **Payroll Audit** | Statutory rules & slabs | `GET /payroll/statutory-config` | Backend verified (`payrollApi`); missing values mark rule "not evaluable" |
| **Payroll Audit** | Payslip details & identifiers | `GET /payroll/payslips` | Backend verified (`payrollApi`); PAN/UAN/Bank masked by default |
| **Shift Monitor** | Punch details (lat/long/IP/device) | `GET /attendance/records` | Device/IP unpopulated in standard feed; R8 flagged as "Signal unavailable" |
| **Capacity Planner** | Approved Headcount Target | `GET /workforce/departments` | `employeeCapacity` used as approved target; local scenario override supported |
| **Capacity Planner** | Approved Requisitions | `GET /recruitment/requisitions` | Verified in `recruitmentApi`; planned quarters mapped to demand pipeline |
| **Talent Matcher** | Multi-candidate resume parser | `POST /resume-parser/upload-and-parse` | Absent on backend per `docs/API_GAPS.md`; UI built but disabled with banner |
| **Talent Matcher** | Reverse job matching | `GET /api/v2/ranking/jobs-for-candidate/{id}` | Absent on backend; logged in `API_GAPS.md` with banner |

---

## 4. Work Phases & Deliverables

- **Phase 0: Shared Architecture & Wiring**
  - `src/features/ai-tools/shared/types.ts`
  - `src/features/ai-tools/shared/stats.ts`
  - `src/features/ai-tools/shared/useExplain.ts`
  - `src/features/ai-tools/shared/components/*`
  - Update `AIHubPage.tsx` paths & aliases in `AppRoutes.tsx`.
- **Phase 1: Payroll Audit Scanner**
  - Pure rule engine `rules.ts` (P1 to P9) + `config.ts`
  - `usePayrollAuditData.ts` (normalizing paise to rupees, statutory checks)
  - Page & components (Summary cards, exposure ₹, waterfall charts, findings table)
  - Unit tests for all 9 audit rules and negative/positive boundaries.
- **Phase 2: Shift AI Monitor & Capacity Planner**
  - Shift Monitor rules (R1 to R11, S1 robust z-scores) + views
  - Capacity Planner engine (Supply waterfall, absence deductions, demand tolerance gap) + line/heatmap charts
  - Unit tests for Shift rules & Capacity forecasting.
- **Phase 3: Resume & Talent Matcher**
  - Screening pipeline integration, blind mode, comparison matrix, disabled resume upload banner
  - Final documentation in `docs/AI_TOOLS.md` and updated `docs/API_GAPS.md`.

