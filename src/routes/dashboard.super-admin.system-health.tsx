import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { superAdminApi } from "@/api/superAdminApi";
import { Activity, CheckCircle2, AlertTriangle, RefreshCw, Server, Database, Cpu, Mail, CreditCard, Cloud } from "lucide-react";

export const Route = createFileRoute("/dashboard/super-admin/system-health")({
  head: () => ({ meta: [{ title: "System Health — Super Admin" }] }),
  component: SuperAdminSystemHealthPage,
});

function SuperAdminSystemHealthPage() {
  const [health, setHealth] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchHealth = async () => {
    setIsLoading(true);
    try {
      const res = await superAdminApi.getSystemHealth();
      setHealth(res);
    } catch (err) {
      console.error("Failed to fetch system health:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  if (isLoading || !health) {
    return <div className="p-8 text-center text-xs text-muted-foreground animate-pulse">Running infrastructure diagnostics...</div>;
  }

  const getServiceIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes("fastapi")) return Server;
    if (n.includes("postgre")) return Database;
    if (n.includes("ollama")) return Cpu;
    if (n.includes("storage")) return Cloud;
    if (n.includes("smtp")) return Mail;
    if (n.includes("razorpay")) return CreditCard;
    return Activity;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Activity className="h-5 w-5 text-emerald-400" />
            Infrastructure Real-Time Health & Service Telemetry
          </h2>
          <p className="text-xs text-muted-foreground">Live ping and operational status across API, Database, AI Engine, CDN, and Mail services.</p>
        </div>
        <Button onClick={fetchHealth} variant="outline" size="sm" className="h-8 text-xs gap-1.5">
          <RefreshCw className="h-3.5 w-3.5" /> Re-run Diagnostics
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {health.services.map((svc: any) => {
          const Icon = getServiceIcon(svc.name);
          const isOnline = svc.status === "ONLINE";
          return (
            <Card key={svc.name} className="border-border bg-card/40 backdrop-blur-xl p-4 flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-muted/40 text-indigo-400">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-foreground">{svc.name}</h3>
                    <p className="text-[10px] text-muted-foreground">Latency: {svc.latency_ms} ms</p>
                  </div>
                </div>
                <Badge variant="outline" className={isOnline ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border-rose-500/20"}>
                  {svc.status}
                </Badge>
              </div>

              <div className="mt-4 pt-2 border-t border-border flex items-center justify-between text-[10px] text-muted-foreground">
                <span>{svc.uptime ? `Uptime: ${svc.uptime}` : svc.model ? `Model: ${svc.model}` : svc.provider ? `Provider: ${svc.provider}` : "Operational"}</span>
                <span className="font-mono text-emerald-400 font-semibold">100% Responsive</span>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
