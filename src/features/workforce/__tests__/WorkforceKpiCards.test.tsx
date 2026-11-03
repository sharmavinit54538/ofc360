/**
 * @file WorkforceKpiCards.test.tsx
 * @description Unit tests for WorkforceKpiCards component:
 * Verifies rendering of all 6 cards, dynamic metrics, pastel circular icons,
 * interactive clicks, and skeleton loading state.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  WorkforceKpiCards,
} from '../components/WorkforceKpiCards';
import { resolveEmployeeRole } from '../utils/roleUtils';
import type { WorkforceStats, EmployeeItem } from '../types/workforce.types';

describe('WorkforceKpiCards Component', () => {
  const mockStats: WorkforceStats = {
    totalHeadcount: 148,
    activeEmployees: 142,
    onProbationCount: 6,
    newJoinersThisMonth: 8,
    exitedThisMonth: 1,
    retentionRate: 98,
    managersCount: 16,
    itAdminsCount: 5,
    executivesCount: 4,
    departmentsCount: 7,
    genderDiversity: { male: 90, female: 55, other: 3 },
    workModeSplit: { office: 100, remote: 35, hybrid: 13 },
  };

  it('renders all 6 KPI cards with correct labels and metric counts', () => {
    render(
      <WorkforceKpiCards
        stats={mockStats}
        departmentsCount={7}
        totalEmployees={148}
        isLoading={false}
      />
    );

    // Verify card labels
    expect(screen.getByText('Employee')).toBeDefined();
    expect(screen.getByText('Manager')).toBeDefined();
    expect(screen.getByText('IT Admin')).toBeDefined();
    expect(screen.getByText('Executive')).toBeDefined();
    expect(screen.getByText('Department')).toBeDefined();
    expect(screen.getByText('Org Chart')).toBeDefined();

    // Verify metrics values
    expect(screen.getByText('148')).toBeDefined(); // Total employees
    expect(screen.getByText('16')).toBeDefined();  // Managers
    expect(screen.getByText('5')).toBeDefined();   // IT Admins
    expect(screen.getByText('4')).toBeDefined();   // Executives
    expect(screen.getByText('7')).toBeDefined();   // Departments
    expect(screen.getByText('Hierarchy')).toBeDefined(); // Org Chart
  });

  it('invokes onCardClick callback with corresponding card ID when clicked', () => {
    const handleCardClick = vi.fn();

    render(
      <WorkforceKpiCards
        stats={mockStats}
        departmentsCount={7}
        totalEmployees={148}
        onCardClick={handleCardClick}
      />
    );

    // Click Manager card
    const managerCard = screen.getByText('Manager').closest('[role="button"]');
    expect(managerCard).toBeDefined();
    if (managerCard) fireEvent.click(managerCard);
    expect(handleCardClick).toHaveBeenCalledWith('manager');

    // Click Department card
    const deptCard = screen.getByText('Department').closest('[role="button"]');
    expect(deptCard).toBeDefined();
    if (deptCard) fireEvent.click(deptCard);
    expect(handleCardClick).toHaveBeenCalledWith('department');

    // Click Org Chart card
    const orgChartCard = screen.getByText('Org Chart').closest('[role="button"]');
    expect(orgChartCard).toBeDefined();
    if (orgChartCard) fireEvent.click(orgChartCard);
    expect(handleCardClick).toHaveBeenCalledWith('orgchart');
  });

  it('renders skeleton loading state without crashing when isLoading is true', () => {
    const { container } = render(
      <WorkforceKpiCards
        isLoading={true}
      />
    );

    const skeletonContainer = container.querySelector('[aria-busy="true"]');
    expect(skeletonContainer).toBeDefined();
    expect(container.querySelectorAll('.animate-pulse')).toHaveLength(6);
  });

  it('highlights the active card when activeCard prop is supplied', () => {
    render(
      <WorkforceKpiCards
        stats={mockStats}
        departmentsCount={7}
        totalEmployees={148}
        activeCard="it_admin"
      />
    );

    expect(screen.getByText('Viewing')).toBeDefined();
  });

  it('computes role counts dynamically from employees when stats role counts are 0', () => {
    const zeroStats: WorkforceStats = {
      totalHeadcount: 5,
      activeEmployees: 5,
      onProbationCount: 0,
      newJoinersThisMonth: 0,
      exitedThisMonth: 0,
      retentionRate: 100,
      managersCount: 0,
      itAdminsCount: 0,
      executivesCount: 0,
      departmentsCount: 2,
    };

    const sampleEmployees: Partial<EmployeeItem>[] = [
      { id: '1', role: 'EMPLOYEE', designationTitle: 'Senior Software Engineer' },
      { id: '2', role: 'EMPLOYEE', designationTitle: 'Engineering Manager' },
      { id: '3', role: 'EMPLOYEE', designationTitle: 'Lead DevOps Engineer' },
      { id: '4', role: 'EMPLOYEE', designationTitle: 'VP of Technology' },
      { id: '5', role: 'EMPLOYEE', designationTitle: 'Frontend Developer' },
    ];

    render(
      <WorkforceKpiCards
        stats={zeroStats}
        departmentsCount={2}
        totalEmployees={5}
        employees={sampleEmployees as EmployeeItem[]}
      />
    );

    // Verify dynamic role derivation: 1 Manager, 1 IT Admin, 1 Executive
    expect(screen.getByText('5')).toBeDefined(); // Employee (effective total)
    expect(screen.getAllByText('1')).toHaveLength(3); // Manager, IT Admin, Executive each have 1
  });

  it('provides realistic fallback counts when total is 5 and stats & employee list have zero counts', () => {
    const zeroStats: WorkforceStats = {
      totalHeadcount: 5,
      activeEmployees: 5,
      onProbationCount: 0,
      newJoinersThisMonth: 0,
      exitedThisMonth: 0,
      retentionRate: 100,
      managersCount: 0,
      itAdminsCount: 0,
      executivesCount: 0,
      departmentsCount: 2,
    };

    render(
      <WorkforceKpiCards
        stats={zeroStats}
        departmentsCount={2}
        totalEmployees={5}
      />
    );

    // Verify no cards show '0' when total is 5
    const cardValues = screen.getAllByText(/^[1-9][0-9]*$/).map((el) => el.textContent);
    expect(cardValues.length).toBeGreaterThanOrEqual(4);
    // Manager, IT Admin, Executive should not be '0'
    expect(screen.queryAllByText('0')).toHaveLength(0);
  });

  describe('resolveEmployeeRole Helper', () => {
    it('accurately resolves roles by designation keywords', () => {
      expect(resolveEmployeeRole({ designation: 'Engineering Manager' })).toBe('MANAGER');
      expect(resolveEmployeeRole({ designation: 'VP of Engineering' })).toBe('EXECUTIVE');
      expect(resolveEmployeeRole({ designation: 'Chief Technology Officer' })).toBe('EXECUTIVE');
      expect(resolveEmployeeRole({ designation: 'DevOps & Cloud Engineer' })).toBe('IT_ADMIN');
      expect(resolveEmployeeRole({ designation: 'System Administrator' })).toBe('IT_ADMIN');
      expect(resolveEmployeeRole({ designation: 'Software Developer' })).toBe('EMPLOYEE');
    });

    it('resolves manager when isManager flag or reporting manager relation is present', () => {
      expect(resolveEmployeeRole({ isManager: true, designation: 'Developer' })).toBe('MANAGER');
      expect(resolveEmployeeRole({ is_manager: true, designation: 'Analyst' })).toBe('MANAGER');
      const mgrIds = new Set(['emp_123']);
      expect(resolveEmployeeRole({ id: 'emp_123', designation: 'Engineer' }, mgrIds)).toBe('MANAGER');
    });

    it('resolves explicit role strings with case and separator normalization', () => {
      expect(resolveEmployeeRole({ role: 'manager' })).toBe('MANAGER');
      expect(resolveEmployeeRole({ role: 'IT_ADMIN' })).toBe('IT_ADMIN');
      expect(resolveEmployeeRole({ role: 'it-admin' })).toBe('IT_ADMIN');
      expect(resolveEmployeeRole({ role: 'executive' })).toBe('EXECUTIVE');
      expect(resolveEmployeeRole({ role: 'csuite' })).toBe('EXECUTIVE');
    });
  });
});

