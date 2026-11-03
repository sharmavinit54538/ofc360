---
phase: 3
plan: 1
wave: 3
depends_on: ["2.1", "2.2"]
files_modified:
  - src/features/recruitment/pages/RecruitmentDashboardPage.tsx
  - src/features/recruitment/components/RecruitmentDashboardOverview.tsx
  - src/app/router/AppRoutes.tsx (or route config)
autonomous: true
must_haves:
  truths:
    - "Dashboard page accessible at /dashboard/recruitment/overview"
    - "RBAC restricts access to HR_ADMIN, RECRUITER, MANAGER"
    - "Data scope filtered by user role automatically"
    - "All 12 KPIs, 3 charts, and filters integrated"
    - "Date range changes trigger refetch of all data"
    - "Loading/error/empty states work end-to-end"
  artifacts:
    - "RecruitmentDashboardPage.tsx - route page with RBAC guard"
    - "RecruitmentDashboardOverview.tsx - composed dashboard component"
    - "Route registered in AppRoutes"
---

# Plan 3.1: Main Dashboard Page with RBAC

## Objective
Create the main Recruitment Dashboard Overview page that composes all components (KPI cards, filters, charts) with proper RBAC enforcement, data scoping, and real-time data fetching via RTK Query.

## Context
Load for context:
- .gsd/SPEC.md
- src/features/recruitment/pages/RecruitmentHubPage.tsx (existing page pattern)
- src/features/recruitment/api/dashboardApi.ts (from plan 1.1)
- src/features/recruitment/components/ (all from phase 2)
- src/features/auth/components/ProtectedRoute.tsx
- src/features/auth/hooks/useRBAC.ts
- src/features/recruitment/utils/recruitmentRbac.ts
- src/app/router/AppRoutes.tsx

## Tasks

<task type="auto">
  <name>Create RecruitmentDashboardOverview composed component</name>
  <files>src/features/recruitment/components/RecruitmentDashboardOverview.tsx</files>
  <action>
    Create the main composed dashboard component that integrates all pieces:
    
    Structure:
    1. Page Header: Title, subtitle, last updated timestamp
    2. DashboardFilters (date range, department, recruiter, job, source)
    3. DashboardKpiCards (12 KPIs grid)
    4. Charts Row 1: HiringFunnelChart (full width)
    5. Charts Row 2: SourceEfficiencyChart (left 2/3) + TimeToHireChart (right 1/3) on desktop, stacked on mobile
    
    Data Flow:
    - Use useGetDashboardOverviewQuery with filters from DashboardFilters
    - Transform API response to calculator inputs
    - Use dashboardCalculators to compute derived metrics for charts
    - Pass computed data to chart components
    
    State Management:
    - Local filter state (date range, department, etc.)
    - onFiltersChange triggers query refetch with new params
    - Memoize computed chart data with useMemo
    
    Props:
    interface RecruitmentDashboardOverviewProps {
      initialFilters?: DashboardOverviewQueryParams;
    }
    
    Error Handling:
    - Wrap in ErrorBoundary
    - Show ErrorDisplay if query fails
    - Retry button refetches query
    
    Loading:
    - Show skeleton for entire dashboard during initial load
    - Individual component skeletons during refetch
    
    Responsive Layout:
    - Mobile: Single column stack
    - Tablet: KPIs 2-col, charts stacked
    - Desktop: KPIs 4-col, funnel full, source 2/3 + time 1/3
    - XL: KPIs 6-col
    
    Follow RecruitmentHubPage patterns for layout, ambient backgrounds, card styling.
  </action>
  <verify>TypeScript compiles: npx tsc --noEmit src/features/recruitment/components/RecruitmentDashboardOverview.tsx</verify>
  <done>Component composes all pieces, data flows correctly, TypeScript passes</done>
</task>

<task type="auto">
  <name>Create RecruitmentDashboardPage route with RBAC</name>
  <files>src/features/recruitment/pages/RecruitmentDashboardPage.tsx</files>
  <action>
    Create the route page component with RBAC protection:
    
    Access Control:
    - Use ProtectedRoute wrapper (or useRBAC hook for inline checks)
    - Allowed roles: SUPER_ADMIN, HR_ADMIN, RECRUITER, MANAGER
    - IT_ADMIN and EMPLOYEE redirected to unauthorized page
    
    Data Scoping (via query params automatically applied by backend):
    - HR_ADMIN/SUPER_ADMIN: No filters (org-wide)
    - RECRUITER: recruiter_id = current user id (backend enforced)
    - MANAGER: department_id = user's department (backend enforced)
    
    Page Structure:
    - Ambient background gradients (like RecruitmentHubPage)
    - Max-width container (1500px)
    - RecruitmentDashboardOverview component
    - ErrorBoundary wrapper
    
    Header Actions:
    - Export button (CSV/PDF) - for HR_ADMIN/SUPER_ADMIN only
    - Refresh button (triggers query invalidation)
    - Date range display (current filter)
    
    Integration:
    - Import useGetDashboardOverviewQuery for cache invalidation on refresh
    - Use useRBAC to determine header action visibility
    
    Follow RecruitmentHubPage.tsx patterns exactly for layout, styling, modals.
  </action>
  <verify>TypeScript compiles: npx tsc --noEmit src/features/recruitment/pages/RecruitmentDashboardPage.tsx</verify>
  <done>Page exists with RBAC, data scoping, header actions, TypeScript passes</done>
</task>

<task type="auto">
  <name>Register dashboard route in AppRoutes</name>
  <files>src/app/router/AppRoutes.tsx</files>
  <action>
    Add the new route to the router configuration:
    
    Route path: /dashboard/recruitment/overview
    Component: RecruitmentDashboardPage
    Wrapper: ProtectedRoute with allowedRoles: ['SUPER_ADMIN', 'HR_ADMIN', 'RECRUITER', 'MANAGER']
    
    Also add navigation entry in sidebarNav.ts if recruitment section exists:
    - Label: "Recruitment Dashboard"
    - Icon: LayoutDashboard or BarChart2
    - Path: /dashboard/recruitment/overview
    - Roles: ['SUPER_ADMIN', 'HR_ADMIN', 'RECRUITER', 'MANAGER']
    
    Check existing route patterns in AppRoutes.tsx for exact syntax.
  </action>
  <verify>TypeScript compiles: npx tsc --noEmit src/app/router/AppRoutes.tsx</verify>
  <done>Route registered, accessible at correct path, sidebar navigation works</done>
</task>

<task type="auto">
  <name>Export page and overview from features index</name>
  <files>src/features/recruitment/index.ts</files>
  <action>
    Create or update src/features/recruitment/index.ts to export:
    - RecruitmentDashboardPage
    - RecruitmentDashboardOverview
    - All dashboard types
    - All dashboard components
    - Dashboard API hooks
  </action>
  <verify>TypeScript compiles: npx tsc --noEmit src/features/recruitment/index.ts</verify>
  <done>Exports work, no circular dependencies</done>
</task>

</tasks>

<verification>
After all tasks, verify:
- [ ] Route accessible at /dashboard/recruitment/overview
- [ ] RBAC blocks unauthorized roles
- [ ] Data scoped correctly per role
- [ ] All 12 KPIs display with real data
- [ ] All 3 charts render with real data
- [ ] Filters update data on change
- [ ] Loading/error/empty states work
- [ ] TypeScript compilation passes
- [ ] Build succeeds
</verification>

<success_criteria>
- [ ] All tasks verified
- [ ] Must-haves confirmed
</success_criteria>