import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ofc360 } from "@/lib/ofc360-store";
import {
  superAdminApi,
  type OrganizationSummary
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
  Search, Plus, Filter, Sparkles, Clock, Ban, RefreshCw, Zap, Eye, ShieldAlert,
  Building2, AlertCircle, CheckCircle2, UserCheck
} from "lucide-react";


export const Route = createFileRoute("/dashboard/super-admin/organizations")({
  head: () => ({ meta: [{ title: "Organizations Control — Super Admin" }] }),
  component: OrganizationsControlPage,
});

function OrganizationsControlPage() {
  const [organizations, setOrganizations] = useState<OrganizationSummary[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [search, setSearch] = useState("");
  const [accessFilter, setAccessFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");

  // Modals state
  const [selectedOrg, setSelectedOrg] = useState<OrganizationSummary | null>(null);
  const [grantOpen, setGrantOpen] = useState(false);
  const [extendOpen, setExtendOpen] = useState(false);
  const [suspendOpen, setSuspendOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [reactivateOpen, setReactivateOpen] = useState(false);
  const [changePlanOpen, setChangePlanOpen] = useState(false);

  const fetchOrganizations = async () => {
    setIsLoading(true);
    try {
      const data = await superAdminApi.getOrganizations({
        search: search || undefined,
        access_status: accessFilter !== "all" ? accessFilter : undefined,
        payment_status: paymentFilter !== "all" ? paymentFilter : undefined,
        plan: planFilter !== "all" ? planFilter : undefined,
      });
      setOrganizations(data);
    } catch (err: any) {
      console.error("Failed to fetch organizations:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, [search, accessFilter, paymentFilter, planFilter]);

  const getAccessBadgeClass = (status: string) => {
    const s = status.toUpperCase();
    if (s.includes("PAID")) return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    if (s.includes("COMPLIMENTARY")) return "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
    if (s.includes("FREE")) return "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
    if (s.includes("TRIAL")) return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    if (s.includes("SUSPENDED")) return "bg-rose-500/10 text-rose-400 border-rose-500/20";
    if (s.includes("CANCELLED")) return "bg-rose-900/20 text-rose-300 border-rose-800/30";
    if (s.includes("EXPIRED")) return "bg-neutral-500/10 text-neutral-400 border-neutral-500/20";
    return "bg-muted text-muted-foreground";
  };

  const getPaymentBadgeClass = (status: string) => {
    const s = status.toUpperCase();
    if (s === "PAID") return "bg-emerald-500/10 text-emerald-400 border-none font-semibold";
    if (s === "UNPAID") return "bg-amber-500/10 text-amber-500 border-none font-semibold";
    if (s === "FAILED") return "bg-rose-500/10 text-rose-500 border-none font-semibold";
    return "bg-muted text-muted-foreground border-none";
  };

  return (
    <div className="space-y-6">
      {/* FILTER BAR & SEARCH */}
      <Card className="border-border bg-card/40 backdrop-blur-xl">
        <CardContent className="p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by organization, owner name, email..."
              className="pl-9 h-9 bg-background/50 border-border text-xs"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <Select value={accessFilter} onValueChange={setAccessFilter}>
              <SelectTrigger className="h-9 w-[150px] bg-background/50 border-border text-xs">
                <SelectValue placeholder="Access Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Access States</SelectItem>
                <SelectItem value="ACTIVE_COMPLIMENTARY">Complimentary</SelectItem>
                <SelectItem value="ACTIVE_PAID">Paid Active</SelectItem>
                <SelectItem value="TRIAL">Trial</SelectItem>
                <SelectItem value="ACTIVE_FREE">Free</SelectItem>
                <SelectItem value="SUSPENDED">Suspended</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
                <SelectItem value="EXPIRED">Expired</SelectItem>
              </SelectContent>
            </Select>

            <Select value={paymentFilter} onValueChange={setPaymentFilter}>
              <SelectTrigger className="h-9 w-[140px] bg-background/50 border-border text-xs">
                <SelectValue placeholder="Payment Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payments</SelectItem>
                <SelectItem value="PAID">Paid</SelectItem>
                <SelectItem value="UNPAID">Unpaid</SelectItem>
                <SelectItem value="FAILED">Failed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={planFilter} onValueChange={setPlanFilter}>
              <SelectTrigger className="h-9 w-[130px] bg-background/50 border-border text-xs">
                <SelectValue placeholder="Plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Plans</SelectItem>
                <SelectItem value="Basic">Basic</SelectItem>
                <SelectItem value="Professional">Professional</SelectItem>
                <SelectItem value="Enterprise">Enterprise</SelectItem>
                <SelectItem value="Custom">Custom</SelectItem>
              </SelectContent>
            </Select>

            <Button
              onClick={() => {
                setSelectedOrg(organizations[0] || null);
                setGrantOpen(true);
              }}
              className="h-9 text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-medium gap-1.5 cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Grant Access
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ORGANIZATIONS DATA TABLE */}
      <Card className="border-border bg-card/40 backdrop-blur-xl">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="py-16 text-center text-xs text-muted-foreground">
              Loading organizations from backend database...
            </div>
          ) : organizations.length === 0 ? (
            <div className="py-16 text-center text-xs text-muted-foreground">
              No organizations found matching search criteria.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table className="min-w-[1000px] border-collapse text-xs">
                <TableHeader className="bg-muted/10 text-muted-foreground uppercase text-[10px] tracking-wider border-b border-border">
                  <TableRow>
                    <TableHead className="px-4 py-3">Organization & Owner</TableHead>
                    <TableHead className="px-4 py-3 text-center">Users / Emps</TableHead>
                    <TableHead className="px-4 py-3">Plan</TableHead>
                    <TableHead className="px-4 py-3 text-center">Access Status</TableHead>
                    <TableHead className="px-4 py-3 text-center">Payment</TableHead>
                    <TableHead className="px-4 py-3">Expiry</TableHead>
                    <TableHead className="px-4 py-3 text-right">MRR</TableHead>
                    <TableHead className="px-4 py-3 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {organizations.map((org) => (
                    <TableRow key={org.id} className="border-t border-border hover:bg-accent/20 transition-colors">
                      <TableCell className="px-4 py-3">
                        <Link
                          to={`/dashboard/super-admin/organizations/${org.id}` as any}
                          className="font-bold text-foreground hover:text-indigo-400 transition-colors flex items-center gap-1.5"
                        >
                          <Building2 className="h-3.5 w-3.5 text-indigo-400" />
                          {org.name}
                        </Link>
                        <span className="block text-[11px] font-normal text-muted-foreground mt-0.5">
                          {org.owner?.name} &bull; {org.owner?.email}
                        </span>
                      </TableCell>

                      <TableCell className="px-4 py-3 text-center">
                        <span className="font-semibold text-foreground">{org.user_count}</span>
                        <span className="text-muted-foreground"> / {org.employee_count}</span>
                      </TableCell>

                      <TableCell className="px-4 py-3">
                        <Badge variant="outline" className="border-indigo-500/30 text-indigo-400 text-[10px]">
                          {org.plan}
                        </Badge>
                      </TableCell>

                      <TableCell className="px-4 py-3 text-center">
                        <Badge className={`${getAccessBadgeClass(org.access_status)} text-[10px] font-semibold uppercase`}>
                          {org.access_status}
                        </Badge>
                      </TableCell>

                      <TableCell className="px-4 py-3 text-center">
                        <Badge className={`${getPaymentBadgeClass(org.payment_status)} text-[10px]`}>
                          {org.payment_status}
                        </Badge>
                      </TableCell>

                      <TableCell className="px-4 py-3 text-muted-foreground">
                        {org.access_expires_at ? org.access_expires_at.split("T")[0] : "Lifetime"}
                      </TableCell>

                      <TableCell className="px-4 py-3 text-right font-mono font-semibold text-foreground">
                        ₹{org.mrr.toLocaleString()}
                      </TableCell>

                      {/* QUICK ACTION BUTTONS */}
                      <TableCell className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={async () => {
                              try {
                                await superAdminApi.enterTenantMode(org.id);
                                ofc360.set({ tenantModeCompany: { id: org.id, name: org.name } });
                                window.location.href = "/dashboard";
                              } catch (err: any) {
                                alert("Failed to enter tenant mode: " + (err.message || "Error"));
                              }
                            }}
                            className="rounded px-2 py-1 bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 text-[10px] font-bold cursor-pointer flex items-center gap-1"
                            title="Open Organization in Tenant Management Mode"
                          >
                            <Eye className="h-3 w-3" /> Open Org
                          </button>

                          <Link
                            to={`/dashboard/super-admin/organizations/${org.id}` as any}
                            className="rounded px-2 py-1 bg-accent/60 hover:bg-accent text-[10px] font-semibold text-foreground cursor-pointer"
                            title="View Full Detail"
                          >
                            Detail
                          </Link>

                          <button
                            onClick={() => {
                              setSelectedOrg(org);
                              setGrantOpen(true);
                            }}
                            className="rounded px-2 py-1 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 text-[10px] font-semibold cursor-pointer"
                            title="Grant Access"
                          >
                            Grant
                          </button>

                          <button
                            onClick={() => {
                              setSelectedOrg(org);
                              setExtendOpen(true);
                            }}
                            className="rounded px-2 py-1 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 text-[10px] font-semibold cursor-pointer"
                            title="Extend Access"
                          >
                            Extend
                          </button>

                          {org.access_status === "SUSPENDED" ? (
                            <button
                              onClick={() => {
                                setSelectedOrg(org);
                                setReactivateOpen(true);
                              }}
                              className="rounded px-2 py-1 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 text-[10px] font-semibold cursor-pointer"
                              title="Reactivate"
                            >
                              Reactivate
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                setSelectedOrg(org);
                                setSuspendOpen(true);
                              }}
                              className="rounded px-2 py-1 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 text-[10px] font-semibold cursor-pointer"
                              title="Suspend"
                            >
                              Suspend
                            </button>
                          )}
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
      <GrantAccessModal open={grantOpen} onOpenChange={setGrantOpen} org={selectedOrg} onSuccess={fetchOrganizations} />
      <ExtendAccessModal open={extendOpen} onOpenChange={setExtendOpen} org={selectedOrg} onSuccess={fetchOrganizations} />
      <SuspendAccessModal open={suspendOpen} onOpenChange={setSuspendOpen} org={selectedOrg} onSuccess={fetchOrganizations} />
      <CancelAccessModal open={cancelOpen} onOpenChange={setCancelOpen} org={selectedOrg} onSuccess={fetchOrganizations} />
      <ReactivateAccessModal open={reactivateOpen} onOpenChange={setReactivateOpen} org={selectedOrg} onSuccess={fetchOrganizations} />
      <ChangePlanModal open={changePlanOpen} onOpenChange={setChangePlanOpen} org={selectedOrg} onSuccess={fetchOrganizations} />
    </div>
  );
}
