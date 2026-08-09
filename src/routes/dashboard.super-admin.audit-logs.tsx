import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { superAdminApi } from "@/api/superAdminApi";
import { ScrollText, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/dashboard/super-admin/audit-logs")({
  head: () => ({ meta: [{ title: "Global Audit History — Super Admin" }] }),
  component: GlobalAuditLogsPage,
});

function GlobalAuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const data = await superAdminApi.getGlobalAuditLogs();
      setLogs(data);
    } catch (err: any) {
      console.error("Failed to fetch global audit logs:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6">
      <Card className="border-border bg-card/40 backdrop-blur-xl">
        <CardHeader className="pb-3 border-b border-border">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <ScrollText className="h-4 w-4 text-indigo-400" />
            Immutable Super Admin Audit Trail
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Complete security audit record tracking every privileged grant, extension, suspension, cancellation, and plan change action across all tenants.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="py-12 text-center text-xs text-muted-foreground">Loading global audit log entries...</div>
          ) : logs.length === 0 ? (
            <div className="py-12 text-center text-xs text-muted-foreground italic">No audit events recorded in database yet.</div>
          ) : (
            <Table className="text-xs">
              <TableHeader className="bg-muted/10 border-b border-border text-[10px] uppercase">
                <TableRow>
                  <TableHead className="px-4 py-3">Action</TableHead>
                  <TableHead className="px-4 py-3">Performed By</TableHead>
                  <TableHead className="px-4 py-3">Organization</TableHead>
                  <TableHead className="px-4 py-3">Details & Justification</TableHead>
                  <TableHead className="px-4 py-3 text-right">Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id} className="border-t border-border hover:bg-accent/20">
                    <TableCell className="px-4 py-3">
                      <Badge variant="outline" className="border-indigo-500/30 text-indigo-400 font-bold text-[10px]">
                        {log.action}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3 font-semibold text-foreground">{log.actor_email || log.email}</TableCell>
                    <TableCell className="px-4 py-3 text-muted-foreground">{log.company_name || "Global / System"}</TableCell>
                    <TableCell className="px-4 py-3 text-muted-foreground leading-relaxed">{log.details}</TableCell>
                    <TableCell className="px-4 py-3 text-right text-muted-foreground font-mono text-[11px]">
                      {(log.timestamp || log.created_at || "").replace("T", " ").substring(0, 19)}
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
