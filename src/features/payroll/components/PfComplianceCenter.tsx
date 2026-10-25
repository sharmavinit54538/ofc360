/**
 * @file PfComplianceCenter.tsx
 * @description Comprehensive Indian EPFO PF ECR v2.0 & Challan Statutory Compliance Center.
 * Implements 12-digit UAN validation, 11-column #|~|# delimiter ECR return generation,
 * TRRN payment recording & receipt upload, and a 12-Month Statutory Filing Calendar
 * with real-time Section 7Q (12% p.a.) interest and Section 14B damages warnings.
 */

import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Copy,
  Download,
  ExternalLink,
  FileSpreadsheet,
  FileText,
  RefreshCw,
  ShieldAlert,
  Upload,
  UserCheck,
  X,
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/Card';
import { Input } from '@/shared/ui/Input';
import { Label } from '@/shared/ui/Label';
import { Switch } from '@/shared/ui/Switch';
import { useToast } from '@/shared/ui/Toast';
import {
  useGetPayrollRunsQuery,
  useGetPfEcrQuery,
  useGetStatutoryFilingCalendarQuery,
  useGetUanValidationAuditQuery,
  useRecordChallanMutation,
  useUpdateEmployeePfSettingsMutation,
  useUploadChallanReceiptMutation,
} from '../api/payrollApi';
import type {
  ChallanRecordPayload,
  StatutoryFilingCalendarItem,
  UanValidationItem,
} from '../types/payroll.types';

export const PfComplianceCenter: React.FC = () => {
  const toast = useToast();
  const currentYear = new Date().getFullYear();

  // Queries
  const { data: runs = [] } = useGetPayrollRunsQuery({});
  const { data: calendarItems = [], refetch: refetchCalendar } =
    useGetStatutoryFilingCalendarQuery({ year: currentYear });
  const { data: uanAudit, isLoading: isLoadingAudit, refetch: refetchAudit } =
    useGetUanValidationAuditQuery();

  // Selected Payroll Period for ECR
  const [selectedPeriodId, setSelectedPeriodId] = useState<string>('');

  // Fallback to first available run if none selected
  const activePeriodId = useMemo(() => {
    if (selectedPeriodId) return selectedPeriodId;
    if (runs.length > 0) return runs[0].period_id || runs[0].id;
    return '';
  }, [selectedPeriodId, runs]);

  const {
    data: ecrData,
    isLoading: isLoadingEcr,
    refetch: refetchEcr,
  } = useGetPfEcrQuery(
    { periodId: activePeriodId, format: 'json' },
    { skip: !activePeriodId }
  );

  // Mutations
  const [recordChallan, { isLoading: isRecordingChallan }] = useRecordChallanMutation();
  const [uploadReceipt, { isLoading: isUploadingReceipt }] = useUploadChallanReceiptMutation();
  const [updateEmployeePf, { isLoading: isUpdatingPf }] = useUpdateEmployeePfSettingsMutation();

  // Local View States
  const [activeViewTab, setActiveViewTab] = useState<'table' | 'raw' | 'calendar' | 'kyc'>('table');
  const [searchEmployeeQuery, setSearchEmployeeQuery] = useState('');

  // Modals
  const [isChallanModalOpen, setIsChallanModalOpen] = useState(false);
  const [selectedCalendarMonth, setSelectedCalendarMonth] = useState<StatutoryFilingCalendarItem | null>(null);
  const [isKycModalOpen, setIsKycModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<UanValidationItem | null>(null);

  // Form State for Challan
  const [challanForm, setChallanForm] = useState<ChallanRecordPayload>({
    periodId: '',
    trrnNumber: '',
    challanGenerationDate: new Date().toISOString().split('T')[0],
    paymentDate: new Date().toISOString().split('T')[0],
    utrNumber: '',
    totalAmount: 0,
  });
  const [selectedChallanFile, setSelectedChallanFile] = useState<File | null>(null);
  const [selectedReceiptFile, setSelectedReceiptFile] = useState<File | null>(null);

  // KYC Edit Form
  const [kycUan, setKycUan] = useState('');
  const [kycOptIn, setKycOptIn] = useState(true);
  const [kycIntl, setKycIntl] = useState(false);
  const [kycCeiling, setKycCeiling] = useState(true);

  // Handle Download ECR .txt File
  const handleDownloadEcrTxt = () => {
    if (!ecrData?.ecr_text) {
      toast.warning('No ECR text generated for this period.', 'Download Failed');
      return;
    }
    const blob = new Blob([ecrData.ecr_text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', ecrData.filename || `EPFO_ECR_${currentYear}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(`Downloaded ${ecrData.filename} successfully. Ready for EPFO Unified Portal upload.`, 'ECR Exported');
  };

  // Copy ECR Raw Text
  const handleCopyRawEcr = () => {
    if (!ecrData?.ecr_text) return;
    navigator.clipboard.writeText(ecrData.ecr_text);
    toast.success('Official #|~|# separated ECR format copied to clipboard.', 'Copied');
  };

  // Open Challan Recording Modal
  const handleOpenChallanModal = (monthItem?: StatutoryFilingCalendarItem) => {
    if (monthItem) {
      setSelectedCalendarMonth(monthItem);
      // Find matching payroll run for this month
      const matchRun = runs.find((r) => r.period_month === monthItem.month && r.period_year === monthItem.year);
      setChallanForm({
        periodId: matchRun?.period_id || matchRun?.id || activePeriodId,
        trrnNumber: monthItem.trrn_number || '',
        challanGenerationDate: new Date().toISOString().split('T')[0],
        paymentDate: monthItem.payment_date || new Date().toISOString().split('T')[0],
        utrNumber: monthItem.utr_number || '',
        totalAmount: monthItem.total_amount || ecrData?.total_pf_liability || 0,
      });
    } else {
      setChallanForm({
        periodId: activePeriodId,
        trrnNumber: '',
        challanGenerationDate: new Date().toISOString().split('T')[0],
        paymentDate: new Date().toISOString().split('T')[0],
        utrNumber: '',
        totalAmount: ecrData?.total_pf_liability || 0,
      });
    }
    setIsChallanModalOpen(true);
  };

  // Submit Challan Record
  const handleSubmitChallan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!challanForm.periodId) {
      toast.error('Select a valid payroll period first.', 'Validation Error');
      return;
    }
    if (!challanForm.trrnNumber || !challanForm.trrnNumber.trim()) {
      toast.error('TRRN (Temporary Return Reference Number) is mandatory.', 'Validation Error');
      return;
    }

    try {
      await recordChallan(challanForm).unwrap();

      // Upload Challan PDF if selected
      if (selectedChallanFile) {
        await uploadReceipt({
          periodId: challanForm.periodId,
          fileType: 'CHALLAN',
          file: selectedChallanFile,
        }).unwrap();
      }

      // Upload Payment Receipt PDF if selected
      if (selectedReceiptFile) {
        await uploadReceipt({
          periodId: challanForm.periodId,
          fileType: 'RECEIPT',
          file: selectedReceiptFile,
        }).unwrap();
      }

      toast.success(
        `Challan TRRN #${challanForm.trrnNumber} and payment details successfully recorded!`,
        'Filing Synchronized'
      );
      setIsChallanModalOpen(false);
      refetchCalendar();
      refetchEcr();
    } catch (err: any) {
      toast.error(err?.data?.detail || err?.message || 'Failed to record EPFO Challan.', 'Filing Error');
    }
  };

  // Open KYC Edit
  const handleEditEmployeeKyc = (emp: UanValidationItem) => {
    setEditingEmployee(emp);
    setKycUan(emp.uan_number || '');
    setKycOptIn(emp.is_pf_eligible);
    setKycIntl(emp.is_international_worker);
    setKycCeiling(emp.pf_wage_ceiling_applicable);
    setIsKycModalOpen(true);
  };

  // Save KYC Edit
  const handleSaveKyc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEmployee) return;

    if (kycUan.trim() && !/^\d{12}$/.test(kycUan.trim())) {
      toast.error('EPFO UAN must be exactly 12 numeric digits (or left blank).', 'Validation Error');
      return;
    }

    try {
      await updateEmployeePf({
        employeeId: editingEmployee.employee_id,
        data: {
          uanNumber: kycUan.trim() || null,
          isPfEligible: kycOptIn,
          isInternationalWorker: kycIntl,
          pfWageCeilingApplicable: kycCeiling,
        },
      }).unwrap();

      toast.success(`Updated PF & UAN settings for ${editingEmployee.name}`, 'KYC Verified');
      setIsKycModalOpen(false);
      refetchAudit();
      refetchEcr();
    } catch (err: any) {
      toast.error(err?.data?.detail || err?.message || 'Failed to update employee KYC.', 'Update Error');
    }
  };

  // Filtered Employees for KYC
  const filteredAuditEmployees = useMemo(() => {
    if (!uanAudit?.employees) return [];
    if (!searchEmployeeQuery.trim()) return uanAudit.employees;
    const q = searchEmployeeQuery.toLowerCase();
    return uanAudit.employees.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.employee_code.toLowerCase().includes(q) ||
        (e.uan_number && e.uan_number.includes(q))
    );
  }, [uanAudit, searchEmployeeQuery]);

  return (
    <div className="space-y-6">
      {/* ── Top Header & Context Bar ────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl relative overflow-hidden border border-indigo-900/40">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-200 text-xs font-semibold backdrop-blur border border-indigo-400/30">
            <Building2 className="w-3.5 h-3.5" />
            <span>EPFO Unified Compliance Engine · ECR v2.0 Return Architecture</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            EPFO PF ECR & Challan Compliance
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl">
            Automated monthly Electronic Challan cum Return (ECR) generation with exact 11-column{' '}
            <code className="text-xs bg-slate-800 px-1.5 py-0.5 rounded text-indigo-300">#|~|#</code> separation,
            TRRN reconciliation, statutory 15th due date tracking, and Section 7Q/14B interest protection.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="relative z-10 flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadEcrTxt}
            disabled={!ecrData || isLoadingEcr}
            className="bg-white/10 hover:bg-white/20 text-white border-white/20 shadow-sm flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-indigo-300" />
            <span>Download ECR .txt</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => handleOpenChallanModal()}
            className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            <span>Record Challan / TRRN</span>
          </Button>
        </div>
      </div>

      {/* ── UAN & KYC Alert Banner (When issues found) ──────────────────────── */}
      {uanAudit && (uanAudit.invalid_uan_count > 0 || uanAudit.missing_uan_count > 0) && (
        <div className="rounded-2xl border border-amber-300/80 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-700/60 p-4 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-amber-900 dark:text-amber-200 flex items-center gap-2">
                <span>Action Required: UAN / KYC Validation Flags Detected</span>
                <Badge variant="warning" size="sm">
                  {uanAudit.invalid_uan_count + uanAudit.missing_uan_count} Alerts
                </Badge>
              </h3>
              <p className="text-xs text-amber-800/90 dark:text-amber-300/80 mt-0.5">
                {uanAudit.missing_uan_count > 0 && `${uanAudit.missing_uan_count} active employees missing 12-digit UAN.`}{' '}
                {uanAudit.invalid_uan_count > 0 && `${uanAudit.invalid_uan_count} invalid UAN format entries.`} EPFO portal will reject ECR uploads containing blank or malformed UANs.
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setActiveViewTab('kyc')}
            className="border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-900/40 shrink-0 font-medium"
          >
            <UserCheck className="w-4 h-4 mr-1.5" />
            Audit & Fix UANs
          </Button>
        </div>
      )}

      {/* ── Top Metric Cards Breakdown ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total PF Remittance */}
        <Card className="border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#171717] shadow-sm">
          <CardContent className="p-4 space-y-1">
            <span className="text-xs font-medium text-gray-500 dark:text-zinc-400 block">
              Total PF Liability
            </span>
            <div className="text-xl font-bold text-gray-900 dark:text-white">
              ₹{(ecrData?.total_pf_liability || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
            <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium block">
              {ecrData?.record_count || 0} Contributing Members
            </span>
          </CardContent>
        </Card>

        {/* Employee 12% Share */}
        <Card className="border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#171717] shadow-sm">
          <CardContent className="p-4 space-y-1">
            <span className="text-xs font-medium text-gray-500 dark:text-zinc-400 block">
              Employee Share (12%)
            </span>
            <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
              ₹{(ecrData?.total_ee_share || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
            <span className="text-[11px] text-gray-500 dark:text-zinc-400 block">
              Account 1 (Deducted from wages)
            </span>
          </CardContent>
        </Card>

        {/* Employer EPS 8.33% */}
        <Card className="border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#171717] shadow-sm">
          <CardContent className="p-4 space-y-1">
            <span className="text-xs font-medium text-gray-500 dark:text-zinc-400 block">
              Employer EPS (8.33%)
            </span>
            <div className="text-xl font-bold text-purple-600 dark:text-purple-400">
              ₹{(ecrData?.total_eps_share || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
            <span className="text-[11px] text-gray-500 dark:text-zinc-400 block">
              Account 10 (Capped at ₹1,250)
            </span>
          </CardContent>
        </Card>

        {/* Employer EPF Diff (3.67%) */}
        <Card className="border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#171717] shadow-sm">
          <CardContent className="p-4 space-y-1">
            <span className="text-xs font-medium text-gray-500 dark:text-zinc-400 block">
              Employer EPF Diff (3.67%)
            </span>
            <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
              ₹{(ecrData?.total_er_diff_share || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
            <span className="text-[11px] text-gray-500 dark:text-zinc-400 block">
              Account 1 (Remitted to PF)
            </span>
          </CardContent>
        </Card>

        {/* EDLI & Admin Charges */}
        <Card className="border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#171717] shadow-sm">
          <CardContent className="p-4 space-y-1">
            <span className="text-xs font-medium text-gray-500 dark:text-zinc-400 block">
              Admin & EDLI Charges
            </span>
            <div className="text-xl font-bold text-amber-600 dark:text-amber-400">
              ₹{((ecrData?.total_edli_share || 0) + (ecrData?.admin_charges || 0)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
            <span className="text-[11px] text-gray-500 dark:text-zinc-400 block">
              Min ₹500 admin rule enforced
            </span>
          </CardContent>
        </Card>
      </div>

      {/* ── View Navigation Tabs & Wage Month Filter ────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-gray-200 dark:border-zinc-800 pb-3">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveViewTab('table')}
            className={cn(
              'px-4 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all flex items-center gap-2',
              activeViewTab === 'table'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                : 'text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white'
            )}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>ECR 11-Column Table</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveViewTab('raw')}
            className={cn(
              'px-4 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all flex items-center gap-2',
              activeViewTab === 'raw'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                : 'text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white'
            )}
          >
            <FileText className="w-4 h-4" />
            <span>Raw #|~|# Text File</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveViewTab('calendar')}
            className={cn(
              'px-4 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all flex items-center gap-2',
              activeViewTab === 'calendar'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                : 'text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white'
            )}
          >
            <Calendar className="w-4 h-4" />
            <span>12-Month Filing Calendar</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveViewTab('kyc')}
            className={cn(
              'px-4 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all flex items-center gap-2',
              activeViewTab === 'kyc'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                : 'text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white'
            )}
          >
            <UserCheck className="w-4 h-4" />
            <span>UAN & KYC Directory</span>
          </button>
        </div>

        {/* Period Selector */}
        {runs.length > 0 && (
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-gray-500 dark:text-zinc-400">Payroll Run:</span>
            <select
              value={activePeriodId}
              onChange={(e) => setSelectedPeriodId(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#1a1a1a] text-xs font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {runs.map((r) => (
                <option key={r.id} value={r.period_id || r.id}>
                  {r.period_name || r.run_number || `Run ${r.month}/${r.year}`} ({r.run_number || r.id})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* ── TAB 1: 11-Column ECR Table ──────────────────────────────────────── */}
      {activeViewTab === 'table' && (
        <Card className="border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#171717] shadow-sm overflow-hidden">
          <CardHeader className="p-5 border-b border-gray-100 dark:border-zinc-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <span>Official EPFO ECR v2.0 Formatted Schedule</span>
                <Badge variant="brand" size="sm">
                  {ecrData?.wage_month || 'Current Month'}
                </Badge>
              </CardTitle>
              <CardDescription className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
                Exact 11 columns matching EPFO Unified Portal specification. Non-Contributing Period (NCP) is tracked per LOP days.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleCopyRawEcr}>
                <Copy className="w-3.5 h-3.5 mr-1.5" />
                Copy Raw ECR
              </Button>
              <Button variant="primary" size="sm" onClick={handleDownloadEcrTxt} className="bg-indigo-600 hover:bg-indigo-500 text-white">
                <Download className="w-3.5 h-3.5 mr-1.5" />
                Download .txt File
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {isLoadingEcr ? (
              <div className="p-12 text-center text-xs text-gray-500 flex flex-col items-center gap-2">
                <RefreshCw className="w-6 h-6 animate-spin text-indigo-500" />
                <span>Computing EPFO ECR v2.0 contribution breakdown...</span>
              </div>
            ) : !ecrData || ecrData.records.length === 0 ? (
              <div className="p-12 text-center text-xs text-gray-500">
                <FileSpreadsheet className="w-8 h-8 text-gray-400 mx-auto mb-2 opacity-50" />
                <span>No processed payslip records found for this period. Process payroll first to generate ECR.</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-zinc-800/50 border-b border-gray-200 dark:border-zinc-800 text-gray-500 dark:text-zinc-400">
                      <th className="px-3.5 py-3 font-semibold">#</th>
                      <th className="px-3.5 py-3 font-semibold">1. UAN</th>
                      <th className="px-3.5 py-3 font-semibold">2. Member Name</th>
                      <th className="px-3.5 py-3 font-semibold text-right">3. Gross</th>
                      <th className="px-3.5 py-3 font-semibold text-right">4. EPF Wages</th>
                      <th className="px-3.5 py-3 font-semibold text-right">5. EPS Wages</th>
                      <th className="px-3.5 py-3 font-semibold text-right">6. EDLI Wages</th>
                      <th className="px-3.5 py-3 font-semibold text-right text-blue-600 dark:text-blue-400">7. EE Remitted (12%)</th>
                      <th className="px-3.5 py-3 font-semibold text-right text-purple-600 dark:text-purple-400">8. EPS Remitted (8.33%)</th>
                      <th className="px-3.5 py-3 font-semibold text-right text-emerald-600 dark:text-emerald-400">9. ER Diff (3.67%)</th>
                      <th className="px-3.5 py-3 font-semibold text-center text-amber-600 dark:text-amber-400">10. NCP Days</th>
                      <th className="px-3.5 py-3 font-semibold text-right">11. Refund</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-zinc-800/60 font-mono">
                    {ecrData.records.map((rec, idx) => (
                      <tr key={rec.uan || idx} className="hover:bg-gray-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                        <td className="px-3.5 py-2.5 text-gray-400 font-sans">{idx + 1}</td>
                        <td className="px-3.5 py-2.5 font-semibold text-gray-900 dark:text-white">
                          {rec.uan ? (
                            <span>{rec.uan}</span>
                          ) : (
                            <span className="text-rose-500 font-sans text-[11px] flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" /> MISSING
                            </span>
                          )}
                        </td>
                        <td className="px-3.5 py-2.5 font-sans font-medium text-gray-900 dark:text-zinc-200 uppercase">
                          {rec.member_name}
                        </td>
                        <td className="px-3.5 py-2.5 text-right text-gray-700 dark:text-zinc-300">
                          {rec.gross_wages.toLocaleString('en-IN')}
                        </td>
                        <td className="px-3.5 py-2.5 text-right font-semibold text-gray-900 dark:text-white">
                          {rec.epf_wages.toLocaleString('en-IN')}
                        </td>
                        <td className="px-3.5 py-2.5 text-right text-gray-700 dark:text-zinc-300">
                          {rec.eps_wages.toLocaleString('en-IN')}
                        </td>
                        <td className="px-3.5 py-2.5 text-right text-gray-700 dark:text-zinc-300">
                          {rec.edli_wages.toLocaleString('en-IN')}
                        </td>
                        <td className="px-3.5 py-2.5 text-right font-bold text-blue-600 dark:text-blue-400">
                          {rec.ee_remitted.toLocaleString('en-IN')}
                        </td>
                        <td className="px-3.5 py-2.5 text-right font-bold text-purple-600 dark:text-purple-400">
                          {rec.eps_remitted.toLocaleString('en-IN')}
                        </td>
                        <td className="px-3.5 py-2.5 text-right font-bold text-emerald-600 dark:text-emerald-400">
                          {rec.er_diff_remitted.toLocaleString('en-IN')}
                        </td>
                        <td className="px-3.5 py-2.5 text-center font-bold text-amber-600 dark:text-amber-400">
                          {rec.ncp_days}
                        </td>
                        <td className="px-3.5 py-2.5 text-right text-gray-400">
                          {rec.refund_advances}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  {/* Total Summary Footer */}
                  <tfoot className="bg-gray-50/80 dark:bg-zinc-800/80 border-t-2 border-gray-300 dark:border-zinc-700 font-mono font-bold text-xs">
                    <tr>
                      <td colSpan={3} className="px-3.5 py-3 font-sans text-gray-900 dark:text-white">
                        TOTAL CONTRIBUTION SUMMARY ({ecrData.records.length} Employees)
                      </td>
                      <td className="px-3.5 py-3 text-right">₹{ecrData.total_gross.toLocaleString('en-IN')}</td>
                      <td className="px-3.5 py-3 text-right">₹{ecrData.total_epf_wages.toLocaleString('en-IN')}</td>
                      <td className="px-3.5 py-3 text-right">₹{ecrData.total_eps_wages.toLocaleString('en-IN')}</td>
                      <td className="px-3.5 py-3 text-right">—</td>
                      <td className="px-3.5 py-3 text-right text-blue-600 dark:text-blue-400">
                        ₹{ecrData.total_ee_share.toLocaleString('en-IN')}
                      </td>
                      <td className="px-3.5 py-3 text-right text-purple-600 dark:text-purple-400">
                        ₹{ecrData.total_eps_share.toLocaleString('en-IN')}
                      </td>
                      <td className="px-3.5 py-3 text-right text-emerald-600 dark:text-emerald-400">
                        ₹{ecrData.total_er_diff_share.toLocaleString('en-IN')}
                      </td>
                      <td colSpan={2} className="px-3.5 py-3 text-right font-sans text-[11px] text-gray-500">
                        Admin: ₹{ecrData.admin_charges}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* ── TAB 2: Raw #|~|# Text Delimiter File Preview ────────────────────── */}
      {activeViewTab === 'raw' && (
        <Card className="border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#171717] shadow-sm">
          <CardHeader className="p-5 border-b border-gray-100 dark:border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <span>Official #|~|# Formatted Text File Preview</span>
                <span className="text-xs px-2 py-0.5 rounded bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 font-mono">
                  {ecrData?.filename || 'EPFO_ECR.txt'}
                </span>
              </CardTitle>
              <CardDescription className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
                Standard EPFO Unified Portal text structure. Delimiter is exactly 5 characters: <code className="text-indigo-500 font-bold">#|~|#</code>.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleCopyRawEcr}>
                <Copy className="w-3.5 h-3.5 mr-1.5" />
                Copy Content
              </Button>
              <Button variant="primary" size="sm" onClick={handleDownloadEcrTxt} className="bg-indigo-600 hover:bg-indigo-500 text-white">
                <Download className="w-3.5 h-3.5 mr-1.5" />
                Download .txt File
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-5">
            <div className="rounded-xl bg-slate-950 p-4 text-emerald-400 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800 shadow-inner max-h-96">
              {ecrData?.ecr_text ? (
                ecrData.ecr_text.split('\n').map((line, idx) => (
                  <div key={idx} className="whitespace-pre hover:bg-slate-900/50 py-0.5">
                    {line}
                  </div>
                ))
              ) : (
                <span className="text-slate-500">No raw text generated yet.</span>
              )}
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-gray-500 dark:text-zinc-400">
              <span>Lines: {ecrData?.record_count || 0} Records</span>
              <span>Encoding: UTF-8 Plaintext (Unix LF)</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── TAB 3: 12-Month Statutory Filing Calendar Grid ──────────────────── */}
      {activeViewTab === 'calendar' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <span>12-Month EPFO Statutory Filing Calendar ({currentYear})</span>
                <Badge variant="brand" size="sm">Due: 15th of Succeeding Month</Badge>
              </h2>
              <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
                Tracks PF remittance deadlines. Late payment triggers Section 7Q (12% p.a.) interest and Section 14B graded penal damages.
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => refetchCalendar()}>
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
              Refresh Statuses
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {calendarItems.map((item) => {
              const isOverdue = item.is_overdue;
              const hasChallan = Boolean(item.trrn_number);

              let badgeVariant: 'slate' | 'success' | 'warning' | 'danger' | 'brand' = 'slate';
              let badgeLabel = String(item.status);

              if (item.status === 'FILED_ON_TIME') {
                badgeVariant = 'success';
                badgeLabel = 'Filed On Time';
              } else if (item.status === 'OVERDUE') {
                badgeVariant = 'danger';
                badgeLabel = `Overdue (${item.overdue_days}d)`;
              } else if (item.status === 'CHALLAN_UPLOADED') {
                badgeVariant = 'warning';
                badgeLabel = 'Challan Recorded';
              } else if (item.status === 'ECR_GENERATED') {
                badgeVariant = 'brand';
                badgeLabel = 'ECR Generated';
              } else if (item.status === 'FILED_LATE') {
                badgeVariant = 'warning';
                badgeLabel = 'Filed Late';
              } else {
                badgeVariant = 'slate';
                badgeLabel = 'Pending Filing';
              }

              return (
                <Card
                  key={item.id}
                  className={cn(
                    'border transition-all duration-200 bg-white dark:bg-[#171717]',
                    isOverdue
                      ? 'border-rose-300 dark:border-rose-800 shadow-sm shadow-rose-500/10'
                      : item.status === 'FILED_ON_TIME'
                      ? 'border-emerald-300 dark:border-emerald-800/60'
                      : 'border-gray-200 dark:border-zinc-800'
                  )}
                >
                  <CardContent className="p-4 space-y-3">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-gray-900 dark:text-white">
                        {item.wage_month_label}
                      </span>
                      <Badge variant={badgeVariant} size="sm">
                        {badgeLabel}
                      </Badge>
                    </div>

                    {/* Due Date Indicator */}
                    <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-zinc-400">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      <span>Due: <strong className="text-gray-900 dark:text-white">{item.due_date}</strong></span>
                    </div>

                    {/* Financial Summary */}
                    <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-zinc-800/50 space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 dark:text-zinc-400">Remittance:</span>
                        <span className="font-bold text-gray-900 dark:text-white font-mono">
                          ₹{item.total_amount ? item.total_amount.toLocaleString('en-IN') : '—'}
                        </span>
                      </div>
                      {item.trrn_number && (
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-gray-500">TRRN:</span>
                          <span className="font-mono text-indigo-600 dark:text-indigo-400 font-semibold">{item.trrn_number}</span>
                        </div>
                      )}
                      {item.payment_date && (
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-gray-500">Paid On:</span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-medium">{item.payment_date}</span>
                        </div>
                      )}
                    </div>

                    {/* Section 7Q & 14B Overdue Penal Damage Warning */}
                    {isOverdue && (
                      <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 text-[11px] space-y-1 text-rose-800 dark:text-rose-300">
                        <div className="flex items-center gap-1 font-semibold">
                          <AlertTriangle className="w-3 h-3 text-rose-600" />
                          <span>Statutory Non-Compliance Alert</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Sec 7Q Interest (12% p.a.):</span>
                          <strong className="font-mono">₹{item.interest_7q_amount.toLocaleString('en-IN')}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Sec 14B Damages ({item.damages_14b_rate_pct}%):</span>
                          <strong className="font-mono">₹{item.damages_14b_amount.toLocaleString('en-IN')}</strong>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 pt-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenChallanModal(item)}
                        className="w-full text-xs h-8"
                      >
                        {hasChallan ? 'Update Challan' : 'Record Challan'}
                      </Button>
                      {item.challan_file_url && (
                        <a
                          href={item.challan_file_url}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg border border-gray-200 dark:border-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-600 dark:text-zinc-300"
                          title="View Uploaded Challan"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* ── TAB 4: UAN & KYC Directory ─────────────────────────────────────── */}
      {activeViewTab === 'kyc' && (
        <Card className="border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#171717] shadow-sm">
          <CardHeader className="p-5 border-b border-gray-100 dark:border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <span>Employee UAN & Statutory KYC Verification</span>
                <Badge variant="brand" size="sm">
                  {uanAudit?.total_active_employees || 0} Active Employees
                </Badge>
              </CardTitle>
              <CardDescription className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
                Audit 12-digit numeric UAN format, PF opt-in/opt-out eligibility, ₹15k statutory ceiling toggle, and international worker status.
              </CardDescription>
            </div>

            {/* Search filter */}
            <div className="w-full sm:w-64">
              <Input
                type="text"
                placeholder="Search name, code, UAN..."
                value={searchEmployeeQuery}
                onChange={(e) => setSearchEmployeeQuery(e.target.value)}
                className="h-8 text-xs"
              />
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {isLoadingAudit ? (
              <div className="p-12 text-center text-xs text-gray-500 flex flex-col items-center gap-2">
                <RefreshCw className="w-6 h-6 animate-spin text-indigo-500" />
                <span>Auditing active employee UAN records...</span>
              </div>
            ) : filteredAuditEmployees.length === 0 ? (
              <div className="p-12 text-center text-xs text-gray-500">
                <span>No employees match the search filter.</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-zinc-800/50 border-b border-gray-200 dark:border-zinc-800 text-gray-500 dark:text-zinc-400">
                      <th className="px-4 py-3 font-semibold">Employee</th>
                      <th className="px-4 py-3 font-semibold">12-Digit UAN</th>
                      <th className="px-4 py-3 font-semibold text-center">PF Eligible</th>
                      <th className="px-4 py-3 font-semibold text-center">Wage Ceiling</th>
                      <th className="px-4 py-3 font-semibold text-center">Int'l Worker</th>
                      <th className="px-4 py-3 font-semibold text-right">Basic Wage</th>
                      <th className="px-4 py-3 font-semibold text-center">Status</th>
                      <th className="px-4 py-3 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-zinc-800/60">
                    {filteredAuditEmployees.map((emp) => (
                      <tr key={emp.employee_id} className="hover:bg-gray-50/50 dark:hover:bg-zinc-800/30">
                        <td className="px-4 py-3">
                          <span className="font-semibold text-gray-900 dark:text-white block">{emp.name}</span>
                          <span className="text-[11px] text-gray-400 font-mono">{emp.employee_code}</span>
                        </td>
                        <td className="px-4 py-3 font-mono font-medium">
                          {emp.uan_number ? (
                            <span className={emp.is_valid ? 'text-gray-900 dark:text-white' : 'text-rose-500'}>
                              {emp.uan_number}
                            </span>
                          ) : (
                            <span className="text-gray-400 italic">Not Assigned</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {emp.is_pf_eligible ? (
                            <Badge variant="success" size="sm">Opted In</Badge>
                          ) : (
                            <Badge variant="slate" size="sm">Opted Out</Badge>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {emp.pf_wage_ceiling_applicable ? (
                            <Badge variant="brand" size="sm">₹15k Ceiling</Badge>
                          ) : (
                            <Badge variant="slate" size="sm">Full Basic</Badge>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {emp.is_international_worker ? (
                            <Badge variant="warning" size="sm">Yes (No Ceiling)</Badge>
                          ) : (
                            <span className="text-gray-400">No</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right font-mono">
                          ₹{emp.basic_salary.toLocaleString('en-IN')}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {emp.is_valid ? (
                            <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Valid
                            </span>
                          ) : !emp.uan_number ? (
                            <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold text-[11px]">
                              <AlertTriangle className="w-3.5 h-3.5" /> Missing
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-rose-600 dark:text-rose-400 font-semibold text-[11px]">
                              <AlertTriangle className="w-3.5 h-3.5" /> Invalid Format
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Button variant="ghost" size="sm" onClick={() => handleEditEmployeeKyc(emp)} className="text-xs">
                            Edit KYC
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* ── MODAL 1: Record Challan & Upload Receipts ──────────────────────── */}
      {isChallanModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-200 dark:border-zinc-800 max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-zinc-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 flex items-center justify-center">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">Record EPFO Challan / TRRN</h3>
                  <p className="text-xs text-gray-500 dark:text-zinc-400">
                    {selectedCalendarMonth?.wage_month_label || 'Statutory Remittance'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsChallanModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitChallan} className="space-y-4 text-xs">
              <div>
                <Label className="text-xs font-semibold">TRRN (Temporary Return Reference Number) *</Label>
                <Input
                  type="text"
                  required
                  placeholder="e.g. 1012305012345"
                  value={challanForm.trrnNumber}
                  onChange={(e) => setChallanForm({ ...challanForm, trrnNumber: e.target.value })}
                  className="mt-1 font-mono"
                />
                <span className="text-[10px] text-gray-400 block mt-0.5">
                  The official 13-digit TRRN received from the EPFO Unified Employer Portal.
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-semibold">Challan Generation Date</Label>
                  <Input
                    type="date"
                    value={challanForm.challanGenerationDate || ''}
                    onChange={(e) => setChallanForm({ ...challanForm, challanGenerationDate: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold">Bank Payment Date</Label>
                  <Input
                    type="date"
                    value={challanForm.paymentDate || ''}
                    onChange={(e) => setChallanForm({ ...challanForm, paymentDate: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-semibold">Bank UTR / Reference No.</Label>
                  <Input
                    type="text"
                    placeholder="e.g. HDFC202605151234"
                    value={challanForm.utrNumber || ''}
                    onChange={(e) => setChallanForm({ ...challanForm, utrNumber: e.target.value })}
                    className="mt-1 font-mono"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold">Total Paid Amount (₹)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="₹ 0.00"
                    value={challanForm.totalAmount || ''}
                    onChange={(e) => setChallanForm({ ...challanForm, totalAmount: parseFloat(e.target.value) || 0 })}
                    className="mt-1 font-mono"
                  />
                </div>
              </div>

              {/* Upload Dropzones */}
              <div className="space-y-3 pt-2 border-t border-gray-100 dark:border-zinc-800">
                <div>
                  <Label className="text-xs font-semibold flex items-center justify-between">
                    <span>Upload Challan PDF (Optional)</span>
                    <span className="text-[10px] text-gray-400 font-normal">PDF / JPG</span>
                  </Label>
                  <input
                    type="file"
                    accept=".pdf,image/*"
                    onChange={(e) => setSelectedChallanFile(e.target.files?.[0] || null)}
                    className="mt-1 block w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 dark:file:bg-indigo-950/40 dark:file:text-indigo-300 hover:file:bg-indigo-100"
                  />
                </div>

                <div>
                  <Label className="text-xs font-semibold flex items-center justify-between">
                    <span>Upload Bank Payment Confirmation Receipt (Optional)</span>
                    <span className="text-[10px] text-gray-400 font-normal">PDF / JPG</span>
                  </Label>
                  <input
                    type="file"
                    accept=".pdf,image/*"
                    onChange={(e) => setSelectedReceiptFile(e.target.files?.[0] || null)}
                    className="mt-1 block w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 dark:file:bg-emerald-950/40 dark:file:text-emerald-300 hover:file:bg-emerald-100"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-gray-100 dark:border-zinc-800">
                <Button variant="ghost" size="sm" type="button" onClick={() => setIsChallanModalOpen(false)}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  type="submit"
                  disabled={isRecordingChallan || isUploadingReceipt}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white"
                >
                  {isRecordingChallan || isUploadingReceipt ? 'Recording...' : 'Confirm & Save Remittance'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL 2: Inline Employee KYC & PF Settings Editor ───────────────── */}
      {isKycModalOpen && editingEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-200 dark:border-zinc-800 max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-zinc-800">
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white">Edit PF & UAN Profile</h3>
                <p className="text-xs text-gray-500 dark:text-zinc-400">
                  {editingEmployee.name} ({editingEmployee.employee_code})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsKycModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveKyc} className="space-y-4 text-xs">
              <div>
                <Label className="text-xs font-semibold">12-Digit EPFO UAN</Label>
                <Input
                  type="text"
                  maxLength={12}
                  placeholder="101234567890"
                  value={kycUan}
                  onChange={(e) => setKycUan(e.target.value.replace(/\D/g, ''))}
                  className="mt-1 font-mono tracking-wider"
                />
                <span className="text-[10px] text-gray-400 block mt-0.5">
                  Must be exactly 12 numeric digits or left empty if pending allotment.
                </span>
              </div>

              {/* Toggles */}
              <div className="space-y-3 pt-2 border-t border-gray-100 dark:border-zinc-800">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-xs font-semibold block">PF Opt-In Eligibility</Label>
                    <span className="text-[11px] text-gray-400 block">
                      Enable mandatory 12% deduction & employer contribution
                    </span>
                  </div>
                  <Switch checked={kycOptIn} onCheckedChange={setKycOptIn} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-xs font-semibold block">₹15,000 Statutory Wage Ceiling</Label>
                    <span className="text-[11px] text-gray-400 block">
                      Caps PF wages at ₹15k (disabling computes on full basic)
                    </span>
                  </div>
                  <Switch checked={kycCeiling} onCheckedChange={setKycCeiling} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-xs font-semibold block">International Worker Flag</Label>
                    <span className="text-[11px] text-gray-400 block">
                      Under Indian law, international workers have NO ₹15,000 ceiling
                    </span>
                  </div>
                  <Switch checked={kycIntl} onCheckedChange={setKycIntl} />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-gray-100 dark:border-zinc-800">
                <Button variant="ghost" size="sm" type="button" onClick={() => setIsKycModalOpen(false)}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  type="submit"
                  disabled={isUpdatingPf}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white"
                >
                  {isUpdatingPf ? 'Saving...' : 'Save & Verify'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PfComplianceCenter;
