import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  superAdminApi,
  type SuperAdminDashboardData,
  type OrganizationSummary
} from "@/api/superAdminApi";
import {
  GrantAccessModal,
  SuspendAccessModal,
  ExtendAccessModal,
  ReactivateAccessModal
} from "@/components/super-admin/AdminActionModals";
import {
  Building2, Users, CreditCard, DollarSign, TrendingUp, Sparkles, Ban, CheckCircle2,
  Clock, AlertTriangle, ShieldCheck, ArrowRight, RefreshCw, Eye
} from "lucide-react";
import {
  Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis,
  Pie, PieChart, Cell
} from "recharts";

export const Route = createFileRoute("/dashboard/super-admin/")({
  head: () => ({ meta: [{ title: "Overview — Super Admin Control Center" }] }),
  component: SuperAdminOverviewPage,
});

function SuperAdminOverviewPage() {
  const [data, setData] = useState<SuperAdminDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Selected Org for modal actions
  const [selectedOrg, setSelectedOrg] = useState<OrganizationSummary | null>(null);
  const [grantOpen, setGrantOpen] = useState(false);
  const [extendOpen, setExtendOpen] = useState(false);
  const [suspendOpen, setSuspendOpen] = useState(false);
  const [reactivateOpen, setReactivateOpen] = useState(false);

  const fetchDashboard = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await superAdminApi.getDashboard();
      setData(res);
    } catch (err: any) {
      console.error("Super admin dashboard load error:", err);
      setError(err.response?.data?.detail || err.message || "Failed to load super admin metrics");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-24 rounded-2xl bg-card/40 border border-border animate-pulse" />
          ))}
        </div>
        <div className="h-64 rounded-2xl bg-card/40 border border-border animate-pulse" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <Card className="border-rose-500/20 bg-rose-500/5 p-8 text-center">
        <AlertTriangle className="mx-auto h-8 w-8 text-rose-500 mb-2" />
        <h3 className="font-bold text-foreground">Failed to Load Control Center Data</h3>
        <p className="text-xs text-muted-foreground mt-1">{error || "Backend connection issue."}</p>
        <Button onClick={fetchDashboard} variant="outline" className="mt-4 h-8 text-xs gap-2">
          <RefreshCw className="h-3.5 w-3.5" /> Retry Request
        </Button>
      </Card>
    );
  }

  const { kpis, financials, unpaid_active_customers, charts } = data;

  const kpiCards = [
    { title: "Total Orgs", value: kpis.total_organizations, color: "text-blue-500", bg: "bg-blue-500/10" },
    { title: "Active Orgs", value: kpis.active_organizations, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { title: "Paid Orgs", value: kpis.paid_organizations, color: "text-teal-500", bg: "bg-teal-500/10" },
    { title: "Complimentary", value: kpis.complimentary_organizations, color: "text-indigo-500", bg: "bg-indigo-500/10" },
    { title: "Free Orgs", value: kpis.free_organizations, color: "text-cyan-500", bg: "bg-cyan-500/10" },
    { title: "Trial Orgs", value: kpis.trial_organizations, color: "text-amber-500", bg: "bg-amber-500/10" },
    { title: "Suspended Orgs", value: kpis.suspended_organizations, color: "text-rose-500", bg: "bg-rose-500/10" },
    { title: "Expired Orgs", value: kpis.expired_organizations, color: "text-neutral-500", bg: "bg-neutral-500/10" },
  ];

  return (
    <div className="space-y-6">
      {/* 1. TOP STATS CARDS */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
        {kpiCards.map((card, idx) => (
          <Card key={idx} className="border-border bg-card/40 backdrop-blur-xl">
            <CardContent className="p-3 text-left">
              <span className={`text-[10px] font-bold uppercase tracking-wider block text-muted-foreground`}>
                {card.title}
              </span>
              <div className={`mt-1 font-display text-xl font-bold ${card.color}`}>
                {card.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 2. REVENUE & USAGE HIGHLIGHTS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border bg-card/40 backdrop-blur-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
              <span>Total Revenue</span>
              <DollarSign className="h-4 w-4 text-emerald-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-display text-2xl font-bold text-emerald-500">
              ₹{financials.total_revenue.toLocaleString()}
            </div>
            <p className="text-[10px] text-muted-foreground mt-0.5">Real collected payment transactions</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card/40 backdrop-blur-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
              <span>Monthly Recurring (MRR)</span>
              <TrendingUp className="h-4 w-4 text-indigo-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-display text-2xl font-bold text-indigo-400">
              ₹{financials.mrr.toLocaleString()}
            </div>
            <p className="text-[10px] text-muted-foreground mt-0.5">ARR: ₹{financials.arr.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card/40 backdrop-blur-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
              <span>Total SaaS Users</span>
              <Users className="h-4 w-4 text-blue-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-display text-2xl font-bold text-foreground">
              {kpis.total_users.toLocaleString()}
            </div>
            <p className="text-[10px] text-muted-foreground mt-0.5">DAU: {kpis.dau} &bull; MAU: {kpis.mau}</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card/40 backdrop-blur-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
              <span>Total Employee Records</span>
              <Building2 className="h-4 w-4 text-cyan-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-display text-2xl font-bold text-cyan-400">
              {kpis.total_employees.toLocaleString()}
            </div>
            <p className="text-[10px] text-muted-foreground mt-0.5">Across all tenant databases</p>
          </CardContent>
        </Card>
      </div>

      {/* 3. CHARTS ROW */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Revenue Trend */}
        <Card className="border-border bg-card/40 backdrop-blur-xl lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold">Revenue Growth Trend</CardTitle>
            <CardDescription className="text-xs">Actual collected SaaS subscription payments over time</CardDescription>
          </CardHeader>
          <CardContent className="h-[240px] pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.revenue_trend}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="month" style={{ fontSize: 10 }} />
                <YAxis style={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ fontSize: 11 }} />
                <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} name="Collected Revenue (₹)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Access Status Distribution */}
        <Card className="border-border bg-card/40 backdrop-blur-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold">Access Status Distribution</CardTitle>
            <CardDescription className="text-xs">Breakdown of active, complimentary, and suspended tenants</CardDescription>
          </CardHeader>
          <CardContent className="h-[240px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={charts.status_distribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {charts.status_distribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ fontSize: 11 }} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* 4. "WHO IS USING WITHOUT PAYMENT?" WIDGET */}
      <Card className="border-indigo-500/20 bg-card/40 backdrop-blur-xl">
        <CardHeader className="pb-3 border-b border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-indigo-400 animate-pulse" />
              Complimentary / Unpaid Active Customers
            </CardTitle>
            <CardDescription className="text-xs">
              Dedicated tracking widget for organizations with active application access without payment.
            </CardDescription>
          </div>
          <Link
            to="/dashboard/super-admin/unpaid-active"
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
          >
            View All ({unpaid_active_customers.length}) <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          {unpaid_active_customers.length === 0 ? (
            <div className="py-12 text-center text-xs text-muted-foreground italic">
              No unpaid active customers found. All active tenants have paid subscriptions.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table className="min-w-[900px] border-collapse text-xs">
                <TableHeader className="bg-muted/10 text-muted-foreground uppercase text-[10px] tracking-wider border-b border-border">
                  <TableRow>
                    <TableHead className="px-4 py-3">Organization</TableHead>
                    <TableHead className="px-4 py-3">Plan</TableHead>
                    <TableHead className="px-4 py-3 text-center">Access Status</TableHead>
                    <TableHead className="px-4 py-3 text-center">Payment Status</TableHead>
                    <TableHead className="px-4 py-3">Granted By</TableHead>
                    <TableHead className="px-4 py-3">Expiry Date</TableHead>
                    <TableHead className="px-4 py-3">Reason</TableHead>
                    <TableHead className="px-4 py-3 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {unpaid_active_customers.slice(0, 5).map((org) => (
                    <TableRow key={org.id} className="border-t border-border hover:bg-accent/20">
                      <TableCell className="px-4 py-3 font-semibold text-foreground">
                        {org.name}
                        <span className="block text-[10px] font-normal text-muted-foreground">{org.owner_email}</span>
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <Badge variant="outline" className="border-indigo-500/30 text-indigo-400 text-[10px]">
                          {org.plan}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-center">
                        <Badge className="bg-indigo-500/10 text-indigo-400 border-none font-semibold text-[10px]">
                          {org.access_status}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-center">
                        <Badge className="bg-amber-500/10 text-amber-500 border-none font-semibold text-[10px]">
                          {org.payment_status}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-muted-foreground">{org.granted_by}</TableCell>
                      <TableCell className="px-4 py-3 text-muted-foreground">
                        {org.expires_at ? org.expires_at.split("T")[0] : "Lifetime"}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-muted-foreground max-w-[200px] truncate" title={org.reason}>
                        {org.reason}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-1.5">
                          <Link
                            to={`/dashboard/super-admin/organizations/${org.id}` as any}
                            className="rounded p-1 text-muted-foreground hover:text-foreground hover:bg-accent cursor-pointer"
                            title="View Customer Detail"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </Link>
                          <button
                            onClick={() => {
                              setSelectedOrg({
                                id: org.id,
                                name: org.name,
                                owner: { name: org.owner_name, email: org.owner_email },
                                user_count: 0,
                                employee_count: 0,
                                plan: org.plan,
                                access_status: org.access_status,
                                access_type: org.access_type,
                                payment_status: org.payment_status,
                                access_source: "SUPER_ADMIN",
                                access_granted_by: org.granted_by,
                                access_expires_at: org.expires_at,
                                access_grant_reason: org.reason,
                                mrr: 0,
                                created_at: null,
                              });
                              setExtendOpen(true);
                            }}
                            className="rounded px-2 py-1 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 text-[10px] font-semibold cursor-pointer"
                          >
                            Extend
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Modals */}
      <GrantAccessModal open={grantOpen} onOpenChange={setGrantOpen} org={selectedOrg} onSuccess={fetchDashboard} />
      <ExtendAccessModal open={extendOpen} onOpenChange={setExtendOpen} org={selectedOrg} onSuccess={fetchDashboard} />
      <SuspendAccessModal open={suspendOpen} onOpenChange={setSuspendOpen} org={selectedOrg} onSuccess={fetchDashboard} />
      <ReactivateAccessModal open={reactivateOpen} onOpenChange={setReactivateOpen} org={selectedOrg} onSuccess={fetchDashboard} />
    </div>
  );
}
