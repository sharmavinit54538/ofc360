/**
 * @file workforceCrud.test.tsx
 * @description Comprehensive unit tests for Workforce Role-based CRUD operations:
 * 1. RTK Query endpoints (getEmployees, createEmployee, updateEmployee, deleteEmployee)
 * 2. Zod validation schemas with role enum (EMPLOYEE, MANAGER, IT_ADMIN, EXECUTIVE)
 * 3. EmployeeDirectoryTable role tabs, color-coded badges, in-row Edit & Delete actions
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { workforceApi } from '../api/workforceApi';
import {
  workforceRoleEnum,
  createEmployeeSchema,
  updateEmployeeSchema,
} from '../schemas/workforce.schemas';
import { EmployeeDirectoryTable } from '../components/EmployeeDirectoryTable';
import type { EmployeeItem } from '../types/workforce.types';

// Mock useRBAC
vi.mock('@/features/auth/hooks/useRBAC', () => ({
  useRBAC: () => ({
    hasAnyRole: (roles: string[]) => roles.includes('SUPER_ADMIN') || roles.includes('HR_ADMIN'),
    hasRole: () => true,
    hasPermission: () => true,
  }),
}));

describe('Workforce Role-Based CRUD & RTK Query Endpoints', () => {
  const endpoints = workforceApi.endpoints;

  describe('workforceApi Endpoints Contract', () => {
    it('verifies all necessary endpoints exist on workforceApi', () => {
      expect(endpoints.getEmployees).toBeDefined();
      expect(endpoints.getEmployeeById).toBeDefined();
      expect(endpoints.createEmployee).toBeDefined();
      expect(endpoints.updateEmployee).toBeDefined();
      expect(endpoints.deleteEmployee).toBeDefined();
      expect(endpoints.getWorkforceStats).toBeDefined();
      expect(endpoints.getDepartments).toBeDefined();
      expect(endpoints.getDesignations).toBeDefined();
      expect(endpoints.getOrgChart).toBeDefined();
    });

    it('getEmployees: initiates query with role filter parameter', () => {
      const qManager = endpoints.getEmployees.initiate({ role: 'MANAGER', page: 1, limit: 10 });
      expect(qManager).toBeDefined();

      const qItAdmin = endpoints.getEmployees.initiate({ role: 'IT_ADMIN', page: 1, limit: 10 });
      expect(qItAdmin).toBeDefined();

      const qExecutive = endpoints.getEmployees.initiate({ role: 'EXECUTIVE', page: 1, limit: 10 });
      expect(qExecutive).toBeDefined();

      const qEmployee = endpoints.getEmployees.initiate({ role: 'EMPLOYEE', page: 1, limit: 10 });
      expect(qEmployee).toBeDefined();
    });

    it('deleteEmployee: initiates mutation with employee id', () => {
      const mutation = endpoints.deleteEmployee.initiate('emp_test_123');
      expect(mutation).toBeDefined();
    });

    it('createEmployee & updateEmployee: initiate mutations with role payloads', () => {
      const createMutation = endpoints.createEmployee.initiate({
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane.doe@example.com',
        personalEmail: 'jane.personal@example.com',
        phone: '+919876543210',
        role: 'MANAGER',
        employeeCode: 'EMP-001',
        employmentType: 'FULL_TIME',
        departmentId: 'dept_eng',
        designationId: 'desig_eng_mgr',
        joiningDate: '2025-01-01',
      });
      expect(createMutation).toBeDefined();

      const updateMutation = endpoints.updateEmployee.initiate({
        id: 'emp_test_123',
        data: {
          role: 'EXECUTIVE',
          departmentId: 'dept_exec',
        },
      });
      expect(updateMutation).toBeDefined();
    });
  });

  describe('Zod Schemas: Role Validation', () => {
    it('validates role enum values strictly', () => {
      expect(workforceRoleEnum.parse('EMPLOYEE')).toBe('EMPLOYEE');
      expect(workforceRoleEnum.parse('MANAGER')).toBe('MANAGER');
      expect(workforceRoleEnum.parse('IT_ADMIN')).toBe('IT_ADMIN');
      expect(workforceRoleEnum.parse('EXECUTIVE')).toBe('EXECUTIVE');

      expect(() => workforceRoleEnum.parse('INVALID_ROLE')).toThrow();
    });

    it('createEmployeeSchema defaults role to EMPLOYEE if omitted', () => {
      const validPayload = {
        firstName: 'Aarav',
        lastName: 'Sharma',
        email: 'aarav@company.com',
        personalEmail: 'aarav.personal@example.com',
        phone: '+919876543210',
        department: 'Engineering',
        designation: 'Senior Software Engineer',
        employmentType: 'FULL_TIME' as const,
        departmentId: 'dept_it',
        designationId: 'desig_dev',
        joiningDate: '2025-03-01',
      };

      const result = createEmployeeSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.role.toUpperCase()).toBe('EMPLOYEE');
      }
    });

    it('createEmployeeSchema allows explicit IT_ADMIN role', () => {
      const itAdminPayload = {
        firstName: 'Vikram',
        lastName: 'Singh',
        email: 'vikram@company.com',
        personalEmail: 'vikram.personal@example.com',
        phone: '+919876543210',
        department: 'IT Operations',
        designation: 'Lead DevOps & Admin',
        role: 'IT_ADMIN' as const,
        employmentType: 'FULL_TIME' as const,
        departmentId: 'dept_it',
        designationId: 'desig_sysadmin',
        joiningDate: '2025-02-15',
      };

      const result = createEmployeeSchema.safeParse(itAdminPayload);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.role).toBe('IT_ADMIN');
      }
    });

    it('updateEmployeeSchema validates role updates', () => {
      const updatePayload = {
        role: 'EXECUTIVE' as const,
      };

      const result = updateEmployeeSchema.safeParse(updatePayload);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.role).toBe('EXECUTIVE');
      }
    });
  });

  describe('EmployeeDirectoryTable Component', () => {
    const mockEmployees: EmployeeItem[] = [
      {
        id: 'emp_1',
        employeeCode: 'EMP-101',
        firstName: 'Alice',
        lastName: 'Smith',
        email: 'alice@company.com',
        phone: '+919876543210',
        gender: 'OTHER' as const,
        workLocation: 'Jaipur HQ',
        role: 'EMPLOYEE',
        employmentType: 'FULL_TIME',
        status: 'ACTIVE',
        department: { id: 'dept_eng', name: 'Engineering' },
        departmentId: 'dept_eng',
        departmentName: 'Engineering',
        designation: { id: 'desig_dev', title: 'Software Engineer' },
        designationTitle: 'Software Engineer',
        joiningDate: '2024-01-15',
      },
      {
        id: 'emp_2',
        employeeCode: 'EMP-102',
        firstName: 'Bob',
        lastName: 'Johnson',
        email: 'bob@company.com',
        phone: '+919876543210',
        gender: 'OTHER' as const,
        workLocation: 'Jaipur HQ',
        role: 'MANAGER',
        employmentType: 'FULL_TIME',
        status: 'ACTIVE',
        department: { id: 'dept_eng', name: 'Engineering' },
        departmentId: 'dept_eng',
        departmentName: 'Engineering',
        designation: { id: 'desig_mgr', title: 'Engineering Manager' },
        designationTitle: 'Engineering Manager',
        joiningDate: '2023-05-10',
      },
      {
        id: 'emp_3',
        employeeCode: 'EMP-103',
        firstName: 'Charlie',
        lastName: 'Lee',
        email: 'charlie@company.com',
        phone: '+919876543210',
        gender: 'OTHER' as const,
        workLocation: 'Jaipur HQ',
        role: 'IT_ADMIN',
        employmentType: 'FULL_TIME',
        status: 'ACTIVE',
        department: { id: 'dept_it', name: 'IT Operations' },
        departmentId: 'dept_it',
        departmentName: 'IT Operations',
        designation: { id: 'desig_it', title: 'Lead DevOps & Admin' },
        designationTitle: 'Lead DevOps & Admin',
        joiningDate: '2023-09-01',
      },
      {
        id: 'emp_4',
        employeeCode: 'EMP-104',
        firstName: 'Diana',
        lastName: 'Prince',
        email: 'diana@company.com',
        phone: '+919876543210',
        gender: 'OTHER' as const,
        workLocation: 'Jaipur HQ',
        role: 'EXECUTIVE',
        employmentType: 'FULL_TIME',
        status: 'ACTIVE',
        department: { id: 'dept_corp', name: 'Executive Office' },
        departmentId: 'dept_corp',
        departmentName: 'Executive Office',
        designation: { id: 'desig_dir', title: 'VP of Technology' },
        designationTitle: 'VP of Technology',
        joiningDate: '2022-03-20',
      },
    ];

    it('renders all role tabs with live count badges', () => {
      render(
        <EmployeeDirectoryTable
          employees={mockEmployees}
          isLoading={false}
          onEdit={vi.fn()}
          onDelete={vi.fn()}
          onStatusChange={vi.fn()}
          onView={vi.fn()}
        />
      );

      expect(screen.getByText('All Roles')).toBeDefined();
      expect(screen.getByText('Employees')).toBeDefined();
      expect(screen.getByText('Managers')).toBeDefined();
      expect(screen.getByText('IT Admins')).toBeDefined();
      expect(screen.getByText('Executives')).toBeDefined();
    });

    it('renders custom color-coded role badges for each access tier', () => {
      render(
        <EmployeeDirectoryTable
          employees={mockEmployees}
          isLoading={false}
          onEdit={vi.fn()}
          onDelete={vi.fn()}
          onStatusChange={vi.fn()}
          onView={vi.fn()}
        />
      );

      // Verify role labels rendered in the table rows (getAllByText since 'Employee' is in header and badge)
      expect(screen.getAllByText('Employee').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Manager').length).toBeGreaterThan(0);
      expect(screen.getByText('IT Admin')).toBeDefined();
      expect(screen.getByText('Executive')).toBeDefined();
    });

    it('calls onRoleChange when selecting a role filter tab', () => {
      const handleRoleChange = vi.fn();
      render(
        <EmployeeDirectoryTable
          employees={mockEmployees}
          isLoading={false}
          onEdit={vi.fn()}
          onDelete={vi.fn()}
          onStatusChange={vi.fn()}
          onView={vi.fn()}
          onRoleChange={handleRoleChange}
        />
      );

      const managersTab = screen.getByRole('button', { name: /Managers/i });
      fireEvent.click(managersTab);
      expect(handleRoleChange).toHaveBeenCalledWith('MANAGER');

      const itAdminsTab = screen.getByRole('button', { name: /IT Admins/i });
      fireEvent.click(itAdminsTab);
      expect(handleRoleChange).toHaveBeenCalledWith('IT_ADMIN');
    });

    it('triggers in-row onEdit callback with employee when Edit button is clicked', () => {
      const handleEdit = vi.fn();
      render(
        <EmployeeDirectoryTable
          employees={mockEmployees}
          isLoading={false}
          onEdit={handleEdit}
          onDelete={vi.fn()}
          onStatusChange={vi.fn()}
          onView={vi.fn()}
        />
      );

      const editAliceBtn = screen.getByTitle('Edit Alice Smith');
      fireEvent.click(editAliceBtn);
      expect(handleEdit).toHaveBeenCalledTimes(1);
      expect(handleEdit).toHaveBeenCalledWith(mockEmployees[0]);
    });

    it('triggers in-row onDelete callback with employee when Delete button is clicked', () => {
      const handleDelete = vi.fn();
      render(
        <EmployeeDirectoryTable
          employees={mockEmployees}
          isLoading={false}
          onEdit={vi.fn()}
          onDelete={handleDelete}
          onStatusChange={vi.fn()}
          onView={vi.fn()}
        />
      );

      const deleteBobBtn = screen.getByTitle('Delete Bob Johnson');
      fireEvent.click(deleteBobBtn);
      expect(handleDelete).toHaveBeenCalledTimes(1);
      expect(handleDelete).toHaveBeenCalledWith(mockEmployees[1]);
    });

    it('renders loader state on delete button when isDeletingId matches employee', () => {
      render(
        <EmployeeDirectoryTable
          employees={mockEmployees}
          isLoading={false}
          onEdit={vi.fn()}
          onDelete={vi.fn()}
          onStatusChange={vi.fn()}
          onView={vi.fn()}
          isDeletingId="emp_2"
        />
      );

      const deleteBobBtn = screen.getByTitle('Deleting Bob Johnson...');
      expect(deleteBobBtn).toBeDefined();
      expect(deleteBobBtn.hasAttribute('disabled')).toBe(true);
    });
  });
});

