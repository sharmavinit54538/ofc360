# ROADMAP: Reduce HR Admin Dashboard Sidebar to Exactly 12 Items

## Phases

- [ ] **Phase 1: Tab Data Structure, Helpers & Unit Tests**
  - Clean duplicates in `dashboardTabs.data.ts`
  - Ensure all 67 tabs map to exactly one of the 12 sections
  - Add `LEGACY_ALIASES`, `getModuleTabs`, `getModuleOfTab`, and updated `getTabConfig`
  - Inline attendance sub-components instead of navigating out
  - Implement comprehensive Vitest tests in `dashboardNavigation.test.ts`

- [ ] **Phase 2: Simplify Sidebar to Exactly 12 Flat Items**
  - Render 12 flat items in `DashboardSidebar.tsx` matching `SIDEBAR_SECTIONS`
  - Highlight active module based on current `activeTab`
  - NavLink to `/settings` for settings item
  - Support collapsed (w-16) and expanded (w-64) states with tooltips
  - Clean unused imports and dead code

- [ ] **Phase 3: Module-Level Sub-Tabs & View Orchestration**
  - Integrate `DashboardTabBar` in `HRAdminDashboard.tsx`
  - Show horizontal tab bar when module has > 1 sub-tab; hide when 1
  - Module state tracking: remember last active sub-tab per module
  - URL hash support: `#tab-id` and `#module-id` with `hashchange` support
  - Fix `DynamicModuleView` to avoid lazy() in render

- [ ] **Phase 4: Verification & Acceptance Proof**
  - Run all Vitest suites and capture output
  - Run TypeScript typecheck to verify no new errors
  - Verify acceptance criteria and update `.gsd/STATE.md`
