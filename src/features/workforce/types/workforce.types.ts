/**
 * @file workforce.types.ts
 * @description TypeScript contracts for the Workforce Management domain:
 * headcount KPIs, employee directory, departments, designations, and org chart.
 */

export type EmploymentType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERN';
export type EmployeeStatus =
  | 'ACTIVE'
  | 'INACTIVE'
  | 'INVITED'
  | 'PENDING'
  | 'ONBOARDING'
  | 'PROBATION'
  | 'ON_LEAVE'
  | 'NOTICE_PERIOD'
  | 'SUSPENDED'
  | 'DEACTIVATED'
  | 'TERMINATED';

export type EmployeeStatusAction =
  | 'ACTIVE'
  | 'INACTIVE'
  | 'INVITED'
  | 'PENDING'
  | 'ONBOARDING'
  | 'PROBATION'
  | 'ON_LEAVE'
  | 'NOTICE_PERIOD'
  | 'SUSPENDED'
  | 'DEACTIVATED'
  | 'TERMINATED';

export type GenderType = 'MALE' | 'FEMALE' | 'OTHER';
export type WorkMode = 'OFFICE' | 'REMOTE' | 'HYBRID';
export type WorkforceRole = 'EMPLOYEE' | 'MANAGER' | 'IT_ADMIN' | 'EXECUTIVE';

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
  managersCount?: number;
  itAdminsCount?: number;
  executivesCount?: number;
  departmentsCount?: number;
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

export type Employee = EmployeeItem;
export type Department = DepartmentItem;

/**
 * One employee record in the workforce directory.
 */
export interface EmployeeItem {
  id: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  email: string;
  personalEmail?: string;
  phone: string;
  gender: GenderType;
  department: DepartmentRef;
  departmentId?: string;
  departmentName?: string;
  designation: DesignationRef;
  designationTitle?: string;
  reportingManager?: ManagerRef;
  reportingManagerId?: string | null;
  reportingManagerName?: string | null;
  joiningDate: string;
  employmentType: EmploymentType;
  status: EmployeeStatus;
  workLocation: string;
  avatarUrl?: string | null;
  role?: WorkforceRole | string;
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
  company_id?: string;
  role?: string;
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
  firstName: string;
  lastName: string;
  personalEmail: string;
  phone: string;
  department?: string;
  departmentId?: string;
  designation?: string;
  designationId?: string;
  joiningDate: string;
  email?: string;
  personalEmail_deprecated?: string;
  gender?: GenderType;
  reportingManagerId?: string;
  employmentType?: EmploymentType;
  workLocation?: string;
  workMode?: WorkMode;
  role?: string;
  basicSalary?: number;
  ctc?: number;
  employeeCode?: string;

  // Backend FastAPI snake_case fields
  first_name?: string;
  last_name?: string;
  personal_email?: string;
  company_email?: string;
  joining_date?: string;
  employee_id?: string;
  reporting_manager_id?: string;
  work_location?: string;
  employment_type?: string;
  basic_salary?: number;
  hra?: number;
  bonus?: number;
  pf?: number;
  esi?: number;
  professional_tax?: number;
  date_of_birth?: string;
  alternate_phone?: string;
  blood_group?: string;
  marital_status?: string;
  team?: string;
  branch?: string;
  shift?: string;
  probation_period_months?: number;
  employee_capacity?: number;
  cost_center_id?: string;
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

export type DepartmentStatus = 'ACTIVE' | 'INACTIVE' | 'HIRING' | 'GROWING';

/**
 * A configured department / cost center matching backend FastAPI schema.
 */
export interface DepartmentItem {
  id: string;
  name: string;
  departmentName?: string;
  department_name?: string;
  code: string;
  departmentCode?: string;
  department_code?: string;
  description?: string;
  location?: string;
  managerId?: string | null;
  manager_id?: string | null;
  managerName?: string;
  headId?: string | null;
  head_id?: string | null;
  headName?: string;
  headOfDepartment?: ManagerRef;
  parentDepartmentId?: string | null;
  parent_department_id?: string | null;
  branchId?: string | null;
  branch_id?: string | null;
  costCenter?: string;
  cost_center?: string;
  budget?: number;
  extensionNumber?: string;
  extension_number?: string;
  employeeCapacity?: number;
  employee_capacity?: number;
  status?: DepartmentStatus;
  isActive: boolean;
  is_active?: boolean;
  totalEmployees: number;
  headcount?: number;
  employeeCount?: number;
  percentage?: number;
}

/**
 * Payload for Create/Edit Department: POST /api/v1/departments and PUT /api/v1/departments/{id}
 */
export interface DepartmentFormPayload {
  department_name: string;
  description: string;
  location: string;
  manager_id?: string;
  parent_department_id?: string;
  branch_id?: string;
  cost_center?: string;
  budget?: number;
  extension_number?: string;
  employee_capacity?: number;
  status?: DepartmentStatus;

  // Legacy & camelCase aliases for backward compatibility
  name?: string;
  departmentName?: string;
  code?: string;
  departmentCode?: string;
  headId?: string;
  head_id?: string;
  managerId?: string;
  parentDepartmentId?: string;
  branchId?: string;
  costCenter?: string;
  extensionNumber?: string;
  employeeCapacity?: number;
  isActive?: boolean;
  is_active?: boolean;
}

export type UpdateDepartmentPayload = Partial<DepartmentFormPayload>;

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
  role?: WorkforceRole | string;
  subordinates: OrgChartNode[];
  children?: OrgChartNode[];
  managerId?: string | null;
}
