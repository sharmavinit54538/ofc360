import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { superAdminApi, type OrganizationSummary } from "@/api/superAdminApi";
import {
  ExtendAccessModal,
  SuspendAccessModal,
  GrantAccessModal
} from "@/components/super-admin/AdminActionModals";
import { Sparkles, AlertTriangle, Eye, Clock, Ban, RefreshCw, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/dashboard/super-admin/unpaid-active")({
  head: () => ({ meta: [{ title: "Unpaid Active Customers — Super Admin" }] }),
  component: UnpaidActivePage,
});

function UnpaidActivePage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Modals state
  const [selectedOrg, setSelectedOrg] = useState<OrganizationSummary | null>(null);
  const [grantOpen, setGrantOpen] = useState(false);
  const [extendOpen, setExtendOpen] = useState(false);
  const [suspendOpen, setSuspendOpen] = useState(false);

  const fetchUnpaidActive = async () => {
    setIsLoading(true);
    try {
      const data = await superAdminApi.getUnpaidActive();
      setCustomers(data);
    } catch (err: any) {
      console.error("Failed to fetch unpaid active customers:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUnpaidActive();
  }, []);

  return (
    <div className="space-y-6">
      <Card className="border-indigo-500/20 bg-indigo-500/5 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-indigo-400 animate-pulse" />
            "Who is Using Without Payment?" — Complimentary & Trial Directory
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Complete list of active customer organizations currently operating with complimentary, promotional, trial, or unpaid access grants.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0 border-t border-border">
          {isLoading ? (
            <div className="py-12 text-center text-xs text-muted-foreground">Loading directory...</div>
          ) : customers.length === 0 ? (
            <div className="py-12 text-center text-xs text-muted-foreground italic">
              No unpaid active customers found. All active tenants are fully paid.
            </div>
          ) : (
            <Table className="text-xs">
              <TableHeader className="bg-muted/10 border-b border-border uppercase text-[10px]">
                <TableRow>
                  <TableHead className="px-4 py-3">Organization</TableHead>
                  <TableHead className="px-4 py-3">Plan</TableHead>
                  <TableHead className="px-4 py-3 text-center">Access Status</TableHead>
                  <TableHead className="px-4 py-3 text-center">Payment</TableHead>
                  <TableHead className="px-4 py-3">Granted By</TableHead>
                  <TableHead className="px-4 py-3">Granted Date</TableHead>
                  <TableHead className="px-4 py-3">Expiry Date</TableHead>
                  <TableHead className="px-4 py-3">Reason</TableHead>
                  <TableHead className="px-4 py-3 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((c) => (
                  <TableRow key={c.id} className="border-t border-border hover:bg-accent/20">
                    <TableCell className="px-4 py-3">
                      <Link
                        to={`/dashboard/super-admin/organizations/${c.id}` as any}
                        className="font-bold text-foreground hover:text-indigo-400"
                      >
                        {c.name}
                      </Link>
                      <span className="block text-[10px] text-muted-foreground">{c.owner_email}</span>
                    </TableCell>

                    <TableCell className="px-4 py-3">
                      <Badge variant="outline" className="border-indigo-500/30 text-indigo-400 text-[10px]">
                        {c.plan}
                      </Badge>
                    </TableCell>

                    <TableCell className="px-4 py-3 text-center">
                      <Badge className="bg-indigo-500/10 text-indigo-400 font-semibold text-[10px] border-none">
                        {c.access_status}
                      </Badge>
                    </TableCell>

                    <TableCell className="px-4 py-3 text-center">
                      <Badge className="bg-amber-500/10 text-amber-500 font-semibold text-[10px] border-none">
                        {c.payment_status}
                      </Badge>
                    </TableCell>

                    <TableCell className="px-4 py-3 text-muted-foreground">{c.granted_by}</TableCell>
                    <TableCell className="px-4 py-3 text-muted-foreground">{c.granted_at ? c.granted_at.split("T")[0] : "—"}</TableCell>
                    <TableCell className="px-4 py-3 font-semibold text-foreground">{c.expires_at ? c.expires_at.split("T")[0] : "Lifetime"}</TableCell>
                    <TableCell className="px-4 py-3 text-muted-foreground max-w-[200px] truncate" title={c.reason}>
                      {c.reason}
                    </TableCell>

                    <TableCell className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1.5">
                        <Link
                          to={`/dashboard/super-admin/organizations/${c.id}` as any}
                          className="rounded p-1 text-muted-foreground hover:text-foreground hover:bg-accent"
                          title="View Detail"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Link>
                        <button
                          onClick={() => {
                            setSelectedOrg({
                              id: c.id,
                              name: c.name,
                              owner: { name: c.owner_name, email: c.owner_email },
                              user_count: 0,
                              employee_count: 0,
                              plan: c.plan,
                              access_status: c.access_status,
                              access_type: c.access_type,
                              payment_status: c.payment_status,
                              access_source: "SUPER_ADMIN",
                              access_granted_by: c.granted_by,
                              access_expires_at: c.expires_at,
                              access_grant_reason: c.reason,
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
          )}
        </CardContent>
      </Card>

      <ExtendAccessModal open={extendOpen} onOpenChange={setExtendOpen} org={selectedOrg} onSuccess={fetchUnpaidActive} />
      <SuspendAccessModal open={suspendOpen} onOpenChange={setSuspendOpen} org={selectedOrg} onSuccess={fetchUnpaidActive} />
    </div>
  );
}
