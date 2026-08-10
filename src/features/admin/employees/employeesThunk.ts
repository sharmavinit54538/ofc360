import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiInstance } from "@/api";
import { parseApiError, type ParsedError } from "@/api/utils";
import type {
  CreateEmployeePayload,
  Employee,
  FetchEmployeesParams,
  OrgChartNode,
  UpdateEmployeePayload,
} from "./employeesTypes";

function mapEmployee(emp: Record<string, unknown>): Employee {
  const managerObj = emp.manager as Record<string, unknown> | undefined;
  const firstName = String(emp.first_name ?? "");
  const lastName = String(emp.last_name ?? "");
  const fullName = `${firstName} ${lastName}`.trim() || String(emp.fullName ?? emp.name ?? "");
  const managerName = managerObj
    ? `${managerObj.first_name ?? ""} ${managerObj.last_name ?? ""}`.trim()
    : String(emp.manager_name ?? emp.managerName ?? "");
  const managerId = String(emp.reporting_manager_id ?? emp.manager_id ?? emp.managerId ?? managerObj?.id ?? "");

  return {
    id: String(emp.id ?? ""),
    employeeId: String(emp.employee_id ?? emp.employeeId ?? ""),
    firstName,
    lastName,
    fullName,
    email: String(emp.personal_email ?? emp.email ?? ""),
    companyEmail: String(emp.company_email ?? emp.companyEmail ?? ""),
    phone: String(emp.phone ?? ""),
    alternatePhone: String(emp.alternate_phone ?? emp.alternatePhone ?? ""),
    department: String(emp.department ?? ""),
    designation: String(emp.designation ?? ""),
    employmentType: String(emp.employment_type ?? emp.employmentType ?? "FULL_TIME"),
    joiningDate: String(emp.joining_date ?? emp.joiningDate ?? ""),
    profilePhotoUrl: String(emp.profile_photo_url ?? emp.profilePhotoUrl ?? ""),
    gender: String(emp.gender ?? ""),
    dateOfBirth: String(emp.date_of_birth ?? emp.dateOfBirth ?? ""),
    bloodGroup: String(emp.blood_group ?? emp.bloodGroup ?? ""),
    maritalStatus: String(emp.marital_status ?? emp.maritalStatus ?? ""),
    team: String(emp.team ?? ""),
    managerId,
    managerName,
    branch: String(emp.branch ?? ""),
    workLocation: String(emp.work_location ?? emp.workLocation ?? ""),
    probationPeriodMonths: Number(emp.probation_period_months ?? emp.probationPeriodMonths ?? 3),
    shift: String(emp.shift ?? "General"),
    employeeCapacity: Number(emp.employee_capacity ?? emp.employeeCapacity ?? 100),
    costCenterId: String(emp.cost_center_id ?? emp.costCenterId ?? ""),
    ctc: Number(emp.ctc ?? 0),
    basicSalary: Number(emp.basic_salary ?? emp.basicSalary ?? 0),
    hra: Number(emp.hra ?? 0),
    bonus: Number(emp.bonus ?? 0),
    pf: Number(emp.pf ?? 0),
    esi: Number(emp.esi ?? 0),
    professionalTax: Number(emp.professional_tax ?? emp.professionalTax ?? 0),
    role: String(emp.role ?? "employee"),
    leaveGroup: String(emp.leave_group ?? emp.leaveGroup ?? ""),
    roleMetadata: (emp.role_metadata ?? emp.roleMetadata ?? {}) as Record<string, unknown>,
    addresses: (emp.addresses ?? []) as any[],
    documents: (emp.documents ?? []) as any[],
    education: (emp.education ?? []) as any[],
    experience: (emp.experience ?? []) as any[],
    skills: (emp.skills ?? []) as any[],
    emergencyContacts: (emp.emergency_contacts ?? emp.emergencyContacts ?? []) as any[],
    bankAccounts: (emp.bank_accounts ?? emp.bankAccounts ?? []) as any[],
    status: String(emp.status ?? "INVITED"),
    activationToken: emp.activation_token as string | undefined,
    activationTokenExpiresAt: emp.activation_token_expires_at as string | undefined,
  };
}

export const fetchEmployees = createAsyncThunk<
  {
    items: Employee[];
    total: number;
    page: number;
    limit: number;
    pages: number;
    total_pages: number;
    has_next: boolean;
    has_previous: boolean;
  },
  FetchEmployeesParams | void,
  { rejectValue: ParsedError }
>("employees/fetchEmployees", async (params, thunkAPI) => {
  try {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.set("search", params.search);
    if (params?.department && params.department !== "all") {
      searchParams.set("department", params.department);
    }
    if (params?.designation && params.designation !== "all") {
      searchParams.set("designation", params.designation);
    }
    if (params?.shift && params.shift !== "all") {
      searchParams.set("shift", params.shift);
    }
    if (params?.status && params.status !== "all") {
      searchParams.set("status", params.status);
    }
    if (params?.managerId) {
      searchParams.set("manager_id", params.managerId);
    }
    if (params?.sort) {
      searchParams.set("sort", params.sort);
    }
    if (params?.order) {
      searchParams.set("order", params.order);
    }
    if (params?.page) {
      searchParams.set("page", String(params.page));
    }
    if (params?.limit) {
      searchParams.set("limit", String(params.limit));
    }

    const response = await apiInstance.get(`/employees?${searchParams.toString()}`);
    const data = response.data?.data ?? {};
    const items = data.items ?? [];
    return {
      items: items.map((item: Record<string, unknown>) => mapEmployee(item)),
      total: Number(data.total ?? 0),
      page: Number(data.page ?? 1),
      limit: Number(data.limit ?? 10),
      pages: Number(data.pages ?? 0),
      total_pages: Number(data.total_pages ?? data.pages ?? 0),
      has_next: Boolean(data.has_next ?? false),
      has_previous: Boolean(data.has_previous ?? false),
    };
  } catch (error) {
    return thunkAPI.rejectWithValue(parseApiError(error, "Failed to fetch employees"));
  }
});

export const fetchOrgChart = createAsyncThunk<
  OrgChartNode[],
  string | void,
  { rejectValue: ParsedError }
>("employees/fetchOrgChart", async (employeeId, thunkAPI) => {
  try {
    const url = employeeId ? `/employees/${employeeId}/org-chart` : "/employees/hierarchy";
    const response = await apiInstance.get(url);
    const data = response.data?.data ?? response.data ?? [];
    return Array.isArray(data) ? data : [data];
  } catch (error) {
    return thunkAPI.rejectWithValue(parseApiError(error, "Failed to fetch organization chart"));
  }
});

export const createEmployee = createAsyncThunk<
  void,
  CreateEmployeePayload,
  { rejectValue: ParsedError }
>("employees/createEmployee", async (payload, thunkAPI) => {
  try {
    await apiInstance.post("/employees", payload);
  } catch (error) {
    return thunkAPI.rejectWithValue(parseApiError(error, "Failed to add employee"));
  }
});

export const updateEmployee = createAsyncThunk<
  void,
  { id: string; payload: UpdateEmployeePayload },
  { rejectValue: ParsedError }
>("employees/updateEmployee", async ({ id, payload }, thunkAPI) => {
  try {
    await apiInstance.put(`/employees/${id}`, payload);
  } catch (error) {
    return thunkAPI.rejectWithValue(parseApiError(error, "Failed to update employee"));
  }
});

export const deleteEmployee = createAsyncThunk<string, string, { rejectValue: ParsedError }>(
  "employees/deleteEmployee",
  async (id, thunkAPI) => {
    try {
      await apiInstance.delete(`/employees/${id}`);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(parseApiError(error, "Failed to remove employee"));
    }
  },
);

export const resendEmployeeInvite = createAsyncThunk<void, string, { rejectValue: ParsedError }>(
  "employees/resendEmployeeInvite",
  async (id, thunkAPI) => {
    try {
      await apiInstance.post(`/employees/${id}/send-invite`);
    } catch (error) {
      return thunkAPI.rejectWithValue(parseApiError(error, "Failed to resend invitation"));
    }
  },
);

export const deactivateEmployee = createAsyncThunk<void, string, { rejectValue: ParsedError }>(
  "employees/deactivateEmployee",
  async (id, thunkAPI) => {
    try {
      await apiInstance.post(`/employees/${id}/deactivate`);
    } catch (error) {
      return thunkAPI.rejectWithValue(parseApiError(error, "Failed to deactivate employee"));
    }
  },
);

export const activateEmployee = createAsyncThunk<void, string, { rejectValue: ParsedError }>(
  "employees/activateEmployee",
  async (id, thunkAPI) => {
    try {
      await apiInstance.post(`/employees/${id}/activate-by-admin`);
    } catch (error) {
      return thunkAPI.rejectWithValue(parseApiError(error, "Failed to activate employee"));
    }
  },
);

export const resetEmployeePassword = createAsyncThunk<void, string, { rejectValue: ParsedError }>(
  "employees/resetEmployeePassword",
  async (id, thunkAPI) => {
    try {
      await apiInstance.post(`/employees/${id}/reset-password`);
    } catch (error) {
      return thunkAPI.rejectWithValue(parseApiError(error, "Failed to reset password"));
    }
  },
);
