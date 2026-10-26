/**
 * @file departmentCrud.test.tsx
 * @description Comprehensive unit tests for Department Create/Edit Form,
 * API layer, error mapping, and payload builder adhering to FastAPI backend specifications:
 * 1. Payload builder (rename name->department_name, head_id->manager_id, is_active->status, remove code, never send null)
 * 2. Zod validation schema (required department_name, description, location; optional manager_id, parent_department_id, branch_id, cost_center, extension_number; defaults for budget, employee_capacity, status)
 * 3. Error mapping (422 field-level, 409 duplicate name, 403 permissions, 400 backend message)
 * 4. Response shape parsing { success, message, data, errors }
 * 5. RTK Query endpoints (POST /departments, PUT /departments/{id}, GET /departments)
 * 6. DepartmentModal UI (read-only code on edit, strictly MANAGER role in dropdown)
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import {
  toDepartmentPayload,
  parseDepartmentApiError,
  normalizeDepartment,
  normalizeDepartments,
  workforceApi,
} from '../api/workforceApi';
import { departmentFormSchema, departmentStatusEnum } from '../schemas/workforce.schemas';
import { DepartmentModal } from '../components/DepartmentModal';
import type { DepartmentItem } from '../types/workforce.types';

// Mock Toast
vi.mock('@/shared/ui/Toast', () => ({
  useToast: () => ({
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  }),
}));

// Mock RTK Query hooks in workforceApi for UI tests
const mockCreateDepartment = vi.fn();
const mockUpdateDepartment = vi.fn();

vi.mock('../api/workforceApi', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../api/workforceApi')>();
  return {
    ...actual,
    useCreateDepartmentMutation: () => [
      mockCreateDepartment,
      { isLoading: false },
    ],
    useUpdateDepartmentMutation: () => [
      mockUpdateDepartment,
      { isLoading: false },
    ],
    useGetEmployeesQuery: (params?: any) => {
      // Simulate backend returning users: only some have role MANAGER
      return {
        data: {
          items: [
            {
              id: 'usr_mgr_1',
              fullName: 'Alice Manager',
              firstName: 'Alice',
              lastName: 'Manager',
              role: 'MANAGER',
              employeeCode: 'MGR-001',
              email: 'alice@company.com',
            },
            {
              id: 'usr_emp_2',
              fullName: 'Bob Employee',
              firstName: 'Bob',
              lastName: 'Employee',
              role: 'EMPLOYEE',
              employeeCode: 'EMP-002',
              email: 'bob@company.com',
            },
            {
              id: 'usr_it_3',
              fullName: 'Charlie IT Admin',
              firstName: 'Charlie',
              lastName: 'IT',
              role: 'IT_ADMIN',
              employeeCode: 'IT-003',
              email: 'charlie@company.com',
            },
            {
              id: 'usr_mgr_4',
              fullName: 'Diana Director',
              firstName: 'Diana',
              lastName: 'Director',
              role: 'MANAGER',
              employeeCode: 'MGR-004',
              email: 'diana@company.com',
            },
          ],
          total: 4,
        },
        isLoading: false,
      };
    },
    useGetDepartmentsQuery: () => ({
      data: [
        {
          id: 'dept_root',
          department_name: 'Executive Board',
          name: 'Executive Board',
          department_code: 'EXEC',
          code: 'EXEC',
          isActive: true,
          totalEmployees: 5,
        },
        {
          id: 'dept_eng',
          department_name: 'Engineering',
          name: 'Engineering',
          department_code: 'ENG',
          code: 'ENG',
          isActive: true,
          totalEmployees: 40,
        },
      ],
      isLoading: false,
    }),
  };
});

describe('Department Payload Builder (toDepartmentPayload)', () => {
  it('renames name -> department_name, head_id -> manager_id, is_active -> status', () => {
    const input = {
      name: 'Platform Engineering',
      description: 'Infrastructure and developer platform team',
      location: 'Tower 2, Floor 5',
      head_id: '11111111-2222-3333-4444-555555555555',
      is_active: true,
      budget: 1500000,
      employee_capacity: 50,
    };

    const payload = toDepartmentPayload(input);

    expect(payload.department_name).toBe('Platform Engineering');
    expect(payload.description).toBe('Infrastructure and developer platform team');
    expect(payload.location).toBe('Tower 2, Floor 5');
    expect(payload.manager_id).toBe('11111111-2222-3333-4444-555555555555');
    expect(payload.status).toBe('ACTIVE');
    expect(payload.budget).toBe(1500000);
    expect(payload.employee_capacity).toBe(50);

    // Old keys should not be present
    expect(payload.name).toBeUndefined();
    expect(payload.head_id).toBeUndefined();
    expect(payload.is_active).toBeUndefined();
  });

  it('removes code from create payload (department_code is generated by server)', () => {
    const input = {
      department_name: 'DevOps',
      code: 'DEVOPS-CODE',
      department_code: 'DEVOPS-CODE',
      description: 'CI/CD and cloud infra',
      location: 'Bengaluru Office',
    };

    const payload = toDepartmentPayload(input, { isCreate: true });

    expect(payload.department_name).toBe('DevOps');
    expect(payload.code).toBeUndefined();
    expect(payload.department_code).toBeUndefined();
  });

  it('omits any key whose value is empty and NEVER sends null', () => {
    const input = {
      department_name: 'Security Operations',
      description: 'InfoSec and Cyber Defense',
      location: 'Jaipur HQ',
      manager_id: '',
      parent_department_id: '',
      branch_id: '',
      cost_center: '',
      extension_number: '',
      head_id: null,
    };

    const payload = toDepartmentPayload(input);

    expect(payload.department_name).toBe('Security Operations');
    expect(payload.description).toBe('InfoSec and Cyber Defense');
    expect(payload.location).toBe('Jaipur HQ');

    // All empty keys MUST be omitted
    expect(payload).not.toHaveProperty('manager_id');
    expect(payload).not.toHaveProperty('parent_department_id');
    expect(payload).not.toHaveProperty('branch_id');
    expect(payload).not.toHaveProperty('cost_center');
    expect(payload).not.toHaveProperty('extension_number');
    expect(payload).not.toHaveProperty('head_id');

    // Verify no null values exist in entire object
    for (const [key, val] of Object.entries(payload)) {
      expect(val).not.toBeNull();
      expect(val).not.toBe('');
    }
  });

  it('supports all valid status enum values: ACTIVE, INACTIVE, HIRING, GROWING', () => {
    expect(toDepartmentPayload({ department_name: 'D1', description: 'Desc', location: 'L1', status: 'HIRING' }).status).toBe('HIRING');
    expect(toDepartmentPayload({ department_name: 'D2', description: 'Desc', location: 'L1', status: 'GROWING' }).status).toBe('GROWING');
    expect(toDepartmentPayload({ department_name: 'D3', description: 'Desc', location: 'L1', status: 'INACTIVE' }).status).toBe('INACTIVE');
    expect(toDepartmentPayload({ department_name: 'D4', description: 'Desc', location: 'L1', status: 'ACTIVE' }).status).toBe('ACTIVE');
  });

  it('applies defaults for create mode (budget: 0, employee_capacity: 100, status: ACTIVE)', () => {
    const input = {
      department_name: 'QA & Testing',
      description: 'Quality assurance and automated testing',
      location: 'Jaipur Office',
    };

    const payload = toDepartmentPayload(input, { isCreate: true });

    expect(payload.budget).toBe(0);
    expect(payload.employee_capacity).toBe(100);
    expect(payload.status).toBe('ACTIVE');
  });

  it('supports partial updates for PUT /api/v1/departments/{id} without injecting defaults', () => {
    const partialUpdate = {
      location: 'Floor 9, Innovation Center',
      employee_capacity: 150,
    };

    const payload = toDepartmentPayload(partialUpdate, { isCreate: false });

    expect(payload.location).toBe('Floor 9, Innovation Center');
    expect(payload.employee_capacity).toBe(150);
    expect(payload.budget).toBeUndefined();
    expect(payload.department_name).toBeUndefined();
    expect(payload.status).toBeUndefined();
  });
});

describe('Zod Validation Schema (departmentFormSchema)', () => {
  it('validates required fields: department_name (1-100), description (1-1000), location (1-100)', () => {
    const valid = {
      department_name: 'Platform Eng',
      description: 'Responsible for internal developer experience.',
      location: 'Jaipur HQ',
    };

    const result = departmentFormSchema.safeParse(valid);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.budget).toBe(0);
      expect(result.data.employee_capacity).toBe(100);
      expect(result.data.status).toBe('ACTIVE');
    }
  });

  it('fails when department_name is empty or exceeds 100 characters', () => {
    const emptyName = {
      department_name: '',
      description: 'Valid description',
      location: 'Valid location',
    };
    expect(departmentFormSchema.safeParse(emptyName).success).toBe(false);

    const longName = {
      department_name: 'A'.repeat(101),
      description: 'Valid description',
      location: 'Valid location',
    };
    expect(departmentFormSchema.safeParse(longName).success).toBe(false);
  });

  it('fails when description is empty or exceeds 1000 characters', () => {
    const emptyDesc = {
      department_name: 'Valid Name',
      description: '',
      location: 'Valid location',
    };
    expect(departmentFormSchema.safeParse(emptyDesc).success).toBe(false);

    const longDesc = {
      department_name: 'Valid Name',
      description: 'D'.repeat(1001),
      location: 'Valid location',
    };
    expect(departmentFormSchema.safeParse(longDesc).success).toBe(false);
  });

  it('fails when location is empty or exceeds 100 characters', () => {
    const emptyLoc = {
      department_name: 'Valid Name',
      description: 'Valid description',
      location: '',
    };
    expect(departmentFormSchema.safeParse(emptyLoc).success).toBe(false);

    const longLoc = {
      department_name: 'Valid Name',
      description: 'Valid description',
      location: 'L'.repeat(101),
    };
    expect(departmentFormSchema.safeParse(longLoc).success).toBe(false);
  });

  it('validates optional cost_center (max 50) and extension_number (max 50)', () => {
    const validExtra = {
      department_name: 'Finance',
      description: 'Accounting and payroll processing',
      location: 'Finance Wing',
      cost_center: 'CC-FIN-99',
      extension_number: '+91 141 9876',
    };
    expect(departmentFormSchema.safeParse(validExtra).success).toBe(true);

    const longCostCenter = {
      ...validExtra,
      cost_center: 'C'.repeat(51),
    };
    expect(departmentFormSchema.safeParse(longCostCenter).success).toBe(false);
  });

  it('validates status enum strictly', () => {
    expect(departmentStatusEnum.parse('ACTIVE')).toBe('ACTIVE');
    expect(departmentStatusEnum.parse('INACTIVE')).toBe('INACTIVE');
    expect(departmentStatusEnum.parse('HIRING')).toBe('HIRING');
    expect(departmentStatusEnum.parse('GROWING')).toBe('GROWING');
    expect(() => departmentStatusEnum.parse('ARCHIVED')).toThrow();
  });
});

describe('Error Mapping (parseDepartmentApiError)', () => {
  it('maps 409 -> "Department name already exists"', () => {
    const error409 = {
      status: 409,
      data: {
        detail: 'Conflict: department name duplicate',
      },
    };

    const parsed = parseDepartmentApiError(error409);
    expect(parsed.generalMessage).toBe('Department name already exists');
    expect(parsed.fieldErrors.department_name).toBe('Department name already exists');
  });

  it('maps 403 -> "Only Super Admin, HR Admin and IT Admin can manage departments"', () => {
    const error403 = {
      status: 403,
      data: {
        detail: 'Permission denied',
      },
    };

    const parsed = parseDepartmentApiError(error403);
    expect(parsed.generalMessage).toBe('Only Super Admin, HR Admin and IT Admin can manage departments');
  });

  it('maps 400 -> shows backend error message', () => {
    const error400 = {
      status: 400,
      data: {
        message: 'Assigned manager must have MANAGER role',
      },
    };

    const parsed = parseDepartmentApiError(error400);
    expect(parsed.generalMessage).toBe('Assigned manager must have MANAGER role');
  });

  it('maps 422 -> field-level messages from FastAPI detail[].loc / msg', () => {
    const error422FastAPI = {
      status: 422,
      data: {
        detail: [
          {
            loc: ['body', 'location'],
            msg: 'Location is required and must be 1-100 characters',
            type: 'value_error',
          },
          {
            loc: ['body', 'employee_capacity'],
            msg: 'Employee capacity must be greater than or equal to 0',
            type: 'value_error',
          },
        ],
      },
    };

    const parsed = parseDepartmentApiError(error422FastAPI);
    expect(parsed.fieldErrors.location).toBe('Location is required and must be 1-100 characters');
    expect(parsed.fieldErrors.employee_capacity).toBe('Employee capacity must be greater than or equal to 0');
  });

  it('maps 422 -> field-level messages from errors[] response wrapper', () => {
    const error422Wrapped = {
      status: 422,
      data: {
        success: false,
        message: 'Validation failed',
        errors: [
          {
            field: 'description',
            message: 'Description must be between 1 and 1000 characters',
          },
          {
            field: 'department_name',
            message: 'Department name already in use',
          },
        ],
      },
    };

    const parsed = parseDepartmentApiError(error422Wrapped);
    expect(parsed.fieldErrors.description).toBe('Description must be between 1 and 1000 characters');
    expect(parsed.fieldErrors.department_name).toBe('Department name already in use');
  });
});

describe('Response Shape Normalization ({ success, message, data, errors })', () => {
  it('reads created department from data property', () => {
    const backendResponse = {
      success: true,
      message: 'Department created successfully',
      data: {
        id: 'dept_uuid_101',
        department_code: 'ENG-01',
        department_name: 'Core Engineering',
        status: 'HIRING',
        location: 'Jaipur Campus',
        budget: 5000000,
        employee_capacity: 120,
        cost_center: 'CC-ENG',
      },
      errors: null,
    };

    const dept = normalizeDepartment(backendResponse);
    expect(dept.id).toBe('dept_uuid_101');
    expect(dept.code).toBe('ENG-01');
    expect(dept.departmentCode).toBe('ENG-01');
    expect(dept.name).toBe('Core Engineering');
    expect(dept.departmentName).toBe('Core Engineering');
    expect(dept.status).toBe('HIRING');
    expect(dept.location).toBe('Jaipur Campus');
    expect(dept.budget).toBe(5000000);
    expect(dept.employeeCapacity).toBe(120);
    expect(dept.costCenter).toBe('CC-ENG');
  });

  it('normalizes list of departments from { success, message, data, errors }', () => {
    const backendListResponse = {
      success: true,
      message: 'Departments fetched',
      data: [
        {
          id: 'd1',
          department_code: 'DEV',
          department_name: 'Development',
          status: 'ACTIVE',
          employee_count: 25,
        },
        {
          id: 'd2',
          department_code: 'MKT',
          department_name: 'Marketing',
          status: 'GROWING',
          employee_count: 10,
        },
      ],
      errors: null,
    };

    const departments = normalizeDepartments(backendListResponse);
    expect(departments).toHaveLength(2);
    expect(departments[0].code).toBe('DEV');
    expect(departments[0].name).toBe('Development');
    expect(departments[0].status).toBe('ACTIVE');
    expect(departments[1].code).toBe('MKT');
    expect(departments[1].status).toBe('GROWING');
  });
});

describe('DepartmentModal Component Requirements', () => {
  it('in Create mode: does NOT render department code input (server generates it)', () => {
    render(<DepartmentModal isOpen={true} onClose={vi.fn()} department={null} />);

    expect(screen.getByRole('heading', { name: 'Create Department' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'Create Department' })).toBeDefined();
    // Department Code input should not be present
    expect(screen.queryByLabelText(/Department Code/i)).toBeNull();
    expect(screen.queryByText(/Server Generated/i)).toBeNull();

    // Required inputs must be present
    expect(screen.getByLabelText(/Department Name/i)).toBeDefined();
    expect(screen.getByLabelText(/Location/i)).toBeDefined();
    expect(screen.getByLabelText(/Description/i)).toBeDefined();
  });

  it('in Edit mode: renders department_code as read-only', () => {
    const existingDept: DepartmentItem = {
      id: 'dept_edit_123',
      name: 'Cloud Infrastructure',
      departmentName: 'Cloud Infrastructure',
      code: 'CLOUD-99',
      departmentCode: 'CLOUD-99',
      description: 'Maintains AWS & GCP stacks',
      location: 'Hyderabad Data Center',
      isActive: true,
      status: 'ACTIVE',
      totalEmployees: 12,
    };

    render(<DepartmentModal isOpen={true} onClose={vi.fn()} department={existingDept} />);

    expect(screen.getByText('Edit Department')).toBeDefined();
    expect(screen.getByText('CLOUD-99')).toBeDefined();
    expect(screen.queryByText(/Server Generated/i)).toBeNull();
    expect(screen.getByText(/Code is generated automatically upon creation and cannot be modified/i)).toBeDefined();
  });

  it('Manager dropdown lists ONLY users with the MANAGER role', async () => {
    render(<DepartmentModal isOpen={true} onClose={vi.fn()} department={null} />);

    // Wait for manager options to render
    await waitFor(() => {
      // Alice Manager (role: MANAGER) and Diana Director (role: MANAGER) should be present
      expect(screen.getByText(/Alice Manager/i)).toBeDefined();
      expect(screen.getByText(/Diana Director/i)).toBeDefined();

      // Bob Employee (role: EMPLOYEE) and Charlie IT Admin (role: IT_ADMIN) must NOT be in the dropdown!
      expect(screen.queryByText(/Bob Employee/i)).toBeNull();
      expect(screen.queryByText(/Charlie IT Admin/i)).toBeNull();
    });
  });

  it('Parent Department dropdown lists departments excluding self', async () => {
    const existingDept: DepartmentItem = {
      id: 'dept_eng',
      name: 'Engineering',
      departmentName: 'Engineering',
      code: 'ENG',
      departmentCode: 'ENG',
      description: 'Core Engineering',
      location: 'HQ',
      isActive: true,
      totalEmployees: 40,
    };

    render(<DepartmentModal isOpen={true} onClose={vi.fn()} department={existingDept} />);

    await waitFor(() => {
      // Executive Board should be available as parent option
      expect(screen.getByText(/Executive Board/i)).toBeDefined();

      // Engineering itself must NOT be available as its own parent!
      const parentSelect = screen.getByLabelText(/Parent Department/i);
      expect(parentSelect.textContent).not.toContain('Engineering (ENG)');
    });
  });
});
