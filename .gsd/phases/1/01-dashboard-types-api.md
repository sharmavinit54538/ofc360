---
phase: 1
plan: 1
wave: 1
depends_on: []
files_modified:
  - src/features/recruitment/types/dashboard.types.ts
  - src/features/recruitment/api/dashboardApi.ts
autonomous: true
must_haves:
  truths:
    - "Dashboard KPI types match backend API contract exactly"
    - "RTK Query endpoints support all query parameters"
    - "Response transformation handles nested API envelopes"
  artifacts:
    - "src/features/recruitment/types/dashboard.types.ts exists with RecruitmentDashboardKPIs interface"
    - "src/features/recruitment/api/dashboardApi.ts exists with getDashboardOverview query"
    - "Types exported from index.ts for easy imports"
---

# Plan 1.1: Dashboard Types & API Endpoints

## Objective
Define TypeScript interfaces for all 12 KPIs matching the backend contract, and create RTK Query endpoints for the dashboard overview API with full query parameter support.

## Context
Load for context:
- .gsd/SPEC.md
- src/features/recruitment/types/index.ts (existing domain types)
- src/features/recruitment/types/recruitment.types.ts (existing RecruitmentStats)
- src/features/recruitment/api/recruitmentApi.ts (existing RTK Query patterns)
- src/shared/api/baseQuery.ts (baseQueryWithReauth)

## Tasks

<task type="auto">
  <name>Create dashboard KPI TypeScript interfaces</name>
  <files>src/features/recruitment/types/dashboard.types.ts</files>
  <action>
    Create the complete TypeScript interface for RecruitmentDashboardKPIs matching the backend contract exactly. Include all 12 KPI objects with their nested properties:
    
    1. open_positions: { total, critical_priority_count, aging_over_45_days }
    2. total_candidates: { total_count, active_pipeline, talent_pool_count }
    3. new_applications: { count, period_delta_pct }
    4. shortlisted: { count, shortlist_rate_pct }
    5. interviews_scheduled: { total_scheduled, pending_feedback_sla_breaches }
    6. selected_candidates: { count, interview_to_select_rate_pct }
    5. rejected_candidates: { count, top_rejection_reasons: { reason, count }[] }
    8. offers: { released, accepted, acceptance_rate_pct, expiring_soon_count }
    9. positions_filled: { hired_count, requisitions_closed }
    10. financials: { total_recruitment_cost, cost_per_hire, currency }
    11. velocity: { avg_time_to_hire_days, avg_time_to_fill_days }
    12. hiring_funnel: { stage, count, conversion_pct }[]
    
    Also create query parameter interface: DashboardOverviewQueryParams with start_date, end_date, department_id, location_id, recruiter_id, job_id, source_type (all optional strings).
    
    Follow existing patterns from recruitment.types.ts - use PascalCase for interfaces, camelCase for properties.
    Export all types from the file.
  </action>
  <verify>TypeScript compiles: npx tsc --noEmit src/features/recruitment/types/dashboard.types.ts</verify>
  <done>File exists with all interfaces, exports correctly, no TypeScript errors</done>
</task>

<task type="auto">
  <name>Create dashboard API RTK Query endpoints</name>
  <files>src/features/recruitment/api/dashboardApi.ts</files>
  <action>
    Create RTK Query API slice for dashboard overview endpoint following existing patterns from recruitmentApi.ts:
    
    - Use createApi with baseQuery: baseQueryWithReauth
    - TagTypes: ['DashboardOverview']
    - Endpoint: getDashboardOverview with query params from DashboardOverviewQueryParams
    - URL: '/recruitment/dashboard/overview' with query parameters
    - Transform response using existing transformResponse pattern
    - Provides tags: ['DashboardOverview']
    - Export useGetDashboardOverviewQuery hook
    
    Query parameter handling:
    - Build URLSearchParams from all provided params
    - Only append non-empty/undefined values
    - Support date range, department, location, recruiter, job, source filters
    
    Follow the exact pattern from recruitmentApi.ts lines 50-59 for getRecruitmentStats.
  </action>
  <verify>TypeScript compiles: npx tsc --noEmit src/features/recruitment/api/dashboardApi.ts</verify>
  <done>File exists with proper RTK Query setup, exports hook, no TypeScript errors</done>
</task>

<task type="auto">
  <name>Export new types and API from index files</name>
  <files>src/features/recruitment/types/index.ts, src/features/recruitment/api/index.ts</files>
  <action>
    Update exports to include new dashboard types and API:
    - In types/index.ts: export * from './dashboard.types'
    - Create src/features/recruitment/api/index.ts if not exists, export { useGetDashboardOverviewQuery } from './dashboardApi'
    - Ensure existing exports are not broken
  </action>
  <verify>TypeScript compiles: npx tsc --noEmit src/features/recruitment/types/index.ts src/features/recruitment/api/index.ts</verify>
  <done>All exports work, existing imports still function</done>
</task>

</tasks>

<verification>
After all tasks, verify:
- [ ] dashboard.types.ts exists with complete RecruitmentDashboardKPIs interface
- [ ] dashboardApi.ts exists with getDashboardOverview query
- [ ] TypeScript compilation passes for all new files
- [ ] Exports work correctly from index files
</verification>

<success_criteria>
- [ ] All tasks verified
- [ ] Must-haves confirmed
</success_criteria>