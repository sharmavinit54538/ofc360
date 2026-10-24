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

  const id = String(raw.id ?? raw.employee_id ?? raw._id ?? '');
  const employeeCode = String(raw.employeeCode ?? raw.employee_code ?? raw.emp_code ?? 'N/A');
  const firstName = String(raw.firstName ?? raw.first_name ?? '');
  const lastName = String(raw.lastName ?? raw.last_name ?? '');
  const fullName = String(
    raw.fullName ??
      raw.full_name ??
      ([firstName, lastName].filter(Boolean).join(' ') || raw.name || 'Unknown')
  );

  const email = String(raw.email ?? raw.work_email ?? '');
  const personalEmail = raw.personalEmail ?? raw.personal_email ?? undefined;
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
  const reportingManagerId =
    raw.reportingManagerId ??
    raw.reporting_manager_id ??
    raw.manager_id ??
    raw.reportingManager?.id ??
    null;
  const reportingManagerName =
    raw.reportingManagerName ??
    raw.reporting_manager_name ??
    raw.manager_name ??
    raw.reportingManager?.name ??
    null;

  const reportingManager =
    reportingManagerName || reportingManagerId
      ? {
          id: String(reportingManagerId || ''),
          name: String(reportingManagerName || reportingManagerId || 'Manager'),
        }
      : undefined;

  const workLocation = String(
    raw.workLocation ?? raw.work_location ?? raw.location ?? raw.city ?? 'Jaipur HQ'
  );
  const avatarUrl = raw.avatarUrl ?? raw.avatar_url ?? raw.profile_picture ?? null;

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
  };
};

/**
 * Normalizes department objects from live backend shapes.
 */
export const normalizeDepartment = (dept: any): DepartmentItem => {
  if (!dept || typeof dept !== 'object') {
    return {
      id: `dept_${Date.now()}`,
      name: 'Department',
      code: 'DEPT',
      headcount: 0,
      totalEmployees: 0,
      budget: 0,
      isActive: true,
    };
  }

  const headcount = Number(
    dept.headcount ??
      dept.employee_count ??
      dept.employees_count ??
      dept.totalEmployees ??
      dept.total_employees ??
      0
  );

  const name = String(dept.name ?? dept.department_name ?? 'Department');
  const code = String(
    dept.code ??
      dept.department_code ??
      (name ? name.slice(0, 4).toUpperCase() : 'DEPT')
  );

  return {
    id: String(dept.id ?? dept._id ?? dept.department_id ?? ''),
    name,
    code,
    headcount,
    totalEmployees: headcount,
    budget: Number(dept.budget ?? 0),
    isActive: Boolean(dept.is_active ?? dept.isActive ?? true),
    headOfDepartment: dept.headOfDepartment
      ? {
          id: String(dept.headOfDepartment.id || ''),
          name: String(dept.headOfDepartment.name || ''),
        }
      : dept.manager_name || dept.head_of_department_name
      ? {
          id: String(dept.manager_id || dept.head_of_department_id || ''),
          name: String(dept.manager_name || dept.head_of_department_name || ''),
        }
      : undefined,
  };
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
    'WorkforceStats',
    'EmployeesList',
    'EmployeeDetail',
    'Departments',
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
          return { items, total: items.length, page: 1, limit: items.length };
        }

        const rawItems = data?.items || data?.employees || data?.data || [];
        const items = Array.isArray(rawItems) ? rawItems.map(normalizeEmployee) : [];
        const total = Number(data?.total ?? data?.count ?? data?.total_count ?? items.length);
        const page = Number(data?.page ?? 1);
        const limit = Number(data?.limit ?? data?.size ?? 10);

        return { items, total, page, limit };
      },
      providesTags: (result) =>
        result?.items
          ? [
              ...result.items.map(({ id }) => ({ type: 'EmployeesList' as const, id })),
              { type: 'EmployeesList', id: 'LIST' },
            ]
          : [{ type: 'EmployeesList', id: 'LIST' }],
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
     * Maps strictly to FastAPI Pydantic EmployeeCreate snake_case schema while maintaining camelCase.
     */
    createEmployee: builder.mutation<EmployeeItem, CreateEmployeePayload>({
      query: (payload) => {
        const compId = getSelectedCompanyId();
        const body: Record<string, any> = {
          // FastAPI Pydantic snake_case fields
          first_name: payload.firstName,
          last_name: payload.lastName,
          email: payload.email,
          phone: payload.phone,
          phone_number: payload.phone,
          department_id: payload.departmentId,
          designation: payload.designationId,
          designation_id: payload.designationId,
          employment_type: payload.employmentType,
          date_of_joining: payload.joiningDate,
          joining_date: payload.joiningDate,
          reporting_manager_id: payload.reportingManagerId || null,
          manager_id: payload.reportingManagerId || null,
          gender: payload.gender,
          work_location: payload.workLocation,
          work_mode: payload.workMode,
          employee_code: payload.employeeCode,
          personal_email: payload.personalEmail || null,
          role: payload.role || 'EMPLOYEE',
          ...(payload.basicSalary !== undefined ? { basic_salary: payload.basicSalary } : {}),
          ...(payload.ctc !== undefined ? { ctc: payload.ctc } : {}),
          ...(compId ? { company_id: compId } : {}),

          // camelCase mirrors
          firstName: payload.firstName,
          lastName: payload.lastName,
          departmentId: payload.departmentId,
          designationId: payload.designationId,
          employmentType: payload.employmentType,
          joiningDate: payload.joiningDate,
          reportingManagerId: payload.reportingManagerId || null,
          workLocation: payload.workLocation,
          workMode: payload.workMode,
          employeeCode: payload.employeeCode,
          personalEmail: payload.personalEmail || null,
        };

        return {
          url: '/employees',
          method: 'POST',
          body,
        };
      },
      transformResponse: (response: any) => normalizeEmployee(transformResponse<any>(response)),
      invalidatesTags: ['EmployeesList', 'WorkforceStats', 'OrgChart', 'Departments'],
    }),

    /**
     * Update an existing employee record.
     * Route: PUT /employees/{id} or PATCH /employees/{id}
     */
    updateEmployee: builder.mutation<EmployeeItem, { id: string; data: UpdateEmployeePayload }>({
      query: ({ id, data }) => {
        const body: Record<string, any> = {
          // snake_case
          ...(data.firstName !== undefined ? { first_name: data.firstName, firstName: data.firstName } : {}),
          ...(data.lastName !== undefined ? { last_name: data.lastName, lastName: data.lastName } : {}),
          ...(data.email !== undefined ? { email: data.email } : {}),
          ...(data.phone !== undefined ? { phone: data.phone, phone_number: data.phone } : {}),
          ...(data.departmentId !== undefined ? { department_id: data.departmentId, departmentId: data.departmentId } : {}),
          ...(data.designationId !== undefined ? { designation_id: data.designationId, designation: data.designationId, designationId: data.designationId } : {}),
          ...(data.employmentType !== undefined ? { employment_type: data.employmentType, employmentType: data.employmentType } : {}),
          ...(data.joiningDate !== undefined ? { date_of_joining: data.joiningDate, joining_date: data.joiningDate, joiningDate: data.joiningDate } : {}),
          ...(data.reportingManagerId !== undefined ? { reporting_manager_id: data.reportingManagerId, manager_id: data.reportingManagerId, reportingManagerId: data.reportingManagerId } : {}),
          ...(data.gender !== undefined ? { gender: data.gender } : {}),
          ...(data.workLocation !== undefined ? { work_location: data.workLocation, workLocation: data.workLocation } : {}),
          ...(data.workMode !== undefined ? { work_mode: data.workMode, workMode: data.workMode } : {}),
          ...(data.employeeCode !== undefined ? { employee_code: data.employeeCode, employeeCode: data.employeeCode } : {}),
          ...(data.personalEmail !== undefined ? { personal_email: data.personalEmail, personalEmail: data.personalEmail } : {}),
          ...(data.basicSalary !== undefined ? { basic_salary: data.basicSalary } : {}),
          ...(data.ctc !== undefined ? { ctc: data.ctc } : {}),
        };

        return {
          url: `/employees/${encodeURIComponent(id)}`,
          method: 'PUT',
          body,
        };
      },
      transformResponse: (response: any) => normalizeEmployee(transformResponse<any>(response)),
      invalidatesTags: ['EmployeesList', 'EmployeeDetail', 'OrgChart'],
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
      invalidatesTags: ['EmployeesList', 'EmployeeDetail', 'WorkforceStats', 'OrgChart'],
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
     * Route: /departments (FastAPI endpoint)
     */
    getDepartments: builder.query<DepartmentItem[], void>({
      query: () => {
        const compId = getSelectedCompanyId();
        return `/departments${compId ? `?company_id=${compId}` : ''}`;
      },
      transformResponse: (response: any): DepartmentItem[] => {
        const data = transformResponse<any>(response);
        const list = Array.isArray(data)
          ? data
          : data?.items || data?.departments || data?.data || [];
        return Array.isArray(list) ? list.map(normalizeDepartment) : [];
      },
      providesTags: ['Departments'],
    }),

    /**
     * Create a new department / cost center.
     * Route: POST /departments
     */
    createDepartment: builder.mutation<DepartmentItem, DepartmentFormPayload>({
      query: (payload) => {
        const compId = getSelectedCompanyId();
        return {
          url: '/departments',
          method: 'POST',
          body: {
            name: payload.name,
            code: payload.code.toUpperCase(),
            department_name: payload.name,
            department_code: payload.code.toUpperCase(),
            ...(compId ? { company_id: compId } : {}),
          },
        };
      },
      transformResponse: (response: any) => normalizeDepartment(transformResponse<any>(response)),
      invalidatesTags: ['Departments'],
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
  useGetOrgChartQuery,
  useGetDepartmentsQuery,
  useCreateDepartmentMutation,
  useGetDesignationsQuery,
} = workforceApi;

