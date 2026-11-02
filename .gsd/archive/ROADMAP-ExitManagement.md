# ROADMAP: Exit Management (Full 14-Stage Workflow)

## Work Packages & Execution Plan

- [ ] **Wave 1: Contract Baseline, Types, Mappers & API Layer**
  - [x] EXIT-00: Contract baseline, diffing, `docs/EXIT_CONTRACT.md`, baseline audit
  - [ ] EXIT-01: Data layer rewrite (`exitsApi.ts`), `mappers/exitMappers.ts`, types, Zod schemas, unit tests

- [ ] **Wave 2: Module Shell, Routing, Navigation & ESS**
  - [ ] EXIT-02: Nested routing under `/dashboard/exit-management/*`, layout with sub-nav, role guards, sidebar & audit-sidebar update
  - [ ] EXIT-03: Employee Self-Service ("My Exit") screen with profile pre-fill, active request guard, withdrawal

- [ ] **Wave 3: Core Lifecyle Queues (Approvals, Notice, KT, Assets)**
  - [ ] EXIT-04: Approvals queue (Manager queue & HR queue, reason requirements, timeline audit)
  - [ ] EXIT-05: Notice Period screen (Calculated days served/remaining, early release/buyout API gap banners)
  - [ ] EXIT-06: Knowledge Transfer screen (7-task checklist fallback, manager verification)
  - [ ] EXIT-07: Asset Recovery screen (GET assets, PATCH asset-return, IT/HR admin roles)

- [ ] **Wave 4: Clearances, Financial Settlement, Feedback & Documents**
  - [ ] EXIT-08: Department Clearance screen (5 departments: Manager, IT, Finance, Admin, HR with Clear/Hold/Reject)
  - [ ] EXIT-09: Full & Final (F&F) Settlement screen (earnings, deductions, payment statuses, statement download)
  - [ ] EXIT-10: Exit Interview screen (Comprehensive questionnaire, strict HR/Admin visibility)
  - [ ] EXIT-11: Documents screen (Generate documents, document history, secure blob download)

- [ ] **Wave 5: Completion, Post-Exit, Analytics & Settings**
  - [ ] EXIT-12: IT Access Revocation & Final Exit Completion (LWD timezone check, F&F independent completion)
  - [ ] EXIT-13: Exited Employees & Post-Exit Archive (Completed cases history, document delivery status)
  - [ ] EXIT-14: Exit Analytics & Reporting (Stats, attrition aggregation, SVG charts, CSV export)
  - [ ] EXIT-15: Exit Dashboard & Audit Hub (KPI cards, role action lists, SLA highlights, audit timeline)
  - [ ] EXIT-16: Exit Settings screen (Clean API gap banner with route requirements)

- [ ] **Wave 6: Verification, Test Suite & Documentation Finalization**
  - [ ] EXIT-17: Comprehensive Vitest test suite (4 states, mutations, RBAC gating, business constraints)
  - [ ] EXIT-18: Documentation, dead code cleanup, role matrix, API gaps, final commit
