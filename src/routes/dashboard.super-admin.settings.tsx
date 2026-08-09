import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { superAdminApi } from "@/api/superAdminApi";
import { Settings, Save, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/dashboard/super-admin/settings")({
  head: () => ({ meta: [{ title: "Platform Settings — Super Admin" }] }),
  component: SuperAdminSettingsPage,
});

function SuperAdminSettingsPage() {
  const [settings, setSettings] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    superAdminApi.getSettings().then(setSettings).catch(console.error).finally(() => setIsLoading(false));
  }, []);

  const handleSave = async () => {
    if (!settings) return;
    setIsSaving(true);
    try {
      await superAdminApi.updateSettings(settings);
      alert("Platform settings updated successfully!");
    } catch (err: any) {
      alert("Failed to save settings: " + (err.message || "Unknown error"));
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !settings) {
    return <div className="p-8 text-center text-xs text-muted-foreground animate-pulse">Loading platform configuration...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Settings className="h-5 w-5 text-indigo-400" />
            Global SaaS Multi-Tenant Platform Configuration
          </h2>
          <p className="text-xs text-muted-foreground">Manage global registration defaults, security rules, and AI engine defaults.</p>
        </div>
        <Button disabled={isSaving} onClick={handleSave} size="sm" className="h-8 text-xs bg-indigo-600 hover:bg-indigo-700 text-white gap-1.5">
          <Save className="h-3.5 w-3.5" /> {isSaving ? "Saving..." : "Save Settings"}
        </Button>
      </div>

      <Card className="border-border bg-card/40 backdrop-blur-xl p-6 space-y-6">
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-foreground">Platform Application Title</label>
            <Input
              value={settings.app_name}
              onChange={(e) => setSettings({ ...settings, app_name: e.target.value })}
              className="bg-background/50 h-9 text-xs max-w-md"
            />
          </div>

          <div className="flex items-center justify-between py-2 border-t border-border">
            <div>
              <div className="text-xs font-bold text-foreground">Allow Self-Service Tenant Registration</div>
              <div className="text-[10px] text-muted-foreground">New companies can sign up without manual Super Admin invite</div>
            </div>
            <Switch
              checked={settings.allow_public_registrations}
              onCheckedChange={(val) => setSettings({ ...settings, allow_public_registrations: val })}
            />
          </div>

          <div className="flex items-center justify-between py-2 border-t border-border">
            <div>
              <div className="text-xs font-bold text-foreground">Enforce Single Super Admin Database Constraint</div>
              <div className="text-[10px] text-muted-foreground">Rejects any attempt to create or promote secondary Super Admin accounts</div>
            </div>
            <Switch
              checked={settings.enforce_single_super_admin}
              disabled
            />
          </div>

          <div className="flex items-center justify-between py-2 border-t border-border">
            <div>
              <div className="text-xs font-bold text-foreground">Enable Platform AI Suite Engine</div>
              <div className="text-[10px] text-muted-foreground">Activates Ollama local LLM processing across recruitment, attendance, and documents</div>
            </div>
            <Switch
              checked={settings.enable_ai_suite}
              onCheckedChange={(val) => setSettings({ ...settings, enable_ai_suite: val })}
            />
          </div>

          <div className="flex items-center justify-between py-2 border-t border-border">
            <div>
              <div className="text-xs font-bold text-foreground">Platform Maintenance Mode</div>
              <div className="text-[10px] text-rose-400 font-semibold">Temporarily restricts tenant user logins while performing system upgrades</div>
            </div>
            <Switch
              checked={settings.maintenance_mode}
              onCheckedChange={(val) => setSettings({ ...settings, maintenance_mode: val })}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
