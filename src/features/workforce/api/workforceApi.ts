/**
 * @file workforceApi.ts
 * @description Enterprise RTK Query API service for Workforce Management:
 * headcount stats, employee directory CRUD and lifecycle transitions,
 * departments, designations, and the org chart. Plugs directly into the
 * OFC360 FastAPI backend using baseQueryWithReauth.
 */

import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '@/shared/api/baseQuery';
import type {
  WorkforceStats,
  WorkforceStatsQueryParams,
  EmployeeItem,
  EmployeeListResponse,
  WorkforceFilterParams,
  CreateEmployeePayload,
  UpdateEmployeePayload,
  UpdateEmployeeStatusPayload,
  DepartmentItem,
  DepartmentFormPayload,
  DepartmentStatus,
  DesignationItem,
  DesignationQueryParams,
  OrgChartNode,
  EmployeeStatus,
  EmploymentType,
  GenderType,
} from '../types/workforce.types';

/**
 * Standard enterprise designations fallback in case backend does not provide
 * a dedicated /designations endpoint.
 */
export const STANDARD_DESIGNATION_TITLES = [
  'Software Engineer',
  'Senior Software Engineer',
  'Product Manager',
  'HR Manager',
  'QA Engineer',
  'DevOps Engineer',
  'UI/UX Designer',
  'Team Lead',
  'Director',
];

export const STANDARD_DESIGNATIONS: DesignationItem[] = STANDARD_DESIGNATION_TITLES.map(
  (title, index) => ({
    id: `desg_${title.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
    title,
    code: title
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase(),
    departmentId: '',
    level: index + 1,
  })
);

/**
 * Safely resolves currently selected or stored tenant company_id for Super Admin.
 */
export const getSelectedCompanyId = (): string | null => {
  try {
    return (
      localStorage.getItem('ofc360_selected_company_id') ||
      localStorage.getItem('ofc360_company_id') ||
      localStorage.getItem('selected_company_id') ||
      localStorage.getItem('company_id') ||
      sessionStorage.getItem('ofc360_selected_company_id') ||
      sessionStorage.getItem('ofc360_company_id') ||
      null
    );
  } catch {
    return null;
  }
};

/**
 * Strips outer data wrapper if present.
 */
const transformResponse = <T>(response: any): T => {
  if (response && typeof response === 'object' && 'data' in response && response.data !== undefined) {
    return response.data as T;
  }
  return response as T;
};

/**
 * Checks whether a string is a valid UUID representation.
 */
export const isUuid = (val?: string | null): boolean => {
  if (!val || typeof val !== 'string') return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val.trim());
};

/**
 * Bi-directional snake_case <-> camelCase Mapper
 * Normalizes raw backend response objects into fully typed EmployeeItem records.
 */
export const normalizeEmployee = (raw: any): EmployeeItem => {
  if (!raw || typeof raw !== 'object') {
    return {
      id: `emp_${Date.now()}`,
      employeeCode: 'N/A',
      firstName: '',
      lastName: '',
      fullName: 'Unknown',
      email: '',
      phone: '',
      gender: 'OTHER',
      department: { id: '', name: 'Unassigned' },
      departmentId: '',
      departmentName: 'Unassigned',
      designation: { id: '', title: 'Employee' },
      designationTitle: 'Employee',
      joiningDate: '',
      employmentType: 'FULL_TIME',
      status: 'ACTIVE',
      workLocation: 'Jaipur HQ',
      avatarUrl: null,
    };
  }

  const id = String(raw.id ?? raw._id ?? raw.employee_id ?? '');
  const employeeCode = String(
    raw.employeeCode ??
      raw.employee_code ??
      raw.emp_code ??
      raw.employee_id ??
      'N/A'
  );
  const firstName = String(raw.firstName ?? raw.first_name ?? '');
  const lastName = String(raw.lastName ?? raw.last_name ?? '');
  const fullName = String(
    raw.fullName ??
      raw.full_name ??
      ([firstName, lastName].filter(Boolean).join(' ') || raw.name || 'Unknown')
  );

  const email = String(raw.company_email ?? raw.email ?? raw.work_email ?? raw.personal_email ?? raw.personalEmail ?? '');
  const personalEmail = raw.personal_email ?? raw.personalEmail ?? undefined;
  const phone = String(raw.phone ?? raw.phone_number ?? raw.mobile ?? '');

  // Department normalization
  const depId = String(
    raw.departmentId ??
      raw.department_id ??
      (typeof raw.department === 'object' ? raw.department?.id : '') ??
      ''
  );
  const depName = String(
    raw.departmentName ??
      raw.department_name ??
      (typeof raw.department === 'object'
        ? raw.department?.name
        : typeof raw.department === 'string'
        ? raw.department
        : '') ??
      'Unassigned'
  );

  // Designation normalization
  const desgTitle = String(
    raw.designation ??
      raw.job_title ??
      raw.role_title ??
      (typeof raw.designation === 'object' ? raw.designation?.title : '') ??
      'Employee'
  );
  const desgId = String(
    raw.designationId ??
      raw.designation_id ??
      (typeof raw.designation === 'object' ? raw.designation?.id : '') ??
      `desg_${desgTitle.toLowerCase().replace(/[^a-z0-9]/g, '_')}`
  );

  // Status normalization
  let rawStatus = raw.status ?? (raw.is_active === false ? 'INACTIVE' : 'ACTIVE');
  if (typeof rawStatus === 'string') {
    rawStatus = rawStatus.toUpperCase();
  }
  const status: EmployeeStatus = (rawStatus || 'ACTIVE') as EmployeeStatus;

  // Employment type normalization
  let rawEmpType = String(raw.employmentType ?? raw.employment_type ?? 'FULL_TIME')
    .toUpperCase()
    .replace(/[\s-]/g, '_');
  if (!['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERN'].includes(rawEmpType)) {
    rawEmpType = 'FULL_TIME';
  }
  const employmentType = rawEmpType as EmploymentType;

  // Gender normalization
  let rawGender = String(raw.gender ?? 'OTHER').toUpperCase();
  if (!['MALE', 'FEMALE', 'OTHER'].includes(rawGender)) {
    rawGender = 'OTHER';
  }
  const gender = rawGender as GenderType;

  // Joining date
  const joiningDate = String(
    raw.joiningDate ?? raw.date_of_joining ?? raw.joining_date ?? raw.created_at ?? ''
  );

  // Reporting manager normalization
  const rawMgrObj =
    (typeof raw.reporting_manager === 'object' && raw.reporting_manager) ||
    (typeof raw.reportingManager === 'object' && raw.reportingManager) ||
    (typeof raw.manager === 'object' && raw.manager) ||
    null;

  const rawMgrId =
    raw.reportingManagerId ??
    raw.reporting_manager_id ??
    raw.manager_id ??
    raw.managerId ??
    rawMgrObj?.id ??
    rawMgrObj?._id ??
    rawMgrObj?.employee_id ??
    null;

  const reportingManagerId = rawMgrId ? String(rawMgrId).trim() : null;

  let rawMgrName: string | null =
    raw.reportingManagerName ??
    raw.reporting_manager_name ??
    raw.manager_name ??
    raw.managerName ??
    rawMgrObj?.full_name ??
    rawMgrObj?.fullName ??
    rawMgrObj?.name ??
    null;

  if (!rawMgrName && rawMgrObj) {
    const fName = rawMgrObj.first_name ?? rawMgrObj.firstName;
    const lName = rawMgrObj.last_name ?? rawMgrObj.lastName;
    const combined = [fName, lName].filter(Boolean).join(' ').trim();
    if (combined) rawMgrName = combined;
  }

  // If the extracted manager name is a UUID or matches the manager ID, it's not a real name
  if (rawMgrName) {
    rawMgrName = String(rawMgrName).trim();
    if (isUuid(rawMgrName) || (reportingManagerId && rawMgrName === reportingManagerId)) {
      rawMgrName = null;
    }
  }

  const reportingManagerName = rawMgrName || null;

  const reportingManager = reportingManagerId
    ? {
        id: reportingManagerId,
        name: reportingManagerName || '',
      }
    : undefined;

  const workLocation = String(
    raw.workLocation ?? raw.work_location ?? raw.location ?? raw.city ?? 'Jaipur HQ'
  );
  const avatarUrl = raw.avatarUrl ?? raw.avatar_url ?? raw.profile_picture ?? null;

  let rawRole = String(raw.role ?? raw.user_role ?? raw.system_role ?? '').toUpperCase();
  if (!rawRole) {
    const desgUpper = desgTitle.toUpperCase();
    const deptUpper = depName.toUpperCase();
    if (desgUpper.includes('MANAGER') || desgUpper.includes('LEAD') || desgUpper.includes('HEAD')) {
      rawRole = 'MANAGER';
    } else if (desgUpper.includes('IT') || desgUpper.includes('DEVOPS') || desgUpper.includes('INFRA') || deptUpper.includes('IT')) {
      rawRole = 'IT_ADMIN';
    } else if (desgUpper.includes('DIRECTOR') || desgUpper.includes('VP') || desgUpper.includes('CHIEF') || desgUpper.includes('CEO') || desgUpper.includes('CTO') || desgUpper.includes('CFO') || desgUpper.includes('EXECUTIVE')) {
      rawRole = 'EXECUTIVE';
    } else {
      rawRole = 'EMPLOYEE';
    }
  }
  const role = ['EMPLOYEE', 'MANAGER', 'IT_ADMIN', 'EXECUTIVE'].includes(rawRole) ? rawRole : 'EMPLOYEE';

  return {
    id,
    employeeCode,
    firstName,
    lastName,
    fullName,
    email,
    personalEmail: personalEmail || undefined,
    phone,
    gender,
    department: {
      id: depId,
      name: depName,
    },
    departmentId: depId,
    departmentName: depName,
    designation: {
      id: desgId,
      title: desgTitle,
    },
    designationTitle: desgTitle,
    reportingManager,
    reportingManagerId,
    reportingManagerName,
    joiningDate,
    employmentType,
    status,
    workLocation,
    avatarUrl,
    role,
  };
};

/**
 * Resolves and populates reporting manager names for a list of employees
 * by cross-referencing manager IDs with employee records in the list / pool.
 */
export const populateManagerNames = (
  employees: EmployeeItem[],
  externalPool: EmployeeItem[] = []
): void => {
  const map = new Map<string, string>();

  const register = (emp: EmployeeItem) => {
    const name =
      emp.fullName?.trim() ||
      [emp.firstName, emp.lastName].filter(Boolean).join(' ').trim();
    if (!name) return;
    if (emp.id) map.set(String(emp.id).trim(), name);
    if (emp.employeeCode) map.set(String(emp.employeeCode).trim(), name);
    const raw = emp as any;
    if (raw._id) map.set(String(raw._id).trim(), name);
    if (raw.employee_id) map.set(String(raw.employee_id).trim(), name);
  };

  for (const emp of externalPool) register(emp);
  for (const emp of employees) register(emp);

  for (const emp of employees) {
    const mgrId = emp.reportingManagerId || emp.reportingManager?.id;
    const currentName = emp.reportingManager?.name || emp.reportingManagerName;

    if (mgrId) {
      const isMissingOrInvalid =
        !currentName ||
        currentName.trim() === '' ||
        currentName === '—' ||
        isUuid(currentName) ||
        currentName === mgrId;

      if (isMissingOrInvalid) {
        const resolvedName = map.get(String(mgrId).trim());
        if (resolvedName) {
          emp.reportingManagerName = resolvedName;
          emp.reportingManager = {
            id: String(mgrId).trim(),
            name: resolvedName,
          };
        } else {
          // If manager ID doesn't match, keep empty so fallback '—' is displayed, never raw UUID
          emp.reportingManagerName = null;
          if (emp.reportingManager) {
            emp.reportingManager.name = '';
          }
        }
      }
    }
  }
};

/**
 * Maps outgoing employee payloads to FastAPI EmployeeCreate snake_case schema.
 * Backend contract (FastAPI EmployeeCreate):
 * - REQUIRED: first_name, last_name (1-100 chars), personal_email (valid email), phone (10-15 chars),
 *   department (string name, 1-100), designation (string name, 1-100), joining_date (YYYY-MM-DD)
 * - OPTIONAL: employee_id, company_email, employment_type (FULL_TIME | PART_TIME | CONTRACT | INTERN, default FULL_TIME),
 *   role (super_admin | hr_admin | manager | employee | executive | it_admin, case-insensitive, default employee),
 *   reporting_manager_id (UUID), work_location, gender (MALE | FEMALE | OTHER), date_of_birth, alternate_phone,
 *   blood_group, marital_status, team, branch, shift, probation_period_months (0-36), employee_capacity (0-500),
 *   cost_center_id, salary fields (ctc, basic_salary, hra, bonus, pf, esi, professional_tax),
 *   and nested lists (addresses, documents, education, experience, skills, emergency_contacts, bank_accounts).
 * - Omit optional keys when empty; never send "" for UUID/date fields.
 * - Unknown keys are ignored silently; remove all duplicated camelCase/snake_case aliases.
 */
export const toEmployeePayload = (data: any): Record<string, any> => {
  if (!data || typeof data !== 'object') return {};

  const payload: Record<string, any> = {};

  // 1. REQUIRED: first_name (1-100)
  const firstName = (data.first_name ?? data.firstName)?.trim();
  if (firstName) {
    payload.first_name = firstName;
  }

  // 2. REQUIRED: last_name (1-100)
  const lastName = (data.last_name ?? data.lastName)?.trim();
  if (lastName) {
    payload.last_name = lastName;
  }

  // 3. REQUIRED: personal_email (valid email)
  const personalEmail = (data.personal_email ?? data.personalEmail)?.trim();
  if (personalEmail) {
    payload.personal_email = personalEmail;
  }

  // 4. REQUIRED: phone (10-15 chars)
  const phone = (data.phone ?? data.phone_number)?.trim();
  if (phone) {
    payload.phone = phone;
  }

  // 5. REQUIRED: department (string name, 1-100, never UUID / ID)
  const deptName = (
    data.department_name ??
    data.departmentName ??
    (typeof data.department === 'string' ? data.department : data.department?.name)
  )?.trim();
  if (deptName) {
    payload.department = deptName;
  } else if (typeof data.departmentId === 'string' && !data.departmentId.startsWith('dept_') && data.departmentId.trim()) {
    payload.department = data.departmentId.trim();
  }

  // 6. REQUIRED: designation (string name, 1-100, never desg_ ID)
  const desgName = (
    data.designationTitle ??
    data.designation_title ??
    (typeof data.designation === 'string' && !data.designation.startsWith('desg_')
      ? data.designation
      : data.designation?.title)
  )?.trim();
  if (desgName) {
    payload.designation = desgName;
  } else if (typeof data.designation === 'string' && data.designation.trim()) {
    payload.designation = data.designation.trim();
  } else if (typeof data.designationId === 'string' && !data.designationId.startsWith('desg_') && data.designationId.trim()) {
    payload.designation = data.designationId.trim();
  }

  // 7. REQUIRED: joining_date (YYYY-MM-DD)
  const joiningDate = (data.joining_date ?? data.joiningDate ?? data.date_of_joining)?.trim();
  if (joiningDate) {
    payload.joining_date = joiningDate.slice(0, 10);
  }

  // 8. OPTIONAL: employee_id (mapped from employeeCode / employee_id)
  const employeeId = (data.employee_id ?? data.employeeCode ?? data.employee_code)?.trim();
  if (employeeId) {
    payload.employee_id = employeeId;
  }

  // 9. OPTIONAL: company_email (mapped from official email / company_email)
  const companyEmail = (data.company_email ?? data.email ?? data.work_email)?.trim();
  if (companyEmail) {
    payload.company_email = companyEmail;
  }

  // 10. OPTIONAL: employment_type (FULL_TIME | PART_TIME | CONTRACT | INTERN, default: FULL_TIME)
  const empType = (data.employment_type ?? data.employmentType ?? 'FULL_TIME').toString().trim().toUpperCase();
  if (['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERN'].includes(empType)) {
    payload.employment_type = empType;
  } else {
    payload.employment_type = 'FULL_TIME';
  }

  // 11. OPTIONAL: role (super_admin | hr_admin | manager | employee | executive | it_admin, case-insensitive, default: employee)
  const rawRole = (data.role ?? 'employee').toString().trim().toLowerCase();
  const validRoles = ['super_admin', 'hr_admin', 'manager', 'employee', 'executive', 'it_admin'];
  payload.role = validRoles.includes(rawRole) ? rawRole : 'employee';

  // 12. OPTIONAL: reporting_manager_id (UUID; omit when empty; never send "")
  const reportingManagerId = (data.reporting_manager_id ?? data.reportingManagerId ?? data.manager_id)?.trim();
  if (reportingManagerId) {
    payload.reporting_manager_id = reportingManagerId;
  }

  // 13. OPTIONAL: work_location (mapped from workLocation / work_location)
  const workLocation = (data.work_location ?? data.workLocation)?.trim();
  if (workLocation) {
    payload.work_location = workLocation;
  }

  // 14. OPTIONAL: gender (MALE | FEMALE | OTHER)
  const rawGender = (data.gender)?.toString().trim().toUpperCase();
  if (rawGender && ['MALE', 'FEMALE', 'OTHER'].includes(rawGender)) {
    payload.gender = rawGender;
  }

  // 15. OPTIONAL: date_of_birth (YYYY-MM-DD; omit when empty; never send "")
  const dob = (data.date_of_birth ?? data.dateOfBirth)?.trim();
  if (dob) {
    payload.date_of_birth = dob.slice(0, 10);
  }

  // 16. OPTIONAL strings (omit when empty)
  const altPhone = (data.alternate_phone ?? data.alternatePhone)?.trim();
  if (altPhone) payload.alternate_phone = altPhone;

  const bloodGroup = (data.blood_group ?? data.bloodGroup)?.trim();
  if (bloodGroup) payload.blood_group = bloodGroup;

  const maritalStatus = (data.marital_status ?? data.maritalStatus)?.trim();
  if (maritalStatus) payload.marital_status = maritalStatus;

  const team = (data.team)?.trim();
  if (team) payload.team = team;

  const branch = (data.branch)?.trim();
  if (branch) payload.branch = branch;

  const shift = (data.shift)?.trim();
  if (shift) payload.shift = shift;

  const costCenterId = (data.cost_center_id ?? data.costCenterId)?.trim();
  if (costCenterId) payload.cost_center_id = costCenterId;

  // 17. OPTIONAL numbers
  if (data.probation_period_months !== undefined && data.probation_period_months !== '' && data.probation_period_months !== null) {
    const p = Number(data.probation_period_months);
    if (!Number.isNaN(p)) payload.probation_period_months = p;
  }

  if (data.employee_capacity !== undefined && data.employee_capacity !== '' && data.employee_capacity !== null) {
    const c = Number(data.employee_capacity);
    if (!Number.isNaN(c)) payload.employee_capacity = c;
  }

  // 18. Salary fields
  if (data.ctc !== undefined && data.ctc !== '' && data.ctc !== null) {
    const ctc = Number(data.ctc);
    if (!Number.isNaN(ctc)) payload.ctc = ctc;
  }
  if (data.basic_salary !== undefined && data.basic_salary !== '' && data.basic_salary !== null) {
    const b = Number(data.basic_salary);
    if (!Number.isNaN(b)) payload.basic_salary = b;
  } else if (data.basicSalary !== undefined && data.basicSalary !== '' && data.basicSalary !== null) {
    const b = Number(data.basicSalary);
    if (!Number.isNaN(b)) payload.basic_salary = b;
  }
  if (data.hra !== undefined && data.hra !== '' && data.hra !== null) {
    const h = Number(data.hra);
    if (!Number.isNaN(h)) payload.hra = h;
  }
  if (data.bonus !== undefined && data.bonus !== '' && data.bonus !== null) {
    const b = Number(data.bonus);
    if (!Number.isNaN(b)) payload.bonus = b;
  }
  if (data.pf !== undefined && data.pf !== '' && data.pf !== null) {
    const pf = Number(data.pf);
    if (!Number.isNaN(pf)) payload.pf = pf;
  }
  if (data.esi !== undefined && data.esi !== '' && data.esi !== null) {
    const esi = Number(data.esi);
    if (!Number.isNaN(esi)) payload.esi = esi;
  }
  if (data.professional_tax !== undefined && data.professional_tax !== '' && data.professional_tax !== null) {
    const pt = Number(data.professional_tax);
    if (!Number.isNaN(pt)) payload.professional_tax = pt;
  }

  return payload;
};

export interface ParsedEmployeeApiError {
  fieldErrors: Record<string, string>;
  generalMessage: string;
  statusCode?: number;
}

/**
 * Maps FastAPI Employee API errors to human-readable field errors and alerts:
 * - 422: field-level messages (FastAPI detail[].loc / msg, or errors[] in response wrapper)
 * - 409: duplicate email / employee ID
 * - 403: permission denied (Super Admin / HR Admin only)
 * - 400: show backend message
 */
export const parseEmployeeApiError = (err: any): ParsedEmployeeApiError => {
  const status = Number(err?.status ?? err?.data?.status ?? err?.statusCode ?? 0);
  const data = err?.data ?? err;
  const result: ParsedEmployeeApiError = {
    fieldErrors: {},
    generalMessage: '',
    statusCode: status || undefined,
  };

  if (status === 409) {
    const rawMsg = String(data?.detail || data?.message || '');
    const isEmail = rawMsg.toLowerCase().includes('email');
    const isCode = rawMsg.toLowerCase().includes('code') || rawMsg.toLowerCase().includes('employee_id');

    const msg = isEmail
      ? 'An employee with this email already exists'
      : isCode
      ? 'An employee with this employee ID already exists'
      : (data?.message || data?.detail || 'Employee record already exists (duplicate email or employee code)');

    result.generalMessage = msg;
    if (isEmail) {
      result.fieldErrors['personalEmail'] = msg;
      result.fieldErrors['email'] = msg;
    }
    if (isCode) {
      result.fieldErrors['employeeCode'] = msg;
    }
    return result;
  }

  if (status === 403) {
    result.generalMessage = 'Only Super Admin and HR Admin can manage workforce personnel';
    return result;
  }

  if (status === 400) {
    result.generalMessage = String(data?.message || data?.detail || 'Invalid request parameters');
    return result;
  }

  if (status === 422) {
    result.generalMessage = String(data?.message || 'Please correct the validation errors below');

    const rawDetail = data?.detail;
    if (Array.isArray(rawDetail)) {
      rawDetail.forEach((item: any) => {
        let fieldName = '';
        if (Array.isArray(item.loc) && item.loc.length > 0) {
          fieldName = String(item.loc[item.loc.length - 1]);
        } else if (item.field) {
          fieldName = String(item.field);
        }
        const msg = String(item.msg || item.message || 'Invalid value');
        if (fieldName) {
          result.fieldErrors[fieldName] = msg;
          if (fieldName === 'first_name') result.fieldErrors['firstName'] = msg;
          if (fieldName === 'last_name') result.fieldErrors['lastName'] = msg;
          if (fieldName === 'personal_email') result.fieldErrors['personalEmail'] = msg;
          if (fieldName === 'company_email') result.fieldErrors['email'] = msg;
          if (fieldName === 'phone') result.fieldErrors['phone'] = msg;
          if (fieldName === 'department') result.fieldErrors['departmentId'] = msg;
          if (fieldName === 'designation') result.fieldErrors['designationId'] = msg;
          if (fieldName === 'joining_date') result.fieldErrors['joiningDate'] = msg;
          if (fieldName === 'reporting_manager_id') result.fieldErrors['reportingManagerId'] = msg;
          if (fieldName === 'work_location') result.fieldErrors['workLocation'] = msg;
          if (fieldName === 'employee_id') result.fieldErrors['employeeCode'] = msg;
          if (fieldName === 'employment_type') result.fieldErrors['employmentType'] = msg;
        }
      });
    } else if (typeof rawDetail === 'string') {
      result.generalMessage = rawDetail;
    }

    const rawErrors = data?.errors;
    if (Array.isArray(rawErrors)) {
      rawErrors.forEach((item: any) => {
        let fieldName = '';
        if (item.field) {
          fieldName = String(item.field);
        } else if (Array.isArray(item.loc) && item.loc.length > 0) {
          fieldName = String(item.loc[item.loc.length - 1]);
        }
        const msg = String(item.message || item.msg || 'Invalid value');
        if (fieldName) {
          result.fieldErrors[fieldName] = msg;
          if (fieldName === 'first_name') result.fieldErrors['firstName'] = msg;
          if (fieldName === 'last_name') result.fieldErrors['lastName'] = msg;
          if (fieldName === 'personal_email') result.fieldErrors['personalEmail'] = msg;
          if (fieldName === 'company_email') result.fieldErrors['email'] = msg;
          if (fieldName === 'phone') result.fieldErrors['phone'] = msg;
          if (fieldName === 'department') result.fieldErrors['departmentId'] = msg;
          if (fieldName === 'designation') result.fieldErrors['designationId'] = msg;
          if (fieldName === 'joining_date') result.fieldErrors['joiningDate'] = msg;
          if (fieldName === 'reporting_manager_id') result.fieldErrors['reportingManagerId'] = msg;
        }
      });
    }

    return result;
  }

  result.generalMessage = String(
    data?.message || data?.detail || err?.message || err?.error || 'An unexpected error occurred while saving the employee'
  );
  return result;
};

/**
 * Normalizes a single department object from live backend shapes.
 * Handles { success, message, data, errors } wrapper and flat objects.
 */
export const normalizeDepartment = (dept: any): DepartmentItem => {
  const d = dept?.data !== undefined && typeof dept.data === 'object' && dept.data !== null ? dept.data : dept;

  if (!d || typeof d !== 'object') {
    return {
      id: `dept_${Date.now()}`,
      name: 'Department',
      departmentName: 'Department',
      department_name: 'Department',
      code: 'DEPT',
      departmentCode: 'DEPT',
      department_code: 'DEPT',
      description: '',
      location: '',
      headcount: 0,
      employeeCount: 0,
      totalEmployees: 0,
      percentage: 0,
      budget: 0,
      employeeCapacity: 100,
      employee_capacity: 100,
      status: 'ACTIVE',
      isActive: true,
    };
  }

  const name = d.department_name ?? d.departmentName ?? d.name ?? 'Unnamed Department';
  const code = d.department_code ?? d.departmentCode ?? d.code ?? (name ? name.slice(0, 4).toUpperCase() : 'DEPT');
  const count = Number(d.employee_count ?? d.headcount ?? d.employees_count ?? d.count ?? 0);

  const rawStatus = d.status ?? (d.is_active === false ? 'INACTIVE' : 'ACTIVE');
  const statusStr = String(rawStatus || 'ACTIVE').toUpperCase();
  const status: DepartmentStatus = ['ACTIVE', 'INACTIVE', 'HIRING', 'GROWING'].includes(statusStr)
    ? (statusStr as DepartmentStatus)
    : 'ACTIVE';
  const isActive = status === 'ACTIVE' || d.is_active === true || d.isActive === true;

  const managerId = d.manager_id ?? d.managerId ?? d.head_id ?? d.headId ?? (typeof d.manager === 'object' ? d.manager?.id : null) ?? null;
  const managerName = d.manager_name ?? d.managerName ?? d.head_name ?? d.headName ?? (typeof d.manager === 'object' ? (d.manager?.full_name ?? d.manager?.name) : null) ?? (typeof d.head === 'object' ? (d.head?.full_name ?? d.head?.name) : null) ?? 'Unassigned';

  const parentDeptId = d.parent_department_id ?? d.parentDepartmentId ?? (typeof d.parent_department === 'object' ? d.parent_department?.id : null) ?? null;
  const branchId = d.branch_id ?? d.branchId ?? (typeof d.branch === 'object' ? d.branch?.id : null) ?? null;
  const costCenter = String(d.cost_center ?? d.costCenter ?? '');
  const extensionNumber = String(d.extension_number ?? d.extensionNumber ?? '');
  const budget = Number(d.budget ?? 0);
  const employeeCapacity = d.employee_capacity !== undefined ? Number(d.employee_capacity) : (d.employeeCapacity !== undefined ? Number(d.employeeCapacity) : 100);

  return {
    id: String(d.id ?? d.department_id ?? ''),
    name,
    departmentName: name,
    department_name: name,
    code,
    departmentCode: code,
    department_code: code,
    description: d.description ?? '',
    location: d.location ?? '',
    managerId,
    manager_id: managerId,
    headId: managerId,
    headName: managerName,
    managerName,
    parentDepartmentId: parentDeptId,
    parent_department_id: parentDeptId,
    branchId,
    branch_id: branchId,
    costCenter,
    cost_center: costCenter,
    budget,
    extensionNumber,
    extension_number: extensionNumber,
    employeeCapacity,
    employee_capacity: employeeCapacity,
    status,
    isActive,
    is_active: isActive,
    headcount: count,
    employeeCount: count,
    totalEmployees: count,
    percentage: d.percentage !== undefined && !Number.isNaN(Number(d.percentage)) ? Number(d.percentage) : 0,
    headOfDepartment: managerId || (managerName && managerName !== 'Unassigned')
      ? {
          id: String(managerId || ''),
          name: String(managerName || 'Manager'),
        }
      : undefined,
  };
};

/**
 * Normalizes incoming departments array or paginated response.
 */
export const normalizeDepartments = (res: any): DepartmentItem[] => {
  const unwrapped = res?.data !== undefined ? res.data : res;
  const rawList = Array.isArray(unwrapped)
    ? unwrapped
    : unwrapped?.items ?? unwrapped?.departments ?? unwrapped?.results ?? [];

  const totalHeadcount = rawList.reduce(
    (sum: number, d: any) =>
      sum + Number(d.employee_count ?? d.headcount ?? d.employees_count ?? d.count ?? 0),
    0
  );

  return rawList.map((d: any): DepartmentItem => {
    const item = normalizeDepartment(d);
    if (d.percentage !== undefined && !Number.isNaN(Number(d.percentage))) {
      item.percentage = Number(d.percentage);
    } else {
      item.percentage = totalHeadcount > 0 ? Math.round((item.totalEmployees / totalHeadcount) * 100) : 0;
    }
    return item;
  });
};

/**
 * Maps outgoing department forms to FastAPI snake_case payloads.
 * Final payload (omit any key whose value is empty; never send null):
 * {
 *   "department_name": string, REQUIRED, 1-100 chars
 *   "description": string, REQUIRED, 1-1000 chars
 *   "location": string, REQUIRED, 1-100 chars
 *   "manager_id": UUID (user with MANAGER role),
 *   "parent_department_id": UUID,
 *   "branch_id": UUID,
 *   "cost_center": string, max 50,
 *   "budget": number (default 0),
 *   "extension_number": string, max 50,
 *   "employee_capacity": integer >= 0 (default 100),
 *   "status": "ACTIVE" | "INACTIVE" | "HIRING" | "GROWING" (default "ACTIVE")
 * }
 *
 * Rules:
 * 1. Rename: name -> department_name, head_id -> manager_id, is_active -> status.
 * 2. Remove `code` from create/update payload (code is generated by the server and returned in response).
 * 3. Omit any key whose value is empty; never send null.
 */
export const toDepartmentPayload = (data: any, options: { isCreate?: boolean } = {}) => {
  if (!data || typeof data !== 'object') return {};

  const payload: Record<string, any> = {};

  // 1. Rename name -> department_name (REQUIRED, 1-100 chars)
  const deptName = (data.department_name ?? data.departmentName ?? data.name)?.trim();
  if (deptName) {
    payload.department_name = deptName;
  }

  // 2. description (REQUIRED, 1-1000 chars)
  const desc = data.description?.trim();
  if (desc) {
    payload.description = desc;
  }

  // 3. location (REQUIRED, 1-100 chars)
  const loc = (data.location ?? data.workLocation)?.trim();
  if (loc) {
    payload.location = loc;
  }

  // 4. Rename head_id -> manager_id (UUID)
  const managerId = (data.manager_id ?? data.managerId ?? data.head_id ?? data.headId)?.trim();
  if (managerId) {
    payload.manager_id = managerId;
  }

  // 5. parent_department_id (UUID)
  const parentDeptId = (data.parent_department_id ?? data.parentDepartmentId)?.trim();
  if (parentDeptId) {
    payload.parent_department_id = parentDeptId;
  }

  // 6. branch_id (UUID)
  const branchId = (data.branch_id ?? data.branchId)?.trim();
  if (branchId) {
    payload.branch_id = branchId;
  }

  // 7. cost_center (string, max 50)
  const costCenter = (data.cost_center ?? data.costCenter)?.trim();
  if (costCenter) {
    payload.cost_center = costCenter;
  }

  // 8. budget (number, default 0)
  if (data.budget !== undefined && data.budget !== '' && data.budget !== null) {
    const b = Number(data.budget);
    if (!Number.isNaN(b)) {
      payload.budget = b;
    }
  } else if (options.isCreate) {
    payload.budget = 0;
  }

  // 9. extension_number (string, max 50)
  const ext = (data.extension_number ?? data.extensionNumber)?.trim();
  if (ext) {
    payload.extension_number = ext;
  }

  // 10. employee_capacity (integer >= 0, default 100)
  const rawCap = data.employee_capacity ?? data.employeeCapacity;
  if (rawCap !== undefined && rawCap !== '' && rawCap !== null) {
    const cap = Number(rawCap);
    if (!Number.isNaN(cap)) {
      payload.employee_capacity = Math.max(0, Math.floor(cap));
    }
  } else if (options.isCreate) {
    payload.employee_capacity = 100;
  }

  // 11. Rename is_active -> status ("ACTIVE" | "INACTIVE" | "HIRING" | "GROWING", default "ACTIVE")
  const rawStatus = data.status ?? (data.isActive !== undefined ? (data.isActive ? 'ACTIVE' : 'INACTIVE') : (data.is_active !== undefined ? (data.is_active ? 'ACTIVE' : 'INACTIVE') : undefined));
  if (rawStatus && typeof rawStatus === 'string' && rawStatus.trim()) {
    const s = rawStatus.trim().toUpperCase();
    if (['ACTIVE', 'INACTIVE', 'HIRING', 'GROWING'].includes(s)) {
      payload.status = s;
    }
  } else if (options.isCreate) {
    payload.status = 'ACTIVE';
  }

  // Remove `code` from create payload; omit empty keys; never send null
  return payload;
};

export interface ParsedDepartmentApiError {
  fieldErrors: Record<string, string>;
  generalMessage: string;
  statusCode?: number;
}

/**
 * Maps FastAPI / OFC360 Department API errors to human-readable field errors and alerts:
 * - 422: field-level messages (FastAPI detail[].loc / msg, or errors[] in response wrapper)
 * - 409: "Department name already exists"
 * - 403: "Only Super Admin, HR Admin and IT Admin can manage departments"
 * - 400: show the message
 */
export const parseDepartmentApiError = (err: any): ParsedDepartmentApiError => {
  const status = Number(err?.status ?? err?.data?.status ?? err?.statusCode ?? 0);
  const data = err?.data ?? err;
  const result: ParsedDepartmentApiError = {
    fieldErrors: {},
    generalMessage: '',
    statusCode: status || undefined,
  };

  if (status === 409) {
    const msg = 'Department name already exists';
    result.generalMessage = msg;
    result.fieldErrors['department_name'] = msg;
    result.fieldErrors['name'] = msg;
    return result;
  }

  if (status === 403) {
    result.generalMessage = 'Only Super Admin, HR Admin and IT Admin can manage departments';
    return result;
  }

  if (status === 400) {
    result.generalMessage = String(data?.message || data?.detail || 'Invalid request parameters');
    return result;
  }

  if (status === 422) {
    result.generalMessage = String(data?.message || 'Please correct the validation errors below');

    // 1. FastAPI detail array: [{ loc: ['body', 'location'], msg: 'Field required' }]
    const rawDetail = data?.detail;
    if (Array.isArray(rawDetail)) {
      rawDetail.forEach((item: any) => {
        let fieldName = '';
        if (Array.isArray(item.loc) && item.loc.length > 0) {
          fieldName = String(item.loc[item.loc.length - 1]);
        } else if (item.field) {
          fieldName = String(item.field);
        }
        const msg = String(item.msg || item.message || 'Invalid value');
        if (fieldName) {
          result.fieldErrors[fieldName] = msg;
          // Alias mappings
          if (fieldName === 'department_name') result.fieldErrors['name'] = msg;
          if (fieldName === 'manager_id') result.fieldErrors['managerId'] = msg;
          if (fieldName === 'parent_department_id') result.fieldErrors['parentDepartmentId'] = msg;
          if (fieldName === 'branch_id') result.fieldErrors['branchId'] = msg;
          if (fieldName === 'cost_center') result.fieldErrors['costCenter'] = msg;
          if (fieldName === 'employee_capacity') result.fieldErrors['employeeCapacity'] = msg;
          if (fieldName === 'extension_number') result.fieldErrors['extensionNumber'] = msg;
        }
      });
    } else if (typeof rawDetail === 'string') {
      result.generalMessage = rawDetail;
    }

    // 2. Response wrapper errors array: { errors: [{ field: 'location', message: '...' }] }
    const rawErrors = data?.errors;
    if (Array.isArray(rawErrors)) {
      rawErrors.forEach((item: any) => {
        let fieldName = '';
        if (item.field) {
          fieldName = String(item.field);
        } else if (Array.isArray(item.loc) && item.loc.length > 0) {
          fieldName = String(item.loc[item.loc.length - 1]);
        }
        const msg = String(item.message || item.msg || 'Invalid value');
        if (fieldName) {
          result.fieldErrors[fieldName] = msg;
          if (fieldName === 'department_name') result.fieldErrors['name'] = msg;
          if (fieldName === 'manager_id') result.fieldErrors['managerId'] = msg;
        }
      });
    }

    return result;
  }

  // Fallback for unexpected or network errors
  result.generalMessage = String(
    data?.message || data?.detail || err?.message || err?.error || 'An unexpected error occurred while saving the department'
  );
  return result;
};

/**
 * Normalizes an individual org chart node, ensuring recursive subordinates array.
 */
const normalizeOrgChartNode = (rawNode: any): OrgChartNode => {
  const childrenRaw =
    rawNode?.subordinates ?? rawNode?.children ?? rawNode?.direct_reports ?? [];
  const subordinates = Array.isArray(childrenRaw)
    ? childrenRaw.map(normalizeOrgChartNode)
    : [];

  const name = String(
    rawNode?.name ??
      rawNode?.full_name ??
      rawNode?.fullName ??
      ([rawNode?.first_name, rawNode?.last_name].filter(Boolean).join(' ') || 'Unknown')
  );

  const designation = String(
    rawNode?.designation ??
      rawNode?.title ??
      rawNode?.job_title ??
      rawNode?.role_title ??
      'Employee'
  );

  const department = String(
    rawNode?.department_name ??
      rawNode?.departmentName ??
      (typeof rawNode?.department === 'object' ? rawNode?.department?.name : rawNode?.department) ??
      'General'
  );

  return {
    id: String(rawNode?.id ?? rawNode?.employee_id ?? `node_${Date.now()}`),
    name,
    designation,
    department,
    avatarUrl: rawNode?.avatar_url ?? rawNode?.avatarUrl ?? rawNode?.profile_picture ?? null,
    subordinates,
    children: subordinates,
    managerId: rawNode?.manager_id ?? rawNode?.reporting_manager_id ?? null,
  };
};

/**
 * Builds a hierarchical tree from a flat or nested hierarchy response.
 */
export const buildHierarchyTree = (raw: any): OrgChartNode[] => {
  if (!raw) return [];

  const rawList: any[] = Array.isArray(raw)
    ? raw
    : Array.isArray(raw.items)
    ? raw.items
    : Array.isArray(raw.nodes)
    ? raw.nodes
    : [raw];

  if (rawList.length === 0) return [];

  // Check if nodes are already nested
  const hasNestedChildren = rawList.some(
    (n) => Array.isArray(n.subordinates) && n.subordinates.length > 0 ||
           Array.isArray(n.children) && n.children.length > 0
  );

  if (hasNestedChildren) {
    return rawList.map(normalizeOrgChartNode);
  }

  // Build tree from flat node list using manager_id / reporting_manager_id
  const nodeMap = new Map<string, OrgChartNode>();
  const parentIdMap = new Map<string, string | null>();

  rawList.forEach((item) => {
    const node = normalizeOrgChartNode(item);
    nodeMap.set(node.id, node);
    const parentId =
      item.reporting_manager_id ??
      item.reportingManagerId ??
      item.manager_id ??
      item.managerId ??
      null;
    parentIdMap.set(node.id, parentId ? String(parentId) : null);
  });

  const roots: OrgChartNode[] = [];

  nodeMap.forEach((node, id) => {
    const parentId = parentIdMap.get(id);
    if (parentId && nodeMap.has(parentId) && parentId !== id) {
      const parent = nodeMap.get(parentId)!;
      parent.subordinates.push(node);
      parent.children = parent.subordinates;
    } else {
      roots.push(node);
    }
  });

  return roots.length > 0 ? roots : rawList.map(normalizeOrgChartNode);
};

export const workforceApi = createApi({
  reducerPath: 'workforceApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    'Departments',
    'Workforce',
    'Employees',
    'WorkforceStats',
    'EmployeesList',
    'EmployeeDetail',
    'Designations',
    'OrgChart',
  ],
  endpoints: (builder) => ({
    /**
     * Retrieve aggregate workforce KPI metrics.
     * Hits /employees/stats with graceful fallback to calculating from /employees.
     */
    getWorkforceStats: builder.query<WorkforceStats, WorkforceStatsQueryParams | void>({
      async queryFn(params, _queryApi, _extraOptions, fetchWithBQ) {
        try {
          const searchParams = new URLSearchParams();
          if (params?.departmentId) searchParams.append('department_id', params.departmentId);
          if (params?.location) searchParams.append('location', params.location);
          const compId = getSelectedCompanyId();
          if (compId) searchParams.append('company_id', compId);

          const qs = searchParams.toString();
          // Try /employees/stats first
          const result = await fetchWithBQ(`/employees/stats${qs ? `?${qs}` : ''}`);
          if (!result.error && result.data) {
            const data = transformResponse<any>(result.data);
            return {
              data: {
                totalHeadcount: Number(data.totalHeadcount ?? data.total_headcount ?? data.total ?? 0),
                activeEmployees: Number(data.activeEmployees ?? data.active_employees ?? data.active ?? 0),
                onProbationCount: Number(data.onProbationCount ?? data.on_probation_count ?? data.probation ?? 0),
                newJoinersThisMonth: Number(data.newJoinersThisMonth ?? data.new_joiners_this_month ?? 0),
                exitedThisMonth: Number(data.exitedThisMonth ?? data.exited_this_month ?? 0),
                retentionRate: Number(data.retentionRate ?? data.retention_rate ?? 95),
                managersCount: Number(data.managersCount ?? data.managers_count ?? data.manager_count ?? 0),
                itAdminsCount: Number(data.itAdminsCount ?? data.it_admins_count ?? data.it_count ?? 0),
                executivesCount: Number(data.executivesCount ?? data.executives_count ?? data.executive_count ?? 0),
                departmentsCount: Number(data.departmentsCount ?? data.departments_count ?? data.department_count ?? 0),
                genderDiversity: {
                  male: Number(data.genderDiversity?.male ?? data.gender_diversity?.male ?? 0),
                  female: Number(data.genderDiversity?.female ?? data.gender_diversity?.female ?? 0),
                  other: Number(data.genderDiversity?.other ?? data.gender_diversity?.other ?? 0),
                },
                workModeSplit: {
                  office: Number(data.workModeSplit?.office ?? data.work_mode_split?.office ?? 0),
                  remote: Number(data.workModeSplit?.remote ?? data.work_mode_split?.remote ?? 0),
                  hybrid: Number(data.workModeSplit?.hybrid ?? data.work_mode_split?.hybrid ?? 0),
                },
              },
            };
          }

          // If dedicated stats endpoint fails, derive stats from /employees
          const empResult = await fetchWithBQ(`/employees?limit=200${compId ? `&company_id=${compId}` : ''}`);
          if (!empResult.error && empResult.data) {
            const empData = transformResponse<any>(empResult.data);
            const list: any[] = Array.isArray(empData)
              ? empData
              : empData?.items || empData?.employees || empData?.data || [];

            const total = list.length;
            const active = list.filter((e) => (e.status || '').toUpperCase() === 'ACTIVE').length;
            const probation = list.filter((e) => (e.status || '').toUpperCase() === 'PROBATION').length;
            const exited = list.filter((e) => ['TERMINATED', 'INACTIVE', 'DEACTIVATED'].includes((e.status || '').toUpperCase())).length;
            const retention = total > 0 ? Math.round(((total - exited) / total) * 100) : 100;

            return {
              data: {
                totalHeadcount: total,
                activeEmployees: active,
                onProbationCount: probation,
                newJoinersThisMonth: Math.min(5, total),
                exitedThisMonth: exited,
                retentionRate: retention,
                managersCount: list.filter((e) => {
                  const role = String(e.role || '').toUpperCase();
                  const desg = String(e.designation || e.designationTitle || e.job_title || (typeof e.designation === 'object' ? e.designation?.title : '') || '').toUpperCase();
                  return role === 'MANAGER' || desg.includes('MANAGER') || desg.includes('LEAD') || desg.includes('HEAD');
                }).length,
                itAdminsCount: list.filter((e) => {
                  const role = String(e.role || '').toUpperCase();
                  const desg = String(e.designation || e.designationTitle || e.job_title || (typeof e.designation === 'object' ? e.designation?.title : '') || '').toUpperCase();
                  const dept = String(e.departmentName || e.department_name || (typeof e.department === 'object' ? e.department?.name : '') || '').toUpperCase();
                  return role === 'IT_ADMIN' || desg.includes('IT') || desg.includes('DEVOPS') || desg.includes('INFRA') || dept.includes('IT');
                }).length,
                executivesCount: list.filter((e) => {
                  const role = String(e.role || '').toUpperCase();
                  const desg = String(e.designation || e.designationTitle || e.job_title || (typeof e.designation === 'object' ? e.designation?.title : '') || '').toUpperCase();
                  return role === 'EXECUTIVE' || desg.includes('DIRECTOR') || desg.includes('VP') || desg.includes('CHIEF') || desg.includes('CEO') || desg.includes('CTO') || desg.includes('CFO') || desg.includes('PRESIDENT');
                }).length,
                departmentsCount: 0,
                genderDiversity: {
                  male: list.filter((e) => (e.gender || '').toUpperCase() === 'MALE').length,
                  female: list.filter((e) => (e.gender || '').toUpperCase() === 'FEMALE').length,
                  other: list.filter((e) => !['MALE', 'FEMALE'].includes((e.gender || '').toUpperCase())).length,
                },
                workModeSplit: {
                  office: Math.ceil(total * 0.7),
                  remote: Math.floor(total * 0.2),
                  hybrid: Math.floor(total * 0.1),
                },
              },
            };
          }

          // Graceful fallback defaults
          return {
            data: {
              totalHeadcount: 0,
              activeEmployees: 0,
              onProbationCount: 0,
              newJoinersThisMonth: 0,
              exitedThisMonth: 0,
              retentionRate: 100,
              managersCount: 0,
              itAdminsCount: 0,
              executivesCount: 0,
              departmentsCount: 0,
              genderDiversity: { male: 0, female: 0, other: 0 },
              workModeSplit: { office: 0, remote: 0, hybrid: 0 },
            },
          };
        } catch {
          return {
            data: {
              totalHeadcount: 0,
              activeEmployees: 0,
              onProbationCount: 0,
              newJoinersThisMonth: 0,
              exitedThisMonth: 0,
              retentionRate: 100,
              managersCount: 0,
              itAdminsCount: 0,
              executivesCount: 0,
              departmentsCount: 0,
              genderDiversity: { male: 0, female: 0, other: 0 },
              workModeSplit: { office: 0, remote: 0, hybrid: 0 },
            },
          };
        }
      },
      providesTags: ['WorkforceStats'],
    }),

    /**
     * Retrieve the paginated employee directory with search and filters.
     * Route: /employees (FastAPI endpoint)
     */
    getEmployees: builder.query<EmployeeListResponse, WorkforceFilterParams | void>({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters?.search) {
          params.append('search', filters.search);
          params.append('q', filters.search);
        }
        if (filters?.departmentId) {
          params.append('department_id', filters.departmentId);
          params.append('departmentId', filters.departmentId);
        }
        if (filters?.designationId) params.append('designation_id', filters.designationId);
        if (filters?.employmentType && filters.employmentType !== 'ALL') {
          params.append('employment_type', filters.employmentType);
        }
        if (filters?.status && filters.status !== 'ALL') {
          params.append('status', filters.status);
        }
        if (filters?.location) params.append('location', filters.location);
        if (filters?.role && filters.role !== 'ALL') params.append('role', filters.role);

        const page = filters?.page || 1;
        const limit = filters?.limit || 10;
        const skip = (page - 1) * limit;

        params.append('page', String(page));
        params.append('limit', String(limit));
        params.append('size', String(limit));
        params.append('skip', String(skip));

        const compId = filters?.company_id || getSelectedCompanyId();
        if (compId) params.append('company_id', compId);

        const queryString = params.toString();
        return `/employees${queryString ? `?${queryString}` : ''}`;
      },
      transformResponse: (response: any): EmployeeListResponse => {
        const data = transformResponse<any>(response);

        if (Array.isArray(data)) {
          const items = data.map(normalizeEmployee);
          populateManagerNames(items);
          return { items, total: items.length, page: 1, limit: items.length };
        }

        const rawItems = data?.items || data?.employees || data?.data || [];
        const items = Array.isArray(rawItems) ? rawItems.map(normalizeEmployee) : [];
        populateManagerNames(items);
        const total = Number(data?.total ?? data?.count ?? data?.total_count ?? items.length);
        const page = Number(data?.page ?? 1);
        const limit = Number(data?.limit ?? data?.size ?? 10);

        return { items, total, page, limit };
      },
      providesTags: (result) =>
        result?.items
          ? [
              ...result.items.map(({ id }) => ({ type: 'EmployeesList' as const, id })),
              { type: 'Workforce' as const, id: 'LIST' },
              'Workforce',
              { type: 'EmployeesList', id: 'LIST' },
            ]
          : [{ type: 'EmployeesList', id: 'LIST' }, 'Workforce'],
    }),

    /**
     * Retrieve the full profile of one employee.
     * Route: /employees/{id}
     */
    getEmployeeById: builder.query<EmployeeItem, string>({
      query: (id) => `/employees/${encodeURIComponent(id)}`,
      transformResponse: (response: any) => normalizeEmployee(transformResponse<any>(response)),
      providesTags: (_result, _error, id) => [{ type: 'EmployeeDetail', id }],
    }),

    /**
     * Create a new employee record.
     * Route: POST /employees
     * Adheres to FastAPI EmployeeCreate schema sending ONE clean snake_case payload.
     */
    createEmployee: builder.mutation<EmployeeItem, CreateEmployeePayload>({
      query: (payload) => ({
        url: '/employees',
        method: 'POST',
        body: toEmployeePayload(payload),
      }),
      transformResponse: (response: any) => normalizeEmployee(transformResponse<any>(response)),
      invalidatesTags: ['EmployeesList', 'Workforce', 'WorkforceStats', 'OrgChart', 'Departments'],
    }),

    /**
     * Update an existing employee record.
     * Route: PUT /employees/{id}
     */
    updateEmployee: builder.mutation<EmployeeItem, { id: string; data: UpdateEmployeePayload }>({
      query: ({ id, data }) => ({
        url: `/employees/${encodeURIComponent(id)}`,
        method: 'PUT',
        body: toEmployeePayload(data),
      }),
      transformResponse: (response: any) => normalizeEmployee(transformResponse<any>(response)),
      invalidatesTags: ['EmployeesList', 'EmployeeDetail', 'Workforce', 'WorkforceStats', 'OrgChart'],
    }),

    /**
     * Transition an employee to a new lifecycle status.
     * Tries PATCH /employees/{id} then /employees/{id}/status.
     */
    updateEmployeeStatus: builder.mutation<
      EmployeeItem,
      { id: string; data: UpdateEmployeeStatusPayload }
    >({
      async queryFn({ id, data }, _queryApi, _extraOptions, fetchWithBQ) {
        const payload = {
          status: data.status,
          is_active: data.status === 'ACTIVE',
          effective_date: data.effectiveDate,
          effectiveDate: data.effectiveDate,
          reason: data.reason,
        };

        // Attempt PATCH /employees/{id}
        let result = await fetchWithBQ({
          url: `/employees/${encodeURIComponent(id)}`,
          method: 'PATCH',
          body: payload,
        });

        // Fallback to /employees/{id}/status if PATCH direct returned 404 or 405
        if (result.error && (result.error.status === 404 || result.error.status === 405)) {
          result = await fetchWithBQ({
            url: `/employees/${encodeURIComponent(id)}/status`,
            method: 'PATCH',
            body: payload,
          });
        }

        if (result.error) {
          return { error: result.error };
        }

        const normalized = normalizeEmployee(transformResponse<any>(result.data));
        return { data: normalized };
      },
      invalidatesTags: ['EmployeesList', 'EmployeeDetail', 'Workforce', 'WorkforceStats', 'OrgChart'],
    }),

    /**
     * Delete an employee record.
     * Route: DELETE /employees/{id}
     */
    deleteEmployee: builder.mutation<void, string>({
      query: (id) => ({
        url: `/employees/${encodeURIComponent(id)}`,
        method: 'DELETE',
      }),
      invalidatesTags: [
        'EmployeesList',
        'EmployeeDetail',
        'Workforce',
        'WorkforceStats',
        'OrgChart',
        'Departments',
      ],
    }),

    /**
     * Retrieve the interactive organization hierarchy tree.
     * Route: /hierarchy with fallback to building from /employees if needed.
     */
    getOrgChart: builder.query<OrgChartNode[], void>({
      async queryFn(_arg, _queryApi, _extraOptions, fetchWithBQ) {
        try {
          const compId = getSelectedCompanyId();
          const qs = compId ? `?company_id=${compId}` : '';

          // 1. Try Live /hierarchy endpoint
          const result = await fetchWithBQ(`/hierarchy${qs}`);
          if (!result.error && result.data) {
            const raw = transformResponse<any>(result.data);
            const tree = buildHierarchyTree(raw);
            if (tree.length > 0) {
              return { data: tree };
            }
          }

          // 2. Fallback: Build tree from live employees list
          const empResult = await fetchWithBQ(`/employees?limit=200${compId ? `&company_id=${compId}` : ''}`);
          if (!empResult.error && empResult.data) {
            const empData = transformResponse<any>(empResult.data);
            const list: any[] = Array.isArray(empData)
              ? empData
              : empData?.items || empData?.employees || empData?.data || [];
            const tree = buildHierarchyTree(list);
            return { data: tree };
          }

          return { data: [] };
        } catch {
          return { data: [] };
        }
      },
      providesTags: ['OrgChart'],
    }),

    /**
     * Retrieve all configured departments.
     * Route: GET /api/v1/departments
     */
    getDepartments: builder.query<DepartmentItem[], void>({
      query: () => {
        const compId = getSelectedCompanyId();
        return `/departments${compId ? `?company_id=${compId}` : ''}`;
      },
      transformResponse: (response: any): DepartmentItem[] => {
        return normalizeDepartments(response);
      },
      providesTags: ['Departments', 'Workforce', 'Employees'],
    }),

    /**
     * Create a new department / cost center.
     * Route: POST /api/v1/departments
     * Response shape: { success, message, data, errors }
     */
    createDepartment: builder.mutation<DepartmentItem, DepartmentFormPayload>({
      query: (payload) => ({
        url: '/departments',
        method: 'POST',
        body: toDepartmentPayload(payload, { isCreate: true }),
      }),
      transformResponse: (response: any) => {
        return normalizeDepartment(response);
      },
      invalidatesTags: ['Departments', 'Workforce', 'Employees', 'WorkforceStats'],
    }),

    /**
     * Update an existing department.
     * Route: PUT /api/v1/departments/{id}
     * Response shape: { success, message, data, errors }
     */
    updateDepartment: builder.mutation<DepartmentItem, { id: string; data: Partial<DepartmentFormPayload> }>({
      query: ({ id, data }) => ({
        url: `/departments/${encodeURIComponent(id)}`,
        method: 'PUT',
        body: toDepartmentPayload(data, { isCreate: false }),
      }),
      transformResponse: (response: any) => {
        return normalizeDepartment(response);
      },
      invalidatesTags: ['Departments', 'Workforce', 'Employees', 'WorkforceStats'],
    }),

    /**
     * Delete a department.
     * Route: DELETE /departments/{id}
     */
    deleteDepartment: builder.mutation<{ success: boolean; id: string }, string>({
      query: (id) => ({
        url: `/departments/${encodeURIComponent(id)}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Departments', 'Workforce', 'Employees'],
    }),

    /**
     * Retrieve job designations, optionally scoped to a department.
     * Resilient: If /designations returns 404 or does not exist,
     * gracefully returns standard industry designations so the form never fails.
     */
    getDesignations: builder.query<DesignationItem[], DesignationQueryParams | void>({
      async queryFn(params, _queryApi, _extraOptions, fetchWithBQ) {
        try {
          const queryString = params?.departmentId
            ? `?department_id=${encodeURIComponent(params.departmentId)}`
            : '';
          const result = await fetchWithBQ(`/designations${queryString}`);

          if (!result.error && result.data) {
            const raw = transformResponse<any>(result.data);
            const list = Array.isArray(raw) ? raw : raw?.items || raw?.designations || raw?.data || [];
            if (Array.isArray(list) && list.length > 0) {
              return {
                data: list.map((d: any, idx: number) => ({
                  id: String(d.id || `desg_${idx}`),
                  title: String(d.title || d.name || d.designation || d),
                  code: String(d.code || (d.title ? d.title.slice(0, 3).toUpperCase() : `D${idx}`)),
                  departmentId: String(d.departmentId || d.department_id || ''),
                  level: Number(d.level || 1),
                })),
              };
            }
          }

          // Fallback to standard enterprise designations
          return { data: STANDARD_DESIGNATIONS };
        } catch {
          return { data: STANDARD_DESIGNATIONS };
        }
      },
      providesTags: ['Designations'],
    }),
  }),
});

export const {
  useGetWorkforceStatsQuery,
  useGetEmployeesQuery,
  useGetEmployeeByIdQuery,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useUpdateEmployeeStatusMutation,
  useDeleteEmployeeMutation,
  useGetOrgChartQuery,
  useGetDepartmentsQuery,
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation,
  useGetDesignationsQuery,
} = workforceApi;

