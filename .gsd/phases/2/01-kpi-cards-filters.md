---
phase: 2
plan: 1
wave: 2
depends_on: ["1.1", "1.2"]
files_modified:
  - src/features/recruitment/components/DashboardKpiCards.tsx
  - src/features/recruitment/components/DashboardFilters.tsx
autonomous: true
must_haves:
  truths:
    - "All 12 KPIs display in responsive grid"
    - "Loading skeletons show during fetch"
    - "Empty states show when values are 0"
    - "Error states display with retry button"
    - "Date range picker with presets works"
    - "RBAC-aware filters (department/recruiter/job)"
  artifacts:
    - "DashboardKpiCards.tsx with 12 KPI cards"
    - "DashboardFilters.tsx with date range and filter controls"
    - "Components exported from components index"
---

# Plan 2.1: KPI Cards & Filter Components

## Objective
Build the DashboardKpiCards component displaying all 12 KPIs in a responsive grid with proper loading, empty, and error states. Build the DashboardFilters component with date range picker, preset periods, and RBAC-aware filter dropdowns.

## Context
Load for context:
- .gsd/SPEC.md
- src/features/recruitment/components/RecruitmentKpiCards.tsx (existing 5-card pattern)
- src/features/recruitment/components/RecruitmentFilterBar.tsx (existing filter pattern)
- src/shared/ui/Skeleton.tsx (SkeletonStatCard, SkeletonCard)
- src/shared/ui/EmptyState.tsx
- src/shared/ui/ErrorDisplay.tsx
- src/shared/ui/Button.tsx, Select.tsx, Input.tsx
- src/features/recruitment/utils/recruitmentRbac.ts
- src/features/auth/hooks/useRBAC.ts
- lucide-react icons

## Tasks

<task type="auto">
  <name>Create DashboardKpiCards component with 12 KPIs</name>
  <files>src/features/recruitment/components/DashboardKpiCards.tsx</files>
  <action>
    Create a new component (not modifying RecruitmentKpiCards) that displays all 12 KPIs in a responsive grid:
    
    Grid: 2 cols mobile, 3 cols tablet, 4 cols desktop, 6 cols xl
    
    KPI Card Definitions (with icons from lucide-react):
    1. Open Positions - Briefcase - Blue - Shows total, critical, aging
    2. Total Candidates - Users - Violet - Shows total, active, talent pool
    3. New Applications - FileText - Amber - Shows count, period delta %
    4. Shortlisted - Filter - Sky - Shows count, shortlist rate %
    5. Interviews Scheduled - CalendarDays - Indigo - Shows scheduled, SLA breaches
    6. Selected Candidates - CheckCheck - Emerald - Shows count, pass-through rate
    7. Rejected Candidates - XCircle - Rose - Shows count, top reason badge
    8. Offers - Handshake - Purple - Shows released, accepted, OAR%, expiring
    9. Positions Filled - BadgeCheck - Green - Shows hired, requisitions closed
    10. Recruitment Cost - DollarSign - Orange - Shows total cost, CPH
    11. Time to Hire - Clock - Cyan - Shows avg days, time to fill
    12. Pipeline Health - TrendingUp - Teal - Shows funnel conversion %
    
    Each card structure:
    - Header: Label + Icon in colored badge
    - Primary value: Large number (text-2xl font-extrabold)
    - Secondary metrics: 2-3 small badges/lines with contextual info
    - Trend indicator: Up/down arrow with delta % for applicable KPIs
    
    States:
    - Loading: Show SkeletonStatCard for each (12 skeletons)
    - Error: Show compact ErrorDisplay with retry
    - Empty (all zeros): Show cards with 0 values and "No data" hints
    
    Props interface:
    interface DashboardKpiCardsProps {
      kpis: RecruitmentDashboardKPIs | null;
      isLoading: boolean;
      error?: unknown;
      onRetry?: () => void;
    }
    
    Follow styling patterns from RecruitmentKpiCards.tsx (rounded-2xl, border, shadow-sm, dark mode support).
  </action>
  <verify>TypeScript compiles: npx tsc --noEmit src/features/recruitment/components/DashboardKpiCards.tsx</verify>
  <done>Component exists, displays 12 KPIs, handles all states, TypeScript passes</done>
</task>

<task type="auto">
  <name>Create DashboardFilters component with date range and RBAC filters</name>
  <files>src/features/recruitment/components/DashboardFilters.tsx</files>
  <action>
    Create a filter bar component with:
    
    1. Date Range Picker:
       - Two date inputs (start_date, end_date)
       - Preset buttons: Last 7 days, Last 30 days, Last 90 days, FYTD (Apr-Mar), Custom
       - Default: Last 30 days
       - Validation: start_date <= end_date
    
    2. Department Filter (multi-select):
       - Fetch departments from workforce API (useGetDepartmentsQuery)
       - Only show for roles with org-wide access (HR_ADMIN, SUPER_ADMIN)
       - For RECRUITER/MANAGER: pre-filtered to their scope, read-only display
    
    3. Recruiter Filter (multi-select):
       - Fetch recruiters from employees API
       - Only for HR_ADMIN/SUPER_ADMIN
       - RECRUITER: locked to self
    
    4. Job Filter (select):
       - Fetch jobs from recruitment API
       - Filtered by department selection
    
    5. Source Filter (select):
       - Options: LinkedIn, Naukri, GitHub, Referral, Agency, Career Site, DIRECT, Other
    
    6. Actions:
       - Apply button (triggers refetch)
       - Reset button (clears to defaults)
       - Loading spinner during fetch
    
    Props interface:
    interface DashboardFiltersProps {
      initialParams: DashboardOverviewQueryParams;
      onFiltersChange: (params: DashboardOverviewQueryParams) => void;
      isLoading: boolean;
      departments?: Department[];
      recruiters?: Employee[];
      jobs?: JobOpening[];
    }
    
    Use existing patterns from RecruitmentFilterBar.tsx and shared UI components.
    Integrate with useRBAC to determine filter visibility/locked state.
  </action>
  <verify>TypeScript compiles: npx tsc --noEmit src/features/recruitment/components/DashboardFilters.tsx</verify>
  <done>Component exists with all filters, RBAC integration, TypeScript passes</done>
</task>

<task type="auto">
  <name>Export new components from components index</name>
  <files>src/features/recruitment/components/index.ts</files>
  <action>
    Create or update the components index.ts to export:
    - DashboardKpiCards
    - DashboardFilters
    - (Keep existing exports)
  </action>
  <verify>TypeScript compiles: npx tsc --noEmit src/features/recruitment/components/index.ts</verify>
  <done>Exports work correctly</done>
</task>

</tasks>

<verification>
After all tasks, verify:
- [ ] DashboardKpiCards.tsx renders 12 KPIs correctly
- [ ] Loading, empty, error states work
- [ ] DashboardFilters.tsx has all filter controls
- [ ] RBAC properly controls filter visibility
- [ ] TypeScript compilation passes
</verification>

<success_criteria>
- [ ] All tasks verified
- [ ] Must-haves confirmed
</success_criteria>