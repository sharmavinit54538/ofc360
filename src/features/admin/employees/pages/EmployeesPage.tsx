import { useEffect, useMemo, useState } from "react";
import { Download, Plus, List, Network, X } from "lucide-react";
import { PageHeader } from "@/components/ofc360/DashboardShell";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  activateEmployee,
  createEmployee,
  deactivateEmployee,
  deleteEmployee,
  fetchEmployees,
  fetchOrgChart,
  resendEmployeeInvite,
  resetEmployeePassword,
  updateEmployee,
} from "../employeesThunk";
import type { Employee } from "../employeesTypes";
import { toast } from "sonner";
import { EmployeesFilters } from "../components/EmployeesFilters";
import { EmployeesListContent } from "../components/EmployeesListContent";
import { EmployeeFormDialog } from "../components/EmployeeFormDialog";
import { OrgChartView } from "../components/OrgChartView";
import { createEmptyEmployee, exportEmployeesCsv } from "../utils/employeeStatus";

export function EmployeesPage() {
  const dispatch = useAppDispatch();
  const { employees, orgChart, loading, submitting, error } = useAppSelector((state) => state.employees);
  const [activeTab, setActiveTab] = useState<"list" | "org-chart">("list");
  const [q, setQ] = useState("");
  const [dept, setDept] = useState<string>("all");
  const [managerFilter, setManagerFilter] = useState<{ id: string; name: string } | null>(null);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Employee | null>(null);

  useEffect(() => {
    dispatch(fetchEmployees({ search: q, department: dept, managerId: managerFilter?.id }));
  }, [dispatch, q, dept, managerFilter]);

  useEffect(() => {
    if (activeTab === "org-chart") {
      dispatch(fetchOrgChart());
    }
  }, [dispatch, activeTab]);

  const departments = useMemo(
    () => Array.from(new Set(employees.map((e) => e.department).filter(Boolean))),
    [employees],
  );

  function refetch() {
    dispatch(fetchEmployees({ search: q, department: dept, managerId: managerFilter?.id }));
  }

  async function resendInvite(id: string) {
    const result = await dispatch(resendEmployeeInvite(id));
    if (resendEmployeeInvite.fulfilled.match(result)) {
      toast.success("Invitation email resent successfully");
    } else {
      toast.error(parseErrorMessage(result.payload, "Failed to resend invitation"));
    }
  }

  async function deactivateEmployeeAction(id: string) {
    if (!confirm("Are you sure you want to deactivate this employee account? They will lose access to the portal.")) {
      return;
    }
    const result = await dispatch(deactivateEmployee(id));
    if (deactivateEmployee.fulfilled.match(result)) {
      toast.success("Employee account deactivated successfully");
      refetch();
    } else {
      toast.error(parseErrorMessage(result.payload, "Failed to deactivate employee"));
    }
  }

  function parseErrorMessage(payload: unknown, fallback: string): string {
    if (typeof payload === "string") return payload;
    if (payload && typeof payload === "object" && "message" in payload && typeof (payload as { message: unknown }).message === "string") {
      return (payload as { message: string }).message;
    }
    return fallback;
  }

  async function activateEmployeeAction(id: string) {
    const result = await dispatch(activateEmployee(id));
    if (activateEmployee.fulfilled.match(result)) {
      toast.success("Employee account activated successfully");
      refetch();
    } else {
      toast.error(parseErrorMessage(result.payload, "Failed to activate employee"));
    }
  }

  async function resetPassword(id: string) {
    if (!confirm("Are you sure you want to reset this employee's password? A temporary password will be sent to their email.")) {
      return;
    }
    const result = await dispatch(resetEmployeePassword(id));
    if (resetEmployeePassword.fulfilled.match(result)) {
      toast.success("Employee password reset email sent successfully");
    } else {
      toast.error(parseErrorMessage(result.payload, "Failed to reset password"));
    }
  }

  function openNew() {
    setDraft(createEmptyEmployee());
    setOpen(true);
  }

  function openEdit(employee: Employee) {
    setDraft(employee);
    setOpen(true);
  }

  function handleViewReports(managerId: string, managerName: string) {
    setManagerFilter({ id: managerId, name: managerName });
    setActiveTab("list");
  }

  function buildPayloadFromDraft(emp: Employee) {
    const names = (emp.fullName || "").trim().split(/\s+/);
    const first_name = emp.firstName || names[0] || "";
    const last_name = emp.lastName || names.slice(1).join(" ") || " ";

    return {
      first_name,
      last_name,
      personal_email: emp.email,
      company_email: emp.companyEmail || emp.email,
      phone: emp.phone,
      alternate_phone: emp.alternatePhone || undefined,
      employee_id: emp.employeeId || `EMP-${Math.floor(100000 + Math.random() * 900000)}`,
      department: emp.department,
      designation: emp.designation,
      employment_type: emp.employmentType || "FULL_TIME",
      joining_date: emp.joiningDate || new Date().toISOString().split("T")[0],
      profile_photo_url: emp.profilePhotoUrl || undefined,
      gender: emp.gender || undefined,
      date_of_birth: emp.dateOfBirth || undefined,
      blood_group: emp.bloodGroup || undefined,
      marital_status: emp.maritalStatus || undefined,
      team: emp.team || undefined,
      reporting_manager_id: emp.managerId || undefined,
      branch: emp.branch || undefined,
      work_location: emp.workLocation || undefined,
      probation_period_months: emp.probationPeriodMonths ?? 3,
      shift: emp.shift || "General",
      employee_capacity: emp.employeeCapacity ?? 100,
      cost_center_id: emp.costCenterId || undefined,
      ctc: emp.ctc ?? 0,
      basic_salary: emp.basicSalary ?? 0,
      hra: emp.hra ?? 0,
      bonus: emp.bonus ?? 0,
      pf: emp.pf ?? 0,
      esi: emp.esi ?? 0,
      professional_tax: emp.professionalTax ?? 0,
      role: emp.role || "employee",
      leave_group: emp.leaveGroup || undefined,
      role_metadata: emp.roleMetadata || {},
      addresses: emp.addresses || [],
      documents: emp.documents || [],
      education: emp.education || [],
      experience: emp.experience || [],
      skills: emp.skills || [],
      emergency_contacts: emp.emergencyContacts || [],
      bank_accounts: emp.bankAccounts || [],
      employment_status: "PROBATION",
    };
  }

  async function save() {
    if (!draft) return;
    if (!draft.email) return toast.error("Personal email is required");

    const payload = buildPayloadFromDraft(draft);
    const isEdit = draft.id !== "";

    if (isEdit) {
      const result = await dispatch(
        updateEmployee({
          id: draft.id,
          payload,
        }),
      );
      if (updateEmployee.fulfilled.match(result)) {
        toast.success("Employee updated successfully");
        setOpen(false);
        refetch();
      } else {
        toast.error(parseErrorMessage(result.payload, "Failed to update employee"));
      }
    } else {
      const result = await dispatch(createEmployee(payload));
      if (createEmployee.fulfilled.match(result)) {
        toast.success("Employee added successfully");
        setOpen(false);
        refetch();
      } else {
        toast.error(parseErrorMessage(result.payload, "Failed to add employee"));
      }
    }
  }

  async function remove(id: string) {
    if (!confirm("Are you sure you want to remove this employee?")) return;

    const result = await dispatch(deleteEmployee(id));
    if (deleteEmployee.fulfilled.match(result)) {
      toast.success("Employee removed successfully");
    } else {
      toast.error(parseErrorMessage(result.payload, "Failed to remove employee"));
    }
  }

  return (
    <>
      <PageHeader
        title="Employees"
        description={`${employees.length} people across ${departments.length || 0} departments`}
        actions={
          <>
            <Button variant="outline" onClick={() => exportEmployeesCsv(employees)} disabled={employees.length === 0}>
              <Download className="mr-2 h-4 w-4" /> Export
            </Button>
            <Button onClick={openNew}>
              <Plus className="mr-2 h-4 w-4" /> Add employee
            </Button>
          </>
        }
      />

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "list" | "org-chart")} className="w-full space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <TabsList className="bg-card/80 border border-border p-1 rounded-xl">
            <TabsTrigger value="list" className="gap-2 rounded-lg text-xs font-semibold">
              <List className="h-4 w-4" /> List View
            </TabsTrigger>
            <TabsTrigger value="org-chart" className="gap-2 rounded-lg text-xs font-semibold">
              <Network className="h-4 w-4" /> Org Chart View
            </TabsTrigger>
          </TabsList>

          {managerFilter && (
            <div className="flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs text-primary font-medium">
              <span>Direct reports of: <strong>{managerFilter.name}</strong></span>
              <button
                onClick={() => setManagerFilter(null)}
                className="rounded p-0.5 hover:bg-primary/20 transition-colors cursor-pointer"
                aria-label="Clear manager filter"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>

        <TabsContent value="list" className="mt-0">
          <div className="rounded-2xl border border-border bg-card/60 backdrop-blur-xl">
            <EmployeesFilters
              search={q}
              department={dept}
              onSearchChange={setQ}
              onDepartmentChange={setDept}
            />

            <EmployeesListContent
              loading={loading}
              error={error}
              employees={employees}
              onRetry={refetch}
              onAdd={openNew}
              onEdit={openEdit}
              onResendInvite={resendInvite}
              onResetPassword={resetPassword}
              onDeactivate={deactivateEmployeeAction}
              onActivate={activateEmployeeAction}
              onDelete={remove}
              onViewReports={handleViewReports}
            />
          </div>
        </TabsContent>

        <TabsContent value="org-chart" className="mt-0">
          <OrgChartView nodes={orgChart} />
        </TabsContent>
      </Tabs>

      <EmployeeFormDialog
        open={open}
        onOpenChange={setOpen}
        draft={draft}
        onDraftChange={setDraft}
        submitting={submitting}
        onSave={save}
        allEmployees={employees}
      />
    </>
  );
}
