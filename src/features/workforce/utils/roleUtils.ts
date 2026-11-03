/**
 * @file roleUtils.ts
 * @description Robust role resolution and aggregation utilities for OFC360 Workforce Management.
 * Dynamically resolves an employee's organizational role (EMPLOYEE, MANAGER, IT_ADMIN, EXECUTIVE)
 * across case sensitivities, delimiter variants, boolean flags, reporting hierarchy, and job titles.
 */

import type { WorkforceRole, EmployeeItem } from '../types/workforce.types';

/**
 * Resolves an employee's organizational workforce role ('EMPLOYEE' | 'MANAGER' | 'IT_ADMIN' | 'EXECUTIVE')
 * by inspecting multiple attributes with case-insensitivity, delimiter normalization, and structural cues:
 * 1. Explicit role string: 'executive', 'csuite', 'director' -> 'EXECUTIVE'
 *    'it_admin', 'itadmin', 'it-admin', 'it', 'devops', 'sysadmin' -> 'IT_ADMIN'
 *    'manager', 'lead', 'head' -> 'MANAGER'
 * 2. Boolean flags: `isManager === true`, `is_manager === true`, `isTeamLead === true`
 * 3. Reporting hierarchy: if any employee lists this employee's ID as reporting manager -> 'MANAGER'
 * 4. Executive designations: Director, VP, Vice President, Chief, CEO, CTO, CFO, COO, CMO, CRO, CPO, President, Founder, Executive
 * 5. IT Admin designations / departments: IT Admin, SysAdmin, DevOps, Infrastructure, Security Engineer, SRE, Network, Database Admin, or IT department
 * 6. Manager designations: Manager, Lead, Head, Supervisor, Principal, Chair
 * 7. Default: 'EMPLOYEE'
 */
export const resolveEmployeeRole = (
  emp: any,
  reportingManagerIds?: Set<string> | string[]
): WorkforceRole => {
  if (!emp) return 'EMPLOYEE';

  const mgrIds = reportingManagerIds
    ? reportingManagerIds instanceof Set
      ? reportingManagerIds
      : new Set(reportingManagerIds)
    : undefined;

  const empId = String(emp.id || emp._id || emp.employee_id || emp.employeeCode || '').trim();

  // 1. Direct explicit role string inspection (case-insensitive & separator-agnostic)
  const rawRole = String(
    emp.role || emp.user_role || emp.system_role || emp.roleName || ''
  ).trim().toLowerCase();
  const normalizedRole = rawRole.replace(/[-_ ]/g, '');

  if (
    normalizedRole === 'executive' ||
    normalizedRole === 'csuite' ||
    normalizedRole === 'director'
  ) {
    return 'EXECUTIVE';
  }
  if (
    normalizedRole === 'itadmin' ||
    normalizedRole === 'it_admin' ||
    normalizedRole === 'it' ||
    normalizedRole === 'devops' ||
    normalizedRole === 'sysadmin'
  ) {
    return 'IT_ADMIN';
  }
  if (
    normalizedRole === 'manager' ||
    normalizedRole === 'lead' ||
    normalizedRole === 'head'
  ) {
    return 'MANAGER';
  }

  // 2. Check boolean isManager flag or if other employees report to this employee
  const isReportingHead = Boolean(empId && mgrIds && mgrIds.has(empId));
  const isManagerFlag = Boolean(
    emp.isManager === true ||
    emp.is_manager === true ||
    emp.isTeamLead === true ||
    isReportingHead
  );

  // 3. Extract designation title
  const designationTitle = String(
    typeof emp.designation === 'string'
      ? emp.designation
      : emp.designation?.title ||
        emp.designationTitle ||
        emp.job_title ||
        emp.title ||
        ''
  ).trim().toUpperCase();

  // 4. Extract department name
  const departmentName = String(
    typeof emp.department === 'string'
      ? emp.department
      : emp.department?.name ||
        emp.departmentName ||
        emp.department_name ||
        ''
  ).trim().toUpperCase();

  // 5. Executive / C-Suite patterns
  const executiveKeywords = [
    'DIRECTOR',
    'VP',
    'VICE PRESIDENT',
    'CHIEF',
    'CEO',
    'CTO',
    'CFO',
    'COO',
    'CMO',
    'CRO',
    'CPO',
    'PRESIDENT',
    'FOUNDER',
    'CO-FOUNDER',
    'PARTNER',
    'MANAGING DIRECTOR',
    'EXECUTIVE',
  ];
  if (executiveKeywords.some((kw) => designationTitle.includes(kw))) {
    return 'EXECUTIVE';
  }

  // 6. IT Admin / Infrastructure patterns
  const itKeywords = [
    'IT ADMIN',
    'IT ADMINISTRATOR',
    'SYSTEM ADMIN',
    'SYSADMIN',
    'DEVOPS',
    'INFRASTRUCTURE',
    'INFRA',
    'SECURITY ENGINEER',
    'IT SUPPORT',
    'IT SPECIALIST',
    'NETWORK',
    'SITE RELIABILITY',
    'SRE',
    'DATABASE ADMINISTRATOR',
    'DBA',
  ];
  if (
    itKeywords.some((kw) => designationTitle.includes(kw)) ||
    ((departmentName.includes('IT') ||
      departmentName.includes('INFORMATION TECHNOLOGY') ||
      departmentName.includes('INFRASTRUCTURE') ||
      departmentName.includes('DEVOPS')) &&
      !isManagerFlag)
  ) {
    return 'IT_ADMIN';
  }

  // 7. Manager / Team Lead patterns
  const managerKeywords = [
    'MANAGER',
    'LEAD',
    'HEAD',
    'SUPERVISOR',
    'CHAIR',
    'PRINCIPAL',
  ];
  if (
    isManagerFlag ||
    managerKeywords.some((kw) => designationTitle.includes(kw))
  ) {
    return 'MANAGER';
  }

  // Default to standard Employee
  return 'EMPLOYEE';
};

/**
 * Computes counts for all 4 roles from a list of employees.
 */
export const computeWorkforceRoleCounts = (
  employees: any[]
): {
  managers: number;
  itAdmins: number;
  executives: number;
  employees: number;
} => {
  if (!Array.isArray(employees) || employees.length === 0) {
    return { managers: 0, itAdmins: 0, executives: 0, employees: 0 };
  }

  const mgrIds = new Set<string>();
  for (const e of employees) {
    const mgrId =
      e.reportingManager?.id ||
      e.reportingManagerId ||
      e.manager_id ||
      e.managerId ||
      e.reporting_manager_id;
    if (mgrId) mgrIds.add(String(mgrId).trim());
  }

  let managers = 0;
  let itAdmins = 0;
  let executives = 0;
  let emps = 0;

  for (const e of employees) {
    const role = resolveEmployeeRole(e, mgrIds);
    if (role === 'MANAGER') managers++;
    else if (role === 'IT_ADMIN') itAdmins++;
    else if (role === 'EXECUTIVE') executives++;
    else emps++;
  }

  return { managers, itAdmins, executives, employees: emps };
};

/**
 * Robust demo fallback employees for local development and zero-state prevention.
 * Features realistic multi-role distribution (Executive, Managers, IT Admin, Employee).
 */
export const FALLBACK_WORKFORCE_EMPLOYEES: EmployeeItem[] = [
  {
    id: 'emp-dev-001',
    employeeCode: 'EMP-1001',
    firstName: 'Aarav',
    lastName: 'Sharma',
    fullName: 'Aarav Sharma',
    email: 'aarav.sharma@ofc360.com',
    phone: '+91 98765 43210',
    gender: 'MALE',
    workLocation: 'Jaipur HQ',
    role: 'EXECUTIVE',
    employmentType: 'FULL_TIME',
    status: 'ACTIVE',
    department: { id: 'dept-exec', name: 'Executive Leadership' },
    departmentId: 'dept-exec',
    departmentName: 'Executive Leadership',
    designation: { id: 'desig-cto', title: 'Chief Technology Officer' },
    designationTitle: 'Chief Technology Officer',
    joiningDate: '2023-01-10',
  },
  {
    id: 'emp-dev-002',
    employeeCode: 'EMP-1002',
    firstName: 'Priya',
    lastName: 'Mehta',
    fullName: 'Priya Mehta',
    email: 'priya.mehta@ofc360.com',
    phone: '+91 98765 43211',
    gender: 'FEMALE',
    workLocation: 'Jaipur HQ',
    role: 'MANAGER',
    employmentType: 'FULL_TIME',
    status: 'ACTIVE',
    department: { id: 'dept-eng', name: 'Engineering' },
    departmentId: 'dept-eng',
    departmentName: 'Engineering',
    designation: { id: 'desig-em', title: 'Engineering Manager' },
    designationTitle: 'Engineering Manager',
    reportingManager: { id: 'emp-dev-001', name: 'Aarav Sharma' },
    reportingManagerId: 'emp-dev-001',
    reportingManagerName: 'Aarav Sharma',
    joiningDate: '2023-03-15',
  },
  {
    id: 'emp-dev-003',
    employeeCode: 'EMP-1003',
    firstName: 'Rohan',
    lastName: 'Verma',
    fullName: 'Rohan Verma',
    email: 'rohan.verma@ofc360.com',
    phone: '+91 98765 43212',
    gender: 'MALE',
    workLocation: 'Jaipur HQ',
    role: 'IT_ADMIN',
    employmentType: 'FULL_TIME',
    status: 'ACTIVE',
    department: { id: 'dept-it', name: 'Information Technology' },
    departmentId: 'dept-it',
    departmentName: 'Information Technology',
    designation: { id: 'desig-lead-devops', title: 'Lead DevOps & Security Admin' },
    designationTitle: 'Lead DevOps & Security Admin',
    reportingManager: { id: 'emp-dev-001', name: 'Aarav Sharma' },
    reportingManagerId: 'emp-dev-001',
    reportingManagerName: 'Aarav Sharma',
    joiningDate: '2023-06-01',
  },
  {
    id: 'emp-dev-004',
    employeeCode: 'EMP-1004',
    firstName: 'Neha',
    lastName: 'Patel',
    fullName: 'Neha Patel',
    email: 'neha.patel@ofc360.com',
    phone: '+91 98765 43213',
    gender: 'FEMALE',
    workLocation: 'Remote',
    role: 'MANAGER',
    employmentType: 'FULL_TIME',
    status: 'ACTIVE',
    department: { id: 'dept-prod', name: 'Product Management' },
    departmentId: 'dept-prod',
    departmentName: 'Product Management',
    designation: { id: 'desig-pm-lead', title: 'Product Operations Lead' },
    designationTitle: 'Product Operations Lead',
    reportingManager: { id: 'emp-dev-001', name: 'Aarav Sharma' },
    reportingManagerId: 'emp-dev-001',
    reportingManagerName: 'Aarav Sharma',
    joiningDate: '2023-08-20',
  },
  {
    id: 'emp-dev-005',
    employeeCode: 'EMP-1005',
    firstName: 'Kabir',
    lastName: 'Singh',
    fullName: 'Kabir Singh',
    email: 'kabir.singh@ofc360.com',
    phone: '+91 98765 43214',
    gender: 'MALE',
    workLocation: 'Jaipur HQ',
    role: 'EMPLOYEE',
    employmentType: 'FULL_TIME',
    status: 'ACTIVE',
    department: { id: 'dept-eng', name: 'Engineering' },
    departmentId: 'dept-eng',
    departmentName: 'Engineering',
    designation: { id: 'desig-swe', title: 'Senior Frontend Developer' },
    designationTitle: 'Senior Frontend Developer',
    reportingManager: { id: 'emp-dev-002', name: 'Priya Mehta' },
    reportingManagerId: 'emp-dev-002',
    reportingManagerName: 'Priya Mehta',
    joiningDate: '2024-01-15',
  },
];

