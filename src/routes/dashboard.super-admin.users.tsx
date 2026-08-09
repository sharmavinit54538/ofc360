import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { superAdminApi } from "@/api/superAdminApi";
import { Search, ShieldAlert, UserCheck, UserX, RefreshCw, Lock } from "lucide-react";

export const Route = createFileRoute("/dashboard/super-admin/users")({
  head: () => ({ meta: [{ title: "Users & Access — Super Admin" }] }),
  component: SuperAdminUsersPage,
});

function SuperAdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const data = await superAdminApi.getUsers({
        search: search || undefined,
        role: roleFilter !== "all" ? roleFilter : undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
      });
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch global users:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search, roleFilter, statusFilter]);

  const handleToggleStatus = async (user: any) => {
    setActionLoading(user.id);
    try {
      await superAdminApi.updateUserStatus(user.id, {
        is_active: !user.is_active,
        reason: `Super Admin toggle status to ${!user.is_active}`,
      });
      await fetchUsers();
    } catch (err: any) {
      alert(err.response?.data?.detail || "Failed to update user status");
    } finally {
      setActionLoading(null);
    }
  };

  const getRoleBadge = (role: string) => {
    const r = role.toLowerCase();
    if (r === "super_admin") return "bg-purple-500/20 text-purple-400 border-purple-500/30 font-bold";
    if (r === "company_admin" || r === "admin") return "bg-blue-500/20 text-blue-400 border-blue-500/30 font-semibold";
    if (r === "hr_admin" || r === "hr") return "bg-indigo-500/20 text-indigo-400 border-indigo-500/30";
    if (r === "manager") return "bg-amber-500/20 text-amber-400 border-amber-500/30";
    return "bg-slate-500/20 text-slate-300 border-slate-500/30";
  };

  return (
    <div className="space-y-6">
      {/* Notice Banner */}
      <div className="flex items-center justify-between rounded-xl border border-indigo-500/20 bg-indigo-500/10 p-4 text-xs text-indigo-300">
        <div className="flex items-center gap-2">
          <Lock className="h-4 w-4 text-indigo-400 shrink-0" />
          <span>
            <strong>Role Protection Policy:</strong> Super Admin role is immutable and restricted to exactly ONE global account. Tenant users cannot be promoted to SUPER_ADMIN.
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <Card className="border-border bg-card/40 backdrop-blur-xl">
        <CardContent className="p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search user name, email, or organization..."
              className="pl-9 bg-background/50 h-9 text-xs"
            />
          </div>

          <div className="flex items-center gap-2">
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[140px] h-9 text-xs bg-background/50">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="super_admin">SUPER_ADMIN</SelectItem>
                <SelectItem value="company_admin">COMPANY_ADMIN</SelectItem>
                <SelectItem value="hr_admin">HR_ADMIN</SelectItem>
                <SelectItem value="manager">MANAGER</SelectItem>
                <SelectItem value="employee">EMPLOYEE</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[130px] h-9 text-xs bg-background/50">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={fetchUsers} variant="outline" size="sm" className="h-9 px-3 gap-1 text-xs">
              <RefreshCw className="h-3.5 w-3.5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users Directory Table */}
      <Card className="border-border bg-card/40 backdrop-blur-xl overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="text-xs">User Name</TableHead>
              <TableHead className="text-xs">Email Address</TableHead>
              <TableHead className="text-xs">Organization</TableHead>
              <TableHead className="text-xs">Role</TableHead>
              <TableHead className="text-xs">Status</TableHead>
              <TableHead className="text-xs">Last Login</TableHead>
              <TableHead className="text-xs text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-xs text-muted-foreground">
                  Loading global users directory...
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-xs text-muted-foreground">
                  No users found matching query.
                </TableCell>
              </TableRow>
            ) : (
              users.map((u) => (
                <TableRow key={u.id} className="hover:bg-accent/40 text-xs">
                  <TableCell className="font-semibold text-foreground">{u.name}</TableCell>
                  <TableCell className="text-muted-foreground">{u.email}</TableCell>
                  <TableCell className="font-medium text-foreground">{u.company_name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-[10px] uppercase ${getRoleBadge(u.role)}`}>
                      {u.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={u.is_active ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border-rose-500/20"}>
                      {u.is_active ? "ACTIVE" : "INACTIVE"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {u.last_login_at ? new Date(u.last_login_at).toLocaleString() : "Never"}
                  </TableCell>
                  <TableCell className="text-right">
                    {u.role === "super_admin" ? (
                      <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">Protected Owner</span>
                    ) : (
                      <Button
                        disabled={actionLoading === u.id}
                        onClick={() => handleToggleStatus(u)}
                        variant="ghost"
                        size="sm"
                        className={`h-7 px-2 text-xs font-semibold gap-1 ${u.is_active ? "text-rose-400 hover:bg-rose-500/10" : "text-emerald-400 hover:bg-emerald-500/10"}`}
                      >
                        {u.is_active ? <UserX className="h-3.5 w-3.5" /> : <UserCheck className="h-3.5 w-3.5" />}
                        {u.is_active ? "Deactivate" : "Activate"}
                      </Button>
                    )}
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
