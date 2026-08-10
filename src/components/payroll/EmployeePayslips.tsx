import { useEffect, useState } from "react";
import {
  FileText,
  Download,
  Printer,
  Building2,
  CheckCircle2,
  CalendarDays,
  Percent,
  FileCheck,
  Coins,
  Loader2,
} from "lucide-react";
import { PageHeader } from "@/components/ofc360/DashboardShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useofc360 } from "@/lib/ofc360-store";
import { api } from "@/api";

interface PayslipData {
  month: string;
  year: string;
  payDate: string;
  basic: number;
  hra: number;
  specialAllowance: number;
  conveyance: number;
  pfDeduction: number;
  ptDeduction: number;
  tdsDeduction: number;
  netPay: number;
  bankAccountMasked?: string;
  taxRegime?: string;
}

interface MonthItem {
  month: string;
  year: string;
}

export function numberToIndianWords(amount: number): string {
  if (isNaN(amount) || amount <= 0) return "Rupees Zero Only";
  const num = Math.floor(amount);
  if (num === 0) return "Rupees Zero Only";

  const ones = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  function convertGroup(n: number): string {
    let str = "";
    if (n >= 100) {
      str += ones[Math.floor(n / 100)] + " Hundred ";
      n %= 100;
    }
    if (n >= 20) {
      str += tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "");
    } else if (n > 0) {
      str += ones[n];
    }
    return str.trim();
  }

  let crore = Math.floor(num / 10000000);
  let rem = num % 10000000;

  let lakh = Math.floor(rem / 100000);
  rem %= 100000;

  let thousand = Math.floor(rem / 1000);
  rem %= 1000;

  let result = "";

  if (crore > 0) {
    result += convertGroup(crore) + " Crore ";
  }
  if (lakh > 0) {
    result += convertGroup(lakh) + " Lakh ";
  }
  if (thousand > 0) {
    result += convertGroup(thousand) + " Thousand ";
  }
  if (rem > 0) {
    result += convertGroup(rem);
  }

  const trimmed = result.trim();
  return trimmed ? `Rupees ${trimmed} Only` : "Rupees Zero Only";
}

function fmtINR(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function parseMonthResponse(data: any): MonthItem[] {
  const rawList = Array.isArray(data)
    ? data
    : Array.isArray(data?.data)
    ? data.data
    : Array.isArray(data?.months)
    ? data.months
    : [];

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return rawList
    .map((item: any): MonthItem | null => {
      if (typeof item === "string") {
        const parts = item.trim().split(/\s+/);
        if (parts.length >= 2) {
          return { month: parts[0], year: parts[1] };
        }
        return null;
      }
      if (item && typeof item === "object") {
        let m = item.month ?? item.monthName ?? item.name;
        let y = item.year;
        if (typeof m === "number" && m >= 1 && m <= 12) {
          m = monthNames[m - 1];
        }
        if (m && y) {
          return { month: String(m), year: String(y) };
        }
      }
      return null;
    })
    .filter((item: MonthItem | null): item is MonthItem => item !== null);
}

export function EmployeePayslipsPage() {
  const ws = useofc360();
  const [months, setMonths] = useState<MonthItem[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<MonthItem | null>(null);
  const [activeSlip, setActiveSlip] = useState<PayslipData | null>(null);
  const [isLoadingMonths, setIsLoadingMonths] = useState(true);
  const [isLoadingSlip, setIsLoadingSlip] = useState(false);

  // Load available months for logged-in user
  useEffect(() => {
    let isMounted = true;
    async function fetchMonths() {
      setIsLoadingMonths(true);
      try {
        const res = await api.get<any>("payroll/payslips/me/months");
        const formattedMonths = parseMonthResponse(res);

        if (isMounted) {
          setMonths(formattedMonths);
          if (formattedMonths.length > 0) {
            setSelectedMonth(formattedMonths[0]);
          } else {
            setSelectedMonth(null);
            setActiveSlip(null);
          }
        }
      } catch (err: any) {
        if (isMounted) {
          setMonths([]);
          setSelectedMonth(null);
          setActiveSlip(null);
          toast.error(err?.message || "Failed to load payslip data.");
        }
      } finally {
        if (isMounted) {
          setIsLoadingMonths(false);
        }
      }
    }

    fetchMonths();
    return () => {
      isMounted = false;
    };
  }, [ws.user?.id]);

  // Load payslip for selected month
  useEffect(() => {
    if (!selectedMonth) {
      setActiveSlip(null);
      return;
    }
    const currentMonth = selectedMonth;

    let isMounted = true;
    async function fetchPayslip() {
      setIsLoadingSlip(true);
      try {
        const res = await api.get<any>(
          `payroll/payslips/me?month=${encodeURIComponent(currentMonth.month)}&year=${encodeURIComponent(currentMonth.year)}`
        );
        const rawData = res?.data ?? res;
        if (isMounted) {
          if (rawData && typeof rawData === "object" && Object.keys(rawData).length > 0) {
            setActiveSlip({
              month: String(rawData.month || currentMonth.month),
              year: String(rawData.year || currentMonth.year),
              payDate: rawData.payDate || rawData.pay_date || rawData.paidAt || rawData.paid_on || "",
              basic: Number(rawData.basic ?? rawData.basicSalary ?? rawData.basic_salary ?? 0),
              hra: Number(rawData.hra ?? rawData.houseRentAllowance ?? rawData.house_rent_allowance ?? 0),
              specialAllowance: Number(rawData.specialAllowance ?? rawData.special_allowance ?? 0),
              conveyance: Number(rawData.conveyance ?? rawData.conveyanceAllowance ?? rawData.conveyance_allowance ?? 0),
              pfDeduction: Number(rawData.pfDeduction ?? rawData.pf_deduction ?? rawData.pf ?? 0),
              ptDeduction: Number(rawData.ptDeduction ?? rawData.pt_deduction ?? rawData.pt ?? 0),
              tdsDeduction: Number(rawData.tdsDeduction ?? rawData.tds_deduction ?? rawData.tds ?? rawData.taxDeduction ?? 0),
              netPay: Number(rawData.netPay ?? rawData.net_pay ?? rawData.netSalary ?? rawData.net_salary ?? 0),
              bankAccountMasked: rawData.bankAccountMasked || rawData.bank_account_masked || rawData.bankAccount || rawData.bank_account || "",
              taxRegime: rawData.taxRegime || rawData.tax_regime || "",
            });
          } else {
            setActiveSlip(null);
          }
        }
      } catch (err: any) {
        if (isMounted) {
          setActiveSlip(null);
          toast.error(err?.message || "Failed to load payslip data.");
        }
      } finally {
        if (isMounted) {
          setIsLoadingSlip(false);
        }
      }
    }

    fetchPayslip();
    return () => {
      isMounted = false;
    };
  }, [selectedMonth, ws.user?.id]);

  const grossEarnings = activeSlip
    ? activeSlip.basic + activeSlip.hra + activeSlip.specialAllowance + activeSlip.conveyance
    : 0;
  const totalDeductions = activeSlip
    ? activeSlip.pfDeduction + activeSlip.ptDeduction + activeSlip.tdsDeduction
    : 0;

  const employeeName = ws.user?.fullName || "Employee";
  const companyName = ws.company?.name || "ofc360 Technologies Pvt Ltd";
  const userRole = ws.user?.role || "—";
  const bankAccount = activeSlip?.bankAccountMasked || "—";
  const taxRegime = activeSlip?.taxRegime || "—";

  const handleDownloadPDF = () => {
    if (!activeSlip) return;
    toast.success(`Downloading Payslip for ${activeSlip.month} ${activeSlip.year}...`);
    window.print();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Salary & Payslips"
        description="View monthly salary statements, statutory breakdowns, tax declarations, and Form 16."
      />

      {/* Month Selector Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card/60 p-3 backdrop-blur-xl">
        <div className="flex items-center gap-2 overflow-x-auto">
          {isLoadingMonths ? (
            <div className="flex items-center gap-2 text-xs text-muted-foreground px-2 py-1">
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Loading periods...
            </div>
          ) : months.length === 0 ? (
            <div className="text-xs text-muted-foreground px-2 py-1">No periods available</div>
          ) : (
            months.map((m) => {
              const isSelected = selectedMonth?.month === m.month && selectedMonth?.year === m.year;
              return (
                <button
                  key={`${m.month}-${m.year}`}
                  onClick={() => setSelectedMonth(m)}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? "bg-indigo-600 text-white shadow-md"
                      : "border border-border bg-background/50 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <CalendarDays className="h-3.5 w-3.5" />
                  <span>
                    {m.month} {m.year}
                  </span>
                </button>
              );
            })
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={handleDownloadPDF}
            variant="outline"
            size="sm"
            disabled={!activeSlip}
            className="h-9 gap-1.5 text-xs font-medium"
          >
            <Printer className="h-3.5 w-3.5" /> Print / Save PDF
          </Button>
          <Button
            onClick={handleDownloadPDF}
            size="sm"
            disabled={!activeSlip}
            className="h-9 gap-1.5 bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-700"
          >
            <Download className="h-3.5 w-3.5" /> Download Payslip
          </Button>
        </div>
      </div>

      {/* Payslip Document Card / Loading Skeleton / Empty State */}
      {isLoadingSlip || isLoadingMonths ? (
        <div className="rounded-3xl border border-border bg-card/80 p-6 shadow-xl backdrop-blur-2xl animate-pulse space-y-6">
          <div className="flex justify-between items-start border-b border-border/80 pb-6 gap-4">
            <div className="space-y-2">
              <div className="h-6 w-48 bg-muted rounded-md" />
              <div className="h-4 w-32 bg-muted rounded-md" />
            </div>
            <div className="h-8 w-28 bg-muted rounded-md" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-background/40">
            <div className="h-8 bg-muted rounded-md" />
            <div className="h-8 bg-muted rounded-md" />
            <div className="h-8 bg-muted rounded-md" />
            <div className="h-8 bg-muted rounded-md" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-44 bg-muted/40 rounded-2xl" />
            <div className="h-44 bg-muted/40 rounded-2xl" />
          </div>
          <div className="h-20 bg-muted/40 rounded-2xl" />
        </div>
      ) : !activeSlip ? (
        <div className="rounded-3xl border border-border bg-card/80 p-12 shadow-xl backdrop-blur-2xl text-center space-y-3">
          <FileText className="h-10 w-10 text-muted-foreground/40 mx-auto" />
          <p className="text-sm font-medium text-muted-foreground">
            No payslip available for this period yet
          </p>
        </div>
      ) : (
        <div className="rounded-3xl border border-border bg-card/80 p-6 shadow-xl backdrop-blur-2xl space-y-6">
          {/* Document Header */}
          <div className="flex flex-wrap items-start justify-between border-b border-border/80 pb-6 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Building2 className="h-6 w-6 text-indigo-500" />
                <h2 className="text-xl font-extrabold tracking-tight text-foreground">
                  {companyName}
                </h2>
              </div>
              <p className="text-xs text-muted-foreground">
                Salary Slip for the month of{" "}
                <span className="font-bold text-foreground">
                  {activeSlip.month} {activeSlip.year}
                </span>
              </p>
            </div>

            <div className="text-right">
              <Badge
                variant="outline"
                className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600 font-bold px-3 py-1 text-xs"
              >
                <CheckCircle2 className="mr-1 h-3.5 w-3.5 text-emerald-500" />{" "}
                {activeSlip.payDate ? `PAID ON ${activeSlip.payDate}` : "PAID"}
              </Badge>
              <p className="mt-1.5 text-xs text-muted-foreground">
                Payment Method:{" "}
                <span className="font-mono font-medium text-foreground">
                  Direct Bank Transfer
                </span>
              </p>
            </div>
          </div>

          {/* Employee Meta Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 rounded-2xl border border-border/60 bg-background/40 p-4 text-xs">
            <div>
              <span className="text-[11px] text-muted-foreground uppercase font-semibold block">
                Employee Name
              </span>
              <span className="font-bold text-foreground">{employeeName}</span>
            </div>
            <div>
              <span className="text-[11px] text-muted-foreground uppercase font-semibold block">
                Designation
              </span>
              <span className="font-semibold text-foreground capitalize">
                {userRole}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-muted-foreground uppercase font-semibold block">
                Bank Account
              </span>
              <span className="font-mono font-semibold text-foreground">
                {bankAccount}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-muted-foreground uppercase font-semibold block">
                Tax Regime
              </span>
              <span className="font-bold text-indigo-400">{taxRegime}</span>
            </div>
          </div>

          {/* Earnings & Deductions Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Earnings */}
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-3">
              <h3 className="font-bold text-emerald-500 text-sm flex items-center justify-between">
                <span>Earnings</span>
                <span>Amount</span>
              </h3>
              <div className="space-y-2 text-xs divide-y divide-border/40">
                <div className="pt-2 flex justify-between">
                  <span className="text-muted-foreground">Basic Salary</span>
                  <span className="font-mono font-semibold text-foreground">
                    {fmtINR(activeSlip.basic)}
                  </span>
                </div>
                <div className="pt-2 flex justify-between">
                  <span className="text-muted-foreground">House Rent Allowance (HRA)</span>
                  <span className="font-mono font-semibold text-foreground">
                    {fmtINR(activeSlip.hra)}
                  </span>
                </div>
                <div className="pt-2 flex justify-between">
                  <span className="text-muted-foreground">Special Allowance</span>
                  <span className="font-mono font-semibold text-foreground">
                    {fmtINR(activeSlip.specialAllowance)}
                  </span>
                </div>
                <div className="pt-2 flex justify-between">
                  <span className="text-muted-foreground">Conveyance Allowance</span>
                  <span className="font-mono font-semibold text-foreground">
                    {fmtINR(activeSlip.conveyance)}
                  </span>
                </div>
                <div className="pt-3 flex justify-between font-bold text-sm text-foreground">
                  <span>Gross Earnings</span>
                  <span className="font-mono text-emerald-500">
                    {fmtINR(grossEarnings)}
                  </span>
                </div>
              </div>
            </div>

            {/* Deductions */}
            <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-4 space-y-3">
              <h3 className="font-bold text-rose-500 text-sm flex items-center justify-between">
                <span>Statutory Deductions</span>
                <span>Amount</span>
              </h3>
              <div className="space-y-2 text-xs divide-y divide-border/40">
                <div className="pt-2 flex justify-between">
                  <span className="text-muted-foreground">Provident Fund (Employee PF)</span>
                  <span className="font-mono font-semibold text-foreground">
                    {fmtINR(activeSlip.pfDeduction)}
                  </span>
                </div>
                <div className="pt-2 flex justify-between">
                  <span className="text-muted-foreground">Professional Tax (PT)</span>
                  <span className="font-mono font-semibold text-foreground">
                    {fmtINR(activeSlip.ptDeduction)}
                  </span>
                </div>
                <div className="pt-2 flex justify-between">
                  <span className="text-muted-foreground">Income Tax (TDS)</span>
                  <span className="font-mono font-semibold text-foreground">
                    {fmtINR(activeSlip.tdsDeduction)}
                  </span>
                </div>
                <div className="pt-3 flex justify-between font-bold text-sm text-foreground">
                  <span>Total Deductions</span>
                  <span className="font-mono text-rose-500">
                    {fmtINR(totalDeductions)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Net Take-Home Highlight Card */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-indigo-900/40 via-purple-900/40 to-emerald-900/40 border border-indigo-500/30 p-5">
            <div>
              <span className="text-xs uppercase font-bold text-indigo-300 tracking-wider block">
                Net Take-Home Salary
              </span>
              <span className="text-2xl font-black text-foreground font-mono">
                {fmtINR(activeSlip.netPay)}
              </span>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {numberToIndianWords(activeSlip.netPay)}
              </p>
            </div>
            <Button
              onClick={handleDownloadPDF}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 h-10 gap-2 text-xs"
            >
              <Download className="h-4 w-4" /> Download PDF Slip
            </Button>
          </div>
        </div>
      )}

      {/* Tax & Form 16 Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-border bg-card/60 p-4 space-y-2 backdrop-blur-xl">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs">
            <Percent className="h-4 w-4" /> Tax Regime & Exemptions
          </div>
          <p className="text-xs text-muted-foreground">
            Active Regime: <strong className="text-foreground">{taxRegime}</strong>
          </p>
          <Button variant="outline" size="sm" className="w-full text-xs h-8 mt-2">
            View Tax Computation
          </Button>
        </div>

        <div className="rounded-2xl border border-border bg-card/60 p-4 space-y-2 backdrop-blur-xl">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
            <FileCheck className="h-4 w-4" /> Form 16 Tax Certificate
          </div>
          <p className="text-xs text-muted-foreground">Available for FY 2025-26 & FY 2024-25</p>
          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs h-8 mt-2"
            onClick={() => toast.info("Form 16 PDF requested")}
          >
            Download Form 16
          </Button>
        </div>

        <div className="rounded-2xl border border-border bg-card/60 p-4 space-y-2 backdrop-blur-xl">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
            <Coins className="h-4 w-4" /> Provident Fund (PF) & UAN
          </div>
          <p className="text-xs text-muted-foreground">
            UAN Status: <strong className="text-emerald-500">Verified & Active</strong>
          </p>
          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs h-8 mt-2"
            onClick={() => toast.info("Redirecting to EPFO portal")}
          >
            EPFO Passbook Portal
          </Button>
        </div>
      </div>
    </div>
  );
}

