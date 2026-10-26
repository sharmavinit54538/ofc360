/**
 * @file employeeFastApiPayload.test.tsx
 * @description Unit tests for FastAPI EmployeeCreate contract:
 * 1. Clean snake_case payload without duplicated camelCase/snake_case aliases
 * 2. department and designation sent as plain text strings (not IDs)
 * 3. Field mappings: employeeCode -> employee_id, email -> company_email, personalEmail -> personal_email,
 *    joiningDate -> joining_date, reportingManagerId -> reporting_manager_id, workLocation -> work_location,
 *    role in lowercase
 * 4. Omit optional keys when empty; never send "" for UUID/date fields
 * 5. Client-side validation: phone must be 10-15 chars, required fields enforced
 * 6. Error handling: 422 per field, 409 duplicate, 403 admin only, 400 message
 * 7. Flow tests:
 *    - create employee with only required fields
 *    - create employee with reporting manager
 *    - verify saved employee displays department "AI01" and designation "Senior Software Engineer" in list
 */

import { describe, it, expect } from 'vitest';
import {
  toEmployeePayload,
  parseEmployeeApiError,
  normalizeEmployee,
  workforceApi,
} from '../api/workforceApi';
import { createEmployeeSchema } from '../schemas/workforce.schemas';

describe('FastAPI Employee Payload Builder (toEmployeePayload)', () => {
  it('sends ONE clean snake_case payload and removes all duplicated aliases', () => {
    const frontendData = {
      firstName: 'Rahul',
      lastName: 'Verma',
      personalEmail: 'rahul.personal@gmail.com',
      email: 'rahul.verma@company.com',
      phone: '+919876543210',
      department: 'AI01',
      designation: 'Senior Software Engineer',
      joiningDate: '2026-03-01',
      reportingManagerId: '550e8400-e29b-41d4-a716-446655440000',
      workLocation: 'Jaipur HQ',
      employeeCode: 'EMP-9001',
      employmentType: 'FULL_TIME',
      role: 'MANAGER',
      gender: 'MALE',
      workMode: 'OFFICE', // unknown / unsupported key
    };

    const payload = toEmployeePayload(frontendData);

    // Verify required snake_case fields
    expect(payload.first_name).toBe('Rahul');
    expect(payload.last_name).toBe('Verma');
    expect(payload.personal_email).toBe('rahul.personal@gmail.com');
    expect(payload.company_email).toBe('rahul.verma@company.com');
    expect(payload.phone).toBe('+919876543210');
    expect(payload.department).toBe('AI01');
    expect(payload.designation).toBe('Senior Software Engineer');
    expect(payload.joining_date).toBe('2026-03-01');
    expect(payload.reporting_manager_id).toBe('550e8400-e29b-41d4-a716-446655440000');
    expect(payload.work_location).toBe('Jaipur HQ');
    expect(payload.employee_id).toBe('EMP-9001');
    expect(payload.employment_type).toBe('FULL_TIME');
    expect(payload.role).toBe('manager'); // role must be in lowercase
    expect(payload.gender).toBe('MALE');

    // VERIFY REMOVAL OF DUPLICATE ALIASES & UNKNOWN KEYS:
    expect(payload.departmentId).toBeUndefined();
    expect(payload.department_id).toBeUndefined();
    expect(payload.designationId).toBeUndefined();
    expect(payload.designation_id).toBeUndefined();
    expect(payload.firstName).toBeUndefined();
    expect(payload.lastName).toBeUndefined();
    expect(payload.joiningDate).toBeUndefined();
    expect(payload.date_of_joining).toBeUndefined();
    expect(payload.phone_number).toBeUndefined();
    expect(payload.personalEmail).toBeUndefined();
    expect(payload.reportingManagerId).toBeUndefined();
    expect(payload.manager_id).toBeUndefined();
    expect(payload.workLocation).toBeUndefined();
    expect(payload.workMode).toBeUndefined();
    expect(payload.work_mode).toBeUndefined();
    expect(payload.employeeCode).toBeUndefined();
    expect(payload.employmentType).toBeUndefined();
    expect(payload.email).toBeUndefined();
  });

  it('sends department and designation as plain text names, never IDs', () => {
    const input = {
      first_name: 'Priya',
      last_name: 'Patel',
      personal_email: 'priya@gmail.com',
      phone: '9876543210',
      department: 'AI01',
      designation: 'Senior Software Engineer',
      joining_date: '2026-04-15',
    };

    const payload = toEmployeePayload(input);

    expect(payload.department).toBe('AI01');
    expect(payload.designation).toBe('Senior Software Engineer');
    expect(payload.department).not.toMatch(/^dept_/);
    expect(payload.designation).not.toMatch(/^desg_/);
  });

  it('omits optional keys when empty and NEVER sends "" or null for UUID/date fields', () => {
    const minimalInput = {
      firstName: 'Amit',
      lastName: 'Kumar',
      personalEmail: 'amit.kumar@gmail.com',
      phone: '+919988776655',
      department: 'AI01',
      designation: 'QA Engineer',
      joiningDate: '2026-05-01',
      reportingManagerId: '',
      employeeCode: '',
      email: '',
      workLocation: '',
      date_of_birth: '',
      cost_center_id: '',
    };

    const payload = toEmployeePayload(minimalInput);

    expect(payload.first_name).toBe('Amit');
    expect(payload.last_name).toBe('Kumar');
    expect(payload.personal_email).toBe('amit.kumar@gmail.com');
    expect(payload.phone).toBe('+919988776655');
    expect(payload.department).toBe('AI01');
    expect(payload.designation).toBe('QA Engineer');
    expect(payload.joining_date).toBe('2026-05-01');

    // Empty optional fields MUST be omitted
    expect(payload).not.toHaveProperty('reporting_manager_id');
    expect(payload).not.toHaveProperty('employee_id');
    expect(payload).not.toHaveProperty('company_email');
    expect(payload).not.toHaveProperty('work_location');
    expect(payload).not.toHaveProperty('date_of_birth');
    expect(payload).not.toHaveProperty('cost_center_id');

    // Check no empty strings or nulls exist
    for (const [key, val] of Object.entries(payload)) {
      expect(val).not.toBe('');
      expect(val).not.toBeNull();
    }
  });

  it('includes reporting_manager_id when provided as valid UUID', () => {
    const withManager = {
      firstName: 'Vikram',
      lastName: 'Aditya',
      personalEmail: 'vikram@gmail.com',
      phone: '9876543210',
      department: 'AI01',
      designation: 'Software Engineer',
      joiningDate: '2026-01-10',
      reportingManagerId: '123e4567-e89b-12d3-a456-426614174000',
    };

    const payload = toEmployeePayload(withManager);

    expect(payload.reporting_manager_id).toBe('123e4567-e89b-12d3-a456-426614174000');
  });

  it('normalizes role to lowercase and sets default to "employee"', () => {
    expect(toEmployeePayload({ firstName: 'A', lastName: 'B', personalEmail: 'a@b.com', phone: '1234567890', department: 'D', designation: 'T', joiningDate: '2026-01-01', role: 'SUPER_ADMIN' }).role).toBe('super_admin');
    expect(toEmployeePayload({ firstName: 'A', lastName: 'B', personalEmail: 'a@b.com', phone: '1234567890', department: 'D', designation: 'T', joiningDate: '2026-01-01', role: 'MANAGER' }).role).toBe('manager');
    expect(toEmployeePayload({ firstName: 'A', lastName: 'B', personalEmail: 'a@b.com', phone: '1234567890', department: 'D', designation: 'T', joiningDate: '2026-01-01', role: 'IT_ADMIN' }).role).toBe('it_admin');
    expect(toEmployeePayload({ firstName: 'A', lastName: 'B', personalEmail: 'a@b.com', phone: '1234567890', department: 'D', designation: 'T', joiningDate: '2026-01-01' }).role).toBe('employee');
  });
});

describe('Client-Side Schema Validation (createEmployeeSchema)', () => {
  it('validates required fields successfully', () => {
    const valid = {
      firstName: 'Neha',
      lastName: 'Sharma',
      personalEmail: 'neha.sharma@example.com',
      phone: '9876543210', // 10 chars
      departmentId: 'dept_ai01',
      designationId: 'desg_sde',
      joiningDate: '2026-06-01',
    };

    const result = createEmployeeSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it('rejects phone numbers shorter than 10 or longer than 15 characters', () => {
    const shortPhone = {
      firstName: 'Neha',
      lastName: 'Sharma',
      personalEmail: 'neha@example.com',
      phone: '123456789', // 9 chars -> invalid!
      departmentId: 'dept_ai01',
      designationId: 'desg_sde',
      joiningDate: '2026-06-01',
    };
    expect(createEmployeeSchema.safeParse(shortPhone).success).toBe(false);

    const longPhone = {
      ...shortPhone,
      phone: '1234567890123456', // 16 chars -> invalid!
    };
    expect(createEmployeeSchema.safeParse(longPhone).success).toBe(false);

    const validPhone = {
      ...shortPhone,
      phone: '+919876543210', // 13 chars -> valid!
    };
    expect(createEmployeeSchema.safeParse(validPhone).success).toBe(true);
  });

  it('rejects invalid personal email', () => {
    const invalidEmail = {
      firstName: 'Neha',
      lastName: 'Sharma',
      personalEmail: 'not-an-email',
      phone: '9876543210',
      departmentId: 'dept_ai01',
      designationId: 'desg_sde',
      joiningDate: '2026-06-01',
    };
    expect(createEmployeeSchema.safeParse(invalidEmail).success).toBe(false);
  });
});

describe('Error Handling (parseEmployeeApiError)', () => {
  it('maps 422 FastAPI validation errors to individual field errors', () => {
    const fastapi422 = {
      status: 422,
      data: {
        detail: [
          {
            loc: ['body', 'personal_email'],
            msg: 'value is not a valid email address',
          },
          {
            loc: ['body', 'phone'],
            msg: 'ensure this value has at least 10 characters',
          },
          {
            loc: ['body', 'department'],
            msg: 'field required',
          },
        ],
      },
    };

    const parsed = parseEmployeeApiError(fastapi422);
    expect(parsed.fieldErrors.personalEmail).toBe('value is not a valid email address');
    expect(parsed.fieldErrors.phone).toBe('ensure this value has at least 10 characters');
    expect(parsed.fieldErrors.departmentId).toBe('field required');
  });

  it('maps 409 duplicate email/employee error', () => {
    const error409 = {
      status: 409,
      data: {
        detail: 'An employee with this email already exists',
      },
    };

    const parsed = parseEmployeeApiError(error409);
    expect(parsed.generalMessage).toContain('already exists');
    expect(parsed.fieldErrors.personalEmail).toBeDefined();
  });

  it('maps 403 permission denied error for non-admins', () => {
    const error403 = {
      status: 403,
      data: {
        detail: 'Forbidden: Insufficient privileges',
      },
    };

    const parsed = parseEmployeeApiError(error403);
    expect(parsed.generalMessage).toBe('Only Super Admin and HR Admin can manage workforce personnel');
  });

  it('maps 400 bad request error with message', () => {
    const error400 = {
      status: 400,
      data: {
        message: 'Invalid reporting manager UUID provided',
      },
    };

    const parsed = parseEmployeeApiError(error400);
    expect(parsed.generalMessage).toBe('Invalid reporting manager UUID provided');
  });
});

describe('Response Normalization and Employee List Verification', () => {
  it('normalizes backend employee response storing department and designation as strings', () => {
    const backendSavedEmployee = {
      id: 'emp_backend_uuid_777',
      employee_id: 'EMP-777',
      first_name: 'Aarav',
      last_name: 'Gupta',
      personal_email: 'aarav.gupta@gmail.com',
      company_email: 'aarav@company.com',
      phone: '+919876543210',
      department: 'AI01', // string from backend
      designation: 'Senior Software Engineer', // string from backend
      joining_date: '2026-02-01',
      status: 'ACTIVE',
      role: 'employee',
      work_location: 'Jaipur HQ',
    };

    const normalized = normalizeEmployee(backendSavedEmployee);

    expect(normalized.id).toBe('emp_backend_uuid_777');
    expect(normalized.employeeCode).toBe('EMP-777');
    expect(normalized.firstName).toBe('Aarav');
    expect(normalized.lastName).toBe('Gupta');
    expect(normalized.fullName).toBe('Aarav Gupta');
    expect(normalized.email).toBe('aarav@company.com');
    expect(normalized.personalEmail).toBe('aarav.gupta@gmail.com');

    // CRITICAL: Verify department shows "AI01"
    expect(normalized.departmentName).toBe('AI01');
    expect(normalized.department.name).toBe('AI01');

    // CRITICAL: Verify designation shows "Senior Software Engineer"
    expect(normalized.designationTitle).toBe('Senior Software Engineer');
    expect(normalized.designation.title).toBe('Senior Software Engineer');

    expect(normalized.joiningDate).toBe('2026-02-01');
    expect(normalized.status).toBe('ACTIVE');
    expect(normalized.workLocation).toBe('Jaipur HQ');
  });
});

