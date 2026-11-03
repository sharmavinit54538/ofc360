# Specification: OFC360 Recruitment Module

Status: FINALIZED
Date: 2026-11-03
Owner: OFC360 Staff Engineering

## Objective

Build and integrate the complete, production-grade **End-to-End Recruitment & ATS Module** into `src/features/recruitment/`, along with its public unauthenticated routes, Redux state layer, API services, and cross-app integrations.
The implementation spans 6 cohesive waves covering all 42 administrative views, 4 public portals, 8 service modules, 22 Redux thunks, 14-domain Smart JD generation, CTC offer calculation, and comprehensive test suites.

## Architectural & Codebase Rules

1. **Conventions**:
   - Strictly follow `PROJECT_RULES.md`, `GSD-STYLE.md`, `docs/RECRUITMENT_CONTRACT.md`, and `docs/RECRUITMENT_ROLE_MATRIX.md`.
   - Admin APIs use base `/api/v1` (relative) or `/api/v2/...` (via `apiV2Url`).
   - Public unauthenticated routes use pure fetch clients with direct origin resolution and zero auth headers.
2. **UI Primitives**:
   - Reuse UI primitives strictly from `src/shared/ui/` (`Button`, `Dialog`, `Tabs`, `Card`, `Badge`, `Input`, `Select`, `Textarea`, `Switch`, `Checkbox`, `Slider`, `Skeleton`, `EmptyState`, `PageHeader`, `Toast`, `Tooltip`).
3. **Zero-Mock & Backend Pending Integrity**:
   - Never inject hardcoded mock arrays, fake data, or dummy responses.
   - For backend routes that are not yet provisioned on the FastAPI server (e.g. BGV, candidate email dispatch, 30-60-90 probation), render clear, honest "Backend Pending" alerts with disabled mutation controls, exactly matching `docs/RECRUITMENT_CONTRACT.md` Section 4.5.
4. **Three-Tier Component State Handling**:
   - In-flight request ➔ `Skeleton` / `SkeletonCard`.
   - Error response ➔ `ErrorDisplay` with retry/refetch action.
   - Empty response ➔ `EmptyState` with instantiated JSX icon `<Icon className="..." />`.
5. **State Layer & Caching**:
   - 22 Redux async thunks in `recruitmentSlice.ts`.
   - Request deduplication (fetch dedup) prevents concurrent duplicate requests.
   - 30-second Cache TTL (`cacheTimestamps`) prevents redundant calls within 30 seconds unless explicitly forced (`force: true`).

## 6-Wave Execution Plan

- **Wave 1: Data & State Foundation**:
  - Domain Types & Zod Schemas for all recruitment workflows.
  - 8 Service Modules: `recruitmentApi`, `recruiterApi`, `screeningApi`, `interviewApi`, `aiInterviewBotApi`, `candidateBookingApi`, `automationApi`, `employeeOnboardingApi`.
  - Domain Utilities: 14-Domain Smart JD Generator, JD Normalizer, API Mappers with 50/25 CTC split, Dashboard & Derived Calculators, RFC 5545 `.ics` Calendar generator.
  - Redux State: `recruitmentSlice.ts` with 22 async thunks, fetch dedup, and 30-second TTL caching.
  - RBAC & Cross-App Integration Hooks.
- **Wave 2: Planning, Sourcing & Job Management**:
  - Group 1 (Workforce Planning, Requisitions, Candidate Sourcing, Talent Pool, Referrals, Vendors).
  - Group 2 (All Jobs, New Job with Copilot JD generator, Job Detail with QR code, Publish Wizard, Career Site settings).
- **Wave 3: Candidates, Pipeline & AI Screening**:
  - Group 3 (Candidates directory, Candidate Profile, 9-stage Kanban Pipeline, Candidate CRM, Communication Preview, Global Search, Resume Intelligence & duplicate detector).
  - Group 4 (AI Resume Screening 1500+ line workspace, AI Interview & Integrity proctoring, AI Recruiter, Recruitment AI Hub).
- **Wave 4: Interviews, Offers & Verification**:
  - Group 5 (Interviews list, Month/Week/Day Calendar, Scorecards rubric builder, Hiring Manager Hub).
  - Group 6 (Background Verification BGV with audit log, Compensation & CTC Builder with 50% Basic / 25% HRA calc, Offers tracker).
- **Wave 5: Onboarding & Operations Hub**:
  - Group 7 (Preboarding joiners, Enterprise Onboarding Hub, 9-step Admin Checklists, KT & 30-60-90 Probation).
  - Group 8 (Dashboard with 22 module cards, Analytics, Reports, Automation no-code builder, Compliance, Import/Export, Notification feed, Dynamic Templates).
- **Wave 6: Public Routes, App Routing & Automated Test Suites**:
  - Group 9 (3 Public Unauthenticated Routes: `/jobs/apply/$ukey`, `/interview/book/$token`, `/ai-interview/$token`).
  - App routing wiring (`AppRoutes.tsx`) and RBAC protections.
  - 5 Comprehensive Vitest Suites: `screening.test.tsx`, `interviews.test.tsx`, `bookingAndAiBot.test.tsx`, `dataLayer.test.ts`, `smartJd.test.ts`.

## Baseline & Verification Boundaries

- Strict TypeScript compiler check (`tsc -b` / `vite build`).
- Zero `@ts-ignore` or unhandled `any`.
- Vitest unit & integration test verification with 100% pass rate.
