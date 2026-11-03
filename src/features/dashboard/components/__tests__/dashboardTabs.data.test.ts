import { describe, it, expect } from 'vitest';
import { DASHBOARD_TABS, SIDEBAR_SECTIONS, getTabsBySection, getModuleOfTab } from '@/features/dashboard/components/dashboardTabs.data';

describe('dashboardTabs.data - Recruitment Configuration', () => {
  describe('SIDEBAR_SECTIONS', () => {
    it('should include recruitment section with correct order', () => {
      const recruitmentSection = SIDEBAR_SECTIONS.find((s) => s.id === 'recruitment');
      expect(recruitmentSection).toBeDefined();
      expect(recruitmentSection?.label).toBe('TALENT & RECRUITMENT');
      expect(recruitmentSection?.order).toBe(3);
      expect(recruitmentSection?.collapsible).toBe(true);
      expect(recruitmentSection?.defaultExpanded).toBe(true);
    });
  });

  describe('DASHBOARD_TABS - Recruitment tabs', () => {
    const recruitmentTabs = DASHBOARD_TABS.filter((tab) => tab.section === 'recruitment');

    it('should have exactly 17 recruitment tabs', () => {
      expect(recruitmentTabs).toHaveLength(17);
    });

    describe('Group A: HR_ADMIN & HR_EXECUTIVE (8 tabs)', () => {
      const hrTabs = recruitmentTabs.filter((tab) =>
        tab.roles?.includes('HR_ADMIN') && tab.roles?.includes('HR_EXECUTIVE')
      );

      it('should have 8 tabs for HR_ADMIN & HR_EXECUTIVE', () => {
        expect(hrTabs).toHaveLength(8);
      });

      it('should have correct tab IDs for HR group', () => {
        const expectedIds = [
          'recruitment-dashboard',
          'recruitment-requisitions',
          'recruitment-jobs',
          'recruitment-candidates',
          'recruitment-interviews',
          'recruitment-offers',
          'recruitment-bgv',
          'recruitment-reports',
        ];
        expect(hrTabs.map((t) => t.id).sort()).toEqual(expectedIds.sort());
      });

      it('should have correct badge keys for HR tabs', () => {
        const badgeKeys = hrTabs
          .filter((t) => t.badgeKey)
          .map((t) => t.badgeKey);
        expect(badgeKeys).toContain('pending_req_approvals_count');
        expect(badgeKeys).toContain('active_openings_count');
        expect(badgeKeys).toContain('new_applications_count');
        expect(badgeKeys).toContain('today_interviews_count');
        expect(badgeKeys).toContain('pending_offer_approvals_count');
        expect(badgeKeys).toContain('bgv_discrepancy_alerts_count');
      });

      it('should have destructive variant for BGV tab', () => {
        const bgvTab = hrTabs.find((t) => t.id === 'recruitment-bgv');
        expect(bgvTab?.badgeVariant).toBe('destructive');
      });
    });

    describe('Group B: MANAGER (4 tabs)', () => {
      const managerTabs = recruitmentTabs.filter((tab) =>
        tab.roles?.includes('MANAGER') && !tab.roles?.includes('HR_ADMIN')
      );

      it('should have 4 tabs for MANAGER', () => {
        expect(managerTabs).toHaveLength(4);
      });

      it('should have correct tab IDs for MANAGER group', () => {
        const expectedIds = [
          'manager-requisitions',
          'manager-candidates',
          'manager-interviews',
          'manager-offers',
        ];
        expect(managerTabs.map((t) => t.id).sort()).toEqual(expectedIds.sort());
      });

      it('should have destructive variant for Panel Interviews tab', () => {
        const panelTab = managerTabs.find((t) => t.id === 'manager-interviews');
        expect(panelTab?.badgeVariant).toBe('destructive');
      });
    });

    describe('Group C: IT_ADMIN (2 tabs)', () => {
      const itTabs = recruitmentTabs.filter((tab) =>
        tab.roles?.includes('IT_ADMIN') && !tab.roles?.includes('HR_ADMIN') && !tab.roles?.includes('MANAGER')
      );

      it('should have 2 tabs for IT_ADMIN', () => {
        expect(itTabs).toHaveLength(2);
      });

      it('should have correct tab IDs for IT_ADMIN group', () => {
        const expectedIds = ['itadmin-onboarding', 'itadmin-assets'];
        expect(itTabs.map((t) => t.id).sort()).toEqual(expectedIds.sort());
      });
    });

    describe('Group D: EMPLOYEE (3 tabs)', () => {
      const employeeTabs = recruitmentTabs.filter((tab) =>
        tab.roles?.includes('EMPLOYEE') &&
        !tab.roles?.includes('HR_ADMIN') &&
        !tab.roles?.includes('MANAGER') &&
        !tab.roles?.includes('IT_ADMIN')
      );

      it('should have 3 tabs for EMPLOYEE', () => {
        expect(employeeTabs).toHaveLength(3);
      });

      it('should have correct tab IDs for EMPLOYEE group', () => {
        const expectedIds = ['employee-careers', 'employee-referrals', 'employee-interviews'];
        expect(employeeTabs.map((t) => t.id).sort()).toEqual(expectedIds.sort());
      });

      it('should have condition function for Assigned Interviews tab', () => {
        const interviewTab = employeeTabs.find((t) => t.id === 'employee-interviews');
        expect(interviewTab?.condition).toBeDefined();
        expect(typeof interviewTab?.condition).toBe('function');
      });

      it('condition should return true when user has assigned interviews', () => {
        const interviewTab = employeeTabs.find((t) => t.id === 'employee-interviews');
        expect(interviewTab?.condition?.({ has_assigned_interviews: true })).toBe(true);
      });

      it('condition should return false when user does not have assigned interviews', () => {
        const interviewTab = employeeTabs.find((t) => t.id === 'employee-interviews');
        expect(interviewTab?.condition?.({ has_assigned_interviews: false })).toBe(false);
        expect(interviewTab?.condition?.(null)).toBe(false);
      });
    });

    it('all tabs should have valid paths', () => {
      recruitmentTabs.forEach((tab) => {
        expect(tab.path).toBeDefined();
        expect(typeof tab.path).toBe('string');
        expect(tab.path!.length).toBeGreaterThan(0);
      });
    });

    it('all tabs should have roles array', () => {
      recruitmentTabs.forEach((tab) => {
        expect(tab.roles).toBeDefined();
        expect(Array.isArray(tab.roles)).toBe(true);
        expect(tab.roles!.length).toBeGreaterThan(0);
      });
    });
  });

  describe('getTabsBySection', () => {
    it('should return all 17 recruitment tabs', () => {
      const tabs = getTabsBySection('recruitment');
      expect(tabs).toHaveLength(17);
    });
  });

  describe('getModuleOfTab', () => {
    it('should return recruitment for recruitment tab IDs', () => {
      const recruitmentTabs = DASHBOARD_TABS.filter((tab) => tab.section === 'recruitment');
      recruitmentTabs.forEach((tab) => {
        expect(getModuleOfTab(tab.id)).toBe('recruitment');
      });
    });
  });
});