import { useState } from "react";
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
} from "lucide-react";
import { PageHeader } from "@/components/ofc360/DashboardShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useofc360 } from "@/lib/ofc360-store";

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
}

const SAMPLE_PAYSLIPS: PayslipData[] = [
  {
    month: "May",
    year: "2026",
    payDate: "31 May 2026",
    basic: 35000,
    hra: 17500,
    specialAllowance: 12500,
    conveyance: 2000,
    pfDeduction: 1800,
    ptDeduction: 200,
    tdsDeduction: 0,
    netPay: 65000,
  },
  {
    month: "April",
    year: "2026",
    payDate: "30 Apr 2026",
    basic: 35000,
    hra: 17500,
    specialAllowance: 12500,
    conveyance: 2000,
    pfDeduction: 1800,
    ptDeduction: 200,
    tdsDeduction: 0,
    netPay: 65000,
  },
  {
    month: "March",
    year: "2026",
    payDate: "31 Mar 2026",
    basic: 35000,
    hra: 17500,
    specialAllowance: 12500,
    conveyance: 2000,
    pfDeduction: 1800,
    ptDeduction: 200,
    tdsDeduction: 0,
    netPay: 65000,
  },
  {
    month: "February",
    year: "2026",
    payDate: "28 Feb 2026",
    basic: 35000,
    hra: 17500,
    specialAllowance: 12500,
    conveyance: 2000,
    pfDeduction: 1800,
    ptDeduction: 200,
    tdsDeduction: 0,
    netPay: 65000,
  },
];

function fmtINR(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function EmployeePayslipsPage() {
  const ws = useofc360();
  const [selectedIdx, setSelectedIdx] = useState(0);
  const activeSlip = SAMPLE_PAYSLIPS[selectedIdx] || SAMPLE_PAYSLIPS[0];

  const grossEarnings = activeSlip.basic + activeSlip.hra + activeSlip.specialAllowance + activeSlip.conveyance;
  const totalDeductions = activeSlip.pfDeduction + activeSlip.ptDeduction + activeSlip.tdsDeduction;

  const employeeName = ws.user?.fullName || "Employee";
  const companyName = ws.company?.name || "ofc360 Technologies Pvt Ltd";
  const userRole = ws.user?.role || "Software Engineer";

  const handleDownloadPDF = () => {
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
          {SAMPLE_PAYSLIPS.map((slip, i) => (
            <button
              key={`${slip.month}-${slip.year}`}
              onClick={() => setSelectedIdx(i)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all cursor-pointer ${
                selectedIdx === i
                  ? "bg-indigo-600 text-white shadow-md"
                  : "border border-border bg-background/50 text-muted-foreground hover:text-foreground"
              }`}
            >
              <CalendarDays className="h-3.5 w-3.5" />
              <span>{slip.month} {slip.year}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={handleDownloadPDF} variant="outline" size="sm" className="h-9 gap-1.5 text-xs font-medium">
            <Printer className="h-3.5 w-3.5" /> Print / Save PDF
          </Button>
          <Button onClick={handleDownloadPDF} size="sm" className="h-9 gap-1.5 bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-700">
            <Download className="h-3.5 w-3.5" /> Download Payslip
          </Button>
        </div>
      </div>

      {/* Payslip Document Card */}
      <div className="rounded-3xl border border-border bg-card/80 p-6 shadow-xl backdrop-blur-2xl space-y-6">
        {/* Document Header */}
        <div className="flex flex-wrap items-start justify-between border-b border-border/80 pb-6 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Building2 className="h-6 w-6 text-indigo-500" />
              <h2 className="text-xl font-extrabold tracking-tight text-foreground">{companyName}</h2>
            </div>
            <p className="text-xs text-muted-foreground">Salary Slip for the month of <span className="font-bold text-foreground">{activeSlip.month} {activeSlip.year}</span></p>
          </div>

          <div className="text-right">
            <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600 font-bold px-3 py-1 text-xs">
              <CheckCircle2 className="mr-1 h-3.5 w-3.5 text-emerald-500" /> PAID ON {activeSlip.payDate}
            </Badge>
            <p className="mt-1.5 text-xs text-muted-foreground">Payment Method: <span className="font-mono font-medium text-foreground">Direct Bank Transfer</span></p>
          </div>
        </div>

        {/* Employee Meta Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 rounded-2xl border border-border/60 bg-background/40 p-4 text-xs">
          <div>
            <span className="text-[11px] text-muted-foreground uppercase font-semibold block">Employee Name</span>
            <span className="font-bold text-foreground">{employeeName}</span>
          </div>
          <div>
            <span className="text-[11px] text-muted-foreground uppercase font-semibold block">Designation</span>
            <span className="font-semibold text-foreground capitalize">{userRole}</span>
          </div>
          <div>
            <span className="text-[11px] text-muted-foreground uppercase font-semibold block">Bank Account</span>
            <span className="font-mono font-semibold text-foreground">HDFC Bank •••• 4892</span>
          </div>
          <div>
            <span className="text-[11px] text-muted-foreground uppercase font-semibold block">Tax Regime</span>
            <span className="font-bold text-indigo-400">NEW REGIME (FY 2026-27)</span>
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
                <span className="font-mono font-semibold text-foreground">{fmtINR(activeSlip.basic)}</span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-muted-foreground">House Rent Allowance (HRA)</span>
                <span className="font-mono font-semibold text-foreground">{fmtINR(activeSlip.hra)}</span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-muted-foreground">Special Allowance</span>
                <span className="font-mono font-semibold text-foreground">{fmtINR(activeSlip.specialAllowance)}</span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-muted-foreground">Conveyance Allowance</span>
                <span className="font-mono font-semibold text-foreground">{fmtINR(activeSlip.conveyance)}</span>
              </div>
              <div className="pt-3 flex justify-between font-bold text-sm text-foreground">
                <span>Gross Earnings</span>
                <span className="font-mono text-emerald-500">{fmtINR(grossEarnings)}</span>
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
                <span className="font-mono font-semibold text-foreground">{fmtINR(activeSlip.pfDeduction)}</span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-muted-foreground">Professional Tax (PT)</span>
                <span className="font-mono font-semibold text-foreground">{fmtINR(activeSlip.ptDeduction)}</span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-muted-foreground">Income Tax (TDS)</span>
                <span className="font-mono font-semibold text-foreground">{fmtINR(activeSlip.tdsDeduction)}</span>
              </div>
              <div className="pt-3 flex justify-between font-bold text-sm text-foreground">
                <span>Total Deductions</span>
                <span className="font-mono text-rose-500">{fmtINR(totalDeductions)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Net Take-Home Highlight Card */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-indigo-900/40 via-purple-900/40 to-emerald-900/40 border border-indigo-500/30 p-5">
          <div>
            <span className="text-xs uppercase font-bold text-indigo-300 tracking-wider block">Net Take-Home Salary</span>
            <span className="text-2xl font-black text-foreground font-mono">{fmtINR(activeSlip.netPay)}</span>
            <p className="text-[11px] text-muted-foreground mt-0.5">Rupees Sixty Five Thousand Only</p>
          </div>
          <Button onClick={handleDownloadPDF} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 h-10 gap-2 text-xs">
            <Download className="h-4 w-4" /> Download PDF Slip
          </Button>
        </div>
      </div>

      {/* Tax & Form 16 Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-border bg-card/60 p-4 space-y-2 backdrop-blur-xl">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs">
            <Percent className="h-4 w-4" /> Tax Regime & Exemptions
          </div>
          <p className="text-xs text-muted-foreground">Active Regime: <strong className="text-foreground">New Tax Regime</strong></p>
          <Button variant="outline" size="sm" className="w-full text-xs h-8 mt-2">View Tax Computation</Button>
        </div>

        <div className="rounded-2xl border border-border bg-card/60 p-4 space-y-2 backdrop-blur-xl">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
            <FileCheck className="h-4 w-4" /> Form 16 Tax Certificate
          </div>
          <p className="text-xs text-muted-foreground">Available for FY 2025-26 & FY 2024-25</p>
          <Button variant="outline" size="sm" className="w-full text-xs h-8 mt-2" onClick={() => toast.info("Form 16 PDF requested")}>Download Form 16</Button>
        </div>

        <div className="rounded-2xl border border-border bg-card/60 p-4 space-y-2 backdrop-blur-xl">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
            <Coins className="h-4 w-4" /> Provident Fund (PF) & UAN
          </div>
          <p className="text-xs text-muted-foreground">UAN Status: <strong className="text-emerald-500">Verified & Active</strong></p>
          <Button variant="outline" size="sm" className="w-full text-xs h-8 mt-2" onClick={() => toast.info("Redirecting to EPFO portal")}>EPFO Passbook Portal</Button>
        </div>
      </div>
    </div>
  );
}
