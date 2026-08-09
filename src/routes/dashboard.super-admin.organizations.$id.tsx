import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import {
  superAdminApi,
  type OrganizationDetail
} from "@/api/superAdminApi";
import {
  GrantAccessModal,
  SuspendAccessModal,
  CancelAccessModal,
  ExtendAccessModal,
  ReactivateAccessModal,
  ChangePlanModal
} from "@/components/super-admin/AdminActionModals";
import {
  Building2, Users, CreditCard, DollarSign, Sparkles, Ban, RefreshCw, Zap, Clock,
  ShieldAlert, ScrollText, CheckCircle2, UserCheck, ShieldCheck, Mail, Phone, Calendar,
  FileText, Activity, AlertTriangle, ArrowLeft
} from "lucide-react";

export const Route = createFileRoute("/dashboard/super-admin/organizations/$id")({
  head: () => ({ meta: [{ title: "Organization Detail — Super Admin" }] }),
  component: OrganizationDetailPage,
});

function OrganizationDetailPage() {
  const { id } = useParams({ from: "/dashboard/super-admin/organizations/$id" });
  const [detail, setDetail] = useState<OrganizationDetail | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Modals state
  const [grantOpen, setGrantOpen] = useState(false);
  const [extendOpen, setExtendOpen] = useState(false);
  const [suspendOpen, setSuspendOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [reactivateOpen, setReactivateOpen] = useState(false);
  const [changePlanOpen, setChangePlanOpen] = useState(false);

  const fetchDetail = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await superAdminApi.getOrganizationDetail(id);
      setDetail(res);
    } catch (err: any) {
      console.error("Failed to load organization detail:", err);
      setError(err.response?.data?.detail || err.message || "Failed to load detail");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchDetail();
  }, [id]);

  const handleRemoveComplimentary = async () => {
    if (!detail) return;
    const reason = prompt("Enter reason for removing complimentary access:");
    if (!reason || !reason.trim()) return;

    try {
      await superAdminApi.removeComplimentary(detail.id, { reason });
      toast.success("Removed complimentary access.");
      fetchDetail();
    } catch (err: any) {
      toast.error(err.response?.data?.detail || err.message || "Failed to remove complimentary status");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-32 rounded-2xl bg-card/40 border border-border animate-pulse" />
        <div className="h-96 rounded-2xl bg-card/40 border border-border animate-pulse" />
      </div>
    );
  }

  if (error || !detail) {
    return (
      <Card className="border-rose-500/20 bg-rose-500/5 p-8 text-center">
        <AlertTriangle className="mx-auto h-8 w-8 text-rose-500 mb-2" />
        <h3 className="font-bold text-foreground">Organization Not Found</h3>
        <p className="text-xs text-muted-foreground mt-1">{error}</p>
        <Link to="/dashboard/super-admin/organizations" className="mt-4 inline-block">
          <Button variant="outline" className="h-8 text-xs">Back to Organizations</Button>
        </Link>
      </Card>
    );
  }

  const { subscription, owner, stats } = detail;
  const isComplimentary = subscription.access_status === "ACTIVE_COMPLIMENTARY";
  const isSuspended = subscription.access_status === "SUSPENDED";

  // Summary object for modals
  const orgSummary = {
    id: detail.id,
    name: detail.name,
    owner: { name: owner.name, email: owner.email },
    user_count: stats.user_count,
    employee_count: stats.employee_count,
    plan: subscription.plan,
    access_status: subscription.access_status,
    access_type: subscription.access_type,
    payment_status: subscription.payment_status,
    access_source: subscription.access_source,
    access_granted_by: subscription.access_granted_by,
    access_expires_at: subscription.access_expires_at,
    access_grant_reason: subscription.access_grant_reason,
    mrr: subscription.mrr,
    created_at: detail.created_at,
  };

  return (
    <div className="space-y-6">
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <Link
            to="/dashboard/super-admin/organizations"
            className="text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1 mb-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Organizations
          </Link>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center font-bold text-indigo-400">
              {detail.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h1 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
                {detail.name}
                <Badge variant="outline" className="border-indigo-500/30 text-indigo-400 text-xs">
                  {subscription.plan}
                </Badge>
              </h1>
              <p className="text-xs text-muted-foreground">
                Owner: {owner.name} &bull; {owner.email} &bull; Created: {detail.created_at ? detail.created_at.split("T")[0] : "—"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            onClick={() => setGrantOpen(true)}
            className="h-9 text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-medium gap-1.5 cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5" /> Grant Access
          </Button>

          <Button
            onClick={() => setExtendOpen(true)}
            variant="outline"
            className="h-9 text-xs border-border gap-1.5 cursor-pointer"
          >
            <Clock className="h-3.5 w-3.5 text-blue-500" /> Extend Access
          </Button>

          {isSuspended ? (
            <Button
              onClick={() => setReactivateOpen(true)}
              className="h-9 text-xs bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Reactivate
            </Button>
          ) : (
            <Button
              onClick={() => setSuspendOpen(true)}
              variant="outline"
              className="h-9 text-xs border-rose-500/30 text-rose-400 hover:bg-rose-500/10 gap-1.5 cursor-pointer"
            >
              <Ban className="h-3.5 w-3.5" /> Suspend
            </Button>
          )}
        </div>
      </div>

      {/* 10 TABS INTERFACE */}
      <Tabs defaultValue="access" className="w-full">
        <TabsList className="bg-card/40 border border-border p-1 overflow-x-auto scrollbar-none flex gap-1 h-auto flex-wrap">
          <TabsTrigger value="overview" className="text-xs py-1.5 px-3">Overview</TabsTrigger>
          <TabsTrigger value="access" className="text-xs py-1.5 px-3 font-bold text-indigo-400">Access Control</TabsTrigger>
          <TabsTrigger value="users" className="text-xs py-1.5 px-3">Users ({stats.user_count})</TabsTrigger>
          <TabsTrigger value="employees" className="text-xs py-1.5 px-3">Employees ({stats.employee_count})</TabsTrigger>
          <TabsTrigger value="subscription" className="text-xs py-1.5 px-3">Subscription</TabsTrigger>
          <TabsTrigger value="payments" className="text-xs py-1.5 px-3">Payments ({detail.payments.length})</TabsTrigger>
          <TabsTrigger value="invoices" className="text-xs py-1.5 px-3">Invoices</TabsTrigger>
          <TabsTrigger value="usage" className="text-xs py-1.5 px-3">Usage</TabsTrigger>
          <TabsTrigger value="activity" className="text-xs py-1.5 px-3">Activity</TabsTrigger>
          <TabsTrigger value="audit" className="text-xs py-1.5 px-3">Audit Logs ({detail.audit_logs.length})</TabsTrigger>
        </TabsList>

        {/* TAB 1: OVERVIEW */}
        <TabsContent value="overview" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-border bg-card/40">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs text-muted-foreground uppercase">Organization Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                <p><strong>Name:</strong> {detail.name}</p>
                <p><strong>Owner:</strong> {owner.name}</p>
                <p><strong>Email:</strong> {owner.email}</p>
                <p><strong>Phone:</strong> {owner.phone || "N/A"}</p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card/40">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs text-muted-foreground uppercase">Subscription & Billing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                <p><strong>Plan:</strong> {subscription.plan}</p>
                <p><strong>Access Status:</strong> <Badge>{subscription.access_status}</Badge></p>
                <p><strong>Payment Status:</strong> <Badge variant="outline">{subscription.payment_status}</Badge></p>
                <p><strong>Total Spent:</strong> ₹{stats.total_spent.toLocaleString()}</p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card/40">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs text-muted-foreground uppercase">Usage Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                <p><strong>Total Users:</strong> {stats.user_count}</p>
                <p><strong>Total Employees:</strong> {stats.employee_count}</p>
                <p><strong>Access Source:</strong> {subscription.access_source}</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* TAB 2: ACCESS CONTROL (MOST IMPORTANT SECTION) */}
        <TabsContent value="access" className="space-y-6 pt-4">
          <Card className="border-indigo-500/20 bg-indigo-500/5 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-indigo-400" />
                Manual Access Control Center
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                View and override access parameters directly in the backend database.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* CURRENT ACCESS PARAMETERS GRID */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 rounded-xl border border-border bg-card/60 p-4 text-xs">
                <div>
                  <span className="text-muted-foreground text-[10px] uppercase font-bold block">Current Access</span>
                  <Badge className="mt-1 bg-indigo-500/20 text-indigo-300 font-bold border-none text-xs">
                    {subscription.access_status}
                  </Badge>
                </div>

                <div>
                  <span className="text-muted-foreground text-[10px] uppercase font-bold block">Access Source</span>
                  <span className="mt-1 font-semibold text-foreground block">{subscription.access_source}</span>
                </div>

                <div>
                  <span className="text-muted-foreground text-[10px] uppercase font-bold block">Current Plan</span>
                  <span className="mt-1 font-semibold text-indigo-400 block">{subscription.plan}</span>
                </div>

                <div>
                  <span className="text-muted-foreground text-[10px] uppercase font-bold block">Payment Required</span>
                  <span className="mt-1 font-semibold text-foreground block">
                    {subscription.payment_status === "PAID" ? "NO" : "NO (Complimentary Override)"}
                  </span>
                </div>

                <div>
                  <span className="text-muted-foreground text-[10px] uppercase font-bold block">Granted By</span>
                  <span className="mt-1 text-foreground block">{subscription.access_granted_by || "Super Admin"}</span>
                </div>

                <div>
                  <span className="text-muted-foreground text-[10px] uppercase font-bold block">Start / Granted Date</span>
                  <span className="mt-1 text-foreground block">
                    {subscription.access_granted_at ? subscription.access_granted_at.split("T")[0] : "—"}
                  </span>
                </div>

                <div>
                  <span className="text-muted-foreground text-[10px] uppercase font-bold block">Expiration Date</span>
                  <span className="mt-1 font-bold text-foreground block">
                    {subscription.access_expires_at ? subscription.access_expires_at.split("T")[0] : "Lifetime (Never)"}
                  </span>
                </div>

                <div>
                  <span className="text-muted-foreground text-[10px] uppercase font-bold block">Payment Status</span>
                  <Badge variant="outline" className="mt-1 border-amber-500/30 text-amber-400">
                    {subscription.payment_status}
                  </Badge>
                </div>
              </div>

              {/* REASON & INTERNAL NOTES */}
              <div className="rounded-xl border border-border bg-card/60 p-4 space-y-2 text-xs">
                <p><strong>Grant Reason:</strong> {subscription.access_grant_reason || "None specified"}</p>
                {subscription.internal_note && <p><strong>Internal Note:</strong> {subscription.internal_note}</p>}
                {subscription.suspension_reason && <p className="text-rose-400"><strong>Suspension Reason:</strong> {subscription.suspension_reason}</p>}
              </div>

              {/* ACTION BUTTONS PANEL */}
              <div className="border-t border-border pt-4">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
                  Super Admin Management Actions
                </h4>
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    onClick={() => setGrantOpen(true)}
                    className="h-9 text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-semibold gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="h-3.5 w-3.5" /> [Grant Access]
                  </Button>

                  <Button
                    onClick={() => setExtendOpen(true)}
                    variant="outline"
                    className="h-9 text-xs border-border gap-1.5 cursor-pointer"
                  >
                    <Clock className="h-3.5 w-3.5 text-blue-400" /> [Extend Access]
                  </Button>

                  <Button
                    onClick={() => setChangePlanOpen(true)}
                    variant="outline"
                    className="h-9 text-xs border-border gap-1.5 cursor-pointer"
                  >
                    <Zap className="h-3.5 w-3.5 text-amber-400" /> [Change Plan]
                  </Button>

                  {isSuspended ? (
                    <Button
                      onClick={() => setReactivateOpen(true)}
                      className="h-9 text-xs bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 cursor-pointer"
                    >
                      <RefreshCw className="h-3.5 w-3.5" /> [Reactivate Access]
                    </Button>
                  ) : (
                    <Button
                      onClick={() => setSuspendOpen(true)}
                      variant="outline"
                      className="h-9 text-xs border-rose-500/30 text-rose-400 hover:bg-rose-500/10 gap-1.5 cursor-pointer"
                    >
                      <Ban className="h-3.5 w-3.5" /> [Suspend Access]
                    </Button>
                  )}

                  <Button
                    onClick={() => setCancelOpen(true)}
                    variant="outline"
                    className="h-9 text-xs border-rose-800/40 text-rose-300 hover:bg-rose-900/20 gap-1.5 cursor-pointer"
                  >
                    <ShieldAlert className="h-3.5 w-3.5" /> [Cancel Access]
                  </Button>

                  {isComplimentary && (
                    <Button
                      onClick={handleRemoveComplimentary}
                      variant="outline"
                      className="h-9 text-xs border-amber-500/30 text-amber-400 hover:bg-amber-500/10 gap-1.5 cursor-pointer"
                    >
                      <AlertTriangle className="h-3.5 w-3.5" /> [Remove Complimentary Access]
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 3: USERS */}
        <TabsContent value="users" className="pt-4">
          <Card className="border-border bg-card/40">
            <CardContent className="p-0">
              <Table className="text-xs">
                <TableHeader className="bg-muted/10 border-b border-border">
                  <TableRow>
                    <TableHead className="px-4 py-3">Name</TableHead>
                    <TableHead className="px-4 py-3">Email</TableHead>
                    <TableHead className="px-4 py-3">Role</TableHead>
                    <TableHead className="px-4 py-3">Status</TableHead>
                    <TableHead className="px-4 py-3">Last Login</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {detail.users.map((u) => (
                    <TableRow key={u.id} className="border-t border-border">
                      <TableCell className="px-4 py-3 font-semibold text-foreground">{u.name}</TableCell>
                      <TableCell className="px-4 py-3 text-muted-foreground">{u.email}</TableCell>
                      <TableCell className="px-4 py-3 uppercase font-semibold text-indigo-400">{u.role}</TableCell>
                      <TableCell className="px-4 py-3">
                        <Badge className={u.is_active ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"}>
                          {u.is_active ? "Active" : "Disabled"}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-muted-foreground">
                        {u.last_login_at ? u.last_login_at.split("T")[0] : "Never"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 4: EMPLOYEES */}
        <TabsContent value="employees" className="pt-4">
          <Card className="border-border bg-card/40 p-6 text-xs text-muted-foreground">
            Total active employees in this tenant database: <strong>{stats.employee_count}</strong>.
          </Card>
        </TabsContent>

        {/* TAB 5: SUBSCRIPTION */}
        <TabsContent value="subscription" className="pt-4">
          <Card className="border-border bg-card/40 p-6 space-y-2 text-xs">
            <p><strong>Plan Name:</strong> {subscription.plan}</p>
            <p><strong>Monthly Price (MRR):</strong> ₹{subscription.mrr}</p>
            <p><strong>Access Source:</strong> {subscription.access_source}</p>
            <p><strong>Expiry:</strong> {subscription.access_expires_at || "Lifetime"}</p>
          </Card>
        </TabsContent>

        {/* TAB 6: PAYMENTS */}
        <TabsContent value="payments" className="pt-4">
          <Card className="border-border bg-card/40">
            <CardContent className="p-0">
              {detail.payments.length === 0 ? (
                <div className="py-8 text-center text-xs text-muted-foreground italic">
                  No payment records found for this organization.
                </div>
              ) : (
                <Table className="text-xs">
                  <TableHeader className="bg-muted/10 border-b border-border">
                    <TableRow>
                      <TableHead className="px-4 py-3">Invoice #</TableHead>
                      <TableHead className="px-4 py-3">Amount</TableHead>
                      <TableHead className="px-4 py-3">Gateway</TableHead>
                      <TableHead className="px-4 py-3">Status</TableHead>
                      <TableHead className="px-4 py-3">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {detail.payments.map((p) => (
                      <TableRow key={p.id} className="border-t border-border">
                        <TableCell className="px-4 py-3 font-mono font-semibold">{p.invoice_number}</TableCell>
                        <TableCell className="px-4 py-3 font-semibold text-emerald-400">₹{p.amount}</TableCell>
                        <TableCell className="px-4 py-3">{p.gateway}</TableCell>
                        <TableCell className="px-4 py-3">
                          <Badge className={p.status === "PAID" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"}>
                            {p.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-muted-foreground">{p.payment_date.split("T")[0]}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 7: INVOICES */}
        <TabsContent value="invoices" className="pt-4">
          <Card className="border-border bg-card/40 p-6 text-xs text-muted-foreground">
            Invoices automatically generated for paid subscription orders.
          </Card>
        </TabsContent>

        {/* TAB 8: USAGE */}
        <TabsContent value="usage" className="pt-4">
          <Card className="border-border bg-card/40 p-6 text-xs text-muted-foreground">
            Tenant storage, API quota, and active session metrics.
          </Card>
        </TabsContent>

        {/* TAB 9: ACTIVITY */}
        <TabsContent value="activity" className="pt-4">
          <Card className="border-border bg-card/40 p-6 text-xs text-muted-foreground">
            Real-time user logins and system event activity stream.
          </Card>
        </TabsContent>

        {/* TAB 10: AUDIT LOGS */}
        <TabsContent value="audit" className="pt-4">
          <Card className="border-border bg-card/40">
            <CardContent className="p-0">
              {detail.audit_logs.length === 0 ? (
                <div className="py-8 text-center text-xs text-muted-foreground italic">
                  No audit logs recorded yet.
                </div>
              ) : (
                <Table className="text-xs">
                  <TableHeader className="bg-muted/10 border-b border-border">
                    <TableRow>
                      <TableHead className="px-4 py-3">Action</TableHead>
                      <TableHead className="px-4 py-3">Performed By</TableHead>
                      <TableHead className="px-4 py-3">Details</TableHead>
                      <TableHead className="px-4 py-3">Timestamp</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {detail.audit_logs.map((a) => (
                      <TableRow key={a.id} className="border-t border-border">
                        <TableCell className="px-4 py-3">
                          <Badge variant="outline" className="border-indigo-500/30 text-indigo-400 font-bold text-[10px]">
                            {a.action}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-foreground">{a.email}</TableCell>
                        <TableCell className="px-4 py-3 text-muted-foreground max-w-[350px]">{a.details}</TableCell>
                        <TableCell className="px-4 py-3 text-muted-foreground">{a.created_at.replace("T", " ").substring(0, 19)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Modals */}
      <GrantAccessModal open={grantOpen} onOpenChange={setGrantOpen} org={orgSummary} onSuccess={fetchDetail} />
      <ExtendAccessModal open={extendOpen} onOpenChange={setExtendOpen} org={orgSummary} onSuccess={fetchDetail} />
      <SuspendAccessModal open={suspendOpen} onOpenChange={setSuspendOpen} org={orgSummary} onSuccess={fetchDetail} />
      <CancelAccessModal open={cancelOpen} onOpenChange={setCancelOpen} org={orgSummary} onSuccess={fetchDetail} />
      <ReactivateAccessModal open={reactivateOpen} onOpenChange={setReactivateOpen} org={orgSummary} onSuccess={fetchDetail} />
      <ChangePlanModal open={changePlanOpen} onOpenChange={setChangePlanOpen} org={orgSummary} onSuccess={fetchDetail} />
    </div>
  );
}
