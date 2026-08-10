import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import {
  Layers,
  Plus,
  Search,
  RefreshCw,
  Trash2,
  Edit2,
  Copy,
  Eye,
  CheckCircle2,
  Clock,
  AlertCircle,
  Users,
  CreditCard,
  Building2,
  ShieldCheck,
  Zap,
  TrendingUp,
  FileSpreadsheet,
  Download,
  Filter,
  DollarSign,
  MinusCircle,
  PlusCircle,
  X,
} from "lucide-react";
import { PageHeader } from "@/components/ofc360/DashboardShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { api } from "@/api";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/payroll/salary-structure")({
  head: () => ({ meta: [{ title: "Salary Structure — OFC360" }] }),
  component: SalaryStructurePage,
});

export type CalcType = "FIXED" | "PERCENT_BASIC" | "PERCENT_CTC";

export interface ComponentRow {
  id: string;
  name: string;
  calc_type: CalcType;
  value: number;
}

export interface SalaryStructureTemplate {
  id: string;
  name: string;
  grade: string;
  effective_date?: string;
  min_ctc: number;
  max_ctc: number;
  assigned_employees_count: number;
  status: "ACTIVE" | "DRAFT" | "ARCHIVED";
  earnings: ComponentRow[];
  deductions: ComponentRow[];
  created_at?: string;
  updated_at?: string;
}

export interface HeroMetrics {
  total_templates?: number;
  mapped_employees?: number;
  unmapped_employees?: number;
  last_updated?: string;
}

const DEFAULT_EARNINGS: ComponentRow[] = [
  { id: "e1", name: "Basic Salary", calc_type: "FIXED", value: 35000 },
  { id: "e2", name: "House Rent Allowance (HRA)", calc_type: "PERCENT_BASIC", value: 40 },
  { id: "e3", name: "Special Allowance", calc_type: "FIXED", value: 15000 },
];

const DEFAULT_DEDUCTIONS: ComponentRow[] = [
  { id: "d1", name: "Provident Fund (PF)", calc_type: "PERCENT_BASIC", value: 12 },
  { id: "d2", name: "Professional Tax (PT)", calc_type: "FIXED", value: 200 },
  { id: "d3", name: "Tax Deducted at Source (TDS)", calc_type: "FIXED", value: 1500 },
];

function SalaryStructurePage() {
  const [templates, setTemplates] = useState<SalaryStructureTemplate[]>([]);
  const [hero, setHero] = useState<HeroMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [gradeFilter, setGradeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Modal States
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<SalaryStructureTemplate | null>(null);
  const [viewingTemplate, setViewingTemplate] = useState<SalaryStructureTemplate | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form State for Create/Edit
  const [formName, setFormName] = useState("");
  const [formGrade, setFormGrade] = useState("L2");
  const [formEffectiveDate, setFormEffectiveDate] = useState(new Date().toISOString().split("T")[0]);
  const [formMinCtc, setFormMinCtc] = useState<number | string>(600000);
  const [formMaxCtc, setFormMaxCtc] = useState<number | string>(1200000);
  const [formStatus, setFormStatus] = useState<"ACTIVE" | "DRAFT" | "ARCHIVED">("ACTIVE");
  const [formEarnings, setFormEarnings] = useState<ComponentRow[]>(DEFAULT_EARNINGS);
  const [formDeductions, setFormDeductions] = useState<ComponentRow[]>(DEFAULT_DEDUCTIONS);

  async function loadData() {
    setIsLoading(true);
    try {
      const res = await api.get<any>("payroll/salary-structure");
      if (res && res.success !== false) {
        const data = res.data || res;
        setTemplates(data.templates || data.items || (Array.isArray(data) ? data : []));
        setHero(data.hero || data.metrics || null);
      }
    } catch (err: any) {
      console.error("Failed to load salary structures:", err);
      toast.error(err?.message || "Failed to load salary structures from server.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function openCreateDialog() {
    setEditingTemplate(null);
    setFormName("");
    setFormGrade("L2");
    setFormEffectiveDate(new Date().toISOString().split("T")[0]);
    setFormMinCtc(600000);
    setFormMaxCtc(1200000);
    setFormStatus("ACTIVE");
    setFormEarnings(DEFAULT_EARNINGS);
    setFormDeductions(DEFAULT_DEDUCTIONS);
    setIsDialogOpen(true);
  }

  function openEditDialog(template: SalaryStructureTemplate) {
    setEditingTemplate(template);
    setFormName(template.name);
    setFormGrade(template.grade);
    setFormEffectiveDate(template.effective_date || new Date().toISOString().split("T")[0]);
    setFormMinCtc(template.min_ctc || 0);
    setFormMaxCtc(template.max_ctc || 0);
    setFormStatus(template.status || "ACTIVE");
    setFormEarnings(template.earnings && template.earnings.length > 0 ? template.earnings : DEFAULT_EARNINGS);
    setFormDeductions(template.deductions && template.deductions.length > 0 ? template.deductions : DEFAULT_DEDUCTIONS);
    setIsDialogOpen(true);
  }

  async function handleSaveTemplate() {
    if (!formName.trim()) {
      toast.error("Template name is required.");
      return;
    }
    setIsSaving(true);
    try {
      const payload = {
        name: formName,
        grade: formGrade,
        effective_date: formEffectiveDate,
        min_ctc: Number(formMinCtc) || 0,
        max_ctc: Number(formMaxCtc) || 0,
        status: formStatus,
        earnings: formEarnings,
        deductions: formDeductions,
      };

      if (editingTemplate) {
        const res = await api.put<any>(`payroll/salary-structure/${editingTemplate.id}`, payload);
        if (res && res.success !== false) {
          toast.success("Salary structure updated successfully!");
          setIsDialogOpen(false);
          setEditingTemplate(null);
          loadData();
        } else {
          toast.error(res?.message || "Failed to update salary structure.");
        }
      } else {
        const res = await api.post<any>("payroll/salary-structure", payload);
        if (res && res.success !== false) {
          toast.success("Salary structure created successfully!");
          setIsDialogOpen(false);
          loadData();
        } else {
          toast.error(res?.message || "Failed to create salary structure.");
        }
      }
    } catch (err: any) {
      console.error("Error saving salary structure:", err);
      toast.error(err?.message || "Error saving salary structure to server.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDuplicateTemplate(template: SalaryStructureTemplate) {
    try {
      const payload = {
        name: `${template.name} (Copy)`,
        grade: template.grade,
        min_ctc: template.min_ctc,
        max_ctc: template.max_ctc,
        status: "DRAFT",
        earnings: template.earnings,
        deductions: template.deductions,
      };
      const res = await api.post<any>("payroll/salary-structure", payload);
      if (res && res.success !== false) {
        toast.success("Salary structure duplicated!");
        loadData();
      } else {
        toast.error(res?.message || "Failed to duplicate template.");
      }
    } catch (err: any) {
      console.error("Duplicate template error:", err);
      toast.error(err?.message || "Failed to duplicate template.");
    }
  }

  async function handleDeleteTemplate() {
    if (!deletingId) return;
    setIsDeleting(true);
    try {
      const res = await api.delete<any>(`payroll/salary-structure/${deletingId}`);
      if (res && res.success !== false) {
        toast.success("Salary structure deleted successfully!");
        setDeletingId(null);
        loadData();
      } else {
        toast.error(res?.message || "Failed to delete salary structure.");
      }
    } catch (err: any) {
      console.error("Delete template error:", err);
      toast.error(err?.message || "Failed to delete salary structure.");
    } finally {
      setIsDeleting(false);
    }
  }

  // Component row helpers
  function addEarningRow() {
    setFormEarnings((prev) => [
      ...prev,
      { id: `e_${Date.now()}`, name: "New Allowance", calc_type: "FIXED", value: 0 },
    ]);
  }

  function removeEarningRow(id: string) {
    setFormEarnings((prev) => prev.filter((r) => r.id !== id));
  }

  function updateEarningRow(id: string, field: keyof ComponentRow, val: any) {
    setFormEarnings((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: val } : r))
    );
  }

  function addDeductionRow() {
    setFormDeductions((prev) => [
      ...prev,
      { id: `d_${Date.now()}`, name: "New Deduction", calc_type: "FIXED", value: 0 },
    ]);
  }

  function removeDeductionRow(id: string) {
    setFormDeductions((prev) => prev.filter((r) => r.id !== id));
  }

  function updateDeductionRow(id: string, field: keyof ComponentRow, val: any) {
    setFormDeductions((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: val } : r))
    );
  }

  // Computed Live CTC breakup summary
  const liveBreakup = useMemo(() => {
    const basicRow = formEarnings.find((e) => e.name.toLowerCase().includes("basic"));
    const basicVal = basicRow ? Number(basicRow.value) || 0 : 35000;

    const gross = formEarnings.reduce((sum, row) => {
      const v = Number(row.value) || 0;
      if (row.calc_type === "FIXED") return sum + v;
      if (row.calc_type === "PERCENT_BASIC") return sum + (basicVal * v) / 100;
      return sum + v;
    }, 0);

    const deductionsTotal = formDeductions.reduce((sum, row) => {
      const v = Number(row.value) || 0;
      if (row.calc_type === "FIXED") return sum + v;
      if (row.calc_type === "PERCENT_BASIC") return sum + (basicVal * v) / 100;
      return sum + v;
    }, 0);

    const net = Math.max(0, gross - deductionsTotal);
    const annual = gross * 12;

    return { gross, deductionsTotal, net, annual };
  }, [formEarnings, formDeductions]);

  // Filtered Templates
  const filteredTemplates = useMemo(() => {
    return templates.filter((t) => {
      const matchesSearch =
        !search ||
        t.name?.toLowerCase().includes(search.toLowerCase()) ||
        t.grade?.toLowerCase().includes(search.toLowerCase());
      const matchesGrade = gradeFilter === "all" || t.grade === gradeFilter;
      const matchesStatus = statusFilter === "all" || t.status === statusFilter;
      return matchesSearch && matchesGrade && matchesStatus;
    });
  }, [templates, search, gradeFilter, statusFilter]);

  const uniqueGrades = useMemo(() => {
    const grades = new Set(templates.map((t) => t.grade).filter(Boolean));
    return Array.from(grades);
  }, [templates]);

  return (
    <div className="space-y-6 text-left">
      <PageHeader
        title="Salary Structure"
        description="Define pay components, grades, earnings, deductions, and CTC breakup templates."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={loadData}
              disabled={isLoading}
              className="h-9 gap-1.5 text-xs rounded-xl cursor-pointer"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} /> Refresh
            </Button>

            <Button
              onClick={openCreateDialog}
              className="h-9 gap-1.5 text-xs bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl cursor-pointer font-medium"
            >
              <Plus className="h-3.5 w-3.5" /> Create Structure
            </Button>
          </div>
        }
      />

      {/* Hero Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-2xl border-border bg-card/60 backdrop-blur-xl">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Total Structures</span>
              <div className="grid h-8 w-8 place-items-center rounded-xl bg-indigo-500/10 text-indigo-400">
                <Layers className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-bold tracking-tight text-foreground font-mono">
                {hero?.total_templates ?? templates.length}
              </span>
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <span>Active & draft pay grades</span>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border bg-card/60 backdrop-blur-xl">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Mapped Employees</span>
              <div className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <Users className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-bold tracking-tight text-foreground font-mono">
                {hero?.mapped_employees ?? templates.reduce((acc, t) => acc + (t.assigned_employees_count || 0), 0)}
              </span>
            </div>
            <div className="mt-2 text-[11px] text-emerald-400">
              <span>Assigned to a valid structure</span>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border bg-card/60 backdrop-blur-xl">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Unmapped Staff</span>
              <div className="grid h-8 w-8 place-items-center rounded-xl bg-amber-500/10 text-amber-400">
                <AlertCircle className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-bold tracking-tight text-foreground font-mono">
                {hero?.unmapped_employees ?? 0}
              </span>
            </div>
            <div className="mt-2 text-[11px] text-muted-foreground">
              <span>Pending structure assignment</span>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border bg-card/60 backdrop-blur-xl">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Last Revision Date</span>
              <div className="grid h-8 w-8 place-items-center rounded-xl bg-violet-500/10 text-violet-400">
                <Clock className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-sm font-semibold tracking-tight text-foreground font-mono">
                {hero?.last_updated || "—"}
              </span>
            </div>
            <div className="mt-2 text-[11px] text-muted-foreground">
              <span>Latest template update</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Table */}
      <Card className="rounded-2xl border-border bg-card/60 backdrop-blur-xl">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-border/40">
          <div>
            <CardTitle className="text-base font-bold">Salary Structure Templates</CardTitle>
            <CardDescription className="text-xs">
              List of configured pay scale templates with CTC ranges, earnings, and deductions.
            </CardDescription>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search template or grade..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 text-xs rounded-xl bg-background/60"
              />
            </div>

            {uniqueGrades.length > 0 && (
              <Select value={gradeFilter} onValueChange={setGradeFilter}>
                <SelectTrigger className="h-9 text-xs w-32 rounded-xl bg-background/60">
                  <SelectValue placeholder="Grade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Grades</SelectItem>
                  {uniqueGrades.map((g) => (
                    <SelectItem key={g} value={g}>
                      {g}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-9 text-xs w-32 rounded-xl bg-background/60">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                <SelectItem value="DRAFT">DRAFT</SelectItem>
                <SelectItem value="ARCHIVED">ARCHIVED</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border bg-accent/30 text-muted-foreground font-semibold">
                  <th className="py-3 px-4">Template Name</th>
                  <th className="py-3 px-4">Grade / Level</th>
                  <th className="py-3 px-4 text-right">CTC Range (Min - Max)</th>
                  <th className="py-3 px-4 text-center">Assigned Staff</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-muted-foreground">
                      <div className="flex items-center justify-center gap-2">
                        <RefreshCw className="h-4 w-4 animate-spin text-indigo-400" />
                        <span>Loading salary structures...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredTemplates.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-muted-foreground">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Layers className="h-8 w-8 text-muted-foreground/40 mb-1" />
                        <p className="font-semibold text-foreground text-sm">No salary structures found</p>
                        <p className="text-xs max-w-sm mb-3">
                          {search || gradeFilter !== "all" || statusFilter !== "all"
                            ? "No templates match your search or filter parameters."
                            : "Get started by defining your organization's first salary structure template."}
                        </p>
                        <Button
                          onClick={openCreateDialog}
                          className="h-8 gap-1.5 text-xs bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl"
                        >
                          <Plus className="h-3.5 w-3.5" /> Create your first salary structure
                        </Button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredTemplates.map((t) => (
                    <tr key={t.id} className="hover:bg-accent/20 transition-colors">
                      <td className="py-3 px-4 font-medium text-foreground">
                        <div>{t.name || "—"}</div>
                        {t.effective_date && (
                          <div className="text-[10px] text-muted-foreground">Effective: {t.effective_date}</div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        <Badge variant="secondary" className="text-[10px] font-mono">
                          {t.grade || "—"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right font-mono">
                        {t.min_ctc != null && t.max_ctc != null
                          ? `₹${t.min_ctc.toLocaleString("en-IN")} - ₹${t.max_ctc.toLocaleString("en-IN")}`
                          : "—"}
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-medium">
                        {t.assigned_employees_count ?? 0}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Badge
                          variant="outline"
                          className={
                            t.status === "ACTIVE"
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px]"
                              : t.status === "DRAFT"
                              ? "bg-amber-500/10 text-amber-400 border-amber-500/20 text-[10px]"
                              : "bg-slate-500/10 text-slate-400 border-slate-500/20 text-[10px]"
                          }
                        >
                          {t.status || "—"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            title="View Breakup"
                            onClick={() => setViewingTemplate(t)}
                            className="h-7 w-7 text-muted-foreground hover:text-foreground rounded-lg"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Edit Template"
                            onClick={() => openEditDialog(t)}
                            className="h-7 w-7 text-muted-foreground hover:text-indigo-400 rounded-lg"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Duplicate Template"
                            onClick={() => handleDuplicateTemplate(t)}
                            className="h-7 w-7 text-muted-foreground hover:text-emerald-400 rounded-lg"
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Delete Template"
                            onClick={() => setDeletingId(t.id)}
                            className="h-7 w-7 text-muted-foreground hover:text-rose-400 rounded-lg"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Create / Edit Salary Structure Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-4xl rounded-2xl bg-card border-border max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground text-base">
              <Layers className="h-5 w-5 text-indigo-400" />
              {editingTemplate ? "Edit Salary Structure Template" : "Create Salary Structure Template"}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Define pay components, calculation rules, and CTC ranges for this structure template.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-3">
            {/* Header info inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs">Template Name *</Label>
                <Input
                  placeholder="e.g. Senior Software Engineer Pay Scale"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="h-9 text-xs rounded-xl bg-background/60"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Grade / Level</Label>
                <Input
                  placeholder="e.g. L3 / Senior"
                  value={formGrade}
                  onChange={(e) => setFormGrade(e.target.value)}
                  className="h-9 text-xs rounded-xl bg-background/60"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Status</Label>
                <Select value={formStatus} onValueChange={(v: any) => setFormStatus(v)}>
                  <SelectTrigger className="h-9 text-xs rounded-xl bg-background/60">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                    <SelectItem value="DRAFT">DRAFT</SelectItem>
                    <SelectItem value="ARCHIVED">ARCHIVED</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs">Effective Date</Label>
                <Input
                  type="date"
                  value={formEffectiveDate}
                  onChange={(e) => setFormEffectiveDate(e.target.value)}
                  className="h-9 text-xs rounded-xl bg-background/60"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Min Annual CTC (₹)</Label>
                <Input
                  type="number"
                  placeholder="600000"
                  value={formMinCtc}
                  onChange={(e) => setFormMinCtc(e.target.value)}
                  className="h-9 text-xs rounded-xl bg-background/60 font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Max Annual CTC (₹)</Label>
                <Input
                  type="number"
                  placeholder="1200000"
                  value={formMaxCtc}
                  onChange={(e) => setFormMaxCtc(e.target.value)}
                  className="h-9 text-xs rounded-xl bg-background/60 font-mono"
                />
              </div>
            </div>

            {/* Components Grid: Earnings & Deductions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
              {/* Earnings Column */}
              <div className="space-y-3 p-4 rounded-2xl border border-border bg-background/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                    <PlusCircle className="h-4 w-4" />
                    <span>Earnings Components</span>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addEarningRow}
                    className="h-7 text-[11px] gap-1 rounded-lg"
                  >
                    <Plus className="h-3 w-3" /> Add Earning
                  </Button>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {formEarnings.map((row) => (
                    <div key={row.id} className="grid grid-cols-12 gap-1.5 items-center bg-card/60 p-2 rounded-xl border border-border/40">
                      <Input
                        placeholder="Name"
                        value={row.name}
                        onChange={(e) => updateEarningRow(row.id, "name", e.target.value)}
                        className="col-span-5 h-8 text-[11px] rounded-lg"
                      />
                      <Select
                        value={row.calc_type}
                        onValueChange={(v: any) => updateEarningRow(row.id, "calc_type", v)}
                      >
                        <SelectTrigger className="col-span-4 h-8 text-[11px] rounded-lg">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="FIXED">Fixed ₹</SelectItem>
                          <SelectItem value="PERCENT_BASIC">% Basic</SelectItem>
                          <SelectItem value="PERCENT_CTC">% CTC</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        type="number"
                        placeholder="Val"
                        value={row.value}
                        onChange={(e) => updateEarningRow(row.id, "value", Number(e.target.value))}
                        className="col-span-2 h-8 text-[11px] rounded-lg font-mono"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeEarningRow(row.id)}
                        className="col-span-1 h-7 w-7 text-muted-foreground hover:text-rose-400 rounded-lg justify-self-center"
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Deductions Column */}
              <div className="space-y-3 p-4 rounded-2xl border border-border bg-background/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-rose-400">
                    <MinusCircle className="h-4 w-4" />
                    <span>Deduction Components</span>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addDeductionRow}
                    className="h-7 text-[11px] gap-1 rounded-lg"
                  >
                    <Plus className="h-3 w-3" /> Add Deduction
                  </Button>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {formDeductions.map((row) => (
                    <div key={row.id} className="grid grid-cols-12 gap-1.5 items-center bg-card/60 p-2 rounded-xl border border-border/40">
                      <Input
                        placeholder="Name"
                        value={row.name}
                        onChange={(e) => updateDeductionRow(row.id, "name", e.target.value)}
                        className="col-span-5 h-8 text-[11px] rounded-lg"
                      />
                      <Select
                        value={row.calc_type}
                        onValueChange={(v: any) => updateDeductionRow(row.id, "calc_type", v)}
                      >
                        <SelectTrigger className="col-span-4 h-8 text-[11px] rounded-lg">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="FIXED">Fixed ₹</SelectItem>
                          <SelectItem value="PERCENT_BASIC">% Basic</SelectItem>
                          <SelectItem value="PERCENT_CTC">% CTC</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        type="number"
                        placeholder="Val"
                        value={row.value}
                        onChange={(e) => updateDeductionRow(row.id, "value", Number(e.target.value))}
                        className="col-span-2 h-8 text-[11px] rounded-lg font-mono"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeDeductionRow(row.id)}
                        className="col-span-1 h-7 w-7 text-muted-foreground hover:text-rose-400 rounded-lg justify-self-center"
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Live Breakup Summary Bar */}
            <div className="p-4 rounded-2xl border border-indigo-500/20 bg-indigo-500/5 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div>
                <div className="text-[10px] text-muted-foreground font-medium uppercase">Est. Monthly Gross</div>
                <div className="text-base font-bold font-mono text-emerald-400 mt-0.5">
                  ₹{liveBreakup.gross.toLocaleString("en-IN")}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-muted-foreground font-medium uppercase">Est. Deductions</div>
                <div className="text-base font-bold font-mono text-rose-400 mt-0.5">
                  -₹{liveBreakup.deductionsTotal.toLocaleString("en-IN")}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-muted-foreground font-medium uppercase">Est. Net Take-Home</div>
                <div className="text-base font-bold font-mono text-indigo-400 mt-0.5">
                  ₹{liveBreakup.net.toLocaleString("en-IN")}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-muted-foreground font-medium uppercase">Est. Annual CTC</div>
                <div className="text-base font-bold font-mono text-foreground mt-0.5">
                  ₹{liveBreakup.annual.toLocaleString("en-IN")}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 mt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDialogOpen(false)}
              className="text-xs rounded-xl"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSaveTemplate}
              disabled={isSaving}
              className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl gap-1.5"
            >
              {isSaving ? "Saving..." : editingTemplate ? "Update Structure" : "Create Structure"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Breakup Dialog */}
      <Dialog open={!!viewingTemplate} onOpenChange={(open) => !open && setViewingTemplate(null)}>
        {viewingTemplate && (
          <DialogContent className="sm:max-w-2xl rounded-2xl bg-card border-border">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between text-foreground">
                <div className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-indigo-400" />
                  <span>{viewingTemplate.name}</span>
                </div>
                <Badge variant="outline" className="text-xs font-mono">
                  Grade: {viewingTemplate.grade}
                </Badge>
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Full earnings and deductions breakdown for this template.
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-3">
              {/* Earnings Column */}
              <div className="space-y-2 p-3 rounded-xl border border-border bg-background/30">
                <div className="text-xs font-bold text-emerald-400 border-b border-border/40 pb-2">
                  Earnings Components
                </div>
                {!viewingTemplate.earnings || viewingTemplate.earnings.length === 0 ? (
                  <div className="text-xs text-muted-foreground py-4 text-center">No earnings configured.</div>
                ) : (
                  viewingTemplate.earnings.map((e) => (
                    <div key={e.id} className="flex items-center justify-between text-xs py-1 border-b border-border/20 last:border-0">
                      <div>
                        <div className="font-medium text-foreground">{e.name}</div>
                        <div className="text-[10px] text-muted-foreground">
                          {e.calc_type === "FIXED" ? "Fixed Amount" : e.calc_type === "PERCENT_BASIC" ? "% of Basic" : "% of CTC"}
                        </div>
                      </div>
                      <div className="font-mono font-semibold">
                        {e.calc_type === "FIXED" ? `₹${Number(e.value).toLocaleString("en-IN")}` : `${e.value}%`}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Deductions Column */}
              <div className="space-y-2 p-3 rounded-xl border border-border bg-background/30">
                <div className="text-xs font-bold text-rose-400 border-b border-border/40 pb-2">
                  Deductions Components
                </div>
                {!viewingTemplate.deductions || viewingTemplate.deductions.length === 0 ? (
                  <div className="text-xs text-muted-foreground py-4 text-center">No deductions configured.</div>
                ) : (
                  viewingTemplate.deductions.map((d) => (
                    <div key={d.id} className="flex items-center justify-between text-xs py-1 border-b border-border/20 last:border-0">
                      <div>
                        <div className="font-medium text-foreground">{d.name}</div>
                        <div className="text-[10px] text-muted-foreground">
                          {d.calc_type === "FIXED" ? "Fixed Amount" : d.calc_type === "PERCENT_BASIC" ? "% of Basic" : "% of CTC"}
                        </div>
                      </div>
                      <div className="font-mono font-semibold text-rose-400">
                        {d.calc_type === "FIXED" ? `₹${Number(d.value).toLocaleString("en-IN")}` : `${d.value}%`}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="p-3 rounded-xl border border-indigo-500/20 bg-indigo-500/5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
              <div>
                <span className="text-muted-foreground">CTC Range: </span>
                <span className="font-bold text-foreground">
                  ₹{viewingTemplate.min_ctc?.toLocaleString("en-IN") || "0"} - ₹{viewingTemplate.max_ctc?.toLocaleString("en-IN") || "0"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Assigned Staff: </span>
                <span className="font-bold text-indigo-400">{viewingTemplate.assigned_employees_count || 0}</span>
              </div>
            </div>

            <DialogFooter className="mt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewingTemplate(null)}
                className="text-xs rounded-xl"
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
        <DialogContent className="sm:max-w-md rounded-2xl bg-card border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground">
              <Trash2 className="h-5 w-5 text-rose-500" /> Delete Salary Structure
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Are you sure you want to delete this salary structure template? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 sm:gap-0 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeletingId(null)}
              className="text-xs rounded-xl"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleDeleteTemplate}
              disabled={isDeleting}
              className="text-xs bg-rose-600 hover:bg-rose-700 text-white rounded-xl gap-1.5"
            >
              <Trash2 className="h-3.5 w-3.5" />
              {isDeleting ? "Deleting..." : "Confirm Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
