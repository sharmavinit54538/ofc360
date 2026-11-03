---
phase: 4
plan: 1
wave: 4
depends_on: ["3.1"]
files_modified:
  - src/features/recruitment/__tests__/sidebarBadgesApi.test.ts
  - src/features/dashboard/components/__tests__/DashboardSidebar.test.tsx
  - src/features/dashboard/components/__tests__/dashboardTabs.data.test.ts
autonomous: true
must_haves:
  truths:
    - "Sidebar badges API tests pass with mocked responses"
    - "DashboardSidebar renders correct tabs for each role"
    - "Badges display dynamic counts from API"
    - "RBAC filtering works for all 6 roles"
    - "TypeScript compilation passes with zero errors"
    - "Build succeeds"
    - "All existing tests still pass (262+ tests)"
  artifacts:
    - "Test files for sidebar badges and sidebar rendering"
    - "Clean typecheck output"
    - "Successful build"
---

# Plan 4.1: Testing, TypeCheck & Build Verification

## Objective
Write comprehensive tests for the sidebar badge API and DashboardSidebar component, run TypeScript type checking, and verify the build succeeds. Ensure no regressions in existing tests.

## Context
Load for context:
- .gsd/SPEC.md
- src/test/setup.ts (Vitest setup)
- package.json (test scripts)
- vitest.config.ts
- src/features/recruitment/__tests__/ (existing test patterns)
- src/features/dashboard/components/__tests__/ (if exists)

## Tasks

<task type="auto">
  <name>Write tests for sidebar badges API</name>
  <files>src/features/recruitment/__tests__/sidebarBadgesApi.test.ts</files>
  <action>
    Write Vitest tests for sidebarBadgesApi using MSW (Mock Service Worker):
    
    Test Cases:
    1. Fetches badges from correct endpoint (/sidebar/badges)
    2. Returns typed SidebarBadgesResponse
    3. Handles empty response (all counts 0 or undefined)
    4. Handles partial response (only some badges present)
    5. Polling interval configured (refetchInterval: 30000)
    6. Tag-based caching works (providesTags: ['SidebarBadges'])
    7. Error handling for 401/403/500 responses
    
    Mock different role responses:
    - HR_ADMIN: all badge fields populated
    - RECRUITER: subset of badges
    - MANAGER: manager-specific badges
    - IT_ADMIN: IT-specific badges
    - EMPLOYEE: employee-specific badges
    - SUPER_ADMIN: all badges
    
    Follow existing MSW patterns from other test files.
  </action>
  <verify>npm test -- src/features/recruitment/__tests__/sidebarBadgesApi.test.ts</verify>
  <done>Tests exist, all pass, good coverage</done>
</task>

<task type="auto">
  <name>Write tests for DashboardSidebar recruitment integration</name>
  <files>src/features/dashboard/components/__tests__/DashboardSidebar.test.tsx</files>
  <action>
    Write comprehensive tests for DashboardSidebar with recruitment integration:
    
    Test Cases:
    1. Renders recruitment section for HR_ADMIN
    2. Shows all 8 HR_ADMIN/RECRUITER tabs with correct badges
    3. Shows only 4 MANAGER tabs for MANAGER role
    4. Shows only 2 IT_ADMIN tabs for IT_ADMIN role
    5. Shows 3 EMPLOYEE tabs for EMPLOYEE role (interviews conditional)
    6. Hides employee interviews tab when has_assigned_interviews is false
    7. Shows employee interviews tab when has_assigned_interviews is true
    8. Shows all tabs for SUPER_ADMIN
    9. Badge counts display correctly from API response
    10. Loading skeletons shown during badge fetch
    11. No badges shown when count is 0 or undefined
    12. Collapsed mode shows badges correctly
    13. Mobile drawer mode works with recruitment tabs
    14. Section collapsible state works
    
    Mock:
    - useGetSidebarBadgesQuery with different badge responses
    - useRBAC with different roles
    - useAuth with user.has_assigned_interviews flag
    
    Use React Testing Library with proper RTL queries.
  </action>
  <verify>npm test -- src/features/dashboard/components/__tests__/DashboardSidebar.test.tsx</verify>
  <done>Tests exist, all pass, good coverage</done>
</task>

<task type="auto">
  <name>Write tests for dashboardTabs.data recruitment config</name>
  <files>src/features/dashboard/components/__tests__/dashboardTabs.data.test.ts</files>
  <action>
    Write unit tests for the recruitment sidebar configuration:
    
    Test Cases:
    1. SIDEBAR_SECTIONS includes recruitment section with correct order
    2. DASHBOARD_TABS includes all 17 recruitment tabs
    3. Each tab has correct roles array
    4. Each tab has correct badgeKey mapping
    5. Employee interviews tab has condition property
    6. LEGACY_ALIASES includes all recruitment aliases
    7. getModuleOfTab returns 'recruitment' for recruitment tab IDs
    8. getTabsBySection('recruitment') returns all recruitment tabs
    9. resolveLegacyAlias works for recruitment aliases
    10. Tab icons are valid React components
    
    Pure unit tests - no React rendering needed.
  </action>
  <verify>npm test -- src/features/dashboard/components/__tests__/dashboardTabs.data.test.ts</verify>
  <done>Tests exist, all pass</done>
</task>

<task type="auto">
  <name>Run TypeScript typecheck</name>
  <files>N/A</files>
  <action>
    Run the TypeScript compiler to verify no type errors in the entire project:
    - Focus on new files but run full project check
    - Fix any type errors that arise
    - Ensure strict mode compliance
    - Check for unused imports, missing types, etc.
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
    5. Check bundle size impact
  </action>
  <verify>npm test && npm run build</verify>
  <done>All tests pass (262+ new), build succeeds</done>
</task>

</tasks>

<verification>
After all tasks, verify:
- [ ] All new component tests pass
- [ ] All API tests pass
- [ ] TypeScript typecheck: 0 errors
- [ ] Build succeeds
- [ ] Existing 262 tests still pass (no regressions)
- [ ] Recruitment sidebar works for all 6 roles
- [ ] Badges are dynamic (no hardcoded values)
</verification>

<success_criteria>
- [ ] All tasks verified
- [ ] Must-haves confirmed
</success_criteria>