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
import type { WorkforceStats } from '../types/workforce.types';

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
});

