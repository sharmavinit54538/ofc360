---
phase: 1
plan: 2
wave: 1
depends_on: ["1.1"]
files_modified:
  - src/features/recruitment/utils/dashboardCalculators.ts
autonomous: true
must_haves:
  truths:
    - "All KPI calculations derive from real API data only"
    - "No hardcoded values or Math.random() anywhere"
    - "Calculators handle empty/zero data gracefully"
    - "Period-over-period delta calculation works correctly"
  artifacts:
    - "Extended dashboardCalculators.ts with new calculation functions"
    - "Unit tests for all new calculators"
---

# Plan 1.2: Dashboard Calculator Utilities

## Objective
Extend the existing dashboardCalculators.ts with new pure calculation functions for all 12 KPIs, hiring funnel, source efficiency, and time-to-hire trends. All functions must be pure, testable, and handle edge cases (empty arrays, missing dates, zero divisions).

## Context
Load for context:
- .gsd/SPEC.md
- src/features/recruitment/utils/dashboardCalculators.ts (existing calculators)
- src/features/recruitment/types/dashboard.types.ts (from plan 1.1)
- src/features/recruitment/types/index.ts (Candidate, Interview, Offer, Job, Requisition types)

## Tasks

<task type="auto">
  <name>Add KPI calculation functions to dashboardCalculators.ts</name>
  <files>src/features/recruitment/utils/dashboardCalculators.ts</files>
  <action>
    Add the following pure calculation functions to the existing file. Each function takes raw API data arrays and returns computed values. NO MOCK DATA - only transform real data:
    
    1. calculateOpenPositions(requisitions: Requisition[]) -> { total, critical_priority_count, aging_over_45_days }
       - Filter: status === 'approved' AND not fully filled
       - Sum: total_vacancies - filled_vacancies
       - Critical: priority === 'URGENT' or 'HIGH'
       - Aging: createdAt > 45 days ago
    
    2. calculateTotalCandidates(candidates: Candidate[]) -> { total_count, active_pipeline, talent_pool_count }
       - Total: unique candidates (by id)
       - Active: stage !== 'hired' && stage !== 'rejected'
       - Talent pool: stage === 'screening' or no jobId
    
    3. calculateNewApplications(applications: Application[], startDate: string, endDate: string, prevStartDate: string, prevEndDate: string) -> { count, period_delta_pct }
       - Count applications where applied_at in range
       - Delta: ((current - previous) / previous) * 100, handle previous === 0
    
    4. calculateShortlisted(applications: Application[]) -> { count, shortlist_rate_pct }
       - Count where current_stage === 'SHORTLISTED' or 'screening'
       - Rate: shortlisted / total_applications * 100
    
    5. calculateInterviewsScheduled(interviews: Interview[], startDate: string, endDate: string) -> { total_scheduled, pending_feedback_sla_breaches }
       - Scheduled: status === 'SCHEDULED' and date in range
       - SLA breaches: status === 'COMPLETED' > 24 hours ago with no feedback/scorecard
    
    6. calculateSelectedCandidates(applications: Application[], interviews: Interview[]) -> { count, interview_to_select_rate_pct }
       - Count where current_stage === 'SELECTED' or 'offer'
       - Rate: selected / interviewed * 100
    
    7. calculateRejectedCandidates(applications: Application[]) -> { count, top_rejection_reasons: {reason, count}[] }
       - Count where current_stage === 'REJECTED'
       - Group by rejection_reason, sort by count desc, top 5
    
    8. calculateOffers(offers: Offer[]) -> { released, accepted, acceptance_rate_pct, expiring_soon_count }
       - Released: status === 'sent' or 'released'
       - Accepted: status === 'accepted'
       - Rate: accepted / released * 100
       - Expiring: respondedAt within 48 hours or offer_expiry_date within 48 hours
    
    9. calculatePositionsFilled(applications: Application[], requisitions: Requisition[]) -> { hired_count, requisitions_closed }
       - Hired: stage === 'HIRED' or 'hired'
       - Closed: requisitions where filled_vacancies === total_vacancies
    
    10. calculateFinancials(costs: RecruitmentCost[], positionsFilled: number) -> { total_recruitment_cost, cost_per_hire, currency }
        - Sum internal + external costs
        - CPH: total_cost / positions_filled (handle 0)
        - Currency from data or default 'INR'
    
    11. calculateVelocity(offers: Offer[], applications: Application[], requisitions: Requisition[]) -> { avg_time_to_hire_days, avg_time_to_fill_days }
        - Time to hire: AVG(offers.responded_at - applications.applied_at) for accepted offers
        - Time to fill: AVG(offers.responded_at - requisitions.approved_at) for accepted offers
    
    12. calculateHiringFunnel(applications: Application[]) -> { stage, count, conversion_pct }[]
        - Use existing calculateFunnelDropoff but adapt to return funnel format
        - Stages: Applied, Screening, Shortlisted, Interview, Technical, HR, Offer, Hired
        - Conversion: count at stage / total applied * 100
    
    All functions must:
    - Be pure (no side effects)
    - Handle empty arrays (return zeros)
    - Handle missing/invalid dates gracefully
    - Handle division by zero
    - Use existing helper patterns from the file (asNumber, optionalNumber, etc.)
    - Include JSDoc comments for each function
  </action>
  <verify>TypeScript compiles: npx tsc --noEmit src/features/recruitment/utils/dashboardCalculators.ts</verify>
  <done>All 12 calculation functions added, TypeScript passes, functions are pure and handle edge cases</done>
</task>

<task type="auto">
  <name>Create unit tests for dashboard calculators</name>
  <files>src/features/recruitment/__tests__/dashboardCalculators.test.ts</files>
  <action>
    Write comprehensive Vitest unit tests for all new calculation functions:
    
    Test cases for each function:
    - Empty arrays return zeroed objects
    - Normal data returns correct calculations
    - Edge cases: missing dates, zero divisions, invalid data
    - Period delta: positive, negative, zero previous period
    - Funnel: correct stage ordering and conversion math
    - Velocity: correct date difference calculations
    
    Use realistic test data matching actual API shapes (Candidate, Interview, Offer, Requisition types).
    Follow existing test patterns from dashboardCalculators.test.ts if exists.
    Aim for >90% coverage on new functions.
  </action>
  <verify>Run tests: npm test -- src/features/recruitment/__tests__/dashboardCalculators.test.ts</verify>
  <done>Tests exist, all pass, good coverage on new functions</done>
</task>

</tasks>

<verification>
After all tasks, verify:
- [ ] dashboardCalculators.ts has all 12 new calculation functions
- [ ] All functions are pure and handle edge cases
- [ ] Unit tests exist and pass
- [ ] TypeScript compilation passes
</verification>

<success_criteria>
- [ ] All tasks verified
- [ ] Must-haves confirmed
</success_criteria>