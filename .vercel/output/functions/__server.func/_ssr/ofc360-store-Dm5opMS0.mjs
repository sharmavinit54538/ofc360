import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { a as fetchBaseQuery, c as createSlice, o as configureStore, s as createAsyncThunk, t as createApi } from "../_libs/@reduxjs/toolkit+[...].mjs";
import { t as axios } from "../_libs/axios+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ofc360-store-Dm5opMS0.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var OFFICES$1 = [
	"San Francisco HQ",
	"Bengaluru Tech Park",
	"London Office",
	"Singapore Hub",
	"New York Branch",
	"Dubai Office",
	"Remote"
];
var STATUS_OPTIONS$1 = [
	{
		value: "active",
		label: "Active",
		color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20"
	},
	{
		value: "inactive",
		label: "Inactive",
		color: "text-slate-500 bg-slate-500/10 border-slate-500/20"
	},
	{
		value: "hiring",
		label: "Hiring",
		color: "text-amber-500 bg-amber-500/10 border-amber-500/20"
	},
	{
		value: "growing",
		label: "Growing",
		color: "text-blue-500 bg-blue-500/10 border-blue-500/20"
	}
];
var THEME_COLORS = [
	{
		hex: "#3b82f6",
		label: "Vibrant Blue"
	},
	{
		hex: "#10b981",
		label: "Emerald Green"
	},
	{
		hex: "#ec4899",
		label: "Rose Pink"
	},
	{
		hex: "#8b5cf6",
		label: "Amethyst Violet"
	},
	{
		hex: "#f59e0b",
		label: "Amber Gold"
	},
	{
		hex: "#06b6d4",
		label: "Teal Cyan"
	},
	{
		hex: "#f43f5e",
		label: "Crimson Red"
	},
	{
		hex: "#64748b",
		label: "Slate Gray"
	}
];
var DEPARTMENT_ICONS = [
	{
		name: "Code2",
		label: "Engineering"
	},
	{
		name: "TrendingUp",
		label: "Product"
	},
	{
		name: "Paintbrush",
		label: "Design"
	},
	{
		name: "Briefcase",
		label: "Sales"
	},
	{
		name: "Megaphone",
		label: "Marketing"
	},
	{
		name: "Users",
		label: "HR"
	},
	{
		name: "DollarSign",
		label: "Finance"
	},
	{
		name: "Settings",
		label: "Operations"
	},
	{
		name: "Scale",
		label: "Legal"
	},
	{
		name: "Globe",
		label: "Global Success"
	},
	{
		name: "ShieldCheck",
		label: "Compliance & Security"
	},
	{
		name: "Building2",
		label: "General Admin"
	}
];
var DEFAULT_FILTERS$2 = {
	status: "all",
	office: "all",
	employeeCountRange: "all",
	managerId: "all",
	createdDateFrom: "",
	createdDateTo: ""
};
var EMPLOYEE_COUNT_RANGES = [
	{
		value: "all",
		label: "Any Size"
	},
	{
		value: "0-10",
		label: "Small (0-10)"
	},
	{
		value: "11-30",
		label: "Medium (11-30)"
	},
	{
		value: "31-50",
		label: "Large (31-50)"
	},
	{
		value: "50+",
		label: "Enterprise (50+)"
	}
];
var SEED_DEPARTMENTS = [];
var TOKENS_KEY = "ofc360:tokens";
function getTokens() {
	if (typeof window === "undefined") return null;
	try {
		const raw = localStorage.getItem(TOKENS_KEY);
		return raw ? JSON.parse(raw) : null;
	} catch {
		return null;
	}
}
function setTokens(tokens) {
	if (typeof window === "undefined") return;
	try {
		if (tokens) localStorage.setItem(TOKENS_KEY, JSON.stringify(tokens));
		else localStorage.removeItem(TOKENS_KEY);
	} catch {}
}
function parseJwtPayload(token) {
	try {
		const parts = token.split(".");
		if (parts.length !== 3) return null;
		const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
		const payload = JSON.parse(atob(base64));
		return payload && typeof payload === "object" ? payload : null;
	} catch {
		return null;
	}
}
/** Returns true when the access token is missing or past its expiry (with optional leeway). */
function isAccessTokenExpired(token, leewaySec = 30) {
	const payload = parseJwtPayload(token);
	if (!payload?.exp) return false;
	return Date.now() >= (payload.exp - leewaySec) * 1e3;
}
var API_HOST_URL = "https://api.ofc360.com".replace(/\/$/, "");
var BASE_URL = `${API_HOST_URL}/api/v1`;
var apiInstance = axios.create({
	baseURL: BASE_URL,
	timeout: 12e4,
	headers: { "Content-Type": "application/json" }
});
var isRefreshing = false;
var refreshSubscribers = [];
function subscribeTokenRefresh(cb) {
	refreshSubscribers.push(cb);
}
function onRefreshed(token) {
	refreshSubscribers.forEach((cb) => cb(token));
	refreshSubscribers = [];
}
async function refreshAccessToken() {
	const tokens = getTokens();
	if (!tokens?.refreshToken) throw new Error("No refresh token available");
	try {
		const res = await axios.post(`${BASE_URL}/auth/refresh`, { refresh_token: tokens.refreshToken });
		if (!res.data?.success || !res.data?.data) {
			setTokens(null);
			ofc360.set({
				isRestoring: false,
				user: null,
				company: null
			});
			throw new Error("Invalid session refresh response");
		}
		const newTokens = {
			accessToken: res.data.data.access_token,
			refreshToken: res.data.data.refresh_token
		};
		setTokens(newTokens);
		return newTokens.accessToken;
	} catch (error) {
		const status = error?.response?.status;
		if (status === 400 || status === 401 || status === 403) {
			setTokens(null);
			ofc360.set({
				isRestoring: false,
				user: null,
				company: null
			});
		}
		throw new Error("Failed to refresh session");
	}
}
apiInstance.interceptors.request.use((config) => {
	const tokens = getTokens();
	if (tokens?.accessToken) config.headers.Authorization = `Bearer ${tokens.accessToken}`;
	return config;
});
apiInstance.interceptors.response.use((response) => response, async (error) => {
	const originalRequest = error.config;
	if (error.response?.status !== 401 || !originalRequest || originalRequest._retry) return Promise.reject(error);
	const tokens = getTokens();
	if (tokens?.accessToken && !isAccessTokenExpired(tokens.accessToken)) return Promise.reject(error);
	if (!tokens?.refreshToken) {
		setTokens(null);
		ofc360.set({
			isRestoring: false,
			user: null,
			company: null
		});
		if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) window.location.replace("/login");
		return Promise.reject(error);
	}
	originalRequest._retry = true;
	if (!isRefreshing) {
		isRefreshing = true;
		try {
			const newAccessToken = await refreshAccessToken();
			isRefreshing = false;
			onRefreshed(newAccessToken);
		} catch (refreshError) {
			isRefreshing = false;
			refreshSubscribers = [];
			setTokens(null);
			ofc360.set({
				isRestoring: false,
				user: null,
				company: null
			});
			if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) window.location.replace("/login");
			return Promise.reject(refreshError);
		}
	}
	return new Promise((resolve, reject) => {
		subscribeTokenRefresh((token) => {
			originalRequest.headers.Authorization = `Bearer ${token}`;
			apiInstance(originalRequest).then(resolve).catch(reject);
		});
	});
});
function parseApiError(error, fallbackMessage = "An error occurred") {
	let message = fallbackMessage;
	let fieldErrors = {};
	let status = 500;
	if (error && typeof error === "object") {
		const statusVal = error.status || error.response?.status;
		if (statusVal) status = statusVal;
		const data = error.data || error.response?.data;
		if (data && typeof data === "object") {
			if (typeof data.message === "string" && data.message) message = data.message;
			else if (data.detail) {
				if (typeof data.detail === "string") message = data.detail;
				else if (Array.isArray(data.detail)) {
					const firstErr = data.detail[0];
					if (firstErr && typeof firstErr === "object") message = firstErr.msg || fallbackMessage;
					else if (firstErr) message = String(firstErr);
					data.detail.forEach((item) => {
						if (item && typeof item === "object" && Array.isArray(item.loc) && item.loc.length > 1) {
							const fieldName = item.loc[1];
							fieldErrors[fieldName] = String(item.msg || "Invalid value");
						}
					});
				}
			}
			if (data.errors) {
				if (typeof data.errors === "string") message = data.errors;
				else if (Array.isArray(data.errors)) {
					data.errors.forEach((err) => {
						if (err && typeof err === "object") {
							const fieldName = err.field || (Array.isArray(err.loc) ? err.loc[1] : null) || "unknown";
							const fieldMsg = err.message || err.msg || "Invalid value";
							fieldErrors[fieldName] = String(fieldMsg);
						}
					});
					const firstErr = data.errors[0];
					if (firstErr && typeof firstErr === "object") {
						const firstMsg = firstErr.message || firstErr.msg;
						if (firstMsg) message = String(firstMsg);
					}
				} else if (typeof data.errors === "object") {
					Object.entries(data.errors).forEach(([k, v]) => {
						if (v && typeof v === "object") {
							const obj = v;
							fieldErrors[k] = String(obj.message || obj.msg || JSON.stringify(v));
						} else fieldErrors[k] = String(v);
					});
					const firstErrorKey = Object.keys(data.errors)[0];
					if (firstErrorKey) {
						const firstVal = data.errors[firstErrorKey];
						if (firstVal && typeof firstVal === "object") message = String(firstVal.message || firstVal.msg || JSON.stringify(firstVal));
						else if (firstVal) message = String(firstVal);
					}
				}
			}
		} else if (error.message) message = error.message;
	} else if (error instanceof Error) message = error.message;
	if (message && typeof message === "object") {
		const obj = message;
		message = String(obj.message || obj.msg || JSON.stringify(message));
	} else message = String(message || fallbackMessage);
	return {
		message,
		fieldErrors,
		status
	};
}
function getErrorMessage(error, fallback) {
	return parseApiError(error, fallback).message;
}
async function tryApi(call, fallback) {
	try {
		return await call();
	} catch {
		return fallback;
	}
}
function syncWithEmployees(departments) {
	const workspace = ofc360.get();
	if (workspace.employees.length === 0) return departments;
	return departments.map((d) => {
		const matches = workspace.employees.filter((e) => e.department && e.department.toLowerCase() === d.name.toLowerCase());
		const matchIds = matches.map((m) => m.id);
		return {
			...d,
			employeeIds: matchIds,
			currentEmployeeCount: matches.length > 0 ? matches.length : d.currentEmployeeCount
		};
	});
}
var fetchDepartments = createAsyncThunk("departments/fetchDepartments", async () => {
	try {
		const response = await apiInstance.get("/departments");
		const items = response.data?.data?.items ?? response.data?.data ?? response.data ?? [];
		return syncWithEmployees(Array.isArray(items) && items.length > 0 ? items : SEED_DEPARTMENTS);
	} catch {
		return syncWithEmployees([...SEED_DEPARTMENTS]);
	}
});
var createDepartment = createAsyncThunk("departments/createDepartment", async (department) => {
	await tryApi(() => apiInstance.post("/departments", department), void 0);
	return department;
});
var updateDepartment = createAsyncThunk("departments/updateDepartment", async (department) => {
	await tryApi(() => apiInstance.put(`/departments/${department.id}`, department), void 0);
	return department;
});
var deleteDepartment = createAsyncThunk("departments/deleteDepartment", async (id) => {
	await tryApi(() => apiInstance.delete(`/departments/${id}`), void 0);
	return id;
});
var bulkDeleteDepartments = createAsyncThunk("departments/bulkDeleteDepartments", async (ids) => {
	await tryApi(() => apiInstance.post("/departments/bulk-delete", { ids }), void 0);
	return ids;
});
var bulkSetDepartmentStatus = createAsyncThunk("departments/bulkSetDepartmentStatus", async ({ ids, status }) => {
	await tryApi(() => apiInstance.patch("/departments/bulk-status", {
		ids,
		status
	}), void 0);
	return {
		ids,
		status
	};
});
var bulkAssignDepartmentManager = createAsyncThunk("departments/bulkAssignDepartmentManager", async (payload) => {
	await tryApi(() => apiInstance.patch("/departments/bulk-assign-manager", payload), void 0);
	return payload;
});
var importDepartments = createAsyncThunk("departments/importDepartments", async (departments) => {
	await tryApi(() => apiInstance.post("/departments/import", { departments }), void 0);
	return departments;
});
var addEmployeeToDepartment = createAsyncThunk("departments/addEmployeeToDepartment", async ({ deptId, employeeId }, { getState }) => {
	const workspace = ofc360.get();
	const dept = getState().departments.departments.find((d) => d.id === deptId);
	if (workspace.employees.find((e) => e.id === employeeId) && dept) {
		const updatedEmployees = workspace.employees.map((e) => e.id === employeeId ? {
			...e,
			department: dept.name,
			managerName: dept.departmentHeadName
		} : e);
		ofc360.set({ employees: updatedEmployees });
	}
	await tryApi(() => apiInstance.post(`/departments/${deptId}/employees`, { employeeId }), void 0);
	return {
		deptId,
		employeeId
	};
});
var removeEmployeeFromDepartment = createAsyncThunk("departments/removeEmployeeFromDepartment", async ({ deptId, employeeId }) => {
	const workspace = ofc360.get();
	if (workspace.employees.find((e) => e.id === employeeId)) {
		const updatedEmployees = workspace.employees.map((e) => e.id === employeeId ? {
			...e,
			department: "",
			managerName: ""
		} : e);
		ofc360.set({ employees: updatedEmployees });
	}
	await tryApi(() => apiInstance.delete(`/departments/${deptId}/employees/${employeeId}`), void 0);
	return {
		deptId,
		employeeId
	};
});
var transferDepartmentEmployees = createAsyncThunk("departments/transferDepartmentEmployees", async ({ fromDeptId, toDeptId }, { getState }) => {
	const state = getState();
	const fromDept = state.departments.departments.find((d) => d.id === fromDeptId);
	const toDept = state.departments.departments.find((d) => d.id === toDeptId);
	if (fromDept && toDept) {
		const idsToTransfer = fromDept.employeeIds;
		const updatedEmployees = ofc360.get().employees.map((e) => idsToTransfer.includes(e.id) ? {
			...e,
			department: toDept.name,
			managerName: toDept.departmentHeadName
		} : e);
		ofc360.set({ employees: updatedEmployees });
	}
	await tryApi(() => apiInstance.post("/departments/transfer-employees", {
		fromDeptId,
		toDeptId
	}), void 0);
	return {
		fromDeptId,
		toDeptId
	};
});
var promoteDepartmentEmployee = createAsyncThunk("departments/promoteDepartmentEmployee", async ({ employeeId, newDesignation }) => {
	const workspace = ofc360.get();
	if (workspace.employees.find((e) => e.id === employeeId)) {
		const updatedEmployees = workspace.employees.map((e) => e.id === employeeId ? {
			...e,
			designation: newDesignation
		} : e);
		ofc360.set({ employees: updatedEmployees });
	}
	await tryApi(() => apiInstance.patch(`/employees/${employeeId}/promote`, { designation: newDesignation }), void 0);
	return {
		employeeId,
		newDesignation
	};
});
var initialState$2 = {
	departments: [...SEED_DEPARTMENTS],
	loading: false,
	error: null
};
function updateEmployeeIds(departments, deptId, updater) {
	return departments.map((d) => {
		if (d.id !== deptId) return d;
		const employeeIds = updater(d.employeeIds);
		return {
			...d,
			employeeIds,
			currentEmployeeCount: employeeIds.length
		};
	});
}
var departmentsSlice = createSlice({
	name: "departments",
	initialState: initialState$2,
	reducers: { clearDepartments(state) {
		state.departments = [];
		state.error = null;
	} },
	extraReducers: (builder) => {
		builder.addCase(fetchDepartments.pending, (state) => {
			state.loading = true;
			state.error = null;
		}).addCase(fetchDepartments.fulfilled, (state, action) => {
			state.loading = false;
			state.departments = action.payload;
		}).addCase(fetchDepartments.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload ?? "Failed to load departments";
		}).addCase(createDepartment.fulfilled, (state, action) => {
			state.departments = [action.payload, ...state.departments];
		}).addCase(updateDepartment.fulfilled, (state, action) => {
			state.departments = state.departments.map((d) => d.id === action.payload.id ? action.payload : d);
		}).addCase(deleteDepartment.fulfilled, (state, action) => {
			state.departments = state.departments.filter((d) => d.id !== action.payload);
		}).addCase(bulkDeleteDepartments.fulfilled, (state, action) => {
			state.departments = state.departments.filter((d) => !action.payload.includes(d.id));
		}).addCase(bulkSetDepartmentStatus.fulfilled, (state, action) => {
			const { ids, status } = action.payload;
			state.departments = state.departments.map((d) => ids.includes(d.id) ? {
				...d,
				status
			} : d);
		}).addCase(bulkAssignDepartmentManager.fulfilled, (state, action) => {
			const { ids, managerId, managerName } = action.payload;
			state.departments = state.departments.map((d) => ids.includes(d.id) ? {
				...d,
				departmentHeadId: managerId,
				departmentHeadName: managerName
			} : d);
		}).addCase(importDepartments.fulfilled, (state, action) => {
			state.departments = [...action.payload, ...state.departments];
		}).addCase(addEmployeeToDepartment.fulfilled, (state, action) => {
			const { deptId, employeeId } = action.payload;
			state.departments = state.departments.map((d) => {
				if (d.id === deptId) {
					const ids = d.employeeIds.includes(employeeId) ? d.employeeIds : [...d.employeeIds, employeeId];
					return {
						...d,
						employeeIds: ids,
						currentEmployeeCount: ids.length
					};
				}
				if (d.id !== deptId && d.employeeIds.includes(employeeId)) {
					const ids = d.employeeIds.filter((id) => id !== employeeId);
					return {
						...d,
						employeeIds: ids,
						currentEmployeeCount: ids.length
					};
				}
				return d;
			});
		}).addCase(removeEmployeeFromDepartment.fulfilled, (state, action) => {
			const { deptId, employeeId } = action.payload;
			state.departments = updateEmployeeIds(state.departments, deptId, (ids) => ids.filter((id) => id !== employeeId));
		}).addCase(transferDepartmentEmployees.fulfilled, (state, action) => {
			const { fromDeptId, toDeptId } = action.payload;
			const fromDept = state.departments.find((d) => d.id === fromDeptId);
			if (!fromDept) return;
			const idsToTransfer = fromDept.employeeIds;
			state.departments = state.departments.map((d) => {
				if (d.id === fromDeptId) return {
					...d,
					employeeIds: [],
					currentEmployeeCount: 0
				};
				if (d.id === toDeptId) {
					const newIds = [.../* @__PURE__ */ new Set([...d.employeeIds, ...idsToTransfer])];
					return {
						...d,
						employeeIds: newIds,
						currentEmployeeCount: newIds.length
					};
				}
				return d;
			});
		});
	}
});
var { clearDepartments } = departmentsSlice.actions;
var departmentsSlice_default = departmentsSlice.reducer;
function mapEmployee(emp) {
	const managerObj = emp.manager;
	const firstName = String(emp.first_name ?? "");
	const lastName = String(emp.last_name ?? "");
	const fullName = `${firstName} ${lastName}`.trim() || String(emp.fullName ?? emp.name ?? "");
	const managerName = managerObj ? `${managerObj.first_name ?? ""} ${managerObj.last_name ?? ""}`.trim() : String(emp.manager_name ?? emp.managerName ?? "");
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
		roleMetadata: emp.role_metadata ?? emp.roleMetadata ?? {},
		addresses: emp.addresses ?? [],
		documents: emp.documents ?? [],
		education: emp.education ?? [],
		experience: emp.experience ?? [],
		skills: emp.skills ?? [],
		emergencyContacts: emp.emergency_contacts ?? emp.emergencyContacts ?? [],
		bankAccounts: emp.bank_accounts ?? emp.bankAccounts ?? [],
		status: String(emp.status ?? "INVITED"),
		activationToken: emp.activation_token,
		activationTokenExpiresAt: emp.activation_token_expires_at
	};
}
var fetchEmployees = createAsyncThunk("employees/fetchEmployees", async (params, thunkAPI) => {
	try {
		const searchParams = new URLSearchParams();
		if (params?.search) searchParams.set("search", params.search);
		if (params?.department && params.department !== "all") searchParams.set("department", params.department);
		if (params?.designation && params.designation !== "all") searchParams.set("designation", params.designation);
		if (params?.shift && params.shift !== "all") searchParams.set("shift", params.shift);
		if (params?.status && params.status !== "all") searchParams.set("status", params.status);
		if (params?.managerId) searchParams.set("manager_id", params.managerId);
		if (params?.sort) searchParams.set("sort", params.sort);
		if (params?.order) searchParams.set("order", params.order);
		if (params?.page) searchParams.set("page", String(params.page));
		if (params?.limit) searchParams.set("limit", String(params.limit));
		const data = (await apiInstance.get(`/employees?${searchParams.toString()}`)).data?.data ?? {};
		return {
			items: (data.items ?? []).map((item) => mapEmployee(item)),
			total: Number(data.total ?? 0),
			page: Number(data.page ?? 1),
			limit: Number(data.limit ?? 10),
			pages: Number(data.pages ?? 0),
			total_pages: Number(data.total_pages ?? data.pages ?? 0),
			has_next: Boolean(data.has_next ?? false),
			has_previous: Boolean(data.has_previous ?? false)
		};
	} catch (error) {
		return thunkAPI.rejectWithValue(parseApiError(error, "Failed to fetch employees"));
	}
});
var fetchOrgChart = createAsyncThunk("employees/fetchOrgChart", async (employeeId, thunkAPI) => {
	try {
		const url = employeeId ? `/employees/${employeeId}/org-chart` : "/employees/hierarchy";
		const response = await apiInstance.get(url);
		const data = response.data?.data ?? response.data ?? [];
		return Array.isArray(data) ? data : [data];
	} catch (error) {
		return thunkAPI.rejectWithValue(parseApiError(error, "Failed to fetch organization chart"));
	}
});
var createEmployee = createAsyncThunk("employees/createEmployee", async (payload, thunkAPI) => {
	try {
		await apiInstance.post("/employees", payload);
	} catch (error) {
		return thunkAPI.rejectWithValue(parseApiError(error, "Failed to add employee"));
	}
});
var updateEmployee = createAsyncThunk("employees/updateEmployee", async ({ id, payload }, thunkAPI) => {
	try {
		await apiInstance.put(`/employees/${id}`, payload);
	} catch (error) {
		return thunkAPI.rejectWithValue(parseApiError(error, "Failed to update employee"));
	}
});
var deleteEmployee = createAsyncThunk("employees/deleteEmployee", async (id, thunkAPI) => {
	try {
		await apiInstance.delete(`/employees/${id}`);
		return id;
	} catch (error) {
		return thunkAPI.rejectWithValue(parseApiError(error, "Failed to remove employee"));
	}
});
var resendEmployeeInvite = createAsyncThunk("employees/resendEmployeeInvite", async (id, thunkAPI) => {
	try {
		await apiInstance.post(`/employees/${id}/send-invite`);
	} catch (error) {
		return thunkAPI.rejectWithValue(parseApiError(error, "Failed to resend invitation"));
	}
});
var deactivateEmployee = createAsyncThunk("employees/deactivateEmployee", async (id, thunkAPI) => {
	try {
		await apiInstance.post(`/employees/${id}/deactivate`);
	} catch (error) {
		return thunkAPI.rejectWithValue(parseApiError(error, "Failed to deactivate employee"));
	}
});
var activateEmployee = createAsyncThunk("employees/activateEmployee", async (id, thunkAPI) => {
	try {
		await apiInstance.post(`/employees/${id}/activate-by-admin`);
	} catch (error) {
		return thunkAPI.rejectWithValue(parseApiError(error, "Failed to activate employee"));
	}
});
var resetEmployeePassword = createAsyncThunk("employees/resetEmployeePassword", async (id, thunkAPI) => {
	try {
		await apiInstance.post(`/employees/${id}/reset-password`);
	} catch (error) {
		return thunkAPI.rejectWithValue(parseApiError(error, "Failed to reset password"));
	}
});
function buildOrgTreeFromEmployees(employees) {
	if (!employees.length) return [];
	const map = /* @__PURE__ */ new Map();
	employees.forEach((emp) => {
		map.set(emp.id, {
			id: emp.id,
			fullName: emp.fullName,
			designation: emp.designation,
			department: emp.department,
			email: emp.email,
			managerId: emp.managerId,
			directReports: []
		});
	});
	const roots = [];
	map.forEach((node) => {
		if (node.managerId && map.has(node.managerId)) map.get(node.managerId).directReports.push(node);
		else roots.push(node);
	});
	return roots;
}
var initialState$1 = {
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
	has_previous: false
};
var mutationThunks$1 = [
	createEmployee,
	updateEmployee,
	resendEmployeeInvite,
	deactivateEmployee,
	activateEmployee,
	resetEmployeePassword
];
var employeesSlice = createSlice({
	name: "employees",
	initialState: initialState$1,
	reducers: { clearEmployees(state) {
		state.employees = [];
		state.orgChart = [];
		state.error = null;
	} },
	extraReducers: (builder) => {
		builder.addCase(fetchEmployees.pending, (state) => {
			state.loading = true;
			state.error = null;
		}).addCase(fetchEmployees.fulfilled, (state, action) => {
			state.loading = false;
			state.employees = action.payload.items;
			state.orgChart = buildOrgTreeFromEmployees(action.payload.items);
			state.total = action.payload.total;
			state.page = action.payload.page;
			state.limit = action.payload.limit;
			state.pages = action.payload.pages;
			state.has_next = action.payload.has_next;
			state.has_previous = action.payload.has_previous;
		}).addCase(fetchEmployees.rejected, (state, action) => {
			state.loading = false;
			const raw = action.payload;
			state.error = typeof raw === "string" ? raw : raw && typeof raw === "object" && "message" in raw && typeof raw.message === "string" ? raw.message : action.error.message ?? "Something went wrong";
		}).addCase(fetchOrgChart.fulfilled, (state, action) => {
			if (action.payload && action.payload.length > 0) state.orgChart = action.payload;
			else state.orgChart = buildOrgTreeFromEmployees(state.employees);
		}).addCase(fetchOrgChart.rejected, (state) => {
			state.orgChart = buildOrgTreeFromEmployees(state.employees);
		}).addCase(deleteEmployee.pending, (state) => {
			state.submitting = true;
		}).addCase(deleteEmployee.fulfilled, (state, action) => {
			state.submitting = false;
			state.employees = state.employees.filter((e) => e.id !== action.payload);
			state.orgChart = buildOrgTreeFromEmployees(state.employees);
		}).addCase(deleteEmployee.rejected, (state) => {
			state.submitting = false;
		});
		mutationThunks$1.forEach((thunk) => {
			builder.addCase(thunk.pending, (state) => {
				state.submitting = true;
			}).addCase(thunk.fulfilled, (state) => {
				state.submitting = false;
			}).addCase(thunk.rejected, (state) => {
				state.submitting = false;
			});
		});
	}
});
var { clearEmployees } = employeesSlice.actions;
var employeesSlice_default = employeesSlice.reducer;
var DEFAULT_PERMISSIONS = {
	canApproveLeave: false,
	canApproveAttendance: false,
	canManageEmployees: false,
	canViewPayroll: false,
	canEditDepartments: false,
	canInviteUsers: false,
	canManageRecruitment: false,
	canManagePerformance: false
};
var DEFAULT_MANAGER_FORM_STATE = {
	first_name: "",
	last_name: "",
	personal_email: "",
	phone: "",
	reporting_to: "",
	department: "",
	designation: "",
	joining_date: "",
	profile_photo_url: "",
	gender: "",
	date_of_birth: "",
	company_email: "",
	alternate_phone: "",
	blood_group: "",
	marital_status: "",
	branch: "",
	work_location: "",
	employment_type: "FULL_TIME",
	employment_status: "PROBATION",
	shift: "General",
	probation_period_months: 0,
	ctc: 0,
	basic_salary: 0,
	hra: 0,
	bonus: 0,
	pf: 0,
	esi: 0,
	professional_tax: 0,
	role: "manager",
	leave_group: "",
	permissions: {
		can_approve_leave: false,
		can_approve_attendance: false,
		can_manage_employees: false,
		can_view_payroll: false,
		can_edit_departments: false,
		can_invite_users: false,
		can_manage_recruitment: false,
		can_manage_performance: false
	},
	addresses: [],
	documents: [],
	education: [],
	experience: [],
	skills: [],
	emergency_contacts: []
};
var DEPARTMENTS = [
	{
		value: "Management",
		label: "Management"
	},
	{
		value: "Engineering",
		label: "Engineering",
		options: [
			"Developer",
			"Tester",
			"Designer"
		]
	},
	{
		value: "Sales&Marketing",
		label: "Sales & Marketing"
	},
	{
		value: "Core",
		label: "Core",
		options: [
			"CEO",
			"CTO",
			"Director",
			"CPO",
			"CMO"
		]
	}
];
var OFFICES = [
	"San Francisco HQ",
	"Bengaluru Tech Park",
	"London Office",
	"Singapore Hub",
	"New York Branch",
	"Dubai Office",
	"Remote"
];
var SHIFT_OPTIONS = [
	{
		value: "General",
		label: "General (9 AM – 6 PM)"
	},
	{
		value: "Morning",
		label: "Morning (6 AM – 3 PM)"
	},
	{
		value: "Evening",
		label: "Evening (3 PM – 12 AM)"
	},
	{
		value: "Night",
		label: "Night (12 AM – 9 AM)"
	},
	{
		value: "Flexible",
		label: "Flexible"
	}
];
/** Shift values for API payloads and legacy imports */
var SHIFTS = SHIFT_OPTIONS.map((opt) => opt.value);
var STATUS_OPTIONS = [
	{
		value: "PROBATION",
		label: "Probation"
	},
	{
		value: "CONFIRMED",
		label: "Confirmed"
	},
	{
		value: "NOTICE_PERIOD",
		label: "Notice Period"
	}
];
var EMPLOYMENT_TYPE_OPTIONS = [
	{
		value: "full_time",
		label: "Full Time"
	},
	{
		value: "part_time",
		label: "Part Time"
	},
	{
		value: "contract",
		label: "Contract"
	},
	{
		value: "intern",
		label: "Intern"
	}
];
var GENDER_OPTIONS = [
	{
		value: "male",
		label: "Male"
	},
	{
		value: "female",
		label: "Female"
	},
	{
		value: "other",
		label: "Other"
	},
	{
		value: "prefer_not_to_say",
		label: "Prefer not to say"
	}
];
var MANAGER_FORM_EMPLOYMENT_TYPE_OPTIONS = [
	{
		value: "FULL_TIME",
		label: "Full Time"
	},
	{
		value: "PART_TIME",
		label: "Part Time"
	},
	{
		value: "CONTRACT",
		label: "Contract"
	},
	{
		value: "INTERN",
		label: "Intern"
	}
];
var MANAGER_FORM_WORK_LOCATION_OPTIONS = [
	{
		value: "ON_SITE",
		label: "On Site"
	},
	{
		value: "REMOTE",
		label: "Remote"
	},
	{
		value: "HYBRID",
		label: "Hybrid"
	}
];
var DEFAULT_FILTERS$1 = {
	department: "all",
	status: "all",
	employmentType: "all",
	office: "all",
	teamSize: "all",
	joiningFrom: "",
	joiningTo: ""
};
var DEPARTMENT_GROUPS = [
	{
		value: "Management",
		label: "Management"
	},
	{
		value: "Engineering",
		label: "Engineering",
		options: [
			"Developer",
			"Tester",
			"Designer"
		]
	},
	{
		value: "Sales&Marketing",
		label: "Sales & Marketing"
	},
	{
		value: "Core",
		label: "Core",
		options: [
			"CEO",
			"CTO",
			"Director",
			"CPO",
			"CMO"
		]
	}
];
var DEPARTMENT_VALUES = DEPARTMENT_GROUPS.flatMap((group) => [
	group.value,
	...group.subgroups?.flatMap((sub) => [sub.value, ...sub.options]) ?? [],
	...group.options ?? []
]);
function resolveDepartmentValue(value) {
	if (!value) return void 0;
	const trimmed = value.trim();
	if (!trimmed) return void 0;
	if (DEPARTMENT_VALUES.includes(trimmed)) return trimmed;
	for (const group of DEPARTMENT_GROUPS) {
		if (group.label === trimmed) return group.value;
		for (const subgroup of group.subgroups ?? []) if (subgroup.label === trimmed || subgroup.value === trimmed) return subgroup.value;
	}
	return trimmed;
}
function getExpandedGroupsForValue(value) {
	const resolved = resolveDepartmentValue(value);
	if (!resolved) return [];
	for (const group of DEPARTMENT_GROUPS) {
		if (group.value === resolved) return [];
		if (group.options?.includes(resolved)) return [group.value];
		for (const subgroup of group.subgroups ?? []) if (subgroup.value === resolved || subgroup.options.includes(resolved)) return [group.value];
	}
	return [];
}
function getDepartmentLabel(value) {
	for (const group of DEPARTMENT_GROUPS) {
		if (group.value === value) return group.label;
		for (const subgroup of group.subgroups ?? []) {
			if (subgroup.value === value) return subgroup.label;
			if (subgroup.options.includes(value)) return value;
		}
		if (group.options?.includes(value)) return value;
	}
	return value;
}
function isParentGroupValue(value) {
	const group = DEPARTMENT_GROUPS.find((item) => item.value === value);
	return Boolean(group && ((group.options?.length ?? 0) > 0 || (group.subgroups?.length ?? 0) > 0));
}
function validateEmail(email) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function validatePhone(phone) {
	return phone.trim().length >= 7;
}
function validateManagerForm(form, existingManagers, isEdit, editingId) {
	const errors = {};
	if (!form.first_name?.trim()) errors.first_name = "First name is required";
	if (!form.last_name?.trim()) errors.last_name = "Last name is required";
	if (!form.personal_email?.trim()) errors.personal_email = "Email is required";
	else if (!validateEmail(form.personal_email)) errors.personal_email = "Invalid email address";
	if (!form.phone?.trim()) errors.phone = "Phone is required";
	else if (!validatePhone(form.phone)) errors.phone = "Invalid phone number";
	if (!form.department?.trim()) errors.department = "Department is required";
	if (!form.designation?.trim()) errors.designation = "Designation is required";
	if (!form.date_of_birth?.trim()) errors.date_of_birth = "Date of birth is required";
	if (!form.gender?.trim()) errors.gender = "Gender is required";
	if (!form.branch?.trim()) errors.branch = "Office location is required";
	if (!form.work_location?.trim()) errors.work_location = "Work location is required";
	if (!form.joining_date?.trim()) errors.joining_date = "Joining date is required";
	if (form.personal_email) {
		if (existingManagers.find((m) => m.email.toLowerCase() === form.personal_email.toLowerCase() && (!isEdit || m.id !== editingId))) errors.personal_email = "Email already registered";
	}
	return {
		valid: Object.keys(errors).length === 0,
		errors
	};
}
function resolveShiftValue(shift) {
	return SHIFT_OPTIONS.find((opt) => opt.value === shift || opt.label === shift)?.value ?? shift;
}
/** Normalizes API gender strings (e.g. `"FEMALE"`) to form option values (e.g. `"female"`). */
function resolveGenderValue(gender) {
	if (!gender?.trim()) return "";
	const normalized = gender.trim().toLowerCase().replace(/\s+/g, "_");
	return GENDER_OPTIONS.find((opt) => opt.value === normalized || opt.label.toLowerCase().replace(/\s+/g, "_") === normalized)?.value ?? normalized;
}
/** Normalizes API date strings to `YYYY-MM-DD` for HTML date inputs. */
function toDateInputValue(value) {
	if (!value?.trim()) return "";
	const trimmed = value.trim();
	if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;
	const isoDate = trimmed.split("T")[0];
	if (/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) return isoDate;
	const parsed = new Date(trimmed);
	if (!Number.isNaN(parsed.getTime())) return parsed.toISOString().split("T")[0];
	return trimmed;
}
/** Reads a display/id string from API scalars or nested `{ id, name, label, value }` objects. */
function readApiScalar(value) {
	if (value == null) return "";
	if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") return String(value).trim();
	if (typeof value === "object" && !Array.isArray(value)) {
		const obj = value;
		return String(obj.name ?? obj.label ?? obj.title ?? obj.value ?? obj.code ?? obj.id ?? obj.user_id ?? obj.employee_id ?? "").trim();
	}
	return "";
}
/** Flattens common nested API envelopes (`employee`, `user`, `manager`, etc.). */
function unwrapManagerApiRecord(raw) {
	const nested = raw.employee ?? raw.user ?? raw.manager ?? raw.profile ?? raw.data;
	if (nested && typeof nested === "object" && !Array.isArray(nested)) return {
		...raw,
		...nested
	};
	return raw;
}
function resolveGenderFromApi(value) {
	return resolveGenderValue(readApiScalar(value));
}
function resolveDepartmentFromApi(raw) {
	const candidate = readApiScalar(raw.department) || readApiScalar(raw.department_name) || readApiScalar(raw.departmentName);
	return resolveDepartmentValue(candidate) ?? candidate;
}
function resolveBranchFromApi(raw) {
	return readApiScalar(raw.branch) || readApiScalar(raw.branch_name) || readApiScalar(raw.office) || readApiScalar(raw.office_location) || readApiScalar(raw.officeLocation) || "";
}
function resolveWorkLocationFormValue(raw) {
	const value = readApiScalar(raw.work_location ?? raw.workLocation);
	if (!value) return "";
	const normalized = value.toLowerCase().replace(/[\s-]+/g, "_");
	const map = {
		on_site: "ON_SITE",
		onsite: "ON_SITE",
		remote: "REMOTE",
		wfh: "REMOTE",
		work_from_home: "REMOTE",
		hybrid: "HYBRID"
	};
	if (map[normalized]) return map[normalized];
	const upper = value.toUpperCase();
	if (upper === "ON_SITE" || upper === "REMOTE" || upper === "HYBRID") return upper;
	return upper;
}
function resolveReportingToId(raw) {
	const reportingTo = raw.reporting_to ?? raw.reportingTo ?? raw.reporting_manager ?? raw.reportingManager;
	if (reportingTo && typeof reportingTo === "object") {
		const obj = reportingTo;
		return String(obj.id ?? obj.user_id ?? obj.employee_id ?? "").trim();
	}
	if (reportingTo != null && reportingTo !== "") return String(reportingTo).trim();
	if (raw.reporting_manager_id != null) return String(raw.reporting_manager_id).trim();
	return "";
}
function mapApiPermissions(raw) {
	if (!raw || typeof raw !== "object") return { ...DEFAULT_MANAGER_FORM_STATE.permissions };
	const p = raw;
	return {
		can_approve_leave: Boolean(p.can_approve_leave ?? p.canApproveLeave),
		can_approve_attendance: Boolean(p.can_approve_attendance ?? p.canApproveAttendance),
		can_manage_employees: Boolean(p.can_manage_employees ?? p.canManageEmployees),
		can_view_payroll: Boolean(p.can_view_payroll ?? p.canViewPayroll),
		can_edit_departments: Boolean(p.can_edit_departments ?? p.canEditDepartments),
		can_invite_users: Boolean(p.can_invite_users ?? p.canInviteUsers),
		can_manage_recruitment: Boolean(p.can_manage_recruitment ?? p.canManageRecruitment),
		can_manage_performance: Boolean(p.can_manage_performance ?? p.canManagePerformance)
	};
}
/** Maps a full `/managers/{id}` API response into edit form state. */
function apiManagerToFormState(raw) {
	const data = unwrapManagerApiRecord(raw);
	return {
		...DEFAULT_MANAGER_FORM_STATE,
		first_name: readApiScalar(data.first_name ?? data.firstName),
		last_name: readApiScalar(data.last_name ?? data.lastName),
		personal_email: readApiScalar(data.personal_email ?? data.personalEmail ?? data.email),
		company_email: readApiScalar(data.company_email ?? data.companyEmail),
		phone: readApiScalar(data.phone),
		alternate_phone: readApiScalar(data.alternate_phone ?? data.alternatePhone),
		reporting_to: resolveReportingToId(data),
		department: resolveDepartmentFromApi(data),
		designation: readApiScalar(data.designation),
		joining_date: toDateInputValue(readApiScalar(data.joining_date ?? data.joiningDate)),
		profile_photo_url: readApiScalar(data.profile_photo_url ?? data.profilePhotoUrl ?? data.profile_image ?? data.profileImage),
		gender: resolveGenderFromApi(data.gender),
		date_of_birth: toDateInputValue(readApiScalar(data.date_of_birth ?? data.dob ?? data.dateOfBirth)),
		blood_group: readApiScalar(data.blood_group ?? data.bloodGroup),
		marital_status: readApiScalar(data.marital_status ?? data.maritalStatus),
		branch: resolveBranchFromApi(data),
		work_location: resolveWorkLocationFormValue(data),
		employment_type: readApiScalar(data.employment_type ?? data.employmentType).toUpperCase() || "FULL_TIME",
		employment_status: readApiScalar(data.employment_status ?? data.status).toUpperCase() || "PROBATION",
		shift: resolveShiftValue(readApiScalar(data.shift) || "General"),
		probation_period_months: Number(data.probation_period_months ?? 0),
		ctc: Number(data.ctc ?? data.salary ?? 0),
		basic_salary: Number(data.basic_salary ?? 0),
		hra: Number(data.hra ?? 0),
		bonus: Number(data.bonus ?? 0),
		pf: Number(data.pf ?? 0),
		esi: Number(data.esi ?? 0),
		professional_tax: Number(data.professional_tax ?? 0),
		role: readApiScalar(data.role) || "manager",
		leave_group: readApiScalar(data.leave_group ?? data.leaveGroup),
		permissions: mapApiPermissions(data.permissions),
		addresses: Array.isArray(data.addresses) ? data.addresses : [],
		documents: Array.isArray(data.documents) ? data.documents : [],
		education: Array.isArray(data.education) ? data.education : [],
		experience: Array.isArray(data.experience) ? data.experience : [],
		skills: Array.isArray(data.skills) ? data.skills : [],
		emergency_contacts: Array.isArray(data.emergency_contacts ?? data.emergencyContacts) ? data.emergency_contacts ?? data.emergencyContacts : []
	};
}
function mapApiFieldErrors(fieldErrors) {
	return { ...fieldErrors };
}
function applyFilters(managers, query, filters) {
	const q = query.toLowerCase().trim();
	return managers.filter((m) => {
		if (q) {
			if (!(m.fullName.toLowerCase().includes(q) || m.managerId.toLowerCase().includes(q) || m.employeeId.toLowerCase().includes(q) || m.email.toLowerCase().includes(q) || m.phone.toLowerCase().includes(q) || m.department.toLowerCase().includes(q))) return false;
		}
		if (filters.department !== "all" && m.department !== filters.department) return false;
		if (filters.status !== "all" && m.status !== filters.status) return false;
		if (filters.employmentType !== "all" && m.employmentType !== filters.employmentType) return false;
		if (filters.office !== "all" && m.office !== filters.office) return false;
		if (filters.teamSize !== "all") {
			const ts = m.teamSize;
			if (filters.teamSize === "1-5" && !(ts >= 1 && ts <= 5)) return false;
			if (filters.teamSize === "6-10" && !(ts >= 6 && ts <= 10)) return false;
			if (filters.teamSize === "11-20" && !(ts >= 11 && ts <= 20)) return false;
			if (filters.teamSize === "20+" && ts <= 20) return false;
		}
		if (filters.joiningFrom && m.joiningDate < filters.joiningFrom) return false;
		if (filters.joiningTo && m.joiningDate > filters.joiningTo) return false;
		return true;
	});
}
function applySorting(managers, field, dir) {
	return [...managers].sort((a, b) => {
		let va;
		let vb;
		switch (field) {
			case "fullName":
				va = a.fullName;
				vb = b.fullName;
				break;
			case "department":
				va = a.department;
				vb = b.department;
				break;
			case "teamSize":
				va = a.teamSize;
				vb = b.teamSize;
				break;
			case "joiningDate":
				va = a.joiningDate;
				vb = b.joiningDate;
				break;
			case "lastActive":
				va = a.lastActive;
				vb = b.lastActive;
				break;
			case "status":
				va = a.status;
				vb = b.status;
				break;
			default:
				va = a.fullName;
				vb = b.fullName;
		}
		if (typeof va === "number" && typeof vb === "number") return dir === "asc" ? va - vb : vb - va;
		const cmp = String(va).localeCompare(String(vb));
		return dir === "asc" ? cmp : -cmp;
	});
}
function getVisiblePages(currentPage, totalPages) {
	if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
	const pages = /* @__PURE__ */ new Set([
		1,
		totalPages,
		currentPage
	]);
	if (currentPage > 1) pages.add(currentPage - 1);
	if (currentPage < totalPages) pages.add(currentPage + 1);
	return Array.from(pages).sort((a, b) => a - b);
}
function buildCSV(managers) {
	const headers = [
		"Employee ID",
		"Full Name",
		"Email",
		"Phone",
		"Department",
		"Designation",
		"Role",
		"Status",
		"Employment Type",
		"Office",
		"Work Location",
		"Team Size",
		"Joining Date",
		"Last Active"
	];
	const rows = managers.map((m) => [
		m.employeeId,
		m.fullName,
		m.email,
		m.phone,
		m.department,
		m.designation,
		m.managerRole,
		m.status,
		m.employmentType,
		m.office,
		m.workLocation,
		m.teamSize,
		m.joiningDate,
		m.lastActive
	].map((v) => `"${String(v ?? "").replace(/"/g, "\"\"")}"`).join(","));
	return [headers.join(","), ...rows].join("\n");
}
function avatarHue(name) {
	const safe = name ?? "";
	return Array.from(safe).reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
}
function labelFor(value, options) {
	return options.find((o) => o.value === value)?.label ?? value;
}
function fmtDate(iso) {
	if (!iso) return "—";
	const [y, m, d] = iso.split("T")[0].split("-");
	return `${[
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec"
	][parseInt(m) - 1]} ${parseInt(d)}, ${y}`;
}
function fmtRelative(iso) {
	if (!iso) return "—";
	const then = new Date(iso);
	const diffMs = (/* @__PURE__ */ new Date("2026-06-25T18:00:00")).getTime() - then.getTime();
	const diffMins = Math.floor(diffMs / 6e4);
	if (diffMins < 60) return `${diffMins}m ago`;
	const diffHours = Math.floor(diffMins / 60);
	if (diffHours < 24) return `${diffHours}h ago`;
	const diffDays = Math.floor(diffHours / 24);
	if (diffDays < 30) return `${diffDays}d ago`;
	return fmtDate(iso);
}
function fromApiGender(value) {
	const resolved = resolveGenderValue(readApiScalar(value));
	if (GENDER_OPTIONS.some((opt) => opt.value === resolved)) return resolved;
	return "prefer_not_to_say";
}
function fromApiEmploymentType(value) {
	return {
		FULL_TIME: "full_time",
		PART_TIME: "part_time",
		CONTRACT: "contract",
		INTERN: "intern"
	}[String(value ?? "FULL_TIME").toUpperCase()] ?? "full_time";
}
function fromApiEmploymentStatus(value) {
	return {
		PROBATION: "PROBATION",
		CONFIRMED: "CONFIRMED",
		NOTICE_PERIOD: "NOTICE_PERIOD"
	}[String(value ?? "PROBATION").toUpperCase()] ?? "PROBATION";
}
function fromApiWorkLocation(value) {
	const normalized = readApiScalar(value).toLowerCase().replace(/[\s-]+/g, "_");
	if (normalized === "remote" || normalized === "wfh" || normalized === "work_from_home") return "remote";
	if (normalized === "hybrid") return "hybrid";
	if (normalized === "on_site" || normalized === "onsite") return "on_site";
	return "on_site";
}
function resolveReportingManager(raw) {
	const data = unwrapManagerApiRecord(raw);
	const reportingTo = data.reporting_to ?? data.reportingTo ?? data.reporting_manager ?? data.reportingManager;
	let id = null;
	let name = readApiScalar(data.reporting_manager_name ?? data.reportingManagerName);
	if (reportingTo && typeof reportingTo === "object") {
		const obj = reportingTo;
		const firstName = readApiScalar(obj.first_name ?? obj.firstName);
		const lastName = readApiScalar(obj.last_name ?? obj.lastName);
		name = readApiScalar(obj.full_name ?? obj.fullName ?? obj.name) || `${firstName} ${lastName}`.trim() || name;
		const idRaw = obj.id ?? obj.user_id ?? obj.employee_id;
		id = idRaw != null ? String(idRaw) : null;
	} else if (reportingTo != null && reportingTo !== "") id = String(reportingTo);
	else if (data.reporting_manager_id != null) id = String(data.reporting_manager_id);
	return {
		id,
		code: readApiScalar(data.reportingManagerId),
		name
	};
}
function mapPermissions(raw) {
	if (!raw || typeof raw !== "object") return DEFAULT_PERMISSIONS;
	const p = raw;
	return {
		canApproveLeave: Boolean(p.can_approve_leave ?? p.canApproveLeave),
		canApproveAttendance: Boolean(p.can_approve_attendance ?? p.canApproveAttendance),
		canManageEmployees: Boolean(p.can_manage_employees ?? p.canManageEmployees),
		canViewPayroll: Boolean(p.can_view_payroll ?? p.canViewPayroll),
		canEditDepartments: Boolean(p.can_edit_departments ?? p.canEditDepartments),
		canInviteUsers: Boolean(p.can_invite_users ?? p.canInviteUsers),
		canManageRecruitment: Boolean(p.can_manage_recruitment ?? p.canManageRecruitment),
		canManagePerformance: Boolean(p.can_manage_performance ?? p.canManagePerformance)
	};
}
function mapManager(raw) {
	const data = unwrapManagerApiRecord(raw);
	const firstName = readApiScalar(data.first_name ?? data.firstName);
	const lastName = readApiScalar(data.last_name ?? data.lastName);
	const fullName = readApiScalar(data.full_name ?? data.fullName ?? data.name) || `${firstName} ${lastName}`.trim() || "Unknown Manager";
	const reportingManager = resolveReportingManager(data);
	const permissions = mapPermissions(data.permissions);
	const attendance = data.attendance_summary ?? data.attendanceSummary;
	const leaveBalance = data.leave_balance ?? data.leaveBalance;
	const recentActivity = data.recent_activity ?? data.recentActivity;
	return {
		id: readApiScalar(data.id),
		managerId: readApiScalar(data.manager_id ?? data.managerId),
		employeeId: readApiScalar(data.employee_id ?? data.employeeId) || readApiScalar(data.manager_id ?? data.managerId) || readApiScalar(data.id),
		firstName: firstName || fullName.split(" ")[0] || "Manager",
		lastName: lastName || fullName.split(" ").slice(1).join(" "),
		fullName,
		email: readApiScalar(data.personal_email ?? data.company_email ?? data.email),
		phone: readApiScalar(data.phone),
		dob: readApiScalar(data.dob ?? data.date_of_birth),
		gender: fromApiGender(data.gender),
		profileImage: readApiScalar(data.profile_photo_url ?? data.profile_image ?? data.profileImage) || void 0,
		department: readApiScalar(data.department ?? data.department_name ?? data.departmentName),
		designation: readApiScalar(data.designation),
		managerRole: readApiScalar(data.manager_role ?? data.managerRole) || "team_lead",
		reportingManagerId: reportingManager.id,
		reportingManagerCode: reportingManager.code,
		reportingManagerName: reportingManager.name,
		office: readApiScalar(data.branch ?? data.office ?? data.office_location),
		workLocation: fromApiWorkLocation(data.work_location ?? data.workLocation),
		joiningDate: readApiScalar(data.joining_date ?? data.joiningDate),
		employmentType: fromApiEmploymentType(data.employment_type ?? data.employmentType),
		shift: readApiScalar(data.shift) || "General",
		salary: data.ctc != null ? Number(data.ctc) : data.salary != null ? Number(data.salary) : void 0,
		status: fromApiEmploymentStatus(data.employment_status ?? data.status),
		teamSize: Number(data.team_size ?? data.teamSize ?? 0),
		teamIds: Array.isArray(data.team_ids) ? data.team_ids.map(String) : Array.isArray(data.teamIds) ? data.teamIds.map(String) : [],
		permissions,
		lastActive: readApiScalar(data.last_active ?? data.lastActive) || (/* @__PURE__ */ new Date()).toISOString(),
		attendanceSummary: {
			present: Number(attendance?.present ?? 0),
			absent: Number(attendance?.absent ?? 0),
			late: Number(attendance?.late ?? 0),
			leave: Number(attendance?.leave ?? 0)
		},
		leaveBalance: {
			annual: Number(leaveBalance?.annual ?? 0),
			sick: Number(leaveBalance?.sick ?? 0),
			casual: Number(leaveBalance?.casual ?? 0)
		},
		bloodGroup: readApiScalar(data.blood_group ?? data.bloodGroup),
		maritalStatus: readApiScalar(data.marital_status ?? data.maritalStatus),
		performanceScore: Number(data.performance_score ?? data.performanceScore ?? 0),
		recentActivity: Array.isArray(recentActivity) ? recentActivity : []
	};
}
var fetchManagerById = createAsyncThunk("managers/fetchManagerById", async (id, thunkAPI) => {
	try {
		const response = await apiInstance.get(`/managers/${id}`);
		const raw = unwrapManagerApiRecord(response.data?.data ?? response.data);
		return {
			manager: mapManager(raw),
			formState: apiManagerToFormState(raw)
		};
	} catch (error) {
		return thunkAPI.rejectWithValue(parseApiError(error, "Failed to load manager details").message);
	}
});
var fetchManagers = createAsyncThunk("managers/fetchManagers", async (params, thunkAPI) => {
	try {
		const page = params?.page ?? 1;
		const limit = params?.limit ?? 20;
		const searchParams = new URLSearchParams();
		searchParams.set("page", String(page));
		searchParams.set("limit", String(limit));
		if (params?.search?.trim()) searchParams.set("search", params.search.trim());
		const response = await apiInstance.get(`/managers?${searchParams.toString()}`);
		const payload = response.data?.data ?? response.data ?? {};
		const items = payload.items ?? payload.managers ?? payload.results ?? (Array.isArray(payload) ? payload : []);
		const mapped = Array.isArray(items) ? items.map((item) => mapManager(item)) : [];
		const total = Number(payload.total ?? payload.total_count ?? payload.count ?? mapped.length);
		const resolvedLimit = Number(payload.limit ?? limit);
		return {
			items: mapped,
			total,
			page: Number(payload.page ?? page),
			limit: resolvedLimit,
			totalPages: Math.max(1, Number(payload.total_pages ?? payload.totalPages ?? payload.pages ?? Math.ceil(total / Math.max(resolvedLimit, 1))))
		};
	} catch (error) {
		return thunkAPI.rejectWithValue(parseApiError(error, "Failed to load managers").message);
	}
});
var createManager = createAsyncThunk("managers/createManager", async (payload, thunkAPI) => {
	try {
		const response = await apiInstance.post("/managers", payload);
		return mapManager(response.data?.data ?? response.data);
	} catch (error) {
		return thunkAPI.rejectWithValue(parseApiError(error, "Failed to create manager"));
	}
});
var updateManager = createAsyncThunk("managers/updateManager", async ({ id, payload }, thunkAPI) => {
	try {
		const response = await apiInstance.put(`/managers/${id}`, payload);
		return mapManager(response.data?.data ?? response.data);
	} catch (error) {
		return thunkAPI.rejectWithValue(parseApiError(error, "Failed to update manager"));
	}
});
var deleteManager = createAsyncThunk("managers/deleteManager", async (id, thunkAPI) => {
	try {
		await apiInstance.delete(`/managers/${id}`);
		return id;
	} catch (error) {
		return thunkAPI.rejectWithValue(parseApiError(error, "Failed to delete manager"));
	}
});
var importManagers = createAsyncThunk("managers/importManagers", async (managers) => {
	await tryApi(() => apiInstance.post("/managers/import", { managers }), void 0);
	return managers;
});
var managersSlice = createSlice({
	name: "managers",
	initialState: {
		managers: [],
		loading: true,
		submitting: false,
		error: null,
		total: 0,
		page: 1,
		limit: 20,
		totalPages: 1,
		managerForm: DEFAULT_MANAGER_FORM_STATE,
		selectedManager: null,
		selectedManagerForm: null,
		selectedManagerLoading: false,
		selectedManagerError: null
	},
	reducers: {
		clearManagers(state) {
			state.managers = [];
			state.error = null;
		},
		setManagerForm(state, action) {
			state.managerForm = {
				...state.managerForm,
				...action.payload
			};
		},
		resetManagerForm(state) {
			state.managerForm = { ...DEFAULT_MANAGER_FORM_STATE };
		},
		initManagerForm(state, action) {
			state.managerForm = action.payload;
		},
		clearSelectedManager(state) {
			state.selectedManager = null;
			state.selectedManagerForm = null;
			state.selectedManagerLoading = false;
			state.selectedManagerError = null;
		}
	},
	extraReducers: (builder) => {
		builder.addCase(fetchManagers.pending, (state, action) => {
			if (!action.meta.arg?.silent) {
				state.loading = true;
				state.error = null;
			}
		}).addCase(fetchManagers.fulfilled, (state, action) => {
			state.loading = false;
			state.managers = action.payload.items;
			state.total = action.payload.total;
			state.page = action.payload.page;
			state.limit = action.payload.limit;
			state.totalPages = action.payload.totalPages;
		}).addCase(fetchManagers.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload ?? "Failed to load managers";
		}).addCase(createManager.pending, (state) => {
			state.submitting = true;
		}).addCase(createManager.fulfilled, (state) => {
			state.submitting = false;
		}).addCase(createManager.rejected, (state) => {
			state.submitting = false;
		}).addCase(updateManager.pending, (state) => {
			state.submitting = true;
		}).addCase(updateManager.fulfilled, (state, action) => {
			state.submitting = false;
			state.managers = state.managers.map((m) => m.id === action.payload.id ? action.payload : m);
		}).addCase(updateManager.rejected, (state) => {
			state.submitting = false;
		}).addCase(deleteManager.pending, (state) => {
			state.submitting = true;
		}).addCase(deleteManager.fulfilled, (state, action) => {
			state.submitting = false;
			state.managers = state.managers.filter((m) => m.id !== action.payload);
		}).addCase(deleteManager.rejected, (state) => {
			state.submitting = false;
		}).addCase(importManagers.pending, (state) => {
			state.submitting = true;
		}).addCase(importManagers.fulfilled, (state, action) => {
			state.submitting = false;
			state.managers = [...action.payload, ...state.managers];
		}).addCase(importManagers.rejected, (state) => {
			state.submitting = false;
		}).addCase(fetchManagerById.pending, (state) => {
			state.selectedManagerLoading = true;
			state.selectedManagerError = null;
			state.selectedManager = null;
			state.selectedManagerForm = null;
		}).addCase(fetchManagerById.fulfilled, (state, action) => {
			state.selectedManagerLoading = false;
			state.selectedManager = action.payload.manager;
			state.selectedManagerForm = action.payload.formState;
		}).addCase(fetchManagerById.rejected, (state, action) => {
			state.selectedManagerLoading = false;
			state.selectedManagerError = action.payload ?? "Failed to load manager details";
		});
	}
});
var { clearManagers, setManagerForm, resetManagerForm, initManagerForm, clearSelectedManager } = managersSlice.actions;
var managersSlice_default = managersSlice.reducer;
var REVIEW_STATUS_OPTIONS = [
	{
		value: "draft",
		label: "Draft",
		color: "text-slate-500 bg-slate-500/10 border-slate-500/20"
	},
	{
		value: "in_review",
		label: "In Review",
		color: "text-amber-500 bg-amber-500/10 border-amber-500/20"
	},
	{
		value: "approved",
		label: "Approved",
		color: "text-blue-500 bg-blue-500/10 border-blue-500/20"
	},
	{
		value: "completed",
		label: "Completed",
		color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20"
	}
];
var RATING_BADGES = {
	5: {
		label: "Excellent",
		color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
	},
	4: {
		label: "Good",
		color: "bg-blue-500/10 text-blue-500 border-blue-500/20"
	},
	3: {
		label: "Average",
		color: "bg-amber-500/10 text-amber-500 border-amber-500/20"
	},
	2: {
		label: "Needs Improvement",
		color: "bg-orange-500/10 text-orange-500 border-orange-500/20"
	},
	1: {
		label: "Poor",
		color: "bg-rose-500/10 text-rose-500 border-rose-500/20"
	}
};
var PROMOTION_STATUS_OPTIONS = [
	{
		value: "not_recommended",
		label: "Not Recommended"
	},
	{
		value: "eligible",
		label: "Eligible"
	},
	{
		value: "recommended",
		label: "Recommended"
	},
	{
		value: "promoted",
		label: "Promoted"
	}
];
var DEFAULT_FILTERS = {
	department: "all",
	manager: "all",
	rating: "all",
	reviewStatus: "all",
	promotionEligible: "all",
	scoreMin: "",
	scoreMax: "",
	reviewDateFrom: "",
	reviewDateTo: ""
};
var SEED_REVIEWS = [];
var SEED_GOALS = [];
var SEED_FEEDBACK = [];
var SEED_REWARDS = [];
var SEED_COURSES = [];
var emptyData = {
	reviews: [...SEED_REVIEWS],
	goals: [...SEED_GOALS],
	feedback360: [...SEED_FEEDBACK],
	rewards: [...SEED_REWARDS],
	courses: [...SEED_COURSES]
};
var fetchPerformance = createAsyncThunk("performance/fetchPerformance", async () => {
	return tryApi(async () => {
		const response = await apiInstance.get("/performance");
		const data = response.data?.data ?? response.data ?? {};
		return {
			reviews: data.reviews ?? SEED_REVIEWS,
			goals: data.goals ?? SEED_GOALS,
			feedback360: data.feedback360 ?? SEED_FEEDBACK,
			rewards: data.rewards ?? SEED_REWARDS,
			courses: data.courses ?? SEED_COURSES
		};
	}, emptyData);
});
var createReview = createAsyncThunk("performance/createReview", async (review) => {
	await tryApi(() => apiInstance.post("/performance/reviews", review), void 0);
	return review;
});
var updateReview = createAsyncThunk("performance/updateReview", async (review) => {
	await tryApi(() => apiInstance.put(`/performance/reviews/${review.id}`, review), void 0);
	return review;
});
var deleteReview = createAsyncThunk("performance/deleteReview", async (id) => {
	await tryApi(() => apiInstance.delete(`/performance/reviews/${id}`), void 0);
	return id;
});
var bulkDeleteReviews = createAsyncThunk("performance/bulkDeleteReviews", async (ids) => {
	await tryApi(() => apiInstance.post("/performance/reviews/bulk-delete", { ids }), void 0);
	return ids;
});
var bulkSetReviewStatus = createAsyncThunk("performance/bulkSetReviewStatus", async (payload) => {
	await tryApi(() => apiInstance.patch("/performance/reviews/bulk-status", payload), void 0);
	return payload;
});
var importReviews = createAsyncThunk("performance/importReviews", async (reviews) => {
	await tryApi(() => apiInstance.post("/performance/reviews/import", { reviews }), void 0);
	return reviews;
});
var createGoal = createAsyncThunk("performance/createGoal", async (goal) => {
	await tryApi(() => apiInstance.post("/performance/goals", goal), void 0);
	return goal;
});
var updateGoal = createAsyncThunk("performance/updateGoal", async (goal) => {
	await tryApi(() => apiInstance.put(`/performance/goals/${goal.id}`, goal), void 0);
	return goal;
});
var deleteGoal = createAsyncThunk("performance/deleteGoal", async (id) => {
	await tryApi(() => apiInstance.delete(`/performance/goals/${id}`), void 0);
	return id;
});
var assignGoal = createAsyncThunk("performance/assignGoal", async (payload) => {
	const goal = {
		id: `g_${Math.random().toString(36).slice(2, 11)}`,
		employeeId: payload.employeeId,
		title: payload.title,
		description: payload.description,
		progress: 0,
		status: "not_started",
		priority: payload.priority,
		dueDate: payload.dueDate,
		createdAt: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
	};
	await tryApi(() => apiInstance.post("/performance/goals/assign", goal), void 0);
	return goal;
});
var completeGoal = createAsyncThunk("performance/completeGoal", async (id) => {
	await tryApi(() => apiInstance.post(`/performance/goals/${id}/complete`), void 0);
	return id;
});
var addFeedback = createAsyncThunk("performance/addFeedback", async (feedback) => {
	await tryApi(() => apiInstance.post("/performance/feedback", feedback), void 0);
	return feedback;
});
var addReward = createAsyncThunk("performance/addReward", async (reward) => {
	await tryApi(() => apiInstance.post("/performance/rewards", reward), void 0);
	return reward;
});
var assignTraining = createAsyncThunk("performance/assignTraining", async ({ employeeId, courseName }) => {
	const course = {
		id: `c_${Math.random().toString(36).slice(2, 11)}`,
		employeeId,
		courseName,
		status: "assigned",
		assignedDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
	};
	await tryApi(() => apiInstance.post("/performance/training/assign", course), void 0);
	return course;
});
var updateTrainingStatus = createAsyncThunk("performance/updateTrainingStatus", async ({ id, status }) => {
	await tryApi(() => apiInstance.patch(`/performance/training/${id}`, { status }), void 0);
	return {
		id,
		status
	};
});
var performanceSlice = createSlice({
	name: "performance",
	initialState: {
		reviews: [...SEED_REVIEWS],
		goals: [...SEED_GOALS],
		feedback360: [...SEED_FEEDBACK],
		rewards: [...SEED_REWARDS],
		courses: [...SEED_COURSES],
		loading: false,
		error: null
	},
	reducers: { clearPerformance(state) {
		state.reviews = [];
		state.goals = [];
		state.feedback360 = [];
		state.rewards = [];
		state.courses = [];
		state.error = null;
	} },
	extraReducers: (builder) => {
		builder.addCase(fetchPerformance.pending, (state) => {
			state.loading = true;
			state.error = null;
		}).addCase(fetchPerformance.fulfilled, (state, action) => {
			state.loading = false;
			state.reviews = action.payload.reviews;
			state.goals = action.payload.goals;
			state.feedback360 = action.payload.feedback360;
			state.rewards = action.payload.rewards;
			state.courses = action.payload.courses;
		}).addCase(fetchPerformance.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload ?? "Failed to load performance data";
		}).addCase(createReview.fulfilled, (state, action) => {
			state.reviews = [action.payload, ...state.reviews];
		}).addCase(updateReview.fulfilled, (state, action) => {
			state.reviews = state.reviews.map((r) => r.id === action.payload.id ? action.payload : r);
		}).addCase(deleteReview.fulfilled, (state, action) => {
			state.reviews = state.reviews.filter((r) => r.id !== action.payload);
		}).addCase(bulkDeleteReviews.fulfilled, (state, action) => {
			state.reviews = state.reviews.filter((r) => !action.payload.includes(r.id));
		}).addCase(bulkSetReviewStatus.fulfilled, (state, action) => {
			const { ids, status } = action.payload;
			state.reviews = state.reviews.map((r) => ids.includes(r.id) ? {
				...r,
				reviewStatus: status
			} : r);
		}).addCase(importReviews.fulfilled, (state, action) => {
			state.reviews = [...action.payload, ...state.reviews];
		}).addCase(createGoal.fulfilled, (state, action) => {
			state.goals = [action.payload, ...state.goals];
		}).addCase(updateGoal.fulfilled, (state, action) => {
			state.goals = state.goals.map((g) => g.id === action.payload.id ? action.payload : g);
		}).addCase(deleteGoal.fulfilled, (state, action) => {
			state.goals = state.goals.filter((g) => g.id !== action.payload);
		}).addCase(assignGoal.fulfilled, (state, action) => {
			state.goals = [action.payload, ...state.goals];
		}).addCase(completeGoal.fulfilled, (state, action) => {
			state.goals = state.goals.map((g) => g.id === action.payload ? {
				...g,
				progress: 100,
				status: "completed"
			} : g);
		}).addCase(addFeedback.fulfilled, (state, action) => {
			state.feedback360 = [action.payload, ...state.feedback360];
		}).addCase(addReward.fulfilled, (state, action) => {
			state.rewards = [action.payload, ...state.rewards];
		}).addCase(assignTraining.fulfilled, (state, action) => {
			state.courses = [action.payload, ...state.courses];
		}).addCase(updateTrainingStatus.fulfilled, (state, action) => {
			const { id, status } = action.payload;
			state.courses = state.courses.map((c) => c.id === id ? {
				...c,
				status,
				completionDate: status === "completed" ? (/* @__PURE__ */ new Date()).toISOString().split("T")[0] : void 0
			} : c);
		});
	}
});
var { clearPerformance } = performanceSlice.actions;
var performanceSlice_default = performanceSlice.reducer;
function mapJobToFrontend(j) {
	const skills = j.skills;
	const applications = j.applications;
	return {
		id: String(j.id ?? ""),
		title: String(j.title ?? ""),
		department: String(j.department ?? ""),
		employmentType: j.employment_type === "FULL_TIME" ? "Full-time" : j.employment_type === "PART_TIME" ? "Part-time" : j.employment_type === "CONTRACT" ? "Contract" : j.employment_type === "INTERN" ? "Internship" : j.employment_type || "Full-time",
		experience: String(j.experience_required ?? `${j.min_experience || 0}-${j.max_experience || 0} yrs`),
		skills: skills?.map((s) => typeof s === "object" && s?.skill_name ? s.skill_name : String(s)) || [],
		salaryMin: Number(j.min_salary || 0),
		salaryMax: Number(j.max_salary || 0),
		currency: "INR",
		vacancies: Number(j.vacancies || 1),
		location: String(j.location || "Bengaluru"),
		workMode: String(j.work_mode || "Onsite"),
		description: String(j.job_description || ""),
		responsibilities: typeof j.responsibilities === "string" ? j.responsibilities.split("\n").filter(Boolean) : Array.isArray(j.responsibilities) ? j.responsibilities : [],
		requirements: typeof j.requirements === "string" ? j.requirements.split("\n").filter(Boolean) : Array.isArray(j.requirements) ? j.requirements : [],
		benefits: typeof j.benefits === "string" ? j.benefits.split("\n").filter(Boolean) : Array.isArray(j.benefits) ? j.benefits : [],
		hiringManager: "Hiring Manager",
		recruiter: "Recruiter",
		status: String(j.status ?? "").toLowerCase() === "published" ? "active" : String(j.status ?? "draft").toLowerCase(),
		publishedAt: String(j.created_at || (/* @__PURE__ */ new Date()).toISOString()),
		closingAt: String(j.updated_at || (/* @__PURE__ */ new Date()).toISOString()),
		applicants: applications?.length || 0
	};
}
function mapCandidateToFrontend(c) {
	const latestApp = c.applications?.[0];
	const notes = c.notes?.map((n) => ({
		id: String(n.id ?? ""),
		at: String(n.created_at ?? ""),
		author: n.author && typeof n.author === "object" ? `${n.author.first_name ?? ""} ${n.author.last_name ?? ""}`.trim() || "You" : "You",
		text: String(n.note_text ?? "")
	})) || [];
	const timeline = [...c.timeline || []];
	if (timeline.length === 0 && latestApp) {
		timeline.push({
			id: `tl-app-${c.id}`,
			at: String(latestApp.created_at ?? ""),
			kind: "stage",
			title: `Applied for ${latestApp.job?.title || "Position"}`,
			actor: "System"
		});
		if (latestApp.status && latestApp.status !== "applied") timeline.push({
			id: `tl-stage-${c.id}`,
			at: String(latestApp.updated_at ?? ""),
			kind: "stage",
			title: `Moved to ${String(latestApp.status).toLowerCase()}`,
			actor: "System"
		});
	}
	return {
		id: String(c.id ?? ""),
		name: `${c.first_name ?? ""} ${c.last_name ?? ""}`.trim(),
		email: String(c.email ?? ""),
		phone: String(c.phone ?? ""),
		location: String(c.location ?? ""),
		jobId: String(latestApp?.job_id ?? ""),
		applicationId: String(latestApp?.id ?? ""),
		appliedPosition: String((latestApp?.job)?.title ?? c.current_role ?? "Candidate"),
		stage: String(latestApp?.status ?? "").toLowerCase() || (c.is_talent_pool ? "screening" : "applied"),
		atsScore: typeof c.ats_score === "number" ? c.ats_score : null,
		jobMatch: typeof c.job_match === "number" ? c.job_match : null,
		source: String(c.source || "DIRECT"),
		tags: c.tags || [],
		skills: c.skills || [],
		yearsExperience: Number(c.years_experience || 0),
		currentCompany: String(c.current_company || ""),
		currentRole: String(c.current_role || ""),
		expectedSalary: Number(c.expected_salary || 0),
		noticeDays: Number(c.notice_days || 0),
		resumeName: String(c.resume_name || "resume.pdf"),
		summary: String(c.summary || ""),
		experience: c.experience || [],
		education: c.education || [],
		projects: c.projects || [],
		certifications: c.certifications || [],
		languages: c.languages || [],
		feedback: c.feedback || [],
		notes,
		documents: c.resume_path ? [{
			name: String(c.resume_name || "Resume"),
			type: "pdf"
		}] : [],
		timeline,
		appliedAt: String(latestApp?.created_at ?? c.created_at ?? (/* @__PURE__ */ new Date()).toISOString()),
		vendorId: String(c.vendor_id || "")
	};
}
function mapInterviewToFrontend(iv) {
	const application = iv.application;
	const candidate = application?.candidate;
	const job = application?.job;
	const schedule = iv.schedules?.[0];
	const interviewer = schedule?.interviewer;
	return {
		id: String(iv.id ?? ""),
		candidateId: String(application?.candidate_id ?? ""),
		candidateName: candidate ? `${candidate.first_name ?? ""} ${candidate.last_name ?? ""}`.trim() || "Candidate" : "Candidate",
		jobTitle: String(job?.title ?? "Job Position"),
		interviewer: interviewer?.first_name ? `${interviewer.first_name} ${interviewer.last_name ?? ""}`.trim() : "Interviewer",
		round: String(iv.round_name || "Technical Round"),
		date: String(schedule?.scheduled_at ?? iv.created_at ?? (/* @__PURE__ */ new Date()).toISOString()),
		durationMins: Number(schedule?.duration_minutes || 45),
		meetingLink: String(schedule?.meeting_link || "https://meet.google.com/abc-xyz-123"),
		status: String(iv.status ?? "").toLowerCase() === "scheduled" ? "scheduled" : String(iv.status ?? "scheduled").toLowerCase(),
		rating: iv.rating,
		feedback: iv.feedback_notes,
		notes: iv.notes
	};
}
function mapOfferToFrontend(o) {
	const application = o.application;
	const candidate = application?.candidate;
	const job = application?.job;
	return {
		id: String(o.id ?? ""),
		applicationId: String(o.application_id ?? application?.id ?? ""),
		candidateId: String(application?.candidate_id ?? ""),
		candidateName: candidate ? `${candidate.first_name ?? ""} ${candidate.last_name ?? ""}`.trim() || "Candidate" : "Candidate",
		jobId: String(application?.job_id ?? ""),
		jobTitle: String(job?.title ?? "Job Position"),
		salary: Number(o.ctc || 0),
		currency: "INR",
		joiningDate: String(o.joining_date || (/* @__PURE__ */ new Date()).toISOString()),
		benefits: [
			"Health Insurance",
			"Stock Options",
			"Flexible Hours"
		],
		status: String(o.status ?? "").toLowerCase(),
		sentAt: String(o.created_at ?? ""),
		respondedAt: o.updated_at,
		approvals: []
	};
}
function extractItems(result, nestedItems = true) {
	if (result.status !== "fulfilled") return [];
	const value = result.value;
	const items = nestedItems ? (value?.data)?.items || value?.data || [] : value?.data || [];
	return Array.isArray(items) ? items : [];
}
function parseRecruitmentApiResults(jobsResult, candidatesResult, interviewsResult, offersResult) {
	const data = {};
	let anySuccess = false;
	const jobItems = extractItems(jobsResult);
	if (jobsResult.status === "fulfilled" && jobItems.length >= 0) {
		data.jobs = jobItems.map(mapJobToFrontend);
		anySuccess = true;
	} else if (jobsResult.status === "rejected") console.warn("Jobs API failed:", jobsResult.reason);
	const candidateItems = extractItems(candidatesResult);
	if (candidatesResult.status === "fulfilled" && candidateItems.length >= 0) {
		data.candidates = candidateItems.map(mapCandidateToFrontend);
		anySuccess = true;
	} else if (candidatesResult.status === "rejected") console.warn("Candidates API failed:", candidatesResult.reason);
	const interviewItems = extractItems(interviewsResult, false);
	if (interviewsResult.status === "fulfilled" && interviewItems.length >= 0) {
		data.interviews = interviewItems.map(mapInterviewToFrontend);
		anySuccess = true;
	} else if (interviewsResult.status === "rejected") console.warn("Interviews API failed:", interviewsResult.reason);
	const offerItems = extractItems(offersResult);
	if (offersResult.status === "fulfilled" && offerItems.length >= 0) {
		data.offers = offerItems.map(mapOfferToFrontend);
		anySuccess = true;
	} else if (offersResult.status === "rejected") console.warn("Offers API failed:", offersResult.reason);
	return {
		data,
		anySuccess
	};
}
function isUuid(id) {
	return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
}
function toBodyResult(result) {
	return result.status === "fulfilled" ? {
		status: "fulfilled",
		value: result.value.data
	} : result;
}
async function fetchAllResources() {
	const [jobsRes, candidatesRes, interviewsRes, offersRes] = await Promise.allSettled([
		apiInstance.get("/jobs"),
		apiInstance.get("/candidates"),
		apiInstance.get("/interviews"),
		apiInstance.get("/offers")
	]);
	const { data, anySuccess } = parseRecruitmentApiResults(toBodyResult(jobsRes), toBodyResult(candidatesRes), toBodyResult(interviewsRes), toBodyResult(offersRes));
	if (!anySuccess) throw new Error("Failed to load recruitment data");
	return {
		jobs: data.jobs ?? [],
		candidates: data.candidates ?? [],
		interviews: data.interviews ?? [],
		offers: data.offers ?? []
	};
}
var fetchRecruitmentData = createAsyncThunk("recruitment/fetchData", async (_, thunkAPI) => {
	try {
		return await fetchAllResources();
	} catch (error) {
		return thunkAPI.rejectWithValue(parseApiError(error, "Failed to load recruitment data").message);
	}
});
var fetchJobById = createAsyncThunk("recruitment/fetchJobById", async (id, thunkAPI) => {
	try {
		const body = (await apiInstance.get(`/jobs/${id}`)).data;
		if (body?.success && body.data) return mapJobToFrontend(body.data);
		return thunkAPI.rejectWithValue(body?.message ?? "Job not found");
	} catch (error) {
		return thunkAPI.rejectWithValue(parseApiError(error, "Job not found").message);
	}
});
var upsertJob = createAsyncThunk("recruitment/upsertJob", async (job, thunkAPI) => {
	try {
		const minExp = parseInt(job.experience || "0", 10) || 0;
		const maxExp = parseInt(job.experience?.split("-")?.[1] || "0", 10) || null;
		const payload = {
			title: job.title,
			department: job.department,
			designation: job.title,
			employment_type: job.employmentType === "Full-time" ? "FULL_TIME" : job.employmentType === "Part-time" ? "PART_TIME" : job.employmentType === "Contract" ? "CONTRACT" : job.employmentType === "Internship" ? "INTERN" : "FULL_TIME",
			experience_required: job.experience || "3-5 yrs",
			min_experience: minExp,
			max_experience: maxExp,
			min_salary: job.salaryMin || 0,
			max_salary: job.salaryMax || 0,
			location: job.location,
			vacancies: job.vacancies || 1,
			job_description: job.description || "",
			responsibilities: Array.isArray(job.responsibilities) ? job.responsibilities.join("\n") : job.responsibilities,
			requirements: Array.isArray(job.requirements) ? job.requirements.join("\n") : job.requirements,
			benefits: Array.isArray(job.benefits) ? job.benefits.join("\n") : job.benefits,
			status: job.status === "active" ? "PUBLISHED" : job.status.toUpperCase(),
			rounds: [
				"Screening",
				"Technical",
				"Manager",
				"HR"
			],
			skills: job.skills || []
		};
		const response = isUuid(job.id) ? await apiInstance.put(`/jobs/${job.id}`, payload) : await apiInstance.post("/jobs", payload);
		await thunkAPI.dispatch(fetchRecruitmentData());
		return response.data;
	} catch (error) {
		return thunkAPI.rejectWithValue(parseApiError(error, "Failed to save job").message);
	}
});
var deleteJob = createAsyncThunk("recruitment/deleteJob", async (id, thunkAPI) => {
	try {
		await apiInstance.delete(`/jobs/${id}`);
		await thunkAPI.dispatch(fetchRecruitmentData());
		return id;
	} catch (error) {
		return thunkAPI.rejectWithValue(parseApiError(error, "Failed to delete job").message);
	}
});
var archiveJob = createAsyncThunk("recruitment/archiveJob", async (id, thunkAPI) => {
	try {
		await apiInstance.post(`/jobs/${id}/close`);
		await thunkAPI.dispatch(fetchRecruitmentData());
		return id;
	} catch (error) {
		return thunkAPI.rejectWithValue(parseApiError(error, "Failed to archive job").message);
	}
});
var duplicateJob = createAsyncThunk("recruitment/duplicateJob", async (id, thunkAPI) => {
	try {
		await apiInstance.post(`/jobs/${id}/duplicate`);
		await thunkAPI.dispatch(fetchRecruitmentData());
		return id;
	} catch (error) {
		return thunkAPI.rejectWithValue(parseApiError(error, "Failed to duplicate job").message);
	}
});
var upsertCandidate = createAsyncThunk("recruitment/upsertCandidate", async (candidate, thunkAPI) => {
	try {
		const [firstName, ...lastNames] = candidate.name.split(" ");
		const payload = {
			first_name: firstName,
			last_name: lastNames.join(" ") || "Candidate",
			email: candidate.email,
			phone: candidate.phone || "0000000000",
			location: candidate.location || "Unknown",
			summary: candidate.summary || "",
			skills: candidate.skills || [],
			tags: candidate.tags || [],
			years_experience: candidate.yearsExperience || 0,
			current_company: candidate.currentCompany || "",
			current_role: candidate.currentRole || "",
			expected_salary: candidate.expectedSalary || 0,
			notice_days: candidate.noticeDays || 0,
			source: candidate.source || "DIRECT",
			is_talent_pool: candidate.stage === "screening" || !candidate.jobId
		};
		if (isUuid(candidate.id)) await apiInstance.put(`/candidates/${candidate.id}`, payload);
		else await apiInstance.post("/candidates", payload);
		await thunkAPI.dispatch(fetchRecruitmentData());
	} catch (error) {
		return thunkAPI.rejectWithValue(parseApiError(error, "Failed to save candidate").message);
	}
});
var moveStage = createAsyncThunk("recruitment/moveStage", async ({ id, stage }, thunkAPI) => {
	try {
		const cand = thunkAPI.getState().recruitment.candidates.find((c) => c.applicationId === id || c.id === id);
		const targetId = cand?.applicationId || (cand?.id === id ? null : id);
		if (targetId && isUuid(targetId)) await apiInstance.patch(`/applications/${targetId}/stage`, { stage });
		await thunkAPI.dispatch(fetchRecruitmentData());
		return {
			id,
			stage
		};
	} catch (error) {
		return thunkAPI.rejectWithValue(parseApiError(error, "Failed to move candidate stage").message);
	}
});
var addNote = createAsyncThunk("recruitment/addNote", async ({ candidateId, text }, thunkAPI) => {
	try {
		await apiInstance.post("/crm/notes", {
			candidate_id: candidateId,
			note_text: text
		});
		await thunkAPI.dispatch(fetchRecruitmentData());
		return {
			candidateId,
			text
		};
	} catch (error) {
		return thunkAPI.rejectWithValue(parseApiError(error, "Failed to add note").message);
	}
});
var upsertInterview = createAsyncThunk("recruitment/upsertInterview", async (interview, thunkAPI) => {
	try {
		if (isUuid(interview.id)) {
			const payload = {
				interview_round_id: interview.id,
				scores: {},
				overall_recommendation: interview.rating && interview.rating >= 3 ? "HIRE" : "NO_HIRE",
				feedback_notes: interview.feedback || ""
			};
			await apiInstance.post("/scorecards/submissions", payload);
		}
		await thunkAPI.dispatch(fetchRecruitmentData());
		return interview;
	} catch (error) {
		return thunkAPI.rejectWithValue(parseApiError(error, "Failed to save interview").message);
	}
});
var upsertOffer = createAsyncThunk("recruitment/upsertOffer", async (offer, thunkAPI) => {
	try {
		const appId = offer.applicationId || offer.candidateId;
		const jDate = offer.joiningDate.includes("T") ? offer.joiningDate.split("T")[0] : offer.joiningDate;
		const expDate = new Date(Date.now() + 7 * 864e5).toISOString().split("T")[0];
		const payload = {
			ctc: offer.salary,
			joining_date: jDate,
			offer_expiry_date: expDate
		};
		await apiInstance.post(`/applications/${appId}/offer`, payload);
		await thunkAPI.dispatch(fetchRecruitmentData());
		return offer;
	} catch (error) {
		return thunkAPI.rejectWithValue(parseApiError(error, "Failed to save offer").message);
	}
});
var initialState = {
	jobs: [],
	candidates: [],
	interviews: [],
	offers: [],
	loading: false,
	submitting: false,
	error: null
};
var mutationThunks = [
	upsertJob,
	deleteJob,
	archiveJob,
	duplicateJob,
	upsertCandidate,
	moveStage,
	addNote,
	upsertInterview,
	upsertOffer
];
var recruitmentSlice = createSlice({
	name: "recruitment",
	initialState,
	reducers: {
		clearRecruitment(state) {
			state.jobs = [];
			state.candidates = [];
			state.interviews = [];
			state.offers = [];
			state.error = null;
		},
		optimisticMoveStage(state, action) {
			const cand = state.candidates.find((c) => c.id === action.payload.id || c.applicationId === action.payload.id);
			if (cand) cand.stage = action.payload.stage;
		},
		optimisticUpsertInterview(state, action) {
			const idx = state.interviews.findIndex((item) => item.id === action.payload.id);
			if (idx >= 0) state.interviews[idx] = action.payload;
			else state.interviews.push(action.payload);
		}
	},
	extraReducers: (builder) => {
		builder.addCase(fetchRecruitmentData.pending, (state) => {
			state.loading = true;
			state.error = null;
		}).addCase(fetchRecruitmentData.fulfilled, (state, action) => {
			console.log("action.payload", action.payload);
			state.loading = false;
			state.jobs = action.payload.jobs;
			state.candidates = action.payload.candidates;
			state.interviews = action.payload.interviews;
			state.offers = action.payload.offers;
		}).addCase(fetchRecruitmentData.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload ?? action.error.message ?? "Failed to load recruitment data";
		});
		mutationThunks.forEach((thunk) => {
			builder.addCase(thunk.pending, (state) => {
				state.submitting = true;
			}).addCase(thunk.fulfilled, (state) => {
				state.submitting = false;
			}).addCase(thunk.rejected, (state) => {
				state.submitting = false;
			});
		});
	}
});
var { clearRecruitment, optimisticMoveStage, optimisticUpsertInterview } = recruitmentSlice.actions;
var recruitmentSlice_default = recruitmentSlice.reducer;
var reportsApi = createApi({
	reducerPath: "reportsApi",
	baseQuery: fetchBaseQuery({
		baseUrl: BASE_URL,
		prepareHeaders: (headers) => {
			const tokens = getTokens();
			if (tokens?.accessToken) headers.set("Authorization", `Bearer ${tokens.accessToken}`);
			return headers;
		}
	}),
	tagTypes: [
		"ReportsDashboard",
		"AttendanceReports",
		"PayrollReports",
		"DepartmentReports",
		"RecruitmentReports",
		"LeaveReports",
		"PerformanceReports"
	],
	endpoints: (builder) => ({
		getDashboardReports: builder.query({
			query: (params) => ({
				url: "/ai-insights/charts",
				params: params ? { ...params } : void 0
			}),
			transformResponse: (response) => {
				const data = response?.data || response || {};
				return {
					totalEmployees: data.totalEmployees || 0,
					activeDepartments: data.activeDepartments || 0,
					headcountTrend: Array.isArray(data.headcountTrend) ? data.headcountTrend : [],
					departmentDistribution: Array.isArray(data.departmentDistribution) ? data.departmentDistribution : [],
					attendanceTrend: Array.isArray(data.attendanceTrend) ? data.attendanceTrend : []
				};
			},
			providesTags: ["ReportsDashboard"]
		}),
		getAttendanceReports: builder.query({
			query: (params) => ({
				url: "/attendance/analytics",
				params: params ? { ...params } : void 0
			}),
			transformResponse: (response) => {
				const list = response?.data || response || [];
				return Array.isArray(list) ? list : [];
			},
			providesTags: ["AttendanceReports"]
		}),
		getPayrollReports: builder.query({
			query: (params) => ({
				url: "/payroll/copilot/history",
				params: params ? { ...params } : void 0
			}),
			transformResponse: (response) => {
				return response?.data || response || null;
			},
			providesTags: ["PayrollReports"]
		}),
		getDepartmentReports: builder.query({
			query: (params) => ({
				url: "/departments",
				params: params ? { ...params } : void 0
			}),
			transformResponse: (response) => {
				const list = Array.isArray(response) ? response : response?.data || response?.departments || [];
				return Array.isArray(list) ? list.map((d) => ({
					id: d.id || d._id || String(d.departmentId),
					name: d.name || d.departmentName || "Unassigned",
					employeeCount: d.employeeCount || d.employeesCount || 0
				})) : [];
			},
			providesTags: ["DepartmentReports"]
		}),
		getRecruitmentReports: builder.query({
			query: (params) => ({
				url: "/ats/jobs",
				params: params ? { ...params } : void 0
			}),
			transformResponse: (response) => {
				const list = response?.data || response || [];
				return Array.isArray(list) ? list : [];
			},
			providesTags: ["RecruitmentReports"]
		}),
		getLeaveReports: builder.query({
			query: (params) => ({
				url: "/leaves/analytics",
				params: params ? { ...params } : void 0
			}),
			transformResponse: (response) => {
				return response?.data || response || null;
			},
			providesTags: ["LeaveReports"]
		}),
		getPerformanceReports: builder.query({
			query: (params) => ({
				url: "/performance/appraisals",
				params: params ? { ...params } : void 0
			}),
			transformResponse: (response) => {
				const list = response?.data || response || [];
				return Array.isArray(list) ? list : [];
			},
			providesTags: ["PerformanceReports"]
		}),
		exportReports: builder.mutation({ query: (body) => ({
			url: "/reports/export",
			method: "POST",
			body
		}) })
	})
});
var { useGetDashboardReportsQuery, useGetAttendanceReportsQuery, useGetPayrollReportsQuery, useGetDepartmentReportsQuery, useGetRecruitmentReportsQuery, useGetLeaveReportsQuery, useGetPerformanceReportsQuery, useExportReportsMutation } = reportsApi;
var axiosBaseQuery = () => async ({ url, method = "GET", data, params }) => {
	try {
		return { data: (await apiInstance({
			url,
			method,
			data,
			params
		})).data };
	} catch (axiosError) {
		const err = axiosError;
		return { error: {
			status: err.response?.status,
			data: err.response?.data || err.message
		} };
	}
};
var payrollCopilotApi = createApi({
	reducerPath: "payrollCopilotApi",
	baseQuery: axiosBaseQuery(),
	tagTypes: ["PayrollCopilotHistory"],
	endpoints: (builder) => ({
		getHistory: builder.query({
			query: () => ({
				url: "/payroll/copilot/history",
				method: "GET"
			}),
			transformResponse: (response) => {
				return response?.data?.messages || [];
			},
			providesTags: ["PayrollCopilotHistory"]
		}),
		sendChatMessage: builder.mutation({
			query: (body) => ({
				url: "/payroll/copilot/chat",
				method: "POST",
				data: body
			}),
			transformResponse: (response) => {
				return response?.data;
			},
			invalidatesTags: ["PayrollCopilotHistory"]
		}),
		clearHistory: builder.mutation({
			query: () => ({
				url: "/payroll/copilot/clear",
				method: "POST"
			}),
			invalidatesTags: ["PayrollCopilotHistory"]
		})
	})
});
var { useGetHistoryQuery, useSendChatMessageMutation, useClearHistoryMutation } = payrollCopilotApi;
var store = configureStore({
	reducer: {
		employees: employeesSlice_default,
		departments: departmentsSlice_default,
		managers: managersSlice_default,
		performance: performanceSlice_default,
		recruitment: recruitmentSlice_default,
		[reportsApi.reducerPath]: reportsApi.reducer,
		[payrollCopilotApi.reducerPath]: payrollCopilotApi.reducer
	},
	middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(reportsApi.middleware, payrollCopilotApi.middleware)
});
var KEY = "ofc360:workspace:v1";
var REMEMBER_KEY = "ofc360:remember";
var defaultState = {
	user: null,
	company: null,
	hrs: [],
	employees: [],
	managers: [],
	documents: [],
	documentActivities: [],
	isRestoring: false
};
var state = defaultState;
var listeners = /* @__PURE__ */ new Set();
function load() {
	if (typeof window === "undefined") return;
	try {
		const raw = localStorage.getItem(KEY);
		if (raw) {
			const parsed = JSON.parse(raw);
			state = {
				...defaultState,
				...parsed
			};
		}
		state.isRestoring = false;
	} catch {}
}
load();
function persist() {
	if (typeof window === "undefined") return;
	try {
		const toSave = { ...state };
		delete toSave.isRestoring;
		localStorage.setItem(KEY, JSON.stringify(toSave));
	} catch {}
}
function emit() {
	listeners.forEach((l) => l());
}
var ofc360 = {
	get: () => state,
	set: (partial) => {
		state = {
			...state,
			...partial
		};
		persist();
		emit();
	},
	reset: () => {
		state = defaultState;
		persist();
		emit();
	},
	subscribe: (l) => {
		listeners.add(l);
		return () => listeners.delete(l);
	}
};
function useofc360() {
	return (0, import_react.useSyncExternalStore)(ofc360.subscribe, () => state, () => defaultState);
}
function useMounted() {
	const [m, setM] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => setM(true), []);
	return m;
}
function uid(prefix = "id") {
	return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}
var rememberStore = {
	get: () => {
		if (typeof window === "undefined") return "";
		return localStorage.getItem(REMEMBER_KEY) || "";
	},
	set: (email) => {
		if (typeof window === "undefined") return;
		localStorage.setItem(REMEMBER_KEY, email);
	},
	clear: () => {
		if (typeof window === "undefined") return;
		localStorage.removeItem(REMEMBER_KEY);
	}
};
//#endregion
export { deleteEmployee as $, upsertOffer as $t, addReward as A, optimisticMoveStage as At, bulkDeleteDepartments as B, setTokens as Bt, STATUS_OPTIONS as C, initManagerForm as Ct, addEmployeeToDepartment as D, mapApiFieldErrors as Dt, activateEmployee as E, labelFor as Et, assignGoal as F, resendEmployeeInvite as Ft, completeGoal as G, updateEmployee as Gt, bulkSetDepartmentStatus as H, transferDepartmentEmployees as Ht, assignTraining as I, resetEmployeePassword as It, createGoal as J, updateReview as Jt, createDepartment as K, updateGoal as Kt, avatarHue as L, resetManagerForm as Lt, applyFilters as M, promoteDepartmentEmployee as Mt, applySorting as N, rememberStore as Nt, addFeedback as O, moveStage as Ot, archiveJob as P, removeEmployeeFromDepartment as Pt, deleteDepartment as Q, upsertJob as Qt, buildCSV as R, resolveDepartmentValue as Rt, SHIFT_OPTIONS as S, importReviews as St, THEME_COLORS as T, isParentGroupValue as Tt, bulkSetReviewStatus as U, uid as Ut, bulkDeleteReviews as V, store as Vt, clearSelectedManager as W, updateDepartment as Wt, createReview as X, upsertCandidate as Xt, createManager as Y, updateTrainingStatus as Yt, deactivateEmployee as Z, upsertInterview as Zt, OFFICES$1 as _, getExpandedGroupsForValue as _t, DEFAULT_FILTERS$2 as a, useGetHistoryQuery as an, fetchDepartments as at, REVIEW_STATUS_OPTIONS as b, importDepartments as bt, DEPARTMENT_GROUPS as c, useofc360 as cn, fetchManagerById as ct, EMPLOYEE_COUNT_RANGES as d, validatePhone as dn, fetchPerformance as dt, useClearHistoryMutation as en, deleteGoal as et, EMPLOYMENT_TYPE_OPTIONS as f, fetchRecruitmentData as ft, OFFICES as g, getErrorMessage as gt, MANAGER_FORM_WORK_LOCATION_OPTIONS as h, getDepartmentLabel as ht, DEFAULT_FILTERS$1 as i, useGetDepartmentReportsQuery as in, duplicateJob as it, apiInstance as j, optimisticUpsertInterview as jt, addNote as k, ofc360 as kt, DEPARTMENT_ICONS as l, validateEmail as ln, fetchManagers as lt, MANAGER_FORM_EMPLOYMENT_TYPE_OPTIONS as m, fmtRelative as mt, BASE_URL as n, useGetAttendanceReportsQuery as nn, deleteManager as nt, DEFAULT_PERMISSIONS as o, useMounted as on, fetchEmployees as ot, GENDER_OPTIONS as p, fmtDate as pt, createEmployee as q, updateManager as qt, DEFAULT_FILTERS as r, useGetDashboardReportsQuery as rn, deleteReview as rt, DEPARTMENTS as s, useSendChatMessageMutation as sn, fetchJobById as st, API_HOST_URL as t, useExportReportsMutation as tn, deleteJob as tt, DEPARTMENT_VALUES as u, validateManagerForm as un, fetchOrgChart as ut, PROMOTION_STATUS_OPTIONS as v, getTokens as vt, STATUS_OPTIONS$1 as w, isAccessTokenExpired as wt, SHIFTS as x, importManagers as xt, RATING_BADGES as y, getVisiblePages as yt, bulkAssignDepartmentManager as z, setManagerForm as zt };
