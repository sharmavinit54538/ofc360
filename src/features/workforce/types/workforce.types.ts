/**
 * @file workforce.types.ts
 * @description TypeScript contracts for the Workforce Management domain:
 * headcount KPIs, employee directory, departments, designations, and org chart.
 */

export type EmploymentType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERN';
export type EmployeeStatus = 'ACTIVE' | 'PROBATION' | 'NOTICE_PERIOD' | 'SUSPENDED' | 'INACTIVE';
export type EmployeeStatusAction = 'ACTIVE' | 'PROBATION' | 'NOTICE_PERIOD' | 'SUSPENDED' | 'TERMINATED';
export type GenderType = 'MALE' | 'FEMALE' | 'OTHER';
export type WorkMode = 'OFFICE' | 'REMOTE' | 'HYBRID';

/**
 * Organization-wide aggregate workforce KPI metrics.
 */
export interface WorkforceStats {
  totalHeadcount: number;
  activeEmployees: number;
  onProbationCount: number;
  newJoinersThisMonth: number;
  exitedThisMonth: number;
  retentionRate: number;
  genderDiversity: {
    male: number;
    female: number;
    other: number;
  };
  workModeSplit: {
    office: number;
    remote: number;
    hybrid: number;
  };
}

/**
 * Query params accepted by the aggregate stats endpoint.
 */
export interface WorkforceStatsQueryParams {
  departmentId?: string;
  location?: string;
}

export interface DepartmentRef {
  id: string;
  name: string;
}

export interface DesignationRef {
  id: string;
  title: string;
}

export interface ManagerRef {
  id: string;
  name: string;
}

/**
 * One employee record in the workforce directory.
 */
export interface EmployeeItem {
  id: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: GenderType;
  department: DepartmentRef;
  designation: DesignationRef;
  reportingManager?: ManagerRef;
  joiningDate: string;
  employmentType: EmploymentType;
  status: EmployeeStatus;
  workLocation: string;
  avatarUrl?: string | null;
}

/**
 * Filters accepted by the employee directory listing endpoint.
 */
export interface WorkforceFilterParams {
  page?: number;
  limit?: number;
  search?: string;
  departmentId?: string;
  designationId?: string;
  employmentType?: string;
  status?: string;
  location?: string;
}

/**
 * Paginated response for employee directory listings.
 */
export interface EmployeeListResponse {
  items: EmployeeItem[];
  total: number;
  page: number;
  limit: number;
}

/**
 * Payload for creating a new employee record.
 */
export interface CreateEmployeePayload {
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: GenderType;
  joiningDate: string;
  departmentId: string;
  designationId: string;
  reportingManagerId?: string;
  employmentType: EmploymentType;
  workLocation: string;
  workMode: WorkMode;
}

export type UpdateEmployeePayload = Partial<CreateEmployeePayload>;

/**
 * Payload for a lifecycle status transition of an employee.
 */
export interface UpdateEmployeeStatusPayload {
  status: EmployeeStatusAction;
  effectiveDate: string;
  reason: string;
}

/**
 * A configured department / cost center.
 */
export interface DepartmentItem {
  id: string;
  name: string;
  code: string;
  headOfDepartment?: ManagerRef;
  totalEmployees: number;
  isActive: boolean;
}

export interface DepartmentFormPayload {
  name: string;
  code: string;
}

/**
 * A standardized job designation / career band.
 */
export interface DesignationItem {
  id: string;
  title: string;
  code: string;
  departmentId: string;
  level: number;
}

export interface DesignationQueryParams {
  departmentId?: string;
}

/**
 * One node in the interactive organization hierarchy tree.
 */
export interface OrgChartNode {
  id: string;
  name: string;
  designation: string;
  department: string;
  avatarUrl?: string | null;
  subordinates: OrgChartNode[];
}
