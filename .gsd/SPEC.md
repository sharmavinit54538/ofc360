# Recruitment Sidebar Navigation Integration - Specification

## Overview
Integrate the complete "Recruitment Management System (RMS/ATS)" navigation module into the application's Navigation Sidebar/Slider Menu with:
- Desktop collapsible sidebar
- Mobile slide-over drawer
- Dynamic badge counters from API
- Strict 6-role RBAC enforcement

## Core Requirements

### 1. Sidebar Navigation Hierarchy & Role Filtering
Add a new "TALENT & RECRUITMENT" section with role-specific sub-items:

**HR_ADMIN & HR_EXECUTIVE (RECRUITER):**
- Overview Dashboard (`/recruitment/dashboard`) - Icon: `LayoutDashboard`
- Job Requisitions (`/recruitment/requisitions`) - Icon: `FileText`, Badge: `pending_req_approvals_count` (HR_ADMIN only)
- Job Openings (`/recruitment/jobs`) - Icon: `Briefcase`, Badge: `active_openings_count`
- Candidates & ATS Pipeline (`/recruitment/candidates`) - Icon: `Users`, Badge: `new_applications_count`
- Interview Scheduler (`/recruitment/interviews`) - Icon: `Calendar`, Badge: `today_interviews_count`
- Offer Management (`/recruitment/offers`) - Icon: `Award`, Badge: `pending_offer_approvals_count`
- Background Verification (BGV) (`/recruitment/bgv`) - Icon: `ShieldCheck`, Badge: `bgv_discrepancy_alerts_count`
- Recruitment Analytics & Reports (`/recruitment/reports`) - Icon: `BarChart3`

**MANAGER:**
- Team Requisitions (`/manager/requisitions`) - Icon: `FilePlus`, Badge: `my_open_vacancies_count`
- Candidate Shortlists (`/manager/candidates`) - Icon: `UserCheck`, Badge: `pending_profile_reviews_count`
- Interview Panel & Scorecards (`/manager/interviews`) - Icon: `CheckSquare`, Badge: `overdue_scorecards_count`
- Department Offer Approvals (`/manager/offers`) - Icon: `FileCheck`, Badge: `pending_my_offer_approvals_count`

**IT_ADMIN:**
- Onboarding IT Queue (`/it-admin/onboarding-queue`) - Icon: `Laptop`, Badge: `pending_it_provisioning_count`
- Asset Allocations (`/it-admin/assets`) - Icon: `HardDrive`

**EMPLOYEE:**
- Internal Careers (IJP) (`/careers/internal`) - Icon: `Compass`
- My Referrals & Rewards (`/employee/referrals`) - Icon: `Gift`, Badge: `active_referral_updates_count`
- Assigned Interviews (`/employee/interviews`) - Icon: `ClipboardList`, Condition: `user.has_assigned_interviews === true`, Badge: `pending_scorecards_count`

### 2. Backend API for Dynamic Badge Counters
Endpoint: `GET /api/v1/sidebar/badges`
- Authenticated via Bearer JWT
- Extracts `tenant_id`, `user_id`, `role` from JWT
- Runs optimized SQL COUNT queries per role
- Returns only relevant badge counts for the user's role

Response Interface:
```typescript
export interface SidebarBadgesResponse {
  pending_req_approvals_count?: number;
  new_applications_count?: number;
  today_interviews_count?: number;
  overdue_scorecards_count?: number;
  pending_offer_approvals_count?: number;
  bgv_discrepancy_alerts_count?: number;
  pending_it_provisioning_count?: number;
  pending_profile_reviews_count?: number;
  active_referral_updates_count?: number;
}
```

### 3. Zero Mock Data Policy
- NO hardcoded badge counts
- NO fake notification counters
- All badges bound to dynamic API state hooks
- Loading skeletons during fetch
- Empty state handling when counts are 0

## Technical Stack
- React 18 + TypeScript + Vite
- Redux Toolkit + RTK Query
- Tailwind CSS
- Lucide React icons
- React Router v6

## Files to Create/Modify
```
src/features/dashboard/components/
├── dashboardTabs.data.ts           # Add recruitment section & tabs
├── DashboardSidebar.tsx            # Add badge fetching & RBAC filtering

src/features/recruitment/
├── api/
│   └── sidebarBadgesApi.ts         # RTK Query for sidebar badges
├── types/
│   └── sidebar.types.ts            # Sidebar badge types
├── components/
│   └── RecruitmentSidebarSection.tsx  # Recruitment-specific sidebar section

src/app/router/AppRoutes.tsx        # Add recruitment routes
```

## Acceptance Criteria
1. "TALENT & RECRUITMENT" section appears in sidebar for authorized roles
2. Sub-items filtered by user role (6-role RBAC)
3. Badge counts fetched from `/api/v1/sidebar/badges`
4. No hardcoded badge values anywhere
5. Loading skeletons during badge fetch
6. Mobile drawer and desktop sidebar both work
7. Routes accessible and protected by ProtectedRoute
8. TypeScript compiles without errors
9. Build succeeds