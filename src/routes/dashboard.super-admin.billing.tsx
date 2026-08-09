import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { superAdminApi } from "@/api/superAdminApi";
import { CreditCard, DollarSign, Download, RefreshCw, CheckCircle2, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/dashboard/super-admin/billing")({
  head: () => ({ meta: [{ title: "Billing & Revenue — Super Admin" }] }),
  component: SuperAdminBillingPage,
});

function SuperAdminBillingPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPayments = async () => {
    setIsLoading(true);
    try {
      const data = await superAdminApi.getPayments();
      setPayments(data);
    } catch (err) {
      console.error("Failed to fetch payments:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const totalCollected = payments.filter((p) => p.status === "PAID").reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground">SaaS Revenue & Billing Operations</h2>
          <p className="text-xs text-muted-foreground">Track all tenant payments, Razorpay order IDs, invoices, and subscription collections.</p>
        </div>
        <Button onClick={fetchPayments} variant="outline" size="sm" className="h-8 text-xs gap-1.5">
          <RefreshCw className="h-3.5 w-3.5" /> Refresh Payments
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-border bg-card/40 backdrop-blur-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total Real Revenue Collected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-display text-emerald-400">₹{totalCollected.toLocaleString()}</div>
            <p className="text-[10px] text-muted-foreground mt-0.5">Verified gateway payment records</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card/40 backdrop-blur-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-display text-indigo-400">{payments.length}</div>
            <p className="text-[10px] text-muted-foreground mt-0.5">Paid, pending, and complimentary logs</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card/40 backdrop-blur-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Primary Gateway
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-display text-amber-400">Razorpay API</div>
            <p className="text-[10px] text-muted-foreground mt-0.5">HMAC-SHA256 Encrypted Signatures</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border bg-card/40 backdrop-blur-xl overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="text-xs">Invoice #</TableHead>
              <TableHead className="text-xs">Organization</TableHead>
              <TableHead className="text-xs">Amount</TableHead>
              <TableHead className="text-xs">Gateway</TableHead>
              <TableHead className="text-xs">Order / Payment ID</TableHead>
              <TableHead className="text-xs">Status</TableHead>
              <TableHead className="text-xs">Payment Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-xs text-muted-foreground">
                  Loading payment history...
                </TableCell>
              </TableRow>
            ) : payments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-xs text-muted-foreground">
                  No billing transactions recorded yet.
                </TableCell>
              </TableRow>
            ) : (
              payments.map((p) => (
                <TableRow key={p.id} className="hover:bg-accent/40 text-xs">
                  <TableCell className="font-semibold font-mono text-indigo-400">{p.invoice_number}</TableCell>
                  <TableCell className="font-medium text-foreground">{p.company_name}</TableCell>
                  <TableCell className="font-bold text-foreground">₹{p.amount.toLocaleString()}</TableCell>
                  <TableCell className="text-muted-foreground">{p.gateway}</TableCell>
                  <TableCell className="text-muted-foreground font-mono text-[10px]">
                    {p.razorpay_payment_id || p.razorpay_order_id || "—"}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={p.status === "PAID" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20"}>
                      {p.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(p.payment_date).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
