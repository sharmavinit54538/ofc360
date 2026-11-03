---
phase: 4
plan: 1
wave: 4
depends_on: ["3.1"]
files_modified:
  - src/features/recruitment/__tests__/DashboardKpiCards.test.tsx
  - src/features/recruitment/__tests__/HiringFunnelChart.test.tsx
  - src/features/recruitment/__tests__/SourceEfficiencyChart.test.tsx
  - src/features/recruitment/__tests__/TimeToHireChart.test.tsx
  - src/features/recruitment/__tests__/RecruitmentDashboardOverview.test.tsx
autonomous: true
must_haves:
  truths:
    - "All calculator functions have unit tests"
    - "All components have render tests with loading/empty/error states"
    - "Integration test for dashboard overview with mocked API"
    - "TypeScript compilation passes with zero errors"
    - "Build succeeds"
    - "All existing tests still pass"
  artifacts:
    - "Component test files"
    - "Clean typecheck output"
    - "Successful build"
---

# Plan 4.1: Testing, TypeCheck & Build Verification

## Objective
Write comprehensive tests for all new components and calculators, run TypeScript type checking, and verify the build succeeds. Ensure no regressions in existing tests.

## Context
Load for context:
- .gsd/SPEC.md
- src/features/recruitment/__tests__/ (existing test patterns)
- src/test/setup.ts (Vitest setup)
- package.json (test scripts)
- vitest.config.ts

## Tasks

<task type="auto">
  <name>Write component tests for DashboardKpiCards</name>
  <files>src/features/recruitment/__tests__/DashboardKpiCards.test.tsx</files>
  <action>
    Write Vitest + React Testing Library tests for DashboardKpiCards:
    
    Test Cases:
    1. Renders 12 skeleton cards when isLoading=true
    2. Renders 12 KPI cards with correct values when data provided
    3. Shows compact ErrorDisplay when error prop provided
    4. Shows "No data" hints when all KPI values are 0
    5. Retry button calls onRetry callback
    6. Responsive grid classes applied correctly
    7. Dark mode classes present
    8. Each card shows primary value, secondary metrics, trend indicator
    
    Mock Data:
    - Create mock RecruitmentDashboardKPIs object with realistic values
    - Test with partial data (some null/undefined)
    
    Follow existing patterns from RecruitmentKpiCards.test.tsx if exists.
  </action>
  <verify>npm test -- src/features/recruitment/__tests__/DashboardKpiCards.test.tsx</verify>
  <done>Tests exist, all pass, good coverage</done>
</task>

<task type="auto">
  <name>Write component tests for chart components</name>
  <files>src/features/recruitment/__tests__/HiringFunnelChart.test.tsx, src/features/recruitment/__tests__/SourceEfficiencyChart.test.tsx, src/features/recruitment/__tests__/TimeToHireChart.test.tsx</files>
  <action>
    Write tests for each chart component:
    
    Common Test Cases (each chart):
    1. Renders skeleton when isLoading=true
    2. Renders AnalyticsEmptyState when data is empty array
    3. Renders ErrorDisplay when error prop provided
    4. Renders chart SVG/Canvas when data provided
    5. Retry button calls onRetry callback
    6. Tooltip/hover interactions (if testable)
    
    Chart-Specific:
    - HiringFunnelChart: Verify 8 stages rendered, conversion % displayed
    - SourceEfficiencyChart: Verify horizontal bars, two series, hire rate labels
    - TimeToHireChart: Verify two lines, benchmark line, tooltip data
    
    Mock Recharts components if needed for shallow rendering.
  </action>
  <verify>npm test -- src/features/recruitment/__tests__/HiringFunnelChart.test.tsx src/features/recruitment/__tests__/SourceEfficiencyChart.test.tsx src/features/recruitment/__tests__/TimeToHireChart.test.tsx</verify>
  <done>All chart tests exist and pass</done>
</task>

<task type="auto">
  <name>Write integration test for RecruitmentDashboardOverview</name>
  <files>src/features/recruitment/__tests__/RecruitmentDashboardOverview.test.tsx</files>
  <action>
    Write integration test for the composed dashboard:
    
    Test Cases:
    1. Renders loading state initially
    2. Fetches data via useGetDashboardOverviewQuery (mock with MSW)
    3. Displays KPI cards with fetched data
    4. Displays all three charts with computed data
    5. Filter changes trigger query refetch with new params
    6. Date range preset buttons work
    7. Error boundary catches query errors
    8. RBAC: filters locked/hidden for RECRUITER role
    
    Use MSW (Mock Service Worker) to mock the /recruitment/dashboard/overview endpoint.
    Follow existing MSW patterns from other test files.
  </action>
  <verify>npm test -- src/features/recruitment/__tests__/RecruitmentDashboardOverview.test.tsx</verify>
  <done>Integration test exists, passes with mocked API</done>
</task>

<task type="auto">
  <name>Run TypeScript typecheck</name>
  <files>N/A</files>
  <action>
    Run the TypeScript compiler to verify no type errors in the entire project:
    - Focus on new files but run full project check
    - Fix any type errors that arise
    - Ensure strict mode compliance
  </action>
  <verify>npm run typecheck</verify>
  <done>TypeScript compilation passes with zero errors</done>
</task>

<task type="auto">
  <name>Run full test suite and build</name>
  <files>N/A</files>
  <action>
    Execute full verification:
    1. Run all tests: npm test
    2. Run build: npm run build
    3. Verify no regressions in existing tests (262 tests should still pass)
    4. Verify build output is clean
  </action>
  <verify>npm test && npm run build</verify>
  <done>All tests pass (262+ new), build succeeds</done>
</task>

</tasks>

<verification>
After all tasks, verify:
- [ ] All new component tests pass
- [ ] All calculator tests pass (from plan 1.2)
- [ ] Integration test passes
- [ ] TypeScript typecheck: 0 errors
- [ ] Build succeeds
- [ ] Existing 262 tests still pass (no regressions)
</verification>

<success_criteria>
- [ ] All tasks verified
- [ ] Must-haves confirmed
</success_criteria>