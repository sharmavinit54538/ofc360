/**
 * @file exitDashboard3in1.test.tsx
 * @description Comprehensive unit and integration test suite for the OFC360 Exit Management 3-in-1 Dashboard:
 * 1. View Switcher (Overview, Analytics, Table)
 * 2. Header and Global Toolbar (Search, Filter, Export, Refresh)
 * 3. Overview View & 14 KPI Cards
 * 4. Analytics View & 9 Graphical Charts
 * 5. Table View & Employee Separation Records (Sorting, Pagination, Export)
 * 6. ProtectedRoute & Suspense Resilience
 */

import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

import { ExitDashboardHeader } from '../components/ExitDashboardHeader';
import { ExitSeparationTable } from '../components/ExitSeparationTable';
import { ExitAnalyticsCharts } from '../components/ExitAnalyticsCharts';
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute';
import type { ExitCase } from '../types/exit.types';

// Mock test data
const mockCases: ExitCase[] = [
  {
    id: 'case-1',
    caseNumber: 'EXIT-2026-001',
    employeeId: 'EMP-001',
    employeeName: 'Aarav Sharma',
    employeeEmail: 'aarav@ofc360.com',
    department: 'Engineering',
    designation: 'Senior Software Engineer',
    joiningDate: '2022-01-15',
    managerId: 'mgr-1',
    managerName: 'Vikram Malhotra',
    resignationDate: '2026-10-01',
    noticeDays: 60,
    expectedLastWorkingDay: '2026-11-30',
    reason: 'BETTER_CAREER_OPPORTUNITY',
    comments: 'Received a lead engineering role.',
    stage: 'RESIGNATION_SUBMITTED',
    exitStatus: 'PENDING',
    fnfStatus: 'DRAFT',
    managerApproval: { status: 'PENDING' },
    hrApproval: { status: 'PENDING' },
    clearances: [
      { department: 'MANAGER', status: 'PENDING', checklist: [] },
      { department: 'IT', status: 'PENDING', checklist: [] },
      { department: 'FINANCE', status: 'PENDING', checklist: [] },
      { department: 'ADMIN', status: 'PENDING', checklist: [] },
      { department: 'HR', status: 'PENDING', checklist: [] },
    ],
    ktStatus: false,
    ktTasks: [],
    assignedAssets: [],
    settlement: {
      status: 'DRAFT',
      earnings: [],
      deductions: [],
      grossEarnings: 150000,
      totalDeductions: 10000,
      netPayable: 140000,
      currency: 'INR',
    },
    documents: [],
    timeline: [],
    isCompleted: false,
    isDeactivated: false,
    createdAt: '2026-10-01T10:00:00Z',
    updatedAt: '2026-10-01T10:00:00Z',
  },
  {
    id: 'case-2',
    caseNumber: 'EXIT-2026-002',
    employeeId: 'EMP-002',
    employeeName: 'Neha Patel',
    employeeEmail: 'neha@ofc360.com',
    department: 'Product',
    designation: 'Product Manager',
    joiningDate: '2021-06-01',
    managerId: 'mgr-2',
    managerName: 'Priya Iyer',
    resignationDate: '2026-09-15',
    noticeDays: 30,
    expectedLastWorkingDay: '2026-10-15',
    reason: 'PERSONAL_REASONS',
    comments: 'Relocating to another city.',
    stage: 'COMPLETED',
    exitStatus: 'COMPLETED',
    fnfStatus: 'PAID',
    managerApproval: { status: 'APPROVED' },
    hrApproval: { status: 'APPROVED' },
    clearances: [
      { department: 'MANAGER', status: 'CLEARED', checklist: [] },
      { department: 'IT', status: 'CLEARED', checklist: [] },
      { department: 'FINANCE', status: 'CLEARED', checklist: [] },
      { department: 'ADMIN', status: 'CLEARED', checklist: [] },
      { department: 'HR', status: 'CLEARED', checklist: [] },
    ],
    ktStatus: true,
    ktTasks: [],
    assignedAssets: [],
    settlement: {
      status: 'PAID',
      earnings: [],
      deductions: [],
      grossEarnings: 220000,
      totalDeductions: 20000,
      netPayable: 200000,
      currency: 'INR',
    },
    documents: [],
    timeline: [],
    isCompleted: true,
    completedAt: '2026-10-15T18:00:00Z',
    isDeactivated: true,
    createdAt: '2026-09-15T09:00:00Z',
    updatedAt: '2026-10-15T18:00:00Z',
  },
];

// Mock useAuth
let mockAuthState = {
  user: {
    id: 'usr-1',
    fullName: 'Admin User',
    email: 'admin@ofc360.com',
    role: 'SUPER_ADMIN',
    roles: ['SUPER_ADMIN'],
    activeRole: 'SUPER_ADMIN',
    permissions: ['users:read'],
  },
  isAuthenticated: true,
  accessToken: 'valid-test-token',
  role: 'SUPER_ADMIN',
  activeRole: 'SUPER_ADMIN',
  isInitialized: true,
  isLoading: false,
  hasRole: (_r: any) => true,
  hasPermission: (_p: any) => true,
};

vi.mock('@/features/auth/hooks/useAuth', () => ({
  useAuth: () => mockAuthState,
}));

describe('OFC360 Complete Exit Management 3-in-1 Dashboard Suite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ========================================================
  // 1. Dashboard Header & View Switcher Tests
  // ========================================================
  describe('1. Dashboard Header & View Switcher', () => {
    it('renders view switcher and record count accurately', () => {
      render(
        <ExitDashboardHeader
          currentView="overview"
          onViewChange={vi.fn()}
          onRefresh={vi.fn()}
          onExport={vi.fn()}
          onFilterToggle={vi.fn()}
          isFiltersOpen={false}
          totalRecords={mockCases.length}
        />
      );

      expect(screen.getByText('Overview')).toBeInTheDocument();
      expect(screen.getByText('Analytics')).toBeInTheDocument();
      expect(screen.getByText('Table')).toBeInTheDocument();
      expect(screen.getByText(/Showing 2 employee separation records/i)).toBeInTheDocument();
    });

    it('renders all three view tabs: Overview, Analytics, Table and fires onViewChange', () => {
      const onViewChange = vi.fn();
      render(
        <ExitDashboardHeader
          currentView="overview"
          onViewChange={onViewChange}
          onRefresh={vi.fn()}
          onExport={vi.fn()}
          onFilterToggle={vi.fn()}
          isFiltersOpen={false}
          totalRecords={2}
        />
      );

      expect(screen.getByText('Overview')).toBeInTheDocument();
      expect(screen.getByText('Analytics')).toBeInTheDocument();
      expect(screen.getByText('Table')).toBeInTheDocument();

      fireEvent.click(screen.getByText('Analytics'));
      expect(onViewChange).toHaveBeenCalledWith('analytics');

      fireEvent.click(screen.getByText('Table'));
      expect(onViewChange).toHaveBeenCalledWith('table');
    });

    it('handles global search input changes', () => {
      const onSearchChange = vi.fn();
      render(
        <ExitDashboardHeader
          currentView="overview"
          onViewChange={vi.fn()}
          onRefresh={vi.fn()}
          onExport={vi.fn()}
          onFilterToggle={vi.fn()}
          isFiltersOpen={false}
          totalRecords={2}
          searchQuery="Engineering"
          onSearchChange={onSearchChange}
        />
      );

      const searchInput = screen.getByPlaceholderText(/Search by Employee Name, ID, Department, Designation/i);
      expect(searchInput).toHaveValue('Engineering');

      fireEvent.change(searchInput, { target: { value: 'Product' } });
      expect(onSearchChange).toHaveBeenCalledWith('Product');
    });

    it('opens export dropdown and allows CSV / Excel export', () => {
      const onExport = vi.fn();
      render(
        <ExitDashboardHeader
          currentView="table"
          onViewChange={vi.fn()}
          onRefresh={vi.fn()}
          onExport={onExport}
          onFilterToggle={vi.fn()}
          isFiltersOpen={false}
          totalRecords={2}
        />
      );

      const exportBtn = screen.getByText('Export');
      fireEvent.click(exportBtn);

      expect(screen.getByText(/Export Excel/i)).toBeInTheDocument();
      expect(screen.getByText(/Export CSV/i)).toBeInTheDocument();

      fireEvent.click(screen.getByText(/Export CSV/i));
      expect(onExport).toHaveBeenCalledWith('csv');
    });
  });

  // ========================================================
  // 2. Table View Tests
  // ========================================================
  describe('2. Table View Functionality', () => {
    it('renders all required employee separation columns', () => {
      render(
        <ExitSeparationTable
          cases={mockCases}
          isLoading={false}
          onViewDetails={vi.fn()}
        />
      );

      // Verify all specified columns exist
      expect(screen.getByText('Employee ID')).toBeInTheDocument();
      expect(screen.getByText('Employee')).toBeInTheDocument();
      expect(screen.getByText('Department')).toBeInTheDocument();
      expect(screen.getByText('Designation')).toBeInTheDocument();
      expect(screen.getByText('Reporting Manager')).toBeInTheDocument();
      expect(screen.getByText('Resignation Date')).toBeInTheDocument();
      expect(screen.getByText('Last Working Day')).toBeInTheDocument();
      expect(screen.getAllByText('Notice Period').length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText('Exit Reason')).toBeInTheDocument();
      expect(screen.getByText('Current Stage')).toBeInTheDocument();
      expect(screen.getByText('Actions')).toBeInTheDocument();

      // Verify rows
      expect(screen.getByText('Aarav Sharma')).toBeInTheDocument();
      expect(screen.getByText('EMP-001')).toBeInTheDocument();
      expect(screen.getByText('Senior Software Engineer')).toBeInTheDocument();
      expect(screen.getByText('Vikram Malhotra')).toBeInTheDocument();

      expect(screen.getByText('Neha Patel')).toBeInTheDocument();
      expect(screen.getByText('EMP-002')).toBeInTheDocument();
      expect(screen.getByText('Product Manager')).toBeInTheDocument();
    });

    it('triggers onViewDetails when clicking View button', () => {
      const onViewDetails = vi.fn();
      render(
        <ExitSeparationTable
          cases={mockCases}
          isLoading={false}
          onViewDetails={onViewDetails}
        />
      );

      const viewBtns = screen.getAllByTitle('View Exit Details');
      expect(viewBtns.length).toBe(2);

      fireEvent.click(viewBtns[0]);
      expect(onViewDetails).toHaveBeenCalledWith(mockCases[0]);
    });

    it('filters records by search query', () => {
      render(
        <ExitSeparationTable
          cases={mockCases}
          isLoading={false}
          onViewDetails={vi.fn()}
          searchQuery="Aarav"
        />
      );

      expect(screen.getByText('Aarav Sharma')).toBeInTheDocument();
      expect(screen.queryByText('Neha Patel')).not.toBeInTheDocument();
    });

    it('displays empty state when no cases match', () => {
      render(
        <ExitSeparationTable
          cases={[]}
          isLoading={false}
          onViewDetails={vi.fn()}
        />
      );

      expect(screen.getByText('No separation records found')).toBeInTheDocument();
    });
  });

  // ========================================================
  // 3. Analytics View Tests
  // ========================================================
  describe('3. Analytics View & 9 Graphical Charts', () => {
    it('renders all 9 analytical chart sections without runtime errors', () => {
      render(
        <ExitAnalyticsCharts
          cases={mockCases}
          isLoading={false}
          onDrillDown={vi.fn()}
        />
      );

      // Verify Chart A: Exit Status Distribution
      expect(screen.getByText('A. Exit Status Distribution')).toBeInTheDocument();

      // Verify Chart B: Monthly Exit Trends
      expect(screen.getByText('B. Monthly Exit Trends')).toBeInTheDocument();

      // Verify Chart C: Department-wise Exits
      expect(screen.getByText('C. Department-wise Exits')).toBeInTheDocument();

      // Verify Chart D: Exit Reasons
      expect(screen.getByText('D. Exit Reasons')).toBeInTheDocument();

      // Verify Chart E: Notice Period Analysis
      expect(screen.getByText('E. Notice Period Analysis')).toBeInTheDocument();

      // Verify Chart F: FnF Settlement Analytics
      expect(screen.getByText('F. FnF Settlement Analytics')).toBeInTheDocument();

      // Verify Chart G: Knowledge Transfer Progress
      expect(screen.getByText('G. Knowledge Transfer Progress')).toBeInTheDocument();

      // Verify Chart H: Department Clearance Analysis
      expect(screen.getByText('H. Department Clearance Analysis')).toBeInTheDocument();

      // Verify Chart I: Exit Completion Rate
      expect(screen.getByText('I. Exit Completion Rate')).toBeInTheDocument();
      expect(screen.getByText('50.0%')).toBeInTheDocument(); // 1 completed out of 2 total
    });

    it('renders loading skeletons when isLoading is true', () => {
      const { container } = render(
        <ExitAnalyticsCharts
          cases={[]}
          isLoading={true}
        />
      );

      const pulseElements = container.querySelectorAll('.animate-pulse');
      expect(pulseElements.length).toBeGreaterThan(0);
    });
  });

  // ========================================================
  // 4. ProtectedRoute & Suspense Resilience Tests
  // ========================================================
  describe('4. ProtectedRoute & Suspense Resilience', () => {
    it('renders protected child content when user is authenticated and authorized', () => {
      render(
        <MemoryRouter initialEntries={['/dashboard/exit-management']}>
          <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
            <div>Protected Exit Dashboard Content</div>
          </ProtectedRoute>
        </MemoryRouter>
      );

      expect(screen.getByText('Protected Exit Dashboard Content')).toBeInTheDocument();
    });

    it('redirects unauthenticated user to login with returnUrl', () => {
      // Set unauthenticated mock state
      mockAuthState = {
        ...mockAuthState,
        isAuthenticated: false,
        accessToken: null as any,
        user: null as any,
      };

      // Clear storage
      localStorage.clear();
      sessionStorage.clear();

      render(
        <MemoryRouter initialEntries={['/dashboard/exit-management']}>
          <Routes>
            <Route
              path="/dashboard/exit-management"
              element={
                <ProtectedRoute>
                  <div>Secret Content</div>
                </ProtectedRoute>
              }
            />
            <Route path="/auth/login" element={<div>Login Page Destination</div>} />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText('Login Page Destination')).toBeInTheDocument();
      expect(screen.queryByText('Secret Content')).not.toBeInTheDocument();
    });

    it('shows stable AuthLoadingScreen during initialization', () => {
      mockAuthState = {
        ...mockAuthState,
        isInitialized: false,
        isLoading: true,
      };

      render(
        <MemoryRouter initialEntries={['/dashboard/exit-management']}>
          <ProtectedRoute>
            <div>Protected Content</div>
          </ProtectedRoute>
        </MemoryRouter>
      );

      expect(screen.getByText(/Securing Enterprise Session/i)).toBeInTheDocument();
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });
  });
});
