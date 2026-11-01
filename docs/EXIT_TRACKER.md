# EXIT_TRACKER.md — Exit Management Implementation Tracker

| ID | Status (TODO/DONE/BLOCKED) | Files changed | Tests | Proof |
|---|---|---|---|---|
| EXIT-00 | DONE | `.gsd/SPEC.md`, `.gsd/ROADMAP.md`, `docs/EXIT_CONTRACT.md`, `docs/EXIT_TRACKER.md` | Baseline vitest run (230 passed, 1 failed) | `docs/EXIT_CONTRACT.md` baseline documented |
| EXIT-01 | TODO | `src/features/exit-management/types/exit.types.ts`, `src/features/exit-management/schemas/exit.schemas.ts`, `src/features/exit-management/mappers/exitMappers.ts`, `src/features/exit-management/api/exitsApi.ts` | `src/features/exit-management/mappers/__tests__/exitMappers.test.ts` | Vitest test run green |
| EXIT-02 | TODO | `src/app/router/AppRoutes.tsx`, `src/features/exit-management/layouts/ExitManagementLayout.tsx`, `src/features/dashboard/components/dashboardTabs.data.ts`, `audit-sidebar.md` | Route accessibility & navigation tests | Layout render & route transition verification |
| EXIT-03 | TODO | `src/features/exit-management/pages/MyExitPage.tsx`, `src/features/exit-management/components/MyExitRequestView.tsx` | ESS form validation & active request blocking tests | Screen render & interaction verification |
| EXIT-04 | TODO | `src/features/exit-management/pages/ExitApprovalsPage.tsx`, `src/features/exit-management/components/ManagerApprovalCard.tsx`, `src/features/exit-management/components/HrApprovalCard.tsx` | Manager & HR approve/reject tests | Screen render & rejection validation proof |
| EXIT-05 | TODO | `src/features/exit-management/pages/ExitNoticePeriodPage.tsx`, `src/features/exit-management/components/NoticePeriodTracker.tsx` | Notice date calculation & tab tests | Calculated served/remaining days verification |
| EXIT-06 | TODO | `src/features/exit-management/pages/ExitKnowledgeTransferPage.tsx` | KT complete action & checklist rendering tests | Screen render & KT signoff verification |
| EXIT-07 | TODO | `src/features/exit-management/pages/ExitAssetRecoveryPage.tsx`, `src/features/exit-management/components/AssetRecoveryTable.tsx` | Asset list & return mutation tests | Asset status tabs & return modal verification |
| EXIT-08 | TODO | `src/features/exit-management/pages/ExitClearancePage.tsx`, `src/features/exit-management/components/ClearanceSignoffDialog.tsx` | Clearance 5-department clear/hold/reject tests | No Dues certificate gating verification |
| EXIT-09 | TODO | `src/features/exit-management/pages/ExitFnFPage.tsx`, `src/features/exit-management/components/FnFBreakupCard.tsx` | FnF preview & patch settlement tests | Earnings/deductions display & status verification |
| EXIT-10 | TODO | `src/features/exit-management/pages/ExitInterviewPage.tsx`, `src/features/exit-management/components/ExitInterviewForm.tsx` | Interview submission & RBAC visibility tests | HR-only view & submission verification |
| EXIT-11 | TODO | `src/features/exit-management/pages/ExitDocumentsPage.tsx`, `src/features/exit-management/components/DocumentGenerationCard.tsx` | Document list & generate mutation tests | Blob download & document table verification |
| EXIT-12 | TODO | `src/features/exit-management/pages/ExitAccessDeactivationPage.tsx`, `src/features/exit-management/components/CompleteExitDialog.tsx` | Premature revocation refusal & completion tests | LWD validation & completion verification |
| EXIT-13 | TODO | `src/features/exit-management/pages/ExitedEmployeesPage.tsx` | Exited employee history & search filter tests | Archive table verification |
| EXIT-14 | TODO | `src/features/exit-management/pages/ExitAnalyticsPage.tsx`, `src/features/exit-management/components/ExitAnalyticsCharts.tsx` | Attrition metrics & CSV export tests | Accessible SVG charts & export verification |
| EXIT-15 | TODO | `src/features/exit-management/pages/ExitOverviewPage.tsx`, `src/features/exit-management/components/ExitAuditTimeline.tsx` | Overview KPI & audit timeline tests | Dashboard stats & SLA alert verification |
| EXIT-16 | TODO | `src/features/exit-management/pages/ExitSettingsPage.tsx` | Settings unavailable banner tests | Clean API gap banner verification |
| EXIT-17 | TODO | `src/features/exit-management/__tests__/exitManagement.test.tsx` | Full 4-state, RBAC, and mutation test suite | All vitest exit tests green |
| EXIT-18 | TODO | `docs/EXIT_CONTRACT.md`, `docs/EXIT_ROLE_MATRIX.md`, `docs/API_GAPS.md`, `README.md`, `audit-sidebar.md` | Verification of no dead `/offboarding` code | Clean build, typecheck audit, docs finalized |
