import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { superAdminApi } from "@/api/superAdminApi";
import { ShieldCheck, Lock, Key, AlertOctagon, CheckCircle2, ShieldAlert } from "lucide-react";

export const Route = createFileRoute("/dashboard/super-admin/security")({
  head: () => ({ meta: [{ title: "Platform Security — Super Admin" }] }),
  component: SuperAdminSecurityPage,
});

function SuperAdminSecurityPage() {
  const [sec, setSec] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    superAdminApi.getSecurity().then(setSec).catch(console.error).finally(() => setIsLoading(false));
  }, []);

  if (isLoading || !sec) {
    return <div className="p-8 text-center text-xs text-muted-foreground animate-pulse">Loading security status...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-indigo-400" />
            Platform Security & Session Access Control
          </h2>
          <p className="text-xs text-muted-foreground">JWT validation, server-enforced RBAC, tenant data isolation, and single Super Admin integrity.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-border bg-card/40 backdrop-blur-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Platform Security Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-display text-emerald-400">{sec.security_score} / 100</div>
            <p className="text-[10px] text-muted-foreground mt-0.5">Strict server authorization & DB partial index enabled</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card/40 backdrop-blur-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Active Sessions Count
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-display text-indigo-400">{sec.active_sessions_count}</div>
            <p className="text-[10px] text-muted-foreground mt-0.5">Active JWT tokens across all tenants</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card/40 backdrop-blur-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Single Super Admin Rule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-display text-purple-400">1 Account (Enforced)</div>
            <p className="text-[10px] text-muted-foreground mt-0.5">PostgreSQL Partial Unique Constraint Active</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border bg-card/40 backdrop-blur-xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-foreground">Security Controls & Authorization Safeguards</h3>
        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span className="font-semibold text-foreground">Strict Server-Side Tenant Isolation</span>
            </div>
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">Enforced</Badge>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span className="font-semibold text-foreground">JWT Token Validation & Role Verification</span>
            </div>
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">Active (HS256)</Badge>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span className="font-semibold text-foreground">Super Admin Creation Privilege Block</span>
            </div>
            <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/20">Locked</Badge>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span className="font-semibold text-foreground">Tenant View Audit Logging</span>
            </div>
            <Badge variant="outline" className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20">Immutable Logs</Badge>
          </div>
        </div>
      </Card>
    </div>
  );
}
