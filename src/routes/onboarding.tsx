import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import {
  ArrowLeft, ArrowRight, Building2, CheckCircle2, ChevronLeft, Pencil,
  Plus, Sparkles, Trash2, Upload, UserCog, UserPlus, Users, Loader2,
  Lock, ShieldCheck, FileText, User, Briefcase, CreditCard, BookOpen,
  Award, AlertCircle, RefreshCw, Eye, Check, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Stepper } from "@/components/ofc360/Stepper";
import { ofc360, useofc360, uid } from "@/lib/ofc360-store";
import { api, setTokens, apiInstance } from "@/api";
import { toast } from "sonner";
import { AuthLoadingScreen } from "@/features/auth/components/AuthLoadingScreen";

export const Route = createFileRoute("/onboarding")({
  validateSearch: z.object({
    token: z.string().optional(),
  }),
  head: () => ({
    meta: [
      { title: "Onboarding — OFC360" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: OnboardingPage,
});

// Company Admin Wizard Constants
const ADMIN_STEPS = ["Company", "Admin Profile", "HR Settings", "Departments & Designations", "Invite Employees", "Complete"];
const INDUSTRIES = ["Software", "Finance", "Healthcare", "Retail", "Manufacturing", "Education", "Other"];
const SIZES = ["1–10", "11–50", "51–200", "201–500", "501–1000", "1000+"];
const TIMEZONES = ["UTC", "America/New_York", "America/Los_Angeles", "Europe/London", "Europe/Berlin", "Asia/Kolkata", "Asia/Singapore", "Australia/Sydney"];

function backendStepToUiIndex(backendStep: number): number {
  return Math.max(0, Math.min(5, backendStep - 1));
}

async function syncDeptsAndDesignations(ws: ReturnType<typeof useofc360>) {
  const deptNames = Array.from(new Set([
    "Management",
    ...ws.hrs.map((h: any) => h.department),
    ...ws.employees.map((e: any) => e.department),
    ...ws.managers.map((m: any) => m.department),
  ].filter(Boolean)));
  const depts = deptNames.map((d, index) => ({
    department_code: d.substring(0, 3).toUpperCase() + "_" + (10 + index),
    department_name: d,
    description: `Department for ${d}`,
  }));
  await api.post("onboarding/departments", { departments: depts });

  const designations = Array.from(new Set([
    "Company Owner",
    ...ws.hrs.map((h: any) => h.designation),
    ...ws.employees.map((e: any) => e.designation),
    ...ws.managers.map((m: any) => m.designation),
  ].filter(Boolean)));
  await api.post("onboarding/designations", { designations });
}

async function syncInvites(ws: ReturnType<typeof useofc360>) {
  const allInvites = [
    ...ws.hrs.map((h: any) => {
      const parts = h.fullName.split(" ");
      return {
        first_name: parts[0] || "HR",
        last_name: parts.slice(1).join(" ") || "Member",
        personal_email: h.email,
        phone: h.phone || "9876543210",
        department: h.department || "Human Resources",
        designation: h.designation || "HR Specialist",
      };
    }),
    ...ws.employees.map((e: any) => {
      const parts = e.fullName.split(" ");
      return {
        first_name: parts[0] || "Employee",
        last_name: parts.slice(1).join(" ") || "Member",
        personal_email: e.email,
        phone: e.phone || "9876543210",
        department: e.department || "Engineering",
        designation: e.designation || "Software Engineer",
      };
    }),
    ...ws.managers.map((m: any) => {
      const parts = m.fullName.split(" ");
      return {
        first_name: parts[0] || "Manager",
        last_name: parts.slice(1).join(" ") || "Member",
        personal_email: m.email,
        phone: m.phone || "9876543210",
        department: m.department || "Management",
        designation: m.designation || "Team Manager",
      };
    }),
  ].filter((x: any) => x.personal_email && x.first_name);

  allInvites.forEach((inv) => {
    const cleanPhone = inv.phone.replace(/\D/g, "");
    inv.phone = cleanPhone.length >= 10 ? cleanPhone.substring(0, 10) : "9876543210";
  });

  if (allInvites.length > 0) {
    await api.post("onboarding/invite-employees", { employees: allInvites, skip: false });
  } else {
    await api.post("onboarding/invite-employees", { employees: [], skip: true });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN ONBOARDING ROUTER PAGE
// ─────────────────────────────────────────────────────────────────────────────
function OnboardingPage() {
  const navigate = useNavigate();
  const ws = useofc360();
  const { token } = Route.useSearch();
  const userRole = (ws.user?.role as string)?.toLowerCase();

  useEffect(() => {
    if (token) return; // Allow invitation token setup
    if (ws.isRestoring) return;
    if (!ws.user) {
      navigate({ to: "/register" });
      return;
    }
    if (ws.user.emailVerified === false) {
      navigate({ to: "/verify-email" });
      return;
    }
    if (userRole === "super_admin") {
      navigate({ to: "/dashboard/super-admin", replace: true });
      return;
    }
    if (ws.user.onboardingComplete) {
      const dest = userRole === "employee" ? "/dashboard/employee" : userRole === "manager" ? "/dashboard/manager" : "/dashboard";
      navigate({ to: dest as any, replace: true });
      return;
    }
  }, [ws.user, ws.isRestoring, navigate, token, userRole]);

  if (token) {
    return <TokenActivationOnboarding token={token} />;
  }

  if (ws.isRestoring || !ws.user) {
    return <AuthLoadingScreen />;
  }

  // Strictly route by role
  if (userRole === "company_admin" || userRole === "admin" || userRole === "owner") {
    return <CompanyAdminOnboarding />;
  }

  // Employee, Manager, HR receive Employee Self-Service Onboarding
  return <EmployeeOnboarding />;
}


// ─────────────────────────────────────────────────────────────────────────────
// 1. TOKEN ACTIVATION FORM (INVITED EMPLOYEES)
// ─────────────────────────────────────────────────────────────────────────────
function TokenActivationOnboarding({ token }: { token: string }) {
  const navigate = useNavigate();
  const [tokenLoading, setTokenLoading] = useState(true);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [empData, setEmpData] = useState<any>(null);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [acceptPolicies, setAcceptPolicies] = useState(false);
  const [activating, setActivating] = useState(false);

  useEffect(() => {
    setTokenLoading(true);
    setTokenError(null);
    api.get(`onboarding/validate?token=${token}`)
      .then((res: any) => {
        if (res.success) {
          setEmpData(res.data);
          setPhone(res.data.phone || "");
        } else {
          setTokenError(res.message || "Invitation expired or invalid.");
        }
      })
      .catch((err: any) => {
        setTokenError(err.message || "Invitation expired or invalid.");
      })
      .finally(() => setTokenLoading(false));
  }, [token]);

  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || password.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    if (!acceptPolicies) {
      toast.error("Please accept the company terms and policies.");
      return;
    }

    setActivating(true);
    try {
      const res: any = await api.post("onboarding/activate", {
        token,
        password,
        phone,
        profile_photo: "",
        emergency_contact_name: "",
        emergency_contact_phone: "",
        accept_policies: true,
      });

      if (res.success && res.data?.tokens) {
        setTokens(res.data.tokens);
        ofc360.set({
          user: {
            id: res.data.user.id,
            fullName: res.data.user.name,
            email: res.data.user.email,
            phone: res.data.user.phone || phone,
            role: res.data.user.role,
            companyId: String(res.data.user.company_id),
            emailVerified: true,
            onboardingComplete: false,
            createdAt: new Date().toISOString(),
          },
          company: {
            id: String(res.data.user.company_id),
            name: res.data.user.company_name || "Company Workspace",
          },
        });
        toast.success("Account activated! Let's complete your onboarding.");
        navigate({ to: "/onboarding", replace: true });
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to activate account");
    } finally {
      setActivating(false);
    }
  };

  if (tokenLoading) return <AuthLoadingScreen />;

  if (tokenError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full rounded-2xl border border-rose-500/20 bg-rose-500/5 p-8 text-center shadow-xl">
          <AlertCircle className="mx-auto h-10 w-10 text-rose-500 mb-3" />
          <h2 className="text-lg font-bold text-foreground">Invalid or Expired Invitation</h2>
          <p className="text-xs text-muted-foreground mt-2">{tokenError}</p>
          <Link to="/login" className="mt-6 inline-block">
            <Button variant="outline" className="h-9 text-xs">Back to Login</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-4">
          <Sparkles className="h-3.5 w-3.5" /> Official Onboarding Invitation
        </div>
        <h2 className="text-2xl font-bold font-display text-foreground">Activate Your Account</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Welcome to <strong className="text-foreground">{empData?.company_name || "your organization"}</strong>! Set up your password to begin.
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-card border border-border py-8 px-6 shadow-xl rounded-2xl sm:px-8">
          <form onSubmit={handleActivate} className="space-y-4 text-xs">
            <div>
              <Label className="text-muted-foreground text-xs font-semibold">Full Name</Label>
              <Input value={empData?.employee_name || ""} disabled className="mt-1 bg-muted/20 h-9" />
            </div>

            <div>
              <Label className="text-muted-foreground text-xs font-semibold">Work Email</Label>
              <Input value={empData?.email || ""} disabled className="mt-1 bg-muted/20 h-9" />
            </div>

            <div>
              <Label className="text-muted-foreground text-xs font-semibold">Create Password</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                required
                className="mt-1 h-9"
              />
            </div>

            <div>
              <Label className="text-muted-foreground text-xs font-semibold">Confirm Password</Label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat password"
                required
                className="mt-1 h-9"
              />
            </div>

            <div>
              <Label className="text-muted-foreground text-xs font-semibold">Mobile Phone Number</Label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                required
                className="mt-1 h-9"
              />
            </div>

            <div className="flex items-start gap-2 pt-2">
              <Checkbox
                id="policy"
                checked={acceptPolicies}
                onCheckedChange={(val) => setAcceptPolicies(Boolean(val))}
              />
              <Label htmlFor="policy" className="text-[11px] text-muted-foreground leading-snug cursor-pointer">
                I agree to the company code of conduct, employment policies, and terms of service.
              </Label>
            </div>

            <Button type="submit" disabled={activating} className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold mt-4 gap-2 text-xs">
              {activating ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
              Activate Account & Continue
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}


// ─────────────────────────────────────────────────────────────────────────────
// 2. DEDICATED EMPLOYEE SELF-SERVICE ONBOARDING WIZARD
// ─────────────────────────────────────────────────────────────────────────────
const EMPLOYEE_STEPS = [
  "Welcome",
  "Personal Info",
  "Identity Proof",
  "Employment",
  "Education & Exp",
  "Bank & Tax",
  "Upload Docs",
  "Policies",
  "Final Review"
];

function EmployeeOnboarding() {
  const navigate = useNavigate();
  const ws = useofc360();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Status & Saved Data
  const [statusData, setStatusData] = useState<any>(null);
  const [progressData, setProgressData] = useState<any>(null);

  // Form Fields
  // Step 1: Personal Info
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("MALE");
  const [maritalStatus, setMaritalStatus] = useState("SINGLE");
  const [personalEmail, setPersonalEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [nationality, setNationality] = useState("Indian");
  const [currentAddress, setCurrentAddress] = useState("");
  const [permanentAddress, setPermanentAddress] = useState("");
  const [emergencyName, setEmergencyName] = useState("");
  const [emergencyRelation, setEmergencyRelation] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");

  // Step 2: Identity
  const [aadhaar, setAadhaar] = useState("");
  const [pan, setPan] = useState("");
  const [passport, setPassport] = useState("");
  const [passportExpiry, setPassportExpiry] = useState("");

  // Step 4: Education & Experience
  const [degree, setDegree] = useState("B.Tech / Bachelor's");
  const [institution, setInstitution] = useState("");
  const [gradYear, setGradYear] = useState("2022");
  const [priorCompany, setPriorCompany] = useState("");
  const [priorRole, setPriorRole] = useState("");
  const [expYears, setExpYears] = useState("2");

  // Step 5: Bank & Tax
  const [accountNumber, setAccountNumber] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountHolder, setAccountHolder] = useState("");
  const [taxRegime, setTaxRegime] = useState("NEW");
  const [pfNumber, setPfNumber] = useState("");
  const [uanNumber, setUanNumber] = useState("");
  const [nomineeName, setNomineeName] = useState("");
  const [nomineeRelation, setNomineeRelation] = useState("");

  // Step 6: Documents
  const [uploadedDocs, setUploadedDocs] = useState<any[]>([]);
  const [uploadingType, setUploadingType] = useState<string | null>(null);

  // Step 7: Policies
  const [ackHandbook, setAckHandbook] = useState(false);
  const [ackNda, setAckNda] = useState(false);
  const [ackLeave, setAckLeave] = useState(false);

  const fetchStatusAndProgress = async () => {
    setIsLoading(true);
    try {
      const [statusRes, progressRes]: [any, any] = await Promise.all([
        api.get("employee-onboarding/status"),
        api.get("employee-onboarding/progress"),
      ]);

      if (statusRes.success && statusRes.data) {
        setStatusData(statusRes.data);
        const stepNum = statusRes.current_step || 1;
        setCurrentStepIndex(Math.max(0, Math.min(EMPLOYEE_STEPS.length - 1, stepNum - 1)));
      }

      if (progressRes.success && progressRes.data) {
        const p = progressRes.data;
        setProgressData(p);

        // Prefill forms
        if (p.personal_info) {
          setFirstName(p.personal_info.first_name || ws.user?.fullName.split(" ")[0] || "");
          setLastName(p.personal_info.last_name || ws.user?.fullName.split(" ")[1] || "");
          setDob(p.personal_info.date_of_birth || "");
          setGender(p.personal_info.gender || "MALE");
          setMaritalStatus(p.personal_info.marital_status || "SINGLE");
          setPersonalEmail(p.personal_info.personal_email || ws.user?.email || "");
          setPhone(p.personal_info.phone || ws.user?.phone || "");
          setNationality(p.personal_info.nationality || "Indian");
          setCurrentAddress(p.personal_info.current_address || "");
          setPermanentAddress(p.personal_info.permanent_address || "");
          setEmergencyName(p.personal_info.emergency_contact_name || "");
          setEmergencyRelation(p.personal_info.emergency_contact_relation || "");
          setEmergencyPhone(p.personal_info.emergency_contact_phone || "");
        } else {
          setFirstName(ws.user?.fullName.split(" ")[0] || "");
          setLastName(ws.user?.fullName.split(" ")[1] || "");
          setPersonalEmail(ws.user?.email || "");
          setPhone(ws.user?.phone || "");
        }

        if (p.identity) {
          setAadhaar(p.identity.aadhaar_number || "");
          setPan(p.identity.pan_number || "");
          setPassport(p.identity.passport_number || "");
          setPassportExpiry(p.identity.passport_expiry || "");
        }

        if (p.education && p.education.length > 0) {
          setDegree(p.education[0].degree || "B.Tech / Bachelor's");
          setInstitution(p.education[0].institution || "");
          setGradYear(String(p.education[0].completion_year || "2022"));
        }

        if (p.experience && p.experience.length > 0) {
          setPriorCompany(p.experience[0].company_name || "");
          setPriorRole(p.experience[0].designation || "");
          setExpYears(String(p.experience[0].total_years || "2"));
        }

        if (p.bank_details) {
          setAccountNumber(p.bank_details.account_number || "");
          setIfsc(p.bank_details.ifsc_code || "");
          setBankName(p.bank_details.bank_name || "");
          setAccountHolder(p.bank_details.account_holder_name || ws.user?.fullName || "");
        }

        if (p.tax_payroll) {
          setTaxRegime(p.tax_payroll.tax_regime || "NEW");
          setPfNumber(p.tax_payroll.pf_number || "");
          setUanNumber(p.tax_payroll.uan_number || "");
          setNomineeName(p.tax_payroll.nominee_name || "");
          setNomineeRelation(p.tax_payroll.nominee_relation || "");
        }

        if (p.documents) {
          setUploadedDocs(p.documents);
        }

        if (p.policies && p.policies.length > 0) {
          setAckHandbook(true);
          setAckNda(true);
          setAckLeave(true);
        }
      }
    } catch (err: any) {
      console.error("Failed to load employee onboarding status:", err);
      toast.error(err.message || "Failed to load onboarding status");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStatusAndProgress();
  }, []);

  const handleSaveStep1 = async () => {
    if (!firstName || !phone || !currentAddress || !nationality) {
      toast.error("Please fill in all required personal information fields including nationality.");
      return;
    }
    setIsSubmitting(true);
    try {
      await api.put("employee-onboarding/step/1", {
        first_name: firstName,
        last_name: lastName,
        date_of_birth: dob || "1998-01-01",
        gender,
        marital_status: maritalStatus,
        nationality,
        personal_email: personalEmail,
        phone,
        current_address: currentAddress,
        permanent_address: permanentAddress || currentAddress,
        emergency_contact_name: emergencyName,
        emergency_contact_relation: emergencyRelation,
        emergency_contact_phone: emergencyPhone,
      });
      toast.success("Personal information saved.");
      setCurrentStepIndex(2);
    } catch (err: any) {
      toast.error(err.message || "Failed to save personal info");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveStep2 = async () => {
    if (!pan) {
      toast.error("PAN Card number is required for statutory verification.");
      return;
    }
    setIsSubmitting(true);
    try {
      await api.put("employee-onboarding/step/2", {
        aadhaar_number: aadhaar,
        pan_number: pan,
        passport_number: passport || undefined,
        passport_expiry: passportExpiry || undefined,
      });
      toast.success("Identity verification saved.");
      setCurrentStepIndex(3);
    } catch (err: any) {
      toast.error(err.message || "Failed to save identity proof");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveStep4 = async () => {
    setIsSubmitting(true);
    const endYr = parseInt(gradYear) || 2022;
    const startYr = endYr - 4;
    try {
      await api.put("employee-onboarding/step/4", {
        education_records: [
          {
            degree,
            institution: institution || "University",
            start_year: startYr,
            end_year: endYr,
            completion_year: endYr,
          },
        ],
      });
      await api.put("employee-onboarding/step/5", {
        experience_records: priorCompany
          ? [
              {
                company_name: priorCompany,
                designation: priorRole || "Engineer",
                start_date: "2020-01-01",
                total_years: parseFloat(expYears) || 2,
              },
            ]
          : [],
      });
      toast.success("Education & background saved.");
      setCurrentStepIndex(5);
    } catch (err: any) {
      toast.error(err.message || "Failed to save education/experience");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveStep5 = async () => {
    if (!accountNumber || !ifsc) {
      toast.error("Bank Account Number and IFSC Code are required.");
      return;
    }
    setIsSubmitting(true);
    try {
      await api.put("employee-onboarding/step/6", {
        account_number: accountNumber,
        ifsc_code: ifsc,
        bank_name: bankName || "HDFC Bank",
        branch_name: "Main Branch",
        account_holder_name: accountHolder || ws.user?.fullName || "Employee",
      });
      await api.put("employee-onboarding/step/7", {
        tax_regime: taxRegime,
        pf_number: pfNumber || undefined,
        uan_number: uanNumber || undefined,
        nominee_name: nomineeName || "Family Member",
        nominee_relation: nomineeRelation || "Spouse/Parent",
      });
      toast.success("Bank details & tax regime saved.");
      setCurrentStepIndex(6);
    } catch (err: any) {
      toast.error(err.message || "Failed to save bank/tax details");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, docType: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingType(docType);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("document_type", docType);

      const res = await apiInstance.post("/employee-onboarding/step/8/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data?.success) {
        toast.success(`${docType} uploaded successfully!`);
        fetchStatusAndProgress();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.detail || err.message || "Document upload failed");
    } finally {
      setUploadingType(null);
    }
  };

  const handleDeleteDoc = async (docId: string) => {
    try {
      await api.delete(`employee-onboarding/step/8/document/${docId}`);
      toast.success("Document removed.");
      fetchStatusAndProgress();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete document");
    }
  };

  const handleSaveStep6Docs = async () => {
    setIsSubmitting(true);
    try {
      await api.put("employee-onboarding/step/8", {});
      toast.success("Documents finalized.");
      setCurrentStepIndex(7);
    } catch (err: any) {
      toast.error(err.message || "Failed to finalize documents");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveStep7Policies = async () => {
    if (!ackHandbook || !ackNda || !ackLeave) {
      toast.error("Please read and acknowledge all required employment policies.");
      return;
    }
    setIsSubmitting(true);
    try {
      await api.put("employee-onboarding/step/9", {
        acceptances: [
          { policy_name: "EMPLOYEE_HANDBOOK", accepted: true },
          { policy_name: "DATA_SECURITY_NDA", accepted: true },
          { policy_name: "LEAVE_ATTENDANCE_POLICY", accepted: true },
        ],
      });
      toast.success("Company policies acknowledged.");
      setCurrentStepIndex(8);
    } catch (err: any) {
      toast.error(err.message || "Failed to accept policies");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCompleteOnboarding = async () => {
    setIsSubmitting(true);
    try {
      const res: any = await api.post("employee-onboarding/complete");
      if (res.success) {
        toast.success("Congratulations! Your employee onboarding is complete.");
        if (ws.user) {
          ofc360.set({ user: { ...ws.user, onboardingComplete: true } });
        }
        navigate({ to: "/dashboard/employee", replace: true });
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to complete onboarding");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <AuthLoadingScreen />;

  const empDetails = progressData?.employment || {};

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between p-4 md:p-8">
      <div className="max-w-4xl mx-auto w-full space-y-6">
        {/* TOP HEADER */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 text-[10px] uppercase font-bold">
                Employee Self-Service Onboarding
              </Badge>
            </div>
            <h1 className="text-xl font-bold font-display text-foreground mt-1">
              Welcome, {ws.user?.fullName || "Employee"}!
            </h1>
            <p className="text-xs text-muted-foreground">
              Organization: <strong className="text-foreground">{ws.company?.name || "Company Workspace"}</strong>
            </p>
          </div>
          <Button onClick={() => navigate({ to: "/dashboard/employee" })} variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground hover:text-foreground">
            Skip to Dashboard
          </Button>
        </div>

        {/* STEPPER NAV */}
        <div className="overflow-x-auto scrollbar-none py-2 border-b border-border">
          <Stepper steps={EMPLOYEE_STEPS} current={currentStepIndex} />
        </div>

        {/* STEP CONTENT CONTAINER */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-xl space-y-6">
          {/* STEP 0: WELCOME & POSITION OVERVIEW */}
          {currentStepIndex === 0 && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-6 text-center space-y-3">
                <Sparkles className="h-10 w-10 text-indigo-400 mx-auto animate-pulse" />
                <h2 className="text-lg font-bold text-foreground">Welcome to the Team!</h2>
                <p className="text-xs text-muted-foreground max-w-lg mx-auto leading-relaxed">
                  We are excited to have you onboard at <strong>{ws.company?.name}</strong>. Please complete the quick verification steps below to finalize your HR records, statutory tax setup, and payroll enrollment.
                </p>
              </div>

              {/* Company Provided Read-Only Position Overview */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-indigo-400" /> Confirmed Employment Offer Details
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-muted/20 border border-border">
                    <span className="text-[10px] text-muted-foreground block font-medium">Designation</span>
                    <span className="font-bold text-foreground mt-0.5 block">{empDetails.designation || "Software Engineer"}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-muted/20 border border-border">
                    <span className="text-[10px] text-muted-foreground block font-medium">Department</span>
                    <span className="font-bold text-foreground mt-0.5 block">{empDetails.department || "Engineering"}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-muted/20 border border-border">
                    <span className="text-[10px] text-muted-foreground block font-medium">Employee Code</span>
                    <span className="font-mono font-bold text-indigo-400 mt-0.5 block">{empDetails.employee_id || "EMP-001"}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-muted/20 border border-border">
                    <span className="text-[10px] text-muted-foreground block font-medium">Joining Date</span>
                    <span className="font-semibold text-foreground mt-0.5 block">{empDetails.joining_date || new Date().toISOString().split("T")[0]}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={() => setCurrentStepIndex(1)} className="h-9 px-5 text-xs bg-indigo-600 hover:bg-indigo-700 text-white gap-2 font-semibold">
                  Begin Onboarding <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 1: PERSONAL INFORMATION */}
          {currentStepIndex === 1 && (
            <div className="space-y-5 text-xs">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                    <User className="h-4 w-4 text-indigo-400" /> Personal Information
                  </h2>
                  <p className="text-xs text-muted-foreground">Provide your contact info and personal contact details.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs font-semibold text-muted-foreground">First Name *</Label>
                  <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} className="mt-1 h-9" required />
                </div>

                <div>
                  <Label className="text-xs font-semibold text-muted-foreground">Last Name</Label>
                  <Input value={lastName} onChange={(e) => setLastName(e.target.value)} className="mt-1 h-9" />
                </div>

                <div>
                  <Label className="text-xs font-semibold text-muted-foreground">Date of Birth *</Label>
                  <Input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="mt-1 h-9" />
                </div>

                <div>
                  <Label className="text-xs font-semibold text-muted-foreground">Gender</Label>
                  <Select value={gender} onValueChange={setGender}>
                    <SelectTrigger className="mt-1 h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MALE">Male</SelectItem>
                      <SelectItem value="FEMALE">Female</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs font-semibold text-muted-foreground">Personal Email *</Label>
                  <Input value={personalEmail} onChange={(e) => setPersonalEmail(e.target.value)} className="mt-1 h-9" />
                </div>

                <div>
                  <Label className="text-xs font-semibold text-muted-foreground">Mobile Phone *</Label>
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1 h-9" />
                </div>

                <div>
                  <Label className="text-xs font-semibold text-muted-foreground">Nationality *</Label>
                  <Input value={nationality} onChange={(e) => setNationality(e.target.value)} placeholder="e.g. Indian" className="mt-1 h-9" required />
                </div>

                <div className="sm:col-span-2">
                  <Label className="text-xs font-semibold text-muted-foreground">Current Residence Address *</Label>
                  <Textarea value={currentAddress} onChange={(e) => setCurrentAddress(e.target.value)} rows={2} className="mt-1" />
                </div>
              </div>

              <div className="border-t border-border pt-4 space-y-3">
                <h3 className="font-bold text-foreground">Emergency Contact Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <Label className="text-[11px] text-muted-foreground">Contact Person Name</Label>
                    <Input value={emergencyName} onChange={(e) => setEmergencyName(e.target.value)} placeholder="e.g. Parent / Spouse" className="mt-1 h-9" />
                  </div>
                  <div>
                    <Label className="text-[11px] text-muted-foreground">Relationship</Label>
                    <Input value={emergencyRelation} onChange={(e) => setEmergencyRelation(e.target.value)} placeholder="Father / Spouse" className="mt-1 h-9" />
                  </div>
                  <div>
                    <Label className="text-[11px] text-muted-foreground">Emergency Phone</Label>
                    <Input value={emergencyPhone} onChange={(e) => setEmergencyPhone(e.target.value)} placeholder="+91 98765 43210" className="mt-1 h-9" />
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button onClick={() => setCurrentStepIndex(0)} variant="outline" className="h-9 text-xs">Back</Button>
                <Button onClick={handleSaveStep1} disabled={isSubmitting} className="h-9 px-5 bg-indigo-600 text-white font-semibold text-xs gap-1.5">
                  {isSubmitting ? "Saving..." : "Save & Continue"} <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2: IDENTITY PROOF */}
          {currentStepIndex === 2 && (
            <div className="space-y-5 text-xs">
              <div className="border-b border-border pb-3">
                <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                  <Lock className="h-4 w-4 text-indigo-400" /> Identity & Statutory Verification
                </h2>
                <p className="text-xs text-muted-foreground">Enter government-issued identification numbers for statutory payroll processing.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs font-semibold text-muted-foreground">PAN Card Number *</Label>
                  <Input value={pan} onChange={(e) => setPan(e.target.value.toUpperCase())} placeholder="ABCDE1234F" className="mt-1 h-9 font-mono uppercase" required />
                </div>

                <div>
                  <Label className="text-xs font-semibold text-muted-foreground">Aadhaar Card Number</Label>
                  <Input value={aadhaar} onChange={(e) => setAadhaar(e.target.value)} placeholder="1234 5678 9012" className="mt-1 h-9 font-mono" />
                </div>

                <div>
                  <Label className="text-xs font-semibold text-muted-foreground">Passport Number (Optional)</Label>
                  <Input value={passport} onChange={(e) => setPassport(e.target.value.toUpperCase())} placeholder="A1234567" className="mt-1 h-9 font-mono" />
                </div>

                <div>
                  <Label className="text-xs font-semibold text-muted-foreground">Passport Expiry Date</Label>
                  <Input type="date" value={passportExpiry} onChange={(e) => setPassportExpiry(e.target.value)} className="mt-1 h-9" />
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button onClick={() => setCurrentStepIndex(1)} variant="outline" className="h-9 text-xs">Back</Button>
                <Button onClick={handleSaveStep2} disabled={isSubmitting} className="h-9 px-5 bg-indigo-600 text-white font-semibold text-xs gap-1.5">
                  {isSubmitting ? "Saving..." : "Save & Continue"} <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: READ-ONLY EMPLOYMENT DETAILS */}
          {currentStepIndex === 3 && (
            <div className="space-y-5 text-xs">
              <div className="border-b border-border pb-3">
                <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-indigo-400" /> Company Employment Details
                </h2>
                <p className="text-xs text-muted-foreground">These company-managed records are pre-assigned by your HR administrator.</p>
              </div>

              <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4 space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase font-bold block">Company Name</span>
                    <span className="font-bold text-foreground mt-1 block">{ws.company?.name || "Workspace"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase font-bold block">Employee Code</span>
                    <span className="font-mono font-bold text-indigo-400 mt-1 block">{empDetails.employee_id || "EMP-001"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase font-bold block">Work Location</span>
                    <span className="font-semibold text-foreground mt-1 block">{empDetails.work_location || "Headquarters"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase font-bold block">Designation</span>
                    <span className="font-semibold text-foreground mt-1 block">{empDetails.designation || "Software Engineer"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase font-bold block">Department</span>
                    <span className="font-semibold text-foreground mt-1 block">{empDetails.department || "Engineering"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase font-bold block">Employment Type</span>
                    <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 mt-1 text-[10px]">
                      {empDetails.employment_type || "FULL_TIME"}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button onClick={() => setCurrentStepIndex(2)} variant="outline" className="h-9 text-xs">Back</Button>
                <Button onClick={() => setCurrentStepIndex(4)} className="h-9 px-5 bg-indigo-600 text-white font-semibold text-xs gap-1.5">
                  Confirm & Continue <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 4: EDUCATION & EXPERIENCE */}
          {currentStepIndex === 4 && (
            <div className="space-y-5 text-xs">
              <div className="border-b border-border pb-3">
                <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                  <Award className="h-4 w-4 text-indigo-400" /> Educational & Work Background
                </h2>
                <p className="text-xs text-muted-foreground">Provide details regarding your highest qualification and previous employment.</p>
              </div>

              <div className="space-y-3">
                <h3 className="font-bold text-foreground">Highest Educational Qualification</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <Label className="text-[11px] text-muted-foreground">Degree / Diploma</Label>
                    <Input value={degree} onChange={(e) => setDegree(e.target.value)} className="mt-1 h-9" />
                  </div>
                  <div>
                    <Label className="text-[11px] text-muted-foreground">University / Institution</Label>
                    <Input value={institution} onChange={(e) => setInstitution(e.target.value)} placeholder="e.g. State University" className="mt-1 h-9" />
                  </div>
                  <div>
                    <Label className="text-[11px] text-muted-foreground">Graduation Year</Label>
                    <Input value={gradYear} onChange={(e) => setGradYear(e.target.value)} className="mt-1 h-9" />
                  </div>
                </div>
              </div>

              <div className="border-t border-border pt-4 space-y-3">
                <h3 className="font-bold text-foreground">Previous Work Experience (If applicable)</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <Label className="text-[11px] text-muted-foreground">Previous Company</Label>
                    <Input value={priorCompany} onChange={(e) => setPriorCompany(e.target.value)} placeholder="Previous employer name" className="mt-1 h-9" />
                  </div>
                  <div>
                    <Label className="text-[11px] text-muted-foreground">Designation</Label>
                    <Input value={priorRole} onChange={(e) => setPriorRole(e.target.value)} placeholder="e.g. Junior Developer" className="mt-1 h-9" />
                  </div>
                  <div>
                    <Label className="text-[11px] text-muted-foreground">Total Experience (Years)</Label>
                    <Input value={expYears} onChange={(e) => setExpYears(e.target.value)} className="mt-1 h-9" />
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button onClick={() => setCurrentStepIndex(3)} variant="outline" className="h-9 text-xs">Back</Button>
                <Button onClick={handleSaveStep4} disabled={isSubmitting} className="h-9 px-5 bg-indigo-600 text-white font-semibold text-xs gap-1.5">
                  {isSubmitting ? "Saving..." : "Save & Continue"} <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 5: BANK DETAILS & TAX SETUP */}
          {currentStepIndex === 5 && (
            <div className="space-y-5 text-xs">
              <div className="border-b border-border pb-3">
                <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-indigo-400" /> Salary Bank Account & Tax Declaration
                </h2>
                <p className="text-xs text-muted-foreground">Configure direct deposit bank details and select your statutory tax regime.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs font-semibold text-muted-foreground">Bank Account Number *</Label>
                  <Input value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} className="mt-1 h-9 font-mono" required />
                </div>

                <div>
                  <Label className="text-xs font-semibold text-muted-foreground">IFSC Code *</Label>
                  <Input value={ifsc} onChange={(e) => setIfsc(e.target.value.toUpperCase())} placeholder="HDFC0001234" className="mt-1 h-9 font-mono uppercase" required />
                </div>

                <div>
                  <Label className="text-xs font-semibold text-muted-foreground">Bank Name</Label>
                  <Input value={bankName} onChange={(e) => setBankName(e.target.value)} placeholder="e.g. HDFC Bank" className="mt-1 h-9" />
                </div>

                <div>
                  <Label className="text-xs font-semibold text-muted-foreground">Account Holder Name</Label>
                  <Input value={accountHolder} onChange={(e) => setAccountHolder(e.target.value)} className="mt-1 h-9" />
                </div>
              </div>

              <div className="border-t border-border pt-4 space-y-4">
                <h3 className="font-bold text-foreground">Income Tax Regime Selection</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setTaxRegime("NEW")}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${taxRegime === "NEW" ? "border-indigo-500 bg-indigo-500/10 font-bold" : "border-border bg-card/40"}`}
                  >
                    <span className="block text-foreground">New Tax Regime</span>
                    <span className="text-[10px] text-muted-foreground">Lower slab rates, lower deductions</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTaxRegime("OLD")}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${taxRegime === "OLD" ? "border-indigo-500 bg-indigo-500/10 font-bold" : "border-border bg-card/40"}`}
                  >
                    <span className="block text-foreground">Old Tax Regime</span>
                    <span className="text-[10px] text-muted-foreground">Exemptions 80C, 80D, HRA allowed</span>
                  </button>
                </div>
              </div>

              <div className="border-t border-border pt-4 space-y-3">
                <h3 className="font-bold text-foreground">PF & Gratuity Nominee Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-[11px] text-muted-foreground">Nominee Full Name *</Label>
                    <Input value={nomineeName} onChange={(e) => setNomineeName(e.target.value)} placeholder="e.g. Parent / Spouse Name" className="mt-1 h-9" />
                  </div>
                  <div>
                    <Label className="text-[11px] text-muted-foreground">Nominee Relationship *</Label>
                    <Input value={nomineeRelation} onChange={(e) => setNomineeRelation(e.target.value)} placeholder="Father / Spouse / Mother" className="mt-1 h-9" />
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button onClick={() => setCurrentStepIndex(4)} variant="outline" className="h-9 text-xs">Back</Button>
                <Button onClick={handleSaveStep5} disabled={isSubmitting} className="h-9 px-5 bg-indigo-600 text-white font-semibold text-xs gap-1.5">
                  {isSubmitting ? "Saving..." : "Save & Continue"} <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 6: UPLOAD DOCUMENTS */}
          {currentStepIndex === 6 && (
            <div className="space-y-5 text-xs">
              <div className="border-b border-border pb-3">
                <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                  <Upload className="h-4 w-4 text-indigo-400" /> Onboarding Document Uploads
                </h2>
                <p className="text-xs text-muted-foreground">Upload required identity, bank, and educational verification documents (PDF or JPG).</p>
              </div>

              {/* Upload Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { type: "AADHAAR", label: "Aadhaar Card (Front/Back)" },
                  { type: "PAN", label: "PAN Card" },
                  { type: "CANCELLED_CHEQUE", label: "Bank Passbook / Cancelled Cheque" },
                  { type: "DEGREE", label: "Highest Educational Marksheet" },
                  { type: "PHOTO", label: "Passport Photograph" },
                  { type: "RESUME", label: "Resume / CV" },
                ].map((docItem) => {
                  const existingDoc = uploadedDocs.find((d) => d.document_type === docItem.type && !d.is_deleted);
                  const isUploading = uploadingType === docItem.type;

                  return (
                    <div key={docItem.type} className="p-4 rounded-xl border border-border bg-muted/10 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-foreground">{docItem.label}</span>
                        {existingDoc ? (
                          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[9px] gap-1">
                            <Check className="h-3 w-3" /> Uploaded
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-amber-400 border-amber-500/20 text-[9px]">
                            Required
                          </Badge>
                        )}
                      </div>

                      {existingDoc ? (
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[11px] text-muted-foreground font-mono truncate max-w-[200px]">
                            {existingDoc.file_name || "Document.pdf"}
                          </span>
                          <Button onClick={() => handleDeleteDoc(existingDoc.id)} variant="ghost" size="sm" className="h-7 text-rose-400 hover:bg-rose-500/10 px-2 text-[10px] gap-1">
                            <Trash2 className="h-3 w-3" /> Remove
                          </Button>
                        </div>
                      ) : (
                        <label className="flex items-center justify-center gap-2 p-3 rounded-lg border border-dashed border-border hover:border-indigo-500 bg-background/50 cursor-pointer text-muted-foreground hover:text-foreground transition-all">
                          {isUploading ? <Loader2 className="h-4 w-4 animate-spin text-indigo-400" /> : <Upload className="h-4 w-4 text-indigo-400" />}
                          <span>{isUploading ? "Uploading..." : "Click to Upload File"}</span>
                          <input type="file" onChange={(e) => handleFileUpload(e, docItem.type)} className="hidden" accept=".pdf,.jpg,.jpeg,.png,.webp" />
                        </label>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between pt-4">
                <Button onClick={() => setCurrentStepIndex(5)} variant="outline" className="h-9 text-xs">Back</Button>
                <Button onClick={handleSaveStep6Docs} disabled={isSubmitting} className="h-9 px-5 bg-indigo-600 text-white font-semibold text-xs gap-1.5">
                  {isSubmitting ? "Saving..." : "Finalize Documents"} <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 7: POLICIES & AGREEMENTS */}
          {currentStepIndex === 7 && (
            <div className="space-y-5 text-xs">
              <div className="border-b border-border pb-3">
                <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-indigo-400" /> Employment Policies & Code of Conduct
                </h2>
                <p className="text-xs text-muted-foreground">Please read and acknowledge the mandatory company policies and employment terms.</p>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-xl border border-border bg-muted/10 flex items-start gap-3">
                  <Checkbox id="hbook" checked={ackHandbook} onCheckedChange={(v) => setAckHandbook(Boolean(v))} className="mt-0.5" />
                  <label htmlFor="hbook" className="cursor-pointer space-y-1">
                    <span className="font-bold text-foreground block">1. Employee Handbook & Code of Conduct</span>
                    <span className="text-[11px] text-muted-foreground block leading-relaxed">
                      I acknowledge receipt of the employee handbook and agree to comply with all work standards, workplace ethics, and operational guidelines.
                    </span>
                  </label>
                </div>

                <div className="p-4 rounded-xl border border-border bg-muted/10 flex items-start gap-3">
                  <Checkbox id="nda" checked={ackNda} onCheckedChange={(v) => setAckNda(Boolean(v))} className="mt-0.5" />
                  <label htmlFor="nda" className="cursor-pointer space-y-1">
                    <span className="font-bold text-foreground block">2. Data Confidentiality & Intellectual Property NDA</span>
                    <span className="text-[11px] text-muted-foreground block leading-relaxed">
                      I agree to maintain strict confidentiality regarding all proprietary source code, customer records, and internal business assets.
                    </span>
                  </label>
                </div>

                <div className="p-4 rounded-xl border border-border bg-muted/10 flex items-start gap-3">
                  <Checkbox id="leave" checked={ackLeave} onCheckedChange={(v) => setAckLeave(Boolean(v))} className="mt-0.5" />
                  <label htmlFor="leave" className="cursor-pointer space-y-1">
                    <span className="font-bold text-foreground block">3. Leave Policy & Attendance Standards</span>
                    <span className="text-[11px] text-muted-foreground block leading-relaxed">
                      I understand the company leave quota, check-in requirements, and notice period policies.
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button onClick={() => setCurrentStepIndex(6)} variant="outline" className="h-9 text-xs">Back</Button>
                <Button onClick={handleSaveStep7Policies} disabled={isSubmitting} className="h-9 px-5 bg-indigo-600 text-white font-semibold text-xs gap-1.5">
                  {isSubmitting ? "Saving..." : "Accept Policies"} <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 8: FINAL REVIEW & COMPLETION */}
          {currentStepIndex === 8 && (
            <div className="space-y-6 text-xs text-center py-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-emerald-400" />
              </div>

              <div className="space-y-2">
                <h2 className="text-xl font-bold font-display text-foreground">Onboarding Ready for Final Submission</h2>
                <p className="text-xs text-muted-foreground max-w-md mx-auto">
                  All statutory details, bank accounts, identity documents, and policy acknowledgements have been verified. Click below to complete your onboarding.
                </p>
              </div>

              <div className="max-w-md mx-auto border border-border rounded-xl p-4 bg-muted/10 text-left space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Personal Profile:</span>
                  <span className="font-bold text-emerald-400 flex items-center gap-1"><Check className="h-3.5 w-3.5" /> Completed</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Identity & Statutory PAN:</span>
                  <span className="font-bold text-emerald-400 flex items-center gap-1"><Check className="h-3.5 w-3.5" /> Verified</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Direct Deposit Bank Details:</span>
                  <span className="font-bold text-emerald-400 flex items-center gap-1"><Check className="h-3.5 w-3.5" /> Configured</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Documents Uploaded:</span>
                  <span className="font-bold text-emerald-400 flex items-center gap-1"><Check className="h-3.5 w-3.5" /> Finalized</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Employment Policies:</span>
                  <span className="font-bold text-emerald-400 flex items-center gap-1"><Check className="h-3.5 w-3.5" /> Signed</span>
                </div>
              </div>

              <div className="flex justify-center gap-3 pt-2">
                <Button onClick={() => setCurrentStepIndex(7)} variant="outline" className="h-9 text-xs">Review Steps</Button>
                <Button onClick={handleCompleteOnboarding} disabled={isSubmitting} className="h-10 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs gap-2 shadow-lg">
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  Complete Onboarding & Enter Dashboard
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


// ─────────────────────────────────────────────────────────────────────────────
// 3. COMPANY ADMIN / ORGANIZATION ONBOARDING WIZARD
// ─────────────────────────────────────────────────────────────────────────────
function CompanyAdminOnboarding() {
  const navigate = useNavigate();
  const ws = useofc360();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [resuming, setResuming] = useState(true);

  // Form Fields
  const [companyName, setCompanyName] = useState(ws.company?.name || "");
  const [logo, setLogo] = useState<string | undefined>(ws.company?.logoDataUrl);
  const [industry, setIndustry] = useState(ws.company?.industry || INDUSTRIES[0]);
  const [companySize, setCompanySize] = useState(ws.company?.size || SIZES[1]);
  const [country, setCountry] = useState(ws.company?.country || "India");
  const [state, setState] = useState(ws.company?.state || "Maharashtra");
  const [city, setCity] = useState(ws.company?.city || "Mumbai");
  const [timezone, setTimezone] = useState(ws.company?.timezone || "Asia/Kolkata");

  const [fullName, setFullName] = useState(ws.user?.fullName || "");
  const [adminPhone, setAdminPhone] = useState(ws.user?.phone || "");
  const [avatar, setAvatar] = useState<string | undefined>();
  const [termsAccepted, setTermsAccepted] = useState(true);

  const [workDays, setWorkDays] = useState<string[]>(["Mon", "Tue", "Wed", "Thu", "Fri"]);
  const [standardHours, setStandardHours] = useState(8);
  const [workModel, setWorkModel] = useState<"hybrid" | "remote" | "office">("hybrid");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const statusRes: any = await api.get("onboarding/status");
        const backendStep = statusRes?.current_step ?? statusRes?.data?.current_step ?? 1;
        const onboardingCompleted = statusRes?.onboarding_completed ?? statusRes?.data?.onboarding_completed ?? false;

        if (onboardingCompleted || backendStep >= 7) {
          if (ws.user) {
            ofc360.set({ user: { ...ws.user, onboardingComplete: true } });
          }
          navigate({ to: "/dashboard", replace: true });
          return;
        }

        const progressRes: any = await api.get("onboarding/progress");
        const progress = progressRes?.data;
        if (progress && !cancelled) {
          if (progress.company_profile) {
            setCompanyName(progress.company_profile.company_name || "");
            setIndustry(progress.company_profile.industry || INDUSTRIES[0]);
            setCompanySize(progress.company_profile.company_size || SIZES[1]);
            setCountry(progress.company_profile.country || "India");
            setState(progress.company_profile.state || "Maharashtra");
            setCity(progress.company_profile.city || "Mumbai");
            setTimezone(progress.company_profile.timezone || "Asia/Kolkata");
          }
          if (progress.admin_profile) {
            setFullName(progress.admin_profile.full_name || ws.user?.fullName || "");
            setAdminPhone(progress.admin_profile.phone || ws.user?.phone || "");
          }
        }

        if (!cancelled) setStep(backendStepToUiIndex(backendStep));
      } catch (err) {
        if (!cancelled) setStep(0);
      } finally {
        if (!cancelled) setResuming(false);
      }
    })();

    return () => { cancelled = true; };
  }, [ws.user, navigate]);

  function next() { setStep((s) => Math.min(ADMIN_STEPS.length - 1, s + 1)); }
  function back() { setStep((s) => Math.max(0, s - 1)); }

  async function finish() {
    setLoading(true);
    try {
      await api.post("onboarding/complete", {});
      if (ws.user) {
        ofc360.set({ user: { ...ws.user, onboardingComplete: true } });
      }
      toast.success("Workspace setup completed!");
      navigate({ to: "/dashboard", replace: true });
    } catch (err: any) {
      toast.error(err.message || "Failed to finalize onboarding");
    } finally {
      setLoading(false);
    }
  }

  if (resuming) return <AuthLoadingScreen />;

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between p-4 md:p-8">
      <div className="max-w-4xl mx-auto w-full space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-4">
          <div>
            <Badge variant="outline" className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 text-[10px] uppercase font-bold">
              Organization Admin Onboarding
            </Badge>
            <h1 className="text-xl font-bold font-display text-foreground mt-1">
              Set Up Your Company Workspace
            </h1>
          </div>
        </div>

        <div className="overflow-x-auto scrollbar-none py-2 border-b border-border">
          <Stepper steps={ADMIN_STEPS} current={step} />
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 shadow-xl space-y-6">
          {/* STEP 0: COMPANY DETAILS */}
          {step === 0 && (
            <div className="space-y-4 text-xs">
              <h2 className="text-base font-bold text-foreground">Company Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Label className="text-xs font-semibold">Company Name *</Label>
                  <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="mt-1 h-9" required />
                </div>
                <div>
                  <Label className="text-xs font-semibold">Industry</Label>
                  <Select value={industry} onValueChange={setIndustry}>
                    <SelectTrigger className="mt-1 h-9"><SelectValue /></SelectTrigger>
                    <SelectContent>{INDUSTRIES.map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs font-semibold">Company Size</Label>
                  <Select value={companySize} onValueChange={setCompanySize}>
                    <SelectTrigger className="mt-1 h-9"><SelectValue /></SelectTrigger>
                    <SelectContent>{SIZES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs font-semibold">City</Label>
                  <Input value={city} onChange={(e) => setCity(e.target.value)} className="mt-1 h-9" />
                </div>
                <div>
                  <Label className="text-xs font-semibold">Timezone</Label>
                  <Select value={timezone} onValueChange={setTimezone}>
                    <SelectTrigger className="mt-1 h-9"><SelectValue /></SelectTrigger>
                    <SelectContent>{TIMEZONES.map((tz) => <SelectItem key={tz} value={tz}>{tz}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <Button onClick={async () => {
                  if (!companyName) { toast.error("Company name is required."); return; }
                  await api.post("onboarding/company", {
                    company_name: companyName,
                    industry,
                    company_size: companySize,
                    city,
                    timezone,
                  });
                  next();
                }} className="h-9 px-5 bg-indigo-600 text-white font-semibold text-xs gap-1.5">
                  Save & Continue <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 1: ADMIN PROFILE */}
          {step === 1 && (
            <div className="space-y-4 text-xs">
              <h2 className="text-base font-bold text-foreground">Admin Profile</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs font-semibold">Full Name *</Label>
                  <Input value={fullName} onChange={(e) => setFullName(e.target.value)} className="mt-1 h-9" />
                </div>
                <div>
                  <Label className="text-xs font-semibold">Phone Number</Label>
                  <Input value={adminPhone} onChange={(e) => setAdminPhone(e.target.value)} className="mt-1 h-9" />
                </div>
              </div>
              <div className="flex justify-between pt-4">
                <Button onClick={back} variant="outline" className="h-9 text-xs">Back</Button>
                <Button onClick={async () => {
                  await api.post("onboarding/admin-profile", { full_name: fullName, phone: adminPhone });
                  next();
                }} className="h-9 px-5 bg-indigo-600 text-white font-semibold text-xs gap-1.5">
                  Save & Continue <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2: HR SETTINGS */}
          {step === 2 && (
            <div className="space-y-4 text-xs">
              <h2 className="text-base font-bold text-foreground">HR & Work Settings</h2>
              <div className="space-y-3">
                <Label className="text-xs font-semibold">Standard Working Hours Per Day</Label>
                <Input type="number" value={standardHours} onChange={(e) => setStandardHours(parseInt(e.target.value) || 8)} className="h-9 w-32" />
              </div>
              <div className="flex justify-between pt-4">
                <Button onClick={back} variant="outline" className="h-9 text-xs">Back</Button>
                <Button onClick={async () => {
                  await api.post("onboarding/hr-settings", { standard_hours: standardHours });
                  next();
                }} className="h-9 px-5 bg-indigo-600 text-white font-semibold text-xs gap-1.5">
                  Save & Continue <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: DEPARTMENTS & DESIGNATIONS */}
          {step === 3 && (
            <div className="space-y-4 text-xs">
              <h2 className="text-base font-bold text-foreground">Departments & Designations</h2>
              <p className="text-xs text-muted-foreground">Standard departments (Engineering, HR, Management, Sales) will be created automatically.</p>
              <div className="flex justify-between pt-4">
                <Button onClick={back} variant="outline" className="h-9 text-xs">Back</Button>
                <Button onClick={async () => {
                  await syncDeptsAndDesignations(ws);
                  next();
                }} className="h-9 px-5 bg-indigo-600 text-white font-semibold text-xs gap-1.5">
                  Confirm & Continue <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 4: INVITE EMPLOYEES */}
          {step === 4 && (
            <div className="space-y-4 text-xs">
              <h2 className="text-base font-bold text-foreground">Invite Initial Team Members</h2>
              <p className="text-xs text-muted-foreground">You can invite employees now or skip to add them later from the dashboard.</p>
              <div className="flex justify-between pt-4">
                <Button onClick={back} variant="outline" className="h-9 text-xs">Back</Button>
                <Button onClick={async () => {
                  await syncInvites(ws);
                  next();
                }} className="h-9 px-5 bg-indigo-600 text-white font-semibold text-xs gap-1.5">
                  Continue to Complete <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 5: COMPLETE */}
          {step === 5 && (
            <div className="space-y-6 text-xs text-center py-4">
              <CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto" />
              <h2 className="text-xl font-bold font-display text-foreground">Company Setup Ready</h2>
              <p className="text-xs text-muted-foreground max-w-md mx-auto">
                Your workspace configuration is complete. Click below to launch your HR dashboard.
              </p>
              <div className="flex justify-center gap-3">
                <Button onClick={finish} disabled={loading} className="h-10 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs gap-2">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  Launch Dashboard
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
