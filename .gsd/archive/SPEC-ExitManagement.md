# Specification: Exit Management (Full 14-Stage Workflow) in OFC360 Frontend

Status: FINALIZED
Date: 2026-11-01
Author: Senior Frontend Engineer

---

## 1. Executive Summary

This specification establishes the full, end-to-end Exit Management module for OFC360 (`ofc360-frontend`), replacing the legacy 7-stage `/offboarding/*` prototype with the real, multi-stage, enterprise-grade Exit Management workflow backed by `/api/v1/exits/*` routes.

This is a **FRONTEND ONLY** initiative. No backend code or mock servers will be created or modified. All missing endpoints, missing request/response fields, or unconfirmed backend behaviors will be documented as honest API gaps in `docs/API_GAPS.md`, disabled in the UI with tooltips/banners, and tracked in `docs/EXIT_TRACKER.md`.

---

## 2. Baseline Verification Evidence

- **Typecheck Baseline**: `npm run typecheck` (`tsc -b`) currently fails due to pre-existing TypeScript errors across existing modules (`src/app/store.ts` circular type reference, `src/features/settings`, `src/features/analytics`, `src/features/workforce`). Any new code added in `src/features/exit-management` must be strictly typed and introduce zero new diagnostics.
- **Test Baseline**: `npm run test` (`vitest run`) executes 22 test files with 230 passing tests and 1 pre-existing failure (`src/features/documents/__tests__/SignatureCenter.test.tsx` React element child object mismatch). All exit management tests will run green.
- **Lint Baseline**: `npm run lint` executes an echo stub: `"ESLint setup scheduled for Phase 4"`. No linter currently enforces rules.
- **OpenAPI & Network Contract Baseline**: Attempted retrieval of `https://api.ofc360.com/openapi.json` and `/api/v1/openapi.json` returned HTTP 404 `{"detail":"Not Found"}`. Standard sandbox has no outbound network; live probing requires user elevation. Request/response schemas for `/api/v1/exits/*` are documented defensively in `docs/EXIT_CONTRACT.md` using the sibling repository's defensive envelope mapper patterns.
- **Subagents**: In accordance with `PROJECT_RULES.md` lines 78-79 and 97-98, subagents are unavailable in this environment (individual quota exhausted 429), so execution degrades cleanly to sequential in-context execution without claiming delegation.

---

## 3. Scope & Workflow Stages

The exit lifecycle covers a 14-stage workflow:
1. **Resignation Submission (ESS)**: Employee self-service submission (`POST /exits/resign`, `GET /exits/my-request`, `DELETE /exits/my-request`).
2. **Manager Review & Approval**: Manager queue with employee context, notice period validation, `PATCH /exits/{id}/manager-approve` or `manager-reject`.
3. **HR Review & Approval**: HR queue with verification checklist guidance, `PATCH /exits/{id}/approve` or `reject`.
4. **Notice Period Management**: `PATCH /exits/{id}/start-notice-period`. Calculated served vs remaining days. Early release/waiver/buyout displayed with API gap banners.
5. **Knowledge Transfer (KT)**: 7-task checklist rendered if present in payload, otherwise single action `PATCH /exits/{id}/knowledge-transfer-complete`.
6. **Asset Recovery**: `GET /exits/{id}/assets` and `PATCH /exits/{id}/asset-return`. Independent from clearance. IT Admin / HR Admin sign-off.
7. **Department Clearances**: 5 departments (Manager, IT, Finance, Admin, HR) with `PATCH /exits/{id}/clearance` (`CLEARED`, `ON_HOLD`, `REJECTED`). Hold/Reject requires reason.
8. **Exit Interview**: `POST /exits/{id}/exit-interview`. Sensitive responses viewable strictly by `HR_ADMIN` and `SUPER_ADMIN`.
9. **Full & Final (F&F) Settlement**: `GET /exits/{id}/fnf-preview` and `PATCH /exits/{id}/fnf`. Earnings and deductions line items, net payable display, status workflow.
10. **Document Generation & Issuance**: `POST /exits/{id}/generate-documents` and `GET /exits/{id}/documents`. Relieving letter, experience letter, F&F statement, no-dues certificate.
11. **System Access Revocation**: IT revocation checklist with company timezone comparison against actual LWD; premature revocation blocked in UI.
12. **Final Exit Completion**: `PATCH /exits/{id}/complete`. Enabled only when mandatory clearances and criteria are satisfied; F&F settlement pending does not block exit completion.
13. **Post-Exit & Exited Employees**: History table of completed exits with document delivery status and F&F follow-up.
14. **Exit Analytics & Settings**: Attrition metrics, reason breakdown, average notice days, CSV export, and Settings route (clean API gap banner).

---

## 4. Architectural Rules

1. **No Fake Data / No Optimistic Persistence**: Base query dev mock fallback (`VITE_ENABLE_MOCK_FALLBACK`) remains `false`.
2. **UI 4-State Architecture**: Every screen implements Loading (`Skeleton`), Error with Retry (`ErrorDisplay`), Empty (`EmptyState`), and Success.
3. **Defensive Data Layer**: `mappers/exitMappers.ts` normalizes backend responses defensively (snake_case and camelCase tolerant, nullable/envelope handling).
4. **Strict RBAC**: Roles = `SUPER_ADMIN | HR_ADMIN | MANAGER | EMPLOYEE | IT_ADMIN`.
   - `EMPLOYEE`: Access to "My Exit" ESS screen only.
   - `MANAGER`: Manager approval queue, KT signoff, Manager clearance signoff. Cannot view Exit Interview responses.
   - `IT_ADMIN`: Asset recovery and IT clearance.
   - `HR_ADMIN` & `SUPER_ADMIN`: Full access across all queues, interviews, documents, and completions.
5. **Route Hierarchy**: Shared layout under `/dashboard/exit-management` with nested sub-routes:
   - `/dashboard/exit-management` (redirects to `/dashboard/exit-management/overview`)
   - `/dashboard/exit-management/overview` (Dashboard & KPI summary)
   - `/dashboard/exit-management/my-exit` (Employee Self-Service)
   - `/dashboard/exit-management/approvals` (Manager & HR queues)
   - `/dashboard/exit-management/notice-period` (Notice period tracking)
   - `/dashboard/exit-management/knowledge-transfer` (KT handover)
   - `/dashboard/exit-management/asset-recovery` (Asset return tracking)
   - `/dashboard/exit-management/clearance` (Department clearances)
   - `/dashboard/exit-management/fnf` (Full & final settlement)
   - `/dashboard/exit-management/interview` (Exit interview)
   - `/dashboard/exit-management/documents` (Exit documents)
   - `/dashboard/exit-management/access-deactivation` (IT access revocation)
   - `/dashboard/exit-management/exited-employees` (Alumni / post-exit archive)
   - `/dashboard/exit-management/analytics` (Attrition analytics)
   - `/dashboard/exit-management/settings` (Exit policies & templates banner)

---

## 5. Verification & Acceptance Criteria

- All work packages EXIT-00 through EXIT-18 tracked in `docs/EXIT_TRACKER.md`.
- `docs/EXIT_CONTRACT.md`, `docs/EXIT_ROLE_MATRIX.md`, and `docs/API_GAPS.md` populated and maintained.
- Unit and integration tests covering mappers, components, RBAC gating, validation rules, and error handling.
- Zero regression against baseline test suite (`npm run test`).
- Atomic commits per task with conventional commit format: `type(scope): description`.
