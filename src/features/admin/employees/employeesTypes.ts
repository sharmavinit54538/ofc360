export interface EmployeeAddress {
  address_type: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  is_same_as_current: boolean;
}

export interface EmployeeDocument {
  document_type: string;
  document_number: string;
  document_url?: string;
  expiry_date?: string;
}

export interface EmployeeEducation {
  degree: string;
  institution: string;
  field_of_study?: string;
  start_year?: number;
  end_year?: number;
  grade?: string;
  certificate_url?: string;
}

export interface EmployeeExperience {
  company_name: string;
  designation: string;
  employment_type?: string;
  start_date?: string;
  end_date?: string;
  is_current: boolean;
  description?: string;
}

export interface EmployeeSkill {
  skill_name: string;
  proficiency: "Beginner" | "Intermediate" | "Advanced" | "Expert" | string;
  years_of_experience?: number;
}

export interface EmployeeEmergencyContact {
  name: string;
  relation: string;
  phone: string;
  alternate_phone?: string;
  email?: string;
  address?: string;
}

export interface EmployeeBankAccount {
  bank_name: string;
  account_holder_name: string;
  account_number: string;
  ifsc_code: string;
  account_type: "SAVINGS" | "CURRENT" | string;
  is_primary: boolean;
}

export interface Employee {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  companyEmail?: string;
  phone: string;
  alternatePhone?: string;
  department: string;
  designation: string;
  employmentType?: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERN" | string;
  joiningDate: string;
  profilePhotoUrl?: string;
  gender?: string;
  dateOfBirth?: string;
  bloodGroup?: string;
  maritalStatus?: string;
  team?: string;
  managerId?: string;
  managerName?: string;
  branch?: string;
  workLocation?: string;
  probationPeriodMonths?: number;
  shift?: string;
  employeeCapacity?: number;
  costCenterId?: string;
  ctc?: number;
  basicSalary?: number;
  hra?: number;
  bonus?: number;
  pf?: number;
  esi?: number;
  professionalTax?: number;
  role?: string;
  leaveGroup?: string;
  roleMetadata?: Record<string, unknown>;
  addresses?: EmployeeAddress[];
  documents?: EmployeeDocument[];
  education?: EmployeeEducation[];
  experience?: EmployeeExperience[];
  skills?: EmployeeSkill[];
  emergencyContacts?: EmployeeEmergencyContact[];
  bankAccounts?: EmployeeBankAccount[];
  status?: string;
  activationToken?: string;
  activationTokenExpiresAt?: string;
}

export interface OrgChartNode {
  id: string;
  fullName: string;
  designation: string;
  department?: string;
  email?: string;
  managerId?: string;
  directReports: OrgChartNode[];
}

export interface EmployeesState {
  employees: Employee[];
  orgChart: OrgChartNode[];
  loading: boolean;
  submitting: boolean;
  error: string | null;
  total: number;
  page: number;
  limit: number;
  pages: number;
  has_next: boolean;
  has_previous: boolean;
}

export interface FetchEmployeesParams {
  search?: string;
  department?: string;
  designation?: string;
  shift?: string;
  status?: string;
  managerId?: string;
  sort?: string;
  order?: string;
  page?: number;
  limit?: number;
}

export interface CreateEmployeePayload {
  first_name: string;
  last_name: string;
  personal_email: string;
  phone: string;
  employee_id: string;
  department: string;
  designation: string;
  employment_type: string;
  joining_date: string;
  profile_photo_url?: string;
  gender?: string;
  date_of_birth?: string;
  company_email?: string;
  alternate_phone?: string;
  blood_group?: string;
  marital_status?: string;
  team?: string;
  reporting_manager_id?: string;
  branch?: string;
  work_location?: string;
  probation_period_months?: number;
  shift?: string;
  employee_capacity?: number;
  cost_center_id?: string;
  ctc?: number;
  basic_salary?: number;
  hra?: number;
  bonus?: number;
  pf?: number;
  esi?: number;
  professional_tax?: number;
  role?: string;
  leave_group?: string;
  role_metadata?: Record<string, unknown>;
  addresses?: EmployeeAddress[];
  documents?: EmployeeDocument[];
  education?: EmployeeEducation[];
  experience?: EmployeeExperience[];
  skills?: EmployeeSkill[];
  emergency_contacts?: EmployeeEmergencyContact[];
  bank_accounts?: EmployeeBankAccount[];
  employment_status?: string;
}

export interface UpdateEmployeePayload extends Partial<CreateEmployeePayload> {}
