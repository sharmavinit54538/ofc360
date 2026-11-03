---
phase: 2
plan: 1
wave: 2
depends_on: ["1.1"]
files_modified:
  - src/features/dashboard/components/dashboardTabs.data.ts
  - src/features/dashboard/components/DashboardSidebar.tsx
autonomous: true
must_haves:
  truths:
    - "TALENT & RECRUITMENT section added to SIDEBAR_SECTIONS"
    - "Recruitment tabs added with role-based visibility configuration"
    - "DashboardSidebar fetches badges via useGetSidebarBadgesQuery"
    - "Tabs filtered by user role using useRBAC hook"
    - "Badges displayed dynamically from API response"
    - "Loading skeletons shown during badge fetch"
    - "No hardcoded badge values anywhere"
  artifacts:
    - "Updated dashboardTabs.data.ts with recruitment section and tabs"
    - "Updated DashboardSidebar.tsx with badge fetching and RBAC filtering"
---

# Plan 2.1: Sidebar Configuration & RBAC Integration

## Objective
Add the "TALENT & RECRUITMENT" section to the sidebar configuration with role-specific tabs, and update the DashboardSidebar component to fetch dynamic badge counts and filter tabs based on user role.

## Context
Load for context:
- .gsd/SPEC.md
- src/features/dashboard/components/dashboardTabs.data.ts (SIDEBAR_SECTIONS, DASHBOARD_TABS)
- src/features/dashboard/components/DashboardSidebar.tsx (rendering logic)
- src/features/recruitment/api/sidebarBadgesApi.ts (from plan 1.1)
- src/features/auth/hooks/useRBAC.ts (role checking)
- src/features/recruitment/utils/recruitmentRbac.ts (recruitment-specific RBAC)
- src/features/auth/hooks/useAuth.ts (user object with has_assigned_interviews)

## Tasks

<task type="auto">
  <name>Add recruitment section and tabs to dashboardTabs.data.ts</name>
  <files>src/features/dashboard/components/dashboardTabs.data.ts</files>
  <action>
    Update dashboardTabs.data.ts to add the recruitment navigation:
    
    1. Add 'recruitment' to SidebarSection type union
    
    2. Add new section to SIDEBAR_SECTIONS array:
       - id: 'recruitment'
       - label: 'TALENT & RECRUITMENT'
       - icon: Briefcase (from lucide-react)
       - collapsible: true
       - defaultExpanded: true
       - order: 3 (after talent, before attendance)
    
    3. Add recruitment tabs to DASHBOARD_TABS array with role-based metadata:
       Each tab needs a new `roles` property (string[]) for RBAC filtering:
       
       HR_ADMIN & HR_EXECUTIVE tabs:
       - id: 'recruitment-dashboard', label: 'Overview Dashboard', icon: LayoutDashboard, path: '/recruitment/dashboard', section: 'recruitment', roles: ['SUPER_ADMIN', 'HR_ADMIN', 'RECRUITER']
       - id: 'recruitment-requisitions', label: 'Job Requisitions', icon: FileText, path: '/recruitment/requisitions', section: 'recruitment', roles: ['SUPER_ADMIN', 'HR_ADMIN'], badgeKey: 'pending_req_approvals_count'
       - id: 'recruitment-jobs', label: 'Job Openings', icon: Briefcase, path: '/recruitment/jobs', section: 'recruitment', roles: ['SUPER_ADMIN', 'HR_ADMIN', 'RECRUITER'], badgeKey: 'active_openings_count'
       - id: 'recruitment-candidates', label: 'Candidates & ATS Pipeline', icon: Users, path: '/recruitment/candidates', section: 'recruitment', roles: ['SUPER_ADMIN', 'HR_ADMIN', 'RECRUITER'], badgeKey: 'new_applications_count'
       - id: 'recruitment-interviews', label: 'Interview Scheduler', icon: Calendar, path: '/recruitment/interviews', section: 'recruitment', roles: ['SUPER_ADMIN', 'HR_ADMIN', 'RECRUITER', 'MANAGER'], badgeKey: 'today_interviews_count'
       - id: 'recruitment-offers', label: 'Offer Management', icon: Award, path: '/recruitment/offers', section: 'recruitment', roles: ['SUPER_ADMIN', 'HR_ADMIN', 'RECRUITER'], badgeKey: 'pending_offer_approvals_count'
       - id: 'recruitment-bgv', label: 'Background Verification (BGV)', icon: ShieldCheck, path: '/recruitment/bgv', section: 'recruitment', roles: ['SUPER_ADMIN', 'HR_ADMIN', 'RECRUITER'], badgeKey: 'bgv_discrepancy_alerts_count'
       - id: 'recruitment-reports', label: 'Recruitment Analytics & Reports', icon: BarChart3, path: '/recruitment/reports', section: 'recruitment', roles: ['SUPER_ADMIN', 'HR_ADMIN', 'RECRUITER']
       
       MANAGER tabs:
       - id: 'manager-requisitions', label: 'Team Requisitions', icon: FilePlus, path: '/manager/requisitions', section: 'recruitment', roles: ['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER'], badgeKey: 'my_open_vacancies_count'
       - id: 'manager-candidates', label: 'Candidate Shortlists', icon: UserCheck, path: '/manager/candidates', section: 'recruitment', roles: ['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER'], badgeKey: 'pending_profile_reviews_count'
       - id: 'manager-interviews', label: 'Interview Panel & Scorecards', icon: CheckSquare, path: '/manager/interviews', section: 'recruitment', roles: ['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER'], badgeKey: 'overdue_scorecards_count'
       - id: 'manager-offers', label: 'Department Offer Approvals', icon: FileCheck, path: '/manager/offers', section: 'recruitment', roles: ['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER'], badgeKey: 'pending_my_offer_approvals_count'
       
       IT_ADMIN tabs:
       - id: 'itadmin-onboarding', label: 'Onboarding IT Queue', icon: Laptop, path: '/it-admin/onboarding-queue', section: 'recruitment', roles: ['SUPER_ADMIN', 'IT_ADMIN'], badgeKey: 'pending_it_provisioning_count'
       - id: 'itadmin-assets', label: 'Asset Allocations', icon: HardDrive, path: '/it-admin/assets', section: 'recruitment', roles: ['SUPER_ADMIN', 'IT_ADMIN']
       
       EMPLOYEE tabs:
       - id: 'employee-careers', label: 'Internal Careers (IJP)', icon: Compass, path: '/careers/internal', section: 'recruitment', roles: ['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER', 'EMPLOYEE', 'IT_ADMIN']
       - id: 'employee-referrals', label: 'My Referrals & Rewards', icon: Gift, path: '/employee/referrals', section: 'recruitment', roles: ['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER', 'EMPLOYEE', 'IT_ADMIN'], badgeKey: 'active_referral_updates_count'
       - id: 'employee-interviews', label: 'Assigned Interviews', icon: ClipboardList, path: '/employee/interviews', section: 'recruitment', roles: ['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER', 'EMPLOYEE', 'IT_ADMIN'], badgeKey: 'pending_scorecards_count', condition: 'has_assigned_interviews'
    
    4. Update DashboardTabItem interface to include:
       - roles?: string[] (allowed roles)
       - badgeKey?: keyof SidebarBadgesResponse (maps to badge count)
       - condition?: string (optional condition like 'has_assigned_interviews')
    
    5. Add recruitment to LEGACY_ALIASES for backward compatibility
    
    Import required icons: Briefcase, FileText, Users, Calendar, Award, ShieldCheck, BarChart3, FilePlus, UserCheck, CheckSquare, FileCheck, Laptop, HardDrive, Compass, Gift, ClipboardList from lucide-react
  </action>
  <verify>TypeScript compiles: npx tsc --noEmit src/features/dashboard/components/dashboardTabs.data.ts</verify>
  <done>Section and tabs added with role metadata, TypeScript passes</done>
</task>

<task type="auto">
  <name>Update DashboardSidebar to fetch badges and filter by RBAC</name>
  <files>src/features/dashboard/components/DashboardSidebar.tsx</files>
  <action>
    Update DashboardSidebar component to:
    
    1. Import useGetSidebarBadgesQuery from recruitment API
    2. Import useRBAC from auth hooks
    3. Import SidebarBadgesResponse type
    
    4. Fetch badges in component:
       const { data: badges, isLoading: badgesLoading } = useGetSidebarBadgesQuery(undefined, {
         refetchInterval: 30000, // Poll every 30 seconds
       });
    
    5. Get RBAC utilities:
       const { hasAnyRole, isSuperAdmin } = useRBAC();
    
    6. Create helper to check if tab should be visible:
       const isTabVisible = (tab: DashboardTabItem): boolean => {
         if (!tab.roles || tab.roles.length === 0) return true;
         if (isSuperAdmin) return true;
         return hasAnyRole(tab.roles);
       };
    
    7. Create helper to check conditional visibility:
       const isConditionMet = (tab: DashboardTabItem, user: User | null): boolean => {
         if (!tab.condition) return true;
         if (tab.condition === 'has_assigned_interviews') {
           return user?.has_assigned_interviews === true;
         }
         return true;
       };
    
    8. Create helper to get badge count for a tab:
       const getBadgeCount = (tab: DashboardTabItem): number | undefined => {
         if (!tab.badgeKey || !badges) return undefined;
         return badges[tab.badgeKey];
       };
    
    9. Update renderTabItem to:
       - Filter tabs using isTabVisible before rendering
       - Check isConditionMet for conditional tabs
       - Display badge count from getBadgeCount (not hardcoded)
       - Show loading skeleton for badge when badgesLoading
       - Don't render badge if count is 0 or undefined
    
    10. Update section rendering to only show sections that have visible tabs
    
    11. In collapsed mode, also filter tabs and show badges
    
    Important: The badge should be rendered as a small indicator next to the label:
    - Use the existing Badge component or custom styled span
    - Only show when count > 0
    - Show skeleton when loading
  </action>
  <verify>TypeScript compiles: npx tsc --noEmit src/features/dashboard/components/DashboardSidebar.tsx</verify>
  <done>Sidebar fetches badges, filters by RBAC, displays dynamic badges, TypeScript passes</done>
</task>

<task type="auto">
  <name>Add recruitment section order and update getModuleOfTab</name>
  <files>src/features/dashboard/components/dashboardTabs.data.ts</files>
  <action>
    Ensure the recruitment section is properly integrated:
    
    1. Update SIDEBAR_SECTIONS order to place recruitment after talent (order: 3)
    2. Update getModuleOfTab to handle recruitment section
    3. Update getTabsBySection to include recruitment tabs
    4. Add recruitment aliases to LEGACY_ALIASES:
       - 'recruitment': 'recruitment'
       - 'recruitment-dashboard': 'recruitment-dashboard'
       - 'requisitions': 'recruitment-requisitions'
       - 'jobs': 'recruitment-jobs'
       - 'candidates': 'recruitment-candidates'
       - 'pipeline': 'recruitment-candidates'
       - 'interviews': 'recruitment-interviews'
       - 'offers': 'recruitment-offers'
       - 'bgv': 'recruitment-bgv'
       - 'recruitment-analytics': 'recruitment-reports'
       - 'manager-requisitions': 'manager-requisitions'
       - 'my-requisitions': 'manager-requisitions'
       - 'team-requisitions': 'manager-requisitions'
       - 'candidate-reviews': 'manager-candidates'
       - 'interview-panel': 'manager-interviews'
       - 'offer-approvals': 'manager-offers'
       - 'onboarding-queue': 'itadmin-onboarding'
       - 'internal-jobs': 'employee-careers'
       - 'ijp': 'employee-careers'
       - 'my-referrals': 'employee-referrals'
       - 'assigned-interviews': 'employee-interviews'
  </action>
  <verify>TypeScript compiles: npx tsc --noEmit src/features/dashboard/components/dashboardTabs.data.ts</verify>
  <done>Section ordering and aliases updated, TypeScript passes</done>
</task>

</tasks>

<verification>
After all tasks, verify:
- [ ] TALENT & RECRUITMENT section appears in sidebar
- [ ] Tabs filtered by user role (6-role RBAC)
- [ ] Badge counts fetched from API and displayed
- [ ] Loading skeletons during fetch
- [ ] No hardcoded badge values
- [ ] Mobile drawer and desktop sidebar both work
- [ ] TypeScript compilation passes
</verification>

<success_criteria>
- [ ] All tasks verified
- [ ] Must-haves confirmed
</success_criteria>