import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { superAdminApi } from "@/api/superAdminApi";
import { Package, Check, Sparkles, Shield, Cpu, HardDrive, Users } from "lucide-react";

export const Route = createFileRoute("/dashboard/super-admin/plans")({
  head: () => ({ meta: [{ title: "Plans & Subscriptions — Super Admin" }] }),
  component: PlansManagementPage,
});

function PlansManagementPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    superAdminApi.getPlans().then(setPlans).catch(console.error).finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground">SaaS Subscription Plans & Entitlement Limits</h2>
          <p className="text-xs text-muted-foreground">Configure global tier limits, user capacity, storage quotas, and AI credits per tier.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="h-80 border-border bg-card/40 animate-pulse" />
          ))
        ) : (
          plans.map((p) => (
            <Card key={p.id} className="border-border bg-card/40 backdrop-blur-xl relative overflow-hidden flex flex-col justify-between">
              {p.id === "professional" && (
                <div className="absolute top-0 right-0 bg-indigo-500 text-white text-[9px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-bl-lg">
                  Popular
                </div>
              )}
              <CardHeader className="pb-3">
                <Badge variant="outline" className="w-fit text-[10px] uppercase bg-indigo-500/10 text-indigo-400 border-indigo-500/20 mb-2">
                  {p.status}
                </Badge>
                <CardTitle className="text-base font-bold">{p.name}</CardTitle>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-2xl font-bold font-display text-foreground">₹{p.price_monthly}</span>
                  <span className="text-xs text-muted-foreground">/ month</span>
                </div>
              </CardHeader>

              <CardContent className="space-y-3 flex-1 text-xs">
                <div className="space-y-2 border-t border-border pt-3">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5 text-blue-400" /> Max Users</span>
                    <span className="font-semibold text-foreground">{p.max_users}</span>
                  </div>
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span className="flex items-center gap-1.5"><HardDrive className="h-3.5 w-3.5 text-emerald-400" /> Storage Limit</span>
                    <span className="font-semibold text-foreground">{p.storage_gb} GB</span>
                  </div>
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span className="flex items-center gap-1.5"><Sparkles className="h-3.5 w-3.5 text-amber-400" /> AI Credits</span>
                    <span className="font-semibold text-foreground">{p.ai_credits.toLocaleString()} / mo</span>
                  </div>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-border">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Included Modules</span>
                  {p.enabled_modules.map((m: string) => (
                    <div key={m} className="flex items-center gap-1.5 text-foreground capitalize">
                      <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      <span>{m.replace("_", " ")}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
