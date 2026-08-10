import { useState, useEffect } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type {
  Employee,
  EmployeeAddress,
  EmployeeBankAccount,
  EmployeeDocument,
  EmployeeEducation,
  EmployeeEmergencyContact,
  EmployeeExperience,
  EmployeeSkill,
} from "../employeesTypes";
import { DepartmentSelectContent } from "./DepartmentSelectContent";
import { resolveDepartmentValue } from "../utils/departmentOptions";
import { RepeatableFieldList } from "./RepeatableFieldList";

const SHIFT_OPTIONS = ["General", "Morning", "Evening", "Night"] as const;
const EMPLOYMENT_TYPES = [
  { value: "FULL_TIME", label: "Full Time" },
  { value: "PART_TIME", label: "Part Time" },
  { value: "CONTRACT", label: "Contract" },
  { value: "INTERN", label: "Intern" },
] as const;

const GENDER_OPTIONS = ["Male", "Female", "Other", "Prefer not to say"] as const;
const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"] as const;
const MARITAL_STATUSES = ["Single", "Married", "Divorced", "Widowed"] as const;
const ROLES = ["employee", "manager", "hr", "admin"] as const;
const PROFICIENCY_LEVELS = ["Beginner", "Intermediate", "Advanced", "Expert"] as const;

interface EmployeeFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  draft: Employee | null;
  onDraftChange: (draft: Employee) => void;
  submitting: boolean;
  onSave: () => void;
  allEmployees?: Employee[];
}

export function EmployeeFormDialog({
  open,
  onOpenChange,
  draft,
  onDraftChange,
  submitting,
  onSave,
  allEmployees = [],
}: EmployeeFormDialogProps) {
  const [activeTab, setActiveTab] = useState("basic");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      setActiveTab("basic");
      setErrors({});
    }
  }, [open]);

  if (!draft) return null;

  const departmentValue = resolveDepartmentValue(draft.department);
  const managerOptions = allEmployees.filter((e) => e.id && e.id !== draft.id);

  function validate() {
    const errs: Record<string, string> = {};
    if (!draft?.firstName && !draft?.fullName) errs.firstName = "First name is required";
    if (!draft?.email) errs.email = "Personal email is required";
    if (!draft?.phone) errs.phone = "Phone number is required";
    if (!draft?.employeeId) errs.employeeId = "Employee ID is required";
    if (!draft?.department) errs.department = "Department is required";
    if (!draft?.designation) errs.designation = "Designation is required";
    if (!draft?.joiningDate) errs.joiningDate = "Joining date is required";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSave() {
    if (validate()) {
      onSave();
    } else {
      // Switch to first tab with errors
      if (errors.firstName || errors.employeeId) setActiveTab("basic");
      else if (errors.email || errors.phone) setActiveTab("contact");
      else if (errors.department || errors.designation || errors.joiningDate) setActiveTab("job");
    }
  }

  // Check tab error indicators
  const hasBasicErr = Boolean(errors.firstName || errors.employeeId);
  const hasContactErr = Boolean(errors.email || errors.phone);
  const hasJobErr = Boolean(errors.department || errors.designation || errors.joiningDate);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] flex flex-col overflow-hidden p-6">
        <DialogHeader className="pb-2 border-b border-border">
          <DialogTitle className="font-display text-xl font-bold">
            {draft.id !== "" ? "Edit Employee Profile" : "Add New Employee"}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <div className="overflow-x-auto pb-2 pt-1 border-b border-border">
            <TabsList className="bg-muted/40 h-auto p-1 inline-flex gap-1 min-w-full sm:min-w-0">
              <TabsTrigger value="basic" className="text-xs px-3 py-1.5 gap-1.5">
                Basic Info {hasBasicErr && <span className="h-1.5 w-1.5 rounded-full bg-destructive" />}
              </TabsTrigger>
              <TabsTrigger value="contact" className="text-xs px-3 py-1.5 gap-1.5">
                Contact {hasContactErr && <span className="h-1.5 w-1.5 rounded-full bg-destructive" />}
              </TabsTrigger>
              <TabsTrigger value="job" className="text-xs px-3 py-1.5 gap-1.5">
                Job Details {hasJobErr && <span className="h-1.5 w-1.5 rounded-full bg-destructive" />}
              </TabsTrigger>
              <TabsTrigger value="comp" className="text-xs px-3 py-1.5">Compensation</TabsTrigger>
              <TabsTrigger value="addresses" className="text-xs px-3 py-1.5">Addresses ({draft.addresses?.length || 0})</TabsTrigger>
              <TabsTrigger value="documents" className="text-xs px-3 py-1.5">Documents ({draft.documents?.length || 0})</TabsTrigger>
              <TabsTrigger value="education" className="text-xs px-3 py-1.5">Education ({draft.education?.length || 0})</TabsTrigger>
              <TabsTrigger value="experience" className="text-xs px-3 py-1.5">Experience ({draft.experience?.length || 0})</TabsTrigger>
              <TabsTrigger value="skills" className="text-xs px-3 py-1.5">Skills ({draft.skills?.length || 0})</TabsTrigger>
              <TabsTrigger value="emergency" className="text-xs px-3 py-1.5">Emergency ({draft.emergencyContacts?.length || 0})</TabsTrigger>
              <TabsTrigger value="bank" className="text-xs px-3 py-1.5">Bank ({draft.bankAccounts?.length || 0})</TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-y-auto py-4 px-1 pr-2">
            {/* 1. Basic Info */}
            <TabsContent value="basic" className="mt-0 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField label="First Name *" error={errors.firstName}>
                  <Input
                    value={draft.firstName || draft.fullName?.split(" ")[0] || ""}
                    onChange={(e) => {
                      const fn = e.target.value;
                      const ln = draft.lastName || draft.fullName?.split(" ").slice(1).join(" ") || "";
                      onDraftChange({ ...draft, firstName: fn, fullName: `${fn} ${ln}`.trim() });
                    }}
                  />
                </FormField>
                <FormField label="Last Name">
                  <Input
                    value={draft.lastName || draft.fullName?.split(" ").slice(1).join(" ") || ""}
                    onChange={(e) => {
                      const ln = e.target.value;
                      const fn = draft.firstName || draft.fullName?.split(" ")[0] || "";
                      onDraftChange({ ...draft, lastName: ln, fullName: `${fn} ${ln}`.trim() });
                    }}
                  />
                </FormField>
                <FormField label="Employee ID *" error={errors.employeeId}>
                  <Input
                    value={draft.employeeId}
                    onChange={(e) => onDraftChange({ ...draft, employeeId: e.target.value })}
                  />
                </FormField>
                <FormField label="Gender">
                  <Select value={draft.gender || ""} onValueChange={(v) => onDraftChange({ ...draft, gender: v })}>
                    <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                    <SelectContent>
                      {GENDER_OPTIONS.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </FormField>
                <FormField label="Date of Birth">
                  <Input
                    type="date"
                    value={draft.dateOfBirth || ""}
                    onChange={(e) => onDraftChange({ ...draft, dateOfBirth: e.target.value })}
                  />
                </FormField>
                <FormField label="Blood Group">
                  <Select value={draft.bloodGroup || ""} onValueChange={(v) => onDraftChange({ ...draft, bloodGroup: v })}>
                    <SelectTrigger><SelectValue placeholder="Select blood group" /></SelectTrigger>
                    <SelectContent>
                      {BLOOD_GROUPS.map((bg) => <SelectItem key={bg} value={bg}>{bg}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </FormField>
                <FormField label="Marital Status">
                  <Select value={draft.maritalStatus || ""} onValueChange={(v) => onDraftChange({ ...draft, maritalStatus: v })}>
                    <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                    <SelectContent>
                      {MARITAL_STATUSES.map((ms) => <SelectItem key={ms} value={ms}>{ms}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </FormField>
                <FormField label="Profile Photo URL">
                  <Input
                    value={draft.profilePhotoUrl || ""}
                    onChange={(e) => onDraftChange({ ...draft, profilePhotoUrl: e.target.value })}
                    placeholder="https://..."
                  />
                </FormField>
              </div>
            </TabsContent>

            {/* 2. Contact Details */}
            <TabsContent value="contact" className="mt-0 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField label="Personal Email *" error={errors.email}>
                  <Input
                    type="email"
                    value={draft.email}
                    onChange={(e) => onDraftChange({ ...draft, email: e.target.value })}
                  />
                </FormField>
                <FormField label="Company Email">
                  <Input
                    type="email"
                    value={draft.companyEmail || ""}
                    onChange={(e) => onDraftChange({ ...draft, companyEmail: e.target.value })}
                  />
                </FormField>
                <FormField label="Phone Number *" error={errors.phone}>
                  <Input
                    value={draft.phone}
                    onChange={(e) => onDraftChange({ ...draft, phone: e.target.value })}
                  />
                </FormField>
                <FormField label="Alternate Phone">
                  <Input
                    value={draft.alternatePhone || ""}
                    onChange={(e) => onDraftChange({ ...draft, alternatePhone: e.target.value })}
                  />
                </FormField>
              </div>
            </TabsContent>

            {/* 3. Job Details */}
            <TabsContent value="job" className="mt-0 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField label="Department *" error={errors.department}>
                  <Select value={departmentValue} onValueChange={(v) => onDraftChange({ ...draft, department: v })}>
                    <SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger>
                    <DepartmentSelectContent
                      key={draft.id || "new"}
                      selectedValue={departmentValue}
                      extraValues={draft.department ? [draft.department] : []}
                    />
                  </Select>
                </FormField>
                <FormField label="Designation *" error={errors.designation}>
                  <Input
                    value={draft.designation}
                    onChange={(e) => onDraftChange({ ...draft, designation: e.target.value })}
                  />
                </FormField>
                <FormField label="Employment Type *">
                  <Select
                    value={draft.employmentType || "FULL_TIME"}
                    onValueChange={(v) => onDraftChange({ ...draft, employmentType: v })}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {EMPLOYMENT_TYPES.map((et) => <SelectItem key={et.value} value={et.value}>{et.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </FormField>
                <FormField label="Joining Date *" error={errors.joiningDate}>
                  <Input
                    type="date"
                    value={draft.joiningDate || ""}
                    onChange={(e) => onDraftChange({ ...draft, joiningDate: e.target.value })}
                  />
                </FormField>
                <FormField label="Reporting Manager">
                  <Select
                    value={draft.managerId || "none"}
                    onValueChange={(val) => {
                      const m = managerOptions.find((opt) => opt.id === val);
                      onDraftChange({
                        ...draft,
                        managerId: val === "none" ? undefined : val,
                        managerName: val === "none" ? undefined : m?.fullName,
                      });
                    }}
                  >
                    <SelectTrigger><SelectValue placeholder="Select reporting manager" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No manager (Top level)</SelectItem>
                      {managerOptions.map((m) => (
                        <SelectItem key={m.id} value={m.id}>
                          {m.fullName} {m.designation ? `— ${m.designation}` : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>
                <FormField label="Shift">
                  <Select value={draft.shift || "General"} onValueChange={(v) => onDraftChange({ ...draft, shift: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {SHIFT_OPTIONS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </FormField>
                <FormField label="Team">
                  <Input value={draft.team || ""} onChange={(e) => onDraftChange({ ...draft, team: e.target.value })} />
                </FormField>
                <FormField label="Branch">
                  <Input value={draft.branch || ""} onChange={(e) => onDraftChange({ ...draft, branch: e.target.value })} />
                </FormField>
                <FormField label="Work Location">
                  <Input value={draft.workLocation || ""} onChange={(e) => onDraftChange({ ...draft, workLocation: e.target.value })} />
                </FormField>
                <FormField label="Probation (Months)">
                  <Input
                    type="number"
                    value={draft.probationPeriodMonths ?? 3}
                    onChange={(e) => onDraftChange({ ...draft, probationPeriodMonths: Number(e.target.value) })}
                  />
                </FormField>
                <FormField label="Employee Capacity (%)">
                  <Input
                    type="number"
                    value={draft.employeeCapacity ?? 100}
                    onChange={(e) => onDraftChange({ ...draft, employeeCapacity: Number(e.target.value) })}
                  />
                </FormField>
                <FormField label="Cost Center ID">
                  <Input value={draft.costCenterId || ""} onChange={(e) => onDraftChange({ ...draft, costCenterId: e.target.value })} />
                </FormField>
                <FormField label="Portal Role">
                  <Select value={draft.role || "employee"} onValueChange={(v) => onDraftChange({ ...draft, role: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {ROLES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </FormField>
                <FormField label="Leave Group">
                  <Input value={draft.leaveGroup || ""} onChange={(e) => onDraftChange({ ...draft, leaveGroup: e.target.value })} />
                </FormField>
              </div>
            </TabsContent>

            {/* 4. Compensation */}
            <TabsContent value="comp" className="mt-0 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField label="CTC (Annual)">
                  <Input
                    type="number"
                    value={draft.ctc ?? 0}
                    onChange={(e) => onDraftChange({ ...draft, ctc: Number(e.target.value) })}
                  />
                </FormField>
                <FormField label="Basic Salary">
                  <Input
                    type="number"
                    value={draft.basicSalary ?? 0}
                    onChange={(e) => onDraftChange({ ...draft, basicSalary: Number(e.target.value) })}
                  />
                </FormField>
                <FormField label="HRA">
                  <Input
                    type="number"
                    value={draft.hra ?? 0}
                    onChange={(e) => onDraftChange({ ...draft, hra: Number(e.target.value) })}
                  />
                </FormField>
                <FormField label="Bonus">
                  <Input
                    type="number"
                    value={draft.bonus ?? 0}
                    onChange={(e) => onDraftChange({ ...draft, bonus: Number(e.target.value) })}
                  />
                </FormField>
                <FormField label="PF Deduction">
                  <Input
                    type="number"
                    value={draft.pf ?? 0}
                    onChange={(e) => onDraftChange({ ...draft, pf: Number(e.target.value) })}
                  />
                </FormField>
                <FormField label="ESI Deduction">
                  <Input
                    type="number"
                    value={draft.esi ?? 0}
                    onChange={(e) => onDraftChange({ ...draft, esi: Number(e.target.value) })}
                  />
                </FormField>
                <FormField label="Professional Tax">
                  <Input
                    type="number"
                    value={draft.professionalTax ?? 0}
                    onChange={(e) => onDraftChange({ ...draft, professionalTax: Number(e.target.value) })}
                  />
                </FormField>
              </div>
            </TabsContent>

            {/* 5. Addresses */}
            <TabsContent value="addresses" className="mt-0">
              <RepeatableFieldList<EmployeeAddress>
                title="Addresses"
                items={draft.addresses || []}
                emptyText="No address records added."
                defaultItem={{
                  address_type: "PRESENT",
                  address_line_1: "",
                  address_line_2: "",
                  city: "",
                  state: "",
                  country: "India",
                  pincode: "",
                  is_same_as_current: false,
                }}
                onItemsChange={(addresses) => onDraftChange({ ...draft, addresses })}
                renderItem={(addr, _, update) => (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <FormField label="Address Type">
                      <Select value={addr.address_type} onValueChange={(v) => update({ address_type: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PRESENT">Present</SelectItem>
                          <SelectItem value="PERMANENT">Permanent</SelectItem>
                          <SelectItem value="OFFICE">Office</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormField>
                    <FormField label="Pincode">
                      <Input value={addr.pincode} onChange={(e) => update({ pincode: e.target.value })} />
                    </FormField>
                    <FormField label="Address Line 1" wide>
                      <Input value={addr.address_line_1} onChange={(e) => update({ address_line_1: e.target.value })} />
                    </FormField>
                    <FormField label="Address Line 2" wide>
                      <Input value={addr.address_line_2 || ""} onChange={(e) => update({ address_line_2: e.target.value })} />
                    </FormField>
                    <FormField label="City">
                      <Input value={addr.city} onChange={(e) => update({ city: e.target.value })} />
                    </FormField>
                    <FormField label="State">
                      <Input value={addr.state} onChange={(e) => update({ state: e.target.value })} />
                    </FormField>
                    <FormField label="Country">
                      <Input value={addr.country} onChange={(e) => update({ country: e.target.value })} />
                    </FormField>
                    <div className="flex items-center gap-2 pt-4">
                      <Checkbox
                        id="same_curr"
                        checked={addr.is_same_as_current}
                        onCheckedChange={(v) => update({ is_same_as_current: Boolean(v) })}
                      />
                      <Label htmlFor="same_curr" className="text-xs">Same as current address</Label>
                    </div>
                  </div>
                )}
              />
            </TabsContent>

            {/* 6. Documents */}
            <TabsContent value="documents" className="mt-0">
              <RepeatableFieldList<EmployeeDocument>
                title="Documents"
                items={draft.documents || []}
                emptyText="No documents attached."
                defaultItem={{ document_type: "AADHAAR", document_number: "", document_url: "", expiry_date: "" }}
                onItemsChange={(documents) => onDraftChange({ ...draft, documents })}
                renderItem={(doc, _, update) => (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <FormField label="Document Type">
                      <Select value={doc.document_type} onValueChange={(v) => update({ document_type: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PAN">PAN Card</SelectItem>
                          <SelectItem value="AADHAAR">Aadhaar Card</SelectItem>
                          <SelectItem value="PASSPORT">Passport</SelectItem>
                          <SelectItem value="VOTER_ID">Voter ID</SelectItem>
                          <SelectItem value="OTHER">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormField>
                    <FormField label="Document Number">
                      <Input value={doc.document_number} onChange={(e) => update({ document_number: e.target.value })} />
                    </FormField>
                    <FormField label="Document URL">
                      <Input value={doc.document_url || ""} onChange={(e) => update({ document_url: e.target.value })} placeholder="https://..." />
                    </FormField>
                    <FormField label="Expiry Date">
                      <Input type="date" value={doc.expiry_date || ""} onChange={(e) => update({ expiry_date: e.target.value })} />
                    </FormField>
                  </div>
                )}
              />
            </TabsContent>

            {/* 7. Education */}
            <TabsContent value="education" className="mt-0">
              <RepeatableFieldList<EmployeeEducation>
                title="Education"
                items={draft.education || []}
                emptyText="No education records added."
                defaultItem={{ degree: "", institution: "", field_of_study: "", start_year: 2018, end_year: 2022, grade: "" }}
                onItemsChange={(education) => onDraftChange({ ...draft, education })}
                renderItem={(edu, _, update) => (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <FormField label="Degree / Qualification">
                      <Input value={edu.degree} onChange={(e) => update({ degree: e.target.value })} />
                    </FormField>
                    <FormField label="Institution / University">
                      <Input value={edu.institution} onChange={(e) => update({ institution: e.target.value })} />
                    </FormField>
                    <FormField label="Field of Study">
                      <Input value={edu.field_of_study || ""} onChange={(e) => update({ field_of_study: e.target.value })} />
                    </FormField>
                    <FormField label="Grade / Score">
                      <Input value={edu.grade || ""} onChange={(e) => update({ grade: e.target.value })} />
                    </FormField>
                    <FormField label="Start Year">
                      <Input type="number" value={edu.start_year ?? 2018} onChange={(e) => update({ start_year: Number(e.target.value) })} />
                    </FormField>
                    <FormField label="End Year">
                      <Input type="number" value={edu.end_year ?? 2022} onChange={(e) => update({ end_year: Number(e.target.value) })} />
                    </FormField>
                  </div>
                )}
              />
            </TabsContent>

            {/* 8. Experience */}
            <TabsContent value="experience" className="mt-0">
              <RepeatableFieldList<EmployeeExperience>
                title="Work Experience"
                items={draft.experience || []}
                emptyText="No prior work experience added."
                defaultItem={{ company_name: "", designation: "", employment_type: "FULL_TIME", start_date: "", end_date: "", is_current: false, description: "" }}
                onItemsChange={(experience) => onDraftChange({ ...draft, experience })}
                renderItem={(exp, _, update) => (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <FormField label="Company Name">
                      <Input value={exp.company_name} onChange={(e) => update({ company_name: e.target.value })} />
                    </FormField>
                    <FormField label="Designation">
                      <Input value={exp.designation} onChange={(e) => update({ designation: e.target.value })} />
                    </FormField>
                    <FormField label="Start Date">
                      <Input type="date" value={exp.start_date || ""} onChange={(e) => update({ start_date: e.target.value })} />
                    </FormField>
                    <FormField label="End Date">
                      <Input type="date" disabled={exp.is_current} value={exp.end_date || ""} onChange={(e) => update({ end_date: e.target.value })} />
                    </FormField>
                    <div className="flex items-center gap-2 pt-2 sm:col-span-2">
                      <Checkbox id={`curr_job_${exp.company_name}`} checked={exp.is_current} onCheckedChange={(v) => update({ is_current: Boolean(v) })} />
                      <Label htmlFor={`curr_job_${exp.company_name}`} className="text-xs">Currently working here</Label>
                    </div>
                    <FormField label="Description" wide>
                      <Textarea value={exp.description || ""} onChange={(e) => update({ description: e.target.value })} className="h-20" />
                    </FormField>
                  </div>
                )}
              />
            </TabsContent>

            {/* 9. Skills */}
            <TabsContent value="skills" className="mt-0">
              <RepeatableFieldList<EmployeeSkill>
                title="Skills"
                items={draft.skills || []}
                emptyText="No skills added."
                defaultItem={{ skill_name: "", proficiency: "Intermediate", years_of_experience: 2 }}
                onItemsChange={(skills) => onDraftChange({ ...draft, skills })}
                renderItem={(skill, _, update) => (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <FormField label="Skill Name">
                      <Input value={skill.skill_name} onChange={(e) => update({ skill_name: e.target.value })} />
                    </FormField>
                    <FormField label="Proficiency">
                      <Select value={skill.proficiency} onValueChange={(v) => update({ proficiency: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {PROFICIENCY_LEVELS.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </FormField>
                    <FormField label="Years of Exp">
                      <Input type="number" value={skill.years_of_experience ?? 1} onChange={(e) => update({ years_of_experience: Number(e.target.value) })} />
                    </FormField>
                  </div>
                )}
              />
            </TabsContent>

            {/* 10. Emergency Contacts */}
            <TabsContent value="emergency" className="mt-0">
              <RepeatableFieldList<EmployeeEmergencyContact>
                title="Emergency Contacts"
                items={draft.emergencyContacts || []}
                emptyText="No emergency contacts added."
                defaultItem={{ name: "", relation: "Spouse", phone: "", alternate_phone: "", email: "", address: "" }}
                onItemsChange={(emergencyContacts) => onDraftChange({ ...draft, emergencyContacts })}
                renderItem={(ec, _, update) => (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <FormField label="Contact Name">
                      <Input value={ec.name} onChange={(e) => update({ name: e.target.value })} />
                    </FormField>
                    <FormField label="Relation">
                      <Input value={ec.relation} onChange={(e) => update({ relation: e.target.value })} />
                    </FormField>
                    <FormField label="Phone Number">
                      <Input value={ec.phone} onChange={(e) => update({ phone: e.target.value })} />
                    </FormField>
                    <FormField label="Email">
                      <Input type="email" value={ec.email || ""} onChange={(e) => update({ email: e.target.value })} />
                    </FormField>
                  </div>
                )}
              />
            </TabsContent>

            {/* 11. Bank Details */}
            <TabsContent value="bank" className="mt-0">
              <RepeatableFieldList<EmployeeBankAccount>
                title="Bank Accounts"
                items={draft.bankAccounts || []}
                emptyText="No bank accounts added."
                defaultItem={{ bank_name: "", account_holder_name: "", account_number: "", ifsc_code: "", account_type: "SAVINGS", is_primary: true }}
                onItemsChange={(bankAccounts) => onDraftChange({ ...draft, bankAccounts })}
                renderItem={(bank, index, update) => (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <FormField label="Bank Name">
                      <Input value={bank.bank_name} onChange={(e) => update({ bank_name: e.target.value })} />
                    </FormField>
                    <FormField label="Account Holder Name">
                      <Input value={bank.account_holder_name} onChange={(e) => update({ account_holder_name: e.target.value })} />
                    </FormField>
                    <FormField label="Account Number">
                      <Input value={bank.account_number} onChange={(e) => update({ account_number: e.target.value })} />
                    </FormField>
                    <FormField label="IFSC Code">
                      <Input value={bank.ifsc_code} onChange={(e) => update({ ifsc_code: e.target.value })} />
                    </FormField>
                    <FormField label="Account Type">
                      <Select value={bank.account_type} onValueChange={(v) => update({ account_type: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SAVINGS">Savings Account</SelectItem>
                          <SelectItem value="CURRENT">Current Account</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormField>
                    <div className="flex items-center gap-2 pt-4">
                      <Checkbox
                        id={`pri_bank_${index}`}
                        checked={bank.is_primary}
                        onCheckedChange={(v) => {
                          const isPri = Boolean(v);
                          if (isPri) {
                            // Ensure only one primary bank account
                            const updated = (draft.bankAccounts || []).map((b, i) => ({
                              ...b,
                              is_primary: i === index,
                            }));
                            onDraftChange({ ...draft, bankAccounts: updated });
                          } else {
                            update({ is_primary: false });
                          }
                        }}
                      />
                      <Label htmlFor={`pri_bank_${index}`} className="text-xs font-semibold">Primary Salary Account</Label>
                    </div>
                  </div>
                )}
              />
            </TabsContent>
          </div>
        </Tabs>

        <DialogFooter className="pt-3 border-t border-border flex items-center justify-between">
          <div className="text-xs text-muted-foreground hidden sm:block">
            * Required ground-truth fields
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={submitting}>
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Employee Profile
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function FormField({
  label,
  children,
  wide,
  error,
}: {
  label: string;
  children: React.ReactNode;
  wide?: boolean;
  error?: string;
}) {
  return (
    <div className={`space-y-1.5 ${wide ? "sm:col-span-2" : ""}`}>
      <Label className="text-xs font-medium flex items-center gap-1">
        {label}
        {error && <span className="text-destructive font-normal text-[11px]">— {error}</span>}
      </Label>
      {children}
    </div>
  );
}
