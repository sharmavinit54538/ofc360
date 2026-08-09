import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { superAdminApi } from "@/api/superAdminApi";
import { Sparkles, Cpu, RefreshCw, DollarSign } from "lucide-react";

export const Route = createFileRoute("/dashboard/super-admin/ai-usage")({
  head: () => ({ meta: [{ title: "AI Usage & Costs — Super Admin" }] }),
  component: SuperAdminAiUsagePage,
});

function SuperAdminAiUsagePage() {
  const [data, setData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAiUsage = async () => {
    setIsLoading(true);
    try {
      const res = await superAdminApi.getAiUsage();
      setData(res);
    } catch (err) {
      console.error("Failed to fetch AI usage:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAiUsage();
  }, []);

  if (isLoading || !data) {
    return <div className="p-8 text-center text-xs text-muted-foreground animate-pulse">Loading AI usage analytics...</div>;
  }

  const { summary, model_usage, top_consuming_tenants } = data;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-violet-400" />
            Platform AI Suite Telemetry & Token Cost Engine
          </h2>
          <p className="text-xs text-muted-foreground">Monitor Ollama local LLM execution and cloud provider token consumption.</p>
        </div>
        <Button onClick={fetchAiUsage} variant="outline" size="sm" className="h-8 text-xs gap-1.5">
          <RefreshCw className="h-3.5 w-3.5" /> Refresh Telemetry
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-border bg-card/40 backdrop-blur-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total Tokens Consumed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-display text-violet-400">{summary.total_tokens_consumed.toLocaleString()}</div>
            <p className="text-[10px] text-muted-foreground mt-0.5">{summary.total_ai_requests.toLocaleString()} LLM prompts processed</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card/40 backdrop-blur-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Estimated Cloud AI Cost
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-display text-emerald-400">${summary.estimated_cost_usd} USD</div>
            <p className="text-[10px] text-muted-foreground mt-0.5">Local Ollama queries run at $0 cost</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card/40 backdrop-blur-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Active AI Agents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-display text-indigo-400">{summary.active_ai_modules.length} Modules</div>
            <p className="text-[10px] text-muted-foreground mt-0.5">Recruitment, Documents, Copilot, Attendance</p>
          </CardContent>
        </Card>
      </div>

      {/* Top Consuming Tenants */}
      <Card className="border-border bg-card/40 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-sm font-bold">Top AI Consuming Organizations</CardTitle>
        </CardHeader>
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="text-xs">Organization</TableHead>
              <TableHead className="text-xs">Requests Count</TableHead>
              <TableHead className="text-xs">Tokens Used</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {top_consuming_tenants.map((t: any, idx: number) => (
              <TableRow key={idx} className="hover:bg-accent/40 text-xs">
                <TableCell className="font-semibold text-foreground">{t.name}</TableCell>
                <TableCell className="font-medium text-foreground">{t.requests.toLocaleString()}</TableCell>
                <TableCell className="text-muted-foreground">{t.tokens.toLocaleString()} tokens</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
