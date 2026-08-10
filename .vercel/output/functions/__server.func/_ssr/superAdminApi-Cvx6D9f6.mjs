import { j as apiInstance } from "./ofc360-store-XkEEWRxo.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/superAdminApi-Cvx6D9f6.js
var superAdminApi = {
	getDashboard: async () => {
		return (await apiInstance.get("/super-admin/dashboard")).data;
	},
	getOrganizations: async (params) => {
		return (await apiInstance.get("/super-admin/organizations", { params })).data;
	},
	getOrganizationDetail: async (id) => {
		return (await apiInstance.get(`/super-admin/organizations/${id}`)).data;
	},
	grantAccess: async (id, payload) => {
		return (await apiInstance.post(`/super-admin/organizations/${id}/access/grant`, payload)).data;
	},
	extendAccess: async (id, payload) => {
		return (await apiInstance.post(`/super-admin/organizations/${id}/access/extend`, payload)).data;
	},
	suspendAccess: async (id, payload) => {
		return (await apiInstance.post(`/super-admin/organizations/${id}/access/suspend`, payload)).data;
	},
	cancelAccess: async (id, payload) => {
		return (await apiInstance.post(`/super-admin/organizations/${id}/access/cancel`, payload)).data;
	},
	reactivateAccess: async (id, payload) => {
		return (await apiInstance.post(`/super-admin/organizations/${id}/access/reactivate`, payload)).data;
	},
	removeComplimentary: async (id, payload) => {
		return (await apiInstance.post(`/super-admin/organizations/${id}/access/remove-complimentary`, payload)).data;
	},
	changePlan: async (id, payload) => {
		return (await apiInstance.post(`/super-admin/organizations/${id}/plan/change`, payload)).data;
	},
	getAuditLogs: async (id) => {
		return (await apiInstance.get(`/super-admin/organizations/${id}/audit-logs`)).data;
	},
	getPayments: async () => {
		return (await apiInstance.get("/super-admin/payments")).data;
	},
	getUnpaidActive: async () => {
		return (await apiInstance.get("/super-admin/unpaid-active")).data;
	},
	getUsers: async (params) => {
		return (await apiInstance.get("/super-admin/users", { params })).data;
	},
	updateUserStatus: async (userId, payload) => {
		return (await apiInstance.patch(`/super-admin/users/${userId}/status`, payload)).data;
	},
	getPlans: async () => {
		return (await apiInstance.get("/super-admin/plans")).data;
	},
	getEntitlements: async () => {
		return (await apiInstance.get("/super-admin/entitlements")).data;
	},
	updateEntitlements: async (payload) => {
		return (await apiInstance.post("/super-admin/entitlements", payload)).data;
	},
	getAiUsage: async () => {
		return (await apiInstance.get("/super-admin/ai-usage")).data;
	},
	getAnalytics: async () => {
		return (await apiInstance.get("/super-admin/analytics")).data;
	},
	getGlobalAuditLogs: async (params) => {
		return (await apiInstance.get("/super-admin/audit-logs", { params })).data;
	},
	getSecurity: async () => {
		return (await apiInstance.get("/super-admin/security")).data;
	},
	getSystemHealth: async () => {
		return (await apiInstance.get("/super-admin/system-health")).data;
	},
	getAnnouncements: async () => {
		return (await apiInstance.get("/super-admin/announcements")).data;
	},
	createAnnouncement: async (payload) => {
		return (await apiInstance.post("/super-admin/announcements", payload)).data;
	},
	getSettings: async () => {
		return (await apiInstance.get("/super-admin/settings")).data;
	},
	updateSettings: async (settingsData) => {
		return (await apiInstance.put("/super-admin/settings", settingsData)).data;
	},
	enterTenantMode: async (orgId) => {
		return (await apiInstance.post(`/super-admin/organizations/${orgId}/enter-tenant-mode`)).data;
	}
};
//#endregion
export { superAdminApi as t };
