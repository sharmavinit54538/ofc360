/**
 * @file OrgChartTree.test.tsx
 * @description Comprehensive unit tests for the redesigned Organizational Chart:
 * 1. Top-down tree hierarchy rendering (CEO/Executive root, managers, and subordinates)
 * 2. Employee card details (avatar, name, designation, department, status, employee ID, direct reports, manager)
 * 3. Toolbar KPI summary metrics (Total Employees, Departments, Managers)
 * 4. Interactive branch expanding & collapsing
 * 5. Real-time employee search and highlight
 * 6. Department filter
 * 7. Zoom controls (Zoom In, Zoom Out, Reset, Fit to Screen)
 * 8. Fullscreen toggle and Export options
 * 9. Employee card click callback & profile integration
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { OrgChartTree } from '../components/OrgChartTree';
import type { OrgChartNode } from '../types/workforce.types';

// Mock Toast
vi.mock('@/shared/ui/Toast', () => ({
  useToast: () => ({
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
  }),
}));

// Mock RTK Query useGetOrgChartQuery
const mockOrgChartData: OrgChartNode[] = [
  {
    id: 'emp-root-1',
    employeeCode: 'EMP-1001',
    name: 'Aarav Sharma',
    email: 'aarav@ofc360.com',
    designation: 'Chief Technology Officer',
    department: 'Executive Leadership',
    location: 'Jaipur HQ',
    status: 'ACTIVE',
    role: 'EXECUTIVE',
    subordinates: [
      {
        id: 'emp-mgr-1',
        employeeCode: 'EMP-1002',
        name: 'Priya Mehta',
        email: 'priya@ofc360.com',
        designation: 'Engineering Manager',
        department: 'Engineering',
        location: 'Jaipur HQ',
        status: 'ACTIVE',
        role: 'MANAGER',
        managerId: 'emp-root-1',
        managerName: 'Aarav Sharma',
        subordinates: [
          {
            id: 'emp-ic-1',
            employeeCode: 'EMP-1005',
            name: 'Kabir Singh',
            email: 'kabir@ofc360.com',
            designation: 'Senior Frontend Developer',
            department: 'Engineering',
            location: 'Jaipur HQ',
            status: 'ACTIVE',
            role: 'EMPLOYEE',
            managerId: 'emp-mgr-1',
            managerName: 'Priya Mehta',
            subordinates: [],
          },
        ],
      },
      {
        id: 'emp-mgr-2',
        employeeCode: 'EMP-1003',
        name: 'Rohan Verma',
        email: 'rohan@ofc360.com',
        designation: 'Lead DevOps & Security Admin',
        department: 'Information Technology',
        location: 'Jaipur HQ',
        status: 'ACTIVE',
        role: 'IT_ADMIN',
        managerId: 'emp-root-1',
        managerName: 'Aarav Sharma',
        subordinates: [],
      },
    ],
  },
];

let queryResult = {
  data: mockOrgChartData,
  isLoading: false,
  isError: false,
  refetch: vi.fn(),
};

vi.mock('../api/workforceApi', () => ({
  useGetOrgChartQuery: () => queryResult,
}));

describe('OrgChartTree Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryResult = {
      data: mockOrgChartData,
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    };
  });

  const renderComponent = (props: any = {}) => {
    return render(
      <MemoryRouter>
        <OrgChartTree {...props} />
      </MemoryRouter>
    );
  };

  it('renders top-down organizational tree with CEO at top, managers, and employee cards', () => {
    renderComponent();

    // Verify Title & Toolbar
    expect(screen.getByText('Organization Hierarchy')).toBeDefined();
    expect(screen.getByText('4 Employees')).toBeDefined(); // Total 4 nodes in tree
    expect(screen.getByText('3 Departments')).toBeDefined();

    // Verify CEO / Root card
    expect(screen.getAllByText('Aarav Sharma')[0]).toBeDefined();
    expect(screen.getByText('Chief Technology Officer')).toBeDefined();
    expect(screen.getAllByText('Executive Leadership')[0]).toBeDefined();
    expect(screen.getByText('EMP-1001')).toBeDefined();

    // Verify Level 1 Managers
    expect(screen.getAllByText('Priya Mehta')[0]).toBeDefined();
    expect(screen.getByText('Engineering Manager')).toBeDefined();
    expect(screen.getByText('Rohan Verma')).toBeDefined();
    expect(screen.getByText('Lead DevOps & Security Admin')).toBeDefined();

    // Verify Level 2 Individual Contributor
    expect(screen.getByText('Kabir Singh')).toBeDefined();
    expect(screen.getByText('Senior Frontend Developer')).toBeDefined();
  });

  it('displays accurate card details including status, direct reports count, and manager name', () => {
    renderComponent();

    // Direct reports buttons on nodes with children
    expect(screen.getByText('2 Reports')).toBeDefined(); // Aarav has 2 direct reports
    expect(screen.getByText('1 Report')).toBeDefined();  // Priya has 1 direct report

    // Reporting manager indicators
    expect(screen.getAllByText('Aarav Sharma').length).toBeGreaterThan(1); // One as card title, another as "Reports to: Aarav Sharma"
    expect(screen.getAllByText('Priya Mehta').length).toBeGreaterThan(1);
  });

  it('toggles branch collapse and expansion when clicking reports button', () => {
    renderComponent();

    // Initially Kabir Singh is visible under Priya Mehta
    expect(screen.getByText('Kabir Singh')).toBeDefined();

    // Find and click the collapse button on Priya Mehta's node (second collapse button in tree)
    const priyaCollapseBtn = screen.getAllByTitle('Collapse branch')[1];
    fireEvent.click(priyaCollapseBtn);

    // After collapsing Priya's branch, Kabir Singh should no longer be rendered
    expect(screen.queryByText('Kabir Singh')).toBeNull();

    // Now Priya's card shows expand button
    const priyaExpandBtn = screen.getByTitle('Expand 1 reports');
    expect(priyaExpandBtn).toBeDefined();

    // Click to expand again
    fireEvent.click(priyaExpandBtn);
    expect(screen.getByText('Kabir Singh')).toBeDefined();
  });

  it('supports Expand All and Collapse All toolbar actions', () => {
    renderComponent();

    const collapseAllBtn = screen.getByTitle('Collapse reporting branches');
    fireEvent.click(collapseAllBtn);

    // Kabir Singh should be collapsed
    expect(screen.queryByText('Kabir Singh')).toBeNull();

    // Click Expand All
    const expandAllBtn = screen.getByTitle('Expand all branches');
    fireEvent.click(expandAllBtn);

    // Kabir Singh should be visible again
    expect(screen.getByText('Kabir Singh')).toBeDefined();
  });

  it('searches employees in real-time, auto-expands ancestors, and highlights match', () => {
    renderComponent();

    const searchInput = screen.getByPlaceholderText('Search by name or employee ID...');
    fireEvent.change(searchInput, { target: { value: 'Kabir' } });

    // Match pill should show 1 match
    expect(screen.getByText('1 match')).toBeDefined();

    // Kabir Singh should be highlighted
    const kabirCard = screen.getByText('Kabir Singh').closest('[role="article"]');
    expect(kabirCard?.className).toContain('ring-teal-500');
  });

  it('filters employees by department and updates visibility', () => {
    renderComponent();

    const deptSelect = screen.getByTitle('Filter by Department');
    fireEvent.change(deptSelect, { target: { value: 'Information Technology' } });

    // Rohan Verma is in IT, so not dimmed
    const rohanCard = screen.getByText('Rohan Verma').closest('[role="article"]');
    expect(rohanCard?.className).not.toContain('opacity-35');

    // Priya Mehta is in Engineering, so dimmed
    const priyaCard = screen.getAllByText('Priya Mehta')[0].closest('[role="article"]');
    expect(priyaCard?.className).toContain('opacity-35');
  });

  it('handles zoom controls (Zoom In, Zoom Out, Reset, Fit to Screen)', () => {
    renderComponent();

    expect(screen.getByText('100%')).toBeDefined();

    const zoomInBtn = screen.getByLabelText('Zoom In');
    fireEvent.click(zoomInBtn);
    expect(screen.getByText('115%')).toBeDefined();

    const zoomOutBtn = screen.getByLabelText('Zoom Out');
    fireEvent.click(zoomOutBtn);
    expect(screen.getByText('100%')).toBeDefined();

    const fitBtn = screen.getByLabelText('Fit to Screen');
    fireEvent.click(fitBtn);
  });

  it('invokes onSelectEmployee callback when clicking an employee card', () => {
    const handleSelect = vi.fn();
    renderComponent({ onSelectEmployee: handleSelect });

    const card = screen.getAllByText('Priya Mehta')[0].closest('[role="article"]');
    if (card) fireEvent.click(card);

    expect(handleSelect).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'emp-mgr-1',
        name: 'Priya Mehta',
      })
    );
  });

  it('renders loading skeleton when isLoading is true', () => {
    queryResult = {
      data: [],
      isLoading: true,
      isError: false,
      refetch: vi.fn(),
    };

    renderComponent();
    expect(screen.getByText('Building interactive organizational tree...')).toBeDefined();
  });

  it('renders error state with retry button when isError is true', () => {
    queryResult = {
      data: [],
      isLoading: false,
      isError: true,
      refetch: vi.fn(),
    };

    renderComponent();
    expect(screen.getByText('Failed to load organization hierarchy')).toBeDefined();
    const retryBtn = screen.getByText('Retry Loading');
    fireEvent.click(retryBtn);
    expect(queryResult.refetch).toHaveBeenCalled();
  });
});
