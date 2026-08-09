import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { superAdminApi } from "@/api/superAdminApi";
import { Zap, Save, RefreshCw, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/dashboard/super-admin/entitlements")({
  head: () => ({ meta: [{ title: "Feature Entitlements — Super Admin" }] }),
  component: FeatureEntitlementsPage,
});

const ALL_MODULES = [
  { id: "attendance", label: "Attendance" },
  { id: "payroll", label: "Payroll" },
  { id: "recruitment", label: "Recruitment" },
  { id: "performance", label: "Performance" },
  { id: "documents", label: "Documents" },
  { id: "assets", label: "Assets" },
  { id: "ai_suite", label: "AI Suite" },
  { id: "reports", label: "Reports" },
  { id: "communication", label: "Communication" },
];

function FeatureEntitlementsPage() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [savingOrgId, setSavingOrgId] = useState<string | null>(null);

  const fetchEntitlements = async () => {
    setIsLoading(true);
    try {
      const res = await superAdminApi.getEntitlements();
      setData(res);
    } catch (err) {
      console.error("Failed to load feature entitlements matrix:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEntitlements();
  }, []);

  const handleToggleModule = (orgId: string, moduleId: string, val: boolean) => {
    setData((prev) =>
      prev.map((item) => {
        if (item.organization_id === orgId) {
          return {
            ...item,
            entitlements: {
              ...item.entitlements,
              [moduleId]: val,
            },
          };
        }
        return item;
      })
    );
  };

  const handleSaveEntitlements = async (item: any) => {
    setSavingOrgId(item.organization_id);
    try {
      await superAdminApi.updateEntitlements({
        organization_id: item.organization_id,
        enabled_modules: item.entitlements,
      });
      alert(`Feature entitlements for ${item.organization_name} persisted in backend!`);
    } catch (err: any) {
      alert("Failed to save entitlements: " + (err.response?.data?.detail || err.message));
    } finally {
      setSavingOrgId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Zap className="h-5 w-5 text-amber-400" />
            Backend-Enforced Feature Entitlements Matrix
          </h2>
          <p className="text-xs text-muted-foreground">
            Dynamically toggle module access per tenant organization. Changes persist in the backend database.
          </p>
        </div>
        <Button onClick={fetchEntitlements} variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
          <RefreshCw className="h-3.5 w-3.5" /> Refresh Matrix
        </Button>
      </div>

      <Card className="border-border bg-card/40 backdrop-blur-xl overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="text-xs">Organization</TableHead>
              {ALL_MODULES.map((m) => (
                <TableHead key={m.id} className="text-xs text-center">
                  {m.label}
                </TableHead>
              ))}
              <TableHead className="text-xs text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={ALL_MODULES.length + 2} className="text-center py-8 text-xs text-muted-foreground">
                  Loading feature entitlement matrix...
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={ALL_MODULES.length + 2} className="text-center py-8 text-xs text-muted-foreground">
                  No organizations found.
                </TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
                <TableRow key={item.organization_id} className="hover:bg-accent/40 text-xs">
                  <TableCell className="font-semibold text-foreground">
                    <div>{item.organization_name}</div>
                    <Badge variant="outline" className="text-[9px] mt-0.5 bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                      {item.status}
                    </Badge>
                  </TableCell>
                  {ALL_MODULES.map((m) => {
                    const isEnabled = Boolean(item.entitlements?.[m.id] ?? true);
                    return (
                      <TableCell key={m.id} className="text-center">
                        <Switch
                          checked={isEnabled}
                          onCheckedChange={(val) => handleToggleModule(item.organization_id, m.id, val)}
                        />
                      </TableCell>
                    );
                  })}
                  <TableCell className="text-right">
                    <Button
                      disabled={savingOrgId === item.organization_id}
                      onClick={() => handleSaveEntitlements(item)}
                      size="sm"
                      className="h-7 text-xs bg-indigo-600 hover:bg-indigo-700 text-white gap-1"
                    >
                      <Save className="h-3 w-3" />
                      {savingOrgId === item.organization_id ? "Saving..." : "Save"}
                    </Button>
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
