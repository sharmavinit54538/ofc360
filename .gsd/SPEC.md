# Recruitment Dashboard Overview - Specification

## Overview
Build a complete, production-grade "Recruitment Dashboard (Main Overview)" module for the SaaS Recruitment Management System (RMS/ATS). This dashboard provides HR Admins, Recruiters, and Hiring Managers with real-time visibility into the entire recruitment lifecycle through 12 core KPIs, hiring funnel visualization, source efficiency metrics, and time-to-hire trends.

## Core Requirements

### 1. KPI Metrics (12 Core + Contextual Info)
All metrics must be dynamically calculated from backend API responses - **ZERO MOCK DATA**:
1. **Total Open Positions** - Sum of unfilled vacancies across approved requisitions, with priority/aging breakdown
2. **Total Candidates** - Unique count in talent pool, split by active pipeline vs talent pool
3. **New Applications** - Applications in date range with period-over-period delta %
4. **Shortlisted Candidates** - Count in shortlist stage with shortlist rate
5. **Interviews Scheduled** - Scheduled interviews with overdue feedback SLA breaches
6. **Selected Candidates** - Cleared all rounds, approved for offer with pass-through rate
7. **Rejected Candidates** - Rejected at any stage with top rejection reasons breakdown
8. **Offers Released** - Formal offers dispatched with expiring soon count
9. **Offers Accepted** - E-signed offers with Offer Acceptance Rate (OAR)
10. **Positions Filled** - Hired/onboarded with requisitions closed count
11. **Recruitment Cost** - Total cost with Cost Per Hire (CPH)
12. **Average Time to Hire** - Days from application to offer acceptance + Time to Fill

### 2. RBAC & Data Scope
Enforce strict multi-tenant isolation:
- **HR Admin**: Organization-wide view across all departments
- **Recruiter (HR Executive)**: Filtered to assigned requisitions/jobs/candidates
- **Manager (Hiring Lead)**: Filtered to department requisitions and applications
- **IT Admin**: Onboarding/handoff queue only
- **Employee**: Personal referrals and assigned interview scorecards only

### 3. Backend API Contract
Endpoint: `GET /api/v1/recruitment/dashboard/overview`
Query params: `start_date`, `end_date`, `department_id`, `location_id`, `recruiter_id`, `job_id`, `source_type`

Response must match the TypeScript interface defined in the task.

### 4. Frontend Requirements
- Loading skeletons for all KPI cards and charts
- Empty states when counts are 0
- Error boundaries with retry functionality
- Date range picker with preset periods (7d, 30d, 90d, FYTD)
- Department/Location/Recruiter filters based on RBAC
- Responsive design (375px, 768px, 1280px breakpoints)
- Dark/light theme support

## Technical Stack
- React 18 + TypeScript + Vite
- Redux Toolkit + RTK Query for API layer
- Tailwind CSS for styling
- Recharts for visualizations
- Lucide React for icons
- Vitest for testing

## Architecture Constraints
- **Strict ZERO MOCK DATA POLICY** - No hardcoded values, Math.random(), dummy objects
- All data driven by database models, aggregated SQL queries, API contracts
- Robust frontend state handling (Loading, Empty, Error states)
- Follow existing codebase patterns from `src/features/recruitment/`

## File Structure to Create/Modify
```
src/features/recruitment/
├── types/
│   └── dashboard.types.ts          # Dashboard KPI types
├── utils/
│   └── dashboardCalculators.ts     # Extended with new calculators
├── api/
│   └── dashboardApi.ts             # RTK Query endpoints
├── components/
│   ├── DashboardKpiCards.tsx       # 12 KPI cards grid
│   ├── HiringFunnelChart.tsx       # Funnel visualization
│   ├── SourceEfficiencyChart.tsx   # Source breakdown
│   ├── TimeToHireChart.tsx         # Time trend chart
│   ├── DashboardFilters.tsx        # Date range, filters
│   └── RecruitmentDashboardOverview.tsx  # Main page component
├── pages/
│   └── RecruitmentDashboardPage.tsx      # Route page with RBAC
└── __tests__/
    ├── dashboardCalculators.test.ts
    ├── DashboardKpiCards.test.tsx
    └── HiringFunnelChart.test.tsx
```

## Acceptance Criteria
1. All 12 KPIs display correctly with real backend data
2. Loading skeletons show during fetch
3. Empty states display when counts are 0
4. Error boundaries catch and display API errors with retry
5. RBAC properly filters data per role
6. Date range filters update all metrics
7. Charts render with real data
8. TypeScript compiles without errors
9. Tests pass for calculators and components
10. Build succeeds