import { createSlice } from "@reduxjs/toolkit";
import type { Employee, EmployeesState, OrgChartNode } from "./employeesTypes";
import {
  activateEmployee,
  createEmployee,
  deactivateEmployee,
  deleteEmployee,
  fetchEmployees,
  fetchOrgChart,
  resendEmployeeInvite,
  resetEmployeePassword,
  updateEmployee,
} from "./employeesThunk";

function buildOrgTreeFromEmployees(employees: Employee[]): OrgChartNode[] {
  if (!employees.length) return [];
  const map = new Map<string, OrgChartNode>();
  employees.forEach((emp) => {
    map.set(emp.id, {
      id: emp.id,
      fullName: emp.fullName,
      designation: emp.designation,
      department: emp.department,
      email: emp.email,
      managerId: emp.managerId,
      directReports: [],
    });
  });

  const roots: OrgChartNode[] = [];
  map.forEach((node) => {
    if (node.managerId && map.has(node.managerId)) {
      map.get(node.managerId)!.directReports.push(node);
    } else {
      roots.push(node);
    }
  });

  return roots;
}

const initialState: EmployeesState = {
  employees: [],
  orgChart: [],
  loading: false,
  submitting: false,
  error: null,
  total: 0,
  page: 1,
  limit: 10,
  pages: 0,
  has_next: false,
  has_previous: false,
};

const mutationThunks = [
  createEmployee,
  updateEmployee,
  resendEmployeeInvite,
  deactivateEmployee,
  activateEmployee,
  resetEmployeePassword,
];

const employeesSlice = createSlice({
  name: "employees",
  initialState,
  reducers: {
    clearEmployees(state) {
      state.employees = [];
      state.orgChart = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = action.payload.items;
        state.orgChart = buildOrgTreeFromEmployees(action.payload.items);
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
        state.pages = action.payload.pages;
        state.has_next = action.payload.has_next;
        state.has_previous = action.payload.has_previous;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        const raw = action.payload;
        state.error =
          typeof raw === "string"
            ? raw
            : raw && typeof raw === "object" && "message" in raw && typeof (raw as { message: unknown }).message === "string"
              ? (raw as { message: string }).message
              : (action.error.message ?? "Something went wrong");
      })
      .addCase(fetchOrgChart.fulfilled, (state, action) => {
        if (action.payload && action.payload.length > 0) {
          state.orgChart = action.payload;
        } else {
          state.orgChart = buildOrgTreeFromEmployees(state.employees);
        }
      })
      .addCase(fetchOrgChart.rejected, (state) => {
        state.orgChart = buildOrgTreeFromEmployees(state.employees);
      })
      .addCase(deleteEmployee.pending, (state) => {
        state.submitting = true;
      })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.submitting = false;
        state.employees = state.employees.filter((e) => e.id !== action.payload);
        state.orgChart = buildOrgTreeFromEmployees(state.employees);
      })
      .addCase(deleteEmployee.rejected, (state) => {
        state.submitting = false;
      });

    mutationThunks.forEach((thunk) => {
      builder
        .addCase(thunk.pending, (state) => {
          state.submitting = true;
        })
        .addCase(thunk.fulfilled, (state) => {
          state.submitting = false;
        })
        .addCase(thunk.rejected, (state) => {
          state.submitting = false;
        });
    });
  },
});

export const { clearEmployees } = employeesSlice.actions;
export default employeesSlice.reducer;
