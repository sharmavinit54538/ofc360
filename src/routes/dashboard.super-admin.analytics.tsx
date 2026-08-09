import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { superAdminApi } from "@/api/superAdminApi";
import { BarChart3, HardDrive, FileText, RefreshCw } from "lucide-react";

export const Route = createFileRoute("/dashboard/super-admin/analytics")({
  head: () => ({ meta: [{ title: "Platform Analytics — Super Admin" }] }),
  component: SuperAdminAnalyticsPage,
});

function SuperAdminAnalyticsPage() {
  const [data, setData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    superAdminApi.getAnalytics().then(setData).catch(console.error).finally(() => setIsLoading(false));
  }, []);

  if (isLoading || !data) {
    return <div className="p-8 text-center text-xs text-muted-foreground animate-pulse">Loading platform analytics...</div>;
  }

  const { module_usage, storage } = data;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground">Platform Engagement & Module Usage Analytics</h2>
          <p className="text-xs text-muted-foreground">Across-tenant operational feature usage rates and platform resource allocations.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="border-border bg-card/40 backdrop-blur-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
              <span>Cloud Storage Usage</span>
              <HardDrive className="h-4 w-4 text-cyan-400" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-display text-cyan-400">{storage.total_used_gb} GB</div>
            <p className="text-[10px] text-muted-foreground mt-0.5">Out of {storage.total_allocated_gb} GB allocated across tenants</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card/40 backdrop-blur-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
              <span>Documents Vault Storage</span>
              <FileText className="h-4 w-4 text-indigo-400" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-display text-indigo-400">{storage.documents_count.toLocaleString()} Docs</div>
            <p className="text-[10px] text-muted-foreground mt-0.5">Verified HR & Employee uploads</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border bg-card/40 backdrop-blur-xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-foreground">Module Adoption & Active Usage</h3>
        <div className="space-y-3">
          {module_usage.map((m: any) => (
            <div key={m.module} className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span>{m.module}</span>
                <span className="text-muted-foreground">{m.active_users} active users ({m.percentage}%)</span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted/40 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                  style={{ width: `${m.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
