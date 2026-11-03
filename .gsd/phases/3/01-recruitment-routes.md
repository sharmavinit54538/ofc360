---
phase: 3
plan: 1
wave: 3
depends_on: ["2.1"]
files_modified:
  - src/app/router/AppRoutes.tsx
  - src/features/recruitment/pages/RecruitmentDashboardPage.tsx (if needed)
  - src/features/recruitment/components/RecruitmentSidebarSection.tsx
autonomous: true
must_haves:
  truths:
    - "All recruitment routes registered in AppRoutes.tsx"
    - "Routes protected by ProtectedRoute with correct allowedRoles"
    - "Route paths match sidebar tab paths exactly"
    - "Lazy loading used for recruitment pages"
  artifacts:
    - "Updated AppRoutes.tsx with recruitment routes"
    - "RecruitmentSidebarSection component for complex sidebar rendering"
---

# Plan 3.1: Recruitment Routes Integration

## Objective
Register all recruitment module routes in AppRoutes.tsx with proper RBAC protection, matching the sidebar tab paths and role requirements.

## Context
Load for context:
- .gsd/SPEC.md
- src/app/router/AppRoutes.tsx (existing route patterns)
- src/features/auth/components/ProtectedRoute.tsx
- src/features/recruitment/utils/recruitmentRbac.ts (role permissions)
- Dashboard tab paths from dashboardTabs.data.ts

## Tasks

<task type="auto">
  <name>Add recruitment routes to AppRoutes.tsx</name>
  <files>src/app/router/AppRoutes.tsx</files>
  <action>
    Add all recruitment routes to AppRoutes.tsx with proper ProtectedRoute wrappers:
    
    Import required components at top:
    - Lazy load recruitment pages:
      const RecruitmentDashboardPage = React.lazy(() => import('@/features/recruitment/pages/RecruitmentDashboardPage'));
      const RequisitionsPage = React.lazy(() => import('@/features/recruitment/pages/RequisitionsPage'));
      const JobOpeningsPage = React.lazy(() => import('@/features/recruitment/pages/JobOpeningsPage'));
      const CandidatePipelinePage = React.lazy(() => import('@/features/recruitment/pages/CandidatePipelinePage'));
      const InterviewSchedulerPage = React.lazy(() => import('@/features/recruitment/pages/InterviewSchedulerPage'));
      const OfferManagementPage = React.lazy(() => import('@/features/recruitment/pages/OfferManagementPage'));
      const BGVPage = React.lazy(() => import('@/features/recruitment/pages/BGVPage'));
      const RecruitmentReportsPage = React.lazy(() => import('@/features/recruitment/pages/RecruitmentReportsPage'));
      
      const ManagerRequisitionsPage = React.lazy(() => import('@/features/recruitment/pages/ManagerRequisitionsPage'));
      const ManagerCandidatesPage = React.lazy(() => import('@/features/recruitment/pages/ManagerCandidatesPage'));
      const ManagerInterviewsPage = React.lazy(() => import('@/features/recruitment/pages/ManagerInterviewsPage'));
      const ManagerOffersPage = React.lazy(() => import('@/features/recruitment/pages/ManagerOffersPage'));
      
      const ITAdminOnboardingPage = React.lazy(() => import('@/features/recruitment/pages/ITAdminOnboardingPage'));
      const ITAdminAssetsPage = React.lazy(() => import('@/features/recruitment/pages/ITAdminAssetsPage'));
      
      const EmployeeCareersPage = React.lazy(() => import('@/features/recruitment/pages/EmployeeCareersPage'));
      const EmployeeReferralsPage = React.lazy(() => import('@/features/recruitment/pages/EmployeeReferralsPage'));
      const EmployeeInterviewsPage = React.lazy(() => import('@/features/recruitment/pages/EmployeeInterviewsPage'));
    
    Add routes after existing routes (around line 590 where /dashboard/talent is):
    
    HR_ADMIN & RECRUITER routes:
    <Route
      path="/recruitment/dashboard"
      element={
        <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'HR_ADMIN', 'RECRUITER']}>
          <RecruitmentDashboardPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/recruitment/requisitions"
      element={
        <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'HR_ADMIN']}>
          <RequisitionsPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/recruitment/jobs"
      element={
        <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'HR_ADMIN', 'RECRUITER']}>
          <JobOpeningsPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/recruitment/candidates"
      element={
        <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'HR_ADMIN', 'RECRUITER']}>
          <CandidatePipelinePage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/recruitment/interviews"
      element={
        <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'HR_ADMIN', 'RECRUITER', 'MANAGER']}>
          <InterviewSchedulerPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/recruitment/offers"
      element={
        <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'HR_ADMIN', 'RECRUITER']}>
          <OfferManagementPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/recruitment/bgv"
      element={
        <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'HR_ADMIN', 'RECRUITER']}>
          <BGVPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/recruitment/reports"
      element={
        <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'HR_ADMIN', 'RECRUITER']}>
          <RecruitmentReportsPage />
        </ProtectedRoute>
      }
    />
    
    MANAGER routes:
    <Route
      path="/manager/requisitions"
      element={
        <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER']}>
          <ManagerRequisitionsPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/manager/candidates"
      element={
        <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER']}>
          <ManagerCandidatesPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/manager/interviews"
      element={
        <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER']}>
          <ManagerInterviewsPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/manager/offers"
      element={
        <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER']}>
          <ManagerOffersPage />
        </ProtectedRoute>
      }
    />
    
    IT_ADMIN routes:
    <Route
      path="/it-admin/onboarding-queue"
      element={
        <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'IT_ADMIN']}>
          <ITAdminOnboardingPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/it-admin/assets"
      element={
        <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'IT_ADMIN']}>
          <ITAdminAssetsPage />
        </ProtectedRoute>
      }
    />
    
    EMPLOYEE routes:
    <Route
      path="/careers/internal"
      element={
        <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER', 'EMPLOYEE', 'IT_ADMIN']}>
          <EmployeeCareersPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/employee/referrals"
      element={
        <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER', 'EMPLOYEE', 'IT_ADMIN']}>
          <EmployeeReferralsPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/employee/interviews"
      element={
        <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER', 'EMPLOYEE', 'IT_ADMIN']}>
          <EmployeeInterviewsPage />
        </ProtectedRoute>
      }
    />
    
    Note: These routes should be added as top-level routes (not under /dashboard) since the sidebar paths don't include /dashboard prefix for recruitment.
    However, check if the app uses /dashboard prefix for all routes. If so, adjust paths accordingly.
  </action>
  <verify>TypeScript compiles: npx tsc --noEmit src/app/router/AppRoutes.tsx</verify>
  <done>All recruitment routes registered with correct RBAC, TypeScript passes</done>
</task>

<task type="auto">
  <name>Create recruitment dashboard page (if not exists)</name>
  <files>src/features/recruitment/pages/RecruitmentDashboardPage.tsx</files>
  <action>
    Check if RecruitmentDashboardPage exists. If not, create it following the pattern from RecruitmentHubPage.tsx but as a dedicated dashboard page:
    
    - Import DashboardShell, RecruitmentKpiCards, CandidatePipelineBoard, JobOpeningsTable, etc.
    - Use useGetRecruitmentStatsQuery for KPI data
    - Use useGetJobOpeningsQuery, useGetCandidatesQuery, useGetInterviewsQuery
    - Include recruitment-specific filters and actions
    - Follow the same layout pattern as other dashboard pages
    
    If it already exists (from the dashboard overview task), ensure it's properly exported and matches the route.
  </action>
  <verify>TypeScript compiles: npx tsc --noEmit src/features/recruitment/pages/RecruitmentDashboardPage.tsx</verify>
  <done>Page exists and compiles</done>
</task>

<task type="auto">
  <name>Create RecruitmentSidebarSection component for complex rendering</name>
  <files>src/features/recruitment/components/RecruitmentSidebarSection.tsx</files>
  <action>
    Create a dedicated component for rendering the recruitment sidebar section with:
    
    - Badge fetching via useGetSidebarBadgesQuery
    - RBAC filtering via useRBAC
    - Role-specific tab groups
    - Conditional rendering for employee interviews tab
    - Loading skeletons for badges
    
    This component can be used by DashboardSidebar to render the recruitment section cleanly.
    
    Props:
    interface RecruitmentSidebarSectionProps {
      collapsed: boolean;
      onTabChange?: (tabId: string) => void;
      onMobileClose?: () => void;
      badges: SidebarBadgesResponse | undefined;
      badgesLoading: boolean;
    }
    
    Export from recruitment components index.
  </action>
  <verify>TypeScript compiles: npx tsc --noEmit src/features/recruitment/components/RecruitmentSidebarSection.tsx</verify>
  <done>Component exists and compiles</done>
</task>

</tasks>

<verification>
After all tasks, verify:
- [ ] All recruitment routes accessible
- [ ] RBAC protection works correctly
- [ ] Route paths match sidebar tabs
- [ ] Lazy loading configured
- [ ] TypeScript compilation passes
</verification>

<success_criteria>
- [ ] All tasks verified
- [ ] Must-haves confirmed
</success_criteria>