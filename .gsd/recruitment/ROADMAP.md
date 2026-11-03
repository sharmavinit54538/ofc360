# Recruitment Module Roadmap

All paths are relative to `src/features/recruitment/` in `ofc360-main`. Each wave is verified with strict type-safety, unit tests, and production build checks.

---

## Wave 1: Foundation, State Layer, Services & Utilities [COMPLETED]
- [x] **Spec & Roadmap**: Formalized 6-wave plan and architectural rules in `.gsd/recruitment/`.
- [x] **Types & Schemas**: Expanded domain types in `types/index.ts` and Zod validation schemas in `schemas/recruitment.schemas.ts`.
- [x] **8 Service Modules**:
  - `recruitmentApi`: Central RTK Query API slice with jobs, candidates, interviews, offers, and existing endpoints.
  - `recruiterApi`: Recruiter AI dashboard, funnel stats, matching distribution, score/recommendation endpoints.
  - `screeningApi`: Screening execution, batch polling, decision override, screening history.
  - `interviewApi`: Schedules, rescheduling, cancellation, reminders, no-show marking, feedback submission, scorecards.
  - `aiInterviewBotApi`: Public candidate bot endpoints (`/api/v2/interview-bot/public/...`) + Admin invite, results, decision.
  - `candidateBookingApi`: Public interview slot retrieval and booking endpoints.
  - `automationApi`: Automation rules list, creation, rule toggle, test execution.
  - `employeeOnboardingApi`: Admin onboarding review, document verification, plus employee onboarding step submission.
- [x] **Domain Utilities**:
  - 14-Domain Smart JD Generator (`utils/smartJdGenerator.ts`).
  - Structured JD Normalizer (`utils/jdNormalizer.ts`).
  - Extended API Mappers with 50% Basic / 25% HRA calculation (`utils/apiMappers.ts`).
  - Dashboard & Derived Metrics Calculators (`utils/dashboardCalculators.ts`).
  - RFC 5545 `.ics` Calendar Generator (`utils/calendarIcsGenerator.ts`).
- [x] **Redux State Layer (`recruitmentSlice.ts`)**:
  - 22 async thunks for jobs, candidates, interviews, offers, screening, and operations.
  - Request deduplication (fetch dedup) via in-memory/in-state active request locks.
  - 30-second TTL cache behavior using timestamp checks before network dispatch.
  - Store registration in `src/app/store.ts`.
- [x] **RBAC & Cross-App Integrations**:
  - Role matrix permissions in `recruitmentRbac.ts`.
  - Executive, Manager, Autopilot rule, and AI Chat assistant hooks in `useRecruitmentCrossApp.ts`.

---

## Wave 2: Planning, Sourcing & Job Management [PENDING]
- [ ] **Group 1: Planning & Sourcing**:
  - Workforce Planning (`WorkforcePlanningView.tsx`).
  - Requisitions (`RequisitionsView.tsx`).
  - Candidate Sourcing (`CandidateSourcingView.tsx`).
  - Talent Pool (`TalentPoolView.tsx`).
  - Employee Referrals (`ReferralsView.tsx`).
  - Agency Vendors (`VendorsView.tsx`).
- [ ] **Group 2: Jobs**:
  - All Jobs (`AllJobsView.tsx`).
  - New Job with OFC360 Copilot JD (`NewJobView.tsx`).
  - Job Detail with QR Code & Pipeline Gauge (`JobDetailView.tsx`).
  - 4-Step Publish Wizard (`PublishJobWizard.tsx`).
  - Career Site Branding & Settings (`CareerSiteSettingsView.tsx`).

---

## Wave 3: Candidates, Pipeline & AI Screening [PENDING]
- [ ] **Group 3: Candidates & Pipeline**:
  - Candidates Directory (`CandidatesView.tsx`).
  - Candidate Profile with ATS Match & Insights (`CandidateProfileView.tsx`).
  - 9-Stage Kanban Drag-and-Drop Pipeline (`CandidatePipelineView.tsx`).
  - Candidate CRM & Timeline (`CandidateCrmView.tsx`).
  - Candidate Communication Preview (`CandidateCommunicationView.tsx`).
  - Global Search with Boolean operators (`RecruitmentSearchView.tsx`).
  - Resume Intelligence & Duplicate Detector (`ResumeIntelligenceView.tsx`).
- [ ] **Group 4: AI Features**:
  - AI Resume Screening ~1500+ line workspace (`AiResumeScreeningWorkspace.tsx`).
  - AI Interview & Integrity Proctoring (`AiInterviewWorkspace.tsx`).
  - Recruitment AI Hub (`RecruitmentAiHubView.tsx`).
  - AI Recruiter Dashboard (`AiRecruiterView.tsx`).

---

## Wave 4: Interviews, Offers & Verification [PENDING]
- [ ] **Group 5: Interviews & Evaluation**:
  - Interviews Directory (`InterviewsView.tsx`).
  - Multi-view Interview Calendar (`InterviewCalendarView.tsx`).
  - Scorecards & Rubrics (`ScorecardsView.tsx`).
  - Hiring Manager Hub (`HiringManagerHubView.tsx`).
- [ ] **Group 6: Verification, Offers & Compensation**:
  - Background Verification BGV (`BgvVerificationView.tsx`).
  - Compensation & Offer Builder (`CompensationOfferBuilderView.tsx`).
  - Offers Tracker (`OffersView.tsx`).

---

## Wave 5: Onboarding & Operations Hub [PENDING]
- [ ] **Group 7: Onboarding**:
  - Preboarding Joiners (`PreboardingView.tsx`).
  - Enterprise Onboarding Hub (`EnterpriseOnboardingHubView.tsx`).
  - Onboarding 9-Step Checklists (`OnboardingChecklistsView.tsx`).
  - KT & 30-60-90 Day Probation (`ProbationTimelineView.tsx`).
- [ ] **Group 8: Ops, Reports & Settings**:
  - Recruitment Dashboard with 22 Module Navigation Cards (`RecruitmentDashboardView.tsx`).
  - Analytics (`RecruitmentAnalyticsView.tsx`).
  - Reports (`RecruitmentReportsView.tsx`).
  - Automation No-Code Builder (`RecruitmentAutomationView.tsx`).
  - Compliance Hub (`RecruitmentComplianceView.tsx`).
  - Import / Export Wizard (`RecruitmentImportExportView.tsx`).
  - Notifications Feed (`RecruitmentNotificationsView.tsx`).
  - Template Editor (`RecruitmentTemplatesView.tsx`).

---

## Wave 6: Public Routes, App Routing & Test Suites [PENDING]
- [ ] **Group 9: Public Unauthenticated Routes**:
  - `/jobs/apply/$ukey`: Comprehensive candidate application portal.
  - `/interview/book/$token`: Candidate self-service slot booking with timezone detection.
  - `/ai-interview/$token`: Text-based candidate AI bot interview with hidden proctoring signals.
- [ ] **App Routing Wiring**:
  - Update `AppRoutes.tsx` with unauthenticated public routes and protected recruitment routes.
  - Recruiter role landing page default to `/dashboard/recruitment`.
- [ ] **Automated Test Suites (Vitest)**:
  - `src/features/recruitment/__tests__/screening.test.tsx`
  - `src/features/recruitment/__tests__/interviews.test.tsx`
  - `src/features/recruitment/__tests__/bookingAndAiBot.test.tsx`
  - `src/features/recruitment/__tests__/dataLayer.test.ts`
  - `src/features/recruitment/__tests__/smartJd.test.ts`
