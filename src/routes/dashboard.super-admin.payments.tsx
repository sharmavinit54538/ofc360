import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { superAdminApi } from "@/api/superAdminApi";
import { DollarSign, CreditCard, Download, FileText, CheckCircle2, RefreshCw } from "lucide-react";

export const Route = createFileRoute("/dashboard/super-admin/payments")({
  head: () => ({ meta: [{ title: "Payments & Revenue — Super Admin" }] }),
  component: PaymentsControlPage,
});

function PaymentsControlPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchPayments = async () => {
    setIsLoading(true);
    try {
      const data = await superAdminApi.getPayments();
      setPayments(data);
    } catch (err: any) {
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-border bg-card/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-muted-foreground uppercase flex justify-between">
              <span>Total Revenue</span>
              <DollarSign className="h-4 w-4 text-emerald-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-display text-2xl font-bold text-emerald-500">
              ₹{totalCollected.toLocaleString()}
            </div>
            <p className="text-[10px] text-muted-foreground mt-0.5">Real collected payment transactions</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-muted-foreground uppercase flex justify-between">
              <span>Total Transactions</span>
              <CreditCard className="h-4 w-4 text-indigo-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-display text-2xl font-bold text-foreground">
              {payments.length}
            </div>
            <p className="text-[10px] text-muted-foreground mt-0.5">Payment attempts in database</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-muted-foreground uppercase flex justify-between">
              <span>Payment Gateways</span>
              <FileText className="h-4 w-4 text-blue-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-display text-base font-bold text-foreground">
              Razorpay Web Standard
            </div>
            <p className="text-[10px] text-muted-foreground mt-0.5">HMAC-SHA256 signature verified</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border bg-card/40">
        <CardHeader className="pb-3 border-b border-border">
          <CardTitle className="text-sm font-bold">Real Payment Transactions Log</CardTitle>
          <CardDescription className="text-xs">
            Complimentary access grants are excluded from revenue totals to maintain strict accounting accuracy.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="py-12 text-center text-xs text-muted-foreground">Loading payment records...</div>
          ) : payments.length === 0 ? (
            <div className="py-12 text-center text-xs text-muted-foreground italic">No payment transactions recorded in database yet.</div>
          ) : (
            <Table className="text-xs">
              <TableHeader className="bg-muted/10 border-b border-border">
                <TableRow>
                  <TableHead className="px-4 py-3">Invoice #</TableHead>
                  <TableHead className="px-4 py-3">Organization</TableHead>
                  <TableHead className="px-4 py-3">Amount</TableHead>
                  <TableHead className="px-4 py-3">Gateway</TableHead>
                  <TableHead className="px-4 py-3">Status</TableHead>
                  <TableHead className="px-4 py-3">Order ID / Payment ID</TableHead>
                  <TableHead className="px-4 py-3 text-right">Payment Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((p) => (
                  <TableRow key={p.id} className="border-t border-border hover:bg-accent/20">
                    <TableCell className="px-4 py-3 font-mono font-semibold text-indigo-400">{p.invoice_number}</TableCell>
                    <TableCell className="px-4 py-3 font-semibold text-foreground">{p.company_name}</TableCell>
                    <TableCell className="px-4 py-3 font-bold text-emerald-400">₹{p.amount.toLocaleString()} {p.currency}</TableCell>
                    <TableCell className="px-4 py-3">{p.gateway}</TableCell>
                    <TableCell className="px-4 py-3">
                      <Badge className={p.status === "PAID" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"}>
                        {p.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3 font-mono text-[11px] text-muted-foreground">
                      {p.razorpay_payment_id || p.razorpay_order_id || "—"}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right text-muted-foreground">
                      {p.payment_date ? p.payment_date.split("T")[0] : "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
