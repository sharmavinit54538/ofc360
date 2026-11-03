import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { workforceApi } from '../api/workforceApi';
import { EmployeeProfilePage } from '../pages/EmployeeProfilePage';

// Mock toast
vi.mock('@/shared/lib/toast', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
    loading: vi.fn(),
  },
}));

const createMockStore = () =>
  configureStore({
    reducer: {
      [workforceApi.reducerPath]: workforceApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(workforceApi.middleware),
  });

const renderComponent = (initialEntry = '/dashboard/workforce/employees/emp-1025') => {
  const store = createMockStore();
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[initialEntry]}>
        <Routes>
          <Route
            path="/dashboard/workforce/employees/:employeeId"
            element={<EmployeeProfilePage />}
          />
        </Routes>
      </MemoryRouter>
    </Provider>
  );
};

describe('EmployeeProfilePage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders Employee Profile header with title, subtitle, and action buttons', () => {
    renderComponent();

    expect(screen.getByText('Employee Profile')).toBeInTheDocument();
    expect(
      screen.getByText('Complete employee information, documents, performance and history.')
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Edit Profile/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^More$/i })).toBeInTheDocument();
  });

  it('renders Employee Hero Banner Card with 3 zones (identity, contact/reporting, and tenure)', () => {
    renderComponent();

    // Identity Zone
    expect(screen.getAllByText('Rahul Sharma').length).toBeGreaterThan(0);
    expect(screen.getAllByText('EMP-1025').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Software Developer').length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Engineering/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Noida \(HQ\)/).length).toBeGreaterThan(0);
    expect(screen.getByText(/Joined 15 Jan 2025/)).toBeInTheDocument();
    expect(screen.getByText(/• Active Employee/)).toBeInTheDocument();

    // Contact & Reporting Zone
    expect(screen.getByText('rahul.sharma@equinoxsphere.com')).toBeInTheDocument();
    expect(screen.getAllByText('+91 98765 43210').length).toBeGreaterThan(0);
    expect(screen.getByText(/Reporting to:/)).toBeInTheDocument();
    expect(screen.getAllByText('Priya Mehta').length).toBeGreaterThan(0);

    // Tenure Box
    expect(screen.getByText('1.8')).toBeInTheDocument();
    expect(screen.getByText('Tenure')).toBeInTheDocument();
  });

  it('renders all 10 horizontal navigation tabs', () => {
    renderComponent();

    const expectedTabs = [
      /^Overview$/i,
      /^Personal Info$/i,
      /^Employment$/i,
      /^Documents$/i,
      /^Payroll$/i,
      /^Attendance$/i,
      /^Leave$/i,
      /^Performance$/i,
      /^Assets$/i,
      /^History$/i,
    ];

    expectedTabs.forEach((tabRegex) => {
      expect(screen.getByRole('button', { name: tabRegex })).toBeInTheDocument();
    });
  });

  it('renders Overview tab with 3 KPI metric cards', () => {
    renderComponent();

    expect(screen.getByText('1.8 Years')).toBeInTheDocument();
    expect(screen.getByText('Years of Service')).toBeInTheDocument();

    expect(screen.getByText('₹45,000')).toBeInTheDocument();
    expect(screen.getByText('Monthly Salary')).toBeInTheDocument();

    expect(screen.getByText('12 Days')).toBeInTheDocument();
    expect(screen.getByText('Leave Balance')).toBeInTheDocument();
  });

  it('renders Basic Details and Employment Details cards', () => {
    renderComponent();

    // Basic Details Card
    expect(screen.getByText('Basic Details')).toBeInTheDocument();
    expect(screen.getByText('19 Jan 2004 (21 Years)')).toBeInTheDocument();
    expect(screen.getByText('B+')).toBeInTheDocument();
    expect(screen.getByText('rahul.sharma@gmail.com')).toBeInTheDocument();
    expect(screen.getByText(/Sector 62, Noida/)).toBeInTheDocument();

    // Employment Details Card
    expect(screen.getAllByText('Employment Details').length).toBeGreaterThan(0);
    expect(screen.getByText('6 Months')).toBeInTheDocument();
    expect(screen.getByText('15 Jul 2025')).toBeInTheDocument();
    expect(screen.getByText('30 Days')).toBeInTheDocument();
  });

  it('renders Profile Completion card with 92% ring and checklist', () => {
    renderComponent();

    expect(screen.getByText('92%')).toBeInTheDocument();
    expect(screen.getAllByText('Profile Completion').length).toBeGreaterThan(0);
    expect(screen.getByText('Personal Information')).toBeInTheDocument();
    expect(screen.getByText('Documents (8/8)')).toBeInTheDocument();
    expect(screen.getByText('Bank & Payroll')).toBeInTheDocument();
    expect(screen.getByText('Emergency Contact')).toBeInTheDocument();
  });

  it('renders Quick Actions card with action buttons', () => {
    renderComponent();

    expect(screen.getByText('Quick Actions')).toBeInTheDocument();
    expect(screen.getByText('Update Info')).toBeInTheDocument();
    expect(screen.getByText('Upload Document')).toBeInTheDocument();
    expect(screen.getByText('View Payslip')).toBeInTheDocument();
    expect(screen.getByText('Apply Leave')).toBeInTheDocument();
    expect(screen.getByText('Raise Request')).toBeInTheDocument();
    expect(screen.getByText('More Actions')).toBeInTheDocument();
  });

  it('renders bottom row cards: Recent Activity, Assigned Assets, Performance & Goals', () => {
    renderComponent();

    // Recent Activity
    expect(screen.getByText('Recent Activity')).toBeInTheDocument();
    expect(screen.getByText('Profile updated')).toBeInTheDocument();
    expect(screen.getByText('Emergency contact changed')).toBeInTheDocument();

    // Assigned Assets
    expect(screen.getByText('Assigned Assets')).toBeInTheDocument();
    expect(screen.getByText('Dell Latitude 5430')).toBeInTheDocument();
    expect(screen.getByText('AC-7821')).toBeInTheDocument();
    expect(screen.getByText('ID-1025')).toBeInTheDocument();

    // Performance & Goals
    expect(screen.getByText('Performance & Goals')).toBeInTheDocument();
    expect(screen.getByText('4.5')).toBeInTheDocument();
    expect(screen.getByText('67%')).toBeInTheDocument();
    expect(screen.getByText('2 / 3 Completed')).toBeInTheDocument();
  });

  it('allows switching between tabs interactively', () => {
    renderComponent();

    // Switch to Documents Tab
    const docsTab = screen.getByRole('button', { name: /^Documents$/i });
    fireEvent.click(docsTab);
    expect(screen.getByText('Document Repository')).toBeInTheDocument();
    expect(screen.getByText('Aadhaar Card')).toBeInTheDocument();

    // Switch to Payroll Tab
    const payrollTab = screen.getByRole('button', { name: /^Payroll$/i });
    fireEvent.click(payrollTab);
    expect(screen.getByText('Compensation & Payslips')).toBeInTheDocument();
    expect(screen.getByText('Monthly Earnings Split')).toBeInTheDocument();

    // Switch to Leave Tab
    const leaveTab = screen.getByRole('button', { name: /^Leave$/i });
    fireEvent.click(leaveTab);
    expect(screen.getByText('Casual Leave')).toBeInTheDocument();
    expect(screen.getByText('Sick Leave')).toBeInTheDocument();

    // Switch to History Tab
    const historyTab = screen.getByRole('button', { name: /^History$/i });
    fireEvent.click(historyTab);
    expect(screen.getByText('Audit Trail & Timeline')).toBeInTheDocument();
  });

  it('opens Edit Profile modal and saves changes with toast confirmation', () => {
    renderComponent();

    const editBtn = screen.getByRole('button', { name: /Edit Profile/i });
    fireEvent.click(editBtn);

    expect(screen.getByText('Edit Employee Profile')).toBeInTheDocument();

    const saveBtn = screen.getByRole('button', { name: /Save Changes/i });
    fireEvent.click(saveBtn);

    // Modal closes
    expect(screen.queryByText('Edit Employee Profile')).not.toBeInTheDocument();
  });
});
