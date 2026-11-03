---
phase: 1
plan: 1
wave: 1
depends_on: []
files_modified:
  - src/features/recruitment/types/sidebar.types.ts
  - src/features/recruitment/api/sidebarBadgesApi.ts
  - src/features/recruitment/api/index.ts
autonomous: true
must_haves:
  truths:
    - "Sidebar badge types match backend API contract exactly"
    - "RTK Query endpoint fetches badges from /api/v1/sidebar/badges"
    - "Response transformation handles nested API envelopes"
    - "Tag-based caching for badge invalidation"
  artifacts:
    - "src/features/recruitment/types/sidebar.types.ts with SidebarBadgesResponse interface"
    - "src/features/recruitment/api/sidebarBadgesApi.ts with useGetSidebarBadgesQuery hook"
    - "Exports from recruitment api index.ts"
---

# Plan 1.1: Sidebar Badge Types & API Endpoints

## Objective
Define TypeScript interfaces for sidebar badge counts matching the backend contract, and create RTK Query endpoints for fetching dynamic badge counts from `/api/v1/sidebar/badges`.

## Context
Load for context:
- .gsd/SPEC.md
- src/features/recruitment/types/recruitment.types.ts (existing patterns)
- src/features/recruitment/api/recruitmentApi.ts (existing RTK Query patterns)
- src/shared/api/baseQuery.ts (baseQueryWithReauth)
- src/features/auth/types/auth.types.ts (UserRole types)

## Tasks

<task type="auto">
  <name>Create sidebar badge TypeScript interfaces</name>
  <files>src/features/recruitment/types/sidebar.types.ts</files>
  <action>
    Create the TypeScript interfaces for sidebar badges matching the backend contract exactly.
    
    Interface: SidebarBadgesResponse
    Properties (all optional numbers):
    - pending_req_approvals_count: number (HR_ADMIN only - pending requisition approvals)
    - new_applications_count: number (HR_ADMIN, HR_EXECUTIVE - new applications in period)
    - today_interviews_count: number (HR_ADMIN, HR_EXECUTIVE, MANAGER - interviews scheduled today)
    - overdue_scorecards_count: number (HR_ADMIN, HR_EXECUTIVE, MANAGER - overdue interview scorecards)
    - pending_offer_approvals_count: number (HR_ADMIN, HR_EXECUTIVE - pending offer approvals)
    - bgv_discrepancy_alerts_count: number (HR_ADMIN, HR_EXECUTIVE - BGV discrepancies)
    - pending_it_provisioning_count: number (IT_ADMIN - pending IT onboarding tasks)
    - pending_profile_reviews_count: number (MANAGER - candidate profiles awaiting review)
    - active_referral_updates_count: number (EMPLOYEE - referral status changes)
    
    Also create:
    - RecruitmentSidebarTab interface extending DashboardTabItem with role-based visibility
    - RecruitmentSidebarSectionConfig for the "TALENT & RECRUITMENT" section
    - Role-specific tab configurations for each of the 6 roles
    
    Follow existing patterns from recruitment.types.ts - use PascalCase for interfaces, camelCase for properties.
    Export all types from the file.
  </action>
  <verify>TypeScript compiles: npx tsc --noEmit src/features/recruitment/types/sidebar.types.ts</verify>
  <done>File exists with all interfaces, exports correctly, no TypeScript errors</done>
</task>

<task type="auto">
  <name>Create sidebar badges RTK Query API</name>
  <files>src/features/recruitment/api/sidebarBadgesApi.ts</files>
  <action>
    Create RTK Query API slice for sidebar badges endpoint following existing patterns from recruitmentApi.ts:
    
    - Use createApi with baseQuery: baseQueryWithReauth
    - Reducer path: 'sidebarBadgesApi'
    - TagTypes: ['SidebarBadges']
    - Endpoint: getSidebarBadges with no params (auto-extracts user from JWT)
    - URL: '/sidebar/badges' (relative to /api/v1 base)
    - Transform response using existing transformResponse pattern
    - Provides tags: ['SidebarBadges']
    - Polling interval: 30 seconds (refetchInterval: 30000) for real-time badge updates
    - Export useGetSidebarBadgesQuery hook
    
    The endpoint should automatically extract tenant_id, user_id, and role from the JWT token
    via the Authorization header (handled by baseQueryWithReauth).
  </action>
  <verify>TypeScript compiles: npx tsc --noEmit src/features/recruitment/api/sidebarBadgesApi.ts</verify>
  <done>File exists with proper RTK Query setup, exports hook, no TypeScript errors</done>
</task>

<task type="auto">
  <name>Export sidebar API from recruitment api index</name>
  <files>src/features/recruitment/api/index.ts</files>
  <action>
    Create or update src/features/recruitment/api/index.ts to export:
    - export { useGetSidebarBadgesQuery } from './sidebarBadgesApi'
    - export type { SidebarBadgesResponse } from '../types/sidebar.types'
    
    Ensure existing exports are not broken.
  </action>
  <verify>TypeScript compiles: npx tsc --noEmit src/features/recruitment/api/index.ts</verify>
  <done>Exports work correctly, existing imports still function</done>
</task>

</tasks>

<verification>
After all tasks, verify:
- [ ] sidebar.types.ts exists with complete SidebarBadgesResponse interface
- [ ] sidebarBadgesApi.ts exists with getSidebarBadges query
- [ ] TypeScript compilation passes for all new files
- [ ] Exports work correctly from index files
</verification>

<success_criteria>
- [ ] All tasks verified
- [ ] Must-haves confirmed
</success_criteria>