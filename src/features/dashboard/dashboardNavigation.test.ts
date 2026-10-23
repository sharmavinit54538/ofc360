import { describe, it, expect } from 'vitest';
import {
  SIDEBAR_SECTIONS,
  DASHBOARD_TABS,
  LEGACY_ALIASES,
  getModuleTabs,
  getModuleOfTab,
  getTabConfig,
  type SidebarSection,
} from './components/dashboardTabs.data';

describe('HR Admin Dashboard Navigation & Tab Structure', () => {
  it('has exactly 12 sidebar sections', () => {
    expect(SIDEBAR_SECTIONS).toHaveLength(12);
    const sectionIds = SIDEBAR_SECTIONS.map((s) => s.id);
    expect(sectionIds).toEqual([
      'overview',
      'workforce',
      'recruitment',
      'attendance',
      'payroll',
      'leave',
      'performance',
      'reports',
      'aihub',
      'documents',
      'hrops',
      'settings',
    ]);
  });

  it('has unique tab IDs across all top-level tabs and nested children (no duplicates) and 67 reachable IDs', () => {
    const allIds: string[] = [];
    for (const tab of DASHBOARD_TABS) {
      allIds.push(tab.id);
      if (tab.children) {
        for (const child of tab.children) {
          allIds.push(child.id);
        }
      }
    }

    const uniqueIds = new Set(allIds);
    expect(allIds.length).toBe(uniqueIds.size);
    // 66 tab items in DASHBOARD_TABS
    expect(uniqueIds.size).toBe(66);

    // Including legacy alias (ai-insights), exactly 67 unique tab IDs are reachable
    const allReachableIds = new Set([...allIds, ...Object.keys(LEGACY_ALIASES)]);
    expect(allReachableIds.size).toBe(67);
    for (const id of allReachableIds) {
      expect(getTabConfig(id)).toBeDefined();
    }
  });

  it('every tab belongs to exactly one of the 12 sections', () => {
    const validSections = new Set(SIDEBAR_SECTIONS.map((s) => s.id));

    for (const tab of DASHBOARD_TABS) {
      expect(validSections.has(tab.section)).toBe(true);
      expect(getModuleOfTab(tab.id)).toBe(tab.section);

      if (tab.children) {
        for (const child of tab.children) {
          expect(validSections.has(child.section)).toBe(true);
          expect(getModuleOfTab(child.id)).toBe(child.section);
        }
      }
    }
  });

  it('verifies exact sub-tab counts per module according to SPEC', () => {
    expect(getModuleTabs('overview')).toHaveLength(1);
    expect(getModuleTabs('workforce')).toHaveLength(4);
    expect(getModuleTabs('recruitment')).toHaveLength(23);
    expect(getModuleTabs('attendance')).toHaveLength(5);
    expect(getModuleTabs('payroll')).toHaveLength(1);
    expect(getModuleTabs('leave')).toHaveLength(1);
    expect(getModuleTabs('performance')).toHaveLength(1);
    expect(getModuleTabs('reports')).toHaveLength(3);
    expect(getModuleTabs('aihub')).toHaveLength(13);
    expect(getModuleTabs('documents')).toHaveLength(5);
    expect(getModuleTabs('hrops')).toHaveLength(8);
    expect(getModuleTabs('settings')).toHaveLength(1);
  });

  it('correctly resolves #payroll to payroll module and tab', () => {
    const tab = getTabConfig('payroll');
    expect(tab).toBeDefined();
    expect(tab?.id).toBe('payroll');
    expect(getModuleOfTab('payroll')).toBe('payroll');
  });

  it('correctly resolves #ai-insights as legacy alias to analytics-center in reports', () => {
    expect(LEGACY_ALIASES['ai-insights']).toBe('analytics-center');
    const tab = getTabConfig('ai-insights');
    expect(tab).toBeDefined();
    expect(tab?.id).toBe('analytics-center');
    expect(getModuleOfTab('ai-insights')).toBe('reports');
  });

  it('correctly resolves nested #timesheets under attendance module', () => {
    const tab = getTabConfig('timesheets');
    expect(tab).toBeDefined();
    expect(tab?.id).toBe('timesheets');
    expect(getModuleOfTab('timesheets')).toBe('attendance');
  });

  it('correctly resolves #recruitment section ID to recruitment module and first sub-tab', () => {
    const module = getModuleOfTab('recruitment');
    expect(module).toBe('recruitment');
    const subTabs = getModuleTabs(module as SidebarSection);
    expect(subTabs[0].id).toBe('recruitment-dashboard');
  });

  it('correctly resolves #candidates to recruitment module', () => {
    const tab = getTabConfig('candidates');
    expect(tab).toBeDefined();
    expect(tab?.id).toBe('candidates');
    expect(getModuleOfTab('candidates')).toBe('recruitment');
  });

  it('correctly resolves attendance child tabs (attendance-shifts, attendance-rosters, attendance-holidays)', () => {
    expect(getTabConfig('attendance-shifts')?.id).toBe('attendance-shifts');
    expect(getTabConfig('attendance-rosters')?.id).toBe('attendance-rosters');
    expect(getTabConfig('attendance-holidays')?.id).toBe('attendance-holidays');
    expect(getModuleOfTab('attendance-shifts')).toBe('attendance');
  });
});
