import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Clock,
  Laptop,
  Building,
  CreditCard,
  FileCheck,
  DollarSign,
  Star,
  ThumbsUp,
  ThumbsDown,
  Check,
} from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import { Input } from '@/shared/ui/Input';
import { useToast } from '@/shared/ui/Toast';
import {
  useSubmitClearanceSignoffMutation,
  useSubmitExitInterviewMutation,
  useSettleFnFMutation,
} from '../api/exitsApi';
import type {
  ExitCase,
  ClearanceDepartment,
  ClearanceChecklistItem,
} from '../types/exit.types';

interface ExitDetailSheetProps {
  exitCase: ExitCase | null;
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'overview' | 'clearance' | 'interview' | 'settlement';

export const ExitDetailSheet: React.FC<ExitDetailSheetProps> = ({
  exitCase,
  isOpen,
  onClose,
}) => {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Mutations
  const [submitClearance, { isLoading: isSubmittingClearance }] = useSubmitClearanceSignoffMutation();
  const [submitInterview, { isLoading: isSubmittingInterview }] = useSubmitExitInterviewMutation();
  const [settleFnF, { isLoading: isSubmittingFnF }] = useSettleFnFMutation();

  // Local state for Department Clearance action
  const [selectedDept, setSelectedDept] = useState<ClearanceDepartment | null>(null);
  const [deptRemarks, setDeptRemarks] = useState('');
  const [activeChecklist, setActiveChecklist] = useState<Record<string, boolean>>({});

  // Local state for Exit Interview Form
  const [interviewReason, setInterviewReason] = useState('');
  const [overallRating, setOverallRating] = useState(4);
  const [managementRating, setManagementRating] = useState(4);
  const [cultureRating, setCultureRating] = useState(4);
  const [wouldRecommend, setWouldRecommend] = useState(true);
  const [interviewComments, setInterviewComments] = useState('');
  const [interviewSuggestions, setInterviewSuggestions] = useState('');

  // Local state for FnF Settlement Form
  const [basicPay, setBasicPay] = useState(3500);
  const [leaveEncashment, setLeaveEncashment] = useState(650);
  const [bonusGratuity, setBonusGratuity] = useState(1200);
  const [deductions, setDeductions] = useState(150);
  const [paymentRef, setPaymentRef] = useState('');
  const [fnfRemarks, setFnfRemarks] = useState('');

  if (!isOpen || !exitCase) return null;

  const defaultDepartmentChecklists: Record<ClearanceDepartment, string[]> = {
    IT: [
      'Laptop / Workstation returned & inspected',
      'Corporate email & Slack accounts suspended',
      'VPN, GitHub & AWS credentials revoked',
      'Security tokens & OTP authenticators wiped',
    ],
    HR: [
      'Employee ID badge & building pass returned',
      'Medical insurance cancellation processed',
      'Non-disclosure & non-compete agreements acknowledged',
      'Work experience & relieving letter drafted',
    ],
    FINANCE: [
      'Corporate credit card returned & cancelled',
      'All employee expense claims settled & verified',
      'Travel advances cleared',
      'Outstanding salary advance / loans adjusted',
    ],
    ADMIN: [
      'Desk locker keys handed over',
      'Office parking permit surrendered',
      'Company library books & physical assets returned',
      'Uniform / safety equipment surrendered',
    ],
  };

  const clearances = exitCase.clearances || [];
  const clearedCount = clearances.filter((c) => c.status === 'CLEARED').length;
  const netPayable = basicPay + leaveEncashment + bonusGratuity - deductions;

  const handleOpenDeptSignoff = (dept: ClearanceDepartment) => {
    setSelectedDept(dept);
    const existing = clearances.find((c) => c.department === dept);
    setDeptRemarks(existing?.remarks || '');

    const initialChecklist: Record<string, boolean> = {};
    const defaultItems = defaultDepartmentChecklists[dept];
    defaultItems.forEach((label, idx) => {
      const match = existing?.checklist.find((it) => it.label === label);
      initialChecklist[`${dept}_${idx}`] = match ? match.completed : false;
    });
    setActiveChecklist(initialChecklist);
  };

  const handleSaveDepartmentClearance = async (status: 'CLEARED' | 'FLAGGED') => {
    if (!selectedDept) return;
    try {
      const defaultItems = defaultDepartmentChecklists[selectedDept];
      const items: ClearanceChecklistItem[] = defaultItems.map((label, idx) => ({
        id: `${selectedDept}_${idx}`,
        label,
        completed: Boolean(activeChecklist[`${selectedDept}_${idx}`]),
      }));

      await submitClearance({
        id: exitCase.id,
        department: selectedDept,
        status,
        remarks: deptRemarks.trim() || undefined,
        checklist: items,
      }).unwrap();

      toast.success(
        `${selectedDept} clearance sign-off has been marked as ${status.toLowerCase()}!`,
        'Sign-off Saved'
      );
      setSelectedDept(null);
    } catch (err: any) {
      toast.error(
        err?.data?.message || err?.data?.detail || 'Failed to submit department clearance sign-off',
        'Action Error'
      );
    }
  };

  const handleSaveInterview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!interviewReason.trim()) {
      toast.warning('Please enter the primary reason for leaving.', 'Validation Error');
      return;
    }

    try {
      await submitInterview({
        id: exitCase.id,
        primaryReason: interviewReason.trim(),
        overallRating,
        managementRating,
        cultureRating,
        wouldRecommend,
        feedbackComments: interviewComments.trim() || undefined,
        suggestions: interviewSuggestions.trim() || undefined,
      }).unwrap();

      toast.success('Exit interview submitted successfully!', 'Interview Recorded');
    } catch (err: any) {
      toast.error(
        err?.data?.message || err?.data?.detail || 'Failed to submit exit interview',
        'Submission Error'
      );
    }
  };

  const handleSaveFnF = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await settleFnF({
        id: exitCase.id,
        basicPayDues: Number(basicPay),
        leaveEncashment: Number(leaveEncashment),
        bonusGratuity: Number(bonusGratuity),
        deductions: Number(deductions),
        paymentRef: paymentRef.trim() || undefined,
        remarks: fnfRemarks.trim() || undefined,
      }).unwrap();

      toast.success(
        `FnF Settlement of $${netPayable.toFixed(2)} processed successfully!`,
        'Settlement Processed'
      );
    } catch (err: any) {
      toast.error(
        err?.data?.message || err?.data?.detail || 'Failed to process FnF settlement',
        'Settlement Error'
      );
    }
  };

  const stagesTimeline = [
    { key: 'RESIGNATION_SUBMITTED', label: 'Resignation' },
    { key: 'MANAGER_REVIEW', label: 'Manager Review' },
    { key: 'CLEARANCE_PENDING', label: 'Clearances' },
    { key: 'FNF_SETTLEMENT', label: 'FnF Settlement' },
    { key: 'COMPLETED', label: 'Completed' },
  ];

  const currentStageIndex = stagesTimeline.findIndex((s) => s.key === exitCase.stage);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in-50">
      <div
        className="w-full max-w-2xl sm:max-w-3xl bg-white dark:bg-[#171717] h-full shadow-2xl flex flex-col border-l border-gray-200 dark:border-zinc-800 animate-in slide-in-from-right duration-200 overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-gray-200 dark:border-zinc-800 bg-gray-50/75 dark:bg-[#1f1f1f]/50 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-indigo-500 p-0.5 shadow-sm">
              <div className="w-full h-full bg-white dark:bg-[#171717] rounded-[14px] flex items-center justify-center font-bold text-base text-rose-600 dark:text-rose-400">
                {exitCase.employee?.name ? exitCase.employee.name[0] : 'E'}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-gray-900 dark:text-[#ececec]">
                  {exitCase.employee?.name || 'Employee Exit Case'}
                </h2>
                <Badge variant="brand" size="sm">
                  {exitCase.stage}
                </Badge>
              </div>
              <p className="text-xs text-gray-500 dark:text-zinc-400 font-mono">
                {exitCase.caseNumber || `EXT-${exitCase.id.slice(0, 8)}`} &bull; {exitCase.employee?.department || 'Department'} &bull; LWD:{' '}
                {new Date(exitCase.expectedLastWorkingDay).toLocaleDateString()}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center px-6 border-b border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#171717] flex-shrink-0 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-brand-600 text-brand-600 dark:text-brand-400'
                : 'border-transparent text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-200'
            }`}
          >
            Overview & Timeline
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('clearance')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'clearance'
                ? 'border-brand-600 text-brand-600 dark:text-brand-400'
                : 'border-transparent text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-200'
            }`}
          >
            <span>Department Clearances</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400">
              {clearedCount}/4
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('interview')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'interview'
                ? 'border-brand-600 text-brand-600 dark:text-brand-400'
                : 'border-transparent text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-200'
            }`}
          >
            <span>Exit Interview</span>
            {exitCase.interview && (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('settlement')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'settlement'
                ? 'border-brand-600 text-brand-600 dark:text-brand-400'
                : 'border-transparent text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-200'
            }`}
          >
            <span>FnF Settlement</span>
            {exitCase.settlement?.isPaid && (
              <Badge variant="success" size="sm">
                Paid
              </Badge>
            )}
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-in fade-in-50">
              {/* Visual Workflow Timeline */}
              <div className="p-4 rounded-2xl bg-gray-50/70 dark:bg-[#212121]/60 border border-gray-200/80 dark:border-zinc-800 space-y-3">
                <span className="text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
                  Offboarding Progress
                </span>
                <div className="flex items-center justify-between relative pt-2">
                  <div className="absolute top-5 left-4 right-4 h-0.5 bg-gray-200 dark:bg-zinc-800 -z-0" />
                  {stagesTimeline.map((step, idx) => {
                    const isDone = currentStageIndex > idx || exitCase.stage === 'COMPLETED';
                    const isCurrent = currentStageIndex === idx && exitCase.stage !== 'COMPLETED';

                    return (
                      <div key={step.key} className="flex flex-col items-center relative z-10">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                            isDone
                              ? 'bg-emerald-500 text-white shadow-sm'
                              : isCurrent
                              ? 'bg-brand-600 text-white ring-4 ring-brand-100 dark:ring-brand-950/60'
                              : 'bg-gray-200 dark:bg-zinc-800 text-gray-500 dark:text-zinc-400'
                          }`}
                        >
                          {isDone ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                        </div>
                        <span className="text-[10px] font-medium text-gray-600 dark:text-zinc-400 mt-1.5 text-center max-w-[70px]">
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Case Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="p-3.5 rounded-2xl bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-zinc-800">
                  <span className="text-[11px] text-gray-400 block mb-0.5">Exit Type</span>
                  <span className="text-xs font-bold text-gray-900 dark:text-white">
                    {exitCase.exitType}
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-zinc-800">
                  <span className="text-[11px] text-gray-400 block mb-0.5">Primary Reason</span>
                  <span className="text-xs font-bold text-gray-900 dark:text-white">
                    {exitCase.reason.replace('_', ' ')}
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-zinc-800">
                  <span className="text-[11px] text-gray-400 block mb-0.5">Notice Period</span>
                  <span className="text-xs font-bold text-gray-900 dark:text-white">
                    {exitCase.noticePeriodDays} Days
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-zinc-800">
                  <span className="text-[11px] text-gray-400 block mb-0.5">Resignation Date</span>
                  <span className="text-xs font-bold text-gray-900 dark:text-white">
                    {new Date(exitCase.resignationDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-zinc-800">
                  <span className="text-[11px] text-gray-400 block mb-0.5">Expected LWD</span>
                  <span className="text-xs font-bold text-brand-600 dark:text-brand-400">
                    {new Date(exitCase.expectedLastWorkingDay).toLocaleDateString()}
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-zinc-800">
                  <span className="text-[11px] text-gray-400 block mb-0.5">System Status</span>
                  <span className="text-xs font-bold text-gray-900 dark:text-white">
                    {exitCase.isDeactivated ? 'Access Revoked' : 'Active Account'}
                  </span>
                </div>
              </div>

              {/* Handover Notes */}
              {exitCase.handoverNotes && (
                <div className="p-4 rounded-2xl bg-gray-50/70 dark:bg-[#212121]/60 border border-gray-200/80 dark:border-zinc-800 space-y-1">
                  <span className="text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
                    Handover & Knowledge Transfer Notes
                  </span>
                  <p className="text-xs text-gray-700 dark:text-zinc-300 whitespace-pre-wrap leading-relaxed">
                    {exitCase.handoverNotes}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: CLEARANCE */}
          {activeTab === 'clearance' && (
            <div className="space-y-4 animate-in fade-in-50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                    Department Clearances & Asset Return
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-zinc-400">
                    Verify departmental asset recovery, access revocation, and financial clearance.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-brand-600 dark:text-brand-400">
                    {clearedCount} of 4 Cleared
                  </span>
                </div>
              </div>

              {/* 4 Department Cards */}
              <div className="space-y-3">
                {(['IT', 'HR', 'FINANCE', 'ADMIN'] as ClearanceDepartment[]).map((dept) => {
                  const item = clearances.find((c) => c.department === dept);
                  const isCleared = item?.status === 'CLEARED';
                  const isFlagged = item?.status === 'FLAGGED';
                  const deptIcons = {
                    IT: Laptop,
                    HR: FileCheck,
                    FINANCE: CreditCard,
                    ADMIN: Building,
                  };
                  const DeptIcon = deptIcons[dept];

                  return (
                    <div
                      key={dept}
                      className="p-4 rounded-2xl bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-zinc-800 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 rounded-xl bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300">
                            <DeptIcon className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-sm font-bold text-gray-900 dark:text-white">
                              {dept} Department
                            </span>
                            {item?.signedBy && (
                              <span className="text-[11px] text-gray-400 block">
                                Cleared by {item.signedBy} on {new Date(item.signedAt || '').toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {isCleared ? (
                            <Badge variant="success" size="sm" className="flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              Cleared
                            </Badge>
                          ) : isFlagged ? (
                            <Badge variant="danger" size="sm">
                              Action Flagged
                            </Badge>
                          ) : (
                            <Badge variant="warning" size="sm" className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              Pending
                            </Badge>
                          )}

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenDeptSignoff(dept)}
                          >
                            Update
                          </Button>
                        </div>
                      </div>

                      {/* Checklist items */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-gray-100 dark:border-zinc-800">
                        {defaultDepartmentChecklists[dept].map((label, idx) => {
                          const isDone =
                            item?.checklist.find((it) => it.label === label)?.completed ?? isCleared;
                          return (
                            <div key={idx} className="flex items-center gap-2 text-xs">
                              <div
                                className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 ${
                                  isDone
                                    ? 'bg-emerald-500 text-white'
                                    : 'border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900'
                                }`}
                              >
                                {isDone && <Check className="w-3 h-3" />}
                              </div>
                              <span className={isDone ? 'text-gray-700 dark:text-zinc-300' : 'text-gray-400'}>
                                {label}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      {item?.remarks && (
                        <div className="text-[11px] p-2 rounded-lg bg-gray-50 dark:bg-zinc-900 text-gray-600 dark:text-zinc-400">
                          <strong>Remarks:</strong> {item.remarks}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Department Sign-Off Mini Modal */}
              {selectedDept && (
                <div className="p-4 rounded-2xl bg-brand-50/60 dark:bg-brand-950/30 border border-brand-200 dark:border-brand-900/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-brand-900 dark:text-brand-300 uppercase tracking-wider">
                      Updating {selectedDept} Department Sign-Off
                    </h4>
                    <button
                      type="button"
                      onClick={() => setSelectedDept(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    {defaultDepartmentChecklists[selectedDept].map((label, idx) => {
                      const key = `${selectedDept}_${idx}`;
                      return (
                        <label key={key} className="flex items-center gap-2 text-xs cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={Boolean(activeChecklist[key])}
                            onChange={(e) =>
                              setActiveChecklist((prev) => ({ ...prev, [key]: e.target.checked }))
                            }
                            className="rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                          />
                          <span className="text-gray-800 dark:text-zinc-200">{label}</span>
                        </label>
                      );
                    })}
                  </div>

                  <div>
                    <input
                      type="text"
                      placeholder="Add clearance remarks or handover tracking notes..."
                      value={deptRemarks}
                      onChange={(e) => setDeptRemarks(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-[#ececec] focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSaveDepartmentClearance('FLAGGED')}
                      disabled={isSubmittingClearance}
                    >
                      Flag Issues
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleSaveDepartmentClearance('CLEARED')}
                      disabled={isSubmittingClearance}
                      isLoading={isSubmittingClearance}
                      leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                    >
                      Sign Off Cleared
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: INTERVIEW */}
          {activeTab === 'interview' && (
            <div className="space-y-4 animate-in fade-in-50">
              {exitCase.interview ? (
                /* Already Recorded Interview */
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/30 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-sm font-bold text-emerald-900 dark:text-emerald-300">
                        Exit Interview Completed
                      </span>
                    </div>
                    {exitCase.interview.completedAt && (
                      <span className="text-xs text-emerald-700 dark:text-emerald-400">
                        Recorded {new Date(exitCase.interview.completedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-2xl bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-zinc-800 text-center">
                      <span className="text-xs text-gray-400 block mb-1">Overall Experience</span>
                      <div className="flex items-center justify-center gap-1 text-amber-500 font-bold text-lg">
                        <Star className="w-4 h-4 fill-amber-500" />
                        <span>{exitCase.interview.overallRating} / 5</span>
                      </div>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-zinc-800 text-center">
                      <span className="text-xs text-gray-400 block mb-1">Management Rating</span>
                      <div className="flex items-center justify-center gap-1 text-amber-500 font-bold text-lg">
                        <Star className="w-4 h-4 fill-amber-500" />
                        <span>{exitCase.interview.managementRating} / 5</span>
                      </div>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-zinc-800 text-center">
                      <span className="text-xs text-gray-400 block mb-1">Work Culture</span>
                      <div className="flex items-center justify-center gap-1 text-amber-500 font-bold text-lg">
                        <Star className="w-4 h-4 fill-amber-500" />
                        <span>{exitCase.interview.cultureRating} / 5</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-zinc-800 space-y-2">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Primary Departure Reason
                    </span>
                    <p className="text-xs text-gray-900 dark:text-white font-medium">
                      {exitCase.interview.primaryReason}
                    </p>
                    {exitCase.interview.feedbackComments && (
                      <div className="pt-2 border-t border-gray-100 dark:border-zinc-800">
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          Feedback & Suggestions
                        </span>
                        <p className="text-xs text-gray-700 dark:text-zinc-300 mt-1">
                          {exitCase.interview.feedbackComments}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* New Interview Submission Form */
                <form onSubmit={handleSaveInterview} className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                      Conduct Exit Interview
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-zinc-400">
                      Capture candid feedback to improve employee retention and organizational culture.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
                      Primary Reason for Leaving *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Higher compensation, remote flexibility, career progression..."
                      value={interviewReason}
                      onChange={(e) => setInterviewReason(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-[#212121] text-gray-900 dark:text-[#ececec] focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                    />
                  </div>

                  {/* Ratings */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">
                        Overall Rating (1-5)
                      </label>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setOverallRating(star)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              overallRating >= star
                                ? 'text-amber-500'
                                : 'text-gray-300 dark:text-zinc-700'
                            }`}
                          >
                            <Star className="w-5 h-5 fill-current" />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">
                        Management Rating (1-5)
                      </label>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setManagementRating(star)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              managementRating >= star
                                ? 'text-amber-500'
                                : 'text-gray-300 dark:text-zinc-700'
                            }`}
                          >
                            <Star className="w-5 h-5 fill-current" />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">
                        Culture Rating (1-5)
                      </label>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setCultureRating(star)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              cultureRating >= star
                                ? 'text-amber-500'
                                : 'text-gray-300 dark:text-zinc-700'
                            }`}
                          >
                            <Star className="w-5 h-5 fill-current" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Would Recommend */}
                  <div className="p-3 rounded-2xl bg-gray-50 dark:bg-[#212121] border border-gray-200/80 dark:border-zinc-800 flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-700 dark:text-zinc-300">
                      Would you recommend this company as a good place to work?
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setWouldRecommend(true)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                          wouldRecommend
                            ? 'bg-emerald-600 text-white'
                            : 'bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400'
                        }`}
                      >
                        <ThumbsUp className="w-3.5 h-3.5" /> Yes
                      </button>
                      <button
                        type="button"
                        onClick={() => setWouldRecommend(false)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                          !wouldRecommend
                            ? 'bg-rose-600 text-white'
                            : 'bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400'
                        }`}
                      >
                        <ThumbsDown className="w-3.5 h-3.5" /> No
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
                      Feedback Comments & Improvements
                    </label>
                    <textarea
                      rows={2}
                      value={interviewComments}
                      onChange={(e) => setInterviewComments(e.target.value)}
                      placeholder="What could we have done better to support you?"
                      className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-[#212121] text-gray-900 dark:text-[#ececec] focus:outline-none focus:ring-2 focus:ring-brand-500/20 resize-none"
                    />
                  </div>

                  <div className="flex justify-end pt-2">
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={isSubmittingInterview}
                      isLoading={isSubmittingInterview}
                      leftIcon={<CheckCircle2 className="w-4 h-4" />}
                    >
                      Save Exit Interview
                    </Button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 4: SETTLEMENT (FnF) */}
          {activeTab === 'settlement' && (
            <div className="space-y-4 animate-in fade-in-50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                    Full & Final (FnF) Financial Settlement
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-zinc-400">
                    Compute final salary dues, encashment, gratuity, and process payout.
                  </p>
                </div>
                {exitCase.settlement?.isPaid && (
                  <Badge variant="success" size="sm">
                    Settled & Paid
                  </Badge>
                )}
              </div>

              <form onSubmit={handleSaveFnF} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="Basic Pay Dues"
                    type="number"
                    step="0.01"
                    value={basicPay}
                    onChange={(e) => setBasicPay(Number(e.target.value))}
                    leftIcon={<DollarSign className="w-3.5 h-3.5 text-gray-400" />}
                  />
                  <Input
                    label="Leave Encashment"
                    type="number"
                    step="0.01"
                    value={leaveEncashment}
                    onChange={(e) => setLeaveEncashment(Number(e.target.value))}
                    leftIcon={<DollarSign className="w-3.5 h-3.5 text-gray-400" />}
                  />
                  <Input
                    label="Bonus & Gratuity"
                    type="number"
                    step="0.01"
                    value={bonusGratuity}
                    onChange={(e) => setBonusGratuity(Number(e.target.value))}
                    leftIcon={<DollarSign className="w-3.5 h-3.5 text-gray-400" />}
                  />
                  <Input
                    label="Deductions (Short notice, loans)"
                    type="number"
                    step="0.01"
                    value={deductions}
                    onChange={(e) => setDeductions(Number(e.target.value))}
                    leftIcon={<DollarSign className="w-3.5 h-3.5 text-gray-400" />}
                  />
                </div>

                {/* Net Payable Card */}
                <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/20 border border-purple-200/60 dark:border-purple-900/30 flex items-center justify-between">
                  <div>
                    <span className="text-xs uppercase font-semibold text-purple-900 dark:text-purple-300">
                      Net Payable to Employee
                    </span>
                    <p className="text-[11px] text-gray-500 dark:text-zinc-400">
                      Includes salary, leaves, gratuity minus recoveries
                    </p>
                  </div>
                  <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                    ${netPayable.toFixed(2)}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="Payment Transaction Ref"
                    placeholder="e.g. TXN-99882310"
                    value={paymentRef}
                    onChange={(e) => setPaymentRef(e.target.value)}
                  />
                  <Input
                    label="Settlement Remarks"
                    placeholder="e.g. Processed via direct ACH"
                    value={fnfRemarks}
                    onChange={(e) => setFnfRemarks(e.target.value)}
                  />
                </div>

                {!exitCase.settlement?.isPaid && (
                  <div className="flex justify-end pt-2">
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={isSubmittingFnF || netPayable <= 0}
                      isLoading={isSubmittingFnF}
                      leftIcon={<CreditCard className="w-4 h-4" />}
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      Process & Close FnF Settlement
                    </Button>
                  </div>
                )}
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
