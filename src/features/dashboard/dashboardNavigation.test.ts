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
  it('has exactly 10 sidebar sections after combining Talent and merging Attendance/Leave', () => {
    expect(SIDEBAR_SECTIONS).toHaveLength(10);
    const sectionIds = SIDEBAR_SECTIONS.map((s) => s.id);
    expect(sectionIds).toEqual([
      'overview',
      'workforce',
      'talent',
      'attendance',
      'payroll',
      'reports',
      'aihub',
      'documents',
      'hrops',
      'settings',
    ]);
  });

  it('has unique tab IDs across all top-level tabs and nested children (no duplicates)', () => {
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

    // Including legacy alias (ai-insights, recruitment, performance, leave, etc.), reachable IDs resolve
    const allReachableIds = new Set([...allIds, ...Object.keys(LEGACY_ALIASES)]);
    for (const id of allReachableIds) {
      expect(getTabConfig(id)).toBeDefined();
    }
  });

  it('every tab belongs to exactly one valid section', () => {
    const validSections = new Set(SIDEBAR_SECTIONS.map((s) => s.id));

    for (const tab of DASHBOARD_TABS) {
      expect(validSections.has(tab.section as any)).toBe(true);
      expect(getModuleOfTab(tab.id)).toBe(tab.section);

      if (tab.children) {
        for (const child of tab.children) {
          expect(validSections.has(child.section as any)).toBe(true);
          expect(getModuleOfTab(child.id)).toBe(child.section);
        }
      }
    }
  });

  it('correctly resolves #talent module and tab', () => {
    const tab = getTabConfig('talent');
    expect(tab).toBeDefined();
    expect(tab?.id).toBe('talent');
    expect(tab?.path).toBe('/dashboard/talent');
    expect(getModuleOfTab('talent')).toBe('talent');
  });

  it('correctly resolves #recruitment and #performance aliases to talent', () => {
    expect(LEGACY_ALIASES['recruitment']).toBe('talent');
    expect(LEGACY_ALIASES['performance']).toBe('talent');
    expect(getTabConfig('recruitment')?.id).toBe('talent');
    expect(getTabConfig('performance')?.id).toBe('talent');
    expect(getModuleOfTab('recruitment')).toBe('talent');
    expect(getModuleOfTab('performance')).toBe('talent');
  });

  it('correctly resolves #leave and #leaves aliases to attendance', () => {
    expect(LEGACY_ALIASES['leave']).toBe('attendance');
    expect(LEGACY_ALIASES['leaves']).toBe('attendance');
    expect(getTabConfig('leave')?.id).toBe('attendance');
    expect(getTabConfig('leaves')?.id).toBe('attendance');
    expect(getModuleOfTab('leave')).toBe('attendance');
    expect(getModuleOfTab('leaves')).toBe('attendance');
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
    expect(tab?.id).toBe('reports');
    expect(getModuleOfTab('ai-insights')).toBe('reports');
  });

  it('correctly resolves nested #timesheets under attendance module', () => {
    const tab = getTabConfig('timesheets');
    expect(tab).toBeDefined();
    expect(tab?.id).toBe('attendance');
    expect(getModuleOfTab('timesheets')).toBe('attendance');
  });
});
