import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Building2,
  LogOut,
  Save,
  Shield,
  User,
  ShieldCheck,
  ScrollText,
  CreditCard,
  ArrowRight,
  Bell,
  Palette,
  KeyRound,
  CheckCircle,
  Loader2,
  Lock,
  Phone,
  Mail,
  UserCheck,
  ShieldAlert,
  Moon,
  Sun,
  Laptop
} from "lucide-react";
import { PageHeader } from "@/components/ofc360/DashboardShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ofc360, useofc360 } from "@/lib/ofc360-store";
import { toast } from "sonner";
import { api } from "@/api/client";
import apiInstance from "@/api/apiInstance";

export const Route = createFileRoute("/dashboard/settings")({
  head: () => ({ meta: [{ title: "Settings — OFC360" }] }),
  component: SettingsPage,
});

// ----------------------------------------------------
// MAIN ROUTE DISPATCHER
// ----------------------------------------------------
function SettingsPage() {
  const ws = useofc360();
  const userRole = (ws.user?.role as string)?.toLowerCase() || "employee";

  if (userRole === "employee") {
    return <EmployeeSettingsPage />;
  }

  return <AdminSettingsPage />;
}

// ----------------------------------------------------
// DEDICATED EMPLOYEE SETTINGS PAGE
// ----------------------------------------------------
function EmployeeSettingsPage() {
  const ws = useofc360();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"profile" | "security" | "notifications" | "preferences">("profile");

  // Profile Form State
  const [fullName, setFullName] = useState(ws.user?.fullName || "");
  const [email, setEmail] = useState(ws.user?.email || "");
  const [phone, setPhone] = useState(ws.user?.phone || "");
  const [bio, setBio] = useState("");
  const [emergencyContactName, setEmergencyContactName] = useState("");
  const [emergencyContactPhone, setEmergencyContactPhone] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Security Form State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Notification Preferences State
  const [notifs, setNotifs] = useState({
    attendanceAlerts: true,
    leaveAlerts: true,
    payrollAlerts: true,
    hrAnnouncements: true,
    emailDigest: true,
  });
  const [isSavingNotifs, setIsSavingNotifs] = useState(false);

  // Appearance State
  const [themeMode, setThemeMode] = useState<"dark" | "light" | "system">("dark");

  // Load real user profile and notification preferences
  useEffect(() => {
    async function loadData() {
      try {
        const profRes = await api.get<{ data?: any }>("/settings/profile").catch(() => null);
        if (profRes?.data) {
          if (profRes.data.fullName) setFullName(profRes.data.fullName);
          if (profRes.data.email) setEmail(profRes.data.email);
          if (profRes.data.phone) setPhone(profRes.data.phone);
          if (profRes.data.bio) setBio(profRes.data.bio);
        }

        const notifRes = await api.get<{ data?: any }>("/settings/employee/notifications").catch(() => null);
        if (notifRes?.data) {
          setNotifs((prev) => ({ ...prev, ...notifRes.data }));
        }
      } catch (err) {
        console.error("Failed to load settings from server:", err);
      }
    }
    loadData();
  }, []);

  // Save Profile Handler
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      await apiInstance.put("/settings/profile", {
        fullName,
        email,
        phone,
        bio,
      });

      if (ws.user) {
        ofc360.set({
          user: {
            ...ws.user,
            fullName,
            email,
            phone,
          },
        });
      }

      toast.success("Personal profile updated successfully!");
    } catch (err: any) {
      console.error("Save profile error:", err);
      toast.error(err.response?.data?.message || err.message || "Failed to update profile.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Change Password Handler
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      toast.error("Please enter your current password.");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirmation do not match.");
      return;
    }

    setIsUpdatingPassword(true);
    try {
      await apiInstance.post("/settings/employee/change-password", {
        currentPassword,
        newPassword,
      });

      toast.success("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      console.error("Password update error:", err);
      toast.error(err.response?.data?.message || err.message || "Failed to update password.");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  // Save Notifications Handler
  const handleSaveNotifications = async () => {
    setIsSavingNotifs(true);
    try {
      await apiInstance.put("/settings/employee/notifications", notifs);
      toast.success("Notification preferences saved!");
    } catch (err: any) {
      console.error("Save notifications error:", err);
      toast.error(err.response?.data?.message || err.message || "Failed to save notifications.");
    } finally {
      setIsSavingNotifs(false);
    }
  };

  const tabs = [
    { id: "profile", label: "My Profile", icon: User },
    { id: "security", label: "Security & Account", icon: Shield },
    { id: "notifications", label: "Notification Preferences", icon: Bell },
    { id: "preferences", label: "Appearance", icon: Palette },
  ] as const;

  return (
    <div className="space-y-6 pb-12">
      {/* ── HEADER ────────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-xs font-semibold px-2.5 py-0.5">
            Employee Portal
          </Badge>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          My Settings
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage your personal profile, notification preferences, security, and app appearance.
        </p>
      </div>

      {/* ── LAYOUT WITH NAVIGATION ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_1fr]">
        <aside className="space-y-1">
          {tabs.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all cursor-pointer ${
                  active
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                    : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {t.label}
              </button>
            );
          })}
        </aside>

        <div className="rounded-2xl border border-border/60 bg-card/80 p-6 backdrop-blur-xl shadow-sm">
          {/* TAB 1: MY PROFILE */}
          {tab === "profile" && (
            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-foreground">Personal Profile</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Update your contact details and bio visible to your team.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-xs">Full Name</Label>
                  <Input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="h-9 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs">Personal / Contact Email</Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="h-9 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs">Phone Number</Label>
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="h-9 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs">Designation (Read-only)</Label>
                  <Input
                    value={ws.user?.role?.toUpperCase() || "EMPLOYEE"}
                    disabled
                    className="h-9 text-xs bg-muted/50 cursor-not-allowed font-medium text-muted-foreground"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">About Me / Bio</Label>
                <Textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Share a short bio or summary with your workspace..."
                  className="text-xs h-24"
                />
              </div>

              {/* Emergency Contact */}
              <div className="pt-4 border-t border-border/60 space-y-4">
                <h4 className="text-xs font-bold text-foreground uppercase tracking-wider text-muted-foreground">Emergency Contact Details</h4>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Emergency Contact Name</Label>
                    <Input
                      value={emergencyContactName}
                      onChange={(e) => setEmergencyContactName(e.target.value)}
                      placeholder="Primary contact person"
                      className="h-9 text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Emergency Contact Phone</Label>
                    <Input
                      value={emergencyContactPhone}
                      onChange={(e) => setEmergencyContactPhone(e.target.value)}
                      placeholder="Emergency phone number"
                      className="h-9 text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  type="submit"
                  disabled={isSavingProfile}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 h-9 px-4 text-xs cursor-pointer"
                >
                  {isSavingProfile ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                  Save Profile
                </Button>
              </div>
            </form>
          )}

          {/* TAB 2: SECURITY & ACCOUNT */}
          {tab === "security" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-foreground">Security & Credentials</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Update your password and manage active login sessions.
                </p>
              </div>

              <form onSubmit={handleChangePassword} className="space-y-4 border-b border-border/60 pb-6">
                <h4 className="text-xs font-bold text-foreground uppercase tracking-wider text-muted-foreground">Change Password</h4>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Current Password</Label>
                    <Input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      className="h-9 text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">New Password</Label>
                    <Input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="h-9 text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Confirm New Password</Label>
                    <Input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat new password"
                      className="h-9 text-xs"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={isUpdatingPassword}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 h-9 px-4 text-xs cursor-pointer"
                  >
                    {isUpdatingPassword ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <KeyRound className="h-3.5 w-3.5" />}
                    Update Password
                  </Button>
                </div>
              </form>

              {/* Active Session Info */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-foreground uppercase tracking-wider text-muted-foreground">Active Session</h4>
                <div className="p-3.5 rounded-xl border border-border bg-card/40 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-500/10 text-emerald-500">
                      <CheckCircle className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground">Current Active Device</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">Logged in from current web browser</p>
                    </div>
                  </div>
                  <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px]">Active Now</Badge>
                </div>
              </div>

              {/* Logout */}
              <div className="pt-4 border-t border-border/60">
                <Button
                  variant="destructive"
                  onClick={() => {
                    ofc360.reset();
                    navigate({ to: "/login" });
                    toast.info("Logged out successfully.");
                  }}
                  className="h-9 text-xs gap-2 cursor-pointer"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Sign Out of Account
                </Button>
              </div>
            </div>
          )}

          {/* TAB 3: NOTIFICATIONS */}
          {tab === "notifications" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-foreground">Notification Preferences</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Choose which alerts and email summaries you receive.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3.5 rounded-xl border border-border/60 bg-muted/10">
                  <div>
                    <p className="text-xs font-semibold text-foreground">Attendance Notifications</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">Check-in reminders and shift notifications</p>
                  </div>
                  <Switch
                    checked={notifs.attendanceAlerts}
                    onCheckedChange={(val) => setNotifs({ ...notifs, attendanceAlerts: val })}
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl border border-border/60 bg-muted/10">
                  <div>
                    <p className="text-xs font-semibold text-foreground">Leave Approval Updates</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">Receive alerts when your leave request is approved or rejected</p>
                  </div>
                  <Switch
                    checked={notifs.leaveAlerts}
                    onCheckedChange={(val) => setNotifs({ ...notifs, leaveAlerts: val })}
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl border border-border/60 bg-muted/10">
                  <div>
                    <p className="text-xs font-semibold text-foreground">Payroll & Payslip Alerts</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">Get notified as soon as monthly salary slips are generated</p>
                  </div>
                  <Switch
                    checked={notifs.payrollAlerts}
                    onCheckedChange={(val) => setNotifs({ ...notifs, payrollAlerts: val })}
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl border border-border/60 bg-muted/10">
                  <div>
                    <p className="text-xs font-semibold text-foreground">HR Announcements</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">Company-wide policy updates and organizational news</p>
                  </div>
                  <Switch
                    checked={notifs.hrAnnouncements}
                    onCheckedChange={(val) => setNotifs({ ...notifs, hrAnnouncements: val })}
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl border border-border/60 bg-muted/10">
                  <div>
                    <p className="text-xs font-semibold text-foreground">Weekly Activity Digest</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">Summary email of upcoming holidays and workplace events</p>
                  </div>
                  <Switch
                    checked={notifs.emailDigest}
                    onCheckedChange={(val) => setNotifs({ ...notifs, emailDigest: val })}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  onClick={handleSaveNotifications}
                  disabled={isSavingNotifs}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 h-9 px-4 text-xs cursor-pointer"
                >
                  {isSavingNotifs ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                  Save Preferences
                </Button>
              </div>
            </div>
          )}

          {/* TAB 4: PREFERENCES */}
          {tab === "preferences" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-foreground">App Appearance</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Customize theme display preferences for your account.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => setThemeMode("dark")}
                  className={`p-4 rounded-xl border text-center transition-all cursor-pointer ${
                    themeMode === "dark" ? "border-indigo-500 bg-indigo-500/10 text-indigo-400 font-bold" : "border-border bg-card/40 text-muted-foreground"
                  }`}
                >
                  <Moon className="h-6 w-6 mx-auto mb-2" />
                  <p className="text-xs">Dark Mode</p>
                </button>

                <button
                  onClick={() => setThemeMode("light")}
                  className={`p-4 rounded-xl border text-center transition-all cursor-pointer ${
                    themeMode === "light" ? "border-indigo-500 bg-indigo-500/10 text-indigo-400 font-bold" : "border-border bg-card/40 text-muted-foreground"
                  }`}
                >
                  <Sun className="h-6 w-6 mx-auto mb-2" />
                  <p className="text-xs">Light Mode</p>
                </button>

                <button
                  onClick={() => setThemeMode("system")}
                  className={`p-4 rounded-xl border text-center transition-all cursor-pointer ${
                    themeMode === "system" ? "border-indigo-500 bg-indigo-500/10 text-indigo-400 font-bold" : "border-border bg-card/40 text-muted-foreground"
                  }`}
                >
                  <Laptop className="h-6 w-6 mx-auto mb-2" />
                  <p className="text-xs">System Default</p>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// DEDICATED ADMIN / HR SETTINGS PAGE
// ----------------------------------------------------
function AdminSettingsPage() {
  const ws = useofc360();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"company" | "profile" | "security">("company");
  const [company, setCompany] = useState(ws.company ?? { id: "", name: "" });
  const [user, setUser] = useState(ws.user);

  function saveCompany() {
    ofc360.set({ company });
    toast.success("Company settings updated successfully");
  }

  function saveProfile() {
    if (user) {
      ofc360.set({ user });
      toast.success("Profile updated successfully");
    }
  }

  function reset() {
    ofc360.reset();
    navigate({ to: "/login" });
  }

  const adminCards = [
    {
      title: "Roles & Permissions",
      description: "Define user roles, access control levels, and system permissions.",
      icon: ShieldCheck,
      path: "/dashboard/roles",
      gradient: "from-blue-600/20 to-indigo-600/20",
      accentBorder: "border-blue-500/30 hover:border-blue-500/60",
      iconColor: "text-blue-500 bg-blue-500/10",
      buttonColor: "bg-blue-600 hover:bg-blue-700 text-white",
    },
    {
      title: "Audit Logs",
      description: "Track system activity, security events, user logins, and data modifications.",
      icon: ScrollText,
      path: "/dashboard/audit-logs",
      gradient: "from-purple-600/20 to-pink-600/20",
      accentBorder: "border-purple-500/30 hover:border-purple-500/60",
      iconColor: "text-purple-500 bg-purple-500/10",
      buttonColor: "bg-purple-600 hover:bg-purple-700 text-white",
    },
    {
      title: "Billing & Subscriptions",
      description: "Manage subscription plans, invoices, payment methods, and seat usage.",
      icon: CreditCard,
      path: "/dashboard/billing",
      gradient: "from-emerald-600/20 to-teal-600/20",
      accentBorder: "border-emerald-500/30 hover:border-emerald-500/60",
      iconColor: "text-emerald-500 bg-emerald-500/10",
      buttonColor: "bg-emerald-600 hover:bg-emerald-700 text-white",
    },
  ];

  const tabs = [
    { id: "company", label: "Company", icon: Building2 },
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Shield },
  ] as const;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Settings & Administration"
        description="Centralized management center for workspace settings, roles & permissions, billing, and security."
      />

      {/* Administration Quick Modules */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">Administration Modules</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {adminCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                onClick={() => navigate({ to: card.path as any })}
                className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border ${card.accentBorder} bg-card/60 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl cursor-pointer`}
              >
                <div
                  className={`absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gradient-to-br ${card.gradient} blur-2xl opacity-60 transition-opacity group-hover:opacity-100`}
                />

                <div className="relative space-y-3">
                  <div className={`grid h-12 w-12 place-items-center rounded-xl ${card.iconColor}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
                      {card.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {card.description}
                    </p>
                  </div>
                </div>

                <div className="relative pt-4 mt-4 border-t border-border/60">
                  <Button
                    className={`w-full justify-between rounded-xl font-medium shadow-md transition-all ${card.buttonColor}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate({ to: card.path as any });
                    }}
                  >
                    <span>Open {card.title.split(" ")[0]}</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Workspace & Account Configuration */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">General Configuration</h2>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[220px_1fr]">
          <aside className="space-y-1">
            {tabs.map((t) => {
              const Icon = t.icon;
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${active
                      ? "bg-accent text-foreground"
                      : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                    }`}
                >
                  <Icon className="h-4 w-4" />
                  {t.label}
                </button>
              );
            })}
          </aside>

          <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl">
            {tab === "company" ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <F label="Company Name">
                  <Input
                    value={company.name}
                    onChange={(e) => setCompany({ ...company, name: e.target.value })}
                  />
                </F>
                <F label="Email">
                  <Input
                    value={company.email ?? ""}
                    onChange={(e) => setCompany({ ...company, email: e.target.value })}
                  />
                </F>
                <F label="Phone">
                  <Input
                    value={company.phone ?? ""}
                    onChange={(e) => setCompany({ ...company, phone: e.target.value })}
                  />
                </F>
                <F label="Website">
                  <Input
                    value={company.website ?? ""}
                    onChange={(e) => setCompany({ ...company, website: e.target.value })}
                  />
                </F>
                <F label="City">
                  <Input
                    value={company.city ?? ""}
                    onChange={(e) => setCompany({ ...company, city: e.target.value })}
                  />
                </F>
                <F label="Country">
                  <Input
                    value={company.country ?? ""}
                    onChange={(e) => setCompany({ ...company, country: e.target.value })}
                  />
                </F>
                <div className="sm:col-span-2 flex justify-end">
                  <Button onClick={saveCompany}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </div>
            ) : null}

            {tab === "profile" && user ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <F label="Full Name">
                  <Input
                    value={user.fullName}
                    onChange={(e) => setUser({ ...user, fullName: e.target.value })}
                  />
                </F>
                <F label="Email">
                  <Input
                    value={user.email}
                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                  />
                </F>
                <F label="Phone">
                  <Input
                    value={user.phone}
                    onChange={(e) => setUser({ ...user, phone: e.target.value })}
                  />
                </F>
                <F label="Role">
                  <Input value={user.role} disabled />
                </F>
                <div className="sm:col-span-2 flex justify-end">
                  <Button onClick={saveProfile}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Profile
                  </Button>
                </div>
              </div>
            ) : null}

            {tab === "security" ? (
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium">Password</h3>
                  <p className="text-xs text-muted-foreground">
                    Use a strong unique password to keep your workspace secure.
                  </p>
                  <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <Input type="password" placeholder="Current password" />
                    <Input type="password" placeholder="New password" />
                    <Input type="password" placeholder="Confirm new password" />
                  </div>
                  <Button className="mt-3" onClick={() => toast.success("Password updated")}>
                    Update Password
                  </Button>
                </div>
                <div className="border-t border-border pt-6">
                  <h3 className="font-medium text-destructive">Danger Zone</h3>
                  <p className="text-xs text-muted-foreground">
                    Sign out of this workspace and clear local session data.
                  </p>
                  <Button variant="destructive" className="mt-3" onClick={reset}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out and Reset Workspace
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function F({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      {children}
    </div>
  );
}
