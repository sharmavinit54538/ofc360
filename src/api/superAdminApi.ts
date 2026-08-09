import apiInstance from "./apiInstance";

export interface SuperAdminDashboardData {
  kpis: {
    total_organizations: number;
    active_organizations: number;
    paid_organizations: number;
    complimentary_organizations: number;
    free_organizations: number;
    trial_organizations: number;
    suspended_organizations: number;
    expired_organizations: number;
    total_users: number;
    total_employees: number;
    dau: number;
    mau: number;
  };
  financials: {
    total_revenue: number;
    mrr: number;
    arr: number;
    pending_payments: number;
    failed_payments: number;
  };
  unpaid_active_customers: Array<{
    id: string;
    name: string;
    owner_name: string;
    owner_email: string;
    plan: string;
    access_status: string;
    access_type: string;
    payment_status: string;
    granted_by: string;
    granted_at: string | null;
    expires_at: string | null;
    reason: string;
  }>;
  charts: {
    revenue_trend: Array<{ month: string; revenue: number }>;
    status_distribution: Array<{ name: string; value: number; color: string }>;
  };
}

export interface OrganizationSummary {
  id: string;
  name: string;
  owner: {
    name: string;
    email: string;
  };
  user_count: number;
  employee_count: number;
  plan: string;
  access_status: string;
  access_type: string;
  payment_status: string;
  access_source: string;
  access_granted_by: string;
  access_expires_at: string | null;
  access_grant_reason: string;
  mrr: number;
  created_at: string | null;
}

export interface OrganizationDetail extends OrganizationSummary {
  owner: {
    name: string;
    email: string;
    phone: string;
  };
  subscription: {
    plan: string;
    access_status: string;
    access_type: string;
    payment_status: string;
    access_source: string;
    access_granted_by: string;
    access_granted_at: string | null;
    access_expires_at: string | null;
    access_grant_reason: string;
    internal_note: string;
    cancellation_reason?: string | null;
    suspension_reason?: string | null;
    mrr: number;
  };
  stats: {
    user_count: number;
    employee_count: number;
    total_spent: number;
  };
  users: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    is_active: boolean;
    last_login_at: string | null;
  }>;
  payments: Array<{
    id: string;
    amount: number;
    currency: string;
    gateway: string;
    invoice_number: string;
    status: string;
    payment_date: string;
  }>;
  audit_logs: Array<{
    id: string;
    action: string;
    email: string;
    details: string;
    created_at: string;
  }>;
}

export const superAdminApi = {
  getDashboard: async (): Promise<SuperAdminDashboardData> => {
    const res = await apiInstance.get("/super-admin/dashboard");
    return res.data;
  },

  getOrganizations: async (params?: {
    search?: string;
    access_status?: string;
    payment_status?: string;
    plan?: string;
  }): Promise<OrganizationSummary[]> => {
    const res = await apiInstance.get("/super-admin/organizations", { params });
    return res.data;
  },

  getOrganizationDetail: async (id: string): Promise<OrganizationDetail> => {
    const res = await apiInstance.get(`/super-admin/organizations/${id}`);
    return res.data;
  },

  grantAccess: async (
    id: string,
    payload: {
      plan: string;
      access_type: string;
      duration?: string;
      custom_expiry_date?: string;
      reason: string;
      internal_note?: string;
      confirm?: boolean;
    }
  ) => {
    const res = await apiInstance.post(`/super-admin/organizations/${id}/access/grant`, payload);
    return res.data;
  },

  extendAccess: async (
    id: string,
    payload: {
      days?: number;
      custom_expiry_date?: string;
      reason: string;
      internal_note?: string;
    }
  ) => {
    const res = await apiInstance.post(`/super-admin/organizations/${id}/access/extend`, payload);
    return res.data;
  },

  suspendAccess: async (
    id: string,
    payload: {
      reason: string;
      internal_note?: string;
    }
  ) => {
    const res = await apiInstance.post(`/super-admin/organizations/${id}/access/suspend`, payload);
    return res.data;
  },

  cancelAccess: async (
    id: string,
    payload: {
      cancel_type: string;
      reason: string;
      internal_note?: string;
    }
  ) => {
    const res = await apiInstance.post(`/super-admin/organizations/${id}/access/cancel`, payload);
    return res.data;
  },

  reactivateAccess: async (
    id: string,
    payload: {
      plan?: string;
      access_type?: string;
      duration?: string;
      custom_expiry_date?: string;
      reason: string;
      internal_note?: string;
    }
  ) => {
    const res = await apiInstance.post(`/super-admin/organizations/${id}/access/reactivate`, payload);
    return res.data;
  },

  removeComplimentary: async (
    id: string,
    payload: {
      reason: string;
      internal_note?: string;
    }
  ) => {
    const res = await apiInstance.post(`/super-admin/organizations/${id}/access/remove-complimentary`, payload);
    return res.data;
  },

  changePlan: async (
    id: string,
    payload: {
      new_plan: string;
      reason: string;
      internal_note?: string;
    }
  ) => {
    const res = await apiInstance.post(`/super-admin/organizations/${id}/plan/change`, payload);
    return res.data;
  },

  getAuditLogs: async (id: string) => {
    const res = await apiInstance.get(`/super-admin/organizations/${id}/audit-logs`);
    return res.data;
  },

  getPayments: async () => {
    const res = await apiInstance.get("/super-admin/payments");
    return res.data;
  },

  getUnpaidActive: async () => {
    const res = await apiInstance.get("/super-admin/unpaid-active");
    return res.data;
  },

  getUsers: async (params?: { search?: string; role?: string; status?: string }) => {
    const res = await apiInstance.get("/super-admin/users", { params });
    return res.data;
  },

  updateUserStatus: async (userId: string, payload: { is_active: boolean; reason?: string; role?: string }) => {
    const res = await apiInstance.patch(`/super-admin/users/${userId}/status`, payload);
    return res.data;
  },


  getPlans: async () => {
    const res = await apiInstance.get("/super-admin/plans");
    return res.data;
  },

  getEntitlements: async () => {
    const res = await apiInstance.get("/super-admin/entitlements");
    return res.data;
  },

  updateEntitlements: async (payload: { organization_id: string; enabled_modules: Record<string, boolean> }) => {
    const res = await apiInstance.post("/super-admin/entitlements", payload);
    return res.data;
  },

  getAiUsage: async () => {
    const res = await apiInstance.get("/super-admin/ai-usage");
    return res.data;
  },

  getAnalytics: async () => {
    const res = await apiInstance.get("/super-admin/analytics");
    return res.data;
  },

  getGlobalAuditLogs: async (params?: { action?: string }) => {
    const res = await apiInstance.get("/super-admin/audit-logs", { params });
    return res.data;
  },

  getSecurity: async () => {
    const res = await apiInstance.get("/super-admin/security");
    return res.data;
  },

  getSystemHealth: async () => {
    const res = await apiInstance.get("/super-admin/system-health");
    return res.data;
  },

  getAnnouncements: async () => {
    const res = await apiInstance.get("/super-admin/announcements");
    return res.data;
  },

  createAnnouncement: async (payload: { title: string; content: string; target_audience?: string }) => {
    const res = await apiInstance.post("/super-admin/announcements", payload);
    return res.data;
  },

  getSettings: async () => {
    const res = await apiInstance.get("/super-admin/settings");
    return res.data;
  },

  updateSettings: async (settingsData: Record<string, any>) => {
    const res = await apiInstance.put("/super-admin/settings", settingsData);
    return res.data;
  },

  enterTenantMode: async (orgId: string) => {
    const res = await apiInstance.post(`/super-admin/organizations/${orgId}/enter-tenant-mode`);
    return res.data;
  },
};

