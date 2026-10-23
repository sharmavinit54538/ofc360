/**
 * @file workforceApi.ts
 * @description Enterprise RTK Query API service for Workforce Management:
 * headcount stats, employee directory CRUD and lifecycle transitions,
 * departments, designations, and the org chart. Plugs directly into the
 * OFC360 backend using baseQueryWithReauth.
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
} from '../types/workforce.types';

const transformResponse = <T>(response: any): T => {
  if (response && typeof response === 'object' && 'data' in response && response.data !== undefined) {
    return response.data as T;
  }
  return response as T;
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
     * Retrieve aggregate workforce KPI metrics, optionally scoped to a
     * department or location.
     */
    getWorkforceStats: builder.query<WorkforceStats, WorkforceStatsQueryParams | void>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params?.departmentId) searchParams.append('departmentId', params.departmentId);
        if (params?.location) searchParams.append('location', params.location);
        const queryString = searchParams.toString();
        return `/workforce/stats${queryString ? `?${queryString}` : ''}`;
      },
      transformResponse: (response: any) => transformResponse<WorkforceStats>(response),
      providesTags: ['WorkforceStats'],
    }),

    /**
     * Retrieve the paginated employee directory with search and filters.
     */
    getEmployees: builder.query<EmployeeListResponse, WorkforceFilterParams | void>({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters?.search) params.append('search', filters.search);
        if (filters?.departmentId) params.append('departmentId', filters.departmentId);
        if (filters?.designationId) params.append('designationId', filters.designationId);
        if (filters?.employmentType) params.append('employmentType', filters.employmentType);
        if (filters?.status) params.append('status', filters.status);
        if (filters?.location) params.append('location', filters.location);
        if (filters?.page) params.append('page', String(filters.page));
        if (filters?.limit) params.append('limit', String(filters.limit));

        const queryString = params.toString();
        return `/workforce/employees${queryString ? `?${queryString}` : ''}`;
      },
      transformResponse: (response: any): EmployeeListResponse => {
        const data = transformResponse<any>(response);
        if (Array.isArray(data)) {
          return { items: data, total: data.length, page: 1, limit: data.length };
        }
        return {
          items: data?.items || data?.employees || [],
          total: data?.total || data?.count || (data?.items ? data.items.length : 0),
          page: data?.page || 1,
          limit: data?.limit || 20,
        };
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
     */
    getEmployeeById: builder.query<EmployeeItem, string>({
      query: (id) => `/workforce/employees/${encodeURIComponent(id)}`,
      transformResponse: (response: any) => transformResponse<EmployeeItem>(response),
      providesTags: (_result, _error, id) => [{ type: 'EmployeeDetail', id }],
    }),

    /**
     * Create a new employee record.
     */
    createEmployee: builder.mutation<EmployeeItem, CreateEmployeePayload>({
      query: (payload) => ({
        url: '/workforce/employees',
        method: 'POST',
        body: payload,
      }),
      transformResponse: (response: any) => transformResponse<EmployeeItem>(response),
      invalidatesTags: ['EmployeesList', 'WorkforceStats', 'OrgChart', 'Departments'],
    }),

    /**
     * Update an existing employee record.
     */
    updateEmployee: builder.mutation<EmployeeItem, { id: string; data: UpdateEmployeePayload }>({
      query: ({ id, data }) => ({
        url: `/workforce/employees/${encodeURIComponent(id)}`,
        method: 'PUT',
        body: data,
      }),
      transformResponse: (response: any) => transformResponse<EmployeeItem>(response),
      invalidatesTags: ['EmployeesList', 'EmployeeDetail', 'OrgChart'],
    }),

    /**
     * Transition an employee to a new lifecycle status.
     */
    updateEmployeeStatus: builder.mutation<
      EmployeeItem,
      { id: string; data: UpdateEmployeeStatusPayload }
    >({
      query: ({ id, data }) => ({
        url: `/workforce/employees/${encodeURIComponent(id)}/status`,
        method: 'PATCH',
        body: data,
      }),
      transformResponse: (response: any) => transformResponse<EmployeeItem>(response),
      invalidatesTags: ['EmployeesList', 'EmployeeDetail', 'WorkforceStats', 'OrgChart'],
    }),

    /**
     * Retrieve the interactive organization hierarchy tree.
     */
    getOrgChart: builder.query<OrgChartNode | OrgChartNode[], void>({
      query: () => '/workforce/org-chart',
      transformResponse: (response: any) => transformResponse<OrgChartNode | OrgChartNode[]>(response),
      providesTags: ['OrgChart'],
    }),

    /**
     * Retrieve all configured departments.
     */
    getDepartments: builder.query<DepartmentItem[], void>({
      query: () => '/workforce/departments',
      transformResponse: (response: any) => {
        const data = transformResponse<any>(response);
        return Array.isArray(data) ? data : data?.items || data?.departments || [];
      },
      providesTags: ['Departments'],
    }),

    /**
     * Create a new department / cost center.
     */
    createDepartment: builder.mutation<DepartmentItem, DepartmentFormPayload>({
      query: (payload) => ({
        url: '/workforce/departments',
        method: 'POST',
        body: payload,
      }),
      transformResponse: (response: any) => transformResponse<DepartmentItem>(response),
      invalidatesTags: ['Departments'],
    }),

    /**
     * Retrieve job designations, optionally scoped to a department.
     */
    getDesignations: builder.query<DesignationItem[], DesignationQueryParams | void>({
      query: (params) => {
        const queryString = params?.departmentId
          ? `?departmentId=${encodeURIComponent(params.departmentId)}`
          : '';
        return `/workforce/designations${queryString}`;
      },
      transformResponse: (response: any) => {
        const data = transformResponse<any>(response);
        return Array.isArray(data) ? data : data?.items || data?.designations || [];
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
