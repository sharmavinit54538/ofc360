# Specification: Reduce HR Admin Dashboard Sidebar from 74 Rows to Exactly 12 Items

Status: FINALIZED
Date: 2026-10-23
Author: GSD System

## What exists today
- `src/features/dashboard/components/dashboardTabs.data.ts`: `SIDEBAR_SECTIONS` (12 sections) + `DASHBOARD_TABS` (70 top-level tabs + 4 children nested under `attendance` = 74 rows). Every tab has a `section`.
- `DashboardSidebar.tsx` renders every section expanded with every tab -> 74 rows, far too long.
- `HRAdminDashboard.tsx` keeps `activeTab` in state, syncs it to the URL hash (#tab-id) and renders tab.component via Suspense (`DynamicModuleView`).
- `DashboardTabBar.tsx` (horizontal scrollable tab bar; props: `tabs`, `activeTab`, `onTabChange`) exists but is not used anywhere.
- 7 ids are duplicated across two sections: `hiring-reports`, `recruitment-analytics`, `recruitment-ai`, `ai-copilot`, `compliance-monitor`, `policy-assistant`, `document-generator` (both rows highlight together).
- `getTabConfig()` only searches top-level tabs, so nested ids (`attendance-shifts`/`rosters`/`holidays`, `timesheets`) never resolve and fall back to Overview.
- Only 16 of the 74 rows are real pages; the other 58 render `ComingSoonView`.

## Goal
The sidebar shows exactly 12 flat items, one per `SIDEBAR_SECTIONS` entry (no group headers, no nested submenu, no chevrons):
1. Overview
2. Workforce
3. Recruitment
4. Attendance & Time
5. Payroll & Benefits
6. Leave Management
7. Performance
8. Reports
9. AI Hub
10. Documents
11. HR Operations
12. Settings & Integrations

Clicking one opens that module. Every former sidebar row becomes a sub-tab inside the module (tab bar at the top of the content area, reuse `DashboardTabBar`). Nothing is deleted: all 67 unique tab ids stay reachable.

## Module -> Sub-tabs (each id has exactly ONE home)
1. **overview**: `overview`
2. **workforce**: `employees`, `hr-management`, `managers`, `departments`
3. **recruitment** (23): `recruitment-dashboard`, `requisitions`, `all-jobs`, `create-job`, `candidates`, `talent-pool`, `pipeline`, `interviews`, `interview-calendar`, `scorecards`, `offers`, `recruitment-onboarding`, `candidate-crm`, `resume-intelligence`, `email-templates`, `referrals`, `vendors`, `career-site`, `automation`, `compliance`, `global-search`, `notifications`, `import-export`
4. **attendance**: `attendance` (landing tab, label it "Overview"), `attendance-shifts`, `attendance-rosters`, `attendance-holidays`, `timesheets`
5. **payroll**: `payroll`
6. **leave**: `leaves`
7. **performance**: `performance`
8. **reports**: `analytics-center`, `hiring-reports`, `recruitment-analytics` (`ai-insights` becomes an alias that opens `analytics-center`; both render the same `AnalyticsCenterPage`)
9. **aihub** (13): `aihub-dashboard`, `workforce-insights`, `ai-recruiter`, `attendance-monitor`, `leave-assistant`, `performance-coach`, `payroll-insights`, `workforce-planning`, `employee-health`, `meeting-intelligence`, `chat-assistant`, `recruitment-ai`, `ai-copilot`
10. **documents**: `documents`, `recruitment-compliance`, `compliance-monitor`, `policy-assistant`, `document-generator`
11. **hrops**: `hrops-dashboard`, `employee-timeline`, `asset-management`, `visitor-management`, `expense-claims`, `travel-requests`, `onboarding-checklist`, `exit-management`
12. **settings**: plain NavLink to the existing `/settings` route, no sub-tabs

A module with a single sub-tab renders no tab bar. Recruitment and AI Hub keep a horizontally scrollable bar.

## Implementation Details
1. `dashboardTabs.data.ts`:
   - Remove the 7 duplicate rows from the section that is NOT listed above.
   - Add helpers:
     - `getModuleTabs(sectionId)` (flattens `children`)
     - `getModuleOfTab(id)`
     - `LEGACY_ALIASES` map (`{ 'ai-insights': 'analytics-center' }`)
   - Make `getTabConfig()` search `children` too.
2. `DashboardSidebar.tsx`:
   - Render only the 12 sections as flat items.
   - Active item = section of the active tab.
   - Keep current look (`w-64` / `w-16` collapsed with title tooltips, slate/zinc + dark: classes, logo header, PanelLeft toggle) and the same props (`activeTab`, `onTabChange`, `collapsed`, `onToggleCollapse`).
   - Remove dead code and unused imports (`tsconfig` has `noUnusedLocals`).
3. `HRAdminDashboard.tsx`:
   - Derive the module from the active tab.
   - When the module has more than one sub-tab, render `<DashboardTabBar tabs={getModuleTabs(module)} ... />` above the content, then the selected tab's component inside Suspense.
   - Selecting a module opens its last-used sub-tab (default: the first).
   - Fix `DynamicModuleView`: do not call `lazy()` inside render.
4. URL:
   - Keep the `#tab-id` hash format and the `hashchange` listener (back/forward must keep working).
   - A module id as hash (e.g. `#recruitment`) opens that module's first sub-tab; unknown hash -> overview.
   - Old links like `#payroll` or `#employee-timeline` must still work.
5. attendance-shifts / rosters / holidays:
   - Render their `component` inline inside the module instead of navigating to `/dashboard/attendance/*`. Do NOT remove those routes from `AppRoutes.tsx`.

## Constraints & Out of Scope
- Do not touch: `src/features/auth/**`, `ProtectedRoute`, `AppRoutes.tsx`, `store`, `baseQuery`, `DashboardShell`'s props, and the page components themselves (`OverviewView`, `TimelinePage`, ...).
- No new dependencies.

## Acceptance Criteria
- Expanded sidebar shows exactly 12 items; collapsed shows 12 icons with tooltips.
- No duplicate tab ids.
- Vitest asserts: ids are unique, every id belongs to exactly one of the 12 sections, and `#payroll`, `#ai-insights`, `#timesheets`, `#recruitment` resolve correctly.
- Reload on `#candidates` opens Recruitment > Candidates. Clicking Timesheets opens the Timesheets tab, not Overview.
- `npm run typecheck`: no NEW errors.
- `npm test` passes.
