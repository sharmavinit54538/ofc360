import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { DepartmentBreakdownCard } from '../components/DepartmentBreakdownCard';
import type { DepartmentItem, EmployeeItem } from '../types/workforce.types';

// Mock useGetEmployeesQuery and isUuid from workforceApi
const mockEmployeesList: EmployeeItem[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    employeeCode: 'EMP-001',
    firstName: 'Sarah',
    lastName: 'Connor',
    fullName: 'Sarah Connor',
    email: 'sarah@example.com',
    phone: '+919876543210',
    gender: 'FEMALE',
    workLocation: 'Jaipur HQ',
    role: 'MANAGER',
    employmentType: 'FULL_TIME',
    status: 'ACTIVE',
    department: { id: 'dept-1', name: 'Engineering' },
    designation: { id: 'desg-1', title: 'Engineering Director' },
    joiningDate: '2023-01-01',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    employeeCode: 'EMP-002',
    firstName: 'John',
    lastName: 'Doe',
    fullName: 'John Doe',
    email: 'john@example.com',
    phone: '+919876543211',
    gender: 'MALE',
    workLocation: 'Jaipur HQ',
    role: 'MANAGER',
    employmentType: 'FULL_TIME',
    status: 'ACTIVE',
    department: { id: 'dept-2', name: 'Human Resources' },
    designation: { id: 'desg-2', title: 'HR Manager' },
    joiningDate: '2023-03-01',
  },
];

vi.mock('../api/workforceApi', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../api/workforceApi')>();
  return {
    ...actual,
    useGetEmployeesQuery: vi.fn(() => ({
      data: { items: mockEmployeesList, total: 2 },
      isLoading: false,
    })),
  };
});

// Mock RBAC
let mockHasAnyRole = vi.fn().mockReturnValue(true);
vi.mock('@/features/auth/hooks/useRBAC', () => ({
  useRBAC: () => ({
    hasAnyRole: mockHasAnyRole,
    activeRole: 'SUPER_ADMIN',
    roles: ['SUPER_ADMIN'],
    permissions: [],
    isSuperAdmin: true,
    isHRAdmin: false,
    isManager: false,
    isEmployee: false,
  }),
}));

const mockDepartments: DepartmentItem[] = [
  {
    id: 'dept-1',
    name: 'Engineering',
    department_name: 'Engineering',
    departmentName: 'Engineering',
    code: 'ENG01',
    department_code: 'ENG01',
    departmentCode: 'ENG01',
    description: 'Core product engineering and architecture',
    location: 'Building A, Floor 3',
    manager_id: '550e8400-e29b-41d4-a716-446655440001',
    managerId: '550e8400-e29b-41d4-a716-446655440001',
    budget: 5000000,
    cost_center: 'CC-ENG-101',
    employee_capacity: 50,
    employeeCapacity: 50,
    headcount: 25,
    totalEmployees: 25,
    status: 'ACTIVE',
    isActive: true,
  },
  {
    id: 'dept-2',
    name: 'Human Resources',
    department_name: 'Human Resources',
    departmentName: 'Human Resources',
    code: 'HR01',
    department_code: 'HR01',
    departmentCode: 'HR01',
    description: 'People operations and talent acquisition',
    location: 'Building B, Floor 1',
    manager_id: 'non-existent-manager-uuid',
    budget: 1200000,
    cost_center: 'CC-HR-201',
    employee_capacity: 20,
    employeeCapacity: 20,
    headcount: 8,
    totalEmployees: 8,
    status: 'HIRING',
    isActive: true,
  },
  {
    id: 'dept-3',
    name: 'Operations',
    department_name: 'Operations',
    departmentName: 'Operations',
    code: 'OPS01',
    department_code: 'OPS01',
    departmentCode: 'OPS01',
    description: 'Facilities and company logistics',
    location: '',
    manager_id: null,
    budget: 0,
    employee_capacity: 15,
    headcount: 0,
    status: 'INACTIVE',
    isActive: false,
  },
];

describe('Department Table UI & Three-Dot Actions Menu', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockHasAnyRole = vi.fn().mockReturnValue(true);
  });

  it('renders the Department table layout with all columns matching Employee table structure', () => {
    render(<DepartmentBreakdownCard departments={mockDepartments} isLoading={false} />);

    // Table header columns
    expect(screen.getByText('Code')).toBeDefined();
    expect(screen.getByText('Department')).toBeDefined();
    expect(screen.getByText('Manager')).toBeDefined();
    expect(screen.getByText('Location')).toBeDefined();
    expect(screen.getByText('Staff / Capacity')).toBeDefined();
    expect(screen.getByText('Budget')).toBeDefined();
    expect(screen.getByText('Status')).toBeDefined();
    expect(screen.getByText('Actions')).toBeDefined();

    // Data rows
    expect(screen.getByText('ENG01')).toBeDefined();
    expect(screen.getByText('Engineering')).toBeDefined();
    expect(screen.getByText('HR01')).toBeDefined();
    expect(screen.getByText('Human Resources')).toBeDefined();
  });

  it('resolves assigned manager name from employee list and avoids displaying raw UUID', () => {
    render(<DepartmentBreakdownCard departments={mockDepartments} isLoading={false} />);

    // Dept 1 has manager_id '550e8400-e29b-41d4-a716-446655440001' which maps to 'Sarah Connor'
    expect(screen.getByText('Sarah Connor')).toBeDefined();

    // Raw UUID must NEVER be visible
    expect(screen.queryByText('550e8400-e29b-41d4-a716-446655440001')).toBeNull();
    expect(screen.queryByText('non-existent-manager-uuid')).toBeNull();
  });

  it('falls back to "Not assigned" when manager is unassigned or ID is not matched', () => {
    render(<DepartmentBreakdownCard departments={mockDepartments} isLoading={false} />);

    // Dept 2 (unmatched ID) and Dept 3 (null manager) should both display 'Not assigned'
    const notAssignedCells = screen.getAllByText('Not assigned');
    expect(notAssignedCells.length).toBe(2);
  });

  it('formats staff count, capacity, organization percentage and budget properly', () => {
    render(<DepartmentBreakdownCard departments={mockDepartments} isLoading={false} />);

    // Staff / Capacity for Dept 1: 25 / 50
    expect(screen.getByText('25')).toBeDefined();

    // Budget formatted in INR
    expect(screen.getByText('₹50,00,000')).toBeDefined();
    expect(screen.getByText('₹12,00,000')).toBeDefined();

    // Status badges
    expect(screen.getByText('ACTIVE')).toBeDefined();
    expect(screen.getByText('HIRING')).toBeDefined();
    expect(screen.getByText('INACTIVE')).toBeDefined();
  });

  it('renders a vertical three-dot menu trigger button on each row', () => {
    render(<DepartmentBreakdownCard departments={mockDepartments} isLoading={false} />);

    const actionButtons = screen.getAllByTitle('More actions');
    expect(actionButtons.length).toBe(mockDepartments.length);
  });

  it('opens dropdown menu on click with "View Details" and "Edit Department"', () => {
    render(<DepartmentBreakdownCard departments={mockDepartments} isLoading={false} />);

    const actionButtons = screen.getAllByTitle('More actions');
    fireEvent.click(actionButtons[0]);

    expect(screen.getByText('View Details')).toBeDefined();
    expect(screen.getByText('Edit Department')).toBeDefined();
  });

  it('clicking "View Details" opens the Department Details modal with accurate info', () => {
    render(<DepartmentBreakdownCard departments={mockDepartments} isLoading={false} />);

    // Open menu on first department
    const actionButtons = screen.getAllByTitle('More actions');
    fireEvent.click(actionButtons[0]);

    // Click View Details
    const viewBtn = screen.getByText('View Details');
    fireEvent.click(viewBtn);

    // Modal opens
    expect(screen.getByText('Department Details')).toBeDefined();
    expect(screen.getByText('Core product engineering and architecture')).toBeDefined();
    expect(screen.getByText('Building A, Floor 3')).toBeDefined();
    expect(screen.getByText('CC-ENG-101')).toBeDefined();
  });

  it('closes the dropdown menu on Escape key press', () => {
    render(<DepartmentBreakdownCard departments={mockDepartments} isLoading={false} />);

    const actionButtons = screen.getAllByTitle('More actions');
    fireEvent.click(actionButtons[0]);

    expect(screen.getByText('View Details')).toBeDefined();

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(screen.queryByText('View Details')).toBeNull();
  });

  it('respects RBAC permissions: hides "Edit Department" when user cannot manage', () => {
    mockHasAnyRole.mockReturnValue(false);

    render(<DepartmentBreakdownCard departments={mockDepartments} isLoading={false} />);

    // Open menu
    const actionButtons = screen.getAllByTitle('More actions');
    fireEvent.click(actionButtons[0]);

    // View Details is visible, Edit Department is hidden
    expect(screen.getByText('View Details')).toBeDefined();
    expect(screen.queryByText('Edit Department')).toBeNull();
  });
});

